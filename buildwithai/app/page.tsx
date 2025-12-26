"use client";
import dynamic from "next/dynamic";
import AgendaTeaser from "@buildwithai/sections/AgendaTeaser";
import Contact from "@buildwithai/sections/Contact";
import FAQ from "@buildwithai/sections/FAQ";
import Hero from "@buildwithai/sections/Hero";
import Speakers from "@buildwithai/sections/Speakers";
import Sponsors from "@buildwithai/sections/Sponsors";
import WorkshopsPreview from "@buildwithai/sections/WorkshopsPreview";

const LightPillar = dynamic(() => import("@buildwithai/components/LightPillar"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-0 bg-black" />,
});

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      {/* Light Pillars Background - Fixed across entire page */}
      <div className="fixed inset-0 z-0">
        <LightPillar
          topColor="#6366F1"
          bottomColor="#A855F7"
          intensity={1}
          pillarRotation={25}
          glowAmount={0.002}
          pillarWidth={3}
          pillarHeight={0.4}
          rotationSpeed={0.3}
          noiseIntensity={0.5}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Hero />

        {/* Content sections with space theme background */}
        <div className="relative bg-gradient-to-b from-black/50 via-[#0a0a1f]/80 to-black/50">
          <Speakers />
          <AgendaTeaser />
          <WorkshopsPreview />
          <Sponsors />
          <FAQ />
          <Contact />
        </div>
      </div>
    </main>
  );
}
