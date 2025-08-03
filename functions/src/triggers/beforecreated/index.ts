import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { beforeUserCreated, HttpsError } from "firebase-functions/v2/identity";

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