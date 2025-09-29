"use client";

import { UserData } from "@/app/types/userdata";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, ArrowLeft, Plus, RotateCcw, Users } from "lucide-react";
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
  variant?: "default" | "warning" | "info" | "danger";
}) => (
  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay }}>
    <Card
      className={`border-0 shadow-lg ${
        variant === "warning"
          ? "border-orange-500/30 bg-orange-500/5"
          : variant === "info"
          ? "border-blue-500/30 bg-blue-500/5"
          : variant === "danger"
          ? "border-red-500/30 bg-red-500/5"
          : ""
      }`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              variant === "warning"
                ? "bg-orange-500/20"
                : variant === "info"
                ? "bg-blue-500/20"
                : variant === "danger"
                ? "bg-red-500/20"
                : "bg-primary/10"
            }`}
          >
            <Icon
              className={`h-5 w-5 ${
                variant === "warning"
                  ? "text-orange-400"
                  : variant === "info"
                  ? "text-blue-400"
                  : variant === "danger"
                  ? "text-red-400"
                  : "text-primary"
              }`}
            />
          </div>
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className="text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: answer
                .split("\n\n")
                .map((paragraph) => {
                  // Function to convert markdown to HTML
                  const formatText = (text: string): string => {
                    return text
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                      .replace(/\*(.*?)\*/g, "<em>$1</em>");
                  };

                  if (paragraph.includes("•")) {
                    const lines = paragraph.split("\n");
                    const intro = lines.find((line) => !line.trim().startsWith("•"));
                    const bullets = lines.filter((line) => line.trim().startsWith("•"));

                    return `<div class="space-y-3">
                    ${intro ? `<p class="mb-3">${formatText(intro)}</p>` : ""}
                    <ul class="list-disc pl-6 space-y-2">
                      ${bullets
                        .map((bullet) => {
                          const text = bullet.replace(/^•\s*/, "").trim();
                          return `<li>${formatText(text)}</li>`;
                        })
                        .join("")}
                    </ul>
                  </div>`;
                  } else if (paragraph.match(/^\d+\./m)) {
                    const lines = paragraph.split("\n");
                    const intro = lines.find((line) => !line.match(/^\d+\./));
                    const items = lines.filter((line) => line.match(/^\d+\./));

                    return `<div class="space-y-3">
                    ${intro ? `<p class="mb-3">${formatText(intro)}</p>` : ""}
                    <ol class="list-decimal pl-6 space-y-2">
                      ${items
                        .map((item) => {
                          const match = item.match(/^(\d+\.)\s*(.*)/);
                          if (match) {
                            const text = match[2];
                            return `<li>${formatText(text)}</li>`;
                          }
                          return "";
                        })
                        .join("")}
                    </ol>
                  </div>`;
                  } else if (paragraph.includes("-")) {
                    const lines = paragraph.split("\n");
                    const intro = lines.find((line) => !line.trim().startsWith("-"));
                    const dashes = lines.filter((line) => line.trim().startsWith("-"));

                    if (dashes.length > 0) {
                      return `<div class="space-y-3">
                      ${intro ? `<p class="mb-3">${formatText(intro)}</p>` : ""}
                      <ul class="list-disc pl-6 space-y-2">
                        ${dashes
                          .map((dash) => {
                            const text = dash.replace(/^-\s*/, "").trim();
                            return `<li>${formatText(text)}</li>`;
                          })
                          .join("")}
                      </ul>
                    </div>`;
                    }
                  }

                  return `<p class="mb-4 last:mb-0">${formatText(paragraph)}</p>`;
                })
                .join(""),
            }}
          />
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function TeamFAQPage() {
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
            <div className="p-2 rounded-lg bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold">Team Management FAQ</h1>
          </div>
          <p className="text-muted-foreground text-lg">Learn how to add and manage team members effectively</p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-6">
          <FAQItem
            icon={AlertCircle}
            question="Why is my new team member not showing up immediately?"
            answer="Due to Firebase SSR and Vercel caching reasons, it might take up to 30 minutes for new team members to propagate and appear on the main website. This caching system allows us to keep within a free budget for hosting the website.

If you need instant changes or if your team member doesn't appear after 30 minutes, please contact the GDSC UTSC tech team for assistance."
            delay={0.2}
            variant="warning"
          />

          <FAQItem
            icon={AlertTriangle}
            question="Can I change the order of team members after adding them?"
            answer="**Important Limitation**: You cannot currently edit the order of your specific team members once they've been added to the system.

If you want to change the order in which team members appear, you will have to:
1. Remove all team members from your team
2. Re-add everyone in the desired order

**Tip**: Plan your team member order before adding people to avoid having to re-add everyone later."
            delay={0.3}
            variant="danger"
          />

          <FAQItem
            icon={Plus}
            question="How do I add a new team member?"
            answer="To add a new team member:

1. Navigate to the Team section in the admin panel
2. Click 'Add Team Member' or similar button
3. Fill out the required information:
   - Full name
   - Position/role title
   - Profile picture (optional but recommended)
   - Bio or description (optional)
   - Social media links (LinkedIn, GitHub, etc.)
4. Set their position within the team hierarchy
5. Save the team member

Remember: the order you add team members is the order they'll appear on the website."
            delay={0.4}
          />

          <FAQItem
            icon={Users}
            question="What information should I include for each team member?"
            answer="If you add a member by email, they must sign in and update their own profile from their side before their details show correctly on the website.

If you want LinkedIn or GitHub to appear on the team card, the member needs to add those links in their profile themselves. Changes to their profile will automatically update the team card on the website."
            delay={0.5}
          />

          <FAQItem
            icon={RotateCcw}
            question="How do I update or remove team members?"
            answer="To update team member information:
1. Find the team member in the admin panel
2. Click on their profile or edit button
3. Update the necessary information
4. Save changes

To remove a team member:
1. Locate the team member in the admin panel
2. Click the remove or delete option
3. Confirm the removal

**Note**: Remember that removing and re-adding affects the display order. If you need to maintain order, only remove members who are actually leaving the team."
            delay={0.6}
          />
        </div>

        {/* Additional Help */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
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
                Contact the GDSC UTSC tech team for additional support with team management.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
