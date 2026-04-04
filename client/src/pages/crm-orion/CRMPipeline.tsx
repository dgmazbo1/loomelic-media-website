/* ============================================================
   CRM Pipeline — /crm/pipeline
   ORION-inspired Kanban board with coral accent stages
   ============================================================ */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, DollarSign, X, ChevronRight } from "lucide-react";
import AdminLayout, { TW } from "@/components/AdminLayout";
import { CRM_COLORS } from "@/components/CRMLayout";
import { toast } from "sonner";

/* ─── Stage config ───────────────────────────────────────── */
const STAGES = [
  { key: "lead",        label: "Lead",        color: "oklch(0.60 0.10 250)", light: "oklch(0.95 0.03 250)" },
  { key: "qualified",   label: "Qualified",   color: "oklch(0.55 0.12 200)", light: "oklch(0.95 0.03 200)" },
  { key: "proposal",    label: "Proposal",    color: "oklch(0.65 0.14 80)",  light: "oklch(0.97 0.04 80)" },
  { key: "negotiation", label: "Negotiation", color: "oklch(0.65 0.14 50)",  light: "oklch(0.97 0.04 50)" },
  { key: "closed_won",  label: "Won",         color: "oklch(0.62 0.18 25)",  light: "oklch(0.95 0.04 25)" },
  { key: "closed_lost", label: "Lost",        color: "oklch(0.55 0.05 260)", light: "oklch(0.96 0.005 260)" },
];

/* ─── Helpers ─────────────────────────────────────────────── */
function formatCurrency(val: number | null | undefined) {
  if (val == null) return "$0";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}

