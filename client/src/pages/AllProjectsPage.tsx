/* ============================================================
   AllProjectsPage — /projects
   Dealer-acquisition rebuild: category filter tabs, project grid
   with portfolio cards, CTA
   ============================================================ */
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { PROJECTS } from "@/components/ProjectsSection";

type FilterCategory = "ALL" | "AUTOMOTIVE" | "EVENTS" | "PHOTOGRAPHY";

const FILTERS: FilterCategory[] = ["ALL", "AUTOMOTIVE", "EVENTS", "PHOTOGRAPHY"];

function getFilter(category: string): FilterCategory {
  const upper = category.toUpperCase();
  if (upper.includes("AUTOMOTIVE")) return "AUTOMOTIVE";
  if (upper.includes("EVENTS")) return "EVENTS";
  if (upper.includes("PHOTOGRAPHY") || upper.includes("EDITORIAL")) return "PHOTOGRAPHY";
  return "ALL";
}

export default function AllProjectsPage() {
  const [, navigate] = useLocation();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("ALL");

  const filtered = activeFilter === "ALL"
    ? PROJECTS
    : PROJECTS.filter((p) => getFilter(p.category) === activeFilter);

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />

      {/* Hero */}
      <section className="section-black pt-32 pb-16 sm:pb-20">
        <div className="container">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-10 font-body text-xs tracking-widest"
          >
            <ArrowLeft size={14} /> BACK TO HOME
          </motion.button>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-label text-white/40 mb-4"
          >
            <span>✦</span><span>PORTFOLIO —</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.88] text-white mb-6"
          >
            OUR<br />
            <span className="text-[oklch(0.4_0_0)]">WORK</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="font-body text-white/50 text-sm max-w-lg leading-relaxed"
          >
            Dealership campaigns, event coverage, and editorial photography — each project built to deliver measurable results.
          </motion.p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="section-black border-t border-white/8 pb-0">
        <div className="container py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-2"
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`font-body text-xs tracking-widest px-5 py-2 rounded-full border transition-all duration-200 ${
                  activeFilter === f
                    ? "bg-white text-[oklch(0.07_0_0)] border-white"
                    : "border-white/20 text-white/50 hover:border-white/50 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="section-black pb-24">
        <div className="container pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            >
              {filtered.map((project, i) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
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
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="font-body text-white/30 text-sm tracking-widest">No projects in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
