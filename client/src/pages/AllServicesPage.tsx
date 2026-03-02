/* ============================================================
   AllServicesPage — /services
   Multi-vertical overview: dealer, events, headshots, websites
   4-step process + service cards linking to subpages
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";

const SERVICES = [
  {
    number: "01",
    title: "Dealer Services",
    slug: "/services/dealer",
    tagline: "Content systems for automotive dealerships",
    deliverables: ["Inventory photography", "Walkaround videos", "Social reels", "Event & activation coverage"],
    bestFor: "Single-point dealers to multi-rooftop groups",
  },
  {
    number: "02",
    title: "Event Coverage",
    slug: "/services/events",
    tagline: "Full-service photo & video for any event",
    deliverables: ["Photo coverage", "Highlight films", "Same-day selects", "Recap reels"],
    bestFor: "Corporate events, concerts, brand activations",
  },
  {
    number: "03",
    title: "Headshots",
    slug: "/services/headshots",
    tagline: "Professional portraits for teams of any size",
    deliverables: ["On-site studio setup", "Professional retouching", "Organized galleries", "Scheduling coordination"],
    bestFor: "Executive teams, sales departments, corporate groups",
  },
  {
    number: "04",
    title: "Website Building",
    slug: "/services/websites",
    tagline: "Modern, mobile-first websites built to convert",
    deliverables: ["Custom design", "Performant build", "SEO foundation", "Lead forms & optimization"],
    bestFor: "Businesses, dealerships, personal brands",
  },
];

const PROCESS_STEPS = [
  { step: "01", title: "Discovery Call", desc: "We learn your goals, timeline, and what success looks like for your project — no generic intake forms." },
  { step: "02", title: "Proposal & Scope", desc: "A clear scope of work with deliverables, timeline, and pricing. No surprises." },
  { step: "03", title: "Production", desc: "We show up, shoot, and produce — on time and on brand. You stay focused on your business." },
  { step: "04", title: "Delivery & Review", desc: "Organized, labeled deliverables. One round of revisions included. Ongoing support available." },
];

function AnimFade({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function AllServicesPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />

      {/* Hero */}
      <section className="section-dark pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="container">
          <AnimFade>
            <p className="section-label text-white/40 mb-6"><span>✦</span><span>SERVICES</span></p>
          </AnimFade>
          <AnimFade delay={0.1}>
            <h1 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.88] text-white mb-6 max-w-4xl">
              VISUAL CONTENT<br />
              <span className="text-outline-white">FOR EVERY</span><br />
              INDUSTRY
            </h1>
          </AnimFade>
          <AnimFade delay={0.2}>
            <p className="font-body text-white/55 text-sm sm:text-base max-w-xl leading-relaxed">
              From automotive dealerships to corporate events, executive headshots to full website builds — Loomelic Media covers every visual content need across Las Vegas and South Florida.
            </p>
          </AnimFade>
        </div>
      </section>

      {/* Service cards */}
      <section className="section-light text-[oklch(0.07_0_0)]">
        <div className="container py-16 sm:py-24">
          <AnimFade>
            <p className="section-label text-[oklch(0.07_0_0)/40] mb-10"><span>✦</span><span>WHAT WE DO</span></p>
          </AnimFade>
          <div className="grid sm:grid-cols-2 gap-px bg-[oklch(0_0_0/0.08)]">
            {SERVICES.map((svc, i) => (
              <motion.button
                key={svc.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                onClick={() => navigate(svc.slug)}
                className="group text-left bg-[oklch(0.97_0_0)] hover:bg-white p-8 sm:p-10 transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="font-display text-[oklch(0.85_0_0)] text-5xl">{svc.number}</span>
                  <span className="flex items-center gap-1.5 font-body text-[0.65rem] text-[oklch(0.55_0_0)] tracking-widest uppercase group-hover:text-[oklch(0.07_0_0)] transition-colors">
                    VIEW SERVICE <ArrowRight size={11} />
                  </span>
                </div>
                <h2 className="font-display-normal text-[oklch(0.07_0_0)] text-2xl sm:text-3xl tracking-tight mb-2">{svc.title.toUpperCase()}</h2>
                <p className="font-body text-sm text-[oklch(0.45_0_0)] mb-6">{svc.tagline}</p>
                <ul className="flex flex-col gap-1.5 mb-6">
                  {svc.deliverables.map((d) => (
                    <li key={d} className="font-body text-xs text-[oklch(0.4_0_0)] flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[oklch(0.7_0_0)] shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
                <p className="font-body text-[0.65rem] text-[oklch(0.55_0_0)] tracking-widest uppercase">BEST FOR: {svc.bestFor}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="section-dark">
        <div className="container py-16 sm:py-24">
          <AnimFade>
            <p className="section-label text-white/40 mb-6"><span>✦</span><span>HOW IT WORKS</span></p>
          </AnimFade>
          <AnimFade delay={0.1}>
            <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] text-white mb-12 max-w-2xl">
              OUR<br />PROCESS
            </h2>
          </AnimFade>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <div className="font-display text-[oklch(0.3_0_0)] text-5xl mb-5">{step.step}</div>
                <h3 className="font-display-normal text-white text-sm tracking-widest uppercase mb-3">{step.title}</h3>
                <p className="font-body text-sm text-white/50 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Local markets */}
      <section className="section-light text-[oklch(0.07_0_0)]">
        <div className="container py-16 sm:py-24">
          <AnimFade>
            <p className="section-label text-[oklch(0.07_0_0)/40] mb-6"><span>✦</span><span>WHERE WE WORK</span></p>
          </AnimFade>
          <div className="grid sm:grid-cols-2 gap-8">
            <AnimFade delay={0.1}>
              <div className="p-8 border border-[oklch(0_0_0/0.08)] rounded-2xl">
                <h3 className="font-display-normal text-[oklch(0.07_0_0)] text-xl tracking-widest uppercase mb-3">Las Vegas</h3>
                <p className="font-body text-sm text-[oklch(0.45_0_0)] leading-relaxed mb-4">
                  Our home base. We serve dealerships, event venues, businesses, and professionals across Las Vegas and surrounding areas.
                </p>
                <p className="font-body text-xs text-[oklch(0.6_0_0)] tracking-widest uppercase">5940 S Rainbow Blvd #4058 · Las Vegas, NV 89117</p>
              </div>
            </AnimFade>
            <AnimFade delay={0.15}>
              <div className="p-8 border border-[oklch(0_0_0/0.08)] rounded-2xl">
                <h3 className="font-display-normal text-[oklch(0.07_0_0)] text-xl tracking-widest uppercase mb-3">South Florida</h3>
                <p className="font-body text-sm text-[oklch(0.45_0_0)] leading-relaxed mb-4">
                  Serving Miami, Fort Lauderdale, Boca Raton, and surrounding areas — the same quality, consistency, and turnaround times you'd expect from our Las Vegas operation.
                </p>
                <p className="font-body text-xs text-[oklch(0.6_0_0)] tracking-widest uppercase">Miami · Fort Lauderdale · Boca Raton</p>
              </div>
            </AnimFade>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark">
        <div className="container py-16 sm:py-24">
          <AnimFade>
            <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] text-white mb-8 max-w-2xl">
              NOT SURE<br />WHICH SERVICE?
            </h2>
          </AnimFade>
          <AnimFade delay={0.1}>
            <p className="font-body text-white/55 text-sm sm:text-base max-w-md leading-relaxed mb-8">
              Tell us about your project and we'll recommend the right approach — no commitment required.
            </p>
            <button onClick={() => navigate("/contact")} className="btn-pill-light text-xs py-3.5 px-8">
              TALK TO US +
            </button>
          </AnimFade>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
