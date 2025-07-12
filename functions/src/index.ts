/**
 * Import the necessary modules for Firebase Cloud Functions (V1) and the Admin SDK.
 */
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions/v1";

// Initialize the Firebase Admin SDK to interact with Firebase services.
admin.initializeApp();

/**
 * A 1st generation Cloud Function that triggers when a new user is created
 * in Firebase Authentication. It creates a corresponding user document in Firestore.
 *
 * @param {admin.auth.UserRecord} user The user record from Firebase Authentication.
 * @param {functions.EventContext} context The event metadata.
 */
export const createUserInFirestore = functions.auth
  .user()
  .onCreate(async (user) => {
    const { uid, displayName } = user;

    logger.info(`New user created, starting document creation for UID: ${uid}`);

    // This is the data that will be stored in the new Firestore document.
    const userDocument = {
      id: uid,
      publicName: displayName || "",
      updatedAt: Timestamp.now(),
      profileImageUrl: "",
      bio: "",
      linkedin: "",
      github: "",
      role: "member" as const,
    };

    try {
      // Write the new document to the 'users' collection using the user's UID as the document ID.
      await admin.firestore().collection("users").doc(uid).set(userDocument);

      logger.info(`Successfully created user document for UID: ${uid}`);
    } catch (error) {
      logger.error(`Error creating user document for UID: ${uid}`, {
        uid: uid,
        error: error, // Log the full error object for better debugging
      });
    }
  });
