/* ============================================================
   ProofSection (was StatsSection) — Dealer-acquisition rebuild
   Design: Light background, credibility statements instead of
           placeholder metrics, video left + proof cards right
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { CheckCircle } from "lucide-react";
import { HERO_VIDEOS } from "@/lib/media";

const PROOF_POINTS = [
  {
    headline: "Monthly Retainer Dealership Clients",
    body: "We build ongoing content systems — not one-off shoots. Dealers on retainer get consistent inventory photography, social content, and event coverage every month.",
  },
  {
    headline: "Consistent Content Cadence Built for Dealer Timelines",
    body: "New inventory drops, sales events, and seasonal campaigns move fast. Our workflow is designed around dealership schedules — fast turnaround, no bottlenecks.",
  },
  {
    headline: "Systems for Inventory, Events, and People",
    body: "From lot photography to staff headshots to event coverage, we handle every content category a dealership needs — under one roof, with one consistent look.",
  },
  {
    headline: "Las Vegas-Based. Serving Nevada and Beyond.",
    body: "We're local, which means faster response times, on-site flexibility, and a team that understands the Las Vegas market.",
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

export default function StatsSection() {
  const [, navigate] = useLocation();

  return (
    <section className="section-light text-[oklch(0.07_0_0)]">
      <div className="container py-16 sm:py-24 lg:py-32">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <AnimFade>
            <p className="section-label text-[oklch(0.07_0_0)]/40 mb-4">
              <span>✦</span><span>WHY DEALERS CHOOSE US —</span>
            </p>
            <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.88] text-[oklch(0.07_0_0)]">
              BUILT FOR<br />
              <span className="text-[oklch(0.78_0_0)]">DEALERSHIPS</span>
            </h2>
          </AnimFade>
          <AnimFade delay={0.15}>
            <button
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="btn-pill-dark text-xs self-start sm:self-end mb-2"
            >
              BOOK A CALL +
            </button>
          </AnimFade>
        </div>

        {/* Content: video left + proof points right */}
        <div className="grid md:grid-cols-[1fr_1fr] gap-4 sm:gap-6">
          {/* Left: video */}
          <AnimFade delay={0.1} className="relative rounded-2xl overflow-hidden bg-[oklch(0.12_0_0)] aspect-[4/3] md:aspect-auto md:min-h-[420px]">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              src={HERO_VIDEOS.lexusRoll}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <span className="font-display-normal text-white text-sm tracking-widest">LOOMELIC ®</span>
            </div>
          </AnimFade>

          {/* Right: proof points */}
          <div className="flex flex-col gap-4">
            {PROOF_POINTS.map((pt, i) => (
              <AnimFade key={i} delay={0.12 + i * 0.07} className="card-light p-5 sm:p-6 flex gap-4 items-start">
                <CheckCircle size={18} className="text-[oklch(0.07_0_0)]/40 shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-sm font-semibold text-[oklch(0.07_0_0)] mb-1">{pt.headline}</p>
                  <p className="font-body text-xs text-[oklch(0.45_0_0)] leading-relaxed">{pt.body}</p>
                </div>
              </AnimFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
