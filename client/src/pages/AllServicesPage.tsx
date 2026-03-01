/* ============================================================
   AllServicesPage — /services
   Dealer-acquisition rebuild: hero, 4-step process, service cards
   with deliverables and best-for lines, CTA
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Camera, Video, Users, Calendar, Aperture, Plane, Globe, Palette } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";

const SERVICES = [
  {
    slug: "automotive-marketing",
    icon: Camera,
    name: "INVENTORY\nPHOTOGRAPHY",
    tagline: "Make every vehicle look showroom-ready online.",
    deliverables: ["Exterior + interior shots per vehicle", "White-sky or lifestyle backgrounds", "Web-optimized files in 24–48 hours"],
    bestFor: "New and used inventory teams needing fast, consistent output.",
  },
  {
    slug: "social-media-content",
    icon: Video,
    name: "SHORT-FORM\nSOCIAL REELS",
    tagline: "Stop the scroll and drive showroom traffic.",
    deliverables: ["Instagram Reels, TikTok, YouTube Shorts", "On-brand captions and hashtag strategy", "Monthly content calendar"],
    bestFor: "Dealers who want consistent social presence without managing it in-house.",
  },
  {
    slug: "automotive-marketing",
    icon: Aperture,
    name: "WALKAROUND +\nDELIVERY VIDEOS",
    tagline: "Build buyer confidence before they step on the lot.",
    deliverables: ["Feature-focused vehicle walkaround videos", "Customer delivery moment captures", "Branded intro/outro overlay"],
    bestFor: "Sales teams who want to close more deals from online leads.",
  },
  {
    slug: "event-coverage",
    icon: Calendar,
    name: "DEALERSHIP EVENTS\n+ ACTIVATIONS",
    tagline: "Turn every event into lasting brand content.",
    deliverables: ["Full event photo and video coverage", "Same-day social media delivery", "Highlight reel for website and ads"],
    bestFor: "Dealers running sales events, community drives, or manufacturer activations.",
  },
  {
    slug: "headshots",
    icon: Users,
    name: "STAFF HEADSHOTS\n+ TEAM BRANDING",
    tagline: "Give your team a professional image that matches your brand.",
    deliverables: ["Individual and group headshots on-site", "Consistent lighting and background", "Retouched files for web, email, social"],
    bestFor: "Dealerships updating their website, hiring pages, or OEM requirements.",
  },
  {
    slug: "automotive-marketing",
    icon: Plane,
    name: "DRONE + EXTERIOR\nVISUALS",
    tagline: "Show the full scale of your dealership from above.",
    deliverables: ["FAA-compliant aerial photography and video", "Lot overview and surrounding area shots", "Cinematic flyover for ads and web hero"],
    bestFor: "Dealers with large lots, prime locations, or new facility openings.",
  },
  {
    slug: "photography",
    icon: Aperture,
    name: "COMMERCIAL\nPHOTOGRAPHY",
    tagline: "Every frame composed to tell your brand's story.",
    deliverables: ["Product, lifestyle, and portrait photography", "High-resolution files for print and digital", "Full retouching and color grading"],
    bestFor: "Brands needing polished imagery for ads, websites, and press.",
  },
  {
    slug: "brand-strategy",
    icon: Palette,
    name: "BRAND\nSTRATEGY",
    tagline: "Position your brand for sustained growth.",
    deliverables: ["Visual identity and content strategy", "Digital marketing guidance", "Brand guidelines and asset library"],
    bestFor: "Dealers and brands building a long-term content presence.",
  },
  {
    slug: "website-redesign",
    icon: Globe,
    name: "WEBSITE\nREDESIGN",
    tagline: "Modern, mobile-first sites that convert visitors into customers.",
    deliverables: ["Custom design and development", "Mobile-first, fast-loading build", "Inventory integration and lead forms"],
    bestFor: "Dealers with outdated sites that don't reflect their brand quality.",
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Discovery Call",
    desc: "We learn about your dealership, current content gaps, inventory volume, and goals. 30 minutes — no obligation.",
  },
  {
    num: "02",
    title: "Content Plan",
    desc: "We put together a custom content plan with recommended services, deliverables, and pricing based on your needs.",
  },
  {
    num: "03",
    title: "On-Site Shoot",
    desc: "We come to your lot, showroom, or event. Our team handles setup, direction, and capture — you stay focused on selling.",
  },
  {
    num: "04",
    title: "Delivery + Ongoing",
    desc: "Files delivered within 24–48 hours. Monthly retainer clients get a dedicated content calendar and priority scheduling.",
  },
];

function AnimFade({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
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
      <section className="section-black pt-32 pb-16 sm:pb-24">
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
            <span>✦</span><span>DEALER CONTENT SYSTEMS —</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.88] text-white mb-6"
          >
            CONTENT THAT<br />
            <span className="text-[oklch(0.4_0_0)]">MOVES INVENTORY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="font-body text-white/55 text-sm sm:text-base max-w-xl leading-relaxed"
          >
            Monthly content systems built for Nevada dealerships — inventory photography, walkaround videos, social reels, event coverage, and staff headshots. Fast turnaround. Consistent look.
          </motion.p>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="section-dark border-t border-white/8">
        <div className="container py-16 sm:py-24">
          <AnimFade>
            <p className="section-label text-white/40 mb-4">
              <span>✦</span><span>HOW IT WORKS —</span>
            </p>
            <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] text-white mb-12">
              4 STEPS TO<br />
              <span className="text-[oklch(0.45_0_0)]">BETTER CONTENT</span>
            </h2>
          </AnimFade>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white/[0.03] border border-white/8 rounded-2xl p-6"
              >
                <span className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-none text-white/10 block mb-4">{step.num}</span>
                <h3 className="font-display text-xl text-white mb-3">{step.title}</h3>
                <p className="font-body text-xs text-white/45 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section className="section-black pb-24">
        <div className="container">
          <AnimFade className="mb-12">
            <p className="section-label text-white/40 mb-4">
              <span>✦</span><span>ALL SERVICES —</span>
            </p>
            <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] text-white">
              WHAT WE<br />
              <span className="text-[oklch(0.4_0_0)]">DELIVER</span>
            </h2>
          </AnimFade>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={`${svc.slug}-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                  className="group bg-white/[0.03] border border-white/8 rounded-2xl p-6 sm:p-7 hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-body text-xs text-white/20 tracking-widest">({String(i + 1).padStart(2, "0")})</span>
                    <div className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-white/40 group-hover:text-white/70 transition-colors">
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[0.92] text-white mb-3 whitespace-pre-line">
                    {svc.name}
                  </h3>

                  <p className="font-body text-sm text-white/55 leading-relaxed mb-5">{svc.tagline}</p>

                  <ul className="space-y-2 mb-5 flex-1">
                    {svc.deliverables.map((d, j) => (
                      <li key={j} className="flex items-start gap-2 font-body text-xs text-white/40">
                        <span className="text-lime mt-0.5 shrink-0">—</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="font-body text-[0.68rem] text-white/30 italic mb-5 border-t border-white/8 pt-4">
                    Best for: {svc.bestFor}
                  </p>

                  <button
                    onClick={() => navigate(`/services/${svc.slug}`)}
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

      <ContactSection />
    </div>
  );
}
