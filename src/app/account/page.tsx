"use client";

import { UserData } from "@/app/types/userdata";
import { AccountDetails } from "@/components/account/AccountDetails";
import { ProfileImage } from "@/components/account/ProfileImage";
import { ProfileImageUpload } from "@/components/account/ProfileImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        setIsLoadingProfile(true);
        const userData = await UserData.read(user.uid);
        if (userData) {
          setUserData(userData);
          setProfileImageUrl(userData.profileImageUrl || null);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user, toast]);

  const uploadProfileImage = async (file: File) => {
    if (!user || !userData) return;

    setIsUploading(true);
    try {
      const downloadURL = await userData.uploadProfileImage(file);
      setProfileImageUrl(downloadURL);

      toast({
        title: "Success",
        description: "Profile image uploaded successfully!",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUserDataUpdate = (updatedUserData: UserData) => {
    setUserData(updatedUserData);
  };

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
              <AccountDetails
                userData={userData}
                onUpdate={handleUserDataUpdate}
              />

              <ProfileImageUpload
                onUpload={uploadProfileImage}
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
