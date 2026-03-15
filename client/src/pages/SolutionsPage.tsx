/* ============================================================
   SolutionsPage — Enterprise solutions landing page
   Handles all /solutions/* sub-routes:
     /solutions                 → full overview
     /solutions/dealerships     → scroll to dealers section
     /solutions/dealer-groups   → scroll to dealer-groups section
     /solutions/enterprise      → scroll to enterprise section
     /solutions/events          → scroll to events section
     /solutions/headshots       → scroll to headshots section
     /solutions/websites        → scroll to websites section
     /solutions/crm-video       → scroll to crm-video section
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Calendar, Monitor,
  ArrowRight, CheckCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { HERO_VIDEOS, LEXUS_HENDERSON, RAIDERS_BLAST, HERO_GRID_IMAGES } from "@/lib/media";

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

const SOLUTION_SECTIONS = [
  {
    id: "events",
    icon: Calendar,
    label: "EVENTS & ACTIVATIONS",
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
    id: "websites",
    icon: Monitor,
    label: "WEBSITE DESIGN",
    title: "PREMIUM WEB\nEXPERIENCES",
    desc: "Custom website design and development for dealerships, dealer groups, and automotive brands. Built for performance, lead conversion, and premium visual presentation.",
    features: [
      "Custom design tailored to your brand",
      "Mobile-first responsive layouts",
      "Inventory integration and VDP pages",
      "Lead capture and CTA optimization",
      "SEO foundation and performance tuning",
      "Google Analytics and tracking setup",
      "Ongoing maintenance and updates",
      "Fast turnaround — live in weeks, not months",
    ],
    bestFor: "Dealerships and brands that need a premium web presence that converts.",
    image: HERO_GRID_IMAGES[2],
    video: HERO_VIDEOS.websiteVideo,
  },
];

// Map URL slugs to section IDs
const SLUG_TO_ID: Record<string, string> = {
  events: "events",
  websites: "websites",
};

export default function SolutionsPage() {
  const [location, navigate] = useLocation();

  // Extract the slug from the URL path (e.g. /solutions/headshots → headshots)
  const slug = location.replace(/^\/solutions\/?/, "").split("?")[0].split("#")[0].trim();
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
              <span>✦</span><span>SOLUTIONS —</span>
            </p>
          </AnimFade>
          <AnimFade delay={0.1}>
            <h1 className="font-display text-[clamp(2.2rem,7vw,6rem)] leading-[0.88] text-white mb-6">
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
                      className={`font-display text-[clamp(1.6rem,3.5vw,3.3rem)] leading-[0.88] mb-6 whitespace-pre-line ${
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
            <h2 className="font-display text-[clamp(1.6rem,4vw,3.3rem)] leading-[0.88] text-white mb-6">
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
