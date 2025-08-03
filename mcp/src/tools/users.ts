import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { db } from "../firebase.js";
import { UserDataType, Role } from "../types.js";

export function registerUserTools(server: McpServer) {
  server.tool(
    "get_user",
    "Get user data by ID",
    {
      userId: z.string().describe("The ID of the user to retrieve"),
    },
    async ({ userId }) => {
      try {
        const doc = await db.collection("users").doc(userId).get();
        if (!doc.exists) {
          return {
            content: [
              {
                type: "text",
                text: `User with ID ${userId} not found`,
              },
            ],
          };
        }
        const user = { id: doc.id, ...doc.data() } as UserDataType;
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(user, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching user: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "list_users_by_role",
    "List users by role",
    {
      role: z
        .enum(["superadmin", "admin", "member"])
        .describe("Filter users by role"),
      limit: z.number().optional().describe("Limit number of results"),
    },
    async ({ role, limit }) => {
      try {
        let query = db.collection("users").where("role", "==", role) as any;
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const snapshot = await query.get();
        const users = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        })) as UserDataType[];
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(users, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error listing users: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "list_all_users",
    "List all users with optional filters",
    {
      limit: z.number().optional().describe("Limit number of results"),
      excludeMembers: z.boolean().optional().describe("Exclude regular members (only show admins and superadmins)"),
    },
    async ({ limit, excludeMembers }) => {
      try {
        let query = db.collection("users") as any;
        
        if (excludeMembers) {
          query = query.where("role", "!=", "member");
        }
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const snapshot = await query.get();
        const users = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        })) as UserDataType[];
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(users, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error listing users: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "update_user_role",
    "Update a user's role",
    {
      userId: z.string().describe("The ID of the user to update"),
      role: z
        .enum(["superadmin", "admin", "member"])
        .describe("New role for the user"),
    },
    async ({ userId, role }) => {
      try {
        await db
          .collection("users")
          .doc(userId)
          .update({
            role,
            updatedAt: new Date(),
          });
        
        return {
          content: [
            {
              type: "text",
              text: `User ${userId} role updated to ${role}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error updating user role: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "create_user_profile",
    "Create or update a user profile",
    {
      userId: z.string().describe("The ID of the user"),
      publicName: z.string().optional().describe("User's public display name"),
      bio: z.string().optional().describe("User's bio"),
      linkedin: z.string().optional().describe("LinkedIn profile URL"),
      github: z.string().optional().describe("GitHub profile URL"),
      role: z
        .enum(["superadmin", "admin", "member"])
        .default("member")
        .describe("User's role"),
    },
    async ({ userId, publicName, bio, linkedin, github, role }) => {
      try {
        const userData = {
          publicName,
          bio,
          linkedin,
          github,
          role,
          updatedAt: new Date(),
          associations: {
            applications: [],
            registrations: [],
            collaborations: [],
          },
        };

        // Remove undefined fields
        Object.keys(userData).forEach(key => {
          const typedKey = key as keyof typeof userData;
          if (userData[typedKey] === undefined) {
            delete (userData as any)[typedKey];
          }
        });

        await db.collection("users").doc(userId).set(userData, { merge: true });
        
        return {
          content: [
            {
              type: "text",
              text: `User profile for ${userId} created/updated successfully`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating/updating user profile: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "get_user_associations",
    "Get a user's associations (applications, registrations, collaborations)",
    {
      userId: z.string().describe("The ID of the user"),
    },
    async ({ userId }) => {
      try {
        const doc = await db.collection("users").doc(userId).get();
        if (!doc.exists) {
          return {
            content: [
              {
                type: "text",
                text: `User with ID ${userId} not found`,
              },
            ],
          };
        }

        const userData = doc.data() as UserDataType;
        const associations = userData.associations || {
          applications: [],
          registrations: [],
          collaborations: [],
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(associations, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching user associations: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "add_user_association",
    "Add an association to a user (application, registration, or collaboration)",
    {
      userId: z.string().describe("The ID of the user"),
      associationType: z
        .enum(["applications", "registrations", "collaborations"])
        .describe("Type of association to add"),
      associationId: z.string().describe("The ID to associate with the user"),
    },
    async ({ userId, associationType, associationId }) => {
      try {
        const userRef = db.collection("users").doc(userId);
        const doc = await userRef.get();
        
        if (!doc.exists) {
          return {
            content: [
              {
                type: "text",
                text: `User with ID ${userId} not found`,
              },
            ],
          };
        }

        const userData = doc.data() as UserDataType;
        const associations = userData.associations || {
          applications: [],
          registrations: [],
          collaborations: [],
        };

        const currentAssociations = associations[associationType] || [];
        if (!currentAssociations.includes(associationId)) {
          currentAssociations.push(associationId);
          associations[associationType] = currentAssociations;
          
          await userRef.update({
            associations,
            updatedAt: new Date(),
          });
        }
        
        return {
          content: [
            {
              type: "text",
              text: `Association ${associationId} added to user ${userId} under ${associationType}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error adding user association: ${error}`,
            },
          ],
        };
      }
    }
  );
}