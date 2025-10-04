import Link from "next/link";

export default function FirebasePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Firebase Guide</h1>
        <p className="text-xl text-gray-300">
          Learn how we use Firebase for authentication, database, and storage
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <p className="text-gray-300">
          Firebase is Google's platform for building web and mobile applications. We use Firebase for authentication, database storage (Firestore), and file storage.
        </p>
        <p className="text-gray-300 mt-4">
          This guide will teach you <strong>exactly</strong> how we use Firebase in this project, even if you've never used Firebase before.
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">What is Firebase?</h2>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-gray-300 mb-4">
            Firebase is a Backend-as-a-Service (BaaS) that provides ready-to-use backend features:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li><strong className="text-blue-400">Authentication:</strong> User login/signup with email/password or Google</li>
            <li><strong className="text-blue-400">Firestore:</strong> NoSQL database to store data (users, teams, events, positions)</li>
            <li><strong className="text-blue-400">Storage:</strong> File storage for images, PDFs, resumes (like a CDN/bucket)</li>
            <li><strong className="text-blue-400">Cloud Functions:</strong> Serverless functions that run in the cloud</li>
          </ul>
          <p className="text-gray-300 mt-4">
            <strong>Best part?</strong> Firebase has a generous <strong className="text-green-400">free tier</strong>. We optimize our usage to stay within these limits.
          </p>
          <div className="bg-black/30 rounded p-4 mt-4">
            <p className="font-semibold mb-2">📚 Official Documentation:</p>
            <a href="https://firebase.google.com/docs" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Firebase Documentation
            </a>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">1. Firebase Authentication</h2>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">How Authentication Works</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Firebase Auth handles user login and signup. We support two methods:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-gray-400 ml-4">
                <li><strong>Email/Password:</strong> Traditional username and password</li>
                <li><strong>Google OAuth:</strong> "Sign in with Google" button</li>
              </ol>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">Authentication flow in our project:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-400 ml-4">
                <li>User logs in via the login form (<code className="bg-black/50 px-1 rounded">src/components/login-form.tsx</code>)</li>
                <li>Firebase authenticates them and returns a user object</li>
                <li>We store the auth state globally using React Context (<code className="bg-black/50 px-1 rounded">src/contexts/AuthContext.tsx</code>)</li>
                <li>Protected pages (like <code className="bg-black/50 px-1 rounded">/admin</code>) check if the user is logged in</li>
                <li>A service worker automatically adds the user's authentication token to requests</li>
              </ol>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Official Documentation:</p>
              <a href="https://firebase.google.com/docs/auth" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Firebase Authentication
              </a>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">Service Worker for Authentication</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                We use a service worker to handle authentication tokens automatically. This is important for <strong>Server-Side Rendering (SSR)</strong> with Firebase.
              </p>
            </div>

            <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded p-4">
              <p className="text-yellow-300 font-semibold mb-2">💡 What's a Service Worker?</p>
              <p className="text-gray-300">
                A service worker is a script that runs in the background of your browser. It can intercept network requests.
              </p>
              <p className="text-gray-300 mt-2">
                Think of it like a security guard who automatically adds your ID badge to every request you make.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">Why we need this:</p>
              <p className="text-gray-400">
                When using Next.js Server Components (pages that render on the server), the server needs to know who the user is. The service worker ensures the auth token is sent with every request, so the server can verify the user's identity.
              </p>
            </div>

            <div className="mb-4">
              <p className="text-gray-300">
                Our service worker is defined in <code className="bg-black/50 px-1 rounded">public/worker.template.js</code>.
              </p>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Official Documentation:</p>
              <a href="https://firebase.google.com/docs/auth/web/service-worker-sessions" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Service Worker Sessions
              </a>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">2. Firebase Firestore (Database)</h2>

        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-bold mb-3 text-red-400">⚠️ MOST IMPORTANT SECTION</h3>
          <p className="text-gray-300 text-lg">
            This is the <strong>most critical</strong> part of working with Firebase in our project. Read this carefully!
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">What is Firestore?</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Firestore is a NoSQL database that stores data in "collections" and "documents".
              </p>
              <p className="text-gray-300 mb-2">
                Think of it like this:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li><strong>Collection:</strong> A folder (e.g., "teams", "positions", "events")</li>
                <li><strong>Document:</strong> A file inside that folder (e.g., a specific team or position)</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">Example structure:</p>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`teams/ (collection)
  ├─ team-123/ (document)
  │   ├─ name: "Marketing Team"
  │   ├─ description: "Handles social media"
  │   └─ members: [...]
  └─ team-456/ (document)
      ├─ name: "Development Team"
      └─ ...`}
              </pre>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3 text-red-400">GOLDEN RULE: NEVER Fetch Directly from Firebase</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2 text-lg">
                <strong>RULE:</strong> You should <strong className="text-red-400">NEVER</strong> import and use Firestore functions (like <code className="bg-black/50 px-1 rounded">getDoc</code>, <code className="bg-black/50 px-1 rounded">getDocs</code>) directly in a page or component.
              </p>
            </div>

            <div className="mb-4">
              <p className="text-gray-300 mb-2 text-lg">
                <strong>INSTEAD:</strong> You <strong className="text-green-400">MUST</strong> use our <strong>Type Classes</strong> located in <code className="bg-black/50 px-1 rounded">src/app/types/</code>.
              </p>
            </div>

            <div className="mb-4 bg-black/30 rounded p-4">
              <p className="font-semibold mb-2 text-red-400">❌ WRONG (Don't do this):</p>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// DON'T DO THIS!
const teamDoc = await getDoc(doc(db, "teams", "team-123"));`}
              </pre>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2 text-green-400">✅ CORRECT (Do this):</p>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { Team } from "@/app/types/team";

