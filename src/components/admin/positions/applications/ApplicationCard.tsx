"use client";

import { Position } from "@/app/types/positions";
import { Application } from "@/app/types/positions/applications";
import { UserData } from "@/app/types/userdata";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, FileText, Github, Linkedin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ApplicationCardProps {
  application: Application;
  user: UserData | null;
  position: Position;
  index: number;
}

export default function ApplicationCard({ application, user, position, index }: ApplicationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
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
                    alt={user.publicName || application.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary font-semibold">{application.name.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold">{user?.publicName || application.name}</h3>
                <p className="text-muted-foreground">{application.email}</p>

                {user?.bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{user.bio}</p>}

                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>
                    Applied{" "}
                    {application.createdAt.toDate().toLocaleDateString()}
                  </span>
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
                  <button
                    className="text-muted-foreground hover:text-primary transition-colors"
                    title="Application Files"
                    onClick={async () => {
                      console.log(position, user);
                      const res = await fetch(`/api/position/${position?.id}/application/${user?.id}/resume`);
                      const data = await res.json();

                      if (data.resume) {
                        window.open(data.resume);
                      }
                    }}
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleExpansion}
              className="flex items-center gap-2"
            >
              View Details
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Expanded Application Details */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-border/50"
          >
            <h4 className="text-lg font-semibold mb-4">Application Responses</h4>

            {application.questions &&
            Object.keys(application.questions).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(application.questions)
                  .filter(([questionKey]) => questionKey !== "Resume" && questionKey !== "Resume_text")
                  .map(
                  ([questionKey, answer], questionIndex) => {
                    // Find the corresponding question from position data
                    const questionData = position?.questions?.find(
                      (q, idx) =>
                        questionKey === `question_${idx}` ||
                        questionKey === q.label
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
              <p className="text-muted-foreground">No responses submitted for this application.</p>
            )}

            {/* User Profile Information */}
            {user && (
              <div className="mt-6 pt-4 border-t border-border/50">
                <h4 className="text-lg font-semibold mb-4">Applicant Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.linkedin && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">LinkedIn</span>
                      <p className="text-sm">
                        <a
                          href={user.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {user.linkedin}
                        </a>
                      </p>
                    </div>
                  )}
                  {user.github && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">GitHub</span>
                      <p className="text-sm">
                        <a
                          href={user.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {user.github}
                        </a>
                      </p>
                    </div>
                  )}
                  {user.bio && (
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-muted-foreground">Bio</span>
                      <p className="text-sm mt-1">{user.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
