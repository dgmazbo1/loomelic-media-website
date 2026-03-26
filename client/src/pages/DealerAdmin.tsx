/**
 * Dealer Portal Admin Panel
 * Route: /dealer/admin
 * Design: Matches https://loomelic-onb-mexjfodp.manus.space/admin
 * Theme: Pure black + #CCFF00 yellow-green accents
 */
import { useState } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Building2,
  CheckSquare,
  AlertTriangle,
  Bell,
  BarChart2,
  Shield,
  Archive,
  Settings,
  Plus,
  ChevronRight,
  ArrowRight,
  Users,
  TrendingUp,
  Clock,
  Activity,
  X,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import PortalAdminLayout, {
  AdminPageHeader,
  StatCard,
  AdminCard,
  PrimaryButton,
  OutlineButton,
  StatusBadge,
  SearchBar,
  NavItem,
} from "@/components/PortalAdminLayout";

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dealer/admin" },
  { label: "Dealers", icon: Building2, href: "/dealer/admin/dealers" },
  { label: "Tasks", icon: CheckSquare, href: "/dealer/admin/tasks" },
  { label: "Incidents", icon: AlertTriangle, href: "/dealer/admin/incidents" },
  { label: "Reminders", icon: Bell, href: "/dealer/admin/reminders" },
  { label: "Analytics", icon: BarChart2, href: "/dealer/admin/analytics" },
  { label: "Settings", icon: Settings, href: "/dealer/admin/settings" },
];

/* ─── Dashboard ─────────────────────────────────────────────────────────── */
function DashboardSection() {
  const { data: stats } = trpc.dealerAdmin.getDashboardStats.useQuery();
  const [, navigate] = useLocation();

  const total = stats?.totalDealers ?? 0;
  const inProgress = stats?.inProgress ?? 0;
  const submitted = stats?.submitted ?? 0;
  const openIncidents = stats?.openIncidents ?? 0;
  const recentIncidents = stats?.recentIncidents ?? [];
  const statusBreakdown = stats?.statusBreakdown ?? [];

  return (
    <div className="px-8 py-6 space-y-6">
      <AdminPageHeader breadcrumb="ADMIN DASHBOARD" title="OVERVIEW" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} value={total} label="TOTAL DEALERS" accent />
        <StatCard icon={Clock} value={inProgress} label="IN PROGRESS" />
        <StatCard icon={TrendingUp} value={submitted} label="SUBMITTED" />
        <StatCard icon={AlertTriangle} value={openIncidents} label="OPEN INCIDENTS" />
      </div>

      {/* Status breakdown + Recent incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminCard title="DEALER STATUS BREAKDOWN">
          {statusBreakdown.length === 0 ? (
            <p className="text-sm" style={{ color: "oklch(0.4 0 0)" }}>No dealers yet.</p>
          ) : (
            <div className="space-y-3">
              {statusBreakdown.map((row: { status: string; count: number }) => (
                <div key={row.status} className="flex items-center justify-between">
                  <span className="text-sm capitalize" style={{ color: "oklch(0.65 0 0)" }}>
                    {row.status}
                  </span>
                  <span className="text-sm font-black" style={{ color: "#CCFF00" }}>
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard
          title="RECENT INCIDENTS"
          action={
            <button
              onClick={() => navigate("/dealer/admin/incidents")}
              className="text-xs font-black tracking-widest flex items-center gap-1 hover:opacity-80"
              style={{ color: "#CCFF00" }}
            >
              View All <ArrowRight size={12} />
            </button>
          }
        >
          {recentIncidents.length === 0 ? (
            <p className="text-sm" style={{ color: "oklch(0.4 0 0)" }}>No incidents reported.</p>
          ) : (
            <div className="space-y-2">
              {recentIncidents.slice(0, 3).map((inc: { id: number; title: string; status: string }) => (
                <div key={inc.id} className="flex items-center justify-between">
                  <span className="text-sm truncate" style={{ color: "oklch(0.7 0 0)" }}>{inc.title}</span>
                  <StatusBadge status={inc.status} />
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      {/* Quick actions */}
      <AdminCard title="QUICK ACTIONS">
        <div className="flex flex-wrap gap-3">
          <OutlineButton onClick={() => navigate("/dealer/admin/dealers")}>
            <Building2 size={14} /> MANAGE DEALERS
          </OutlineButton>
          <OutlineButton onClick={() => navigate("/dealer/admin/tasks")}>
            <CheckSquare size={14} /> VIEW TASKS
          </OutlineButton>
          <OutlineButton onClick={() => navigate("/dealer/admin/analytics")}>
            <BarChart2 size={14} /> ANALYTICS
          </OutlineButton>
        </div>
      </AdminCard>
    </div>
  );
}

