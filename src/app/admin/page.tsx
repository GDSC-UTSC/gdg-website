"use client";

import { Admin } from "@/app/types/user/admin";
import { UserData } from "@/app/types/userdata";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Calendar, Crown, FolderOpen, HelpCircle, Shield, ShieldCheck, UserCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [isGrantingAdmin, setIsGrantingAdmin] = useState(false);
  const [grantAdminMessage, setGrantAdminMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [removeAdminEmail, setRemoveAdminEmail] = useState("");
  const [isRemovingAdmin, setIsRemovingAdmin] = useState(false);
  const [removeAdminMessage, setRemoveAdminMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );



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

  const grantAdminByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !userData?.isSuperAdmin) return;

    setIsGrantingAdmin(true);
    setGrantAdminMessage(null);

    try {
      const result = await Admin.grantAdmin(adminEmail);
      setGrantAdminMessage({ type: "success", text: result.message });
      setAdminEmail("");
    } catch (error) {
      setGrantAdminMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to grant admin privileges",
      });
      console.error("Error granting admin privileges:", error);
    } finally {
      setIsGrantingAdmin(false);
    }
  };

  const removeAdminByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!removeAdminEmail.trim() || !userData?.isSuperAdmin) return;

    setIsRemovingAdmin(true);
    setRemoveAdminMessage(null);

    try {
      const result = await Admin.removeAdmin(removeAdminEmail);
      setRemoveAdminMessage({ type: "success", text: result.message });
      setRemoveAdminEmail("");
    } catch (error) {
      setRemoveAdminMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to remove admin privileges",
      });
      console.error("Error removing admin privileges:", error);
    } finally {
      setIsRemovingAdmin(false);
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
              <Shield className="h-6 w-6 text-primary" />
              Admin Panel
            </div>
          </h1>
        </motion.div>

        <div className="grid gap-6">
          {/* FAQ Navigation Block */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card
              className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              onClick={() => router.push("/admin/faq")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <HelpCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Need Help Getting Started?</div>
                    <div className="text-sm font-normal text-muted-foreground">Check out our comprehensive FAQ section</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Learn how to create events, manage positions, and add team members with our step-by-step guides.
                </p>
                <div className="inline-flex items-center text-sm font-medium text-primary group">
                  View FAQ Section
                  <svg className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Welcome Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {userData.isAdmin ? (
                    <Crown className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <ShieldCheck className="h-5 w-5 text-blue-500" />
                  )}
                  Welcome, {userData.publicName}
                </div>
              </CardTitle>
              <CardDescription>
                Your role: <span className="font-semibold capitalize text-primary">{userData.role}</span>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => router.push("/admin/events")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Manage events</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => router.push("/admin/projects")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-green-500" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Manage projects</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => router.push("/admin/team")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-purple-500" />
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Manage team</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => router.push("/admin/positions")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Manage positions</p>
              </CardContent>
            </Card>

            {/* User Management Card - Only for Super Admins */}
            {userData.isSuperAdmin && (
              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => router.push("/superadmin/users")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-red-500" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Go to user management</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Add Admin Section - Only for Super Admins */}
          {userData.isSuperAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Add Admin
                </CardTitle>
                <CardDescription>Grant admin privileges to a user by email address</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={grantAdminByEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email Address</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="Enter user's email address"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                      disabled={isGrantingAdmin}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>

                  {grantAdminMessage && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        grantAdminMessage.type === "success"
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}
                    >
                      {grantAdminMessage.text}
                    </div>
                  )}

                  <Button type="submit" disabled={isGrantingAdmin || !adminEmail.trim()} className="w-full sm:w-auto">
                    {isGrantingAdmin ? "Granting Admin..." : "Grant Admin Privileges"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Remove Admin Section - Only for Super Admins */}
          {userData.isSuperAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Remove Admin
                </CardTitle>
                <CardDescription>Remove admin privileges from a user by email address</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={removeAdminByEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="removeAdminEmail">Email Address</Label>
                    <Input
                      id="removeAdminEmail"
                      type="email"
                      placeholder="Enter admin's email address"
                      value={removeAdminEmail}
                      onChange={(e) => setRemoveAdminEmail(e.target.value)}
                      required
                      disabled={isRemovingAdmin}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>

                  {removeAdminMessage && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        removeAdminMessage.type === "success"
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}
                    >
                      {removeAdminMessage.text}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isRemovingAdmin || !removeAdminEmail.trim()}
                    variant="destructive"
                    className="w-full sm:w-auto"
                  >
                    {isRemovingAdmin ? "Removing Admin..." : "Remove Admin Privileges"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
