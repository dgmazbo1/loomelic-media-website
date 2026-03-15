/* ============================================================
   PortfolioPage — /portfolio
   Real portfolio page with category filters and lightbox
   No duplicate items; each item has title + category + caption
   ============================================================ */
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  RAIDERS_BLAST,
  SPORTS_ILLUSTRATED,
  BOB_MARLEY,
  WONDR_NATION,
  CENTENNIAL_SUBARU,
  LEXUS_HENDERSON,
  LEXUS_LAS_VEGAS,
  PORTFOLIO_GALLERY,
} from "@/lib/media";

type Category = "ALL" | "AUTOMOTIVE" | "EVENTS" | "HEADSHOTS" | "BRAND";

type PortfolioItem = {
  src: string;
  title: string;
  category: Category;
  caption?: string;
};

// Build deduplicated portfolio — each project contributes a fixed slice
const ITEMS: PortfolioItem[] = [
  // Automotive / Dealer
  { src: CENTENNIAL_SUBARU.hero, title: "Centennial Subaru", category: "AUTOMOTIVE", caption: "Vehicle lifestyle shoot — Las Vegas, NV" },
  { src: LEXUS_HENDERSON.hero, title: "Lexus of Henderson", category: "AUTOMOTIVE", caption: "Dealership content — Henderson, NV" },
  { src: LEXUS_LAS_VEGAS.hero, title: "Lexus of Las Vegas", category: "AUTOMOTIVE", caption: "Dealership content — Las Vegas, NV" },
  // Raiders (Events)
  ...RAIDERS_BLAST.gallery.slice(0, 6).map((src: string, i: number) => ({
    src,
    title: "Las Vegas Raiders Tour",
    category: "EVENTS" as Category,
    caption: `Raiders Blast event — Las Vegas, NV (${i + 1})`,
  })),
  // Sports Illustrated (Events)
  ...SPORTS_ILLUSTRATED.gallery.slice(0, 5).map((src: string, i: number) => ({
    src,
    title: "Sports Illustrated 2026",
    category: "EVENTS" as Category,
    caption: `Sportsperson of the Year — Red Carpet (${i + 1})`,
  })),
  // Bob Marley (Events)
  ...BOB_MARLEY.gallery.slice(0, 5).map((src: string, i: number) => ({
    src,
    title: "Bob Marley Hope Road",
    category: "EVENTS" as Category,
    caption: `Hope Road event — Las Vegas, NV (${i + 1})`,
  })),
  // Wondr Nation (Events)
  ...WONDR_NATION.gallery.slice(0, 4).map((src: string, i: number) => ({
    src,
    title: "Wondr Nation G2E",
    category: "EVENTS" as Category,
    caption: `G2E Activation — Las Vegas, NV (${i + 1})`,
  })),
  // Headshots (from portfolio gallery)
  ...PORTFOLIO_GALLERY.slice(0, 6).map((src: string, i: number) => ({
    src,
    title: "Professional Headshots",
    category: "HEADSHOTS" as Category,
    caption: `Executive portrait session (${i + 1})`,
  })),
  // Brand / Lifestyle
  ...PORTFOLIO_GALLERY.slice(6, 10).map((src: string, i: number) => ({
    src,
    title: "Brand & Lifestyle",
    category: "BRAND" as Category,
    caption: `Brand content production (${i + 1})`,
  })),
];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "AUTOMOTIVE", label: "Automotive / Dealer" },
  { value: "EVENTS", label: "Events" },
  { value: "HEADSHOTS", label: "Headshots" },
  { value: "BRAND", label: "Brand" },
];

function PhotoCard({
  item,
  index,
  onClick,
}: {
  item: PortfolioItem;
  index: number;
  onClick: () => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 4) * 0.07 }}
      className="group relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer bg-[oklch(0.12_0_0)]"
      onClick={onClick}
    >
      <img
        src={item.src}
        alt={item.caption || item.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="font-display-normal text-xs text-white tracking-widest">{item.title.toUpperCase()}</p>
        <p className="font-body text-[0.65rem] text-white/60 mt-0.5">{item.caption}</p>
        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[0.6rem] text-white/70 tracking-widest uppercase">{item.category}</span>
      </div>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === "ALL" ? ITEMS : ITEMS.filter((i) => i.category === activeCategory);

  const openLightbox = (globalIndex: number) => setLightboxIndex(globalIndex);
  const closeLightbox = () => setLightboxIndex(null);
  const prevPhoto = () => setLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : null));
  const nextPhoto = () => setLightboxIndex((i) => (i !== null ? Math.min(filtered.length - 1, i + 1) : null));

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 sm:pt-40 sm:pb-16 px-5 sm:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="section-label text-white/40 mb-6"
        >
          <span>✦</span><span>OUR WORK</span>
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(2rem,6vw,5.5rem)] leading-[0.88] text-white max-w-4xl"
        >
          PORTFOLIO
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-body text-white/50 text-sm sm:text-base max-w-xl leading-relaxed mt-4"
        >
          Photography and video across automotive, events, headshots, and brand content — Las Vegas and South Florida.
        </motion.p>
      </section>

      {/* Filters */}
      <section className="px-5 sm:px-10 lg:px-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-2"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-[0.7rem] font-semibold tracking-[0.1em] transition-all duration-200 ${
                activeCategory === cat.value
                  ? "bg-white text-[oklch(0.07_0_0)]"
                  : "bg-white/8 text-white/60 border border-white/10 hover:bg-white/15 hover:text-white"
              }`}
            >
              {cat.label.toUpperCase()}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Grid */}
      <section className="px-5 sm:px-10 lg:px-16 pb-20 sm:pb-32">
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          <AnimatePresence>
            {filtered.map((item, i) => (
              <PhotoCard key={`${item.src}-${i}`} item={item} index={i} onClick={() => openLightbox(i)} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-body text-white/30 text-sm">No items in this category yet.</p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Prev */}
            {lightboxIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className="absolute left-4 sm:left-8 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Next */}
            {lightboxIndex < filtered.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="absolute right-4 sm:right-8 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="max-w-5xl max-h-[85vh] mx-8 flex flex-col items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightboxIndex].src}
                alt={filtered[lightboxIndex].caption || filtered[lightboxIndex].title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
              <div className="text-center">
                <p className="font-display-normal text-xs text-white/80 tracking-widest">
                  {filtered[lightboxIndex].title.toUpperCase()}
                </p>
                {filtered[lightboxIndex].caption && (
                  <p className="font-body text-xs text-white/40 mt-0.5">{filtered[lightboxIndex].caption}</p>
                )}
                <p className="font-body text-xs text-white/25 mt-1">
                  {lightboxIndex + 1} / {filtered.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
