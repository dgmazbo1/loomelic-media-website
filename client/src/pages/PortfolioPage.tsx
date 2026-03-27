/* ============================================================
   PortfolioPage — /portfolio
   Three-section portfolio: Photos, Videos, Graphics
   Data-driven from the database via tRPC
   ============================================================ */
import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image, Video, Palette } from "lucide-react";
import Navbar from "@/components/Navbar";
import { trpc } from "@/lib/trpc";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tag = { id: number; name: string; slug: string; color: string | null };
type PhotoItem = { id: number; url: string; title: string | null; caption: string | null; tags: Tag[] };
type VideoItem = { id: number; vimeoUrl: string; title: string | null; caption: string | null; thumbnailUrl: string | null; tags: Tag[] };
type GraphicItem = { id: number; url: string; title: string | null; caption: string | null; client: string | null; tags: Tag[] };

type SectionId = "photos" | "videos" | "graphics";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractVimeoId(url: string): string | null {
  const match = url.match(/(?:vimeo\.com\/)(\d+)/);
  return match ? match[1] : null;
}

function getVimeoThumbnail(url: string): string {
  const id = extractVimeoId(url);
  return id ? `https://vumbnail.com/${id}.jpg` : "";
}

function getVimeoEmbedUrl(url: string): string {
  const id = extractVimeoId(url);
  return id ? `https://player.vimeo.com/video/${id}?autoplay=1&color=ffffff&title=0&byline=0&portrait=0&fullscreen=1` : "";
}

// ─── Tag Filter Bar ───────────────────────────────────────────────────────────

