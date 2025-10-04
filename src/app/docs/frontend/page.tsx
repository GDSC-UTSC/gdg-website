import Link from "next/link";

export default function FrontendPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Frontend Development</h1>
        <p className="text-xl text-gray-300">
          Learn the technologies that power our user interface
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <p className="text-gray-300">
          The frontend is what users see and interact with. We use modern React-based tools to build a fast, responsive, and beautiful user experience.
        </p>
        <p className="text-gray-300 mt-4">
          Before diving in, make sure you've completed the <Link href="/docs/prereqs" className="text-blue-400 hover:underline">Prerequisites</Link>.
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">Technologies Overview</h2>
        <p className="text-gray-300 mb-6">
          Follow this order — each technology builds on the previous one:
        </p>

        <div className="space-y-6">
          {/* React */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">1. React — The Foundation</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> React is a JavaScript library for building user interfaces using reusable components.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> React lets us break our UI into small, reusable pieces (components) that manage their own state. It's the foundation of our entire frontend.
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">Priority:</strong> <span className="text-red-400 font-bold">CRITICAL</span> — You must understand React before anything else.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">What to focus on:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li><strong>Components</strong> — Building blocks of our UI</li>
                <li><strong>Props</strong> — Passing data between components</li>
                <li><strong>State</strong> — Managing data that changes over time</li>
                <li><strong>Hooks</strong> — <code className="bg-black/50 px-1 rounded">useState</code>, <code className="bg-black/50 px-1 rounded">useEffect</code>, <code className="bg-black/50 px-1 rounded">useContext</code></li>
                <li><strong>Event handling</strong> — onClick, onChange, etc.</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Official Documentation:</p>
              <a href="https://react.dev/learn" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                React Documentation — Learn React
              </a>
            </div>
          </div>

          {/* Next.js */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">2. Next.js — The Framework</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> Next.js is a React framework that provides structure, routing, and server-side features.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> Next.js gives us file-based routing, server-side rendering, and API routes. We specifically use the <strong>App Router</strong> (not Pages Router).
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">Priority:</strong> <span className="text-red-400 font-bold">CRITICAL</span> — Our entire app is built with Next.js.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">What to focus on:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li><strong>App Router</strong> — How we organize pages with the <code className="bg-black/50 px-1 rounded">app/</code> directory</li>
                <li><strong>File-based routing</strong> — <code className="bg-black/50 px-1 rounded">page.tsx</code>, <code className="bg-black/50 px-1 rounded">layout.tsx</code>, folders</li>
                <li><strong>Server vs Client Components</strong> — When to use <code className="bg-black/50 px-1 rounded">'use client'</code></li>
                <li><strong>Link component</strong> — Navigation between pages</li>
                <li><strong>Image component</strong> — Optimized images</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Official Documentation:</p>
              <ul className="space-y-1">
                <li>
                  <a href="https://nextjs.org/docs/app/getting-started" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    Next.js — Getting Started
                  </a>
                </li>
                <li>
                  <a href="https://nextjs.org/docs/app/building-your-application/routing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    Next.js — App Router Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Tailwind */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">3. Tailwind CSS — Styling</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> Tailwind is a utility-first CSS framework. You style components by adding CSS classes directly to HTML.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> Tailwind makes styling fast and consistent. Instead of writing custom CSS, you use predefined classes like <code className="bg-black/50 px-1 rounded">bg-blue-500</code> or <code className="bg-black/50 px-1 rounded">text-center</code>.
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">Priority:</strong> <span className="text-yellow-400 font-bold">MEDIUM</span> — You can learn as you go. Use AI or copy from existing components.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">What to focus on:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>How utility classes work (<code className="bg-black/50 px-1 rounded">p-4</code>, <code className="bg-black/50 px-1 rounded">m-2</code>, <code className="bg-black/50 px-1 rounded">flex</code>, <code className="bg-black/50 px-1 rounded">grid</code>)</li>
                <li>Responsive design (<code className="bg-black/50 px-1 rounded">md:</code>, <code className="bg-black/50 px-1 rounded">lg:</code> prefixes)</li>
                <li>Colors and backgrounds</li>
                <li>Don't memorize — use the docs and AI tools!</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Official Documentation:</p>
              <a href="https://tailwindcss.com/docs" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Tailwind CSS Documentation
              </a>
            </div>
          </div>

          {/* shadcn/ui */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">4. shadcn/ui — Component Library</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> shadcn/ui is a collection of pre-built, accessible UI components (buttons, forms, dialogs, etc.).
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> Instead of building buttons, modals, and forms from scratch, we use shadcn/ui's battle-tested components. They're styled with Tailwind.
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">Priority:</strong> <span className="text-green-400 font-bold">LOW</span> — Just browse the docs when you need a component.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">What to focus on:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Browse available components (Button, Card, Dialog, Input, etc.)</li>
                <li>How to use components in your code</li>
                <li>Components are in <code className="bg-black/50 px-1 rounded">src/components/ui/</code></li>
                <li>Don't learn everything — look things up as needed</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Official Documentation:</p>
              <a href="https://ui.shadcn.com/docs" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                shadcn/ui Documentation
              </a>
            </div>
          </div>

          {/* Framer Motion */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">5. Framer Motion — Animations</h3>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">What:</strong> Framer Motion is an animation library for React. It makes elements fade, slide, and move smoothly.
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-blue-400">Why we use it:</strong> Animations make our website feel polished and professional.
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">Priority:</strong> <span className="text-green-400 font-bold">LOW</span> — Use AI to help you. Copy from existing components.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">What to focus on:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Basic animations (fade in, slide up)</li>
                <li>The <code className="bg-black/50 px-1 rounded">motion</code> component</li>
                <li>Don't worry about mastering it — use AI and existing examples</li>
              </ul>
            </div>

            <div className="bg-black/30 rounded p-4">
              <p className="font-semibold mb-2">📚 Official Documentation:</p>
              <a href="https://www.framer.com/motion/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Framer Motion Documentation
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">💡 Learning Tips</h2>
        <ul className="space-y-3 text-gray-300">
          <li><strong>Start with React and Next.js.</strong> These are mandatory. Everything else you can learn as you go.</li>
          <li><strong>Don't memorize Tailwind or Framer Motion.</strong> Use the docs, AI tools, and copy from existing code.</li>
          <li><strong>Look at existing components.</strong> Check <code className="bg-black/50 px-1 rounded">src/components/</code> to see how we've built things.</li>
          <li><strong>Build small test components.</strong> Create a test page and experiment!</li>
        </ul>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">📂 Where Things Live</h2>
        <div className="space-y-2 text-gray-300 font-mono text-sm">
          <p><code className="bg-black/50 px-2 py-1 rounded">src/app/</code> — Pages and routes (Next.js App Router)</p>
          <p><code className="bg-black/50 px-2 py-1 rounded">src/components/</code> — Reusable components</p>
          <p><code className="bg-black/50 px-2 py-1 rounded">src/components/ui/</code> — shadcn/ui components</p>
          <p><code className="bg-black/50 px-2 py-1 rounded">src/components/layout/</code> — Header, Footer</p>
          <p><code className="bg-black/50 px-2 py-1 rounded">src/components/sections/</code> — Page sections (Hero, About, etc.)</p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-white/10">
        <Link href="/docs/prereqs" className="text-blue-400 hover:underline">
          ← Prerequisites
        </Link>
        <Link
          href="/docs/backend"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Next: Backend Guide →
        </Link>
      </div>
    </div>
  );
}
