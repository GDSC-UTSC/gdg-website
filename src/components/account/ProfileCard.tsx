"use client";

import { UserData } from "@/app/types/userdata";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { GithubIcon, LinkedinIcon, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfileCardProps {
  userId: string;
}

export function ProfileCard({ userId }: ProfileCardProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await UserData.read(userId);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-muted animate-pulse"></div>
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                {userData.profileImageBase64 ? (
                  <motion.img
                    src={userData.profileImageBase64}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  >
                    <UserIcon className="w-8 h-8 text-muted-foreground" />
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="flex-1 min-w-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold text-foreground truncate">
                {userData.publicName || "User"}
              </h3>
            </motion.div>

            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {userData.linkedin && (
                <motion.a
                  href={userData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-blue-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <LinkedinIcon className="w-5 h-5" />
                </motion.a>
              )}
              {userData.github && (
                <motion.a
                  href={userData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <GithubIcon className="w-5 h-5" />
                </motion.a>
              )}
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
