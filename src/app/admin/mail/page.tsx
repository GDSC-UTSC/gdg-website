"use client";

import { UserData } from "@/app/types/userdata";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminMailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Form state
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

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

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to send emails");
      return;
    }

    // Parse recipients (comma or newline separated)
    const recipientList = recipients
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (recipientList.length === 0) {
      toast.error("Please enter at least one recipient email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipientList.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      toast.error(`Invalid email addresses: ${invalidEmails.join(", ")}`);
      return;
    }

    setIsSending(true);

    try {
      // Authentication is handled by middleware, no need to send token
      const response = await fetch("/api/admin/mail/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients: recipientList,
          subject,
          body,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      toast.success(data.message || "Email sent successfully!");

      // Clear form
      setRecipients("");
      setSubject("");
      setBody("");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

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
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="mb-8">
            <div className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              Send Email
            </div>
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Compose Email</CardTitle>
              <CardDescription>
                Send an email to GDG members. Separate multiple email addresses with commas or new lines.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendEmail} className="space-y-6">
                {/* Recipients */}
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients *</Label>
                  <Textarea
                    id="recipients"
                    placeholder="email1@example.com, email2@example.com&#10;or one email per line"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    required
                    disabled={isSending}
                    rows={4}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter email addresses separated by commas or new lines
                  </p>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Enter email subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    disabled={isSending}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                {/* Body */}
                <div className="space-y-2">
                  <Label htmlFor="body">Message *</Label>
                  <Textarea
                    id="body"
                    placeholder="Enter your message here. You can use HTML tags for formatting."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    disabled={isSending}
                    rows={12}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <p className="text-xs text-muted-foreground">
                    You can use HTML tags like &lt;strong&gt;, &lt;em&gt;, &lt;p&gt;, &lt;br&gt;, etc. for formatting.
                    The GDG logo will be automatically included at the top of the email.
                  </p>
                </div>

                {/* Preview Note */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-blue-500">
                    <strong>Note:</strong> The email will include the GDG UTSC logo at the top and a footer with organization information.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSending || !recipients.trim() || !subject.trim() || !body.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
