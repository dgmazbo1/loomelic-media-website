/* ============================================================
   ServicesSection — Dealer-acquisition rebuild
   Design: Dark background, 6 service cards with outcome sentence,
           3 bullet deliverables, best-for one-liner, link to /services
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Camera, Video, Users, Calendar, Aperture, Plane } from "lucide-react";

// Keep SERVICES exported for AllServicesPage compatibility
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
  {
    num: "07",
    slug: "headshots",
    name: "HEADSHOTS +\nTEAM PHOTOGRAPHY",
    shortName: "Headshots + Team Photography",
    desc: "Clean, consistent professional portraits for every department — built for websites, LinkedIn profiles, Google Business listings, and internal communications.",
  },
];

const MULTI_SERVICES = [
  {
    num: "01",
    slug: "/services/dealer",
    icon: Camera,
    name: "DEALER\nSERVICES",
    outcome: "Content systems built for automotive dealerships.",
    deliverables: ["Inventory photography", "Walkaround videos", "Social reels & event coverage"],
    bestFor: "Single-point dealers to multi-rooftop groups.",
  },
  {
    num: "02",
    slug: "/services/events",
    icon: Calendar,
    name: "EVENT\nCOVERAGE",
    outcome: "Full-service photo & video for any event.",
    deliverables: ["Photo coverage", "Highlight films", "Same-day selects & recap reels"],
    bestFor: "Corporate events, concerts, brand activations.",
  },
  {
    num: "03",
    slug: "/services/headshots",
    icon: Users,
    name: "HEADSHOTS",
    outcome: "Professional portraits for teams of any size.",
    deliverables: ["On-site studio setup", "Professional retouching", "Organized galleries"],
    bestFor: "Executive teams, sales departments, corporate groups.",
  },
  {
    num: "04",
    slug: "/services/websites",
    icon: Video,
    name: "WEBSITE\nBUILDING",
    outcome: "Modern, mobile-first websites built to convert.",
    deliverables: ["Custom design & build", "SEO foundation", "Lead forms & optimization"],
    bestFor: "Businesses, dealerships, personal brands.",
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
                <span>✦</span><span>SERVICES —</span>
              </p>
            </AnimFade>
            <AnimFade delay={0.1}>
              <h2 className="font-display text-[clamp(2.2rem,7vw,6rem)] leading-[0.88] text-white">
                WHAT WE<br />
                <span className="text-outline-white">DO</span>
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

        {/* Service cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {MULTI_SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="group relative bg-white/[0.03] border border-white/8 rounded-2xl p-6 sm:p-7 hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 flex flex-col"
              >
                {/* Number + Icon */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-body text-xs text-white/20 tracking-widest">({svc.num})</span>
                  <div className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-white/40 group-hover:text-white/70 transition-colors">
                    <Icon size={16} />
                  </div>
                </div>

                {/* Service name */}
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[0.92] text-white mb-3 whitespace-pre-line">
                  {svc.name}
                </h3>

                {/* Outcome */}
                <p className="font-body text-sm text-white/55 leading-relaxed mb-5">
                  {svc.outcome}
                </p>

                {/* Deliverables */}
                <ul className="space-y-2 mb-5 flex-1">
                  {svc.deliverables.map((d, j) => (
                    <li key={j} className="flex items-start gap-2 font-body text-xs text-white/40">
                      <span className="text-white/50 mt-0.5 shrink-0">—</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                {/* Best for */}
                <p className="font-body text-[0.68rem] text-white/30 italic mb-5 border-t border-white/8 pt-4">
                  Best for: {svc.bestFor}
                </p>

                {/* CTA */}
                <button
                  onClick={() => navigate(svc.slug)}
                  className="flex items-center gap-2 font-body text-xs text-white/50 hover:text-white transition-colors group/btn"
                >
                  <span className="tracking-widest">SEE DETAILS</span>
                  <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
