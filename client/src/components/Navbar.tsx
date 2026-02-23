/* ============================================================
   LOOMELIC MEDIA — Navbar
   Design: Dark Cinematic Luxury — transparent → solid on scroll
   Mobile: Full-screen slide-in menu
   ============================================================ */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { LOGO } from "@/lib/media";

const navLinks = [
  { label: "PROJECTS", href: "#projects" },
  { label: "SERVICES", href: "#services" },
  { label: "ABOUT", href: "#about" },
  { label: "PORTFOLIO", href: "#portfolio" },
  { label: "CONTACT", href: "#contact" },
];

function scrollTo(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* Announcement ticker */}
      <div className="w-full bg-[oklch(0.05_0.005_285)] border-b border-white/5 overflow-hidden py-1.5 relative z-50">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array(8).fill("** CAR DEALERS LOOKING TO ELEVATE THEIR MARKETING IN LAS VEGAS AND THE SOUTH FL MARKET — CONNECT WITH US FOR EXPERT PHOTO, VIDEO, AND DIGITAL CONTENT  ").map((t, i) => (
            <span key={i} className="text-[10px] tracking-[0.2em] text-white/50 font-body px-4 uppercase">{t}</span>
          ))}
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[oklch(0.07_0.005_285/0.97)] backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_oklch(0_0_0/0.5)]"
            : "bg-[oklch(0.07_0.005_285/0.85)] backdrop-blur-md"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="flex-shrink-0"
            >
              <img src={LOGO} alt="Loomelic Media" className="h-7 sm:h-8 w-auto" />
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="font-body text-[11px] tracking-[0.2em] text-white/60 hover:text-white transition-colors duration-200 relative group uppercase"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[oklch(0.92_0.28_142)] group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => scrollTo("#contact")}
                className="hidden sm:inline-block btn-neon text-xs py-2.5 px-5"
              >
                GET IN TOUCH
              </button>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
                aria-label="Toggle menu"
              >
                <span className={`block h-px bg-white transition-all duration-300 ${menuOpen ? "w-6 rotate-45 translate-y-[5px]" : "w-6"}`} />
                <span className={`block h-px bg-white transition-all duration-300 ${menuOpen ? "w-0 opacity-0" : "w-4"}`} />
                <span className={`block h-px bg-white transition-all duration-300 ${menuOpen ? "w-6 -rotate-45 -translate-y-[5px]" : "w-5"}`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[oklch(0.05_0.005_285)] flex flex-col"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[oklch(0.55_0.22_293/0.05)] to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <img src={LOGO} alt="Loomelic Media" className="h-7 w-auto" />
              <button onClick={() => setMenuOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 flex flex-col justify-center px-8">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  onClick={() => {
                    setMenuOpen(false);
                    setTimeout(() => scrollTo(link.href), 350);
                  }}
                  className="block w-full text-left py-5 border-b border-white/8 font-display text-4xl sm:text-5xl tracking-[0.08em] text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-10"
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setTimeout(() => scrollTo("#contact"), 350);
                  }}
                  className="btn-neon text-sm"
                >
                  GET IN TOUCH
                </button>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="px-8 pb-8"
            >
              <div className="divider-neon mb-5" />
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <div>
                  <span className="font-body text-[10px] text-white/40 tracking-widest uppercase block mb-1">Phone</span>
                  <a href="tel:702-827-4110" className="font-body text-sm text-white/70">702-827-4110</a>
                </div>
                <div>
                  <span className="font-body text-[10px] text-white/40 tracking-widest uppercase block mb-1">Location</span>
                  <span className="font-body text-sm text-white/70">Las Vegas, NV</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
