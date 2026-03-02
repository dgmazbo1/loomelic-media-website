/* ============================================================
   HeroSection — Dealer-acquisition rebuild
   Design: Dark cinematic background, dealer-focused headline,
           outcome-driven subhead, dual CTA, trust line
   ============================================================ */
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Instagram, Youtube } from "lucide-react";
import { LOGO_TRANSPARENT, HERO_VIDEOS } from "@/lib/media";

const categories = [
  "AUTOMOTIVE", "EVENTS", "HEADSHOTS", "WEBSITES", "BRAND CONTENT", "LAS VEGAS", "SOUTH FLORIDA"
];

export default function HeroSection() {
  const [, navigate] = useLocation();

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

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
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.07_0_0)]/70 via-[oklch(0.07_0_0)]/50 to-[oklch(0.07_0_0)]" aria-hidden="true" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-5 sm:px-10 lg:px-16 pb-12 sm:pb-20 pt-32">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="section-label mb-6"
        >
          <span>✦</span>
          <span>A Las Vegas Production Company</span>
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(3.2rem,10vw,9.5rem)] leading-[0.88] text-white mb-6 max-w-5xl"
        >
          VISUAL CONTENT<br />
          <span className="text-outline-white">BUILT TO</span><br />
          PERFORM
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-white/60 text-sm sm:text-base max-w-lg leading-relaxed mb-8"
        >
          Photo, video, and web production for automotive dealerships, events, headshots, and brands — Las Vegas and South Florida.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-wrap items-center gap-3 mb-5"
        >
          <button
            onClick={() => navigate("/contact")}
            className="btn-pill-light text-xs py-3 px-7 font-semibold tracking-widest"
            aria-label="Get in touch"
          >
            GET IN TOUCH
          </button>
          <button
            onClick={() => navigate("/projects")}
            className="text-xs py-3 px-7 font-semibold tracking-widest rounded-full border border-white/30 text-white/80 hover:border-white hover:text-white transition-all duration-200"
            aria-label="View our work"
          >
            VIEW OUR WORK
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="font-body text-xs text-white/35 tracking-widest mb-10"
        >
          Serving Las Vegas and South Florida.
        </motion.p>
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
