import Section from "@buildwithai/components/Section";
import Link from "next/link";

const workshops = [
  {
    title: "LLM Apps with Vertex AI",
    level: "Intermediate",
  },
  {
    title: "Android On‑device ML",
    level: "Beginner",
  },
  {
    title: "GenAI UX Design Sprint",
    level: "All levels",
  },
];

export default function WorkshopsPreview() {
  return (
    <Section
      title="Workshops & Competition"
      subtitle="Hands‑on learning and a friendly competition to put skills into orbit."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((w, index) => (
          <div
            key={w.title}
            className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 hover:border-white/20 hover:from-white/10 hover:to-white/5 transition-all duration-300 backdrop-blur-sm"
          >
            {/* Card glow effect on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300 -z-10" />

            {/* Decorative icon */}
            <div className="mb-4 inline-flex p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10">
              <svg
                className="w-6 h-6 text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>

            <h3 className="text-white font-bold text-xl mb-2 group-hover:text-blue-200 transition-colors">
              {w.title}
            </h3>
            <p className="text-white/60 text-sm">
              <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 font-medium">
                {w.level}
              </span>
            </p>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href="/workshops"
          className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-white font-medium hover:bg-white/10 hover:border-white/50 transition-all"
        >
          Explore Workshops & Competition
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </Section>
  );
}
