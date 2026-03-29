/* ============================================================
   ServicePages — All 7 individual service pages
   Routes: /services/automotive-marketing
           /services/event-coverage
           /services/social-media-content
           /services/photography
           /services/brand-strategy
           /services/website-redesign
           /services/headshots
   ============================================================ */

import { useSEO } from "@/hooks/useSEO";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import {
  HERO_VIDEOS,
  LEXUS_HENDERSON,
  LEXUS_LAS_VEGAS,
  CENTENNIAL_SUBARU,
  RAIDERS_BLAST,
  WONDR_NATION,
  HEADSHOTS,
} from "@/lib/media";

// ─── AUTOMOTIVE MARKETING ────────────────────────────────────
export function AutomotiveMarketingPage() {
  useSEO({
    title: "Automotive Marketing Video Las Vegas",
    description: "Video production and photography for Las Vegas automotive dealers — inventory, social reels, events, and CRM content at scale.",
    canonical: "/services/automotive-marketing",
  });
  return (
    <ServicePageTemplate
      data={{
        slug: "automotive-marketing",
        name: "AUTOMOTIVE\nMARKETING",
        tagline: "Cinematic vehicle showcases and dealership campaigns that drive traffic, elevate your brand, and convert viewers into buyers.",
        description: [
          "We specialize in creating high-impact automotive content that makes your vehicles look as incredible on screen as they do in person. From dramatic exterior walkarounds to immersive interior reveals, our cinematic approach transforms standard dealership marketing into compelling visual stories.",
          "Working with the Findlay Automotive Group and the Ascent Group of Dealers, we've developed a deep understanding of what automotive buyers respond to — and we bring that expertise to every shoot, every month.",
        ],
        features: [
          { title: "CINEMATIC VEHICLE SHOWCASES", desc: "Multi-angle, professionally lit vehicle shoots that highlight every detail — from exterior lines to interior craftsmanship." },
          { title: "DEALERSHIP CAMPAIGNS", desc: "Full-scale marketing campaigns including photography, video, and social content tailored to your dealership's brand voice." },
          { title: "SOCIAL MEDIA ADS", desc: "Short-form video ads optimized for Instagram Reels, TikTok, and YouTube Shorts that stop the scroll and drive leads." },
          { title: "INVENTORY DOCUMENTATION", desc: "Systematic, consistent vehicle photography and video for your website, third-party listings, and digital advertising." },
        ],
        heroVideo: HERO_VIDEOS.lexusRoll,
        testimonials: [
          {
            quote: "Loomelic Media completely transformed how we present our vehicles online. The quality of their photography and video work is unlike anything we've seen from other production companies in Las Vegas. Our engagement rates doubled within the first month.",
            name: "General Manager",
            company: "Lexus of Henderson",
          },
          {
            quote: "We've worked with a lot of content creators over the years, but Loomelic is on a different level. They understand the automotive space — they know how to make a car look incredible and how to tell a story that actually drives customers to the showroom.",
            name: "Marketing Director",
            company: "Lexus of Las Vegas",
          },
          {
            quote: "From the first shoot to the final delivery, the process was seamless. They came prepared, worked efficiently, and the results spoke for themselves. Our social media content has never looked better.",
            name: "Marketing Manager",
            company: "Centennial Subaru",
          },
        ],
        relatedProjects: [
          { slug: "lexus-of-henderson", title: "LEXUS OF HENDERSON", category: "AUTOMOTIVE \u2022 MARKETING", image: LEXUS_HENDERSON.hero },
          { slug: "lexus-of-las-vegas", title: "LEXUS OF LAS VEGAS", category: "AUTOMOTIVE \u2022 PHOTOGRAPHY", image: LEXUS_LAS_VEGAS.hero },
          { slug: "centennial-subaru", title: "CENTENNIAL SUBARU", category: "AUTOMOTIVE \u2022 DEALER SERVICES", image: CENTENNIAL_SUBARU.hero },
        ],
      }}
    />
  );
}

