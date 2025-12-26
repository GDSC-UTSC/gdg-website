import * as admin from "firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { beforeUserCreated, HttpsError } from "firebase-functions/v2/identity";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

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

// Initialize SES Client
const sesClient = new SESClient({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY!,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY!,
  },
});

/**
 * Triggers when a registration document is created (not updated).
 * Sends a confirmation email to the registrant.
 */
export const eventRegistration = onDocumentWritten(
  "events/{eventId}/registrations/{registrationId}",
  async (event: any) => {
    // Only send email on document creation, not on updates
    if (event.data.before.exists) {
      logger.info("Registration update detected - skipping email");
      return;
    }

    const eventId = event.params.eventId;
    const userId = event.params.registrationId;

    try {
      // Get registration data
      const registrationData = event.data.after.data();
      if (!registrationData) {
        logger.error("No registration data found");
        return;
      }

      const { email, name } = registrationData;

      // Get event details
      const eventDoc = await admin.firestore().collection("events").doc(eventId).get();
      if (!eventDoc.exists) {
        logger.error(`Event ${eventId} not found`);
        return;
      }

      const eventData = eventDoc.data()!;
      const eventTitle = eventData.title || "GDG Event";
      const eventDescription = eventData.description || "";
      const eventDate = eventData.eventDate ? (eventData.eventDate as Timestamp).toDate().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }) : "TBD";
      const eventTime = eventData.startTime && eventData.endTime ? `${eventData.startTime} - ${eventData.endTime}` : "";
      const eventLocation = eventData.location || "Location TBD";

      // Create HTML email with embedded logo
      const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Registration Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="https://gdgutsc.com/gdg-logo.png" alt="GDG Logo" style="max-width: 200px; height: auto;" />
  </div>

  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; padding: 30px; margin-bottom: 20px; text-align: center;">
    <h1 style="margin: 0 0 10px 0; font-size: 28px;">Registration Confirmed!</h1>
    <p style="margin: 0; font-size: 16px; opacity: 0.9;">You're all set for ${eventTitle}</p>
  </div>

  <div style="background-color: #f9f9f9; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
    <h2 style="margin: 0 0 15px 0; color: #667eea; font-size: 20px;">Event Details</h2>

    <div style="margin-bottom: 15px;">
      <strong style="color: #555;">📅 Date:</strong><br/>
      ${eventDate}${eventTime ? `<br/>${eventTime}` : ""}
    </div>

    <div style="margin-bottom: 15px;">
      <strong style="color: #555;">📍 Location:</strong><br/>
      ${eventLocation}
    </div>

    ${eventDescription ? `
    <div style="margin-bottom: 15px;">
      <strong style="color: #555;">📝 Description:</strong><br/>
      ${eventDescription}
    </div>
    ` : ""}

    <div style="background-color: #fff; border-left: 4px solid #667eea; padding: 15px; margin-top: 20px; border-radius: 4px;">
      <strong style="color: #667eea;">Registered as:</strong><br/>
      ${name}<br/>
      ${email}
    </div>
  </div>

  <div style="background-color: #e8f0fe; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>What's next?</strong></p>
    <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
      <li>Mark your calendar for ${eventDate}</li>
      <li>You'll receive a reminder email closer to the event date</li>
      <li>Check your email for any updates about the event</li>
    </ul>
  </div>

  <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
    <p style="margin: 0 0 5px 0;">This email was sent by <strong>Google Developer Group UTSC</strong></p>
    <p style="margin: 0;">University of Toronto Scarborough</p>
    <p style="margin: 10px 0 0 0; font-size: 11px; color: #999;">
      If you have any questions, please reply to this email.
    </p>
  </div>
</body>
</html>
      `.trim();

      const plainTextBody = `
Event Registration Confirmation

You're registered for: ${eventTitle}

Event Details:
Date: ${eventDate}${eventTime ? ` ${eventTime}` : ""}
Location: ${eventLocation}
${eventDescription ? `\nDescription: ${eventDescription}` : ""}

Registered as:
${name}
${email}

What's next?
- Mark your calendar for ${eventDate}
- You'll receive a reminder email closer to the event date
- Check your email for any updates about the event

---
Google Developer Group UTSC
University of Toronto Scarborough
      `.trim();

      // Send email using SES
      const sendEmailCommand = new SendEmailCommand({
        Source: process.env.SES_FROM_EMAIL || "noreply@gdgutsc.com",
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: {
            Data: `Registration Confirmed: ${eventTitle}`,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: htmlBody,
              Charset: "UTF-8",
            },
            Text: {
              Data: plainTextBody,
              Charset: "UTF-8",
            },
          },
        },
      });

      const response = await sesClient.send(sendEmailCommand);
      logger.info(`Successfully sent registration email to ${email} for event ${eventTitle}`, {
        messageId: response.MessageId,
        eventId,
        userId,
      });

    } catch (error) {
      logger.error("Error sending registration email:", {
        error: error,
        eventId: event.params.eventId,
        userId: event.params.registrationId,
      });
    }
  }
);
