import Link from "next/link";

export default function PrereqsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Prerequisites</h1>
        <p className="text-xl text-gray-300">
          Before you dive into the codebase, these fundamental concepts are <strong className="text-yellow-500">mandatory</strong>.
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <p className="text-gray-300">
          Welcome to the GDG UTSC website project! We're excited to have you here.
        </p>
        <p className="text-gray-300 mt-4">
          Don't worry if this seems like a lot! Take your time. Learning these concepts is an investment that will benefit you far beyond this project.
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">Your Learning Path</h2>
        <p className="text-gray-300 mb-6">
          This is the recommended order to learn these concepts. Each builds on the previous one.
        </p>

        <div className="space-y-6">
          {/* JavaScript/TypeScript */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">1. JavaScript/TypeScript</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> JavaScript is the programming language of the web. TypeScript adds type safety.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> TypeScript helps catch bugs before runtime and makes the codebase more maintainable. All our code is in TypeScript.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">Learning path:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-400">
                <li>First, learn JavaScript fundamentals</li>
                <li>Then learn TypeScript syntax and types</li>
              </ol>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">What to focus on:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Variables, functions, objects, arrays</li>
                <li>ES6+ features (arrow functions, destructuring, spread operator)</li>
                <li>Basic TypeScript types (string, number, boolean, interfaces)</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Resources:</p>
              <ul className="space-y-1">
                <li>
                  <a href="https://javascript.info/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    JavaScript Tutorial
                  </a>
                </li>
                <li>
                  <a href="https://www.typescriptlang.org/docs/handbook/intro.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    TypeScript Handbook
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Async/Await */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">2. Async/Await and Promises</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> Code that doesn't block the program while waiting for something.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> Almost everything in web dev is asynchronous — fetching data from Firebase, waiting for user input. You'll use <code className="bg-black/50 px-2 py-1 rounded">async/await</code> constantly.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">What to focus on:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>What a Promise is and why we need it</li>
                <li>How to use <code className="bg-black/50 px-1 rounded">.then()</code> and <code className="bg-black/50 px-1 rounded">.catch()</code></li>
                <li>How <code className="bg-black/50 px-1 rounded">async/await</code> makes asynchronous code look synchronous</li>
                <li>Error handling with try/catch</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Resources:</p>
              <ul className="space-y-1">
                <li>
                  <a href="https://javascript.info/promise-basics" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    Promises
                  </a>
                </li>
                <li>
                  <a href="https://javascript.info/async-await" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    Async/Await
                  </a>
                </li>
                <li>
                  <a href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    MDN Async Guide
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Client-Server */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">3. Client-Server Model</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> How web applications work. The client (browser) sends requests to a server, which sends back responses.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> Our website has a frontend (client) that users interact with, and a backend (server) that processes requests and talks to Firebase.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">What to focus on:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>What "client" and "server" mean</li>
                <li>HTTP requests (GET, POST, PUT, DELETE)</li>
                <li>What happens when you visit a website</li>
                <li>Basic understanding of APIs</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Resources:</p>
              <ul className="space-y-1">
                <li>
                  <a href="https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    Client-Server Overview
                  </a>
                </li>
                <li>
                  <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    HTTP Basics
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Authentication */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">4. Authentication Concepts</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> How we verify users are who they say they are, and how we keep them logged in.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> We have user accounts, admin pages, and protected routes. Understanding authentication is crucial.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">What to focus on:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>What authentication vs authorization means</li>
                <li>How tokens work (think of them like digital keys)</li>
                <li>What "Bearer Authentication" means</li>
                <li>How sessions work</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Resources:</p>
              <ul className="space-y-1">
                <li>
                  <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    Authentication Basics
                  </a>
                </li>
                <li>
                  <a href="https://swagger.io/docs/specification/v3_0/authentication/bearer-authentication/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    Bearer Tokens
                  </a>
                </li>
                <li>
                  <a href="https://jwt.io/introduction" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    JWTs Explained
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Git */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">5. Git and GitHub Workflow</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> Version control system for tracking code changes and collaborating.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> All our code is on GitHub. You'll need to create branches, commit changes, and make pull requests.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">What to focus on:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Git commands: <code className="bg-black/50 px-1 rounded">clone</code>, <code className="bg-black/50 px-1 rounded">branch</code>, <code className="bg-black/50 px-1 rounded">add</code>, <code className="bg-black/50 px-1 rounded">commit</code>, <code className="bg-black/50 px-1 rounded">push</code>, <code className="bg-black/50 px-1 rounded">pull</code></li>
                <li>How to create a branch</li>
                <li>How to make a pull request</li>
                <li>How to resolve merge conflicts</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Resources:</p>
              <ul className="space-y-1">
                <li>
                  <a href="https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    Git Basics
                  </a>
                </li>
                <li>
                  <a href="https://docs.github.com/en/get-started/quickstart/github-flow" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    GitHub Flow
                  </a>
                </li>
                <li>
                  <a href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    Pull Requests
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">How to Approach Learning</h2>
        <ul className="space-y-3 text-gray-300">
          <li><strong>🎯 Focus on understanding, not memorization.</strong> You don't need to memorize syntax. Understand <em>why</em> these concepts exist and <em>when</em> to use them.</li>
          <li><strong>🧩 Learn by doing.</strong> After reading documentation, try building small examples. Break things. Fix them. That's how you learn.</li>
          <li><strong>🤝 Ask for help.</strong> If you're stuck on a concept for more than a day, reach out to the team.</li>
          <li><strong>📚 Use AI tools.</strong> ChatGPT, Claude, and GitHub Copilot are excellent learning companions.</li>
        </ul>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">✅ Checklist</h2>
        <p className="text-gray-300 mb-4">Before moving on, make sure you understand:</p>
        <ul className="space-y-2 text-gray-300">
          <li>☐ JavaScript basics (variables, functions, objects, arrays)</li>
          <li>☐ TypeScript type annotations</li>
          <li>☐ What <code className="bg-black/50 px-1 rounded">async/await</code> does and how to use it</li>
          <li>☐ How clients and servers communicate</li>
          <li>☐ What authentication tokens are</li>
          <li>☐ How to create a Git branch and make a pull request</li>
        </ul>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-white/10">
        <Link href="/docs" className="text-blue-400 hover:underline">
          ← Back to Documentation
        </Link>
        <Link
          href="/docs/frontend"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Next: Frontend Guide →
        </Link>
      </div>
    </div>
  );
}
