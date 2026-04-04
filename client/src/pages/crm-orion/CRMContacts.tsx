/* ============================================================
   CRM Contacts — /crm/contacts
   ORION-inspired: card grid, score circles, filter chips,
   lead temp icons, add/edit modals
   ============================================================ */
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import {
  Users, Search, Plus, Flame, Thermometer, Snowflake,
  Mail, Phone, StickyNote, CheckCircle, X, Trash2, Edit2,
  Clock,
} from "lucide-react";
import CRMLayout, { CRMCard, ScoreCircle, CRM_COLORS } from "@/components/CRMLayout";
import { toast } from "sonner";

/* ─── Types ──────────────────────────────────────────────── */
type LeadTemp = "hot" | "warm" | "cold";
type ContactType = "lead" | "client" | "partner" | "vendor" | "other";
type ContactStatus = "prospect" | "active" | "inactive" | "churned";

const LEAD_TEMP_CONFIG: Record<LeadTemp, { icon: React.ReactNode; label: string; bg: string; text: string }> = {
  hot:  { icon: <Flame size={12} />,       label: "Hot",  bg: "oklch(0.95 0.04 25)", text: "oklch(0.62 0.18 25)" },
  warm: { icon: <Thermometer size={12} />, label: "Warm", bg: "oklch(0.96 0.06 60)", text: "oklch(0.55 0.14 60)" },
  cold: { icon: <Snowflake size={12} />,   label: "Cold", bg: "oklch(0.95 0.03 250)", text: "oklch(0.45 0.10 250)" },
};

const TYPE_FILTERS: { key: ContactType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "lead", label: "Leads" },
  { key: "client", label: "Clients" },
  { key: "partner", label: "Partners" },
  { key: "vendor", label: "Vendors" },
];

const STATUS_COLORS: Record<ContactStatus, { bg: string; text: string }> = {
  prospect: { bg: "oklch(0.96 0.06 60)", text: "oklch(0.55 0.14 60)" },
  active:   { bg: "oklch(0.95 0.06 145)", text: "oklch(0.45 0.14 145)" },
  inactive: { bg: "oklch(0.96 0.005 260)", text: "oklch(0.55 0.005 260)" },
  churned:  { bg: "oklch(0.96 0.04 25)", text: "oklch(0.55 0.12 25)" },
};

