"use client";

import { UserData } from "@/app/types/userdata";
import { AccountDetails } from "@/components/account/AccountDetails";
import { ProfileCard } from "@/components/account/ProfileCard";
import { ProfileImage } from "@/components/account/ProfileImage";
import { ProfileImageUpload } from "@/components/account/ProfileImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import { Calendar, FolderOpen, Shield, Users } from "lucide-react";
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
      router.push("/account");
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
    <motion.div
      className="min-h-screen py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto max-w-2xl">
        <motion.div
          className="mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ProfileImage user={user} profileImageUrl={profileImageUrl} isLoading={isLoadingProfile} />
          </motion.div>
        </motion.div>
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => router.push("/account/events")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                My Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">View your registered events</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => router.push("/account/projects")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-green-500" />
                My Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">View your collaborative projects</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => router.push("/admin/positions")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-500" />
                Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Manage positions</p>
            </CardContent>
          </Card>

          {userData?.isAdmin && (
            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => router.push("/admin")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-500" />
                  Admin Panel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Access admin dashboard</p>
              </CardContent>
            </Card>
          )}
        </div>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.3,
                  },
                },
              }}
            >
              <motion.div
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
              >
                <AccountDetails userData={userData} onUpdate={handleUserDataUpdate} />
              </motion.div>

              <motion.div
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
              >
                <ProfileImageUpload onUpload={uploadProfileImage} isUploading={isUploading} />
              </motion.div>

              <motion.div
                className="pt-6 border-t"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleSignOut} variant="outline">
                    Sign Out
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
        Users will be able to view your profile card below:
        <ProfileCard userId={user.uid} />
      </div>
    </motion.div>
  );
}
