import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const headerObj = await headers();
    const authIdToken = headerObj.get("Authorization")?.split("Bearer ")[1];

    if (!authIdToken) {
      return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
    }

    const { query } = await request.json();

    const response = await fetch(`${process.env.FIREBASE_CLOUD_FUNCTIONS}/getUsers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: authIdToken,
        query,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in getUsers API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
