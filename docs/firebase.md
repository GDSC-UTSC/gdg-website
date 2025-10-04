# Firebase Guide

Firebase is Google's platform for building web and mobile applications. We use Firebase for authentication, database storage (Firestore), and file storage. This guide will teach you how we use Firebase in this project.

## What is Firebase?

Firebase is a Backend-as-a-Service (BaaS) that provides ready-to-use backend features like:
- **Authentication**: User login/signup with email/password or Google
- **Firestore**: NoSQL database to store data (like users, teams, events, positions)
- **Storage**: File storage for images, PDFs, resumes, etc. (like a CDN/bucket)
- **Cloud Functions**: Serverless functions that run in the cloud

The best part? Firebase has a **free tier** that's generous enough for most small-to-medium projects. We optimize our usage to stay within these limits.

Official Documentation: https://firebase.google.com/docs

---

## 1. Firebase Authentication

Firebase Auth handles user login and signup. We support two methods:
1. **Email/Password**: Traditional username and password
2. **Google OAuth**: "Sign in with Google" button

### How Authentication Works in Our Project

1. User logs in via the login form (`src/components/login-form.tsx`)
2. Firebase authenticates them and returns a user object
3. We store the auth state globally using React Context (`src/contexts/AuthContext.tsx`)
4. Protected pages (like `/admin`) check if the user is logged in
5. A service worker (`public/worker.template.js`) automatically adds the user's authentication token to requests

### Service Worker for Authentication

We use a service worker to handle authentication tokens automatically. This is important for **Server-Side Rendering (SSR)** with Firebase.

**What's a Service Worker?** It's a script that runs in the background of your browser and can intercept network requests. Our service worker (defined in `public/worker.template.js`) listens to all requests and automatically attaches the user's Firebase authentication token to the request headers.

**Why do we need this?** When using Next.js Server Components (pages that render on the server), the server needs to know who the user is. The service worker ensures the auth token is sent with every request, so the server can verify the user's identity.

Official Documentation: https://firebase.google.com/docs/auth/web/service-worker-sessions

---

## 2. Firebase Firestore (Database)

Firestore is a NoSQL database that stores data in "collections" and "documents". Think of it like this:
- **Collection**: A folder (e.g., "teams", "positions", "events")
- **Document**: A file inside that folder (e.g., a specific team or position)

### IMPORTANT: We NEVER Fetch Directly from Firebase in Views

**RULE:** You should NEVER import and use Firestore functions (like `getDoc`, `getDocs`) directly in a page or component. Instead, you MUST use our **Type Classes** located in `src/app/types/`.

**Why?** The type classes provide:
- Consistent structure for data
- Built-in CRUD operations (Create, Read, Update, Delete)
- Type safety with TypeScript
- Automatic timestamp handling
- Support for both client-side and server-side fetching

### Understanding Types and CRUD Operations

**This is the most important part of working with Firebase in our project.** Every data model (Team, Position, Event, etc.) has a corresponding **Type Class** in `src/app/types/`.

Let's look at an example: `src/app/types/team/index.ts`

#### Anatomy of a Type Class

1. **Type Definition**: Defines the shape of the data
```typescript
export type TeamType = {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
```

2. **Class Implementation**: Implements CRUD methods
```typescript
export class Team implements TeamType {
  // Properties
  id: string;
  name: string;
  // ... etc

  // Constructor
  constructor(data: TeamType) { ... }

  // Converter (tells Firebase how to save/load data)
  static converter = { ... };

  // CREATE: Add a new team to Firestore
  async create(): Promise<string> { ... }

  // READ: Get a single team by ID
  static async read(id: string, options?: { server?: boolean }): Promise<Team | null> { ... }

  // READ ALL: Get all teams
  static async readAll(options?: { server?: boolean, public?: boolean }): Promise<Team[]> { ... }

  // UPDATE: Update an existing team
  async update(): Promise<void> { ... }

  // DELETE: Delete a team
  async delete(): Promise<void> { ... }
}
```

#### How to Use Types for CRUD Operations

**Creating a new team:**
```typescript
import { Team } from "@/app/types/team";

const newTeam = new Team({
  id: "", // Will be auto-generated
  name: "Marketing Team",
  description: "Handles social media and outreach",
  members: [],
  createdAt: serverTimestamp() as Timestamp,
  updatedAt: serverTimestamp() as Timestamp,
});

const teamId = await newTeam.create(); // Saves to Firestore
console.log("Team created with ID:", teamId);
```

**Reading a single team:**
```typescript
import { Team } from "@/app/types/team";

// Client-side (in a React component)
const team = await Team.read("team-id-123");

// Server-side (in a Server Component or API route)
const team = await Team.read("team-id-123", { server: true });

// Public access (no authentication required)
const team = await Team.read("team-id-123", { server: true, public: true });
```

**Reading all teams:**
```typescript
import { Team } from "@/app/types/team";

// Client-side
const allTeams = await Team.readAll();

// Server-side
const allTeams = await Team.readAll({ server: true });

// Public access
const allTeams = await Team.readAll({ server: true, public: true });
```

**Updating a team:**
```typescript
const team = await Team.read("team-id-123");
if (team) {
  team.name = "Updated Marketing Team";
  team.description = "New description";
  await team.update(); // Saves changes to Firestore
}
```

**Deleting a team:**
```typescript
const team = await Team.read("team-id-123");
if (team) {
  await team.delete(); // Removes from Firestore
}
```

#### The `public` Option Explained

Notice the `{ server: true, public: true }` option? This is crucial for understanding how we save money on Firebase.

