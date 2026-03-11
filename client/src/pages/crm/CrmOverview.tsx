import { useState, useMemo, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Building2, MapPin, Phone, Zap, Send, Navigation, Search,
  Plus, BarChart3, Target, CheckCircle2, AlertCircle, Globe,
  Clock, FileText, Handshake, TrendingUp, XCircle, RefreshCw,
  ShieldCheck, Lock, Calendar, User, Eye,
  StickyNote,
} from "lucide-react";

// Social platform icon components (SVG inline for brand colors)
const InstagramIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-opacity ${active ? 'opacity-100' : 'opacity-25'}`} fill={active ? 'url(#ig-grad)' : 'currentColor'}>
    {active && (
      <defs>
        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
    )}
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-opacity ${active ? 'opacity-100' : 'opacity-25'}`} fill={active ? '#1877F2' : 'currentColor'}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TikTokIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-opacity ${active ? 'opacity-100' : 'opacity-25'}`} fill={active ? '#000000' : 'currentColor'}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const YouTubeIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-opacity ${active ? 'opacity-100' : 'opacity-25'}`} fill={active ? '#FF0000' : 'currentColor'}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// Aurora Glass status colors
const STATUS_COLORS: Record<string, string> = {
  "Not Started": "bg-slate-500/10 text-slate-300 border-slate-500/20",
  "Visited": "bg-blue-500/10 text-blue-300 border-blue-500/20",
  "Audit Run": "bg-violet-500/10 text-violet-300 border-violet-500/20",
  "Proposal Sent": "bg-amber-500/10 text-amber-300 border-amber-500/20",
  "Follow-Up 1": "bg-orange-500/10 text-orange-300 border-orange-500/20",
  "Follow-Up 2": "bg-orange-500/15 text-orange-200 border-orange-500/25",
  "Follow-Up 3": "bg-orange-200 text-orange-900 border-orange-400",
  "Follow-Up": "bg-orange-50 text-orange-700 border-orange-200",
  "Meeting Set": "bg-green-50 text-green-700 border-green-200",
  "Contract Sent": "bg-teal-500/10 text-teal-300 border-teal-500/20",
  "Closed Won": "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  "Closed Lost": "bg-red-500/10 text-red-300 border-red-500/20",
  "On Hold": "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

// Workflow steps for the step indicator
const WORKFLOW_STEPS = [
  { key: "Not Started", label: "Unvisited", icon: Clock },
  { key: "Visited", label: "Visited", icon: Building2 },
  { key: "Audit Run", label: "Audited", icon: ShieldCheck },
  { key: "Proposal Sent", label: "Proposal", icon: FileText },
  { key: "Follow-Up", label: "Follow-Up", icon: RefreshCw },
  { key: "Meeting Set", label: "Meeting", icon: Handshake },
  { key: "Closed Won", label: "Won", icon: TrendingUp },
];

const WORKFLOW_ORDER = ["Not Started", "Visited", "Audit Run", "Proposal Sent", "Follow-Up 1", "Follow-Up 2", "Follow-Up 3", "Follow-Up", "Meeting Set", "Contract Sent", "Closed Won"];

function WorkflowStepIndicator({ status }: { status: string }) {
  const steps = WORKFLOW_STEPS;
  const currentIdx = steps.findIndex(s => s.key === status);
  const effectiveIdx = currentIdx === -1
    ? (status.startsWith('Follow-Up') ? 4 : status === 'Contract Sent' ? 5 : -1)
    : currentIdx;
  const isLost = status === 'Closed Lost' || status === 'On Hold';

  return (
    <div className="flex items-center gap-0.5 mt-2">
      {steps.map((step, idx) => {
        const StepIcon = step.icon;
        const isComplete = effectiveIdx > idx;
        const isCurrent = effectiveIdx === idx;
        const isLostState = isLost && idx === 0;
        return (
          <div key={step.key} className="flex items-center">
            <div
              title={step.label}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                isLost ? 'bg-red-200' :
                isComplete ? 'bg-primary' :
                isCurrent ? 'bg-primary/60' :
                'bg-border'
              }`}
            />
            {idx < steps.length - 1 && (
              <div className={`h-px w-1 ${
                isLost ? 'bg-red-200' :
                isComplete ? 'bg-primary/40' : 'bg-border'
              }`} />
            )}
          </div>
        );
      })}
      {isLost && <XCircle className="h-3 w-3 text-red-400 ml-1" />}
    </div>
  );
}

function SocialCompletenessBadge({ d }: { d: any }) {
  const platforms = [
    d.socialInstagramUrl,
    d.socialFacebookUrl,
    d.socialTiktokUrl,
    d.socialYoutubeUrl,
  ];
  const count = platforms.filter(Boolean).length;
  const total = 4;
  const pct = Math.round((count / total) * 100);
  const color = pct === 100 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400';
  return (
    <span className={`text-[10px] font-medium ${color}`} title={`${count}/${total} platforms found`}>
      {count}/{total}
    </span>
  );
}

const PRIORITY_COLORS: Record<string, string> = {
  "High": "bg-red-500/10 text-red-300 border-red-500/20",
  "Medium": "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  "Low": "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const heading = { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const };

// Lead temperature config
const LEAD_TEMP_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; glow: string }> = {
  hot:  { label: 'Hot',  color: '#f87171', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  glow: 'rgba(239,68,68,0.2)' },
  warm: { label: 'Warm', color: '#fb923c', bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.3)', glow: 'rgba(251,146,60,0.2)' },
  cold: { label: 'Cold', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)', glow: 'rgba(96,165,250,0.2)' },
  lead: { label: 'Lead', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)',border: 'rgba(167,139,250,0.3)',glow: 'rgba(167,139,250,0.2)' },
  none: { label: 'None', color: 'rgba(255,255,255,0.3)', bg: 'transparent', border: 'rgba(255,255,255,0.1)', glow: 'transparent' },
};
const LEAD_TEMP_ORDER = ['none', 'hot', 'warm', 'cold', 'lead'] as const;
type LeadTemp = typeof LEAD_TEMP_ORDER[number];

function DealerQuickView({ d }: { d: any }) {
  const socialCount = [d.socialInstagramUrl, d.socialFacebookUrl, d.socialTiktokUrl, d.socialYoutubeUrl].filter(Boolean).length;
  const hasAudit = !!d.auditLastRunDatetime;
  const hasProposal = !!d.proposalSlug;
  const lastVisit = d.lastVisitDatetime ? new Date(d.lastVisitDatetime).toLocaleDateString() : null;
  const brand = d.brandOverride || d.primaryBrand;

  return (
    <div className="space-y-3 text-xs">
      {/* Header */}
      <div>
        <p className="font-bold text-sm" style={{...heading, color: 'rgba(255,255,255,0.9)'}}>{d.dealershipName}</p>
        {brand && <p className="text-[10px] mt-0.5" style={{color:'rgba(255,255,255,0.4)'}}>{brand}</p>}
      </div>

      {/* Location */}
      {d.addressStreet && (
        <div className="flex items-start gap-1.5" style={{color:'rgba(255,255,255,0.4)'}}>
          <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
          <span>{d.addressStreet}, {d.addressCity}, {d.addressState}</span>
        </div>
      )}

      {/* Phone */}
      {d.mainPhone && (
        <div className="flex items-center gap-1.5" style={{color:'rgba(255,255,255,0.4)'}}>
          <Phone className="h-3 w-3 shrink-0" />
          <span>{d.mainPhone}</span>
        </div>
      )}

      <div className="pt-2 space-y-1.5" style={{borderTop:'1px solid rgba(255,255,255,0.08)'}}>
        {/* Status */}
        <div className="flex items-center justify-between">
          <span style={{color:'rgba(255,255,255,0.4)'}}>Status</span>
          <span className="font-medium" style={{color:'rgba(255,255,255,0.85)'}}>{d.visitStatus || 'Not Started'}</span>
        </div>

        {/* Last visit */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1" style={{color:'rgba(255,255,255,0.4)'}}><Calendar className="h-3 w-3" /> Last Visit</span>
          <span className="font-medium" style={{color:'rgba(255,255,255,0.85)'}}>{lastVisit || 'Never'}</span>
        </div>

        {/* Social */}
        <div className="flex items-center justify-between">
          <span style={{color:'rgba(255,255,255,0.4)'}}>Social Presence</span>
          <span className={`font-medium ${
            socialCount === 4 ? 'text-emerald-400' : socialCount >= 2 ? 'text-amber-400' : 'text-red-400'
          }`}>{socialCount}/4 platforms</span>
        </div>

        {/* Audit */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1" style={{color:'rgba(255,255,255,0.4)'}}><Eye className="h-3 w-3" /> Opportunity Snapshot</span>
          {d.opportunityNotes ? (
            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Done</span>
          ) : (
            <span className="text-amber-400">Not run</span>
          )}
        </div>

        {/* Proposal */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1" style={{color:'rgba(255,255,255,0.4)'}}><FileText className="h-3 w-3" /> Proposal</span>
          {d.proposalSlug ? (
            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Live</span>
          ) : (
            <span style={{color:'rgba(255,255,255,0.25)'}}>None</span>
          )}
        </div>
      </div>

      {/* Lead Temperature */}
      {d.leadTemp && d.leadTemp !== 'none' && (() => {
        const cfg = LEAD_TEMP_CONFIG[d.leadTemp];
        return (
          <div className="flex items-center justify-between">
            <span style={{color:'rgba(255,255,255,0.4)'}}>Lead Temp</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{background:cfg.bg,border:`1px solid ${cfg.border}`,color:cfg.color}}>
              {cfg.label}
            </span>
          </div>
        );
      })()}
      {/* Quick Note */}
      {d.quickNote && (
        <div className="flex items-start gap-1.5 pt-1" style={{borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          <StickyNote className="h-3 w-3 mt-0.5 shrink-0" style={{color:'rgba(255,255,255,0.3)'}} />
          <span className="text-[10px] italic" style={{color:'rgba(255,255,255,0.5)'}}>{d.quickNote}</span>
        </div>
      )}
      {/* Staff photos flag */}
      {hasAudit && !d.auditStaffPhotosPresent && (
        <div className="rounded px-2 py-1 flex items-center gap-1.5" style={{background:'rgba(251,191,36,0.1)',border:'1px solid rgba(251,191,36,0.25)'}}>
          <AlertCircle className="h-3 w-3 text-amber-400 shrink-0" />
          <span className="font-medium text-amber-300">Headshot package opportunity</span>
        </div>
      )}

      <p className="text-[10px] pt-1" style={{color:'rgba(255,255,255,0.25)',borderTop:'1px solid rgba(255,255,255,0.07)'}}>Click card to open full record</p>
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedDay, setSelectedDay] = useState("Day 1");
  const [areaFilter, setAreaFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [leadTempFilter, setLeadTempFilter] = useState<LeadTemp | 'all'>('all');
  // Quick note editing state: maps dealership id → draft note text
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState("");

  // URL modal state
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [urlModalDealerId, setUrlModalDealerId] = useState<number | null>(null);
  const [urlModalName, setUrlModalName] = useState("");
  const [urlInput, setUrlInput] = useState("");

  const { data: dealerships = [], isLoading } = trpc.dealerGrowth.dealership.list.useQuery({ dayPlan: selectedDay });
  const { data: stats } = trpc.dealerGrowth.dashboard.stats.useQuery();
  const { data: followUpsDue = [] } = trpc.dealerGrowth.dashboard.followUpsDue.useQuery();
  const utils = trpc.useUtils();

  const updateMutation = trpc.dealerGrowth.dealership.update.useMutation({
    onSuccess: () => {
      utils.dealerGrowth.dealership.list.invalidate();
      setUrlModalOpen(false);
      setUrlInput("");
      toast.success("Website URL saved");
    },
  });
  const toggleVisitedMutation = trpc.dealerGrowth.dealership.toggleVisited.useMutation({
    onMutate: async ({ id }) => {
      await utils.dealerGrowth.dealership.list.cancel();
      const prev = utils.dealerGrowth.dealership.list.getData({ dayPlan: selectedDay });
      utils.dealerGrowth.dealership.list.setData({ dayPlan: selectedDay }, (old: any) =>
        old?.map((d: any) =>
          d.id === id
            ? {
                ...d,
                visitStatus: d.visitStatus !== 'Not Started' ? 'Not Started' : 'Visited',
                lastVisitDatetime: d.visitStatus !== 'Not Started' ? null : new Date(),
              }
            : d
        )
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) utils.dealerGrowth.dealership.list.setData({ dayPlan: selectedDay }, ctx.prev);
      toast.error('Failed to update visited status');
    },
    onSettled: () => {
      utils.dealerGrowth.dealership.list.invalidate();
      utils.dealerGrowth.dashboard.stats.invalidate();
    },
  });

  const updateLeadTempMutation = trpc.dealerGrowth.dealership.updateLeadTemp.useMutation({
    onMutate: async ({ id, leadTemp }) => {
      await utils.dealerGrowth.dealership.list.cancel();
      const prev = utils.dealerGrowth.dealership.list.getData({ dayPlan: selectedDay });
      utils.dealerGrowth.dealership.list.setData({ dayPlan: selectedDay }, (old: any) =>
        old?.map((d: any) => d.id === id ? { ...d, leadTemp } : d)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) utils.dealerGrowth.dealership.list.setData({ dayPlan: selectedDay }, ctx.prev);
      toast.error('Failed to update lead temperature');
    },
    onSettled: () => utils.dealerGrowth.dealership.list.invalidate(),
  });

  const updateQuickNoteMutation = trpc.dealerGrowth.dealership.updateQuickNote.useMutation({
    onMutate: async ({ id, quickNote }) => {
      await utils.dealerGrowth.dealership.list.cancel();
      const prev = utils.dealerGrowth.dealership.list.getData({ dayPlan: selectedDay });
      utils.dealerGrowth.dealership.list.setData({ dayPlan: selectedDay }, (old: any) =>
        old?.map((d: any) => d.id === id ? { ...d, quickNote } : d)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) utils.dealerGrowth.dealership.list.setData({ dayPlan: selectedDay }, ctx.prev);
      toast.error('Failed to save note');
    },
    onSettled: () => utils.dealerGrowth.dealership.list.invalidate(),
  });

  const areas = useMemo(() => {
    const set = new Set((dealerships as any[]).map((d: any) => d.areaBucket).filter(Boolean));
    return Array.from(set) as string[];
  }, [dealerships]);

  const filteredDealerships = useMemo(() => {
    let list = dealerships as any[];
    if (areaFilter !== "all") list = list.filter((d: any) => d.areaBucket === areaFilter);
    if (leadTempFilter !== 'all') list = list.filter((d: any) => (d.leadTemp || 'none') === leadTempFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((d: any) =>
        d.dealershipName?.toLowerCase().includes(q) ||
        d.primaryBrand?.toLowerCase().includes(q) ||
        d.brandOverride?.toLowerCase().includes(q) ||
        d.addressStreet?.toLowerCase().includes(q) ||
        d.addressCity?.toLowerCase().includes(q) ||
        d.areaBucket?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [dealerships, areaFilter, leadTempFilter, searchQuery]);

  const openMaps = (d: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const addr = `${d.addressStreet}, ${d.addressCity}, ${d.addressState} ${d.addressZip}`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const url = isIOS
      ? `maps://maps.apple.com/?q=${encodeURIComponent(addr)}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
    window.open(url, '_blank');
  };

  const handleNameClick = (e: React.MouseEvent, d: any) => {
    e.stopPropagation();
    if (d.dealerWebsiteUrl) {
      const url = d.dealerWebsiteUrl.startsWith('http') ? d.dealerWebsiteUrl : `https://${d.dealerWebsiteUrl}`;
      window.open(url, '_blank');
    } else {
      setUrlModalDealerId(d.id);
      setUrlModalName(d.dealershipName);
      setUrlInput("");
      setUrlModalOpen(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight aurora-gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>Acquisition Overview</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest" style={{background:'rgba(16,185,129,0.12)',color:'#6ee7b7',border:'1px solid rgba(16,185,129,0.25)'}}>
                PRODUCTION
              </span>
            </div>
            <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.35)',fontFamily:"'Inter',sans-serif"}}>South Florida · Dealer Growth Command System</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setLocation("/growth/pitch")} className="gap-2 aurora-btn-primary">
              <Zap className="h-4 w-4" /> Rapid Pitch
            </Button>
            <Button variant="outline" onClick={() => setLocation("/growth/new-dealer")} className="gap-2" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.7)'}}>
              <Plus className="h-4 w-4" /> Add Target
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Total Dealers", value: stats?.total ?? 0, icon: Building2, accent: "#6366f1", pct: 100 },
            { label: "Visited", value: stats?.visited ?? 0, icon: CheckCircle2, accent: "#60a5fa", pct: stats?.total ? Math.round((stats.visited / stats.total) * 100) : 0 },
            { label: "Proposals Sent", value: stats?.proposalsSent ?? 0, icon: Send, accent: "#fbbf24", pct: stats?.total ? Math.round((stats.proposalsSent / stats.total) * 100) : 0 },
            { label: "Meetings Set", value: stats?.meetingsSet ?? 0, icon: Handshake, accent: "#34d399", pct: stats?.total ? Math.round((stats.meetingsSet / stats.total) * 100) : 0 },
            { label: "Closed Won", value: stats?.closedWon ?? 0, icon: TrendingUp, accent: "#10b981", pct: stats?.total ? Math.round((stats.closedWon / stats.total) * 100) : 0 },
          ].map(s => (
            <div key={s.label} className="glass-card p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium" style={{color:'rgba(255,255,255,0.4)',fontFamily:"'Inter',sans-serif"}}>{s.label}</p>
                  <p className="text-2xl font-bold mt-1" style={{color:'rgba(255,255,255,0.92)',fontFamily:"'Space Grotesk',sans-serif"}}>{s.value}</p>
                </div>
                <div className="p-2 rounded-lg" style={{background:`${s.accent}20`}}>
                  <s.icon className="h-4 w-4" style={{color:s.accent}} />
                </div>
              </div>
              <div className="h-0.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.07)'}}>
                <div className="h-full rounded-full" style={{width:`${s.pct}%`,background:`linear-gradient(90deg, ${s.accent}, #ec4899)`}} />
              </div>
            </div>
          ))}
        </div>

        {/* Follow-ups Due Widget */}
        {(followUpsDue as any[]).length > 0 && (
          <div className="glass-card p-4" style={{border:'1px solid rgba(251,191,36,0.2)'}}>
            <div className="pb-2">
              <div className="text-sm font-semibold flex items-center gap-2" style={{color:'#fbbf24',fontFamily:"'Space Grotesk',sans-serif"}}>
                <AlertCircle className="h-4 w-4" />
                Follow-ups Due This Week
                <span className="ml-auto text-xs font-normal px-2 py-0.5 rounded-full" style={{background:'rgba(251,191,36,0.15)',color:'#fbbf24'}}>
                  {(followUpsDue as any[]).length} pending
                </span>
              </div>
            </div>
            <div className="pt-0">  {/* was CardContent */}
              <div className="flex flex-wrap gap-2">
                {(followUpsDue as any[]).slice(0, 5).map((f: any) => (
                  <span
                    key={f.id}
                    className="cursor-pointer text-xs px-2 py-1 rounded-full flex items-center gap-1"
                    style={{background:'rgba(251,191,36,0.1)',border:'1px solid rgba(251,191,36,0.25)',color:'#fcd34d'}}
                    onClick={() => setLocation(`/growth/dealership/${f.dealershipId}`)}
                  >
                    <RefreshCw className="h-2.5 w-2.5" />
                    Follow-up #{f.followUpNumber} · Due {new Date(f.dueDate).toLocaleDateString()}
                  </span>
                ))}
                {(followUpsDue as any[]).length > 5 && (
                  <span className="text-xs px-2 py-1 rounded-full" style={{background:'rgba(255,255,255,0.06)',color:'rgba(255,255,255,0.4)',border:'1px solid rgba(255,255,255,0.1)'}}>+{(followUpsDue as any[]).length - 5} more</span>
                )}
              </div>
            </div>  {/* was CardContent */}
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-9 h-10 text-sm"
            style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.85)',backdropFilter:'blur(12px)'}}
            placeholder="Search dealerships by name, brand, city, or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setSearchQuery("")}
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>
        {/* Day Tabs + Area Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Tabs value={selectedDay} onValueChange={setSelectedDay} className="flex-1">
            <TabsList>
              {["Day 1", "Day 2", "Day 3", "Day 4"].map(day => (
                <TabsTrigger key={day} value={day} className="text-xs sm:text-sm">
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {areas.map((a: string) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Lead Temperature Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{color:'rgba(255,255,255,0.3)',fontFamily:"'Inter',sans-serif"}}>Temp:</span>
          {(['all', 'hot', 'warm', 'cold', 'lead'] as const).map(temp => {
            const isActive = leadTempFilter === temp;
            const cfg = temp === 'all' ? null : LEAD_TEMP_CONFIG[temp];
            return (
              <button
                key={temp}
                onClick={() => setLeadTempFilter(temp)}
                className="text-[11px] px-2.5 py-1 rounded-full font-semibold transition-all"
                style={{
                  background: isActive
                    ? (cfg ? cfg.bg : 'rgba(255,255,255,0.12)')
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? (cfg ? cfg.border : 'rgba(255,255,255,0.25)') : 'rgba(255,255,255,0.08)'}`,
                  color: isActive
                    ? (cfg ? cfg.color : 'rgba(255,255,255,0.85)')
                    : 'rgba(255,255,255,0.35)',
                  boxShadow: isActive && cfg ? `0 0 8px ${cfg.glow}` : 'none',
                }}
              >
                {temp === 'all' ? 'All' : LEAD_TEMP_CONFIG[temp].label}
              </button>
            );
          })}
          {leadTempFilter !== 'all' && (
            <span className="text-[10px]" style={{color:'rgba(255,255,255,0.3)'}}>
              {filteredDealerships.length} result{filteredDealerships.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {/* Dealership Cards */}
        {isLoading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 h-24" />
              </Card>
            ))}
          </div>
        ) : filteredDealerships.length === 0 ? (
          <div className="glass-card p-8 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-3" style={{color:'rgba(255,255,255,0.2)'}} />
              <p style={{color:'rgba(255,255,255,0.4)'}}>No dealerships found for {selectedDay}</p>
              <Button variant="outline" className="mt-4" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.7)'}} onClick={() => setLocation("/growth/new-dealer")}>
                Add Dealership
              </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredDealerships.map((d: any, idx: number) => (
              <HoverCard key={d.id} openDelay={400} closeDelay={100}>
                <HoverCardTrigger asChild>
                <div
                  className="glass-card cursor-pointer group"
                  onClick={() => setLocation(`/growth/dealership/${d.id}`)}
                >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs text-muted-foreground font-mono">#{idx + 1}</span>
                        {/* Clickable dealership name → goes to detail page */}
                        <button
                          className="font-semibold text-left transition-colors truncate max-w-[280px]"
                        style={{color:'rgba(255,255,255,0.9)',fontFamily:"'Space Grotesk',sans-serif"}}
                        onMouseEnter={e=>(e.currentTarget.style.color='#a5b4fc')}
                        onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.9)')}
                          onClick={(e) => { e.stopPropagation(); setLocation(`/growth/dealership/${d.id}`); }}
                          title={`Open ${d.dealershipName}`}
                        >
                          {d.dealershipName}
                        </button>
                        <Badge className={`text-[10px] border ${PRIORITY_COLORS[d.priority || "High"]}`}>
                          {d.priority}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mt-1" style={{color:'rgba(255,255,255,0.35)'}}>
                        {d.addressStreet && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {d.addressStreet}, {d.addressCity}
                          </span>
                        )}
                        {d.mainPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {d.mainPhone}
                          </span>
                        )}
                        {d.dealerWebsiteUrl ? (
                          <a
                            href={d.dealerWebsiteUrl.startsWith('http') ? d.dealerWebsiteUrl : `https://${d.dealerWebsiteUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 transition-colors font-medium"
                            style={{color:'#a5b4fc'}}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Globe className="h-3 w-3" />
                            {d.dealerWebsiteUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                          </a>
                        ) : (
                          <button
                            className="flex items-center gap-1 transition-colors text-xs"
                            style={{color:'rgba(255,255,255,0.25)'}}
                            onClick={(e) => { e.stopPropagation(); handleNameClick(e, d); }}
                          >
                            <Globe className="h-3 w-3" />
                            Add website
                          </button>
                        )}
                        {d.areaBucket && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.4)'}}>{d.areaBucket}</span>
                        )}
                      </div>
                      {/* Social Media Icons Row + Completeness + Workflow */}
                      <div className="flex items-center gap-2 mt-2">
                        <a
                          href={d.socialInstagramUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={d.socialInstagramUrl ? 'Instagram' : 'No Instagram found'}
                          className={`flex items-center ${d.socialInstagramUrl ? 'hover:scale-110 transition-transform' : 'cursor-default pointer-events-none'}`}
                          onClick={(e) => { e.stopPropagation(); if (!d.socialInstagramUrl) e.preventDefault(); }}
                        >
                          <InstagramIcon active={!!d.socialInstagramUrl} />
                        </a>
                        <a
                          href={d.socialFacebookUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={d.socialFacebookUrl ? 'Facebook' : 'No Facebook found'}
                          className={`flex items-center ${d.socialFacebookUrl ? 'hover:scale-110 transition-transform' : 'cursor-default pointer-events-none'}`}
                          onClick={(e) => { e.stopPropagation(); if (!d.socialFacebookUrl) e.preventDefault(); }}
                        >
                          <FacebookIcon active={!!d.socialFacebookUrl} />
                        </a>
                        <a
                          href={d.socialTiktokUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={d.socialTiktokUrl ? 'TikTok' : 'No TikTok found'}
                          className={`flex items-center ${d.socialTiktokUrl ? 'hover:scale-110 transition-transform' : 'cursor-default pointer-events-none'}`}
                          onClick={(e) => { e.stopPropagation(); if (!d.socialTiktokUrl) e.preventDefault(); }}
                        >
                          <TikTokIcon active={!!d.socialTiktokUrl} />
                        </a>
                        <a
                          href={d.socialYoutubeUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={d.socialYoutubeUrl ? 'YouTube' : 'No YouTube found'}
                          className={`flex items-center ${d.socialYoutubeUrl ? 'hover:scale-110 transition-transform' : 'cursor-default pointer-events-none'}`}
                          onClick={(e) => { e.stopPropagation(); if (!d.socialYoutubeUrl) e.preventDefault(); }}
                        >
                          <YouTubeIcon active={!!d.socialYoutubeUrl} />
                        </a>
                        {/* Social completeness badge */}
                        <span className="text-[10px]" style={{color:'rgba(255,255,255,0.15)'}}>|</span>
                        <SocialCompletenessBadge d={d} />
                        {(d.brandOverride || d.primaryBrand) && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded ml-1" style={{background:'rgba(99,102,241,0.12)',border:'1px solid rgba(99,102,241,0.25)',color:'#a5b4fc'}}>
                            {d.brandOverride || d.primaryBrand}
                          </span>
                        )}
                        {d.proposalSlug && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded ml-auto flex items-center gap-0.5" style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.25)',color:'#6ee7b7'}}>
                            <FileText className="h-2.5 w-2.5" />
                            Proposal
                          </span>
                        )}
                      </div>
                      {/* Workflow Step Indicator */}
                      <WorkflowStepIndicator status={d.visitStatus || 'Not Started'} />
                      {/* Quick Note display */}
                      {d.quickNote && (
                        <div className="flex items-start gap-1 mt-1.5">
                          <StickyNote className="h-3 w-3 mt-0.5 shrink-0" style={{color:'rgba(255,255,255,0.3)'}} />
                          <span className="text-[10px] italic leading-tight" style={{color:'rgba(255,255,255,0.45)'}}>{d.quickNote}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {/* Lead Temp Badge */}
                      {(() => {
                        const temp = (d.leadTemp || 'none') as LeadTemp;
                        const cfg = LEAD_TEMP_CONFIG[temp];
                        const nextTemp = LEAD_TEMP_ORDER[(LEAD_TEMP_ORDER.indexOf(temp) + 1) % LEAD_TEMP_ORDER.length];
                        return (
                          <button
                            className="text-[10px] px-2 py-0.5 rounded-full font-semibold transition-all"
                            style={{
                              background: cfg.bg,
                              border: `1px solid ${cfg.border}`,
                              color: cfg.color,
                              boxShadow: temp !== 'none' ? `0 0 6px ${cfg.glow}` : 'none',
                              opacity: temp === 'none' ? 0.4 : 1,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                            onMouseLeave={e => { e.currentTarget.style.opacity = temp === 'none' ? '0.4' : '1'; }}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateLeadTempMutation.mutate({ id: d.id, leadTemp: nextTemp });
                            }}
                            title={`Lead temp: ${cfg.label} — click to cycle`}
                          >
                            {temp === 'none' ? '+ Temp' : cfg.label}
                          </button>
                        );
                      })()}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[d.visitStatus || "Not Started"]}`}>
                        {d.visitStatus || "Not Started"}
                      </span>
                      <div className="flex gap-1">
                        <button
                          className="h-7 w-7 p-0 flex items-center justify-center rounded-md transition-colors"
                          style={{color:'rgba(255,255,255,0.35)'}}
                          onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.08)')}
                          onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
                          onClick={(e) => openMaps(d, e)}
                          title="Navigate"
                        >
                          <Navigation className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="h-7 w-7 p-0 flex items-center justify-center rounded-md transition-colors"
                          style={{color:'#a5b4fc'}}
                          onMouseEnter={e=>(e.currentTarget.style.background='rgba(99,102,241,0.15)')}
                          onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
                          onClick={(e) => { e.stopPropagation(); setLocation(`/growth/pitch/${d.id}`); }}
                          title="Rapid Pitch"
                        >
                          <Zap className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="h-7 w-7 p-0 flex items-center justify-center rounded-md transition-all"
                          style={{
                            color: d.visitStatus !== 'Not Started' ? '#4ade80' : 'rgba(255,255,255,0.35)',
                            background: d.visitStatus !== 'Not Started' ? 'rgba(74,222,128,0.12)' : 'transparent',
                            border: d.visitStatus !== 'Not Started' ? '1px solid rgba(74,222,128,0.25)' : '1px solid transparent',
                          }}
                          onMouseEnter={e => {
                            if (d.visitStatus === 'Not Started') {
                              e.currentTarget.style.background = 'rgba(74,222,128,0.1)';
                              e.currentTarget.style.color = '#4ade80';
                            }
                          }}
                          onMouseLeave={e => {
                            if (d.visitStatus === 'Not Started') {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVisitedMutation.mutate({ id: d.id });
                          }}
                          title={d.visitStatus !== 'Not Started' ? 'Mark as Not Visited' : 'Mark as Visited'}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </button>
                        {/* Quick Note Button */}
                        <Popover open={editingNoteId === d.id} onOpenChange={(open) => {
                          if (!open) setEditingNoteId(null);
                        }}>
                          <PopoverTrigger asChild>
                            <button
                              className="h-7 w-7 p-0 flex items-center justify-center rounded-md transition-all"
                              style={{
                                color: d.quickNote ? '#fbbf24' : 'rgba(255,255,255,0.35)',
                                background: d.quickNote ? 'rgba(251,191,36,0.1)' : 'transparent',
                                border: d.quickNote ? '1px solid rgba(251,191,36,0.2)' : '1px solid transparent',
                              }}
                              onMouseEnter={e => {
                                if (!d.quickNote) {
                                  e.currentTarget.style.background = 'rgba(251,191,36,0.08)';
                                  e.currentTarget.style.color = '#fbbf24';
                                }
                              }}
                              onMouseLeave={e => {
                                if (!d.quickNote) {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
                                }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setNoteInput(d.quickNote || '');
                                setEditingNoteId(d.id);
                              }}
                              title={d.quickNote ? 'Edit quick note' : 'Add quick note'}
                            >
                              <StickyNote className="h-3.5 w-3.5" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-72 p-3"
                            style={{background:'rgba(15,12,41,0.97)',backdropFilter:'blur(24px)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.85)'}}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="space-y-2">
                              <p className="text-[11px] font-semibold" style={{color:'rgba(255,255,255,0.5)',fontFamily:"'Inter',sans-serif",textTransform:'uppercase',letterSpacing:'0.06em'}}>Quick Note</p>
                              <Textarea
                                value={noteInput}
                                onChange={e => setNoteInput(e.target.value)}
                                placeholder="Short note about this dealer..."
                                maxLength={280}
                                rows={3}
                                className="text-xs resize-none"
                                style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.85)'}}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    updateQuickNoteMutation.mutate({ id: d.id, quickNote: noteInput.trim() });
                                    setEditingNoteId(null);
                                    toast.success('Note saved');
                                  }
                                  if (e.key === 'Escape') setEditingNoteId(null);
                                }}
                                autoFocus
                              />
                              <div className="flex items-center justify-between">
                                <span className="text-[10px]" style={{color:'rgba(255,255,255,0.25)'}}>{noteInput.length}/280</span>
                                <div className="flex gap-1.5">
                                  {d.quickNote && (
                                    <button
                                      className="text-[10px] px-2 py-1 rounded"
                                      style={{color:'rgba(239,68,68,0.7)',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.15)'}}
                                      onClick={() => {
                                        updateQuickNoteMutation.mutate({ id: d.id, quickNote: '' });
                                        setEditingNoteId(null);
                                        toast.success('Note cleared');
                                      }}
                                    >Clear</button>
                                  )}
                                  <button
                                    className="text-[10px] px-2 py-1 rounded font-semibold"
                                    style={{background:'rgba(99,102,241,0.2)',border:'1px solid rgba(99,102,241,0.3)',color:'#a5b4fc'}}
                                    onClick={() => {
                                      updateQuickNoteMutation.mutate({ id: d.id, quickNote: noteInput.trim() });
                                      setEditingNoteId(null);
                                      toast.success('Note saved');
                                    }}
                                  >Save</button>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                </HoverCardTrigger>
                <HoverCardContent
                  side="bottom"
                  align="center"
                  sideOffset={8}
                  className="w-80 p-4 shadow-2xl"
                  style={{background:'rgba(15,12,41,0.97)',backdropFilter:'blur(24px)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.85)'}}
                  onClick={(e) => e.stopPropagation()}
                >
                  <DealerQuickView d={d} />
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        )}
      </div>

      {/* URL Entry Modal */}
      <Dialog open={urlModalOpen} onOpenChange={setUrlModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Website URL</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              No website URL found for <strong>{urlModalName}</strong>. Add one to enable quick access.
            </p>
            <div>
              <Label>Dealer Website URL</Label>
              <Input
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://www.dealership.com"
                className="mt-1.5"
                onKeyDown={e => {
                  if (e.key === 'Enter' && urlInput && urlModalDealerId) {
                    updateMutation.mutate({ id: urlModalDealerId, dealerWebsiteUrl: urlInput });
                  }
                }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setUrlModalOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (urlInput && urlModalDealerId) {
                    updateMutation.mutate({ id: urlModalDealerId, dealerWebsiteUrl: urlInput });
                  }
                }}
                disabled={!urlInput || updateMutation.isPending}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
