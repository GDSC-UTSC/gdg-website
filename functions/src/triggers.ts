import * as admin from "firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { beforeUserCreated, HttpsError } from "firebase-functions/v2/identity";

/**
 * Triggered before a new user is created in Firebase Authentication.
 * Creates a corresponding user document in Firestore.
 */
export const beforecreated = beforeUserCreated(async (event) => {
  const user = event.data;
  if (!user) {
    logger.error("No user data found");
    throw new HttpsError("invalid-argument", "User could not be created");
  }

  const userDocument = {
    id : user.uid,
    email: user.email || "",
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

/**
 * Triggered when an application document is written to positions/{positionId}/applications/{applicationId}.
 * Updates the user's associations.applications array.
 */
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

/**
 * Triggered when a registration document is written to events/{eventId}/registrations/{registrationId}.
 * Updates the user's associations.registrations array.
 */
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

/**
 * Triggered when a collaboration document is written to projects/{projectId}/collaborations/{collaborationId}.
 * Updates the user's associations.collaborations array.
 */
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
