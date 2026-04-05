/* ============================================================
   AdminLayout — Twisty Finance SaaS Design System
   Shared shell for all /admin/* and /crm/* routes.

   Design tokens:
   - Background: oklch(0.97 0.008 265)  — very light lavender-white
   - Sidebar: oklch(0.18 0.06 265)      — deep navy
   - Primary accent: oklch(0.45 0.18 265) — indigo/navy blue
   - Coral accent: oklch(0.65 0.18 25)  — coral/orange-red
   - Card: white with subtle shadow
   - Border: oklch(0.92 0.01 265)
   ============================================================ */
import { useLocation, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  LayoutDashboard, Users, GitBranch, FileText, Activity,
  Image, Star, Settings, LogOut, ChevronRight, Briefcase,
  BarChart2, Shield, Menu, X, Bell, Search, Building2,
} from "lucide-react";
import { useState } from "react";

/* ─── Design tokens ─────────────────────────────────────── */
export const TW = {
  // Sidebar
  sidebarBg:      "oklch(0.18 0.06 265)",
  sidebarBorder:  "oklch(0.25 0.06 265)",
  sidebarText:    "oklch(0.75 0.03 265)",
  sidebarActive:  "oklch(0.45 0.18 265)",
  sidebarHover:   "oklch(0.24 0.06 265)",
  // Content area
  pageBg:         "oklch(0.97 0.008 265)",
  cardBg:         "white",
  cardBorder:     "oklch(0.92 0.01 265)",
  cardShadow:     "0 1px 4px oklch(0.18 0.06 265 / 0.08), 0 4px 16px oklch(0.18 0.06 265 / 0.04)",
  // Text
  textPrimary:    "oklch(0.18 0.06 265)",
  textSecondary:  "oklch(0.50 0.04 265)",
  textMuted:      "oklch(0.68 0.02 265)",
  // Accents
  indigo:         "oklch(0.45 0.18 265)",
  indigoBg:       "oklch(0.95 0.04 265)",
  coral:          "oklch(0.65 0.18 25)",
  coralBg:        "oklch(0.96 0.04 25)",
  green:          "oklch(0.55 0.15 145)",
  greenBg:        "oklch(0.95 0.05 145)",
  border:         "oklch(0.92 0.01 265)",
};

/* ─── Nav groups ─────────────────────────────────────────── */
const ADMIN_NAV = [
  {
    group: "Management",
    items: [
      { icon: LayoutDashboard, label: "Dashboard",     href: "/admin" },
      { icon: Image,           label: "Portfolio",     href: "/admin/portfolio" },
      { icon: Star,            label: "Featured Work", href: "/admin/featured-work" },
      { icon: BarChart2,       label: "Graphics",      href: "/admin/graphics" },
    ],
  },
  {
    group: "CRM",
    items: [
      { icon: LayoutDashboard, label: "CRM Overview",  href: "/crm" },
      { icon: Users,           label: "Contacts",      href: "/crm/contacts" },
      { icon: GitBranch,       label: "Pipeline",      href: "/crm/pipeline" },
      { icon: FileText,        label: "Proposals",     href: "/crm/proposals" },
      { icon: Activity,        label: "Activity",      href: "/crm/activity" },
    ],
  },
  {
    group: "Business",
    items: [
      { icon: Briefcase,       label: "Dealer CRM",    href: "/admin/crm" },
      { icon: Shield,          label: "Contracts",     href: "/admin/crm/dealer" },
    ],
  },
  {
    group: "Portals",
    items: [
      { icon: Building2,       label: "Dealer Admin",  href: "/dealer/admin" },
      { icon: Users,           label: "Vendor Admin",  href: "/vendor/admin" },
    ],
  },
];

