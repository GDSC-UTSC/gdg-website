import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";

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