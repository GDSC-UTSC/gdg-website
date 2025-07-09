"use client";

import { auth } from "@/lib/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log(
          "AuthProvider: Auth state changed",
          user ? "User logged in" : "No user"
        );
        setUser(user);
        console.log("AuthProvider: User state updated", user);
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
    <AuthContext.Provider value={{ user, loading }}>
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
