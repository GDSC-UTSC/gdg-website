"use client";

import { USER_ROLES, UserData } from "@/app/types/userdata";
import { SuperAdmin } from "@/app/types/user/superadmin";
import { Admin } from "@/app/types/user/admin";
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
import UserSearch from "@/components/admin/UserSearch";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Crown, Shield, ShieldCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuperAdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null);
  const [demotingUserId, setDemotingUserId] = useState<string | null>(null);
  const [selectedUserForSuperAdmin, setSelectedUserForSuperAdmin] = useState<UserData | null>(null);
  const [isGrantingSuperAdmin, setIsGrantingSuperAdmin] = useState(false);
  const [grantSuperAdminMessage, setGrantSuperAdminMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
          if (!userData.isSuperAdmin) {
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
      if (!user) return;
      
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL}/getUsers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const usersData = await response.json();
      // Convert raw data to UserData objects
      const users = usersData.map((userData: any) => new UserData(userData));
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

      if (!user) {
        console.error("No authenticated user");
        return;
      }
      
      console.log("Promoting user:", targetUser.id);
      
      const token = await user.getIdToken();
      const result = await Admin.grantAdminByEmail(targetUser.id, token, true);
      console.log("Promotion successful:", result);

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

      if (!user) {
        console.error("No authenticated user");
        return;
      }
      
      console.log("Removing admin from user:", targetUser.id);
      
      const token = await user.getIdToken();
      const result = await Admin.removeAdminByEmail(targetUser.id, token, true);
      console.log("Admin removal successful:", result);

      await loadAllUsers(); // Refresh the users list
    } catch (error) {
      console.error("Error removing admin privileges:", error);
    } finally {
      setDemotingUserId(null);
    }
  };

  const grantSuperAdminToUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForSuperAdmin || !userData?.isSuperAdmin) return;

    setIsGrantingSuperAdmin(true);
    setGrantSuperAdminMessage(null);

    try {
      if (!user) {
        setGrantSuperAdminMessage({ type: "error", text: "User not authenticated" });
        return;
      }
      
      const token = await user.getIdToken();
      const result = await SuperAdmin.grantSuperAdmin(selectedUserForSuperAdmin.id, token);
      setGrantSuperAdminMessage({ type: "success", text: result.message });
      setSelectedUserForSuperAdmin(null);
      await loadAllUsers(); // Refresh the users list
    } catch (error) {
      setGrantSuperAdminMessage({ 
        type: "error", 
        text: error instanceof Error ? error.message : "Failed to grant super admin privileges" 
      });
      console.error("Error granting super admin privileges:", error);
    } finally {
      setIsGrantingSuperAdmin(false);
    }
  };

  if (loading || isLoadingUserData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !userData?.isSuperAdmin) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="mb-8">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              User Management
            </div>
          </h1>
        </motion.div>

        <div className="grid gap-6">
          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
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
                <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <span className="text-2xl font-bold">
                    {allUsers.filter((u) => u.role === USER_ROLES.SUPERADMIN).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grant Super Admin Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Grant Super Admin
              </CardTitle>
              <CardDescription>
                Grant super admin privileges to a user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={grantSuperAdminToUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="superAdminUser">Select User</Label>
                  <UserSearch
                    onUserSelect={setSelectedUserForSuperAdmin}
                    placeholder="Search for a user to grant super admin privileges"
                    value={selectedUserForSuperAdmin?.publicName || ""}
                  />
                  {selectedUserForSuperAdmin && (
                    <div className="text-sm text-muted-foreground">
                      Selected: {selectedUserForSuperAdmin.publicName || "Unknown User"} (Current role: {selectedUserForSuperAdmin.role})
                    </div>
                  )}
                </div>
                
                {grantSuperAdminMessage && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      grantSuperAdminMessage.type === "success"
                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                        : "bg-red-500/10 text-red-500 border border-red-500/20"
                    }`}
                  >
                    {grantSuperAdminMessage.text}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  disabled={isGrantingSuperAdmin || !selectedUserForSuperAdmin}
                  className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700"
                >
                  {isGrantingSuperAdmin ? "Granting Super Admin..." : "Grant Super Admin Privileges"}
                </Button>
              </form>
            </CardContent>
          </Card>

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
                        {/* Promote Button - Only for Member Users */}
                        {user.role === USER_ROLES.MEMBER && (
                          <Button
                            onClick={() => promoteUserToAdmin(user)}
                            disabled={promotingUserId === user.id}
                            size="sm"
                            className="ml-2"
                          >
                            {promotingUserId === user.id ? "Promoting..." : "Make Admin"}
                          </Button>
                        )}

                        {/* Remove Admin Button - Only for Admin Users (not Super Admins) */}
                        {user.role === USER_ROLES.ADMIN && (
                          <Button
                            onClick={() => removeAdminPrivileges(user)}
                            disabled={demotingUserId === user.id}
                            size="sm"
                            variant="destructive"
                            className="ml-2"
                          >
                            {demotingUserId === user.id ? "Removing..." : "Remove Admin"}
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