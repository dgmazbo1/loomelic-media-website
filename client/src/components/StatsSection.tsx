/* ============================================================
   StatsSection — Unusually-inspired
   Style: Light background, "CHOOSE EXCELLENCE" huge left-aligned text,
          GET IN TOUCH pill right, left: video/image, right: 2 stat boxes stacked
   ============================================================ */

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";

import { HERO_VIDEOS } from "@/lib/media";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, count, to]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

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

export default function StatsSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section-light text-[oklch(0.07_0_0)]">
      <div className="container py-16 sm:py-24 lg:py-32">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <AnimFade>
            <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.88] text-[oklch(0.07_0_0)]">
              CHOOSE<br />
              <span className="text-[oklch(0.78_0_0)]">EXCELLENCE</span>
            </h2>
          </AnimFade>
          <AnimFade delay={0.15}>
            <button onClick={() => scrollTo("contact")} className="btn-pill-dark text-xs self-start sm:self-end mb-2">
              GET IN TOUCH +
            </button>
          </AnimFade>
        </div>

        {/* Content: image left + stats right */}
        <div className="grid md:grid-cols-[1fr_1fr] gap-4 sm:gap-6">
          {/* Left: image/video */}
          <AnimFade delay={0.1} className="relative rounded-2xl overflow-hidden bg-[oklch(0.12_0_0)] aspect-[4/3] md:aspect-auto md:min-h-[400px]">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              src={HERO_VIDEOS.lexusRoll}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <span className="font-display-normal text-white text-sm tracking-widest">LOOMELIC ®</span>
            </div>
          </AnimFade>

          {/* Right: stat boxes */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Stat 1 */}
            <AnimFade delay={0.15} className="card-light p-7 sm:p-9 flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-display text-[clamp(3rem,8vw,5.5rem)] leading-none text-[oklch(0.07_0_0)]">
                    +<CountUp to={50} />
                  </div>
                  <div className="w-8 h-px bg-[oklch(0.07_0_0)/20] my-3" />
                  <p className="font-body text-sm font-semibold text-[oklch(0.07_0_0)]">Successful Projects<br />Completed</p>
                </div>
                <span className="text-[oklch(0.87_0_0)] text-2xl mt-1">✦</span>
              </div>
              <p className="font-body text-xs text-[oklch(0.5_0_0)] leading-relaxed mt-4">
                From luxury automotive campaigns to emotional wedding films, we've delivered exceptional results for clients across Las Vegas and beyond.
              </p>
            </AnimFade>

            {/* Stat 2 */}
            <AnimFade delay={0.2} className="card-light p-7 sm:p-9 flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-display text-[clamp(3rem,8vw,5.5rem)] leading-none text-[oklch(0.07_0_0)]">
                    <CountUp to={98} suffix="%" />
                  </div>
                  <div className="w-8 h-px bg-[oklch(0.07_0_0)/20] my-3" />
                  <p className="font-body text-sm font-semibold text-[oklch(0.07_0_0)]">Customer<br />Satisfaction Rate</p>
                </div>
                <span className="text-[oklch(0.87_0_0)] text-2xl mt-1">✦</span>
              </div>
              <p className="font-body text-xs text-[oklch(0.5_0_0)] leading-relaxed mt-4">
                We measure success by the impact we create. Our clients trust us to deliver solutions that exceed expectations every single time.
              </p>
            </AnimFade>
          </div>
        </div>
      </div>
    </section>
  );
}
