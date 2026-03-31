/* ============================================================
   Convention Video Production Las Vegas — SEO Landing Page
   /services/convention-video-production-las-vegas

   Target keywords:
   - Las Vegas convention videographer / videography
   - Las Vegas convention photographer / photography
   - trade show videographer Las Vegas
   - trade show photographer Las Vegas
   - convention video production Las Vegas
   - CES videographer / SEMA videographer / G2E videographer / NAB videographer
   - Las Vegas Convention Center videographer
   - Venetian Expo videographer
   - Mandalay Bay Convention Center photographer
   ============================================================ */
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, CheckCircle2, Camera, Video, Mic, Clock, Users, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { useSEO } from "@/hooks/useSEO";
import { WONDR_NATION, BOB_MARLEY, SPORTS_ILLUSTRATED } from "@/lib/media";

/* ─── JSON-LD STRUCTURED DATA ───────────────────────────── */
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://loomelicmedia.com/#business",
      name: "Loomelic Media",
      description:
        "Las Vegas convention videographer and trade show photographer serving the Las Vegas Convention Center, Venetian Expo, Mandalay Bay Convention Center, and all major Las Vegas venues.",
      url: "https://loomelicmedia.com",
      telephone: "+17025550100",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Las Vegas",
        addressRegion: "NV",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 36.1699,
        longitude: -115.1398,
      },
      areaServed: [
        "Las Vegas, NV",
        "Henderson, NV",
        "North Las Vegas, NV",
        "Southern Nevada",
      ],
      serviceType: [
        "Convention Video Production",
        "Trade Show Videography",
        "Convention Photography",
        "Trade Show Photography",
        "Event Videography",
        "Corporate Event Photography",
      ],
    },
    {
      "@type": "Service",
      "@id": "https://loomelicmedia.com/services/convention-video-production-las-vegas#service",
      name: "Convention Video Production & Photography Las Vegas",
      description:
        "Professional convention videography and photography for trade shows, expos, and corporate events at the Las Vegas Convention Center, Venetian Expo, Mandalay Bay Convention Center, and all major Las Vegas venues. Services include booth coverage, keynote recording, speaker interviews, highlight reels, same-day social edits, and event photography.",
      provider: { "@id": "https://loomelicmedia.com/#business" },
      areaServed: "Las Vegas, NV",
      url: "https://loomelicmedia.com/services/convention-video-production-las-vegas",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Do you cover conventions at the Las Vegas Convention Center?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Loomelic Media is a Las Vegas-based production company and regularly covers events at the Las Vegas Convention Center (LVCC), Venetian Expo, Mandalay Bay Convention Center, Resorts World, and all major Las Vegas convention venues. No travel fees, no time zone delays.",
          },
        },
        {
          "@type": "Question",
          name: "What conventions and trade shows do you cover in Las Vegas?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We cover all major Las Vegas trade shows and conventions including CES, SEMA, G2E, NAB Show, MAGIC, Money20/20, AWS re:Invent, SHOT Show, World of Concrete, CONEXPO, and hundreds of smaller industry events throughout the year.",
          },
        },
        {
          "@type": "Question",
          name: "Can you deliver same-day social media edits from the convention floor?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. We offer same-day turnaround on short-form social edits — typically 60–90 second highlight reels — so your brand can post while the show is still live. Full edited recap videos are delivered within 3–5 business days.",
          },
        },
        {
          "@type": "Question",
          name: "Do you provide both videography and photography at the same event?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. We offer combined video and photography packages for conventions and trade shows, so you get both a professional videographer and photographer on-site simultaneously. This is the most cost-effective way to cover a full event.",
          },
        },
        {
          "@type": "Question",
          name: "How do you handle audio on a loud convention floor?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Convention floors are notoriously loud. Our crews use professional wireless lavalier microphones, directional boom mics, and audio isolation techniques to capture clean dialogue even in high-ambient-noise environments. We've worked every major Las Vegas venue and know how to manage the acoustics.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between a booth video and a convention highlight reel?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A booth video focuses on your specific exhibit — product demos, team interviews, and the energy of your space. A convention highlight reel captures the full event: keynotes, networking, the show floor, and key moments. Many clients commission both for maximum content ROI.",
          },
        },
      ],
    },
  ],
};

