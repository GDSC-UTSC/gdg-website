import { initializeServerApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ isSuperAdmin: false }, { status: 400 });
    }

    const serverApp = initializeServerApp(firebaseConfig, {
      authIdToken: token,
    });
    const serverAuth = getAuth(serverApp);
    if (process.env.NODE_ENV === "development") {
      connectAuthEmulator(serverAuth, `http://localhost:${process.env.NEXT_PUBLIC_FIREBASE_AUTH_PORT}`);
    }
    await serverAuth.authStateReady();

    const user = serverAuth.currentUser;

    if (!user) {
      return NextResponse.json({ isSuperAdmin: false }, { status: 401 });
    }

    const idTokenResult = await user.getIdTokenResult();
    const claims = idTokenResult.claims;

    const isSuperAdmin = claims.superadmin === true;

    return NextResponse.json({ isSuperAdmin });
  } catch (error) {
    console.error("Super admin verification error:", error);
    return NextResponse.json({ isSuperAdmin: false }, { status: 500 });
  }
}