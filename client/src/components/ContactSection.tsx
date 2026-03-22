/* ============================================================
   ContactSection + Footer — Dealer-acquisition rebuild
   Design: Dark "READY TO GROW?" CTA banner, then dealer funnel form
           with dealership name + role fields, validation, success state
   ============================================================ */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import SocialLinks from "@/components/SocialLinks";
import { LOGO_TRANSPARENT } from "@/lib/media";
import { useLocation } from "wouter";

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

const inputClass = "w-full bg-[oklch(0.07_0_0/0.04)] border border-[oklch(0_0_0/0.1)] rounded-xl px-4 py-3 font-body text-sm text-[oklch(0.07_0_0)] placeholder:text-[oklch(0.6_0_0)] focus:outline-none focus:border-[oklch(0.07_0_0)] transition-colors";
const labelClass = "font-body text-[0.65rem] tracking-widest text-[oklch(0.5_0_0)] uppercase block mb-2";

export default function ContactSection() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({
    name: "",
    dealership: "",
    role: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  };

  const scrollToForm = () => {
    const el = document.getElementById("contact-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* CTA Banner — dark */}
      <section className="section-black overflow-hidden">
        <div className="container py-16 sm:py-24 lg:py-32">
          <AnimFade>
            <p className="section-label text-white/40 mb-6">
              <span>✦</span><span>READY TO GROW? —</span>
            </p>
          </AnimFade>
          <AnimFade delay={0.1}>
            <h2 className="font-display text-[clamp(2.5rem,9vw,8.5rem)] leading-[0.85] text-white mb-8 sm:mb-12">
              LET'S<br />
              BUILD YOUR<br />
              <span className="text-[oklch(0.4_0_0)]">CONTENT SYSTEM</span>
            </h2>
          </AnimFade>
          <AnimFade delay={0.2}>
            <button onClick={scrollToForm} className="btn-pill-light text-xs">
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
              <h3 className="font-display text-[clamp(1.6rem,4vw,3.3rem)] leading-[0.9] text-[oklch(0.07_0_0)] mb-4">
                LET'S<br />
                <span className="text-[oklch(0.78_0_0)]">TALK</span>
              </h3>
              <p className="font-body text-sm text-[oklch(0.45_0_0)] leading-relaxed mb-8 max-w-xs">
                Tell us about your project and what you need. We'll put together a plan and get back to you within 24 hours.
              </p>
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
              <SocialLinks variant="light" size="md" />
            </AnimFade>

            {/* Right: form */}
            <AnimFade delay={0.15}>
              {submitted ? (
                <div className="flex flex-col items-start justify-center h-full py-12">
                  <div className="w-12 h-12 rounded-full bg-[oklch(0.07_0_0)] flex items-center justify-center mb-6">
                    <span className="text-white text-lg">✓</span>
                  </div>
                  <h4 className="font-display text-4xl text-[oklch(0.07_0_0)] mb-3">MESSAGE SENT!</h4>
                  <p className="font-body text-sm text-[oklch(0.45_0_0)] mb-2">We'll review your request and get back to you within 24 hours.</p>
                  <p className="font-body text-xs text-[oklch(0.55_0_0)]">In the meantime, check out our recent dealer work below.</p>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setSubmitted(false)} className="btn-pill-dark text-xs">SEND ANOTHER +</button>
                    <button onClick={() => navigate("/projects")} className="btn-pill-outline !text-[oklch(0.07_0_0)] !border-[oklch(0_0_0/0.2)] hover:!bg-[oklch(0.07_0_0)] hover:!text-white text-xs">VIEW OUR WORK</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Row 1: Name + Dealership */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Your Name *</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="First and last name"
                        className={`${inputClass} ${errors.name ? "border-red-400" : ""}`} />
                      {errors.name && <p className="font-body text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Dealership Name</label>
                      <input type="text" value={form.dealership} onChange={(e) => setForm({ ...form, dealership: e.target.value })}
                        placeholder="e.g. Lexus of Henderson"
                        className={inputClass} />
                    </div>
                  </div>

                  {/* Row 2: Role + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Your Role</label>
                      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass}>
                        <option value="">Select your role...</option>
                        <option>General Manager</option>
                        <option>Marketing Manager / Director</option>
                        <option>Internet / BDC Manager</option>
                        <option>Owner / Principal</option>
                        <option>Sales Manager</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Email *</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className={`${inputClass} ${errors.email ? "border-red-400" : ""}`} />
                      {errors.email && <p className="font-body text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Row 3: Phone + Service */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Best number to reach you"
                        className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Service Needed</label>
                      <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={inputClass}>
                        <option value="">Select a service...</option>
                        <option>Inventory Photography</option>
                        <option>Walkaround + Delivery Videos</option>
                        <option>Short-Form Social Reels</option>
                        <option>Dealership Event Coverage</option>
                        <option>Staff Headshots + Team Branding</option>
                        <option>Drone + Exterior Visuals</option>
                        <option>Monthly Retainer Package</option>
                        <option>Other / Not Sure Yet</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className={labelClass}>Tell Us About Your Needs *</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How many vehicles per month? Any upcoming events? What's your biggest content challenge right now?"
                      className={`${inputClass} resize-none ${errors.message ? "border-red-400" : ""}`} />
                    {errors.message && <p className="font-body text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  <button type="submit" className="btn-pill-dark text-xs w-full sm:w-auto">
                    SEND REQUEST →
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
            <div className="overflow-hidden" style={{ height: "40px" }}>
              <img src={LOGO_TRANSPARENT} alt="Loomelic Media" className="w-[130px] h-auto" style={{ filter: "brightness(0) invert(1)", marginTop: "-97px" }} />
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer navigation">
              {[
                { label: "PROJECTS", href: "/projects" },
                { label: "SERVICES", href: "/services" },
                { label: "PORTFOLIO", href: "/portfolio" },
                { label: "USE CASES", href: "/use-cases" },
                { label: "ABOUT", href: "/about" },
                { label: "CONTACT", href: "/contact" },
              ].map((link) => (
                link.href.startsWith("#") ? (
                  <button key={link.label}
                    onClick={() => { const el = document.getElementById(link.href.slice(1)); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
                    className="font-body text-[0.65rem] tracking-[0.15em] text-white/35 hover:text-white transition-colors">
                    {link.label}
                  </button>
                ) : (
                  <a key={link.label} href={link.href}
                    className="font-body text-[0.65rem] tracking-[0.15em] text-white/35 hover:text-white transition-colors">
                    {link.label}
                  </a>
                )
              ))}
            </nav>
            <SocialLinks variant="dark" size="sm" />
          </div>
          <div className="pt-6 border-t border-white/6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="font-body text-[0.6rem] text-white/25 tracking-widest">© 2026 LOOMELIC MEDIA LLC. ALL RIGHTS RESERVED.</p>
            <p className="font-body text-[0.6rem] text-white/20 tracking-widest">LAS VEGAS · HENDERSON</p>
          </div>
        </div>
      </footer>
    </>
  );
}
