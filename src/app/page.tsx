import Header from "@/components/layout/Header"
import HeroSection from "@/components/sections/HeroSection"
import AboutSection from "@/components/sections/AboutSection"
import EventsSection from "@/components/sections/EventsSection"
import RecruitmentSection from "@/components/sections/RecruitmentSection"
import Footer from "@/components/layout/Footer"

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <HeroSection />
      <AboutSection />
      <EventsSection />
      <RecruitmentSection />
      <Footer />
    </div>
  )
}
