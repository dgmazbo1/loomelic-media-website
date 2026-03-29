/*
  Dealer Service Pages
  /services/dealer                        — Overview (5 cards)
  /services/dealer/01-inventory-photography
  /services/dealer/02-short-form-reels
  /services/dealer/03-walkaround-videos
  /services/dealer/04-dealership-events
  /services/dealer/05-crm-intro-videos
  ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { useSEO } from "@/hooks/useSEO";

/* ─── SHARED UTILITIES ─────────────────────────────────────── */
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

function Breadcrumbs({ service }: { service: string }) {
  const [, navigate] = useLocation();
  return (
    <nav aria-label="Breadcrumb" className="container pt-28 pb-0">
      <ol className="flex items-center gap-2 text-[0.65rem] font-body tracking-widest uppercase text-white/30">
        <li><button onClick={() => navigate("/")} className="hover:text-white/70 transition-colors">Home</button></li>
        <li className="text-white/15">›</li>
        <li><button onClick={() => navigate("/services")} className="hover:text-white/70 transition-colors">Services</button></li>
        <li className="text-white/15">›</li>
        <li><button onClick={() => navigate("/services/dealer")} className="hover:text-white/70 transition-colors">Dealer Services</button></li>
        <li className="text-white/15">›</li>
        <li className="text-white/60">{service}</li>
      </ol>
    </nav>
  );
}

function SubpageHero({ label, number, headline, sub }: { label: string; number: string; headline: React.ReactNode; sub: string }) {
  const [, navigate] = useLocation();
  return (
    <section className="section-dark pt-12 pb-16 sm:pb-20">
      <div className="container">
        <AnimFade>
          <p className="section-label text-white/40 mb-6"><span>✦</span><span>DEALER SERVICES · {number}</span></p>
        </AnimFade>
        <AnimFade delay={0.1}>
          <h1 className="font-display text-[clamp(1.8rem,5.5vw,4.7rem)] leading-[0.88] text-white mb-6 max-w-4xl">{headline}</h1>
        </AnimFade>
        <AnimFade delay={0.2}>
          <p className="font-body text-white/55 text-sm sm:text-base max-w-xl leading-relaxed mb-8">{sub}</p>
        </AnimFade>
        <AnimFade delay={0.3}>
          <button onClick={() => navigate("/contact")} className="btn-pill-light text-xs py-3 px-7">GET A DEALER CONTENT PLAN +</button>
        </AnimFade>
      </div>
    </section>
  );
}

