"use client";

import { Position } from "@/app/types/positions";
import { Application } from "@/app/types/positions/applications";
import ApplicationForm from "@/components/positions/ApplicationForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { CheckCircle } from 'lucide-react';
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface PositionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PositionDetailPage({ params }: PositionDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const [hasApplied, setHasApplied] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const fetchedPosition = await Position.read(id);
        setPosition(fetchedPosition);

        if (user?.email) {
          // check if this user has already applied
          const applied = await Application.hasApplied(id, user.email);
          setHasApplied(applied);

          if (applied) {
            console.log("✅ You already applied to this position.");
          } else {
            console.log("🆕 You have not applied yet.");
          }
        }
      } catch (error) {
        console.error("Error fetching position:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosition();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading position...</p>
            <p className="text-muted-foreground">
              Please make sure you are on a supported browser (not linkedin or instagram browser)
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Position Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The position you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/positions")}>Back to Positions</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/positions")} className="mb-4">
            ← Back to Positions
          </Button>
        </div>

        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            {position.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${position.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : position.isDraft
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                }`}
            >
              {position.status.charAt(0).toUpperCase() + position.status.slice(1)}
            </span>

            {position.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Position Description</h2>
            <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">
              <p className="whitespace-pre-wrap text-muted-foreground">{position.description}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{position.createdAt.toDate().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{position.updatedAt.toDate().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Application Questions</p>
                  <p className="font-medium">{position.questions?.length || 0} question(s)</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Already Applied Banner */}
        {hasApplied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                      You Already Applied
                    </h3>
                    <p className="text-green-700 dark:text-green-300">
                      You have already submitted an application for this position. You may reapply to update your application.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <ApplicationForm position={position} />
        </motion.div>
      </div>
    </div>
  );
}
