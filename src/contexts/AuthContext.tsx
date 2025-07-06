"use client";

import { USER_ROLES, UserData } from "@/app/types/userdata";
import { auth } from "@/lib/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        console.log(
          "AuthProvider: Auth state changed",
          user ? "User logged in" : "No user"
        );

        if (user) {
          // Check if user exists in Firestore, if not create them
          try {
            console.log(
              "AuthProvider: Checking if user exists in Firestore for:",
              user.uid
            );
            const existingUserData = await UserData.read(user.uid);
            if (!existingUserData) {
              console.log(
                "AuthProvider: User not found in Firestore, creating new record"
              );
              // Create new user record
              const newUserData = new UserData({
                id: user.uid,
                email: user.email || "",
                publicName: user.displayName || undefined,
                profileImageBase64: undefined, // Don't use photoURL from Firebase Auth
                bio: undefined,
                linkedin: undefined,
                github: undefined,
                role: USER_ROLES.MEMBER, // Default new users to member role
              });
              console.log(
                "AuthProvider: UserData object created, attempting to save:",
                newUserData
              );
              await newUserData.create();
              console.log(
                "AuthProvider: Successfully created new user record for:",
                user.uid
              );
              setUserData(newUserData);
            } else {
              console.log(
                "AuthProvider: User already exists in Firestore:",
                user.uid
              );
              setUserData(existingUserData);
            }
          } catch (error) {
            console.error("AuthProvider: Error handling user data:", error);
            console.error("AuthProvider: Error details:", {
              errorMessage:
                error instanceof Error ? error.message : "Unknown error",
              errorStack:
                error instanceof Error ? error.stack : "No stack trace",
              userId: user.uid,
              userEmail: user.email,
            });
          }
        }

        setUser(user);
        console.log("AuthProvider: User state updated", user);

        // Clear userData when user is null (logged out)
        if (!user) {
          setUserData(null);
        }

        setLoading(false);
      },
      (error) => {
        console.error("AuthProvider: Auth state change error", error);
        setLoading(false);
      }
    );

    // Set a timeout to ensure loading doesn't stay true forever
    const timeout = setTimeout(() => {
      console.log("AuthProvider: Timeout reached, setting loading to false");
      setLoading(false);
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
