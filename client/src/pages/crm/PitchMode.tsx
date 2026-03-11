import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Zap, ArrowLeft, Send, FileText, Search, Calendar, CheckCircle2, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";

const BRANDS = [
  "Lexus", "Subaru", "Toyota", "Honda", "Nissan", "Ford", "Chevrolet", "GMC",
  "Kia", "Hyundai", "Mazda", "Volkswagen", "Audi", "BMW", "Mercedes-Benz",
  "Land Rover", "Jaguar", "Porsche", "MINI", "Acura", "Genesis",
  "Chrysler", "Dodge", "Jeep", "Ram", "Other",
];

const OUTCOMES = ["No Answer", "Spoke Briefly", "Interested", "Not Interested", "Follow-up Requested"];

export default function PitchMode() {
  const params = useParams<{ id: string }>();
  const dealershipId = params.id ? parseInt(params.id) : undefined;
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const { data: existingDealer } = trpc.dealerGrowth.dealership.get.useQuery(
    { id: dealershipId! },
    { enabled: !!dealershipId }
  );

  const [step, setStep] = useState(1);
  const [dealerUrl, setDealerUrl] = useState("");
  const [dealerName, setDealerName] = useState("");
  const [brand, setBrand] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [outcome, setOutcome] = useState("Interested");
  const [headshotAddon, setHeadshotAddon] = useState(false);
  const [currentDealerId, setCurrentDealerId] = useState<number | undefined>(dealershipId);
  const [proposalSlug, setProposalSlug] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (existingDealer) {
      setDealerUrl(existingDealer.dealerWebsiteUrl || "");
      setDealerName(existingDealer.dealershipName);
      setBrand(existingDealer.brandOverride || existingDealer.primaryBrand || "");
      setCurrentDealerId(existingDealer.id);
      setHeadshotAddon(existingDealer.headshotAddon || false);
      if (existingDealer.proposalSlug) setProposalSlug(existingDealer.proposalSlug);
      setStep(2);
    }
  }, [existingDealer]);

  const createDealerMutation = trpc.dealerGrowth.dealership.create.useMutation({
    onSuccess: (data) => {
      setCurrentDealerId(data.id);
      toast.success("Dealer saved");
      setStep(3);
    },
  });

  const createContactMutation = trpc.dealerGrowth.contact.create.useMutation({
    onSuccess: () => toast.success("Contact saved"),
  });

  const generateMutation = trpc.dealerGrowth.dealership.generateProposal.useMutation({
    onSuccess: (data) => {
      setProposalSlug(data.slug);
      toast.success("Proposal generated!");
      setStep(4);
    },
  });

  const auditMutation = trpc.dealerGrowth.dealership.runAudit.useMutation({
    onSuccess: () => toast.success("Audit complete"),
  });

  const sendMutation = trpc.dealerGrowth.proposal.send.useMutation({
    onSuccess: () => {
      setSent(true);
      toast.success("Proposal sent!");
      setStep(5);
    },
  });

  const visitMutation = trpc.dealerGrowth.visitLog.create.useMutation({
    onSuccess: () => toast.success("Visit logged"),
  });


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Button variant="ghost" size="sm" onClick={() => setLocation(currentDealerId ? `/dealership/${currentDealerId}` : "/")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-bold text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.12em" }}>RAPID PITCH</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Progress */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        {/* Step 1: Dealer URL */}
        {step === 1 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center mb-4">
                <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                <h2 className="text-lg font-bold">Dealer Website</h2>
                <p className="text-sm text-muted-foreground">Paste the dealer's website URL</p>
              </div>
              <div>
                <Input
                  placeholder="https://www.dealership.com"
                  value={dealerUrl}
                  onChange={e => setDealerUrl(e.target.value)}
                  className="text-lg h-12"
                  autoFocus
                />
              </div>
              <div>
                <Label>Dealer Name</Label>
                <Input
                  placeholder="ABC Motors"
                  value={dealerName}
                  onChange={e => setDealerName(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button
                className="w-full h-12 text-lg"
                onClick={() => {
                  if (!dealerName.trim()) { toast.error("Enter dealer name"); return; }
                  setStep(2);
                }}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Brand + Contact */}
        {step === 2 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold">Brand & Contact</h2>

              <div>
                <Label>Primary Brand</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>
                    {BRANDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Contact Name</Label>
                  <Input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="John Smith" className="h-12" />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input value={contactTitle} onChange={e => setContactTitle(e.target.value)} placeholder="GM" className="h-12" />
                </div>
              </div>

              <div>
                <Label>Contact Email</Label>
                <Input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="john@dealer.com" className="h-12" />
              </div>

              <div>
                <Label>Visit Outcome</Label>
                <Select value={outcome} onValueChange={setOutcome}>
                  <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {OUTCOMES.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Two-Day Headshot Session</p>
                  <p className="text-xs text-muted-foreground">One-time: $2,000</p>
                </div>
                <Switch checked={headshotAddon} onCheckedChange={setHeadshotAddon} />
              </div>

              <Button
                className="w-full h-12 text-lg"
                onClick={async () => {
                  if (!currentDealerId) {
                    createDealerMutation.mutate({
                      dealershipName: dealerName,
                      dealerWebsiteUrl: dealerUrl,
                      brandOverride: brand,
                      headshotAddon,
                    });
                  } else {
                    // Save contact if provided
                    if (contactName) {
                      const [firstName, ...rest] = contactName.split(" ");
                      createContactMutation.mutate({
                        dealershipId: currentDealerId,
                        firstName,
                        lastName: rest.join(" "),
                        title: contactTitle,
                        email: contactEmail,
                      });
                    }
                    // Log visit
                    visitMutation.mutate({
                      dealershipId: currentDealerId,
                      outcome: outcome as any,
                    });
                    setStep(3);
                  }
                }}
                disabled={createDealerMutation.isPending}
              >
                {createDealerMutation.isPending ? "Saving..." : "Save & Continue"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Generate Proposal */}
        {step === 3 && currentDealerId && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center mb-4">
                <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                <h2 className="text-lg font-bold">Generate Proposal</h2>
                <p className="text-sm text-muted-foreground">Create a custom microsite for {dealerName}</p>
              </div>

              <Button
                className="w-full h-14 text-lg gap-2"
                onClick={() => generateMutation.mutate({ dealershipId: currentDealerId!, brandOverride: brand, headshotAddon })}
                disabled={generateMutation.isPending}
              >
                <FileText className="h-5 w-5" />
                {generateMutation.isPending ? "Generating..." : "Generate Proposal Microsite"}
              </Button>

              <Button
                variant="outline" className="w-full h-12 gap-2"
                onClick={() => auditMutation.mutate({ dealershipId: currentDealerId! })}
                disabled={auditMutation.isPending}
              >
                <Search className="h-4 w-4" />
                {auditMutation.isPending ? "Running Audit..." : "Run Quick Audit"}
              </Button>

              {proposalSlug && (
                <Button variant="outline" className="w-full" onClick={() => window.open(`/growth/p/${proposalSlug}`, '_blank')}>
                  Preview Microsite
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Send */}
        {step === 4 && currentDealerId && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center mb-4">
                <Send className="h-8 w-8 text-primary mx-auto mb-2" />
                <h2 className="text-lg font-bold">Send Proposal</h2>
              </div>

              {proposalSlug && (
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Microsite URL</p>
                  <p className="text-sm font-mono break-all">{window.location.origin}/p/{proposalSlug}</p>
                </div>
              )}

              <div>
                <Label>Send to Email</Label>
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="contact@dealer.com"
                  className="h-12"
                />
              </div>

              <Button
                className="w-full h-14 text-lg gap-2"
                onClick={() => {
                  if (!contactEmail) { toast.error("Enter email"); return; }
                  sendMutation.mutate({ dealershipId: currentDealerId!, recipientEmail: contactEmail });
                }}
                disabled={sendMutation.isPending || !contactEmail}
              >
                <Send className="h-5 w-5" />
                {sendMutation.isPending ? "Sending..." : "Send Proposal Email"}
              </Button>

              <Button variant="outline" className="w-full" onClick={() => setStep(5)}>
                Skip — Send Later
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Done */}
        {step === 5 && (
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-xl font-bold">{sent ? "Proposal Sent!" : "All Set!"}</h2>
              <p className="text-muted-foreground">
                {sent ? `Proposal sent to ${contactEmail}` : "Proposal ready to send when you're ready."}
              </p>

              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={() => setLocation("/growth")} className="w-full">
                  Back to Dashboard
                </Button>
                {currentDealerId && (
                  <Button variant="outline" onClick={() => setLocation(`/growth/dealership/${currentDealerId}`)} className="w-full">
                    View Dealership
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep(1); setDealerUrl(""); setDealerName(""); setBrand("");
                    setContactName(""); setContactEmail(""); setContactTitle("");
                    setCurrentDealerId(undefined); setProposalSlug(""); setSent(false);
                  }}
                  className="w-full"
                >
                  <Zap className="h-4 w-4 mr-2" /> Start New Pitch
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