// Always use the Type Class
const team = await Team.read("team-123");`}
              </pre>
            </div>

            <div className="mt-4">
              <p className="font-semibold mb-2">Why use Type Classes?</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li>Consistent structure for data</li>
                <li>Built-in CRUD operations (Create, Read, Update, Delete)</li>
                <li>Type safety with TypeScript</li>
                <li>Automatic timestamp handling</li>
                <li>Support for both client-side and server-side fetching</li>
                <li>Money-saving optimizations built-in</li>
              </ul>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">Understanding Type Classes</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Every data model (Team, Position, Event, etc.) has a corresponding <strong>Type Class</strong> in <code className="bg-black/50 px-1 rounded">src/app/types/</code>.
              </p>
              <p className="text-gray-300 mb-2">
                Let's break down a Type Class using <code className="bg-black/50 px-1 rounded">src/app/types/team/index.ts</code> as an example:
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-black/30 rounded p-4">
                <p className="font-semibold mb-2">Part 1: Type Definition</p>
                <p className="text-gray-400 text-sm mb-2">This defines the shape of the data (what fields exist and their types):</p>
                <pre className="text-sm text-gray-300 overflow-x-auto">
{`export type TeamType = {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};`}
                </pre>
              </div>

              <div className="bg-black/30 rounded p-4">
                <p className="font-semibold mb-2">Part 2: Class Implementation</p>
                <p className="text-gray-400 text-sm mb-2">The class implements methods to Create, Read, Update, and Delete data:</p>
                <pre className="text-sm text-gray-300 overflow-x-auto">
{`export class Team implements TeamType {
  // Properties (same as TeamType)
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Constructor - creates a new Team instance
  constructor(data: TeamType) { ... }

  // Converter - tells Firebase how to save/load data
  static converter = { ... };

  // CREATE: Add a new team to Firestore
  async create(): Promise<string> { ... }

  // READ: Get a single team by ID
  static async read(
    id: string,
    options?: { server?: boolean }
  ): Promise<Team | null> { ... }

  // READ ALL: Get all teams
  static async readAll(
    options?: { server?: boolean, public?: boolean }
  ): Promise<Team[]> { ... }

  // UPDATE: Update an existing team
  async update(): Promise<void> { ... }

  // DELETE: Delete a team
  async delete(): Promise<void> { ... }
}`}
                </pre>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">CRUD Operations Explained</h3>

            <p className="text-gray-300 mb-4">
              CRUD stands for <strong>C</strong>reate, <strong>R</strong>ead, <strong>U</strong>pdate, <strong>D</strong>elete — the four basic operations for any database.
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold mb-2 text-green-400">CREATE: Adding New Data</h4>
                <p className="text-gray-400 text-sm mb-2">When you want to add a new team, position, event, etc. to the database:</p>
                <div className="bg-black/30 rounded p-4">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { Team } from "@/app/types/team";
import { serverTimestamp, Timestamp } from "firebase/firestore";

// Create a new Team instance
const newTeam = new Team({
  id: "", // Will be auto-generated by Firebase
  name: "Marketing Team",
  description: "Handles social media and outreach",
  members: [],
  createdAt: serverTimestamp() as Timestamp,
  updatedAt: serverTimestamp() as Timestamp,
});

// Save it to Firestore (returns the generated ID)
const teamId = await newTeam.create();
console.log("Team created with ID:", teamId);`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-2 text-blue-400">READ: Getting Data (Single Item)</h4>
                <p className="text-gray-400 text-sm mb-2">When you want to get a specific team by its ID:</p>
                <div className="bg-black/30 rounded p-4 mb-3">
                  <p className="font-semibold mb-2">Client-side (in a React component with 'use client'):</p>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { Team } from "@/app/types/team";

