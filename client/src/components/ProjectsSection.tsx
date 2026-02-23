/* ============================================================
   LOOMELIC MEDIA — Projects Section
   Design: Dark Cinematic Luxury
   - Marquee + project cards with original site images
   ============================================================ */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  LEXUS_HENDERSON,
  RAIDERS_BLAST,
  JANEL_WEDDING,
  CENTENNIAL_SUBARU,
  LEXUS_LAS_VEGAS,
  WONDR_NATION,
} from "@/lib/media";

const projects = [
  {
    title: "Lexus of Henderson",
    category: "Dealer Services",
    description: "Monthly social media management, employee headshots, and cinematic automotive content for Lexus of Henderson.",
    image: LEXUS_HENDERSON.hero,
    tag: "LEXUS OF HENDERSON",
    size: "large",
    client: "Lexus of Henderson",
    timeline: "Monthly",
  },
  {
    title: "Las Vegas Raiders Tour — The Blast",
    category: "Editorial Photography",
    description: "Behind-the-scenes coverage of the Las Vegas Raiders stadium tour at Allegiant Stadium.",
    image: RAIDERS_BLAST.hero,
    tag: "THE BLAST",
    size: "medium",
    client: "The Blast",
    timeline: "1 Day",
  },
  {
    title: "Janel & Nehiamia Wedding",
    category: "Wedding Videography",
    description: "Cinematic wedding film capturing the emotion and beauty of Janel and Nehiamia's special day.",
    image: JANEL_WEDDING.hero,
    tag: "WEDDING FILM",
    size: "medium",
    client: "Private Client",
    timeline: "1 Day",
  },
  {
    title: "Centennial Subaru",
    category: "Dealer Services",
    description: "High-quality automotive photography and video content for Centennial Subaru dealership.",
    image: CENTENNIAL_SUBARU.hero,
    tag: "CENTENNIAL SUBARU",
    size: "medium",
    client: "Centennial Subaru",
    timeline: "Ongoing",
  },
  {
    title: "Lexus of Las Vegas",
    category: "Dealer Services",
    description: "Aerial drone photography and ground-level automotive content for Lexus of Las Vegas.",
    image: LEXUS_LAS_VEGAS.hero,
    tag: "LEXUS OF LAS VEGAS",
    size: "medium",
    client: "Lexus of Las Vegas",
    timeline: "Monthly",
  },
  {
    title: "Wondr Nation — G2E 2025",
    category: "Event Coverage",
    description: "Full event photography coverage for the Wondr Nation G2E 2025 conference in Las Vegas.",
    image: WONDR_NATION.hero,
    tag: "WONDR NATION",
    size: "large",
    client: "Wondr Nation",
    timeline: "3 Days",
  },
];

const marqueeWords = ["PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS", "PROJECTS"];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className={`project-card group cursor-pointer rounded-none overflow-hidden ${
        project.size === "large"
          ? "lg:col-span-2 aspect-[16/9] sm:aspect-[21/9]"
          : "aspect-[4/3] sm:aspect-[16/10]"
      }`}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.07_0.005_285/0.95)] via-[oklch(0.07_0.005_285/0.3)] to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
          <span className="section-label mb-2 block">{project.category}</span>
          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white tracking-[0.05em]">
            {project.title.toUpperCase()}
          </h3>
          <p className="font-body text-sm text-white/60 mt-2 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed">
            {project.description}
          </p>
          {/* Meta */}
          <div className="flex gap-6 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div>
              <span className="font-body text-[10px] text-white/40 tracking-widest uppercase block">Client</span>
              <span className="font-body text-xs text-white/70">{project.client}</span>
            </div>
            <div>
              <span className="font-body text-[10px] text-white/40 tracking-widest uppercase block">Timeline</span>
              <span className="font-body text-xs text-white/70">{project.timeline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="absolute top-4 right-4 w-10 h-10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:border-[oklch(0.92_0.28_142)] transition-all duration-300">
        <ArrowUpRight size={16} className="text-[oklch(0.92_0.28_142)]" />
      </div>

      {/* Tag */}
      <div className="absolute top-4 left-4">
        <span className="font-body text-[10px] tracking-[0.2em] text-white/60 bg-[oklch(0.07_0.005_285/0.7)] px-3 py-1 border border-white/10">
          {project.tag}
        </span>
      </div>

      {/* Bottom neon line */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[oklch(0.92_0.28_142)] group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
}

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="relative bg-[oklch(0.05_0.005_285)] overflow-hidden">
      {/* Marquee */}
      <div className="overflow-hidden border-y border-white/5 py-4 sm:py-5 bg-[oklch(0.07_0.005_285)]">
        <div className="flex whitespace-nowrap animate-marquee">
          {marqueeWords.concat(marqueeWords).map((word, i) => (
            <span key={i} className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-[0.15em] px-8 sm:px-12">
              {i % 2 === 0 ? (
                <span className="text-stroke">{word}</span>
              ) : (
                <span className="text-white">{word}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Projects grid */}
      <div className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="section-label">Featured Work</span>
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white mt-3 leading-none">
                RECENT<br />
                <span className="text-stroke">PROJECTS</span>
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <button
                onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-outline text-sm"
              >
                SEE ALL WORK
              </button>
            </motion.div>
          </div>

          {/* Grid */}
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
