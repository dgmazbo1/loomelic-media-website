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
  SPORTS_ILLUSTRATED,
  JW_OFFROAD,
  HERO_VIDEOS,
} from "@/lib/media";

// ─── LEXUS OF HENDERSON ──────────────────────────────────────
export function LexusHendersonPage() {
  return (
    <ProjectPageTemplate
      data={{
        slug: "lexus-of-henderson",
        title: "LEXUS OF HENDERSON",
        category: "AUTOMOTIVE \u2022 MARKETING",
        year: "2026",
        client: "Lexus of Henderson",
        services: ["Automotive Marketing", "Photography", "Social Media Content", "Videography"],
        description:
          "A comprehensive automotive marketing campaign for Lexus of Henderson featuring cinematic vehicle showcases, dealership photography, and social media content. We captured the elegance and performance of the Lexus lineup through dramatic lighting, precise composition, and cinematic motion — delivering content that elevated the dealership's brand presence across all digital channels.",
        heroImage: LEXUS_HENDERSON.hero,
        gallery: LEXUS_HENDERSON.gallery,
        vimeoIds: LEXUS_HENDERSON.vimeoIds,
        feedback: {
          quote: "Loomelic Media completely transformed how we present our vehicles online. The quality of their photography and video work is unlike anything we've seen from other production companies in Las Vegas. Our engagement rates doubled within the first month of launching the new content.",
          name: "General Manager",
          title: "General Manager",
          company: "Lexus of Henderson",
        },
        outcomes: [
          {
            metric: "Social Engagement",
            value: "2\u00d7",
            label: "Engagement rate doubled within 30 days of launching new content across Instagram and Facebook.",
          },
          {
            metric: "Content Delivered",
            value: "60+",
            label: "Photos and short-form videos delivered for website, social media, and digital advertising use.",
          },
          {
            metric: "Turnaround",
            value: "48h",
            label: "Edited, retouched, and web-ready assets delivered within 48 hours of each shoot day.",
          },
        ],
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
        category: "AUTOMOTIVE \u2022 PHOTOGRAPHY",
        year: "2026",
        client: "Lexus of Las Vegas",
        services: ["Automotive Photography", "Commercial Photography", "Social Media Content"],
        description:
          "An extensive automotive photography project for Lexus of Las Vegas, combining ground-level precision photography with wide-angle dealership shots. The project captured the full Lexus inventory across multiple sessions, delivering high-resolution images for the dealership's website, digital advertising, and social media platforms.",
        heroImage: LEXUS_LAS_VEGAS.hero,
        gallery: LEXUS_LAS_VEGAS.gallery,
        feedback: {
          quote: "We've worked with a lot of content creators over the years, but Loomelic is on a different level. They understand the automotive space — they know how to make a car look incredible and how to tell a story that actually drives customers to the showroom.",
          name: "Marketing Director",
          title: "Marketing Director",
          company: "Lexus of Las Vegas",
        },
        outcomes: [
          {
            metric: "Vehicles Photographed",
            value: "40+",
            label: "Full inventory coverage across multiple vehicle lines, both exterior and interior.",
          },
          {
            metric: "Platforms Served",
            value: "4",
            label: "Assets optimized and delivered for website, Instagram, Facebook, and digital ad campaigns.",
          },
          {
            metric: "Session Days",
            value: "3",
            label: "Three dedicated shoot days covering the full dealership lot and showroom floor.",
          },
        ],
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
        title: "LAS VEGAS RAIDERS TOUR \u2014 THE BLAST",
        category: "EVENTS \u2022 VIDEOGRAPHY",
        year: "2026",
        client: "Las Vegas Raiders",
        services: ["Event Coverage", "Videography", "Photography"],
        description:
          "Full event coverage for the Las Vegas Raiders Tour — The Blast, capturing the energy, excitement, and key moments of this high-profile event. Our team provided comprehensive photo and video documentation of the tour, delivering cinematic content that showcased the Raiders brand and fan experience.",
        heroImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029344895/RmajYjEDnrnlYrjq.jpg",
        gallery: RAIDERS_BLAST.gallery,
        feedback: {
          quote: "The team from Loomelic captured everything we needed — the atmosphere, the energy, the brand moments. They were professional, fast, and delivered content that we were proud to share across all of our channels.",
          name: "Event Coordinator",
          title: "Event Coordinator",
          company: "Las Vegas Raiders",
        },
        outcomes: [
          {
            metric: "Event Hours Covered",
            value: "8h",
            label: "Full-day event documentation from setup through the final moments of the tour.",
          },
          {
            metric: "Deliverables",
            value: "100+",
            label: "Edited photos and video clips delivered for social media, press, and internal use.",
          },
          {
            metric: "Turnaround",
            value: "24h",
            label: "Same-day and next-day edits delivered for immediate social media posting.",
          },
        ],
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
        category: "AUTOMOTIVE \u2022 DEALER SERVICES",
        year: "2026",
        client: "Centennial Subaru",
        services: ["Automotive Photography", "Social Media Content", "Videography"],
        description:
          "A dynamic automotive photography and video project for Centennial Subaru, showcasing their off-road capable lineup and dealership culture. The project combined traditional automotive photography with cinematic video to create a comprehensive content library for the dealership's marketing campaigns across social media and digital advertising.",
        heroImage: CENTENNIAL_SUBARU.hero,
        gallery: CENTENNIAL_SUBARU.gallery,
        vimeoIds: CENTENNIAL_SUBARU.vimeoIds,
        videoSrc: HERO_VIDEOS.centennialDrone + "#t=0,5",
        feedback: {
          quote: "From the first shoot to the final delivery, the process was seamless. They came prepared, worked efficiently, and the results spoke for themselves. Our social media content has never looked better — and our customers have noticed.",
          name: "Marketing Manager",
          title: "Marketing Manager",
          company: "Centennial Subaru",
        },
        outcomes: [
          {
            metric: "Content Library",
            value: "80+",
            label: "Photos and videos delivered for website listings, social media, and paid advertising.",
          },
          {
            metric: "Drone Coverage",
            value: "Aerial",
            label: "Cinematic drone footage of the dealership lot and surrounding area for brand storytelling.",
          },
          {
            metric: "Monthly Retainer",
            value: "Ongoing",
            label: "Continued monthly content production keeping the dealership's social channels fresh and consistent.",
          },
        ],
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
        category: "EVENTS \u2022 PHOTOGRAPHY",
        year: "2026",
        client: "Wondr Nation",
        services: ["Event Coverage", "Photography", "Brand Strategy"],
        description:
          "Comprehensive event photography coverage for Wondr Nation at the Global Gaming Expo (G2E) in Las Vegas. We documented the full event experience — from keynote sessions and networking events to the reception gala — delivering a complete visual record of this premier industry gathering.",
        heroImage: WONDR_NATION.hero,
        gallery: WONDR_NATION.gallery,
        feedback: {
          quote: "Loomelic Media delivered exactly what we needed — professional, polished event photography that captured the spirit of our brand and the energy of the G2E conference. The images were stunning and ready to use immediately.",
          name: "Brand Director",
          title: "Brand Director",
          company: "Wondr Nation",
        },
        outcomes: [
          {
            metric: "Event Days",
            value: "3",
            label: "Three full days of continuous coverage across all G2E conference sessions and evening events.",
          },
          {
            metric: "Images Delivered",
            value: "200+",
            label: "Edited, retouched images covering keynotes, networking, activations, and the reception gala.",
          },
          {
            metric: "Usage",
            value: "Multi",
            label: "Content used across press releases, social media, website, and internal communications.",
          },
        ],
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
        category: "EVENTS \u2022 EDITORIAL PHOTOGRAPHY",
        year: "2026",
        client: "The Blast \u2014 Bob Marley Hope Road",
        services: ["Editorial Photography", "Event Coverage", "Social Media Content"],
        description:
          "Loomelic Media partnered with The Blast and Bob Marley at Hope Road to create immersive visual content that captured the late-night energy, culture, and vibe of this unique Las Vegas destination. Working in extremely low-light conditions with fast-paced movement — bartenders in action, guests flowing in and out, and intentionally moody ambient lighting — required advanced camera setups and real-time adjustments to capture sharp, vibrant imagery without losing the atmosphere.\n\nWe equipped our team with fast-aperture lenses, full-frame sensors, and stabilization tools to manage light sensitivity and motion blur. Strategic lighting placement and planned hero shots helped maximize key brand moments, while candid captures preserved the authenticity of the night. Post-production focused on maintaining the rich tones of the environment while ensuring faces, product highlights, and logos remained crisp and clear.",
        heroImage: BOB_MARLEY.hero,
        gallery: BOB_MARLEY.gallery,
        feedback: {
          quote: "Shooting in those conditions is not easy — low light, fast movement, a packed venue. Loomelic handled it effortlessly. The images they delivered captured the real energy of the night in a way that our own team couldn't. We use these photos everywhere now.",
          name: "Creative Director",
          title: "Creative Director",
          company: "The Blast — Bob Marley Hope Road",
        },
        outcomes: [
          {
            metric: "Shooting Conditions",
            value: "Low\u2011Light",
            label: "Advanced low-light photography techniques deployed across a fully operational nightlife venue.",
          },
          {
            metric: "Images Delivered",
            value: "150+",
            label: "Editorial and brand-ready images capturing atmosphere, product moments, and guest interactions.",
          },
          {
            metric: "Social Reach",
            value: "Viral",
            label: "Select images shared widely across social media, generating organic reach beyond the initial campaign.",
          },
        ],
      }}
    />
  );
}

