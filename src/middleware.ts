import { getAuthenticatedUser } from "@/lib/firebase/server/index";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Handle superadmin routes
  if (request.nextUrl.pathname.startsWith("/superadmin") || request.nextUrl.pathname.startsWith("/api/superadmin")) {
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

      const { isSuperAdmin } = await response.json();

      if (!isSuperAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Middleware superadmin check error:", error);
      return NextResponse.redirect(new URL("/account/login", request.url));
    }
  }
  // Handle admin routes
  else if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/admin")) {
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

      const { isAdmin, isSuperAdmin } = await response.json();

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
  matcher: ["/admin/:path*", "/api/admin/:path*", "/superadmin/:path*", "/api/superadmin/:path*"],
};
