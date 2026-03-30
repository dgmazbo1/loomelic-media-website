/* ============================================================
   Navbar — Loomelic Media
   Desktop: pill nav with Services mega-dropdown (Dealer Services flyout),
            Portfolio, Process, About, Contact, Portal buttons
   Mobile: full-screen overlay with accordion sections
   ============================================================ */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { X, Menu, ChevronDown, ChevronRight, Building2, Camera } from "lucide-react";
import { useLocation } from "wouter";
import { LOGO_TRANSPARENT } from "@/lib/media";

/* ─── DEALER SERVICES SUB-ITEMS ─────────────────────────── */
const DEALER_SUB_ITEMS = [
  { label: "Dealerships", href: "/services/dealer-services/dealerships" },
  { label: "Dealer Groups", href: "/services/dealer-services/dealer-groups" },
  { label: "Inventory Photography", href: "/services/dealer-services/inventory-photography" },
  { label: "Short-Form Reels", href: "/services/dealer-services/short-form-reels" },
  { label: "Walkaround Videos", href: "/services/dealer-services/walkaround-videos" },
  { label: "Headshots & Team Branding", href: "/services/dealer-services/headshots" },
  { label: "CRM Video Systems", href: "/services/dealer-services/crm-video" },
];

/* ─── TOP-LEVEL SERVICE ITEMS (non-dealer) ───────────────── */
const OTHER_SERVICE_ITEMS = [
  { label: "Convention & Trade Show", href: "/services/convention-video-production-las-vegas" },
  { label: "Event Coverage", href: "/services/events" },
  { label: "Premium Web Services", href: "/services/websites" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [dealerFlyoutOpen, setDealerFlyoutOpen] = useState(false);
  const [mServicesOpen, setMServicesOpen] = useState(false);
  const [mDealerOpen, setMDealerOpen] = useState(false);
  const [mPortalsOpen, setMPortalsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, navigate] = useLocation();
  const svcTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dealerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setServicesOpen(false);
    setDealerFlyoutOpen(false);
    setMenuOpen(false);
  }, [location]);

  const goTo = (href: string) => {
    setMenuOpen(false);
    setServicesOpen(false);
    setDealerFlyoutOpen(false);
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

  /* Hover handlers for Services */
  const handleSvcEnter = () => {
    if (svcTimerRef.current) clearTimeout(svcTimerRef.current);
    setServicesOpen(true);
  };
  const handleSvcLeave = () => {
    svcTimerRef.current = setTimeout(() => {
      setServicesOpen(false);
      setDealerFlyoutOpen(false);
    }, 220);
  };

  /* Hover handlers for Dealer Services flyout */
  const handleDealerEnter = () => {
    if (dealerTimerRef.current) clearTimeout(dealerTimerRef.current);
    if (svcTimerRef.current) clearTimeout(svcTimerRef.current);
    setDealerFlyoutOpen(true);
  };
  const handleDealerLeave = () => {
    dealerTimerRef.current = setTimeout(() => setDealerFlyoutOpen(false), 220);
  };

  const pillBase = "px-3.5 py-1.5 rounded-full text-[0.68rem] font-semibold tracking-[0.1em] transition-all duration-200";
  const pillActive = "text-white bg-white/15";
  const pillIdle = "text-white/70 hover:text-white hover:bg-white/10";

  const isServicesActive = location.startsWith("/services") || location.startsWith("/solutions/enterprise");

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[oklch(0.07_0_0)]/95 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-5 sm:px-8 lg:px-12 h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={goHome}
            className="flex-shrink-0 z-10 overflow-hidden"
            aria-label="Go to home"
            style={{ height: "64px" }}
          >
            <img
              src={LOGO_TRANSPARENT}
              alt="Loomelic Media"
              className="w-[130px] sm:w-[150px] h-auto"
              style={{ filter: "brightness(0) invert(1)", marginTop: "-97px" }}
            />
          </button>

          {/* Desktop nav — pill group */}
          <div className="hidden xl:flex items-center gap-0.5 bg-[oklch(1_0_0/0.06)] backdrop-blur-sm border border-[oklch(1_0_0/0.08)] rounded-full px-2 py-1.5">

            {/* Services dropdown */}
            <div className="relative" onMouseEnter={handleSvcEnter} onMouseLeave={handleSvcLeave}>
              <button
                onClick={() => goTo("/services")}
                className={`flex items-center gap-1 ${pillBase} ${isServicesActive ? pillActive : pillIdle}`}
              >
                SERVICES <ChevronDown size={11} className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-3 w-56 bg-[oklch(0.08_0_0)] border border-white/10 rounded-2xl overflow-visible shadow-2xl"
                    onMouseEnter={handleSvcEnter}
                    onMouseLeave={handleSvcLeave}
                  >
                    {/* Dealer Services — with flyout trigger */}
                    <div
                      className="relative"
                      onMouseEnter={handleDealerEnter}
                      onMouseLeave={handleDealerLeave}
                    >
                      <button
                        onClick={() => goTo("/services/dealer-services")}
                        className={`w-full text-left px-5 py-3 flex items-center justify-between border-b border-white/8 transition-colors duration-150 hover:bg-white/8 ${
                          location.startsWith("/services/dealer-services") ? "bg-white/10 text-white" : "text-white/80"
                        }`}
                      >
                        <span className="font-semibold text-[0.7rem] tracking-[0.1em]">DEALER SERVICES</span>
                        <ChevronRight size={12} className={`text-white/40 transition-transform duration-200 ${dealerFlyoutOpen ? "rotate-90" : ""}`} />
                      </button>

                      {/* Dealer Services flyout panel */}
                      <AnimatePresence>
                        {dealerFlyoutOpen && (
                          <motion.div
                            initial={{ opacity: 0, x: -8, scale: 0.97 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -8, scale: 0.97 }}
                            transition={{ duration: 0.16 }}
                            className="absolute top-0 left-full ml-2 w-56 bg-[oklch(0.09_0_0)] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                            onMouseEnter={handleDealerEnter}
                            onMouseLeave={handleDealerLeave}
                          >
                            <div className="px-5 py-2.5 border-b border-white/6">
                              <p className="font-body text-[0.58rem] tracking-[0.15em] text-white/30 uppercase">Dealer Services</p>
                            </div>
                            {DEALER_SUB_ITEMS.map((item) => (
                              <button
                                key={item.href}
                                onClick={() => goTo(item.href)}
                                className={`w-full text-left px-5 py-2.5 text-[0.65rem] font-semibold tracking-[0.08em] border-b border-white/5 last:border-0 transition-colors duration-150 hover:bg-white/8 hover:text-white ${
                                  location === item.href || location.startsWith(item.href + "/")
                                    ? "text-white bg-white/10"
                                    : "text-white/55"
                                }`}
                              >
                                {item.label.toUpperCase()}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Other services */}
                    {OTHER_SERVICE_ITEMS.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => goTo(item.href)}
                        className={`w-full text-left px-5 py-3 text-[0.7rem] font-semibold tracking-[0.1em] border-b border-white/5 last:border-0 transition-colors duration-150 hover:bg-white/8 hover:text-white ${
                          location === item.href || location.startsWith(item.href + "/")
                            ? "text-white bg-white/10"
                            : "text-white/60"
                        }`}
                      >
                        {item.label.toUpperCase()}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => goTo("/portfolio")} className={`${pillBase} ${location.startsWith("/portfolio") || location.startsWith("/case-studies") ? pillActive : pillIdle}`}>PORTFOLIO</button>
            <button onClick={() => goTo("/featured-work")} className={`${pillBase} ${location === "/featured-work" ? pillActive : pillIdle}`}>FEATURED WORK</button>
            <button onClick={() => goTo("/use-cases")} className={`${pillBase} ${location === "/use-cases" ? pillActive : pillIdle}`}>USE CASES</button>
            <button onClick={() => goTo("/process")} className={`${pillBase} ${location === "/process" ? pillActive : pillIdle}`}>PROCESS</button>
            <button onClick={() => goTo("/about")} className={`${pillBase} ${location === "/about" ? pillActive : pillIdle}`}>ABOUT</button>
            <button onClick={() => goTo("/contact")} className={`${pillBase} ${location === "/contact" ? pillActive : pillIdle}`}>CONTACT</button>
          </div>

          {/* Right: Portal Buttons + CTA + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">

            <button
              onClick={() => goTo("/contact")}
              className="hidden sm:flex btn-pill-light text-xs py-2 px-5"
            >
              BOOK A CALL
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
            <div className="flex-1 flex flex-col px-8 gap-0 overflow-y-auto py-6">

              {/* Services accordion */}
              <MobileAccordion
                label="SERVICES"
                open={mServicesOpen}
                toggle={() => setMServicesOpen(!mServicesOpen)}
                delay={0}
              >
                {/* Dealer Services nested accordion */}
                <MobileAccordion
                  label="DEALER SERVICES"
                  open={mDealerOpen}
                  toggle={() => setMDealerOpen(!mDealerOpen)}
                  delay={0}
                  nested
                >
                  {DEALER_SUB_ITEMS.map((item, i) => (
                    <motion.button
                      key={item.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => goTo(item.href)}
                      className="text-left py-2 pl-4 text-white/50 hover:text-white font-body text-xs tracking-widest uppercase transition-colors"
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </MobileAccordion>

                {/* Other services */}
                {OTHER_SERVICE_ITEMS.map((item, i) => (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => goTo(item.href)}
                    className="text-left py-2.5 text-white/60 hover:text-white font-body text-sm tracking-widest uppercase transition-colors"
                  >
                    {item.label}
                  </motion.button>
                ))}
              </MobileAccordion>

              {/* Direct links */}
              {[
                { label: "PORTFOLIO", href: "/portfolio" },
                { label: "FEATURED WORK", href: "/featured-work" },
                { label: "USE CASES", href: "/use-cases" },
                { label: "PROCESS", href: "/process" },
                { label: "OUR STORY", href: "/about" },
                { label: "CONTACT", href: "/contact" },
              ].map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => goTo(link.href)}
                  className="text-left py-4 border-b border-white/6 group"
                >
                  <span className="font-display-normal text-4xl sm:text-5xl text-white/90 group-hover:text-white transition-colors duration-200">
                    {link.label}
                  </span>
                </motion.button>
              ))}
            </div>



            {/* Footer info */}
            <div className="px-8 py-5 border-t border-white/8">
              <p className="font-body text-xs text-white/30 tracking-widest uppercase">Las Vegas, NV · South Florida</p>
              <a href="tel:+17028274110" className="font-body text-sm text-white/50 mt-1 hover:text-white transition-colors block">702-827-4110</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── MOBILE ACCORDION HELPER ────────────────────────────── */
function MobileAccordion({
  label,
  open,
  toggle,
  delay,
  nested = false,
  children,
}: {
  label: string;
  open: boolean;
  toggle: () => void;
  delay: number;
  nested?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={nested ? "border-l border-white/8 pl-3 my-1" : "border-b border-white/6"}
    >
      <button
        onClick={toggle}
        className={`w-full flex items-center justify-between text-left group ${
          nested ? "py-2.5" : "py-4"
        }`}
      >
        <span className={`font-display-normal transition-colors duration-200 group-hover:text-white ${
          nested
            ? "text-xl text-white/60"
            : "text-4xl sm:text-5xl text-white/90"
        }`}>
          {label}
        </span>
        <ChevronDown
          size={nested ? 14 : 18}
          className={`text-white/40 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className={`flex flex-col ${nested ? "pb-2" : "pb-4"}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
