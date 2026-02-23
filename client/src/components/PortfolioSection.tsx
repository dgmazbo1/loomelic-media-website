/* ============================================================
   LOOMELIC MEDIA — Portfolio Section
   Design: Dark Cinematic Luxury
   - Masonry photo gallery with all original site images
   - Video reel grid with all original site videos
   ============================================================ */

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import { PORTFOLIO_GALLERY, HERO_VIDEOS, VIDEO_POSTERS, DESIGN_WORK } from "@/lib/media";

const VIDEO_REELS = [
  { title: "Headlight", src: HERO_VIDEOS.headlight, poster: VIDEO_POSTERS.headlight, category: "Automotive" },
  { title: "Lexus Roll", src: HERO_VIDEOS.lexusRoll, poster: VIDEO_POSTERS.lexusRoll, category: "Automotive" },
  { title: "Centennial Drone", src: HERO_VIDEOS.centennialDrone, poster: VIDEO_POSTERS.centennialDrone, category: "Drone" },
  { title: "Wedding Film", src: HERO_VIDEOS.weddingVideo, poster: VIDEO_POSTERS.weddingVideo, category: "Wedding" },
  { title: "Janel Wedding", src: HERO_VIDEOS.janelWedding, poster: VIDEO_POSTERS.janelWedding, category: "Wedding" },
  { title: "Wedding Walk", src: HERO_VIDEOS.weddingWalk, poster: VIDEO_POSTERS.weddingWalk, category: "Wedding" },
  { title: "Website Video", src: HERO_VIDEOS.websiteVideo, poster: VIDEO_POSTERS.websiteVideo, category: "Brand" },
  { title: "Social Media Ads", src: HERO_VIDEOS.socialMediaAds, poster: VIDEO_POSTERS.socialMediaAds, category: "Social" },
  { title: "Drone Filler", src: HERO_VIDEOS.droneFiller, poster: VIDEO_POSTERS.droneFiller, category: "Drone" },
  { title: "GX Showroom", src: HERO_VIDEOS.gxShowroom, poster: VIDEO_POSTERS.lexusRoll, category: "Automotive" },
  { title: "Kona Ice", src: HERO_VIDEOS.konaIce, poster: VIDEO_POSTERS.socialMediaAds, category: "Brand" },
  { title: "Apartments", src: HERO_VIDEOS.apartments, poster: VIDEO_POSTERS.websiteVideo, category: "Real Estate" },
];

const GALLERY_TABS = ["All", "Automotive", "Weddings", "Events", "Design"];

// Categorize portfolio images
const CATEGORIZED: Record<string, string[]> = {
  "Automotive": PORTFOLIO_GALLERY.slice(0, 22),
  "Weddings": PORTFOLIO_GALLERY.slice(22, 37),
  "Events": PORTFOLIO_GALLERY.slice(37, 47),
  "Design": DESIGN_WORK,
  "All": [...PORTFOLIO_GALLERY, ...DESIGN_WORK],
};

function VideoCard({ video, index }: { video: typeof VIDEO_REELS[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group relative aspect-video overflow-hidden cursor-pointer bg-[oklch(0.10_0.005_285)]"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={video.src}
        poster={video.poster}
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        onEnded={() => setPlaying(false)}
      />
      <div className={`absolute inset-0 bg-[oklch(0.07_0.005_285/0.5)] transition-opacity duration-300 ${playing ? "opacity-0" : "opacity-100 group-hover:opacity-30"}`} />

      {/* Play button */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${playing ? "opacity-0" : "opacity-100"}`}>
        <div className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center bg-[oklch(0.07_0.005_285/0.5)] group-hover:border-[oklch(0.92_0.28_142)] group-hover:bg-[oklch(0.92_0.28_142/0.2)] transition-all duration-300">
          <Play size={16} className="text-white ml-0.5" />
        </div>
      </div>

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[oklch(0.07_0.005_285)] to-transparent">
        <span className="font-body text-[10px] text-white/40 tracking-widest uppercase">{video.category}</span>
        <p className="font-display text-sm text-white tracking-[0.05em]">{video.title.toUpperCase()}</p>
      </div>
    </motion.div>
  );
}

export default function PortfolioSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeTab, setActiveTab] = useState("All");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const currentImages = CATEGORIZED[activeTab] || CATEGORIZED["All"];
  const displayImages = showAll ? currentImages : currentImages.slice(0, 24);

  return (
    <section id="portfolio" className="relative bg-[oklch(0.07_0.005_285)] py-20 sm:py-28 lg:py-36 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="mb-16 sm:mb-20">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            <span className="section-label">Our Work</span>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white mt-4 leading-none">
              PORTFOLIO<br />
              <span className="text-stroke">GALLERY</span>
            </h2>
          </motion.div>
        </div>

        {/* ─── VIDEO REELS ─── */}
        <div className="mb-20 sm:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between mb-8"
          >
            <span className="section-label">Video Reels</span>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {VIDEO_REELS.map((video, i) => (
              <VideoCard key={video.title} video={video} index={i} />
            ))}
          </div>
        </div>

        {/* ─── PHOTO GALLERY ─── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-8"
          >
            <span className="section-label">Photography</span>
          </motion.div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
            {GALLERY_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setShowAll(false); }}
                className={`font-body text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 ${
                  activeTab === tab
                    ? "border-[oklch(0.92_0.28_142)] text-[oklch(0.92_0.28_142)] bg-[oklch(0.92_0.28_142/0.1)]"
                    : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/80"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          <div className="gallery-grid">
            {displayImages.map((img, i) => (
              <motion.img
                key={img + i}
                src={img}
                alt={`Portfolio ${i + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
                className="cursor-pointer hover:opacity-90 transition-opacity duration-200"
                loading="lazy"
                onClick={() => setLightboxImg(img)}
              />
            ))}
          </div>

          {/* Load more */}
          {!showAll && currentImages.length > 24 && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setShowAll(true)}
                className="btn-outline text-sm"
              >
                LOAD MORE ({currentImages.length - 24} more)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[oklch(0.05_0.005_285/0.97)] flex items-center justify-center p-4"
            onClick={() => setLightboxImg(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:border-[oklch(0.92_0.28_142)] transition-colors"
              onClick={() => setLightboxImg(null)}
            >
              <X size={18} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightboxImg}
              alt="Portfolio"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
