/* ============================================================
   CRMLayout — ORION-inspired shell
   • Narrow icon-only dark sidebar (left)
   • Warm off-white main content area
   • Coral accent for active states
   ============================================================ */
import { useLocation, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  FileText,
  Activity,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { LOGO_TRANSPARENT } from "@/lib/media";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview",     href: "/crm" },
  { icon: Users,           label: "Contacts",     href: "/crm/contacts" },
  { icon: GitBranch,       label: "Pipeline",     href: "/crm/pipeline" },
  { icon: FileText,        label: "Proposals",    href: "/crm/proposals" },
  { icon: Activity,        label: "Activity",     href: "/crm/activity" },
];

interface CRMLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function CRMLayout({ children, title, subtitle, actions }: CRMLayoutProps) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "oklch(0.97 0.005 80)" }}>
      {/* ── Icon-only sidebar ── */}
      <aside
        className="flex flex-col items-center py-5 gap-1 shrink-0 z-20"
        style={{
          width: 64,
          background: "oklch(0.13 0.005 260)",
          borderRight: "1px solid oklch(0.20 0.005 260)",
        }}
      >
        {/* Logo mark */}
        <div className="mb-5 flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden"
          style={{ background: "oklch(0.20 0.005 260)" }}>
          <img src={LOGO_TRANSPARENT} alt="Loomelic" className="w-6 h-6 object-contain" />
        </div>

        {/* Nav icons */}
        <nav className="flex flex-col gap-1 flex-1 w-full px-2">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const isActive = location === href || (href !== "/crm" && location.startsWith(href));
            return (
              <Link key={href} href={href}>
                <button
                  title={label}
                  className={cn(
                    "w-full flex items-center justify-center h-10 rounded-xl transition-all duration-150 group relative",
                    isActive
                      ? "text-white"
                      : "text-white/35 hover:text-white/70 hover:bg-white/5"
                  )}
                  style={isActive ? {
                    background: "oklch(0.62 0.18 25)",
                    boxShadow: "0 2px 12px oklch(0.62 0.18 25 / 0.35)",
                  } : {}}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                  {/* Tooltip */}
                  <span className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
                    style={{ background: "oklch(0.13 0.005 260)", color: "white" }}>
                    {label}
                  </span>
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Bottom — settings + logout */}
        <div className="flex flex-col gap-1 w-full px-2 pb-2">
          <Link href="/crm/settings">
            <button title="Settings"
              className="w-full flex items-center justify-center h-10 rounded-xl text-white/35 hover:text-white/70 hover:bg-white/5 transition-all group relative">
              <Settings size={18} strokeWidth={1.8} />
              <span className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
                style={{ background: "oklch(0.13 0.005 260)", color: "white" }}>
                Settings
              </span>
            </button>
          </Link>
          <button
            title="Sign out"
            onClick={() => logout()}
            className="w-full flex items-center justify-center h-10 rounded-xl text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-all group relative"
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
              style={{ background: "oklch(0.13 0.005 260)", color: "white" }}>
              Sign out
            </span>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        {(title || actions) && (
          <header className="flex items-center justify-between px-8 py-5 shrink-0"
            style={{ borderBottom: "1px solid oklch(0.90 0.005 80)" }}>
            <div>
              {title && (
                <h1 className="text-xl font-semibold tracking-tight"
                  style={{ color: "oklch(0.15 0.005 260)" }}>
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm mt-0.5" style={{ color: "oklch(0.50 0.005 260)" }}>
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </header>
        )}

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ── Shared design tokens ── */
export const CRM_COLORS = {
  bg: "oklch(0.97 0.005 80)",
  card: "#FFFFFF",
  sidebar: "oklch(0.13 0.005 260)",
  accent: "oklch(0.62 0.18 25)",
  accentLight: "oklch(0.95 0.04 25)",
  textPrimary: "oklch(0.15 0.005 260)",
  textSecondary: "oklch(0.50 0.005 260)",
  border: "oklch(0.90 0.005 80)",
  borderCard: "oklch(0.93 0.005 80)",
};

/* ── Reusable card wrapper ── */
export function CRMCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn("rounded-2xl p-5", className)}
      style={{
        background: CRM_COLORS.card,
        border: `1px solid ${CRM_COLORS.borderCard}`,
        boxShadow: "0 1px 4px oklch(0.15 0.005 260 / 0.05)",
      }}
    >
      {children}
    </div>
  );
}

