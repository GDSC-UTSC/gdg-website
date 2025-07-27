"use client";

import { UserData } from "@/app/types/userdata";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Github, Linkedin, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface CompactProfileCardProps {
  userId: string;
}

export function CompactProfileCard({ userId }: CompactProfileCardProps) {
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
      <Card className="shadow-md">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-muted animate-pulse"></div>
            <div className="flex-1 min-w-0">
              <div className="h-3 bg-muted rounded animate-pulse mb-1"></div>
              <div className="h-2 bg-muted rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="shadow-md">
        <CardContent className="p-3">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                {userData?.profileImageUrl ? (
                  <motion.img
                    src={userData.profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <UserIcon className="w-6 h-6 text-muted-foreground" />
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="flex-1 min-w-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <h3 className="text-base font-semibold text-foreground truncate">
                {userData.publicName || "User"}
              </h3>
            </motion.div>

            <motion.div
              className="flex items-center space-x-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
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
                  <Linkedin className="w-4 h-4" />
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
                  <Github className="w-4 h-4" />
                </motion.a>
              )}
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}