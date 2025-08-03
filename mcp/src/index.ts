#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import tool registration functions
import {
  registerEventTools,
  registerPositionTools,
  registerProjectTools,
  registerUserTools,
} from "./tools/index.js";

// Create server instance
const server = new McpServer({
  name: "gdg-website",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register all tools
registerEventTools(server);
registerPositionTools(server);
registerProjectTools(server);
registerUserTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("error is ", error);
  process.exit(1);
});