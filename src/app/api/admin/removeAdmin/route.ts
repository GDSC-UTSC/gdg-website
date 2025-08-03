import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const headerObj = await headers();
    const authIdToken = headerObj.get("Authorization")?.split("Bearer ")[1];

    if (!authIdToken) {
      return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Forward request to Cloud Function
    const response = await fetch(`${process.env.FIREBASE_CLOUD_FUNCTIONS}/removeAdmin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: authIdToken,
        email
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in removeAdmin API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
