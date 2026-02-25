/* ============================================================
   ProjectPages — All 6 project detail pages
   Routes: /projects/lexus-of-henderson
           /projects/lexus-of-las-vegas
           /projects/las-vegas-raiders-tour
           /projects/centennial-subaru
           /projects/wondr-nation-g2e
           /projects/bob-marley-hope-road
   ============================================================ */

import ProjectPageTemplate from "@/components/ProjectPageTemplate";
import {
  LEXUS_HENDERSON,
  LEXUS_LAS_VEGAS,
  RAIDERS_BLAST,
  CENTENNIAL_SUBARU,
  WONDR_NATION,
  BOB_MARLEY,
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
        services: ["Automotive Photography", "Commercial Photography", "Social Media Content"],
        description:
          "An extensive automotive photography project for Lexus of Las Vegas, combining ground-level precision photography with wide-angle dealership shots. The project captured the full Lexus inventory across multiple sessions, delivering high-resolution images for the dealership's website, digital advertising, and social media platforms.",
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
        heroImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029344895/RmajYjEDnrnlYrjq.jpg",
        gallery: [],
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
        category: "AUTOMOTIVE • DEALER SERVICES",
        year: "2026",
        client: "Centennial Subaru",
        services: ["Automotive Photography", "Social Media Content", "Videography"],
        description:
          "A dynamic automotive photography and video project for Centennial Subaru, showcasing their off-road capable lineup and dealership culture. The project combined traditional automotive photography with cinematic video to create a comprehensive content library for the dealership's marketing campaigns across social media and digital advertising.",
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

// ─── BOB MARLEY HOPE ROAD ────────────────────────────────────
export function BobMarleyPage() {
  return (
    <ProjectPageTemplate
      data={{
        slug: "bob-marley-hope-road",
        title: "BOB MARLEY HOPE ROAD",
        category: "EVENTS • EDITORIAL PHOTOGRAPHY",
        year: "2026",
        client: "The Blast — Bob Marley Hope Road",
        services: ["Editorial Photography", "Event Coverage", "Social Media Content"],
        description:
          "Loomelic Media partnered with The Blast and Bob Marley at Hope Road to create immersive visual content that captured the late-night energy, culture, and vibe of this unique Las Vegas destination. Working in extremely low-light conditions with fast-paced movement — bartenders in action, guests flowing in and out, and intentionally moody ambient lighting — required advanced camera setups and real-time adjustments to capture sharp, vibrant imagery without losing the atmosphere.\n\nWe equipped our team with fast-aperture lenses, full-frame sensors, and stabilization tools to manage light sensitivity and motion blur. Strategic lighting placement and planned hero shots helped maximize key brand moments, while candid captures preserved the authenticity of the night. Post-production focused on maintaining the rich tones of the environment while ensuring faces, product highlights, and logos remained crisp and clear.",
        heroImage: BOB_MARLEY.hero,
        gallery: BOB_MARLEY.gallery,
      }}
    />
  );
}
