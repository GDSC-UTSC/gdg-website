"use client";

import { USER_ROLES, UserData } from "@/app/types/userdata";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Crown, Shield, ShieldCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        setIsLoadingUserData(true);
        const userData = await UserData.read(user.uid);
        if (userData) {
          setUserData(userData);
          if (!userData.isAdmin) {
            router.push("/");
            toast({
              title: "Access Denied",
              description:
                "You don't have permission to access the admin panel.",
              variant: "destructive",
            });
          } else {
            // Load all users automatically
            loadAllUsers();
          }
        } else {
          router.push("/");
          toast({
            title: "Error",
            description: "User data not found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        router.push("/");
        toast({
          title: "Error",
          description: "Failed to load user data.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingUserData(false);
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user, router, toast]);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.publicName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, allUsers]);

  const loadAllUsers = async () => {
    try {
      const users = await UserData.readAll();
      setAllUsers(users);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
    }
  };

  const promoteUserToAdmin = async (targetUser: UserData) => {
    if (!userData?.isSuperAdmin) return;

    setPromotingUserId(targetUser.id);
    try {
      if (
        targetUser.role === USER_ROLES.ADMIN ||
        targetUser.role === USER_ROLES.SUPERADMIN
      ) {
        toast({
          title: "Already Admin",
          description: "This user is already an admin or superadmin.",
          variant: "destructive",
        });
        return;
      }

      targetUser.role = USER_ROLES.ADMIN;
      await targetUser.update();

      toast({
        title: "Success",
        description: `${
          targetUser.publicName || targetUser.email
        } has been promoted to admin.`,
      });

      await loadAllUsers(); // Refresh the users list
    } catch (error) {
      console.error("Error promoting user:", error);
      toast({
        title: "Error",
        description: "Failed to promote user to admin.",
        variant: "destructive",
      });
    } finally {
      setPromotingUserId(null);
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
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
          {/* Welcome Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {userData.isSuperAdmin ? (
                      <Crown className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <ShieldCheck className="h-5 w-5 text-blue-500" />
                    )}
                    Welcome, {userData.publicName || userData.email}
                  </div>
                </CardTitle>
                <CardDescription>
                  Your role:{" "}
                  <span className="font-semibold capitalize text-primary">
                    {userData.role}
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Admin Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">
                      {allUsers.length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Admins</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                    <span className="text-2xl font-bold">
                      {
                        allUsers.filter((u) => u.role === USER_ROLES.ADMIN)
                          .length
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Super Admins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span className="text-2xl font-bold">
                      {
                        allUsers.filter((u) => u.role === USER_ROLES.SUPERADMIN)
                          .length
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* User Management */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Search and manage users in the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Input */}
                <div className="space-y-2 mt-4">
                  <Label htmlFor="search">Search Users</Label>
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mt-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                {/* Users List */}
                <div
                  className="space-y-3 max-h-96 overflow-y-auto mt-8 pr-3"
                  style={{
                    scrollbarColor: "rgba(156, 163, 175, 0.3) transparent",
                  }}
                >
                  {filteredUsers.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      {searchQuery
                        ? "No users found matching your search."
                        : "No users found."}
                    </div>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {user.role === USER_ROLES.SUPERADMIN ? (
                              <Crown className="h-5 w-5 text-yellow-500" />
                            ) : user.role === USER_ROLES.ADMIN ? (
                              <ShieldCheck className="h-5 w-5 text-blue-500" />
                            ) : (
                              <Users className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {user.publicName || user.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium capitalize px-3 py-1 rounded-full bg-primary/10 text-primary">
                            {user.role}
                          </div>
                          {/* Promote Button - Only for Super Admins and Member Users */}
                          {userData.isSuperAdmin &&
                            user.role === USER_ROLES.MEMBER && (
                              <Button
                                onClick={() => promoteUserToAdmin(user)}
                                disabled={promotingUserId === user.id}
                                size="sm"
                                className="ml-2"
                              >
                                {promotingUserId === user.id
                                  ? "Promoting..."
                                  : "Make Admin"}
                              </Button>
                            )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
