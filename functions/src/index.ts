/**
 * Main entry point for Firebase Cloud Functions.
 * Re-exports functions from organized modules.
 */

// Import and re-export trigger functions
export {
  beforecreated,
  createApplication,
  createRegistration,
  createCollaboration,
} from "./triggers";

// Import and re-export request functions
export {
  checkAdminClaims,
} from "./requests";
