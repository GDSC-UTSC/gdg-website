import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";

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