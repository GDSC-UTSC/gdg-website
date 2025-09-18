"use server";

import { FirebaseServerAppSettings, initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
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
    const headerObj = await headers();
    const authIdToken = headerObj.get("Authorization")?.split("Bearer ")[1];

    let appSettings: FirebaseServerAppSettings = { authIdToken };
    appSettings.releaseOnDeref = headerObj;
    const serverApp = initializeServerApp(firebaseConfig, appSettings);
    const serverAuth = getAuth(serverApp);
    await serverAuth.authStateReady();
    
    return serverAuth.currentUser;
  } catch (error) {
    console.error("Server auth error:", error);
    return null;
  }
}

export async function getAuthenticatedFirestore() {
  const authIdToken = (await headers()).get("Authorization")?.split("Bearer ")[1];
  let appSettings: FirebaseServerAppSettings = { authIdToken };
  appSettings.releaseOnDeref = headers();
  const serverApp = initializeServerApp(firebaseConfig, appSettings);
  const serverFirestore = getFirestore(serverApp);
  return serverFirestore;
}

let db: Firestore | null = null;
export async function getPublicFirestore(): Promise<Firestore> {
  if (db) {
    return db;
  }
  const serverApp = initializeServerApp(firebaseConfig, { authIdToken: undefined });
  const serverFirestore = getFirestore(serverApp);
  db = serverFirestore;
  return serverFirestore;
}
