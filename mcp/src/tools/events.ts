import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { db } from "../firebase.js";
import { EventType, RegistrationType } from "../types.js";

export function registerEventTools(server: McpServer) {
  server.tool(
    "get_event",
    "Get a single event by ID",
    {
      eventId: z.string().describe("The ID of the event to retrieve"),
    },
    async ({ eventId }) => {
      try {
        const doc = await db.collection("events").doc(eventId).get();
        if (!doc.exists) {
          return {
            content: [
              {
                type: "text",
                text: `Event with ID ${eventId} not found`,
              },
            ],
          };
        }
        const event = { id: doc.id, ...doc.data() } as EventType;
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(event, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching event: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "list_events",
    "List all events with optional status filter",
    {
      status: z
        .enum(["upcoming", "ongoing", "completed", "cancelled", "closed"])
        .optional()
        .describe("Filter events by status"),
      limit: z.number().optional().describe("Limit number of results"),
    },
    async ({ status, limit }) => {
      try {
        let query = db.collection("events") as any;
        
        if (status) {
          query = query.where("status", "==", status);
        }
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const snapshot = await query.get();
        const events = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        })) as EventType[];
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(events, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error listing events: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "create_event",
    "Create a new event",
    {
      title: z.string().describe("Event title"),
      description: z.string().describe("Event description"),
      eventDate: z.string().describe("Event date (ISO string)"),
      startTime: z.string().optional().describe("Start time"),
      endTime: z.string().optional().describe("End time"),
      location: z.string().optional().describe("Event location"),
      status: z
        .enum(["upcoming", "ongoing", "completed", "cancelled", "closed"])
        .default("upcoming")
        .describe("Event status"),
    },
    async ({ title, description, eventDate, startTime, endTime, location, status }) => {
      try {
        const eventData = {
          title,
          description,
          eventDate: new Date(eventDate),
          startTime,
          endTime,
          location,
          status,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        const docRef = await db.collection("events").add(eventData);
        
        return {
          content: [
            {
              type: "text",
              text: `Event created successfully with ID: ${docRef.id}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating event: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "update_event_status",
    "Update an event's status",
    {
      eventId: z.string().describe("The ID of the event to update"),
      status: z
        .enum(["upcoming", "ongoing", "completed", "cancelled", "closed"])
        .describe("New status for the event"),
    },
    async ({ eventId, status }) => {
      try {
        await db
          .collection("events")
          .doc(eventId)
          .update({
            status,
            updatedAt: new Date(),
          });
        
        return {
          content: [
            {
              type: "text",
              text: `Event ${eventId} status updated to ${status}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error updating event status: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "get_event_registrations",
    "Get all registrations for a specific event",
    {
      eventId: z.string().describe("The ID of the event"),
    },
    async ({ eventId }) => {
      try {
        const snapshot = await db
          .collection("events")
          .doc(eventId)
          .collection("registrations")
          .get();
        
        const registrations = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        })) as RegistrationType[];
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(registrations, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching registrations: ${error}`,
            },
          ],
        };
      }
    }
  );
}