import AboutSection from "@/components/sections/AboutSection";
import EventsSection from "@/components/sections/EventsSection";
import HeroSection from "@/components/sections/HeroSection";
import RecruitmentSection from "@/components/sections/RecruitmentSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <EventsSection />
      <RecruitmentSection />
    </div>
  );
}
