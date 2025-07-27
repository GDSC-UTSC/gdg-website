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
    const authIdToken = (await headers()).get("Authorization")?.split("Bearer ")[1];
    const serverApp = initializeServerApp(firebaseConfig, { authIdToken });
    const serverAuth = getAuth(serverApp);
    if (process.env.NODE_ENV === "development") {
      connectAuthEmulator(serverAuth, `http://localhost:${process.env.NEXT_PUBLIC_FIREBASE_AUTH_PORT}`);
    }
    await serverAuth.authStateReady();

    return serverAuth.currentUser;
  } catch (error) {
    console.error("Server auth error:", error);
    return null;
  }
}

export async function getAuthenticatedFirestore() {
  const authIdToken = (await headers()).get("Authorization")?.split("Bearer ")[1];
  const serverApp = initializeServerApp(firebaseConfig, { authIdToken });
  let serverFirestore;
  if (process.env.NODE_ENV === "development") {
    serverFirestore = getFirestore(serverApp);
    connectFirestoreEmulator(
      serverFirestore,
      "localhost",
      parseInt(process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_PORT || "8080")
    );
  } else {
    serverFirestore = getFirestore(serverApp, "website");
  }
  return serverFirestore;
}
