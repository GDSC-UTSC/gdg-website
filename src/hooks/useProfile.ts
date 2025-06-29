"use client";

import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { deleteProfileImage, uploadProfileImage } from "@/lib/storage";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useProfile(user: User | null) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const { toast } = useToast();

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

  const handleFileSelect = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    try {
      const downloadURL = await uploadProfileImage(user.uid, file);
      setProfileImageUrl(downloadURL);

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
      const urlParts = profileImageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1].split("?")[0];

      await deleteProfileImage(user.uid, fileName);

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

  return {
    profileImageUrl,
    isUploading,
    isLoadingProfile,
    handleFileSelect,
    handleRemoveProfileImage,
  };
}