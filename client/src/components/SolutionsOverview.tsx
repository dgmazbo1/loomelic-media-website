/* ============================================================
   SolutionsOverview — Enterprise client segmentation
   Dark section with 4 solution cards targeting different client types
   Preserves: section-dark, Barlow Condensed display, pill CTAs, lime accent
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { Building2, Users, Calendar, Briefcase, ArrowRight } from "lucide-react";

const SOLUTIONS = [
  {
    icon: Building2,
    label: "SINGLE-POINT DEALERS",
    title: "DEALER\nCONTENT",
    desc: "Inventory photography, walkaround videos, social reels, and event coverage — delivered on a monthly retainer with consistent turnaround.",
    features: ["Lot photography", "Walkaround + delivery videos", "Social media reels", "Staff headshots"],
    href: "/solutions/dealers",
    accent: "oklch(1 0 0)", // white
  },
  {
    icon: Users,
    label: "MULTI-ROOFTOP GROUPS",
    title: "DEALER\nGROUP",
    desc: "Scaled content operations across multiple rooftops — centralized creative direction with location-specific execution.",
    features: ["Multi-location coordination", "Brand consistency system", "Centralized asset library", "Group-level reporting"],
    href: "/solutions/dealer-groups",
    accent: "oklch(0.75 0.15 250)", // blue
  },
  {
    icon: Calendar,
    label: "CORPORATE & PRIVATE",
    title: "EVENT\nCOVERAGE",
    desc: "Full-service photo and video coverage for corporate events, brand activations, concerts, and private gatherings.",
    features: ["Multi-camera coverage", "Same-day selects", "Highlight films", "Recap reels"],
    href: "/solutions/events",
    accent: "oklch(0.75 0.15 330)", // purple
  },
  {
    icon: Briefcase,
    label: "BRANDS & PROFESSIONALS",
    title: "BRAND\nCONTENT",
    desc: "Visual identity, content strategy, website builds, and ongoing content production for brands that need to look premium.",
    features: ["Brand photography", "Website design + build", "Content strategy", "Social media management"],
    href: "/solutions/brands",
    accent: "oklch(0.85 0.18 80)", // amber
  },
];

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

export default function SolutionsOverview() {
  const [, navigate] = useLocation();

  return (
    <section className="section-dark">
      <div className="container py-16 sm:py-24 lg:py-32">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <AnimFade>
              <p className="section-label text-white/40 mb-4">
                <span>✦</span><span>SOLUTIONS —</span>
              </p>
            </AnimFade>
            <AnimFade delay={0.1}>
              <h2 className="font-display text-[clamp(2.2rem,7vw,6rem)] leading-[0.88] text-white">
                WHO WE<br />
                <span className="text-outline-white">SERVE</span>
              </h2>
            </AnimFade>
          </div>
          <AnimFade delay={0.2}>
            <button
              onClick={() => navigate("/solutions")}
              className="btn-pill-light text-xs self-start sm:self-end mb-2"
            >
              ALL SOLUTIONS +
            </button>
          </AnimFade>
        </div>

        {/* Solution cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {SOLUTIONS.map((sol, i) => {
            const Icon = sol.icon;
            return (
              <AnimFade key={sol.label} delay={0.1 + i * 0.08}>
                <button
                  onClick={() => navigate(sol.href)}
                  className="group relative w-full text-left bg-white/[0.03] border border-white/8 rounded-2xl p-6 sm:p-7 hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Glow */}
                  <div
                    className="absolute top-0 left-0 w-48 h-48 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundColor: `${sol.accent} / 0.08` }}
                  />

                  <div className="relative">
                    {/* Icon + label */}
                    <div className="flex items-center justify-between mb-5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.6rem] font-bold tracking-widest uppercase border"
                        style={{
                          borderColor: `${sol.accent} / 0.25`,
                          backgroundColor: `${sol.accent} / 0.08`,
                          color: sol.accent,
                        }}
                      >
                        {sol.label}
                      </span>
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                        style={{ backgroundColor: `${sol.accent} / 0.1` }}
                      >
                        <Icon size={16} style={{ color: sol.accent }} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[0.92] text-white mb-3 whitespace-pre-line">
                      {sol.title}
                    </h3>

                    {/* Description */}
                    <p className="font-body text-sm text-white/55 leading-relaxed mb-5">
                      {sol.desc}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-5 flex-1">
                      {sol.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 font-body text-xs text-white/40">
                          <span className="text-white/50 mt-0.5 shrink-0">—</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="flex items-center gap-2 font-body text-xs text-white/50 group-hover:text-white transition-colors">
                      <span className="tracking-widest">LEARN MORE</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              </AnimFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
