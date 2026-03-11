/**
 * ProposalMicrosite — EXACT CLONE of https://abchyundai.manus.space/
 *
 * RULES:
 * - All images, videos, text, pricing, layout, fonts, colors are STATIC
 * - ONLY dynamic variable: dealerName (replaces every "ABC Hyundai")
 * - DO NOT modify anything else
 */
import { useEffect, useRef, useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";

// ── All image/media assets from the ORIGINAL template (exact CDN URLs) ────────
const IMG = {
  hero:        "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029344895/kMplwuXnNjAYvNfw.jpeg",
  dealership:  "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029344895/auaMOnDbBYAmNhEh.jpg",
  santaFeAd:   "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029344895/qOtzFmvzDbzFTuPJ.png",
  automotive1: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029344895/CONbCWLaFPGMNXht.jpg",
  headshot:    "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029344895/sIRnqOlBsoEsukYP.jpg",
  delivery:    "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029344895/sxJtlEOIjapFSXyV.jpg",
  port1:       "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029344895/PkkWOhHYZhzmNifA.webp",
  port2:       "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029344895/ESDulLjxvBweujgV.webp",
  port3:       "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029344895/RJhjjPlJrOMQROzL.webp",
  port4:       "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029344895/QianXrWdmZShjujb.webp",
  portExtra:   "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029344895/DJtdIDNIerRBgwSA.jpg",
};

// Vimeo embed (exact URL from the original template)
const VIMEO = "https://player.vimeo.com/video/1123340325?h=4bb97b9a02&badge=0&autopause=0&player_id=0&app_id=58479";

// ── Color + font constants ─────────────────────────────────────────────────────
const C = {
  bg:      "#0A0A0A",
  bgAlt:   "#0D0D0D",
  accent:  "#FF4400",
  white:   "#FFFFFF",
  muted:   "rgba(255,255,255,0.6)",
  faint:   "rgba(255,255,255,0.3)",
  border:  "rgba(255,255,255,0.1)",
  font:    "'Inter',system-ui,sans-serif",
  display: "'Oswald',sans-serif",
};

// ── Reusable sub-components ────────────────────────────────────────────────────
function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
      <div style={{ width: 32, height: 2, backgroundColor: C.accent, flexShrink: 0 }} />
      <span style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)" }}>
        {children}
      </span>
    </div>
  );
}

