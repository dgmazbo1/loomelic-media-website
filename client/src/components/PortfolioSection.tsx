/* ============================================================
   PortfolioSection — Unusually-inspired
   Style: Light background, category filter pills, masonry-style image grid
          with rounded corners, hover overlay, lightbox
   Categories: ALL, AUTOMOTIVE, EVENTS, LIFESTYLE
   ============================================================ */

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { X, Play } from "lucide-react";
import {
  LEXUS_HENDERSON,
  LEXUS_LAS_VEGAS,
  RAIDERS_BLAST,
  CENTENNIAL_SUBARU,
  JW_OFFROAD,
  TWO_MOONS_LODGE,
  WONDR_NATION,
  HERO_VIDEOS,
  VIDEO_POSTERS,
  PORTFOLIO_GALLERY,
} from "@/lib/media";

type Category = "ALL" | "AUTOMOTIVE" | "EVENTS" | "LIFESTYLE";

const ALL_PHOTOS: { src: string; category: Category; title: string }[] = [
  ...LEXUS_HENDERSON.gallery.slice(0, 6).map((src: string) => ({ src, category: "AUTOMOTIVE" as Category, title: "Lexus of Henderson" })),
  ...LEXUS_LAS_VEGAS.gallery.slice(0, 5).map((src: string) => ({ src, category: "AUTOMOTIVE" as Category, title: "Lexus of Las Vegas" })),
  ...RAIDERS_BLAST.gallery.slice(0, 4).map((src: string) => ({ src, category: "EVENTS" as Category, title: "Raiders Tour" })),
  ...CENTENNIAL_SUBARU.gallery.slice(0, 5).map((src: string) => ({ src, category: "AUTOMOTIVE" as Category, title: "Centennial Subaru" })),
  ...JW_OFFROAD.gallery.slice(0, 1).map((src: string) => ({ src, category: "LIFESTYLE" as Category, title: "JW Offroad" })),
  ...TWO_MOONS_LODGE.gallery.slice(0, 4).map((src: string) => ({ src, category: "LIFESTYLE" as Category, title: "Two Moons Lodge" })),
  ...WONDR_NATION.gallery.slice(0, 5).map((src: string) => ({ src, category: "EVENTS" as Category, title: "Wondr Nation G2E" })),
  ...PORTFOLIO_GALLERY.slice(40, 50).map((src: string) => ({ src, category: "EVENTS" as Category, title: "Loomelic Media" })),
];

const VIDEO_REELS = [
  { title: "Headlight", src: HERO_VIDEOS.headlight, poster: VIDEO_POSTERS.headlight, category: "Automotive" },
  { title: "Lexus Roll", src: HERO_VIDEOS.lexusRoll, poster: VIDEO_POSTERS.lexusRoll, category: "Automotive" },
  { title: "Centennial Drone", src: HERO_VIDEOS.centennialDrone, poster: VIDEO_POSTERS.centennialDrone, category: "Aerial" },
  { title: "Website Video", src: HERO_VIDEOS.websiteVideo, poster: VIDEO_POSTERS.websiteVideo, category: "Brand" },
  { title: "Social Media Ads", src: HERO_VIDEOS.socialMediaAds, poster: VIDEO_POSTERS.socialMediaAds, category: "Social" },
  { title: "GX Showroom", src: HERO_VIDEOS.gxShowroom, poster: VIDEO_POSTERS.lexusRoll, category: "Automotive" },
  { title: "Kona Ice", src: HERO_VIDEOS.konaIce, poster: VIDEO_POSTERS.socialMediaAds, category: "Brand" },
  { title: "Rollers", src: HERO_VIDEOS.rollers, poster: VIDEO_POSTERS.websiteVideo, category: "Events" },
];

const CATEGORIES: Category[] = ["ALL", "AUTOMOTIVE", "EVENTS", "LIFESTYLE"];
const INITIAL_SHOW = 12;

function VideoCard({ video, index }: { video: typeof VIDEO_REELS[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play(); setPlaying(true); }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-[oklch(0.88_0_0)]"
      onClick={togglePlay}
    >
      <video ref={videoRef} src={video.src} poster={video.poster} muted loop playsInline className="w-full h-full object-cover" />
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${playing ? "opacity-0" : "opacity-100 group-hover:opacity-20"}`} />
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${playing ? "opacity-0" : "opacity-100"}`}>
        <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play size={14} className="text-black ml-0.5" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
        <p className="font-display-normal text-xs text-white">{video.title.toUpperCase()}</p>
        <p className="font-body text-[0.6rem] text-white/50 tracking-widest uppercase">{video.category}</p>
      </div>
    </motion.div>
  );
}

function AnimFade({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const [showCount, setShowCount] = useState(INITIAL_SHOW);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = activeCategory === "ALL" ? ALL_PHOTOS : ALL_PHOTOS.filter((p) => p.category === activeCategory);
  const visible = filtered.slice(0, showCount);
  const remaining = filtered.length - showCount;

  return (
    <section id="portfolio" className="section-light text-[oklch(0.07_0_0)]">
      <div className="container py-16 sm:py-24 lg:py-32">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <AnimFade>
              <p className="section-label text-[oklch(0.07_0_0)/40] mb-4"><span>✦</span><span>OUR WORK —</span></p>
            </AnimFade>
            <AnimFade delay={0.1}>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.88] text-[oklch(0.07_0_0)]">
                PHOTO<br /><span className="text-[oklch(0.78_0_0)]">GALLERY</span>
              </h2>
            </AnimFade>
          </div>
        </div>

        {/* Video Reels subsection */}
        <AnimFade delay={0.1} className="mb-14 sm:mb-20">
          <p className="section-label text-[oklch(0.07_0_0)/40] mb-6"><span>✦</span><span>VIDEO REELS —</span></p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {VIDEO_REELS.map((video, i) => (
              <VideoCard key={video.title} video={video} index={i} />
            ))}
          </div>
        </AnimFade>

        {/* Divider */}
        <div className="divider-dark mb-14" />

        {/* Category filters */}
        <AnimFade delay={0.15} className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setShowCount(INITIAL_SHOW); }}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-[0.1em] transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[oklch(0.07_0_0)] text-white"
                  : "bg-[oklch(0.07_0_0/0.06)] text-[oklch(0.07_0_0)] hover:bg-[oklch(0.07_0_0/0.12)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </AnimFade>

        {/* Photo masonry grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
          <AnimatePresence>
            {visible.map((photo, i) => (
              <motion.div
                key={photo.src + i}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group relative bg-[oklch(0.9_0_0)] mb-3 sm:mb-4"
                onClick={() => setLightbox(photo.src)}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-end p-3">
                  <span className="font-body text-[0.6rem] text-white tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {photo.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load more */}
        {remaining > 0 && (
          <AnimFade className="flex justify-center mt-10">
            <button onClick={() => setShowCount((c) => c + 12)} className="btn-pill-dark text-xs">
              LOAD MORE ({remaining} MORE) +
            </button>
          </AnimFade>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => setLightbox(null)}
            >
              <X size={18} />
            </button>
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={lightbox}
              alt=""
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
