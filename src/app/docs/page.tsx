import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Welcome to GDG UTSC Documentation
        </h1>
        <p className="text-xl text-gray-300">
          Everything you need to know to contribute to our website
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">👋 New to the project?</h2>
        <p className="text-gray-300 mb-4">
          Welcome! We're excited to have you here. This documentation will guide you through everything you need to know to start contributing.
        </p>
        <p className="text-gray-300 mb-4">
          <strong>Important:</strong> These docs are designed for people who only know basic programming (conditionals and loops).
          Don't worry if you haven't done web development before — we'll point you in the right direction!
        </p>
        <p className="text-gray-300">
          <strong className="text-blue-400">Why this project?</strong> This isn't just a basic club website. We've built a full content management system with authentication, protected routes, real-time data, and server-side rendering. We have many plans to expand and build cool services. Learning and contributing to this project will teach you <em>real</em> web development — the kind of stack used at tech companies.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Learning Path</h2>
        <p className="text-gray-300 mb-6">
          Follow this recommended order to get up to speed:
        </p>

        <div className="grid gap-4">
          {/* Prerequisites */}
          <Link href="/docs/prereqs" className="block group">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-3xl">1️⃣</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    Prerequisites
                  </h3>
                  <p className="text-gray-400">
                    <strong className="text-yellow-500">START HERE!</strong> Mandatory concepts you need to understand before working on the project.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Topics: JavaScript/TypeScript, Async/Await, Client-Server Model, Authentication, Git
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Frontend */}
          <Link href="/docs/frontend" className="block group">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-3xl">2️⃣</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    Frontend Development
                  </h3>
                  <p className="text-gray-400">
                    Learn React, Next.js, and our UI component libraries.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Topics: React, Next.js App Router, shadcn/ui, Framer Motion, Tailwind CSS
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Backend */}
          <Link href="/docs/backend" className="block group">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-3xl">3️⃣</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    Backend Development
                  </h3>
                  <p className="text-gray-400">
                    Understand Next.js server components, API routes, and Edge Runtime.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Topics: Server Components, API Routes, Middleware, Edge Runtime
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Firebase */}
          <Link href="/docs/firebase" className="block group">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-3xl">4️⃣</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    Firebase
                  </h3>
                  <p className="text-gray-400">
                    Master our database, authentication, and storage system.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Topics: Firestore, Auth, Storage, Type Classes, SSR with Firebase
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Deployment */}
          <Link href="/docs/deployment" className="block group">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-3xl">5️⃣</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    Deployment
                  </h3>
                  <p className="text-gray-400">
                    Learn how we deploy to production with Vercel.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Topics: Vercel, CI/CD, Environment Variables, Edge Runtime Limitations
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2 text-yellow-500">⚠️ Important Notes</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>These docs guide you in the right direction — we don't re-explain common concepts</li>
          <li>Use the official documentation links provided to learn each technology</li>
          <li>Take your time! Solid foundations are worth the investment</li>
          <li>When in doubt, use AI tools (ChatGPT, Claude) or ask the team for help</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/docs/mcp" className="block group">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition-colors h-full">
            <h2 className="text-2xl font-bold mb-3 text-purple-400 group-hover:text-purple-300">🔧 MCP Server</h2>
            <p className="text-gray-300">
              Learn how to use our Model Context Protocol server for direct database access.
            </p>
          </div>
        </Link>

        <Link href="/docs/contributing" className="block group">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 hover:border-green-500/50 transition-colors h-full">
            <h2 className="text-2xl font-bold mb-3 text-green-400 group-hover:text-green-300">🤝 Contributing</h2>
            <p className="text-gray-300">
              Join the GDG UTSC team and help build something amazing!
            </p>
          </div>
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Ready to start?</h2>
        <Link
          href="/docs/prereqs"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Begin with Prerequisites →
        </Link>
      </div>
    </div>
  );
}
