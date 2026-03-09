/**
 * PortalAdminLayout — Shared layout for Dealer and Vendor portal admin panels
 * Design matches: https://loomelic-onb-mexjfodp.manus.space/admin
 * Theme: Pure black bg + #CCFF00 yellow-green accents
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LucideIcon, Menu, X } from "lucide-react";

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
    <div
      className="flex flex-col h-full"
      style={{ background: "oklch(0.04 0 0)", borderRight: "1px solid oklch(0.12 0 0)" }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded flex items-center justify-center text-xs font-black"
            style={{ background: "#CCFF00", color: "#000" }}
          >
            L
          </div>
          <div>
            <div className="text-white font-black text-sm tracking-widest leading-none">LOOMELIC</div>
            <div className="text-xs tracking-widest leading-none" style={{ color: "oklch(0.5 0 0)" }}>
              ADMIN
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || location.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all text-left"
                style={{
                  color: isActive ? "#CCFF00" : "oklch(0.65 0 0)",
                  background: isActive ? "oklch(0.1 0 0)" : "transparent",
                  borderLeft: isActive ? "2px solid #CCFF00" : "2px solid transparent",
                }}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} style={{ color: isActive ? "#CCFF00" : "oklch(0.45 0 0)" }} />
                {item.label}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ borderTop: "1px solid oklch(0.12 0 0)" }} />

      {/* User footer */}
      <div className="px-4 py-4 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
          style={{ background: "#CCFF00", color: "#000" }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <div className="text-white text-xs font-semibold truncate">{title}</div>
          <div className="text-xs truncate" style={{ color: "oklch(0.45 0 0)" }}>
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#000", color: "#fff" }}>
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
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div
          className="md:hidden flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid oklch(0.12 0 0)" }}
        >
          <span className="font-black text-sm tracking-widest text-white">LOOMELIC ADMIN</span>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* ─── Shared UI primitives ──────────────────────────────────────────────── */

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
        <div
          className="text-xs font-semibold tracking-widest mb-3 flex items-center gap-2"
          style={{ color: "#CCFF00" }}
        >
          <span>✦</span>
          <span>{breadcrumb}</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">{title}</h1>
      </div>
      {action && <div className="mt-8">{action}</div>}
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
    <div
      className="p-6 rounded-lg"
      style={{
        background: "oklch(0.07 0 0)",
        border: "1px solid oklch(0.13 0 0)",
      }}
    >
      <Icon size={20} style={{ color: accent ? "#CCFF00" : "oklch(0.45 0 0)", marginBottom: 16 }} />
      <div
        className="text-3xl font-black mb-1"
        style={{ color: accent ? "#CCFF00" : "#fff" }}
      >
        {value}
      </div>
      <div className="text-xs font-semibold tracking-widest" style={{ color: "oklch(0.45 0 0)" }}>
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
    <div
      className="rounded-lg p-6"
      style={{
        background: "oklch(0.07 0 0)",
        border: "1px solid oklch(0.13 0 0)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black tracking-widest text-white">{title}</h3>
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
      className="flex items-center gap-2 px-4 py-2 rounded text-xs font-black tracking-widest transition-opacity hover:opacity-90"
      style={{ background: "#CCFF00", color: "#000" }}
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
      className="flex items-center gap-2 px-4 py-2 rounded text-xs font-black tracking-widest transition-all hover:bg-[#CCFF00]/10"
      style={{ border: "1px solid #CCFF00", color: "#CCFF00", background: "transparent" }}
    >
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    invited: { bg: "oklch(0.15 0.05 90)", text: "#CCFF00" },
    active: { bg: "oklch(0.12 0.05 145)", text: "#4ade80" },
    pending: { bg: "oklch(0.12 0.04 60)", text: "#fbbf24" },
    completed: { bg: "oklch(0.12 0.04 240)", text: "#60a5fa" },
    cancelled: { bg: "oklch(0.1 0 0)", text: "oklch(0.5 0 0)" },
    open: { bg: "oklch(0.12 0.06 20)", text: "#f87171" },
    closed: { bg: "oklch(0.1 0 0)", text: "oklch(0.5 0 0)" },
    "in progress": { bg: "oklch(0.12 0.04 60)", text: "#fbbf24" },
    signed: { bg: "oklch(0.12 0.05 145)", text: "#4ade80" },
    draft: { bg: "oklch(0.1 0 0)", text: "oklch(0.5 0 0)" },
    sent: { bg: "oklch(0.15 0.05 90)", text: "#CCFF00" },
  };
  const c = colors[status.toLowerCase()] ?? { bg: "oklch(0.1 0 0)", text: "oklch(0.5 0 0)" };
  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-black tracking-widest"
      style={{ background: c.bg, color: c.text }}
    >
      {status.toUpperCase()}
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
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
        style={{ color: "oklch(0.4 0 0)" }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search..."}
        className="w-full pl-10 pr-4 py-2.5 rounded text-sm outline-none"
        style={{
          background: "oklch(0.08 0 0)",
          border: "1px solid oklch(0.15 0 0)",
          color: "#fff",
        }}
      />
    </div>
  );
}
