import { toast } from "sonner";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


import {
  Camera, Video, Scissors, Loader2, AlertCircle, ChevronRight,
  MapPin, Calendar, Clock, CheckCircle2, XCircle, Briefcase,
  User, Globe, DollarSign, Edit3, Save, X
} from "lucide-react";

const ROLE_ICONS: Record<string, React.ReactNode> = {
  photographer: <Camera className="w-4 h-4" />,
  videographer: <Video className="w-4 h-4" />,
  editor: <Scissors className="w-4 h-4" />,
  drone_operator: <Camera className="w-4 h-4" />,
  social_media: <Globe className="w-4 h-4" />,
  graphic_designer: <Edit3 className="w-4 h-4" />,
  other: <Briefcase className="w-4 h-4" />,
};

const JOB_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending Response", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  confirmed: { label: "Confirmed", color: "bg-green-500/20 text-green-300 border-green-500/30" },
  in_progress: { label: "In Progress", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  completed: { label: "Completed", color: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30" },
  cancelled: { label: "Cancelled", color: "bg-red-500/20 text-red-300 border-red-500/30" },
};

// ─── Token Gate ───────────────────────────────────────────────────────────────
function TokenGate({ onToken }: { onToken: (t: string) => void }) {
  const [input, setInput] = useState("");
  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[oklch(0.85_0.23_110)] mb-4">
            <Camera className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Vendor Portal</h1>
          <p className="text-zinc-400">Enter your invite token to access your vendor dashboard</p>
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
          Don't have a token? Contact your Loomelic Media coordinator.
        </p>
      </div>
    </div>
  );
}

