import Link from "next/link";

export default function MCPPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">MCP Server</h1>
        <p className="text-xl text-gray-300">
          Direct database access using Model Context Protocol
        </p>
      </div>

      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
        <p className="text-gray-300">
          We have a Model Context Protocol (MCP) server that lets you interact with our Firebase database directly from Claude Code or other MCP-compatible tools.
        </p>
      </div>

      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-red-400">⚠️ CRITICAL WARNING</h2>
        <div className="space-y-3 text-gray-300">
          <p className="font-bold text-red-400">
            This MCP server uses <strong>PRODUCTION</strong> data!
          </p>
          <p>
            Be extremely careful when using this server. Any changes you make will affect the live website and real user data.
          </p>
          <p className="font-bold">
            You should primarily use this for <strong>reading data</strong>.
          </p>
          <p>
            While write operations (Create, Update, Delete) are available, <strong>don't go crazy with them</strong>. Only make changes when absolutely necessary and you know what you're doing.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">What is MCP?</h2>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-gray-300 mb-4">
            Model Context Protocol (MCP) is a standard protocol that allows AI assistants like Claude to interact with external tools and data sources.
          </p>
          <p className="text-gray-300 mb-4">
            Our MCP server exposes Firebase operations (CRUD) so you can query and manipulate the database directly through Claude Code.
          </p>
          <div className="bg-black/30 rounded p-4">
            <p className="font-semibold mb-2">📚 Learn more about MCP:</p>
            <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Model Context Protocol Documentation
            </a>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">Setup for Claude Code</h2>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-gray-300 mb-4">
            To use the MCP server with Claude Code, add this configuration to your Claude Code settings:
          </p>

          <div className="bg-black/50 rounded p-4">
            <p className="font-semibold mb-2">Configuration:</p>
            <pre className="text-sm text-gray-300 overflow-x-auto">
{`{
  "mcpServers": {
    "gdg-website": {
      "command": "/path/to/node",
      "args": ["/Users/your-username/Documents/gdg-website/mcp/build/index.js"],
      "env": {
        "NODE_ENV": "development",
        "FIREBASE_PROJECT_ID": "your-project-id",
        "FIREBASE_CLIENT_EMAIL": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
        "FIREBASE_PRIVATE_KEY": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
      }
    }
  }
}`}
            </pre>
          </div>

          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded p-4">
            <p className="font-semibold text-yellow-500 mb-2">Important notes:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Replace <code className="bg-black/50 px-1 rounded">/path/to/node</code> with your Node.js binary path</li>
              <li>Update the path to <code className="bg-black/50 px-1 rounded">mcp/build/index.js</code> to match your local setup</li>
              <li>Get Firebase credentials from the project owner (Albert)</li>
              <li>The <code className="bg-black/50 px-1 rounded">FIREBASE_PRIVATE_KEY</code> must have <code className="bg-black/50 px-1 rounded">\\n</code> escaped as shown</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">What You Can Do</h2>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-gray-300 mb-4">
            Once configured, you can perform CRUD operations on the Firebase database:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-2 text-green-400">✅ Safe Operations (Recommended)</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                <li><strong>Read:</strong> Query teams, positions, events, users</li>
                <li><strong>List:</strong> Get all documents from a collection</li>
                <li><strong>Debug:</strong> Inspect data structure and relationships</li>
                <li><strong>Verify:</strong> Check if data exists or validate database state</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-yellow-400">⚠️ Use with Caution</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                <li><strong>Create:</strong> Add new documents (make sure they're valid!)</li>
                <li><strong>Update:</strong> Modify existing documents</li>
                <li><strong>Delete:</strong> Remove documents (this is permanent!)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">Best Practices</h2>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <ul className="space-y-3 text-gray-300">
            <li>
              <strong className="text-blue-400">1. Read First, Write Later</strong>
              <p className="ml-4 text-gray-400">Always query and inspect data before making any changes.</p>
            </li>
            <li>
              <strong className="text-blue-400">2. Test Locally First</strong>
              <p className="ml-4 text-gray-400">If possible, test your operations on local/development data before touching production.</p>
            </li>
            <li>
              <strong className="text-blue-400">3. Small Changes</strong>
              <p className="ml-4 text-gray-400">Make small, incremental changes rather than bulk operations.</p>
            </li>
            <li>
              <strong className="text-blue-400">4. Verify After Writing</strong>
              <p className="ml-4 text-gray-400">After creating, updating, or deleting, read the data back to confirm the operation succeeded correctly.</p>
            </li>
            <li>
              <strong className="text-blue-400">5. Ask for Help</strong>
              <p className="ml-4 text-gray-400">If you're unsure about an operation, ask Albert or another team member first.</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">📂 MCP Server Location</h2>
        <p className="text-gray-300 mb-2">The MCP server code lives at:</p>
        <p className="font-mono text-sm text-gray-300"><code className="bg-black/50 px-2 py-1 rounded">mcp/</code> directory in the project root</p>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-white/10">
        <Link href="/docs/deployment" className="text-blue-400 hover:underline">
          ← Deployment Guide
        </Link>
        <Link
          href="/docs/contributing"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Next: Contributing →
        </Link>
      </div>
    </div>
  );
}