function TagFilterBar({
  tags,
  activeTagId,
  onSelect,
}: {
  tags: Tag[];
  activeTagId: number | null;
  onSelect: (id: number | null) => void;
}) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-6">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-1.5 rounded-full text-[0.7rem] font-semibold tracking-[0.1em] transition-all duration-200 ${
          activeTagId === null
            ? "bg-white text-[oklch(0.07_0_0)]"
            : "bg-white/8 text-white/60 border border-white/10 hover:bg-white/15 hover:text-white"
        }`}
      >
        ALL
      </button>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onSelect(activeTagId === tag.id ? null : tag.id)}
          className={`px-4 py-1.5 rounded-full text-[0.7rem] font-semibold tracking-[0.1em] transition-all duration-200 ${
            activeTagId === tag.id
              ? "bg-white text-[oklch(0.07_0_0)]"
              : "bg-white/8 text-white/60 border border-white/10 hover:bg-white/15 hover:text-white"
          }`}
        >
          {tag.name.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// ─── Photo Card ───────────────────────────────────────────────────────────────

function PhotoCard({ item, index, onClick }: { item: PhotoItem; index: number; onClick: () => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  // Eagerly load the first 8 photos (above the fold); lazy-load the rest
  const isAboveFold = index < 8;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 4) * 0.07 }}
      className="group relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer bg-[oklch(0.12_0_0)]"
      onClick={onClick}
    >
      <img
        src={item.url}
        alt={item.caption ?? item.title ?? ""}
        loading={isAboveFold ? "eager" : "lazy"}
        fetchPriority={isAboveFold ? "high" : "auto"}
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        {item.title && (
          <p className="font-display-normal text-xs text-white tracking-widest">{item.title.toUpperCase()}</p>
        )}
        {item.caption && (
          <p className="font-body text-[0.65rem] text-white/60 mt-0.5">{item.caption}</p>
        )}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {item.tags.map((t) => (
              <span
                key={t.id}
                className="inline-block px-2 py-0.5 rounded-full text-[0.6rem] text-white/80 tracking-widest uppercase"
                style={{ backgroundColor: t.color ?? "rgba(255,255,255,0.15)" }}
              >
                {t.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────────────

function VideoCard({ item, index, onClick }: { item: VideoItem; index: number; onClick: () => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const thumbnail = item.thumbnailUrl ?? getVimeoThumbnail(item.vimeoUrl);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.07 }}
      className="group relative aspect-video overflow-hidden rounded-xl cursor-pointer bg-[oklch(0.12_0_0)]"
      onClick={onClick}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={item.title ?? ""}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/20">
          <Video size={48} />
        </div>
      )}
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-black/60 border border-white/20 flex items-center justify-center group-hover:bg-black/80 group-hover:scale-110 transition-all duration-300">
          <Video size={20} className="text-white ml-1" />
        </div>
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        {item.title && (
          <p className="font-display-normal text-xs text-white tracking-widest">{item.title.toUpperCase()}</p>
        )}
        {item.caption && (
          <p className="font-body text-[0.65rem] text-white/60 mt-0.5">{item.caption}</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Graphic Card ─────────────────────────────────────────────────────────────

function GraphicCard({ item, index, onClick }: { item: GraphicItem; index: number; onClick: () => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 4) * 0.07 }}
      className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer bg-[oklch(0.12_0_0)]"
      onClick={onClick}
    >
      <img
        src={item.url}
        alt={item.caption ?? item.title ?? ""}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        {item.title && (
          <p className="font-display-normal text-xs text-white tracking-widest">{item.title.toUpperCase()}</p>
        )}
        {item.caption && (
          <p className="font-body text-[0.65rem] text-white/60 mt-0.5">{item.caption}</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Photo Lightbox ───────────────────────────────────────────────────────────

function PhotoLightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: PhotoItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10" aria-label="Close">
        <X size={18} />
      </button>
      {index > 0 && (
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 sm:left-8 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10" aria-label="Previous">
          <ChevronLeft size={20} />
        </button>
      )}
      {index < items.length - 1 && (
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 sm:right-8 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10" aria-label="Next">
          <ChevronRight size={20} />
        </button>
      )}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="max-w-5xl max-h-[85vh] mx-8 flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={item.url} alt={item.caption ?? item.title ?? ""} className="max-w-full max-h-[75vh] object-contain rounded-lg" />
        <div className="text-center">
          {item.title && <p className="font-display-normal text-xs text-white/80 tracking-widest">{item.title.toUpperCase()}</p>}
          {item.caption && <p className="font-body text-xs text-white/40 mt-0.5">{item.caption}</p>}
          <p className="font-body text-xs text-white/25 mt-1">{index + 1} / {items.length}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Video Lightbox ───────────────────────────────────────────────────────────

function VideoLightbox({
  item,
  onClose,
}: {
  item: VideoItem;
  onClose: () => void;
}) {
  const embedUrl = getVimeoEmbedUrl(item.vimeoUrl);

  // Close on Escape key
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] bg-black"
    >
      {/* Close button — floating top-right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
        aria-label="Close video"
      >
        <X size={20} />
      </button>

      {/* Full-screen iframe — no padding, no max-width */}
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          style={{ display: "block", border: "none" }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={item.title ?? "Video"}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
          Invalid Vimeo URL
        </div>
      )}

      {/* Title overlay — bottom left, subtle */}
      {item.title && (
        <div className="absolute bottom-6 left-6 pointer-events-none">
          <p className="font-display-normal text-xs text-white/60 tracking-widest">{item.title.toUpperCase()}</p>
          {item.caption && <p className="font-body text-[0.65rem] text-white/35 mt-0.5">{item.caption}</p>}
        </div>
      )}
    </motion.div>
  );
}

// ─── Graphic Lightbox ─────────────────────────────────────────────────────────

function GraphicLightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: GraphicItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10" aria-label="Close">
        <X size={18} />
      </button>
      {index > 0 && (
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 sm:left-8 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10" aria-label="Previous">
          <ChevronLeft size={20} />
        </button>
      )}
      {index < items.length - 1 && (
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 sm:right-8 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10" aria-label="Next">
          <ChevronRight size={20} />
        </button>
      )}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="max-w-5xl max-h-[85vh] mx-8 flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={item.url} alt={item.caption ?? item.title ?? ""} className="max-w-full max-h-[75vh] object-contain rounded-lg" />
        <div className="text-center">
          {item.title && <p className="font-display-normal text-xs text-white/80 tracking-widest">{item.title.toUpperCase()}</p>}
          {item.caption && <p className="font-body text-xs text-white/40 mt-0.5">{item.caption}</p>}
          <p className="font-body text-xs text-white/25 mt-1">{index + 1} / {items.length}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Section Tabs ─────────────────────────────────────────────────────────────

const SECTIONS: { id: SectionId; label: string; icon: React.ReactNode }[] = [ // eslint-disable-line @typescript-eslint/no-unused-vars
  { id: "photos", label: "Photos", icon: <Image size={16} /> },
  { id: "videos", label: "Videos", icon: <Video size={16} /> },
  { id: "graphics", label: "Graphics", icon: <Palette size={16} /> },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

// ─── Client Filter Bar (Graphics) ───────────────────────────────────────────

function ClientFilterBar({
  clients,
  activeClient,
  onSelect,
}: {
  clients: string[];
  activeClient: string | null;
  onSelect: (client: string | null) => void;
}) {
  if (clients.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-6">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-1.5 rounded-full text-[0.7rem] font-semibold tracking-[0.1em] transition-all duration-200 ${
          activeClient === null
            ? "bg-white text-[oklch(0.07_0_0)]"
            : "bg-white/8 text-white/60 border border-white/10 hover:bg-white/15 hover:text-white"
        }`}
      >
        ALL
      </button>
      {clients.map((client) => (
        <button
          key={client}
          onClick={() => onSelect(activeClient === client ? null : client)}
          className={`px-4 py-1.5 rounded-full text-[0.7rem] font-semibold tracking-[0.1em] transition-all duration-200 ${
            activeClient === client
              ? "bg-white text-[oklch(0.07_0_0)]"
              : "bg-white/8 text-white/60 border border-white/10 hover:bg-white/15 hover:text-white"
          }`}
        >
          {client.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("photos");
  const [activeTagId, setActiveTagId] = useState<number | null>(null);
  const [activeClient, setActiveClient] = useState<string | null>(null);

  // Photo lightbox
  const [photoLightboxIndex, setPhotoLightboxIndex] = useState<number | null>(null);
  // Video lightbox
  const [videoLightboxItem, setVideoLightboxItem] = useState<VideoItem | null>(null);
  // Graphic lightbox
  const [graphicLightboxIndex, setGraphicLightboxIndex] = useState<number | null>(null);

  // Data queries
  const { data: photos = [], isLoading: photosLoading } = trpc.portfolio.listPhotos.useQuery();
  const { data: videos = [], isLoading: videosLoading } = trpc.portfolio.listVideos.useQuery();
  const { data: graphics = [], isLoading: graphicsLoading } = trpc.portfolio.listGraphics.useQuery();
  const { data: allTags = [] } = trpc.portfolio.listTags.useQuery();

  // Filter items by active tag
  const filteredPhotos = activeTagId === null
    ? (photos as PhotoItem[])
    : (photos as PhotoItem[]).filter((p) => p.tags.some((t) => t.id === activeTagId));

  const filteredVideos = activeTagId === null
    ? (videos as VideoItem[])
    : (videos as VideoItem[]).filter((v) => v.tags.some((t) => t.id === activeTagId));

  const graphicsTyped = graphics as GraphicItem[];
  // Derive unique client list from graphics data (preserving order of first appearance)
  const graphicClients = Array.from(
    new Set(graphicsTyped.map((g) => g.client).filter((c): c is string => !!c))
  );

  const filteredGraphics = graphicsTyped.filter((g) => {
    const tagMatch = activeTagId === null || g.tags.some((t) => t.id === activeTagId);
    const clientMatch = activeClient === null || g.client === activeClient;
    return tagMatch && clientMatch;
  });

  // Reset tag + client filter when switching sections
  const handleSectionChange = useCallback((id: SectionId) => {
    setActiveSection(id);
    setActiveTagId(null);
    setActiveClient(null);
  }, []);

  const isLoading = activeSection === "photos" ? photosLoading : activeSection === "videos" ? videosLoading : graphicsLoading;

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 sm:pt-40 sm:pb-16 px-5 sm:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="section-label text-white/40 mb-6"
        >
          <span>✦</span><span>OUR WORK</span>
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(2rem,6vw,5.5rem)] leading-[0.88] text-white max-w-4xl"
        >
          PORTFOLIO
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-body text-white/50 text-sm sm:text-base max-w-xl leading-relaxed mt-4"
        >
          Photography, video, and design across automotive, events, headshots, and brand content — Las Vegas and South Florida.
        </motion.p>
      </section>

      {/* Section Tabs */}
      <section className="px-5 sm:px-10 lg:px-16 pb-0">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-0 border-b border-white/10"
        >
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-mono tracking-wider border-b-2 transition-all -mb-px ${
                activeSection === section.id
                  ? "border-white text-white"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              {section.icon}
              {section.label.toUpperCase()}
            </button>
          ))}
        </motion.div>

        {/* Tag filter (Photos + Videos) / Client filter (Graphics) */}
        {activeSection !== "graphics" ? (
          <TagFilterBar
            tags={allTags as Tag[]}
            activeTagId={activeTagId}
            onSelect={setActiveTagId}
          />
        ) : (
          <ClientFilterBar
            clients={graphicClients}
            activeClient={activeClient}
            onSelect={setActiveClient}
          />
        )}
      </section>

      {/* Grid */}
      <section className="px-5 sm:px-10 lg:px-16 py-8 pb-20 sm:pb-32">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="font-body text-white/30 text-sm">Loading…</p>
            </motion.div>
          ) : activeSection === "photos" ? (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              {filteredPhotos.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-body text-white/30 text-sm">No photos yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredPhotos.map((item, i) => (
                    <PhotoCard
                      key={item.id}
                      item={item}
                      index={i}
                      onClick={() => setPhotoLightboxIndex(i)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : activeSection === "videos" ? (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              {filteredVideos.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-body text-white/30 text-sm">No videos yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredVideos.map((item, i) => (
                    <VideoCard
                      key={item.id}
                      item={item}
                      index={i}
                      onClick={() => setVideoLightboxItem(item)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="graphics"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              {filteredGraphics.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-body text-white/30 text-sm">No graphics yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredGraphics.map((item, i) => (
                    <GraphicCard
                      key={item.id}
                      item={item}
                      index={i}
                      onClick={() => setGraphicLightboxIndex(i)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Lightboxes */}
      <AnimatePresence>
        {photoLightboxIndex !== null && (
          <PhotoLightbox
            key="photo-lb"
            items={filteredPhotos}
            index={photoLightboxIndex}
            onClose={() => setPhotoLightboxIndex(null)}
            onPrev={() => setPhotoLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : null))}
            onNext={() => setPhotoLightboxIndex((i) => (i !== null ? Math.min(filteredPhotos.length - 1, i + 1) : null))}
          />
        )}
        {videoLightboxItem !== null && (
          <VideoLightbox
            key="video-lb"
            item={videoLightboxItem}
            onClose={() => setVideoLightboxItem(null)}
          />
        )}
        {graphicLightboxIndex !== null && (
          <GraphicLightbox
            key="graphic-lb"
            items={filteredGraphics}
            index={graphicLightboxIndex}
            onClose={() => setGraphicLightboxIndex(null)}
            onPrev={() => setGraphicLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : null))}
            onNext={() => setGraphicLightboxIndex((i) => (i !== null ? Math.min(filteredGraphics.length - 1, i + 1) : null))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
