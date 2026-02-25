/* ============================================================
   LOOMELIC MEDIA — Showreel Section
   Design: Dark Cinematic Luxury
   - Full-width autoplay video reel from original site
   - Marquee text strip
   ============================================================ */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HERO_VIDEOS } from "@/lib/media";

const marqueeText = ["CINEMATIC", "AUTOMOTIVE", "EVENTS", "SOCIAL MEDIA", "PHOTOGRAPHY", "BRANDING", "BRAND STRATEGY", "WEBSITE DESIGN"];

export default function ShowreelSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative bg-[oklch(0.05_0.005_285)] overflow-hidden">
      {/* Marquee strip */}
      <div className="overflow-hidden border-y border-white/5 py-4 sm:py-5 bg-[oklch(0.07_0.005_285)]">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeText, ...marqueeText, ...marqueeText].map((word, i) => (
            <span key={i} className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-[0.15em] px-6 sm:px-10">
              {i % 2 === 0
                ? <span className="text-white">{word}</span>
                : <span className="text-stroke">{word}</span>
              }
            </span>
          ))}
        </div>
      </div>

      {/* Full-width video */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative w-full"
        style={{ aspectRatio: "16/7" }}
      >
        <video
          ref={videoRef}
          src={HERO_VIDEOS.websiteVideo}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          className="w-full h-full object-cover"
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.05_0.005_285/0.4)] via-transparent to-[oklch(0.05_0.005_285/0.4)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.05_0.005_285/0.5)] via-transparent to-[oklch(0.05_0.005_285/0.5)]" />

        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white tracking-[0.1em] drop-shadow-2xl"
            >
              WE TELL YOUR STORY
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="font-body text-sm sm:text-base text-white/60 mt-3 tracking-widest uppercase"
            >
              Through cinematic video & photography
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
