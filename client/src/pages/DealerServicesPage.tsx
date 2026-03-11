/* ============================================================
   DealerServicesPage — Dealer-specific verticals
   Moved from SolutionsPage — exact same section format,
   photos, videos, and content. No changes.
   
   Handles routes:
     /services/dealer-services                          → full overview
     /services/dealer-services/dealerships              → scroll to dealerships
     /services/dealer-services/dealer-groups            → scroll to dealer-groups
     /services/dealer-services/headshots                → scroll to headshots
     /services/dealer-services/crm-video                → scroll to crm-video
     /services/dealer-services/inventory-photography    → scroll to inventory-photography
     /services/dealer-services/short-form-reels         → scroll to short-form-reels
     /services/dealer-services/walkaround-videos        → scroll to walkaround-videos
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Building2, Users, Camera, Video,
  ArrowRight, CheckCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { HERO_VIDEOS, LEXUS_HENDERSON, HERO_GRID_IMAGES } from "@/lib/media";

function AnimFade({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── SECTIONS — exact same data as was in SolutionsPage ─── */
const DEALER_SECTIONS = [
  {
    id: "dealerships",
    icon: Building2,
    label: "SINGLE-POINT DEALERS",
    title: "DEALER CONTENT\nSYSTEMS",
    desc: "Structured content operations built specifically for automotive dealerships. Monthly retainers with consistent turnaround — inventory photography, walkaround videos, social reels, event coverage, and staff headshots.",
    features: [
      "Lot & inventory photography (new + pre-owned)",
      "Walkaround and delivery videos",
      "Short-form social media reels",
      "Dealership event coverage",
      "Staff headshots and team photography",
      "Drone and exterior visuals",
      "CRM intro videos for sales teams",
      "Monthly content calendar and scheduling",
    ],
    bestFor: "Single-point dealerships looking for a consistent, reliable content partner.",
    image: LEXUS_HENDERSON.hero,
    video: HERO_VIDEOS.lexusRoll,
  },
  {
    id: "dealer-groups",
    icon: Users,
    label: "MULTI-ROOFTOP GROUPS",
    title: "DEALER GROUP\nOPERATIONS",
    desc: "Scaled content operations across multiple rooftops. Centralized creative direction with location-specific execution — one team, one brand standard, every location.",
    features: [
      "Multi-location content coordination",
      "Brand consistency system across rooftops",
      "Centralized asset library and delivery",
      "Group-level reporting and analytics",
      "Dedicated account manager per group",
      "Priority scheduling for seasonal campaigns",
      "Cross-location event coverage",
      "Scalable retainer pricing",
    ],
    bestFor: "Dealer groups with 2–20+ rooftops that need consistent brand content at scale.",
    image: LEXUS_HENDERSON.hero,
    video: HERO_VIDEOS.centennialDrone,
  },
  {
    id: "headshots",
    icon: Camera,
    label: "HEADSHOTS & TEAM BRANDING",
    title: "HEADSHOTS &\nPORTRAITS",
    desc: "Professional headshots, team portraits, and personal branding photography for dealership staff, executives, sales teams, and professionals. Studio-quality results on location.",
    features: [
      "Individual executive and staff headshots",
      "Team group photography",
      "Personal branding portrait sessions",
      "Dealership staff photo days",
      "LinkedIn and social profile optimization",
      "Same-day preview selects",
      "Retouched final deliverables",
      "Digital and print-ready formats",
    ],
    bestFor: "Dealership sales teams, executives, professionals, and personal brands.",
    image: HERO_GRID_IMAGES[1],
    video: HERO_VIDEOS.headlight,
  },
  {
    id: "crm-video",
    icon: Video,
    label: "CRM VIDEO SYSTEMS",
    title: "CRM INTRO\nVIDEOS",
    desc: "Personalized video content for dealership CRM systems. Custom intro videos for sales reps, service advisors, and finance managers — proven to increase response rates and appointment shows.",
    features: [
      "Individual rep intro videos",
      "Service advisor and finance manager videos",
      "CRM platform integration (VinSolutions, DealerSocket, etc.)",
      "Script writing and coaching",
      "Professional lighting and audio",
      "Fast turnaround — same-week delivery",
      "Batch production for full teams",
      "Analytics and performance tracking",
    ],
    bestFor: "Dealerships using CRM video to increase lead response rates and appointment shows.",
    image: HERO_GRID_IMAGES[3],
    video: HERO_VIDEOS.madisonTalkingHead,
  },
  {
    id: "inventory-photography",
    icon: Camera,
    label: "INVENTORY PHOTOGRAPHY",
    title: "INVENTORY\nPHOTOGRAPHY",
    desc: "Professional lot and inventory photography for new and pre-owned vehicles. Consistent, high-quality images shot to OEM standards — delivered fast, every time.",
    features: [
      "New and pre-owned vehicle photography",
      "Exterior 360° walkaround sets",
      "Interior detail shots",
      "OEM and VDP-optimized image sets",
      "Same-day or next-day turnaround",
      "Consistent white-sky or studio-style backgrounds",
      "Batch processing and bulk delivery",
      "Direct upload to DMS or third-party platforms",
    ],
    bestFor: "Dealerships that need fast, consistent, high-volume inventory photography for their VDPs.",
    image: LEXUS_HENDERSON.hero,
    video: HERO_VIDEOS.lexusRoll,
  },
  {
    id: "short-form-reels",
    icon: Video,
    label: "SHORT-FORM REELS",
    title: "SHORT-FORM\nREELS",
    desc: "Scroll-stopping short-form video content for Instagram, TikTok, Facebook, and YouTube Shorts. Built for dealership audiences — fast, engaging, and on-brand.",
    features: [
      "Instagram Reels and TikTok content",
      "Facebook and YouTube Shorts",
      "Vehicle feature highlights and walk-throughs",
      "Dealership culture and team content",
      "Seasonal promotions and event recaps",
      "Branded motion graphics and captions",
      "Music licensing included",
      "Monthly content calendar and scheduling",
    ],
    bestFor: "Dealerships building social media presence and driving organic reach on short-form platforms.",
    image: HERO_GRID_IMAGES[0],
    video: HERO_VIDEOS.socialMediaAds,
  },
  {
    id: "walkaround-videos",
    icon: Video,
    label: "WALKAROUND VIDEOS",
    title: "WALKAROUND\nVIDEOS",
    desc: "Professional vehicle walkaround videos that bring inventory to life online. Showcase features, condition, and personality — built to convert browsers into buyers.",
    features: [
      "Full exterior and interior walkaround",
      "Feature and technology highlights",
      "Sales rep or voiceover narration",
      "Branded intro and outro",
      "VDP-ready and social-ready formats",
      "Same-week turnaround",
      "Batch production for high-volume lots",
      "YouTube, Facebook, and website delivery",
    ],
    bestFor: "Dealerships that want to increase VDP engagement and give online shoppers a real feel for the vehicle.",
    image: HERO_GRID_IMAGES[4],
    video: HERO_VIDEOS.gxShowroom,
  },
];

