/* ============================================================
   CRM Proposals — /crm/proposals
   ORION-inspired: status pills, value display, action buttons
   ============================================================ */
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import {
  FileText, Plus, Send, Eye, CheckCircle, XCircle, Trash2, X, Clock,
} from "lucide-react";
import AdminLayout, { TW, TWCard } from "@/components/AdminLayout";
import { CRM_COLORS } from "@/components/CRMLayout";
import { toast } from "sonner";

/* ─── Status config ──────────────────────────────────────── */
type ProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "declined" | "expired";

const STATUS_CONFIG: Record<ProposalStatus, { label: string; bg: string; text: string }> = {
  draft:    { label: "Draft",    bg: "oklch(0.96 0.005 260)", text: "oklch(0.50 0.005 260)" },
  sent:     { label: "Sent",     bg: "oklch(0.95 0.04 250)",  text: "oklch(0.45 0.12 250)" },
  viewed:   { label: "Viewed",   bg: "oklch(0.96 0.06 60)",   text: "oklch(0.55 0.14 60)" },
  accepted: { label: "Accepted", bg: "oklch(0.95 0.06 145)",  text: "oklch(0.42 0.14 145)" },
  declined: { label: "Declined", bg: "oklch(0.96 0.04 25)",   text: "oklch(0.55 0.12 25)" },
  expired:  { label: "Expired",  bg: "oklch(0.97 0.005 80)",  text: "oklch(0.65 0.005 260)" },
};

const STATUS_FILTERS: { key: ProposalStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "draft", label: "Draft" },
  { key: "sent", label: "Sent" },
  { key: "viewed", label: "Viewed" },
  { key: "accepted", label: "Accepted" },
  { key: "declined", label: "Declined" },
];

/* ─── Helpers ─────────────────────────────────────────────── */
function formatCurrency(val: number | null | undefined) {
  if (val == null) return "$0";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}
