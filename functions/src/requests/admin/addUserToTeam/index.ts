import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";

export const addUserToTeam = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token, email, teamName, position } = request.body;

    if (!token || !email || !teamName || !position) {
      response.status(400).json({
        error: "Token, email, team name, and position are required"
      });
      return;
    }

    // Verify token and check admin permissions
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken.admin && !decodedToken.superadmin) {
      response.status(403).json({ error: "Admin privileges required" });
      return;
    }

    // Get user by email from Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(email);
    const userId = userRecord.uid;

    // Find the team by name
    const teamsQuery = await admin.firestore()
      .collection("teams")
      .where("name", "==", teamName)
      .get();

    if (teamsQuery.empty) {
      response.status(404).json({ error: "Team not found" });
      return;
    }

    const teamDoc = teamsQuery.docs[0];
    const teamRef = admin.firestore().collection("teams").doc(teamDoc.id);

    // Check if user is already a member
    const teamData = teamDoc.data();
    const existingMember = teamData.members?.find((member: any) => member.userId === userId);

    if (existingMember) {
      response.status(400).json({ error: "User is already a member of this team" });
      return;
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

    response.json({
      success: true,
      message: "User added to team successfully",
      member: newMember,
    });
  } catch (error) {
    logger.error("Error in addUserToTeam:", error);
    response.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error"
    });
  }
});