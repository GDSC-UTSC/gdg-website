import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { db } from "../firebase.js";
import { PositionType, ApplicationType } from "../types.js";

export function registerPositionTools(server: McpServer) {
  server.tool(
    "get_position",
    "Get a single position by ID",
    {
      positionId: z.string().describe("The ID of the position to retrieve"),
    },
    async ({ positionId }) => {
      try {
        const doc = await db.collection("positions").doc(positionId).get();
        if (!doc.exists) {
          return {
            content: [
              {
                type: "text",
                text: `Position with ID ${positionId} not found`,
              },
            ],
          };
        }
        const position = { id: doc.id, ...doc.data() } as PositionType;
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(position, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching position: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "list_positions",
    "List all positions with optional status filter",
    {
      status: z
        .enum(["draft", "active", "inactive"])
        .optional()
        .describe("Filter positions by status"),
      limit: z.number().optional().describe("Limit number of results"),
    },
    async ({ status, limit }) => {
      try {
        let query = db.collection("positions") as any;
        
        if (status) {
          query = query.where("status", "==", status);
        }
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const snapshot = await query.get();
        const positions = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        })) as PositionType[];
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(positions, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error listing positions: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "create_position",
    "Create a new position",
    {
      name: z.string().describe("Position name"),
      description: z.string().describe("Position description"),
      tags: z.array(z.string()).describe("Position tags"),
      status: z
        .enum(["draft", "active", "inactive"])
        .default("draft")
        .describe("Position status"),
    },
    async ({ name, description, tags, status }) => {
      try {
        const positionData = {
          name,
          description,
          tags,
          status,
          questions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        const docRef = await db.collection("positions").add(positionData);
        
        return {
          content: [
            {
              type: "text",
              text: `Position created successfully with ID: ${docRef.id}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating position: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "update_position_status",
    "Update a position's status",
    {
      positionId: z.string().describe("The ID of the position to update"),
      status: z
        .enum(["draft", "active", "inactive"])
        .describe("New status for the position"),
    },
    async ({ positionId, status }) => {
      try {
        await db
          .collection("positions")
          .doc(positionId)
          .update({
            status,
            updatedAt: new Date(),
          });
        
        return {
          content: [
            {
              type: "text",
              text: `Position ${positionId} status updated to ${status}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error updating position status: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "get_applications_by_position",
    "Get all applications for a specific position",
    {
      positionId: z.string().describe("The ID of the position"),
    },
    async ({ positionId }) => {
      try {
        const snapshot = await db
          .collection("positions")
          .doc(positionId)
          .collection("applications")
          .get();
        
        const applications = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        })) as ApplicationType[];
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(applications, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching applications: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "update_application_status",
    "Update an application's status",
    {
      positionId: z.string().describe("The ID of the position"),
      applicationId: z.string().describe("The ID of the application"),
      status: z
        .enum(["pending", "accepted", "rejected"])
        .describe("New status for the application"),
    },
    async ({ positionId, applicationId, status }) => {
      try {
        await db
          .collection("positions")
          .doc(positionId)
          .collection("applications")
          .doc(applicationId)
          .update({
            status,
            updatedAt: new Date(),
          });
        
        return {
          content: [
            {
              type: "text",
              text: `Application ${applicationId} status updated to ${status}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error updating application status: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "get_application",
    "Get a specific application by position and application ID",
    {
      positionId: z.string().describe("The ID of the position"),
      applicationId: z.string().describe("The ID of the application"),
    },
    async ({ positionId, applicationId }) => {
      try {
        const doc = await db
          .collection("positions")
          .doc(positionId)
          .collection("applications")
          .doc(applicationId)
          .get();
        
        if (!doc.exists) {
          return {
            content: [
              {
                type: "text",
                text: `Application with ID ${applicationId} not found for position ${positionId}`,
              },
            ],
          };
        }
        
        const application = { id: doc.id, ...doc.data() } as ApplicationType;
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(application, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching application: ${error}`,
            },
          ],
        };
      }
    }
  );
}