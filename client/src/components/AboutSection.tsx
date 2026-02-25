/* ============================================================
   AboutSection — Unusually-inspired
   Style: Light (off-white) background, huge bold statement text,
          CTA buttons, body text, client logos grid (white rounded cards), Vimeo embed
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CLIENT_LOGOS_TEXT = [
  "LEXUS OF LAS VEGAS",
  "LEXUS OF HENDERSON",
  "LAS VEGAS RAIDERS",
  "CENTENNIAL SUBARU",
  "M&MM UNITED",
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
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section id="about" className="section-light text-[oklch(0.07_0_0)]">
      {/* Partners strip */}
      <div className="border-b border-[oklch(0_0_0/0.07)] py-10 sm:py-14">
        <div className="container">
          <AnimFade>
            <p className="section-label text-[oklch(0.07_0_0)/50] mb-8">
              <span>✦</span><span>GLOBAL PARTNERS:</span>
            </p>
          </AnimFade>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {CLIENT_LOGOS_TEXT.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card-light flex items-center justify-center p-5 sm:p-6 min-h-[80px]"
              >
                <span className="font-display-normal text-[0.65rem] sm:text-xs text-center text-[oklch(0.07_0_0)] leading-tight">
                  {name}
                </span>
              </motion.div>
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
                  {["DRIVEN BY DESIGN —", "DRIVEN BY DESIGN —", "DRIVEN BY DESIGN —", "DRIVEN BY DESIGN —"].map((t, i) => (
                    <span key={i} className="section-label text-[oklch(0.07_0_0)/40] shrink-0">
                      <span>✦</span><span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>
            </AnimFade>
            <AnimFade delay={0.1}>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.88] text-[oklch(0.07_0_0)]">
                WE CREATE<br />
                <span className="text-[oklch(0.78_0_0)]">CINEMATIC</span><br />
                EXPERIENCES
              </h2>
            </AnimFade>
          </div>

          {/* Right: CTA buttons */}
          <AnimFade delay={0.2} className="flex flex-row lg:flex-col gap-3 pt-2 lg:pt-8">
            <button onClick={() => scrollTo("projects")} className="btn-pill-dark text-xs">
              OUR STORY +
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="btn-pill-outline !text-[oklch(0.07_0_0)] !border-[oklch(0_0_0/0.2)] hover:!bg-[oklch(0.07_0_0)] hover:!text-white text-xs"
            >
              CONTACT US ↗
            </button>
          </AnimFade>
        </div>

        {/* Body text */}
        <AnimFade delay={0.15} className="max-w-2xl mb-16 sm:mb-20">
          <p className="font-body text-base sm:text-lg text-[oklch(0.35_0_0)] leading-relaxed">
            By combining cinematic storytelling, precision photography, and strategic digital content,
            we transform brands into visual experiences that captivate audiences. Based in Las Vegas,
            serving automotive dealerships, luxury brands, corporate events, and brand activations across the Southwest.
          </p>
          <p className="font-body text-sm text-[oklch(0.5_0_0)] mt-4 leading-relaxed">
            Led by <strong className="text-[oklch(0.07_0_0)]">Denham Gallimore</strong> — videographer,
            photographer, and creative director with a passion for crafting stories that move people.
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
