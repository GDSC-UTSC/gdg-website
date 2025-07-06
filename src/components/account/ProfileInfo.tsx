"use client";

import { UserData } from "@/app/types/userdata";

interface ProfileInfoProps {
  userData: UserData | null;
}

export function ProfileInfo({ userData }: ProfileInfoProps) {
  if (!userData) {
    return (
      <div>
        <h3 className="text-lg font-medium mb-4">Profile Information</h3>
        <p className="text-muted-foreground">Loading profile information...</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Profile Information</h3>
      <div className="mt-4 space-y-2">
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Public Name:</strong> {userData.publicName || "Not set"}
        </p>
        <p>
          <strong>User ID:</strong> {userData.id}
        </p>
      </div>
    </div>
  );
}
