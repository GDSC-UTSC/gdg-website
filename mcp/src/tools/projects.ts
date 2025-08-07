import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { db } from "../firebase.js";
import { ProjectType } from "../types.js";

export function registerProjectTools(server: McpServer) {
  server.tool(
    "get_project",
    "Get a single project by ID",
    {
      projectId: z.string().describe("The ID of the project to retrieve"),
    },
    async ({ projectId }) => {
      try {
        const doc = await db.collection("projects").doc(projectId).get();
        if (!doc.exists) {
          return {
            content: [
              {
                type: "text",
                text: `Project with ID ${projectId} not found`,
              },
            ],
          };
        }
        const project = { id: doc.id, ...doc.data() } as ProjectType;
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(project, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching project: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "list_projects",
    "List all projects with optional filters",
    {
      limit: z.number().optional().describe("Limit number of results"),
      language: z.string().optional().describe("Filter by programming language"),
    },
    async ({ limit, language }) => {
      try {
        let query = db.collection("projects") as any;
        
        if (language) {
          query = query.where("languages", "array-contains", language);
        }
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const snapshot = await query.get();
        const projects = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        })) as ProjectType[];
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(projects, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error listing projects: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "create_project",
    "Create a new project",
    {
      title: z.string().describe("Project title"),
      description: z.string().describe("Project description"),
      languages: z.array(z.string()).optional().describe("Programming languages used"),
      contributors: z.array(z.string()).optional().describe("Project contributors"),
      link: z.string().optional().describe("Project link/repository"),
    },
    async ({ title, description, languages, contributors, link }) => {
      try {
        const projectData = {
          title,
          description,
          languages: languages || [],
          contributors: contributors || [],
          link,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        const docRef = await db.collection("projects").add(projectData);
        
        return {
          content: [
            {
              type: "text",
              text: `Project created successfully with ID: ${docRef.id}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating project: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "update_project",
    "Update an existing project",
    {
      projectId: z.string().describe("The ID of the project to update"),
      title: z.string().optional().describe("Project title"),
      description: z.string().optional().describe("Project description"),
      languages: z.array(z.string()).optional().describe("Programming languages used"),
      contributors: z.array(z.string()).optional().describe("Project contributors"),
      link: z.string().optional().describe("Project link/repository"),
    },
    async ({ projectId, title, description, languages, contributors, link }) => {
      try {
        const updateData: any = {
          updatedAt: new Date(),
        };

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (languages !== undefined) updateData.languages = languages;
        if (contributors !== undefined) updateData.contributors = contributors;
        if (link !== undefined) updateData.link = link;

        await db.collection("projects").doc(projectId).update(updateData);
        
        return {
          content: [
            {
              type: "text",
              text: `Project ${projectId} updated successfully`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error updating project: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "delete_project",
    "Delete a project",
    {
      projectId: z.string().describe("The ID of the project to delete"),
    },
    async ({ projectId }) => {
      try {
        await db.collection("projects").doc(projectId).delete();
        
        return {
          content: [
            {
              type: "text",
              text: `Project ${projectId} deleted successfully`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error deleting project: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "add_contributor_to_project",
    "Add a contributor to a project",
    {
      projectId: z.string().describe("The ID of the project"),
      contributorId: z.string().describe("The ID of the contributor to add"),
    },
    async ({ projectId, contributorId }) => {
      try {
        const projectRef = db.collection("projects").doc(projectId);
        const doc = await projectRef.get();
        
        if (!doc.exists) {
          return {
            content: [
              {
                type: "text",
                text: `Project with ID ${projectId} not found`,
              },
            ],
          };
        }

        const projectData = doc.data() as ProjectType;
        const contributors = projectData.contributors || [];
        
        if (!contributors.includes(contributorId)) {
          contributors.push(contributorId);
          await projectRef.update({
            contributors,
            updatedAt: new Date(),
          });
        }
        
        return {
          content: [
            {
              type: "text",
              text: `Contributor ${contributorId} added to project ${projectId}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error adding contributor: ${error}`,
            },
          ],
        };
      }
    }
  );
}