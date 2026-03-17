/* ============================================================
   AboutSection — Dealer-acquisition rebuild
   Design: Light background, "TRUSTED BY" strip (brand names),
           dealer-focused copy, showreel embed
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";

const TRUSTED_BY = [
  "LEXUS OF LAS VEGAS",
  "LEXUS OF HENDERSON",
  "LAS VEGAS RAIDERS",
  "CENTENNIAL SUBARU",
  "SPORTS ILLUSTRATED",
  "FINDLAY NISSAN",
  "ASCENT AUTOMOTIVE GROUP",
  "LEXUS WESTERN AREA",
  "THE BLAST",
  "ABC HYUNDAI",
  "LITHIA GROUP",
];

const VIMEO_ID = "925584368";

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

export default function AboutSection() {
  const [, navigate] = useLocation();

  return (
    <section id="about" className="section-light text-[oklch(0.07_0_0)]">
      {/* Trusted By strip — auto-scrolling marquee */}
      <div className="border-b border-[oklch(0_0_0/0.07)] py-10 sm:py-14 overflow-hidden">
        <div className="container mb-6">
          <p className="section-label text-[oklch(0.07_0_0)/50]">
            <span>✦</span><span>TRUSTED BY:</span>
          </p>
        </div>
        <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-4 animate-marquee-scroll shrink-0">
            {[...TRUSTED_BY, ...TRUSTED_BY].map((name, i) => (
              <div
                key={i}
                className="card-light flex items-center justify-center px-8 py-5 min-w-[180px] shrink-0"
              >
                <span className="font-display-normal text-[0.65rem] sm:text-xs text-center text-[oklch(0.07_0_0)] leading-tight whitespace-nowrap">
                  {name}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 animate-marquee-scroll shrink-0" aria-hidden="true">
            {[...TRUSTED_BY, ...TRUSTED_BY].map((name, i) => (
              <div
                key={i}
                className="card-light flex items-center justify-center px-8 py-5 min-w-[180px] shrink-0"
              >
                <span className="font-display-normal text-[0.65rem] sm:text-xs text-center text-[oklch(0.07_0_0)] leading-tight whitespace-nowrap">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main about content */}
      <div className="container py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-start mb-12 sm:mb-16">
          {/* Left: label + huge text */}
          <div>
            <AnimFade className="mb-4 sm:mb-6">
              <div className="overflow-hidden">
                <div className="flex gap-6 animate-marquee">
                  {["DEALER CONTENT SYSTEMS —", "DEALER CONTENT SYSTEMS —", "DEALER CONTENT SYSTEMS —", "DEALER CONTENT SYSTEMS —"].map((t, i) => (
                    <span key={i} className="section-label text-[oklch(0.07_0_0)/40] shrink-0">
                      <span>✦</span><span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>
            </AnimFade>
            <AnimFade delay={0.1}>
              <h2 className="font-display text-[clamp(2.2rem,7vw,6rem)] leading-[0.88] text-[oklch(0.07_0_0)]">
                CONTENT BUILT<br />
                <span className="text-[oklch(0.78_0_0)]">FOR DEALERS</span>
              </h2>
            </AnimFade>
          </div>

          {/* Right: CTA buttons */}
          <AnimFade delay={0.2} className="flex flex-row lg:flex-col gap-3 pt-2 lg:pt-8">
            <button
              onClick={() => navigate("/projects")}
              className="btn-pill-dark text-xs"
            >
              OUR WORK +
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="btn-pill-outline !text-[oklch(0.07_0_0)] !border-[oklch(0_0_0/0.2)] hover:!bg-[oklch(0.07_0_0)] hover:!text-white text-xs"
            >
              BOOK A CALL ↗
            </button>
          </AnimFade>
        </div>

        {/* Body text */}
        <AnimFade delay={0.15} className="max-w-2xl mb-16 sm:mb-20">
          <p className="font-body text-base sm:text-lg text-[oklch(0.35_0_0)] leading-relaxed">
            Loomelic Media is a Las Vegas production company creating photo, video, and web content for automotive dealerships, events, brands, and professionals — serving Las Vegas and South Florida.
          </p>
          <p className="font-body text-sm text-[oklch(0.5_0_0)] mt-4 leading-relaxed">
            Led by <strong className="text-[oklch(0.07_0_0)]">Denham Gallimore</strong> — videographer, photographer, and creative director with a focus on dealership content that moves inventory and builds brand trust.
          </p>
        </AnimFade>

        {/* Vimeo showreel */}
        <AnimFade delay={0.2}>
          <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-xl" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={`https://player.vimeo.com/video/${VIMEO_ID}?autoplay=0&title=0&byline=0&portrait=0&color=9bff57`}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Loomelic Media Showreel"
            />
          </div>
          <p className="font-body text-xs text-[oklch(0.55_0_0)] mt-3 tracking-widest uppercase">
            ✦ Denham Gallimore · Loomelic Media
          </p>
        </AnimFade>
      </div>
    </section>
  );
}
