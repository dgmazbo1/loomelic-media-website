/* ============================================================
   ProcessPage — How Loomelic works, step by step
   Dark page with detailed process breakdown
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { Phone, FileText, Settings, Repeat, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

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

const STEPS = [
  {
    num: "01",
    icon: Phone,
    title: "DISCOVERY CALL",
    subtitle: "30 minutes · No obligation",
    desc: "We learn about your dealership, your goals, and what's not working with your current content. This isn't a sales pitch — it's a real conversation about your needs.",
    details: [
      "Understand your dealership's brand and market position",
      "Identify content gaps and missed opportunities",
      "Discuss your team structure and workflow",
      "Align on goals: inventory turnover, brand awareness, social growth",
    ],
    outcome: "You walk away with clarity on what a content system looks like for your dealership — whether you work with us or not.",
  },
  {
    num: "02",
    icon: FileText,
    title: "CUSTOM PROPOSAL",
    subtitle: "Delivered within 48 hours",
    desc: "Based on our discovery call, we build a tailored proposal with specific services, deliverables, timeline, and pricing. Clear scope, no surprises.",
    details: [
      "Detailed service breakdown and deliverables",
      "Monthly content calendar template",
      "Pricing with transparent line items",
      "Timeline from kickoff to first delivery",
    ],
    outcome: "A clear, professional proposal you can share with your team and make a decision on quickly.",
  },
  {
    num: "03",
    icon: Settings,
    title: "ONBOARDING",
    subtitle: "1–2 weeks",
    desc: "Once approved, we set up your content calendar, schedule the first shoot, and connect with your team. You get a dedicated account manager from day one.",
    details: [
      "Dedicated account manager assigned",
      "Content calendar built and shared",
      "First shoot scheduled within 2 weeks",
      "Team introductions and communication channels set up",
    ],
    outcome: "Your content system is live. Your team knows who to contact, when shoots happen, and how deliverables arrive.",
  },
  {
    num: "04",
    icon: Repeat,
    title: "ONGOING DELIVERY",
    subtitle: "Monthly retainer · Ongoing",
    desc: "Monthly content drops — inventory photos, social reels, event coverage, and more. Consistent quality, consistent schedule. We adapt as your needs evolve.",
    details: [
      "Monthly content deliveries on schedule",
      "Regular check-ins and performance reviews",
      "Flexible scope adjustments as needs change",
      "Priority scheduling for seasonal campaigns and events",
    ],
    outcome: "A reliable content partner that operates like an extension of your team — not a vendor you have to chase.",
  },
];

export default function ProcessPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="section-dark pt-32 pb-16 sm:pb-24">
        <div className="container">
          <AnimFade>
            <p className="section-label text-white/40 mb-6">
              <span>✦</span><span>OUR PROCESS —</span>
            </p>
          </AnimFade>
          <AnimFade delay={0.1}>
            <h1 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.88] text-white mb-6">
              HOW WE<br />
              <span className="text-outline-white">WORK</span>
            </h1>
          </AnimFade>
          <AnimFade delay={0.2}>
            <p className="font-body text-white/50 text-base sm:text-lg max-w-xl leading-relaxed">
              From first call to ongoing delivery — here's exactly how we build
              and maintain content systems for dealerships and brands.
            </p>
          </AnimFade>
        </div>
      </section>

      {/* Steps */}
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isLight = idx % 2 !== 0;
        return (
          <section
            key={step.num}
            className={isLight ? "section-light text-[oklch(0.07_0_0)]" : "section-dark"}
          >
            <div className="container py-16 sm:py-24">
              <div className="grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-16 items-start">
                {/* Left: number + icon */}
                <AnimFade>
                  <div className="flex lg:flex-col items-center lg:items-start gap-4">
                    <span
                      className={`font-display text-[5rem] sm:text-[7rem] leading-none ${
                        isLight ? "text-[oklch(0.07_0_0)]/8" : "text-white/8"
                      }`}
                    >
                      {step.num}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isLight ? "bg-[oklch(0.07_0_0)]/8" : "bg-white/8"
                      }`}
                    >
                      <Icon size={20} className={isLight ? "text-[oklch(0.07_0_0)]/50" : "text-white/50"} />
                    </div>
                  </div>
                </AnimFade>

                {/* Right: content */}
                <div>
                  <AnimFade delay={0.1}>
                    <h2
                      className={`font-display text-[clamp(2rem,5vw,4rem)] leading-[0.88] mb-2 ${
                        isLight ? "text-[oklch(0.07_0_0)]" : "text-white"
                      }`}
                    >
                      {step.title}
                    </h2>
                  </AnimFade>
                  <AnimFade delay={0.15}>
                    <p
                      className={`font-body text-xs tracking-widest uppercase mb-6 ${
                        isLight ? "text-[oklch(0.5_0_0)]" : "text-white/30"
                      }`}
                    >
                      {step.subtitle}
                    </p>
                  </AnimFade>
                  <AnimFade delay={0.2}>
                    <p
                      className={`font-body text-base leading-relaxed mb-8 max-w-2xl ${
                        isLight ? "text-[oklch(0.35_0_0)]" : "text-white/55"
                      }`}
                    >
                      {step.desc}
                    </p>
                  </AnimFade>

                  {/* Details */}
                  <AnimFade delay={0.25}>
                    <div
                      className={`rounded-2xl p-6 mb-6 ${
                        isLight
                          ? "bg-[oklch(0.07_0_0)]/[0.03] border border-[oklch(0_0_0/0.06)]"
                          : "bg-white/[0.03] border border-white/8"
                      }`}
                    >
                      <p
                        className={`font-body text-[0.6rem] tracking-widest uppercase mb-4 ${
                          isLight ? "text-[oklch(0.5_0_0)]" : "text-white/30"
                        }`}
                      >
                        WHAT HAPPENS:
                      </p>
                      <ul className="space-y-2.5">
                        {step.details.map((d, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <span className="text-lime mt-0.5 shrink-0 text-sm">—</span>
                            <span
                              className={`font-body text-sm ${
                                isLight ? "text-[oklch(0.35_0_0)]" : "text-white/45"
                              }`}
                            >
                              {d}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AnimFade>

                  {/* Outcome */}
                  <AnimFade delay={0.3}>
                    <div
                      className={`flex items-start gap-3 ${
                        isLight ? "text-[oklch(0.45_0_0)]" : "text-white/40"
                      }`}
                    >
                      <ArrowRight size={14} className="shrink-0 mt-0.5 text-lime" />
                      <p className="font-body text-sm italic leading-relaxed">
                        {step.outcome}
                      </p>
                    </div>
                  </AnimFade>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Bottom CTA */}
      <section className="section-black">
        <div className="container py-16 sm:py-24 text-center">
          <AnimFade>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.88] text-white mb-6">
              READY TO<br />
              <span className="text-outline-white">START?</span>
            </h2>
          </AnimFade>
          <AnimFade delay={0.1}>
            <p className="font-body text-white/50 text-sm max-w-md mx-auto mb-8">
              The first step is a 30-minute discovery call. No pitch, no pressure — just a conversation about your content needs.
            </p>
          </AnimFade>
          <AnimFade delay={0.2}>
            <button onClick={() => navigate("/contact")} className="btn-pill-light text-xs">
              BOOK YOUR DISCOVERY CALL +
            </button>
          </AnimFade>
        </div>
      </section>
    </div>
  );
}
