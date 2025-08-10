import { getAuthenticatedUser } from "@/lib/firebase/server/index";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const publicRoutes = ["/events", "/projects", "/positions", "/team"];
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.redirect(new URL("/account/login", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/superadmin") || request.nextUrl.pathname.startsWith("/api/superadmin")) {
    try {
      const token = await user.getIdToken();

      const response = await fetch(new URL(process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL! + "/checkAdminClaims"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      const { isSuperAdmin } = data;

      if (!isSuperAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Middleware superadmin check error:", error);
      return NextResponse.redirect(new URL("/account/login", request.url));
    }
  }
  // Handle admin routes
  else if (request.nextUrl.pathname.startsWith("/admin")) {
    try {
      const token = await user.getIdToken();

      const response = await fetch(new URL(process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL! + "/checkAdminClaims"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({}),
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
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/superadmin/:path*",
    "/api/superadmin/:path*",
    "/events/:path*",
    "/projects/:path*",
    "/positions/:path*",
    "/team/:path*",
  ],
};
