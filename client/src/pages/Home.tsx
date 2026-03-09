/* ============================================================
   Home Page — Unusually-inspired redesign
   Section order: Hero → About (light) → Services (dark) → Stats (light)
                → Projects (black) → Portfolio (light) → Contact CTA (dark) → Contact Form (light) → Footer (dark)
   ============================================================ */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";
import ProjectsSection from "@/components/ProjectsSection";
import PortfolioSection from "@/components/PortfolioSection";
import ContactSection from "@/components/ContactSection";
import PortalsSection from "@/components/PortalsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <StatsSection />
      <ProjectsSection />
      <PortfolioSection />
      <PortalsSection />
      <ContactSection />
    </div>
  );
}