const team = await Team.read("team-id-123");
if (team) {
  console.log(team.name); // "Marketing Team"
}`}
                  </pre>
                </div>
                <div className="bg-black/30 rounded p-4 mb-3">
                  <p className="font-semibold mb-2">Server-side (in a Server Component or API route):</p>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { Team } from "@/app/types/team";

const team = await Team.read("team-id-123", { server: true });`}
                  </pre>
                </div>
                <div className="bg-black/30 rounded p-4">
                  <p className="font-semibold mb-2">Public access (no authentication required):</p>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { Team } from "@/app/types/team";

const team = await Team.read("team-id-123", {
  server: true,
  public: true
});`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-2 text-blue-400">READ: Getting Data (All Items)</h4>
                <p className="text-gray-400 text-sm mb-2">When you want to get all teams:</p>
                <div className="bg-black/30 rounded p-4 mb-3">
                  <p className="font-semibold mb-2">Client-side:</p>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { Team } from "@/app/types/team";

const allTeams = await Team.readAll();
console.log(allTeams.length); // e.g., 5 teams`}
                  </pre>
                </div>
                <div className="bg-black/30 rounded p-4 mb-3">
                  <p className="font-semibold mb-2">Server-side:</p>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { Team } from "@/app/types/team";

const allTeams = await Team.readAll({ server: true });`}
                  </pre>
                </div>
                <div className="bg-black/30 rounded p-4">
                  <p className="font-semibold mb-2">Public access (IMPORTANT for SSR):</p>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { Team } from "@/app/types/team";

const allTeams = await Team.readAll({
  server: true,
  public: true
});`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-2 text-yellow-400">UPDATE: Modifying Existing Data</h4>
                <p className="text-gray-400 text-sm mb-2">When you want to change an existing team's data:</p>
                <div className="bg-black/30 rounded p-4">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { Team } from "@/app/types/team";

// First, get the team
const team = await Team.read("team-id-123");

