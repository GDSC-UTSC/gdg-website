import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

if (process.env.NODE_ENV === "development") {
  try {
    const firestoreEmulatorHost =
      process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || "localhost";
    const firestoreEmulatorPort = parseInt(
      process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || "8080"
    );
    const authEmulatorUrl =
      process.env.NEXT_PUBLIC_AUTH_EMULATOR_URL || "http://localhost:9099";
    const storageEmulatorPort = parseInt(
      process.env.NEXT_PUBLIC_STORAGE_EMULATOR_PORT || "9199"
    );
    connectFirestoreEmulator(db, firestoreEmulatorHost, firestoreEmulatorPort);
    connectAuthEmulator(auth, authEmulatorUrl);
    connectStorageEmulator(storage, firestoreEmulatorHost, storageEmulatorPort);
  } catch (error) {
    console.error("Emulator connection failed:", error);
  }
}
