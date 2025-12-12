"use client";

import { Event } from "@/app/types/events";
import { Registration } from "@/app/types/events/registrations";
import { UserData } from "@/app/types/userdata";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Clock, Github, Linkedin, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface RegistrationCardProps {
  registration: Registration;
  user: UserData | null;
  event: Event;
  index: number;
}

export default function RegistrationCard({ registration, user, event, index }: RegistrationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: "registered" | "cancelled" | "accepted" | "rejected" | "waitlisted") => {
    setIsUpdating(true);
    try {
      await registration.updateStatus(event.id, newStatus);
      toast.success(`Registration ${newStatus} successfully`);
    } catch (error) {
      console.error("Error updating registration status:", error);
      toast.error("Failed to update registration status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "registered":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "waitlisted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              {/* Avatar/Initials */}
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {user?.profileImageUrl ? (
                  <Image
                    src={user.profileImageUrl}
                    alt={user.publicName || registration.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary font-semibold">{registration.name.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold">{user?.publicName || registration.name}</h3>
                <p className="text-muted-foreground">{registration.email}</p>

                {user?.bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{user.bio}</p>}

                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Registered {registration.createdAt?.toDate().toLocaleDateString()}</span>
                  {Object.keys(registration.questions || {}).length > 0 && (
                    <span>{Object.keys(registration.questions || {}).length} responses</span>
                  )}
                </div>

                {/* Social Links and File Icons */}
                <div className="flex items-center gap-3 mt-3">
                  {user?.github && (
                    <a
                      href={user.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {user?.linkedin && (
                    <a
                      href={user.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(registration.status)}`}>
              {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
            </span>

            <Button variant="outline" size="sm" onClick={toggleExpansion} className="flex items-center gap-2">
              View Details
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Expanded Registration Details */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-border/50"
          >
            <h4 className="text-lg font-semibold mb-4">Registration Responses</h4>

            {registration.questions && Object.keys(registration.questions).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(registration.questions).map(([questionKey, answer], questionIndex) => {
                  // Find the corresponding question from event data
                  const questionData = event?.questions?.find(
                    (q, idx) => questionKey === `question_${idx}` || questionKey === q.label
                  );

                  return (
                    <div key={questionIndex} className="p-4 bg-muted/20 rounded-lg">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Question {questionIndex + 1}</span>
                        {questionData && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {questionData.type}
                          </span>
                        )}
                      </div>
                      <p className="font-medium mb-2">{questionData ? questionData.label : questionKey}</p>
                      <div className="p-3 bg-background border rounded">
                        <p className="text-sm whitespace-pre-wrap">{answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No responses submitted for this registration.</p>
            )}

            {/* Admin Actions */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <h4 className="text-lg font-semibold mb-4">Admin Actions</h4>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={registration.status === "accepted" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusUpdate("accepted")}
                  disabled={isUpdating || registration.status === "accepted"}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Accept
                </Button>
                <Button
                  variant={registration.status === "rejected" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusUpdate("rejected")}
                  disabled={isUpdating || registration.status === "rejected"}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Reject
                </Button>
                <Button
                  variant={registration.status === "waitlisted" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusUpdate("waitlisted")}
                  disabled={isUpdating || registration.status === "waitlisted"}
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Waitlist
                </Button>
                <Button
                  variant={registration.status === "registered" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusUpdate("registered")}
                  disabled={isUpdating || registration.status === "registered"}
                  className="flex items-center gap-2"
                >
                  Registered
                </Button>
                <Button
                  variant={registration.status === "cancelled" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusUpdate("cancelled")}
                  disabled={isUpdating || registration.status === "cancelled"}
                  className="flex items-center gap-2"
                >
                  Cancelled
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
