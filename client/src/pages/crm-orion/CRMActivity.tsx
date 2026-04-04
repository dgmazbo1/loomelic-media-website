/* ============================================================
   CRM Activity — /crm/activity
   ORION-inspired: vertical timeline, type icons, log interaction modal
   ============================================================ */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Phone, Mail, Users, MessageSquare, Activity, Plus, X, Clock,
  ArrowUpRight, ArrowDownLeft,
} from "lucide-react";
import AdminLayout, { TW, TWCard } from "@/components/AdminLayout";
import { CRM_COLORS } from "@/components/CRMLayout";
import { toast } from "sonner";

/* ─── Type config ────────────────────────────────────────── */
type InteractionType = "call" | "email" | "meeting" | "note" | "other";
type Direction = "inbound" | "outbound";

const TYPE_CONFIG: Record<InteractionType, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  call:    { icon: <Phone size={13} />,         label: "Call",    color: "oklch(0.45 0.12 250)", bg: "oklch(0.95 0.03 250)" },
  email:   { icon: <Mail size={13} />,          label: "Email",   color: "oklch(0.55 0.14 60)",  bg: "oklch(0.96 0.06 60)" },
  meeting: { icon: <Users size={13} />,         label: "Meeting", color: "oklch(0.62 0.18 25)",  bg: "oklch(0.95 0.04 25)" },
  note:    { icon: <MessageSquare size={13} />, label: "Note",    color: "oklch(0.45 0.10 145)", bg: "oklch(0.95 0.05 145)" },
  other:   { icon: <Activity size={13} />,      label: "Other",   color: "oklch(0.50 0.005 260)", bg: "oklch(0.96 0.005 260)" },
};

