import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";

if (!admin.apps.length) {
  if (process.env.NODE_ENV === "development") {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
    });
  } else {
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
