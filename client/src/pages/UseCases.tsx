/* ============================================================
   UseCases — /use-cases
   Tabbed layout: "FEATURED WORK" | "USE CASES"
   Both tabs use the same project-card grid style as ProjectsSection.
   Use Cases tab: clicking a card expands the full case study detail.
   ============================================================ */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { trpc } from "@/lib/trpc";
import {
  LEXUS_HENDERSON,
  LEXUS_LAS_VEGAS,
  RAIDERS_BLAST,
  CENTENNIAL_SUBARU,
  WONDR_NATION,
  BOB_MARLEY,
  SPORTS_ILLUSTRATED,
} from "@/lib/media";

/* ─── TYPES ─────────────────────────────────────────────── */
type VideoItem = {
  url: string;
  label: string;
  lang: string;
  portrait?: boolean;
};

/* ─── FEATURED WORK DATA ─────────────────────────────────── */
const FEATURED_WORK = [
  {
    slug: "lexus-of-henderson",
    title: "LEXUS OF HENDERSON",
    category: "AUTOMOTIVE • MARKETING",
    image: LEXUS_HENDERSON.hero,
  },
  {
    slug: "lexus-of-las-vegas",
    title: "LEXUS OF LAS VEGAS",
    category: "AUTOMOTIVE • PHOTOGRAPHY",
    image: LEXUS_LAS_VEGAS.hero,
  },
  {
    slug: "las-vegas-raiders-tour",
    title: "LAS VEGAS RAIDERS TOUR",
    category: "EVENTS • VIDEOGRAPHY",
    image: RAIDERS_BLAST.hero,
  },
  {
    slug: "centennial-subaru",
    title: "CENTENNIAL SUBARU",
    category: "AUTOMOTIVE • DEALER SERVICES",
    image: CENTENNIAL_SUBARU.hero,
  },
  {
    slug: "wondr-nation-g2e",
    title: "WONDR NATION G2E",
    category: "EVENTS • PHOTOGRAPHY",
    image: WONDR_NATION.hero,
  },
  {
    slug: "bob-marley-hope-road",
    title: "BOB MARLEY HOPE ROAD",
    category: "EVENTS • EDITORIAL PHOTOGRAPHY",
    image: BOB_MARLEY.hero,
  },
  {
    slug: "sports-illustrated-sportsperson-2026",
    title: "SPORTS ILLUSTRATED: SPORTSPERSON OF THE YEAR 2026",
    category: "EVENTS • PHOTOGRAPHY",
    image: SPORTS_ILLUSTRATED.hero,
  },
];