// ─── Profile Editor ───────────────────────────────────────────────────────────
function ProfileEditor({ vendor, token, onSave }: {
  vendor: { name?: string | null; phone?: string | null; bio?: string | null; location?: string | null; portfolioUrl?: string | null; role: string };
  token: string;
  onSave: () => void;
}) {
  
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: vendor.name ?? "",
    phone: vendor.phone ?? "",
    bio: vendor.bio ?? "",
    location: vendor.location ?? "",
    portfolioUrl: vendor.portfolioUrl ?? "",
  });

  const updateMutation = trpc.vendor.updateVendorProfile.useMutation({
    onSuccess: () => { toast.success("Profile updated"); setEditing(false); onSave(); },
    onError: (e) => toast.error("Update failed: " + e.message),
  });

  if (!editing) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            {ROLE_ICONS[vendor.role] ?? <Briefcase className="w-4 h-4" />}
            <span className="capitalize">{vendor.role?.replace("_", " ")}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="text-zinc-400 hover:text-white h-7">
            <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {vendor.location && <div className="flex items-center gap-2 text-sm text-zinc-400"><MapPin className="w-3.5 h-3.5" />{vendor.location}</div>}
          {vendor.phone && <div className="flex items-center gap-2 text-sm text-zinc-400"><User className="w-3.5 h-3.5" />{vendor.phone}</div>}
          {vendor.portfolioUrl && <div className="flex items-center gap-2 text-sm text-zinc-400"><Globe className="w-3.5 h-3.5" /><a href={vendor.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white truncate">{vendor.portfolioUrl}</a></div>}
          {vendor.bio && <p className="text-sm text-zinc-400 mt-2">{vendor.bio}</p>}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-white text-sm">Edit Profile</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="text-zinc-400 h-7 w-7 p-0">
          <X className="w-3.5 h-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { key: "name", placeholder: "Full Name" },
          { key: "phone", placeholder: "Phone Number" },
          { key: "location", placeholder: "City, State" },
          { key: "portfolioUrl", placeholder: "Portfolio URL" },
        ].map(f => (
          <Input
            key={f.key}
            value={form[f.key as keyof typeof form]}
            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
            className="bg-zinc-800 border-zinc-700 text-white text-sm"
          />
        ))}
        <Textarea
          value={form.bio}
          onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
          placeholder="Short bio..."
          className="bg-zinc-800 border-zinc-700 text-white text-sm"
          rows={3}
        />
        <Button
          onClick={() => updateMutation.mutate({ token, ...form })}
          disabled={updateMutation.isPending}
          className="w-full bg-[oklch(0.85_0.23_110)] text-black font-bold"
        >
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Profile
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, token, onUpdate }: {
  job: { id: number; title: string; description?: string | null; eventDate?: string | null; eventCity?: string | null; status: string; deliverablesDue?: string | null; notes?: string | null };
  token: string;
  onUpdate: () => void;
}) {
  
  const statusCfg = JOB_STATUS_CONFIG[job.status] ?? JOB_STATUS_CONFIG.pending;

  const respondMutation = trpc.vendor.respondToJob.useMutation({
    onSuccess: () => { toast.success("Response recorded"); onUpdate(); },
    onError: (e) => toast.error("Error: " + e.message),
  });

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-white">{job.title}</h3>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-semibold flex-shrink-0 ${statusCfg.color}`}>
            {statusCfg.label}
          </span>
        </div>
        {job.description && <p className="text-sm text-zinc-400 mb-3">{job.description}</p>}
        <div className="flex flex-wrap gap-3 text-xs text-zinc-500 mb-3">
          {job.eventDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{job.eventDate}</span>}
          {job.eventCity && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.eventCity}</span>}
          {job.deliverablesDue && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Due: {job.deliverablesDue}</span>}
        </div>
        {job.notes && <p className="text-xs text-zinc-500 italic mb-3">{job.notes}</p>}
        {job.status === "pending" && (
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              onClick={() => respondMutation.mutate({ token, jobId: job.id, accept: true })}
              disabled={respondMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => respondMutation.mutate({ token, jobId: job.id, accept: false })}
              disabled={respondMutation.isPending}
              className="flex-1 border-red-700 text-red-400 hover:bg-red-900/20"
            >
              <XCircle className="w-3.5 h-3.5 mr-1" /> Decline
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Vendor Portal ───────────────────────────────────────────────────────
export default function VendorPortal() {
  const [token, setToken] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  });

  const { data, isLoading, error, refetch } = trpc.vendor.getVendorByToken.useQuery(
    { token: token! },
    { enabled: !!token, retry: false }
  );

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

  const vendor = data!.vendor;
  const jobs = data!.jobs;
  const pendingJobs = jobs.filter(j => j.status === "pending");
  const activeJobs = jobs.filter(j => j.status === "confirmed" || j.status === "in_progress");
  const pastJobs = jobs.filter(j => j.status === "completed" || j.status === "cancelled");

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-[oklch(0.85_0.23_110)] flex items-center justify-center text-black font-black text-lg">
            {vendor.name?.[0]?.toUpperCase() ?? "V"}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{vendor.name ?? "Vendor"}</h1>
            <p className="text-zinc-400 text-sm capitalize">{vendor.role?.replace("_", " ")} · Loomelic Media</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Pending", value: pendingJobs.length, color: "text-yellow-400" },
            { label: "Active", value: activeJobs.length, color: "text-green-400" },
            { label: "Completed", value: pastJobs.length, color: "text-zinc-400" },
          ].map(s => (
            <Card key={s.label} className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-3 pb-3 text-center">
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs text-zinc-500">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Profile */}
          <div className="lg:col-span-1">
            <ProfileEditor vendor={vendor} token={token} onSave={refetch} />
          </div>

          {/* Jobs */}
          <div className="lg:col-span-2 space-y-4">
            {pendingJobs.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Awaiting Response ({pendingJobs.length})
                </h2>
                <div className="space-y-3">
                  {pendingJobs.map(j => <JobCard key={j.id} job={j} token={token} onUpdate={refetch} />)}
                </div>
              </div>
            )}
            {activeJobs.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" /> Active Jobs ({activeJobs.length})
                </h2>
                <div className="space-y-3">
                  {activeJobs.map(j => <JobCard key={j.id} job={j} token={token} onUpdate={refetch} />)}
                </div>
              </div>
            )}
            {pastJobs.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-2">Past Jobs</h2>
                <div className="space-y-3">
                  {pastJobs.map(j => <JobCard key={j.id} job={j} token={token} onUpdate={refetch} />)}
                </div>
              </div>
            )}
            {jobs.length === 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-8 pb-8 text-center">
                  <Briefcase className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400">No jobs assigned yet.</p>
                  <p className="text-zinc-500 text-sm mt-1">Your coordinator will assign jobs here when available.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
