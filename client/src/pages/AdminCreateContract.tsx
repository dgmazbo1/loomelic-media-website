import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, ChevronRight, ChevronLeft, Check, Copy, Wand2, FileText, User, DollarSign, Home, Camera, FileCheck, Link } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

// ─── Step definitions ───────────────────────────────────────────────────────

const SLIDES = [
  { id: 1, label: "Contractor", icon: User },
  { id: 2, label: "Compensation", icon: DollarSign },
  { id: 3, label: "Travel & Housing", icon: Home },
  { id: 4, label: "Equipment", icon: Camera },
  { id: 5, label: "Deliverables", icon: FileText },
  { id: 6, label: "Review", icon: FileCheck },
  { id: 7, label: "Done", icon: Link },
];

const CONTRACTOR_ROLES = [
  "Lead Photographer",
  "Second Photographer",
  "Videographer",
  "Lead Videographer",
  "Drone Operator",
  "Photo Editor",
  "Video Editor",
  "Content Creator",
  "Social Media Manager",
  "Production Assistant",
  "Other",
];

const PAYMENT_METHODS = ["Zelle", "Venmo", "Cash App", "Wire Transfer", "Check", "ACH", "PayPal"];

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminCreateContract() {
  const [, navigate] = useLocation();
  const [slide, setSlide] = useState(1);
  const [signingLink, setSigningLink] = useState<string | null>(null);
  const [equipmentRaw, setEquipmentRaw] = useState("");
  const [equipmentDescription, setEquipmentDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [form, setForm] = useState({
    contractorName: "",
    contractorEmail: "",
    contractorRole: "",
    projectName: "",
    projectLocation: "",
    eventCity: "",
    totalFee: "",
    deposit: "",
    finalPayment: "",
    paymentMethod: "",
    checkinDate: "",
    checkoutDate: "",
    airbnbAddress: "",
    deliverables: "",
    notes: "",
  });

  const set = (field: keyof typeof form, value: string) =>
    setForm(p => ({ ...p, [field]: value }));

  const createMutation = trpc.contract.createContract.useMutation();
  const generateEquipmentMutation = trpc.contract.generateEquipmentDescription.useMutation();

  const handleGenerateEquipment = async () => {
    if (!equipmentRaw.trim()) {
      toast.error("Please enter equipment details first");
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateEquipmentMutation.mutateAsync({ equipmentNotes: equipmentRaw });
      setEquipmentDescription(result.description);
      toast.success("Equipment description generated");
    } catch (e: any) {
      toast.error("Failed to generate: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const equipment = JSON.stringify({ raw: equipmentRaw, description: equipmentDescription });
      const result = await createMutation.mutateAsync({
        ...form,
        equipment,
      });
      setSigningLink(`${window.location.origin}/vendor/sign/${result.token}`);
      setSlide(7);
      toast.success("Contract created successfully!");
    } catch (e: any) {
      toast.error("Failed to create contract: " + e.message);
    }
  };

  const copyLink = () => {
    if (signingLink) {
      navigator.clipboard.writeText(signingLink);
      toast.success("Signing link copied to clipboard!");
    }
  };

  const canAdvance = () => {
    if (slide === 1) return form.contractorName && form.contractorEmail && form.contractorRole;
    if (slide === 2) return form.totalFee;
    return true;
  };

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-black font-black text-xs">LM</span>
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest">Admin</p>
            <p className="text-sm font-semibold">Create Contractor Agreement</p>
          </div>
        </div>
        <Button variant="ghost" onClick={() => navigate("/admin/crm")} className="text-white/50 hover:text-white text-sm">
          ← Back to CRM
        </Button>
      </div>

      {/* Slide tabs */}
      <div className="border-b border-white/10 bg-black/20 overflow-x-auto">
        <div className="flex min-w-max px-4">
          {SLIDES.map((s) => {
            const Icon = s.icon;
            const isActive = s.id === slide;
            const isDone = s.id < slide;
            return (
              <button
                key={s.id}
                onClick={() => s.id < slide && setSlide(s.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-white text-white"
                    : isDone
                    ? "border-green-500 text-green-400 cursor-pointer hover:text-green-300"
                    : "border-transparent text-white/30 cursor-default"
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* ── Slide 1: Contractor Info ── */}
        {slide === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Contractor Information</h2>
              <p className="text-white/50 text-sm">Enter the contractor's details for this agreement.</p>
            </div>
            <Card className="bg-slate-900/60 border-slate-700 p-6 space-y-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-white/50">Full Name *</Label>
                <Input value={form.contractorName} onChange={e => set("contractorName", e.target.value)}
                  className="bg-slate-800 border-slate-600 mt-1" placeholder="Jane Smith" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-white/50">Email Address *</Label>
                <Input type="email" value={form.contractorEmail} onChange={e => set("contractorEmail", e.target.value)}
                  className="bg-slate-800 border-slate-600 mt-1" placeholder="jane@example.com" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-white/50">Contractor Role *</Label>
                <Select value={form.contractorRole} onValueChange={v => set("contractorRole", v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 mt-1">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACTOR_ROLES.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>
        )}

        {/* ── Slide 2: Compensation ── */}
        {slide === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Compensation</h2>
              <p className="text-white/50 text-sm">Set the payment terms for this contract.</p>
            </div>
            <Card className="bg-slate-900/60 border-slate-700 p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-white/50">Total Fee *</Label>
                  <Input value={form.totalFee} onChange={e => set("totalFee", e.target.value)}
                    className="bg-slate-800 border-slate-600 mt-1" placeholder="2500" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-white/50">Deposit</Label>
                  <Input value={form.deposit} onChange={e => set("deposit", e.target.value)}
                    className="bg-slate-800 border-slate-600 mt-1" placeholder="500" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-white/50">Final Payment</Label>
                  <Input value={form.finalPayment} onChange={e => set("finalPayment", e.target.value)}
                    className="bg-slate-800 border-slate-600 mt-1" placeholder="2000" />
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-white/50">Payment Method</Label>
                <Select value={form.paymentMethod} onValueChange={v => set("paymentMethod", v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 mt-1">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>
        )}

        {/* ── Slide 3: Travel & Housing ── */}
        {slide === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Travel & Housing</h2>
              <p className="text-white/50 text-sm">Project location and accommodation details.</p>
            </div>
            <Card className="bg-slate-900/60 border-slate-700 p-6 space-y-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-white/50">Project Name</Label>
                <Input value={form.projectName} onChange={e => set("projectName", e.target.value)}
                  className="bg-slate-800 border-slate-600 mt-1" placeholder="Raiders Season Opener" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-white/50">Project Location</Label>
                <Input value={form.projectLocation} onChange={e => set("projectLocation", e.target.value)}
                  className="bg-slate-800 border-slate-600 mt-1" placeholder="Allegiant Stadium, Las Vegas NV" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-white/50">Event City</Label>
                <Input value={form.eventCity} onChange={e => set("eventCity", e.target.value)}
                  className="bg-slate-800 border-slate-600 mt-1" placeholder="Las Vegas, NV" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-white/50">Check-in Date</Label>
                  <Input type="date" value={form.checkinDate} onChange={e => set("checkinDate", e.target.value)}
                    className="bg-slate-800 border-slate-600 mt-1" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-white/50">Check-out Date</Label>
                  <Input type="date" value={form.checkoutDate} onChange={e => set("checkoutDate", e.target.value)}
                    className="bg-slate-800 border-slate-600 mt-1" />
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-white/50">Housing Address (Airbnb/Hotel)</Label>
                <Textarea value={form.airbnbAddress} onChange={e => set("airbnbAddress", e.target.value)}
                  className="bg-slate-800 border-slate-600 mt-1 resize-none" rows={2}
                  placeholder="123 Main St, Las Vegas NV 89101" />
              </div>
            </Card>
          </div>
        )}

        {/* ── Slide 4: Equipment ── */}
        {slide === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Equipment</h2>
              <p className="text-white/50 text-sm">List equipment, then use AI to generate a professional description.</p>
            </div>
            <Card className="bg-slate-900/60 border-slate-700 p-6 space-y-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-white/50">Equipment Notes</Label>
                <Textarea value={equipmentRaw} onChange={e => setEquipmentRaw(e.target.value)}
                  className="bg-slate-800 border-slate-600 mt-1 resize-none" rows={4}
                  placeholder="Sony A7IV, 24-70mm lens, DJI Mavic 3 drone, 2x batteries, gimbal..." />
              </div>
              <Button onClick={handleGenerateEquipment} disabled={isGenerating || !equipmentRaw.trim()}
                variant="outline" className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                Generate Professional Description with AI
              </Button>
              {equipmentDescription && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <Label className="text-xs uppercase tracking-wider text-purple-300 mb-2 block">AI-Generated Description</Label>
                  <Textarea value={equipmentDescription} onChange={e => setEquipmentDescription(e.target.value)}
                    className="bg-transparent border-0 text-white/80 text-sm resize-none p-0 focus-visible:ring-0" rows={4} />
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── Slide 5: Deliverables & Notes ── */}
        {slide === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Deliverables & Legal</h2>
              <p className="text-white/50 text-sm">Specify what the contractor will deliver and any additional terms.</p>
            </div>
            <Card className="bg-slate-900/60 border-slate-700 p-6 space-y-4">
              <div>
                <Label className="text-xs uppercase tracking-wider text-white/50">Deliverables</Label>
                <Textarea value={form.deliverables} onChange={e => set("deliverables", e.target.value)}
                  className="bg-slate-800 border-slate-600 mt-1 resize-none" rows={4}
                  placeholder="500 edited photos delivered within 7 days, RAW files included, 3 highlight reels..." />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-white/50">Additional Notes</Label>
                <Textarea value={form.notes} onChange={e => set("notes", e.target.value)}
                  className="bg-slate-800 border-slate-600 mt-1 resize-none" rows={3}
                  placeholder="Any special instructions, NDA clauses, or additional terms..." />
              </div>
            </Card>
          </div>
        )}

        {/* ── Slide 6: Review ── */}
        {slide === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Review & Create</h2>
              <p className="text-white/50 text-sm">Review all details before generating the signing link.</p>
            </div>
            <Card className="bg-slate-900/60 border-slate-700 p-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {[
                  ["Contractor", form.contractorName],
                  ["Email", form.contractorEmail],
                  ["Role", form.contractorRole],
                  ["Project", form.projectName],
                  ["Location", form.projectLocation],
                  ["Event City", form.eventCity],
                  ["Total Fee", form.totalFee ? `$${form.totalFee}` : ""],
                  ["Deposit", form.deposit ? `$${form.deposit}` : ""],
                  ["Final Payment", form.finalPayment ? `$${form.finalPayment}` : ""],
                  ["Payment Method", form.paymentMethod],
                  ["Check-in", form.checkinDate],
                  ["Check-out", form.checkoutDate],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
                    <p className="text-white font-medium mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              {equipmentDescription && (
                <div className="border-t border-white/10 mt-4 pt-4">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Equipment</p>
                  <p className="text-white/70 text-sm">{equipmentDescription.slice(0, 200)}...</p>
                </div>
              )}
            </Card>
            <Button onClick={handleSubmit} disabled={createMutation.isPending}
              className="w-full bg-white text-black hover:bg-white/90 h-12 text-base font-semibold">
              {createMutation.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Creating Contract...</>
              ) : (
                <><FileCheck className="w-5 h-5 mr-2" /> Create Contract & Generate Link</>
              )}
            </Button>
          </div>
        )}

        {/* ── Slide 7: Done ── */}
        {slide === 7 && signingLink && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-1">Contract Created!</h2>
              <p className="text-white/50 text-sm">Share the signing link below with {form.contractorName}.</p>
            </div>
            <Card className="bg-slate-900/60 border-slate-700 p-6 space-y-3">
              <Label className="text-xs uppercase tracking-wider text-white/50 flex items-center gap-2">
                <Link className="w-3 h-3" /> Contractor Signing Link
              </Label>
              <div className="flex gap-2">
                <Input value={signingLink} readOnly className="bg-slate-800 border-slate-600 text-white/70 text-sm" />
                <Button onClick={copyLink} variant="outline" className="border-slate-600 text-white shrink-0">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-white/30 text-xs">
                Send this link to the contractor. They will review, complete their W-9, and sign electronically.
              </p>
            </Card>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/admin/crm")}
                className="flex-1 border-slate-600 text-white">
                Back to CRM
              </Button>
              <Button onClick={() => { setSlide(1); setForm({ contractorName: "", contractorEmail: "", contractorRole: "", projectName: "", projectLocation: "", eventCity: "", totalFee: "", deposit: "", finalPayment: "", paymentMethod: "", checkinDate: "", checkoutDate: "", airbnbAddress: "", deliverables: "", notes: "" }); setEquipmentRaw(""); setEquipmentDescription(""); setSigningLink(null); }}
                className="flex-1 bg-white text-black hover:bg-white/90">
                Create Another Contract
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        {slide < 7 && (
          <div className="flex gap-3 mt-8">
            {slide > 1 && (
              <Button variant="outline" onClick={() => setSlide(s => s - 1)}
                className="flex-1 border-slate-600 text-white">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            )}
            {slide < 6 && (
              <Button onClick={() => setSlide(s => s + 1)} disabled={!canAdvance()}
                className="flex-1 bg-white text-black hover:bg-white/90">
                Continue <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
