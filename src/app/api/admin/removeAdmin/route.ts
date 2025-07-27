import { auth, db } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Get user by email from Firebase Auth
    const userRecord = await auth.getUserByEmail(email);
    const userId = userRecord.uid;

    // Remove custom claims for admin access
    await auth.setCustomUserClaims(userId, { admin: false });

    // Update user document in Firestore
    const userRef = db.collection("users").doc(userId);

    // Check if user document exists
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      
      // Prevent removing super admin privileges
      if (userData?.role === "superadmin") {
        return NextResponse.json(
          { error: "Cannot remove super admin privileges" },
          { status: 403 }
        );
      }

      // Update existing user document
      await userRef.update({
        role: "member",
        updatedAt: FieldValue.serverTimestamp()
      });
    } else {
      // Create user document if it doesn't exist
      await userRef.set({
        id: userId,
        role: "member",
        email: email,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
    }

    return NextResponse.json({
      success: true,
      message: "Admin privileges removed successfully",
      userId: userId
    });

  } catch (error) {
    console.error("Error in removeAdmin API:", error);

    if (error instanceof Error && error.message.includes("auth/user-not-found")) {
      return NextResponse.json(
        { error: "User with this email not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
