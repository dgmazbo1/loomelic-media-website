/* ============================================================
   Home Page — Enterprise platform evolution
   Section order: Hero → About (light) → Services (dark)
                → HowItWorks (light) → Stats (light)
                → CaseStudiesPreview (black) → Projects (black)
                → Portfolio (light) → Portals (dark)
                → Contact CTA (dark) → Contact Form (light) → Footer (dark)
   ============================================================ */

import { useSEO } from "@/hooks/useSEO";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import HowItWorks from "@/components/HowItWorks";
import StatsSection from "@/components/StatsSection";
import CaseStudiesPreview from "@/components/CaseStudiesPreview";
import ProjectsSection from "@/components/ProjectsSection";
import PortfolioSection from "@/components/PortfolioSection";
import PortalsSection from "@/components/PortalsSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  useSEO({
    title: "Las Vegas Video Production",
    description: "Las Vegas video production for conventions, trade shows & automotive dealers. Serving Henderson and Southern Nevada.",
    canonical: "/",
  });
  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <HowItWorks />
      <StatsSection />
      <CaseStudiesPreview />
      <ProjectsSection />
      <PortfolioSection />
      <PortalsSection />
      <ContactSection />
    </div>
  );
}
