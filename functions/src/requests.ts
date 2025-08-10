import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Middleware to validate Firebase ID token and extract claims
 */
async function validateToken(token: string) {
  if (!token) {
    throw new Error("Token is required");
  }
  return await admin.auth().verifyIdToken(token);
}

/**
 * Middleware to check if user has admin privileges
 */
function requireAdmin(decodedToken: admin.auth.DecodedIdToken) {
  if (!decodedToken.admin && !decodedToken.superadmin) {
    throw new Error("Admin privileges required");
  }
}

/**
 * Middleware to check if user has super admin privileges
 */
function requireSuperAdmin(decodedToken: admin.auth.DecodedIdToken) {
  if (!decodedToken.superadmin) {
    throw new Error("Super admin privileges required");
  }
}

/**
 * Check admin claims for a user
 */
export const checkAdminClaims = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token } = request.body;
    const decodedToken = await validateToken(token);

    response.json({
      isAdmin: decodedToken.admin || false,
      isSuperAdmin: decodedToken.superadmin || false,
      uid: decodedToken.uid,
    });
  } catch (error) {
    logger.error("Error verifying token or checking claims:", error);
    response.status(401).json({ error: "Failed to verify token" });
  }
});

/**
 * Get users from Firestore with optional search query
 */
export const getUsers = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token, query } = request.body;
    const decodedToken = await validateToken(token);
    requireAdmin(decodedToken);

    // Get all users from Firestore
    const users = await admin.firestore().collection("users").get();

    // Filter users by publicName if query provided
    const filteredUsers = users.docs.filter((doc) => {
      const data = doc.data();
      const mergedData: any = { ...data, id: doc.id };

      if (query) {
        return mergedData.publicName?.toLowerCase().includes(query.toLowerCase());
      }
      return true;
    });

    const result = filteredUsers.map((doc) => ({ id: doc.id, ...doc.data() }));
    response.json(result);
  } catch (error) {
    logger.error("Error in getUsers:", error);
    if (error instanceof Error) {
      response.status(400).json({ error: error.message });
    } else {
      response.status(500).json({ error: "Internal server error" });
    }
  }
});

/**
 * Grant super admin privileges to a user
 */
export const grantSuperAdmin = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token, userId } = request.body;

    if (!userId) {
      response.status(400).json({ error: "User ID is required" });
      return;
    }

    const decodedToken = await validateToken(token);
    requireSuperAdmin(decodedToken);

    // Set custom claims for super admin access
    await admin.auth().setCustomUserClaims(userId, { admin: true, superadmin: true });

    // Update user document in Firestore - will fail if user doesn't exist
    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.update({
      role: "superadmin",
      updatedAt: FieldValue.serverTimestamp(),
    });

    response.json({
      success: true,
      message: "Super admin privileges granted successfully",
      userId: userId,
    });
  } catch (error) {
    logger.error("Error in grantSuperAdmin:", error);

    if (error instanceof Error) {
      response.status(400).json({ error: error.message });
    } else {
      response.status(500).json({ error: "Internal server error" });
    }
  }
});

/**
 * Grant admin privileges to a user by email
 */
export const grantAdminByEmail = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token, email, userId } = request.body;

    if (!email && !userId) {
      response.status(400).json({ error: "Either email or userId is required" });
      return;
    }

    const decodedToken = await validateToken(token);
    requireSuperAdmin(decodedToken);

    // Get user by email or userId from Firebase Auth
    let userRecord;
    let finalUserId;
    if (email) {
      userRecord = await admin.auth().getUserByEmail(email);
      finalUserId = userRecord.uid;
    } else {
      userRecord = await admin.auth().getUser(userId);
      finalUserId = userId;
    }

    // Update user document in Firestore - will fail if user doesn't exist
    const userRef = admin.firestore().collection("users").doc(finalUserId);
    await userRef.update({
      role: "admin",
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Set custom claims for admin access
    await admin.auth().setCustomUserClaims(finalUserId, { admin: true });

    response.json({
      success: true,
      message: "Admin privileges granted successfully",
      userId: finalUserId,
    });
  } catch (error) {
    logger.error("Error in grantAdminByEmail:", error);

    if (error instanceof Error) {
      response.status(400).json({ error: error.message });
    } else {
      response.status(500).json({ error: "Internal server error" });
    }
  }
});

/**
 * Remove admin privileges from a user by email
 */
export const removeAdminByEmail = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token, email, userId } = request.body;

    if (!email && !userId) {
      response.status(400).json({ error: "Either email or userId is required" });
      return;
    }

    const decodedToken = await validateToken(token);
    requireSuperAdmin(decodedToken);

    // Get user by email or userId from Firebase Auth
    let userRecord;
    let finalUserId;
    if (email) {
      userRecord = await admin.auth().getUserByEmail(email);
      finalUserId = userRecord.uid;
    } else {
      userRecord = await admin.auth().getUser(userId);
      finalUserId = userId;
    }

    // Update user document - will fail if user doesn't exist
    const userRef = admin.firestore().collection("users").doc(finalUserId);
    await userRef.update({
      role: "member",
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Remove all custom claims for admin access
    await admin.auth().setCustomUserClaims(finalUserId, { admin: false, superadmin: false });

    response.json({
      success: true,
      message: "Admin privileges removed successfully",
      userId: finalUserId,
    });
  } catch (error) {
    logger.error("Error in removeAdminByEmail:", error);

    if (error instanceof Error) {
      response.status(400).json({ error: error.message });
    } else {
      response.status(500).json({ error: "Internal server error" });
    }
  }
});

