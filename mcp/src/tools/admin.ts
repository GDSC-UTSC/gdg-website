import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { db, auth } from "../firebase.js";
import { UserDataType, Role } from "../types.js";

export function registerAdminTools(server: McpServer) {
  server.tool(
    "grant_admin_role",
    "Grant admin privileges to a user by email or UID",
    {
      identifier: z.string().describe("User email or UID"),
      role: z.enum(["admin", "superadmin"]).describe("Role to grant (admin or superadmin)"),
    },
    async ({ identifier, role }) => {
      try {
        // Find user by email or UID
        let userRecord;
        try {
          if (identifier.includes("@")) {
            userRecord = await auth.getUserByEmail(identifier);
          } else {
            userRecord = await auth.getUser(identifier);
          }
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `User not found: ${identifier}`,
              },
            ],
          };
        }

        const uid = userRecord.uid;

        // Set custom claims for Firebase Auth
        const claims = {
          [role]: true,
        };

        // If granting superadmin, also grant admin
        if (role === "superadmin") {
          claims.admin = true;
        }

        await auth.setCustomUserClaims(uid, claims);

        // Update user document in Firestore
        await db
          .collection("users")
          .doc(uid)
          .update({
            role: role as Role,
            updatedAt: new Date(),
          });

        return {
          content: [
            {
              type: "text",
              text: `Successfully granted ${role} role to user ${userRecord.email || uid}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error granting ${role} role: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "remove_admin_role",
    "Remove admin or superadmin privileges from a user",
    {
      identifier: z.string().describe("User email or UID"),
      role: z.enum(["admin", "superadmin"]).describe("Role to remove (admin or superadmin)"),
    },
    async ({ identifier, role }) => {
      try {
        // Find user by email or UID
        let userRecord;
        try {
          if (identifier.includes("@")) {
            userRecord = await auth.getUserByEmail(identifier);
          } else {
            userRecord = await auth.getUser(identifier);
          }
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `User not found: ${identifier}`,
              },
            ],
          };
        }

        const uid = userRecord.uid;

        // Get current claims
        const currentUser = await auth.getUser(uid);
        const currentClaims = currentUser.customClaims || {};

        // Remove the specified role
        const updatedClaims = { ...currentClaims };
        delete updatedClaims[role];

        // If removing superadmin, keep admin if it exists
        // If removing admin and user is superadmin, keep superadmin
        if (role === "superadmin" && !updatedClaims.admin) {
          // Only remove superadmin, keep other claims
        } else if (role === "admin" && updatedClaims.superadmin) {
          // Keep superadmin when removing admin
        }

        await auth.setCustomUserClaims(uid, updatedClaims);

        // Determine new role for Firestore
        let newRole: Role = "member";
        if (updatedClaims.superadmin) {
          newRole = "superadmin";
        } else if (updatedClaims.admin) {
          newRole = "admin";
        }

        // Update user document in Firestore
        await db
          .collection("users")
          .doc(uid)
          .update({
            role: newRole,
            updatedAt: new Date(),
          });

        return {
          content: [
            {
              type: "text",
              text: `Successfully removed ${role} role from user ${userRecord.email || uid}. New role: ${newRole}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error removing ${role} role: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "list_all_admins",
    "List all users with admin or superadmin roles",
    {
      roleFilter: z.enum(["admin", "superadmin", "all"]).optional().describe("Filter by specific role or show all admins"),
      limit: z.number().optional().describe("Limit number of results"),
    },
    async ({ roleFilter, limit }) => {
      try {
        let query = db.collection("users") as any;

        if (roleFilter && roleFilter !== "all") {
          query = query.where("role", "==", roleFilter);
        } else {
          // Get both admin and superadmin users
          query = query.where("role", "in", ["admin", "superadmin"]);
        }

        if (limit) {
          query = query.limit(limit);
        }

        const snapshot = await query.get();
        const adminUsers = snapshot.docs.map((doc: any) => {
          const userData = doc.data();
          return {
            id: doc.id,
            email: userData.email,
            publicName: userData.publicName,
            role: userData.role,
            updatedAt: userData.updatedAt,
          };
        });

        // Also get Firebase Auth custom claims for verification
        const enrichedUsers = await Promise.all(
          adminUsers.map(async (user: any) => {
            try {
              const authUser = await auth.getUser(user.id);
              return {
                ...user,
                email: authUser.email || user.email,
                customClaims: authUser.customClaims || {},
              };
            } catch (error) {
              return user;
            }
          })
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(enrichedUsers, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error listing admin users: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "check_admin_status",
    "Check admin status of a specific user",
    {
      identifier: z.string().describe("User email or UID"),
    },
    async ({ identifier }) => {
      try {
        // Find user by email or UID
        let userRecord;
        try {
          if (identifier.includes("@")) {
            userRecord = await auth.getUserByEmail(identifier);
          } else {
            userRecord = await auth.getUser(identifier);
          }
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `User not found: ${identifier}`,
              },
            ],
          };
        }

        const uid = userRecord.uid;

        // Get Firebase Auth claims
        const authUser = await auth.getUser(uid);
        const customClaims = authUser.customClaims || {};

        // Get Firestore user data
        const userDoc = await db.collection("users").doc(uid).get();
        const userData = userDoc.exists ? userDoc.data() as UserDataType : null;

        const status = {
          uid: uid,
          email: authUser.email,
          publicName: userData?.publicName,
          firestoreRole: userData?.role || "member",
          authClaims: customClaims,
          isAdmin: customClaims.admin || false,
          isSuperAdmin: customClaims.superadmin || false,
          lastUpdated: userData?.updatedAt,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(status, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error checking admin status: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "bulk_admin_operation",
    "Perform bulk admin operations on multiple users",
    {
      userIds: z.array(z.string()).describe("Array of user IDs or emails"),
      operation: z.enum(["grant_admin", "grant_superadmin", "remove_admin", "remove_superadmin"]).describe("Operation to perform"),
    },
    async ({ userIds, operation }) => {
      try {
        const results = [];

        for (const identifier of userIds) {
          try {
            // Find user
            let userRecord;
            if (identifier.includes("@")) {
              userRecord = await auth.getUserByEmail(identifier);
            } else {
              userRecord = await auth.getUser(identifier);
            }

            const uid = userRecord.uid;

            if (operation.startsWith("grant")) {
              const role = operation === "grant_superadmin" ? "superadmin" : "admin";
              const claims = { [role]: true };
              if (role === "superadmin") {
                claims.admin = true;
              }

              await auth.setCustomUserClaims(uid, claims);
              await db.collection("users").doc(uid).update({
                role: role as Role,
                updatedAt: new Date(),
              });

              results.push({
                identifier,
                success: true,
                message: `Granted ${role} role`,
              });
            } else {
              // Remove operation
              const roleToRemove = operation === "remove_superadmin" ? "superadmin" : "admin";
              const currentUser = await auth.getUser(uid);
              const currentClaims = currentUser.customClaims || {};
              const updatedClaims = { ...currentClaims };
              delete updatedClaims[roleToRemove];

              await auth.setCustomUserClaims(uid, updatedClaims);

              let newRole: Role = "member";
              if (updatedClaims.superadmin) {
                newRole = "superadmin";
              } else if (updatedClaims.admin) {
                newRole = "admin";
              }

              await db.collection("users").doc(uid).update({
                role: newRole,
                updatedAt: new Date(),
              });

              results.push({
                identifier,
                success: true,
                message: `Removed ${roleToRemove} role, new role: ${newRole}`,
              });
            }
          } catch (error) {
            results.push({
              identifier,
              success: false,
              message: `Error: ${error}`,
            });
          }
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error performing bulk operation: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "sync_admin_claims",
    "Sync admin roles between Firebase Auth claims and Firestore",
    {
      userId: z.string().optional().describe("Specific user ID to sync, or leave empty to sync all admin users"),
    },
    async ({ userId }) => {
      try {
        let usersToSync = [];

        if (userId) {
          // Sync specific user
          const userRecord = await auth.getUser(userId);
          usersToSync = [userRecord];
        } else {
          // Get all admin users from Firestore
          const adminQuery = await db.collection("users")
            .where("role", "in", ["admin", "superadmin"])
            .get();

          const userIds = adminQuery.docs.map(doc => doc.id);
          usersToSync = await Promise.all(
            userIds.map(id => auth.getUser(id).catch(() => null))
          );
          usersToSync = usersToSync.filter(user => user !== null);
        }

        const syncResults = [];

        for (const user of usersToSync) {
          try {
            const uid = user.uid;
            const userDoc = await db.collection("users").doc(uid).get();

            if (!userDoc.exists) {
              syncResults.push({
                uid,
                success: false,
                message: "User document not found in Firestore",
              });
              continue;
            }

            const userData = userDoc.data() as UserDataType;
            const firestoreRole = userData.role;
            const authClaims = user.customClaims || {};

            // Sync claims based on Firestore role
            const shouldHaveAdmin = firestoreRole === "admin" || firestoreRole === "superadmin";
            const shouldHaveSuperAdmin = firestoreRole === "superadmin";

            const newClaims = {
              admin: shouldHaveAdmin,
              superadmin: shouldHaveSuperAdmin,
            };

            // Only update if claims are different
            const needsUpdate =
              authClaims.admin !== newClaims.admin ||
              authClaims.superadmin !== newClaims.superadmin;

            if (needsUpdate) {
              await auth.setCustomUserClaims(uid, newClaims);
              syncResults.push({
                uid,
                email: user.email,
                success: true,
                message: `Synced claims for ${firestoreRole} role`,
                changes: {
                  before: authClaims,
                  after: newClaims,
                },
              });
            } else {
              syncResults.push({
                uid,
                email: user.email,
                success: true,
                message: "No sync needed - claims already match",
              });
            }
          } catch (error) {
            syncResults.push({
              uid: user.uid,
              success: false,
              message: `Error syncing user: ${error}`,
            });
          }
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(syncResults, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error syncing admin claims: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "get_recent_logins",
    "Get recently logged in users from Firebase Auth",
    {
      limit: z.number().optional().describe("Maximum number of users to return (default: 20)"),
      hoursBack: z.number().optional().describe("How many hours back to look for recent activity (default: 24)"),
    },
    async ({ limit = 20, hoursBack = 24 }) => {
      try {
        // Get all users from Firebase Auth
        const listUsersResult = await auth.listUsers(1000); // Get up to 1000 users
        
        const now = new Date();
        const cutoffTime = new Date(now.getTime() - (hoursBack * 60 * 60 * 1000));
        
        // Filter and sort users by last sign in time
        const recentUsers = listUsersResult.users
          .filter(user => {
            if (!user.metadata.lastSignInTime) return false;
            const lastSignIn = new Date(user.metadata.lastSignInTime);
            return lastSignIn > cutoffTime;
          })
          .sort((a, b) => {
            const timeA = new Date(a.metadata.lastSignInTime!).getTime();
            const timeB = new Date(b.metadata.lastSignInTime!).getTime();
            return timeB - timeA; // Most recent first
          })
          .slice(0, limit);

        // Enrich with Firestore data
        const enrichedUsers = await Promise.all(
          recentUsers.map(async (user) => {
            try {
              const userDoc = await db.collection("users").doc(user.uid).get();
              const userData = userDoc.exists ? userDoc.data() as UserDataType : null;
              
              return {
                uid: user.uid,
                email: user.email,
                publicName: userData?.publicName || null,
                role: userData?.role || "member",
                lastSignInTime: user.metadata.lastSignInTime,
                creationTime: user.metadata.creationTime,
                lastRefreshTime: user.metadata.lastRefreshTime,
                emailVerified: user.emailVerified,
                disabled: user.disabled,
                customClaims: user.customClaims || {},
                providerData: user.providerData.map(p => ({
                  providerId: p.providerId,
                  uid: p.uid,
                })),
              };
            } catch (error) {
              return {
                uid: user.uid,
                email: user.email,
                publicName: null,
                role: "member",
                lastSignInTime: user.metadata.lastSignInTime,
                creationTime: user.metadata.creationTime,
                lastRefreshTime: user.metadata.lastRefreshTime,
                emailVerified: user.emailVerified,
                disabled: user.disabled,
                customClaims: user.customClaims || {},
                error: `Failed to fetch Firestore data: ${error}`,
              };
            }
          })
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                totalFound: enrichedUsers.length,
                hoursBack,
                cutoffTime: cutoffTime.toISOString(),
                users: enrichedUsers,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching recent logins: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "get_user_login_activity",
    "Get detailed login activity for a specific user",
    {
      identifier: z.string().describe("User email or UID"),
    },
    async ({ identifier }) => {
      try {
        // Find user by email or UID
        let userRecord;
        try {
          if (identifier.includes("@")) {
            userRecord = await auth.getUserByEmail(identifier);
          } else {
            userRecord = await auth.getUser(identifier);
          }
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `User not found: ${identifier}`,
              },
            ],
          };
        }

        // Get Firestore user data
        const userDoc = await db.collection("users").doc(userRecord.uid).get();
        const userData = userDoc.exists ? userDoc.data() as UserDataType : null;

        const activity = {
          uid: userRecord.uid,
          email: userRecord.email,
          publicName: userData?.publicName || null,
          role: userData?.role || "member",
          
          // Auth metadata
          creationTime: userRecord.metadata.creationTime,
          lastSignInTime: userRecord.metadata.lastSignInTime,
          lastRefreshTime: userRecord.metadata.lastRefreshTime,
          
          // Account status
          emailVerified: userRecord.emailVerified,
          disabled: userRecord.disabled,
          
          // Login providers
          providerData: userRecord.providerData.map(provider => ({
            providerId: provider.providerId,
            uid: provider.uid,
            email: provider.email,
            displayName: provider.displayName,
          })),
          
          // Admin status
          customClaims: userRecord.customClaims || {},
          
          // Calculate activity metrics
          daysSinceCreation: userRecord.metadata.creationTime 
            ? Math.floor((Date.now() - new Date(userRecord.metadata.creationTime).getTime()) / (1000 * 60 * 60 * 24))
            : null,
          daysSinceLastLogin: userRecord.metadata.lastSignInTime
            ? Math.floor((Date.now() - new Date(userRecord.metadata.lastSignInTime).getTime()) / (1000 * 60 * 60 * 24))
            : null,
          minutesSinceLastRefresh: userRecord.metadata.lastRefreshTime
            ? Math.floor((Date.now() - new Date(userRecord.metadata.lastRefreshTime).getTime()) / (1000 * 60))
            : null,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(activity, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching user login activity: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "get_login_statistics",
    "Get overall login statistics and user activity metrics",
    {
      daysPeriod: z.number().optional().describe("Period in days to analyze (default: 7)"),
    },
    async ({ daysPeriod = 7 }) => {
      try {
        // Get all users from Firebase Auth
        const listUsersResult = await auth.listUsers(1000);
        
        const now = new Date();
        const periodStart = new Date(now.getTime() - (daysPeriod * 24 * 60 * 60 * 1000));
        
        let totalUsers = 0;
        let activeUsers = 0;
        let newUsers = 0;
        let verifiedUsers = 0;
        let disabledUsers = 0;
        let adminUsers = 0;
        let superadminUsers = 0;
        
        const providerStats: { [key: string]: number } = {};
        const roleStats: { [key: string]: number } = {};
        
        // Analyze each user
        for (const user of listUsersResult.users) {
          totalUsers++;
          
          // Check if user was active in the period
          if (user.metadata.lastSignInTime) {
            const lastSignIn = new Date(user.metadata.lastSignInTime);
            if (lastSignIn > periodStart) {
              activeUsers++;
            }
          }
          
          // Check if user was created in the period
          if (user.metadata.creationTime) {
            const creationTime = new Date(user.metadata.creationTime);
            if (creationTime > periodStart) {
              newUsers++;
            }
          }
          
          // Other stats
          if (user.emailVerified) verifiedUsers++;
          if (user.disabled) disabledUsers++;
          
          // Admin stats
          const claims = user.customClaims || {};
          if (claims.admin) adminUsers++;
          if (claims.superadmin) superadminUsers++;
          
          // Provider stats
          user.providerData.forEach(provider => {
            providerStats[provider.providerId] = (providerStats[provider.providerId] || 0) + 1;
          });
          
          // Get Firestore role data
          try {
            const userDoc = await db.collection("users").doc(user.uid).get();
            if (userDoc.exists) {
              const userData = userDoc.data() as UserDataType;
              const role = userData.role || "member";
              roleStats[role] = (roleStats[role] || 0) + 1;
            }
          } catch (error) {
            // Skip if can't get Firestore data
            roleStats["unknown"] = (roleStats["unknown"] || 0) + 1;
          }
        }
        
        const statistics = {
          period: {
            days: daysPeriod,
            startDate: periodStart.toISOString(),
            endDate: now.toISOString(),
          },
          
          userCounts: {
            total: totalUsers,
            active: activeUsers,
            new: newUsers,
            verified: verifiedUsers,
            disabled: disabledUsers,
            admins: adminUsers,
            superadmins: superadminUsers,
          },
          
          percentages: {
            activeRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
            verificationRate: totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0,
            adminRate: totalUsers > 0 ? Math.round((adminUsers / totalUsers) * 100) : 0,
          },
          
          authProviders: providerStats,
          roleDistribution: roleStats,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(statistics, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error generating login statistics: ${error}`,
            },
          ],
        };
      }
    }
  );
}