function timeAgo(date: Date | string | null | undefined) {
  if (!date) return "—";
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ─── Proposal card ──────────────────────────────────────── */
function ProposalCard({ proposal, contact, onUpdateStatus, onDelete }: {
  proposal: any; contact: any;
  onUpdateStatus: (id: number, status: ProposalStatus) => void;
  onDelete: (id: number) => void;
}) {
  const status = (proposal.status || "draft") as ProposalStatus;
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md"
      style={{ background: "white", border: `1px solid ${CRM_COLORS.borderCard}` }}>
      {/* Status bar */}
      <div className="h-1" style={{ background: cfg.text }} />
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate" style={{ color: CRM_COLORS.textPrimary }}>
              {proposal.title}
            </h3>
            {contact && (
              <p className="text-xs mt-0.5 truncate" style={{ color: CRM_COLORS.textSecondary }}>
                {contact.name}{contact.company ? ` · ${contact.company}` : ""}
              </p>
            )}
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
            style={{ background: cfg.bg, color: cfg.text }}>
            {cfg.label}
          </span>
        </div>

        {/* Services */}
        {proposal.services && (
          <p className="text-xs mb-3 line-clamp-2" style={{ color: CRM_COLORS.textSecondary }}>
            {proposal.services}
          </p>
        )}

        {/* Value */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold" style={{ color: "oklch(0.62 0.18 25)" }}>
            {formatCurrency(proposal.totalValue)}
          </span>
          {proposal.validUntil && (
            <span className="text-xs flex items-center gap-1" style={{ color: CRM_COLORS.textSecondary }}>
              <Clock size={10} /> Valid until {proposal.validUntil}
            </span>
          )}
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-3 text-xs mb-3 pt-2"
          style={{ borderTop: `1px solid ${CRM_COLORS.border}`, color: CRM_COLORS.textSecondary }}>
          <span>Created {timeAgo(proposal.createdAt)}</span>
          {proposal.sentAt && <span>Sent {timeAgo(proposal.sentAt)}</span>}
          {proposal.viewedAt && <span>Viewed {timeAgo(proposal.viewedAt)}</span>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {status === "draft" && (
            <button onClick={() => onUpdateStatus(proposal.id, "sent")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: "oklch(0.95 0.04 250)", color: "oklch(0.45 0.12 250)" }}>
              <Send size={11} /> Send
            </button>
          )}
          {status === "sent" && (
            <button onClick={() => onUpdateStatus(proposal.id, "viewed")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: "oklch(0.96 0.06 60)", color: "oklch(0.55 0.14 60)" }}>
              <Eye size={11} /> Mark Viewed
            </button>
          )}
          {status === "viewed" && (
            <>
              <button onClick={() => onUpdateStatus(proposal.id, "accepted")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                style={{ background: "oklch(0.95 0.06 145)", color: "oklch(0.42 0.14 145)" }}>
                <CheckCircle size={11} /> Accept
              </button>
              <button onClick={() => onUpdateStatus(proposal.id, "declined")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                style={{ background: "oklch(0.96 0.04 25)", color: "oklch(0.55 0.12 25)" }}>
                <XCircle size={11} /> Decline
              </button>
            </>
          )}
          <button onClick={() => { if (confirm("Delete this proposal?")) onDelete(proposal.id); }}
            className="ml-auto p-1.5 rounded-lg transition-all hover:opacity-70"
            style={{ color: "oklch(0.60 0.12 25)" }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add Proposal Modal ─────────────────────────────────── */
function AddProposalModal({ onClose, onSubmit, loading, contacts, deals }: {
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
  contacts: any[];
  deals: any[];
}) {
  const [form, setForm] = useState({
    title: "", contactId: "", dealId: "", services: "",
    totalValue: "", validUntil: "", notes: "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: "white", border: `1px solid ${CRM_COLORS.borderCard}` }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${CRM_COLORS.border}` }}>
          <h2 className="text-base font-semibold" style={{ color: CRM_COLORS.textPrimary }}>New Proposal</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <X size={16} style={{ color: CRM_COLORS.textSecondary }} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <Field label="Proposal Title *" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))}
            placeholder="Monthly Content Package — Findlay Nissan" />
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Contact" value={form.contactId} onChange={v => setForm(p => ({ ...p, contactId: v }))}
              options={[{ value: "", label: "Select contact..." }, ...contacts.map(c => ({ value: String(c.id), label: `${c.name}${c.company ? ` (${c.company})` : ""}` }))]} />
            <SelectField label="Deal" value={form.dealId} onChange={v => setForm(p => ({ ...p, dealId: v }))}
              options={[{ value: "", label: "Select deal..." }, ...deals.map(d => ({ value: String(d.id), label: d.title }))]} />
          </div>
          <TextareaField label="Services" value={form.services} onChange={v => setForm(p => ({ ...p, services: v }))}
            placeholder="Inventory photography (200 units/mo), Short-form reels (8/mo)..." rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Total Value ($)" value={form.totalValue} onChange={v => setForm(p => ({ ...p, totalValue: v }))} placeholder="5000" type="number" />
            <Field label="Valid Until" value={form.validUntil} onChange={v => setForm(p => ({ ...p, validUntil: v }))} type="date" />
          </div>
          <TextareaField label="Notes" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} placeholder="Additional notes..." />
          <button
            onClick={() => onSubmit({
              title: form.title,
              contactId: form.contactId ? Number(form.contactId) : undefined,
              dealId: form.dealId ? Number(form.dealId) : undefined,
              services: form.services || undefined,
              totalValue: form.totalValue ? Number(form.totalValue) : undefined,
              validUntil: form.validUntil || undefined,
              notes: form.notes || undefined,
            })}
            disabled={!form.title || loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: "oklch(0.62 0.18 25)" }}>
            {loading ? "Creating..." : "Create Proposal"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared form fields ─────────────────────────────────── */
function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: CRM_COLORS.textSecondary }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
        style={{ background: "oklch(0.97 0.005 80)", border: `1px solid ${CRM_COLORS.border}`, color: CRM_COLORS.textPrimary }} />
    </div>
  );
}
function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: CRM_COLORS.textSecondary }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none appearance-none"
        style={{ background: "oklch(0.97 0.005 80)", border: `1px solid ${CRM_COLORS.border}`, color: CRM_COLORS.textPrimary }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
function TextareaField({ label, value, onChange, placeholder, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: CRM_COLORS.textSecondary }}>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none resize-none"
        style={{ background: "oklch(0.97 0.005 80)", border: `1px solid ${CRM_COLORS.border}`, color: CRM_COLORS.textPrimary }} />
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function CRMProposalsPage() {
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | "all">("all");
  const [showModal, setShowModal] = useState(false);

  const { data: proposals = [] } = trpc.crm.listProposals.useQuery();
  const { data: contacts = [] } = trpc.crm.listContacts.useQuery();
  const { data: deals = [] } = trpc.crm.listDeals.useQuery();
  const utils = trpc.useUtils();

  const createProposal = trpc.crm.createProposal.useMutation({
    onSuccess: () => { utils.crm.listProposals.invalidate(); setShowModal(false); toast.success("Proposal created"); },
  });
  const updateProposal = trpc.crm.updateProposal.useMutation({
    onSuccess: () => utils.crm.listProposals.invalidate(),
  });
  const deleteProposal = trpc.crm.deleteProposal.useMutation({
    onSuccess: () => { utils.crm.listProposals.invalidate(); toast.success("Proposal deleted"); },
  });

  const contactMap = (contacts as any[]).reduce((acc: Record<number, any>, c: any) => {
    acc[c.id] = c; return acc;
  }, {});

  const filtered = useMemo(() => {
    const list = proposals as any[];
    if (statusFilter === "all") return list;
    return list.filter(p => p.status === statusFilter);
  }, [proposals, statusFilter]);

  // Stats
  const totalValue = (proposals as any[]).reduce((s: number, p: any) => s + (p.totalValue ?? 0), 0);
  const acceptedValue = (proposals as any[]).filter((p: any) => p.status === "accepted").reduce((s: number, p: any) => s + (p.totalValue ?? 0), 0);
  const sentCount = (proposals as any[]).filter((p: any) => p.status !== "draft").length;

  return (
    <AdminLayout
      title="Proposals"
      subtitle={`${proposals.length} total · ${formatCurrency(totalValue)} pipeline`}
      actions={
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "oklch(0.62 0.18 25)" }}>
          <Plus size={15} /> New Proposal
        </button>
      }
    >
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Proposals", value: (proposals as any[]).length, sub: `${sentCount} sent` },
          { label: "Accepted Value", value: formatCurrency(acceptedValue), sub: "signed" },
          { label: "Pipeline Value", value: formatCurrency(totalValue), sub: "all proposals" },
        ].map(({ label, value, sub }) => (
          <TWCard key={label} className="text-center">
            <div className="text-2xl font-bold" style={{ color: CRM_COLORS.textPrimary }}>{value}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: CRM_COLORS.textSecondary }}>{label}</div>
            <div className="text-xs mt-1" style={{ color: "oklch(0.62 0.18 25)" }}>{sub}</div>
          </TWCard>
        ))}
      </div>

      {/* Status filter chips */}
      <div className="flex items-center gap-1.5 flex-wrap mb-6">
        {STATUS_FILTERS.map(f => {
          const cfg = f.key !== "all" ? STATUS_CONFIG[f.key as ProposalStatus] : null;
          const isActive = statusFilter === f.key;
          return (
            <button key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: isActive ? (cfg?.bg || "oklch(0.62 0.18 25)") : "white",
                color: isActive ? (cfg?.text || "oklch(0.15 0.005 260)") : CRM_COLORS.textSecondary,
                border: `1px solid ${isActive ? (cfg?.text || "oklch(0.62 0.18 25)") : CRM_COLORS.borderCard}`,
              }}>
              {f.label}
              {f.key !== "all" && (
                <span className="ml-1.5 opacity-60">
                  {(proposals as any[]).filter((p: any) => p.status === f.key).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Proposals grid */}
      {filtered.length === 0 ? (
        <TWCard className="flex flex-col items-center justify-center py-16 text-center">
          <FileText size={36} style={{ color: "oklch(0.80 0.005 260)" }} />
          <p className="text-sm font-medium mt-3" style={{ color: CRM_COLORS.textPrimary }}>
            {statusFilter !== "all" ? `No ${statusFilter} proposals` : "No proposals yet"}
          </p>
          <p className="text-xs mt-1" style={{ color: CRM_COLORS.textSecondary }}>
            {statusFilter !== "all" ? "Try a different filter" : "Create your first proposal to start tracking"}
          </p>
          {statusFilter === "all" && (
            <button onClick={() => setShowModal(true)}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "oklch(0.62 0.18 25)" }}>
              Create Proposal
            </button>
          )}
        </TWCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p: any) => (
            <ProposalCard
              key={p.id}
              proposal={p}
              contact={p.contactId ? contactMap[p.contactId] : null}
              onUpdateStatus={(id, status) => updateProposal.mutate({ id, status })}
              onDelete={(id) => deleteProposal.mutate({ id })}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddProposalModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => createProposal.mutate(data)}
          loading={createProposal.isPending}
          contacts={contacts as any[]}
          deals={deals as any[]}
        />
      )}
    </AdminLayout>
  );
}
