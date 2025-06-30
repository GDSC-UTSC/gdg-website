"use client";

import { ProfileImage } from "@/components/account/ProfileImage";
import { ProfileImageUpload } from "@/components/account/ProfileImageUpload";
import { ProfileInfo } from "@/components/account/ProfileInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const {
    profileImageUrl,
    isUploading,
    isLoadingProfile,
    handleFileSelect,
    handleRemoveProfileImage,
  } = useProfile(user);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account/login");
    }
  }, [loading, user, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            <ProfileImage
              user={user}
              profileImageUrl={profileImageUrl}
              isLoading={isLoadingProfile}
            />
          </div>
        </div>

        <Card className="border-0">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <ProfileInfo user={user} />

              <ProfileImageUpload
                onFileSelect={handleFileSelect}
                onRemove={handleRemoveProfileImage}
                isUploading={isUploading}
              />

              <div className="pt-6 border-t">
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