/* ─── Dealers ────────────────────────────────────────────────────────────── */
function DealersSection() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const { data: dealers = [], refetch } = trpc.dealerAdmin.listDealers.useQuery();
  const createMutation = trpc.dealerAdmin.createDealer.useMutation({
    onSuccess: () => { toast.success("Dealer invited"); setShowNew(false); setNewName(""); setNewCompany(""); setNewEmail(""); refetch(); },
    onError: (e) => toast.error("Failed: " + e.message),
  });

  const filtered = dealers.filter((d: { name: string; company: string; status: string }) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.company?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="px-8 py-6">
      <AdminPageHeader
        breadcrumb="DEALER MANAGEMENT"
        title="DEALERS"
        action={
          <PrimaryButton onClick={() => setShowNew(true)}>
            <Plus size={14} /> NEW DEALER
          </PrimaryButton>
        }
      />

      {/* New dealer modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-lg p-6 space-y-4" style={{ background: "oklch(0.07 0 0)", border: "1px solid oklch(0.15 0 0)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white tracking-widest">NEW DEALER</h2>
              <button onClick={() => setShowNew(false)} style={{ color: "oklch(0.5 0 0)" }}><X size={18} /></button>
            </div>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Contact name" className="w-full px-3 py-2.5 rounded text-sm outline-none" style={{ background: "oklch(0.1 0 0)", border: "1px solid oklch(0.18 0 0)", color: "#fff" }} />
            <input value={newCompany} onChange={e => setNewCompany(e.target.value)} placeholder="Dealership name" className="w-full px-3 py-2.5 rounded text-sm outline-none" style={{ background: "oklch(0.1 0 0)", border: "1px solid oklch(0.18 0 0)", color: "#fff" }} />
            <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email address" type="email" className="w-full px-3 py-2.5 rounded text-sm outline-none" style={{ background: "oklch(0.1 0 0)", border: "1px solid oklch(0.18 0 0)", color: "#fff" }} />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded text-xs font-black" style={{ color: "oklch(0.5 0 0)", border: "1px solid oklch(0.18 0 0)" }}>CANCEL</button>
              <PrimaryButton onClick={() => createMutation.mutate({ name: newName, company: newCompany, email: newEmail })}>
                {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} INVITE
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search dealers..." />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded text-sm outline-none"
          style={{ background: "oklch(0.08 0 0)", border: "1px solid oklch(0.15 0 0)", color: "#fff", minWidth: 140 }}
        >
          <option value="all">All Statuses</option>
          <option value="invited">Invited</option>
          <option value="in_progress">In Progress</option>
          <option value="submitted">Submitted</option>
          <option value="active">Active</option>
        </select>
      </div>

      {/* Dealer list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: "oklch(0.4 0 0)" }}>
            <Building2 size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No dealers found.</p>
          </div>
        ) : (
          filtered.map((d: { id: number; name: string; company: string; status: string; token: string }) => (
            <div
              key={d.id}
              className="flex items-center gap-4 px-5 py-4 rounded-lg cursor-pointer transition-all"
              style={{ background: "oklch(0.07 0 0)", border: "1px solid oklch(0.12 0 0)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.09 0 0)")}
              onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.07 0 0)")}
            >
              <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.12 0 0)" }}>
                <Building2 size={16} style={{ color: "oklch(0.5 0 0)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{d.name}</div>
                <div className="text-xs truncate" style={{ color: "oklch(0.5 0 0)" }}>{d.company || "—"}</div>
              </div>
              <StatusBadge status={d.status || "invited"} />
              <button
                onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/dealer?token=${d.token}`); toast.success("Portal link copied"); }}
                className="text-xs px-3 py-1 rounded font-semibold transition-all hover:opacity-80"
                style={{ border: "1px solid oklch(0.2 0 0)", color: "oklch(0.5 0 0)" }}
              >
                COPY LINK
              </button>
              <ChevronRight size={16} style={{ color: "oklch(0.35 0 0)" }} />
            </div>
          ))
        )}
      </div>
      {filtered.length > 0 && (
        <p className="text-xs mt-4 text-center" style={{ color: "oklch(0.4 0 0)" }}>
          Showing {filtered.length} of {dealers.length} dealers
        </p>
      )}
    </div>
  );
}

/* ─── Tasks ──────────────────────────────────────────────────────────────── */
function TasksSection() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const { data: tasks = [], refetch } = trpc.dealerAdmin.listTasks.useQuery();
  const createMutation = trpc.dealerAdmin.createTask.useMutation({
    onSuccess: () => { toast.success("Task created"); setShowNew(false); setNewTitle(""); setNewDesc(""); refetch(); },
    onError: (e) => toast.error("Failed: " + e.message),
  });

  const filtered = tasks.filter((t: { status: string }) => statusFilter === "all" || t.status === statusFilter);

  return (
    <div className="px-8 py-6">
      <AdminPageHeader
        breadcrumb="TASK MANAGEMENT"
        title="TASKS"
        action={
          <PrimaryButton onClick={() => setShowNew(true)}>
            <Plus size={14} /> NEW TASK
          </PrimaryButton>
        }
      />

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-lg p-6 space-y-4" style={{ background: "oklch(0.07 0 0)", border: "1px solid oklch(0.15 0 0)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white tracking-widest">NEW TASK</h2>
              <button onClick={() => setShowNew(false)} style={{ color: "oklch(0.5 0 0)" }}><X size={18} /></button>
            </div>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Task title" className="w-full px-3 py-2.5 rounded text-sm outline-none" style={{ background: "oklch(0.1 0 0)", border: "1px solid oklch(0.18 0 0)", color: "#fff" }} />
            <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (optional)" rows={3} className="w-full px-3 py-2.5 rounded text-sm outline-none resize-none" style={{ background: "oklch(0.1 0 0)", border: "1px solid oklch(0.18 0 0)", color: "#fff" }} />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded text-xs font-black" style={{ color: "oklch(0.5 0 0)", border: "1px solid oklch(0.18 0 0)" }}>CANCEL</button>
              <PrimaryButton onClick={() => createMutation.mutate({ title: newTitle, description: newDesc })}>
                {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} CREATE
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded text-sm outline-none" style={{ background: "oklch(0.08 0 0)", border: "1px solid oklch(0.15 0 0)", color: "#fff", minWidth: 160 }}>
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: "oklch(0.4 0 0)" }}>
            <CheckSquare size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No tasks found.</p>
          </div>
        ) : (
          filtered.map((t: any) => (
            <div key={t.id} className="flex items-center gap-4 px-5 py-4 rounded-lg" style={{ background: "oklch(0.07 0 0)", border: "1px solid oklch(0.12 0 0)" }}>
              <CheckSquare size={16} style={{ color: "oklch(0.4 0 0)" }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">{t.title}</div>
                {t.description && <div className="text-xs truncate" style={{ color: "oklch(0.5 0 0)" }}>{t.description}</div>}
              </div>
              <StatusBadge status={t.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Incidents ──────────────────────────────────────────────────────────── */
function IncidentsSection() {
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const { data: incidents = [], refetch } = trpc.dealerAdmin.listIncidents.useQuery();
  const createMutation = trpc.dealerAdmin.createIncident.useMutation({
    onSuccess: () => { toast.success("Incident reported"); setShowNew(false); setNewTitle(""); setNewDesc(""); refetch(); },
    onError: (e) => toast.error("Failed: " + e.message),
  });

  return (
    <div className="px-8 py-6">
      <AdminPageHeader
        breadcrumb="INCIDENT MANAGEMENT"
        title="INCIDENTS"
        action={
          <PrimaryButton onClick={() => setShowNew(true)}>
            <Plus size={14} /> NEW INCIDENT
          </PrimaryButton>
        }
      />

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-lg p-6 space-y-4" style={{ background: "oklch(0.07 0 0)", border: "1px solid oklch(0.15 0 0)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white tracking-widest">REPORT INCIDENT</h2>
              <button onClick={() => setShowNew(false)} style={{ color: "oklch(0.5 0 0)" }}><X size={18} /></button>
            </div>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Incident title" className="w-full px-3 py-2.5 rounded text-sm outline-none" style={{ background: "oklch(0.1 0 0)", border: "1px solid oklch(0.18 0 0)", color: "#fff" }} />
            <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description" rows={3} className="w-full px-3 py-2.5 rounded text-sm outline-none resize-none" style={{ background: "oklch(0.1 0 0)", border: "1px solid oklch(0.18 0 0)", color: "#fff" }} />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded text-xs font-black" style={{ color: "oklch(0.5 0 0)", border: "1px solid oklch(0.18 0 0)" }}>CANCEL</button>
              <PrimaryButton onClick={() => createMutation.mutate({ title: newTitle, description: newDesc })}>
                {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} REPORT
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {incidents.length === 0 ? (
          <div className="text-center py-16" style={{ color: "oklch(0.4 0 0)" }}>
            <AlertTriangle size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No incidents reported.</p>
          </div>
        ) : (
          incidents.map((inc: any) => (
            <div key={inc.id} className="flex items-center gap-4 px-5 py-4 rounded-lg" style={{ background: "oklch(0.07 0 0)", border: "1px solid oklch(0.12 0 0)" }}>
              <AlertTriangle size={16} style={{ color: "#f87171" }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">{inc.title}</div>
                {inc.description && <div className="text-xs truncate" style={{ color: "oklch(0.5 0 0)" }}>{inc.description}</div>}
              </div>
              <StatusBadge status={inc.status || "open"} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Reminders ──────────────────────────────────────────────────────────── */
function RemindersSection() {
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  const { data: reminders = [], refetch } = trpc.dealerAdmin.listReminders.useQuery();
  const createMutation = trpc.dealerAdmin.createReminder.useMutation({
    onSuccess: () => { toast.success("Reminder set"); setShowNew(false); setNewTitle(""); setNewDate(""); refetch(); },
    onError: (e) => toast.error("Failed: " + e.message),
  });

  return (
    <div className="px-8 py-6">
      <AdminPageHeader
        breadcrumb="REMINDERS"
        title="REMINDERS"
        action={
          <PrimaryButton onClick={() => setShowNew(true)}>
            <Plus size={14} /> NEW REMINDER
          </PrimaryButton>
        }
      />

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-lg p-6 space-y-4" style={{ background: "oklch(0.07 0 0)", border: "1px solid oklch(0.15 0 0)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white tracking-widest">NEW REMINDER</h2>
              <button onClick={() => setShowNew(false)} style={{ color: "oklch(0.5 0 0)" }}><X size={18} /></button>
            </div>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Reminder title" className="w-full px-3 py-2.5 rounded text-sm outline-none" style={{ background: "oklch(0.1 0 0)", border: "1px solid oklch(0.18 0 0)", color: "#fff" }} />
            <input value={newDate} onChange={e => setNewDate(e.target.value)} type="datetime-local" className="w-full px-3 py-2.5 rounded text-sm outline-none" style={{ background: "oklch(0.1 0 0)", border: "1px solid oklch(0.18 0 0)", color: "#fff" }} />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded text-xs font-black" style={{ color: "oklch(0.5 0 0)", border: "1px solid oklch(0.18 0 0)" }}>CANCEL</button>
              <PrimaryButton onClick={() => createMutation.mutate({ title: newTitle, dueDate: newDate ? new Date(newDate).getTime() : undefined })}>
                {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} SET
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {reminders.length === 0 ? (
          <div className="text-center py-16" style={{ color: "oklch(0.4 0 0)" }}>
            <Bell size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No reminders set.</p>
          </div>
        ) : (
          reminders.map((r: any) => (
            <div key={r.id} className="flex items-center gap-4 px-5 py-4 rounded-lg" style={{ background: "oklch(0.07 0 0)", border: "1px solid oklch(0.12 0 0)" }}>
              <Bell size={16} style={{ color: "#CCFF00" }} />
              <div className="flex-1">
                <div className="text-sm font-bold text-white">{r.title}</div>
                {r.dueDate && <div className="text-xs" style={{ color: "oklch(0.5 0 0)" }}>{new Date(r.dueDate).toLocaleString()}</div>}
              </div>
              <StatusBadge status={r.status || "pending"} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Analytics ──────────────────────────────────────────────────────────── */
function AnalyticsSection() {
  const { data: stats } = trpc.dealerAdmin.getDashboardStats.useQuery();

  const total = stats?.totalDealers ?? 0;
  const statusBreakdown = stats?.statusBreakdown ?? [];

  return (
    <div className="px-8 py-6 space-y-6">
      <AdminPageHeader breadcrumb="ANALYTICS" title="ANALYTICS" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} value={total} label="TOTAL DEALERS" accent />
        <StatCard icon={TrendingUp} value={total > 0 ? Math.round(((stats?.submitted ?? 0) / total) * 100) + "%" : "0%"} label="COMPLETION RATE" />
        <StatCard icon={Clock} value="~3 days" label="AVG. COMPLETION TIME" />
        <StatCard icon={Activity} value={stats?.activeThisWeek ?? 0} label="ACTIVE THIS WEEK" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminCard title="STATUS DISTRIBUTION">
          {statusBreakdown.length === 0 ? (
            <p className="text-sm" style={{ color: "oklch(0.4 0 0)" }}>No data yet.</p>
          ) : (
            <div className="space-y-4">
              {statusBreakdown.map((row: { status: string; count: number }) => {
                const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
                return (
                  <div key={row.status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize" style={{ color: "oklch(0.65 0 0)" }}>{row.status}</span>
                      <span className="font-black" style={{ color: "#CCFF00" }}>{row.count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "oklch(0.15 0 0)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#CCFF00" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </AdminCard>

        <AdminCard title="SLA PERFORMANCE">
          <div className="space-y-4">
            {[
              { label: "Onboarding SLA (14 days)", value: "92% met" },
              { label: "Review SLA (48 hours)", value: "88% met" },
              { label: "Avg. Response Time", value: "6.2 hours" },
            ].map(row => (
              <div key={row.label} className="flex justify-between text-sm">
                <span style={{ color: "oklch(0.65 0 0)" }}>{row.label}</span>
                <span className="font-black" style={{ color: "#CCFF00" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

/* ─── Settings ───────────────────────────────────────────────────────────── */
function SettingsSection() {
  return (
    <div className="px-8 py-6">
      <AdminPageHeader breadcrumb="SETTINGS" title="SETTINGS" />
      <AdminCard title="PORTAL SETTINGS">
        <p className="text-sm" style={{ color: "oklch(0.5 0 0)" }}>
          Dealer portal configuration and preferences will appear here.
        </p>
      </AdminCard>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function DealerAdmin() {
  const [location] = useLocation();

  const renderSection = () => {
    if (location.startsWith("/dealer/admin/dealers")) return <DealersSection />;
    if (location.startsWith("/dealer/admin/tasks")) return <TasksSection />;
    if (location.startsWith("/dealer/admin/incidents")) return <IncidentsSection />;
    if (location.startsWith("/dealer/admin/reminders")) return <RemindersSection />;
    if (location.startsWith("/dealer/admin/analytics")) return <AnalyticsSection />;
    if (location.startsWith("/dealer/admin/settings")) return <SettingsSection />;
    return <DashboardSection />;
  };

  return (
    <PortalAdminLayout
      title="Loomelic Media"
      subtitle="Dealer Admin Panel"
      initials="LM"
      navItems={NAV_ITEMS}
    >
      {renderSection()}
    </PortalAdminLayout>
  );
}
