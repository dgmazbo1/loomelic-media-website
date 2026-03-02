/* ============================================================
   AboutPage — Dealer-acquisition rebuild
   Design: Dealer-focused story, values, FAQ, CTA
   ============================================================ */
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { ChevronDown } from "lucide-react";

function AnimFade({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const VALUES = [
  { num: "01", title: "CLEAN VISUALS", body: "Every frame is composed with intention. No filler, no fluff — only imagery that earns its place in your brand story." },
  { num: "02", title: "FAST TURNAROUND", body: "We operate on dealership timelines and event deadlines. Same-day social delivery, rapid post-production, and reliable delivery windows." },
  { num: "03", title: "BRAND CONSISTENCY", body: "Your content should look the same quality across every platform. We build systems, not one-offs, so your marketing scales." },
  { num: "04", title: "STRUCTURED CREATIVE", body: "Twenty years of corporate execution behind the camera. We bring process, reporting, and accountability to every production." },
  { num: "05", title: "PREMIUM POSITIONING", body: "We work with brands that want to be seen at the top of their market — and we produce content that earns that position." },
  { num: "06", title: "REAL PARTNERSHIP", body: "From single shoots to ongoing monthly retainers, we integrate with your team and become a reliable extension of your marketing operation." },
];

const FAQS = [
  {
    q: "How quickly do you deliver photos after a shoot?",
    a: "Standard delivery is 24–48 hours for inventory photography. Event coverage is typically 48–72 hours. Rush delivery is available on request.",
  },
  {
    q: "Do you offer monthly retainer packages?",
    a: "Yes. Our most popular option is a monthly retainer that includes photography, video, and social content on a recurring schedule. For dealerships, we build a content calendar around your lot cycle and upcoming events. For other businesses, we tailor the scope to your needs.",
  },
  {
    q: "What areas do you serve?",
    a: "We're based in Las Vegas, NV and serve clients across the greater Las Vegas area. We also operate in South Florida, serving Miami, Fort Lauderdale, Boca Raton, and surrounding areas. We travel for larger productions — contact us to discuss.",
  },
  {
    q: "Can you handle multiple vehicles in a single session?",
    a: "Absolutely. We're set up for high-volume inventory shoots — we can photograph an entire lot in a single session with consistent quality across every vehicle.",
  },
  {
    q: "Do you work with OEM brand guidelines?",
    a: "Yes. We're familiar with Lexus, Subaru, and other OEM visual standards and can shoot to match manufacturer requirements for certified programs and co-op submissions.",
  },
  {
    q: "What's the best way to get started?",
    a: "The fastest way is to fill out the contact form below or call us directly at 702-827-4110. We'll schedule a 30-minute discovery call to understand your needs and put together a content plan.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-6 text-left group"
      >
        <span className="font-body text-sm sm:text-base text-white/80 group-hover:text-white transition-colors leading-snug">{q}</span>
        <ChevronDown
          size={18}
          className={`text-white/40 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm text-white/55 leading-relaxed pb-6 max-w-2xl">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AboutPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />

      {/* Hero — dark */}
      <section className="section-dark pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="container">
          <AnimFade>
            <p className="section-label text-white/40 mb-6">
              <span>✦</span><span>OUR STORY</span>
            </p>
          </AnimFade>
          <AnimFade delay={0.1}>
            <h1 className="font-display text-[clamp(4rem,12vw,11rem)] leading-[0.88] text-white mb-8">
              BUILT FOR<br />
              <span className="text-outline-white">DEALERSHIPS</span><br />
              THAT WANT MORE
            </h1>
          </AnimFade>
          <AnimFade delay={0.2}>
            <p className="font-body text-white/50 text-sm tracking-widest uppercase">
              Las Vegas · Henderson
            </p>
          </AnimFade>
        </div>
      </section>

      {/* Main story — light */}
      <section className="section-light text-[oklch(0.07_0_0)]">
        <div className="container py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start">

            {/* Left: big pull quote */}
            <AnimFade>
              <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.92] text-[oklch(0.07_0_0)] sticky top-28">
                SOUTHERN NEVADA<br />
                <span className="text-[oklch(0.78_0_0)]">&amp; SOUTH FL</span><br />
                DEALER CONTENT<br />
                PARTNER
              </h2>
            </AnimFade>

            {/* Right: body copy */}
            <div className="space-y-6">
              <AnimFade delay={0.1}>
                <p className="font-body text-base sm:text-lg text-[oklch(0.2_0_0)] leading-relaxed">
                  Loomelic Media is a Las Vegas–based production company creating high-end photo and video that helps dealerships and brands look premium, consistent, and unmistakably professional across every platform. We specialize in automotive content — inventory, dealership culture, events, headshots, and drone — plus large convention and event coverage for clients who need polished visuals on tight timelines.
                </p>
              </AnimFade>

              <AnimFade delay={0.15}>
                <p className="font-body text-base sm:text-lg text-[oklch(0.2_0_0)] leading-relaxed">
                  Founded by Denham Gallimore, a South Florida native with 20 years of corporate experience, Loomelic Media started as a hobby through off-roading and working with major off-road brands. Denham spent years consulting with Fortune 500 companies in the tech world before leaving the corporate space in 2024 to build the company full-time. In January 2026, we launched our South Florida division to better support clients across both regions.
                </p>
              </AnimFade>

              <AnimFade delay={0.2}>
                <p className="font-body text-base sm:text-lg text-[oklch(0.2_0_0)] leading-relaxed">
                  Our focus is simple: clean visuals, strong creative direction, fast turnaround, and a structured process that keeps your marketing on-brand and scalable — whether you're moving 50 vehicles a month or 500.
                </p>
              </AnimFade>

              <AnimFade delay={0.3}>
                <div className="pt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate("/contact")}
                    className="btn-pill-dark text-xs"
                  >
                    GET IN TOUCH +
                  </button>
                  <button
                    onClick={() => navigate("/services")}
                    className="btn-pill-outline !text-[oklch(0.07_0_0)] !border-[oklch(0_0_0/0.2)] hover:!bg-[oklch(0.07_0_0)] hover:!text-white text-xs"
                  >
                    VIEW SERVICES ↗
                  </button>
                </div>
              </AnimFade>
            </div>
          </div>
        </div>
      </section>

      {/* Values — dark */}
      <section className="section-dark">
        <div className="container py-16 sm:py-24 lg:py-32">
          <AnimFade>
            <p className="section-label text-white/40 mb-8">
              <span>✦</span><span>WHAT WE STAND FOR</span>
            </p>
          </AnimFade>
          <AnimFade delay={0.1}>
            <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.88] text-white mb-16">
              HOW WE<br />
              <span className="text-outline-white">OPERATE</span>
            </h2>
          </AnimFade>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {VALUES.map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="bg-[oklch(0.07_0_0)] p-8 sm:p-10"
              >
                <div className="font-display text-[oklch(0.3_0_0)] text-5xl mb-6">{item.num}</div>
                <h3 className="font-display-normal text-white text-lg tracking-widest mb-3">{item.title}</h3>
                <p className="font-body text-sm text-white/50 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By — light */}
      <section className="section-light text-[oklch(0.07_0_0)]">
        <div className="container py-16 sm:py-24">
          <AnimFade>
            <p className="section-label text-[oklch(0.07_0_0)/50] mb-8">
              <span>✦</span><span>TRUSTED BY</span>
            </p>
          </AnimFade>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-12">
            {[
              "LEXUS OF LAS VEGAS",
              "LEXUS OF HENDERSON",
              "LAS VEGAS RAIDERS",
              "CENTENNIAL SUBARU",
              "SPORTS ILLUSTRATED",
            ].map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 16 }}
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
          <AnimFade delay={0.2}>
            <p className="font-body text-sm text-[oklch(0.5_0_0)] max-w-xl">
              We work with dealership groups, event organizers, lifestyle brands, and businesses across Las Vegas.
            </p>
          </AnimFade>
        </div>
      </section>

      {/* FAQ — dark */}
      <section className="section-dark">
        <div className="container py-16 sm:py-24">
          <AnimFade>
            <p className="section-label text-white/40 mb-6">
              <span>✦</span><span>FREQUENTLY ASKED —</span>
            </p>
            <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] text-white mb-12">
              DEALER<br />
              <span className="text-[oklch(0.45_0_0)]">FAQ</span>
            </h2>
          </AnimFade>

          <div className="max-w-3xl">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <FAQItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
