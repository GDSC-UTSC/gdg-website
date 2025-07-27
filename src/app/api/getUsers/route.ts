import { initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";
import { UserData } from "../../types/userdata";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export async function POST(request: NextRequest) {
  const { query, token } = await request.json();

  const app = initializeServerApp(firebaseConfig, {
    authIdToken: token,
  });
  const auth = getAuth(app);

  const users = await UserData.readAll();
  const filteredUsers = users.filter((user) =>
    user.publicName?.toLowerCase().startsWith(query.toLowerCase())
  );

  return NextResponse.json(filteredUsers);
}
