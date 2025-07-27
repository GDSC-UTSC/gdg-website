import { db } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    const users = await db.collection("users").get();

    const filteredUsers = users.docs.filter((doc) => {
      const data = doc.data();
      return data.publicName.toLowerCase().includes(query.toLowerCase());
    });

    return NextResponse.json(filteredUsers.map((doc) => doc.data()));
  } catch (error) {
    console.error("Error in getUsers API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
