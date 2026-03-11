/* ============================================================
   CaseStudiesPreview — Featured portfolio on homepage
   Dark section, 3 featured project cards with hero images
   Preserves: section-black, Barlow Condensed display, pill CTAs
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import {
  LEXUS_HENDERSON,
  RAIDERS_BLAST,
  SPORTS_ILLUSTRATED,
} from "@/lib/media";

const CASE_STUDIES = [
  {
    slug: "lexus-of-henderson",
    client: "LEXUS OF HENDERSON",
    category: "AUTOMOTIVE · MONTHLY RETAINER",
    title: "Full-Service Dealer Content System",
    desc: "Inventory photography, walkaround videos, event coverage, and social content — delivered monthly under a structured retainer.",
    image: LEXUS_HENDERSON.hero,
    stats: [
      { label: "Content Types", value: "6+" },
      { label: "Monthly Deliverables", value: "50+" },
      { label: "Engagement Lift", value: "3×" },
    ],
  },
  {
    slug: "las-vegas-raiders-the-blast",
    client: "LAS VEGAS RAIDERS",
    category: "EVENT COVERAGE · THE BLAST",
    title: "Multi-Day Event Documentation",
    desc: "Full photo and video coverage of The Blast — the Raiders' premier fan experience event at Allegiant Stadium.",
    image: RAIDERS_BLAST.hero,
    stats: [
      { label: "Days Covered", value: "3" },
      { label: "Photos Delivered", value: "500+" },
      { label: "Turnaround", value: "48hr" },
    ],
  },
  {
    slug: "sports-illustrated-spoty-2026",
    client: "SPORTS ILLUSTRATED",
    category: "NATIONAL EVENT · SPOTY 2026",
    title: "Sportsperson of the Year Coverage",
    desc: "On-site photography for Sports Illustrated's Sportsperson of the Year 2026 ceremony — editorial-grade event documentation.",
    image: SPORTS_ILLUSTRATED.hero,
    stats: [
      { label: "Attendees", value: "1,000+" },
      { label: "Selects Delivered", value: "200+" },
      { label: "Same-Day", value: "Yes" },
    ],
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

export default function CaseStudiesPreview() {
  const [, navigate] = useLocation();

  return (
    <section className="section-black">
      <div className="container py-16 sm:py-24 lg:py-32">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <AnimFade>
              <p className="section-label text-white/40 mb-4">
                <span>✦</span><span>PORTFOLIO —</span>
              </p>
            </AnimFade>
            <AnimFade delay={0.1}>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.88] text-white">
                FEATURED<br />
                <span className="text-outline-white">WORK</span>
              </h2>
            </AnimFade>
          </div>
          <AnimFade delay={0.2}>
            <button
              onClick={() => navigate("/case-studies")}
              className="btn-pill-light text-xs self-start sm:self-end mb-2"
            >
              ALL PORTFOLIO +
            </button>
          </AnimFade>
        </div>

        {/* Case study cards */}
        <div className="space-y-6">
          {CASE_STUDIES.map((cs, i) => (
            <AnimFade key={cs.slug} delay={0.1 + i * 0.1}>
              <button
                onClick={() => navigate(`/projects/${cs.slug}`)}
                className="group relative w-full text-left rounded-2xl overflow-hidden bg-white/[0.03] border border-white/8 hover:border-white/15 transition-all duration-300"
              >
                <div className="grid md:grid-cols-[1.2fr_1fr] gap-0">
                  {/* Image */}
                  <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[320px] overflow-hidden">
                    <img
                      src={cs.image}
                      alt={cs.client}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[oklch(0.04_0_0)]/80 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.04_0_0)] to-transparent md:hidden" />
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 flex flex-col justify-center">
                    {/* Category badge */}
                    <span className="inline-flex self-start items-center px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 font-body text-[0.55rem] tracking-widest text-white/40 uppercase mb-4">
                      {cs.category}
                    </span>

                    {/* Client name */}
                    <p className="font-display-normal text-xs tracking-[0.2em] text-white/30 mb-2">
                      {cs.client}
                    </p>

                    {/* Title */}
                    <h3 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-[0.92] text-white mb-3">
                      {cs.title.toUpperCase()}
                    </h3>

                    {/* Description */}
                    <p className="font-body text-sm text-white/50 leading-relaxed mb-6">
                      {cs.desc}
                    </p>

                    {/* Stats row */}
                    <div className="flex gap-6 mb-6">
                      {cs.stats.map((stat) => (
                        <div key={stat.label}>
                          <p className="font-display-normal text-xl text-white">{stat.value}</p>
                          <p className="font-body text-[0.6rem] text-white/30 tracking-widest uppercase">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 font-body text-xs text-white/50 group-hover:text-white transition-colors">
                      <span className="tracking-widest">VIEW PROJECT</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            </AnimFade>
          ))}
        </div>
      </div>
    </section>
  );
}
