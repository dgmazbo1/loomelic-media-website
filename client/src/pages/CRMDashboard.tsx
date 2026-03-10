/* ============================================================
   CRM Dashboard — /crm
   Full dealer CRM with:
   • Dealer contact cards with lead temp tags & quick notes
   • Day tab filters (Today / 7 Days / 30 Days / All)
   • Pipeline view (Kanban-style deal stages)
   • Proposals section (create / list / track)
   • Interactions timeline
   Black/white/yellow Loomelic brand aesthetic
   ============================================================ */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { LOGO_TRANSPARENT } from "@/lib/media";
import {
  Users, BarChart3, FileText, MessageSquare, Phone, Mail, Calendar,
  Plus, Search, Filter, ChevronRight, ArrowLeft, Flame, Thermometer,
  Snowflake, Clock, DollarSign, TrendingUp, Eye, CheckCircle, XCircle,
  Send, Edit2, Trash2, X, Building2, StickyNote, Activity,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Types ───────────────────────────────────────────────── */
type Tab = "contacts" | "pipeline" | "proposals" | "interactions";
type DayFilter = "today" | "7d" | "30d" | "all";
type LeadTemp = "hot" | "warm" | "cold";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "contacts", label: "Contacts", icon: <Users size={16} /> },
  { key: "pipeline", label: "Pipeline", icon: <BarChart3 size={16} /> },
  { key: "proposals", label: "Proposals", icon: <FileText size={16} /> },
  { key: "interactions", label: "Activity", icon: <MessageSquare size={16} /> },
];

const DAY_FILTERS: { key: DayFilter; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "all", label: "All" },
];

const PIPELINE_STAGES = [
  { key: "lead", label: "Lead", color: "bg-blue-500" },
  { key: "qualified", label: "Qualified", color: "bg-cyan-500" },
  { key: "proposal", label: "Proposal", color: "bg-yellow-500" },
  { key: "negotiation", label: "Negotiation", color: "bg-orange-500" },
  { key: "closed_won", label: "Won", color: "bg-green-500" },
  { key: "closed_lost", label: "Lost", color: "bg-red-500" },
];