// ─── JW OFFROAD ─────────────────────────────────────────────
export function JwOffroadPage() {
  return (
    <ProjectPageTemplate
      data={{
        slug: "jw-offroad",
        title: "JW OFFROAD",
        category: "AUTOMOTIVE • LIFESTYLE",
        year: "2025",
        client: "JW Offroad",
        services: ["Product Photography", "Videography", "Social Media Content"],
        description:
          "A lifestyle-driven automotive content campaign for JW Offroad, capturing the raw energy and capability of their aftermarket vehicle builds. The project combined on-location action photography with product detail shots to create a compelling visual library for social media, digital advertising, and brand storytelling.",
        heroImage: JW_OFFROAD.hero,
        gallery: JW_OFFROAD.gallery,
        outcomes: [
          {
            metric: "Content Type",
            value: "Lifestyle",
            label: "Action-focused photography and video showcasing off-road performance and aftermarket builds.",
          },
          {
            metric: "Deliverables",
            value: "50+",
            label: "Edited photos and video clips optimized for social media and digital advertising.",
          },
          {
            metric: "Platforms",
            value: "3",
            label: "Content delivered for Instagram, Facebook, and the JW Offroad website.",
          },
        ],
      }}
    />
  );
}

// ─── SPORTS ILLUSTRATED — SPORTSPERSON OF THE YEAR 2026 ─────
export function SportsIllustratedPage() {
  return (
    <ProjectPageTemplate
      data={{
        slug: "sports-illustrated-sportsperson-2026",
        title: "SPORTS ILLUSTRATED: SPORTSPERSON OF THE YEAR 2026",
        category: "EVENTS • PHOTOGRAPHY",
        year: "2026",
        client: "The Blast — Sports Illustrated",
        services: ["Event Photography", "Red Carpet Coverage", "Editorial Photography"],
        description:
          "Loomelic Media was on the ground for Sports Illustrated's Sportsperson of the Year 2026, held in Las Vegas. Over the course of one evening, our team covered the red carpet in full — photographing athletes, celebrities, and media personalities as they arrived for one of sports media's most prestigious annual events.\n\nWorking alongside The Blast, we conducted red carpet interviews and captured 100 images across the evening, delivering editorial-quality content that documented the energy, fashion, and star power of the night. From wide establishing shots to tight portrait moments, every frame was crafted to meet the high standards of a Sports Illustrated production.",
        heroImage: SPORTS_ILLUSTRATED.hero,
        gallery: SPORTS_ILLUSTRATED.gallery,
        feedback: {
          quote: "Loomelic showed up ready. The red carpet was fast-paced, the talent kept moving, and they captured every key moment without missing a beat. The images were clean, sharp, and delivered on time — exactly what we needed for a night like this.",
          name: "Production Team",
          title: "Red Carpet Producer",
          company: "The Blast",
        },
        outcomes: [
          {
            metric: "Event Duration",
            value: "1 Night",
            label: "Full red carpet and event coverage delivered in a single high-energy evening shoot.",
          },
          {
            metric: "Images Delivered",
            value: "100",
            label: "Editorial-quality photographs capturing athletes, celebrities, and key brand moments.",
          },
          {
            metric: "Coverage",
            value: "Red Carpet",
            label: "Exclusive red carpet access with athlete interviews conducted alongside The Blast.",
          },
        ],
      }}
    />
  );
}
