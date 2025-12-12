import Link from "next/link";
import { ReactNode } from "react";

const docLinks = [
  { href: "/docs", label: "Getting Started", exact: true },
  { href: "/docs/prereqs", label: "Prerequisites" },
  { href: "/docs/frontend", label: "Frontend" },
  { href: "/docs/backend", label: "Backend" },
  { href: "/docs/firebase", label: "Firebase" },
  { href: "/docs/cloud-functions", label: "Cloud Functions" },
  { href: "/docs/deployment", label: "Deployment" },
  { href: "/docs/mcp", label: "MCP Server" },
  { href: "/docs/contributing", label: "Contributing" },
];

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="md:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Documentation
              </h2>
              <nav className="space-y-2">
                {docLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 rounded-lg transition-colors hover:bg-white/10 text-gray-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="max-w-4xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
