import Section from "@buildwithai/components/Section";

const speakers = [
  {
    name: "Alex Chen",
    title: "Principal Engineer, Google Cloud",
    tag: "Keynote",
  },
  {
    name: "Priya Raman",
    title: "Staff Researcher, DeepMind",
    tag: "Keynote",
  },
  {
    name: "Samira Yousaf",
    title: "Lead ML Engineer, Shopify",
    tag: "Keynote",
  },
];

export default function Speakers() {
  return (
    <Section
      id="speakers"
      title="Keynote Speakers"
      subtitle="Hear from leaders pushing the boundaries of AI and developer tooling."
    >
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {speakers.map((s) => (
          <li
            key={s.name}
            className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 hover:border-white/20 hover:from-white/10 hover:to-white/5 transition-all duration-300 backdrop-blur-sm"
          >
            {/* Card glow effect on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300 -z-10" />

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-300 ring-2 ring-white/20 shadow-lg shadow-purple-500/20" />
              <div>
                <p className="text-white font-bold text-lg">{s.name}</p>
                <p className="text-white/70 text-sm mt-1">{s.title}</p>
              </div>
            </div>
            <span className="mt-4 inline-block rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/10 px-3 py-1 text-xs text-white/90 font-medium">
              {s.tag}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
