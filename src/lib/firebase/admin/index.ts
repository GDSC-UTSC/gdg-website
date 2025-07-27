import admin, { ServiceAccount } from "firebase-admin";
const serviceAccount: ServiceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")!,
};

export function getFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  return admin;
}

const firebaseAdmin = getFirebaseAdmin();
if (process.env.NODE_ENV === "development") {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:" + process.env.NEXT_PUBLIC_FIREBASE_AUTH_PORT;
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:" + process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_PORT;
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = "localhost:" + process.env.NEXT_PUBLIC_FIREBASE_STORAGE_PORT;
}
const db = firebaseAdmin.firestore();
const auth = firebaseAdmin.auth();
export { auth, db, firebaseAdmin };
