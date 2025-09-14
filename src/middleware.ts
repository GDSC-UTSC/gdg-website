import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const publicRoutes = ["/events", "/projects", "/positions", "/team", "/account"];
  const pathname = request.nextUrl.pathname;

  // Skip public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/account/login", request.url));
  }

  // You can also add a simple admin check here if you store role info in the cookie
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
    "/account/:path*",
  ],
};
