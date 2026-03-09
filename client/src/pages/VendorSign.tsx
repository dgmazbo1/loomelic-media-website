import { useState, useRef, useEffect } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText, Check, ChevronRight, ChevronLeft, PenTool } from "lucide-react";
import { toast } from "sonner";
import SignatureCanvas from "react-signature-canvas";
import { jsPDF } from "jspdf";

type Step = "review" | "w9" | "sign" | "done";

const steps: { id: Step; label: string }[] = [
  { id: "review", label: "Review Contract" },
  { id: "w9", label: "W-9 Tax Form" },
  { id: "sign", label: "Sign & Submit" },
  { id: "done", label: "Complete" },
];

export default function VendorSign() {
  const { token } = useParams<{ token: string }>();
  const [step, setStep] = useState<Step>("review");
  const [contractorSig, setContractorSig] = useState("");
  const [ndaSig, setNdaSig] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contractorSigRef = useRef<SignatureCanvas>(null);
  const ndaSigRef = useRef<SignatureCanvas>(null);

  const [w9, setW9] = useState({
    name: "",
    businessName: "",
    taxClassification: "" as any,
    llcTaxClassification: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    ssn: "",
    ein: "",
    accountNumbers: "",
    exemptPayeeCode: "",
    exemptFATCACode: "",
  });

  const { data: contract, isLoading, error } = trpc.contract.getByToken.useQuery(
    { token: token ?? "" },
    { enabled: !!token }
  );

  const { data: existingW9 } = trpc.contract.getW9.useQuery(
    { email: contract?.contractorEmail ?? "", year: new Date().getFullYear() },
    { enabled: !!contract?.contractorEmail }
  );

  useEffect(() => {
    if (existingW9) {
      setW9({
        name: existingW9.name,
        businessName: existingW9.businessName ?? "",
        taxClassification: existingW9.taxClassification,
        llcTaxClassification: existingW9.llcTaxClassification ?? "",
        address: existingW9.address,
        city: existingW9.city,
        state: existingW9.state,
        zipCode: existingW9.zipCode,
        ssn: existingW9.ssn ?? "",
        ein: existingW9.ein ?? "",
        accountNumbers: existingW9.accountNumbers ?? "",
        exemptPayeeCode: existingW9.exemptPayeeCode ?? "",
        exemptFATCACode: existingW9.exemptFATCACode ?? "",
      });
    }
  }, [existingW9]);

  const signMutation = trpc.contract.signContract.useMutation();

  const clearSig = (which: "contractor" | "nda") => {
    if (which === "contractor") {
      contractorSigRef.current?.clear();
      setContractorSig("");
    } else {
      ndaSigRef.current?.clear();
      setNdaSig("");
    }
  };

  const captureSig = (which: "contractor" | "nda") => {
    const ref = which === "contractor" ? contractorSigRef : ndaSigRef;
    if (!ref.current?.isEmpty()) {
      const data = ref.current!.toDataURL("image/png");
      if (which === "contractor") setContractorSig(data);
      else setNdaSig(data);
    }
  };

  const generatePDF = async (): Promise<string> => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Independent Contractor Agreement", 20, 20);
    doc.setFontSize(11);
    let y = 35;
    const line = (text: string) => {
      doc.text(text, 20, y);
      y += 7;
    };
    line(`Contractor: ${contract?.contractorName}`);
    line(`Email: ${contract?.contractorEmail}`);
    line(`Role: ${contract?.contractorRole ?? "N/A"}`);
    line(`Project: ${contract?.projectName ?? "N/A"}`);
    line(`Location: ${contract?.projectLocation ?? "N/A"}`);
    line(`Event City: ${contract?.eventCity ?? "N/A"}`);
    line(`Total Fee: $${contract?.totalFee ?? "N/A"}`);
    line(`Deposit: $${contract?.deposit ?? "N/A"}`);
    line(`Final Payment: $${contract?.finalPayment ?? "N/A"}`);
    line(`Payment Method: ${contract?.paymentMethod ?? "N/A"}`);
    line(`Check-in: ${contract?.checkinDate ?? "N/A"}`);
    line(`Check-out: ${contract?.checkoutDate ?? "N/A"}`);
    if (contract?.airbnbAddress) {
      line(`Housing: ${contract.airbnbAddress}`);
    }
    y += 5;
    line("Contractor Signature:");
    if (contractorSig) {
      doc.addImage(contractorSig, "PNG", 20, y, 80, 25);
      y += 30;
    }
    line("NDA Signature:");
    if (ndaSig) {
      doc.addImage(ndaSig, "PNG", 20, y, 80, 25);
    }
    return doc.output("datauristring");
  };

  const handleSubmit = async () => {
    if (!contractorSig || !ndaSig) {
      toast.error("Please provide both signatures before submitting");
      return;
    }
    if (!w9.name || !w9.taxClassification || !w9.address || !w9.city || !w9.state || !w9.zipCode) {
      toast.error("Please complete the W-9 form before submitting");
      return;
    }
    setIsSubmitting(true);
    try {
      const pdfData = await generatePDF();
      await signMutation.mutateAsync({
        token: token!,
        contractorSignature: contractorSig,
        ndaSignature: ndaSig,
        w9Data: {
          contractorEmail: contract!.contractorEmail,
          taxYear: new Date().getFullYear(),
          ...w9,
        },
        pdfData,
      });
      setStep("done");
      toast.success("Contract signed successfully!");
    } catch (e: any) {
      toast.error("Failed to submit: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[oklch(0.07_0_0)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/40" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen bg-[oklch(0.07_0_0)] flex items-center justify-center">
        <Card className="p-8 bg-slate-900 border-slate-700 text-center max-w-md">
          <FileText className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Contract Not Found</h2>
          <p className="text-white/50">This signing link is invalid or has expired.</p>
        </Card>
      </div>
    );
  }

  if (contract.status === "signed") {
    return (
      <div className="min-h-screen bg-[oklch(0.07_0_0)] flex items-center justify-center">
        <Card className="p-8 bg-slate-900 border-slate-700 text-center max-w-md">
          <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Already Signed</h2>
          <p className="text-white/50">This contract has already been signed. Thank you!</p>
        </Card>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/30 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
          <span className="text-black font-black text-xs">LM</span>
        </div>
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest">Loomelic Media</p>
          <p className="text-sm font-semibold">Contractor Agreement</p>
        </div>
      </div>

      {/* Step tabs */}
      <div className="border-b border-white/10 bg-black/20">
        <div className="max-w-3xl mx-auto px-6 flex gap-0">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                s.id === step
                  ? "border-white text-white"
                  : i < currentStepIndex
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-white/30"
              }`}
            >
              {i < currentStepIndex ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">
                  {i + 1}
                </span>
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* ── Step 1: Review ── */}
        {step === "review" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Review Your Contract</h1>
              <p className="text-white/50 text-sm">Please review all details carefully before proceeding to sign.</p>
            </div>
            <Card className="bg-slate-900/60 border-slate-700 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ["Contractor", contract.contractorName],
                  ["Email", contract.contractorEmail],
                  ["Role", contract.contractorRole],
                  ["Project", contract.projectName],
                  ["Location", contract.projectLocation],
                  ["Event City", contract.eventCity],
                  ["Total Fee", contract.totalFee ? `$${contract.totalFee}` : null],
                  ["Deposit", contract.deposit ? `$${contract.deposit}` : null],
                  ["Final Payment", contract.finalPayment ? `$${contract.finalPayment}` : null],
                  ["Payment Method", contract.paymentMethod],
                  ["Check-in", contract.checkinDate],
                  ["Check-out", contract.checkoutDate],
                  ["Housing", contract.airbnbAddress],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label as string}>
                    <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
                    <p className="text-white font-medium mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              {contract.equipment && (() => {
                try {
                  const eq = JSON.parse(contract.equipment);
                  return eq.description ? (
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Equipment</p>
                      <p className="text-white/80 text-sm">{eq.description}</p>
                    </div>
                  ) : null;
                } catch { return null; }
              })()}
            </Card>
            <Button onClick={() => setStep("w9")} className="w-full bg-white text-black hover:bg-white/90">
              Looks Good — Continue to W-9 <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* ── Step 2: W-9 ── */}
        {step === "w9" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">W-9 Tax Form</h1>
              <p className="text-white/50 text-sm">Required for tax reporting. Your information is stored securely.</p>
            </div>
            {existingW9 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-300">
                We found your W-9 from a previous contract. Please verify the details below.
              </div>
            )}
            <Card className="bg-slate-900/60 border-slate-700 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="text-xs uppercase tracking-wider text-white/50">Full Legal Name *</Label>
                  <Input value={w9.name} onChange={e => setW9(p => ({ ...p, name: e.target.value }))}
                    className="bg-slate-800 border-slate-600 mt-1" placeholder="As shown on tax return" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs uppercase tracking-wider text-white/50">Business Name (if different)</Label>
                  <Input value={w9.businessName} onChange={e => setW9(p => ({ ...p, businessName: e.target.value }))}
                    className="bg-slate-800 border-slate-600 mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs uppercase tracking-wider text-white/50">Tax Classification *</Label>
                  <Select value={w9.taxClassification} onValueChange={v => setW9(p => ({ ...p, taxClassification: v }))}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 mt-1">
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual / Sole Proprietor</SelectItem>
                      <SelectItem value="c_corp">C Corporation</SelectItem>
                      <SelectItem value="s_corp">S Corporation</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="trust_estate">Trust / Estate</SelectItem>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs uppercase tracking-wider text-white/50">Address *</Label>
                  <Input value={w9.address} onChange={e => setW9(p => ({ ...p, address: e.target.value }))}
                    className="bg-slate-800 border-slate-600 mt-1" placeholder="Street address" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-white/50">City *</Label>
                  <Input value={w9.city} onChange={e => setW9(p => ({ ...p, city: e.target.value }))}
                    className="bg-slate-800 border-slate-600 mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-white/50">State *</Label>
                    <Input value={w9.state} onChange={e => setW9(p => ({ ...p, state: e.target.value }))}
                      className="bg-slate-800 border-slate-600 mt-1" maxLength={2} placeholder="CA" />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-white/50">ZIP *</Label>
                    <Input value={w9.zipCode} onChange={e => setW9(p => ({ ...p, zipCode: e.target.value }))}
                      className="bg-slate-800 border-slate-600 mt-1" placeholder="90210" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-white/50">SSN (last 4 or full)</Label>
                  <Input value={w9.ssn} onChange={e => setW9(p => ({ ...p, ssn: e.target.value }))}
                    className="bg-slate-800 border-slate-600 mt-1" placeholder="XXX-XX-XXXX" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-white/50">EIN (if applicable)</Label>
                  <Input value={w9.ein} onChange={e => setW9(p => ({ ...p, ein: e.target.value }))}
                    className="bg-slate-800 border-slate-600 mt-1" placeholder="XX-XXXXXXX" />
                </div>
              </div>
            </Card>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("review")} className="flex-1 border-slate-600 text-white">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={() => setStep("sign")} className="flex-1 bg-white text-black hover:bg-white/90">
                Continue to Sign <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Sign ── */}
        {step === "sign" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Sign the Agreement</h1>
              <p className="text-white/50 text-sm">Sign below to confirm your agreement to all terms.</p>
            </div>

            <Card className="bg-slate-900/60 border-slate-700 p-6 space-y-5">
              <div>
                <Label className="text-xs uppercase tracking-wider text-white/50 flex items-center gap-2 mb-2">
                  <PenTool className="w-3 h-3" /> Contractor Signature *
                </Label>
                <div className="border border-slate-600 rounded-lg overflow-hidden bg-white">
                  <SignatureCanvas
                    ref={contractorSigRef}
                    penColor="black"
                    canvasProps={{ width: 600, height: 150, className: "w-full" }}
                    onEnd={() => captureSig("contractor")}
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => clearSig("contractor")}
                  className="text-white/40 hover:text-white mt-1 text-xs">
                  Clear
                </Button>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-white/50 flex items-center gap-2 mb-2">
                  <PenTool className="w-3 h-3" /> NDA Signature *
                </Label>
                <div className="border border-slate-600 rounded-lg overflow-hidden bg-white">
                  <SignatureCanvas
                    ref={ndaSigRef}
                    penColor="black"
                    canvasProps={{ width: 600, height: 150, className: "w-full" }}
                    onEnd={() => captureSig("nda")}
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => clearSig("nda")}
                  className="text-white/40 hover:text-white mt-1 text-xs">
                  Clear
                </Button>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("w9")} className="flex-1 border-slate-600 text-white">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-white text-black hover:bg-white/90">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                Submit Signed Contract
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 4: Done ── */}
        {step === "done" && (
          <div className="text-center py-16 space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold">Contract Signed!</h1>
            <p className="text-white/50 max-w-sm mx-auto">
              Your Independent Contractor Agreement with Loomelic Media LLC has been signed and recorded.
              Thank you, {contract.contractorName}!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
