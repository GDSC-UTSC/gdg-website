"use server";

import { initializeServerApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { headers } from "next/headers";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


export async function getAuthenticatedUser() {
  try {
    const authIdToken = (await headers())
      .get("Authorization")
      ?.split("Bearer ")[1];
    const serverApp = initializeServerApp(firebaseConfig, { authIdToken });
    const serverAuth = getAuth(serverApp);
    if (process.env.NODE_ENV === "development") {
      const authEmulatorUrl = process.env.NEXT_PUBLIC_AUTH_EMULATOR_URL || "http://localhost:9099";
      connectAuthEmulator(serverAuth, authEmulatorUrl);
    }
    await serverAuth.authStateReady();

    return serverAuth.currentUser;
  } catch (error) {
    console.error("Server auth error:", error);
    return null;
  }
}

export async function getAuthenticatedFirestore() {
  const authIdToken = (await headers())
    .get("Authorization")
    ?.split("Bearer ")[1];
  const serverApp = initializeServerApp(firebaseConfig, { authIdToken });
  const serverFirestore = getFirestore(serverApp);
  if (process.env.NODE_ENV === "development") {
    const firestoreEmulatorHost = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || "localhost";
    const firestoreEmulatorPort = parseInt(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || "8080");
    connectFirestoreEmulator(serverFirestore, firestoreEmulatorHost, firestoreEmulatorPort);
  }
  return serverFirestore;
}