if (team) {
  // Modify the properties
  team.name = "Updated Marketing Team";
  team.description = "New description here";

  // Save the changes to Firestore
  await team.update();
  console.log("Team updated!");
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-2 text-red-400">DELETE: Removing Data</h4>
                <p className="text-gray-400 text-sm mb-2">When you want to delete a team from the database:</p>
                <div className="bg-black/30 rounded p-4">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { Team } from "@/app/types/team";

// First, get the team
const team = await Team.read("team-id-123");

if (team) {
  // Delete it from Firestore
  await team.delete();
  console.log("Team deleted!");
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3 text-yellow-500">💰 The `public` Option: Saving Money</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Notice the <code className="bg-black/50 px-1 rounded">{`{ server: true, public: true }`}</code> option? This is <strong>crucial</strong> for understanding how we save money on Firebase.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">What's the difference?</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li><strong>Without <code className="bg-black/50 px-1 rounded">public: true</code>:</strong> Fetches require authentication (uses authenticated Firestore instance)</li>
                <li><strong>With <code className="bg-black/50 px-1 rounded">public: true</code>:</strong> Fetches data without authentication (uses public Firestore instance)</li>
              </ul>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">Why does this matter?</p>
              <p className="text-gray-300">
                Firebase charges based on the number of reads/writes. When we use <code className="bg-black/50 px-1 rounded">public: true</code>, we can cache the data more aggressively and serve it to users without checking authentication every time. This <strong>dramatically reduces costs</strong>.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2 text-green-400">✅ When to use <code className="bg-black/50 px-1 rounded">public: true</code>:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li>Data that rarely changes (team members, positions)</li>
                <li>Data that everyone can see (public events, project showcases)</li>
                <li>Pages that need to load quickly without authentication</li>
                <li>Server-Side Rendered pages (SSR)</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2 text-red-400">❌ When NOT to use it:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li>Admin pages</li>
                <li>User-specific data (applications, profiles)</li>
                <li>Data that changes frequently</li>
                <li>Sensitive information</li>
              </ul>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">Client vs Server Firestore</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                We have <strong>two separate Firestore libraries</strong>:
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-semibold text-blue-400 mb-2">1. Client Firestore (<code className="bg-black/50 px-1 rounded">src/lib/firebase/client/firestore.ts</code>)</p>
                <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                  <li>Runs in the browser</li>
                  <li>Used in Client Components (components with <code className="bg-black/50 px-1 rounded">'use client'</code>)</li>
                  <li>Requires Firebase to be initialized on the client</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-purple-400 mb-2">2. Server Firestore (<code className="bg-black/50 px-1 rounded">src/lib/firebase/server/firestore.ts</code>)</p>
                <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                  <li>Runs on the server (Next.js server or Edge Runtime)</li>
                  <li>Used in Server Components and API routes</li>
                  <li>Supports <code className="bg-black/50 px-1 rounded">public: true</code> option for unauthenticated access</li>
                  <li>Marked with <code className="bg-black/50 px-1 rounded">"use server"</code> at the top</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">The Type Classes automatically choose the right library:</p>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`// Uses client library (runs in browser)
const teams = await Team.readAll();

// Uses server library (runs on server)
const teams = await Team.readAll({ server: true });

// Uses server library with public access
const teams = await Team.readAll({ server: true, public: true });`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">3. Server-Side Rendering (SSR) with Firebase</h2>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">What is SSR and Why It Matters</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Next.js allows us to render pages on the server before sending them to the user. This is called <strong>Server-Side Rendering (SSR)</strong>.
              </p>
              <p className="text-gray-300 mb-2">
                When combined with Firebase, SSR has huge benefits:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li><strong>Faster page loads:</strong> Data is already loaded when the page is sent to the user</li>
                <li><strong>Better SEO:</strong> Search engines can see the content immediately</li>
                <li><strong>Lower Firebase costs:</strong> We can cache data and avoid repeated fetches</li>
              </ul>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">How We Use SSR with Firebase</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                We use SSR for pages that show data that <strong>rarely changes</strong>, such as:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li>Team members page (<code className="bg-black/50 px-1 rounded">/team</code>)</li>
                <li>Open positions page (<code className="bg-black/50 px-1 rounded">/positions</code>)</li>
                <li>Project showcase page (<code className="bg-black/50 px-1 rounded">/projects</code>)</li>
                <li>Public events page (<code className="bg-black/50 px-1 rounded">/events</code>)</li>
              </ul>
            </div>

            <div className="mb-4">
              <p className="text-gray-300">
                By rendering these pages on the server and using the <code className="bg-black/50 px-1 rounded">public: true</code> option, we can:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li>Fetch data once on the server</li>
                <li>Cache the result</li>
                <li>Serve the same page to all users without re-fetching</li>
              </ul>
              <p className="text-gray-300 mt-2">
                This keeps us well within Firebase's free tier!
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">Example: SSR Page with Firebase</h3>

            <div className="bg-black/30 rounded p-4 mb-4">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`// app/team/page.tsx (Server Component)
import { Team } from "@/app/types/team";

export default async function TeamPage() {
  // Fetch teams on the server with public access
  const teams = await Team.readAll({
    server: true,
    public: true
  });

  return (
    <div>
      <h1>Our Teams</h1>
      {teams.map((team) => (
        <div key={team.id}>
          <h2>{team.name}</h2>
          <p>{team.description}</p>
        </div>
      ))}
    </div>
  );
}`}
              </pre>
            </div>

            <div>
              <p className="font-semibold mb-2">What happens:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-400 ml-4">
                <li>Next.js runs this code on the server</li>
                <li><code className="bg-black/50 px-1 rounded">Team.readAll</code> uses the server Firestore library with public access</li>
                <li>Data is fetched from Firebase once</li>
                <li>The HTML is generated with the data already in it</li>
                <li>The HTML is sent to the user's browser</li>
                <li>No client-side Firebase fetching needed!</li>
              </ol>
            </div>

            <div className="bg-black/30 rounded p-4 mt-4">
              <p className="font-semibold mb-2">📚 Official Documentation:</p>
              <ul className="space-y-1">
                <li>
                  <a href="https://firebase.google.com/docs/web/ssr-apps" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    Firebase with SSR
                  </a>
                </li>
                <li>
                  <a href="https://firebase.google.com/docs/auth/web/service-worker-sessions" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    Service Worker Sessions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">4. Firebase Storage (File Uploads)</h2>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">What is Firebase Storage?</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Firebase Storage is like a file bucket or CDN where we store files like:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li>Profile pictures</li>
                <li>Event images</li>
                <li>Resumes (for job applications)</li>
                <li>PDFs (documents, resources)</li>
              </ul>
            </div>

            <div className="mb-4">
              <p className="text-gray-300">
                We use the client-side storage library (<code className="bg-black/50 px-1 rounded">src/lib/firebase/client/storage.ts</code>) for all storage operations.
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">Common Storage Operations</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold mb-2 text-green-400">Upload a File</h4>
                <div className="bg-black/30 rounded p-4">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { uploadFile } from "@/lib/firebase/client/storage";

const file = /* get file from input */;
const result = await uploadFile(file, "resumes/user-123.pdf");
console.log("File uploaded:", result.downloadURL);`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-2 text-blue-400">Get File URL</h4>
                <div className="bg-black/30 rounded p-4">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { getFileURL } from "@/lib/firebase/client/storage";

const url = await getFileURL("resumes/user-123.pdf");
console.log("Download URL:", url);`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-2 text-red-400">Delete a File</h4>
                <div className="bg-black/30 rounded p-4">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { deleteFile } from "@/lib/firebase/client/storage";

await deleteFile("resumes/user-123.pdf");`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-2 text-purple-400">List Files in a Directory</h4>
                <div className="bg-black/30 rounded p-4">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { listFiles } from "@/lib/firebase/client/storage";

const files = await listFiles("resumes");
console.log("Files:", files);`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-green-400">✅ Summary: Golden Rules</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300 text-lg ml-4">
          <li><strong className="text-red-400">NEVER fetch from Firebase directly in views</strong> — Always use the type classes in <code className="bg-black/50 px-1 rounded">src/app/types/</code></li>
          <li><strong>Learn the type classes</strong> — Understanding how to use them for CRUD is crucial</li>
          <li><strong>Use SSR for static pages</strong> — Pages like <code className="bg-black/50 px-1 rounded">/team</code> and <code className="bg-black/50 px-1 rounded">/positions</code> should use <code className="bg-black/50 px-1 rounded">{`{ server: true, public: true }`}</code></li>
          <li><strong>Use <code className="bg-black/50 px-1 rounded">public: true</code> when possible</strong> — Reduces Firebase costs by allowing aggressive caching</li>
          <li><strong>Storage is for files</strong> — Use Firebase Storage for images, PDFs, resumes, etc.</li>
        </ol>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">📋 Quick Reference Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 px-4">What</th>
                <th className="py-2 px-4">Where</th>
                <th className="py-2 px-4">When to Use</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-white/5">
                <td className="py-2 px-4">Type Classes</td>
                <td className="py-2 px-4"><code className="bg-black/50 px-1 rounded">src/app/types/</code></td>
                <td className="py-2 px-4">Always (for all Firebase data operations)</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-4">Client Firestore</td>
                <td className="py-2 px-4"><code className="bg-black/50 px-1 rounded">src/lib/firebase/client/firestore.ts</code></td>
                <td className="py-2 px-4">Client Components only</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-4">Server Firestore</td>
                <td className="py-2 px-4"><code className="bg-black/50 px-1 rounded">src/lib/firebase/server/firestore.ts</code></td>
                <td className="py-2 px-4">Server Components, API routes</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-4">Storage</td>
                <td className="py-2 px-4"><code className="bg-black/50 px-1 rounded">src/lib/firebase/client/storage.ts</code></td>
                <td className="py-2 px-4">File uploads/downloads</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-4">Auth Context</td>
                <td className="py-2 px-4"><code className="bg-black/50 px-1 rounded">src/contexts/AuthContext.tsx</code></td>
                <td className="py-2 px-4">Check if user is logged in</td>
              </tr>
              <tr>
                <td className="py-2 px-4">Service Worker</td>
                <td className="py-2 px-4"><code className="bg-black/50 px-1 rounded">public/worker.template.js</code></td>
                <td className="py-2 px-4">Automatic auth token handling</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🚀 Next Steps</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
          <li>Explore the existing type classes in <code className="bg-black/50 px-1 rounded">src/app/types/</code></li>
          <li>Practice creating, reading, updating, and deleting data using these classes</li>
          <li>Understand when to use <code className="bg-black/50 px-1 rounded">{`{ server: true }`}</code> vs client-side fetching</li>
          <li>Understand when to use <code className="bg-black/50 px-1 rounded">{`{ public: true }`}</code> to save costs</li>
        </ol>
        <p className="text-gray-300 mt-4">
          If you follow these patterns, you'll write clean, efficient, and cost-effective Firebase code!
        </p>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-white/10">
        <Link href="/docs/backend" className="text-blue-400 hover:underline">
          ← Backend Guide
        </Link>
        <Link
          href="/docs/deployment"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Next: Deployment Guide →
        </Link>
      </div>
    </div>
  );
}
