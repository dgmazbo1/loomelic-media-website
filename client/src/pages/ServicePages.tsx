/* ============================================================
   ServicePages — All 5 individual service pages
   Routes: /services/automotive-marketing
           /services/event-coverage
           /services/social-media-content
           /services/photography
           /services/brand-strategy
   ============================================================ */

import ServicePageTemplate from "@/components/ServicePageTemplate";
import {
  HERO_VIDEOS,
  LEXUS_HENDERSON,
  LEXUS_LAS_VEGAS,
  CENTENNIAL_SUBARU,
  RAIDERS_BLAST,
  WONDR_NATION,
} from "@/lib/media";

// ─── AUTOMOTIVE MARKETING ────────────────────────────────────
export function AutomotiveMarketingPage() {
  return (
    <ServicePageTemplate
      data={{
        slug: "automotive-marketing",
        name: "AUTOMOTIVE\nMARKETING",
        tagline: "Cinematic vehicle showcases and dealership campaigns that drive traffic, elevate your brand, and convert viewers into buyers.",
        description: [
          "We specialize in creating high-impact automotive content that makes your vehicles look as incredible on screen as they do in person. From dramatic exterior walkarounds to immersive interior reveals, our cinematic approach transforms standard dealership marketing into compelling visual stories.",
          "Working with brands like Lexus of Henderson and Lexus of Las Vegas, we've developed a deep understanding of what automotive buyers respond to — and we bring that expertise to every shoot.",
        ],
        features: [
          { title: "CINEMATIC VEHICLE SHOWCASES", desc: "Multi-angle, professionally lit vehicle shoots that highlight every detail — from exterior lines to interior craftsmanship." },
          { title: "DEALERSHIP CAMPAIGNS", desc: "Full-scale marketing campaigns including photography, video, and social content tailored to your dealership's brand voice." },
          { title: "SOCIAL MEDIA ADS", desc: "Short-form video ads optimized for Instagram Reels, TikTok, and YouTube Shorts that stop the scroll and drive leads." },
          { title: "AERIAL & DRONE COVERAGE", desc: "FAA-certified drone footage that adds cinematic scale to your dealership lot and vehicle showcase content." },
        ],
        heroVideo: HERO_VIDEOS.lexusRoll,
        galleryImages: [
          ...LEXUS_HENDERSON.gallery.slice(0, 6),
          ...LEXUS_LAS_VEGAS.gallery.slice(0, 6),
        ],
        relatedProjects: [
          { slug: "lexus-of-henderson", title: "LEXUS OF HENDERSON", category: "AUTOMOTIVE • MARKETING", image: LEXUS_HENDERSON.hero },
          { slug: "lexus-of-las-vegas", title: "LEXUS OF LAS VEGAS", category: "AUTOMOTIVE • PHOTOGRAPHY", image: LEXUS_LAS_VEGAS.hero },
          { slug: "centennial-subaru", title: "CENTENNIAL SUBARU", category: "AUTOMOTIVE • AERIAL", image: CENTENNIAL_SUBARU.hero },
        ],
      }}
    />
  );
}

// ─── EVENT COVERAGE ──────────────────────────────────────────
export function EventCoveragePage() {
  return (
    <ServicePageTemplate
      data={{
        slug: "event-coverage",
        name: "EVENT\nCOVERAGE",
        tagline: "Full-service photo and video coverage for corporate events, brand activations, concerts, and private gatherings.",
        description: [
          "From intimate private gatherings to large-scale corporate events and brand activations, we provide comprehensive photo and video coverage that captures the energy, emotion, and key moments of your event.",
          "Our team is experienced in fast-paced, dynamic environments — we move efficiently and unobtrusively to document every important moment without disrupting the flow of your event.",
        ],
        features: [
          { title: "CORPORATE EVENTS", desc: "Professional coverage of conferences, galas, product launches, and corporate gatherings with a polished, editorial look." },
          { title: "BRAND ACTIVATIONS", desc: "Dynamic coverage of experiential marketing events, pop-ups, and brand activations that captures audience engagement." },
          { title: "HIGHLIGHT REELS", desc: "Cinematic event recap videos edited for social media, internal use, or promotional purposes." },
          { title: "SAME-DAY EDITS", desc: "Fast-turnaround edited content available for immediate social media posting during or after your event." },
        ],
        heroImage: RAIDERS_BLAST.hero,
        galleryImages: [
          ...RAIDERS_BLAST.gallery,
          ...WONDR_NATION.gallery,
        ],
        relatedProjects: [
          { slug: "las-vegas-raiders-tour", title: "LAS VEGAS RAIDERS TOUR", category: "EVENTS • VIDEOGRAPHY", image: RAIDERS_BLAST.hero },
          { slug: "wondr-nation-g2e", title: "WONDR NATION G2E", category: "EVENTS • PHOTOGRAPHY", image: WONDR_NATION.hero },
        ],
      }}
    />
  );
}

