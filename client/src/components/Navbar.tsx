/* ============================================================
   Navbar — Enterprise platform rebuild
   Desktop: pill nav with Solutions + Services mega-dropdowns,
            Case Studies, Process, Portals, About, Contact
   Mobile: full-screen overlay with accordion sections
   Preserves: pill group, dark glass, logo offset, lime accent
   ============================================================ */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { X, Menu, ChevronDown, ChevronRight, Building2, Users, Globe, Calendar, Camera, Monitor, Video, Plane, Briefcase, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { LOGO_TRANSPARENT } from "@/lib/media";

/* ─── SOLUTIONS MENU ─────────────────────────────────────── */
const SOLUTION_ITEMS = [
  { label: "Dealerships", href: "/solutions/dealerships", icon: Building2, desc: "Single-rooftop content systems" },
  { label: "Dealer Groups", href: "/solutions/dealer-groups", icon: Users, desc: "Multi-location support" },
  { label: "Enterprise / Regional", href: "/solutions/enterprise", icon: Globe, desc: "Scalable regional programs" },
  { label: "Events & Activations", href: "/solutions/events", icon: Calendar, desc: "Full-service event coverage" },
  { label: "Headshots & Team Branding", href: "/solutions/headshots", icon: Camera, desc: "Professional team portraits" },
  { label: "Website Design", href: "/solutions/websites", icon: Monitor, desc: "Premium web experiences" },
  { label: "CRM Video Systems", href: "/solutions/crm-video", icon: Video, desc: "Sales enablement media" },
];

/* ─── SERVICES MENU ──────────────────────────────────────── */
const SERVICE_ITEMS = [
  { label: "Dealer Services", href: "/services/dealer", isGroup: true },
  { label: "Inventory Photography", href: "/services/dealer/01-inventory-photography", sub: true },
  { label: "Short-Form Reels", href: "/services/dealer/02-short-form-reels", sub: true },
  { label: "Walkaround Videos", href: "/services/dealer/03-walkaround-videos", sub: true },
  { label: "Dealership Events", href: "/services/dealer/04-dealership-events", sub: true },
  { label: "CRM Intro Videos", href: "/services/dealer/05-crm-intro-videos", sub: true },
  { label: "Event Coverage", href: "/services/events" },
  { label: "Headshots", href: "/services/headshots" },
  { label: "Website Building", href: "/services/websites" },
  { label: "Drone & Exterior Visuals", href: "/services/drone" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mSolutionsOpen, setMSolutionsOpen] = useState(false);
  const [mServicesOpen, setMServicesOpen] = useState(false);
  const [mPortalsOpen, setMPortalsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, navigate] = useLocation();
  const solTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const svcTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setSolutionsOpen(false);
    setServicesOpen(false);
    setMenuOpen(false);
  }, [location]);

  const goTo = (href: string) => {
    setMenuOpen(false);
    setSolutionsOpen(false);
    setServicesOpen(false);
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

  /* Hover handlers for Solutions */
  const handleSolEnter = () => { if (solTimerRef.current) clearTimeout(solTimerRef.current); setSolutionsOpen(true); setServicesOpen(false); };
  const handleSolLeave = () => { solTimerRef.current = setTimeout(() => setSolutionsOpen(false), 200); };

  /* Hover handlers for Services */
  const handleSvcEnter = () => { if (svcTimerRef.current) clearTimeout(svcTimerRef.current); setServicesOpen(true); setSolutionsOpen(false); };
  const handleSvcLeave = () => { svcTimerRef.current = setTimeout(() => setServicesOpen(false), 200); };

  const pillBase = "px-3.5 py-1.5 rounded-full text-[0.68rem] font-semibold tracking-[0.1em] transition-all duration-200";
  const pillActive = "text-white bg-white/15";
  const pillIdle = "text-white/70 hover:text-white hover:bg-white/10";

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
            {/* Solutions dropdown */}
            <div className="relative" onMouseEnter={handleSolEnter} onMouseLeave={handleSolLeave}>
              <button
                onClick={() => goTo("/solutions/dealerships")}
                className={`flex items-center gap-1 ${pillBase} ${location.startsWith("/solutions") ? pillActive : pillIdle}`}
              >
                SOLUTIONS <ChevronDown size={11} className={`transition-transform duration-200 ${solutionsOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {solutionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-3 w-[320px] bg-[oklch(0.08_0_0)] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                    onMouseEnter={handleSolEnter}
                    onMouseLeave={handleSolLeave}
                  >
                    <div className="px-5 py-3 border-b border-white/6">
                      <p className="font-body text-[0.6rem] tracking-[0.15em] text-white/30 uppercase">Solutions by vertical</p>
                    </div>
                    {SOLUTION_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.href}
                          onClick={() => goTo(item.href)}
                          className={`w-full text-left px-5 py-3 flex items-center gap-3 border-b border-white/5 last:border-0 transition-colors duration-150 hover:bg-white/6 ${location === item.href ? "bg-white/8" : ""}`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center shrink-0">
                            <Icon size={14} className="text-white/50" />
                          </div>
                          <div>
                            <p className="font-semibold text-[0.7rem] tracking-[0.08em] text-white/80">{item.label.toUpperCase()}</p>
                            <p className="font-body text-[0.6rem] text-white/35 mt-0.5">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Services dropdown */}
            <div className="relative" onMouseEnter={handleSvcEnter} onMouseLeave={handleSvcLeave}>
              <button
                onClick={() => goTo("/services")}
                className={`flex items-center gap-1 ${pillBase} ${location.startsWith("/services") ? pillActive : pillIdle}`}
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
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-[oklch(0.08_0_0)] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                    onMouseEnter={handleSvcEnter}
                    onMouseLeave={handleSvcLeave}
                  >
                    {SERVICE_ITEMS.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => goTo(item.href)}
                        className={`w-full text-left border-b border-white/5 last:border-0 transition-colors duration-150 ${
                          'sub' in item && item.sub
                            ? 'px-6 py-2 text-[0.63rem] tracking-[0.08em]'
                            : 'px-5 py-3 text-[0.7rem] tracking-[0.1em]'
                        } font-semibold ${
                          'isGroup' in item && item.isGroup
                            ? 'text-white/80 hover:text-white hover:bg-white/8'
                            : 'sub' in item && item.sub
                              ? 'text-white/40 hover:text-white/70 hover:bg-white/5'
                              : 'text-white/60 hover:text-white hover:bg-white/8'
                        } ${location === item.href || location.startsWith(item.href + '/') ? 'text-white bg-white/10' : ''}`}
                      >
                        {'sub' in item && item.sub ? `↳ ${item.label.toUpperCase()}` : item.label.toUpperCase()}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => goTo("/case-studies")} className={`${pillBase} ${location.startsWith("/case-studies") ? pillActive : pillIdle}`}>CASE STUDIES</button>
            <button onClick={() => goTo("/process")} className={`${pillBase} ${location === "/process" ? pillActive : pillIdle}`}>PROCESS</button>
            <button onClick={() => goTo("/about")} className={`${pillBase} ${location === "/about" ? pillActive : pillIdle}`}>ABOUT</button>
            <button onClick={() => goTo("/contact")} className={`${pillBase} ${location === "/contact" ? pillActive : pillIdle}`}>CONTACT</button>
          </div>

          {/* Right: Portal Buttons + CTA + Hamburger */}
          <div className="flex items-center gap-3">
            {/* Portal quick-access */}
            <div className="hidden xl:flex items-center gap-2">
              <button
                onClick={() => goTo("/crm")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.63rem] font-bold tracking-[0.1em] bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/25 hover:text-yellow-200 transition-all duration-200"
              >
                <Building2 size={12} />
                DEALER CRM
              </button>
              <button
                onClick={() => goTo("/vendor")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.63rem] font-bold tracking-[0.1em] bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 hover:text-purple-200 transition-all duration-200"
              >
                <Camera size={12} />
                VENDOR
              </button>
            </div>
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
              {/* Solutions accordion */}
              <MobileAccordion
                label="SOLUTIONS"
                open={mSolutionsOpen}
                toggle={() => setMSolutionsOpen(!mSolutionsOpen)}
                delay={0}
              >
                {SOLUTION_ITEMS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => goTo(item.href)}
                      className="flex items-center gap-3 text-left py-3 text-white/60 hover:text-white transition-colors"
                    >
                      <Icon size={14} className="text-white/30 shrink-0" />
                      <span className="font-body text-sm tracking-widest uppercase">{item.label}</span>
                    </motion.button>
                  );
                })}
              </MobileAccordion>

              {/* Services accordion */}
              <MobileAccordion
                label="SERVICES"
                open={mServicesOpen}
                toggle={() => setMServicesOpen(!mServicesOpen)}
                delay={0.05}
              >
                {SERVICE_ITEMS.map((item, i) => (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => goTo(item.href)}
                    className="text-left py-2.5 text-white/60 hover:text-white font-body text-sm tracking-widest uppercase transition-colors"
                  >
                    {'sub' in item && item.sub ? `↳ ${item.label}` : item.label}
                  </motion.button>
                ))}
              </MobileAccordion>

              {/* Direct links */}
              {[
                { label: "CASE STUDIES", href: "/case-studies" },
                { label: "PROCESS", href: "/process" },
                { label: "PORTFOLIO", href: "/portfolio" },
                { label: "OUR STORY", href: "/about" },
                { label: "CONTACT", href: "/contact" },
              ].map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => goTo(link.href)}
                  className="text-left py-4 border-b border-white/6 group"
                >
                  <span className="font-display-normal text-4xl sm:text-5xl text-white/90 group-hover:text-lime transition-colors duration-200">
                    {link.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Portal buttons in mobile menu */}
            <div className="px-8 py-5 border-t border-white/8 flex flex-col gap-3">
              <p className="font-body text-[0.6rem] text-white/30 tracking-[0.15em] uppercase mb-1">Client Portals</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => goTo("/crm")}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/25 text-yellow-300 hover:bg-yellow-500/20 transition-all duration-200"
                >
                  <Building2 size={16} className="shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-xs tracking-wide">Dealer CRM</p>
                  </div>
                </button>
                <button
                  onClick={() => goTo("/vendor")}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-300 hover:bg-purple-500/20 transition-all duration-200"
                >
                  <Camera size={16} className="shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-xs tracking-wide">Vendor Portal</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Footer info */}
            <div className="px-8 py-5 border-t border-white/8">
              <p className="font-body text-xs text-white/30 tracking-widest uppercase">Las Vegas, NV · South Florida</p>
              <p className="font-body text-sm text-white/50 mt-1">702-827-4110</p>
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
  children,
}: {
  label: string;
  open: boolean;
  toggle: () => void;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, delay }}
      className="border-b border-white/6"
    >
      <button
        onClick={toggle}
        className="w-full text-left py-4 flex items-center justify-between group"
      >
        <span className="font-display-normal text-4xl sm:text-5xl text-white/90 group-hover:text-lime transition-colors duration-200">
          {label}
        </span>
        <ChevronDown
          size={24}
          className={`text-white/40 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-4 flex flex-col gap-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
