/**
 * Import the necessary modules for Firebase Cloud Functions (V1) and the Admin SDK.
 */
import * as admin from "firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { beforeUserCreated } from "firebase-functions/v2/identity";

// Initialize the Firebase Admin SDK to interact with Firebase services.
admin.initializeApp();

/**
 * A 1st generation Cloud Function that triggers when a new user is created
 * in Firebase Authentication. It creates a corresponding user document in Firestore.
 *
 * @param {admin.auth.UserRecord} user The user record from Firebase Authentication.
 * @param {functions.EventContext} context The event metadata.
 */
export const beforecreated = beforeUserCreated(async (event) => {
  const user = event.data;
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
