/* ============================================================
   AllServicesPage — /services
   Full listing of all services, reusing the SERVICES array
   from ServicesSection.
   ============================================================ */

import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";

const SERVICES = [
  { slug: "automotive-marketing", name: "AUTOMOTIVE\nMARKETING", desc: "Cinematic vehicle showcases and dealership campaigns that drive traffic and convert viewers into buyers." },
  { slug: "event-coverage", name: "EVENT\nCOVERAGE", desc: "Full-service photo and video coverage for corporate events, brand activations, and private gatherings." },
  { slug: "social-media-content", name: "SOCIAL MEDIA\nCONTENT", desc: "High-impact short-form video and photo content built to stop the scroll and drive real results." },
  { slug: "photography", name: "PHOTOGRAPHY", desc: "Professional photo shoots for automotive, events, portraits, and commercial use." },
  { slug: "brand-strategy", name: "BRAND\nSTRATEGY", desc: "Visual identity, content systems, and marketing structure that position your brand for sustained growth." },
  { slug: "website-redesign", name: "WEBSITE\nREDESIGN", desc: "Modern, mobile-first websites built to match the premium level of your brand." },
  { slug: "headshots", name: "HEADSHOTS +\nTEAM PHOTOGRAPHY", desc: "Clean, consistent professional portraits for every department — built for websites, social media, and more." },
];

export default function AllServicesPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />

      {/* Hero */}
      <section className="section-black pt-32 pb-16 sm:pb-24">
        <div className="container">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-10 font-body text-xs tracking-widest"
          >
            <ArrowLeft size={14} /> BACK TO HOME
          </motion.button>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-label text-white/40 mb-4"
          >
            <span>✦</span><span>WHAT WE DO —</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.88] text-white mb-4"
          >
            ALL<br />
            <span className="text-[oklch(0.4_0_0)]">SERVICES</span>
          </motion.h1>
        </div>
      </section>

      {/* Services list */}
      <section className="section-black pb-24">
        <div className="container">
          <div className="border-t border-white/10">
            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                onClick={() => navigate(`/services/${svc.slug}`)}
                className="flex items-center justify-between gap-6 py-8 border-b border-white/10 group cursor-pointer hover:bg-white/[0.025] rounded-xl px-4 -mx-4 transition-all duration-300"
              >
                <div>
                  <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.9] text-white group-hover:text-lime transition-colors duration-300 whitespace-pre-line">
                    {svc.name}
                  </h2>
                  <p className="font-body text-sm text-white/40 leading-relaxed mt-3 max-w-xl">{svc.desc}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300 shrink-0">
                  <ArrowRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
