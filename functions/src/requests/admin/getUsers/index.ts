import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";

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