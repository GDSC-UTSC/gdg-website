import Section from "@buildwithai/components/Section";
import Link from "next/link";

const items = [
  {
    time: "09:00",
    title: "Opening & Keynote",
    room: "Main Hall A",
  },
  {
    time: "11:00",
    title: "AI on Android: On‑device GenAI",
    room: "Room 210",
  },
  {
    time: "14:00",
    title: "Scaling RAG with Vertex AI",
    room: "Room 305",
  },
];

export default function AgendaTeaser() {
  return (
    <Section title="Agenda Highlights" subtitle="A day packed with talks and hands‑on sessions across multiple tracks.">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm overflow-hidden">
        <ul className="divide-y divide-white/5">
          {items.map((i, index) => (
            <li
              key={i.title}
              className="grid grid-cols-12 gap-4 p-5 hover:bg-white/5 transition-colors group"
            >
              <div className="col-span-3 sm:col-span-2 text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text font-mono font-bold">
                {i.time}
              </div>
              <div className="col-span-6 sm:col-span-8">
                <p className="text-white font-semibold group-hover:text-blue-200 transition-colors">
                  {i.title}
                </p>
              </div>
              <div className="col-span-3 sm:col-span-2 text-white/60 text-right text-sm">
                {i.room}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 text-center">
        <Link
          href="/agenda"
          className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-white font-medium hover:bg-white/10 hover:border-white/50 transition-all"
        >
          View Full Schedule
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
