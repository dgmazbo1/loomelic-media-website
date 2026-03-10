/* ============================================================
   HowItWorks — Enterprise process section
   Light background, 4-step process with numbered cards
   Preserves: section-light, Barlow Condensed display, pill CTAs
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";

const STEPS = [
  {
    num: "01",
    title: "DISCOVERY CALL",
    desc: "We learn your dealership, your goals, and what's not working. No pitch decks — just a real conversation about your content needs.",
    detail: "30-minute call · No obligation",
  },
  {
    num: "02",
    title: "CUSTOM PROPOSAL",
    desc: "Within 48 hours, you get a tailored scope — services, deliverables, timeline, and pricing. Clear, no surprises.",
    detail: "Delivered within 48 hours",
  },
  {
    num: "03",
    title: "ONBOARDING",
    desc: "We set up your content calendar, schedule the first shoot, and connect with your team. You get a dedicated account manager.",
    detail: "Dedicated account manager",
  },
  {
    num: "04",
    title: "ONGOING DELIVERY",
    desc: "Monthly content drops — inventory photos, social reels, event coverage, and more. Consistent quality, consistent schedule.",
    detail: "Monthly retainer · Ongoing",
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

export default function HowItWorks() {
  const [, navigate] = useLocation();

  return (
    <section className="section-light text-[oklch(0.07_0_0)]">
      <div className="container py-16 sm:py-24 lg:py-32">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <AnimFade>
              <p className="section-label text-[oklch(0.07_0_0)]/40 mb-4">
                <span>✦</span><span>PROCESS —</span>
              </p>
            </AnimFade>
            <AnimFade delay={0.1}>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.88] text-[oklch(0.07_0_0)]">
                HOW IT<br />
                <span className="text-[oklch(0.78_0_0)]">WORKS</span>
              </h2>
            </AnimFade>
          </div>
          <AnimFade delay={0.2}>
            <button
              onClick={() => navigate("/process")}
              className="btn-pill-dark text-xs self-start sm:self-end mb-2"
            >
              FULL PROCESS +
            </button>
          </AnimFade>
        </div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STEPS.map((step, i) => (
            <AnimFade key={step.num} delay={0.1 + i * 0.08}>
              <div className="card-light p-6 sm:p-7 flex flex-col h-full group hover:shadow-lg transition-shadow duration-300">
                {/* Number */}
                <span className="font-display text-[3rem] leading-none text-[oklch(0.07_0_0)]/10 mb-4">
                  {step.num}
                </span>

                {/* Title */}
                <h3 className="font-display-normal text-lg tracking-wider text-[oklch(0.07_0_0)] mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="font-body text-sm text-[oklch(0.45_0_0)] leading-relaxed mb-5 flex-1">
                  {step.desc}
                </p>

                {/* Detail tag */}
                <span className="inline-flex self-start items-center px-3 py-1 rounded-full bg-[oklch(0.07_0_0)]/5 font-body text-[0.6rem] tracking-widest text-[oklch(0.5_0_0)] uppercase">
                  {step.detail}
                </span>
              </div>
            </AnimFade>
          ))}
        </div>

        {/* Bottom CTA */}
        <AnimFade delay={0.5}>
          <div className="mt-12 sm:mt-16 text-center">
            <p className="font-body text-sm text-[oklch(0.5_0_0)] mb-4">
              Ready to build a content system for your dealership?
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="btn-pill-dark text-xs"
            >
              START WITH A DISCOVERY CALL →
            </button>
          </div>
        </AnimFade>
      </div>
    </section>
  );
}
