/* ============================================================
   LOOMELIC MEDIA — Contact Section + Footer
   Design: Dark Cinematic Luxury
   ============================================================ */

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { LOGO } from "@/lib/media";

const marqueeWords = ["LET'S WORK TOGETHER", "LET'S WORK TOGETHER", "LET'S WORK TOGETHER", "LET'S WORK TOGETHER"];

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", service: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Marquee CTA */}
      <div className="overflow-hidden border-y border-white/5 py-5 sm:py-6 bg-[oklch(0.05_0.005_285)]">
        <div className="flex whitespace-nowrap animate-marquee-reverse">
          {marqueeWords.concat(marqueeWords).map((word, i) => (
            <span key={i} className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-[0.1em] px-8 sm:px-12">
              {i % 2 === 0 ? (
                <span className="text-white">{word}</span>
              ) : (
                <span className="text-stroke-neon">{word}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Contact section */}
      <section id="contact" className="relative bg-[oklch(0.07_0.005_285)] py-20 sm:py-28 lg:py-36 overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[oklch(0.55_0.22_293/0.05)] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[oklch(0.92_0.28_142/0.03)] blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left: Info */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <span className="section-label">Get In Touch</span>
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white mt-4 leading-none mb-8">
                START A<br />
                <span className="text-stroke">PROJECT</span>
              </h2>
              <p className="font-body text-white/60 text-base sm:text-lg leading-relaxed mb-10">
                Ready to elevate your brand? Whether you're a car dealership, planning a wedding, or need compelling social media content — let's create something extraordinary together.
              </p>

              {/* Contact info */}
              <div className="space-y-5">
                <a href="tel:702-827-4110" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 border border-white/15 group-hover:border-[oklch(0.92_0.28_142)] flex items-center justify-center transition-colors duration-300">
                    <Phone size={16} className="text-white/50 group-hover:text-[oklch(0.92_0.28_142)] transition-colors" />
                  </div>
                  <div>
                    <span className="font-body text-[10px] text-white/40 tracking-widest uppercase block">Phone</span>
                    <span className="font-body text-sm text-white/80 group-hover:text-white transition-colors">702-827-4110</span>
                  </div>
                </a>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 border border-white/15 flex items-center justify-center">
                    <MapPin size={16} className="text-white/50" />
                  </div>
                  <div>
                    <span className="font-body text-[10px] text-white/40 tracking-widest uppercase block">Address</span>
                    <span className="font-body text-sm text-white/80">5940 South Rainbow Blvd #4058<br />Las Vegas, NV 89117</span>
                  </div>
                </div>

                <a href="https://www.instagram.com/loomelicmedia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 border border-white/15 group-hover:border-[oklch(0.92_0.28_142)] flex items-center justify-center transition-colors duration-300">
                    <Instagram size={16} className="text-white/50 group-hover:text-[oklch(0.92_0.28_142)] transition-colors" />
                  </div>
                  <div>
                    <span className="font-body text-[10px] text-white/40 tracking-widest uppercase block">Instagram</span>
                    <span className="font-body text-sm text-white/80 group-hover:text-white transition-colors">@loomelicmedia</span>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Right: Contact form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                  <div className="w-16 h-16 border border-[oklch(0.92_0.28_142)] flex items-center justify-center mb-6">
                    <span className="font-display text-3xl text-[oklch(0.92_0.28_142)]">✓</span>
                  </div>
                  <h3 className="font-display text-3xl text-white mb-3">MESSAGE SENT</h3>
                  <p className="font-body text-white/60 text-sm">We'll be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="font-body text-[10px] text-white/40 tracking-widest uppercase block mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-[oklch(0.10_0.005_285)] border border-white/10 focus:border-[oklch(0.92_0.28_142)] text-white font-body text-sm px-4 py-3 outline-none transition-colors duration-200 placeholder:text-white/25"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="font-body text-[10px] text-white/40 tracking-widest uppercase block mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-[oklch(0.10_0.005_285)] border border-white/10 focus:border-[oklch(0.92_0.28_142)] text-white font-body text-sm px-4 py-3 outline-none transition-colors duration-200 placeholder:text-white/25"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="font-body text-[10px] text-white/40 tracking-widest uppercase block mb-2">Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-[oklch(0.10_0.005_285)] border border-white/10 focus:border-[oklch(0.92_0.28_142)] text-white font-body text-sm px-4 py-3 outline-none transition-colors duration-200 placeholder:text-white/25"
                        placeholder="Your phone"
                      />
                    </div>
                    <div>
                      <label className="font-body text-[10px] text-white/40 tracking-widest uppercase block mb-2">Service</label>
                      <select
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className="w-full bg-[oklch(0.10_0.005_285)] border border-white/10 focus:border-[oklch(0.92_0.28_142)] text-white font-body text-sm px-4 py-3 outline-none transition-colors duration-200"
                      >
                        <option value="" className="bg-[oklch(0.10_0.005_285)]">Select service</option>
                        <option value="social-media" className="bg-[oklch(0.10_0.005_285)]">Social Media Creation</option>
                        <option value="photoshoot" className="bg-[oklch(0.10_0.005_285)]">Photoshoot</option>
                        <option value="wedding" className="bg-[oklch(0.10_0.005_285)]">Wedding Videography</option>
                        <option value="advertising" className="bg-[oklch(0.10_0.005_285)]">Social Media Advertising</option>
                        <option value="automotive" className="bg-[oklch(0.10_0.005_285)]">Automotive Marketing</option>
                        <option value="other" className="bg-[oklch(0.10_0.005_285)]">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-body text-[10px] text-white/40 tracking-widest uppercase block mb-2">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-[oklch(0.10_0.005_285)] border border-white/10 focus:border-[oklch(0.92_0.28_142)] text-white font-body text-sm px-4 py-3 outline-none transition-colors duration-200 resize-none placeholder:text-white/25"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <button type="submit" className="btn-neon text-sm w-full text-center">
                    SEND MESSAGE
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[oklch(0.05_0.005_285)] border-t border-white/8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <img src={LOGO} alt="Loomelic Media" className="h-10 w-auto mb-4" style={{ mixBlendMode: 'screen', filter: 'invert(1)' }} />
              <p className="font-body text-sm text-white/50 leading-relaxed max-w-sm">
                Las Vegas-based video production and digital content studio. Elevating brands through cinematic storytelling.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="https://www.instagram.com/loomelicmedia" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/50 hover:text-[oklch(0.92_0.28_142)] hover:border-[oklch(0.92_0.28_142)] transition-all duration-200">
                  <Instagram size={15} />
                </a>
                <a href="mailto:info@loomelicmedia.com"
                  className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/50 hover:text-[oklch(0.92_0.28_142)] hover:border-[oklch(0.92_0.28_142)] transition-all duration-200">
                  <Mail size={15} />
                </a>
              </div>
            </div>

            {/* Pages */}
            <div>
              <span className="font-body text-[10px] text-white/40 tracking-widest uppercase block mb-4">Pages</span>
              <ul className="space-y-3">
                {["Projects", "Services", "About", "Portfolio", "Contact"].map((page) => (
                  <li key={page}>
                    <button
                      onClick={() => document.getElementById(page.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
                      className="font-body text-sm text-white/55 hover:text-white transition-colors duration-200"
                    >
                      {page}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Address */}
            <div>
              <span className="font-body text-[10px] text-white/40 tracking-widest uppercase block mb-4">Address</span>
              <address className="not-italic">
                <p className="font-body text-sm text-white/55 leading-relaxed">
                  5940 South Rainbow Blvd #4058<br />
                  Las Vegas, NV 89117
                </p>
                <a href="tel:702-827-4110" className="font-body text-sm text-white/55 hover:text-[oklch(0.92_0.28_142)] transition-colors mt-3 block">
                  702-827-4110
                </a>
              </address>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-white/30">© 2025 Loomelic Media. All rights reserved.</p>
            <p className="font-body text-xs text-white/20">Las Vegas · Henderson · South Florida</p>
          </div>
        </div>
      </footer>
    </>
  );
}
