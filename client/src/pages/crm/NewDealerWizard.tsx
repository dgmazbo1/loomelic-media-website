import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Globe, Building2, Search, FileText, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const BRANDS = [
  "Lexus", "Subaru", "Toyota", "Honda", "Nissan", "Ford", "Chevrolet", "GMC",
  "Kia", "Hyundai", "Mazda", "Volkswagen", "Audi", "BMW", "Mercedes-Benz",
  "Land Rover", "Jaguar", "Porsche", "MINI", "Acura", "Genesis",
  "Chrysler", "Dodge", "Jeep", "Ram", "Other",
];

const AREAS = [
  "Northlake/Lake Park", "Northlake", "Lake Park/US-1", "Northlake/North Palm", "North Palm",
  "WPB Okeechobee", "WPB Okeechobee (west)", "WPB South", "WPB South/Military",
  "Royal Palm Beach", "Lake Worth/Greenacres", "Greenacres", "Delray", "Riviera Beach",
];

export default function NewDealerWizard() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    dealerWebsiteUrl: "", dealershipName: "", addressStreet: "", addressCity: "",
    addressState: "FL", addressZip: "", mainPhone: "", primaryBrand: "",
    brandOverride: "", areaBucket: "", dayPlan: "Day 1" as string,
    priority: "High" as string, headshotAddon: false,
    contactFirstName: "", contactLastName: "", contactTitle: "", contactEmail: "", contactPhone: "",
  });

  const [dealerId, setDealerId] = useState<number | null>(null);
  const [proposalSlug, setProposalSlug] = useState("");

  const createMutation = trpc.dealerGrowth.dealership.create.useMutation({
    onSuccess: (data) => { setDealerId(data.id); toast.success("Dealership created"); setStep(3); },
  });
  const createContactMutation = trpc.dealerGrowth.contact.create.useMutation({ onSuccess: () => toast.success("Contact saved") });
  const auditMutation = trpc.dealerGrowth.dealership.runAudit.useMutation({ onSuccess: () => toast.success("Audit complete") });
  const generateMutation = trpc.dealerGrowth.dealership.generateProposal.useMutation({
    onSuccess: (data) => { setProposalSlug(data.slug); toast.success("Proposal generated"); setStep(5); },
  });
  const sendMutation = trpc.dealerGrowth.proposal.send.useMutation({ onSuccess: () => toast.success("Sent!") });

  const updateField = (key: string, value: any) => setForm(p => ({ ...p, [key]: value }));

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/growth")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-xl font-bold">New Dealership</h1>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1">
          {["URL", "Info", "Audit", "Generate", "Send"].map((label, i) => (
            <div key={label} className="flex-1 text-center">
              <div className={`h-1 rounded-full mb-1 ${i + 1 <= step ? 'bg-primary' : 'bg-muted'}`} />
              <span className={`text-[10px] ${i + 1 <= step ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: URL */}
        {step === 1 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center mb-2">
                <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                <h2 className="text-lg font-bold">Paste Dealer Website</h2>
              </div>
              <div>
                <Label>Website URL</Label>
                <Input placeholder="https://www.dealership.com" value={form.dealerWebsiteUrl} onChange={e => updateField("dealerWebsiteUrl", e.target.value)} className="h-12" autoFocus />
              </div>
              <Button className="w-full h-12" onClick={() => setStep(2)}>
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Confirm Info */}
        {step === 2 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><Building2 className="h-5 w-5" /> Dealer Info</h2>
              <div>
                <Label>Dealership Name *</Label>
                <Input value={form.dealershipName} onChange={e => updateField("dealershipName", e.target.value)} className="h-12" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Street</Label><Input value={form.addressStreet} onChange={e => updateField("addressStreet", e.target.value)} /></div>
                <div><Label>City</Label><Input value={form.addressCity} onChange={e => updateField("addressCity", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>State</Label><Input value={form.addressState} onChange={e => updateField("addressState", e.target.value)} /></div>
                <div><Label>ZIP</Label><Input value={form.addressZip} onChange={e => updateField("addressZip", e.target.value)} /></div>
                <div><Label>Phone</Label><Input value={form.mainPhone} onChange={e => updateField("mainPhone", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Area</Label>
                  <Select value={form.areaBucket} onValueChange={v => updateField("areaBucket", v)}>
                    <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
                    <SelectContent>{AREAS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Day Plan</Label>
                  <Select value={form.dayPlan} onValueChange={v => updateField("dayPlan", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["Day 1", "Day 2", "Day 3", "Day 4"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Primary Brand</Label>
                <Select value={form.brandOverride} onValueChange={v => updateField("brandOverride", v)}>
                  <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>{BRANDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <h3 className="text-sm font-medium pt-2">Contact (optional)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>First Name</Label><Input value={form.contactFirstName} onChange={e => updateField("contactFirstName", e.target.value)} /></div>
                <div><Label>Last Name</Label><Input value={form.contactLastName} onChange={e => updateField("contactLastName", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Title</Label><Input value={form.contactTitle} onChange={e => updateField("contactTitle", e.target.value)} placeholder="GM" /></div>
                <div><Label>Email</Label><Input type="email" value={form.contactEmail} onChange={e => updateField("contactEmail", e.target.value)} /></div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (!form.dealershipName.trim()) { toast.error("Name required"); return; }
                    createMutation.mutate({
                      dealershipName: form.dealershipName,
                      dealerWebsiteUrl: form.dealerWebsiteUrl,
                      addressStreet: form.addressStreet,
                      addressCity: form.addressCity,
                      addressState: form.addressState,
                      addressZip: form.addressZip,
                      mainPhone: form.mainPhone,
                      areaBucket: form.areaBucket,
                      dayPlan: form.dayPlan as any,
                      priority: form.priority as any,
                      brandOverride: form.brandOverride,
                      headshotAddon: form.headshotAddon,
                    });
                  }}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Saving..." : "Save & Continue"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Audit */}
        {step === 3 && dealerId && (
          <Card>
            <CardContent className="p-6 space-y-4 text-center">
              <Search className="h-8 w-8 text-primary mx-auto" />
              <h2 className="text-lg font-bold">Run Audit</h2>
              <p className="text-sm text-muted-foreground">Discover social presence and staff page info</p>
              <Button
                className="w-full h-12"
                onClick={() => {
                  auditMutation.mutate({ dealershipId: dealerId });
                  // Save contact if provided
                  if (form.contactFirstName) {
                    createContactMutation.mutate({
                      dealershipId: dealerId,
                      firstName: form.contactFirstName,
                      lastName: form.contactLastName,
                      title: form.contactTitle,
                      email: form.contactEmail,
                      phone: form.contactPhone,
                    });
                  }
                }}
                disabled={auditMutation.isPending}
              >
                {auditMutation.isPending ? "Running Audit..." : "Run Audit Now"}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setStep(4)}>
                Skip Audit
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Generate */}
        {step === 4 && dealerId && (
          <Card>
            <CardContent className="p-6 space-y-4 text-center">
              <FileText className="h-8 w-8 text-primary mx-auto" />
              <h2 className="text-lg font-bold">Generate Proposal</h2>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg text-left">
                <div>
                  <p className="text-sm font-medium">Two-Day Headshot Session</p>
                  <p className="text-xs text-muted-foreground">One-time: $2,000</p>
                </div>
                <Switch checked={form.headshotAddon} onCheckedChange={v => updateField("headshotAddon", v)} />
              </div>
              <Button
                className="w-full h-12"
                onClick={() => generateMutation.mutate({ dealershipId: dealerId, brandOverride: form.brandOverride, headshotAddon: form.headshotAddon })}
                disabled={generateMutation.isPending}
              >
                {generateMutation.isPending ? "Generating..." : "Generate Microsite"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Send */}
        {step === 5 && dealerId && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <Send className="h-8 w-8 text-primary mx-auto mb-2" />
                <h2 className="text-lg font-bold">Send Proposal</h2>
              </div>
              {proposalSlug && (
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Microsite</p>
                  <p className="text-sm font-mono break-all">{window.location.origin}/p/{proposalSlug}</p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => window.open(`/growth/p/${proposalSlug}`, '_blank')}>Preview</Button>
                </div>
              )}
              <div>
                <Label>Send to</Label>
                <Input type="email" value={form.contactEmail} onChange={e => updateField("contactEmail", e.target.value)} className="h-12" />
              </div>
              <Button
                className="w-full h-12"
                onClick={() => {
                  if (!form.contactEmail) { toast.error("Enter email"); return; }
                  sendMutation.mutate({ dealershipId: dealerId, recipientEmail: form.contactEmail });
                }}
                disabled={sendMutation.isPending}
              >
                {sendMutation.isPending ? "Sending..." : "Send Proposal"}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setLocation(`/growth/dealership/${dealerId}`)}>
                Done — View Dealership
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
