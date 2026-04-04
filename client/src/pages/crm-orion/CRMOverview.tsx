/* ============================================================
   CRM Overview — /crm
   ORION-inspired: warm off-white bg, coral accent, dark sidebar
   ============================================================ */
import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  Users, GitBranch, DollarSign, CheckSquare, ArrowUpRight,
  Clock, Flame, Thermometer, Snowflake, Activity, Plus,
  Building2, FileText,
} from "lucide-react";
import AdminLayout, { TW, TWCard } from "@/components/AdminLayout";
import { ScoreCircle, CRM_COLORS } from "@/components/CRMLayout";

/* ─── Helpers ─────────────────────────────────────────────── */
function formatCurrency(val: number | null | undefined) {
  if (val == null) return "$0";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}
function timeAgo(date: Date | string | null | undefined) {
  if (!date) return "—";
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const LEAD_TEMP_ICON: Record<string, React.ReactNode> = {
  hot:  <Flame size={12} style={{ color: "oklch(0.62 0.18 25)" }} />,
  warm: <Thermometer size={12} style={{ color: "oklch(0.65 0.14 60)" }} />,
  cold: <Snowflake size={12} style={{ color: "oklch(0.55 0.10 250)" }} />,
};

/* ─── Pipeline donut ─────────────────────────────────────── */
const STAGE_COLORS: Record<string, string> = {
  lead:        "oklch(0.60 0.10 250)",
  qualified:   "oklch(0.60 0.12 200)",
  proposal:    "oklch(0.65 0.14 80)",
  negotiation: "oklch(0.65 0.14 50)",
  closed_won:  "oklch(0.62 0.18 25)",
  closed_lost: "oklch(0.60 0.05 260)",
};
const STAGE_LABELS: Record<string, string> = {
  lead: "Lead", qualified: "Qualified", proposal: "Proposal",
  negotiation: "Negotiation", closed_won: "Won", closed_lost: "Lost",
};

function PipelineDonut({ deals }: { deals: Array<{ stage: string; value?: number | null }> }) {
  const total = deals.length || 1;
  const stageCounts = deals.reduce((acc, d) => {
    acc[d.stage] = (acc[d.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const size = 140;
  const r = 52;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const slices = Object.keys(STAGE_LABELS).map(s => {
    const count = stageCounts[s] || 0;
    const dash = (count / total) * circ;
    const slice = { stage: s, count, dash, offset };
    offset += dash;
    return slice;
  });

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="oklch(0.93 0.005 80)" strokeWidth={16} />
          {slices.map(s => s.count > 0 && (
            <circle key={s.stage}
              cx={size/2} cy={size/2} r={r} fill="none"
              stroke={STAGE_COLORS[s.stage]}
              strokeWidth={16}
              strokeDasharray={`${s.dash} ${circ - s.dash}`}
              strokeDashoffset={-s.offset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: CRM_COLORS.textPrimary }}>{deals.length}</span>
          <span className="text-xs" style={{ color: CRM_COLORS.textSecondary }}>Deals</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 min-w-0">
        {Object.keys(STAGE_LABELS).filter(s => (stageCounts[s] || 0) > 0).map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: STAGE_COLORS[s] }} />
            <span className="text-xs truncate" style={{ color: CRM_COLORS.textSecondary }}>{STAGE_LABELS[s]}</span>
            <span className="text-xs font-semibold ml-auto pl-3" style={{ color: CRM_COLORS.textPrimary }}>
              {stageCounts[s]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Stat card ──────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, accent }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; accent?: boolean;
}) {
  return (
    <TWCard className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accent ? "oklch(0.95 0.04 25)" : "oklch(0.96 0.005 80)" }}>
        <Icon size={18} style={{ color: accent ? "oklch(0.62 0.18 25)" : "oklch(0.50 0.005 260)" }} />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold tracking-tight" style={{ color: CRM_COLORS.textPrimary }}>{value}</div>
        <div className="text-xs font-medium mt-0.5" style={{ color: CRM_COLORS.textSecondary }}>{label}</div>
        {sub && <div className="text-xs mt-1" style={{ color: "oklch(0.62 0.18 25)" }}>{sub}</div>}
      </div>
    </TWCard>
  );
}

/* ─── Contact row card ───────────────────────────────────── */
function ContactRow({ contact }: { contact: {
  id: number; name: string; company?: string | null; title?: string | null;
  leadTemp?: string | null; lastContactedAt?: Date | null; quickNotes?: string | null;
}}) {
  const score = contact.leadTemp === "hot" ? 85 : contact.leadTemp === "warm" ? 60 : 35;
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl transition-all duration-150 hover:bg-gray-50">
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
        style={{ background: "oklch(0.95 0.04 25)", color: "oklch(0.62 0.18 25)" }}>
        {contact.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm truncate" style={{ color: CRM_COLORS.textPrimary }}>
            {contact.name}
          </span>
          {contact.leadTemp && <span className="shrink-0">{LEAD_TEMP_ICON[contact.leadTemp]}</span>}
        </div>
        <div className="text-xs truncate" style={{ color: CRM_COLORS.textSecondary }}>
          {contact.title && contact.company ? `${contact.title} · ${contact.company}` : contact.company || contact.title || "—"}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <ScoreCircle score={score} size={40} />
        <span className="text-xs" style={{ color: CRM_COLORS.textSecondary }}>{timeAgo(contact.lastContactedAt)}</span>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
export default function CRMOverviewPage() {
  const { data: stats } = trpc.crm.getStats.useQuery();
  const { data: contacts = [] } = trpc.crm.listContacts.useQuery();
  const { data: deals = [] } = trpc.crm.listDeals.useQuery();
  const { data: interactions = [] } = trpc.crm.listInteractions.useQuery({});

  const recentContacts = useMemo(() => contacts.slice(0, 6), [contacts]);
  const recentActivity = useMemo(() => interactions.slice(0, 8), [interactions]);

  return (
    <AdminLayout
      title="Overview"
      subtitle="Your pipeline at a glance"
      actions={
        <Link href="/crm/contacts">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "oklch(0.62 0.18 25)" }}>
            <Plus size={15} /> New Contact
          </button>
        </Link>
      }
    >
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Contacts" value={stats?.totalContacts ?? 0} accent />
        <StatCard icon={GitBranch} label="Active Deals" value={stats?.activeDeals ?? 0} />
        <StatCard icon={DollarSign} label="Signed Revenue" value={formatCurrency(stats?.totalRevenue)} />
        <StatCard icon={CheckSquare} label="Open Tasks" value={stats?.openTasks ?? 0}
          sub={stats?.openIncidents ? `${stats.openIncidents} incident${stats.openIncidents !== 1 ? "s" : ""}` : undefined} />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Pipeline donut */}
        <TWCard className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: CRM_COLORS.textPrimary }}>Pipeline</h3>
            <Link href="/crm/pipeline">
              <span className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "oklch(0.62 0.18 25)" }}>
                View all <ArrowUpRight size={12} />
              </span>
            </Link>
          </div>
          <PipelineDonut deals={deals} />
          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${CRM_COLORS.border}` }}>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: CRM_COLORS.textSecondary }}>Pipeline value</span>
              <span className="text-sm font-bold" style={{ color: CRM_COLORS.textPrimary }}>
                {formatCurrency(deals.reduce((s: number, d: any) => s + (d.value ?? 0), 0))}
              </span>
            </div>
          </div>
        </TWCard>

        {/* Recent contacts */}
        <TWCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold" style={{ color: CRM_COLORS.textPrimary }}>Recent Contacts</h3>
            <Link href="/crm/contacts">
              <span className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "oklch(0.62 0.18 25)" }}>
                View all <ArrowUpRight size={12} />
              </span>
            </Link>
          </div>
          {recentContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users size={28} style={{ color: "oklch(0.80 0.005 260)" }} />
              <p className="text-sm mt-2" style={{ color: CRM_COLORS.textSecondary }}>No contacts yet</p>
              <Link href="/crm/contacts">
                <button className="mt-3 text-xs px-3 py-1.5 rounded-lg font-medium"
                  style={{ background: "oklch(0.95 0.04 25)", color: "oklch(0.62 0.18 25)" }}>
                  Add first contact
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col">
              {recentContacts.map((c: any) => <ContactRow key={c.id} contact={c} />)}
            </div>
          )}
        </TWCard>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity feed */}
        <TWCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: CRM_COLORS.textPrimary }}>Recent Activity</h3>
            <Link href="/crm/activity">
              <span className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "oklch(0.62 0.18 25)" }}>
                View all <ArrowUpRight size={12} />
              </span>
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Activity size={28} style={{ color: "oklch(0.80 0.005 260)" }} />
              <p className="text-sm mt-2" style={{ color: CRM_COLORS.textSecondary }}>No activity logged yet</p>
            </div>
          ) : (
            <div className="relative pl-6">
              <div className="absolute left-2 top-2 bottom-2 w-px" style={{ background: "oklch(0.90 0.005 80)" }} />
              <div className="flex flex-col gap-4">
                {recentActivity.map((item: any) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-4 top-1 w-2 h-2 rounded-full"
                      style={{ background: "oklch(0.62 0.18 25)", border: "2px solid white" }} />
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold truncate" style={{ color: CRM_COLORS.textPrimary }}>
                        {item.subject}
                      </span>
                      <span className="text-xs shrink-0 flex items-center gap-1" style={{ color: CRM_COLORS.textSecondary }}>
                        <Clock size={10} /> {timeAgo(item.occurredAt)}
                      </span>
                    </div>
                    <div className="text-xs mt-0.5 capitalize" style={{ color: CRM_COLORS.textSecondary }}>
                      {item.type?.replace("_", " ")} · {item.direction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TWCard>

        {/* Business overview */}
        <TWCard>
          <h3 className="text-sm font-semibold mb-4" style={{ color: CRM_COLORS.textPrimary }}>Business Overview</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: "Dealers", value: stats?.totalDealers ?? 0, sub: `${stats?.activeDealers ?? 0} active`, icon: Building2 },
              { label: "Vendors", value: stats?.totalVendors ?? 0, sub: `${stats?.activeVendors ?? 0} active`, icon: Building2 },
              { label: "Contracts", value: stats?.totalContracts ?? 0, sub: "total", icon: FileText },
            ].map(({ label, value, sub, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 py-2"
                style={{ borderBottom: `1px solid ${CRM_COLORS.border}` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "oklch(0.96 0.005 80)" }}>
                  <Icon size={14} style={{ color: CRM_COLORS.textSecondary }} />
                </div>
                <div className="flex-1">
                  <div className="text-xs" style={{ color: CRM_COLORS.textSecondary }}>{label}</div>
                  <div className="text-sm font-semibold" style={{ color: CRM_COLORS.textPrimary }}>{value}</div>
                </div>
                <div className="text-xs" style={{ color: "oklch(0.62 0.18 25)" }}>{sub}</div>
              </div>
            ))}
          </div>
          {/* Win rate */}
          {deals.length > 0 && (() => {
            const won = deals.filter((d: any) => d.stage === "closed_won").length;
            const closed = deals.filter((d: any) => d.stage === "closed_won" || d.stage === "closed_lost").length;
            const rate = closed > 0 ? Math.round((won / closed) * 100) : 0;
            return (
              <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${CRM_COLORS.border}` }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs" style={{ color: CRM_COLORS.textSecondary }}>Win rate</span>
                  <span className="text-sm font-bold" style={{ color: "oklch(0.62 0.18 25)" }}>{rate}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "oklch(0.93 0.005 80)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${rate}%`, background: "oklch(0.62 0.18 25)" }} />
                </div>
              </div>
            );
          })()}
        </TWCard>
      </div>
    </AdminLayout>
  );
}
