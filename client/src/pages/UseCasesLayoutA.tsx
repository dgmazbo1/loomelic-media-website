/* ============================================================
   USE CASES — LAYOUT A: "Featured Work" Card Style
   Same visual language as ProjectsSection:
   - Large image cards with title/category header
   - Hover scale effect + arrow button
   - Result overlay on hover
   - Expanded detail below on click (accordion)
   ============================================================ */
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, TrendingUp, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { CENTENNIAL_SUBARU, LEXUS_HENDERSON } from "@/lib/media";

/* ─── DATA ──────────────────────────────────────────────────── */
const USE_CASES = [
  {
    id: "centennial-subaru",
    client: "CENTENNIAL SUBARU",
    category: "USED CAR CAMPAIGN · SOCIAL MEDIA ADS",
    image: CENTENNIAL_SUBARU.hero,
    result: "Customers came in after seeing the ads. Used car sales momentum improved since launch.",
    resultStat: "Increased showroom traffic",
    accent: "oklch(1 0 0)",
    overview: "Centennial Subaru needed a stronger way to spotlight used inventory and create more weekend traffic. Loomelic Media developed a Weekend Special campaign built around a trio of used cars — giving shoppers more options, creating urgency, and making the dealership's used inventory feel active and worth visiting.",
    theChallenge: "Used inventory can move fast, but getting the right eyes on the right vehicles at the right time requires more than a standard listing post. Centennial Subaru needed a campaign that made used inventory feel timely, visible, and worth acting on before the weekend ended.",
    theStrategy: "We created a used car weekend special concept highlighting three featured used vehicles in one campaign. This gave the dealership more content value in a single post, increased shopper interest by showing options instead of one unit, and created a stronger promotional angle for weekend traffic.",
    theExecution: "We created content grouping three featured used vehicles into one clear promotional message — making the ad feel more substantial than a standard single-car post. We then boosted the posts to increase local visibility and put the campaign in front of more in-market shoppers in Las Vegas.",
    theResult: "Centennial Subaru has seen people come into the dealership after seeing the ads, and the campaign has supported stronger used car sales momentum since launch.",
    whyItWorked: "The campaign worked because it combined strong visual presentation, clear timing, local paid reach, and a format that gave buyers multiple vehicle options in one ad.",
    tags: ["Used Car Advertising", "Social Media Ads", "Weekend Campaign", "Las Vegas Dealership"],
  },
  {
    id: "findlay-nissan-henderson",
    client: "FINDLAY NISSAN HENDERSON",
    category: "INTERNET SALES · CRM VIDEO STRATEGY",
    image: LEXUS_HENDERSON.hero,
    result: "A major change in customers' first response. Early engagement improved significantly.",
    resultStat: "Warmer lead engagement",
    accent: "oklch(1 0 0)",
    overview: "Findlay Nissan Henderson wanted to improve the way customers experienced the dealership after submitting an online inquiry. Loomelic Media created custom intro videos for the internet sales team to send out as part of the first response process.",
    theChallenge: "Online leads move fast, and first response quality can heavily influence whether a customer replies, engages, or disappears. Standard text and email responses often feel generic.",
    theStrategy: "Loomelic Media developed intro videos for the internet sales team that could be sent out when a customer inquiry came in — humanizing the dealership's response process and building trust earlier.",
    theExecution: "We created dealership-branded intro videos tailored for the internet sales workflow so the team could use them as part of their response process, giving customers an immediate visual introduction to the team.",
    theResult: "Findlay Nissan Henderson has seen a major change in customers' first response after implementing the intro videos. Early engagement has improved and the initial interaction now feels warmer, clearer, and more effective.",
    whyItWorked: "Video built trust faster than a standard written response alone. By helping customers see and hear from the dealership team early in the process, the quality of the first interaction improved dramatically.",
    tags: ["CRM Video", "Internet Sales", "Lead Response", "Dealership Video Marketing"],
  },
];

