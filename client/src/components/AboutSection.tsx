/* ============================================================
   LOOMELIC MEDIA — About Section
   Design: Dark Cinematic Luxury
   - Denham Gallimore profile
   - Vimeo intro video embed
   - Client logos
   ============================================================ */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CLIENT_LOGOS } from "@/lib/media";

const clients = [
  { name: "Lexus of Las Vegas", logo: CLIENT_LOGOS.lexusLV },
  { name: "Lexus of Henderson", logo: CLIENT_LOGOS.lexusHenderson },
  { name: "M&MM United", logo: CLIENT_LOGOS.mmmUnited },
  { name: "JW Offroad", logo: CLIENT_LOGOS.jwOffroad },
  { name: "Centennial Subaru", logo: CLIENT_LOGOS.centennialSubaru },
];

function AnimFade({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="relative bg-[oklch(0.07_0.005_285)] overflow-hidden">
      {/* Main about content */}
      <div className="py-20 sm:py-28 lg:py-36">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Profile */}
            <AnimFade>
              <span className="section-label">About</span>
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white mt-4 leading-none">
                DENHAM<br />
                <span className="text-stroke">GALLIMORE</span>
              </h2>
              <div className="mt-2 mb-6">
                <span className="font-body text-sm text-[oklch(0.55_0.22_293)] tracking-[0.2em] uppercase">Videographer & Owner · Loomelic Media</span>
              </div>
              <div className="divider-neon w-24 mb-6" />
              <p className="font-body text-white/70 text-base sm:text-lg leading-relaxed mb-4">
                Based in Las Vegas, Loomelic Media specializes in producing cinematic content that elevates brands. From luxury automotive campaigns for Lexus dealerships to emotional wedding films and high-impact social media content, every project is crafted with precision and passion.
              </p>
              <p className="font-body text-white/55 text-sm sm:text-base leading-relaxed mb-8">
                Serving Las Vegas, Henderson, and the South Florida market — connecting car dealers, businesses, and individuals with expert photo, video, and digital content creation.
              </p>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-neon text-sm"
              >
                LET'S WORK TOGETHER
              </button>
            </AnimFade>

            {/* Right: Vimeo video */}
            <AnimFade delay={0.2} className="w-full">
              <div className="relative aspect-video rounded-sm overflow-hidden border border-white/10 shadow-[0_0_60px_oklch(0.55_0.22_293/0.2)]">
                <iframe
                  src="https://player.vimeo.com/video/925584368?h=20fec3fe5f&autoplay=0&title=0&byline=0&portrait=0&color=9BFF57"
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Denham Gallimore — Loomelic Media"
                />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-6 h-px bg-[oklch(0.92_0.28_142)]" />
                <span className="font-body text-xs text-white/40 tracking-widest uppercase">Denham Gallimore · Loomelic Media</span>
              </div>
            </AnimFade>
          </div>
        </div>
      </div>

      {/* Client logos strip */}
      <div className="border-t border-white/5 py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <AnimFade>
            <span className="section-label mb-8 block">Clients I've worked with</span>
            <div className="flex flex-wrap items-center gap-8 sm:gap-12 lg:gap-16">
              {clients.map((client) => (
                <div key={client.name} className="group flex items-center gap-3">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-8 sm:h-10 w-auto object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300 filter brightness-0 invert"
                  />
                </div>
              ))}
            </div>
          </AnimFade>
        </div>
      </div>
    </section>
  );
}
