import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";

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
      if (error.message.includes("Admin privileges required")) {
        response.status(403).json({ error: error.message });
      } else if (error.message.includes("Token is required")) {
        response.status(400).json({ error: error.message });
      } else {
        response.status(401).json({ error: "Failed to verify token" });
      }
    } else {
      response.status(500).json({ error: "Internal server error" });
    }
  }
});

/**
 * Grant admin privileges to a user by userId
 */
export const grantAdminByUserId = onRequest(async (request, response) => {
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
        role: "admin",
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
    logger.error("Error in grantAdminByUserId:", error);

    if (error instanceof Error) {
      if (error.message.includes("Super admin privileges required")) {
        response.status(403).json({ error: error.message });
      } else if (error.message.includes("Token is required")) {
        response.status(400).json({ error: error.message });
      } else if (error.message.includes("auth/user-not-found")) {
        response.status(404).json({ error: "User not found" });
      } else {
        response.status(401).json({ error: "Failed to verify token" });
      }
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
        role: "superadmin",
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

    if (error instanceof Error) {
      if (error.message.includes("Super admin privileges required")) {
        response.status(403).json({ error: error.message });
      } else if (error.message.includes("Token is required")) {
        response.status(400).json({ error: error.message });
      } else if (error.message.includes("auth/user-not-found")) {
        response.status(404).json({ error: "User not found" });
      } else {
        response.status(401).json({ error: "Failed to verify token" });
      }
    } else {
      response.status(500).json({ error: "Internal server error" });
    }
  }
});

/**
 * Remove admin privileges from a user by userId
 */
export const removeAdminByUserId = onRequest(async (request, response) => {
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
        role: "member",
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
    logger.error("Error in removeAdminByUserId:", error);

    if (error instanceof Error) {
      if (error.message.includes("Super admin privileges required")) {
        response.status(403).json({ error: error.message });
      } else if (error.message.includes("Token is required")) {
        response.status(400).json({ error: error.message });
      } else if (error.message.includes("auth/user-not-found")) {
        response.status(404).json({ error: "User not found" });
      } else {
        response.status(401).json({ error: "Failed to verify token" });
      }
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

    const { token, email } = request.body;

    if (!email) {
      response.status(400).json({ error: "Email is required" });
      return;
    }

    const decodedToken = await validateToken(token);
    requireSuperAdmin(decodedToken);

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
        role: "admin",
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
    logger.error("Error in grantAdminByEmail:", error);

    if (error instanceof Error) {
      if (error.message.includes("Super admin privileges required")) {
        response.status(403).json({ error: error.message });
      } else if (error.message.includes("Token is required")) {
        response.status(400).json({ error: error.message });
      } else if (error.message.includes("auth/user-not-found")) {
        response.status(404).json({ error: "User not found with that email" });
      } else {
        response.status(401).json({ error: "Failed to verify token" });
      }
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

    const { token, email } = request.body;

    if (!email) {
      response.status(400).json({ error: "Email is required" });
      return;
    }

    const decodedToken = await validateToken(token);
    requireSuperAdmin(decodedToken);

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
        role: "member",
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
    logger.error("Error in removeAdminByEmail:", error);

    if (error instanceof Error) {
      if (error.message.includes("Super admin privileges required")) {
        response.status(403).json({ error: error.message });
      } else if (error.message.includes("Token is required")) {
        response.status(400).json({ error: error.message });
      } else if (error.message.includes("auth/user-not-found")) {
        response.status(404).json({ error: "User not found with that email" });
      } else {
        response.status(401).json({ error: "Failed to verify token" });
      }
    } else {
      response.status(500).json({ error: "Internal server error" });
    }
  }
});

/**
 * Add a user to a team
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
        error: "User ID, team name, and position are required"
      });
      return;
    }

    const decodedToken = await validateToken(token);
    requireAdmin(decodedToken);

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

    if (error instanceof Error) {
      if (error.message.includes("Admin privileges required")) {
        response.status(403).json({ error: error.message });
      } else if (error.message.includes("Token is required")) {
        response.status(400).json({ error: error.message });
      } else {
        response.status(401).json({ error: "Failed to verify token" });
      }
    } else {
      response.status(500).json({ error: "Internal server error" });
    }
  }
});
