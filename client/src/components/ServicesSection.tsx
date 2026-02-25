/* ============================================================
   ServicesSection — Unusually-inspired
   Style: Dark background, "CREATIVE SOLUTIONS" huge heading,
          numbered list (01,02...) with huge service name + description
   Services: Automotive Marketing, Event Coverage, Social Media Content,
             Photography, Brand Strategy, Website Redesign
   Each row links to its individual service page
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";

export const SERVICES = [
  {
    num: "01",
    slug: "automotive-marketing",
    name: "AUTOMOTIVE\nMARKETING",
    shortName: "Automotive Marketing",
    desc: "Cinematic vehicle showcases, dealership campaigns, and social media content that drives traffic and elevates your brand above the competition.",
  },
  {
    num: "02",
    slug: "event-coverage",
    name: "EVENT\nCOVERAGE",
    shortName: "Event Coverage",
    desc: "Full-service photo and video coverage for corporate events, concerts, brand activations, and private gatherings — capturing every moment with precision.",
  },
  {
    num: "03",
    slug: "social-media-content",
    name: "SOCIAL MEDIA\nCONTENT",
    shortName: "Social Media Content",
    desc: "High-impact short-form video and photo content engineered for Instagram, TikTok, and YouTube — built to stop the scroll and grow your audience.",
  },
  {
    num: "04",
    slug: "photography",
    name: "PHOTOGRAPHY",
    shortName: "Photography",
    desc: "Professional photo shoots for automotive, events, portraits, and commercial use — every frame composed to tell your brand's story.",
  },
  {
    num: "05",
    slug: "brand-strategy",
    name: "BRAND\nSTRATEGY",
    shortName: "Brand Strategy",
    desc: "Visual identity development, content strategy, and digital marketing guidance to position your brand for sustained growth.",
  },
  {
    num: "06",
    slug: "website-redesign",
    name: "WEBSITE\nREDESIGN",
    shortName: "Website Redesign",
    desc: "Modern, mobile-first websites built to match the premium level of your brand — fast, clean, and designed to convert visitors into customers.",
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
  const [, navigate] = useLocation();

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
            <button
              onClick={() => navigate("/services")}
              className="btn-pill-light text-xs self-start sm:self-end mb-2"
            >
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
              onClick={() => navigate(`/services/${svc.slug}`)}
              className="grid grid-cols-[3rem_1fr_auto] md:grid-cols-[4rem_1fr_1fr_auto] items-start gap-4 md:gap-8 py-6 sm:py-8 border-b border-white/8 group cursor-pointer transition-all duration-300 hover:bg-white/[0.025] rounded-xl px-3"
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

              {/* Arrow */}
              <div className="pt-3 text-white/20 group-hover:text-lime transition-colors duration-300">
                <ArrowRight size={20} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
