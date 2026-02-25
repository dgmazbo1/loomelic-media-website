/* ============================================================
   ContactSection + Footer — Unusually-inspired
   Style: Dark "LET'S WORK TOGETHER" CTA banner, then light contact form,
          minimal footer with logo, nav links, social icons
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { LOGO_TRANSPARENT } from "@/lib/media";

function AnimFade({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* CTA Banner — dark */}
      <section className="section-black overflow-hidden">
        <div className="container py-16 sm:py-24 lg:py-32">
          <AnimFade>
            <p className="section-label text-white/40 mb-6">
              <span>✦</span><span>READY TO START? —</span>
            </p>
          </AnimFade>
          <AnimFade delay={0.1}>
            <h2 className="font-display text-[clamp(4rem,14vw,13rem)] leading-[0.85] text-white mb-8 sm:mb-12">
              LET'S<br />
              WORK<br />
              <span className="text-[oklch(0.4_0_0)]">TOGETHER</span>
            </h2>
          </AnimFade>
          <AnimFade delay={0.2}>
            <button
              onClick={() => { const el = document.getElementById("contact-form"); if (el) { let top = 0; let node: HTMLElement | null = el; while (node) { top += node.offsetTop; node = node.offsetParent as HTMLElement | null; } window.scrollTo({ top: Math.max(0, top - 80), behavior: "smooth" }); } }}
              className="btn-pill-light text-xs"
            >
              GET IN TOUCH +
            </button>
          </AnimFade>
        </div>
      </section>

      {/* Contact Form — light */}
      <section id="contact" className="section-light text-[oklch(0.07_0_0)]">
        <div id="contact-form" className="container py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20">
            {/* Left: info */}
            <AnimFade>
              <p className="section-label text-[oklch(0.07_0_0)/40] mb-6">
                <span>✦</span><span>CONTACT US —</span>
              </p>
              <h3 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] text-[oklch(0.07_0_0)] mb-8">
                REACH<br />
                <span className="text-[oklch(0.78_0_0)]">OUT</span>
              </h3>
              <div className="space-y-5 mb-10">
                <a href="tel:+17028274110" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-full bg-[oklch(0.07_0_0/0.06)] flex items-center justify-center group-hover:bg-[oklch(0.07_0_0)] transition-colors">
                    <Phone size={14} className="text-[oklch(0.07_0_0)] group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-body text-sm text-[oklch(0.35_0_0)] group-hover:text-[oklch(0.07_0_0)] transition-colors">702-827-4110</span>
                </a>
                <a href="mailto:info@loomelicmedia.com" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-full bg-[oklch(0.07_0_0/0.06)] flex items-center justify-center group-hover:bg-[oklch(0.07_0_0)] transition-colors">
                    <Mail size={14} className="text-[oklch(0.07_0_0)] group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-body text-sm text-[oklch(0.35_0_0)] group-hover:text-[oklch(0.07_0_0)] transition-colors">info@loomelicmedia.com</span>
                </a>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[oklch(0.07_0_0/0.06)] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={14} className="text-[oklch(0.07_0_0)]" />
                  </div>
                  <div>
                    <span className="font-body text-sm text-[oklch(0.35_0_0)]">5940 South Rainbow Blvd #4058</span><br />
                    <span className="font-body text-sm text-[oklch(0.35_0_0)]">Las Vegas, NV 89117</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <a href="https://www.instagram.com/loomelicmedia" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[oklch(0_0_0/0.15)] flex items-center justify-center text-[oklch(0.35_0_0)] hover:bg-[oklch(0.07_0_0)] hover:text-white hover:border-[oklch(0.07_0_0)] transition-all">
                  <Instagram size={15} />
                </a>
                <a href="https://www.youtube.com/@loomelicmedia" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[oklch(0_0_0/0.15)] flex items-center justify-center text-[oklch(0.35_0_0)] hover:bg-[oklch(0.07_0_0)] hover:text-white hover:border-[oklch(0.07_0_0)] transition-all">
                  <Youtube size={15} />
                </a>
              </div>
            </AnimFade>

            {/* Right: form */}
            <AnimFade delay={0.15}>
              {submitted ? (
                <div className="flex flex-col items-start justify-center h-full py-12">
                  <div className="w-12 h-12 rounded-full bg-[oklch(0.07_0_0)] flex items-center justify-center mb-6">
                    <span className="text-white text-lg">✓</span>
                  </div>
                  <h4 className="font-display text-4xl text-[oklch(0.07_0_0)] mb-3">MESSAGE SENT!</h4>
                  <p className="font-body text-sm text-[oklch(0.45_0_0)]">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-pill-dark text-xs mt-6">SEND ANOTHER +</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-[0.65rem] tracking-widest text-[oklch(0.5_0_0)] uppercase block mb-2">Name *</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full bg-[oklch(0.07_0_0/0.04)] border border-[oklch(0_0_0/0.1)] rounded-xl px-4 py-3 font-body text-sm text-[oklch(0.07_0_0)] placeholder:text-[oklch(0.6_0_0)] focus:outline-none focus:border-[oklch(0.07_0_0)] transition-colors" />
                    </div>
                    <div>
                      <label className="font-body text-[0.65rem] tracking-widest text-[oklch(0.5_0_0)] uppercase block mb-2">Email *</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full bg-[oklch(0.07_0_0/0.04)] border border-[oklch(0_0_0/0.1)] rounded-xl px-4 py-3 font-body text-sm text-[oklch(0.07_0_0)] placeholder:text-[oklch(0.6_0_0)] focus:outline-none focus:border-[oklch(0.07_0_0)] transition-colors" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-[0.65rem] tracking-widest text-[oklch(0.5_0_0)] uppercase block mb-2">Phone</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Your phone number"
                        className="w-full bg-[oklch(0.07_0_0/0.04)] border border-[oklch(0_0_0/0.1)] rounded-xl px-4 py-3 font-body text-sm text-[oklch(0.07_0_0)] placeholder:text-[oklch(0.6_0_0)] focus:outline-none focus:border-[oklch(0.07_0_0)] transition-colors" />
                    </div>
                    <div>
                      <label className="font-body text-[0.65rem] tracking-widest text-[oklch(0.5_0_0)] uppercase block mb-2">Service</label>
                      <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className="w-full bg-[oklch(0.07_0_0/0.04)] border border-[oklch(0_0_0/0.1)] rounded-xl px-4 py-3 font-body text-sm text-[oklch(0.07_0_0)] focus:outline-none focus:border-[oklch(0.07_0_0)] transition-colors">
                        <option value="">Select a service...</option>
                        <option>Automotive Marketing</option>
                        <option>Event Coverage</option>
                        <option>Social Media Content</option>
                        <option>Photography</option>
                        <option>Brand Strategy</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-[0.65rem] tracking-widest text-[oklch(0.5_0_0)] uppercase block mb-2">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your project..."
                      className="w-full bg-[oklch(0.07_0_0/0.04)] border border-[oklch(0_0_0/0.1)] rounded-xl px-4 py-3 font-body text-sm text-[oklch(0.07_0_0)] placeholder:text-[oklch(0.6_0_0)] focus:outline-none focus:border-[oklch(0.07_0_0)] transition-colors resize-none" />
                  </div>
                  <button type="submit" className="btn-pill-dark text-xs w-full sm:w-auto">
                    SEND MESSAGE →
                  </button>
                </form>
              )}
            </AnimFade>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-black border-t border-white/8">
        <div className="container py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <img src={LOGO_TRANSPARENT} alt="Loomelic Media" className="h-8 w-auto" style={{ filter: "brightness(0) invert(1)" }} />
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {["PROJECTS", "SERVICES", "ABOUT", "PORTFOLIO", "CONTACT"].map((link) => (
                <button key={link}
                  onClick={() => { const el = document.getElementById(link.toLowerCase()); if (el) { let top = 0; let node: HTMLElement | null = el; while (node) { top += node.offsetTop; node = node.offsetParent as HTMLElement | null; } window.scrollTo({ top: Math.max(0, top - 80), behavior: "smooth" }); } }}
                  className="font-body text-[0.65rem] tracking-[0.15em] text-white/35 hover:text-white transition-colors">
                  {link}
                </button>
              ))}
            </nav>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/loomelicmedia" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all">
                <Instagram size={13} />
              </a>
              <a href="https://www.youtube.com/@loomelicmedia" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all">
                <Youtube size={13} />
              </a>
            </div>
          </div>
          <div className="pt-6 border-t border-white/6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="font-body text-[0.6rem] text-white/25 tracking-widest">© 2026 LOOMELIC MEDIA LLC. ALL RIGHTS RESERVED.</p>
            <p className="font-body text-[0.6rem] text-white/20 tracking-widest">LAS VEGAS · HENDERSON · SOUTH FLORIDA</p>
          </div>
        </div>
      </footer>
    </>
  );
}