const LEAD_TEMP_CONFIG: Record<LeadTemp, { icon: React.ReactNode; label: string; bg: string; text: string; border: string }> = {
  hot: { icon: <Flame size={12} />, label: "Hot", bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" },
  warm: { icon: <Thermometer size={12} />, label: "Warm", bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/30" },
  cold: { icon: <Snowflake size={12} />, label: "Cold", bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30" },
};

const PROPOSAL_STATUS_COLORS: Record<string, string> = {
  draft: "bg-white/10 text-white/60",
  sent: "bg-blue-500/15 text-blue-400",
  viewed: "bg-yellow-500/15 text-yellow-400",
  accepted: "bg-green-500/15 text-green-400",
  declined: "bg-red-500/15 text-red-400",
  expired: "bg-white/5 text-white/30",
};

/* ─── Helpers ─────────────────────────────────────────────── */
function isWithinDays(dateStr: string | Date | null | undefined, days: number): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= days;
}

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "$0";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}

function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return "Never";
  const d = new Date(dateStr);
  const now = new Date();
  const mins = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function CRMDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("contacts");
  const [dayFilter, setDayFilter] = useState<DayFilter>("all");
  const [search, setSearch] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [showAddProposal, setShowAddProposal] = useState(false);

  // Data queries
  const contacts = trpc.crm.listContacts.useQuery();
  const deals = trpc.crm.listDeals.useQuery();
  const proposals = trpc.crm.listProposals.useQuery();
  const interactions = trpc.crm.listInteractions.useQuery({});
  const stats = trpc.crm.getStats.useQuery();

  // Mutations
  const utils = trpc.useUtils();
  const createContact = trpc.crm.createContact.useMutation({ onSuccess: () => { utils.crm.listContacts.invalidate(); setShowAddContact(false); toast.success("Contact created"); } });
  const updateLeadTemp = trpc.crm.updateContactLeadTemp.useMutation({ onSuccess: () => utils.crm.listContacts.invalidate() });
  const updateQuickNotes = trpc.crm.updateContactQuickNotes.useMutation({ onSuccess: () => utils.crm.listContacts.invalidate() });
  const createDeal = trpc.crm.createDeal.useMutation({ onSuccess: () => { utils.crm.listDeals.invalidate(); setShowAddDeal(false); toast.success("Deal created"); } });
  const updateDeal = trpc.crm.updateDeal.useMutation({ onSuccess: () => utils.crm.listDeals.invalidate() });
  const createProposal = trpc.crm.createProposal.useMutation({ onSuccess: () => { utils.crm.listProposals.invalidate(); setShowAddProposal(false); toast.success("Proposal created"); } });
  const updateProposal = trpc.crm.updateProposal.useMutation({ onSuccess: () => utils.crm.listProposals.invalidate() });
  const deleteProposal = trpc.crm.deleteProposal.useMutation({ onSuccess: () => { utils.crm.listProposals.invalidate(); toast.success("Proposal deleted"); } });

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    let list = contacts.data ?? [];
    // Day filter
    if (dayFilter === "today") list = list.filter(c => isWithinDays(c.lastContactedAt, 1) || isWithinDays(c.createdAt, 1));
    else if (dayFilter === "7d") list = list.filter(c => isWithinDays(c.lastContactedAt, 7) || isWithinDays(c.createdAt, 7));
    else if (dayFilter === "30d") list = list.filter(c => isWithinDays(c.lastContactedAt, 30) || isWithinDays(c.createdAt, 30));
    // Search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [contacts.data, dayFilter, search]);

  // Stats summary
  const summaryStats = useMemo(() => {
    const s = stats.data;
    const totalPipelineValue = (deals.data ?? [])
      .filter(d => d.stage !== "closed_won" && d.stage !== "closed_lost")
      .reduce((sum, d) => sum + (d.value ?? 0), 0);
    const hotLeads = (contacts.data ?? []).filter(c => c.leadTemp === "hot").length;
    return {
      totalContacts: s?.totalContacts ?? 0,
      activeDeals: s?.activeDeals ?? 0,
      totalPipelineValue,
      hotLeads,
      proposalsSent: (proposals.data ?? []).filter(p => p.status !== "draft").length,
    };
  }, [stats.data, deals.data, contacts.data, proposals.data]);

  return (
    <div className="min-h-screen bg-[oklch(0.05_0_0)]">
      {/* ─── Top Bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[oklch(0.07_0_0)]/95 backdrop-blur-md border-b border-white/8">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </button>
            <div className="overflow-hidden h-10">
              <img src={LOGO_TRANSPARENT} alt="Loomelic" className="w-[100px] h-auto" style={{ filter: "brightness(0) invert(1)", marginTop: "-62px" }} />
            </div>
            <div className="hidden sm:block h-6 w-px bg-white/10" />
            <h1 className="hidden sm:block text-sm font-bold tracking-[0.15em] text-white/80 uppercase">Dealer CRM</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-40 sm:w-56 pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="px-3 py-2 rounded-lg text-xs font-bold tracking-wider text-white/50 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
            >
              ADMIN
            </button>
          </div>
        </div>
      </header>

      {/* ─── Summary Cards ───────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Total Contacts", value: summaryStats.totalContacts, icon: <Users size={18} />, accent: "text-white" },
            { label: "Active Deals", value: summaryStats.activeDeals, icon: <TrendingUp size={18} />, accent: "text-yellow-400" },
            { label: "Pipeline Value", value: formatCurrency(summaryStats.totalPipelineValue), icon: <DollarSign size={18} />, accent: "text-green-400" },
            { label: "Hot Leads", value: summaryStats.hotLeads, icon: <Flame size={18} />, accent: "text-red-400" },
            { label: "Proposals Sent", value: summaryStats.proposalsSent, icon: <Send size={18} />, accent: "text-blue-400" },
          ].map((card) => (
            <div key={card.label} className="bg-[oklch(0.09_0_0)] border border-white/8 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/40 text-xs font-semibold tracking-wider uppercase">{card.label}</span>
                <span className={card.accent}>{card.icon}</span>
              </div>
              <p className={`text-2xl font-bold ${card.accent}`}>{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Tab Navigation + Day Filters ────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[oklch(0.09_0_0)] border border-white/8 rounded-xl p-1">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${
                  activeTab === tab.key
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Day filters + Add button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[oklch(0.09_0_0)] border border-white/8 rounded-lg p-1">
              {DAY_FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setDayFilter(f.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    dayFilter === f.key ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (activeTab === "contacts") setShowAddContact(true);
                else if (activeTab === "pipeline") setShowAddDeal(true);
                else if (activeTab === "proposals") setShowAddProposal(true);
                else toast.info("Use the contact card to log interactions");
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-yellow-500 text-black text-xs font-bold tracking-wider hover:bg-yellow-400 transition-colors"
            >
              <Plus size={14} />
              ADD
            </button>
          </div>
        </div>
      </div>

      {/* ─── Tab Content ─────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        {activeTab === "contacts" && (
          <ContactsGrid
            contacts={filteredContacts}
            onUpdateLeadTemp={(id, temp) => updateLeadTemp.mutate({ id, leadTemp: temp })}
            onUpdateQuickNotes={(id, notes) => updateQuickNotes.mutate({ id, quickNotes: notes })}
            interactions={interactions.data ?? []}
          />
        )}
        {activeTab === "pipeline" && (
          <PipelineView
            deals={deals.data ?? []}
            contacts={contacts.data ?? []}
            onUpdateStage={(id, stage) => updateDeal.mutate({ id, stage: stage as "lead" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost" })}
          />
        )}
        {activeTab === "proposals" && (
          <ProposalsView
            proposals={proposals.data ?? []}
            contacts={contacts.data ?? []}
            onUpdateStatus={(id, status) => updateProposal.mutate({ id, status: status as "draft" | "sent" | "viewed" | "accepted" | "declined" | "expired" })}
            onDelete={(id) => deleteProposal.mutate({ id })}
          />
        )}
        {activeTab === "interactions" && (
          <InteractionsTimeline interactions={interactions.data ?? []} contacts={contacts.data ?? []} />
        )}
      </div>

      {/* ─── Modals ──────────────────────────────────────────── */}
      {showAddContact && <AddContactModal onClose={() => setShowAddContact(false)} onSubmit={(data) => createContact.mutate(data)} loading={createContact.isPending} contacts={contacts.data ?? []} />}
      {showAddDeal && <AddDealModal onClose={() => setShowAddDeal(false)} onSubmit={(data) => createDeal.mutate(data)} loading={createDeal.isPending} contacts={contacts.data ?? []} />}
      {showAddProposal && <AddProposalModal onClose={() => setShowAddProposal(false)} onSubmit={(data) => createProposal.mutate(data)} loading={createProposal.isPending} contacts={contacts.data ?? []} deals={deals.data ?? []} />}
    </div>
  );
}

