/* ============================================================
   PortalsSection — Client Portal entry cards on the homepage
   Two large cards: Dealer Portal (blue) + Vendor Portal (purple)
   ============================================================ */
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Building2, Camera, ArrowRight, Lock } from "lucide-react";

export default function PortalsSection() {
  const [, navigate] = useLocation();

  return (
    <section className="relative py-24 bg-[oklch(0.07_0_0)] overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1_0_0) 1px, transparent 1px), linear-gradient(90deg, oklch(1_0_0) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="font-body text-xs tracking-[0.2em] text-white/30 uppercase mb-3">
            Secure Access
          </p>
          <h2 className="font-display-normal text-4xl sm:text-5xl lg:text-6xl text-white leading-none">
            CLIENT PORTALS
          </h2>
          <p className="font-body text-white/40 text-base mt-4 max-w-xl mx-auto">
            Dedicated dashboards for dealership partners and creative vendors — track projects, manage deliverables, and stay in sync.
          </p>
        </div>

        {/* Portal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dealer Portal */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={() => navigate("/dealer")}
              className="group relative w-full text-left rounded-3xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-[oklch(0.08_0_0)] hover:border-blue-500/40 hover:from-blue-950/60 transition-all duration-300 p-8 lg:p-10"
            >
              {/* Glow */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/20 transition-all duration-500" />

              <div className="relative">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center mb-6">
                  <Building2 className="w-7 h-7 text-blue-400" />
                </div>

                {/* Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-300 text-[0.65rem] font-bold tracking-widest uppercase">
                    <Lock className="w-2.5 h-2.5" /> Dealer Access
                  </span>
                </div>

                <h3 className="font-display-normal text-3xl lg:text-4xl text-white mb-3 leading-none">
                  DEALER PORTAL
                </h3>
                <p className="font-body text-white/50 text-sm leading-relaxed mb-8">
                  Onboarding wizard, project status tracker, document uploads, and direct communication with your Loomelic Media account team.
                </p>

                {/* Feature list */}
                <ul className="space-y-2 mb-8">
                  {["7-step onboarding wizard", "Project status & gallery", "Document management", "Monthly reporting"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-blue-300 font-semibold text-sm group-hover:gap-3 transition-all duration-200">
                  Access Dealer Portal
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          </motion.div>

          {/* Vendor Portal */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={() => navigate("/vendor")}
              className="group relative w-full text-left rounded-3xl overflow-hidden border border-purple-500/20 bg-gradient-to-br from-purple-950/40 to-[oklch(0.08_0_0)] hover:border-purple-500/40 hover:from-purple-950/60 transition-all duration-300 p-8 lg:p-10"
            >
              {/* Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:bg-purple-500/20 transition-all duration-500" />

              <div className="relative">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center mb-6">
                  <Camera className="w-7 h-7 text-purple-400" />
                </div>

                {/* Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 text-[0.65rem] font-bold tracking-widest uppercase">
                    <Lock className="w-2.5 h-2.5" /> Vendor Access
                  </span>
                </div>

                <h3 className="font-display-normal text-3xl lg:text-4xl text-white mb-3 leading-none">
                  VENDOR PORTAL
                </h3>
                <p className="font-body text-white/50 text-sm leading-relaxed mb-8">
                  Job board, contract management, deliverable tracking, and scheduling — everything creative vendors need in one place.
                </p>

                {/* Feature list */}
                <ul className="space-y-2 mb-8">
                  {["Available job listings", "Contract review & sign", "Deliverable uploads", "Schedule & availability"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-purple-300 font-semibold text-sm group-hover:gap-3 transition-all duration-200">
                  Access Vendor Portal
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Bottom note */}
        <p className="text-center font-body text-xs text-white/20 mt-10 tracking-wide">
          Portal access requires an invite token from your Loomelic Media account manager.
        </p>
      </div>
    </section>
  );
}
