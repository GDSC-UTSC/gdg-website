"use client";

import { Position } from "@/app/types/positions";
import PageTitle from "@/components/ui/PageTitle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import ApplicationForm from "@/components/positions/ApplicationForm";
import { motion } from "framer-motion";

interface AdminPositionDetailPageProps {
  params: Promise<{ positionId: string }>;
}

export default function AdminPositionDetailPage({ params }: AdminPositionDetailPageProps) {
  const router = useRouter();
  const { positionId } = use(params);
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const fetchedPosition = await Position.read(positionId);
        setPosition(fetchedPosition);
      } catch (error) {
        console.error("Error fetching position:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosition();
  }, [positionId]);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading position...</p>
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
            <Button onClick={() => router.push("/admin/positions")}>
              Back to Admin Positions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/positions")}
            className="mb-4"
          >
            ← Back to Admin Positions
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
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                position.isActive
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : position.isDraft
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              }`}
            >
              {position.status.charAt(0).toUpperCase() + position.status.slice(1)}
            </span>

            {position.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Button
              onClick={() => router.push(`/admin/positions/${positionId}/applications`)}
              className="bg-primary hover:bg-primary/90"
            >
              View Applications
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Position Description</h2>
            <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">
              <p className="whitespace-pre-wrap text-muted-foreground">
                {position.description}
              </p>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Application Questions</h2>
            {position.questions && position.questions.length > 0 ? (
              <div className="space-y-6">
                {position.questions.map((question, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-muted/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Question {index + 1} • {question.type}
                      </span>
                      {question.required && (
                        <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="font-medium">{question.label}</p>
                    {question.options && question.options.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground mb-1">Options:</p>
                        <div className="flex flex-wrap gap-2">
                          {question.options.map((option, optionIndex) => (
                            <span
                              key={optionIndex}
                              className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No application questions configured for this position.</p>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}