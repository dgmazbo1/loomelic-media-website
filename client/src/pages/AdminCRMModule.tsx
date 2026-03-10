/**
 * AdminCRMModule — Full Dealer CRM embedded in the main admin panel
 * Tabs: Contacts | Deals (Kanban) | Interactions
 * Design: dark zinc palette matching the existing admin panel
 */
import React, { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus, Loader2, Trash2, Phone, Mail, Building2, User, ChevronRight,
  MessageSquare, PhoneCall, Video, FileText, ArrowRight, DollarSign,
  TrendingUp, X, Check, ChevronDown, ChevronUp, Calendar, Clock,
  Users, Briefcase, Activity, ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";

// ─── Color helpers ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  prospect: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  active: "bg-green-500/20 text-green-300 border border-green-500/30",
  inactive: "bg-zinc-600/40 text-zinc-400 border border-zinc-600/30",
  churned: "bg-red-500/20 text-red-300 border border-red-500/30",
};

const TYPE_COLORS: Record<string, string> = {
  lead: "bg-yellow-500/20 text-yellow-300",
  client: "bg-green-500/20 text-green-300",
  partner: "bg-purple-500/20 text-purple-300",
  vendor: "bg-blue-500/20 text-blue-300",
  other: "bg-zinc-600/40 text-zinc-400",
};

const INTERACTION_ICONS: Record<string, React.ReactNode> = {
  call: <PhoneCall className="w-3.5 h-3.5" />,
  email: <Mail className="w-3.5 h-3.5" />,
  meeting: <Video className="w-3.5 h-3.5" />,
  note: <FileText className="w-3.5 h-3.5" />,
  demo: <Activity className="w-3.5 h-3.5" />,
  follow_up: <ArrowRight className="w-3.5 h-3.5" />,
};

const OUTCOME_COLORS: Record<string, string> = {
  positive: "text-green-400",
  neutral: "text-zinc-400",
  negative: "text-red-400",
  no_answer: "text-yellow-400",
};

const STAGE_CONFIG = [
  { key: "lead", label: "Lead", color: "border-zinc-600", accent: "bg-zinc-600" },
  { key: "qualified", label: "Qualified", color: "border-blue-500/60", accent: "bg-blue-500/60" },
  { key: "proposal", label: "Proposal", color: "border-purple-500/60", accent: "bg-purple-500/60" },
  { key: "negotiation", label: "Negotiation", color: "border-yellow-500/60", accent: "bg-yellow-500/60" },
  { key: "closed_won", label: "Closed Won", color: "border-green-500/60", accent: "bg-green-500/60" },
  { key: "closed_lost", label: "Closed Lost", color: "border-red-500/60", accent: "bg-red-500/60" },
] as const;

// ─── Contacts Tab ─────────────────────────────────────────────────────────────

