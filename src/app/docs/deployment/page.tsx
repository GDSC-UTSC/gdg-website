import Link from "next/link";

export default function DeploymentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Deployment</h1>
        <p className="text-xl text-gray-300">
          Learn how we deploy our website to production with Vercel
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <p className="text-gray-300">
          Deployment is the process of putting your code live on the internet so users can access it. We use <strong>Vercel</strong>, which handles deployment automatically when we push code to GitHub.
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">How Deployment Works</h2>

        <div className="space-y-6">
          {/* Vercel Overview */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">What is Vercel?</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> Vercel is a cloud platform for hosting web applications. It's made by the same company that created Next.js.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> Vercel automatically builds and deploys our website whenever we push code to GitHub. No manual deployment needed!
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">Key feature:</strong> Every pull request gets its own preview URL so you can test changes before merging.
              </p>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Official Documentation:</p>
              <a href="https://vercel.com/docs" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Vercel Documentation
              </a>
            </div>
          </div>

          {/* Deployment Workflow */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">The Deployment Workflow</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-4">
                Here's what happens when you make changes to the codebase:
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-2xl flex-shrink-0">1️⃣</div>
                  <div>
                    <p className="font-bold mb-1">Create a Branch and Make Changes</p>
                    <p className="text-gray-400">You create a new Git branch and make your code changes locally.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl flex-shrink-0">2️⃣</div>
                  <div>
                    <p className="font-bold mb-1">Create a Pull Request</p>
                    <p className="text-gray-400">You open a pull request (PR) on GitHub to merge your changes into the main branch.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl flex-shrink-0">3️⃣</div>
                  <div>
                    <p className="font-bold mb-1">Vercel Creates a Preview Deployment</p>
                    <p className="text-gray-400">Vercel automatically builds your code and creates a unique preview URL (e.g., <code className="bg-black/50 px-1 rounded">gdg-website-abc123.vercel.app</code>). This lets you test your changes before merging.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl flex-shrink-0">4️⃣</div>
                  <div>
                    <p className="font-bold mb-1">Check the Preview</p>
                    <p className="text-gray-400">Click the Vercel preview link in your PR. Make sure everything works correctly!</p>
                    <p className="text-yellow-400 mt-2"><strong>⚠️ IMPORTANT:</strong> Always check that the preview deployment succeeds and works as expected.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl flex-shrink-0">5️⃣</div>
                  <div>
                    <p className="font-bold mb-1">Merge to Main</p>
                    <p className="text-gray-400">Once the preview looks good and your PR is approved, merge it into the main branch.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl flex-shrink-0">6️⃣</div>
                  <div>
                    <p className="font-bold mb-1">Vercel Deploys to Production</p>
                    <p className="text-gray-400">Vercel automatically deploys the main branch to production (the live website). Your changes are now live!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Build Process */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">What Happens During Build</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                When Vercel deploys your code, it runs <code className="bg-black/50 px-2 py-1 rounded">npm run build</code>. This command:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li>Compiles TypeScript to JavaScript</li>
                <li>Bundles and minifies all code (makes it smaller and faster)</li>
                <li>Optimizes CSS and images</li>
                <li>Pre-renders static pages</li>
                <li>Checks for type errors and other issues</li>
              </ul>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4 mb-4">
              <p className="font-bold text-yellow-500 mb-2">⚠️ If the build fails:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-400">
                <li>Check the Vercel logs to see the error message</li>
                <li>Run <code className="bg-black/50 px-1 rounded">npm run build</code> locally to reproduce the error</li>
                <li>Fix the error in your code</li>
                <li>Push the fix and Vercel will automatically retry</li>
              </ol>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">Test the build locally:</p>
              <p className="text-sm text-gray-300">Run <code className="bg-black/50 px-1 rounded">npm run build</code> — if it succeeds locally, it should succeed on Vercel.</p>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">Environment Variables</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> Environment variables are secret values (like Firebase API keys) that your app needs to run.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why:</strong> We store these separately (not in the code) for security. Different environments (production, preview, development) can have different values.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">How to add environment variables on Vercel:</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-400">
                <li>Go to your project on <a href="https://vercel.com" target="_blank" className="text-blue-400 hover:underline">vercel.com</a></li>
                <li>Click <strong>Settings</strong> → <strong>Environment Variables</strong></li>
                <li>Add each variable (name and value)</li>
                <li>Select which environments need it: Production, Preview, and/or Development</li>
                <li>Click <strong>Save</strong></li>
              </ol>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">Our required environment variables:</p>
              <p className="text-sm text-gray-300">Check <code className="bg-black/50 px-1 rounded">.env.local.example</code> in the project root for the full list of required Firebase environment variables.</p>
            </div>
          </div>

          {/* Edge Runtime Limitations */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">Edge Runtime Limitations</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Our backend routes run on Vercel's <strong>Edge Runtime</strong>, which is a lightweight JavaScript environment. It's fast and globally distributed, but has some limitations:
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">❌ What you CANNOT do on the Edge:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li><strong>File system operations</strong> — No reading/writing files with <code className="bg-black/50 px-1 rounded">fs</code></li>
                <li><strong>WebSockets or Socket.io</strong> — No persistent connections</li>
                <li><strong>In-memory caching</strong> — State doesn't persist between requests</li>
                <li><strong>Some Node.js APIs</strong> — Only a subset is available</li>
                <li><strong>Long-running processes</strong> — Requests timeout after a certain duration</li>
              </ul>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">✅ What you CAN do:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li>Fetch data from APIs (including Firebase)</li>
                <li>Process HTTP requests and return responses</li>
                <li>Run middleware and authentication checks</li>
                <li>Use most modern JavaScript features</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Learn more:</p>
              <a href="https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Next.js — Edge and Node.js Runtimes
              </a>
            </div>
          </div>

          {/* Debugging Deployments */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">Debugging Failed Deployments</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-4">
                If your deployment fails, here's how to debug it:
              </p>

              <ol className="list-decimal list-inside space-y-3 text-gray-400">
                <li>
                  <strong className="text-gray-300">Check Vercel Logs</strong>
                  <p className="ml-6 mt-1">Click on the failed deployment in Vercel to see the error logs. The error message will tell you what went wrong.</p>
                </li>
                <li>
                  <strong className="text-gray-300">Reproduce Locally</strong>
                  <p className="ml-6 mt-1">Run <code className="bg-black/50 px-1 rounded">npm run build</code> on your computer. If it fails locally, you can debug more easily.</p>
                </li>
                <li>
                  <strong className="text-gray-300">Common Issues</strong>
                  <ul className="ml-6 mt-1 list-disc list-inside space-y-1">
                    <li>TypeScript errors (type mismatches, missing properties)</li>
                    <li>Missing dependencies in <code className="bg-black/50 px-1 rounded">package.json</code></li>
                    <li>Environment variables not set correctly</li>
                    <li>Import errors (wrong file paths, missing files)</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-gray-300">Fix and Push</strong>
                  <p className="ml-6 mt-1">Once you fix the issue, commit and push. Vercel will automatically retry the deployment.</p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-green-500">✅ Deployment Checklist</h2>
        <p className="text-gray-300 mb-4">Before merging your PR, make sure:</p>
        <ul className="space-y-2 text-gray-300">
          <li>☐ The Vercel preview deployment succeeds (green checkmark on GitHub)</li>
          <li>☐ You've clicked the preview link and tested your changes</li>
          <li>☐ No TypeScript errors or warnings</li>
          <li>☐ <code className="bg-black/50 px-1 rounded">npm run build</code> succeeds locally</li>
          <li>☐ Your PR has been reviewed and approved</li>
        </ul>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">📚 Additional Resources</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://vercel.com/docs/deployments/overview" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Vercel — Deployments Overview
            </a>
          </li>
          <li>
            <a href="https://vercel.com/docs/deployments/preview-deployments" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Vercel — Preview Deployments
            </a>
          </li>
          <li>
            <a href="https://vercel.com/docs/environment-variables" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Vercel — Environment Variables
            </a>
          </li>
        </ul>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-white/10">
        <Link href="/docs/firebase" className="text-blue-400 hover:underline">
          ← Firebase Guide
        </Link>
        <Link
          href="/docs"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Back to Documentation Home
        </Link>
      </div>
    </div>
  );
}
