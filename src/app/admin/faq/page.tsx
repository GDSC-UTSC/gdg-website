"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { UserData } from "@/app/types/userdata";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, HelpCircle, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const FAQSection = ({
  icon: Icon,
  title,
  description,
  content,
  delay = 0
}: {
  icon: any;
  title: string;
  description: string;
  content: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, delay }}
  >
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {title}
        </CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {content}
          </p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function AdminFAQPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        setIsLoadingUserData(true);
        const userData = await UserData.read(user.uid);
        if (userData) {
          setUserData(userData);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        router.push("/");
      } finally {
        setIsLoadingUserData(false);
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user, router]);

  if (loading || isLoadingUserData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !userData?.isAdmin) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/admin")}
            className="mb-4 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Panel
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Admin FAQ</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Common questions and guides for admin tasks
          </p>
        </motion.div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          <div
            className="cursor-pointer"
            onClick={() => router.push("/admin/faq/events")}
          >
            <FAQSection
              icon={Calendar}
              title="Creating a New Event"
              description="Learn how to create and manage events for your organization"
              content="This section covers step-by-step instructions for creating new events, setting up event details, managing attendees, and tracking event success. Click to learn about registration forms, test events, hidden events, and why events may take time to appear."
              delay={0.2}
            />
          </div>

          <div
            className="cursor-pointer"
            onClick={() => router.push("/admin/faq/positions")}
          >
            <FAQSection
              icon={UserPlus}
              title="Creating a New Position"
              description="Guide to setting up new positions and roles within your team"
              content="Learn how to define new positions, set role permissions, and create job descriptions. Click to discover what information is automatically collected for applications and why positions may take time to appear on the website."
              delay={0.3}
            />
          </div>

          <div
            className="cursor-pointer"
            onClick={() => router.push("/admin/faq/team")}
          >
            <FAQSection
              icon={Users}
              title="Adding Members to Your Team"
              description="Instructions for onboarding new team members and managing access"
              content="This comprehensive guide covers the process of adding new team members, managing their information, and organizing team structure. Click to learn about team member ordering limitations and why new members may take time to appear."
              delay={0.4}
            />
          </div>
        </div>

        {/* Additional Help */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-center">Need More Help?</CardTitle>
              <CardDescription className="text-center text-base">
                If you can't find what you're looking for, don't hesitate to reach out for additional support.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Contact the GDSC UTSC tech team for additional support.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