/* ─── Helpers ─────────────────────────────────────────────── */
function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function formatTime(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
function groupByDate(items: any[]) {
  const groups: Record<string, any[]> = {};
  for (const item of items) {
    const key = formatDate(item.occurredAt || item.createdAt);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}

/* ─── Timeline item ──────────────────────────────────────── */
function TimelineItem({ item, contact }: { item: any; contact: any }) {
  const type = (item.type || "other") as InteractionType;
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.other;
  const direction = item.direction as Direction | undefined;

  return (
    <div className="relative flex gap-4 pb-6">
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10"
          style={{ background: cfg.bg, color: cfg.color, border: `2px solid white` }}>
          {cfg.icon}
        </div>
        <div className="flex-1 w-px mt-1" style={{ background: "oklch(0.90 0.005 80)" }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-2">
        <div className="rounded-xl p-3 transition-all hover:shadow-sm"
          style={{ background: "white", border: `1px solid ${CRM_COLORS.borderCard}` }}>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: cfg.bg, color: cfg.color }}>
                {cfg.label}
              </span>
              {direction && (
                <span className="text-xs flex items-center gap-0.5" style={{ color: CRM_COLORS.textSecondary }}>
                  {direction === "inbound"
                    ? <ArrowDownLeft size={10} style={{ color: "oklch(0.45 0.12 145)" }} />
                    : <ArrowUpRight size={10} style={{ color: "oklch(0.62 0.18 25)" }} />}
                  {direction}
                </span>
              )}
            </div>
            <span className="text-xs shrink-0 flex items-center gap-1" style={{ color: CRM_COLORS.textSecondary }}>
              <Clock size={10} /> {formatTime(item.occurredAt || item.createdAt)}
            </span>
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: CRM_COLORS.textPrimary }}>
            {item.subject || "No subject"}
          </p>
          {contact && (
            <p className="text-xs mb-1" style={{ color: "oklch(0.62 0.18 25)" }}>
              {contact.name}{contact.company ? ` · ${contact.company}` : ""}
            </p>
          )}
          {item.notes && (
            <p className="text-xs mt-1" style={{ color: CRM_COLORS.textSecondary }}>
              {item.notes}
            </p>
          )}
          {item.outcome && (
            <div className="mt-2 pt-2 text-xs" style={{ borderTop: `1px solid ${CRM_COLORS.border}`, color: CRM_COLORS.textSecondary }}>
              <span className="font-medium" style={{ color: CRM_COLORS.textPrimary }}>Outcome: </span>
              {item.outcome}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Log Interaction Modal ──────────────────────────────── */
function LogInteractionModal({ onClose, onSubmit, loading, contacts }: {
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
  contacts: any[];
}) {
  const [form, setForm] = useState({
    contactId: "",
    type: "call" as InteractionType,
    direction: "outbound" as Direction,
    subject: "",
    notes: "",
    outcome: "",
    occurredAt: new Date().toISOString().slice(0, 16),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: "white", border: `1px solid ${CRM_COLORS.borderCard}` }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${CRM_COLORS.border}` }}>
          <h2 className="text-base font-semibold" style={{ color: CRM_COLORS.textPrimary }}>Log Interaction</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <X size={16} style={{ color: CRM_COLORS.textSecondary }} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <SelectField label="Contact" value={form.contactId} onChange={v => setForm(p => ({ ...p, contactId: v }))}
            options={[{ value: "", label: "Select contact..." }, ...contacts.map(c => ({ value: String(c.id), label: `${c.name}${c.company ? ` (${c.company})` : ""}` }))]} />
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Type" value={form.type} onChange={v => setForm(p => ({ ...p, type: v as InteractionType }))}
              options={Object.entries(TYPE_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))} />
            <SelectField label="Direction" value={form.direction} onChange={v => setForm(p => ({ ...p, direction: v as Direction }))}
              options={[{ value: "outbound", label: "Outbound" }, { value: "inbound", label: "Inbound" }]} />
          </div>
          <Field label="Subject *" value={form.subject} onChange={v => setForm(p => ({ ...p, subject: v }))}
            placeholder="Discovery call — Findlay Nissan" />
          <Field label="Date & Time" value={form.occurredAt} onChange={v => setForm(p => ({ ...p, occurredAt: v }))} type="datetime-local" />
          <TextareaField label="Notes" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))}
            placeholder="Discussion notes..." />
          <TextareaField label="Outcome" value={form.outcome} onChange={v => setForm(p => ({ ...p, outcome: v }))}
            placeholder="Follow-up scheduled for next week..." />
          <button
            onClick={() => onSubmit({
              contactId: form.contactId ? Number(form.contactId) : undefined,
              type: form.type,
              direction: form.direction,
              subject: form.subject,
              notes: form.notes || undefined,
              outcome: form.outcome || undefined,
              occurredAt: new Date(form.occurredAt),
            })}
            disabled={!form.subject || loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: "oklch(0.62 0.18 25)" }}>
            {loading ? "Logging..." : "Log Interaction"}
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
function TextareaField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: CRM_COLORS.textSecondary }}>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
        className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none resize-none"
        style={{ background: "oklch(0.97 0.005 80)", border: `1px solid ${CRM_COLORS.border}`, color: CRM_COLORS.textPrimary }} />
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function CRMActivityPage() {
  const [showModal, setShowModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState<InteractionType | "all">("all");

  const { data: interactions = [] } = trpc.crm.listInteractions.useQuery({});
  const { data: contacts = [] } = trpc.crm.listContacts.useQuery();
  const utils = trpc.useUtils();

  const createInteraction = trpc.crm.createInteraction.useMutation({
    onSuccess: () => { utils.crm.listInteractions.invalidate(); setShowModal(false); toast.success("Interaction logged"); },
  });

  const contactMap = (contacts as any[]).reduce((acc: Record<number, any>, c: any) => {
    acc[c.id] = c; return acc;
  }, {});

  const filtered = (interactions as any[]).filter(i =>
    typeFilter === "all" || i.type === typeFilter
  );

  const grouped = groupByDate(filtered);

  return (
    <AdminLayout
      title="Activity"
      subtitle={`${interactions.length} interaction${interactions.length !== 1 ? "s" : ""} logged`}
      actions={
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "oklch(0.62 0.18 25)" }}>
          <Plus size={15} /> Log Interaction
        </button>
      }
    >
      {/* Type filter chips */}
      <div className="flex items-center gap-1.5 flex-wrap mb-6">
        <button
          onClick={() => setTypeFilter("all")}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: typeFilter === "all" ? "oklch(0.62 0.18 25)" : "white",
            color: typeFilter === "all" ? "white" : CRM_COLORS.textSecondary,
            border: `1px solid ${typeFilter === "all" ? "oklch(0.62 0.18 25)" : CRM_COLORS.borderCard}`,
          }}>
          All
        </button>
        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
          const isActive = typeFilter === key;
          return (
            <button key={key}
              onClick={() => setTypeFilter(key as InteractionType)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: isActive ? cfg.bg : "white",
                color: isActive ? cfg.color : CRM_COLORS.textSecondary,
                border: `1px solid ${isActive ? cfg.color : CRM_COLORS.borderCard}`,
              }}>
              {cfg.icon} {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <TWCard className="flex flex-col items-center justify-center py-16 text-center">
          <Activity size={36} style={{ color: "oklch(0.80 0.005 260)" }} />
          <p className="text-sm font-medium mt-3" style={{ color: CRM_COLORS.textPrimary }}>
            {typeFilter !== "all" ? `No ${typeFilter}s logged yet` : "No activity logged yet"}
          </p>
          <p className="text-xs mt-1" style={{ color: CRM_COLORS.textSecondary }}>
            Log your first interaction to start tracking activity
          </p>
          {typeFilter === "all" && (
            <button onClick={() => setShowModal(true)}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "oklch(0.62 0.18 25)" }}>
              Log Interaction
            </button>
          )}
        </TWCard>
      ) : (
        <div className="max-w-2xl">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="mb-6">
              {/* Date header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "oklch(0.95 0.04 25)", color: "oklch(0.62 0.18 25)" }}>
                  {date}
                </span>
                <div className="flex-1 h-px" style={{ background: CRM_COLORS.border }} />
                <span className="text-xs" style={{ color: CRM_COLORS.textSecondary }}>
                  {items.length} event{items.length !== 1 ? "s" : ""}
                </span>
              </div>
              {/* Timeline items */}
              <div className="pl-2">
                {items.map((item: any) => (
                  <TimelineItem
                    key={item.id}
                    item={item}
                    contact={item.contactId ? contactMap[item.contactId] : null}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <LogInteractionModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => createInteraction.mutate(data)}
          loading={createInteraction.isPending}
          contacts={contacts as any[]}
        />
      )}
    </AdminLayout>
  );
}
