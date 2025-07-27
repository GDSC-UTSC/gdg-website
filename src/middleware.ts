import { getAuthenticatedUser } from "@/lib/firebase/server/index";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/admin")) {
    try {
      const user = await getAuthenticatedUser();

      if (!user) {
        return NextResponse.redirect(new URL("/account/login", request.url));
      }

      const token = await user.getIdToken();

      const response = await fetch(new URL("/api/verify", request.url), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const { isAdmin } = await response.json();

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Middleware admin check error:", error);
      return NextResponse.redirect(new URL("/account/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
