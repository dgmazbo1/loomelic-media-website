/* ============================================================
   SolutionsPage — Enterprise solutions landing page
   Full page with hero + 4 solution detail sections
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { Building2, Users, Calendar, Briefcase, ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { HERO_VIDEOS, LEXUS_HENDERSON, RAIDERS_BLAST } from "@/lib/media";

function AnimFade({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

const SOLUTION_SECTIONS = [
  {
    id: "dealers",
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
    id: "events",
    icon: Calendar,
    label: "CORPORATE & PRIVATE",
    title: "EVENT\nCOVERAGE",
    desc: "Full-service photo and video coverage for corporate events, brand activations, concerts, and private gatherings. Multi-camera setups, same-day selects, and fast turnaround.",
    features: [
      "Multi-camera photo and video coverage",
      "Same-day selects and recap reels",
      "Highlight films and sizzle reels",
      "Speaker and panel documentation",
      "VIP and backstage coverage",
      "Social media content packages",
      "Post-event galleries and delivery",
      "On-site editing and live posting",
    ],
    bestFor: "Corporate events, conferences, brand activations, concerts, and private gatherings.",
    image: RAIDERS_BLAST.hero,
    video: HERO_VIDEOS.droneFiller,
  },
  {
    id: "brands",
    icon: Briefcase,
    label: "BRANDS & PROFESSIONALS",
    title: "BRAND\nCONTENT",
    desc: "Visual identity development, content strategy, website builds, and ongoing content production for brands that need to look premium and convert visitors into customers.",
    features: [
      "Brand photography and visual identity",
      "Website design, build, and optimization",
      "Content strategy and editorial calendar",
      "Social media content production",
      "Professional headshots and portraits",
      "Product and commercial photography",
      "Video production and editing",
      "SEO foundation and lead optimization",
    ],
    bestFor: "Businesses, personal brands, and professionals who need premium visual content.",
    image: RAIDERS_BLAST.hero,
    video: HERO_VIDEOS.websiteVideo,
  },
];

export default function SolutionsPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="section-dark pt-32 pb-16 sm:pb-24">
        <div className="container">
          <AnimFade>
            <p className="section-label text-white/40 mb-6">
              <span>✦</span><span>SOLUTIONS —</span>
            </p>
          </AnimFade>
          <AnimFade delay={0.1}>
            <h1 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.88] text-white mb-6">
              CONTENT<br />
              <span className="text-outline-white">SOLUTIONS</span>
            </h1>
          </AnimFade>
          <AnimFade delay={0.2}>
            <p className="font-body text-white/50 text-base sm:text-lg max-w-xl leading-relaxed mb-8">
              Structured content operations for dealerships, dealer groups,
              events, and brands. Choose the solution that fits your business.
            </p>
          </AnimFade>

          {/* Quick nav */}
          <AnimFade delay={0.3}>
            <div className="flex flex-wrap gap-2">
              {SOLUTION_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/8 font-body text-xs tracking-widest text-white/40 hover:border-white/20 hover:text-white/60 transition-all"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </AnimFade>
        </div>
      </section>

      {/* Solution sections */}
      {SOLUTION_SECTIONS.map((sol, idx) => {
        const Icon = sol.icon;
        const isEven = idx % 2 === 0;
        return (
          <section
            key={sol.id}
            id={sol.id}
            className={isEven ? "section-light text-[oklch(0.07_0_0)]" : "section-dark"}
          >
            <div className="container py-16 sm:py-24 lg:py-32">
              <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-start ${!isEven ? "" : ""}`}>
                {/* Content side */}
                <div className={isEven ? "order-1" : "order-1 lg:order-2"}>
                  <AnimFade>
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isEven ? "bg-[oklch(0.07_0_0)]/8" : "bg-white/8"
                        }`}
                      >
                        <Icon size={18} className={isEven ? "text-[oklch(0.07_0_0)]/60" : "text-white/60"} />
                      </div>
                      <span
                        className={`font-body text-[0.6rem] tracking-widest uppercase ${
                          isEven ? "text-[oklch(0.5_0_0)]" : "text-white/40"
                        }`}
                      >
                        {sol.label}
                      </span>
                    </div>
                  </AnimFade>

                  <AnimFade delay={0.1}>
                    <h2
                      className={`font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.88] mb-4 whitespace-pre-line ${
                        isEven ? "text-[oklch(0.07_0_0)]" : "text-white"
                      }`}
                    >
                      {sol.title}
                    </h2>
                  </AnimFade>

                  <AnimFade delay={0.15}>
                    <p
                      className={`font-body text-sm leading-relaxed mb-8 max-w-lg ${
                        isEven ? "text-[oklch(0.45_0_0)]" : "text-white/55"
                      }`}
                    >
                      {sol.desc}
                    </p>
                  </AnimFade>

                  <AnimFade delay={0.2}>
                    <ul className="space-y-2.5 mb-8">
                      {sol.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          <CheckCircle
                            size={14}
                            className={`shrink-0 mt-0.5 ${isEven ? "text-[oklch(0.07_0_0)]/30" : "text-lime/60"}`}
                          />
                          <span
                            className={`font-body text-sm ${
                              isEven ? "text-[oklch(0.35_0_0)]" : "text-white/45"
                            }`}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </AnimFade>

                  <AnimFade delay={0.25}>
                    <p
                      className={`font-body text-xs italic mb-6 ${
                        isEven ? "text-[oklch(0.55_0_0)]" : "text-white/30"
                      }`}
                    >
                      Best for: {sol.bestFor}
                    </p>
                  </AnimFade>

                  <AnimFade delay={0.3}>
                    <button
                      onClick={() => navigate("/contact")}
                      className={isEven ? "btn-pill-dark text-xs" : "btn-pill-light text-xs"}
                    >
                      GET A PROPOSAL →
                    </button>
                  </AnimFade>
                </div>

                {/* Media side */}
                <div className={isEven ? "order-2" : "order-2 lg:order-1"}>
                  <AnimFade delay={0.15}>
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        src={sol.video}
                        aria-hidden="true"
                      />
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
              NOT SURE WHICH<br />
              <span className="text-outline-white">SOLUTION?</span>
            </h2>
          </AnimFade>
          <AnimFade delay={0.1}>
            <p className="font-body text-white/50 text-sm max-w-md mx-auto mb-8">
              Book a 30-minute discovery call. We'll learn about your business and recommend the right content solution.
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
