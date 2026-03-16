/* ============================================================
   ServicePageTemplate — Shared template for all service pages
   Style: Dark hero with huge service name, light content section,
          dark CTA at bottom. Unusually-inspired.
   Includes: Lightbox for gallery photo click-to-enlarge
             Testimonials section (optional)
   ============================================================ */

import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Navbar from "./Navbar";
import ContactSection from "./ContactSection";

export interface ServicePageData {
  slug: string;
  name: string;
  tagline: string;
  description: string[];
  features: { title: string; desc: string }[];
  heroVideo?: string;
  heroImage?: string;
  galleryImages?: string[];
  featuredGallery?: { label: string; images: string[] };
  useCases?: string[];
  testimonials?: { quote: string; name: string; company: string }[];
  relatedProjects?: { slug: string; title: string; category: string; image: string }[];
}

// ─── LIGHTBOX ────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
    if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
    if (e.key === "Escape") onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKey}
      tabIndex={0}
    >
      <button
        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <X size={18} />
      </button>

      {images.length > 1 && (
        <button
          className="absolute left-4 sm:left-8 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          onClick={prev}
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>
      )}

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

      {images.length > 1 && (
        <button
          className="absolute right-4 sm:right-8 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          onClick={next}
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-xs text-white/40 tracking-widest">
          {idx + 1} / {images.length}
        </div>
      )}
    </motion.div>
  );
}

// ─── TEMPLATE ────────────────────────────────────────────────
export default function ServicePageTemplate({ data }: { data: ServicePageData }) {
  const [, navigate] = useLocation();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [featuredLightboxIdx, setFeaturedLightboxIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden section-dark pt-24">
        {data.heroVideo && (
          <div className="absolute inset-0 z-0">
            <video
              autoPlay muted loop playsInline
              className="w-full h-full object-cover opacity-30"
              src={data.heroVideo}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.07_0_0)] via-[oklch(0.07_0_0)]/50 to-transparent" />
          </div>
        )}
        {data.heroImage && !data.heroVideo && (
          <div className="absolute inset-0 z-0">
            <img src={data.heroImage} alt={data.name} className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.07_0_0)] via-[oklch(0.07_0_0)]/50 to-transparent" />
          </div>
        )}

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
            <span>✦</span><span>OUR SERVICES —</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(2rem,7vw,6rem)] leading-[0.88] text-white mb-6"
          >
            {data.name.split("\n").map((line, i) => (
              <span key={i} className={i === 1 ? "text-[oklch(0.45_0_0)] block" : "block"}>{line}</span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="font-body text-base sm:text-lg text-white/50 max-w-xl leading-relaxed"
          >
            {data.tagline}
          </motion.p>
        </div>
      </section>

      {/* Featured Gallery — shown immediately after hero when provided */}
      {data.featuredGallery && data.featuredGallery.images.length > 0 && (
        <section className="bg-[oklch(0.07_0_0)] py-16 sm:py-24">
          <div className="container">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="section-label text-white/40 mb-8"
            >
              <span>✦</span><span>{data.featuredGallery.label} —</span>
            </motion.p>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
              {data.featuredGallery.images.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: (i % 4) * 0.07 }}
                  className="break-inside-avoid overflow-hidden rounded-xl cursor-pointer group"
                  onClick={() => setFeaturedLightboxIdx(i)}
                >
                  <img
                    src={img}
                    alt={`${data.featuredGallery!.label} ${i + 1}`}
                    className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Description + Features */}
      <section className="section-light py-16 sm:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-16">
            <div>
              {data.description.map((para, i) => (
                <p key={i} className="font-body text-base text-[oklch(0.25_0_0)] leading-relaxed mb-4">
                  {para}
                </p>
              ))}
            </div>
            <div className="space-y-6">
              {data.features.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="border-t border-[oklch(0.88_0_0)] pt-5"
                >
                  <h3 className="font-display-normal text-sm tracking-widest text-[oklch(0.15_0_0)] mb-2">{feat.title}</h3>
                  <p className="font-body text-sm text-[oklch(0.45_0_0)] leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          {data.useCases && data.useCases.length > 0 && (
            <div className="mb-16">
              <p className="section-label text-[oklch(0.6_0_0)] mb-8">
                <span>✦</span><span>USE CASES —</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {data.useCases.map((uc, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="border border-[oklch(0.88_0_0)] rounded-xl px-5 py-4"
                  >
                    <p className="font-display-normal text-xs tracking-widest text-[oklch(0.2_0_0)] uppercase">{uc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {data.galleryImages && data.galleryImages.length > 0 && (
            <div>
              <p className="section-label text-[oklch(0.6_0_0)] mb-8">
                <span>✦</span><span>RECENT WORK —</span>
              </p>
              <div className="columns-2 md:columns-3 gap-3 space-y-3">
                {data.galleryImages.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                    className="break-inside-avoid overflow-hidden rounded-xl cursor-pointer group"
                    onClick={() => setLightboxIdx(i)}
                  >
                    <img
                      src={img}
                      alt={`${data.name} work ${i + 1}`}
                      className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials */}
          {data.testimonials && data.testimonials.length > 0 && (
            <div className="mt-16">
              <p className="section-label text-[oklch(0.6_0_0)] mb-8">
                <span>✦</span><span>CLIENT TESTIMONIALS —</span>
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.testimonials.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: i * 0.1 }}
                    className="bg-[oklch(0.96_0_0)] border border-[oklch(0.88_0_0)] rounded-2xl px-7 py-8 flex flex-col"
                  >
                    {/* Opening quote mark */}
                    <span className="font-display text-[4rem] leading-none text-[oklch(0.82_0_0)] select-none mb-2">&ldquo;</span>
                    <p className="font-body text-sm text-[oklch(0.25_0_0)] leading-relaxed flex-1 mb-6">
                      {t.quote}
                    </p>
                    <div className="border-t border-[oklch(0.88_0_0)] pt-5">
                      <p className="font-display-normal text-sm tracking-widest text-[oklch(0.15_0_0)]">{t.name}</p>
                      <p className="font-body text-xs text-[oklch(0.55_0_0)] mt-0.5">{t.company}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Related Projects */}
          {data.relatedProjects && data.relatedProjects.length > 0 && (
            <div className="mt-16">
              <p className="section-label text-[oklch(0.6_0_0)] mb-8">
                <span>✦</span><span>RELATED PROJECTS —</span>
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.relatedProjects.map((proj) => (
                  <motion.div
                    key={proj.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onClick={() => navigate(`/projects/${proj.slug}`)}
                    className="group cursor-pointer bg-[oklch(0.1_0_0)] rounded-2xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-5 py-4">
                      <div>
                        <p className="font-body text-[0.6rem] text-white/35 tracking-[0.15em] mb-0.5">{proj.category}</p>
                        <h3 className="font-display-normal text-sm text-white">{proj.title}</h3>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:bg-white group-hover:text-black transition-all duration-300">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                    <div className="overflow-hidden mx-3 mb-3 rounded-xl aspect-[16/9]">
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700" loading="lazy" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox — main gallery */}
      <AnimatePresence>
        {lightboxIdx !== null && data.galleryImages && (
          <Lightbox
            images={data.galleryImages}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>

      {/* Lightbox — featured gallery */}
      <AnimatePresence>
        {featuredLightboxIdx !== null && data.featuredGallery && (
          <Lightbox
            images={data.featuredGallery.images}
            startIndex={featuredLightboxIdx}
            onClose={() => setFeaturedLightboxIdx(null)}
          />
        )}
      </AnimatePresence>

      <ContactSection />
    </div>
  );
}
