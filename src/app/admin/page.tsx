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
import { motion } from "framer-motion";
import { Calendar, Crown, FolderOpen, Shield, ShieldCheck, Users, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null);
  const [demotingUserId, setDemotingUserId] = useState<string | null>(null);

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
          } else {
            // Load all users automatically
            loadAllUsers();
          }
        } else {
          router.push("/");
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

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter((user) =>
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
        return;
      }

      targetUser.role = USER_ROLES.ADMIN;
      await targetUser.update();

      await loadAllUsers(); // Refresh the users list
    } catch (error) {
      console.error("Error promoting user:", error);
    } finally {
      setPromotingUserId(null);
    }
  };

  const removeAdminPrivileges = async (targetUser: UserData) => {
    if (!userData?.isSuperAdmin) return;

    setDemotingUserId(targetUser.id);
    try {
      if (targetUser.role === USER_ROLES.SUPERADMIN) {
        return;
      }

      if (targetUser.role !== USER_ROLES.ADMIN) {
        return;
      }

      targetUser.role = USER_ROLES.MEMBER;
      await targetUser.update();

      await loadAllUsers(); // Refresh the users list
    } catch (error) {
      console.error("Error removing admin privileges:", error);
    } finally {
      setDemotingUserId(null);
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
          {/* Welcome Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {userData.isSuperAdmin ? (
                    <Crown className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <ShieldCheck className="h-5 w-5 text-blue-500" />
                  )}
                  Welcome, {userData.publicName}
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

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" onClick={() => router.push('/admin/events')}>
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

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" onClick={() => router.push('/admin/projects')}>
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

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" onClick={() => router.push('/admin/team')}>
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

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105" onClick={() => router.push('/admin/positions')}>
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
          </div>

          {/* Admin Stats */}
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
                  <span className="text-2xl font-bold">{allUsers.length}</span>
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
                    {allUsers.filter((u) => u.role === USER_ROLES.ADMIN).length}
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

          {/* User Management */}
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
                  placeholder="Search by name"
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
                          <p className="font-medium">{user.publicName}</p>
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

                        {/* Remove Admin Button - Only for Super Admins and Admin Users */}
                        {userData.isSuperAdmin &&
                          user.role === USER_ROLES.ADMIN && (
                            <Button
                              onClick={() => removeAdminPrivileges(user)}
                              disabled={demotingUserId === user.id}
                              size="sm"
                              variant="destructive"
                              className="ml-2"
                            >
                              {demotingUserId === user.id
                                ? "Removing..."
                                : "Remove Admin"}
                            </Button>
                          )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
