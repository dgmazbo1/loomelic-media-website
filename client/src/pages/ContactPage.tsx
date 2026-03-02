/* ============================================================
   ContactPage — /contact
   Real contact page with form, inline validation, success state
   Dual market: Las Vegas + South Florida
   ============================================================ */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, MapPin, Phone, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";

type FormData = {
  name: string;
  email: string;
  phone: string;
  business: string;
  type: string;
  message: string;
};
type FormErrors = Partial<Record<keyof FormData, string>>;

const BUSINESS_TYPES = [
  { value: "", label: "Select business type..." },
  { value: "dealership", label: "Dealership" },
  { value: "event", label: "Event / Activation" },
  { value: "headshots", label: "Headshots / Team Photography" },
  { value: "website", label: "Website Building" },
  { value: "other", label: "Other" },
];

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!data.message.trim()) errors.message = "Please tell us about your project.";
  return errors;
}

function Field({
  label,
  id,
  required,
  error,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-body text-xs tracking-widest uppercase text-white/50">
        {label}{required && <span className="text-white/30 ml-1">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="font-body text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  `w-full bg-white/5 border ${hasError ? "border-red-400/60" : "border-white/10"} rounded-xl px-4 py-3.5 font-body text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all duration-200`;

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", business: "", type: "", message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    // Simulate async submission
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 px-5 sm:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="section-label text-white/40 mb-6"
        >
          <span>✦</span><span>GET IN TOUCH</span>
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.88] text-white max-w-4xl"
        >
          LET'S TALK ABOUT<br />
          <span className="text-outline-white">YOUR PROJECT</span>
        </motion.h1>
      </section>

      {/* Main grid */}
      <section className="px-5 sm:px-10 lg:px-16 pb-20 sm:pb-32">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-20 items-start">

          {/* Form */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start gap-6 py-12"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <h2 className="font-display text-[clamp(2rem,6vw,4rem)] leading-[0.9] text-white">
                  MESSAGE<br />RECEIVED
                </h2>
                <p className="font-body text-white/60 text-base max-w-md leading-relaxed">
                  Thank you for reaching out. We'll review your project details and get back to you within 1–2 business days.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", business: "", type: "", message: "" }); }}
                  className="btn-pill-outline text-xs mt-2"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Name" id="name" required error={errors.name}>
                    <input id="name" type="text" value={form.name} onChange={set("name")} placeholder="Your full name" className={inputClass(!!errors.name)} autoComplete="name" />
                  </Field>
                  <Field label="Email" id="email" required error={errors.email}>
                    <input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className={inputClass(!!errors.email)} autoComplete="email" />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Phone" id="phone" error={errors.phone}>
                    <input id="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="(optional)" className={inputClass(!!errors.phone)} autoComplete="tel" />
                  </Field>
                  <Field label="Business / Brand Name" id="business" error={errors.business}>
                    <input id="business" type="text" value={form.business} onChange={set("business")} placeholder="(optional)" className={inputClass(!!errors.business)} />
                  </Field>
                </div>

                <Field label="Business Type" id="type" error={errors.type}>
                  <select id="type" value={form.type} onChange={set("type")} className={`${inputClass(!!errors.type)} cursor-pointer`}>
                    {BUSINESS_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[oklch(0.12_0_0)] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Message" id="message" required error={errors.message}>
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Tell us about your project — what you need, timeline, and any relevant details."
                    rows={6}
                    className={`${inputClass(!!errors.message)} resize-none`}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-pill-light text-xs py-4 px-8 self-start disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "SENDING..." : "SEND MESSAGE +"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Contact info sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col gap-8 lg:sticky lg:top-28"
          >
            {/* Info cards */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 p-5 bg-white/5 border border-white/8 rounded-2xl">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone size={16} className="text-white/70" />
                </div>
                <div>
                  <p className="font-body text-xs text-white/40 tracking-widest uppercase mb-1">Phone</p>
                  <p className="font-body text-sm text-white">702-827-4110</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white/5 border border-white/8 rounded-2xl">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail size={16} className="text-white/70" />
                </div>
                <div>
                  <p className="font-body text-xs text-white/40 tracking-widest uppercase mb-1">Email</p>
                  <p className="font-body text-sm text-white">info@loomelicmedia.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white/5 border border-white/8 rounded-2xl">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={16} className="text-white/70" />
                </div>
                <div>
                  <p className="font-body text-xs text-white/40 tracking-widest uppercase mb-1">Locations</p>
                  <p className="font-body text-sm text-white leading-relaxed">
                    Las Vegas<br />
                    <span className="text-white/60">5940 S Rainbow Blvd #4058<br />Las Vegas, NV 89117</span>
                  </p>
                  <p className="font-body text-sm text-white mt-3 leading-relaxed">
                    South Florida<br />
                    <span className="text-white/60">Serving Miami, Fort Lauderdale,<br />and surrounding areas</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Local market note */}
            <div className="p-6 border border-white/10 rounded-2xl bg-white/3">
              <p className="font-body text-xs text-white/40 tracking-widest uppercase mb-3">✦ LOCAL IN BOTH MARKETS</p>
              <p className="font-body text-sm text-white/70 leading-relaxed">
                We're local in Las Vegas and South Florida — faster response times, on-site flexibility, and a team that understands both markets.
              </p>
            </div>

            {/* Response time */}
            <p className="font-body text-xs text-white/30 leading-relaxed">
              Typical response time: 1–2 business days.<br />
              For urgent requests, call us directly.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
