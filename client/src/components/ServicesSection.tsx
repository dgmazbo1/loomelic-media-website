/* ============================================================
   ServicesSection — Unusually-inspired
   Style: Dark background, "CREATIVE SOLUTIONS" huge heading,
          ALL SERVICES pill button, numbered list (01,02...) with
          huge service name + description right
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const SERVICES = [
  {
    num: "01",
    name: "AUTOMOTIVE\nMARKETING",
    desc: "Cinematic vehicle showcases, dealership campaigns, and social media content that drives traffic and elevates your brand above the competition.",
  },
  {
    num: "02",
    name: "WEDDING\nVIDEOGRAPHY",
    desc: "Emotional, story-driven wedding films that capture every detail of your most important day with cinematic precision and heartfelt artistry.",
  },
  {
    num: "03",
    name: "SOCIAL MEDIA\nCONTENT",
    desc: "High-impact short-form video and photo content engineered for Instagram, TikTok, and YouTube — built to stop the scroll and grow your audience.",
  },
  {
    num: "04",
    name: "DRONE &\nAERIAL",
    desc: "FAA-certified drone cinematography delivering breathtaking aerial perspectives for real estate, events, and commercial productions.",
  },
  {
    num: "05",
    name: "PHOTOGRAPHY",
    desc: "Professional photo shoots for automotive, events, portraits, and commercial use — every frame composed to tell your brand's story.",
  },
  {
    num: "06",
    name: "BRAND\nSTRATEGY",
    desc: "Visual identity development, content strategy, and digital marketing guidance to position your brand for sustained growth.",
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

export default function ServicesSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="section-dark">
      <div className="container py-16 sm:py-24 lg:py-32">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <AnimFade>
              <p className="section-label text-white/40 mb-4">
                <span>✦</span><span>OUR SERVICES —</span>
              </p>
            </AnimFade>
            <AnimFade delay={0.1}>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.88] text-white">
                CREATIVE<br />
                <span className="text-[oklch(0.45_0_0)]">SOLUTIONS</span>
              </h2>
            </AnimFade>
          </div>
          <AnimFade delay={0.2}>
            <button onClick={() => scrollTo("contact")} className="btn-pill-light text-xs self-start sm:self-end mb-2">
              ALL SERVICES +
            </button>
          </AnimFade>
        </div>

        {/* Service rows */}
        <div className="border-t border-white/8">
          {SERVICES.map((svc, i) => (
            <motion.div
              key={svc.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className="grid grid-cols-[3rem_1fr] md:grid-cols-[4rem_1fr_1fr] items-start gap-4 md:gap-8 py-6 sm:py-8 border-b border-white/8 group cursor-default transition-all duration-300 hover:bg-white/[0.025] rounded-xl px-3"
            >
              {/* Number */}
              <span className="font-body text-xs text-white/25 pt-3 tracking-widest">({svc.num})</span>

              {/* Service name */}
              <div>
                <h3 className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.9] text-white group-hover:text-lime transition-colors duration-300 whitespace-pre-line">
                  {svc.name}
                </h3>
                {/* Mobile description */}
                <p className="md:hidden font-body text-xs text-white/40 leading-relaxed mt-3">
                  {svc.desc}
                </p>
              </div>

              {/* Description — desktop only */}
              <p className="hidden md:block font-body text-sm text-white/45 leading-relaxed pt-3 group-hover:text-white/65 transition-colors duration-300">
                {svc.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