// ─── EVENT COVERAGE ──────────────────────────────────────────
export function EventCoveragePage() {
  useSEO({
    title: "Event Video & Photo Coverage Las Vegas",
    description: "Professional event photography and videography in Las Vegas — corporate events, concerts, brand activations, and private gatherings.",
    canonical: "/services/event-coverage",
  });
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
        heroImage: WONDR_NATION.hero,
        featuredGallery: {
          label: "G2E 2025 — LAS VEGAS",
          images: WONDR_NATION.gallery,
        },
        galleryImages: [
          ...WONDR_NATION.gallery,
          ...RAIDERS_BLAST.gallery,
        ],
        relatedProjects: [
          { slug: "las-vegas-raiders-tour", title: "LAS VEGAS RAIDERS TOUR", category: "EVENTS \u2022 VIDEOGRAPHY", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029344895/RmajYjEDnrnlYrjq.jpg" },
          { slug: "wondr-nation-g2e", title: "WONDR NATION G2E", category: "EVENTS \u2022 PHOTOGRAPHY", image: WONDR_NATION.hero },
        ],
      }}
    />
  );
}

// ─── SOCIAL MEDIA CONTENT ────────────────────────────────────
export function SocialMediaContentPage() {
  useSEO({
    title: "Social Media Video Content Las Vegas",
    description: "Short-form social media video production for Las Vegas businesses — Reels, TikToks, and YouTube Shorts built to drive engagement.",
    canonical: "/services/social-media-content",
  });
  return (
    <ServicePageTemplate
      data={{
        slug: "social-media-content",
        name: "SOCIAL MEDIA\nCONTENT",
        tagline: "High-impact short-form video and photo content built to stop the scroll, grow your audience, and drive real results.",
        description: [
          "We create platform-native content specifically engineered for Instagram, TikTok, and YouTube — content that feels organic while delivering your brand message with precision. Our social media work is trusted by two of the most respected dealer groups in the region: the Findlay Automotive Group and the Ascent Group of Dealers.",
          "From concept to final edit, we handle the entire production process, delivering ready-to-post content optimized for each platform's algorithm and audience behavior. Whether it's a monthly retainer or a single campaign, we build content systems that keep your brand consistent and visible.",
        ],
        features: [
          { title: "SHORT-FORM VIDEO", desc: "Reels, TikToks, and YouTube Shorts that combine cinematic quality with native platform aesthetics to maximize engagement." },
          { title: "CONTENT CALENDARS", desc: "Strategic monthly content planning that ensures consistent posting and cohesive brand storytelling across all platforms." },
          { title: "DEALERSHIP GROUP CONTENT", desc: "Scalable content systems for multi-location dealer groups — consistent quality across every store, every month." },
          { title: "PRODUCT & SERVICE SHOWCASES", desc: "Visually compelling product demos and service highlight videos designed to convert viewers into customers." },
        ],
        heroVideo: HERO_VIDEOS.socialMediaAds,
        galleryImages: [
          ...LEXUS_HENDERSON.gallery.slice(0, 4),
          ...LEXUS_LAS_VEGAS.gallery.slice(0, 4),
          ...CENTENNIAL_SUBARU.gallery.slice(0, 4),
        ],
        relatedProjects: [
          { slug: "lexus-of-henderson", title: "LEXUS OF HENDERSON", category: "AUTOMOTIVE \u2022 MARKETING", image: LEXUS_HENDERSON.hero },
          { slug: "centennial-subaru", title: "CENTENNIAL SUBARU", category: "AUTOMOTIVE \u2022 DEALER SERVICES", image: CENTENNIAL_SUBARU.hero },
        ],
      }}
    />
  );
}