function ContactsTab({ onSelectContact }: { onSelectContact: (id: number, name: string) => void }) {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", title: "",
    contactType: "lead" as const, status: "prospect" as const, notes: "",
  });

  const { data: contacts, isLoading, refetch } = trpc.crm.listContacts.useQuery();

  const createMutation = trpc.crm.createContact.useMutation({
    onSuccess: () => { toast.success("Contact created"); setShowCreate(false); resetForm(); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });

  const updateMutation = trpc.crm.updateContact.useMutation({
    onSuccess: () => { toast.success("Contact updated"); setEditId(null); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });

  const deleteMutation = trpc.crm.deleteContact.useMutation({
    onSuccess: () => { toast.success("Contact deleted"); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });

  const resetForm = () => setForm({ name: "", email: "", phone: "", company: "", title: "", contactType: "lead", status: "prospect", notes: "" });

  const filtered = useMemo(() =>
    (contacts ?? []).filter(c =>
      !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.company ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (c.email ?? "").toLowerCase().includes(search.toLowerCase())
    ), [contacts, search]);

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">Contacts</h2>
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{contacts?.length ?? 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search contacts..." className="bg-zinc-800 border-zinc-700 text-white text-sm w-48 h-8"
          />
          <Button onClick={() => { setShowCreate(!showCreate); resetForm(); }} size="sm"
            className="bg-[oklch(0.85_0.23_110)] text-black font-bold h-8 text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" /> New Contact
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {(["prospect", "active", "inactive", "churned"] as const).map(s => (
          <div key={s} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <div className="text-xs text-zinc-500 capitalize mb-1">{s}</div>
            <div className="text-xl font-bold text-white">
              {(contacts ?? []).filter(c => (c as any).status === s).length}
            </div>
          </div>
        ))}
      </div>

      {/* Create form */}
      {showCreate && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full Name *" className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Company" className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" type="email" className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Job Title" className="bg-zinc-700 border-zinc-600 text-white" />
              <div className="flex gap-2">
                <select value={form.contactType} onChange={e => setForm(p => ({ ...p, contactType: e.target.value as typeof form.contactType }))}
                  className="flex-1 bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2 text-sm">
                  {["lead", "client", "partner", "vendor", "other"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as typeof form.status }))}
                  className="flex-1 bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2 text-sm">
                  {["prospect", "active", "inactive", "churned"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Notes" className="bg-zinc-700 border-zinc-600 text-white" rows={2} />
            <div className="flex gap-2">
              <Button onClick={() => form.name.trim() && createMutation.mutate(form)} disabled={createMutation.isPending}
                className="flex-1 bg-[oklch(0.85_0.23_110)] text-black font-bold">
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Contact
              </Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)} className="text-zinc-400">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">{search ? "No contacts match your search" : "No contacts yet — add your first one"}</p>
          </div>
        )}
        {filtered.map(c => (
          <Card key={c.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
            <CardContent className="pt-3 pb-3">
              {editId === c.id ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input defaultValue={c.name} id={`edit-name-${c.id}`} placeholder="Name" className="bg-zinc-700 border-zinc-600 text-white text-sm" />
                    <Input defaultValue={c.company ?? ""} id={`edit-company-${c.id}`} placeholder="Company" className="bg-zinc-700 border-zinc-600 text-white text-sm" />
                    <Input defaultValue={c.email ?? ""} id={`edit-email-${c.id}`} placeholder="Email" className="bg-zinc-700 border-zinc-600 text-white text-sm" />
                    <Input defaultValue={c.phone ?? ""} id={`edit-phone-${c.id}`} placeholder="Phone" className="bg-zinc-700 border-zinc-600 text-white text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => {
                      const name = (document.getElementById(`edit-name-${c.id}`) as HTMLInputElement)?.value;
                      const company = (document.getElementById(`edit-company-${c.id}`) as HTMLInputElement)?.value;
                      const email = (document.getElementById(`edit-email-${c.id}`) as HTMLInputElement)?.value;
                      const phone = (document.getElementById(`edit-phone-${c.id}`) as HTMLInputElement)?.value;
                      updateMutation.mutate({ id: c.id, name, company, email, phone });
                    }} className="bg-[oklch(0.85_0.23_110)] text-black font-bold text-xs h-7">
                      <Check className="w-3 h-3 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditId(null)} className="text-zinc-400 text-xs h-7">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm">{c.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${TYPE_COLORS[c.contactType ?? "other"]}`}>{c.contactType}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${STATUS_COLORS[(c as any).status ?? "prospect"]}`}>{(c as any).status ?? "prospect"}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {c.company && <span className="text-xs text-zinc-500 flex items-center gap-1"><Building2 className="w-3 h-3" />{c.company}</span>}
                      {c.email && <span className="text-xs text-zinc-500 flex items-center gap-1"><Mail className="w-3 h-3" />{c.email}</span>}
                      {c.phone && <span className="text-xs text-zinc-500 flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</span>}
                      {c.title && <span className="text-xs text-zinc-500 flex items-center gap-1"><User className="w-3 h-3" />{c.title}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => onSelectContact(c.id, c.name)}
                      className="text-zinc-400 hover:text-[oklch(0.85_0.23_110)] h-7 px-2 text-xs">
                      <MessageSquare className="w-3.5 h-3.5 mr-1" /> Log
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditId(c.id)}
                      className="text-zinc-400 hover:text-white h-7 w-7 p-0">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate({ id: c.id })}
                      className="text-red-400 hover:text-red-300 h-7 w-7 p-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Deals Tab (Kanban Pipeline) ──────────────────────────────────────────────

function DealsTab() {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "", contactId: "", dealerId: "", stage: "lead" as const,
    value: "", probability: "50", notes: "", expectedCloseDate: "",
  });

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

  const dealsByStage = useMemo(() => {
    const map: Record<string, typeof deals> = {};
    STAGE_CONFIG.forEach(s => { map[s.key] = []; });
    (deals ?? []).forEach(d => { if (map[d.stage]) map[d.stage]!.push(d); });
    return map;
  }, [deals]);

  const totalValue = useMemo(() =>
    (deals ?? []).filter(d => d.stage === "closed_won").reduce((sum, d) => sum + (d.value ?? 0), 0), [deals]);

  const pipelineValue = useMemo(() =>
    (deals ?? []).filter(d => !["closed_won", "closed_lost"].includes(d.stage)).reduce((sum, d) => sum + (d.value ?? 0), 0), [deals]);

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">Deal Pipeline</h2>
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{deals?.length ?? 0} deals</span>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} size="sm"
          className="bg-[oklch(0.85_0.23_110)] text-black font-bold h-8 text-xs">
          <Plus className="w-3.5 h-3.5 mr-1" /> New Deal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
          <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Pipeline Value</div>
          <div className="text-xl font-bold text-white">${pipelineValue.toLocaleString()}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
          <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Closed Won</div>
          <div className="text-xl font-bold text-green-400">${totalValue.toLocaleString()}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
          <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Active Deals</div>
          <div className="text-xl font-bold text-white">
            {(deals ?? []).filter(d => !["closed_won", "closed_lost"].includes(d.stage)).length}
          </div>
        </div>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Deal Title *" className="bg-zinc-700 border-zinc-600 text-white col-span-2" />
              <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value as typeof form.stage }))}
                className="bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2 text-sm">
                {STAGE_CONFIG.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
              <Input value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} placeholder="Deal Value ($)" type="number" className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.probability} onChange={e => setForm(p => ({ ...p, probability: e.target.value }))} placeholder="Probability %" type="number" min="0" max="100" className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.expectedCloseDate} onChange={e => setForm(p => ({ ...p, expectedCloseDate: e.target.value }))} type="date" className="bg-zinc-700 border-zinc-600 text-white" />
            </div>
            <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Notes" className="bg-zinc-700 border-zinc-600 text-white" rows={2} />
            <div className="flex gap-2">
              <Button onClick={() => form.title.trim() && createMutation.mutate({
                title: form.title, stage: form.stage,
                value: form.value ? parseInt(form.value) : undefined,
                probability: form.probability ? parseInt(form.probability) : undefined,
                notes: form.notes || undefined, expectedCloseDate: form.expectedCloseDate || undefined,
              })} disabled={createMutation.isPending} className="flex-1 bg-[oklch(0.85_0.23_110)] text-black font-bold">
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Create Deal
              </Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)} className="text-zinc-400">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kanban board */}
      <div className="grid grid-cols-3 gap-3 xl:grid-cols-6">
        {STAGE_CONFIG.map(stage => (
          <div key={stage.key} className={`bg-zinc-900 border ${stage.color} rounded-lg p-3 min-h-[200px]`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${stage.accent}`} />
                <span className="text-xs font-semibold text-zinc-300">{stage.label}</span>
              </div>
              <span className="text-xs text-zinc-500">{dealsByStage[stage.key]?.length ?? 0}</span>
            </div>
            <div className="space-y-2">
              {(dealsByStage[stage.key] ?? []).map(deal => (
                <div key={deal.id} className="bg-zinc-800 rounded-md p-2.5 group">
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-xs font-medium text-white leading-tight">{deal.title}</p>
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate({ id: deal.id })}
                      className="opacity-0 group-hover:opacity-100 text-red-400 h-5 w-5 p-0 shrink-0">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  {deal.value && (
                    <p className="text-xs text-[oklch(0.85_0.23_110)] font-semibold mt-1">${deal.value.toLocaleString()}</p>
                  )}
                  {(deal as any).probability != null && (
                    <div className="mt-1.5">
                      <div className="flex justify-between text-[10px] text-zinc-500 mb-0.5">
                        <span>Probability</span>
                        <span>{(deal as any).probability}%</span>
                      </div>
                      <div className="h-1 bg-zinc-700 rounded-full overflow-hidden">
                        <div className="h-full bg-[oklch(0.85_0.23_110)] rounded-full" style={{ width: `${(deal as any).probability}%` }} />
                      </div>
                    </div>
                  )}
                  {/* Stage advance buttons */}
                  <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {STAGE_CONFIG.findIndex(s => s.key === deal.stage) < STAGE_CONFIG.length - 1 && (
                      <button onClick={() => {
                        const nextStage = STAGE_CONFIG[STAGE_CONFIG.findIndex(s => s.key === deal.stage) + 1].key;
                        updateMutation.mutate({ id: deal.id, stage: nextStage });
                      }} className="flex-1 text-[10px] bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded px-1.5 py-0.5 flex items-center justify-center gap-0.5">
                        <ArrowUpRight className="w-2.5 h-2.5" /> Advance
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {(dealsByStage[stage.key] ?? []).length === 0 && (
                <div className="text-center py-4 text-zinc-600 text-xs">Empty</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Interactions Tab ─────────────────────────────────────────────────────────

function InteractionsTab({ preselectedContactId, preselectedContactName }: {
  preselectedContactId?: number;
  preselectedContactName?: string;
}) {
  const [showCreate, setShowCreate] = useState(!!preselectedContactId);
  const [filterContactId, setFilterContactId] = useState<number | undefined>(preselectedContactId);
  const [form, setForm] = useState({
    contactId: preselectedContactId?.toString() ?? "",
    type: "call" as const,
    direction: "outbound" as const,
    subject: "",
    body: "",
    outcome: "neutral" as const,
    durationMinutes: "",
    loggedBy: "",
  });

  const { data: contacts } = trpc.crm.listContacts.useQuery();
  const { data: interactions, isLoading, refetch } = trpc.crm.listInteractions.useQuery({
    contactId: filterContactId,
  });

  const createMutation = trpc.crm.createInteraction.useMutation({
    onSuccess: () => { toast.success("Interaction logged"); setShowCreate(false); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });

  const deleteMutation = trpc.crm.deleteInteraction.useMutation({
    onSuccess: () => { toast.success("Interaction deleted"); refetch(); },
    onError: (e) => toast.error("Error: " + e.message),
  });

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">Interactions</h2>
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{interactions?.length ?? 0}</span>
          {preselectedContactName && (
            <span className="text-xs bg-[oklch(0.85_0.23_110)]/20 text-[oklch(0.85_0.23_110)] px-2 py-0.5 rounded-full">
              {preselectedContactName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!preselectedContactId && (
            <select value={filterContactId ?? ""} onChange={e => setFilterContactId(e.target.value ? parseInt(e.target.value) : undefined)}
              className="bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-1.5 text-xs">
              <option value="">All Contacts</option>
              {(contacts ?? []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <Button onClick={() => setShowCreate(!showCreate)} size="sm"
            className="bg-[oklch(0.85_0.23_110)] text-black font-bold h-8 text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" /> Log Interaction
          </Button>
        </div>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {!preselectedContactId && (
                <select value={form.contactId} onChange={e => setForm(p => ({ ...p, contactId: e.target.value }))}
                  className="bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2 text-sm col-span-2">
                  <option value="">Select Contact *</option>
                  {(contacts ?? []).map(c => <option key={c.id} value={c.id}>{c.name} {c.company ? `— ${c.company}` : ""}</option>)}
                </select>
              )}
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as typeof form.type }))}
                className="bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2 text-sm">
                {["call", "email", "meeting", "note", "demo", "follow_up"].map(t => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
              </select>
              <select value={form.direction} onChange={e => setForm(p => ({ ...p, direction: e.target.value as typeof form.direction }))}
                className="bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2 text-sm">
                <option value="outbound">Outbound</option>
                <option value="inbound">Inbound</option>
              </select>
              <Input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Subject *" className="bg-zinc-700 border-zinc-600 text-white col-span-2" />
              <select value={form.outcome} onChange={e => setForm(p => ({ ...p, outcome: e.target.value as typeof form.outcome }))}
                className="bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2 text-sm">
                {["positive", "neutral", "negative", "no_answer"].map(o => <option key={o} value={o}>{o.replace("_", " ")}</option>)}
              </select>
              <Input value={form.durationMinutes} onChange={e => setForm(p => ({ ...p, durationMinutes: e.target.value }))} placeholder="Duration (min)" type="number" className="bg-zinc-700 border-zinc-600 text-white" />
              <Input value={form.loggedBy} onChange={e => setForm(p => ({ ...p, loggedBy: e.target.value }))} placeholder="Logged by" className="bg-zinc-700 border-zinc-600 text-white col-span-2" />
            </div>
            <Textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} placeholder="Notes / Summary" className="bg-zinc-700 border-zinc-600 text-white" rows={3} />
            <div className="flex gap-2">
              <Button onClick={() => {
                const cid = preselectedContactId ?? (form.contactId ? parseInt(form.contactId) : undefined);
                if (!cid || !form.subject.trim()) { toast.error("Contact and subject are required"); return; }
                createMutation.mutate({
                  contactId: cid, type: form.type, direction: form.direction,
                  subject: form.subject, body: form.body || undefined, outcome: form.outcome,
                  durationMinutes: form.durationMinutes ? parseInt(form.durationMinutes) : undefined,
                  loggedBy: form.loggedBy || undefined,
                });
              }} disabled={createMutation.isPending} className="flex-1 bg-[oklch(0.85_0.23_110)] text-black font-bold">
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Log Interaction
              </Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)} className="text-zinc-400">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interaction timeline */}
      <div className="space-y-2">
        {(interactions ?? []).length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No interactions logged yet</p>
          </div>
        )}
        {(interactions ?? []).map(i => {
          const contact = (contacts ?? []).find(c => c.id === i.contactId);
          return (
            <Card key={i.id} className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                      {INTERACTION_ICONS[i.type] ?? <MessageSquare className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white text-sm">{i.subject}</span>
                        <span className="text-xs text-zinc-500 capitalize">{i.type.replace("_", " ")}</span>
                        <span className="text-xs text-zinc-600 capitalize">{i.direction}</span>
                        {i.outcome && <span className={`text-xs capitalize ${OUTCOME_COLORS[i.outcome]}`}>{i.outcome.replace("_", " ")}</span>}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1">
                        {contact && <span className="text-xs text-zinc-500 flex items-center gap-1"><User className="w-3 h-3" />{contact.name}</span>}
                        {i.durationMinutes && <span className="text-xs text-zinc-500 flex items-center gap-1"><Clock className="w-3 h-3" />{i.durationMinutes}m</span>}
                        {i.loggedBy && <span className="text-xs text-zinc-500">{i.loggedBy}</span>}
                        <span className="text-xs text-zinc-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />{new Date(i.occurredAt).toLocaleDateString()}
                        </span>
                      </div>
                      {i.body && <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{i.body}</p>}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate({ id: i.id })}
                    className="text-red-400 hover:text-red-300 h-7 w-7 p-0 shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main CRM Module ──────────────────────────────────────────────────────────

type CRMTab = "contacts" | "deals" | "interactions";

export default function AdminCRMModule() {
  const [activeTab, setActiveTab] = useState<CRMTab>("contacts");
  const [selectedContact, setSelectedContact] = useState<{ id: number; name: string } | null>(null);

  const handleSelectContact = (id: number, name: string) => {
    setSelectedContact({ id, name });
    setActiveTab("interactions");
  };

  const tabs: { key: CRMTab; label: string; icon: React.ReactNode }[] = [
    { key: "contacts", label: "Contacts", icon: <Users className="w-4 h-4" /> },
    { key: "deals", label: "Deals", icon: <TrendingUp className="w-4 h-4" /> },
    { key: "interactions", label: "Interactions", icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] text-white">
      {/* Page header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Dealer CRM</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Contacts · Deals Pipeline · Interaction Log</p>
          </div>
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); if (tab.key !== "interactions") setSelectedContact(null); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-[oklch(0.85_0.23_110)] text-black"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {activeTab === "contacts" && <ContactsTab onSelectContact={handleSelectContact} />}
        {activeTab === "deals" && <DealsTab />}
        {activeTab === "interactions" && (
          <InteractionsTab
            preselectedContactId={selectedContact?.id}
            preselectedContactName={selectedContact?.name}
          />
        )}
      </div>
    </div>
  );
}
