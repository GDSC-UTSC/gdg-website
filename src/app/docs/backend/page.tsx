import Link from "next/link";

export default function BackendPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Backend Development</h1>
        <p className="text-xl text-gray-300">
          Learn how our server-side code works with Next.js
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <p className="text-gray-300">
          The backend is where we process data, verify users, and talk to Firebase. Unlike traditional backends, we use Next.js for both frontend and backend — it's a full-stack framework.
        </p>
        <p className="text-gray-300 mt-4">
          Make sure you understand <Link href="/docs/prereqs" className="text-blue-400 hover:underline">Prerequisites</Link> and <Link href="/docs/frontend" className="text-blue-400 hover:underline">Frontend</Link> first.
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">Backend Architecture</h2>

        <div className="space-y-6">
          {/* Server Components */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">1. React Server Components</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> Server Components are React components that run on the server (not in the browser).
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> Server Components let us fetch data from Firebase before sending the page to the user. This makes pages load faster and reduces Firebase costs.
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">Key difference:</strong> By default, components in <code className="bg-black/50 px-1 rounded">app/</code> are Server Components. Add <code className="bg-black/50 px-1 rounded">'use client'</code> at the top to make them Client Components.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">What to focus on:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Server Components run on the server, Client Components run in the browser</li>
                <li>Server Components can directly access databases (Firebase) without API routes</li>
                <li>Use Client Components when you need interactivity (<code className="bg-black/50 px-1 rounded">useState</code>, <code className="bg-black/50 px-1 rounded">onClick</code>, etc.)</li>
                <li>Server Components are async by default — you can use <code className="bg-black/50 px-1 rounded">await</code> directly</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4 mb-4">
              <p className="font-semibold mb-2">Example from our codebase:</p>
              <p className="text-sm text-gray-300 mb-2">Check <code className="bg-black/50 px-1 rounded">src/app/team/page.tsx</code> — here's how we fetch teams on the server:</p>
              <pre className="text-sm text-gray-300 overflow-x-auto bg-black/50 p-3 rounded mt-2">
{`// src/app/team/page.tsx
import { Team } from "@/app/types/team";

export default async function TeamPage() {
  const teams = await Team.readAll({
    server: true,
    public: true
  });

  return <div>{/* render teams */}</div>;
}`}
              </pre>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Official Documentation:</p>
              <a href="https://nextjs.org/docs/app/building-your-application/rendering/server-components" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Next.js — Server Components
              </a>
            </div>
          </div>

          {/* API Routes */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">2. API Routes</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> API routes are server-side endpoints that handle HTTP requests (GET, POST, PUT, DELETE).
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> API routes let us create backend endpoints for actions like creating events, submitting applications, or verifying admin permissions.
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">Location:</strong> API routes live in <code className="bg-black/50 px-1 rounded">src/app/api/</code> with a <code className="bg-black/50 px-1 rounded">route.ts</code> file.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">What to focus on:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>How to create a <code className="bg-black/50 px-1 rounded">route.ts</code> file</li>
                <li>Export functions named <code className="bg-black/50 px-1 rounded">GET</code>, <code className="bg-black/50 px-1 rounded">POST</code>, <code className="bg-black/50 px-1 rounded">PUT</code>, <code className="bg-black/50 px-1 rounded">DELETE</code></li>
                <li>How to read request data (<code className="bg-black/50 px-1 rounded">request.json()</code>)</li>
                <li>How to return responses (<code className="bg-black/50 px-1 rounded">NextResponse.json()</code>)</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4 mb-4">
              <p className="font-semibold mb-2">Examples from our codebase:</p>
              <p className="text-sm text-gray-300 mb-2">Check <code className="bg-black/50 px-1 rounded">src/app/api/</code> — here's an example API route structure:</p>
              <pre className="text-sm text-gray-300 overflow-x-auto bg-black/50 p-3 rounded mt-2">
{`// src/app/api/example/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Fetch data from Firebase
  return NextResponse.json({ data: "..." });
}

export async function POST(request: Request) {
  const body = await request.json();
  // Process and save to Firebase
  return NextResponse.json({ success: true });
}`}
              </pre>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Official Documentation:</p>
              <a href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Next.js — Route Handlers
              </a>
            </div>
          </div>

          {/* Middleware */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">3. Middleware for Protected Routes</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> Middleware is code that runs <em>before</em> a request reaches your page or API route.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> We use middleware to protect admin routes. It checks if the user is logged in and has admin permissions before allowing access.
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">Location:</strong> Our middleware is in <code className="bg-black/50 px-1 rounded">src/middleware.ts</code>
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">How it works:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-400">
                <li>User visits <code className="bg-black/50 px-1 rounded">/admin</code></li>
                <li>Middleware intercepts the request</li>
                <li>Checks Firebase Auth token from service worker</li>
                <li>Calls Firebase Cloud Function to verify admin status</li>
                <li>Either allows access or redirects to login</li>
              </ol>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Official Documentation:</p>
              <a href="https://nextjs.org/docs/app/building-your-application/routing/middleware" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Next.js — Middleware
              </a>
            </div>
          </div>

          {/* Edge Runtime */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">4. Edge Runtime</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> The Edge Runtime is a lightweight JavaScript environment that runs our backend code globally on servers close to users.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> Instead of one server in one location, our backend runs on a global network (via Vercel). This makes our app fast for users anywhere in the world.
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">Important:</strong> The Edge Runtime has limitations — no file system, no sockets, limited Node.js APIs.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">What you need to know:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Our routes run on the Edge by default</li>
                <li>Can't use Node.js features like <code className="bg-black/50 px-1 rounded">fs</code> (file system)</li>
                <li>Can't use WebSockets or long-running processes</li>
                <li>Focus on stateless, fast request-response patterns</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Official Documentation:</p>
              <a href="https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Next.js — Edge and Node.js Runtimes
              </a>
            </div>
          </div>

          {/* Firebase Cloud Functions */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">5. Firebase Cloud Functions</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> Cloud Functions are serverless backend functions that run on Google's infrastructure.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> Some operations need to run on Firebase's servers (like setting custom user claims for admin permissions). Cloud Functions let us do this securely.
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">Example:</strong> Our <code className="bg-black/50 px-1 rounded">checkAdminClaims</code> function verifies if a user is an admin.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">When to use Cloud Functions:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Setting custom user claims (admin status)</li>
                <li>Scheduled jobs (daily cleanup, email reminders)</li>
                <li>Database triggers (auto-update timestamps)</li>
                <li>Operations that require Firebase Admin SDK</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Official Documentation:</p>
              <a href="https://firebase.google.com/docs/functions" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Firebase — Cloud Functions
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">🎯 When to Use What</h2>
        <div className="space-y-4 text-gray-300">
          <div>
            <p className="font-bold">Use Server Components when:</p>
            <ul className="list-disc list-inside ml-4 text-gray-400">
              <li>You need to fetch data before rendering a page</li>
              <li>You want to reduce client-side JavaScript</li>
              <li>The data doesn't need to be interactive</li>
            </ul>
          </div>
          <div>
            <p className="font-bold">Use API Routes when:</p>
            <ul className="list-disc list-inside ml-4 text-gray-400">
              <li>You need to handle form submissions</li>
              <li>You want a dedicated endpoint for client-side fetching</li>
              <li>You need to perform mutations (create, update, delete)</li>
            </ul>
          </div>
          <div>
            <p className="font-bold">Use Firebase Cloud Functions when:</p>
            <ul className="list-disc list-inside ml-4 text-gray-400">
              <li>You need Firebase Admin SDK features</li>
              <li>You want scheduled jobs or database triggers</li>
              <li>Operations must run on Firebase's infrastructure</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">📂 Where Backend Code Lives</h2>
        <div className="space-y-2 text-gray-300 font-mono text-sm">
          <p><code className="bg-black/50 px-2 py-1 rounded">src/app/api/</code> — API routes (route.ts files)</p>
          <p><code className="bg-black/50 px-2 py-1 rounded">src/middleware.ts</code> — Middleware for protected routes</p>
          <p><code className="bg-black/50 px-2 py-1 rounded">src/app/types/</code> — Type classes with Firebase CRUD operations</p>
          <p><code className="bg-black/50 px-2 py-1 rounded">functions/</code> — Firebase Cloud Functions (separate project)</p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-white/10">
        <Link href="/docs/frontend" className="text-blue-400 hover:underline">
          ← Frontend Guide
        </Link>
        <Link
          href="/docs/firebase"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Next: Firebase Guide →
        </Link>
      </div>
    </div>
  );
}
