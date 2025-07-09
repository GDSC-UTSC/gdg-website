"use client";

import { User } from "firebase/auth";

interface ProfileInfoProps {
  user: User;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Profile Information</h3>
      <div className="mt-4 space-y-2">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Display Name:</strong> {user.displayName || "Not set"}
        </p>
        <p>
          <strong>User ID:</strong> {user.uid}
        </p>
      </div>
    </div>
  );
}