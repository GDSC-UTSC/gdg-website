import { cookies } from "next/headers"; // Edge-compatible cookie API
import { auth } from "@/lib/firebase/admin"; // Node runtime only
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);

    // Create a session cookie (maxAge in ms)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(token, { expiresIn });

    // Set cookie (HTTP-only, secure)
    (await
      // Set cookie (HTTP-only, secure)
      cookies()).set({
      name: "session",
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    return NextResponse.json({ email: decodedToken.email, uid: decodedToken.uid });
  } catch (err: any) {
    console.error("Session creation error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
