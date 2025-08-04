/**
 * Cloud Functions for GDG Website
 *
 * This file re-exports all Cloud Functions organized in their respective files:
 * - requests.ts: HTTP Cloud Functions (onRequest)
 * - triggers.ts: Event-triggered Cloud Functions (onDocumentWritten, beforeUserCreated)
 */
import * as admin from "firebase-admin";

// Initialize the Firebase Admin SDK to interact with Firebase services.
if (!admin.apps.length) {
  admin.initializeApp();
}

// HTTP Request Functions (Admin Operations)
export {
  checkAdminClaims,
  getUsers,
  grantAdmin,
  grantSuperAdmin,
  removeAdmin,
  addUserToTeam
} from "./requests";

// Trigger Functions (Event-driven)
export {
  beforecreated,
  createApplication,
  createRegistration,
  createCollaboration
} from "./triggers";
