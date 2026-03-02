/* ============================================================
   Service Subpages
   /services/dealer   — Dealer Services (dealer-specific language OK here)
   /services/events   — Event Coverage
   /services/headshots — Headshots
   /services/websites  — Website Building
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";

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

function ServiceHero({ label, headline, sub }: { label: string; headline: React.ReactNode; sub: string }) {
  return (
    <section className="section-dark pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="container">
        <AnimFade>
          <p className="section-label text-white/40 mb-6"><span>✦</span><span>{label}</span></p>
        </AnimFade>
        <AnimFade delay={0.1}>
          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.88] text-white mb-6 max-w-4xl">{headline}</h1>
        </AnimFade>
        <AnimFade delay={0.2}>
          <p className="font-body text-white/55 text-sm sm:text-base max-w-xl leading-relaxed">{sub}</p>
        </AnimFade>
      </div>
    </section>
  );
}

function DeliverablesSection({ items }: { items: { title: string; desc: string }[] }) {
  return (
    <section className="section-light text-[oklch(0.07_0_0)]">
      <div className="container py-16 sm:py-24">
        <AnimFade>
          <p className="section-label text-[oklch(0.07_0_0)/40] mb-8"><span>✦</span><span>WHAT'S INCLUDED</span></p>
        </AnimFade>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[oklch(0_0_0/0.08)]">
          {items.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.08 }}
              className="bg-[oklch(0.97_0_0)] p-8">
              <div className="font-display text-[oklch(0.85_0_0)] text-4xl mb-5">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="font-display-normal text-[oklch(0.07_0_0)] text-sm tracking-widest uppercase mb-3">{item.title}</h3>
              <p className="font-body text-sm text-[oklch(0.45_0_0)] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ headline, cta, onClick }: { headline: string; cta: string; onClick: () => void }) {
  return (
    <section className="section-dark">
      <div className="container py-16 sm:py-24">
        <AnimFade>
          <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] text-white mb-8 max-w-2xl">{headline}</h2>
        </AnimFade>
        <AnimFade delay={0.1}>
          <button onClick={onClick} className="btn-pill-light text-xs py-3.5 px-8">{cta} +</button>
        </AnimFade>
      </div>
    </section>
  );
}

/* ─── DEALER SERVICES ──────────────────────────────────────── */
export function DealerServicesPage() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />
      <ServiceHero
        label="DEALER SERVICES"
        headline={<>CONTENT THAT<br /><span className="text-outline-white">MOVES</span><br />INVENTORY</>}
        sub="Monthly content systems built for automotive dealerships — inventory photography, walkaround videos, social reels, and event coverage. Fast turnaround. Consistent look."
      />
      <DeliverablesSection items={[
        { title: "Inventory Photography", desc: "High-volume lot photography with consistent lighting and angles — ready for your website, AutoTrader, and social media." },
        { title: "Walkaround Videos", desc: "Cinematic vehicle walkarounds that showcase features and drive online engagement — optimized for YouTube, Instagram, and your VDP." },
        { title: "Social Reels", desc: "Short-form vertical video content engineered for Instagram Reels, TikTok, and YouTube Shorts — built to stop the scroll." },
        { title: "Event & Activation Coverage", desc: "Full photo and video coverage for dealership events, sales campaigns, new model launches, and community activations." },
      ]} />
      <section className="section-dark">
        <div className="container py-16 sm:py-24">
          <AnimFade>
            <p className="section-label text-white/40 mb-6"><span>✦</span><span>BEST FOR</span></p>
            <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.9] text-white mb-6">SINGLE-POINT DEALERS<br />TO MULTI-ROOFTOP GROUPS</h2>
            <p className="font-body text-white/55 text-sm sm:text-base max-w-xl leading-relaxed mb-8">
              Whether you're managing 50 vehicles a month or 500, we build content systems that scale with your operation. We're familiar with Lexus, Subaru, and other OEM visual standards for certified programs and co-op submissions.
            </p>
          </AnimFade>
          <AnimFade delay={0.1}>
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
              {["Las Vegas, NV", "South Florida"].map((loc) => (
                <div key={loc} className="px-5 py-3.5 border border-white/10 rounded-xl">
                  <p className="font-body text-xs text-white/50 tracking-widest uppercase">{loc}</p>
                </div>
              ))}
            </div>
          </AnimFade>
        </div>
      </section>
      <CTASection headline={"READY TO BOOK\nA DEALER CALL?"} cta="BOOK A DEALER CALL" onClick={() => navigate("/contact")} />
      <ContactSection />
    </div>
  );
}

