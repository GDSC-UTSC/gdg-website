"use client";

import { Event } from "@/app/types/events";
import PageTitle from "@/components/ui/PageTitle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface AdminEventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export default function AdminEventDetailPage({ params }: AdminEventDetailPageProps) {
  const router = useRouter();
  const { eventId } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const fetchedEvent = await Event.read(eventId);
        setEvent(fetchedEvent);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading event...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/admin/events")}>
              Back to Admin Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "ongoing":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "closed":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/events")}
            className="mb-4"
          >
            ← Back to Admin Events
          </Button>
        </div>

        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            {event.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>

            {event.tags?.map((tag, index) => (
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
              onClick={() => router.push(`/admin/events/${eventId}/registrations`)}
              className="bg-primary hover:bg-primary/90"
            >
              View Registrations
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
            <h2 className="text-2xl font-semibold mb-6">Event Description</h2>
            <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">
              <p className="whitespace-pre-wrap text-muted-foreground">
                {event.description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{event.createdAt?.toDate().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{event.updatedAt?.toDate().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registration Questions</p>
                  <p className="font-medium">{event.questions?.length || 0} question(s)</p>
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
            <h2 className="text-2xl font-semibold mb-6">Registration Questions</h2>
            {event.questions && event.questions.length > 0 ? (
              <div className="space-y-6">
                {event.questions.map((question, index) => (
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
              <p className="text-muted-foreground">No registration questions configured for this event.</p>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}