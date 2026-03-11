import DashboardLayout from "@/components/DashboardLayout";
import { CarMakerLogo } from "@/components/CarMakerLogo";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  ArrowLeft, Building2, MapPin, Phone, Globe, Send, Zap, RefreshCw,
  Plus, Clock, FileText, Eye, Instagram, Facebook, ExternalLink,
  Navigation, Search, CheckCircle2, XCircle, AlertTriangle, Lock,
  Youtube, Copy, Trash2,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useParams } from "wouter";

const BRANDS = [
  "Lexus", "Subaru", "Toyota", "Honda", "Nissan", "Ford", "Chevrolet", "GMC",
  "Kia", "Hyundai", "Mazda", "Volkswagen", "Audi", "BMW", "Mercedes-Benz",
  "Land Rover", "Jaguar", "Porsche", "MINI", "Acura", "Genesis",
  "Chrysler", "Dodge", "Jeep", "Ram", "Other",
];

const VISIT_STATUSES = [
  "Not Started", "Visited", "Audit Run", "Proposal Sent",
  "Follow-Up 1", "Follow-Up 2", "Follow-Up 3",
  "Meeting Set", "Contract Sent", "Closed Won", "Closed Lost", "On Hold",
];

const STATUS_COLORS: Record<string, string> = {
  "Not Started": "bg-slate-500/10 text-slate-300",
  "Visited": "bg-blue-500/10 text-blue-300",
  "Audit Run": "bg-violet-500/10 text-violet-300",
  "Proposal Sent": "bg-amber-500/10 text-amber-300",
  "Follow-Up 1": "bg-orange-500/10 text-orange-300",
  "Follow-Up 2": "bg-orange-500/15 text-orange-200",
  "Follow-Up 3": "bg-red-500/10 text-red-300",
  "Meeting Set": "bg-cyan-500/10 text-cyan-300",
  "Contract Sent": "bg-indigo-500/10 text-indigo-300",
  "Closed Won": "bg-emerald-500/10 text-emerald-300",
  "Closed Lost": "bg-gray-500/10 text-gray-400",
  "On Hold": "bg-yellow-500/10 text-yellow-300",
};

// Social platform config
const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", field: "socialInstagramUrl", placeholder: "https://instagram.com/dealership", icon: Instagram, color: "text-pink-600" },
  { key: "facebook", label: "Facebook", field: "socialFacebookUrl", placeholder: "https://facebook.com/dealership", icon: Facebook, color: "text-blue-600" },
  { key: "tiktok", label: "TikTok", field: "socialTiktokUrl", placeholder: "https://tiktok.com/@dealership", icon: ExternalLink, color: "text-slate-800" },
  { key: "youtube", label: "YouTube", field: "socialYoutubeUrl", placeholder: "https://youtube.com/@dealership", icon: Youtube, color: "text-red-600" },
  { key: "google", label: "Google Business", field: "socialGoogleUrl", placeholder: "https://g.page/dealership", icon: Globe, color: "text-green-600" },
];

const heading = { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const };

