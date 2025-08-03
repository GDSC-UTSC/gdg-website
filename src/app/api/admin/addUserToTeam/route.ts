import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const headerObj = await headers();
    const authIdToken = headerObj.get("Authorization")?.split("Bearer ")[1];

    if (!authIdToken) {
      return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
    }

    const { email, teamName, position } = await request.json();

    if (!email || !teamName || !position) {
      return NextResponse.json({ error: "Email, team name, and position are required" }, { status: 400 });
    }

    const response = await fetch(`${process.env.FIREBASE_CLOUD_FUNCTIONS}/addUserToTeam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: authIdToken,
        email,
        teamName,
        position,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in addUserToTeam API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