/* ─── Sidebar ─────────────────────────────────────────────── */
function Sidebar({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const isActive = (href: string) =>
    href === "/admin" ? location === href : location === href || location.startsWith(href + "/");

  return (
    <aside
      className="flex flex-col h-full"
      style={{ background: TW.sidebarBg, width: collapsed ? "64px" : "220px", transition: "width 0.2s ease" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: `1px solid ${TW.sidebarBorder}` }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: TW.indigo }}>
          <span className="text-white font-bold text-xs">LM</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm leading-tight truncate">Loomelic</p>
            <p className="text-xs leading-tight truncate" style={{ color: TW.sidebarText }}>Admin Panel</p>
          </div>
        )}
        {onClose && (
          <button onClick={onClose} className="ml-auto text-white/40 hover:text-white/80 lg:hidden">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {ADMIN_NAV.map(group => (
          <div key={group.group}>
            {!collapsed && (
              <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: TW.sidebarText }}>
                {group.group}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ icon: Icon, label, href }) => {
                const active = isActive(href);
                return (
                  <Link key={href} href={href}>
                    <button
                      title={collapsed ? label : undefined}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-all"
                      style={{
                        background: active ? TW.sidebarActive : "transparent",
                        color: active ? "white" : TW.sidebarText,
                      }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = TW.sidebarHover; }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                      <Icon size={16} className="shrink-0" />
                      {!collapsed && <span className="truncate font-medium">{label}</span>}
                      {!collapsed && active && <ChevronRight size={12} className="ml-auto opacity-60" />}
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom — logout */}
      <div className="p-2" style={{ borderTop: `1px solid ${TW.sidebarBorder}` }}>
        <button
          onClick={() => logout()}
          title={collapsed ? "Sign Out" : undefined}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-all"
          style={{ color: TW.sidebarText }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = TW.sidebarHover; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

/* ─── Twisty Card ─────────────────────────────────────────── */
export function TWCard({
  children, className = "", style = {},
}: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: TW.cardBg,
        border: `1px solid ${TW.cardBorder}`,
        boxShadow: TW.cardShadow,
        ...style,
      }}>
      {children}
    </div>
  );
}

/* ─── Status Badge ────────────────────────────────────────── */
export function TWBadge({
  children, variant = "default",
}: { children: React.ReactNode; variant?: "default" | "success" | "coral" | "warning" | "muted" }) {
  const styles: Record<string, React.CSSProperties> = {
    default: { background: TW.indigoBg, color: TW.indigo },
    success: { background: TW.greenBg, color: TW.green },
    coral:   { background: TW.coralBg, color: TW.coral },
    warning: { background: "oklch(0.96 0.06 85)", color: "oklch(0.55 0.15 85)" },
    muted:   { background: "oklch(0.95 0.005 265)", color: TW.textMuted },
  };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={styles[variant]}>
      {children}
    </span>
  );
}

/* ─── Stat Card ───────────────────────────────────────────── */
export function TWStatCard({
  label, value, sub, accent = false,
}: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <TWCard className="p-5">
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: TW.textMuted }}>{label}</p>
      <p className="text-3xl font-bold mb-1"
        style={{ color: accent ? TW.indigo : TW.textPrimary }}>
        {value}
      </p>
      {sub && <p className="text-xs" style={{ color: TW.textSecondary }}>{sub}</p>}
    </TWCard>
  );
}

/* ─── Main AdminLayout ────────────────────────────────────── */
export default function AdminLayout({
  children,
  title,
  subtitle,
  actions,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: TW.pageBg, fontFamily: "'Inter', sans-serif" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col shrink-0" style={{ width: collapsed ? "64px" : "220px", transition: "width 0.2s ease" }}>
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 flex flex-col" style={{ width: "220px" }}>
            <Sidebar collapsed={false} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="shrink-0 flex items-center gap-4 px-6 py-4"
          style={{ background: "white", borderBottom: `1px solid ${TW.border}` }}>
          {/* Mobile menu + collapse toggle */}
          <button
            onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(true); else setCollapsed(c => !c); }}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <Menu size={18} style={{ color: TW.textSecondary }} />
          </button>

          {/* Title */}
          <div className="flex-1 min-w-0">
            {title && (
              <h1 className="text-base font-semibold truncate" style={{ color: TW.textPrimary }}>{title}</h1>
            )}
            {subtitle && (
              <p className="text-xs truncate" style={{ color: TW.textSecondary }}>{subtitle}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {actions}
            {/* User avatar */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: TW.indigo }}>
              {user?.name?.charAt(0) ?? "D"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
