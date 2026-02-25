/* ============================================================
   ProjectPages — All 5 project detail pages
   Routes: /projects/lexus-of-henderson
           /projects/lexus-of-las-vegas
           /projects/las-vegas-raiders-tour
           /projects/centennial-subaru
           /projects/wondr-nation-g2e
   Wedding removed.
   ============================================================ */

import ProjectPageTemplate from "@/components/ProjectPageTemplate";
import {
  LEXUS_HENDERSON,
  LEXUS_LAS_VEGAS,
  RAIDERS_BLAST,
  CENTENNIAL_SUBARU,
  WONDR_NATION,
  HERO_VIDEOS,
} from "@/lib/media";

// ─── LEXUS OF HENDERSON ──────────────────────────────────────
export function LexusHendersonPage() {
  return (
    <ProjectPageTemplate
      data={{
        slug: "lexus-of-henderson",
        title: "LEXUS OF HENDERSON",
        category: "AUTOMOTIVE • MARKETING",
        year: "2026",
        client: "Lexus of Henderson",
        services: ["Automotive Marketing", "Photography", "Social Media Content", "Videography"],
        description:
          "A comprehensive automotive marketing campaign for Lexus of Henderson featuring cinematic vehicle showcases, dealership photography, and social media content. We captured the elegance and performance of the Lexus lineup through dramatic lighting, precise composition, and cinematic motion — delivering content that elevated the dealership's brand presence across all digital channels.",
        heroImage: LEXUS_HENDERSON.hero,
        gallery: LEXUS_HENDERSON.gallery,
        vimeoIds: LEXUS_HENDERSON.vimeoIds,
      }}
    />
  );
}

// ─── LEXUS OF LAS VEGAS ──────────────────────────────────────
export function LexusLasVegasPage() {
  return (
    <ProjectPageTemplate
      data={{
        slug: "lexus-of-las-vegas",
        title: "LEXUS OF LAS VEGAS",
        category: "AUTOMOTIVE • PHOTOGRAPHY",
        year: "2026",
        client: "Lexus of Las Vegas",
        services: ["Automotive Photography", "Aerial Photography", "Commercial Photography"],
        description:
          "An extensive automotive photography project for Lexus of Las Vegas, combining ground-level precision photography with FAA-certified aerial drone shots. The project captured the full Lexus inventory across multiple sessions, delivering high-resolution images for the dealership's website, digital advertising, and social media platforms.",
        heroImage: LEXUS_LAS_VEGAS.hero,
        gallery: LEXUS_LAS_VEGAS.gallery,
      }}
    />
  );
}

// ─── LAS VEGAS RAIDERS TOUR ──────────────────────────────────
export function RaidersPage() {
  return (
    <ProjectPageTemplate
      data={{
        slug: "las-vegas-raiders-tour",
        title: "LAS VEGAS RAIDERS TOUR — THE BLAST",
        category: "EVENTS • VIDEOGRAPHY",
        year: "2026",
        client: "Las Vegas Raiders",
        services: ["Event Coverage", "Videography", "Photography"],
        description:
          "Full event coverage for the Las Vegas Raiders Tour — The Blast, capturing the energy, excitement, and key moments of this high-profile event. Our team provided comprehensive photo and video documentation of the tour, delivering cinematic content that showcased the Raiders brand and fan experience.",
        heroImage: RAIDERS_BLAST.hero,
        gallery: RAIDERS_BLAST.gallery,
        videoSrc: HERO_VIDEOS.websiteVideo,
      }}
    />
  );
}

// ─── CENTENNIAL SUBARU ───────────────────────────────────────
export function CentennialSubaruPage() {
  return (
    <ProjectPageTemplate
      data={{
        slug: "centennial-subaru",
        title: "CENTENNIAL SUBARU",
        category: "AUTOMOTIVE • AERIAL",
        year: "2026",
        client: "Centennial Subaru",
        services: ["Automotive Photography", "Aerial Photography", "Social Media Content"],
        description:
          "A dynamic automotive photography and aerial drone project for Centennial Subaru, showcasing their off-road capable lineup in dramatic desert and mountain environments. The project combined traditional automotive photography with breathtaking aerial perspectives to create a comprehensive content library for the dealership's marketing campaigns.",
        heroImage: CENTENNIAL_SUBARU.hero,
        gallery: CENTENNIAL_SUBARU.gallery,
        videoSrc: HERO_VIDEOS.centennialDrone,
      }}
    />
  );
}

// ─── WONDR NATION G2E ────────────────────────────────────────
export function WondrNationPage() {
  return (
    <ProjectPageTemplate
      data={{
        slug: "wondr-nation-g2e",
        title: "WONDR NATION G2E",
        category: "EVENTS • PHOTOGRAPHY",
        year: "2026",
        client: "Wondr Nation",
        services: ["Event Coverage", "Photography", "Brand Strategy"],
        description:
          "Comprehensive event photography coverage for Wondr Nation at the Global Gaming Expo (G2E) in Las Vegas. We documented the full event experience — from keynote sessions and networking events to the reception gala — delivering a complete visual record of this premier industry gathering.",
        heroImage: WONDR_NATION.hero,
        gallery: WONDR_NATION.gallery,
      }}
    />
  );
}