/* ─── Deal card ──────────────────────────────────────────── */
function DealCard({ deal, contact, stage, onMoveStage }: {
  deal: any; contact: any; stage: typeof STAGES[0];
  onMoveStage: (id: number, newStage: string) => void;
}) {
  const currentIdx = STAGES.findIndex(s => s.key === deal.stage);
  const nextStage = STAGES[currentIdx + 1];
  const prevStage = STAGES[currentIdx - 1];

  return (
    <div className="rounded-xl p-3 mb-2 transition-all duration-150 hover:shadow-md"
      style={{ background: "white", border: `1px solid ${CRM_COLORS.borderCard}` }}>
      <div className="font-semibold text-sm mb-1 truncate" style={{ color: CRM_COLORS.textPrimary }}>
        {deal.title}
      </div>
      {contact && (
        <div className="text-xs mb-2 truncate" style={{ color: CRM_COLORS.textSecondary }}>
          {contact.name}{contact.company ? ` · ${contact.company}` : ""}
        </div>
      )}
      {deal.value && (
        <div className="flex items-center gap-1 mb-2">
          <DollarSign size={11} style={{ color: "oklch(0.62 0.18 25)" }} />
          <span className="text-xs font-bold" style={{ color: "oklch(0.62 0.18 25)" }}>
            {formatCurrency(deal.value)}
          </span>
          {deal.probability && (
            <span className="text-xs ml-1" style={{ color: CRM_COLORS.textSecondary }}>
              {deal.probability}%
            </span>
          )}
        </div>
      )}
      {/* Stage move buttons */}
      <div className="flex items-center gap-1.5 mt-2 pt-2" style={{ borderTop: `1px solid ${CRM_COLORS.border}` }}>
        {prevStage && (
          <button
            onClick={() => onMoveStage(deal.id, prevStage.key)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all hover:opacity-70"
            style={{ background: "oklch(0.96 0.005 80)", color: CRM_COLORS.textSecondary }}>
            ← Back
          </button>
        )}
        {nextStage && (
          <button
            onClick={() => onMoveStage(deal.id, nextStage.key)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ml-auto transition-all hover:opacity-90"
            style={{ background: stage.light, color: stage.color }}>
            {nextStage.label} <ChevronRight size={10} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Add Deal Modal ─────────────────────────────────────── */
function AddDealModal({ onClose, onSubmit, loading, contacts, defaultStage }: {
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
  contacts: any[];
  defaultStage?: string;
}) {
  const [form, setForm] = useState({
    title: "", contactId: "", value: "", probability: "50",
    stage: defaultStage || "lead", expectedCloseDate: "", notes: "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl shadow-2xl"
        style={{ background: "white", border: `1px solid ${CRM_COLORS.borderCard}` }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${CRM_COLORS.border}` }}>
          <h2 className="text-base font-semibold" style={{ color: CRM_COLORS.textPrimary }}>New Deal</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <X size={16} style={{ color: CRM_COLORS.textSecondary }} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <Field label="Deal Title *" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="Monthly Content Package — Findlay Nissan" />
          <SelectField label="Contact" value={form.contactId} onChange={v => setForm(p => ({ ...p, contactId: v }))}
            options={[{ value: "", label: "Select contact..." }, ...contacts.map(c => ({ value: String(c.id), label: `${c.name}${c.company ? ` (${c.company})` : ""}` }))]} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Value ($)" value={form.value} onChange={v => setForm(p => ({ ...p, value: v }))} placeholder="5000" type="number" />
            <Field label="Probability (%)" value={form.probability} onChange={v => setForm(p => ({ ...p, probability: v }))} placeholder="50" type="number" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Stage" value={form.stage} onChange={v => setForm(p => ({ ...p, stage: v }))}
              options={STAGES.map(s => ({ value: s.key, label: s.label }))} />
            <Field label="Expected Close" value={form.expectedCloseDate} onChange={v => setForm(p => ({ ...p, expectedCloseDate: v }))} type="date" />
          </div>
          <TextareaField label="Notes" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} placeholder="Deal notes..." />
          <button
            onClick={() => onSubmit({
              title: form.title,
              contactId: form.contactId ? Number(form.contactId) : undefined,
              value: form.value ? Number(form.value) : undefined,
              probability: form.probability ? Number(form.probability) : 50,
              stage: form.stage as any,
              expectedCloseDate: form.expectedCloseDate || undefined,
              notes: form.notes || undefined,
            })}
            disabled={!form.title || loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: "oklch(0.62 0.18 25)" }}>
            {loading ? "Creating..." : "Create Deal"}
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
export default function CRMPipelinePage() {
  const [showModal, setShowModal] = useState(false);
  const [defaultStage, setDefaultStage] = useState("lead");

  const { data: deals = [] } = trpc.crm.listDeals.useQuery();
  const { data: contacts = [] } = trpc.crm.listContacts.useQuery();
  const utils = trpc.useUtils();

  const createDeal = trpc.crm.createDeal.useMutation({
    onSuccess: () => { utils.crm.listDeals.invalidate(); setShowModal(false); toast.success("Deal created"); },
  });
  const updateDeal = trpc.crm.updateDeal.useMutation({
    onSuccess: () => utils.crm.listDeals.invalidate(),
  });

  const contactMap = (contacts as any[]).reduce((acc: Record<number, any>, c: any) => {
    acc[c.id] = c; return acc;
  }, {});

  const totalValue = (deals as any[]).reduce((s: number, d: any) => s + (d.value ?? 0), 0);
  const activeValue = (deals as any[])
    .filter((d: any) => d.stage !== "closed_won" && d.stage !== "closed_lost")
    .reduce((s: number, d: any) => s + (d.value ?? 0), 0);

  return (
    <AdminLayout
      title="Pipeline"
      subtitle={`${deals.length} deal${deals.length !== 1 ? "s" : ""} · ${formatCurrency(activeValue)} active`}
      actions={
        <button
          onClick={() => { setDefaultStage("lead"); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "oklch(0.62 0.18 25)" }}>
          <Plus size={15} /> New Deal
        </button>
      }
    >
      {/* Pipeline summary bar */}
      <div className="flex items-center gap-6 mb-6 p-4 rounded-2xl"
        style={{ background: "white", border: `1px solid ${CRM_COLORS.borderCard}` }}>
        <div>
          <div className="text-xs" style={{ color: CRM_COLORS.textSecondary }}>Total pipeline</div>
          <div className="text-lg font-bold" style={{ color: CRM_COLORS.textPrimary }}>{formatCurrency(totalValue)}</div>
        </div>
        <div className="w-px h-8" style={{ background: CRM_COLORS.border }} />
        <div>
          <div className="text-xs" style={{ color: CRM_COLORS.textSecondary }}>Active</div>
          <div className="text-lg font-bold" style={{ color: "oklch(0.62 0.18 25)" }}>{formatCurrency(activeValue)}</div>
        </div>
        <div className="w-px h-8" style={{ background: CRM_COLORS.border }} />
        {STAGES.slice(0, 4).map(s => {
          const count = (deals as any[]).filter((d: any) => d.stage === s.key).length;
          return (
            <div key={s.key}>
              <div className="text-xs" style={{ color: CRM_COLORS.textSecondary }}>{s.label}</div>
              <div className="text-lg font-bold" style={{ color: s.color }}>{count}</div>
            </div>
          );
        })}
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "60vh" }}>
        {STAGES.map(stage => {
          const stageDeals = (deals as any[]).filter((d: any) => d.stage === stage.key);
          const stageValue = stageDeals.reduce((s: number, d: any) => s + (d.value ?? 0), 0);
          return (
            <div key={stage.key} className="flex-shrink-0 w-64 flex flex-col rounded-2xl overflow-hidden"
              style={{ background: stage.light, border: `1px solid ${stage.color}20` }}>
              {/* Column header */}
              <div className="flex items-center justify-between px-3 py-3"
                style={{ borderBottom: `2px solid ${stage.color}30` }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                  <span className="text-xs font-semibold" style={{ color: stage.color }}>{stage.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: `${stage.color}20`, color: stage.color }}>
                    {stageDeals.length}
                  </span>
                </div>
                <button
                  onClick={() => { setDefaultStage(stage.key); setShowModal(true); }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg transition-all hover:opacity-70"
                  style={{ background: `${stage.color}20`, color: stage.color }}>
                  <Plus size={12} />
                </button>
              </div>
              {/* Stage value */}
              {stageValue > 0 && (
                <div className="px-3 py-1.5 text-xs font-medium" style={{ color: stage.color }}>
                  {formatCurrency(stageValue)}
                </div>
              )}
              {/* Deal cards */}
              <div className="flex-1 p-2 overflow-y-auto">
                {stageDeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
                    <p className="text-xs" style={{ color: stage.color }}>No deals</p>
                  </div>
                ) : (
                  stageDeals.map((deal: any) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      contact={deal.contactId ? contactMap[deal.contactId] : null}
                      stage={stage}
                      onMoveStage={(id, newStage) => updateDeal.mutate({ id, stage: newStage as any })}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <AddDealModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => createDeal.mutate(data)}
          loading={createDeal.isPending}
          contacts={contacts as any[]}
          defaultStage={defaultStage}
        />
      )}
    </AdminLayout>
  );
}
