import { auth, db, firebaseAdmin } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, teamId, position, token } = await request.json();

    if (!email || !teamId || !position || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify admin token
    try {
      const decodedToken = await auth.verifyIdToken(token);
      console.log("Token verified for user:", decodedToken.uid);
    } catch (tokenError) {
      console.error("Token verification failed:", tokenError);
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 });
    }

    // Look up user by email to get their UID
    let userId;
    try {
      const userRecord = await auth.getUserByEmail(email);
      userId = userRecord.uid;
      console.log("Found user:", userId, "for email:", email);
    } catch (userError) {
      console.error("User lookup failed:", userError);
      return NextResponse.json({ error: "User not found with this email" }, { status: 404 });
    }

    // Get team and add member - using admin privileges
    const teamRef = db.collection('teams').doc(teamId);
    const teamDoc = await teamRef.get();

    if (!teamDoc.exists) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const teamData = teamDoc.data()!;
    const members = teamData.members || [];

    // Add or update member using actual userId
    const existingIndex = members.findIndex((m: any) => m.userId === userId);
    if (existingIndex >= 0) {
      members[existingIndex] = { userId, position };
    } else {
      members.push({ userId, position });
    }

    // Update team with admin privileges
    await teamRef.update({
      members,
      updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: "Team member added successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to add team member" }, { status: 500 });
  }
}