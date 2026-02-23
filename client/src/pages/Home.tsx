/* ============================================================
   LOOMELIC MEDIA — Home Page
   Design: Dark Cinematic Luxury
   Sections: Hero → Showreel → About → Services → Projects → Portfolio → Contact
   ============================================================ */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ShowreelSection from "@/components/ShowreelSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import PortfolioSection from "@/components/PortfolioSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[oklch(0.07_0.005_285)] overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ShowreelSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <PortfolioSection />
      <ContactSection />
    </div>
  );
}