// ─── SOCIAL MEDIA CONTENT ────────────────────────────────────
export function SocialMediaContentPage() {
  return (
    <ServicePageTemplate
      data={{
        slug: "social-media-content",
        name: "SOCIAL MEDIA\nCONTENT",
        tagline: "High-impact short-form video and photo content built to stop the scroll, grow your audience, and drive real results.",
        description: [
          "In today's attention economy, your social media content needs to be exceptional to stand out. We create platform-native content specifically engineered for Instagram, TikTok, and YouTube — content that feels organic while delivering your brand message with precision.",
          "From concept to final edit, we handle the entire production process, delivering ready-to-post content optimized for each platform's algorithm and audience behavior.",
        ],
        features: [
          { title: "SHORT-FORM VIDEO", desc: "Reels, TikToks, and YouTube Shorts that combine cinematic quality with native platform aesthetics to maximize engagement." },
          { title: "CONTENT CALENDARS", desc: "Strategic monthly content planning that ensures consistent posting and cohesive brand storytelling across all platforms." },
          { title: "TALKING HEAD & TESTIMONIALS", desc: "Professional on-camera interviews, testimonials, and spokesperson content that builds trust and authority." },
          { title: "PRODUCT & SERVICE SHOWCASES", desc: "Visually compelling product demos and service highlight videos designed to convert viewers into customers." },
        ],
        heroVideo: HERO_VIDEOS.socialMediaAds,
        galleryImages: [
          ...LEXUS_HENDERSON.gallery.slice(0, 4),
          ...LEXUS_LAS_VEGAS.gallery.slice(0, 4),
          ...CENTENNIAL_SUBARU.gallery.slice(0, 4),
        ],
        relatedProjects: [
          { slug: "lexus-of-henderson", title: "LEXUS OF HENDERSON", category: "AUTOMOTIVE • MARKETING", image: LEXUS_HENDERSON.hero },
          { slug: "centennial-subaru", title: "CENTENNIAL SUBARU", category: "AUTOMOTIVE • AERIAL", image: CENTENNIAL_SUBARU.hero },
        ],
      }}
    />
  );
}

// ─── PHOTOGRAPHY ─────────────────────────────────────────────
export function PhotographyPage() {
  return (
    <ServicePageTemplate
      data={{
        slug: "photography",
        name: "PHOTOGRAPHY",
        tagline: "Professional photo shoots for automotive, events, portraits, and commercial use — every frame composed to tell your brand's story.",
        description: [
          "Photography is the foundation of every great brand. Our commercial photography services deliver stunning, high-resolution images that communicate quality, professionalism, and your unique brand identity.",
          "Whether you need automotive photography, event coverage, executive portraits, or commercial product shots, we bring the same cinematic eye and meticulous attention to detail to every frame.",
        ],
        features: [
          { title: "AUTOMOTIVE PHOTOGRAPHY", desc: "Studio-quality automotive photography on location — dramatic lighting, precise angles, and post-processing that makes every vehicle shine." },
          { title: "EVENT PHOTOGRAPHY", desc: "Fast, accurate event coverage that captures key moments, candid interactions, and the overall atmosphere of your event." },
          { title: "COMMERCIAL & PRODUCT", desc: "Clean, professional product and commercial photography for advertising, e-commerce, and marketing materials." },
          { title: "AERIAL PHOTOGRAPHY", desc: "FAA-certified drone photography delivering breathtaking aerial perspectives for real estate, events, and commercial use." },
        ],
        heroImage: LEXUS_LAS_VEGAS.hero,
        galleryImages: [
          ...LEXUS_HENDERSON.gallery.slice(0, 6),
          ...LEXUS_LAS_VEGAS.gallery,
          ...CENTENNIAL_SUBARU.gallery.slice(0, 6),
        ],
        relatedProjects: [
          { slug: "lexus-of-las-vegas", title: "LEXUS OF LAS VEGAS", category: "AUTOMOTIVE • PHOTOGRAPHY", image: LEXUS_LAS_VEGAS.hero },
          { slug: "lexus-of-henderson", title: "LEXUS OF HENDERSON", category: "AUTOMOTIVE • MARKETING", image: LEXUS_HENDERSON.hero },
          { slug: "wondr-nation-g2e", title: "WONDR NATION G2E", category: "EVENTS • PHOTOGRAPHY", image: WONDR_NATION.hero },
        ],
      }}
    />
  );
}

// ─── BRAND STRATEGY ──────────────────────────────────────────
export function BrandStrategyPage() {
  return (
    <ServicePageTemplate
      data={{
        slug: "brand-strategy",
        name: "BRAND\nSTRATEGY",
        tagline: "Visual identity development, content strategy, and digital marketing guidance to position your brand for sustained growth.",
        description: [
          "A great brand is more than a logo — it's a complete visual and strategic identity that communicates your values, attracts your ideal audience, and differentiates you from the competition. We help businesses build that identity from the ground up.",
          "Our brand strategy services combine creative direction with data-driven marketing insights to deliver a cohesive brand presence across all touchpoints — from your website and social media to your physical marketing materials.",
        ],
        features: [
          { title: "VISUAL IDENTITY", desc: "Logo design, color systems, typography, and brand guidelines that create a consistent, professional brand presence." },
          { title: "CONTENT STRATEGY", desc: "Data-driven content planning that aligns your messaging with your audience's needs and your business goals." },
          { title: "DIGITAL MARKETING", desc: "Strategic guidance on paid advertising, organic growth, and platform selection to maximize your marketing ROI." },
          { title: "BRAND CONSULTING", desc: "One-on-one consulting sessions to audit your existing brand, identify opportunities, and develop an actionable growth roadmap." },
        ],
        heroVideo: HERO_VIDEOS.websiteVideo,
        galleryImages: [
          ...LEXUS_HENDERSON.gallery.slice(0, 4),
          ...WONDR_NATION.gallery,
          ...LEXUS_LAS_VEGAS.gallery.slice(0, 4),
        ],
        relatedProjects: [
          { slug: "wondr-nation-g2e", title: "WONDR NATION G2E", category: "EVENTS • PHOTOGRAPHY", image: WONDR_NATION.hero },
          { slug: "lexus-of-henderson", title: "LEXUS OF HENDERSON", category: "AUTOMOTIVE • MARKETING", image: LEXUS_HENDERSON.hero },
        ],
      }}
    />
  );
}
