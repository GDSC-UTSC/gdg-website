"use client";

import { UserData } from "@/app/types/userdata";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Calendar, Clock, EyeOff, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const FAQItem = ({
  icon: Icon,
  question,
  answer,
  delay = 0,
  variant = "default",
}: {
  icon: any;
  question: string;
  answer: string;
  delay?: number;
  variant?: "default" | "warning";
}) => (
  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay }}>
    <Card className={`border-0 shadow-lg ${variant === "warning" ? "border-orange-200 bg-orange-50/50" : ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${variant === "warning" ? "bg-orange-100" : "bg-primary/10"}`}>
            <Icon className={`h-5 w-5 ${variant === "warning" ? "text-orange-600" : "text-primary"}`} />
          </div>
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{answer}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function EventsFAQPage() {
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
          <Button variant="ghost" onClick={() => router.push("/admin/faq")} className="mb-4 hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to FAQ
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold">Events FAQ</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about creating and managing events
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-6">
          <FAQItem
            icon={AlertCircle}
            question="I just created my event, why is it not showing up immediately?"
            answer="Due to Firebase SSR and Vercel caching reasons, it might take up to 30 minutes for events to propagate and appear on the main website. This caching system allows us to keep within a free budget for hosting the website.

If you need instant changes or if your event doesn't appear after 30 minutes, please contact the GDSC UTSC tech team for assistance."
            delay={0.2}
            variant="warning"
          />

          <FAQItem
            icon={Users}
            question="Why is my event not showing registration forms?"
            answer="A registration form will not be shown unless you specifically add registration questions to the event. When creating an event, make sure to:

1. Navigate to the registration section
2. Add specific questions for attendees
3. Save the event with the registration questions included

Without registration questions, the event will display as information-only with no sign-up option."
            delay={0.3}
          />

          <FAQItem
            icon={Clock}
            question="When should I set my event status to 'Test'?"
            answer="Set your event status to 'Test' when:

• You're still planning the event and it's not ready for public viewing
• You want to preview how the event will look without making it live
• You're testing registration forms or event details
• The event is in draft mode and needs approval

Test events will not appear on the main events page and are only visible in the admin panel."
            delay={0.4}
          />

          <FAQItem
            icon={EyeOff}
            question="What are Hidden Events and when should I use them?"
            answer="Hidden Events are special events designed for specific audiences like speakers or VIPs. Key points about hidden events:

• They will NOT appear on the main events page
• They must be shared directly to speakers/VIPs via private links
• They have special registration forms tailored for speakers/VIPs
• **Security Warning**: If public people get hold of these links, there's nothing stopping them from signing up
• **Important**: Tell speakers to NOT share the registration link publicly

Use hidden events for:
- Speaker registration forms
- VIP/sponsor event access
- Internal team events
- Exclusive workshops or sessions"
            delay={0.6}
          />
        </div>

        {/* Additional Help */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12"
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-center">Still Need Help?</CardTitle>
              <CardDescription className="text-center text-base">
                If you have questions not covered here, reach out to the tech team.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Contact the GDSC UTSC tech team for additional support with event management.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
