import { auth, db } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, teamName, position } = await request.json();

    if (!email || !teamName || !position) {
      return NextResponse.json({ error: "Email, team name, and position are required" }, { status: 400 });
    }

    // Get user by email from Firebase Auth
    const userRecord = await auth.getUserByEmail(email);
    const userId = userRecord.uid;

    // Find the team by name
    const teamsQuery = await db.collection("teams").where("name", "==", teamName).get();

    if (teamsQuery.empty) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const teamDoc = teamsQuery.docs[0];
    const teamRef = db.collection("teams").doc(teamDoc.id);

    // Check if user is already a member
    const teamData = teamDoc.data();
    const existingMember = teamData.members?.find((member: any) => member.userId === userId);

    if (existingMember) {
      return NextResponse.json({ error: "User is already a member of this team" }, { status: 400 });
    }

    // Add user to team members array
    const newMember = {
      userId,
      position,
      addedAt: new Date().toISOString(),
    };

    await teamRef.update({
      members: FieldValue.arrayUnion(newMember),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "User added to team successfully",
      member: newMember,
    });
  } catch (error) {
    console.error("Error in addUserToTeam API:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
