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

console.log("Firebase initializing...");
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
console.log("Firebase initialized", {
  auth: !!auth,
  db: !!db,
  storage: !!storage,
});

if (process.env.NODE_ENV === "development") {
  console.log("Development mode: connecting to emulators");
  try {
    connectFirestoreEmulator(db, "localhost", 8080);
    console.log("Firestore emulator connected");
  } catch (error) {
    console.log("Firestore emulator already connected or failed:", error);
  }

  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    console.log("Auth emulator connected");
  } catch (error) {
    console.log("Auth emulator already connected or failed:", error);
  }

  try {
    connectStorageEmulator(storage, "localhost", 9199);
    console.log("Storage emulator connected");
  } catch (error) {
    console.log("Storage emulator already connected or failed:", error);
  }
}
