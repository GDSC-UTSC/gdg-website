import AboutSection from "@/components/sections/AboutSection";
import EventsSection from "@/components/sections/EventsSection";
import HeroSection from "@/components/sections/HeroSection";
import RecruitmentSection from "@/components/sections/RecruitmentSection";
import StatisticsSection from "@/components/sections/StatisticsSection";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg">
      <HeroSection />
      {/* <StatisticsSection /> */}
      <AboutSection />
      <Suspense fallback={<EventsSkeleton />}>
        <EventsSection />
      </Suspense>
      <RecruitmentSection />
    </div>
  );
}

function EventsSkeleton() {
  return (
    <section id="events" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="h-12 w-96 mx-auto rounded bg-gray-700 animate-pulse mb-6"></div>
          <div className="h-6 w-3/4 mx-auto rounded bg-gray-700 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