/**
 * Add a user to a team
 */
/**
 * Get all teams (secure read operation)
 */
export const getTeams = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token } = request.body;

    if (!token) {
      response.status(400).json({ error: "Token is required" });
      return;
    }

    const decodedToken = await validateToken(token);
    requireAdmin(decodedToken);

    // Get all teams from Firestore
    const teamsSnapshot = await admin.firestore().collection("teams").orderBy("createdAt", "desc").get();

    // Convert to plain objects (no class methods)
    const teams = teamsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    response.json({
      success: true,
      teams: teams,
    });
  } catch (error) {
    logger.error("Error in getTeams:", error);

    if (error instanceof Error) {
      response.status(400).json({ error: error.message });
    } else {
      response.status(500).json({ error: "Internal server error" });
    }
  }
});

/**
 * Create a new team
 */
export const createTeam = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token, name, description } = request.body;

    if (!name || !description) {
      response.status(400).json({ error: "Team name and description are required" });
      return;
    }

    const decodedToken = await validateToken(token);
    requireAdmin(decodedToken);

    // Create team document
    const teamData = {
      name: name.trim(),
      description: description.trim(),
      members: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await admin.firestore().collection("teams").add(teamData);

    response.json({
      success: true,
      message: "Team created successfully",
      teamId: docRef.id,
    });
  } catch (error) {
    logger.error("Error in createTeam:", error);

    if (error instanceof Error) {
      response.status(400).json({ error: error.message });
    } else {
      response.status(500).json({ error: "Internal server error" });
    }
  }
});

/**
 * Add user to team
 */
export const addUserToTeam = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token, userId, teamName, position } = request.body;

    if (!userId || !teamName || !position) {
      response.status(400).json({
        error: "User ID, team name, and position are required",
      });
      return;
    }

    const decodedToken = await validateToken(token);
    requireAdmin(decodedToken);

    // Find the team by name
    const teamsQuery = await admin.firestore().collection("teams").where("name", "==", teamName).get();

    if (teamsQuery.empty) {
      response.status(404).json({ error: "Team not found" });
      return;
    }

    const teamDoc = teamsQuery.docs[0];
    const teamRef = admin.firestore().collection("teams").doc(teamDoc.id);

    // Add or update member (following Team class logic)
    const teamData = teamDoc.data();
    const members = teamData.members || [];
    const existingMemberIndex = members.findIndex((member: any) => member.userId === userId);

    if (existingMemberIndex >= 0) {
      // Update existing member
      members[existingMemberIndex] = { userId, position };
    } else {
      // Add new member
      members.push({ userId, position });
    }

    await teamRef.update({
      members: members,
      updatedAt: FieldValue.serverTimestamp(),
    });

    response.json({
      success: true,
      message: existingMemberIndex >= 0 ? "User position updated successfully" : "User added to team successfully",
      member: { userId, position },
    });
  } catch (error) {
    logger.error("Error in addUserToTeam:", error);

    if (error instanceof Error) {
        response.status(400).json({ error: error.message });

    } else {
      response.status(500).json({ error: "Internal server error" });
    }
  }
});

/**
 * Remove user from team
 */
export const removeUserFromTeam = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token, teamId, userId } = request.body;

    if (!teamId || !userId) {
      response.status(400).json({ error: "Team ID and User ID are required" });
      return;
    }

    const decodedToken = await validateToken(token);
    requireAdmin(decodedToken);

    // Get team document
    const teamRef = admin.firestore().collection("teams").doc(teamId);
    const teamDoc = await teamRef.get();

    if (!teamDoc.exists) {
      response.status(404).json({ error: "Team not found" });
      return;
    }

    const teamData = teamDoc.data();
    const currentMembers = teamData?.members || [];

    // Find and remove the user
    const updatedMembers = currentMembers.filter((member: any) => member.userId !== userId);

    if (currentMembers.length === updatedMembers.length) {
      response.status(404).json({ error: "User not found in this team" });
      return;
    }

    // Update team with removed member
    await teamRef.update({
      members: updatedMembers,
      updatedAt: FieldValue.serverTimestamp(),
    });

    response.json({
      success: true,
      message: "User removed from team successfully",
    });
  } catch (error) {
    logger.error("Error in removeUserFromTeam:", error);

    if (error instanceof Error) {
      response.status(400).json({ error: error.message });
    } else {
      response.status(500).json({ error: "Internal server error" });
    }
  }
});

/**
 * Delete a team
 */
export const deleteTeam = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const { token, teamId } = request.body;

    if (!teamId) {
      response.status(400).json({ error: "Team ID is required" });
      return;
    }

    const decodedToken = await validateToken(token);
    requireAdmin(decodedToken);

    // Check if team exists
    const teamRef = admin.firestore().collection("teams").doc(teamId);
    const teamDoc = await teamRef.get();

    if (!teamDoc.exists) {
      response.status(404).json({ error: "Team not found" });
      return;
    }

    // Delete the team
    await teamRef.delete();

    response.json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    logger.error("Error in deleteTeam:", error);

    if (error instanceof Error) {
      response.status(400).json({ error: error.message });
    } else {
      response.status(500).json({ error: "Internal server error" });
    }
  }
});
