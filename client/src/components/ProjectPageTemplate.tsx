/* ============================================================
   ProjectPageTemplate — Shared template for all project detail pages
   Style: Dark hero with project title, light gallery section,
          Vimeo video embeds, full masonry photo gallery, dark CTA
   Unusually-inspired layout
   ============================================================ */

import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Navbar from "./Navbar";
import ContactSection from "./ContactSection";

export interface ProjectPageData {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  heroImage: string;
  gallery: string[];
  vimeoIds?: string[];
  videoSrc?: string;
  client?: string;
  services?: string[];
}

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
      {/* Close */}
      <button
        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        onClick={onClose}
      >
        <X size={18} />
      </button>

      {/* Prev */}
      <button
        className="absolute left-4 sm:left-8 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        onClick={(e) => { e.stopPropagation(); prev(); }}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Image */}
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

      {/* Next */}
      <button
        className="absolute right-4 sm:right-8 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        onClick={(e) => { e.stopPropagation(); next(); }}
      >
        <ChevronRight size={20} />
      </button>

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-xs text-white/40 tracking-widest">
        {idx + 1} / {images.length}
      </div>
    </motion.div>
  );
}

export default function ProjectPageTemplate({ data }: { data: ProjectPageData }) {
  const [, navigate] = useLocation();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[75vh] flex flex-col justify-end overflow-hidden section-dark pt-24">
        <div className="absolute inset-0 z-0">
          <img
            src={data.heroImage}
            alt={data.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.07_0_0)] via-[oklch(0.07_0_0)]/60 to-transparent" />
        </div>

        <div className="relative z-10 container pb-16 sm:pb-24">
          {/* Back button */}
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
            className="font-display text-[clamp(2.5rem,8vw,8rem)] leading-[0.88] text-white mb-6 max-w-4xl"
          >
            {data.title}
          </motion.h1>

          {/* Meta row */}
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
            <p className="font-body text-base sm:text-lg text-[oklch(0.3_0_0)] leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* Vimeo Videos */}
          {data.vimeoIds && data.vimeoIds.length > 0 && (
            <div className="mb-16">
              <p className="section-label text-[oklch(0.6_0_0)] mb-8">
                <span>✦</span><span>VIDEO CONTENT —</span>
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.vimeoIds.map((id) => (
                  <div key={id} className="rounded-2xl overflow-hidden aspect-video bg-[oklch(0.1_0_0)]">
                    <iframe
                      src={`https://player.vimeo.com/video/${id}?autoplay=0&loop=0&title=0&byline=0&portrait=0`}
                      className="w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={`Video ${id}`}
                    />
                  </div>
                ))}
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

          {/* Photo Gallery */}
          {data.gallery.length > 0 && (
            <div>
              <p className="section-label text-[oklch(0.6_0_0)] mb-8">
                <span>✦</span><span>PHOTO GALLERY — {data.gallery.length} IMAGES</span>
              </p>
              <div className="columns-2 md:columns-3 gap-3 space-y-3">
                {data.gallery.map((img, i) => (
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
                      src={img}
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            images={data.gallery}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>

      <ContactSection />
    </div>
  );
}