/* ─── ANIMATION ─────────────────────────────────────────────── */
function AnimFade({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── CARD ──────────────────────────────────────────────────── */
function UseCaseCard({ uc, index, onExpand, expanded }: {
  uc: typeof USE_CASES[0]; index: number; onExpand: () => void; expanded: boolean;
}) {
  return (
    <AnimFade delay={0.1 + index * 0.1}>
      <div
        onClick={onExpand}
        className="project-card group cursor-pointer"
        aria-label={`Read use case: ${uc.client}`}
      >
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="min-w-0 flex-1 mr-3">
            <p className="font-body text-[0.6rem] text-white/35 tracking-[0.15em] mb-0.5 truncate">{uc.category}</p>
            <h3 className="font-display-normal text-sm sm:text-base text-white leading-tight truncate">{uc.client}</h3>
          </div>
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${expanded ? "bg-white border-white text-black" : "border-white/20 text-white/50 group-hover:bg-white group-hover:text-black group-hover:border-white"}`}>
            <ChevronDown size={14} className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
          </div>
        </div>

        {/* Image */}
        <div className="overflow-hidden mx-3 mb-3 rounded-xl aspect-[16/10] bg-[oklch(0.15_0_0)] relative">
          <img
            src={uc.image}
            alt={uc.client}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            loading="lazy"
          />
          {/* Result overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} style={{ color: uc.accent }} />
              <p className="font-body text-xs text-white/90 leading-snug">{uc.resultStat}</p>
            </div>
          </div>
          {/* Accent bar at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: uc.accent }} />
        </div>
      </div>

      {/* Expanded detail — accordion */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mx-0 mt-2 mb-4 rounded-2xl bg-white/[0.03] border border-white/8 p-6 sm:p-8">
              {/* Result callout */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/6 mb-6">
                <TrendingUp size={16} style={{ color: uc.accent }} className="shrink-0 mt-0.5" />
                <p className="font-body text-sm text-white/80 leading-relaxed">{uc.result}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Overview", content: uc.overview },
                  { label: "The Challenge", content: uc.theChallenge },
                  { label: "The Strategy", content: uc.theStrategy },
                  { label: "The Execution", content: uc.theExecution },
                  { label: "The Result", content: uc.theResult },
                  { label: "Why It Worked", content: uc.whyItWorked },
                ].map((sub) => (
                  <div key={sub.label} className="rounded-xl bg-white/[0.02] border border-white/6 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-4 rounded-full" style={{ background: uc.accent }} />
                      <p className="font-body text-[0.6rem] tracking-[0.18em] text-white/40 uppercase">{sub.label}</p>
                    </div>
                    <p className="font-body text-sm text-white/60 leading-[1.75]">{sub.content}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {uc.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/8 font-body text-[0.52rem] tracking-widest text-white/30 uppercase">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimFade>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────── */
export default function UseCasesLayoutA() {
  const [, navigate] = useLocation();
  const [expanded, setExpanded] = useState<string | null>(null);

  const displayHeading = {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 800,
    letterSpacing: "0.02em",
    textTransform: "uppercase" as const,
    lineHeight: 0.88,
  };

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] overflow-x-hidden">
      <Navbar />

      {/* ── LAYOUT LABEL (preview only) ── */}
      <div className="fixed top-20 right-4 z-50 px-3 py-1.5 rounded-full bg-white text-black font-body text-[0.6rem] tracking-widest uppercase font-bold">
        Layout A — Card Style
      </div>

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden section-dark pt-32">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)", backgroundSize: "80px 80px" }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.07_0_0)]/40 to-[oklch(0.07_0_0)]" aria-hidden="true" />
        <div className="relative z-10 container pb-16 sm:pb-24 lg:pb-32">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="section-label text-white/40 mb-5">
            <span>✦</span><span>USE CASES —</span>
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08 }} className="font-display text-[clamp(1.5rem,9vw,8.5rem)] text-white mb-6" style={displayHeading}>
            USE CASES<br /><span className="text-outline-white">BUILT TO</span><br />PERFORM
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="font-body text-base sm:text-lg text-white/50 leading-relaxed max-w-2xl mb-10">
            Real-world examples of how Loomelic Media helps dealerships improve response rates, move inventory, and create campaigns that generate showroom traffic.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-3">
            <button onClick={() => navigate("/contact")} className="btn-pill-light text-xs">BOOK A CALL +</button>
            <button onClick={() => navigate("/projects")} className="btn-pill-outline text-xs">VIEW PROJECTS <ArrowRight size={12} className="inline ml-1" /></button>
          </motion.div>
        </div>
      </section>

      {/* ── CASES GRID ── */}
      <section className="section-black">
        <div className="container py-16 sm:py-24 lg:py-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
            <AnimFade>
              <div>
                <p className="section-label text-white/40 mb-4"><span>✦</span><span>OUR WORK —</span></p>
                <h2 className="font-display text-[clamp(2.2rem,7vw,6rem)] leading-[0.88] text-white" style={displayHeading}>
                  REAL<br /><span className="text-[oklch(0.4_0_0)]">RESULTS</span>
                </h2>
              </div>
            </AnimFade>
            <AnimFade delay={0.1}>
              <span className="font-display text-[clamp(1.4rem,4vw,4rem)] text-[oklch(0.28_0_0)] leading-none hidden sm:block self-end pb-2">©2026</span>
            </AnimFade>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {USE_CASES.map((uc, i) => (
              <UseCaseCard
                key={uc.id}
                uc={uc}
                index={i}
                expanded={expanded === uc.id}
                onExpand={() => setExpanded(expanded === uc.id ? null : uc.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-dark border-t border-white/6">
        <div className="container py-16 sm:py-24 lg:py-32">
          <AnimFade><p className="section-label text-white/40 mb-4"><span>✦</span><span>READY TO GROW? —</span></p></AnimFade>
          <AnimFade delay={0.1}>
            <h2 className="font-display text-[clamp(1.5rem,7vw,6.5rem)] text-white mb-6" style={displayHeading}>
              READY TO BUILD<br />A CONTENT SYSTEM<br /><span className="text-outline-white">THAT DRIVES RESULTS?</span>
            </h2>
          </AnimFade>
          <AnimFade delay={0.2}>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate("/contact")} className="btn-pill-light text-xs">GET IN TOUCH +</button>
              <button onClick={() => navigate("/contact")} className="btn-pill-outline text-xs">BOOK A CALL <ArrowRight size={12} className="inline ml-1" /></button>
            </div>
          </AnimFade>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
