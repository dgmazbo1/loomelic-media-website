/* ============================================================
   LOOMELIC MEDIA — Hero Section
   Design: Dark Cinematic Luxury
   - Full-screen video collage grid background
   - Animated LOOMELIC letter-by-letter reveal
   - Framer Motion scroll-triggered entrance
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HERO_VIDEOS, VIDEO_POSTERS, HERO_GRID_IMAGES } from "@/lib/media";

const LETTERS = ["L", "O", "O", "M", "E", "L", "I", "C"];

// 6 video cells for the background grid
const GRID_CELLS = [
  { type: "video" as const, src: HERO_VIDEOS.lexusRoll, poster: VIDEO_POSTERS.lexusRoll },
  { type: "video" as const, src: HERO_VIDEOS.janelWedding, poster: VIDEO_POSTERS.janelWedding },
  { type: "video" as const, src: HERO_VIDEOS.websiteVideo, poster: VIDEO_POSTERS.websiteVideo },
  { type: "video" as const, src: HERO_VIDEOS.weddingVideo, poster: VIDEO_POSTERS.weddingVideo },
  { type: "video" as const, src: HERO_VIDEOS.socialMediaAds, poster: VIDEO_POSTERS.socialMediaAds },
  { type: "video" as const, src: HERO_VIDEOS.centennialDrone, poster: VIDEO_POSTERS.centennialDrone },
  { type: "image" as const, src: HERO_GRID_IMAGES[0] },
  { type: "image" as const, src: HERO_GRID_IMAGES[1] },
  { type: "video" as const, src: HERO_VIDEOS.headlight, poster: VIDEO_POSTERS.headlight },
];

function VideoCell({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      className="w-full h-full object-cover"
    />
  );
}

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen bg-[oklch(0.05_0.005_285)] overflow-hidden flex flex-col">
      {/* ─── Full-screen video grid background ─── */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full grid gap-0.5"
          style={{ gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)" }}
        >
          {GRID_CELLS.map((cell, i) => (
            <div key={i} className="relative overflow-hidden">
              {cell.type === "video" ? (
                <VideoCell src={cell.src} poster={cell.poster!} />
              ) : (
                <img src={cell.src} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
        {/* Multi-layer overlay for cinematic depth */}
        <div className="absolute inset-0 bg-[oklch(0.05_0.005_285/0.65)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.05_0.005_285/0.7)] via-transparent to-[oklch(0.05_0.005_285/0.9)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.05_0.005_285/0.5)] via-transparent to-[oklch(0.05_0.005_285/0.5)]" />
      </div>

      {/* ─── Hero content ─── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 text-center min-h-screen pb-20">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3 mb-6 sm:mb-8"
        >
          <div className="w-6 h-px bg-[oklch(0.92_0.28_142)]" />
          <span className="font-body text-[10px] sm:text-xs tracking-[0.35em] text-[oklch(0.92_0.28_142)] uppercase">
            Las Vegas Video Production
          </span>
          <div className="w-6 h-px bg-[oklch(0.92_0.28_142)]" />
        </motion.div>

        {/* LOOMELIC letters */}
        <div className="flex items-end justify-center overflow-hidden mb-3 sm:mb-5">
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: 140, opacity: 0 }}
              animate={loaded ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.85,
                delay: 0.3 + i * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`font-display leading-none select-none ${
                i % 2 === 0
                  ? "text-white"
                  : "text-stroke"
              }`}
              style={{ fontSize: "clamp(3.5rem, 12vw, 13rem)" }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* MEDIA subtitle */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={loaded ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex items-center gap-4 mb-8 sm:mb-10"
        >
          <div className="h-px flex-1 max-w-[60px] sm:max-w-[100px] bg-white/20" />
          <span
            className="font-display tracking-[0.5em] text-white/40"
            style={{ fontSize: "clamp(0.75rem, 2vw, 1.1rem)" }}
          >
            MEDIA
          </span>
          <div className="h-px flex-1 max-w-[60px] sm:max-w-[100px] bg-white/20" />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.15 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full max-w-xs sm:max-w-none"
        >
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-neon text-xs sm:text-sm w-full sm:w-auto px-8 py-3"
          >
            EXPLORE PROJECTS
          </button>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-outline text-xs sm:text-sm w-full sm:w-auto px-8 py-3"
          >
            GET IN TOUCH
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.35 }}
          className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-12 sm:mt-16"
        >
          {[
            { num: "50+", label: "Projects Completed" },
            { num: "5+", label: "Years Experience" },
            { num: "20+", label: "Happy Clients" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl sm:text-4xl text-[oklch(0.92_0.28_142)]">{stat.num}</div>
              <div className="font-body text-[10px] sm:text-xs text-white/40 tracking-widest uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={18} className="text-white/25" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