- **Without `public: true`**: Fetches require authentication (uses authenticated Firestore instance)
- **With `public: true`**: Fetches data without authentication (uses public Firestore instance)

**Why does this matter?** Firebase charges based on the number of reads/writes. When we use `public: true`, we can cache the data more aggressively and serve it to users without checking authentication every time. This dramatically reduces costs.

**When to use `public: true`:**
- Data that rarely changes (team members, positions)
- Data that everyone can see (public events, project showcases)
- Pages that need to load quickly without authentication

**When NOT to use it:**
- Admin pages
- User-specific data
- Data that changes frequently

### Client vs Server Firestore

We have **two separate Firestore libraries**:

1. **Client Firestore** (`src/lib/firebase/client/firestore.ts`)
   - Runs in the browser
   - Used in Client Components (components with `'use client'`)
   - Requires Firebase to be initialized on the client

2. **Server Firestore** (`src/lib/firebase/server/firestore.ts`)
   - Runs on the server (Next.js server or Edge Runtime)
   - Used in Server Components and API routes
   - Supports `public: true` option for unauthenticated access
   - Marked with `"use server"` at the top

The type classes automatically choose the right library based on the `server` option:
```typescript
// Uses client library
const teams = await Team.readAll();

// Uses server library
const teams = await Team.readAll({ server: true });
```

---

## 3. Firebase Server-Side Rendering (SSR)

Next.js allows us to render pages on the server before sending them to the user. This is called Server-Side Rendering (SSR). When combined with Firebase, it has huge benefits:

1. **Faster page loads**: Data is already loaded when the page is sent to the user
2. **Better SEO**: Search engines can see the content immediately
3. **Lower Firebase costs**: We can cache data and avoid repeated fetches

### How We Use SSR with Firebase

We use SSR for pages that show data that **rarely changes**, such as:
- Team members page (`/team`)
- Open positions page (`/positions`)
- Project showcase page (`/projects`)
- Public events page (`/events`)

By rendering these pages on the server and using the `public: true` option, we can:
- Fetch data once on the server
- Cache the result
- Serve the same page to all users without re-fetching

This keeps us well within Firebase's free tier.

### Example: Fetching Teams on the Server

```typescript
// app/team/page.tsx (Server Component)
import { Team } from "@/app/types/team";

export default async function TeamPage() {
  // Fetch teams on the server with public access
  const teams = await Team.readAll({ server: true, public: true });

  return (
    <div>
      {teams.map((team) => (
        <div key={team.id}>
          <h2>{team.name}</h2>
          <p>{team.description}</p>
        </div>
      ))}
    </div>
  );
}
```

**What happens:**
1. Next.js runs this code on the server
2. `Team.readAll` uses the server Firestore library with public access
3. Data is fetched from Firebase once
4. The HTML is generated with the data already in it
5. The HTML is sent to the user's browser
6. No client-side Firebase fetching needed!

Official Documentation:
- Firebase with SSR: https://firebase.google.com/docs/web/ssr-apps
- Service Worker Sessions: https://firebase.google.com/docs/auth/web/service-worker-sessions

---

## 4. Firebase Storage (File Uploads)

Firebase Storage is like a file bucket or CDN where we store files like:
- Profile pictures
- Event images
- Resumes (for job applications)
- PDFs (documents, resources)

We use the client-side storage library (`src/lib/firebase/client/storage.ts`) for all storage operations.

### Common Storage Operations

**Upload a file:**
```typescript
import { uploadFile } from "@/lib/firebase/client/storage";

const file = /* get file from input */;
const result = await uploadFile(file, "resumes/user-123.pdf");
console.log("File uploaded:", result.downloadURL);
```

**Get file URL:**
```typescript
import { getFileURL } from "@/lib/firebase/client/storage";

const url = await getFileURL("resumes/user-123.pdf");
console.log("Download URL:", url);
```

**Delete a file:**
```typescript
import { deleteFile } from "@/lib/firebase/client/storage";

await deleteFile("resumes/user-123.pdf");
```

**List files in a directory:**
```typescript
import { listFiles } from "@/lib/firebase/client/storage";

const files = await listFiles("resumes");
console.log("Files:", files);
```

---

## 5. Summary and Key Takeaways

### Golden Rules:
1. **NEVER fetch from Firebase directly in views** - Always use the type classes in `src/app/types/`
2. **Learn the type classes** - Understanding how to use them for CRUD is crucial
3. **Use SSR for static pages** - Pages like `/team` and `/positions` should use `{ server: true, public: true }`
4. **Use `public: true` when possible** - Reduces Firebase costs by allowing aggressive caching
5. **Storage is for files** - Use Firebase Storage for images, PDFs, resumes, etc.

### Quick Reference:

| What | Where | When to Use |
|------|-------|------------|
| Type Classes | `src/app/types/` | Always (for all Firebase data operations) |
| Client Firestore | `src/lib/firebase/client/firestore.ts` | Client Components only |
| Server Firestore | `src/lib/firebase/server/firestore.ts` | Server Components, API routes |
| Storage | `src/lib/firebase/client/storage.ts` | File uploads/downloads |
| Auth Context | `src/contexts/AuthContext.tsx` | Check if user is logged in |
| Service Worker | `public/worker.template.js` | Automatic auth token handling |

### Next Steps:
1. Explore the existing type classes in `src/app/types/`
2. Practice creating, reading, updating, and deleting data using these classes
3. Understand when to use `{ server: true }` vs client-side fetching
4. Understand when to use `{ public: true }` to save costs

If you follow these patterns, you'll write clean, efficient, and cost-effective Firebase code!
