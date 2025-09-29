import { db } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { positionID: string; userID: string } }) {
  const { positionID, userID } = await params;

  const application = await db.collection("positions").doc(positionID).collection("applications").doc(userID).get();

  if (!application.exists) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const resume = application.data()?.questions?.Resume;

  return NextResponse.json({ resume });
}
