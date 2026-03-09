import { toast } from "sonner";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Building2, Users, Calendar, Globe, Shield, FileText, CheckCircle2,
  ChevronRight, ChevronLeft, Loader2, AlertCircle, Clock, CheckCheck,
  Plus, Trash2, Car, Phone, Mail, MapPin
} from "lucide-react";

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Dealership Info", icon: Building2 },
  { id: 2, label: "Key Contacts", icon: Users },
  { id: 3, label: "Monthly Inputs", icon: Calendar },
  { id: 4, label: "Platform Access", icon: Globe },
  { id: 5, label: "Compliance", icon: Shield },
  { id: 6, label: "Acknowledgements", icon: CheckCheck },
  { id: 7, label: "Documents", icon: FileText },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  invited: { label: "Invited", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: <Clock className="w-4 h-4" /> },
  in_progress: { label: "In Progress", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", icon: <Loader2 className="w-4 h-4 animate-spin" /> },
  submitted: { label: "Submitted", color: "bg-purple-500/20 text-purple-300 border-purple-500/30", icon: <CheckCircle2 className="w-4 h-4" /> },
  under_review: { label: "Under Review", color: "bg-orange-500/20 text-orange-300 border-orange-500/30", icon: <AlertCircle className="w-4 h-4" /> },
  approved: { label: "Approved", color: "bg-green-500/20 text-green-300 border-green-500/30", icon: <CheckCircle2 className="w-4 h-4" /> },
  active: { label: "Active", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", icon: <CheckCircle2 className="w-4 h-4" /> },
};

// ─── Token Gate ───────────────────────────────────────────────────────────────
function TokenGate({ onToken }: { onToken: (t: string) => void }) {
  const [input, setInput] = useState("");
  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[oklch(0.85_0.23_110)] mb-4">
            <Car className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Dealer Portal</h1>
          <p className="text-zinc-400">Enter your invite token to access your onboarding dashboard</p>
        </div>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Input
                placeholder="Paste your invite token here..."
                value={input}
                onChange={e => setInput(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white font-mono"
                onKeyDown={e => e.key === "Enter" && input.trim() && onToken(input.trim())}
              />
              <Button
                className="w-full bg-[oklch(0.85_0.23_110)] text-black font-bold hover:bg-[oklch(0.78_0.23_110)]"
                onClick={() => input.trim() && onToken(input.trim())}
              >
                Access Portal <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-zinc-500 text-sm mt-4">
          Don't have a token? Contact your Loomelic Media account manager.
        </p>
      </div>
    </div>
  );
}

// ─── Step Progress Bar ────────────────────────────────────────────────────────
function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const isActive = step.id === current;
        const isDone = step.id < current;
        return (
          <div key={step.id} className="flex items-center gap-1 flex-shrink-0">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              isActive ? "bg-[oklch(0.85_0.23_110)] text-black" :
              isDone ? "bg-zinc-700 text-zinc-300" : "bg-zinc-800/50 text-zinc-500"
            }`}>
              {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.id}</span>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className={`w-3 h-3 flex-shrink-0 ${isDone ? "text-zinc-400" : "text-zinc-700"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Dealership Info ──────────────────────────────────────────────────
function Step1({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  const fields = [
    { key: "legalName", label: "Legal Business Name", placeholder: "ABC Motors LLC" },
    { key: "storeName", label: "Store / DBA Name", placeholder: "ABC Chevrolet" },
    { key: "slogan", label: "Tagline / Slogan", placeholder: "Drive the difference" },
    { key: "address", label: "Street Address", placeholder: "123 Main St" },
    { key: "city", label: "City", placeholder: "Las Vegas" },
    { key: "state", label: "State", placeholder: "NV" },
    { key: "zip", label: "ZIP Code", placeholder: "89101" },
    { key: "phone", label: "Main Phone", placeholder: "(702) 555-0100" },
    { key: "timezone", label: "Timezone", placeholder: "America/Los_Angeles" },
    { key: "dealershipStructure", label: "Dealership Type", placeholder: "Single Franchise / Multi-Franchise / Independent" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.key} className={f.key === "slogan" || f.key === "address" ? "sm:col-span-2" : ""}>
            <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wide">{f.label}</label>
            <Input
              value={data[f.key] ?? ""}
              onChange={e => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wide">Business Hours</label>
        <Textarea
          value={data.businessHours ?? ""}
          onChange={e => onChange("businessHours", e.target.value)}
          placeholder="Mon-Fri 8am-8pm, Sat 9am-6pm, Sun 10am-5pm"
          className="bg-zinc-800 border-zinc-700 text-white"
          rows={2}
        />
      </div>
    </div>
  );
}

// ─── Step 2: Key Contacts ─────────────────────────────────────────────────────
function Step2({ contacts, onChange }: {
  contacts: Array<Record<string, string>>;
  onChange: (contacts: Array<Record<string, string>>) => void;
}) {
  const add = () => onChange([...contacts, { contactType: "General Manager", name: "", email: "", phone: "" }]);
  const remove = (i: number) => onChange(contacts.filter((_, idx) => idx !== i));
  const update = (i: number, k: string, v: string) => {
    const next = [...contacts];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  };
  return (
    <div className="space-y-4">
      {contacts.map((c, i) => (
        <Card key={i} className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="pt-4 pb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-zinc-300">Contact #{i + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => remove(i)} className="text-red-400 hover:text-red-300 h-7 w-7 p-0">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "contactType", placeholder: "Role (e.g. GM, Marketing Director)" },
                { key: "name", placeholder: "Full Name" },
                { key: "email", placeholder: "Email Address" },
                { key: "phone", placeholder: "Phone Number" },
                { key: "title", placeholder: "Job Title" },
                { key: "preferredMethod", placeholder: "Preferred Contact Method" },
              ].map(f => (
                <Input
                  key={f.key}
                  value={c[f.key] ?? ""}
                  onChange={e => update(i, f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="bg-zinc-700 border-zinc-600 text-white text-sm"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" onClick={add} className="w-full border-dashed border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-400">
        <Plus className="w-4 h-4 mr-2" /> Add Contact
      </Button>
    </div>
  );
}

// ─── Step 3: Monthly Inputs ───────────────────────────────────────────────────
function Step3({ inputs, onChange }: {
  inputs: Array<Record<string, string>>;
  onChange: (inputs: Array<Record<string, string>>) => void;
}) {
  const types = ["special", "campaign", "promotion", "event"] as const;
  const add = () => onChange([...inputs, { inputType: "promotion", title: "", description: "" }]);
  const remove = (i: number) => onChange(inputs.filter((_, idx) => idx !== i));
  const update = (i: number, k: string, v: string) => {
    const next = [...inputs];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  };
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">Add your upcoming promotions, campaigns, events, and specials so Loomelic can plan your content calendar.</p>
      {inputs.map((inp, i) => (
        <Card key={i} className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="pt-4 pb-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex gap-2">
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => update(i, "inputType", t)}
                    className={`px-2 py-1 rounded text-xs font-semibold capitalize transition-colors ${
                      inp.inputType === t ? "bg-[oklch(0.85_0.23_110)] text-black" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                    }`}
                  >{t}</button>
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={() => remove(i)} className="text-red-400 hover:text-red-300 h-7 w-7 p-0">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="space-y-2">
              <Input value={inp.title ?? ""} onChange={e => update(i, "title", e.target.value)} placeholder="Title" className="bg-zinc-700 border-zinc-600 text-white text-sm" />
              <Textarea value={inp.description ?? ""} onChange={e => update(i, "description", e.target.value)} placeholder="Description / Details" className="bg-zinc-700 border-zinc-600 text-white text-sm" rows={2} />
              <div className="grid grid-cols-2 gap-2">
                <Input value={inp.startDate ?? ""} onChange={e => update(i, "startDate", e.target.value)} placeholder="Start Date" className="bg-zinc-700 border-zinc-600 text-white text-sm" />
                <Input value={inp.endDate ?? ""} onChange={e => update(i, "endDate", e.target.value)} placeholder="End Date" className="bg-zinc-700 border-zinc-600 text-white text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" onClick={add} className="w-full border-dashed border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-400">
        <Plus className="w-4 h-4 mr-2" /> Add Item
      </Button>
    </div>
  );
}

// ─── Step 4: Platform Access ──────────────────────────────────────────────────
function Step4({ platforms, onChange }: {
  platforms: Array<Record<string, string>>;
  onChange: (platforms: Array<Record<string, string>>) => void;
}) {
  const SUGGESTED = ["Facebook", "Instagram", "TikTok", "YouTube", "Google Business", "DealerSocket CRM", "VinSolutions", "CDK"];
  const add = (platform = "") => onChange([...platforms, { platform, username: "", notes: "" }]);
  const remove = (i: number) => onChange(platforms.filter((_, idx) => idx !== i));
  const update = (i: number, k: string, v: string) => {
    const next = [...platforms];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  };
  const existing = platforms.map(p => p.platform);
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">Share your social media handles and platform credentials so Loomelic can manage your digital presence.</p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED.filter(s => !existing.includes(s)).map(s => (
          <button key={s} onClick={() => add(s)} className="px-3 py-1 rounded-full text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 hover:border-[oklch(0.85_0.23_110)] hover:text-white transition-colors">
            + {s}
          </button>
        ))}
      </div>
      {platforms.map((p, i) => (
        <Card key={i} className="bg-zinc-800/50 border-zinc-700">
          <CardContent className="pt-4 pb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-zinc-300">{p.platform || `Platform #${i + 1}`}</span>
              <Button variant="ghost" size="sm" onClick={() => remove(i)} className="text-red-400 hover:text-red-300 h-7 w-7 p-0">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="space-y-2">
              <Input value={p.platform ?? ""} onChange={e => update(i, "platform", e.target.value)} placeholder="Platform Name" className="bg-zinc-700 border-zinc-600 text-white text-sm" />
              <Input value={p.username ?? ""} onChange={e => update(i, "username", e.target.value)} placeholder="Username / Handle / Login" className="bg-zinc-700 border-zinc-600 text-white text-sm" />
              <Textarea value={p.notes ?? ""} onChange={e => update(i, "notes", e.target.value)} placeholder="Additional notes or credentials" className="bg-zinc-700 border-zinc-600 text-white text-sm" rows={2} />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" onClick={() => add()} className="w-full border-dashed border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-400">
        <Plus className="w-4 h-4 mr-2" /> Add Platform
      </Button>
    </div>
  );
}

// ─── Step 5: Compliance ───────────────────────────────────────────────────────
function Step5({ data, onChange }: { data: Record<string, string>; onChange: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">Help us understand your OEM requirements and brand guidelines to ensure all content stays compliant.</p>
      {[
        { key: "oemRestrictions", label: "OEM / Manufacturer Restrictions", placeholder: "e.g. Must use approved fonts, no competitor mentions, co-op guidelines..." },
        { key: "brandGuidelines", label: "Brand Guidelines & Standards", placeholder: "e.g. Color codes, logo usage rules, tone of voice..." },
        { key: "additionalRestrictions", label: "Additional Restrictions or Notes", placeholder: "Any other compliance requirements..." },
      ].map(f => (
        <div key={f.key}>
          <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wide">{f.label}</label>
          <Textarea
            value={data[f.key] ?? ""}
            onChange={e => onChange(f.key, e.target.value)}
            placeholder={f.placeholder}
            className="bg-zinc-800 border-zinc-700 text-white"
            rows={3}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Step 6: Acknowledgements ─────────────────────────────────────────────────
function Step6({ acks, onChange }: {
  acks: { deliverables: boolean; policies: boolean };
  onChange: (k: "deliverables" | "policies", v: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">Please review and acknowledge the following before submitting your onboarding.</p>
      {[
        {
          key: "deliverables" as const,
          title: "Deliverables Agreement",
          body: "I understand that Loomelic Media will produce monthly content including photography, videography, social media posts, and digital advertising materials based on the information provided in this onboarding. Turnaround times and revision policies are as outlined in the service agreement.",
        },
        {
          key: "policies" as const,
          title: "Platform & Data Policies",
          body: "I authorize Loomelic Media to access and manage the social media accounts and platforms listed in this onboarding on behalf of my dealership. I understand that all credentials will be stored securely and used solely for content management purposes.",
        },
      ].map(item => (
        <Card key={item.key} className={`border-2 transition-all cursor-pointer ${acks[item.key] ? "border-[oklch(0.85_0.23_110)] bg-[oklch(0.85_0.23_110)]/5" : "border-zinc-700 bg-zinc-800/50"}`}
          onClick={() => onChange(item.key, !acks[item.key])}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${acks[item.key] ? "bg-[oklch(0.85_0.23_110)] border-[oklch(0.85_0.23_110)]" : "border-zinc-500"}`}>
                {acks[item.key] && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.body}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Step 7: Documents ────────────────────────────────────────────────────────
function Step7({ token, files }: { token: string; files: Array<{ filename?: string | null; url: string }> }) {
  
  const uploadMutation = trpc.dealer.uploadFile.useMutation({
    onSuccess: () => toast.success("File uploaded successfully"),
    onError: (e) => toast.error("Upload failed: " + e.message),
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadMutation.mutate({ token, filename: file.name, mimeType: file.type, base64, sizeBytes: file.size });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">Upload any brand assets, logo files, brand guides, or other documents for Loomelic to reference.</p>
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-600 rounded-lg cursor-pointer hover:border-[oklch(0.85_0.23_110)] transition-colors bg-zinc-800/30">
        <div className="text-center">
          {uploadMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin text-zinc-400 mx-auto mb-2" /> : <FileText className="w-6 h-6 text-zinc-400 mx-auto mb-2" />}
          <p className="text-sm text-zinc-400">Click to upload a file</p>
          <p className="text-xs text-zinc-500 mt-1">PDF, PNG, JPG, SVG, ZIP up to 16MB</p>
        </div>
        <input type="file" className="hidden" onChange={handleFile} accept=".pdf,.png,.jpg,.jpeg,.svg,.zip,.ai,.eps" />
      </label>
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
              <FileText className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-300 hover:text-white truncate flex-1">
                {f.filename ?? "File"}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Dealer Portal ───────────────────────────────────────────────────────
export default function DealerPortal() {
  const [token, setToken] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  });
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Record<string, string>>({});
  const [contacts, setContacts] = useState<Array<Record<string, string>>>([]);
  const [monthlyInputs, setMonthlyInputs] = useState<Array<Record<string, string>>>([]);
  const [platforms, setPlatforms] = useState<Array<Record<string, string>>>([]);
  const [complianceData, setComplianceData] = useState<Record<string, string>>({});
  const [acks, setAcks] = useState({ deliverables: false, policies: false });
  const [submitted, setSubmitted] = useState(false);
  

  const { data, isLoading, error, refetch } = trpc.dealer.getDealerByToken.useQuery(
    { token: token! },
    { enabled: !!token, retry: false }
  );

  const saveStep1 = trpc.dealer.saveStep1.useMutation({ onSuccess: () => { refetch(); setStep(2); } });
  const saveStep2 = trpc.dealer.saveStep2.useMutation({ onSuccess: () => { refetch(); setStep(3); } });
  const saveStep3 = trpc.dealer.saveStep3.useMutation({ onSuccess: () => { refetch(); setStep(4); } });
  const saveStep4 = trpc.dealer.saveStep4.useMutation({ onSuccess: () => { refetch(); setStep(5); } });
  const saveStep5 = trpc.dealer.saveStep5.useMutation({ onSuccess: () => { refetch(); setStep(6); } });
  const saveStep6 = trpc.dealer.saveStep6.useMutation({ onSuccess: () => { refetch(); setStep(7); } });
  const submitMutation = trpc.dealer.submitOnboarding.useMutation({
    onSuccess: () => { refetch(); setSubmitted(true); },
    onError: (e) => toast.error("Submission failed: " + e.message),
  });

  if (!token) return <TokenGate onToken={setToken} />;
  if (isLoading) return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.85_0.23_110)]" />
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] flex items-center justify-center p-6">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Invalid Token</h2>
        <p className="text-zinc-400 mb-4">This invite link is invalid or has expired.</p>
        <Button onClick={() => setToken(null)} variant="outline" className="border-zinc-700 text-zinc-300">Try Another Token</Button>
      </div>
    </div>
  );

  const dealer = data!.dealer;
  const statusCfg = STATUS_CONFIG[dealer.status] ?? STATUS_CONFIG.invited;

  // Submitted / Active state
  if (submitted || dealer.status === "submitted" || dealer.status === "under_review" || dealer.status === "approved" || dealer.status === "active") {
    return (
      <div className="min-h-screen bg-[oklch(0.07_0_0)] p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[oklch(0.85_0.23_110)] mb-4">
              <CheckCircle2 className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">{dealer.storeName ?? "Your Dealership"}</h1>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${statusCfg.color}`}>
              {statusCfg.icon} {statusCfg.label}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Contacts", value: data!.contacts.length, icon: <Users className="w-4 h-4" /> },
              { label: "Promotions", value: data!.monthlyInputs.length, icon: <Calendar className="w-4 h-4" /> },
              { label: "Documents", value: data!.files.length, icon: <FileText className="w-4 h-4" /> },
            ].map(stat => (
              <Card key={stat.label} className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-4 pb-4 flex items-center gap-3">
                  <div className="text-[oklch(0.85_0.23_110)]">{stat.icon}</div>
                  <div>
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-xs text-zinc-500">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data!.comments.length > 0 && (
            <Card className="bg-zinc-900 border-zinc-800 mb-4">
              <CardHeader><CardTitle className="text-white text-sm">Messages from Loomelic</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {data!.comments.filter(c => c.isAdminComment).map((c, i) => (
                  <div key={i} className="p-3 bg-zinc-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[oklch(0.85_0.23_110)]">{c.authorName}</span>
                      <span className="text-xs text-zinc-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-zinc-300">{c.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <p className="text-center text-zinc-500 text-sm">
            Questions? Contact your Loomelic account manager.
          </p>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (!token) return;
    if (step === 1) saveStep1.mutate({ token, ...step1Data });
    else if (step === 2) saveStep2.mutate({ token, contacts: contacts as Parameters<typeof saveStep2.mutate>[0]["contacts"] });
    else if (step === 3) saveStep3.mutate({ token, inputs: monthlyInputs as Parameters<typeof saveStep3.mutate>[0]["inputs"] });
    else if (step === 4) saveStep4.mutate({ token, platforms });
    else if (step === 5) saveStep5.mutate({ token, ...complianceData });
    else if (step === 6) {
      if (!acks.deliverables || !acks.policies) {
        toast.success("Please acknowledge both items before continuing");
        return;
      }
      saveStep6.mutate({ token, acknowledgedDeliverables: 1, acknowledgedPolicies: 1 });
    } else if (step === 7) {
      submitMutation.mutate({ token });
    }
  };

  const isSaving = saveStep1.isPending || saveStep2.isPending || saveStep3.isPending ||
    saveStep4.isPending || saveStep5.isPending || saveStep6.isPending || submitMutation.isPending;

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">Dealer Onboarding</h1>
            <p className="text-zinc-400 text-sm">{dealer.storeName ?? "Welcome"} — Step {step} of {STEPS.length}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusCfg.color}`}>
              {statusCfg.icon} {statusCfg.label}
            </div>
            <a
              href="/dealer/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[oklch(0.85_0.23_110)] text-black text-xs font-bold hover:bg-[oklch(0.9_0.23_110)] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Admin
            </a>
          </div>
        </div>

        <StepBar current={step} total={STEPS.length} />

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {(() => { const Icon = STEPS[step - 1].icon; return <Icon className="w-5 h-5 text-[oklch(0.85_0.23_110)]" />; })()}
              {STEPS[step - 1].label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && <Step1 data={step1Data} onChange={(k, v) => setStep1Data(p => ({ ...p, [k]: v }))} />}
            {step === 2 && <Step2 contacts={contacts} onChange={setContacts} />}
            {step === 3 && <Step3 inputs={monthlyInputs} onChange={setMonthlyInputs} />}
            {step === 4 && <Step4 platforms={platforms} onChange={setPlatforms} />}
            {step === 5 && <Step5 data={complianceData} onChange={(k, v) => setComplianceData(p => ({ ...p, [k]: v }))} />}
            {step === 6 && <Step6 acks={acks} onChange={(k, v) => setAcks(p => ({ ...p, [k]: v }))} />}
            {step === 7 && <Step7 token={token} files={data!.files} />}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1 || isSaving}
            className="border-zinc-700 text-zinc-300"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={isSaving}
            className="bg-[oklch(0.85_0.23_110)] text-black font-bold hover:bg-[oklch(0.78_0.23_110)]"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {step === 7 ? "Submit Onboarding" : "Save & Continue"}
            {step < 7 && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
