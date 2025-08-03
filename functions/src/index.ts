/**
 * Import the necessary modules for Firebase Cloud Functions (V1) and the Admin SDK.
 */
import * as admin from "firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { onRequest } from "firebase-functions/v2/https";
import { beforeUserCreated, HttpsError } from "firebase-functions/v2/identity";


// Initialize the Firebase Admin SDK to interact with Firebase services.

if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * A 1st generation Cloud Function that triggers when a new user is created
 * in Firebase Authentication. It creates a corresponding user document in Firestore.
 *
 * @param {admin.auth.UserRecord} user The user record from Firebase Authentication.
 * @param {functions.EventContext} context The event metadata.
 */
export const beforecreated = beforeUserCreated(async (event) => {
  const user = event.data;
  if (!user) {
    logger.error("No user data found");
    throw new HttpsError("invalid-argument", "User could not be created");
  }
  const userDocument = {
    publicName: user.displayName || "",
    updatedAt: Timestamp.now(),
    profileImageUrl: "",
    bio: "",
    linkedin: "",
    github: "",
    role: "member",
  };

  try {
    // Write the new document to the 'users' collection using the user's UID as the document ID.
    await admin.firestore().collection("users").doc(user.uid).set(userDocument);

    logger.info(`Successfully created user document for UID: ${user.uid}`);
  } catch (error) {
    logger.error(`Error creating user document for UID: ${user.uid}`, {
      uid: user.uid,
      error: error, // Log the full error object for better debugging
    });
  }
});

export const createApplication = onDocumentWritten(
  "positions/{positionId}/applications/{applicationId}",
  async (event: any) => {
    const positionId = event.params.positionId;
    const userId = event.params.applicationId;

    try {
      await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .update({
          "associations.applications": FieldValue.arrayUnion(positionId),
        });
    } catch (error) {
      logger.error(`Error creating application for user ${userId}:`, error);
    }
  }
);
export const createRegistration = onDocumentWritten(
  "events/{eventId}/registrations/{registrationId}",
  async (event: any) => {
    const eventId = event.params.eventId;
    const userId = event.params.registrationId;

    try {
      await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .update({
          "associations.registrations": FieldValue.arrayUnion(eventId),
        });
    } catch (error) {
      logger.error(`Error creating registration for user ${userId}:`, error);
    }
  }
);

export const createCollaboration = onDocumentWritten(
  "projects/{projectId}/collaborations/{collaborationId}",
  async (event: any) => {
    const projectId = event.params.projectId;
    const userId = event.params.collaborationId;

    try {
      await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .update({
          "associations.collaborations": FieldValue.arrayUnion(projectId),
        });
    } catch (error) {
      logger.error(`Error creating collaboration for user ${userId}:`, error);
    }
  }
);

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

export const getUsers = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token, query } = request.body;

    if (!token) {
      response.status(400).json({ error: "Token is required" });
      return;
    }

    // Verify token and check admin permissions
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken.admin && !decodedToken.superadmin) {
      response.status(403).json({ error: "Admin privileges required" });
      return;
    }

    // Get all users from Firestore
    const users = await admin.firestore().collection("users").get();

    // Filter users by publicName if query provided
    const filteredUsers = users.docs.filter((doc) => {
      const data = doc.data();
      const mergedData : any = { ...data, id: doc.id };

      if (query) {
        return mergedData.publicName?.toLowerCase().includes(query.toLowerCase());
      }
      return true;
    });

    const result = filteredUsers.map((doc) => ({ id: doc.id, ...doc.data() }));
    response.json(result);
  } catch (error) {
    logger.error("Error in getUsers:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

export const grantAdmin = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token, email } = request.body;

    if (!token || !email) {
      response.status(400).json({ error: "Token and email are required" });
      return;
    }

    // Verify token and check superadmin permissions
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken.superadmin) {
      response.status(403).json({ error: "Super admin privileges required" });
      return;
    }

    // Get user by email from Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(email);
    const userId = userRecord.uid;

    // Set custom claims for admin access
    await admin.auth().setCustomUserClaims(userId, { admin: true });

    // Update user document in Firestore
    const userRef = admin.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      await userRef.update({
        role: "admin",
        updatedAt: FieldValue.serverTimestamp()
      });
    } else {
      await userRef.set({
        id: userId,
        role: "admin",
        email: email,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
    }

    response.json({
      success: true,
      message: "Admin privileges granted successfully",
      userId: userId
    });
  } catch (error) {
    logger.error("Error in grantAdmin:", error);

    if (error instanceof Error && error.message.includes("auth/user-not-found")) {
      response.status(404).json({ error: "User with this email not found" });
      return;
    }

    response.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error"
    });
  }
});

export const grantSuperAdmin = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token, email } = request.body;

    if (!token || !email) {
      response.status(400).json({ error: "Token and email are required" });
      return;
    }

    // Verify token and check superadmin permissions
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken.superadmin) {
      response.status(403).json({ error: "Super admin privileges required" });
      return;
    }

    // Get user by email from Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(email);
    const userId = userRecord.uid;

    // Set custom claims for super admin access
    await admin.auth().setCustomUserClaims(userId, { admin: true, superadmin: true });

    // Update user document in Firestore
    const userRef = admin.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      await userRef.update({
        role: "superadmin",
        updatedAt: FieldValue.serverTimestamp()
      });
    } else {
      await userRef.set({
        id: userId,
        role: "superadmin",
        email: email,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
    }

    response.json({
      success: true,
      message: "Super admin privileges granted successfully",
      userId: userId
    });
  } catch (error) {
    logger.error("Error in grantSuperAdmin:", error);

    if (error instanceof Error && error.message.includes("auth/user-not-found")) {
      response.status(404).json({ error: "User with this email not found" });
      return;
    }

    response.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error"
    });
  }
});

export const removeAdmin = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token, email } = request.body;

    if (!token || !email) {
      response.status(400).json({ error: "Token and email are required" });
      return;
    }

    // Verify token and check superadmin permissions
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken.superadmin) {
      response.status(403).json({ error: "Super admin privileges required" });
      return;
    }

    // Get user by email from Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(email);
    const userId = userRecord.uid;

    // Get user document to check current role
    const userRef = admin.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();

      // Prevent removing super admin privileges
      if (userData?.role === "superadmin") {
        response.status(403).json({ error: "Cannot remove super admin privileges" });
        return;
      }

      // Update existing user document
      await userRef.update({
        role: "member",
        updatedAt: FieldValue.serverTimestamp()
      });
    } else {
      // Create user document if it doesn't exist
      await userRef.set({
        id: userId,
        role: "member",
        email: email,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
    }

    // Remove custom claims for admin access
    await admin.auth().setCustomUserClaims(userId, { admin: false });

    response.json({
      success: true,
      message: "Admin privileges removed successfully",
      userId: userId
    });
  } catch (error) {
    logger.error("Error in removeAdmin:", error);

    if (error instanceof Error && error.message.includes("auth/user-not-found")) {
      response.status(404).json({ error: "User with this email not found" });
      return;
    }

    response.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error"
    });
  }
});

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