function H2({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2 style={{ fontFamily: C.display, fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.02em", color: C.white, ...style }}>
      {children}
    </h2>
  );
}

// ── Animated counter hook ──────────────────────────────────────────────────────
function useCounter(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setValue(Math.floor(progress * target));
          if (progress < 1) requestAnimationFrame(tick);
          else setValue(target);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return { value, ref };
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProposalMicrosite() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";

  const [navBg, setNavBg] = useState(false);

  const { data: proposal, isLoading } = trpc.dealerGrowth.dealership.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const trackMutation = trpc.dealerGrowth.tracking.track.useMutation();
  const tracked = useRef(false);

  useEffect(() => {
    if (proposal && !tracked.current) {
      tracked.current = true;
      trackMutation.mutate({ slug, eventType: "view" });
    }
  }, [proposal, slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setNavBg(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stat1 = useCounter(1);
  const stat2 = useCounter(1);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── ONLY dynamic value ────────────────────────────────────────────────────
  const dealerName: string = (proposal as any)?.name ?? "ABC Hyundai";
  // ─────────────────────────────────────────────────────────────────────────

  const trackCTA = (type: string) => trackMutation.mutate({ slug, eventType: type as any });

  const container: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };
  const section: React.CSSProperties = { padding: "96px 0" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, color: C.white, fontFamily: C.font }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
        * { box-sizing: border-box; }
        a { text-decoration: none; color: inherit; }
        img { display: block; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .pm-hover-scale:hover { transform: scale(1.02); transition: transform 0.3s; }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all 0.3s",
        backgroundColor: navBg ? "rgba(10,10,10,0.95)" : "transparent",
        backdropFilter: navBg ? "blur(8px)" : "none",
        borderBottom: navBg ? `1px solid ${C.border}` : "none",
      }}>
        <div style={{ ...container, display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderLeft: `14px solid ${C.accent}` }} />
            <span style={{ fontFamily: C.display, fontWeight: 700, color: C.white, fontSize: 18, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Loomelic Media
            </span>
          </div>
          <a href="https://www.loomelicmedia.com" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", border: `1px solid rgba(255,255,255,0.2)`, padding: "8px 16px" }}>
            WWW.LOOMELICMEDIA.COM
          </a>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "flex-end", paddingBottom: 96 }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src={IMG.hero} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.7) 60%, rgba(10,10,10,0.98) 100%)" }} />
        </div>
        <div style={{ ...container, position: "relative", zIndex: 10, width: "100%" }}>
          <SectionTag>Social Media Proposal</SectionTag>
          <h1 style={{ fontFamily: C.display, fontWeight: 700, lineHeight: 0.95, letterSpacing: "-0.02em", marginBottom: 24 }}>
            {dealerName.split(" ").map((word, i, arr) => (
              <span key={i} style={{ display: "block", fontSize: "clamp(3rem,10vw,7rem)", color: i === arr.length - 1 ? C.accent : C.white }}>
                {word}
              </span>
            ))}
          </h1>
          <p style={{ color: C.muted, fontSize: 18, lineHeight: 1.7, maxWidth: 480, marginBottom: 32 }}>
            A content strategy built to turn your dealership into the most trusted automotive brand in Las Vegas.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <a href="#section-why"
              style={{ display: "inline-block", backgroundColor: C.accent, color: C.white, padding: "16px 32px", fontFamily: C.display, fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              READ PROPOSAL
            </a>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Prepared by Loomelic Media · 2026</span>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", animation: "bounce 2s ease-in-out infinite" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </section>

      {/* ── 01 WHY LOOMELIC MEDIA ────────────────────────────────────────────── */}
      <section id="section-why" style={{ ...section, backgroundColor: C.bgAlt }}>
        <div style={container}>
          <SectionTag>01 — Why Loomelic Media</SectionTag>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <div>
              <H2 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", marginBottom: 32 }}>
                WE SPEAK <span style={{ color: C.accent }}>AUTOMOTIVE.</span>
              </H2>
              <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>
                We don't just create content — we create assets that move inventory and build trust. At Loomelic Media, we understand the fast pace of the automotive world. That's why we deliver cinematic visuals, dealership-focused storytelling, and performance-driven insights all under one roof.
              </p>
              <p style={{ color: C.muted, lineHeight: 1.8 }}>
                We're fully licensed, insured, and bonded. Each dealership receives a certificate of insurance for the business office, ensuring your team has everything it needs on file.
              </p>
              <p style={{ color: "rgba(255,255,255,0.3)", marginTop: 24, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: C.display }}>
                Las Vegas, NV
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div ref={stat1.ref} style={{ borderLeft: `2px solid ${C.accent}`, paddingLeft: 32 }}>
                <div style={{ fontFamily: C.display, fontWeight: 700, fontSize: "3.5rem", color: C.white }}>{stat1.value}+</div>
                <div style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Years Automotive Focus</div>
              </div>
              <div ref={stat2.ref} style={{ borderLeft: `2px solid ${C.accent}`, paddingLeft: 32 }}>
                <div style={{ fontFamily: C.display, fontWeight: 700, fontSize: "3.5rem", color: C.white }}>{stat2.value}</div>
                <div style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Dealerships Locally</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 ABOUT DEALER ──────────────────────────────────────────────────── */}
      <section style={{ ...section, backgroundColor: C.bg }}>
        <div style={container}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <img src={IMG.dealership} alt={dealerName} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
            <div>
              <SectionTag>02 — About {dealerName}</SectionTag>
              <H2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", marginBottom: 32 }}>
                A DEALERSHIP<br />BUILT ON TRUST
              </H2>
              <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>
                {dealerName} has been serving the Las Vegas community with a commitment to transparent pricing, exceptional service, and a customer-first culture. Your reputation is your strongest asset — and your digital presence should reflect it.
              </p>
              <p style={{ color: C.muted, lineHeight: 1.8 }}>
                This proposal outlines how Loomelic Media will build a social media ecosystem that matches the quality of your in-store experience and drives measurable growth across every platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 THE OPPORTUNITY ───────────────────────────────────────────────── */}
      <section style={{ ...section, backgroundColor: C.bgAlt }}>
        <div style={container}>
          <SectionTag>03 — The Opportunity</SectionTag>
          <H2 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", marginBottom: 16 }}>
            THE<br /><span style={{ color: C.accent }}>OPPORTUNITY</span>
          </H2>
          <p style={{ fontFamily: C.display, fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 48 }}>
            Repositioning {dealerName} as a Digital Authority in Las Vegas
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 48 }}>
            {[
              "High posting volume with limited local follower growth velocity",
              "Inconsistent visual identity across platforms",
              "Limited staff visibility and human connection",
              "Weak content-to-website funneling",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: 24, border: `1px solid ${C.border}` }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.accent, flexShrink: 0, marginTop: 8 }} />
                <p style={{ color: C.muted, lineHeight: 1.7 }}>{item}</p>
              </div>
            ))}
          </div>
          <blockquote style={{ borderLeft: `2px solid ${C.accent}`, paddingLeft: 32, paddingTop: 8, paddingBottom: 8, marginBottom: 48 }}>
            <p style={{ color: "rgba(255,255,255,0.8)", fontStyle: "italic", fontSize: 18, lineHeight: 1.7 }}>
              "The goal: build a cohesive, authority-driven ecosystem that earns trust before the customer walks in the door."
            </p>
          </blockquote>
          <div>
            <img src={IMG.santaFeAd} alt="2026 Hyundai Santa Fe Ad" style={{ width: "100%", maxHeight: 500, objectFit: "cover" }} />
            <p style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: 8 }}>
              2026 Hyundai Santa Fe — Sample Ad
            </p>
          </div>
        </div>
      </section>

      {/* ── 04 BRAND PILLARS ─────────────────────────────────────────────────── */}
      <section style={{ ...section, backgroundColor: C.bg }}>
        <div style={container}>
          <SectionTag>04 — Brand Pillars</SectionTag>
          <H2 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", marginBottom: 48 }}>
            BRAND PILLARS
          </H2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, backgroundColor: "#1a1a1a" }}>
            {[
              { title: "EASY, CONFIDENT BUYING", body: "Clear, pressure-free messaging that guides buyers from scroll to showroom floor." },
              { title: "SERVICE YOU CAN TRUST", body: `Spotlighting ${dealerName}'s service team and advisor expertise to build long-term loyalty.` },
              { title: "REAL PEOPLE, REAL COMMUNITY", body: "Humanizing the dealership through staff stories, local moments, and authentic culture content." },
              { title: "NEW ARRIVALS + HIGHLIGHTS", body: "Showcasing inventory with cinematic precision — the right vehicle, to the right audience, at the right time." },
            ].map((p, i) => (
              <div key={i} style={{ padding: 32, backgroundColor: C.bg }}>
                <div style={{ width: 32, height: 2, backgroundColor: C.accent, marginBottom: 24 }} />
                <h3 style={{ fontFamily: C.display, fontWeight: 700, color: C.white, fontSize: 16, letterSpacing: "0.1em", marginBottom: 16 }}>{p.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{p.body}</p>
              </div>
            ))}
          </div>

          {/* Unified caption system */}
          <div style={{ marginTop: 64 }}>
            <h3 style={{ fontFamily: C.display, fontWeight: 700, fontSize: 14, letterSpacing: "0.1em", color: C.white, marginBottom: 16 }}>UNIFIED CAPTION + CTA LANGUAGE</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 640, marginBottom: 32 }}>
              Every post is carefully structured with the current month's model highlights, active financing or lease offers, and your dealership's address and contact information — written specifically for {dealerName}. Nothing is generic. Each caption is crafted to move inventory and drive foot traffic.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 48 }}>
              {["REUSABLE REEL COVERS", "CONSISTENT LOWER-THIRDS", "VEGAS-LOCAL IDENTITY CUES"].map((label) => (
                <div key={label} style={{ border: `1px solid ${C.border}`, padding: 16, textAlign: "center" }}>
                  <span style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{label}</span>
                </div>
              ))}
            </div>
            {/* Example caption */}
            <div style={{ border: `1px solid ${C.border}`, padding: 32 }}>
              <p style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>
                Example Caption — Centennial Subaru
              </p>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8 }}>
                With weather like we are having, having a vehicle built for confidence in every condition makes all the difference. The 2026 Subaru Crosstrek is here and ready for whatever your next adventure looks like. Built with legendary Subaru Symmetrical All-Wheel Drive, impressive ground clearance, and the versatility drivers love, the Crosstrek continues to be one of the most capable compact SUVs on the road — whether you're commuting through Las Vegas or heading off the pavement for the weekend.
              </p>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, marginTop: 16 }}>
                Right now at Centennial Subaru, you can lease a 2026 Subaru Crosstrek Base for $255/month for 36 months, or finance with rates as low as 2.9% APR for 36 months. Capability, efficiency, and confidence all in one vehicle.
              </p>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, marginTop: 16 }}>
                If you've been thinking about getting into a new Crosstrek, now is the time. Adventure starts here.
              </p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 16 }}>📍 Centennial Subaru</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>6350 Centennial Center Blvd, Las Vegas, NV 89149</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>725-262-4242</p>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 16, lineHeight: 1.7 }}>
                #CentennialSubaru #SubaruCrosstrek #2026Crosstrek #AdventureStartsHere #SubaruAWD #LasVegasCars #SubaruLife #CompactSUV #OutdoorAdventure #SubaruLove #ExploreMore #SubaruNation #LasVegasDealership #NewSubaru #CrosstrekLife #SubaruCommunity #DailyAdventure #WeekendReady #SubaruOwners #AWDLife #LoomelicMedia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 MONTHLY CONTENT ENGINE ────────────────────────────────────────── */}
      <section style={{ ...section, backgroundColor: C.bgAlt }}>
        <div style={container}>
          <SectionTag>05 — Monthly Content Engine</SectionTag>
          <H2 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", marginBottom: 16 }}>
            MONTHLY<br /><span style={{ color: C.accent }}>CONTENT ENGINE</span>
          </H2>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 16 }}>
            <span style={{ fontFamily: C.display, fontWeight: 700, fontSize: "4rem", color: C.white }}>8–14</span>
            <span style={{ fontFamily: C.display, fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Reels Per Month</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.7, marginBottom: 48 }}>
            Volume scales with dealer priorities and the messaging being pushed each month.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, backgroundColor: "#1a1a1a" }}>
            {[
              { num: "01", title: "Walkarounds + Feature Spotlights" },
              { num: "02", title: "Featured Vehicle of the Month" },
              { num: "03", title: "Staff + Culture Stories" },
              { num: "04", title: "Service Education + Advisor Highlights" },
              { num: "05", title: "Delivery Celebrations + Testimonials" },
            ].map((item) => (
              <div key={item.num} style={{ padding: 32, backgroundColor: C.bgAlt }}>
                <div style={{ fontFamily: C.display, fontWeight: 700, fontSize: "2rem", color: C.accent, marginBottom: 12 }}>{item.num}</div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6 }}>{item.title}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, padding: 32, border: `1px solid ${C.border}` }}>
            <p style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 8 }}>Photo Assets</p>
            <p style={{ color: C.muted, fontSize: 14 }}>Cinematic inventory highlights · Behind-the-scenes + community moments</p>
          </div>
          <div style={{ marginTop: 16, padding: "8px 0" }}>
            <p style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Loomelic Media Photography</p>
          </div>
        </div>
      </section>

      {/* ── 06 HEADSHOTS + TEAM PHOTOGRAPHY ─────────────────────────────────── */}
      <section style={{ ...section, backgroundColor: C.bg }}>
        <div style={container}>
          <SectionTag>06 — Headshots + Team Photography</SectionTag>
          <H2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", marginBottom: 32 }}>
            HEADSHOTS +<br />TEAM PHOTOGRAPHY
          </H2>
          <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: 24, maxWidth: 640 }}>
            Your people are your brand. We deliver clean, consistent headshots and team photos that reflect <strong style={{ color: C.white }}>professionalism and trust</strong> on the showroom floor or in service.
          </p>
          <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: 48, maxWidth: 640 }}>
            These images are perfect for showcasing employee accomplishments across your website, social media, and internal channels.
          </p>
          <div>
            <h3 style={{ fontFamily: C.display, fontWeight: 700, fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", color: C.white, marginBottom: 24 }}>Use Cases</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {["Website staff pages", "Social media profiles", "Internal communications", "Google Business profiles"].map((u) => (
                <div key={u} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.accent, flexShrink: 0 }} />
                  <p style={{ color: C.muted, fontSize: 14 }}>{u}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 07 REPUTATION REINFORCEMENT ──────────────────────────────────────── */}
      <section style={{ ...section, backgroundColor: C.bgAlt }}>
        <div style={container}>
          <SectionTag>07 — Reputation Reinforcement</SectionTag>
          <H2 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", marginBottom: 48 }}>
            REPUTATION<br /><span style={{ color: C.accent }}>REINFORCEMENT</span>
          </H2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 48 }}>
            {[
              { bold: "Monthly testimonial capture", rest: " from real customers" },
              { bold: "Service advisor spotlights", rest: " to build trust in the drive" },
              { bold: "Delivery celebrations", rest: " that turn buyers into brand advocates" },
              { bold: "Review response tone guidance", rest: " to maintain a consistent, professional voice" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: 24, border: `1px solid ${C.border}` }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.accent, flexShrink: 0, marginTop: 8 }} />
                <p style={{ color: C.muted, lineHeight: 1.7 }}>
                  <strong style={{ color: C.white }}>{item.bold}</strong>{item.rest}
                </p>
              </div>
            ))}
          </div>
          <blockquote style={{ borderLeft: `2px solid ${C.accent}`, paddingLeft: 32, paddingTop: 8, paddingBottom: 8 }}>
            <p style={{ color: "rgba(255,255,255,0.8)", fontStyle: "italic", fontSize: 18, lineHeight: 1.7 }}>
              "Every piece of content reinforces what {dealerName} stands for — before, during, and after the sale."
            </p>
          </blockquote>
        </div>
      </section>

      {/* ── 08 90-DAY ROLLOUT ────────────────────────────────────────────────── */}
      <section style={{ ...section, backgroundColor: C.bg }}>
        <div style={container}>
          <SectionTag>08 — 90-Day Rollout</SectionTag>
          <H2 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", marginBottom: 48 }}>
            90-DAY ROLLOUT
          </H2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, backgroundColor: "#1a1a1a" }}>
            {[
              { month: "Month 01", title: "AUTHORITY RESET", items: ["Staff headshot day", "Brand identity audit + template build", "First featured vehicle Reel", "Establish content calendar cadence"] },
              { month: "Month 02", title: "HUMANIZATION LAYER", items: ["Staff culture + behind-the-scenes content", "Service advisor spotlight series", "Delivery celebration content live", "Community + local identity hooks activated"] },
              { month: "Month 03", title: "OPTIMIZATION", items: ["Performance data review", "Scale what's working, cut what's not", "Quarterly strategy reset", "Refine targeting + content mix based on results"] },
            ].map((phase) => (
              <div key={phase.month} style={{ padding: 32, backgroundColor: C.bg }}>
                <p style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>{phase.month}</p>
                <h3 style={{ fontFamily: C.display, fontWeight: 700, color: C.white, fontSize: 20, letterSpacing: "0.05em", marginBottom: 24 }}>{phase.title}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {phase.items.map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.accent, flexShrink: 0, marginTop: 8 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO REEL (Vimeo) ────────────────────────────────────────────────── */}
      <section style={{ padding: "64px 0", backgroundColor: C.bgAlt }}>
        <div style={container}>
          <div style={{ position: "relative", paddingTop: "56.25%" }}>
            <iframe
              src={VIMEO}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              title="Loomelic Media Reel"
            />
          </div>
        </div>
      </section>

      {/* ── 10 CRM INTRO VIDEOS ──────────────────────────────────────────────── */}
      <section style={{ ...section, backgroundColor: C.bg }}>
        <div style={container}>
          <SectionTag>10 — CRM Intro Videos</SectionTag>
          <H2 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", marginBottom: 32 }}>
            CRM INTRO<br /><span style={{ color: C.accent }}>VIDEOS</span>
          </H2>
          <p style={{ color: C.muted, lineHeight: 1.8, maxWidth: 640, marginBottom: 48 }}>
            Personalized video introductions sent directly to customers who inquire about a vehicle — turning a cold lead into a warm conversation before they ever step foot in the showroom.
          </p>

          {/* Findlay Nissan case study */}
          <div style={{ border: `1px solid ${C.border}`, padding: 32, marginBottom: 48 }}>
            <p style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>Real-World Results</p>
            <h3 style={{ fontFamily: C.display, fontWeight: 700, color: C.white, fontSize: 24, marginBottom: 16 }}>Findlay Nissan Henderson</h3>
            <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
              Since implementing CRM intro videos at <strong style={{ color: C.white }}>Findlay Nissan Henderson</strong>, the sales team has seen a significant spike in customer response rates. Leads that previously went cold after an initial inquiry are now responding within hours — because they're greeted with a real face, a real voice, and a genuine connection before the first test drive.
            </p>
            <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>
              These short, professionally produced videos are sent via text or email directly through the dealership's CRM. They introduce the sales advisor by name, reference the specific vehicle the customer inquired about, and invite them to take the next step — all in under 60 seconds.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
              {[
                { num: "3×", label: "HIGHER RESPONSE RATE" },
                { num: "60s", label: "AVERAGE VIDEO LENGTH" },
                { num: "24hr", label: "AVG. LEAD RESPONSE TIME" },
              ].map((stat) => (
                <div key={stat.num}>
                  <div style={{ fontFamily: C.display, fontWeight: 700, fontSize: "3rem", color: C.white }}>{stat.num}</div>
                  <div style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample CRM video embed */}
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>Sample CRM Intro Video</p>
            <div style={{ position: "relative", paddingTop: "56.25%" }}>
              <iframe
                src={VIMEO}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                title="Sample CRM Intro Video"
              />
            </div>
          </div>

          <blockquote style={{ borderLeft: `2px solid ${C.accent}`, paddingLeft: 32, paddingTop: 8, paddingBottom: 8, marginBottom: 48 }}>
            <p style={{ color: "rgba(255,255,255,0.8)", fontStyle: "italic", fontSize: 18, lineHeight: 1.7, marginBottom: 12 }}>
              "A 60-second video introduction converts more leads than a dozen follow-up emails. It's the difference between a name in an inbox and a person on a screen."
            </p>
            <cite style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontStyle: "normal" }}>— Loomelic Media</cite>
          </blockquote>

          {/* How it works */}
          <div>
            <p style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 32 }}>How It Works</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, backgroundColor: "#1a1a1a" }}>
              {[
                { num: "01", title: "VIDEO IS PRODUCED", body: "Loomelic Media produces a short, personalized intro video featuring the assigned sales advisor — ready to deploy the moment a lead comes in." },
                { num: "02", title: "LEAD COMES IN", body: "Customer inquires about a specific vehicle via your website, phone, or third-party platform." },
                { num: "03", title: "SENT VIA CRM", body: "The video is delivered directly through your dealership's CRM via text or email within 24 hours." },
                { num: "04", title: "LEAD RESPONDS", body: "The customer sees a real face, feels a real connection, and is far more likely to book an appointment." },
              ].map((step) => (
                <div key={step.num} style={{ padding: 32, backgroundColor: C.bg }}>
                  <div style={{ fontFamily: C.display, fontWeight: 700, fontSize: "2rem", color: C.accent, marginBottom: 12 }}>{step.num}</div>
                  <h4 style={{ fontFamily: C.display, fontWeight: 700, color: C.white, fontSize: 14, letterSpacing: "0.1em", marginBottom: 12 }}>{step.title}</h4>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.7 }}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 11 PORTFOLIO ─────────────────────────────────────────────────────── */}
      <section style={{ ...section, backgroundColor: C.bgAlt }}>
        <div style={container}>
          <SectionTag>11 — Portfolio</SectionTag>
          <H2 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", marginBottom: 16 }}>OUR WORK</H2>
          <p style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 48 }}>
            A Sample of What We Bring to Every Dealership
          </p>

          {/* Top row — 4 square images */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 8 }}>
            {[IMG.port1, IMG.port2, IMG.port3, IMG.port4].map((src, i) => (
              <img key={i} src={src} alt="" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }} />
            ))}
          </div>

          {/* Bottom row — 4 portrait cards with overlay */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 48 }}>
            {[
              { src: IMG.automotive1, sub: "CINEMATIC INVENTORY HIGHLIGHTS", title: "AUTOMOTIVE PHOTOGRAPHY" },
              { src: IMG.headshot, sub: "PROFESSIONAL PORTRAITS FOR EVERY DEPARTMENT", title: "STAFF HEADSHOTS" },
              { src: IMG.port3, sub: "FEED POSTS, STORIES & ENGAGEMENT CONTENT", title: "SOCIAL MEDIA CONTENT" },
              { src: IMG.port4, sub: "DATA-DRIVEN MONTHLY RECAPS", title: "PERFORMANCE REPORTS" },
            ].map((card, i) => (
              <a key={i} href="https://www.loomelicmedia.com" target="_blank" rel="noopener noreferrer"
                style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", display: "block" }}>
                <img src={card.src} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 16 }}>
                  <p style={{ fontFamily: C.display, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{card.sub}</p>
                  <p style={{ fontFamily: C.display, fontWeight: 700, fontSize: 12, letterSpacing: "0.05em", color: C.white, lineHeight: 1.3, marginBottom: 8 }}>{card.title}</p>
                  <span style={{ fontFamily: C.display, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>VIEW WORK</span>
                </div>
              </a>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <a href="https://www.loomelicmedia.com" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", border: `1px solid rgba(255,255,255,0.2)`, padding: "12px 32px", fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
              VIEW ALL WORK
            </a>
          </div>
        </div>
      </section>

      {/* ── 10 INVESTMENT + NEXT STEPS ───────────────────────────────────────── */}
      <section style={{ ...section, backgroundColor: C.bg }}>
        <div style={container}>
          <SectionTag>10 — Investment + Next Steps</SectionTag>
          <H2 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", marginBottom: 48 }}>
            INVESTMENT +<br /><span style={{ color: C.accent }}>NEXT STEPS</span>
          </H2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
            {/* Pricing card */}
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                <span style={{ fontFamily: C.display, fontWeight: 700, fontSize: "4rem", color: C.white }}>$3,800</span>
              </div>
              <p style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>Per Month</p>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 32 }}>
                <p style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 24 }}>What's Included</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {[
                    "Monthly content production (8–14 Reels)",
                    "Staff headshot session",
                    "Brand consistency system + templates",
                    "Monthly performance report",
                    "Reputation reinforcement content",
                    "All final photo + video assets delivered",
                    "Raw footage available upon request",
                  ].map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, color: C.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                      <span style={{ color: C.accent, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Next steps */}
            <div>
              <p style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 32 }}>Next Steps</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { num: "1", text: "Confirm start date" },
                  { num: "2", text: "Schedule staff headshot day" },
                  { num: "3", text: "Identify first featured vehicle" },
                  { num: "4", text: "Align monthly messaging priorities" },
                ].map((step) => (
                  <div key={step.num} style={{ display: "flex", alignItems: "flex-start", gap: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 24, marginBottom: 24 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: C.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: C.display, fontWeight: 700, fontSize: 14, color: C.white }}>{step.num}</span>
                    </div>
                    <p style={{ color: C.muted, paddingTop: 6, lineHeight: 1.7 }}>{step.text}</p>
                  </div>
                ))}
              </div>
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, lineHeight: 1.7, marginTop: 16 }}>
                All content adheres to OEM and dealership compliance guidance. Testimonials and claims are handled responsibly — no misleading promises, ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LET'S GET STARTED CTA ────────────────────────────────────────────── */}
      <section style={{ position: "relative", padding: "128px 0", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src={IMG.portExtra} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.2 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0A0A0A, rgba(10,10,10,0.7), #0A0A0A)" }} />
        </div>
        <div style={{ ...container, position: "relative", zIndex: 10 }}>
          <H2 style={{ fontSize: "clamp(3rem,8vw,7rem)", textTransform: "uppercase", lineHeight: 1.0, marginBottom: 24 }}>
            LET'S GET<br /><span style={{ color: C.accent }}>STARTED</span>
          </H2>
          <div style={{ width: 48, height: 2, backgroundColor: C.accent, margin: "0 auto 24px" }} />
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, marginBottom: 40 }}>Your Store. Our Strategy.</p>
          <a href="https://www.loomelicmedia.com" target="_blank" rel="noopener noreferrer"
            onClick={() => trackCTA("cta_click_call")}
            style={{ display: "inline-block", border: `1px solid rgba(255,255,255,0.3)`, padding: "16px 48px", fontFamily: C.display, fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.white }}>
            LOOMELICMEDIA.COM
          </a>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{ padding: "64px 0", borderTop: `1px solid ${C.border}`, backgroundColor: C.bg }}>
        <div style={container}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderLeft: `14px solid ${C.accent}` }} />
                <span style={{ fontFamily: C.display, fontWeight: 700, color: C.white, fontSize: 18, letterSpacing: "0.2em", textTransform: "uppercase" }}>Loomelic Media</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.7 }}>
                Automotive social media production. Cinematic content that moves inventory and builds trust.
              </p>
            </div>
            <div>
              <p style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>
                Denham Gallimore
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a href="tel:5617975880" style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>(561) 797-5880</a>
                <a href="mailto:Denham@loomelicmedia.com" style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Denham@loomelicmedia.com</a>
                <a href="https://www.loomelicmedia.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>WWW.LOOMELICMEDIA.COM</a>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
              <a href="https://www.loomelicmedia.com" target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", border: `1px solid rgba(255,255,255,0.1)`, padding: "8px 16px" }}>
                WWW.LOOMELICMEDIA.COM
              </a>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 32, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: `10px solid ${C.accent}` }} />
              <span style={{ fontFamily: C.display, fontWeight: 700, color: C.white, fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase" }}>Loomelic Media</span>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
              © 2026 Loomelic Media · Prepared for {dealerName} · Las Vegas, NV
            </p>
            <a href="https://www.loomelicmedia.com" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: C.display, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
              WWW.LOOMELICMEDIA.COM
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