function SolvesSection({ items }: { items: string[] }) {
  return (
    <section className="bg-[oklch(0.11_0_0)]">
      <div className="container py-14 sm:py-20">
        <AnimFade>
          <p className="section-label text-white/40 mb-8"><span>✦</span><span>WHAT THIS SOLVES</span></p>
        </AnimFade>
        <div className="grid sm:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-white/10 rounded-2xl p-6">
              <div className="font-display text-[oklch(0.35_0_0)] text-3xl mb-4">{String(i + 1).padStart(2, "0")}</div>
              <p className="font-body text-sm text-white/70 leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeliverablesSection({ items }: { items: string[] }) {
  return (
    <section className="section-light text-[oklch(0.07_0_0)]">
      <div className="container py-14 sm:py-20">
        <AnimFade>
          <p className="section-label text-[oklch(0.07_0_0)/40] mb-8"><span>✦</span><span>DELIVERABLES</span></p>
        </AnimFade>
        <div className="grid sm:grid-cols-2 gap-3 max-w-3xl">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.06 }}
              className="flex items-start gap-3 py-3 border-b border-[oklch(0_0_0/0.07)]">
              <span className="text-[oklch(0.5_0_0)] mt-0.5 shrink-0">→</span>
              <p className="font-body text-sm text-[oklch(0.25_0_0)] leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowSection({ steps }: { steps: { title: string; desc: string; time?: string }[] }) {
  return (
    <section className="section-dark">
      <div className="container py-14 sm:py-20">
        <AnimFade>
          <p className="section-label text-white/40 mb-10"><span>✦</span><span>HOW IT WORKS</span></p>
        </AnimFade>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.1 }}
              className="bg-[oklch(0.09_0_0)] p-8">
              <div className="font-display text-[oklch(0.25_0_0)] text-4xl mb-4">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="font-display-normal text-white text-sm tracking-widest uppercase mb-3">{step.title}</h3>
              <p className="font-body text-sm text-white/50 leading-relaxed">{step.desc}</p>
              {step.time && <p className="font-body text-xs text-white/25 mt-3 tracking-widest uppercase">{step.time}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BestForSection({ items }: { items: string[] }) {
  return (
    <section className="bg-[oklch(0.11_0_0)]">
      <div className="container py-14 sm:py-20">
        <AnimFade>
          <p className="section-label text-white/40 mb-8"><span>✦</span><span>BEST FOR</span></p>
        </AnimFade>
        <div className="flex flex-wrap gap-3">
          {items.map((item) => (
            <span key={item} className="font-body text-xs text-white/60 tracking-widest uppercase border border-white/10 rounded-full px-5 py-2.5">{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="section-light text-[oklch(0.07_0_0)]">
      <div className="container py-14 sm:py-20 max-w-3xl">
        <AnimFade>
          <p className="section-label text-[oklch(0.07_0_0)/40] mb-8"><span>✦</span><span>FREQUENTLY ASKED</span></p>
        </AnimFade>
        {items.map((item, i) => (
          <AnimFade key={i} delay={i * 0.05}>
            <div className="border-b border-[oklch(0_0_0/0.08)]">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center py-5 text-left gap-4">
                <span className="font-display-normal text-sm tracking-widest uppercase text-[oklch(0.15_0_0)]">{item.q}</span>
                <span className="text-[oklch(0.6_0_0)] shrink-0 text-lg">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <p className="font-body text-sm text-[oklch(0.4_0_0)] leading-relaxed pb-5">{item.a}</p>
              )}
            </div>
          </AnimFade>
        ))}
      </div>
    </section>
  );
}

function CTABlock() {
  const [, navigate] = useLocation();
  return (
    <section className="section-dark">
      <div className="container py-16 sm:py-24">
        <AnimFade>
          <h2 className="font-display text-[clamp(1.6rem,4vw,3.7rem)] leading-[0.9] text-white mb-8 max-w-2xl">GET A DEALER<br />CONTENT PLAN</h2>
        </AnimFade>
        <AnimFade delay={0.1}>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate("/contact")} className="btn-pill-light text-xs py-3.5 px-8">GET IN TOUCH +</button>
            <button onClick={() => navigate("/projects")} className="btn-pill-outline text-xs py-3.5 px-8 !text-white !border-white/20 hover:!bg-white/10">VIEW PROJECTS ↗</button>
          </div>
        </AnimFade>
      </div>
    </section>
  );
}

const ALL_DEALER_SERVICES = [
  { number: "01", title: "Inventory Photography", slug: "/services/dealer/01-inventory-photography", outcome: "Consistent, high-volume lot photography ready for your VDP, AutoTrader, and social media." },
  { number: "02", title: "Short-Form Reels", slug: "/services/dealer/02-short-form-reels", outcome: "Vertical video content engineered to stop the scroll on Instagram, TikTok, and YouTube Shorts." },
  { number: "03", title: "Walkaround Videos", slug: "/services/dealer/03-walkaround-videos", outcome: "Cinematic vehicle walkarounds that showcase features and drive engagement on every platform." },
  { number: "04", title: "Dealership Events", slug: "/services/dealer/04-dealership-events", outcome: "Full photo and video coverage for sales events, model launches, and community activations." },
  { number: "05", title: "Intro Videos for CRM", slug: "/services/dealer/05-crm-intro-videos", outcome: "Personalized sales rep videos built for CRM automation to increase engagement and appointment show rates." },
];

function OtherServicesSection({ current }: { current: string }) {
  const [, navigate] = useLocation();
  const others = ALL_DEALER_SERVICES.filter((s) => s.slug !== current);
  return (
    <section className="bg-[oklch(0.06_0_0)]">
      <div className="container py-14 sm:py-20">
        <AnimFade>
          <p className="section-label text-white/40 mb-8"><span>✦</span><span>OTHER DEALER SERVICES</span></p>
        </AnimFade>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {others.map((svc, i) => (
            <motion.button key={svc.slug} onClick={() => navigate(svc.slug)}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-left border border-white/8 rounded-2xl p-6 hover:border-white/20 hover:bg-white/4 transition-all duration-200 group">
              <div className="font-display text-[oklch(0.3_0_0)] text-2xl mb-3 group-hover:text-[oklch(0.5_0_0)] transition-colors">{svc.number}</div>
              <h3 className="font-display-normal text-white text-xs tracking-widest uppercase mb-2">{svc.title}</h3>
              <p className="font-body text-xs text-white/40 leading-relaxed">{svc.outcome}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── DEALER OVERVIEW ──────────────────────────────────────── */
export function DealerServicesOverview() {
  const [, navigate] = useLocation();
  useSEO({
    title: "Dealer Content Services Las Vegas",
    description: "Complete monthly content systems for Las Vegas automotive dealers — photography, video, social reels, and event coverage.",
    canonical: "/services/dealer",
  });
  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />
      {/* Hero */}
      <section className="section-dark pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="container">
          <AnimFade>
            <p className="section-label text-white/40 mb-6"><span>✦</span><span>DEALER SERVICES</span></p>
          </AnimFade>
          <AnimFade delay={0.1}>
            <h1 className="font-display text-[clamp(2rem,6vw,5.5rem)] leading-[0.88] text-white mb-6 max-w-4xl">CONTENT THAT<br /><span className="text-outline-white">MOVES</span><br />INVENTORY</h1>
          </AnimFade>
          <AnimFade delay={0.2}>
            <p className="font-body text-white/55 text-sm sm:text-base max-w-xl leading-relaxed">
              Monthly content systems built for automotive dealerships — inventory photography, walkaround videos, social reels, event coverage, and CRM intro videos. Fast turnaround. Consistent look.
            </p>
          </AnimFade>
        </div>
      </section>

      {/* 5 Service Cards */}
      <section className="section-light text-[oklch(0.07_0_0)]">
        <div className="container py-16 sm:py-24">
          <AnimFade>
            <p className="section-label text-[oklch(0.07_0_0)/40] mb-10"><span>✦</span><span>FIVE SERVICES</span></p>
          </AnimFade>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_DEALER_SERVICES.map((svc, i) => (
              <motion.div key={svc.slug} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.09 }}
                className="border border-[oklch(0_0_0/0.08)] rounded-2xl p-8 flex flex-col group hover:border-[oklch(0_0_0/0.18)] transition-all duration-200">
                <div className="font-display text-[oklch(0.85_0_0)] text-4xl mb-5">{svc.number}</div>
                <h2 className="font-display-normal text-[oklch(0.07_0_0)] text-sm tracking-widest uppercase mb-3">{svc.title}</h2>
                <p className="font-body text-sm text-[oklch(0.45_0_0)] leading-relaxed mb-6 flex-1">{svc.outcome}</p>
                <button onClick={() => navigate(svc.slug)}
                  className="self-start font-display-normal text-[0.65rem] tracking-widest uppercase text-[oklch(0.07_0_0)] border border-[oklch(0_0_0/0.2)] rounded-full px-5 py-2.5 hover:bg-[oklch(0.07_0_0)] hover:text-white transition-all duration-200">
                  VIEW SERVICE ↗
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scale block */}
      <section className="section-dark">
        <div className="container py-16 sm:py-24">
          <AnimFade>
            <p className="section-label text-white/40 mb-6"><span>✦</span><span>WHO WE WORK WITH</span></p>
            <h2 className="font-display text-[clamp(1.4rem,3.5vw,3rem)] leading-[0.9] text-white mb-6">SINGLE-POINT DEALERS<br />TO MULTI-ROOFTOP GROUPS</h2>
            <p className="font-body text-white/55 text-sm sm:text-base max-w-xl leading-relaxed">
              Whether you're managing 50 vehicles a month or 500, we build content systems that scale with your operation. We're familiar with Lexus, Subaru, and other OEM visual standards for certified programs and co-op submissions.
            </p>
          </AnimFade>
          <AnimFade delay={0.15}>
            <div className="flex flex-wrap gap-3 mt-8">
              {["Las Vegas, NV", "South Florida"].map((loc) => (
                <span key={loc} className="font-body text-xs text-white/50 tracking-widest uppercase border border-white/10 rounded-full px-5 py-2.5">{loc}</span>
              ))}
            </div>
          </AnimFade>
        </div>
      </section>

      <section className="section-dark border-t border-white/5">
        <div className="container py-16 sm:py-24">
          <AnimFade>
            <h2 className="font-display text-[clamp(1.6rem,4.5vw,4rem)] leading-[0.9] text-white mb-8 max-w-2xl">READY TO BOOK<br />A DEALER CALL?</h2>
          </AnimFade>
          <AnimFade delay={0.1}>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate("/contact")} className="btn-pill-light text-xs py-3.5 px-8">BOOK A DEALER CALL +</button>
              <button onClick={() => navigate("/projects")} className="btn-pill-outline text-xs py-3.5 px-8 !text-white !border-white/20 hover:!bg-white/10">VIEW PROJECTS ↗</button>
            </div>
          </AnimFade>
        </div>
      </section>
      <ContactSection />
    </div>
  );
}

/* ─── 01 INVENTORY PHOTOGRAPHY ─────────────────────────────── */
export function DealerInventoryPhotographyPage() {
  useSEO({
    title: "Inventory Photography Las Vegas Dealers",
    description: "High-volume dealership inventory photography in Las Vegas — consistent lighting, same-day delivery, ready for VDP and AutoTrader.",
    canonical: "/services/dealer/01-inventory-photography",
  });
  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />
      <Breadcrumbs service="Inventory Photography" />
      <SubpageHero
        label="INVENTORY PHOTOGRAPHY"
        number="01"
        headline={<>DEALERSHIP<br /><span className="text-outline-white">INVENTORY</span><br />PHOTOGRAPHY</>}
        sub="High-volume lot photography with consistent lighting, angles, and color grading — ready for your VDP, AutoTrader, Cars.com, and social media the same day."
      />
      <SolvesSection items={[
        "Inconsistent lot photos that make your inventory look lower-quality than it is — costing you clicks and leads before a buyer ever calls.",
        "Slow turnaround that leaves new arrivals sitting unshot for days while competitors move similar units with polished visuals.",
        "OEM co-op submissions and certified program requirements that demand a consistent, brand-standard look across every vehicle.",
      ]} />
      <DeliverablesSection items={[
        "Exterior shots — full 360° coverage with consistent angle sequence (front 3/4, side, rear 3/4, rear, front)",
        "Interior shots — dash, seats, cargo area, and key feature callouts",
        "Detail shots — wheels, badging, sunroof, and any notable options",
        "Color-corrected, retouched final images optimized for web and VDP upload",
        "Organized delivery by VIN or stock number — ready to import directly into your DMS or website",
        "Same-day or next-day delivery depending on volume and schedule",
        "OEM-compliant formatting available for Lexus, Subaru, and other certified programs",
      ]} />
      <WorkflowSection steps={[
        { title: "Plan", desc: "We confirm your lot schedule, vehicle count, and any OEM or brand requirements before arriving on-site.", time: "1–2 days prior" },
        { title: "Capture", desc: "On-site shoot with professional lighting equipment — typically 8–15 minutes per vehicle depending on options and detail level.", time: "Day of shoot" },
        { title: "Edit", desc: "Color correction, background cleanup, and consistent finishing applied to every image in the batch.", time: "Same day – 24 hours" },
        { title: "Deliver", desc: "Organized gallery or direct file transfer, sorted by VIN or stock number and ready for upload.", time: "24–48 hours typical" },
      ]} />
      <BestForSection items={["New Arrivals", "Used Inventory Pushes", "OEM Certified Programs", "Co-Op Submissions", "High-Volume Lots", "Multi-Rooftop Groups"]} />
      <FAQSection items={[
        { q: "How many vehicles can you shoot in a day?", a: "Typically 30–60 vehicles per day depending on vehicle type, lot layout, and detail level required. We'll confirm capacity during scheduling." },
        { q: "Do you shoot indoors or outdoors?", a: "Both. We adapt to your facility — outdoor lot shoots, indoor showroom sessions, or a combination. We bring portable lighting for indoor work." },
        { q: "Can you match OEM brand standards?", a: "Yes. We're familiar with Lexus, Subaru, and other OEM visual guidelines and can shoot to match manufacturer requirements for certified and co-op programs." },
        { q: "How are photos delivered?", a: "Via an organized online gallery or direct file transfer, sorted by VIN or stock number. We can also deliver in formats compatible with your DMS or website platform." },
        { q: "What if a vehicle arrives after the shoot?", a: "We can schedule add-on sessions for late arrivals or new units. Many clients set up a recurring weekly or bi-weekly schedule to keep their inventory current." },
      ]} />
      <CTABlock />
      <OtherServicesSection current="/services/dealer/01-inventory-photography" />
      <ContactSection />
    </div>
  );
}

/* ─── 02 SHORT-FORM REELS ───────────────────────────────────── */
export function DealerShortFormReelsPage() {
  useSEO({
    title: "Short-Form Reels for Car Dealers Vegas",
    description: "Vertical video reels for Las Vegas dealerships — engineered for Instagram, TikTok, and YouTube Shorts to drive inbound traffic.",
    canonical: "/services/dealer/02-short-form-reels",
  });
  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />
      <Breadcrumbs service="Short-Form Reels" />
      <SubpageHero
        label="SHORT-FORM REELS"
        number="02"
        headline={<>DEALER<br /><span className="text-outline-white">SHORT-FORM</span><br />REELS</>}
        sub="Vertical video content engineered for Instagram Reels, TikTok, and YouTube Shorts — built to stop the scroll, showcase your inventory, and drive inbound traffic to your lot."
      />
      <SolvesSection items={[
        "Low organic reach on social media because static posts and long-form content no longer perform — short-form video is the primary discovery format on every major platform.",
        "Inconsistent posting that makes your dealership look inactive or unprofessional to buyers who check your social presence before visiting.",
        "Generic content that looks like every other dealer — reels built around your specific inventory, team, and brand voice stand out and build audience loyalty.",
      ]} />
      <DeliverablesSection items={[
        "Vertical 9:16 reels optimized for Instagram Reels, TikTok, and YouTube Shorts",
        "Horizontal 16:9 versions for Facebook, YouTube, and website embeds",
        "On-screen text overlays, captions, and branded lower-thirds",
        "Background music licensed for commercial social media use",
        "Multiple content formats per session: vehicle spotlights, lot tours, team features, event teasers",
        "Color-graded, audio-balanced final exports ready to post",
        "Delivery within 48–72 hours of shoot",
      ]} />
      <WorkflowSection steps={[
        { title: "Plan", desc: "We align on content themes, vehicles to feature, and any campaign or promotion to support before the shoot.", time: "1–3 days prior" },
        { title: "Capture", desc: "On-site video production — vehicle b-roll, lot movement, team moments, and any scripted or unscripted segments.", time: "Day of shoot" },
        { title: "Edit", desc: "Editing, color grading, music sync, text overlays, and format exports for each platform.", time: "24–48 hours post-shoot" },
        { title: "Deliver", desc: "Final files delivered in platform-ready formats with posting guidance and suggested captions.", time: "48–72 hours typical" },
      ]} />
      <BestForSection items={["New Model Arrivals", "Weekend Sales Events", "Inventory Spotlights", "Team Culture Content", "Seasonal Campaigns", "Brand Awareness Pushes"]} />
      <FAQSection items={[
        { q: "How many reels do you produce per session?", a: "Typically 3–6 finished reels per half-day session, depending on content variety and complexity. Monthly retainer packages are structured around a set number of deliverables." },
        { q: "Do you handle posting and scheduling?", a: "We deliver ready-to-post files. Scheduling and posting can be added as part of a social media management retainer — contact us to discuss." },
        { q: "What if we want to feature a specific vehicle or promotion?", a: "We build content around your current inventory and campaigns. Just let us know what you want to highlight before the shoot and we'll plan accordingly." },
        { q: "Can you produce content for multiple platforms at once?", a: "Yes. We shoot and edit for multiple formats in a single session — vertical for Reels/TikTok/Shorts and horizontal for Facebook and YouTube." },
      ]} />
      <CTABlock />
      <OtherServicesSection current="/services/dealer/02-short-form-reels" />
      <ContactSection />
    </div>
  );
}

/* ─── 03 WALKAROUND VIDEOS ─────────────────────────────────── */
export function DealerWalkaroundVideosPage() {
  useSEO({
    title: "Walkaround Videos for Dealerships Vegas",
    description: "Cinematic vehicle walkaround videos for Las Vegas dealers — produced to a consistent standard for VDP, YouTube, and social media.",
    canonical: "/services/dealer/03-walkaround-videos",
  });
  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />
      <Breadcrumbs service="Walkaround Videos" />
      <SubpageHero
        label="WALKAROUND VIDEOS"
        number="03"
        headline={<>VEHICLE<br /><span className="text-outline-white">WALKAROUND</span><br />VIDEOS</>}
        sub="Cinematic vehicle walkarounds that showcase features, build buyer confidence, and drive engagement on your VDP, YouTube channel, and social media — produced to a consistent standard across every unit."
      />
      <SolvesSection items={[
        "Buyers who browse online but never call because static photos don't communicate the feel, features, or condition of a vehicle the way video does.",
        "VDP pages with low engagement and high bounce rates — walkaround videos increase time-on-page and give buyers a reason to take the next step.",
        "Sales team bandwidth — a well-produced walkaround video answers common buyer questions before the first contact, making every lead more qualified.",
      ]} />
      <DeliverablesSection items={[
        "Full exterior walkaround — front, sides, rear, wheels, and key body details",
        "Interior tour — dash, infotainment, seating, cargo, and notable features",
        "Feature callouts — technology, safety systems, powertrain highlights",
        "Branded intro and outro with dealership name and contact information",
        "Horizontal 16:9 master for YouTube and VDP embed",
        "Vertical 9:16 cut for social media distribution",
        "Color-graded, audio-balanced final exports",
        "Delivery within 48–72 hours of shoot",
      ]} />
      <WorkflowSection steps={[
        { title: "Plan", desc: "We confirm the vehicle list, key features to highlight, and any brand or OEM guidelines to follow.", time: "1–2 days prior" },
        { title: "Capture", desc: "On-site production — exterior movement, interior detail shots, and feature demonstrations.", time: "Day of shoot" },
        { title: "Edit", desc: "Cinematic color grade, audio mix, branded graphics, and format exports for all intended platforms.", time: "24–48 hours post-shoot" },
        { title: "Deliver", desc: "Final files delivered in platform-ready formats, organized by VIN or stock number.", time: "48–72 hours typical" },
      ]} />
      <BestForSection items={["New Arrivals", "Certified Pre-Owned Units", "High-Value Vehicles", "Model Launches", "VDP Optimization", "YouTube Channel Growth"]} />
      <FAQSection items={[
        { q: "How long is a typical walkaround video?", a: "Standard walkarounds run 2–4 minutes. We can produce shorter 60–90 second cuts for social media distribution from the same shoot." },
        { q: "Do you include voiceover or on-camera presentation?", a: "We can produce narrated walkarounds with a sales rep or voiceover, or clean b-roll versions with text overlays — depending on your preference." },
        { q: "Can these be embedded directly into our VDP?", a: "Yes. We deliver in formats compatible with most dealer website platforms and can provide YouTube-hosted links for easy VDP embed." },
        { q: "How many vehicles can you cover in a session?", a: "Typically 4–8 walkaround videos per half-day session, depending on vehicle complexity and feature depth." },
      ]} />
      <CTABlock />
      <OtherServicesSection current="/services/dealer/03-walkaround-videos" />
      <ContactSection />
    </div>
  );
}

/* ─── 04 DEALERSHIP EVENTS ─────────────────────────────────── */
export function DealerEventsPage() {
  useSEO({
    title: "Dealership Event Coverage Las Vegas",
    description: "Photo and video coverage for Las Vegas dealership sales events, model launches, and community activations — same-day social delivery.",
    canonical: "/services/dealer/04-dealership-events",
  });
  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />
      <Breadcrumbs service="Dealership Events" />
      <SubpageHero
        label="DEALERSHIP EVENTS"
        number="04"
        headline={<>DEALERSHIP<br /><span className="text-outline-white">EVENT</span><br />COVERAGE</>}
        sub="Full photo and video coverage for sales events, model launches, community activations, and dealership milestones — delivered fast enough to support same-day social posting."
      />
      <SolvesSection items={[
        "Events that happen and leave no usable content behind — no photos for social, no video for recap, nothing to show sponsors or OEM partners.",
        "Inconsistent event documentation that looks amateur compared to the effort and budget that went into the event itself.",
        "Missed marketing windows — same-day selects and fast turnaround keep your event content relevant while the moment is still fresh.",
      ]} />
      <DeliverablesSection items={[
        "Full event photo coverage — candid moments, keynote speakers, vehicle reveals, guest interactions",
        "Same-day select gallery (curated edited photos delivered day-of for immediate social posting)",
        "Highlight reel — cinematic short-form video capturing the energy and story of the event",
        "Recap video — longer-form structured recap for post-event marketing and sponsor reporting",
        "Branded lower-thirds and graphics consistent with your dealership identity",
        "Drone coverage available for outdoor events and lot activations",
        "Organized final gallery delivered within 48–72 hours of event",
      ]} />
      <WorkflowSection steps={[
        { title: "Plan", desc: "Pre-event briefing to confirm schedule, key moments to capture, brand requirements, and same-day deliverable expectations.", time: "1 week prior" },
        { title: "Capture", desc: "On-site coverage for the full event duration — photo and video running simultaneously with a structured shot list.", time: "Day of event" },
        { title: "Edit", desc: "Same-day selects edited and delivered during or immediately after the event. Full gallery and highlight reel in post-production.", time: "Same day + 48–72 hours" },
        { title: "Deliver", desc: "Organized final gallery, highlight reel, and recap video delivered in web-ready and social-ready formats.", time: "48–72 hours post-event" },
      ]} />
      <BestForSection items={["New Model Launches", "Sales Campaigns", "Community Events", "OEM Activations", "Dealership Anniversaries", "Charity Partnerships"]} />
      <FAQSection items={[
        { q: "Can you handle multi-day events?", a: "Yes. We cover multi-day events with a structured schedule — daily selects, running recap, and a full final delivery after the last day." },
        { q: "Do you provide same-day content for social media?", a: "Yes. Same-day selects are a standard part of our event coverage — a curated set of edited photos delivered during or immediately after the event for immediate posting." },
        { q: "Can you coordinate with OEM or brand representatives on-site?", a: "Yes. We're experienced working alongside OEM field teams, brand reps, and event coordinators and can adapt to any on-site requirements." },
        { q: "Is drone coverage available for outdoor events?", a: "Yes. Drone coverage is available as an add-on for outdoor events and lot activations — subject to local airspace regulations and weather." },
      ]} />
      <CTABlock />
      <OtherServicesSection current="/services/dealer/04-dealership-events" />
      <ContactSection />
    </div>
  );
}