/* ─── USE CASES DATA ─────────────────────────────────────── */
const USE_CASES = [
  {
    id: "centennial-subaru",
    title: "CENTENNIAL SUBARU",
    category: "USED CAR CAMPAIGN · SOCIAL MEDIA ADS",
    result: "Multiple used cars sold within 5 days of posting",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/hZhvBDwnUYPXmoN2sbiKGJ/centennial_subaru_cover_ca0df0aa.jpg",
    overview:
      "Centennial Subaru needed a faster, more targeted way to move used inventory off the lot. Loomelic Media developed a recurring Weekend Special video campaign — three separate units, each spotlighting a different used vehicle — designed to create urgency, drive weekend showroom traffic, and convert online attention into same-week sales.",
    challenge:
      "Used inventory was sitting longer than desired, and generic social posts weren't generating the urgency or foot traffic needed to move vehicles quickly. The dealership needed content that felt timely, local, and compelling enough to prompt action within days — not weeks.",
    solution:
      "Loomelic Media produced a series of Weekend Special video ads — each one built around a specific used vehicle with pricing, urgency messaging, and a clear call to action. Each video was simultaneously boosted on social media, precisely targeted to the dealership's core demographic and Primary Market Area (PMA) in the Las Vegas metro. By reaching in-market shoppers who were already within driving distance and actively considering a purchase, the campaign converted views into showroom visits within the same weekend.",
    result2:
      "Multiple used cars sold within a 5-day window of each video being posted and boosted. The campaign demonstrated that well-produced, strategically targeted video content — when matched with the right audience at the right time — can directly accelerate used car sales without relying on discounting or traditional advertising.",
    videos: [
      {
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/hZhvBDwnUYPXmoN2sbiKGJ/WeekendSpecial1_0874fc0d.mp4",
        label: "WEEKEND SPECIAL #1",
        lang: "en",
        portrait: true,
      } as VideoItem,
      {
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/hZhvBDwnUYPXmoN2sbiKGJ/WeekendSpecial2_ac81deaf.mp4",
        label: "WEEKEND SPECIAL #2",
        lang: "en",
        portrait: true,
      } as VideoItem,
      {
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/hZhvBDwnUYPXmoN2sbiKGJ/WeekendSpecial3_20ddce1e.mp4",
        label: "WEEKEND SPECIAL #3",
        lang: "en",
        portrait: true,
      } as VideoItem,
    ] as VideoItem[],
    tags: ["Used Car Advertising", "Social Media Ads", "Weekend Campaign", "PMA Targeting", "Demographic Boosting", "Las Vegas Dealership", "5-Day Sales Cycle"],
  },
  {
    id: "findlay-nissan-henderson",
    title: "FINDLAY NISSAN HENDERSON",
    category: "INTERNET SALES · CRM VIDEO STRATEGY",
    result: "Warmer lead engagement from day one",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/hZhvBDwnUYPXmoN2sbiKGJ/DSC02345_f9558775.jpg",
    overview:
      "Findlay Nissan Henderson wanted to make every online lead feel like a VIP from the very first touchpoint. Loomelic Media produced custom intro videos for the internet sales team — filmed in both English and Spanish — so every customer, regardless of their preferred language, receives a warm, personal, and professional first response. The result: leads that feel seen, heard, and ready to engage.",
    challenge:
      "Online leads were receiving generic, text-only first responses. In a market as diverse as Las Vegas, a one-language approach meant a significant portion of Spanish-speaking customers never felt personally connected to the dealership.",
    solution:
      "Custom bilingual intro videos — one in English, one in Spanish — produced for the internet sales team and deployed as the first response in the CRM workflow. Each video puts a real face and voice to the dealership, building trust before the customer ever steps on the lot.",
    result2: "Higher open rates on first-response messages, stronger lead engagement, and a more inclusive customer experience that speaks to the full Las Vegas market.",
    videos: [
      {
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/hZhvBDwnUYPXmoN2sbiKGJ/CourtneyIntro_fcba6429.mov",
        label: "ENGLISH INTRO — Courtney",
        lang: "en",
      },
      {
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/hZhvBDwnUYPXmoN2sbiKGJ/SoniaSpanish_db72db60.mp4",
        label: "SPANISH INTRO — Sonia",
        lang: "es",
      },
    ],
    tags: ["CRM Video", "Bilingual Marketing", "Internet Sales", "Lead Response", "Spanish-Language Content", "Dealership Video Marketing"],
  },
];

/* ─── SHARED CARD COMPONENT ──────────────────────────────── */
function ProjectCard({
  title,
  category,
  image,
  index,
  onClick,
  showOverlay = false,
}: {
  title: string;
  category: string;
  image: string;
  index: number;
  onClick?: () => void;
  showOverlay?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
      onClick={onClick}
      className="project-card group cursor-pointer"
    >
      {showOverlay ? (
        /* ── Overlay style: full image with gradient fade + name ── */
        <div className="relative overflow-hidden rounded-xl mx-3 mt-3 mb-3 aspect-[16/10] bg-[oklch(0.15_0_0)]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            loading="lazy"
          />
          {/* Gradient fade from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          {/* Arrow button top-right */}
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/60 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
            <span className="text-xs">→</span>
          </div>
          {/* Title overlay bottom-left */}
          <div className="absolute bottom-0 left-0 px-5 pb-5">
            <h3
              className="font-display text-[clamp(1.6rem,4vw,2.4rem)] text-white leading-none tracking-wide"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
            >
              {title}
            </h3>
          </div>
        </div>
      ) : (
        /* ── Default style: header above image ── */
        <>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="min-w-0 flex-1 mr-3">
              <p className="font-body text-[0.6rem] text-white/35 tracking-[0.15em] mb-0.5 truncate">
                {category}
              </p>
              <h3 className="font-display-normal text-sm sm:text-base text-white leading-tight truncate">
                {title}
              </h3>
            </div>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300 shrink-0">
              <span className="text-xs">→</span>
            </div>
          </div>
          <div className="overflow-hidden mx-3 mb-3 rounded-xl aspect-[16/10] bg-[oklch(0.15_0_0)]">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              loading="lazy"
            />
          </div>
        </>
      )}
    </motion.div>
  );
}

