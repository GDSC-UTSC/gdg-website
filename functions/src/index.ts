/**
 * Cloud Functions for GDG Website
 *
 * This file re-exports all Cloud Functions organized in their respective folders:
 * - requests/: HTTP Cloud Functions (onRequest)
 * - triggers/: Event-triggered Cloud Functions (onDocumentWritten, beforeUserCreated)
 */
import * as admin from "firebase-admin";

// Initialize the Firebase Admin SDK to interact with Firebase services.
if (!admin.apps.length) {
  admin.initializeApp();
}

// HTTP Request Functions (Admin Operations)
export { checkAdminClaims } from "./requests/admin/checkAdminClaims";
export { getUsers } from "./requests/admin/getUsers";
export { grantAdmin } from "./requests/admin/grantAdmin";
export { grantSuperAdmin } from "./requests/admin/grantSuperAdmin";
export { removeAdmin } from "./requests/admin/removeAdmin";
export { addUserToTeam } from "./requests/admin/addUserToTeam";

// Trigger Functions (Event-driven)
export { beforecreated} from "./triggers/beforecreated";
export { createApplication } from "./triggers/createApplication";
export { createRegistration } from "./triggers/createRegistration";
export { createCollaboration } from "./triggers/createCollaboration";