/* ─── EVENT COVERAGE ───────────────────────────────────────── */
export function EventCoverageSubpage() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />
      <ServiceHero
        label="EVENT COVERAGE"
        headline={<>EVERY MOMENT<br /><span className="text-outline-white">CAPTURED</span></>}
        sub="Full-service photo and video coverage for corporate events, concerts, brand activations, and private gatherings — capturing every moment with precision and style."
      />
      <DeliverablesSection items={[
        { title: "Photo Coverage", desc: "Comprehensive event photography — candid moments, keynote speakers, brand activations, and guest interactions, all delivered in high resolution." },
        { title: "Highlight Film", desc: "A cinematic short-form highlight reel that captures the energy and story of your event — perfect for social media and internal communications." },
        { title: "Same-Day Selects", desc: "A curated set of edited photos delivered the same day for immediate social media posting — ideal for live events and activations." },
        { title: "Recap Reels", desc: "Longer-form recap videos for post-event marketing, sponsor reports, and internal recaps — structured and branded to your specifications." },
      ]} />
      <section className="section-dark">
        <div className="container py-16 sm:py-24">
          <AnimFade>
            <p className="section-label text-white/40 mb-6"><span>✦</span><span>EVENT TYPES</span></p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl">
              {["Corporate Events", "Concerts & Performances", "Brand Activations", "Private Gatherings", "Sports Events", "Product Launches"].map((type) => (
                <div key={type} className="px-5 py-3.5 border border-white/10 rounded-xl">
                  <p className="font-body text-sm text-white/70">{type}</p>
                </div>
              ))}
            </div>
          </AnimFade>
          <AnimFade delay={0.1}>
            <p className="font-body text-xs text-white/30 mt-8 tracking-widest uppercase">Las Vegas · South Florida · Available for travel</p>
          </AnimFade>
        </div>
      </section>
      <CTASection headline={"REQUEST\nEVENT COVERAGE"} cta="REQUEST EVENT COVERAGE" onClick={() => navigate("/contact")} />
      <ContactSection />
    </div>
  );
}

/* ─── HEADSHOTS ────────────────────────────────────────────── */
export function HeadshotsSubpage() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />
      <ServiceHero
        label="HEADSHOTS"
        headline={<>PORTRAITS THAT<br /><span className="text-outline-white">REPRESENT</span><br />YOUR TEAM</>}
        sub="Clean, consistent professional portraits for every department — built for websites, LinkedIn profiles, Google Business listings, and internal communications."
      />
      <DeliverablesSection items={[
        { title: "On-Site Setup", desc: "We bring the studio to you — professional lighting, backdrops, and equipment set up at your location for minimal disruption to your team's day." },
        { title: "Retouching", desc: "Every portrait is professionally retouched for clean, consistent results — skin tone correction, background cleanup, and brand-standard finishing." },
        { title: "Organized Galleries", desc: "Delivered in a structured online gallery organized by department or individual — easy to download, share, and update as your team grows." },
        { title: "Scheduling System", desc: "We coordinate scheduling across departments and locations to ensure every team member gets their portrait session without bottlenecks." },
      ]} />
      <section className="section-dark">
        <div className="container py-16 sm:py-24">
          <AnimFade>
            <p className="section-label text-white/40 mb-6"><span>✦</span><span>IDEAL FOR</span></p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl">
              {["Executive Teams", "Sales Departments", "Legal & Finance", "Medical Practices", "Real Estate Teams", "Corporate Groups"].map((type) => (
                <div key={type} className="px-5 py-3.5 border border-white/10 rounded-xl">
                  <p className="font-body text-sm text-white/70">{type}</p>
                </div>
              ))}
            </div>
          </AnimFade>
          <AnimFade delay={0.1}>
            <p className="font-body text-xs text-white/30 mt-8 tracking-widest uppercase">Las Vegas · Henderson · South Florida</p>
          </AnimFade>
        </div>
      </section>
      <CTASection headline={"SCHEDULE YOUR\nHEADSHOT SESSION"} cta="SCHEDULE HEADSHOTS" onClick={() => navigate("/contact")} />
      <ContactSection />
    </div>
  );
}

/* ─── WEBSITE BUILDING ─────────────────────────────────────── */
export function WebsiteBuildingPage() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />
      <ServiceHero
        label="WEBSITE BUILDING"
        headline={<>MODERN SITES<br /><span className="text-outline-white">BUILT TO</span><br />CONVERT</>}
        sub="Modern, mobile-first websites built to match the premium level of your brand — fast, clean, and designed to convert visitors into customers."
      />
      <DeliverablesSection items={[
        { title: "Design", desc: "Custom visual design tailored to your brand identity — typography, color system, layout, and component design that feels premium and intentional." },
        { title: "Build", desc: "Clean, performant code built on modern frameworks — fast load times, smooth animations, and a codebase that's easy to maintain and scale." },
        { title: "SEO Foundation", desc: "On-page SEO setup from day one — semantic HTML, meta tags, structured data, sitemap, and performance optimization for search visibility." },
        { title: "Lead Forms & Optimization", desc: "Conversion-focused contact forms, lead capture flows, and performance monitoring — built to turn visitors into inquiries." },
      ]} />
      <section className="section-dark">
        <div className="container py-16 sm:py-24">
          <AnimFade>
            <p className="section-label text-white/40 mb-6"><span>✦</span><span>WHAT WE BUILD</span></p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl">
              {["Business Websites", "Portfolio Sites", "Landing Pages", "Service Pages", "E-Commerce", "Custom Web Apps"].map((type) => (
                <div key={type} className="px-5 py-3.5 border border-white/10 rounded-xl">
                  <p className="font-body text-sm text-white/70">{type}</p>
                </div>
              ))}
            </div>
          </AnimFade>
          <AnimFade delay={0.1}>
            <p className="font-body text-xs text-white/30 mt-8 tracking-widest uppercase">Remote-friendly · Las Vegas · South Florida</p>
          </AnimFade>
        </div>
      </section>
      <CTASection headline={"REQUEST A\nWEBSITE CONSULT"} cta="REQUEST A WEBSITE CONSULT" onClick={() => navigate("/contact")} />
      <ContactSection />
    </div>
  );
}
