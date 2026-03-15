/* ============================================================
   UseCases — /use-cases
   Sections: Hero → Positioning → Featured Grid → Expanded Details
             → SEO Block → Final CTA
   Design: Matches Loomelic dark/luxury brand language exactly.
   Scalable: USE_CASES array — add new entries without redesigning.
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { ArrowRight, ArrowDown, Target, TrendingUp, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";

/* ─── ANIMATION HELPER ─────────────────────────────────────── */
function AnimFade({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
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

/* ─── USE CASES DATA ────────────────────────────────────────── */
// To add a new use case: append an object to this array.
// The grid and detail sections render automatically.
const USE_CASES = [
  {
    id: "centennial-subaru",
    client: "CENTENNIAL SUBARU",
    category: "USED CAR CAMPAIGN · DEALERSHIP SOCIAL MEDIA · CONTENT STRATEGY",
    challenge: "Used inventory was moving but wasn't generating enough weekend traffic or online urgency.",
    solution: "A trio-based weekend special campaign with boosted social ads targeting in-market Las Vegas shoppers.",
    result: "Customers came into the dealership after seeing the ads. Used car sales momentum improved since launch.",
    seoTitle: "Centennial Subaru Used Car Weekend Special Case Study | Loomelic Media",
    seoDesc: "See how Loomelic Media helped Centennial Subaru promote a trio of used cars with a weekend special campaign, boosted social ads, and stronger used car sales momentum.",
    overview: "Centennial Subaru needed a stronger way to spotlight used inventory and create more weekend traffic. Instead of featuring a single vehicle, Loomelic Media developed a Weekend Special campaign built around a trio of used cars. The strategy was designed to give shoppers more options, create urgency, and make the dealership's used inventory feel active and worth visiting in person.",
    theChallenge: "Like many dealerships, used inventory can move fast, but getting the right eyes on the right vehicles at the right time requires more than a standard listing post. Centennial Subaru needed a campaign that made used inventory feel timely, visible, and worth acting on before the weekend ended.",
    theStrategy: "Loomelic Media created a used car weekend special concept that highlighted three featured used vehicles in one campaign. This approach gave the dealership more content value in a single post, increased shopper interest by showing options instead of only one unit, and created a stronger promotional angle for weekend traffic.",
    theExecution: "We created content that grouped three featured used vehicles into one clear promotional message. This made the ad feel more substantial than a standard single-car post and gave buyers multiple reasons to stop scrolling and take action. We then boosted the posts to increase local visibility and put the campaign in front of more in-market shoppers in the Las Vegas area.",
    theResult: "Centennial Subaru has seen people come into the dealership after seeing the ads, and the campaign has supported stronger used car sales momentum since launch. By combining a clean creative concept, paid social support, and a timely weekend-focused offer, the dealership was able to turn simple used inventory content into a more effective used car marketing strategy.",
    whyItWorked: "The campaign worked because it combined strong visual presentation, clear timing, local paid reach, and a format that gave buyers multiple vehicle options in one ad. Instead of asking shoppers to care about one used car, it gave them a reason to pay attention to the dealership's used inventory as a whole.",
    tags: ["Used Car Advertising", "Social Media Ads", "Weekend Campaign", "Las Vegas Dealership"],
    icon: Target,
    accent: "oklch(0.92 0.28 142)", // lime
  },
  {
    id: "findlay-nissan-henderson",
    client: "FINDLAY NISSAN HENDERSON",
    category: "INTERNET SALES PROCESS · CRM VIDEO STRATEGY · LEAD RESPONSE CONTENT",
    challenge: "Online leads were receiving generic first responses, reducing engagement quality and early trust.",
    solution: "Custom intro videos for the internet sales team, deployed as part of the first-response workflow.",
    result: "A major change in customers' first response. Early engagement improved and the initial interaction became warmer, clearer, and more effective.",
    seoTitle: "Findlay Nissan Henderson Internet Sales Intro Video Case Study | Loomelic Media",
    seoDesc: "See how Loomelic Media helped Findlay Nissan Henderson improve customer first response with intro videos for the internet sales team and stronger lead engagement.",
    overview: "Findlay Nissan Henderson wanted to improve the way customers experienced the dealership after submitting an online inquiry. Loomelic Media created custom intro videos for the internet sales team to send out as part of the first response process, giving online leads a more personal and more professional first impression.",
    theChallenge: "Online leads move fast, and first response quality can heavily influence whether a customer replies, engages, or disappears. Standard text and email responses often feel generic. Findlay Nissan Henderson needed a better way to make internet leads feel acknowledged quickly and personally.",
    theStrategy: "Loomelic Media developed intro videos for the internet sales team that could be sent out when a customer inquiry came in. The goal was to humanize the dealership's response process, build trust earlier, and create a warmer first point of contact than a plain text or templated email alone.",
    theExecution: "We created dealership-branded intro videos tailored for the internet sales workflow so the team could use them as part of their response process. These videos gave customers an immediate visual introduction to the team and helped the dealership feel more real, responsive, and customer-focused from the start.",
    theResult: "Findlay Nissan Henderson has seen a major change in customers' first response after implementing the intro videos. Early engagement has improved, and the initial interaction now feels warmer, clearer, and more effective.",
    whyItWorked: "The system worked because video built trust faster than a standard written response alone. By helping customers see and hear from the dealership team early in the process, Findlay Nissan Henderson improved the quality of the first interaction and made online inquiries feel more human.",
    tags: ["CRM Video", "Internet Sales", "Lead Response", "Dealership Video Marketing"],
    icon: Zap,
    accent: "oklch(0.75 0.18 250)", // indigo-blue
  },
];

/* ─── HEADING STYLE ─────────────────────────────────────────── */
const displayHeading = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 800,
  letterSpacing: "0.02em",
  textTransform: "uppercase" as const,
  lineHeight: 0.88,
};

/* ─── SECTION DIVIDER ───────────────────────────────────────── */
function SectionLabel({ text }: { text: string }) {
  return (
    <p className="section-label text-white/40 mb-4">
      <span>✦</span><span>{text} —</span>
    </p>
  );
}

/* ─── USE CASE CARD (grid preview) ─────────────────────────── */
function UseCaseCard({ uc, index }: { uc: typeof USE_CASES[0]; index: number }) {
  const Icon = uc.icon;
  return (
    <AnimFade delay={0.1 + index * 0.1}>
      <a
        href={`#${uc.id}`}
        className="group block rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/18 transition-all duration-300 overflow-hidden"
        aria-label={`Read use case: ${uc.client}`}
      >
        {/* Top accent bar */}
        <div className="h-[2px]" style={{ background: uc.accent }} />

        <div className="p-7 sm:p-8">
          {/* Category badge */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 font-body text-[0.55rem] tracking-widest text-white/40 uppercase mb-5">
            {uc.category.split(" · ")[0]}
          </span>

          {/* Icon + Client */}
          <div className="flex items-start gap-4 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: `${uc.accent}18` }}
            >
              <Icon size={18} style={{ color: uc.accent }} />
            </div>
            <div>
              <p className="font-body text-[0.6rem] tracking-[0.2em] text-white/30 uppercase mb-1">{uc.client}</p>
              <p className="font-body text-[0.58rem] tracking-[0.12em] text-white/20 uppercase">{uc.category.split(" · ").slice(1).join(" · ")}</p>
            </div>
          </div>

          {/* Challenge */}
          <div className="mb-4">
            <p className="font-body text-[0.6rem] tracking-[0.15em] text-white/30 uppercase mb-1.5">The Challenge</p>
            <p className="font-body text-sm text-white/60 leading-relaxed">{uc.challenge}</p>
          </div>

          {/* Solution */}
          <div className="mb-6">
            <p className="font-body text-[0.6rem] tracking-[0.15em] text-white/30 uppercase mb-1.5">The Solution</p>
            <p className="font-body text-sm text-white/60 leading-relaxed">{uc.solution}</p>
          </div>

          {/* Result headline */}
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/6 mb-6">
            <p className="font-body text-[0.55rem] tracking-[0.18em] text-white/25 uppercase mb-1">Result</p>
            <p className="font-body text-sm text-white/80 leading-relaxed">{uc.result}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {uc.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/8 font-body text-[0.52rem] tracking-widest text-white/30 uppercase">
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 font-body text-xs text-white/40 group-hover:text-white transition-colors">
            <span className="tracking-widest">READ USE CASE</span>
            <ArrowDown size={13} className="group-hover:translate-y-1 transition-transform" />
          </div>
        </div>
      </a>
    </AnimFade>
  );
}

/* ─── EXPANDED USE CASE DETAIL ──────────────────────────────── */
function UseCaseDetail({ uc, index }: { uc: typeof USE_CASES[0]; index: number }) {
  const isEven = index % 2 === 0;

  const subsections = [
    { label: "Overview", content: uc.overview },
    { label: "The Challenge", content: uc.theChallenge },
    { label: "The Strategy", content: uc.theStrategy },
    { label: "The Execution", content: uc.theExecution },
    { label: "The Result", content: uc.theResult },
    { label: "Why It Worked", content: uc.whyItWorked },
  ];

  return (
    <section
      id={uc.id}
      className={`${isEven ? "section-black" : "section-dark"} scroll-mt-24`}
      aria-labelledby={`uc-heading-${uc.id}`}
    >
      <div className="container py-16 sm:py-24 lg:py-32">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <AnimFade>
            <SectionLabel text={`USE CASE ${String(index + 1).padStart(2, "0")}`} />
          </AnimFade>
          <AnimFade delay={0.08}>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 font-body text-[0.55rem] tracking-widest text-white/40 uppercase mb-5">
              {uc.category}
            </span>
          </AnimFade>
          <AnimFade delay={0.12}>
            <h2
              id={`uc-heading-${uc.id}`}
              className="font-display text-[clamp(2rem,5.5vw,4.7rem)] text-white mb-4"
              style={displayHeading}
            >
              {uc.client.split(" ").slice(0, -1).join(" ")}<br />
              <span className="text-outline-white">{uc.client.split(" ").slice(-1)[0]}</span>
            </h2>
          </AnimFade>

          {/* Result callout */}
          <AnimFade delay={0.18}>
            <div className="inline-flex items-center gap-3 mt-2 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/8">
              <TrendingUp size={16} style={{ color: uc.accent }} />
              <p className="font-body text-sm text-white/70 leading-relaxed max-w-2xl">{uc.result}</p>
            </div>
          </AnimFade>
        </div>

        {/* Subsections grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {subsections.map((sub, i) => (
            <AnimFade key={sub.label} delay={0.1 + i * 0.06}>
              <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-6 sm:p-7 h-full">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-1 h-5 rounded-full" style={{ background: uc.accent }} />
                  <h3 className="font-body text-[0.65rem] tracking-[0.18em] text-white/50 uppercase">
                    {sub.label}
                  </h3>
                </div>
                <p className="font-body text-sm text-white/65 leading-[1.75]">{sub.content}</p>
              </div>
            </AnimFade>
          ))}
        </div>

        {/* Tags */}
        <AnimFade delay={0.3}>
          <div className="flex flex-wrap gap-2 mt-8">
            {uc.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/8 font-body text-[0.58rem] tracking-widest text-white/35 uppercase">
                {tag}
              </span>
            ))}
          </div>
        </AnimFade>
      </div>
    </section>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────────────── */
export default function UseCases() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] overflow-x-hidden">
      <Navbar />

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section
        className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden section-dark pt-32"
        aria-label="Use Cases hero"
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.07_0_0)]/40 to-[oklch(0.07_0_0)]"
          aria-hidden="true"
        />

        <div className="relative z-10 container pb-16 sm:pb-24 lg:pb-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="section-label text-white/40 mb-5"
          >
            <span>✦</span><span>USE CASES —</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(1.5rem,9vw,8.5rem)] text-white mb-6"
            style={displayHeading}
          >
            USE CASES<br />
            <span className="text-outline-white">BUILT TO</span><br />
            PERFORM
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-base sm:text-lg text-white/50 leading-relaxed max-w-2xl mb-10"
          >
            Real-world examples of how Loomelic Media helps dealerships improve response rates, move inventory, support internet sales teams, and create campaigns that generate showroom traffic.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={() => navigate("/contact")}
              className="btn-pill-light text-xs"
            >
              BOOK A CALL +
            </button>
            <button
              onClick={() => navigate("/projects")}
              className="btn-pill-outline text-xs"
            >
              VIEW PROJECTS <ArrowRight size={12} className="inline ml-1" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 3. FEATURED USE CASES GRID ──────────────────────── */}
      <section className="section-black" aria-labelledby="featured-uc-heading">
        <div className="container py-16 sm:py-24 lg:py-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div>
              <AnimFade>
                <SectionLabel text="FEATURED USE CASES" />
              </AnimFade>
              <AnimFade delay={0.1}>
                <h2
                  id="featured-uc-heading"
                  className="font-display text-[clamp(1.5rem,7vw,6rem)] text-white"
                  style={displayHeading}
                >
                  REAL<br />
                  <span className="text-outline-white">RESULTS</span>
                </h2>
              </AnimFade>
            </div>
            <AnimFade delay={0.2}>
              <p className="font-body text-sm text-white/40 leading-relaxed max-w-xs sm:text-right">
                Each use case below is an expanded breakdown of a real dealership engagement — challenge, strategy, execution, and outcome.
              </p>
            </AnimFade>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {USE_CASES.map((uc, i) => (
              <UseCaseCard key={uc.id} uc={uc} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. INDIVIDUAL EXPANDED USE CASE DETAILS ─────────── */}
      {USE_CASES.map((uc, i) => (
        <UseCaseDetail key={uc.id} uc={uc} index={i} />
      ))}

      {/* ── 5. FINAL CTA ────────────────────────────────────── */}
      <section className="section-dark border-t border-white/6 overflow-hidden" aria-label="Call to action">
        <div className="container py-16 sm:py-24 lg:py-32">
          <AnimFade>
            <SectionLabel text="READY TO GROW?" />
          </AnimFade>
          <AnimFade delay={0.1}>
            <h2 className="font-display text-[clamp(1.5rem,7vw,6.5rem)] text-white mb-6 sm:mb-8" style={displayHeading}>
              READY TO BUILD<br />
              A CONTENT SYSTEM<br />
              <span className="text-outline-white">THAT DRIVES RESULTS?</span>
            </h2>
          </AnimFade>
          <AnimFade delay={0.2}>
            <p className="font-body text-base text-white/50 leading-relaxed max-w-2xl mb-10">
              If your dealership needs better content, stronger lead engagement, more polished customer communication, or a smarter media strategy built around real goals, Loomelic Media is ready to help. Let's build a system that supports your team, your inventory, and your growth.
            </p>
          </AnimFade>
          <AnimFade delay={0.28}>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/contact")}
                className="btn-pill-light text-xs"
              >
                GET IN TOUCH +
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="btn-pill-outline text-xs"
              >
                BOOK A CALL <ArrowRight size={12} className="inline ml-1" />
              </button>
            </div>
          </AnimFade>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
