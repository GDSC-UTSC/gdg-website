import { getAuthenticatedUser } from "@/lib/firebase/server/index";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.redirect(new URL("/account/login", request.url));
  }

  try {
    const token = await user.getIdToken();

    const response = await fetch(new URL(process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL! + "/checkAdminClaims"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    const { isAdmin, isSuperAdmin } = data;

    if (!isAdmin && !isSuperAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Middleware admin check error:", error);
    return NextResponse.redirect(new URL("/account/login", request.url));
  }

  return NextResponse.next();
}
