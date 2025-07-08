"use client";

import { User } from "firebase/auth";

interface ProfileImageProps {
  user: User;
  profileImageUrl: string | null;
  isLoading: boolean;
}

export function ProfileImage({
  user,
  profileImageUrl,
  isLoading,
}: ProfileImageProps) {
  if (isLoading) {
    return (
      <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (profileImageUrl) {
    return (
      <img
        src={profileImageUrl}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
      />
    );
  }

  return (
    <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
      <span className="text-gray-500 text-2xl font-semibold">
        {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
      </span>
    </div>
  );
}
