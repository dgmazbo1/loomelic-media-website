/* ============================================================
   FeaturedWork — /featured-work
   Standalone page showing all featured work pulled from the DB.
   Separate from Use Cases — no tabs, no case study detail panels.
   ============================================================ */
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";
import {
  LEXUS_HENDERSON,
  LEXUS_LAS_VEGAS,
  RAIDERS_BLAST,
  CENTENNIAL_SUBARU,
  WONDR_NATION,
  BOB_MARLEY,
  SPORTS_ILLUSTRATED,
} from "@/lib/media";

/* ─── FALLBACK DATA (shown while DB loads) ───────────────── */
const FALLBACK_WORK = [
  {
    slug: "lexus-of-henderson",
    title: "LEXUS OF HENDERSON",
    location: "HENDERSON, NV",
    category: "AUTOMOTIVE • MARKETING",
    image: LEXUS_HENDERSON.hero,
    sortOrder: 0,
  },
  {
    slug: "lexus-of-las-vegas",
    title: "LEXUS OF LAS VEGAS",
    location: "LAS VEGAS, NV",
    category: "AUTOMOTIVE • PHOTOGRAPHY",
    image: LEXUS_LAS_VEGAS.hero,
    sortOrder: 1,
  },
  {
    slug: "las-vegas-raiders-tour",
    title: "LAS VEGAS RAIDERS TOUR",
    location: "LAS VEGAS, NV",
    category: "EVENTS • VIDEO",
    image: RAIDERS_BLAST.hero,
    sortOrder: 2,
  },
  {
    slug: "centennial-subaru",
    title: "CENTENNIAL SUBARU",
    location: "LAS VEGAS, NV",
    category: "AUTOMOTIVE • SOCIAL",
    image: CENTENNIAL_SUBARU.hero,
    sortOrder: 3,
  },
  {
    slug: "wondr-nation-g2e",
    title: "WONDR NATION G2E",
    location: "LAS VEGAS, NV",
    category: "EVENTS • PHOTOGRAPHY",
    image: WONDR_NATION.hero,
    sortOrder: 4,
  },
  {
    slug: "bob-marley-hope-road",
    title: "BOB MARLEY: HOPE ROAD",
    location: "LAS VEGAS, NV",
    category: "BRAND • VIDEO",
    image: BOB_MARLEY.hero,
    sortOrder: 5,
  },
  {
    slug: "sports-illustrated-sportsperson-2026",
    title: "SPORTS ILLUSTRATED",
    location: "LAS VEGAS, NV",
    category: "EVENTS • EDITORIAL",
    image: SPORTS_ILLUSTRATED.hero,
    sortOrder: 6,
  },
];

/* ─── PROJECT CARD ───────────────────────────────────────── */
function ProjectCard({
  title,
  category,
  image,
  index,
  onClick,
}: {
  title: string;
  category: string;
  image: string;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="group relative aspect-[4/3] overflow-hidden cursor-pointer bg-[oklch(0.12_0_0)]"
    >
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading={index < 4 ? "eager" : "lazy"}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        <p className="font-body text-[0.6rem] tracking-[0.18em] text-white/70 mb-1">
          {category}
        </p>
        <h3 className="font-display text-[clamp(1rem,2.5vw,1.4rem)] leading-tight text-white">
          {title}
        </h3>
      </div>
      {/* View CTA — slides up on hover */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-3 bg-white/50 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <span className="font-display text-[0.9rem] tracking-[0.14em] uppercase text-black font-bold">
          VIEW PROJECT
        </span>
        <span className="text-black text-sm font-bold">→</span>
      </div>
    </motion.div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function FeaturedWork() {
  const [, navigate] = useLocation();

  useSEO({
    title: "Featured Work | Loomelic Media Las Vegas",
    description: "Browse Loomelic Media's featured video and photography projects — automotive dealerships, events, and brands across Las Vegas and Southern Nevada.",
    canonical: "/featured-work",
  });

  const { data: dbItems, isLoading } = trpc.featuredWork.listPublic.useQuery(undefined, {
    staleTime: 60_000,
  });

  const items =
    dbItems && dbItems.length > 0
      ? dbItems.map((item, i) => ({
          slug: item.slug ?? "",
          title: item.title,
          category: item.category ?? "",
          image: item.imageUrl,
          sortOrder: item.sortOrder ?? i,
        }))
      : FALLBACK_WORK;

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="section-black pt-24 pb-0">
        <div className="container pt-10 sm:pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="section-label text-white/40 mb-4">
              <span>✦</span>
              <span>SELECTED WORK —</span>
            </p>
            <h1 className="font-display text-[clamp(2.6rem,8vw,7rem)] leading-[0.88] text-white mb-6">
              FEATURED
              <br />
              <span className="text-[oklch(0.4_0_0)]">WORK</span>
            </h1>
            <p className="text-white/50 text-sm sm:text-base max-w-xl leading-relaxed mb-10">
              A curated selection of our best video production and photography work — automotive
              dealerships, conventions, events, and brand campaigns across Las Vegas and beyond.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate("/contact")} className="btn-pill text-xs">
                START A PROJECT +
              </button>
              <button onClick={() => navigate("/use-cases")} className="btn-pill-light text-xs">
                VIEW USE CASES →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WORK GRID ────────────────────────────────────────── */}
      <section className="section-black pb-24">
        <div className="container">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] bg-[oklch(0.12_0_0)] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {items.map((item, i) => (
                <ProjectCard
                  key={item.slug}
                  title={item.title}
                  category={item.category}
                  image={item.image}
                  index={i}
                  onClick={() => navigate(`/projects/${item.slug}`)}
                />
              ))}
            </div>
          )}

          <div className="flex justify-start mt-10">
            <button onClick={() => navigate("/projects")} className="btn-pill-light text-xs">
              ALL PROJECTS +
            </button>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
