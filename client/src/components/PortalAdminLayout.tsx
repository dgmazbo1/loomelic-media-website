/**
 * PortalAdminLayout — Shared layout for Dealer and Vendor portal admin panels
 * Design: Twisty Finance SaaS — matches AdminLayout design system
 * Theme: Light lavender-white bg + deep navy sidebar + indigo accents
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LucideIcon, Menu, X } from "lucide-react";

/* ─── Design tokens (mirrors AdminLayout TW object) ─────────── */
const TW = {
  sidebarBg:     "oklch(0.18 0.06 265)",
  sidebarBorder: "oklch(0.25 0.06 265)",
  sidebarText:   "oklch(0.75 0.03 265)",
  sidebarActive: "oklch(0.45 0.18 265)",
  sidebarHover:  "oklch(0.24 0.06 265)",
  pageBg:        "oklch(0.97 0.008 265)",
  cardBg:        "white",
  cardBorder:    "oklch(0.92 0.01 265)",
  cardShadow:    "0 1px 4px oklch(0.18 0.06 265 / 0.08), 0 4px 16px oklch(0.18 0.06 265 / 0.04)",
  textPrimary:   "oklch(0.18 0.06 265)",
  textSecondary: "oklch(0.50 0.04 265)",
  textMuted:     "oklch(0.68 0.02 265)",
  indigo:        "oklch(0.45 0.18 265)",
  indigoBg:      "oklch(0.95 0.04 265)",
  coral:         "oklch(0.65 0.18 25)",
  coralBg:       "oklch(0.96 0.04 25)",
  green:         "oklch(0.55 0.15 145)",
  greenBg:       "oklch(0.95 0.05 145)",
  amber:         "oklch(0.70 0.15 75)",
  amberBg:       "oklch(0.96 0.05 75)",
  border:        "oklch(0.92 0.01 265)",
};

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

interface PortalAdminLayoutProps {
  title: string;
  subtitle: string;
  initials: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export default function PortalAdminLayout({
  title,
  subtitle,
  initials,
  navItems,
  children,
}: PortalAdminLayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const Sidebar = () => (
    <div className="flex flex-col h-full" style={{ background: TW.sidebarBg, borderRight: `1px solid ${TW.sidebarBorder}` }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: `1px solid ${TW.sidebarBorder}` }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: TW.indigo }}>
          <span className="text-white font-bold text-xs">{initials}</span>
        </div>
        <div className="min-w-0">
          <div className="text-white font-semibold text-sm truncate">{title}</div>
          <div className="text-xs truncate" style={{ color: TW.sidebarText }}>{subtitle}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || location.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
                style={{
                  color: isActive ? "white" : TW.sidebarText,
                  background: isActive ? TW.sidebarActive : "transparent",
                }}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} style={{ color: isActive ? "white" : TW.sidebarText, flexShrink: 0 }} />
                <span className="truncate">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 flex items-center gap-3" style={{ borderTop: `1px solid ${TW.sidebarBorder}` }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ background: TW.indigo }}>
          {initials}
        </div>
        <div className="min-w-0">
          <div className="text-white text-xs font-semibold truncate">{title}</div>
          <div className="text-xs truncate" style={{ color: TW.sidebarText }}>{subtitle}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: TW.pageBg, fontFamily: "'Inter', sans-serif" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-[220px] flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-[220px] flex flex-col">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3"
          style={{ background: "white", borderBottom: `1px solid ${TW.border}` }}>
          <span className="font-semibold text-sm" style={{ color: TW.textPrimary }}>
            {title}
          </span>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: TW.textSecondary }}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* ─── Shared UI primitives — Twisty design ──────────────────── */

export function AdminPageHeader({
  breadcrumb,
  title,
  action,
}: {
  breadcrumb: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-8 pt-8 pb-6 flex items-start justify-between">
      <div>
        <div className="text-xs font-semibold tracking-wide mb-2 flex items-center gap-2"
          style={{ color: TW.textMuted }}>
          <span>{breadcrumb}</span>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: TW.textPrimary }}>{title}</h1>
      </div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="p-6 rounded-xl"
      style={{
        background: accent ? TW.indigoBg : TW.cardBg,
        border: `1px solid ${TW.cardBorder}`,
        boxShadow: TW.cardShadow,
      }}>
      <Icon size={20} style={{ color: accent ? TW.indigo : TW.textMuted, marginBottom: 12 }} />
      <div className="text-3xl font-bold mb-1" style={{ color: accent ? TW.indigo : TW.textPrimary }}>
        {value}
      </div>
      <div className="text-xs font-medium tracking-wide" style={{ color: TW.textMuted }}>
        {label}
      </div>
    </div>
  );
}

export function AdminCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-6"
      style={{
        background: TW.cardBg,
        border: `1px solid ${TW.cardBorder}`,
        boxShadow: TW.cardShadow,
      }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: TW.textPrimary }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
      style={{ background: TW.indigo, color: "white" }}
    >
      {children}
    </button>
  );
}

export function OutlineButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
      style={{ border: `1px solid ${TW.border}`, color: TW.textSecondary, background: "transparent" }}
    >
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    invited:      { bg: TW.indigoBg,  text: TW.indigo  },
    active:       { bg: TW.greenBg,   text: TW.green   },
    pending:      { bg: TW.amberBg,   text: TW.amber   },
    completed:    { bg: TW.greenBg,   text: TW.green   },
    cancelled:    { bg: "oklch(0.95 0.01 265)", text: TW.textMuted },
    open:         { bg: TW.coralBg,   text: TW.coral   },
    closed:       { bg: "oklch(0.95 0.01 265)", text: TW.textMuted },
    "in progress":{ bg: TW.amberBg,   text: TW.amber   },
    signed:       { bg: TW.greenBg,   text: TW.green   },
    draft:        { bg: "oklch(0.95 0.01 265)", text: TW.textMuted },
    sent:         { bg: TW.indigoBg,  text: TW.indigo  },
  };
  const c = colors[status.toLowerCase()] ?? { bg: "oklch(0.95 0.01 265)", text: TW.textMuted };
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative flex-1">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
        style={{ color: TW.textMuted }}
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search..."}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none"
        style={{
          background: TW.pageBg,
          border: `1px solid ${TW.border}`,
          color: TW.textPrimary,
        }}
      />
    </div>
  );
}
