import Section from "@buildwithai/components/Section";

const faqs = [
  {
    q: "Who can attend?",
    a: "Students, professionals, and anyone curious about AI. All levels welcomed.",
  },
  {
    q: "Do I need to register?",
    a: "Yes. Space is limited, so please register early to secure your spot.",
  },
  {
    q: "Is there a code of conduct?",
    a: "Yes. We expect all attendees to be respectful and follow our community guidelines.",
  },
];

export default function FAQ() {
  return (
    <Section id="faq" title="FAQ">
      <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <dt className="text-white font-semibold">{f.q}</dt>
            <dd className="text-white/70 mt-2 text-sm">{f.a}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
