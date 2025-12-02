import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  if (process.env.NODE_ENV === "development") {
    // Running in dev mode with environment variables
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    // Running in production - use default credentials
    admin.initializeApp();
  }
}

/**
 * HTTP function to check admin claims for a user token.
 * Verifies the user's authentication token and returns admin status.
 */
export const checkAdminClaims = onRequest(async (request, response) => {
  try {
    // Check method
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token } = request.body;

    if (!token) {
      response.status(400).json({ error: "Token is required" });
      return;
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("decodedToken", decodedToken);
    response.json({
      isAdmin: decodedToken.admin || false,
      isSuperAdmin: decodedToken.superadmin || false,
      uid: decodedToken.uid,
    });
  } catch (error) {
    logger.error("Error verifying token or checking claims:", error);
    response.status(401).json({ error: "Failed to verify token" });
    return;
  }
});

/**
 * HTTP function to add a user to a team by email.
 * Requires admin privileges and adds the user to the specified team.
 */
export const addUserToTeam = onRequest(async (request, response) => {
  try {
    // Check method
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { email, teamId, position, token } = request.body;

    if (!email || !teamId || !position || !token) {
      response.status(400).json({ error: "Email, teamId, position, and token are required" });
      return;
    }

    // Verify the user is authenticated and has admin privileges
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken.admin) {
      response.status(403).json({ error: "Admin access required" });
      return;
    }

    // Find user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    if (!userRecord) {
      response.status(404).json({ error: "User not found" });
      return;
    }

    const userId = userRecord.uid;

    // Check if user document exists in Firestore
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    if (!userDoc.exists) {
      response.status(404).json({ error: "User profile not found" });
      return;
    }

    // Get the team document
    const teamDoc = await admin.firestore().collection("teams").doc(teamId).get();
    if (!teamDoc.exists) {
      response.status(404).json({ error: "Team not found" });
      return;
    }

    const teamData = teamDoc.data();
    const members = teamData?.members || [];

    // Check if user is already a member
    const existingMemberIndex = members.findIndex((m: any) => m.userId === userId);

    if (existingMemberIndex >= 0) {
      // Update existing member position
      members[existingMemberIndex] = { userId, position };
    } else {
      // Add new member
      members.push({ userId, position });
    }

    // Update the team document
    await admin.firestore().collection("teams").doc(teamId).update({
      members: members,
      updatedAt: Timestamp.now(),
    });

    response.json({ success: true, message: "User added to team successfully" });
  } catch (error) {
    logger.error("Error adding user to team:", error);
    if (error instanceof Error && error.message.includes("auth/user-not-found")) {
      response.status(404).json({ error: "User with this email not found" });
    } else {
      response.status(500).json({ error: "Failed to add user to team" });
    }
    return;
  }
});
