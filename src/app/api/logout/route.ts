import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete({
    name: "session",
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
