/* ============================================================
   Navbar — Unusually-inspired
   Style: Transparent logo left, nav center (pill group), hamburger right
   Mobile: Full-screen overlay with staggered link reveal
   Smart navigation: works from both home page (scroll) and sub-pages (navigate)
   ============================================================ */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import { useLocation } from "wouter";

import { LOGO_TRANSPARENT } from "@/lib/media";

const navLinks = [
  { label: "PROJECTS", href: "#projects" },
  { label: "SERVICES", href: "#services" },
  { label: "ABOUT", href: "#about" },
  { label: "PORTFOLIO", href: "#portfolio" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, navigate] = useLocation();

  const isHome = location === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 80; // fixed navbar height
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    if (isHome) {
      scrollToSection(id);
    } else {
      // Navigate home then scroll
      navigate("/");
      setTimeout(() => scrollToSection(id), 400);
    }
  };

  const goHome = () => {
    setMenuOpen(false);
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[oklch(0.07_0_0)]/95 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-5 sm:px-8 lg:px-12 h-16 sm:h-20">
          {/* Transparent Logo */}
          <button
            onClick={goHome}
            className="flex-shrink-0 z-10 overflow-hidden"
            aria-label="Go to home"
            style={{ height: "52px" }}
          >
            {/* Logo is 9:16 portrait (1080x1920). At w-[220px], full height = ~391px.
                Logo text sits at ~45%-58% of image height = ~176px-227px from top.
                We shift up by ~170px to center the text in the 52px container. */}
            <img
              src={LOGO_TRANSPARENT}
              alt="Loomelic Media"
              className="w-[180px] sm:w-[220px] h-auto"
              style={{
                filter: "brightness(0) invert(1)",
                marginTop: "-170px",
              }}
            />
          </button>

          {/* Desktop nav — pill group */}
          <div className="hidden lg:flex items-center gap-1 bg-[oklch(1_0_0/0.06)] backdrop-blur-sm border border-[oklch(1_0_0/0.08)] rounded-full px-2 py-1.5">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-1.5 rounded-full text-[0.7rem] font-semibold tracking-[0.12em] text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right: CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick("#contact")}
              className="hidden sm:flex btn-pill-light text-xs py-2 px-5"
            >
              GET IN TOUCH
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/8 border border-white/10 text-white hover:bg-white/15 transition-all"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[oklch(0.04_0_0)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <img
                src={LOGO_TRANSPARENT}
                alt="Loomelic Media"
                className="h-14 w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 flex flex-col justify-center px-8 gap-1">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left py-4 border-b border-white/6 group"
                >
                  <span className="font-display-normal text-5xl sm:text-7xl text-white/90 group-hover:text-lime transition-colors duration-200">
                    {link.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Footer info */}
            <div className="px-8 py-8 border-t border-white/8">
              <p className="font-body text-xs text-white/30 tracking-widest uppercase">Las Vegas, NV</p>
              <p className="font-body text-sm text-white/50 mt-1">702-827-4110</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
