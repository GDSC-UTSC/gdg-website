import Link from "next/link";

export default function ContributingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Contributing</h1>
        <p className="text-xl text-gray-300">
          Join the GDG UTSC team and help build something amazing
        </p>
      </div>

      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
        <p className="text-gray-300 text-lg">
          We're always looking for passionate developers to join our team! Whether you're just starting your web development journey or you're already experienced, there's a place for you here.
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">Why Contribute?</h2>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-xl font-bold mb-2 text-blue-400">📚 Learn Real Web Development</h3>
              <p className="ml-4 text-gray-400">
                This isn't just a basic club website. You'll work with a production-grade content management system featuring authentication, protected routes, server-side rendering, and real-time data. This is the same tech stack used at major tech companies.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-blue-400">🚀 Build Cool Features</h3>
              <p className="ml-4 text-gray-400">
                We have many plans to expand and build exciting services. You'll have the opportunity to architect and implement new features from scratch.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-blue-400">👥 Collaborate with a Team</h3>
              <p className="ml-4 text-gray-400">
                Work alongside other developers, participate in code reviews, and learn best practices for team-based development.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-blue-400">💼 Portfolio Project</h3>
              <p className="ml-4 text-gray-400">
                Build something real that you can showcase to employers. Contributions to a live, production website carry significant weight.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2 text-blue-400">🎓 Mentorship</h3>
              <p className="ml-4 text-gray-400">
                Get guidance from experienced developers and learn industry best practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">What We're Looking For</h2>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-gray-300 mb-4">
            We welcome contributors of all skill levels! Here's what we value:
          </p>

          <div className="space-y-3 text-gray-300">
            <div>
              <h3 className="font-bold text-green-400">✅ Enthusiasm to Learn</h3>
              <p className="ml-4 text-gray-400">
                Passion and willingness to learn are more important than current skill level. We'll teach you what you need to know.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-green-400">✅ Commitment</h3>
              <p className="ml-4 text-gray-400">
                Ability to dedicate time to understanding the codebase and completing tasks.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-green-400">✅ Communication</h3>
              <p className="ml-4 text-gray-400">
                Ask questions when stuck, provide updates on progress, and collaborate with the team.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-green-400">✅ Attention to Detail</h3>
              <p className="ml-4 text-gray-400">
                Write clean code, test your changes, and follow best practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">Getting Started</h2>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-gray-300 mb-4">
            Ready to join? Here's how to get started:
          </p>

          <ol className="list-decimal list-inside space-y-3 text-gray-300">
            <li>
              <strong>Reach out to me here</strong>
              <p className="ml-6 text-gray-400">
                Visit <a href="https://albert-huynh-portfolio.lovable.app/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">me's portfolio</a> and send a message expressing your interest.
              </p>
            </li>
            <li>
              <strong>Complete the Prerequisites</strong>
              <p className="ml-6 text-gray-400">
                Go through the <Link href="/docs/prereqs" className="text-blue-400 hover:underline">Prerequisites guide</Link> to learn the fundamental concepts.
              </p>
            </li>
            <li>
              <strong>Study the Documentation</strong>
              <p className="ml-6 text-gray-400">
                Read through the Frontend, Backend, and Firebase guides to understand how the project works.
              </p>
            </li>
            <li>
              <strong>Clone the Repository</strong>
              <p className="ml-6 text-gray-400">
                Get access to the GitHub repo and clone it locally.
              </p>
            </li>
            <li>
              <strong>Start Contributing</strong>
              <p className="ml-6 text-gray-400">
                Pick up your first task and start building!
              </p>
            </li>
          </ol>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">Contribution Guidelines</h2>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <ul className="space-y-3 text-gray-300">
            <li>
              <strong className="text-blue-400">Create a branch</strong> — Always work on a feature branch, never directly on main
            </li>
            <li>
              <strong className="text-blue-400">Write clean code</strong> — Follow TypeScript best practices and match the existing code style
            </li>
            <li>
              <strong className="text-blue-400">Test your changes</strong> — Make sure everything works before creating a PR
            </li>
            <li>
              <strong className="text-blue-400">Write descriptive commits</strong> — Explain what and why, not just what
            </li>
            <li>
              <strong className="text-blue-400">Request reviews</strong> — Get at least one person to review your PR before merging
            </li>
            <li>
              <strong className="text-blue-400">Be responsive</strong> — Address feedback and questions promptly
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-green-400">Ready to Join?</h2>
        <p className="text-gray-300 mb-6 text-lg">
          Reach out to me and let's build something amazing together!
        </p>
        <a
          href="https://albert-huynh-portfolio.lovable.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity text-lg"
        >
          Contact me →
        </a>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-white/10">
        <Link href="/docs/mcp" className="text-blue-400 hover:underline">
          ← MCP Server
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
