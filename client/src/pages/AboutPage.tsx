/* ============================================================
   AboutPage — Our Story
   Style: Alternating dark/light sections, Unusually-inspired
   Large bold display text, clean body copy, full-width layout
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";

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

export default function AboutPage() {
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
              BUILT TO<br />
              <span className="text-outline-white">MAKE BRANDS</span><br />
              LOOK PREMIUM
            </h1>
          </AnimFade>
          <AnimFade delay={0.2}>
            <p className="font-body text-white/50 text-sm tracking-widest uppercase mb-0">
              Las Vegas · Henderson · Southern Nevada
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
                SOUTHERN<br />
                NEVADA'S<br />
                <span className="text-[oklch(0.78_0_0)]">PREMIER</span><br />
                PRODUCTION<br />
                COMPANY
              </h2>
            </AnimFade>

            {/* Right: body copy */}
            <div className="space-y-6">
              <AnimFade delay={0.1}>
                <p className="font-body text-base sm:text-lg text-[oklch(0.2_0_0)] leading-relaxed">
                  Loomelic Media is a Las Vegas–based production company built to help brands look premium, consistent, and unmistakably professional—on every platform, every time. We create high-end photo and video for weddings, corporate events, real estate, and lifestyle, with a specialty in automotive content that makes inventory, people, and dealership culture stand out.
                </p>
              </AnimFade>

              <AnimFade delay={0.15}>
                <p className="font-body text-base sm:text-lg text-[oklch(0.2_0_0)] leading-relaxed">
                  I've been in love with photography since I was young, and after 20 years in the corporate world, I started Loomelic Media to combine creative craft with real-world execution. That means our work isn't just "good looking"—it's organized, on-brand, and designed to perform.
                </p>
              </AnimFade>

              <AnimFade delay={0.2}>
                <p className="font-body text-base sm:text-lg text-[oklch(0.2_0_0)] leading-relaxed">
                  From cinematic walkarounds and event coverage to headshots, social media content systems, and polished reporting, we bring structure to the creative so your marketing stays consistent and scalable.
                </p>
              </AnimFade>

              <AnimFade delay={0.25}>
                <p className="font-body text-base sm:text-lg text-[oklch(0.2_0_0)] leading-relaxed">
                  We're known for clean visuals, fast turnaround, and a sharp understanding of what brands actually need: content that looks like it belongs at the top of the market. Whether you're a couple planning your wedding, a business launching a campaign, or a dealership managing inventory and promotions at scale, Loomelic Media delivers visuals that match the level you want to be seen at.
                </p>
              </AnimFade>

              <AnimFade delay={0.3}>
                <div className="pt-4 flex flex-wrap gap-3">
                  <Link href="/contact" className="btn-pill-dark text-xs">
                    GET IN TOUCH +
                  </Link>
                  <Link href="/services/automotive-marketing" className="btn-pill-outline !text-[oklch(0.07_0_0)] !border-[oklch(0_0_0/0.2)] hover:!bg-[oklch(0.07_0_0)] hover:!text-white text-xs">
                    VIEW SERVICES ↗
                  </Link>
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
            {[
              {
                num: "01",
                title: "CLEAN VISUALS",
                body: "Every frame is composed with intention. No filler, no fluff — only imagery that earns its place in your brand story."
              },
              {
                num: "02",
                title: "FAST TURNAROUND",
                body: "We operate on dealership timelines and event deadlines. Same-day social delivery, rapid post-production, and reliable delivery windows."
              },
              {
                num: "03",
                title: "BRAND CONSISTENCY",
                body: "Your content should look the same quality across every platform. We build systems, not one-offs, so your marketing scales."
              },
              {
                num: "04",
                title: "STRUCTURED CREATIVE",
                body: "Twenty years of corporate execution behind the camera. We bring process, reporting, and accountability to every production."
              },
              {
                num: "05",
                title: "PREMIUM POSITIONING",
                body: "We work with brands that want to be seen at the top of their market — and we produce content that earns that position."
              },
              {
                num: "06",
                title: "REAL PARTNERSHIP",
                body: "From single shoots to ongoing monthly retainers, we integrate with your team and become a reliable extension of your marketing operation."
              },
            ].map((item, i) => (
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

      {/* Clients — light */}
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
              "M&MM UNITED",
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
              We work with dealership groups, event organizers, lifestyle brands, and businesses across Las Vegas, Henderson, and Southern Nevada.
            </p>
          </AnimFade>
        </div>
      </section>

      {/* CTA — dark */}
      <section className="section-dark">
        <div className="container py-20 sm:py-28">
          <AnimFade>
            <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.88] text-white mb-8">
              LET'S<br />
              <span className="text-outline-white">BUILD</span><br />
              TOGETHER
            </h2>
          </AnimFade>
          <AnimFade delay={0.15}>
            <p className="font-body text-white/60 text-base sm:text-lg max-w-xl mb-10">
              Ready to produce content that matches the level you want to be seen at? Let's talk about your project.
            </p>
          </AnimFade>
          <AnimFade delay={0.2}>
            <div className="flex flex-wrap gap-4">
              <Link href="/#contact" className="btn-pill-light text-sm">
                START A PROJECT +
              </Link>
              <Link href="/#projects" className="btn-pill-outline text-sm">
                VIEW OUR WORK ↗
              </Link>
            </div>
          </AnimFade>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[oklch(0.04_0_0)] border-t border-white/5 py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/25 tracking-widest">
            © 2026 LOOMELIC MEDIA · LAS VEGAS, NV
          </p>
          <Link href="/" className="font-body text-xs text-white/25 hover:text-white/60 transition-colors tracking-widest">
            ← BACK TO HOME
          </Link>
        </div>
      </footer>
    </div>
  );
}
