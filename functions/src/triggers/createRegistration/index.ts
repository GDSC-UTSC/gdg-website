import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onDocumentWritten } from "firebase-functions/v2/firestore";

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