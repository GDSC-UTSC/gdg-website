import * as admin from "firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { beforeUserCreated, HttpsError } from "firebase-functions/v2/identity";

// Initialize Firebase Admin if not already initialized
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
 * Triggers when a new user is created in Firebase Authentication.
 * Creates a corresponding user document in Firestore.
 */
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
    await admin.firestore().collection("users").doc(user.uid).set(userDocument);
    logger.info(`Successfully created user document for UID: ${user.uid}`);
  } catch (error) {
    logger.error(`Error creating user document for UID: ${user.uid}`, {
      uid: user.uid,
      error: error,
    });
  }
});

/**
 * Triggers when an application document is written.
 * Updates the user's associations to include the position ID.
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
 * Triggers when a registration document is written.
 * Updates the user's associations to include the event ID.
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
 * Triggers when a collaboration document is written.
 * Updates the user's associations to include the project ID.
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

/**
 * Send confirmation email on submission for:
 * - positions/{positionId}/applications/{userId}
 * - events/{eventId}/registrations/{userId}
 */
export const sendSubmissionConfirmationEmail = onDocumentCreated(
  [
    "positions/{positionId}/applications/{userId}",
    "events/{eventId}/registrations/{userId}",
  ],
  async (event: any) => {
    const path = event.document?.name ?? "";
    const userId = event.params.userId;

    try {
      // Get user email from Auth
      const userRecord = await admin.auth().getUser(userId);
      const email = userRecord.email;

      if (!email) {
        logger.warn(`No email found for user ${userId}`);
        return;
      }

      // Determine which type of submission this is
      const isApplication = path.includes("/applications/");
      const isRegistration = path.includes("/registrations/");

      let subject = "";
      let html = "";
      let text = "";

      if (isApplication) {
        const positionId = event.params.positionId;

        const posSnap = await admin.firestore()
          .collection("positions")
          .doc(positionId)
          .get();

        const title = posSnap.exists
          ? (posSnap.data() as any)?.title ?? "the position"
          : "the position";

        subject = `Application received: ${title}`;
        html = applicationHtml(title);
        text = `We received your application for ${title}.`;
      }

      if (isRegistration) {
        const eventId = event.params.eventId;

        const eventSnap = await admin.firestore()
          .collection("events")
          .doc(eventId)
          .get();

        const title = eventSnap.exists
          ? (eventSnap.data() as any)?.title ?? "the event"
          : "the event";

        subject = `Registration confirmed: ${title}`;
        html = registrationHtml(title);
        text = `Thanks for registering for ${title}.`;
      }

      // Send email
      await sendSesEmail(email, subject, html, text);

      logger.info(`Sent confirmation email to ${email}`);
    } catch (error) {
      logger.error("Error sending confirmation email:", error);
    }
  }
);