// ─── PHOTOGRAPHY ───────────────────────────────────────────
export function PhotographyPage() {
  useSEO({
    title: "Commercial Photography Las Vegas",
    description: "Professional commercial photography for Las Vegas businesses — product, event, corporate, and brand photography with fast turnaround.",
    canonical: "/services/photography",
  });
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
          { title: "HEADSHOTS & PORTRAITS", desc: "Executive headshots, team portraits, and personal branding photography that communicates confidence and professionalism." },
          { title: "COMMERCIAL & PRODUCT", desc: "Clean, professional product and commercial photography for advertising, e-commerce, and marketing materials." },
        ],
        heroImage: LEXUS_LAS_VEGAS.hero,
        galleryImages: [
          ...LEXUS_HENDERSON.gallery.slice(0, 6),
          ...LEXUS_LAS_VEGAS.gallery,
          ...CENTENNIAL_SUBARU.gallery.slice(0, 6),
        ],
        relatedProjects: [
          { slug: "lexus-of-las-vegas", title: "LEXUS OF LAS VEGAS", category: "AUTOMOTIVE \u2022 PHOTOGRAPHY", image: LEXUS_LAS_VEGAS.hero },
          { slug: "lexus-of-henderson", title: "LEXUS OF HENDERSON", category: "AUTOMOTIVE \u2022 MARKETING", image: LEXUS_HENDERSON.hero },
          { slug: "wondr-nation-g2e", title: "WONDR NATION G2E", category: "EVENTS \u2022 PHOTOGRAPHY", image: WONDR_NATION.hero },
        ],
      }}
    />
  );
}

// ─── BRAND STRATEGY ──────────────────────────────────────────
export function BrandStrategyPage() {
  useSEO({
    title: "Brand Strategy & Content Las Vegas",
    description: "Brand strategy and visual content development for Las Vegas businesses — positioning, identity, and content systems that scale.",
    canonical: "/services/brand-strategy",
  });
  return (
    <ServicePageTemplate
      data={{
        slug: "brand-strategy",
        name: "BRAND\nSTRATEGY",
        tagline: "Visual identity, content systems, and marketing structure that position your brand for sustained growth — built to perform, not just look good.",
        description: [
          "A great brand is more than a logo — it's a complete visual and strategic identity that communicates your values, attracts your ideal audience, and differentiates you from the competition. After 20 years in the corporate world, we understand that creative work only matters when it's organized, on-brand, and designed to scale.",
          "Our brand strategy services combine creative direction with real-world marketing execution. We don't just hand you a style guide — we build the systems, workflows, and content infrastructure that keep your brand consistent across every platform, every touchpoint, and every campaign.",
        ],
        features: [
          { title: "VISUAL IDENTITY SYSTEMS", desc: "Logo, color systems, typography, and brand guidelines that create a consistent, professional presence across all platforms and materials." },
          { title: "CONTENT STRATEGY & PLANNING", desc: "Monthly content calendars, platform strategy, and editorial planning that align your messaging with your audience and business goals." },
          { title: "BRAND AUDITS & CONSULTING", desc: "One-on-one sessions to audit your existing brand, identify gaps, and develop an actionable roadmap for growth and consistency." },
          { title: "MARKETING STRUCTURE", desc: "We build the reporting, workflows, and accountability systems that turn creative production into a scalable marketing operation." },
        ],
        heroVideo: HERO_VIDEOS.websiteVideo,
        galleryImages: [
          ...LEXUS_HENDERSON.gallery.slice(0, 4),
          ...WONDR_NATION.gallery,
          ...LEXUS_LAS_VEGAS.gallery.slice(0, 4),
        ],
        relatedProjects: [
          { slug: "wondr-nation-g2e", title: "WONDR NATION G2E", category: "EVENTS \u2022 PHOTOGRAPHY", image: WONDR_NATION.hero },
          { slug: "lexus-of-henderson", title: "LEXUS OF HENDERSON", category: "AUTOMOTIVE \u2022 MARKETING", image: LEXUS_HENDERSON.hero },
        ],
      }}
    />
  );
}

