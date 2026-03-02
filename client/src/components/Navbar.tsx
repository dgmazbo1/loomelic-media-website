/* ============================================================
   Navbar — Multi-vertical rebuild
   Desktop: pill nav, Services has hover dropdown revealing 4 subpages
   Mobile: full-screen overlay, Services tap-to-expand accordion
   All items are real routes
   ============================================================ */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { X, Menu, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";
import { LOGO_TRANSPARENT } from "@/lib/media";

const SERVICE_ITEMS = [
  { label: "Dealer Services", href: "/services/dealer" },
  { label: "Event Coverage", href: "/services/events" },
  { label: "Headshots", href: "/services/headshots" },
  { label: "Website Building", href: "/services/websites" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, navigate] = useLocation();
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    setDropdownOpen(false);
    setMenuOpen(false);
  }, [location]);

  const goTo = (href: string) => {
    setMenuOpen(false);
    setDropdownOpen(false);
    navigate(href);
  };

  const goHome = () => {
    setMenuOpen(false);
    if (location === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const handleServicesMouseEnter = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setDropdownOpen(true);
  };
  const handleServicesMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => setDropdownOpen(false), 180);
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
            style={{ height: "64px" }}
          >
            {/* Logo is 9:16 portrait (1080x1920).
                At w-[140px], full height = 140 * (1920/1080) = ~249px.
                Logo text (LOOMELIC + MEDIA) spans ~42%-62% = 104px-154px from top.
                Text block height = ~50px. Container = 64px.
                Shift up by ~97px to center text in 64px container. */}
            <img
              src={LOGO_TRANSPARENT}
              alt="Loomelic Media"
              className="w-[130px] sm:w-[150px] h-auto"
              style={{
                filter: "brightness(0) invert(1)",
                marginTop: "-97px",
              }}
            />
          </button>

          {/* Desktop nav — pill group */}
          <div className="hidden lg:flex items-center gap-1 bg-[oklch(1_0_0/0.06)] backdrop-blur-sm border border-[oklch(1_0_0/0.08)] rounded-full px-2 py-1.5">
            <button onClick={() => goTo("/projects")} className={`px-4 py-1.5 rounded-full text-[0.7rem] font-semibold tracking-[0.12em] transition-all duration-200 ${location === "/projects" ? "text-white bg-white/15" : "text-white/70 hover:text-white hover:bg-white/10"}`}>PROJECTS</button>
            {/* Services dropdown */}
            <div className="relative" onMouseEnter={handleServicesMouseEnter} onMouseLeave={handleServicesMouseLeave}>
              <button onClick={() => goTo("/services")} className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-[0.7rem] font-semibold tracking-[0.12em] transition-all duration-200 ${location.startsWith("/services") ? "text-white bg-white/15" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
                SERVICES <ChevronDown size={12} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.18 }} className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-[oklch(0.1_0_0)] border border-white/10 rounded-2xl overflow-hidden shadow-2xl" onMouseEnter={handleServicesMouseEnter} onMouseLeave={handleServicesMouseLeave}>
                    {SERVICE_ITEMS.map((item) => (
                      <button key={item.href} onClick={() => goTo(item.href)} className={`w-full text-left px-5 py-3.5 text-[0.72rem] font-semibold tracking-[0.1em] transition-colors duration-150 border-b border-white/5 last:border-0 ${location === item.href ? "text-white bg-white/10" : "text-white/60 hover:text-white hover:bg-white/8"}`}>{item.label.toUpperCase()}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button onClick={() => goTo("/about")} className={`px-4 py-1.5 rounded-full text-[0.7rem] font-semibold tracking-[0.12em] transition-all duration-200 ${location === "/about" ? "text-white bg-white/15" : "text-white/70 hover:text-white hover:bg-white/10"}`}>OUR STORY</button>
            <button onClick={() => goTo("/portfolio")} className={`px-4 py-1.5 rounded-full text-[0.7rem] font-semibold tracking-[0.12em] transition-all duration-200 ${location === "/portfolio" ? "text-white bg-white/15" : "text-white/70 hover:text-white hover:bg-white/10"}`}>PORTFOLIO</button>
            <button onClick={() => goTo("/contact")} className={`px-4 py-1.5 rounded-full text-[0.7rem] font-semibold tracking-[0.12em] transition-all duration-200 ${location === "/contact" ? "text-white bg-white/15" : "text-white/70 hover:text-white hover:bg-white/10"}`}>CONTACT</button>
          </div>

          {/* Right: CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => goTo("/contact")}
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
              <div className="overflow-hidden" style={{ height: "56px" }}>
                <img
                  src={LOGO_TRANSPARENT}
                  alt="Loomelic Media"
                  className="w-[130px] h-auto"
                  style={{ filter: "brightness(0) invert(1)", marginTop: "-97px" }}
                />
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 flex flex-col justify-center px-8 gap-1 overflow-y-auto">
              {[{ label: "PROJECTS", href: "/projects" }, { label: "OUR STORY", href: "/about" }, { label: "PORTFOLIO", href: "/portfolio" }, { label: "CONTACT", href: "/contact" }].map((link, i) => (
                <motion.button key={link.label} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }} onClick={() => goTo(link.href)} className="text-left py-4 border-b border-white/6 group">
                  <span className="font-display-normal text-5xl sm:text-7xl text-white/90 group-hover:text-lime transition-colors duration-200">{link.label}</span>
                </motion.button>
              ))}
              {/* Services accordion */}
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, delay: 0.07 }} className="border-b border-white/6">
                <button onClick={() => setServicesOpen(!servicesOpen)} className="w-full text-left py-4 flex items-center justify-between group">
                  <span className="font-display-normal text-5xl sm:text-7xl text-white/90 group-hover:text-lime transition-colors duration-200">SERVICES</span>
                  <ChevronDown size={28} className={`text-white/40 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="pb-4 pl-4 flex flex-col gap-1">
                        {SERVICE_ITEMS.map((item, i) => (
                          <motion.button key={item.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} onClick={() => goTo(item.href)} className="text-left py-2.5 text-white/60 hover:text-white font-body text-sm tracking-widest uppercase transition-colors">↳ {item.label}</motion.button>
                        ))}
                        <button onClick={() => goTo("/services")} className="text-left py-2.5 text-white/40 hover:text-white/70 font-body text-xs tracking-widest uppercase transition-colors">↳ All Services Overview</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Footer info */}
            <div className="px-8 py-8 border-t border-white/8">
              <p className="font-body text-xs text-white/30 tracking-widest uppercase">Las Vegas, NV · South Florida</p>
              <p className="font-body text-sm text-white/50 mt-1">702-827-4110</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
