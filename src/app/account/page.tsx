"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { deleteProfileImage, uploadProfileImage } from "@/lib/storage";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account/login");
    }
  }, [loading, user, router]);

  // Load existing profile image
  useEffect(() => {
    const loadProfileImage = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().profileImageUrl) {
          setProfileImageUrl(userDoc.data().profileImageUrl);
        }
      } catch (error) {
        console.error("Error loading profile image:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (user) {
      loadProfileImage();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    try {
      const downloadURL = await uploadProfileImage(user.uid, file);
      setProfileImageUrl(downloadURL);

      // Store the URL in Firestore for persistence
      await setDoc(
        doc(db, "users", user.uid),
        {
          profileImageUrl: downloadURL,
          updatedAt: new Date(),
        },
        { merge: true }
      );

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

  const handleRemoveProfileImage = async () => {
    if (!user || !profileImageUrl) return;

    try {
      // Extract filename from URL
      const urlParts = profileImageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1].split("?")[0];

      // Delete from storage
      await deleteProfileImage(user.uid, fileName);

      // Remove from Firestore
      await updateDoc(doc(db, "users", user.uid), {
        profileImageUrl: null,
        updatedAt: new Date(),
      });

      setProfileImageUrl(null);

      toast({
        title: "Success",
        description: "Profile image removed successfully!",
      });
    } catch (error) {
      console.error("Error removing profile image:", error);
      toast({
        title: "Error",
        description: "Failed to remove profile image. Please try again.",
        variant: "destructive",
      });
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
        {/* Profile Image Section */}
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            {isLoadingProfile ? (
              <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
              </div>
            ) : profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-gray-500 text-2xl font-semibold">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                </span>
              </div>
            )}
          </div>
        </div>

        <Card className="border-0">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Profile Information
                </h3>
                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Display Name:</strong>{" "}
                    {user.displayName || "Not set"}
                  </p>
                  <p>
                    <strong>User ID:</strong> {user.uid}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Profile Image</h3>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  onRemove={handleRemoveProfileImage}
                  accept="image/*"
                  maxSize={5}
                  showPreview={false}
                />
                {isUploading && (
                  <p className="text-sm text-gray-500 mt-2">Uploading...</p>
                )}
              </div>

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
