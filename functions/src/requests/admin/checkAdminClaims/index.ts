import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";

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