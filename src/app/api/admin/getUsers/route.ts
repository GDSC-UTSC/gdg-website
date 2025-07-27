import { auth, db } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    const users = await db.collection("users").where("publicName", ">=", query).get();
    const filteredUsers = users.docs.map((user) => user.data());

    return NextResponse.json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsers API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
