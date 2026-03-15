/* ============================================================
   ProjectsSection — Unusually-inspired
   Style: Dark background, "SELECTED WORK" huge text left + year right,
          2-column grid of rounded project cards (dark bg, title+category top, image fills card)
   Each card links to /projects/:slug
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import {
  LEXUS_HENDERSON,
  RAIDERS_BLAST,
  CENTENNIAL_SUBARU,
  LEXUS_LAS_VEGAS,
  WONDR_NATION,
  BOB_MARLEY,
  SPORTS_ILLUSTRATED,
} from "@/lib/media";

export const PROJECTS = [
  {
    slug: "lexus-of-henderson",
    title: "LEXUS OF HENDERSON",
    category: "AUTOMOTIVE • MARKETING",
    image: LEXUS_HENDERSON.hero,
  },
  {
    slug: "lexus-of-las-vegas",
    title: "LEXUS OF LAS VEGAS",
    category: "AUTOMOTIVE • PHOTOGRAPHY",
    image: LEXUS_LAS_VEGAS.hero,
  },
  {
    slug: "las-vegas-raiders-tour",
    title: "LAS VEGAS RAIDERS TOUR",
    category: "EVENTS • VIDEOGRAPHY",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029344895/RmajYjEDnrnlYrjq.jpg",
  },
  {
    slug: "centennial-subaru",
    title: "CENTENNIAL SUBARU",
    category: "AUTOMOTIVE • DEALER SERVICES",
    image: CENTENNIAL_SUBARU.hero,
  },
  {
    slug: "wondr-nation-g2e",
    title: "WONDR NATION G2E",
    category: "EVENTS • PHOTOGRAPHY",
    image: WONDR_NATION.hero,
  },
  {
    slug: "bob-marley-hope-road",
    title: "BOB MARLEY HOPE ROAD",
    category: "EVENTS • EDITORIAL PHOTOGRAPHY",
    image: BOB_MARLEY.hero,
  },
  {
    slug: "sports-illustrated-sportsperson-2026",
    title: "SPORTS ILLUSTRATED: SPORTSPERSON OF THE YEAR 2026",
    category: "EVENTS • PHOTOGRAPHY",
    image: SPORTS_ILLUSTRATED.hero,
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

export default function ProjectsSection() {
  const [, navigate] = useLocation();

  return (
    <section id="projects" className="section-black">
      <div className="container py-16 sm:py-24 lg:py-32">
        {/* Header */}
        <AnimFade>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
            <div>
              <p className="section-label text-white/40 mb-4">
                <span>✦</span><span>OUR PORTFOLIO —</span>
              </p>
              <h2 className="font-display text-[clamp(2.2rem,7vw,6rem)] leading-[0.88] text-white">
                SELECTED<br />
                <span className="text-[oklch(0.4_0_0)]">WORK</span>
              </h2>
            </div>
            <span className="font-display text-[clamp(1.4rem,4vw,4rem)] text-[oklch(0.28_0_0)] leading-none hidden sm:block self-end pb-2">
              ©2026
            </span>
          </div>
        </AnimFade>

        {/* Projects grid — 2 columns */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-10 sm:mb-14">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
              onClick={() => navigate(`/projects/${project.slug}`)}
              className="project-card group cursor-pointer"
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="min-w-0 flex-1 mr-3">
                  <p className="font-body text-[0.6rem] text-white/35 tracking-[0.15em] mb-0.5 truncate">{project.category}</p>
                  <h3 className="font-display-normal text-sm sm:text-base text-white leading-tight truncate">{project.title}</h3>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300 shrink-0">
                  <span className="text-xs">→</span>
                </div>
              </div>

              {/* Image */}
              <div className="overflow-hidden mx-3 mb-3 rounded-xl aspect-[16/10] bg-[oklch(0.15_0_0)]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <AnimFade>
          <div className="flex justify-start">
            <button onClick={() => navigate("/projects")} className="btn-pill-light text-xs">
              ALL PROJECTS +
            </button>
          </div>
        </AnimFade>
      </div>
    </section>
  );
}
