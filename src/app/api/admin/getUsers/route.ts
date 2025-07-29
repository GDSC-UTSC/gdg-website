import { db } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    const users = await db.collection("users").get();

    const filteredUsers = users.docs.filter((doc) => {
      const docId = doc.id;
      const data = doc.data();
      const mergedData: any = { ...data, id: docId };

      return mergedData.publicName?.toLowerCase().includes(query.toLowerCase());
    });

    return NextResponse.json(filteredUsers.map((doc) => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    console.error("Error in getUsers API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