/* ── Score circle (match % style from ORION) ── */
export function ScoreCircle({ score, size = 56 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "oklch(0.62 0.18 25)" : score >= 40 ? "oklch(0.72 0.14 60)" : "oklch(0.60 0.05 260)";

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="oklch(0.93 0.005 80)" strokeWidth={4} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className="absolute text-xs font-bold" style={{ color, fontSize: size < 50 ? 10 : 12 }}>
        {score}%
      </span>
    </div>
  );
}

/* ── Pill filter chip ── */
export function FilterChip({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap"
      style={active ? {
        background: "oklch(0.62 0.18 25)",
        color: "white",
        boxShadow: "0 2px 8px oklch(0.62 0.18 25 / 0.30)",
      } : {
        background: "white",
        color: "oklch(0.50 0.005 260)",
        border: "1px solid oklch(0.90 0.005 80)",
      }}
    >
      {label}
    </button>
  );
}

/* ── Status badge ── */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    lead:         { bg: "oklch(0.93 0.04 250)", text: "oklch(0.40 0.12 250)", label: "Lead" },
    qualified:    { bg: "oklch(0.93 0.06 200)", text: "oklch(0.40 0.12 200)", label: "Qualified" },
    proposal:     { bg: "oklch(0.95 0.08 80)",  text: "oklch(0.45 0.14 80)",  label: "Proposal" },
    negotiation:  { bg: "oklch(0.95 0.06 50)",  text: "oklch(0.45 0.14 50)",  label: "Negotiation" },
    closed_won:   { bg: "oklch(0.93 0.08 145)", text: "oklch(0.40 0.14 145)", label: "Won" },
    closed_lost:  { bg: "oklch(0.94 0.04 25)",  text: "oklch(0.45 0.10 25)",  label: "Lost" },
    client:       { bg: "oklch(0.93 0.08 145)", text: "oklch(0.40 0.14 145)", label: "Client" },
    partner:      { bg: "oklch(0.93 0.06 200)", text: "oklch(0.40 0.12 200)", label: "Partner" },
    vendor:       { bg: "oklch(0.93 0.04 250)", text: "oklch(0.40 0.12 250)", label: "Vendor" },
    other:        { bg: "oklch(0.95 0.01 260)", text: "oklch(0.50 0.005 260)", label: "Other" },
    draft:        { bg: "oklch(0.95 0.01 260)", text: "oklch(0.50 0.005 260)", label: "Draft" },
    sent:         { bg: "oklch(0.93 0.04 250)", text: "oklch(0.40 0.12 250)", label: "Sent" },
    viewed:       { bg: "oklch(0.95 0.08 80)",  text: "oklch(0.45 0.14 80)",  label: "Viewed" },
    accepted:     { bg: "oklch(0.93 0.08 145)", text: "oklch(0.40 0.14 145)", label: "Accepted" },
    declined:     { bg: "oklch(0.94 0.04 25)",  text: "oklch(0.45 0.10 25)",  label: "Declined" },
    expired:      { bg: "oklch(0.95 0.01 260)", text: "oklch(0.50 0.005 260)", label: "Expired" },
    hot:          { bg: "oklch(0.94 0.08 25)",  text: "oklch(0.50 0.18 25)",  label: "Hot" },
    warm:         { bg: "oklch(0.95 0.08 80)",  text: "oklch(0.50 0.14 80)",  label: "Warm" },
    cold:         { bg: "oklch(0.93 0.04 250)", text: "oklch(0.40 0.12 250)", label: "Cold" },
  };
  const cfg = map[status] ?? { bg: "oklch(0.95 0.01 260)", text: "oklch(0.50 0.005 260)", label: status };
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.text }}>
      {cfg.label}
    </span>
  );
}
