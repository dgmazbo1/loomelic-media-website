/* ============================================================
   CaseStudies — Full case studies listing page
   Dark page, hero + filterable grid of all projects as case studies
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  LEXUS_HENDERSON,
  LEXUS_LAS_VEGAS,
  RAIDERS_BLAST,
  SPORTS_ILLUSTRATED,
  CENTENNIAL_SUBARU,
  JW_OFFROAD,
  JANEL_NEHIAMIA,
  BOB_MARLEY,
  WONDR_NATION,
} from "@/lib/media";

const CATEGORIES = ["ALL", "AUTOMOTIVE", "EVENTS", "BRAND", "NATIONAL"];

const ALL_STUDIES = [
  {
    slug: "lexus-of-henderson",
    client: "Lexus of Henderson",
    category: "AUTOMOTIVE",
    title: "Full-Service Dealer Content System",
    image: LEXUS_HENDERSON.hero,
    tags: ["Monthly Retainer", "Inventory", "Social"],
  },
  {
    slug: "lexus-of-las-vegas",
    client: "Lexus of Las Vegas",
    category: "AUTOMOTIVE",
    title: "Premium Dealership Visual Identity",
    image: LEXUS_LAS_VEGAS.hero,
    tags: ["Photography", "Video", "Drone"],
  },
  {
    slug: "centennial-subaru",
    client: "Centennial Subaru",
    category: "AUTOMOTIVE",
    title: "Dealership Launch Content Package",
    image: CENTENNIAL_SUBARU.hero,
    tags: ["Grand Opening", "Inventory", "Events"],
  },
  {
    slug: "jw-offroad",
    client: "JW Offroad",
    category: "AUTOMOTIVE",
    title: "Aftermarket Automotive Content",
    image: JW_OFFROAD.hero,
    tags: ["Product Photography", "Video", "Social"],
  },
  {
    slug: "las-vegas-raiders-the-blast",
    client: "Las Vegas Raiders",
    category: "EVENTS",
    title: "The Blast — Multi-Day Event Coverage",
    image: RAIDERS_BLAST.hero,
    tags: ["Event Coverage", "Photo", "Video"],
  },
  {
    slug: "sports-illustrated-spoty-2026",
    client: "Sports Illustrated",
    category: "NATIONAL",
    title: "Sportsperson of the Year 2026",
    image: SPORTS_ILLUSTRATED.hero,
    tags: ["National Event", "Editorial", "Photo"],
  },
  {
    slug: "wondr-nation-g2e-2025",
    client: "Wondr Nation",
    category: "EVENTS",
    title: "G2E 2025 Conference Coverage",
    image: WONDR_NATION.hero,
    tags: ["Conference", "Corporate", "Photo"],
  },
  {
    slug: "janel-and-nehiamia",
    client: "Janel & Nehiamia",
    category: "EVENTS",
    title: "Premium Wedding Documentation",
    image: JANEL_NEHIAMIA.hero,
    tags: ["Wedding", "Photo", "Video"],
  },
  {
    slug: "bob-marley-hope-road",
    client: "Bob Marley: Hope Road",
    category: "BRAND",
    title: "Brand Experience Documentation",
    image: BOB_MARLEY.hero,
    tags: ["Brand Activation", "Photo", "Editorial"],
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

export default function CaseStudies() {
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState("ALL");

  const filtered = filter === "ALL" ? ALL_STUDIES : ALL_STUDIES.filter((s) => s.category === filter);

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="section-dark pt-32 pb-16 sm:pb-24">
        <div className="container">
          <AnimFade>
            <p className="section-label text-white/40 mb-6">
              <span>✦</span><span>CASE STUDIES —</span>
            </p>
          </AnimFade>
          <AnimFade delay={0.1}>
            <h1 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.88] text-white mb-6">
              OUR<br />
              <span className="text-outline-white">WORK</span>
            </h1>
          </AnimFade>
          <AnimFade delay={0.2}>
            <p className="font-body text-white/50 text-base sm:text-lg max-w-xl leading-relaxed">
              Real projects. Real results. Explore how we've helped dealerships,
              brands, and organizations build premium content systems.
            </p>
          </AnimFade>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="section-dark border-t border-white/8">
        <div className="container py-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full font-body text-xs tracking-widest transition-all duration-200 ${
                  filter === cat
                    ? "bg-white text-[oklch(0.07_0_0)] font-bold"
                    : "bg-white/[0.04] text-white/40 border border-white/8 hover:border-white/20 hover:text-white/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-dark">
        <div className="container py-8 sm:py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((study, i) => (
              <AnimFade key={study.slug} delay={i * 0.05}>
                <button
                  onClick={() => navigate(`/projects/${study.slug}`)}
                  className="group relative w-full text-left rounded-2xl overflow-hidden bg-white/[0.03] border border-white/8 hover:border-white/15 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={study.image}
                      alt={study.client}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.07_0_0)] via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {study.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-white/[0.06] font-body text-[0.55rem] tracking-widest text-white/35 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="font-body text-[0.6rem] tracking-[0.15em] text-white/30 uppercase mb-1">
                      {study.client}
                    </p>
                    <h3 className="font-display-normal text-lg text-white mb-3 tracking-wide">
                      {study.title.toUpperCase()}
                    </h3>

                    <div className="flex items-center gap-2 font-body text-xs text-white/40 group-hover:text-white transition-colors">
                      <span className="tracking-widest">VIEW CASE STUDY</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              </AnimFade>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-black">
        <div className="container py-16 sm:py-24 text-center">
          <AnimFade>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.88] text-white mb-6">
              READY TO BE<br />
              <span className="text-outline-white">NEXT?</span>
            </h2>
          </AnimFade>
          <AnimFade delay={0.1}>
            <p className="font-body text-white/50 text-sm max-w-md mx-auto mb-8">
              Let's build a content system that elevates your brand and drives results.
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
