import Section from "@buildwithai/components/Section";

const sponsors = [
  { name: "Google", tier: "Platinum" },
  { name: "Vercel", tier: "Gold" },
  { name: "Shopify", tier: "Silver" },
];

export default function Sponsors() {
  return (
    <Section id="sponsors" title="Sponsors" subtitle="Thanks to our partners for supporting the community.">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {sponsors.map((s) => (
          <div
            key={s.name}
            className="aspect-[3/1] flex items-center justify-center rounded-xl border border-white/10 bg-white/5"
          >
            <div className="text-white/80">{s.name}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
