import { initializeApp } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, Firestore, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, FirebaseStorage, getStorage } from "firebase/storage";

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

let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

if (process.env.NODE_ENV === "development") {
  db = getFirestore(app);
  connectFirestoreEmulator(db, "localhost", parseInt(process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_PORT || "8080"));
  auth = getAuth(app);
  connectAuthEmulator(auth, `http://localhost:${process.env.NEXT_PUBLIC_FIREBASE_AUTH_PORT}`);
  storage = getStorage(app);
  connectStorageEmulator(storage, "localhost", parseInt(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_PORT || "9199"));
} else {
  db = getFirestore(app, "website");
  auth = getAuth(app);
  storage = getStorage(app);
}

export { auth, db, storage };