/* ─── FEATURED WORK GRID (DB-driven) ────────────────────── */
function FeaturedWorkGrid({ navigate }: { navigate: (path: string) => void }) {
  const { data: dbItems, isLoading } = trpc.featuredWork.listPublic.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  // Fallback to static data while DB is empty or loading
  const items = dbItems && dbItems.length > 0
    ? dbItems.map((item, i) => ({
        slug: item.slug ?? "",
        title: item.title,
        category: item.category ?? "",
        image: item.imageUrl,
        index: i,
      }))
    : FEATURED_WORK.map((p, i) => ({ ...p, index: i }));

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-10">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="project-card aspect-[16/10] bg-white/5 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-10">
      {items.map((project, i) => (
        <ProjectCard
          key={project.slug || String(i)}
          title={project.title}
          category={project.category}
          image={project.image}
          index={i}
          showOverlay
          onClick={project.slug ? () => navigate(`/projects/${project.slug}`) : undefined}
        />
      ))}
    </div>
  );
}

/* ─── USE CASE EXPANDED DETAIL ───────────────────────────── */
function UseCaseDetail({ uc, onClose }: { uc: (typeof USE_CASES)[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden col-span-1 sm:col-span-2"
    >
      <div className="bg-[oklch(0.1_0_0)] border border-white/10 rounded-2xl p-6 sm:p-10 mb-4">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-body text-[0.6rem] text-white/35 tracking-[0.15em] mb-1">
              {uc.category}
            </p>
            <h3 className="font-display text-2xl sm:text-3xl text-white">{uc.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:bg-white hover:text-black transition-all duration-200 shrink-0 ml-4"
          >
            <span className="text-xs">✕</span>
          </button>
        </div>

        <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-8 max-w-3xl">
          {uc.overview}
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          {[
            { label: "CHALLENGE", text: uc.challenge },
            { label: "SOLUTION", text: uc.solution },
            { label: "RESULT", text: uc.result2 ?? uc.result },
          ].map((item) => (
            <div key={item.label} className="border-l-2 border-[oklch(0.92_0.28_142)] pl-4">
              <p className="font-body text-[0.55rem] text-[oklch(0.92_0.28_142)] tracking-[0.18em] mb-1">
                {item.label}
              </p>
              <p className="text-white/80 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Bilingual intro videos — shown when videos array is present */}
        {uc.videos && uc.videos.length > 0 && (
          <div className="mb-8">
            <p className="font-body text-[0.6rem] text-white/35 tracking-[0.18em] mb-4">
              ✶ CAMPAIGN VIDEOS
            </p>
            <div className={`grid gap-6 ${
              uc.videos[0]?.portrait
                ? "grid-cols-1 sm:grid-cols-3"
                : "sm:grid-cols-2"
            }`}>
              {uc.videos.map((v) => (
                <div key={v.url} className="rounded-xl overflow-hidden bg-[oklch(0.07_0_0)]">
                  <video
                    src={v.url}
                    controls
                    playsInline
                    className={`w-full object-cover ${
                      v.portrait ? "aspect-[9/16]" : "aspect-video object-contain"
                    }`}
                    preload="auto"
                  />
                  <div className="px-4 py-3 flex items-center gap-2">
                    <span className="font-body text-[0.55rem] tracking-[0.15em] text-[oklch(0.92_0.28_142)] uppercase">
                      {v.lang === "es" ? "🇪🇸" : "🇺🇸"}
                    </span>
                    <span className="font-body text-[0.6rem] tracking-[0.12em] text-white/60 uppercase">
                      {v.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {uc.id === "findlay-nissan-henderson" && (
              <p className="text-white/40 text-xs leading-relaxed mt-4 max-w-2xl">
                Each member of the internet sales team records a personal intro video in both English and Spanish. When a lead submits an inquiry, the CRM automatically sends the matching-language video as the first response — turning a cold form submission into a warm, face-to-face connection before the customer ever visits the lot.
              </p>
            )}
            {uc.id === "centennial-subaru" && (
              <p className="text-white/40 text-xs leading-relaxed mt-4 max-w-2xl">
                Each Weekend Special video was produced, posted, and boosted simultaneously — targeting the dealership’s core demographic and Primary Market Area (PMA) in the Las Vegas metro. The combination of high-quality production and precise audience targeting drove showroom visits within days of each post going live.
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {uc.tags.map((tag) => (
            <span
              key={tag}
              className="font-body text-[0.6rem] tracking-[0.12em] text-white/50 border border-white/15 rounded-full px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function UseCases() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"featured" | "usecases">("featured");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const detailRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleCardClick = (id: string) => {
    const next = expandedId === id ? null : id;
    setExpandedId(next);
    if (next) {
      // Scroll to the detail panel after animation starts
      setTimeout(() => {
        detailRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  };

  const tabs = [
    { id: "featured" as const, label: "FEATURED WORK" },
    { id: "usecases" as const, label: "USE CASES" },
  ];

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="section-black pt-24 pb-0">
        <div className="container pt-10 sm:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="section-label text-white/40 mb-4">
              <span>✦</span>
              <span>OUR WORK —</span>
            </p>
            <h1 className="font-display text-[clamp(2.6rem,8vw,7rem)] leading-[0.88] text-white mb-6">
              REAL
              <br />
              <span className="text-[oklch(0.4_0_0)]">RESULTS</span>
            </h1>
            <p className="text-white/50 text-sm sm:text-base max-w-xl leading-relaxed mb-10">
              Real-world examples of how Loomelic Media helps dealerships improve response rates,
              move inventory, and create campaigns that generate showroom traffic.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-14">
              <button onClick={() => navigate("/contact")} className="btn-pill text-xs">
                BOOK A CALL +
              </button>
              <button onClick={() => navigate("/projects")} className="btn-pill-light text-xs">
                VIEW PROJECTS →
              </button>
            </div>
          </motion.div>

          {/* ── TABS ─────────────────────────────────────────── */}
          <div className="flex gap-1 border-b border-white/10 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setExpandedId(null);
                }}
                className={`relative font-body text-[0.65rem] tracking-[0.18em] px-5 py-3 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-white/35 hover:text-white/60"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[oklch(0.92_0.28_142)]"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── TAB CONTENT ──────────────────────────────────────── */}
      <section className="section-black pb-24">
        <div className="container">
          <AnimatePresence mode="wait">
            {activeTab === "featured" ? (
              <motion.div
                key="featured"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <h2 className="font-display text-[clamp(1.6rem,4vw,3.5rem)] leading-[0.9] text-white">
                    SELECTED
                    <br />
                    <span className="text-[oklch(0.4_0_0)]">WORK</span>
                  </h2>
                  <span className="font-display text-[clamp(1.2rem,3vw,3rem)] text-[oklch(0.28_0_0)] leading-none hidden sm:block self-end pb-1">
                    ©2026
                  </span>
                </div>

                {/* Card grid — DB-driven */}
                <FeaturedWorkGrid navigate={navigate} />

                <div className="flex justify-start">
                  <button onClick={() => navigate("/projects")} className="btn-pill-light text-xs">
                    ALL PROJECTS +
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="usecases"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <h2 className="font-display text-[clamp(1.6rem,4vw,3.5rem)] leading-[0.9] text-white">
                    CLIENT
                    <br />
                    <span className="text-[oklch(0.4_0_0)]">RESULTS</span>
                  </h2>
                  <p className="text-white/35 text-xs max-w-xs leading-relaxed hidden sm:block self-end pb-1">
                    Click any card to read the full case study
                  </p>
                </div>

                {/* Card grid — with expandable detail */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-10">
                  {USE_CASES.map((uc, i) => (
                    <div key={uc.id}>
                      <ProjectCard
                        title={uc.title}
                        category={uc.category}
                        image={uc.image}
                        index={i}
                        onClick={() => handleCardClick(uc.id)}
                        showOverlay
                      />
                      <AnimatePresence>
                        {expandedId === uc.id && (
                          <div ref={(el) => { detailRefs.current[uc.id] = el; }} className="col-span-1 sm:col-span-2">
                            <UseCaseDetail
                              key={`detail-${uc.id}`}
                              uc={uc}
                              onClose={() => setExpandedId(null)}
                            />
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
