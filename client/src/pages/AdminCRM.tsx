import { toast } from "sonner";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout, { TW } from "@/components/AdminLayout";
import {
  Car, Camera, Users, TrendingUp, CheckSquare, AlertTriangle,
  FileText, Plus, Loader2, ChevronRight, Copy, ExternalLink,
  Building2, Mail, Phone, MapPin, BarChart3, Shield, Trash2,
  CheckCircle2, Clock, XCircle, Edit3, ArrowLeft
} from "lucide-react";
import { Link, useLocation } from "wouter";
import AdminCRMModule from "./AdminCRMModule";

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "dealers", label: "Dealers", icon: Car },
  { id: "vendors", label: "Vendors", icon: Camera },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "deals", label: "Deals", icon: TrendingUp },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "incidents", label: "Incidents", icon: AlertTriangle },
  { id: "contracts", label: "Contracts", icon: FileText },
  { id: "interactions", label: "Interactions", icon: Phone },
];

const DEALER_STATUS_COLORS: Record<string, string> = {
  invited: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  in_progress: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  submitted: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  under_review: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  approved: "bg-green-500/20 text-green-300 border-green-500/30",
  active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  paused: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  rejected: "bg-red-500/20 text-red-300 border-red-500/30",
};

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => toast.success("Copied to clipboard"));
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const { data: stats, isLoading } = trpc.crm.getStats.useQuery();
  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;
  if (!stats) return null;

  const statCards = [
    { label: "Total Dealers", value: stats.totalDealers, sub: `${stats.activeDealers} active`, icon: <Car className="w-5 h-5" />, color: "text-[oklch(0.85_0.23_110)]" },
    { label: "Total Vendors", value: stats.totalVendors, sub: `${stats.activeVendors} active`, icon: <Camera className="w-5 h-5" />, color: "text-blue-400" },
    { label: "Open Tasks", value: stats.openTasks, sub: "need attention", icon: <CheckSquare className="w-5 h-5" />, color: "text-yellow-400" },
    { label: "Open Incidents", value: stats.openIncidents, sub: "unresolved", icon: <AlertTriangle className="w-5 h-5" />, color: "text-red-400" },
    { label: "Active Deals", value: stats.activeDeals, sub: "in pipeline", icon: <TrendingUp className="w-5 h-5" />, color: "text-green-400" },
    { label: "Contracts", value: stats.totalContracts, sub: "view contracts", icon: <FileText className="w-5 h-5" />, color: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map(s => (
        <Card key={s.label} className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className={s.color}>{s.icon}</div>
              <div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs font-semibold text-zinc-300">{s.label}</div>
                <div className="text-xs text-zinc-500">{s.sub}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Dealers Tab ──────────────────────────────────────────────────────────────
function DealersTab() {
  
  const [newName, setNewName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<number | null>(null);

  const { data: dealers, isLoading, refetch } = trpc.dealer.listDealers.useQuery();
  const createMutation = trpc.dealer.createDealer.useMutation({
    onSuccess: (d) => {
      toast.success(`Dealer created — Token: ${d.token}`);
      setNewName(""); setShowCreate(false); refetch();
    },
    onError: (e) => toast.error("Error: " + e.message),
  });
  const updateStatusMutation = trpc.dealer.updateDealerStatus.useMutation({
    onSuccess: () => { toast.success("Status updated"); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;

  const portalBase = window.location.origin + "/dealer?token=";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Dealers ({dealers?.length ?? 0})</h2>
        <Button onClick={() => setShowCreate(!showCreate)} size="sm" className="bg-[oklch(0.85_0.23_110)] text-black font-bold">
          <Plus className="w-4 h-4 mr-1" /> Invite Dealer
        </Button>
      </div>
      {showCreate && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-2">
              <Input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Dealership name (e.g. Lexus of Henderson)"
                className="bg-zinc-700 border-zinc-600 text-white"
                onKeyDown={e => e.key === "Enter" && newName.trim() && createMutation.mutate({ storeName: newName.trim() })}
              />
              <Button
                onClick={() => newName.trim() && createMutation.mutate({ storeName: newName.trim() })}
                disabled={createMutation.isPending}
                className="bg-[oklch(0.85_0.23_110)] text-black font-bold flex-shrink-0"
              >
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="space-y-3">
        {dealers?.map(dealer => (
          <Card key={dealer.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{dealer.storeName ?? dealer.legalName ?? `Dealer #${dealer.id}`}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-semibold flex-shrink-0 ${DEALER_STATUS_COLORS[dealer.status] ?? "bg-zinc-700 text-zinc-300"}`}>
                      {dealer.status}
                    </span>
                  </div>
                  {dealer.city && <p className="text-xs text-zinc-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{dealer.city}, {dealer.state}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded font-mono truncate max-w-48">{dealer.token}</code>
                    <button
                      onClick={() => copyToClipboard(portalBase + dealer.token)}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors"
                      title="Copy portal link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a href={`/dealer?token=${dealer.token}`} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors" title="Open portal">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <select
                    value={dealer.status}
                    onChange={e => updateStatusMutation.mutate({ id: dealer.id, status: e.target.value as Parameters<typeof updateStatusMutation.mutate>[0]["status"] })}
                    className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1"
                  >
                    {["invited","in_progress","submitted","under_review","approved","active","paused","rejected","archived","cancelled"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Vendors Tab ──────────────────────────────────────────────────────────────
function VendorsTab() {
  
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "photographer" as const });

  const { data: vendors, isLoading, refetch } = trpc.vendor.listVendors.useQuery();
  const createMutation = trpc.vendor.createVendor.useMutation({
    onSuccess: (d) => {
      toast.success(`Vendor invited — Token: ${d.token}`);
      setForm({ name: "", email: "", role: "photographer" }); setShowCreate(false); refetch();
    },
    onError: (e) => toast.error("Error: " + e.message),
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;

  const portalBase = window.location.origin + "/vendor?token=";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Vendors ({vendors?.length ?? 0})</h2>
        <Button onClick={() => setShowCreate(!showCreate)} size="sm" className="bg-[oklch(0.85_0.23_110)] text-black font-bold">
          <Plus className="w-4 h-4 mr-1" /> Invite Vendor
        </Button>
      </div>
      {showCreate && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="pt-4 pb-4 space-y-3">
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full Name" className="bg-zinc-700 border-zinc-600 text-white" />
            <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email Address" className="bg-zinc-700 border-zinc-600 text-white" />
            <select
              value={form.role}
              onChange={e => setForm(p => ({ ...p, role: e.target.value as typeof form.role }))}
              className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2 text-sm"
            >
              {["photographer","videographer","editor","drone_operator","social_media","graphic_designer","other"].map(r => (
                <option key={r} value={r}>{r.replace("_", " ")}</option>
              ))}
            </select>
            <Button
              onClick={() => form.name.trim() && createMutation.mutate(form)}
              disabled={createMutation.isPending}
              className="w-full bg-[oklch(0.85_0.23_110)] text-black font-bold"
            >
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Send Invite
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="space-y-3">
        {vendors?.map(vendor => (
          <Card key={vendor.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{vendor.name ?? `Vendor #${vendor.id}`}</h3>
                    <span className="text-xs text-zinc-500 capitalize">{vendor.role?.replace("_", " ")}</span>
                  </div>
                  {vendor.email && <p className="text-xs text-zinc-500 flex items-center gap-1"><Mail className="w-3 h-3" />{vendor.email}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded font-mono truncate max-w-48">{vendor.token}</code>
                    <button onClick={() => copyToClipboard(portalBase + vendor.token)} className="text-zinc-500 hover:text-zinc-300 transition-colors" title="Copy portal link">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a href={`/vendor?token=${vendor.token}`} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors" title="Open portal">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-semibold ${
                  vendor.status === "active" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-zinc-700/50 text-zinc-400 border-zinc-600"
                }`}>{vendor.status}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Contacts Tab ─────────────────────────────────────────────────────────────
function ContactsTab() {
  
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", title: "", contactType: "lead" as const, notes: "" });

  const { data: contacts, isLoading, refetch } = trpc.crm.listContacts.useQuery();
  const createMutation = trpc.crm.createContact.useMutation({
    onSuccess: () => { toast.success("Contact created"); setShowCreate(false); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });
  const deleteMutation = trpc.crm.deleteContact.useMutation({
    onSuccess: () => { toast.success("Contact deleted"); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Contacts ({contacts?.length ?? 0})</h2>
        <Button onClick={() => setShowCreate(!showCreate)} size="sm" className="bg-[oklch(0.85_0.23_110)] text-black font-bold">
          <Plus className="w-4 h-4 mr-1" /> Add Contact
        </Button>
      </div>
      {showCreate && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="pt-4 pb-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full Name *" className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Company" className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Job Title" className="bg-zinc-700 border-zinc-600 text-white" />
              <select value={form.contactType} onChange={e => setForm(p => ({ ...p, contactType: e.target.value as typeof form.contactType }))} className="bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2 text-sm">
                {["lead","client","partner","vendor","other"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Notes" className="bg-zinc-700 border-zinc-600 text-white mb-3" rows={2} />
            <Button onClick={() => form.name.trim() && createMutation.mutate(form)} disabled={createMutation.isPending} className="w-full bg-[oklch(0.85_0.23_110)] text-black font-bold">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Contact
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="space-y-2">
        {contacts?.map(c => (
          <Card key={c.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{c.name}</span>
                    <span className="text-xs text-zinc-500 capitalize">{c.contactType}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {c.company && <span className="text-xs text-zinc-500 flex items-center gap-1"><Building2 className="w-3 h-3" />{c.company}</span>}
                    {c.email && <span className="text-xs text-zinc-500 flex items-center gap-1"><Mail className="w-3 h-3" />{c.email}</span>}
                    {c.phone && <span className="text-xs text-zinc-500 flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</span>}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate({ id: c.id })} className="text-red-400 hover:text-red-300 h-7 w-7 p-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Tasks Tab ────────────────────────────────────────────────────────────────
function TasksTab() {
  
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", assignedTo: "", priority: "medium" as const, dueDate: "" });

  const { data: tasks, isLoading, refetch } = trpc.crm.listTasks.useQuery();
  const createMutation = trpc.crm.createTask.useMutation({
    onSuccess: () => { toast.success("Task created"); setShowCreate(false); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });
  const updateMutation = trpc.crm.updateTask.useMutation({
    onSuccess: () => { toast.success("Task updated"); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });
  const deleteMutation = trpc.crm.deleteTask.useMutation({
    onSuccess: () => { toast.success("Task deleted"); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });

  const PRIORITY_COLORS: Record<string, string> = {
    low: "text-zinc-400", medium: "text-blue-400", high: "text-orange-400", urgent: "text-red-400"
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Tasks ({tasks?.length ?? 0})</h2>
        <Button onClick={() => setShowCreate(!showCreate)} size="sm" className="bg-[oklch(0.85_0.23_110)] text-black font-bold">
          <Plus className="w-4 h-4 mr-1" /> New Task
        </Button>
      </div>
      {showCreate && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="pt-4 pb-4 space-y-3">
            <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Task title *" className="bg-zinc-700 border-zinc-600 text-white" />
            <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Description" className="bg-zinc-700 border-zinc-600 text-white" rows={2} />
            <div className="grid grid-cols-3 gap-2">
              <Input value={form.assignedTo} onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))} placeholder="Assigned to" className="bg-zinc-700 border-zinc-600 text-white" />
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as typeof form.priority }))} className="bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2 text-sm">
                {["low","medium","high","urgent"].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <Input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} className="bg-zinc-700 border-zinc-600 text-white" />
            </div>
            <Button onClick={() => form.title.trim() && createMutation.mutate(form)} disabled={createMutation.isPending} className="w-full bg-[oklch(0.85_0.23_110)] text-black font-bold">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Create Task
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="space-y-2">
        {tasks?.map(t => (
          <Card key={t.id} className={`border-zinc-800 ${t.status === "completed" ? "bg-zinc-900/50 opacity-60" : "bg-zinc-900"}`}>
            <CardContent className="pt-3 pb-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => updateMutation.mutate({ id: t.id, status: t.status === "completed" ? "open" : "completed" })}
                  className={`mt-0.5 flex-shrink-0 ${t.status === "completed" ? "text-green-400" : "text-zinc-600 hover:text-zinc-400"}`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${t.status === "completed" ? "line-through text-zinc-500" : "text-white"}`}>{t.title}</span>
                    <span className={`text-xs font-semibold capitalize ${PRIORITY_COLORS[t.priority ?? "medium"]}`}>{t.priority}</span>
                  </div>
                  {t.assignedTo && <p className="text-xs text-zinc-500 mt-0.5">→ {t.assignedTo}</p>}
                  {t.dueDate && <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" />Due: {new Date(t.dueDate).toLocaleDateString()}</p>}
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate({ id: t.id })} className="text-red-400 hover:text-red-300 h-7 w-7 p-0 flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Incidents Tab ────────────────────────────────────────────────────────────
function IncidentsTab() {
  
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", severity: "medium" as const, reportedBy: "" });

  const { data: incidents, isLoading, refetch } = trpc.crm.listIncidents.useQuery();
  const createMutation = trpc.crm.createIncident.useMutation({
    onSuccess: () => { toast.success("Incident logged"); setShowCreate(false); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });
  const updateMutation = trpc.crm.updateIncident.useMutation({
    onSuccess: () => { toast.success("Incident updated"); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });

  const SEVERITY_COLORS: Record<string, string> = {
    low: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
    medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    high: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    critical: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Incidents ({incidents?.length ?? 0})</h2>
        <Button onClick={() => setShowCreate(!showCreate)} size="sm" className="bg-[oklch(0.85_0.23_110)] text-black font-bold">
          <Plus className="w-4 h-4 mr-1" /> Log Incident
        </Button>
      </div>
      {showCreate && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="pt-4 pb-4 space-y-3">
            <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Incident title *" className="bg-zinc-700 border-zinc-600 text-white" />
            <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Description" className="bg-zinc-700 border-zinc-600 text-white" rows={3} />
            <div className="grid grid-cols-2 gap-2">
              <select value={form.severity} onChange={e => setForm(p => ({ ...p, severity: e.target.value as typeof form.severity }))} className="bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2 text-sm">
                {["low","medium","high","critical"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Input value={form.reportedBy} onChange={e => setForm(p => ({ ...p, reportedBy: e.target.value }))} placeholder="Reported by" className="bg-zinc-700 border-zinc-600 text-white" />
            </div>
            <Button onClick={() => form.title.trim() && createMutation.mutate(form)} disabled={createMutation.isPending} className="w-full bg-[oklch(0.85_0.23_110)] text-black font-bold">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Log Incident
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="space-y-3">
        {incidents?.map(inc => (
          <Card key={inc.id} className={`border-zinc-800 ${inc.status === "resolved" || inc.status === "closed" ? "bg-zinc-900/50 opacity-70" : "bg-zinc-900"}`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white text-sm">{inc.title}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-semibold ${SEVERITY_COLORS[inc.severity ?? "medium"]}`}>
                      {inc.severity}
                    </span>
                  </div>
                  {inc.description && <p className="text-xs text-zinc-400 mb-2">{inc.description}</p>}
                  {inc.reportedBy && <p className="text-xs text-zinc-500">Reported by: {inc.reportedBy}</p>}
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <select
                    value={inc.status}
                    onChange={e => updateMutation.mutate({ id: inc.id, status: e.target.value as Parameters<typeof updateMutation.mutate>[0]["status"] })}
                    className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1"
                  >
                    {["open","investigating","resolved","closed"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Deals Tab ────────────────────────────────────────────────────────────────
function DealsTab() {
  
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", stage: "lead" as const, value: "", notes: "", expectedCloseDate: "" });

  const { data: deals, isLoading, refetch } = trpc.crm.listDeals.useQuery();
  const createMutation = trpc.crm.createDeal.useMutation({
    onSuccess: () => { toast.success("Deal created"); setShowCreate(false); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });
  const updateMutation = trpc.crm.updateDeal.useMutation({
    onSuccess: () => { toast.success("Deal updated"); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });
  const deleteMutation = trpc.crm.deleteDeal.useMutation({
    onSuccess: () => { toast.success("Deal deleted"); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });

  const STAGE_COLORS: Record<string, string> = {
    lead: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
    qualified: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    proposal: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    negotiation: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    closed_won: "bg-green-500/20 text-green-300 border-green-500/30",
    closed_lost: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Deals ({deals?.length ?? 0})</h2>
        <Button onClick={() => setShowCreate(!showCreate)} size="sm" className="bg-[oklch(0.85_0.23_110)] text-black font-bold">
          <Plus className="w-4 h-4 mr-1" /> New Deal
        </Button>
      </div>
      {showCreate && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="pt-4 pb-4 space-y-3">
            <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Deal title *" className="bg-zinc-700 border-zinc-600 text-white" />
            <div className="grid grid-cols-3 gap-2">
              <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value as typeof form.stage }))} className="bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2 text-sm">
                {["lead","qualified","proposal","negotiation","closed_won","closed_lost"].map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
              <Input value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} placeholder="Value ($)" className="bg-zinc-700 border-zinc-600 text-white" type="number" />
              <Input type="date" value={form.expectedCloseDate} onChange={e => setForm(p => ({ ...p, expectedCloseDate: e.target.value }))} className="bg-zinc-700 border-zinc-600 text-white" />
            </div>
            <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Notes" className="bg-zinc-700 border-zinc-600 text-white" rows={2} />
            <Button onClick={() => form.title.trim() && createMutation.mutate({ ...form, value: form.value ? parseFloat(form.value) : undefined })} disabled={createMutation.isPending} className="w-full bg-[oklch(0.85_0.23_110)] text-black font-bold">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Create Deal
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="space-y-3">
        {deals?.map(deal => (
          <Card key={deal.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white text-sm">{deal.title}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-semibold ${STAGE_COLORS[deal.stage ?? "lead"]}`}>
                      {deal.stage?.replace("_", " ")}
                    </span>
                  </div>
                  {deal.value && <p className="text-sm font-bold text-[oklch(0.85_0.23_110)]">${deal.value.toLocaleString()}</p>}
                  {deal.notes && <p className="text-xs text-zinc-400 mt-1">{deal.notes}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    value={deal.stage ?? "lead"}
                    onChange={e => updateMutation.mutate({ id: deal.id, stage: e.target.value as Parameters<typeof updateMutation.mutate>[0]["stage"] })}
                    className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1"
                  >
                    {["lead","qualified","proposal","negotiation","closed_won","closed_lost"].map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate({ id: deal.id })} className="text-red-400 hover:text-red-300 h-7 w-7 p-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Contracts Tab ────────────────────────────────────────────────────────────
function ContractsTab() {
  const [, navigate] = useLocation();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ contractType: "client" as const, clientName: "", clientEmail: "", contractorRole: "", eventDate: "", eventCity: "", amount: "" });

  const { data: contracts, isLoading, refetch } = trpc.crm.listContracts.useQuery();
  const { data: fullContracts } = trpc.contract.getAllContracts.useQuery();
  const createMutation = trpc.crm.createContract.useMutation({
    onSuccess: (d) => { toast.success(`Contract created — Signing token: ${d.signingToken}`); setShowCreate(false); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });
  const updateMutation = trpc.crm.updateContractStatus.useMutation({
    onSuccess: () => { toast.success("Contract updated"); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Contracts ({(contracts?.length ?? 0) + (fullContracts?.length ?? 0)})</h2>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/admin/contracts/new")} size="sm" className="bg-white text-black font-bold hover:bg-white/90">
            <FileText className="w-4 h-4 mr-1" /> Full Contract Form
          </Button>
          <Button onClick={() => setShowCreate(!showCreate)} size="sm" className="bg-[oklch(0.85_0.23_110)] text-black font-bold">
            <Plus className="w-4 h-4 mr-1" /> Quick Contract
          </Button>
        </div>
      </div>
      {/* Full contractor contracts from the contract system */}
      {fullContracts && fullContracts.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Contractor Agreements</p>
          {fullContracts.map(c => (
            <Card key={c.id} className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-3 pb-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white text-sm">{c.contractorName}</h3>
                      <span className="text-xs text-zinc-500">{c.contractorRole}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-zinc-500 mt-0.5">
                      {c.projectName && <span>{c.projectName}</span>}
                      {c.totalFee && <span className="font-semibold text-[oklch(0.85_0.23_110)]">${c.totalFee}</span>}
                      {c.contractorEmail && <span>{c.contractorEmail}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.status === "signed" ? "bg-green-500/20 text-green-300" :
                      c.status === "draft" ? "bg-zinc-700 text-zinc-400" :
                      "bg-yellow-500/20 text-yellow-300"
                    }`}>{c.status}</span>
                    {c.token && (
                      <Button size="sm" variant="ghost" className="text-xs text-zinc-400 hover:text-white h-7 px-2"
                        onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/vendor/sign/${c.token}`); toast.success("Signing link copied!"); }}>
                        <Copy className="w-3 h-3 mr-1" /> Link
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {showCreate && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="flex gap-2">
              {["client","contractor"].map(t => (
                <button key={t} onClick={() => setForm(p => ({ ...p, contractType: t as typeof form.contractType }))}
                  className={`flex-1 py-2 rounded text-sm font-semibold capitalize transition-colors ${form.contractType === t ? "bg-[oklch(0.85_0.23_110)] text-black" : "bg-zinc-700 text-zinc-400"}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} placeholder={form.contractType === "client" ? "Client Name" : "Contractor Name"} className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.clientEmail} onChange={e => setForm(p => ({ ...p, clientEmail: e.target.value }))} placeholder="Email" className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.eventDate} onChange={e => setForm(p => ({ ...p, eventDate: e.target.value }))} placeholder="Event Date" className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.eventCity} onChange={e => setForm(p => ({ ...p, eventCity: e.target.value }))} placeholder="Event City" className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.contractorRole} onChange={e => setForm(p => ({ ...p, contractorRole: e.target.value }))} placeholder="Role / Service" className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="Amount ($)" type="number" className="bg-zinc-700 border-zinc-600 text-white" />
            </div>
            <Button onClick={() => form.clientName.trim() && createMutation.mutate({ ...form, amount: form.amount ? parseFloat(form.amount) : undefined })} disabled={createMutation.isPending} className="w-full bg-[oklch(0.85_0.23_110)] text-black font-bold">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Create Contract
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="space-y-3">
        {contracts?.map((c: any) => (
          <Card key={c.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white text-sm">{c.clientName ?? "Unnamed"}</h3>
                    <span className="text-xs text-zinc-500 capitalize">{c.contractType}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                    {c.eventDate && <span>{c.eventDate}</span>}
                    {c.eventCity && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.eventCity}</span>}
                    {c.amount && <span className="font-semibold text-[oklch(0.85_0.23_110)]">${c.amount.toLocaleString()}</span>}
                  </div>
                </div>
                <select
                  value={c.status}
                  onChange={e => updateMutation.mutate({ id: c.id, status: e.target.value as Parameters<typeof updateMutation.mutate>[0]["status"] })}
                  className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1 flex-shrink-0"
                >
                  {["draft","sent","signed","completed","cancelled","expired"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Main Admin CRM ───────────────────────────────────────────────────────────
export default function AdminCRM() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) return (
    <AdminLayout title="Business CRM">
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin" style={{ color: TW.indigo }} />
      </div>
    </AdminLayout>
  );

  if (!user || user.role !== "admin") return (
    <AdminLayout title="Business CRM">
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Shield size={40} style={{ color: TW.coral }} className="mx-auto" />
          <h2 className="text-lg font-bold" style={{ color: TW.textPrimary }}>Admin Access Required</h2>
          <p className="text-sm" style={{ color: TW.textSecondary }}>You need admin privileges to access the CRM.</p>
          <Link href="/admin"><Button variant="outline">Go to Admin Panel</Button></Link>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Business CRM" subtitle="Dealers, Vendors, Contacts & Contracts">
      {/* Tab bar */}
      <div className="mb-6 overflow-x-auto" style={{ borderBottom: `1px solid ${TW.border}` }}>
        <div className="flex gap-0 min-w-max">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap"
                style={{
                  borderBottomColor: activeTab === tab.id ? TW.indigo : "transparent",
                  color: activeTab === tab.id ? TW.indigo : TW.textMuted,
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "dealers" && <DealersTab />}
        {activeTab === "vendors" && <VendorsTab />}
        {activeTab === "contacts" && <ContactsTab />}
        {activeTab === "deals" && <DealsTab />}
        {activeTab === "tasks" && <TasksTab />}
        {activeTab === "incidents" && <IncidentsTab />}
        {activeTab === "contracts" && <ContractsTab />}
        {activeTab === "interactions" && <AdminCRMModule />}
      </div>
    </AdminLayout>
  );
}