// Map URL slugs to section IDs
const SLUG_TO_ID: Record<string, string> = {
  dealerships: "dealerships",
  "dealer-groups": "dealer-groups",
  headshots: "headshots",
  "crm-video": "crm-video",
  "inventory-photography": "inventory-photography",
  "short-form-reels": "short-form-reels",
  "walkaround-videos": "walkaround-videos",
};

export default function DealerServicesPage() {
  const [location, navigate] = useLocation();

  // Extract the slug from the URL path (e.g. /services/dealer-services/headshots → headshots)
  const slug = location.replace(/^\/services\/dealer-services\/?/, "").split("?")[0].split("#")[0].trim();
  const targetId = slug ? SLUG_TO_ID[slug] ?? null : null;

  // Scroll to the target section after mount
  useEffect(() => {
    if (!targetId) return;
    const tryScroll = (attempts = 0) => {
      const el = document.getElementById(targetId);
      if (el) {
        // Offset for fixed navbar (~80px)
        const y = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else if (attempts < 10) {
        setTimeout(() => tryScroll(attempts + 1), 150);
      }
    };
    // Small delay to let the page render first
    setTimeout(() => tryScroll(), 100);
  }, [targetId]);

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="section-dark pt-32 pb-16 sm:pb-24">
        <div className="container">
          <AnimFade>
            <p className="section-label text-white/40 mb-6">
              <span>✦</span><span>DEALER SERVICES —</span>
            </p>
          </AnimFade>
          <AnimFade delay={0.1}>
            <h1 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.88] text-white mb-6">
              DEALER<br />
              <span className="text-outline-white">SERVICES</span>
            </h1>
          </AnimFade>
          <AnimFade delay={0.2}>
            <p className="font-body text-white/50 text-base sm:text-lg max-w-xl leading-relaxed mb-8">
              Content operations built specifically for automotive dealerships and dealer groups.
              Inventory photography, walkaround videos, short-form reels, headshots, CRM video, and more.
            </p>
          </AnimFade>

          {/* Quick nav */}
          <AnimFade delay={0.3}>
            <div className="flex flex-wrap gap-2">
              {DEALER_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(s.id);
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 90;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                  className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/8 font-body text-xs tracking-widest text-white/40 hover:border-white/20 hover:text-white/60 transition-all"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </AnimFade>
        </div>
      </section>

      {/* Dealer service sections — exact same rendering as SolutionsPage */}
      {DEALER_SECTIONS.map((sol, idx) => {
        const Icon = sol.icon;
        const isEven = idx % 2 === 0;
        return (
          <section
            key={sol.id}
            id={sol.id}
            className={isEven ? "section-light text-[oklch(0.07_0_0)]" : "section-dark"}
          >
            <div className="container py-16 sm:py-24 lg:py-32">
              <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-start`}>
                {/* Content side */}
                <div className={isEven ? "order-1" : "order-1 lg:order-2"}>
                  <AnimFade>
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isEven ? "bg-[oklch(0.07_0_0)]/8" : "bg-white/8"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${isEven ? "text-[oklch(0.07_0_0)]" : "text-white"}`}
                        />
                      </div>
                      <span
                        className={`font-body text-xs tracking-widest ${
                          isEven ? "text-[oklch(0.07_0_0)]/40" : "text-white/40"
                        }`}
                      >
                        {sol.label}
                      </span>
                    </div>
                  </AnimFade>

                  <AnimFade delay={0.1}>
                    <h2
                      className={`font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.88] mb-6 whitespace-pre-line ${
                        isEven ? "text-[oklch(0.07_0_0)]" : "text-white"
                      }`}
                    >
                      {sol.title}
                    </h2>
                  </AnimFade>

                  <AnimFade delay={0.15}>
                    <p
                      className={`font-body text-sm leading-relaxed mb-8 max-w-lg ${
                        isEven ? "text-[oklch(0.07_0_0)]/60" : "text-white/50"
                      }`}
                    >
                      {sol.desc}
                    </p>
                  </AnimFade>

                  <AnimFade delay={0.2}>
                    <ul className="space-y-2 mb-8">
                      {sol.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <CheckCircle
                            className={`w-4 h-4 mt-0.5 shrink-0 ${
                              isEven ? "text-[oklch(0.07_0_0)]/40" : "text-white/40"
                            }`}
                          />
                          <span
                            className={`font-body text-sm ${
                              isEven ? "text-[oklch(0.07_0_0)]/70" : "text-white/60"
                            }`}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </AnimFade>

                  <AnimFade delay={0.25}>
                    <div
                      className={`text-xs font-body tracking-widest mb-8 ${
                        isEven ? "text-[oklch(0.07_0_0)]/40" : "text-white/30"
                      }`}
                    >
                      BEST FOR: {sol.bestFor}
                    </div>
                  </AnimFade>

                  <AnimFade delay={0.3}>
                    <button
                      onClick={() => navigate("/contact")}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-body text-xs tracking-widest transition-all ${
                        isEven
                          ? "bg-[oklch(0.07_0_0)] text-white hover:bg-[oklch(0.15_0_0)]"
                          : "bg-white text-[oklch(0.07_0_0)] hover:bg-white/90"
                      }`}
                    >
                      GET A PROPOSAL <ArrowRight className="w-3 h-3" />
                    </button>
                  </AnimFade>
                </div>

                {/* Visual side */}
                <div className={isEven ? "order-2" : "order-2 lg:order-1"}>
                  <AnimFade delay={0.1}>
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black">
                      {sol.video ? (
                        <video
                          src={sol.video}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover opacity-80"
                          poster={sol.image}
                        />
                      ) : (
                        <img
                          src={sol.image}
                          alt={sol.label}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  </AnimFade>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Bottom CTA */}
      <section className="section-black">
        <div className="container py-16 sm:py-24 text-center">
          <AnimFade>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.88] text-white mb-6">
              READY TO<br />
              <span className="text-outline-white">GET STARTED?</span>
            </h2>
          </AnimFade>
          <AnimFade delay={0.1}>
            <p className="font-body text-white/50 text-sm max-w-md mx-auto mb-8">
              Book a 30-minute discovery call. We'll learn about your dealership and recommend the right content package.
            </p>
          </AnimFade>
          <AnimFade delay={0.2}>
            <button onClick={() => navigate("/contact")} className="btn-pill-light text-xs">
              BOOK A DISCOVERY CALL +
            </button>
          </AnimFade>
        </div>
      </section>
    </div>
  );
}