/* ─── DATA ───────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: Video,
    title: "Booth & Exhibit Coverage",
    desc: "Cinematic coverage of your exhibit space — product demos, live activations, team interactions, and the energy of your booth captured in 4K.",
  },
  {
    icon: Mic,
    title: "Speaker & Keynote Recording",
    desc: "Multi-camera keynote and breakout session recording with clean audio. Delivered as broadcast-ready files for post-event distribution.",
  },
  {
    icon: Camera,
    title: "Convention Photography",
    desc: "High-resolution event photography covering your booth, team, products, and show floor moments. Edited and delivered within 24–48 hours.",
  },
  {
    icon: Users,
    title: "On-Camera Interviews",
    desc: "Professional on-site interview setups for client testimonials, executive statements, and product spokesperson videos — with lighting and clean audio.",
  },
  {
    icon: Clock,
    title: "Same-Day Social Edits",
    desc: "Short-form 60–90 second highlight reels delivered same-day so your brand can post while the show is still live and the conversation is happening.",
  },
  {
    icon: Star,
    title: "Convention Highlight Reels",
    desc: "Full-event recap videos that capture the energy, scale, and key moments of your convention presence — ideal for post-show marketing and internal reporting.",
  },
];

const SHOWS = [
  "CES", "SEMA", "G2E", "NAB Show", "MAGIC", "Money20/20",
  "AWS re:Invent", "SHOT Show", "World of Concrete", "CONEXPO",
  "Cosmoprof", "NBAA", "IMEX America", "InfoComm", "JCK Las Vegas",
  "FABTECH", "PPAI Expo", "Licensing Expo", "World Pet Association",
];

const VENUES = [
  { name: "Las Vegas Convention Center", abbr: "LVCC" },
  { name: "Venetian Expo", abbr: "VENETIAN" },
  { name: "Mandalay Bay Convention Center", abbr: "MANDALAY" },
  { name: "Resorts World Convention Center", abbr: "RESORTS WORLD" },
  { name: "Paris Las Vegas Convention Center", abbr: "PARIS LV" },
  { name: "MGM Grand Conference Center", abbr: "MGM GRAND" },
];

const GALLERY_IMAGES = [
  ...WONDR_NATION.gallery.slice(0, 4),
  // New convention photos — G2E / Wondr Nation
  `https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/hZhvBDwnUYPXmoN2sbiKGJ/20251005WomenRising-08_637f104d.webp`,
  `https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/hZhvBDwnUYPXmoN2sbiKGJ/20251005WomenRising-09_38731058.webp`,
  `https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/hZhvBDwnUYPXmoN2sbiKGJ/20251005WomenRising-15_3fbd80ba.webp`,
  `https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/hZhvBDwnUYPXmoN2sbiKGJ/20251006Day2SneakPeek-16_80b3e2e4.webp`,
  `https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/hZhvBDwnUYPXmoN2sbiKGJ/20251006Day2SneakPeek-20_16b4d346.webp`,
  `https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/hZhvBDwnUYPXmoN2sbiKGJ/20251006Day2SneakPeek-31_f90b4171.webp`,
  `https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/hZhvBDwnUYPXmoN2sbiKGJ/20251008Day3SneakPeek-02_9ffd196c.webp`,
  `https://d2xsxph8kpxj0f.cloudfront.net/310419663029344895/hZhvBDwnUYPXmoN2sbiKGJ/20251008Day3SneakPeek-03_7f04bee2.webp`,
];

const FAQ_ITEMS = [
  {
    q: "Do you cover conventions at the Las Vegas Convention Center?",
    a: "Yes. Loomelic Media is a Las Vegas-based production company and regularly covers events at the Las Vegas Convention Center (LVCC), Venetian Expo, Mandalay Bay Convention Center, Resorts World, and all major Las Vegas convention venues. No travel fees, no time zone delays.",
  },
  {
    q: "What trade shows and conventions do you cover in Las Vegas?",
    a: "We cover all major Las Vegas trade shows including CES, SEMA, G2E, NAB Show, MAGIC, Money20/20, AWS re:Invent, SHOT Show, World of Concrete, CONEXPO, and hundreds of smaller industry events throughout the year. If your show runs in Las Vegas, we can cover it.",
  },
  {
    q: "Can you deliver same-day social media edits from the convention floor?",
    a: "Yes. We offer same-day turnaround on short-form social edits — typically 60–90 second highlight reels — so your brand can post while the show is still live. Full edited recap videos are delivered within 3–5 business days.",
  },
  {
    q: "Do you provide both videography and photography at the same event?",
    a: "Absolutely. We offer combined video and photography packages for conventions and trade shows, so you get both a professional videographer and photographer on-site simultaneously. This is the most cost-effective way to cover a full event.",
  },
  {
    q: "How do you handle audio on a loud convention floor?",
    a: "Convention floors are notoriously loud. Our crews use professional wireless lavalier microphones, directional boom mics, and audio isolation techniques to capture clean dialogue even in high-ambient-noise environments.",
  },
  {
    q: "What is the difference between a booth video and a convention highlight reel?",
    a: "A booth video focuses on your specific exhibit — product demos, team interviews, and the energy of your space. A convention highlight reel captures the full event: keynotes, networking, the show floor, and key moments. Many clients commission both for maximum content ROI.",
  },
];

/* ─── FAQ ITEM ───────────────────────────────────────────── */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="border-b border-white/8"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        aria-expanded={open}
      >
        <span className="font-body text-sm sm:text-base text-white/80 group-hover:text-white transition-colors leading-snug">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`text-white/30 shrink-0 mt-0.5 transition-transform duration-300 ${open ? "rotate-180 text-white" : ""}`}
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
            <p className="text-white/55 text-sm leading-relaxed pb-5 max-w-3xl">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function ConventionPage() {
  const [, navigate] = useLocation();

  useSEO({
    title: "Convention Videographer & Photographer Las Vegas",
    description: "Las Vegas convention videographer and trade show photographer. Booth coverage, keynote recording, same-day social edits & highlight reels at LVCC, Venetian Expo & Mandalay Bay.",
    canonical: "/services/convention-video-production-las-vegas",
  });

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] overflow-x-hidden">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-end pb-20 pt-24 overflow-hidden">
        {/* Background image — Wondr Nation G2E */}
        <div className="absolute inset-0">
          <img
            src={WONDR_NATION.hero}
            alt="Las Vegas convention videographer covering the G2E trade show floor"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.07_0_0)] via-[oklch(0.07_0_0/0.65)] to-[oklch(0.07_0_0/0.3)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.07_0_0/0.8)] to-transparent" />
        </div>

        <div className="relative container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <p className="section-label text-white/40 mb-5">
              <span>✦</span>
              <span>LAS VEGAS CONVENTION SERVICES —</span>
            </p>

            <h1 className="font-display text-[clamp(2.8rem,9vw,7.5rem)] leading-[0.86] text-white mb-6">
              CONVENTION
              <br />
              <span className="text-[oklch(0.55_0_0)]">VIDEOGRAPHY</span>
              <br />
              <span className="text-[oklch(0.35_0_0)]">&amp; PHOTOGRAPHY</span>
            </h1>

            <p className="text-white/60 text-base sm:text-lg max-w-xl leading-relaxed mb-4">
              Las Vegas-based video production and photography for trade shows, conventions, and
              corporate events. Booth coverage, keynote recording, same-day social edits, and
              professional event photography — at every major Las Vegas venue.
            </p>

            <p className="text-white/35 text-xs tracking-[0.15em] mb-10">
              LAS VEGAS CONVENTION CENTER · VENETIAN EXPO · MANDALAY BAY · RESORTS WORLD
            </p>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate("/contact")} className="btn-pill text-xs">
                GET A QUOTE +
              </button>
              <button onClick={() => navigate("/projects/wondr-nation-g2e")} className="btn-pill-light text-xs">
                VIEW CONVENTION WORK →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST BAR — SHOWS COVERED ────────────────────────── */}
      <section className="bg-[oklch(0.1_0_0)] border-y border-white/6 py-6 overflow-hidden">
        <div className="container">
          <p className="font-body text-[0.58rem] tracking-[0.2em] text-white/25 mb-4 text-center">
            TRADE SHOWS &amp; CONVENTIONS COVERED
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {SHOWS.map((show) => (
              <span
                key={show}
                className="font-display text-[clamp(0.75rem,1.5vw,0.9rem)] text-white/30 hover:text-white/60 transition-colors duration-200 whitespace-nowrap"
              >
                {show}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO COPY — KEYWORD RICH ────────────────────────── */}
      <section className="section-black py-20 sm:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="section-label text-white/30 mb-5">
                <span>✦</span>
                <span>WHY LOOMELIC MEDIA —</span>
              </p>
              <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.9] text-white mb-8">
                LAS VEGAS
                <br />
                <span className="text-[oklch(0.4_0_0)]">CONVENTION</span>
                <br />
                EXPERTS
              </h2>
              <div className="space-y-5 text-white/55 text-sm sm:text-base leading-relaxed">
                <p>
                  Las Vegas hosts more major conventions and trade shows than any other city in the
                  world — and Loomelic Media is built for it. We are a Las Vegas-based production
                  company, which means no travel costs, no crew that needs a day to orient to the
                  city, and no time zone delays when you need edits fast.
                </p>
                <p>
                  Our convention videographers and photographers have worked the floors of the{" "}
                  Las Vegas Convention Center,{" "}
                  Venetian Expo,{" "}
                  Mandalay Bay Convention Center,{" "}
                  Resorts World, and every other major
                  Las Vegas venue. We know the lighting conditions, the floor layouts, the union
                  rules, and how to get clean audio in a 100,000-square-foot exhibit hall.
                </p>
                <p>
                  Whether you need a single{" "}
                  Las Vegas convention videographer for
                  booth coverage, a full multi-camera crew for a keynote, or a{" "}
                  trade show photographer to document
                  your entire exhibit presence — we scale to fit your show.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-4"
            >
              {/* Stat cards */}
              {[
                { stat: "4K", label: "Resolution — all video deliverables shot in 4K" },
                { stat: "24–48H", label: "Photo turnaround for edited convention galleries" },
                { stat: "Same Day", label: "Social media edits available while the show is live" },
                { stat: "All Venues", label: "LVCC, Venetian Expo, Mandalay Bay, Resorts World & more" },
              ].map((item, i) => (
                <motion.div
                  key={item.stat}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-5 bg-[oklch(0.1_0_0)] border border-white/6 rounded-2xl px-6 py-5"
                >
                  <span className="font-display text-[clamp(1.4rem,3vw,2rem)] text-white shrink-0 min-w-[80px]">
                    {item.stat}
                  </span>
                  <span className="text-white/50 text-sm leading-snug">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ────────────────────────────────────── */}
      <section className="bg-[oklch(0.05_0_0)] py-20 sm:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <p className="section-label text-white/30 mb-4">
              <span>✦</span>
              <span>WHAT WE DELIVER —</span>
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.9] text-white">
              CONVENTION &amp;
              <br />
              <span className="text-[oklch(0.4_0_0)]">TRADE SHOW SERVICES</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="bg-[oklch(0.1_0_0)] border border-white/6 rounded-2xl p-7 hover:border-white/15 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:bg-white/10 transition-colors duration-300">
                  <svc.icon size={18} className="text-white/50 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-display-normal text-base text-white mb-3">{svc.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO GALLERY ────────────────────────────────────── */}
      <section className="section-black py-20 sm:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
          >
            <div>
              <p className="section-label text-white/30 mb-4">
                <span>✦</span>
                <span>FROM THE FLOOR —</span>
              </p>
              <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.9] text-white">
                CONVENTION
                <br />
                <span className="text-[oklch(0.4_0_0)]">PHOTOGRAPHY</span>
              </h2>
            </div>
            <button
              onClick={() => navigate("/projects")}
              className="btn-pill-light text-xs shrink-0 self-end sm:self-auto"
            >
              ALL PROJECTS →
            </button>
          </motion.div>

          {/* Masonry-style grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {GALLERY_IMAGES.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`overflow-hidden rounded-xl bg-[oklch(0.12_0_0)] ${
                  i === 0 ? "col-span-2 row-span-2 aspect-square" :
                  i === 3 ? "col-span-2 aspect-[2/1]" :
                  "aspect-square"
                }`}
              >
                <img
                  src={src}
                  alt={`Las Vegas convention photography and event videography — Loomelic Media`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VENUES ───────────────────────────────────────────── */}
      <section className="bg-[oklch(0.05_0_0)] py-20 sm:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="section-label text-white/30 mb-4">
              <span>✦</span>
              <span>WHERE WE WORK —</span>
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.9] text-white mb-4">
              EVERY MAJOR
              <br />
              <span className="text-[oklch(0.4_0_0)]">LAS VEGAS VENUE</span>
            </h2>
            <p className="text-white/45 text-sm sm:text-base max-w-xl leading-relaxed">
              We are a Las Vegas-based production company. No travel fees, no orientation day — we
              know every venue, every loading dock, and every union rule before we arrive.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VENUES.map((venue, i) => (
              <motion.div
                key={venue.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex items-center gap-4 bg-[oklch(0.1_0_0)] border border-white/6 rounded-xl px-6 py-5"
              >
                <CheckCircle2 size={16} className="text-white/70 shrink-0" />
                <div>
                  <p className="text-white/80 text-sm font-medium leading-tight">{venue.name}</p>
                  <p className="text-white/25 text-[0.6rem] tracking-[0.15em] mt-0.5">{venue.abbr}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LONG-FORM SEO COPY ───────────────────────────────── */}
      <section className="section-black py-20 sm:py-28">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-invert prose-sm sm:prose-base max-w-none"
          >
            <p className="section-label text-white/30 mb-6">
              <span>✦</span>
              <span>ABOUT OUR CONVENTION SERVICES —</span>
            </p>

            <h2 className="font-display text-[clamp(1.8rem,4vw,3.5rem)] leading-[0.9] text-white mb-8 not-prose">
              LAS VEGAS CONVENTION
              <br />
              <span className="text-[oklch(0.4_0_0)]">VIDEO PRODUCTION</span>
            </h2>

            <div className="space-y-6 text-white/55 text-sm sm:text-base leading-relaxed not-prose">
              <p>
                Las Vegas is the convention capital of the world. The Las Vegas Convention Center alone hosts
                more than 60 major trade shows per year, drawing millions of attendees and tens of
                thousands of exhibitors. When your brand is on that floor, the content you capture
                becomes your most valuable post-show marketing asset — and the quality of your
                convention videographer determines whether that content works for you or against you.
              </p>

              <p>
                Loomelic Media is a Las Vegas-based video production and photography company
                specializing in convention and trade show coverage. We provide professional{" "}
                convention videography and trade show photography for exhibitors,
                event organizers, and corporate brands at every major Las Vegas venue — including
                the Las Vegas Convention Center, Venetian Expo, Mandalay Bay Convention Center,
                Resorts World, Paris Las Vegas, and MGM Grand.
              </p>

              <p>
                Our convention production services cover the full spectrum of event content: booth
                and exhibit coverage, keynote and breakout session recording, on-camera speaker
                interviews, product demo videos, attendee testimonials, convention highlight reels,
                and same-day social media edits. We also offer combined convention photography and videography packages so you get both a professional photographer and videographer on-site simultaneously —
                the most cost-effective way to maximize your content output from a single event.
              </p>

              <p>
                Convention floors are high-pressure environments. Tight schedules, loud ambient
                noise, complex lighting, and no second chances on live product demos. Our trade show videographers are experienced
                working in exhibit halls and conference centers, and we come prepared with
                professional wireless audio systems, portable lighting rigs, and the technical
                knowledge to adapt to any venue condition. We have covered CES, SEMA, G2E, NAB Show, MAGIC, Money20/20, and
                hundreds of other Las Vegas conventions — and we bring that institutional knowledge
                to every new project.
              </p>

              <p>
                Because we are Las Vegas-based, there are no travel costs, no time zone delays, and
                no crew that needs a day to get oriented to the city. When you need same-day social
                edits delivered before the show floor closes, we can make that happen. When you need
                a full edited highlight reel within 48 hours of your last day on the floor, we can
                make that happen too. Our proximity to every major Las Vegas convention venue is not
                just a logistical advantage — it is a production advantage that directly translates
                to faster turnarounds and lower costs for our clients.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-[oklch(0.05_0_0)] py-20 sm:py-28">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="section-label text-white/30 mb-4">
              <span>✦</span>
              <span>COMMON QUESTIONS —</span>
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.9] text-white">
              CONVENTION
              <br />
              <span className="text-[oklch(0.4_0_0)]">FAQ</span>
            </h2>
          </motion.div>

          <div>
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={item.q} q={item.q} a={item.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERNAL LINKS — RELATED SERVICES ───────────────── */}
      <section className="section-black py-16 sm:py-20">
        <div className="container">
          <p className="section-label text-white/30 mb-8">
            <span>✦</span>
            <span>RELATED SERVICES —</span>
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                title: "Event Coverage",
                desc: "Full-service event videography and photography beyond conventions — galas, activations, and brand events.",
                href: "/services/events",
              },
              {
                title: "Featured Work",
                desc: "Browse our portfolio of convention, event, and brand projects across Las Vegas and Southern Nevada.",
                href: "/featured-work",
              },
              {
                title: "Dealer Services",
                desc: "Automotive dealership video production — inventory photography, CRM videos, and social media content.",
                href: "/services/dealer-services",
              },
            ].map((link, i) => (
              <motion.button
                key={link.href}
                onClick={() => navigate(link.href)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-left bg-[oklch(0.1_0_0)] border border-white/6 rounded-2xl p-6 hover:border-white/20 hover:bg-[oklch(0.12_0_0)] transition-all duration-300 group"
              >
                <h3 className="font-display-normal text-base text-white mb-2 group-hover:text-white transition-colors duration-200">
                  {link.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">{link.desc}</p>
                <p className="text-white/25 text-xs mt-3 group-hover:text-white/50 transition-colors">
                  Learn more →
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
