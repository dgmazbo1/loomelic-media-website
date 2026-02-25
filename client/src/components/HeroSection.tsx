/* ============================================================
   HeroSection — Unusually-inspired
   Style: Full-screen black bg, huge LOOMELIC wordmark (Barlow Condensed 800 italic),
          subtitle below, social icons bottom row, scrolling category marquee
   Background: Autoplay muted video (Lexus roll) with dark overlay
   ============================================================ */

import { motion } from "framer-motion";
import { Instagram, Youtube } from "lucide-react";

import { LOGO_TRANSPARENT, HERO_VIDEOS } from "@/lib/media";
const HERO_VIDEO = HERO_VIDEOS.lexusRoll;

const categories = [
  "CINEMATIC", "AUTOMOTIVE", "EVENTS", "SOCIAL MEDIA", "PHOTOGRAPHY", "BRANDING"
];

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden section-dark">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-25"
          src={HERO_VIDEO}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.07_0_0)]/60 via-[oklch(0.07_0_0)]/40 to-[oklch(0.07_0_0)]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-8">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="section-label mb-6 sm:mb-8"
        >
          <span>✦</span>
          <span>LAS VEGAS VIDEO PRODUCTION</span>
        </motion.div>

        {/* Wordmark — logo image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-6 sm:mb-8 flex items-center justify-center"
        >
          <img
            src={LOGO_TRANSPARENT}
            alt="Loomelic Media"
            className="w-[280px] sm:w-[380px] md:w-[480px] lg:w-[580px] xl:w-[680px] h-auto"
            style={{ display: "block", filter: "brightness(0) invert(1)" }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="font-body text-sm sm:text-base text-white/50 tracking-widest uppercase text-center mb-10 sm:mb-12"
        >
          Designing Your Visual World
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <button onClick={() => scrollTo("projects")} className="btn-pill-light text-xs py-3 px-6">
            OUR STORY +
          </button>
          <button onClick={() => scrollTo("contact")} className="btn-pill-outline text-xs py-3 px-6">
            CONTACT US ↗
          </button>
        </motion.div>
      </div>

      {/* Bottom row: social icons + category label */}
      <div className="relative z-10 flex items-center justify-between px-5 sm:px-10 pb-6 sm:pb-8">
        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex items-center gap-3"
        >
          <a
            href="https://www.instagram.com/loomelicmedia"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition-all"
          >
            <Instagram size={15} />
          </a>
          <a
            href="https://www.youtube.com/@loomelicmedia"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition-all"
          >
            <Youtube size={15} />
          </a>
        </motion.div>

        {/* Category label center */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="section-label hidden sm:flex"
        >
          VISUAL IDENTITY
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="section-label"
        >
          <span>SCROLL</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >↓</motion.span>
        </motion.div>
      </div>

      {/* Scrolling category marquee */}
      <div className="relative z-10 border-t border-white/8 py-3 overflow-hidden">
        <div className="animate-marquee">
          {[...categories, ...categories].map((cat, i) => (
            <span key={i} className="font-display-normal text-sm text-white/20 px-6 shrink-0">
              {cat} <span className="text-lime mx-2">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
