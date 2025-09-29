"use client";

import { UserData } from "@/app/types/userdata";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Calendar, CheckCircle, Clock, EyeOff, Image, Users } from "lucide-react";
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
    <Card className={`border-0 shadow-lg ${variant === "warning" ? "border-orange-500/30 bg-orange-500/5" : ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${variant === "warning" ? "bg-orange-500/20" : "bg-primary/10"}`}>
            <Icon className={`h-5 w-5 ${variant === "warning" ? "text-orange-400" : "text-primary"}`} />
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
                  const formatText = (text: string) => {
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
            icon={Image}
            question="How do I add pictures to my event?"
            answer="**Important**: After creating your event, you should add pictures to make it more engaging and professional.

To add pictures to your event:

1. Navigate to your event in the admin panel
2. Click **'Edit Event'** on your created event
3. Look for the images/pictures section
4. Upload high-quality images that represent your event
5. Add multiple images if possible (event photos, speaker photos, venue photos)
6. Save the changes

**Why add pictures?**
• Pictures make events more attractive and professional
• Increases registration rates and engagement
• Helps attendees understand what to expect
• Makes your event stand out on the events page

**Tip**: Use clear, high-resolution images that are relevant to your event content and audience."
            delay={0.3}
            variant="warning"
          />

          <FAQItem
            icon={Users}
            question="Why is my event not showing registration forms?"
            answer="A registration form will not be shown unless you specifically add registration questions to the event. When creating an event, make sure to:

1. Navigate to the registration section
2. Add specific questions for attendees
3. Save the event with the registration questions included

**Important Note**: Full name and email will automatically be included in every event registration. You don't need to add these fields manually - they are automatically collected for all events.

Without registration questions, the event will display as information-only with no sign-up option."
            delay={0.4}
            variant="warning"
          />

          <FAQItem
            icon={CheckCircle}
            question="What is the 'Default' option and when should I use it for production?"
            answer="The 'Default' option is the standard event status that makes your event visible to the public on the main website. Use 'Default' when:

• Your event is ready for public viewing and registration
• All event details are finalized and accurate
• Registration forms are properly configured
• You want the event to appear on the main events page

**Important**: Only set events to 'Default' when they are completely ready for public access, as this will make them immediately visible to all website visitors once the changes propagate."
            delay={0.5}
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
            delay={0.6}
          />

          <FAQItem
            icon={Calendar}
            question="How does event timing work (Upcoming, Ongoing, Past)?"
            answer="Events are automatically categorized based on the 'Event Date' you set:

• **Upcoming Events**: Event date is in the future
• **Ongoing Events**: Event date is today
• **Past Events**: Event date has passed

The system uses this date to automatically sort and display events in the appropriate sections on the main website. Make sure to set the correct date and time for proper categorization."
            delay={0.7}
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
            delay={0.8}
          />
        </div>

        {/* Additional Help */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
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
