import Link from "next/link";

export default function CloudFunctionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Cloud Functions</h1>
        <p className="text-xl text-gray-300">
          Learn about our Firebase Cloud Functions architecture
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <p className="text-gray-300">
          Cloud Functions are serverless backend functions that run on Firebase infrastructure. We use them for operations that require Firebase Admin SDK privileges or need to respond to database events.
        </p>
        <p className="text-gray-300 mt-4">
          Located in <code className="bg-black/50 px-1 rounded">functions/src/</code>
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">Function Types</h2>

        <div className="space-y-6">
          {/* HTTP Request Functions */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">1. HTTP Request Functions</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> HTTP functions that respond to web requests, similar to API routes but running on Firebase.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Location:</strong> <code className="bg-black/50 px-1 rounded">functions/src/requests.ts</code>
              </p>
            </div>

            {/* checkAdminClaims Section */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-5 mb-4">
              <h4 className="text-xl font-bold mb-3 text-purple-400">checkAdminClaims Function</h4>

              <div className="mb-4">
                <p className="text-gray-300 mb-2">
                  <strong className="text-blue-400">Purpose:</strong> Verifies if a user has admin or super admin permissions by checking their custom claims.
                </p>
                <p className="text-gray-300 mb-2">
                  <strong className="text-blue-400">Why it exists:</strong> Vercel Edge Runtime (where our middleware runs) cannot use Firebase Admin SDK. We need a separate Cloud Function to verify admin status.
                </p>
              </div>

              <div className="bg-black/30 rounded p-4 mb-4">
                <p className="font-semibold mb-2">How it works:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-400">
                  <li>Receives POST request with user's ID token</li>
                  <li>Uses Firebase Admin SDK to verify token</li>
                  <li>Extracts custom claims (<code className="bg-black/50 px-1 rounded">admin</code>, <code className="bg-black/50 px-1 rounded">superadmin</code>)</li>
                  <li>Returns admin status to caller</li>
                </ol>
              </div>

              <div className="bg-black/30 rounded p-4 mb-4">
                <p className="font-semibold mb-2">Implementation:</p>
                <pre className="text-sm text-gray-300 overflow-x-auto bg-black/50 p-3 rounded mt-2">
{`// functions/src/requests.ts
export const checkAdminClaims = onRequest(async (request, response) => {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { token } = request.body;

  if (!token) {
    response.status(400).json({ error: "Token is required" });
    return;
  }

  const decodedToken = await admin.auth().verifyIdToken(token);
  response.json({
    isAdmin: decodedToken.admin || false,
    isSuperAdmin: decodedToken.superadmin || false,
    uid: decodedToken.uid,
  });
});`}
                </pre>
              </div>

              <div className="bg-black/30 rounded p-4">
                <p className="font-semibold mb-2">Used in Middleware:</p>
                <p className="text-sm text-gray-300 mb-2">
                  Our middleware (<code className="bg-black/50 px-1 rounded">src/middleware.ts</code>) calls this function to protect admin routes:
                </p>
                <pre className="text-sm text-gray-300 overflow-x-auto bg-black/50 p-3 rounded mt-2">
{`// src/middleware.ts
export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.redirect(new URL("/account/login", request.url));
  }

  const token = await user.getIdToken();

  // Call Cloud Function to verify admin status
  const response = await fetch(
    new URL(process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL! + "/checkAdminClaims"),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }
  );

  const { isAdmin, isSuperAdmin } = await response.json();

  if (!isAdmin && !isSuperAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}`}
                </pre>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="font-bold text-yellow-500 mb-2">⚠️ Why Not Use Admin SDK in Middleware?</p>
              <p className="text-gray-300 text-sm">
                Vercel Edge Runtime is a lightweight JavaScript environment that doesn't support Node.js features required by Firebase Admin SDK. Cloud Functions run on Google's infrastructure with full Node.js support, making them perfect for admin operations.
              </p>
            </div>
          </div>

          {/* Firestore Triggers */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">2. Firestore Triggers (Observer Pattern)</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> Functions that automatically run when Firestore documents are created, updated, or deleted.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Pattern:</strong> <a href="https://refactoring.guru/design-patterns/observer" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Observer Pattern</a> — these functions "observe" database changes and react automatically.
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">Location:</strong> <code className="bg-black/50 px-1 rounded">functions/src/triggers.ts</code>
              </p>
            </div>

            <div className="bg-black/30 rounded p-4 mb-4">
              <p className="font-semibold mb-2">Observer Pattern Explained:</p>
              <p className="text-gray-300 text-sm mb-3">
                The Observer Pattern defines a one-to-many dependency: when one object (the "subject") changes state, all dependent objects (the "observers") are notified and updated automatically.
              </p>
              <div className="bg-black/50 p-3 rounded">
                <p className="text-gray-400 text-sm mb-2"><strong>In our case:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm ml-4">
                  <li><strong>Subject:</strong> Firestore documents (applications, registrations, collaborations)</li>
                  <li><strong>Observers:</strong> Cloud Functions that watch for changes</li>
                  <li><strong>Notification:</strong> Automatic function execution when documents change</li>
                  <li><strong>Action:</strong> Update related user documents with new associations</li>
                </ul>
              </div>
            </div>

            {/* Example Triggers */}
            <div className="space-y-4">
              <div className="bg-black/30 rounded p-4">
                <p className="font-semibold mb-2">Example 1: Application Trigger</p>
                <p className="text-sm text-gray-300 mb-2">
                  When a user applies to a position, automatically add the position ID to their profile:
                </p>
                <pre className="text-sm text-gray-300 overflow-x-auto bg-black/50 p-3 rounded mt-2">
{`// functions/src/triggers.ts
export const createApplication = onDocumentWritten(
  "positions/{positionId}/applications/{applicationId}",
  async (event: any) => {
    const positionId = event.params.positionId;
    const userId = event.params.applicationId;

    await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .update({
        "associations.applications": FieldValue.arrayUnion(positionId),
      });
  }
);`}
                </pre>
                <p className="text-xs text-gray-400 mt-2">
                  <strong>Observed:</strong> <code className="bg-black/50 px-1 rounded">positions/{'{positionId}'}/applications/{'{applicationId}'}</code>
                  <br />
                  <strong>Action:</strong> Update user's applications array
                </p>
              </div>

              <div className="bg-black/30 rounded p-4">
                <p className="font-semibold mb-2">Example 2: Registration Trigger</p>
                <p className="text-sm text-gray-300 mb-2">
                  When a user registers for an event, automatically track it:
                </p>
                <pre className="text-sm text-gray-300 overflow-x-auto bg-black/50 p-3 rounded mt-2">
{`// functions/src/triggers.ts
export const createRegistration = onDocumentWritten(
  "events/{eventId}/registrations/{registrationId}",
  async (event: any) => {
    const eventId = event.params.eventId;
    const userId = event.params.registrationId;

    await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .update({
        "associations.registrations": FieldValue.arrayUnion(eventId),
      });
  }
);`}
                </pre>
                <p className="text-xs text-gray-400 mt-2">
                  <strong>Observed:</strong> <code className="bg-black/50 px-1 rounded">events/{'{eventId}'}/registrations/{'{registrationId}'}</code>
                  <br />
                  <strong>Action:</strong> Update user's registrations array
                </p>
              </div>

              <div className="bg-black/30 rounded p-4">
                <p className="font-semibold mb-2">Example 3: Collaboration Trigger</p>
                <p className="text-sm text-gray-300 mb-2">
                  When a user joins a project, automatically track it:
                </p>
                <pre className="text-sm text-gray-300 overflow-x-auto bg-black/50 p-3 rounded mt-2">
{`// functions/src/triggers.ts
export const createCollaboration = onDocumentWritten(
  "projects/{projectId}/collaborations/{collaborationId}",
  async (event: any) => {
    const projectId = event.params.projectId;
    const userId = event.params.collaborationId;

    await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .update({
        "associations.collaborations": FieldValue.arrayUnion(projectId),
      });
  }
);`}
                </pre>
                <p className="text-xs text-gray-400 mt-2">
                  <strong>Observed:</strong> <code className="bg-black/50 px-1 rounded">projects/{'{projectId}'}/collaborations/{'{collaborationId}'}</code>
                  <br />
                  <strong>Action:</strong> Update user's collaborations array
                </p>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4">
              <p className="font-bold text-green-500 mb-2">✅ Benefits of Observer Pattern</p>
              <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm ml-4">
                <li><strong>Automatic synchronization:</strong> User profiles stay in sync with their activities</li>
                <li><strong>Decoupling:</strong> Application logic doesn't need to manually update user profiles</li>
                <li><strong>Reliability:</strong> Updates happen even if the client disconnects</li>
                <li><strong>Maintainability:</strong> Easy to add new observers without changing existing code</li>
              </ul>
            </div>
          </div>

          {/* Auth Triggers */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">3. Authentication Triggers</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> Functions that run during the user authentication lifecycle.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> Automatically create user profiles when someone signs up.
              </p>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">Example: beforeUserCreated</p>
              <p className="text-sm text-gray-300 mb-2">
                Before a new user is created in Firebase Auth, create their Firestore profile:
              </p>
              <pre className="text-sm text-gray-300 overflow-x-auto bg-black/50 p-3 rounded mt-2">
{`// functions/src/triggers.ts
export const beforecreated = beforeUserCreated(async (event) => {
  const user = event.data;

  const userDocument = {
    publicName: user.displayName || "",
    updatedAt: Timestamp.now(),
    profileImageUrl: "",
    bio: "",
    linkedin: "",
    github: "",
    role: "member",
  };

  await admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .set(userDocument);

  logger.info(\`Created user document for UID: \${user.uid}\`);
});`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Project Structure */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">📂 Cloud Functions Structure</h2>
        <div className="space-y-2 text-gray-300 font-mono text-sm">
          <p><code className="bg-black/50 px-2 py-1 rounded">functions/</code></p>
          <p className="ml-4"><code className="bg-black/50 px-2 py-1 rounded">src/</code></p>
          <p className="ml-8"><code className="bg-black/50 px-2 py-1 rounded">index.ts</code> — Main entry point, exports all functions</p>
          <p className="ml-8"><code className="bg-black/50 px-2 py-1 rounded">requests.ts</code> — HTTP request functions (checkAdminClaims)</p>
          <p className="ml-8"><code className="bg-black/50 px-2 py-1 rounded">triggers.ts</code> — Firestore and Auth triggers</p>
        </div>
      </div>

      {/* Development */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🛠️ Local Development</h2>

        <div className="mb-4">
          <p className="text-gray-300 mb-2">
            Cloud Functions can be run locally using Firebase Emulators:
          </p>
        </div>

        <div className="bg-black/30 rounded p-4 mb-4">
          <p className="font-semibold mb-2">Start local development:</p>
          <pre className="text-sm text-gray-300 overflow-x-auto bg-black/50 p-3 rounded mt-2">
{`cd functions
npm run serve  # Starts functions emulator`}
          </pre>
        </div>

        <div className="bg-black/30 rounded p-4">
          <p className="font-semibold mb-2">Deploy to production:</p>
          <pre className="text-sm text-gray-300 overflow-x-auto bg-black/50 p-3 rounded mt-2">
{`cd functions
npm run deploy  # Deploys all functions to Firebase`}
          </pre>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🔐 Environment Variables</h2>

        <div className="mb-4">
          <p className="text-gray-300 mb-2">
            Required in <code className="bg-black/50 px-1 rounded">.env.local</code> for local development:
          </p>
        </div>

        <div className="bg-black/30 rounded p-4">
          <pre className="text-sm text-gray-300 overflow-x-auto">
{`# Firebase Admin SDK (for local development)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"

# Cloud Functions URL (for middleware)
NEXT_PUBLIC_CLOUD_FUNCTIONS_URL=https://your-region-your-project.cloudfunctions.net`}
          </pre>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">💡 Best Practices</h2>
        <div className="space-y-3 text-gray-300">
          <div>
            <p className="font-bold mb-1">1. Keep Functions Focused</p>
            <p className="text-sm text-gray-400">Each function should do one thing well. Don't combine multiple responsibilities.</p>
          </div>
          <div>
            <p className="font-bold mb-1">2. Error Handling</p>
            <p className="text-sm text-gray-400">Always wrap operations in try-catch blocks and log errors with <code className="bg-black/50 px-1 rounded">logger.error()</code>.</p>
          </div>
          <div>
            <p className="font-bold mb-1">3. Idempotency</p>
            <p className="text-sm text-gray-400">Triggers may run multiple times. Design functions to be safe when executed repeatedly.</p>
          </div>
          <div>
            <p className="font-bold mb-1">4. Use Type Safety</p>
            <p className="text-sm text-gray-400">Define TypeScript interfaces for request/response data to catch errors early.</p>
          </div>
          <div>
            <p className="font-bold mb-1">5. Test Locally First</p>
            <p className="text-sm text-gray-400">Always test with Firebase Emulators before deploying to production.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-white/10">
        <Link href="/docs/backend" className="text-blue-400 hover:underline">
          ← Backend Guide
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
