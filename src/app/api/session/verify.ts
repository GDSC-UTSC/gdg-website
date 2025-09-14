import { auth } from "@/lib/firebase/admin"; // Node runtime only
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();

  try {
    const decoded = await auth.verifyIdToken(token);
    return NextResponse.json({ email: decoded.email, uid: decoded.uid, claims: decoded });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