export default function DealershipDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0");
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const { data: dealer, isLoading } = trpc.dealerGrowth.dealership.get.useQuery({ id }, { enabled: id > 0 });
  const { data: contacts = [] } = trpc.dealerGrowth.contact.list.useQuery({ dealershipId: id }, { enabled: id > 0 });
  const { data: visitLogs = [] } = trpc.dealerGrowth.visitLog.list.useQuery({ dealershipId: id }, { enabled: id > 0 });
  const { data: proposals = [] } = trpc.dealerGrowth.proposal.list.useQuery({ dealershipId: id }, { enabled: id > 0 });
  const [deletingProposalId, setDeletingProposalId] = useState<number | null>(null);
  const deleteProposal = trpc.dealerGrowth.proposal.delete.useMutation({
    onSuccess: () => {
      utils.dealerGrowth.proposal.list.invalidate({ dealershipId: id });
      utils.dealerGrowth.dealership.get.invalidate({ id });
      toast.success('Proposal deleted');
      setDeletingProposalId(null);
    },
    onError: () => toast.error('Failed to delete proposal'),
  });
  const { data: followUps = [] } = trpc.dealerGrowth.followUp.list.useQuery({ dealershipId: id }, { enabled: id > 0 });
  const { data: viewStats } = trpc.dealerGrowth.tracking.stats.useQuery({ dealershipId: id }, { enabled: id > 0 });
  const { data: socialLinks = [] } = trpc.dealerGrowth.socialLink.list.useQuery({ dealershipId: id }, { enabled: id > 0 });

  const updateMutation = trpc.dealerGrowth.dealership.update.useMutation({
    onSuccess: () => { utils.dealerGrowth.dealership.get.invalidate({ id }); toast.success("Updated"); },
  });
  const auditMutation = trpc.dealerGrowth.dealership.runAudit.useMutation({
    onSuccess: async () => {
      await utils.dealerGrowth.dealership.get.invalidate({ id });
      setActiveTab("audit");
      toast.success("Opportunity Snapshot complete");
    },
    onError: (err: any) => toast.error(`Snapshot failed: ${err.message}`),
  });
  const generateMutation = trpc.dealerGrowth.dealership.generateProposal.useMutation({
    onSuccess: () => { utils.dealerGrowth.dealership.get.invalidate({ id }); toast.success("Proposal generated"); },
  });
  const upsertSocialMutation = trpc.dealerGrowth.socialLink.upsert.useMutation({
    onSuccess: () => { utils.dealerGrowth.socialLink.list.invalidate({ dealershipId: id }); toast.success("Saved"); },
    onError: (err: any) => toast.error(err.message),
  });
  const lockSocialMutation = trpc.dealerGrowth.socialLink.setLock.useMutation({
    onSuccess: () => utils.dealerGrowth.socialLink.list.invalidate({ dealershipId: id }),
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [showContactForm, setShowContactForm] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [showSendEmail, setShowSendEmail] = useState(false);
  const [contactForm, setContactForm] = useState({ firstName: "", lastName: "", title: "", email: "", phone: "" });
  const [visitForm, setVisitForm] = useState({ outcome: "Spoke Briefly" as string, notes: "", nextStep: "Email" as string });
  const [emailForm, setEmailForm] = useState({ recipientEmail: "", subject: "", body: "" });

  const createContactMutation = trpc.dealerGrowth.contact.create.useMutation({
    onSuccess: () => { utils.dealerGrowth.contact.list.invalidate({ dealershipId: id }); setShowContactForm(false); toast.success("Contact added"); },
  });
  const createVisitMutation = trpc.dealerGrowth.visitLog.create.useMutation({
    onSuccess: () => { utils.dealerGrowth.visitLog.list.invalidate({ dealershipId: id }); setShowVisitForm(false); toast.success("Visit logged"); },
  });
  const sendProposalMutation = trpc.dealerGrowth.proposal.send.useMutation({
    onSuccess: () => { utils.dealerGrowth.proposal.list.invalidate({ dealershipId: id }); setShowSendEmail(false); toast.success("Proposal sent"); },
  });

  // Build social lookup from DealershipSocialLinks table
  const socialByPlatform: Record<string, { url: string; isLocked: boolean; id: number }> = {};
  (socialLinks as any[]).forEach((s: any) => {
    if (s.isPrimary || !socialByPlatform[s.platform]) {
      socialByPlatform[s.platform] = { url: s.url, isLocked: s.isLocked, id: s.id };
    }
  });

  // Fallback to dealer columns if no DealershipSocialLinks entry
  const getSocialUrl = (platform: string, field: string) => {
    return socialByPlatform[platform]?.url || (dealer as any)?.[field] || "";
  };

  const brand = dealer?.brandOverride || dealer?.primaryBrand || "";

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-40 bg-muted rounded" />
        </div>
      </DashboardLayout>
    );
  }

  if (!dealer) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Dealership not found</p>
          <Button variant="outline" className="mt-4" onClick={() => setLocation("/growth")}>Back to Dashboard</Button>
        </div>
      </DashboardLayout>
    );
  }

  const statusColor = STATUS_COLORS[dealer.visitStatus || "Not Started"] || "bg-slate-100 text-slate-600";
  const proposalUrl = dealer.proposalSlug ? `${window.location.origin}/growth/p/${dealer.proposalSlug}` : null;

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-5xl">

        {/* Header */}
        <div>
          <Button variant="ghost" size="sm" onClick={() => setLocation("/growth")} className="mb-2 -ml-2" style={{color:'rgba(255,255,255,0.4)'}}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Button>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CarMakerLogo brand={brand} size="lg" />
              </div>
              <div>
                <h1 className="text-2xl aurora-gradient-text" style={heading}>{dealer.dealershipName}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs" style={{color:'rgba(255,255,255,0.4)'}}>
                  {dealer.addressStreet && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {dealer.addressStreet}, {dealer.addressCity}, {dealer.addressState} {dealer.addressZip}
                    </span>
                  )}
                  {dealer.mainPhone && (
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {dealer.mainPhone}</span>
                  )}
                  {dealer.dealerWebsiteUrl && (
                    <a href={dealer.dealerWebsiteUrl} target="_blank" rel="noopener" className="flex items-center gap-1 hover:underline" style={{color:'#a5b4fc'}}>
                      <Globe className="h-3 w-3" /> {dealer.dealerWebsiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {dealer.visitStatus || "Not Started"}
              </span>
              <Select
                value={dealer.visitStatus || "Not Started"}
                onValueChange={(v) => updateMutation.mutate({ id, visitStatus: v as any })}
              >
                <SelectTrigger className="w-[140px] h-8 text-xs" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.8)'}}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VISIT_STATUSES.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setLocation(`/growth/pitch/${id}`)} className="gap-2 h-8 text-xs aurora-btn-primary" size="sm">
            <Zap className="h-3.5 w-3.5" /> Rapid Pitch
          </Button>
          <Button
            variant="outline" size="sm" className="gap-2 h-8 text-xs"
            style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.7)'}}
            onClick={() => { setActiveTab("audit"); auditMutation.mutate({ dealershipId: id }); }}
            disabled={auditMutation.isPending}
          >
            <Search className="h-3.5 w-3.5" /> {auditMutation.isPending ? "Analyzing..." : "Run Snapshot"}
          </Button>
          <Button
            variant="outline" size="sm" className="gap-2 h-8 text-xs"
            style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.7)'}}
            onClick={() => generateMutation.mutate({ dealershipId: id })}
            disabled={generateMutation.isPending}
          >
            <FileText className="h-3.5 w-3.5" /> {generateMutation.isPending ? "Generating..." : "Generate Proposal"}
          </Button>
          {dealer.proposalSlug && (
            <>
              <Button variant="outline" size="sm" className="gap-2 h-8 text-xs" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.7)'}} onClick={() => setShowSendEmail(true)}>
                <Send className="h-3.5 w-3.5" /> Send Proposal
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-8 text-xs" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.7)'}} onClick={() => window.open(`/growth/p/${dealer.proposalSlug}`, '_blank')}>
                <Eye className="h-3.5 w-3.5" /> View Microsite
              </Button>
              <Button
                variant="ghost" size="sm" className="gap-2 h-8 text-xs"
                style={{color:'rgba(255,255,255,0.5)'}}
                onClick={() => { navigator.clipboard.writeText(proposalUrl!); toast.success("Link copied"); }}
              >
                <Copy className="h-3.5 w-3.5" /> Copy Link
              </Button>
            </>
          )}
          <Button
            variant="ghost" size="sm" className="gap-2 h-8 text-xs"
            style={{color:'rgba(255,255,255,0.5)'}}
            onClick={() => {
              const addr = `${dealer.addressStreet}, ${dealer.addressCity}, ${dealer.addressState} ${dealer.addressZip}`;
              window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`, '_blank');
            }}
          >
            <Navigation className="h-3.5 w-3.5" /> Navigate
          </Button>
        </div>

        {/* View Stats Banner */}
        {viewStats && (viewStats.totalViews! > 0 || viewStats.ctaClicks! > 0) && (
          <div className="glass-card p-3 flex items-center gap-6" style={{border:'1px solid rgba(99,102,241,0.2)'}}>
            <Eye className="h-4 w-4" style={{color:'#a5b4fc'}} />
            <div className="flex gap-6 text-xs" style={{color:'rgba(255,255,255,0.7)'}}>
              <span><strong style={{color:'rgba(255,255,255,0.9)'}}>{viewStats.totalViews}</strong> proposal views</span>
              <span><strong style={{color:'rgba(255,255,255,0.9)'}}>{viewStats.ctaClicks}</strong> CTA clicks</span>
              {(viewStats as any).lastViewedAt && (
                <span style={{color:'rgba(255,255,255,0.35)'}}>Last viewed: {new Date((viewStats as any).lastViewedAt).toLocaleDateString()}</span>
              )}
            </div>
            {proposalUrl && (
              <Button
                variant="ghost" size="sm" className="ml-auto gap-1 h-7 text-xs"
                style={{color:'rgba(255,255,255,0.5)'}}
                onClick={() => { navigator.clipboard.writeText(proposalUrl); toast.success("Link copied"); }}
              >
                <Copy className="h-3 w-3" /> Copy Proposal Link
              </Button>
            )}
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-9" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)'}}>
            <TabsTrigger value="overview" className="text-xs data-[state=active]:text-white data-[state=active]:bg-white/10" style={{color:'rgba(255,255,255,0.5)'}}>Overview</TabsTrigger>
            <TabsTrigger value="contacts" className="text-xs data-[state=active]:text-white data-[state=active]:bg-white/10" style={{color:'rgba(255,255,255,0.5)'}}>Contacts ({(contacts as any[]).length})</TabsTrigger>
            <TabsTrigger value="visits" className="text-xs data-[state=active]:text-white data-[state=active]:bg-white/10" style={{color:'rgba(255,255,255,0.5)'}}>Visits ({(visitLogs as any[]).length})</TabsTrigger>
            <TabsTrigger value="proposals" className="text-xs data-[state=active]:text-white data-[state=active]:bg-white/10" style={{color:'rgba(255,255,255,0.5)'}}>Proposals ({(proposals as any[]).length})</TabsTrigger>
            <TabsTrigger value="audit" className="text-xs data-[state=active]:text-white data-[state=active]:bg-white/10" style={{color:'rgba(255,255,255,0.5)'}}>Opportunity Snapshot</TabsTrigger>
            <TabsTrigger value="social" className="text-xs data-[state=active]:text-white data-[state=active]:bg-white/10" style={{color:'rgba(255,255,255,0.5)'}}>Social Links</TabsTrigger>
            <TabsTrigger value="website" className="text-xs data-[state=active]:text-white data-[state=active]:bg-white/10" style={{color:'rgba(255,255,255,0.5)'}}>🌐 Website</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="glass-card p-4">
                <div className="pb-2">
                  <p className="text-xs" style={{...heading, color:'rgba(255,255,255,0.5)'}}>Details</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span style={{color:'rgba(255,255,255,0.4)'}}>Brand</span>
                    <div className="flex items-center gap-2">
                      <CarMakerLogo brand={brand} size="sm" />
                      <span>{brand || "—"}</span>
                    </div>
                  </div>
                  <div className="flex justify-between"><span style={{color:'rgba(255,255,255,0.4)'}}>Area</span><span style={{color:'rgba(255,255,255,0.8)'}}>{dealer.areaBucket || "—"}</span></div>
                  <div className="flex justify-between"><span style={{color:'rgba(255,255,255,0.4)'}}>Day Plan</span><span style={{color:'rgba(255,255,255,0.8)'}}>Day {dealer.dayPlan}</span></div>
                  <div className="flex justify-between items-center"><span style={{color:'rgba(255,255,255,0.4)'}}>Priority</span><span className="text-xs px-1.5 py-0.5 rounded" style={{background:'rgba(99,102,241,0.12)',border:'1px solid rgba(99,102,241,0.2)',color:'#a5b4fc'}}>{dealer.priority}</span></div>
                  {dealer.dealerWebsiteUrl && (
                    <div className="flex justify-between items-center">
                      <span style={{color:'rgba(255,255,255,0.4)'}}>Website</span>
                      <a href={dealer.dealerWebsiteUrl} target="_blank" rel="noopener" className="hover:underline flex items-center gap-1" style={{color:'#a5b4fc'}}>
                        <Globe className="h-3 w-3" /> Visit
                      </a>
                    </div>
                  )}
                  <div className="flex justify-between"><span style={{color:'rgba(255,255,255,0.4)'}}>Headshot Add-on</span><span style={{color:'rgba(255,255,255,0.8)'}}>{dealer.headshotAddon ? "Yes ($2,000)" : "No"}</span></div>
                </div>
              </div>

              <div className="glass-card p-4">
                <div className="pb-2">
                  <p className="text-xs" style={{...heading, color:'rgba(255,255,255,0.5)'}}>Social Presence</p>
                </div>
                <div className="space-y-2">
                  {SOCIAL_PLATFORMS.map(({ key, label, field, icon: Icon }) => {
                    const url = getSocialUrl(key, field);
                    return url ? (
                      <a key={key} href={url} target="_blank" rel="noopener" className="flex items-center gap-2 text-xs hover:underline" style={{color:'#a5b4fc'}}>
                        <Icon className="h-3.5 w-3.5" /> {label}
                      </a>
                    ) : (
                      <div key={key} className="flex items-center gap-2 text-xs" style={{color:'rgba(255,255,255,0.2)'}}>
                        <Icon className="h-3.5 w-3.5" /> {label} — not found
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contact Info — Address, Phone, Hours */}
            <div className="glass-card p-4">
              <div className="pb-2">
                <p className="text-xs" style={{...heading, color:'rgba(255,255,255,0.5)'}}>Contact Info</p>
              </div>
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Street Address</Label>
                    <Input
                      className="h-8 text-xs mt-1"
                      defaultValue={dealer.addressStreet || ""}
                      placeholder="123 Main St"
                      onBlur={(e) => {
                        if (e.target.value !== (dealer.addressStreet || "")) {
                          updateMutation.mutate({ id, addressStreet: e.target.value });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">City</Label>
                    <Input
                      className="h-8 text-xs mt-1"
                      defaultValue={dealer.addressCity || ""}
                      placeholder="Lake Park"
                      onBlur={(e) => {
                        if (e.target.value !== (dealer.addressCity || "")) {
                          updateMutation.mutate({ id, addressCity: e.target.value });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">State</Label>
                    <Input
                      className="h-8 text-xs mt-1"
                      defaultValue={dealer.addressState || ""}
                      placeholder="FL"
                      onBlur={(e) => {
                        if (e.target.value !== (dealer.addressState || "")) {
                          updateMutation.mutate({ id, addressState: e.target.value });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">ZIP Code</Label>
                    <Input
                      className="h-8 text-xs mt-1"
                      defaultValue={dealer.addressZip || ""}
                      placeholder="33403"
                      onBlur={(e) => {
                        if (e.target.value !== (dealer.addressZip || "")) {
                          updateMutation.mutate({ id, addressZip: e.target.value });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <Input
                      className="h-8 text-xs mt-1"
                      defaultValue={dealer.mainPhone || ""}
                      placeholder="(561) 555-0100"
                      onBlur={(e) => {
                        if (e.target.value !== (dealer.mainPhone || "")) {
                          updateMutation.mutate({ id, mainPhone: e.target.value });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Website URL</Label>
                    <Input
                      className="h-8 text-xs mt-1"
                      defaultValue={dealer.dealerWebsiteUrl || ""}
                      placeholder="https://dealership.com"
                      onBlur={(e) => {
                        if (e.target.value !== (dealer.dealerWebsiteUrl || "")) {
                          updateMutation.mutate({ id, dealerWebsiteUrl: e.target.value } as any);
                        }
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Hours of Operation</Label>
                  <Textarea
                    className="text-xs mt-1 min-h-[72px]"
                    defaultValue={(dealer as any).hoursOfOperation || ""}
                    placeholder={`Mon–Fri: 9am–8pm\nSat: 9am–6pm\nSun: 11am–5pm`}
                    onBlur={(e) => {
                      if (e.target.value !== ((dealer as any).hoursOfOperation || "")) {
                        updateMutation.mutate({ id, hoursOfOperation: e.target.value } as any);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Brand Override */}
            <div className="glass-card p-4">
              <div className="pb-2">
                <p className="text-xs" style={{...heading, color:'rgba(255,255,255,0.5)'}}>Brand Override</p>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <CarMakerLogo brand={brand} size="md" />
                  <Select
                    value={brand || ""}
                    onValueChange={(v) => updateMutation.mutate({ id, brandOverride: v })}
                  >
                    <SelectTrigger className="w-[220px] h-8 text-xs">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANDS.map(b => <SelectItem key={b} value={b} className="text-xs">{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="glass-card p-4">
              <div className="pb-2">
                <p className="text-xs" style={{...heading, color:'rgba(255,255,255,0.5)'}}>Notes</p>
              </div>
              <div>
                <Textarea
                  defaultValue={(dealer as any).notes || ""}
                  placeholder="Internal notes about this dealership..."
                  className="text-xs min-h-[80px]"
                  onBlur={(e) => {
                    if (e.target.value !== ((dealer as any).notes || "")) {
                      updateMutation.mutate({ id, notes: e.target.value } as any);
                    }
                  }}
                />
              </div>
            </div>

            {/* Website Preview — auto-loads in Overview */}
            {dealer.dealerWebsiteUrl ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold flex items-center gap-1.5" style={heading}>
                    <Globe className="h-3.5 w-3.5" /> Website Preview
                  </h3>
                  <a
                    href={dealer.dealerWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {dealer.dealerWebsiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </div>
                {/* Screenshot via microlink.io — works even when sites block iframes */}
                <a
                  href={dealer.dealerWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-xl overflow-hidden border border-white/40 shadow-md bg-white/60 hover:shadow-lg transition-shadow group relative"
                  style={{ minHeight: "420px" }}
                >
                  <img
                    src={`https://api.microlink.io/?url=${encodeURIComponent(dealer.dealerWebsiteUrl)}&screenshot=true&meta=false&embed=screenshot.url`}
                    alt={`${dealer.dealershipName} website screenshot`}
                    className="w-full h-auto block"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="flex flex-col items-center justify-center py-16 text-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg><p class="text-sm text-gray-400">Click to open site in new tab</p></div>`;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 text-xs font-medium px-3 py-1.5 rounded-full shadow flex items-center gap-1.5">
                      <ExternalLink className="h-3 w-3" /> Open site
                    </span>
                  </div>
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-border/50 bg-white/40 px-4 py-5">
                <Globe className="h-8 w-8 text-muted-foreground/30 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">No website URL saved</p>
                  <p className="text-[11px] text-muted-foreground/60">Add one in the Contact Info section above to enable the live preview.</p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold" style={heading}>Contacts</h3>
              <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 h-8 text-xs"><Plus className="h-3.5 w-3.5" /> Add Contact</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle style={heading}>Add Contact</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="text-xs">First Name</Label><Input className="h-8 text-xs" value={contactForm.firstName} onChange={e => setContactForm(p => ({ ...p, firstName: e.target.value }))} /></div>
                      <div><Label className="text-xs">Last Name</Label><Input className="h-8 text-xs" value={contactForm.lastName} onChange={e => setContactForm(p => ({ ...p, lastName: e.target.value }))} /></div>
                    </div>
                    <div><Label className="text-xs">Title</Label><Input className="h-8 text-xs" placeholder="GM, Marketing Director..." value={contactForm.title} onChange={e => setContactForm(p => ({ ...p, title: e.target.value }))} /></div>
                    <div><Label className="text-xs">Email</Label><Input className="h-8 text-xs" type="email" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} /></div>
                    <div><Label className="text-xs">Phone</Label><Input className="h-8 text-xs" value={contactForm.phone} onChange={e => setContactForm(p => ({ ...p, phone: e.target.value }))} /></div>
                    <Button
                      className="w-full"
                      onClick={() => createContactMutation.mutate({ dealershipId: id, ...contactForm })}
                      disabled={createContactMutation.isPending}
                    >
                      Save Contact
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {(contacts as any[]).length === 0 ? (
              <p className="text-xs text-muted-foreground">No contacts yet.</p>
            ) : (
              <div className="grid gap-2">
                {(contacts as any[]).map((c: any) => (
                  <Card key={c.id}>
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-xs" style={heading}>{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-muted-foreground">{c.title} · {c.email}</p>
                      </div>
                      {c.phone && <span className="text-xs text-muted-foreground">{c.phone}</span>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Visits Tab */}
          <TabsContent value="visits" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold" style={heading}>Visit Logs</h3>
              <Dialog open={showVisitForm} onOpenChange={setShowVisitForm}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 h-8 text-xs"><Plus className="h-3.5 w-3.5" /> Log Visit</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle style={heading}>Log Visit</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Outcome</Label>
                      <Select value={visitForm.outcome} onValueChange={v => setVisitForm(p => ({ ...p, outcome: v }))}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["No Answer", "Spoke Briefly", "Interested", "Not Interested", "Follow-up Requested"].map(o => (
                            <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Next Step</Label>
                      <Select value={visitForm.nextStep} onValueChange={v => setVisitForm(p => ({ ...p, nextStep: v }))}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Call", "Email", "Text", "Meeting"].map(s => (
                            <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label className="text-xs">Notes</Label><Textarea className="text-xs" value={visitForm.notes} onChange={e => setVisitForm(p => ({ ...p, notes: e.target.value }))} /></div>
                    <Button
                      className="w-full"
                      onClick={() => createVisitMutation.mutate({ dealershipId: id, outcome: visitForm.outcome as any, nextStep: visitForm.nextStep as any, notes: visitForm.notes })}
                      disabled={createVisitMutation.isPending}
                    >
                      Save Visit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {(visitLogs as any[]).length === 0 ? (
              <p className="text-xs text-muted-foreground">No visits logged yet.</p>
            ) : (
              <div className="grid gap-2">
                {(visitLogs as any[]).map((v: any) => (
                  <Card key={v.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-xs">{v.outcome}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {new Date(v.datetime).toLocaleDateString()}
                        </span>
                      </div>
                      {v.notes && <p className="text-xs text-muted-foreground">{v.notes}</p>}
                      {v.nextStep && <p className="text-xs mt-1">Next: <strong>{v.nextStep}</strong></p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-4 mt-4">
            {(proposals as any[]).length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No proposals yet. Click "Generate Proposal" above.</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {(proposals as any[]).map((p: any) => (
                  <Card key={p.id}>
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold" style={heading}>Proposal #{p.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.status} · {new Date(p.createdDatetime).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {p.publicUrl && (
                          <>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => window.open(p.publicUrl, '_blank')}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { navigator.clipboard.writeText(p.publicUrl); toast.success("Link copied"); }}>
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                        {deletingProposalId === p.id ? (
                          <div className="flex gap-1 items-center">
                            <span className="text-xs text-destructive font-medium">Delete?</span>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-7 px-2 text-xs"
                              disabled={deleteProposal.isPending}
                              onClick={() => deleteProposal.mutate({ id: p.id, dealershipId: id })}
                            >
                              Yes
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs"
                              onClick={() => setDeletingProposalId(null)}
                            >
                              No
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeletingProposalId(p.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Follow-ups */}
            {(followUps as any[]).length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold mb-2" style={heading}>Follow-ups</h3>
                <div className="grid gap-2">
                  {(followUps as any[]).map((f: any) => (
                    <Card key={f.id}>
                      <CardContent className="p-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium">Follow-up #{f.followUpNumber}</p>
                          <p className="text-xs text-muted-foreground">Due: {new Date(f.dueDate).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">{f.status}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Opportunity Snapshot Tab */}
          <TabsContent value="audit" className="space-y-4 mt-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-primary flex items-center gap-2" style={heading}>
                    <Zap className="h-4 w-4" /> Opportunity Snapshot
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI-powered analysis of social presence, content gaps, and pitch angles for {dealer.dealershipName}.
                  </p>
                </div>
                <Button
                  size="sm" variant="outline" className="gap-2 shrink-0 h-8 text-xs"
                  onClick={() => auditMutation.mutate({ dealershipId: id })}
                  disabled={auditMutation.isPending}
                >
                  {auditMutation.isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                  {auditMutation.isPending ? "Analyzing..." : dealer.auditLastRunDatetime ? "Re-run" : "Run Snapshot"}
                </Button>
              </div>
            </div>

            {auditMutation.isPending && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6 flex items-center gap-4">
                  <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                  <div>
                    <p className="text-sm font-semibold" style={heading}>Running Opportunity Snapshot...</p>
                    <p className="text-xs text-muted-foreground mt-1">Analyzing social presence, website, and content gaps. This takes ~10 seconds.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {!auditMutation.isPending && dealer.auditLastRunDatetime ? (
              <div className="space-y-4">
                {/* Timestamp + opportunity badge */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Last analyzed: {new Date(dealer.auditLastRunDatetime).toLocaleString()}
                  </p>
                  {!dealer.auditStaffPhotosPresent ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200" style={heading}>HEADSHOT OPPORTUNITY</span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200" style={heading}>ACTIVE</span>
                  )}
                </div>

                {/* Pitch Angles — primary card, shown first */}
                {dealer.auditOpportunityNotes && (
                  <Card className="border-primary/40" style={{ background: 'linear-gradient(135deg, rgba(168,206,207,0.18) 0%, rgba(230,174,140,0.12) 100%)' }}>
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-xs flex items-center gap-2 text-primary" style={heading}>
                        <Zap className="h-4 w-4" /> PITCH ANGLES
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <ul className="space-y-2.5">
                        {dealer.auditOpportunityNotes.split('\n').filter((l: string) => l.trim()).map((line: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs">
                            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">{i + 1}</span>
                            <span className="text-foreground/85 leading-relaxed">{line.replace(/^[\u2022\-\*]\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Strengths + Gaps side by side */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="border-green-500/20 bg-green-50/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs flex items-center gap-2" style={heading}>
                        <CheckCircle2 className="h-4 w-4 text-green-600" /> WHAT'S WORKING
                      </CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-xs whitespace-pre-line text-foreground/80 leading-relaxed">{dealer.auditSummaryWorking}</p></CardContent>
                  </Card>
                  <Card className="border-amber-500/20 bg-amber-50/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs flex items-center gap-2" style={heading}>
                        <AlertTriangle className="h-4 w-4 text-amber-600" /> GAPS TO EXPLOIT
                      </CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-xs whitespace-pre-line text-foreground/80 leading-relaxed">{dealer.auditSummaryMissing}</p></CardContent>
                  </Card>
                </div>

                {/* Staff presence */}
                <Card className="border-border/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs" style={heading}>STAFF &amp; PHOTO PRESENCE</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      {dealer.auditStaffPagePresent ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                      <span>Staff page {dealer.auditStaffPagePresent ? "found" : "not found"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {dealer.auditStaffPhotosPresent ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                      <span>Staff photos {dealer.auditStaffPhotosPresent ? "present" : <><strong className="text-amber-700">missing</strong> — pitch headshot package</>}</span>
                    </div>
                    {dealer.auditStaffNotes && <p className="text-muted-foreground mt-2">{dealer.auditStaffNotes}</p>}
                  </CardContent>
                </Card>
              </div>
            ) : !auditMutation.isPending ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Search className="h-7 w-7 text-primary" />
                </div>
                <p className="font-bold text-sm mb-1" style={heading}>No snapshot yet</p>
                <p className="text-xs text-muted-foreground mb-4">Run the AI snapshot to get pitch angles, gap analysis, and staff photo opportunities before walking in.</p>
                <Button
                  onClick={() => auditMutation.mutate({ dealershipId: id })}
                  disabled={auditMutation.isPending}
                  className="gap-2"
                >
                  <Zap className="h-4 w-4" /> Run Opportunity Snapshot
                </Button>
              </div>
            ) : null}
          </TabsContent>

          {/* Social Links Management Tab */}
          <TabsContent value="social" className="space-y-4 mt-4">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <h3 className="font-bold text-xs flex items-center gap-2" style={heading}>
                <Lock className="h-4 w-4 text-primary" /> Social Links — Protected Record
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                These links are used in audits, pitch mode, and proposals. Lock individual links to prevent overwrites.
              </p>
            </div>
            <div className="grid gap-3">
              {SOCIAL_PLATFORMS.map(({ key, label, field, placeholder, icon: Icon, color }) => {
                const current = socialByPlatform[key];
                const fallbackUrl = (dealer as any)?.[field] || "";
                const displayUrl = current?.url || fallbackUrl;
                const isLocked = current?.isLocked || false;

                return (
                  <Card key={key} className="border-border/60">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold flex items-center gap-1.5 ${color}`} style={heading}>
                          <Icon className="h-3.5 w-3.5" /> {label}
                        </span>
                        <div className="flex items-center gap-2">
                          {displayUrl && (
                            <a href={displayUrl} target="_blank" rel="noopener" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" /> Open
                            </a>
                          )}
                          {current && (
                            <button
                              onClick={() => lockSocialMutation.mutate({ id: current.id, locked: !isLocked })}
                              className={`text-xs flex items-center gap-1 ${isLocked ? "text-amber-600" : "text-muted-foreground hover:text-foreground"}`}
                            >
                              <Lock className="h-3 w-3" />
                              {isLocked ? "Locked" : "Lock"}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          key={displayUrl}
                          defaultValue={displayUrl}
                          placeholder={placeholder}
                          className="text-xs h-8"
                          disabled={isLocked}
                          onBlur={(e) => {
                            const newVal = e.target.value.trim();
                            if (newVal !== displayUrl && !isLocked) {
                              upsertSocialMutation.mutate({
                                dealershipId: id,
                                platform: key as any,
                                url: newVal,
                                source: "manual",
                              });
                            }
                          }}
                        />
                      </div>
                      {isLocked && (
                        <p className="text-[10px] text-amber-600 mt-1">🔒 Locked — click "Lock" to unlock</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          {/* Website Preview Tab */}
          <TabsContent value="website" className="mt-4">
            {dealer.dealerWebsiteUrl ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg px-4 py-2.5">
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground truncate max-w-[380px]">
                      {dealer.dealerWebsiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </span>
                  </div>
                  <a
                    href={dealer.dealerWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Open in new tab
                  </a>
                </div>
                <a
                  href={dealer.dealerWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-xl overflow-hidden border border-white/40 shadow-lg bg-white/60 hover:shadow-xl transition-shadow group relative"
                  style={{ minHeight: "520px" }}
                >
                  <img
                    src={`https://api.microlink.io/?url=${encodeURIComponent(dealer.dealerWebsiteUrl)}&screenshot=true&meta=false&embed=screenshot.url`}
                    alt={`${dealer.dealershipName} website screenshot`}
                    className="w-full h-auto block"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 text-xs font-medium px-3 py-1.5 rounded-full shadow flex items-center gap-1.5">
                      <ExternalLink className="h-3 w-3" /> Open site
                    </span>
                  </div>
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Globe className="h-14 w-14 text-muted-foreground/20 mb-4" />
                <p className="text-sm font-medium text-muted-foreground">No website URL saved for this dealership.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Add a URL in the Overview tab to enable the preview.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Send Email Dialog */}
        <Dialog open={showSendEmail} onOpenChange={setShowSendEmail}>
          <DialogContent>
            <DialogHeader><DialogTitle style={heading}>Send Proposal</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Recipient Email</Label>
                <Input
                  type="email"
                  className="h-8 text-xs"
                  value={emailForm.recipientEmail}
                  onChange={e => setEmailForm(p => ({ ...p, recipientEmail: e.target.value }))}
                  placeholder="contact@dealership.com"
                />
              </div>
              <div>
                <Label className="text-xs">Subject</Label>
                <Input
                  className="h-8 text-xs"
                  value={emailForm.subject || `Social Media Proposal for ${dealer.dealershipName} — Loomelic Media`}
                  onChange={e => setEmailForm(p => ({ ...p, subject: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-xs">Message (optional)</Label>
                <Textarea
                  className="text-xs"
                  value={emailForm.body}
                  onChange={e => setEmailForm(p => ({ ...p, body: e.target.value }))}
                  placeholder="Hi, I'd love to share our proposal..."
                />
              </div>
              <div className="rounded-md bg-muted/50 p-3 text-xs">
                <p className="text-muted-foreground mb-1">Proposal link:</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-primary truncate flex-1">{proposalUrl}</code>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 shrink-0" onClick={() => { navigator.clipboard.writeText(proposalUrl!); toast.success("Copied"); }}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => sendProposalMutation.mutate({
                  dealershipId: id,
                  recipientEmail: emailForm.recipientEmail,
                  subject: emailForm.subject,
                  body: emailForm.body,
                })}
                disabled={sendProposalMutation.isPending || !emailForm.recipientEmail}
              >
                <Send className="h-4 w-4 mr-2" /> Send Proposal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