/* ============================================================
   CONTACTS GRID — Dealer Cards with Lead Temp + Quick Notes
   ============================================================ */
function ContactsGrid({ contacts, onUpdateLeadTemp, onUpdateQuickNotes, interactions }: {
  contacts: any[];
  onUpdateLeadTemp: (id: number, temp: LeadTemp) => void;
  onUpdateQuickNotes: (id: number, notes: string) => void;
  interactions: any[];
}) {
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/30">
        <Users size={48} className="mb-4" />
        <p className="text-lg font-semibold">No contacts found</p>
        <p className="text-sm mt-1">Add your first dealer contact to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {contacts.map((c: any) => {
        const temp = (c.leadTemp as LeadTemp) || "warm";
        const tempConfig = LEAD_TEMP_CONFIG[temp];
        const contactInteractions = interactions.filter((i: any) => i.contactId === c.id);
        const lastInteraction = contactInteractions[0];

        return (
          <div key={c.id} className="group bg-[oklch(0.09_0_0)] border border-white/8 rounded-xl overflow-hidden hover:border-yellow-500/30 transition-all duration-300">
            {/* Card Header */}
            <div className="p-4 pb-3">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm truncate">{c.name}</h3>
                  {c.company && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Building2 size={11} className="text-white/30 flex-shrink-0" />
                      <span className="text-white/40 text-xs truncate">{c.company}</span>
                    </div>
                  )}
                </div>
                {/* Lead Temp Tag */}
                <div className="relative group/temp">
                  <button className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${tempConfig.bg} ${tempConfig.text} ${tempConfig.border} transition-all`}>
                    {tempConfig.icon}
                    {tempConfig.label}
                  </button>
                  {/* Temp Dropdown */}
                  <div className="absolute right-0 top-full mt-1 hidden group-hover/temp:flex flex-col bg-[oklch(0.12_0_0)] border border-white/10 rounded-lg overflow-hidden shadow-xl z-10">
                    {(["hot", "warm", "cold"] as LeadTemp[]).map(t => (
                      <button
                        key={t}
                        onClick={() => onUpdateLeadTemp(c.id, t)}
                        className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-white/5 transition-colors ${LEAD_TEMP_CONFIG[t].text}`}
                      >
                        {LEAD_TEMP_CONFIG[t].icon}
                        {LEAD_TEMP_CONFIG[t].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-1.5 mb-3">
                {c.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={11} className="text-white/25 flex-shrink-0" />
                    <span className="text-white/50 text-xs truncate">{c.email}</span>
                  </div>
                )}
                {c.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={11} className="text-white/25 flex-shrink-0" />
                    <span className="text-white/50 text-xs">{c.phone}</span>
                  </div>
                )}
              </div>

              {/* Status + Type badges */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/8 text-white/50 capitalize">
                  {c.contactType?.replace("_", " ")}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                  c.status === "active" ? "bg-green-500/15 text-green-400" :
                  c.status === "prospect" ? "bg-yellow-500/15 text-yellow-400" :
                  c.status === "inactive" ? "bg-white/5 text-white/30" :
                  "bg-red-500/15 text-red-400"
                }`}>
                  {c.status}
                </span>
              </div>

              {/* Last Activity */}
              <div className="flex items-center gap-1.5 text-white/25 text-[10px] mb-3">
                <Clock size={10} />
                <span>Last contact: {timeAgo(c.lastContactedAt || lastInteraction?.occurredAt)}</span>
              </div>
            </div>

            {/* Quick Notes */}
            <div className="px-4 pb-3 border-t border-white/5 pt-3">
              {editingNotes === c.id ? (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") { onUpdateQuickNotes(c.id, noteText); setEditingNotes(null); }
                      if (e.key === "Escape") setEditingNotes(null);
                    }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-md px-2 py-1 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-500/50"
                    placeholder="Quick note..."
                  />
                  <button onClick={() => { onUpdateQuickNotes(c.id, noteText); setEditingNotes(null); }} className="text-yellow-400 hover:text-yellow-300">
                    <CheckCircle size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setEditingNotes(c.id); setNoteText(c.quickNotes || ""); }}
                  className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors w-full text-left"
                >
                  <StickyNote size={11} />
                  <span className="text-xs truncate">{c.quickNotes || "Add quick note..."}</span>
                </button>
              )}
            </div>

            {/* Card Footer — Actions */}
            <div className="flex items-center border-t border-white/5">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-white/30 hover:text-yellow-400 hover:bg-yellow-500/5 transition-all text-[10px] font-semibold tracking-wider">
                <Phone size={11} />
                CALL
              </button>
              <div className="w-px h-6 bg-white/5" />
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-white/30 hover:text-yellow-400 hover:bg-yellow-500/5 transition-all text-[10px] font-semibold tracking-wider">
                <Mail size={11} />
                EMAIL
              </button>
              <div className="w-px h-6 bg-white/5" />
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-white/30 hover:text-yellow-400 hover:bg-yellow-500/5 transition-all text-[10px] font-semibold tracking-wider">
                <Calendar size={11} />
                MEET
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   PIPELINE VIEW — Kanban-style deal stages
   ============================================================ */
function PipelineView({ deals, contacts, onUpdateStage }: {
  deals: any[];
  contacts: any[];
  onUpdateStage: (id: number, stage: string) => void;
}) {
  const contactMap = useMemo(() => {
    const m: Record<number, any> = {};
    contacts.forEach(c => { m[c.id] = c; });
    return m;
  }, [contacts]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      {PIPELINE_STAGES.map(stage => {
        const stageDeals = deals.filter(d => d.stage === stage.key);
        const stageValue = stageDeals.reduce((sum, d) => sum + (d.value ?? 0), 0);

        return (
          <div key={stage.key} className="flex-shrink-0 w-72">
            {/* Stage Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                <span className="text-white/70 text-xs font-bold tracking-wider uppercase">{stage.label}</span>
                <span className="text-white/30 text-xs font-semibold">{stageDeals.length}</span>
              </div>
              <span className="text-white/30 text-xs font-semibold">{formatCurrency(stageValue)}</span>
            </div>

            {/* Deal Cards */}
            <div className="flex flex-col gap-2">
              {stageDeals.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded-xl py-8 flex items-center justify-center">
                  <span className="text-white/15 text-xs">No deals</span>
                </div>
              ) : (
                stageDeals.map(deal => {
                  const contact = deal.contactId ? contactMap[deal.contactId] : null;
                  const nextStageIdx = PIPELINE_STAGES.findIndex(s => s.key === deal.stage) + 1;
                  const nextStage = PIPELINE_STAGES[nextStageIdx];

                  return (
                    <div key={deal.id} className="bg-[oklch(0.09_0_0)] border border-white/8 rounded-xl p-3 hover:border-yellow-500/20 transition-all group">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white text-sm font-semibold truncate flex-1">{deal.title}</h4>
                        {deal.probability != null && (
                          <span className="text-white/30 text-[10px] font-bold ml-2">{deal.probability}%</span>
                        )}
                      </div>
                      {contact && (
                        <p className="text-white/40 text-xs mb-2 truncate">{contact.name}{contact.company ? ` · ${contact.company}` : ""}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-400 text-sm font-bold">{formatCurrency(deal.value)}</span>
                        {nextStage && (
                          <button
                            onClick={() => onUpdateStage(deal.id, nextStage.key)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold text-white/40 hover:text-yellow-400 hover:bg-yellow-500/10 border border-transparent hover:border-yellow-500/20 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <ChevronRight size={10} />
                            {nextStage.label}
                          </button>
                        )}
                      </div>
                      {/* Probability bar */}
                      {deal.probability != null && (
                        <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${stage.color}`}
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   PROPOSALS VIEW
   ============================================================ */
function ProposalsView({ proposals, contacts, onUpdateStatus, onDelete }: {
  proposals: any[];
  contacts: any[];
  onUpdateStatus: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}) {
  const contactMap = useMemo(() => {
    const m: Record<number, any> = {};
    contacts.forEach(c => { m[c.id] = c; });
    return m;
  }, [contacts]);

  if (proposals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/30">
        <FileText size={48} className="mb-4" />
        <p className="text-lg font-semibold">No proposals yet</p>
        <p className="text-sm mt-1">Create your first proposal to start tracking</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {proposals.map((p: any) => {
        const contact = p.contactId ? contactMap[p.contactId] : null;
        return (
          <div key={p.id} className="bg-[oklch(0.09_0_0)] border border-white/8 rounded-xl p-5 hover:border-yellow-500/20 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm">{p.title}</h3>
                {contact && <p className="text-white/40 text-xs mt-1">{contact.name}{contact.company ? ` · ${contact.company}` : ""}</p>}
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${PROPOSAL_STATUS_COLORS[p.status] || "bg-white/5 text-white/40"}`}>
                {p.status}
              </span>
            </div>

            {p.services && (
              <p className="text-white/30 text-xs mb-3 line-clamp-2">{p.services}</p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-yellow-400 text-lg font-bold">{formatCurrency(p.totalValue)}</span>
              <div className="flex items-center gap-2">
                {p.status === "draft" && (
                  <button onClick={() => onUpdateStatus(p.id, "sent")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500/15 text-yellow-400 text-xs font-bold hover:bg-yellow-500/25 transition-colors">
                    <Send size={11} /> Send
                  </button>
                )}
                {p.status === "sent" && (
                  <button onClick={() => onUpdateStatus(p.id, "viewed")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 text-xs font-bold hover:bg-blue-500/25 transition-colors">
                    <Eye size={11} /> Mark Viewed
                  </button>
                )}
                {p.status === "viewed" && (
                  <>
                    <button onClick={() => onUpdateStatus(p.id, "accepted")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 text-xs font-bold hover:bg-green-500/25 transition-colors">
                      <CheckCircle size={11} /> Accept
                    </button>
                    <button onClick={() => onUpdateStatus(p.id, "declined")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-bold hover:bg-red-500/25 transition-colors">
                      <XCircle size={11} /> Decline
                    </button>
                  </>
                )}
                <button onClick={() => onDelete(p.id)} className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 text-[10px] text-white/25">
              <span>Created {timeAgo(p.createdAt)}</span>
              {p.sentAt && <span>Sent {timeAgo(p.sentAt)}</span>}
              {p.viewedAt && <span>Viewed {timeAgo(p.viewedAt)}</span>}
              {p.signedAt && <span>Signed {timeAgo(p.signedAt)}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   INTERACTIONS TIMELINE
   ============================================================ */
function InteractionsTimeline({ interactions, contacts }: { interactions: any[]; contacts: any[] }) {
  const contactMap = useMemo(() => {
    const m: Record<number, any> = {};
    contacts.forEach(c => { m[c.id] = c; });
    return m;
  }, [contacts]);

  const typeIcons: Record<string, React.ReactNode> = {
    call: <Phone size={14} />,
    email: <Mail size={14} />,
    meeting: <Calendar size={14} />,
    note: <StickyNote size={14} />,
    demo: <Eye size={14} />,
    follow_up: <Activity size={14} />,
  };

  const outcomeColors: Record<string, string> = {
    positive: "text-green-400",
    neutral: "text-white/40",
    negative: "text-red-400",
    no_answer: "text-yellow-400",
  };

  if (interactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/30">
        <MessageSquare size={48} className="mb-4" />
        <p className="text-lg font-semibold">No activity yet</p>
        <p className="text-sm mt-1">Interactions will appear here as you log them</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {interactions.map((i: any) => {
        const contact = contactMap[i.contactId];
        return (
          <div key={i.id} className="flex gap-4 bg-[oklch(0.09_0_0)] border border-white/8 rounded-xl p-4 hover:border-white/15 transition-all">
            <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
              i.type === "call" ? "bg-green-500/15 text-green-400" :
              i.type === "email" ? "bg-blue-500/15 text-blue-400" :
              i.type === "meeting" ? "bg-purple-500/15 text-purple-400" :
              "bg-white/5 text-white/40"
            }`}>
              {typeIcons[i.type] || <Activity size={14} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white text-sm font-semibold">{i.subject}</span>
                <span className={`text-[10px] font-bold uppercase ${outcomeColors[i.outcome] || "text-white/30"}`}>
                  {i.outcome?.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/30">
                {contact && <span>{contact.name}</span>}
                <span>{i.direction}</span>
                {i.durationMinutes && <span>{i.durationMinutes} min</span>}
                <span>{timeAgo(i.occurredAt)}</span>
              </div>
              {i.body && <p className="text-white/25 text-xs mt-2 line-clamp-2">{i.body}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   MODAL: Add Contact
   ============================================================ */
function AddContactModal({ onClose, onSubmit, loading, contacts }: {
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
  contacts: any[];
}) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", title: "",
    contactType: "lead" as const,
    status: "prospect" as const,
    leadTemp: "warm" as LeadTemp,
    notes: "",
  });

  return (
    <ModalShell title="Add Contact" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <ModalInput label="Name *" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} placeholder="John Smith" />
          <ModalInput label="Company" value={form.company} onChange={v => setForm(p => ({ ...p, company: v }))} placeholder="Findlay Nissan" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ModalInput label="Email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} placeholder="john@dealer.com" type="email" />
          <ModalInput label="Phone" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} placeholder="(702) 555-0100" />
        </div>
        <ModalInput label="Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="Marketing Director" />
        <div className="grid grid-cols-3 gap-3">
          <ModalSelect label="Type" value={form.contactType} onChange={v => setForm(p => ({ ...p, contactType: v as any }))} options={[
            { value: "lead", label: "Lead" }, { value: "client", label: "Client" }, { value: "partner", label: "Partner" }, { value: "vendor", label: "Vendor" }, { value: "other", label: "Other" },
          ]} />
          <ModalSelect label="Status" value={form.status} onChange={v => setForm(p => ({ ...p, status: v as any }))} options={[
            { value: "prospect", label: "Prospect" }, { value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "churned", label: "Churned" },
          ]} />
          <ModalSelect label="Lead Temp" value={form.leadTemp} onChange={v => setForm(p => ({ ...p, leadTemp: v as LeadTemp }))} options={[
            { value: "hot", label: "🔥 Hot" }, { value: "warm", label: "🌡️ Warm" }, { value: "cold", label: "❄️ Cold" },
          ]} />
        </div>
        <ModalTextarea label="Notes" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} placeholder="Additional notes..." />
        <button
          onClick={() => onSubmit(form)}
          disabled={!form.name || loading}
          className="w-full py-3 rounded-xl bg-yellow-500 text-black font-bold text-sm tracking-wider hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Creating..." : "CREATE CONTACT"}
        </button>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   MODAL: Add Deal
   ============================================================ */
function AddDealModal({ onClose, onSubmit, loading, contacts }: {
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
  contacts: any[];
}) {
  const [form, setForm] = useState({
    title: "", contactId: undefined as number | undefined, value: "",
    stage: "lead" as const, probability: "50", notes: "", expectedCloseDate: "",
  });

  return (
    <ModalShell title="Add Deal" onClose={onClose}>
      <div className="space-y-4">
        <ModalInput label="Deal Title *" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="Findlay Nissan — Monthly Package" />
        <ModalSelect label="Contact" value={String(form.contactId ?? "")} onChange={v => setForm(p => ({ ...p, contactId: v ? Number(v) : undefined }))} options={[
          { value: "", label: "Select contact..." },
          ...contacts.map(c => ({ value: String(c.id), label: `${c.name}${c.company ? ` (${c.company})` : ""}` })),
        ]} />
        <div className="grid grid-cols-3 gap-3">
          <ModalInput label="Value ($)" value={form.value} onChange={v => setForm(p => ({ ...p, value: v }))} placeholder="5000" type="number" />
          <ModalInput label="Probability (%)" value={form.probability} onChange={v => setForm(p => ({ ...p, probability: v }))} placeholder="50" type="number" />
          <ModalSelect label="Stage" value={form.stage} onChange={v => setForm(p => ({ ...p, stage: v as any }))} options={PIPELINE_STAGES.map(s => ({ value: s.key, label: s.label }))} />
        </div>
        <ModalInput label="Expected Close" value={form.expectedCloseDate} onChange={v => setForm(p => ({ ...p, expectedCloseDate: v }))} type="date" />
        <ModalTextarea label="Notes" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} placeholder="Deal notes..." />
        <button
          onClick={() => onSubmit({ ...form, value: form.value ? Number(form.value) : undefined, probability: form.probability ? Number(form.probability) : 50 })}
          disabled={!form.title || loading}
          className="w-full py-3 rounded-xl bg-yellow-500 text-black font-bold text-sm tracking-wider hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Creating..." : "CREATE DEAL"}
        </button>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   MODAL: Add Proposal
   ============================================================ */
function AddProposalModal({ onClose, onSubmit, loading, contacts, deals }: {
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
  contacts: any[];
  deals: any[];
}) {
  const [form, setForm] = useState({
    title: "", contactId: undefined as number | undefined, dealId: undefined as number | undefined,
    services: "", totalValue: "", validUntil: "", notes: "",
  });

  return (
    <ModalShell title="Create Proposal" onClose={onClose}>
      <div className="space-y-4">
        <ModalInput label="Proposal Title *" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="Monthly Content Package — Findlay Nissan" />
        <div className="grid grid-cols-2 gap-3">
          <ModalSelect label="Contact" value={String(form.contactId ?? "")} onChange={v => setForm(p => ({ ...p, contactId: v ? Number(v) : undefined }))} options={[
            { value: "", label: "Select contact..." },
            ...contacts.map(c => ({ value: String(c.id), label: `${c.name}${c.company ? ` (${c.company})` : ""}` })),
          ]} />
          <ModalSelect label="Deal" value={String(form.dealId ?? "")} onChange={v => setForm(p => ({ ...p, dealId: v ? Number(v) : undefined }))} options={[
            { value: "", label: "Select deal..." },
            ...deals.map(d => ({ value: String(d.id), label: d.title })),
          ]} />
        </div>
        <ModalTextarea label="Services" value={form.services} onChange={v => setForm(p => ({ ...p, services: v }))} placeholder="Inventory photography (200 units/mo), Short-form reels (8/mo), Walkaround videos (4/mo)" rows={3} />
        <div className="grid grid-cols-2 gap-3">
          <ModalInput label="Total Value ($)" value={form.totalValue} onChange={v => setForm(p => ({ ...p, totalValue: v }))} placeholder="5000" type="number" />
          <ModalInput label="Valid Until" value={form.validUntil} onChange={v => setForm(p => ({ ...p, validUntil: v }))} type="date" />
        </div>
        <ModalTextarea label="Notes" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} placeholder="Additional proposal notes..." />
        <button
          onClick={() => onSubmit({ ...form, totalValue: form.totalValue ? Number(form.totalValue) : undefined })}
          disabled={!form.title || loading}
          className="w-full py-3 rounded-xl bg-yellow-500 text-black font-bold text-sm tracking-wider hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Creating..." : "CREATE PROPOSAL"}
        </button>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   SHARED MODAL COMPONENTS
   ============================================================ */
function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[oklch(0.09_0_0)] border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <h2 className="text-white font-bold text-lg tracking-wide">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ModalInput({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-white/40 text-xs font-semibold tracking-wider uppercase mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50 transition-colors"
      />
    </div>
  );
}

function ModalSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-white/40 text-xs font-semibold tracking-wider uppercase mb-1.5">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-colors appearance-none"
      >
        {options.map(o => <option key={o.value} value={o.value} className="bg-[oklch(0.1_0_0)]">{o.label}</option>)}
      </select>
    </div>
  );
}

function ModalTextarea({ label, value, onChange, placeholder, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-white/40 text-xs font-semibold tracking-wider uppercase mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
      />
    </div>
  );
}
