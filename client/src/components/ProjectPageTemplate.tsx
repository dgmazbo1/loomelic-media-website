/* ============================================================
   ProjectPageTemplate — Shared template for all project detail pages
   Style: Dark hero with project title, light gallery section,
          Vimeo video embeds, full masonry photo gallery,
          Client Feedback & Project Outcomes section, dark CTA
   Unusually-inspired layout
   ============================================================ */

import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, X, ChevronLeft, ChevronRight, TrendingUp, Quote } from "lucide-react";
import { useState } from "react";
import Navbar from "./Navbar";
import ContactSection from "./ContactSection";
import { trpc } from "@/lib/trpc";

export interface ProjectOutcome {
  metric: string;
  value: string;
  label: string;
}

export interface ProjectFeedback {
  quote: string;
  name: string;
  title: string;
  company: string;
}

export interface ProjectPageData {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  heroImage: string;
  gallery: string[];
  vimeoIds?: (string | { id: string; portrait?: boolean; hash?: string; title?: string })[];
  videoSrc?: string;
  client?: string;
  services?: string[];
  feedback?: ProjectFeedback;
  outcomes?: ProjectOutcome[];
}

// ─── LIGHTBOX ────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        onClick={onClose}
      >
        <X size={18} />
      </button>

      <button
        className="absolute left-4 sm:left-8 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        onClick={(e) => { e.stopPropagation(); prev(); }}
      >
        <ChevronLeft size={20} />
      </button>

      <motion.img
        key={idx}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        src={images[idx]}
        alt=""
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        className="absolute right-4 sm:right-8 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        onClick={(e) => { e.stopPropagation(); next(); }}
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-xs text-white/40 tracking-widest">
        {idx + 1} / {images.length}
      </div>
    </motion.div>
  );
}

