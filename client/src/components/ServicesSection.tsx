/* ============================================================
   LOOMELIC MEDIA — Services Section
   Design: Dark Cinematic Luxury
   - 4 service cards with original site videos as backgrounds
   ============================================================ */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HERO_VIDEOS, VIDEO_POSTERS } from "@/lib/media";

const services = [
  {
    tag: "01",
    title: "Social Media Creation",
    description: "We specialize in producing compelling multimedia content for social media platforms. Our team works closely with clients to create custom content strategies that align with their brand goals and target audience.",
    video: HERO_VIDEOS.socialMediaAds,
    poster: VIDEO_POSTERS.socialMediaAds,
  },
  {
    tag: "02",
    title: "Photoshoots",
    description: "Elevate your visual storytelling with our expertly crafted photoshoot services, capturing moments that inspire and leave a lasting impression on your audience.",
    video: HERO_VIDEOS.websiteVideo,
    poster: VIDEO_POSTERS.websiteVideo,
  },
  {
    tag: "03",
    title: "Wedding Videography",
    description: "Capture the magic and emotion of your special day with our professional wedding videography services, preserving the memories that will last a lifetime.",
    video: HERO_VIDEOS.weddingVideo,
    poster: VIDEO_POSTERS.weddingVideo,
  },
  {
    tag: "04",
    title: "Social Media Advertising",
    description: "Developing and executing targeted social media advertising campaigns that reach your desired audience and drive meaningful conversions for your business.",
    video: HERO_VIDEOS.lexusRoll,
    poster: VIDEO_POSTERS.lexusRoll,
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="group relative overflow-hidden border border-white/8 hover:border-[oklch(0.92_0.28_142/0.4)] transition-all duration-400 bg-[oklch(0.10_0.005_285/0.5)]"
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => { if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } }}
    >
      {/* Video background (plays on hover) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          src={service.video}
          poster={service.poster}
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-[oklch(0.10_0.005_285/0.8)] group-hover:bg-[oklch(0.10_0.005_285/0.6)] transition-colors duration-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        {/* Tag number */}
        <span className="font-display text-6xl sm:text-7xl text-stroke-neon opacity-15 group-hover:opacity-30 transition-opacity absolute top-4 right-6 select-none">
          {service.tag}
        </span>

        {/* Icon square */}
        <div className="w-10 h-10 border border-[oklch(0.92_0.28_142/0.3)] group-hover:border-[oklch(0.92_0.28_142)] group-hover:bg-[oklch(0.92_0.28_142/0.1)] transition-all duration-300 mb-6 flex items-center justify-center">
          <div className="w-2 h-2 bg-[oklch(0.92_0.28_142)] rounded-full" />
        </div>

        <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-[0.05em] text-white mb-3">
          {service.title.toUpperCase()}
        </h3>
        <p className="font-body text-sm text-white/55 leading-relaxed max-w-sm">
          {service.description}
        </p>

        {/* Bottom neon line */}
        <div className="absolute bottom-0 left-0 w-0 h-px bg-[oklch(0.92_0.28_142)] group-hover:w-full transition-all duration-500" />
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="relative bg-[oklch(0.07_0.005_285)] py-20 sm:py-28 lg:py-36 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16 sm:mb-20">
          <div>
            <motion.span
              ref={ref}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="section-label"
            >
              What We Do
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-9xl text-white mt-4 leading-none"
            >
              OUR<br />
              <span className="text-stroke">SERVICES</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-end"
          >
            <p className="font-body text-white/60 text-base sm:text-lg leading-relaxed mb-6">
              From automotive marketing to wedding films, we deliver content that resonates with your audience and drives real results.
            </p>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-outline text-sm inline-block w-fit"
            >
              EXPLORE SERVICES
            </button>
          </motion.div>
        </div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 gap-px bg-white/5">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
