"use client";

import { Position } from "@/app/types/positions";
import { UserData } from "@/app/types/userdata";
import PositionCard from "@/components/positions/PositionCard";
import PageTitle from "@/components/ui/PageTitle";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountPositionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingPositions, setIsLoadingPositions] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const loadUserPositions = async () => {
      if (!user) return;

      try {
        setIsLoadingPositions(true);

        // Load user data to get associations
        const userData = await UserData.read(user.uid);
        if (userData) {
          setUserData(userData);

          // Get user's position applications from associations
          const applicationIds = userData.associations?.applications || [];
          console.log("applicationIds", applicationIds);

          if (applicationIds.length > 0) {
            // Load all positions and filter by user's applications
            const allPositions = await Position.readAll();
            const userPositions = allPositions.filter(position =>
              applicationIds.includes(position.id)
            );

            // Sort positions by date (newest first)
            const sortedPositions = userPositions.sort((a, b) => {
              const dateA = a.updatedAt?.toDate?.() || new Date(0);
              const dateB = b.updatedAt?.toDate?.() || new Date(0);
              return dateB.getTime() - dateA.getTime();
            });

            setPositions(sortedPositions);
          }
        }
      } catch (error) {
        console.error("Error loading user positions:", error);
      } finally {
        setIsLoadingPositions(false);
      }
    };

    if (user) {
      loadUserPositions();
    }
  }, [user]);

  if (loading || isLoadingPositions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <PageTitle
          title="My Applications"
          description="Position applications you've submitted within the GDG team."
        />
        <p className="text-muted-foreground flex items-center justify-center gap-2 mb-6 text-sm">
          NOTE: It might take a few minutes for your applications to appear here. Try hard refreshing the page (Ctrl + Shift + R) if it doesn't appear.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {positions.map((position, index) => (
            <motion.div
              key={position.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <PositionCard position={position} />
            </motion.div>
          ))}
        </div>

        {positions.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't applied for any positions yet. Check out our open positions to join the team!
            </p>
            <motion.button
              onClick={() => router.push("/positions")}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Positions
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
