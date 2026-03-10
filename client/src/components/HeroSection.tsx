/* ============================================================
   HeroSection — Enterprise platform evolution
   Preserves: cinematic video bg, Barlow Condensed display,
              pill CTAs, lime accent, bottom marquee
   Adds: enterprise positioning statement, client type badges
   ============================================================ */
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Instagram, Youtube, ArrowRight } from "lucide-react";
import { LOGO_TRANSPARENT, HERO_VIDEOS } from "@/lib/media";

const CLIENT_TYPES = [
  "DEALERSHIPS",
  "DEALER GROUPS",
  "EVENTS",
  "BRANDS",
  "ENTERPRISE",
];

const MARQUEE_ITEMS = [
  "AUTOMOTIVE",
  "EVENTS",
  "HEADSHOTS",
  "WEBSITES",
  "BRAND CONTENT",
  "CRM VIDEO",
  "DRONE",
  "LAS VEGAS",
  "SOUTH FLORIDA",
];

export default function HeroSection() {
  const [, navigate] = useLocation();

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden section-dark"
      aria-label="Hero"
    >
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30"
          src={HERO_VIDEOS.lexusRoll}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[oklch(0.07_0_0)]/70 via-[oklch(0.07_0_0)]/50 to-[oklch(0.07_0_0)]"
          aria-hidden="true"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-5 sm:px-10 lg:px-16 pb-12 sm:pb-20 pt-32">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="section-label mb-6"
        >
          <span>✦</span>
          <span>Las Vegas &amp; South Florida</span>
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(3.2rem,10vw,9.5rem)] leading-[0.88] text-white mb-6 max-w-5xl"
        >
          LOOMELIC<br />
          <span className="text-outline-white">MEDIA</span>
        </motion.h1>

        {/* Enterprise subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-white/60 text-sm sm:text-base max-w-lg leading-relaxed mb-8"
        >
          Structured photo, video, and web production for automotive
          dealerships, dealer groups, events, and brands. Monthly retainers.
          Multi-rooftop support. Las Vegas and South Florida.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <button
            onClick={() => navigate("/contact")}
            className="btn-pill-light text-xs py-3 px-7 font-semibold tracking-widest"
            aria-label="Book a discovery call"
          >
            BOOK A DISCOVERY CALL
          </button>
          <button
            onClick={() => navigate("/portfolio")}
            className="text-xs py-3 px-7 font-semibold tracking-widest rounded-full border border-white/30 text-white/80 hover:border-white hover:text-white transition-all duration-200 flex items-center gap-2"
            aria-label="View portfolio"
          >
            VIEW PORTFOLIO <ArrowRight size={13} />
          </button>
        </motion.div>

        {/* Client type badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {CLIENT_TYPES.map((type) => (
            <span
              key={type}
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/[0.04] border border-white/8 font-body text-[0.6rem] tracking-[0.12em] text-white/35"
            >
              {type}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="relative z-10 flex items-center justify-between px-5 sm:px-10 pb-5">
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
            aria-label="Loomelic Media on Instagram"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition-all"
          >
            <Instagram size={15} />
          </a>
          <a
            href="https://www.youtube.com/@loomelicmedia"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Loomelic Media on YouTube"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition-all"
          >
            <Youtube size={15} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="section-label"
        >
          <span>SCROLL</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
        </motion.div>
      </div>

      {/* Scrolling category marquee */}
      <div className="relative z-10 border-t border-white/8 py-3 overflow-hidden">
        <div className="animate-marquee">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((cat, i) => (
            <span
              key={i}
              className="font-display-normal text-sm text-white/20 px-6 shrink-0"
            >
              {cat} <span className="text-lime mx-2">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
