"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { UserData } from "@/app/types/userdata";
import { motion } from "framer-motion";
import { ArrowLeft, UserPlus, FileText, Mail, User, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const FAQItem = ({
  icon: Icon,
  question,
  answer,
  delay = 0,
  variant = "default"
}: {
  icon: any;
  question: string;
  answer: string;
  delay?: number;
  variant?: "default" | "warning" | "info";
}) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, delay }}
  >
    <Card className={`border-0 shadow-lg ${
      variant === "warning" ? "border-orange-200 bg-orange-50/50" :
      variant === "info" ? "border-blue-200 bg-blue-50/50" : ""
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            variant === "warning" ? "bg-orange-100" :
            variant === "info" ? "bg-blue-100" :
            "bg-primary/10"
          }`}>
            <Icon className={`h-5 w-5 ${
              variant === "warning" ? "text-orange-600" :
              variant === "info" ? "text-blue-600" :
              "text-primary"
            }`} />
          </div>
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {answer}
          </p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function PositionsFAQPage() {
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
            onClick={() => router.push("/admin/faq")}
            className="mb-4 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to FAQ
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-100">
              <UserPlus className="h-6 w-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold">Positions FAQ</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Learn how to create and manage positions for your organization
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-6">
          <FAQItem
            icon={FileText}
            question="What information is automatically collected for every position application?"
            answer="For every position you create, we will automatically ask applicants for these three required fields:

• **Email Address** - For communication and follow-up
• **Full Name** - For identification and records
• **Resume** - For evaluation of qualifications

**Important**: Please do NOT include these fields when building a new application form, as they are automatically added to every position. Only add additional custom questions specific to your role."
            delay={0.2}
            variant="info"
          />

          <FAQItem
            icon={AlertCircle}
            question="Why is my position not showing up immediately?"
            answer="Due to Firebase SSR and Vercel caching reasons, it might take up to 30 minutes for new positions to propagate and appear on the main website. This caching system allows us to keep within a free budget for hosting the website.

If you need instant changes or if your position doesn't appear after 30 minutes, please contact the GDSC UTSC tech team for assistance."
            delay={0.3}
            variant="warning"
          />

          <FAQItem
            icon={UserPlus}
            question="How do I create a new position?"
            answer="To create a new position:

1. Navigate to the Positions section in the admin panel
2. Click 'Create New Position'
3. Fill out the position details (title, description, requirements, etc.)
4. Add any custom application questions (remember: email, name, and resume are automatic)
5. Set the application deadline
6. Choose whether the position is active or draft
7. Save the position

The position will appear on the careers/positions page once it propagates (up to 30 minutes)."
            delay={0.4}
          />

          <FAQItem
            icon={User}
            question="What types of custom questions can I add to applications?"
            answer="You can add various types of custom questions to position applications:

• **Text Fields** - Short answer questions
• **Text Areas** - Long-form responses
• **Multiple Choice** - Select from predefined options
• **Checkboxes** - Multiple selections allowed
• **File Uploads** - Additional documents (portfolio, cover letter, etc.)

Examples of good custom questions:
- Why are you interested in this position?
- Describe a relevant project you've worked on
- What's your availability for this role?
- Do you have experience with [specific technology]?"
            delay={0.5}
          />

          <FAQItem
            icon={Mail}
            question="How do I manage applications and communicate with applicants?"
            answer="Once applications start coming in:

1. View all applications in the admin panel under the specific position
2. Review applicant information and responses
3. Download resumes and additional files
4. Use the applicant's email to reach out for interviews or updates
5. Update application status (under review, accepted, rejected, etc.)

**Tip**: Keep track of your hiring process by updating application statuses regularly to stay organized."
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
                Contact the GDSC UTSC tech team for additional support with position management.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}