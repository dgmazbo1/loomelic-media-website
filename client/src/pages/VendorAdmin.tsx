/**
 * Vendor Portal Admin Panel
 * Route: /vendor/admin
 * Design: Matches https://loomelic-onb-mexjfodp.manus.space/admin
 * Theme: Pure black + #CCFF00 yellow-green accents
 */
import { useState } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Camera,
  FileText,
  Briefcase,
  CheckSquare,
  AlertTriangle,
  BarChart2,
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
  Copy,
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
  { label: "Dashboard", icon: LayoutDashboard, href: "/vendor/admin" },
  { label: "Vendors", icon: Camera, href: "/vendor/admin/vendors" },
  { label: "Contracts", icon: FileText, href: "/vendor/admin/contracts" },
  { label: "Jobs", icon: Briefcase, href: "/vendor/admin/jobs" },
  { label: "Tasks", icon: CheckSquare, href: "/vendor/admin/tasks" },
  { label: "Incidents", icon: AlertTriangle, href: "/vendor/admin/incidents" },
  { label: "Analytics", icon: BarChart2, href: "/vendor/admin/analytics" },
  { label: "Settings", icon: Settings, href: "/vendor/admin/settings" },
];

/* ─── Dashboard ─────────────────────────────────────────────────────────── */
function DashboardSection() {
  const { data: stats } = trpc.vendorAdmin.getDashboardStats.useQuery();
  const [, navigate] = useLocation();

  const totalVendors = stats?.totalVendors ?? 0;
  const activeContracts = stats?.activeContracts ?? 0;
  const openJobs = stats?.openJobs ?? 0;
  const openIncidents = stats?.openIncidents ?? 0;
  const recentContracts = stats?.recentContracts ?? [];
  const vendorsByRole = stats?.vendorsByRole ?? [];

  return (
    <div className="px-8 py-6 space-y-6">
      <AdminPageHeader breadcrumb="VENDOR ADMIN DASHBOARD" title="OVERVIEW" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Camera} value={totalVendors} label="TOTAL VENDORS" accent />
        <StatCard icon={FileText} value={activeContracts} label="ACTIVE CONTRACTS" />
        <StatCard icon={Briefcase} value={openJobs} label="OPEN JOBS" />
        <StatCard icon={AlertTriangle} value={openIncidents} label="OPEN INCIDENTS" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminCard title="VENDOR ROLE BREAKDOWN">
          {vendorsByRole.length === 0 ? (
            <p className="text-sm" style={{ color: "oklch(0.4 0 0)" }}>No vendors yet.</p>
          ) : (
            <div className="space-y-3">
              {vendorsByRole.map((row: { role: string; count: number }) => (
                <div key={row.role} className="flex items-center justify-between">
                  <span className="text-sm capitalize" style={{ color: "oklch(0.65 0 0)" }}>{row.role}</span>
                  <span className="text-sm font-black" style={{ color: "#CCFF00" }}>{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard
          title="RECENT CONTRACTS"
          action={
            <button
              onClick={() => navigate("/vendor/admin/contracts")}
              className="text-xs font-black tracking-widest flex items-center gap-1 hover:opacity-80"
              style={{ color: "#CCFF00" }}
            >
              View All <ArrowRight size={12} />
            </button>
          }
        >
          {recentContracts.length === 0 ? (
            <p className="text-sm" style={{ color: "oklch(0.4 0 0)" }}>No contracts yet.</p>
          ) : (
            <div className="space-y-2">
              {recentContracts.slice(0, 3).map((c: any) => (
                <div key={c.id} className="flex items-center justify-between">
                  <span className="text-sm truncate" style={{ color: "oklch(0.7 0 0)" }}>{c.contractorName}</span>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      <AdminCard title="QUICK ACTIONS">
        <div className="flex flex-wrap gap-3">
          <OutlineButton onClick={() => navigate("/vendor/admin/vendors")}>
            <Camera size={14} /> MANAGE VENDORS
          </OutlineButton>
          <OutlineButton onClick={() => navigate("/vendor/admin/contracts")}>
            <FileText size={14} /> CONTRACTS
          </OutlineButton>
          <OutlineButton onClick={() => navigate("/vendor/admin/analytics")}>
            <BarChart2 size={14} /> ANALYTICS
          </OutlineButton>
        </div>
      </AdminCard>
    </div>
  );
}

/* ─── Vendors ────────────────────────────────────────────────────────────── */
function VendorsSection() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("photographer");

  const { data: vendors = [], refetch } = trpc.vendorAdmin.listVendors.useQuery();
  const createMutation = trpc.vendorAdmin.createVendor.useMutation({
    onSuccess: () => { toast.success("Vendor invited"); setShowNew(false); setNewName(""); setNewEmail(""); refetch(); },
    onError: (e) => toast.error("Failed: " + e.message),
  });

  const filtered = vendors.filter((v: any) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || v.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="px-8 py-6">
      <AdminPageHeader
        breadcrumb="VENDOR MANAGEMENT"
        title="VENDORS"
        action={
          <PrimaryButton onClick={() => setShowNew(true)}>
            <Plus size={14} /> INVITE VENDOR
          </PrimaryButton>
        }
      />

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-lg p-6 space-y-4" style={{ background: "oklch(0.07 0 0)", border: "1px solid oklch(0.15 0 0)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white tracking-widest">INVITE VENDOR</h2>
              <button onClick={() => setShowNew(false)} style={{ color: "oklch(0.5 0 0)" }}><X size={18} /></button>
            </div>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full name" className="w-full px-3 py-2.5 rounded text-sm outline-none" style={{ background: "oklch(0.1 0 0)", border: "1px solid oklch(0.18 0 0)", color: "#fff" }} />
            <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email address" type="email" className="w-full px-3 py-2.5 rounded text-sm outline-none" style={{ background: "oklch(0.1 0 0)", border: "1px solid oklch(0.18 0 0)", color: "#fff" }} />
            <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full px-3 py-2.5 rounded text-sm outline-none" style={{ background: "oklch(0.1 0 0)", border: "1px solid oklch(0.18 0 0)", color: "#fff" }}>
              <option value="photographer">Photographer</option>
              <option value="videographer">Videographer</option>
              <option value="editor">Editor</option>
              <option value="drone">Drone Operator</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded text-xs font-black" style={{ color: "oklch(0.5 0 0)", border: "1px solid oklch(0.18 0 0)" }}>CANCEL</button>
              <PrimaryButton onClick={() => createMutation.mutate({ name: newName, email: newEmail, role: newRole })}>
                {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} INVITE
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search vendors..." />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2.5 rounded text-sm outline-none" style={{ background: "oklch(0.08 0 0)", border: "1px solid oklch(0.15 0 0)", color: "#fff", minWidth: 160 }}>
          <option value="all">All Roles</option>
          <option value="photographer">Photographer</option>
          <option value="videographer">Videographer</option>
          <option value="editor">Editor</option>
          <option value="drone">Drone Operator</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: "oklch(0.4 0 0)" }}>
            <Camera size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No vendors found.</p>
          </div>
        ) : (
          filtered.map((v: any) => (
            <div key={v.id} className="flex items-center gap-4 px-5 py-4 rounded-lg transition-all" style={{ background: "oklch(0.07 0 0)", border: "1px solid oklch(0.12 0 0)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.09 0 0)")}
              onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.07 0 0)")}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm" style={{ background: "#CCFF00", color: "#000" }}>
                {v.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">{v.name}</div>
                <div className="text-xs capitalize" style={{ color: "oklch(0.5 0 0)" }}>{v.role} · {v.email}</div>
              </div>
              <StatusBadge status={v.status || "active"} />
              <button
                onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/vendor?token=${v.token}`); toast.success("Portal link copied"); }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-semibold transition-all hover:opacity-80"
                style={{ border: "1px solid oklch(0.2 0 0)", color: "oklch(0.5 0 0)" }}
              >
                <Copy size={12} /> COPY LINK
              </button>
              <ChevronRight size={16} style={{ color: "oklch(0.35 0 0)" }} />
            </div>
          ))
        )}
      </div>
      {filtered.length > 0 && (
        <p className="text-xs mt-4 text-center" style={{ color: "oklch(0.4 0 0)" }}>
          Showing {filtered.length} of {vendors.length} vendors
        </p>
      )}
    </div>
  );
}

/* ─── Contracts ──────────────────────────────────────────────────────────── */
function ContractsSection() {
  const [search, setSearch] = useState("");
  const [, navigate] = useLocation();

  const { data: contracts = [] } = trpc.vendorAdmin.listContracts.useQuery();

  const filtered = contracts.filter((c: any) =>
    c.contractorName?.toLowerCase().includes(search.toLowerCase()) ||
    c.projectName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-8 py-6">
      <AdminPageHeader
        breadcrumb="CONTRACT MANAGEMENT"
        title="CONTRACTS"
        action={
          <PrimaryButton onClick={() => navigate("/admin/contracts/new")}>
            <Plus size={14} /> NEW CONTRACT
          </PrimaryButton>
        }
      />

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search contracts..." />
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: "oklch(0.4 0 0)" }}>
            <FileText size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No contracts yet.</p>
            <button onClick={() => navigate("/admin/contracts/new")} className="mt-4 text-xs font-black tracking-widest hover:opacity-80" style={{ color: "#CCFF00" }}>
              + CREATE FIRST CONTRACT
            </button>
          </div>
        ) : (
          filtered.map((c: any) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-4 rounded-lg transition-all" style={{ background: "oklch(0.07 0 0)", border: "1px solid oklch(0.12 0 0)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.09 0 0)")}
              onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.07 0 0)")}
            >
              <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.12 0 0)" }}>
                <FileText size={16} style={{ color: "oklch(0.5 0 0)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">{c.contractorName}</div>
                <div className="text-xs" style={{ color: "oklch(0.5 0 0)" }}>{c.projectName || "No project"} · {new Date(c.createdAt).toLocaleDateString()}</div>
              </div>
              <StatusBadge status={c.status} />
              <button
                onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/vendor/sign/${c.token}`); toast.success("Signing link copied"); }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-semibold transition-all hover:opacity-80"
                style={{ border: "1px solid oklch(0.2 0 0)", color: "oklch(0.5 0 0)" }}
              >
                <Copy size={12} /> COPY LINK
              </button>
              <ChevronRight size={16} style={{ color: "oklch(0.35 0 0)" }} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Jobs ───────────────────────────────────────────────────────────────── */
function JobsSection() {
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");

  const { data: jobs = [], refetch } = trpc.vendorAdmin.listJobs.useQuery();
  const createMutation = trpc.vendorAdmin.createJob.useMutation({
    onSuccess: () => { toast.success("Job posted"); setShowNew(false); setNewTitle(""); setNewDesc(""); setNewDate(""); refetch(); },
    onError: (e) => toast.error("Failed: " + e.message),
  });

  return (
    <div className="px-8 py-6">
      <AdminPageHeader
        breadcrumb="JOB MANAGEMENT"
        title="JOBS"
        action={
          <PrimaryButton onClick={() => setShowNew(true)}>
            <Plus size={14} /> POST JOB
          </PrimaryButton>
        }
      />

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-lg p-6 space-y-4" style={{ background: "oklch(0.07 0 0)", border: "1px solid oklch(0.15 0 0)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white tracking-widest">POST JOB</h2>
              <button onClick={() => setShowNew(false)} style={{ color: "oklch(0.5 0 0)" }}><X size={18} /></button>
            </div>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Job title" className="w-full px-3 py-2.5 rounded text-sm outline-none" style={{ background: "oklch(0.1 0 0)", border: "1px solid oklch(0.18 0 0)", color: "#fff" }} />
            <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Job description" rows={3} className="w-full px-3 py-2.5 rounded text-sm outline-none resize-none" style={{ background: "oklch(0.1 0 0)", border: "1px solid oklch(0.18 0 0)", color: "#fff" }} />
            <input value={newDate} onChange={e => setNewDate(e.target.value)} type="date" className="w-full px-3 py-2.5 rounded text-sm outline-none" style={{ background: "oklch(0.1 0 0)", border: "1px solid oklch(0.18 0 0)", color: "#fff" }} />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded text-xs font-black" style={{ color: "oklch(0.5 0 0)", border: "1px solid oklch(0.18 0 0)" }}>CANCEL</button>
              <PrimaryButton onClick={() => createMutation.mutate({ title: newTitle, description: newDesc, shootDate: newDate ? new Date(newDate).getTime() : undefined })}>
                {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} POST
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {jobs.length === 0 ? (
          <div className="text-center py-16" style={{ color: "oklch(0.4 0 0)" }}>
            <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No jobs posted yet.</p>
          </div>
        ) : (
          jobs.map((j: any) => (
            <div key={j.id} className="flex items-center gap-4 px-5 py-4 rounded-lg" style={{ background: "oklch(0.07 0 0)", border: "1px solid oklch(0.12 0 0)" }}>
              <Briefcase size={16} style={{ color: "#CCFF00" }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">{j.title}</div>
                {j.shootDate && <div className="text-xs" style={{ color: "oklch(0.5 0 0)" }}>{new Date(j.shootDate).toLocaleDateString()}</div>}
              </div>
              <StatusBadge status={j.status || "open"} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Tasks ──────────────────────────────────────────────────────────────── */
function TasksSection() {
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const { data: tasks = [], refetch } = trpc.vendorAdmin.listTasks.useQuery();
  const createMutation = trpc.vendorAdmin.createTask.useMutation({
    onSuccess: () => { toast.success("Task created"); setShowNew(false); setNewTitle(""); refetch(); },
    onError: (e) => toast.error("Failed: " + e.message),
  });

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
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded text-xs font-black" style={{ color: "oklch(0.5 0 0)", border: "1px solid oklch(0.18 0 0)" }}>CANCEL</button>
              <PrimaryButton onClick={() => createMutation.mutate({ title: newTitle })}>
                {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} CREATE
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-16" style={{ color: "oklch(0.4 0 0)" }}>
            <CheckSquare size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No tasks found.</p>
          </div>
        ) : (
          tasks.map((t: { id: number; title: string; status: string }) => (
            <div key={t.id} className="flex items-center gap-4 px-5 py-4 rounded-lg" style={{ background: "oklch(0.07 0 0)", border: "1px solid oklch(0.12 0 0)" }}>
              <CheckSquare size={16} style={{ color: "oklch(0.4 0 0)" }} />
              <div className="flex-1 text-sm font-bold text-white">{t.title}</div>
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

  const { data: incidents = [], refetch } = trpc.vendorAdmin.listIncidents.useQuery();
  const createMutation = trpc.vendorAdmin.createIncident.useMutation({
    onSuccess: () => { toast.success("Incident reported"); setShowNew(false); setNewTitle(""); refetch(); },
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
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded text-xs font-black" style={{ color: "oklch(0.5 0 0)", border: "1px solid oklch(0.18 0 0)" }}>CANCEL</button>
              <PrimaryButton onClick={() => createMutation.mutate({ title: newTitle })}>
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
          incidents.map((inc: { id: number; title: string; status: string }) => (
            <div key={inc.id} className="flex items-center gap-4 px-5 py-4 rounded-lg" style={{ background: "oklch(0.07 0 0)", border: "1px solid oklch(0.12 0 0)" }}>
              <AlertTriangle size={16} style={{ color: "#f87171" }} />
              <div className="flex-1 text-sm font-bold text-white">{inc.title}</div>
              <StatusBadge status={inc.status || "open"} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Analytics ──────────────────────────────────────────────────────────── */
function AnalyticsSection() {
  const { data: stats } = trpc.vendorAdmin.getDashboardStats.useQuery();

  const totalVendors = stats?.totalVendors ?? 0;
  const vendorsByRole = stats?.vendorsByRole ?? [];

  return (
    <div className="px-8 py-6 space-y-6">
      <AdminPageHeader breadcrumb="ANALYTICS" title="ANALYTICS" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} value={totalVendors} label="TOTAL VENDORS" accent />
        <StatCard icon={FileText} value={stats?.activeContracts ?? 0} label="ACTIVE CONTRACTS" />
        <StatCard icon={Briefcase} value={stats?.openJobs ?? 0} label="OPEN JOBS" />
        <StatCard icon={Activity} value={stats?.activeThisWeek ?? 0} label="ACTIVE THIS WEEK" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminCard title="VENDOR ROLE DISTRIBUTION">
          {vendorsByRole.length === 0 ? (
            <p className="text-sm" style={{ color: "oklch(0.4 0 0)" }}>No data yet.</p>
          ) : (
            <div className="space-y-4">
              {vendorsByRole.map((row: { role: string; count: number }) => {
                const pct = totalVendors > 0 ? Math.round((row.count / totalVendors) * 100) : 0;
                return (
                  <div key={row.role}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize" style={{ color: "oklch(0.65 0 0)" }}>{row.role}</span>
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

        <AdminCard title="CONTRACT PERFORMANCE">
          <div className="space-y-4">
            {[
              { label: "Contract Completion Rate", value: "94% signed" },
              { label: "Avg. Signing Time", value: "1.8 days" },
              { label: "Active Vendor Rate", value: "87%" },
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
          Vendor portal configuration and preferences will appear here.
        </p>
      </AdminCard>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function VendorAdmin() {
  const [location] = useLocation();

  const renderSection = () => {
    if (location.startsWith("/vendor/admin/vendors")) return <VendorsSection />;
    if (location.startsWith("/vendor/admin/contracts")) return <ContractsSection />;
    if (location.startsWith("/vendor/admin/jobs")) return <JobsSection />;
    if (location.startsWith("/vendor/admin/tasks")) return <TasksSection />;
    if (location.startsWith("/vendor/admin/incidents")) return <IncidentsSection />;
    if (location.startsWith("/vendor/admin/analytics")) return <AnalyticsSection />;
    if (location.startsWith("/vendor/admin/settings")) return <SettingsSection />;
    return <DashboardSection />;
  };

  return (
    <PortalAdminLayout
      title="Loomelic Media"
      subtitle="Vendor Admin Panel"
      initials="LM"
      navItems={NAV_ITEMS}
    >
      {renderSection()}
    </PortalAdminLayout>
  );
}