// ─── TEMPLATE ────────────────────────────────────────────────
export default function ProjectPageTemplate({ data }: { data: ProjectPageData }) {
  const [, navigate] = useLocation();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Fetch DB-managed media — overrides hardcoded props when available
  const { data: dbMedia } = trpc.media.getProjectMedia.useQuery({ slug: data.slug });

  // Merge: DB takes priority over hardcoded props
  const heroImage = dbMedia?.heroImageUrl ?? data.heroImage;
  const gallery = dbMedia && dbMedia.gallery.length > 0
    ? dbMedia.gallery.map(img => img.url)
    : data.gallery;
  const dbVideos = dbMedia?.videos ?? [];

  const hasFeedbackSection = data.feedback || (data.outcomes && data.outcomes.length > 0);

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[75vh] flex flex-col justify-end overflow-hidden section-dark pt-24">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt={data.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.07_0_0)] via-[oklch(0.07_0_0)]/60 to-transparent" />
        </div>

        <div className="relative z-10 container pb-16 sm:pb-24">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 font-body text-xs tracking-widest"
          >
            <ArrowLeft size={14} /> BACK TO HOME
          </motion.button>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-label text-white/40 mb-4"
          >
            <span>✦</span><span>{data.category} — {data.year}</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(1.8rem,5.5vw,5.5rem)] leading-[0.88] text-white mb-6 max-w-4xl"
          >
            {data.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            {data.services?.map((svc) => (
              <span key={svc} className="font-body text-[0.65rem] tracking-widest text-white/40 border border-white/15 rounded-full px-3 py-1">
                {svc}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Description + Videos + Gallery */}
      <section className="section-light py-16 sm:py-24">
        <div className="container">
          {/* Description */}
          <div className="grid md:grid-cols-[1fr_2fr] gap-10 mb-16">
            <div>
              {data.client && (
                <div className="mb-6">
                  <p className="font-body text-[0.65rem] tracking-widest text-[oklch(0.55_0_0)] mb-1">CLIENT</p>
                  <p className="font-display-normal text-base text-[oklch(0.15_0_0)]">{data.client}</p>
                </div>
              )}
              <div className="mb-6">
                <p className="font-body text-[0.65rem] tracking-widest text-[oklch(0.55_0_0)] mb-1">YEAR</p>
                <p className="font-display-normal text-base text-[oklch(0.15_0_0)]">{data.year}</p>
              </div>
              <div>
                <p className="font-body text-[0.65rem] tracking-widest text-[oklch(0.55_0_0)] mb-1">CATEGORY</p>
                <p className="font-display-normal text-base text-[oklch(0.15_0_0)]">{data.category}</p>
              </div>
            </div>
            <p className="font-body text-base sm:text-lg text-[oklch(0.3_0_0)] leading-relaxed whitespace-pre-line">
              {data.description}
            </p>
          </div>

          {/* Vimeo Videos */}
          {data.vimeoIds && data.vimeoIds.length > 0 && (
            <div className="mb-16">
              <p className="section-label text-[oklch(0.6_0_0)] mb-8">
                <span>✦</span><span>VIDEO CONTENT —</span>
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.vimeoIds.map((entry) => {
                  const id = typeof entry === "string" ? entry : entry.id;
                  const portrait = typeof entry === "string" ? false : (entry.portrait ?? false);
                  const hash = typeof entry === "string" ? undefined : entry.hash;
                  const label = typeof entry === "string" ? `Video ${id}` : (entry.title ?? `Video ${id}`);
                  const src = hash
                    ? `https://player.vimeo.com/video/${id}?h=${hash}&autoplay=1&muted=1&loop=1&badge=0&autopause=0&player_id=0&app_id=58479`
                    : `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0`;
                  return (
                    <div
                      key={id}
                      className="rounded-2xl overflow-hidden bg-[oklch(0.1_0_0)]"
                      style={portrait ? { paddingTop: "177.78%", position: "relative" } : { aspectRatio: "16/9" }}
                    >
                      <iframe
                        src={src}
                        className="w-full h-full"
                        style={portrait ? { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" } : {}}
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        title={label}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MP4 Video */}
          {data.videoSrc && (
            <div className="mb-16">
              <p className="section-label text-[oklch(0.6_0_0)] mb-8">
                <span>✦</span><span>VIDEO CONTENT —</span>
              </p>
              <div className="rounded-2xl overflow-hidden aspect-video bg-[oklch(0.1_0_0)]">
                <video
                  controls
                  className="w-full h-full object-cover"
                  src={data.videoSrc}
                  poster={data.heroImage}
                />
              </div>
            </div>
          )}

          {/* DB Videos (from admin panel) */}
          {dbVideos.length > 0 && (
            <div className="mb-16">
              <p className="section-label text-[oklch(0.6_0_0)] mb-8">
                <span>✦</span><span>VIDEO CONTENT —</span>
              </p>
              {/* Portrait (9:16) videos get a dedicated row with narrower columns */}
              {dbVideos.some(v => v.portrait) ? (
                <div className="flex flex-wrap gap-4 justify-center">
                  {dbVideos.map((v) => (
                    v.portrait ? (
                      /* Portrait: fixed width ~280px, 9:16 ratio */
                      <div
                        key={v.id}
                        className="rounded-2xl overflow-hidden bg-[oklch(0.1_0_0)] shrink-0"
                        style={{ width: 'clamp(200px, 28vw, 300px)', aspectRatio: '9/16' }}
                      >
                        <iframe
                          src={v.embedUrl}
                          className="w-full h-full"
                          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                          allowFullScreen
                          title={v.label ?? "Video"}
                        />
                      </div>
                    ) : (
                      /* Landscape: full width 16:9 */
                      <div
                        key={v.id}
                        className="rounded-2xl overflow-hidden bg-[oklch(0.1_0_0)] w-full"
                        style={{ aspectRatio: '16/9' }}
                      >
                        <iframe
                          src={v.embedUrl}
                          className="w-full h-full"
                          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                          allowFullScreen
                          title={v.label ?? "Video"}
                        />
                      </div>
                    )
                  ))}
                </div>
              ) : (
                /* All landscape: 2-col grid */
                <div className="grid sm:grid-cols-2 gap-4">
                  {dbVideos.map((v) => (
                    <div key={v.id} className="rounded-2xl overflow-hidden bg-[oklch(0.1_0_0)]" style={{ aspectRatio: '16/9' }}>
                      <iframe
                        src={v.embedUrl}
                        className="w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                        allowFullScreen
                        title={v.label ?? "Video"}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Photo Gallery */}
          {gallery.length > 0 && (
            <div>
              <p className="section-label text-[oklch(0.6_0_0)] mb-8">
                <span>✦</span><span>PHOTO GALLERY — {gallery.length} IMAGES</span>
              </p>
              <div className="columns-2 md:columns-3 gap-3 space-y-3">
                {gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
                    className="break-inside-avoid overflow-hidden rounded-xl cursor-pointer group"
                    onClick={() => setLightboxIdx(i)}
                  >
                    <img
                      src={typeof img === 'string' ? img : img}
                      alt={`${data.title} ${i + 1}`}
                      className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CLIENT FEEDBACK & PROJECT OUTCOMES ─────────────────── */}
      {hasFeedbackSection && (
        <section className="bg-[oklch(0.07_0_0)] py-16 sm:py-24">
          <div className="container">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="section-label text-white/40 mb-10"
            >
              <span>✦</span><span>CLIENT FEEDBACK & PROJECT OUTCOMES —</span>
            </motion.p>

            <div className={`grid gap-6 ${data.feedback && data.outcomes ? "lg:grid-cols-[1fr_1fr]" : ""}`}>

              {/* Testimonial quote card */}
              {data.feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative bg-[oklch(0.11_0_0)] border border-white/8 rounded-3xl p-8 sm:p-10 flex flex-col"
                >
                  {/* Decorative quote icon */}
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-6 shrink-0">
                    <Quote size={16} className="text-white/40" />
                  </div>

                  <blockquote className="font-body text-base sm:text-lg text-white/70 leading-relaxed flex-1 mb-8">
                    &ldquo;{data.feedback.quote}&rdquo;
                  </blockquote>

                  <div className="border-t border-white/10 pt-6 flex items-center gap-4">
                    {/* Avatar placeholder */}
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="font-display text-sm text-white/50">
                        {data.feedback.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-display-normal text-sm text-white">{data.feedback.name}</p>
                      <p className="font-body text-xs text-white/40 mt-0.5">{data.feedback.title} — {data.feedback.company}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Outcomes / metrics */}
              {data.outcomes && data.outcomes.length > 0 && (
                <div className="flex flex-col gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2 mb-2"
                  >
                    <TrendingUp size={14} className="text-white/30" />
                    <p className="font-body text-xs tracking-widest text-white/30 uppercase">Project Results</p>
                  </motion.div>

                  {data.outcomes.map((outcome, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, rotateX: -60, y: 24, scale: 0.97 }}
                      whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.65,
                        delay: i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{ transformPerspective: 800, transformOrigin: "top center" }}
                      className="bg-[oklch(0.11_0_0)] border border-white/8 rounded-2xl px-7 py-6 flex items-center justify-between gap-6 group hover:border-white/15 transition-colors duration-300"
                    >
                      <div>
                        <p className="font-body text-[0.65rem] tracking-widest text-white/35 uppercase mb-1">{outcome.metric}</p>
                        <p className="font-body text-sm text-white/55 leading-snug max-w-xs">{outcome.label}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none text-white">
                          {outcome.value}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            images={gallery}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>

      <ContactSection />
    </div>
  );
}