/* ─── 05 CRM INTRO VIDEOS ──────────────────────────────────── */
export function DealerCRMIntroVideosPage() {
  useSEO({
    title: "CRM Intro Videos for Car Dealers Vegas",
    description: "Personalized CRM video messages for Las Vegas dealership sales reps — built to humanize follow-up and improve appointment show rates.",
    canonical: "/services/dealer/05-crm-intro-videos",
  });
  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />
      <Breadcrumbs service="Intro Videos for CRM" />
      <SubpageHero
        label="INTRO VIDEOS FOR CRM"
        number="05"
        headline={<>CRM INTRO<br /><span className="text-outline-white">VIDEOS FOR</span><br />DEALERSHIPS</>}
        sub="Personalized sales rep and advisor videos built specifically for CRM automation — designed to humanize follow-up, increase message engagement, and improve appointment show rates."
      />

      {/* Why This Works */}
      <section className="bg-[oklch(0.11_0_0)]">
        <div className="container py-14 sm:py-20">
          <AnimFade>
            <p className="section-label text-white/40 mb-8"><span>✦</span><span>WHY THIS WORKS</span></p>
          </AnimFade>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Humanizes Follow-Up", desc: "A face and a voice replace a generic text — buyers respond to people, not automated messages." },
              { title: "Increases Engagement", desc: "Video messages consistently outperform text-only follow-up in open rates and reply rates across CRM platforms." },
              { title: "Reduces Lead Drop-Off", desc: "Personalized video keeps leads engaged through the buying cycle instead of going cold between touchpoints." },
              { title: "Consistent Dealership Voice", desc: "Every rep delivers the same professional, on-brand experience — regardless of individual communication style." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-white/10 rounded-2xl p-6">
                <h3 className="font-display-normal text-white text-xs tracking-widest uppercase mb-3">{item.title}</h3>
                <p className="font-body text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SolvesSection items={[
        "CRM follow-up that feels robotic and impersonal — buyers who receive a video from their actual sales rep are far more likely to respond than those who receive a form email.",
        "Low appointment show rates caused by weak confirmation touchpoints — a personalized video confirmation from the sales rep or manager significantly increases show-up rates.",
        "Inconsistent rep communication that makes your dealership look disorganized — a library of branded video templates gives every rep a professional, on-brand voice.",
      ]} />

      <DeliverablesSection items={[
        "Sales rep intro videos — vertical (9:16) and horizontal (16:9) versions per rep",
        "Service advisor intro videos (optional add-on)",
        "Manager or GM welcome video (optional add-on)",
        "Script templates for: new lead response, appointment confirmation, missed appointment follow-up, post-visit thank you, vehicle walkaround handoff",
        "Clean branded lower-thirds — name, title, dealership name (no heavy graphics)",
        "Audio-clean, color-matched deliverables consistent across all reps",
        "Export formats optimized for CRM platforms and text/email embedding",
        "How-to guide: using these videos inside your CRM (non-technical, step-by-step)",
      ]} />

      <WorkflowSection steps={[
        { title: "Plan", desc: "We confirm the rep list, script templates, brand guidelines, and CRM platform requirements before the shoot day.", time: "3–5 days prior" },
        { title: "Capture", desc: "On-site or studio session — each rep records their intro and any scripted templates in a single efficient session.", time: "Half-day to full day" },
        { title: "Edit", desc: "Color grade, audio clean-up, branded lower-thirds, and format exports for each rep and each use case.", time: "3–5 business days" },
        { title: "Deliver", desc: "Organized final files by rep and use case, with the how-to guide for CRM implementation.", time: "5–7 business days typical" },
      ]} />

      <BestForSection items={["Sales Team Follow-Up", "Appointment Confirmation", "Missed Appointment Recovery", "Post-Visit Thank You", "New Lead Response", "Service Department Outreach"]} />

      <FAQSection items={[
        { q: "Which CRM platforms do these videos work with?", a: "Most modern CRM platforms support video embedding or linking — including VinSolutions, DealerSocket, Elead, and others. We deliver in formats that work across all major platforms and provide guidance on implementation." },
        { q: "How many reps can you cover in a single session?", a: "A half-day session typically covers 4–8 reps depending on the number of script templates per person. Larger teams can be scheduled across multiple sessions." },
        { q: "Do you write the scripts?", a: "We provide proven script templates for each use case (new lead, confirmation, missed appointment, etc.) and can customize them to match your dealership's voice and process." },
        { q: "Do the videos need to be re-shot when reps change?", a: "Only for the departing rep. The script templates and brand assets remain the same — new reps can be added in a short add-on session without reshooting the full library." },
        { q: "Can service advisors use these too?", a: "Yes. Service advisor intro videos are available as an add-on and follow the same format — intro, appointment confirmation, and post-visit follow-up templates." },
      ]} />

      <CTABlock />
      <OtherServicesSection current="/services/dealer/05-crm-intro-videos" />
      <ContactSection />
    </div>
  );
}