// ─── HEADSHOTS + TEAM PHOTOGRAPHY ──────────────────────────
export function HeadshotsPage() {
  useSEO({
    title: "Corporate Headshots Las Vegas | Loomelic",
    description: "Professional corporate headshots for Las Vegas teams — on-site setup, retouching, and organized gallery delivery for every department.",
    canonical: "/services/headshots",
  });
  return (
    <ServicePageTemplate
      data={{
        slug: "headshots",
        name: "HEADSHOTS +\nTEAM PHOTOGRAPHY",
        tagline: "Your people are your brand. Clean, consistent professional portraits for every department — built for websites, social media, and internal communications.",
        description: [
          "We deliver clean, consistent headshots and team photos that reflect professionalism and trust — whether on the showroom floor, in the office, or in the field. Every portrait is lit, retouched, and delivered with the same cinematic precision we bring to all of our work.",
          "These images are built for real use: website staff pages, LinkedIn profiles, Google Business listings, social media, internal communications, and marketing materials. Fast turnaround, consistent quality, and a relaxed on-set experience that brings out the best in every subject.",
        ],
        features: [
          { title: "INDIVIDUAL PORTRAITS", desc: "Clean, professionally lit headshots for executives, sales teams, service advisors, and staff at every level." },
          { title: "TEAM PHOTOGRAPHY", desc: "Group shots and department photos that showcase your team culture and build trust with customers before they walk in the door." },
          { title: "ON-LOCATION SESSIONS", desc: "We come to your office, dealership, or venue — no studio required. Minimal setup, maximum efficiency." },
          { title: "SAME-DAY DELIVERY", desc: "Edited, retouched, and web-ready files delivered fast so your team can update profiles and listings immediately." },
        ],
        heroImage: HEADSHOTS.hero,
        galleryImages: HEADSHOTS.gallery,
        useCases: [
          "Website staff pages",
          "LinkedIn & social media profiles",
          "Google Business profiles",
          "Internal communications",
          "Email signatures",
          "Press & media kits",
        ],
        relatedProjects: [
          { slug: "lexus-of-henderson", title: "LEXUS OF HENDERSON", category: "AUTOMOTIVE \u2022 MARKETING", image: LEXUS_HENDERSON.hero },
          { slug: "centennial-subaru", title: "CENTENNIAL SUBARU", category: "AUTOMOTIVE \u2022 DEALER SERVICES", image: CENTENNIAL_SUBARU.hero },
        ],
      }}
    />
  );
}

// ─── WEBSITE REDESIGN ──────────────────────────────────────────
// NOTE: Gallery/video intentionally omitted — content to be added later by client
export function WebsiteRedesignPage() {
  useSEO({
    title: "Website Redesign Las Vegas | Loomelic",
    description: "Modern website redesigns for Las Vegas businesses — mobile-first, fast-loading, and built to convert visitors into customers.",
    canonical: "/services/website-redesign",
  });
  return (
    <ServicePageTemplate
      data={{
        slug: "website-redesign",
        name: "WEBSITE\nREDESIGN",
        tagline: "Modern, mobile-first websites built to match the premium level of your brand — fast, clean, and designed to convert.",
        description: [
          "Your website is the first impression for every potential client. We design and build modern, high-performance websites that match the premium quality of your brand — mobile-friendly, fast-loading, and built to convert visitors into customers.",
          "From dealership microsites and portfolio sites to full business websites, we handle design, development, and launch. Every site we build is crafted with the same attention to detail we bring to our photo and video work — because your digital presence should look as good as your best content.",
        ],
        features: [
          { title: "MOBILE-FIRST DESIGN", desc: "Every site is designed for mobile first — fully responsive, touch-friendly, and optimized for every screen size." },
          { title: "BRAND-ALIGNED AESTHETICS", desc: "Custom design that reflects your brand identity — not a generic template. Every layout, color, and font choice is intentional." },
          { title: "PERFORMANCE OPTIMIZED", desc: "Fast load times, clean code, and SEO-ready structure that helps your site rank and perform across all devices." },
          { title: "CONTENT INTEGRATION", desc: "We integrate your existing photo and video content into the site design so your media assets work harder for your brand." },
        ],
        relatedProjects: [
          { slug: "lexus-of-henderson", title: "LEXUS OF HENDERSON", category: "AUTOMOTIVE \u2022 MARKETING", image: LEXUS_HENDERSON.hero },
          { slug: "wondr-nation-g2e", title: "WONDR NATION G2E", category: "EVENTS \u2022 PHOTOGRAPHY", image: WONDR_NATION.hero },
        ],
      }}
    />
  );
}