/* ─── Helpers ─────────────────────────────────────────────── */
function timeAgo(date: Date | string | null | undefined) {
  if (!date) return "Never";
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ─── Contact Card ───────────────────────────────────────── */
function ContactCard({ contact, onUpdateLeadTemp, onUpdateQuickNotes, onDelete, onEdit }: {
  contact: any;
  onUpdateLeadTemp: (id: number, temp: LeadTemp) => void;
  onUpdateQuickNotes: (id: number, notes: string) => void;
  onDelete: (id: number) => void;
  onEdit: (contact: any) => void;
}) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [noteText, setNoteText] = useState(contact.quickNotes || "");
  const score = contact.leadTemp === "hot" ? 85 : contact.leadTemp === "warm" ? 60 : 35;
  const status = (contact.status || "prospect") as ContactStatus;
  const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.prospect;

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      style={{ background: "white", border: `1px solid ${CRM_COLORS.borderCard}`, boxShadow: "0 1px 4px oklch(0.15 0.005 260 / 0.05)" }}>
      {/* Card header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Avatar + name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
              style={{ background: "oklch(0.95 0.04 25)", color: "oklch(0.62 0.18 25)" }}>
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate" style={{ color: CRM_COLORS.textPrimary }}>
                {contact.name}
              </div>
              <div className="text-xs truncate" style={{ color: CRM_COLORS.textSecondary }}>
                {contact.title && contact.company
                  ? `${contact.title} · ${contact.company}`
                  : contact.company || contact.title || "—"}
              </div>
            </div>
          </div>
          {/* Score circle */}
          <ScoreCircle score={score} size={44} />
        </div>

        {/* Lead temp selector */}
        <div className="flex items-center gap-1.5 mb-3">
          {(["hot", "warm", "cold"] as LeadTemp[]).map(t => {
            const cfg = LEAD_TEMP_CONFIG[t];
            const isActive = contact.leadTemp === t;
            return (
              <button key={t}
                onClick={() => onUpdateLeadTemp(contact.id, t)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: isActive ? cfg.bg : "oklch(0.97 0.005 80)",
                  color: isActive ? cfg.text : CRM_COLORS.textSecondary,
                  border: `1px solid ${isActive ? cfg.bg : CRM_COLORS.border}`,
                }}>
                {cfg.icon} {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-1.5 mb-3">
          {contact.email && (
            <div className="flex items-center gap-2">
              <Mail size={11} style={{ color: CRM_COLORS.textSecondary }} />
              <span className="text-xs truncate" style={{ color: CRM_COLORS.textSecondary }}>{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-2">
              <Phone size={11} style={{ color: CRM_COLORS.textSecondary }} />
              <span className="text-xs" style={{ color: CRM_COLORS.textSecondary }}>{contact.phone}</span>
            </div>
          )}
        </div>

        {/* Status + type badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
            style={{ background: statusStyle.bg, color: statusStyle.text }}>
            {status}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
            style={{ background: "oklch(0.96 0.005 80)", color: CRM_COLORS.textSecondary }}>
            {contact.contactType?.replace("_", " ")}
          </span>
        </div>

        {/* Last contact */}
        <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: CRM_COLORS.textSecondary }}>
          <Clock size={10} />
          <span>Last contact: {timeAgo(contact.lastContactedAt)}</span>
        </div>
      </div>

      {/* Quick notes */}
      <div className="px-4 pb-3 pt-2" style={{ borderTop: `1px solid ${CRM_COLORS.border}` }}>
        {editingNotes ? (
          <div className="flex gap-2">
            <input
              autoFocus
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") { onUpdateQuickNotes(contact.id, noteText); setEditingNotes(false); }
                if (e.key === "Escape") setEditingNotes(false);
              }}
              className="flex-1 px-2 py-1 rounded-lg text-xs focus:outline-none"
              style={{
                background: "oklch(0.97 0.005 80)",
                border: `1px solid oklch(0.62 0.18 25)`,
                color: CRM_COLORS.textPrimary,
              }}
              placeholder="Quick note..."
            />
            <button onClick={() => { onUpdateQuickNotes(contact.id, noteText); setEditingNotes(false); }}>
              <CheckCircle size={14} style={{ color: "oklch(0.62 0.18 25)" }} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setEditingNotes(true); setNoteText(contact.quickNotes || ""); }}
            className="flex items-center gap-1.5 w-full text-left transition-opacity hover:opacity-70">
            <StickyNote size={11} style={{ color: CRM_COLORS.textSecondary }} />
            <span className="text-xs truncate italic" style={{ color: CRM_COLORS.textSecondary }}>
              {contact.quickNotes || "Add quick note..."}
            </span>
          </button>
        )}
      </div>

      {/* Card footer actions */}
      <div className="flex items-center" style={{ borderTop: `1px solid ${CRM_COLORS.border}` }}>
        <button
          onClick={() => onEdit(contact)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all hover:opacity-70"
          style={{ color: CRM_COLORS.textSecondary }}>
          <Edit2 size={11} /> Edit
        </button>
        <div className="w-px h-5" style={{ background: CRM_COLORS.border }} />
        <a href={`mailto:${contact.email}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all hover:opacity-70"
          style={{ color: CRM_COLORS.textSecondary }}>
          <Mail size={11} /> Email
        </a>
        <div className="w-px h-5" style={{ background: CRM_COLORS.border }} />
        <button
          onClick={() => { if (confirm(`Delete ${contact.name}?`)) onDelete(contact.id); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all"
          style={{ color: "oklch(0.60 0.12 25)" }}>
          <Trash2 size={11} /> Delete
        </button>
      </div>
    </div>
  );
}

/* ─── Add/Edit Modal ─────────────────────────────────────── */
function ContactModal({ contact, onClose, onSubmit, loading }: {
  contact?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    name: contact?.name || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    company: contact?.company || "",
    title: contact?.title || "",
    contactType: (contact?.contactType || "lead") as ContactType,
    status: (contact?.status || "prospect") as ContactStatus,
    leadTemp: (contact?.leadTemp || "warm") as LeadTemp,
    notes: contact?.notes || "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: "white", border: `1px solid ${CRM_COLORS.borderCard}` }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${CRM_COLORS.border}` }}>
          <h2 className="text-base font-semibold" style={{ color: CRM_COLORS.textPrimary }}>
            {contact ? "Edit Contact" : "New Contact"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-gray-100">
            <X size={16} style={{ color: CRM_COLORS.textSecondary }} />
          </button>
        </div>
        {/* Body */}
        <div className="p-5 space-y-4">
          <Field label="Name *" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} placeholder="John Smith" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} placeholder="john@example.com" type="email" />
            <Field label="Phone" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} placeholder="+1 702 555 0100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company" value={form.company} onChange={v => setForm(p => ({ ...p, company: v }))} placeholder="Findlay Nissan" />
            <Field label="Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="GM" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <SelectField label="Type" value={form.contactType} onChange={v => setForm(p => ({ ...p, contactType: v as ContactType }))}
              options={[
                { value: "lead", label: "Lead" }, { value: "client", label: "Client" },
                { value: "partner", label: "Partner" }, { value: "vendor", label: "Vendor" }, { value: "other", label: "Other" },
              ]} />
            <SelectField label="Status" value={form.status} onChange={v => setForm(p => ({ ...p, status: v as ContactStatus }))}
              options={[
                { value: "prospect", label: "Prospect" }, { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" }, { value: "churned", label: "Churned" },
              ]} />
            <SelectField label="Lead Temp" value={form.leadTemp} onChange={v => setForm(p => ({ ...p, leadTemp: v as LeadTemp }))}
              options={[{ value: "hot", label: "Hot" }, { value: "warm", label: "Warm" }, { value: "cold", label: "Cold" }]} />
          </div>
          <TextareaField label="Notes" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} placeholder="Additional notes..." />
          <button
            onClick={() => onSubmit(form)}
            disabled={!form.name || loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: "oklch(0.62 0.18 25)" }}>
            {loading ? "Saving..." : contact ? "Save Changes" : "Create Contact"}
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
        className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all"
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
export default function CRMContactsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ContactType | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editContact, setEditContact] = useState<any>(null);

  const { data: contacts = [] } = trpc.crm.listContacts.useQuery();
  const utils = trpc.useUtils();

  const createContact = trpc.crm.createContact.useMutation({
    onSuccess: () => { utils.crm.listContacts.invalidate(); setShowModal(false); toast.success("Contact created"); },
  });
  const updateContact = trpc.crm.updateContact.useMutation({
    onSuccess: () => { utils.crm.listContacts.invalidate(); setEditContact(null); toast.success("Contact updated"); },
  });
  const deleteContact = trpc.crm.deleteContact.useMutation({
    onSuccess: () => { utils.crm.listContacts.invalidate(); toast.success("Contact deleted"); },
  });
  const updateLeadTemp = trpc.crm.updateContactLeadTemp.useMutation({
    onSuccess: () => utils.crm.listContacts.invalidate(),
  });
  const updateQuickNotes = trpc.crm.updateContactQuickNotes.useMutation({
    onSuccess: () => utils.crm.listContacts.invalidate(),
  });

  const filtered = useMemo(() => {
    let list = contacts as any[];
    if (typeFilter !== "all") list = list.filter(c => c.contactType === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [contacts, typeFilter, search]);

  return (
    <CRMLayout
      title="Contacts"
      subtitle={`${contacts.length} total contact${contacts.length !== 1 ? "s" : ""}`}
      actions={
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "oklch(0.62 0.18 25)" }}>
          <Plus size={15} /> New Contact
        </button>
      }
    >
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: CRM_COLORS.textSecondary }} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none"
            style={{
              background: "white",
              border: `1px solid ${CRM_COLORS.borderCard}`,
              color: CRM_COLORS.textPrimary,
            }}
          />
        </div>
        {/* Type filter chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {TYPE_FILTERS.map(f => (
            <button key={f.key}
              onClick={() => setTypeFilter(f.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: typeFilter === f.key ? "oklch(0.62 0.18 25)" : "white",
                color: typeFilter === f.key ? "white" : CRM_COLORS.textSecondary,
                border: `1px solid ${typeFilter === f.key ? "oklch(0.62 0.18 25)" : CRM_COLORS.borderCard}`,
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contact grid */}
      {filtered.length === 0 ? (
        <CRMCard className="flex flex-col items-center justify-center py-16 text-center">
          <Users size={36} style={{ color: "oklch(0.80 0.005 260)" }} />
          <p className="text-sm font-medium mt-3" style={{ color: CRM_COLORS.textPrimary }}>
            {search || typeFilter !== "all" ? "No contacts match your filters" : "No contacts yet"}
          </p>
          <p className="text-xs mt-1" style={{ color: CRM_COLORS.textSecondary }}>
            {search || typeFilter !== "all" ? "Try adjusting your search or filters" : "Add your first contact to get started"}
          </p>
          {!search && typeFilter === "all" && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "oklch(0.62 0.18 25)" }}>
              Add Contact
            </button>
          )}
        </CRMCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((c: any) => (
            <ContactCard
              key={c.id}
              contact={c}
              onUpdateLeadTemp={(id, temp) => updateLeadTemp.mutate({ id, leadTemp: temp })}
              onUpdateQuickNotes={(id, notes) => updateQuickNotes.mutate({ id, quickNotes: notes })}
              onDelete={(id) => deleteContact.mutate({ id })}
              onEdit={(contact) => setEditContact(contact)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <ContactModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => createContact.mutate(data)}
          loading={createContact.isPending}
        />
      )}
      {editContact && (
        <ContactModal
          contact={editContact}
          onClose={() => setEditContact(null)}
          onSubmit={(data) => updateContact.mutate({ id: editContact.id, ...data })}
          loading={updateContact.isPending}
        />
      )}
    </CRMLayout>
  );
}
