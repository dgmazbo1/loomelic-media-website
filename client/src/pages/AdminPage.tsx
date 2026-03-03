/* ============================================================
   Admin Panel — Media Management
   Route: /admin (protected, admin role only)
   Features:
   - Project list sidebar
   - Gallery manager: upload, delete, drag-to-reorder
   - Hero image picker (upload or promote from gallery)
   - Video manager: add/edit/delete embed URLs
   ============================================================ */
import { useState, useRef, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Upload, Trash2, GripVertical, Video, Image, ChevronRight, LogOut, Star, Plus, X, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// All projects on the site — slug must match the router
const SITE_PROJECTS = [
  { slug: "lexus-of-henderson", name: "Lexus of Henderson" },
  { slug: "lexus-of-las-vegas", name: "Lexus of Las Vegas" },
  { slug: "las-vegas-raiders-tour", name: "Las Vegas Raiders Tour" },
  { slug: "centennial-subaru", name: "Centennial Subaru" },
  { slug: "wondr-nation-g2e", name: "Wondr Nation G2E" },
  { slug: "bob-marley-hope-road", name: "Bob Marley Hope Road" },
  { slug: "sports-illustrated-sportsperson-2026", name: "Sports Illustrated 2026" },
];

// Convert a File to base64 string
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // strip data:...;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Gallery Image Card ───────────────────────────────────────────────────────
function GalleryCard({
  image,
  index,
  total,
  onDelete,
  onMoveUp,
  onMoveDown,
  onSetHero,
  isHero,
}: {
  image: { id: number; url: string; altText?: string | null; sortOrder: number };
  index: number;
  total: number;
  onDelete: (id: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onSetHero: (url: string) => void;
  isHero: boolean;
}) {
  return (
    <div className={`relative group rounded-xl overflow-hidden border-2 transition-all ${isHero ? "border-amber-400" : "border-white/10 hover:border-white/30"}`}>
      <img src={image.url} alt={image.altText ?? ""} className="w-full aspect-square object-cover" />
      {isHero && (
        <div className="absolute top-2 left-2">
          <Badge className="bg-amber-400 text-black text-[0.6rem] font-bold px-2 py-0.5">HERO</Badge>
        </div>
      )}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
        <div className="flex gap-1.5">
          <button
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-colors"
            title="Move left"
          >
            <GripVertical size={14} className="text-white rotate-90" />
          </button>
          <button
            onClick={() => onMoveDown(index)}
            disabled={index === total - 1}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-colors"
            title="Move right"
          >
            <GripVertical size={14} className="text-white -rotate-90" />
          </button>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => onSetHero(image.url)}
            className="p-1.5 rounded-lg bg-amber-500/80 hover:bg-amber-500 transition-colors"
            title="Set as hero/cover"
          >
            <Star size={14} className="text-white" />
          </button>
          <button
            onClick={() => onDelete(image.id)}
            className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} className="text-white" />
          </button>
        </div>
      </div>
      <div className="absolute bottom-1 right-1 bg-black/60 text-white/50 text-[0.55rem] px-1.5 py-0.5 rounded">
        #{index + 1}
      </div>
    </div>
  );
}

// ─── Video Row ────────────────────────────────────────────────────────────────
function VideoRow({
  video,
  onUpdate,
  onDelete,
}: {
  video: { id: number; label?: string | null; embedUrl: string };
  onUpdate: (id: number, label: string, embedUrl: string) => void;
  onDelete: (id: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(video.label ?? "");
  const [url, setUrl] = useState(video.embedUrl);

  const save = () => {
    onUpdate(video.id, label, url);
    setEditing(false);
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
      <Video size={16} className="text-white/40 mt-1 shrink-0" />
      {editing ? (
        <div className="flex-1 flex flex-col gap-2">
          <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label (e.g. Walk-around)" className="h-8 text-xs bg-white/5 border-white/20 text-white" />
          <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="Embed URL" className="h-8 text-xs bg-white/5 border-white/20 text-white" />
          <div className="flex gap-2">
            <button onClick={save} className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300"><Check size={12} /> Save</button>
            <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-xs text-white/40 hover:text-white/60"><X size={12} /> Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-xs font-medium truncate">{video.label || "Untitled"}</p>
          <p className="text-white/30 text-[0.65rem] truncate">{video.embedUrl}</p>
        </div>
      )}
      {!editing && (
        <div className="flex gap-1.5 shrink-0">
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"><Pencil size={12} className="text-white/60" /></button>
          <button onClick={() => onDelete(video.id)} className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition-colors"><Trash2 size={12} className="text-red-400" /></button>
        </div>
      )}
    </div>
  );
}

// ─── Project Editor ───────────────────────────────────────────────────────────
function ProjectEditor({ slug, name }: { slug: string; name: string }) {
  const utils = trpc.useUtils();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoLabel, setNewVideoLabel] = useState("");
  const [addingVideo, setAddingVideo] = useState(false);

  // Ensure project row exists
  const ensureMut = trpc.admin.ensureProject.useMutation();
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const { data, isLoading, refetch } = trpc.admin.getProject.useQuery(
    { slug },
    {
      retry: false,
      // Retry once after a short delay to catch the case where ensureProject just ran
      retryDelay: 500,
    }
  );

  // If project not found in DB, seed it then refetch
  // Use useEffect to avoid calling setState during render
  useEffect(() => {
    if (!data && !isLoading && !seeded && !seeding) {
      setSeeding(true);
      setSeeded(true);
      ensureMut.mutateAsync({ slug, name })
        .then(() => refetch())
        .catch((err) => { console.error("ensureProject failed", err); })
        .finally(() => setSeeding(false));
    }
  }, [data, isLoading, seeded, seeding, slug, name, ensureMut, refetch]);

  const uploadGallery = trpc.admin.uploadGalleryImage.useMutation({
    onSuccess: () => { utils.admin.getProject.invalidate({ slug }); toast.success("Photo uploaded"); },
    onError: (e) => toast.error(e.message),
  });

  const uploadHero = trpc.admin.uploadHeroImage.useMutation({
    onSuccess: () => { utils.admin.getProject.invalidate({ slug }); toast.success("Hero image updated"); },
    onError: (e) => toast.error(e.message),
  });

  const deleteImage = trpc.admin.deleteGalleryImage.useMutation({
    onSuccess: () => { utils.admin.getProject.invalidate({ slug }); toast.success("Photo removed"); },
    onError: (e) => toast.error(e.message),
  });

  const reorder = trpc.admin.reorderGallery.useMutation({
    onSuccess: () => utils.admin.getProject.invalidate({ slug }),
    onError: (e) => toast.error(e.message),
  });

  const addVideo = trpc.admin.addVideo.useMutation({
    onSuccess: () => { utils.admin.getProject.invalidate({ slug }); setNewVideoUrl(""); setNewVideoLabel(""); setAddingVideo(false); toast.success("Video added"); },
    onError: (e) => toast.error(e.message),
  });

  const updateVideo = trpc.admin.updateVideo.useMutation({
    onSuccess: () => { utils.admin.getProject.invalidate({ slug }); toast.success("Video updated"); },
    onError: (e) => toast.error(e.message),
  });

  const deleteVideo = trpc.admin.deleteVideo.useMutation({
    onSuccess: () => { utils.admin.getProject.invalidate({ slug }); toast.success("Video removed"); },
    onError: (e) => toast.error(e.message),
  });

  const handleGalleryUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const base64 = await fileToBase64(file);
        await uploadGallery.mutateAsync({ slug, filename: file.name, mimeType: file.type, base64 });
      }
    } finally {
      setUploading(false);
    }
  }, [slug, uploadGallery]);

  const handleHeroUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const base64 = await fileToBase64(file);
    await uploadHero.mutateAsync({ slug, filename: file.name, mimeType: file.type, base64 });
  }, [slug, uploadHero]);

  const handleMoveUp = useCallback((index: number) => {
    if (!data?.gallery || index === 0) return;
    const gallery = [...data.gallery];
    const temp = gallery[index - 1];
    gallery[index - 1] = gallery[index];
    gallery[index] = temp;
    reorder.mutate({ updates: gallery.map((img, i) => ({ id: img.id, sortOrder: i })) });
  }, [data?.gallery, reorder]);

  const handleMoveDown = useCallback((index: number) => {
    if (!data?.gallery || index === data.gallery.length - 1) return;
    const gallery = [...data.gallery];
    const temp = gallery[index + 1];
    gallery[index + 1] = gallery[index];
    gallery[index] = temp;
    reorder.mutate({ updates: gallery.map((img, i) => ({ id: img.id, sortOrder: i })) });
  }, [data?.gallery, reorder]);

  const handleSetHero = useCallback(async (url: string) => {
    // We need to re-upload the image as hero — for now, just update the project hero URL directly
    // by uploading the same image from its URL (fetch + re-upload)
    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      const file = new File([blob], "hero.jpg", { type: blob.type });
      const base64 = await fileToBase64(file);
      await uploadHero.mutateAsync({ slug, filename: "hero.jpg", mimeType: blob.type, base64 });
    } catch {
      toast.error("Failed to set hero image");
    }
  }, [slug, uploadHero]);

  if (isLoading || seeding) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          {seeding && <p className="text-white/30 text-xs">Setting up project...</p>}
        </div>
      </div>
    );
  }

  const heroUrl = data?.project?.heroImageUrl;
  const gallery = data?.gallery ?? [];
  const videos = data?.videos ?? [];

  return (
    <div className="space-y-8">
      {/* Hero Image */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/80 tracking-widest uppercase flex items-center gap-2">
            <Star size={14} className="text-amber-400" /> Cover / Hero Image
          </h3>
          <button
            onClick={() => heroInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Upload size={12} /> Upload New Hero
          </button>
          <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleHeroUpload(e.target.files)} />
        </div>
        {heroUrl ? (
          <div className="relative rounded-2xl overflow-hidden aspect-video max-w-md">
            <img src={heroUrl} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <Badge className="absolute bottom-3 left-3 bg-amber-400 text-black text-[0.6rem] font-bold">CURRENT HERO</Badge>
          </div>
        ) : (
          <div
            onClick={() => heroInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 rounded-2xl aspect-video max-w-md flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-white/40 transition-colors"
          >
            <Image size={32} className="text-white/20" />
            <p className="text-white/30 text-sm">Click to upload hero image</p>
          </div>
        )}
      </section>

      {/* Gallery */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/80 tracking-widest uppercase flex items-center gap-2">
            <Image size={14} className="text-blue-400" /> Gallery ({gallery.length} photos)
          </h3>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <><div className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" /> Uploading...</>
            ) : (
              <><Upload size={12} /> Add Photos</>
            )}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleGalleryUpload(e.target.files)} />
        </div>

        {gallery.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-white/40 transition-colors"
          >
            <Upload size={32} className="text-white/20" />
            <p className="text-white/30 text-sm">Click to upload photos</p>
            <p className="text-white/20 text-xs">Supports JPG, PNG, WEBP — multiple files at once</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {gallery.map((img, i) => (
              <GalleryCard
                key={img.id}
                image={img}
                index={i}
                total={gallery.length}
                onDelete={(id) => deleteImage.mutate({ id })}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onSetHero={handleSetHero}
                isHero={heroUrl === img.url}
              />
            ))}
            {/* Upload tile */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <Plus size={20} className="text-white/30" />
              <span className="text-white/20 text-[0.6rem]">Add</span>
            </div>
          </div>
        )}
      </section>

      {/* Videos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/80 tracking-widest uppercase flex items-center gap-2">
            <Video size={14} className="text-purple-400" /> Videos ({videos.length})
          </h3>
          <button
            onClick={() => setAddingVideo(true)}
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={12} /> Add Video
          </button>
        </div>

        <div className="space-y-2">
          {addingVideo && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/20 space-y-2">
              <Input value={newVideoLabel} onChange={e => setNewVideoLabel(e.target.value)} placeholder="Label (e.g. Walk-around Tour)" className="h-8 text-xs bg-white/5 border-white/20 text-white" />
              <Input value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} placeholder="Vimeo or YouTube embed URL" className="h-8 text-xs bg-white/5 border-white/20 text-white" />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => addVideo.mutate({ slug, label: newVideoLabel, embedUrl: newVideoUrl })}
                  disabled={!newVideoUrl || addVideo.isPending}
                >
                  {addVideo.isPending ? "Adding..." : "Add Video"}
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-white/40" onClick={() => setAddingVideo(false)}>Cancel</Button>
              </div>
            </div>
          )}
          {videos.length === 0 && !addingVideo && (
            <p className="text-white/20 text-sm text-center py-6">No videos yet — click "Add Video" to add a Vimeo or YouTube embed URL</p>
          )}
          {videos.map(v => (
            <VideoRow
              key={v.id}
              video={v}
              onUpdate={(id, label, embedUrl) => updateVideo.mutate({ id, label, embedUrl })}
              onDelete={(id) => deleteVideo.mutate({ id })}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Publish Button ─────────────────────────────────────────────────────────
function PublishButton() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const requestPublish = trpc.admin.requestPublish.useMutation();

  const handlePublish = async () => {
    setState("loading");
    try {
      await requestPublish.mutateAsync();
      setState("done");
      setTimeout(() => setState("idle"), 4000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handlePublish}
        disabled={state === "loading"}
        className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
          state === "done"
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : state === "error"
            ? "bg-red-500/20 text-red-400 border border-red-500/30"
            : "bg-white text-black hover:bg-white/90 active:scale-95"
        } disabled:opacity-60`}
      >
        {state === "loading" && <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
        {state === "done" && <span>✓</span>}
        {state === "error" && <span>✕</span>}
        {state === "idle" && <span className="text-base leading-none">🚀</span>}
        {state === "loading" ? "Publishing..." : state === "done" ? "Publish Requested!" : state === "error" ? "Failed — Retry" : "Publish Changes"}
      </button>
      {state === "done" && (
        <p className="text-[0.6rem] text-green-400/70 text-center leading-tight px-1">
          Click the Publish button in the Manus Management UI to go live.
        </p>
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Must be called unconditionally before any early returns (Rules of Hooks)
  const { data: projectStatuses, refetch: refetchStatuses } = trpc.admin.listProjectsWithStatus.useQuery(
    undefined,
    { refetchOnWindowFocus: false, enabled: isAuthenticated && user?.role === "admin" }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[oklch(0.07_0_0)] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[oklch(0.07_0_0)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
            <Image size={28} className="text-white/30" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access Required</h1>
          <p className="text-white/50 text-sm">Sign in with your Manus account to manage media.</p>
          {/* Pass /admin as returnPath so OAuth redirects back here after login */}
          <a href={getLoginUrl("/admin")} className="inline-flex items-center gap-2 bg-white text-black font-semibold text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-colors">
            Sign In with Manus
          </a>
          <div>
            <a href="/" className="text-xs text-white/30 hover:text-white/50 transition-colors">← Back to site</a>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[oklch(0.07_0_0)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-white/50 text-sm">Your account does not have admin privileges.</p>
          <p className="text-white/30 text-xs max-w-xs mx-auto">Only the site owner can access this panel. If you are the owner, please sign out and sign in again to refresh your permissions.</p>
          <div className="flex flex-col gap-2 items-center">
            <button onClick={logout} className="text-sm text-white/40 hover:text-white/60 underline">Sign out</button>
            <a href="/" className="text-xs text-white/30 hover:text-white/50 transition-colors">← Back to site</a>
          </div>
        </div>
      </div>
    );
  }

  const selectedProject = SITE_PROJECTS.find(p => p.slug === selectedSlug);

  // Build a quick lookup map by slug
  const statusBySlug = Object.fromEntries(
    (projectStatuses ?? []).map(s => [s.slug, s])
  );

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] flex">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 bg-[oklch(0.1_0_0)] border-r border-white/10 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white text-[0.6rem] font-bold">L</span>
            </div>
            <span className="text-white font-semibold text-sm">Loomelic Admin</span>
          </div>
          <p className="text-white/30 text-[0.65rem]">Media Management</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-white/30 text-[0.6rem] font-semibold tracking-widest uppercase">Projects</p>
            {/* Overall readiness summary */}
            {projectStatuses && (
              <span className="text-[0.6rem] text-white/25">
                {projectStatuses.filter(p => p.hasHero).length}/{projectStatuses.length} ready
              </span>
            )}
          </div>
          {SITE_PROJECTS.map(p => {
            const status = statusBySlug[p.slug];
            const isSelected = selectedSlug === p.slug;
            const hasHero = status?.hasHero ?? false;
            const galleryCount = status?.galleryCount ?? 0;
            const videoCount = status?.videoCount ?? 0;
            const isComplete = hasHero && galleryCount > 0;

            return (
              <button
                key={p.slug}
                onClick={() => { setSelectedSlug(p.slug); refetchStatuses(); }}
                className={`w-full flex flex-col px-3 py-2.5 rounded-xl text-left transition-colors ${
                  isSelected ? "bg-white/15 text-white" : "text-white/50 hover:text-white hover:bg-white/8"
                }`}
              >
                {/* Project name row */}
                <div className="flex items-center justify-between w-full">
                  <span className="truncate text-sm font-medium">{p.name}</span>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {isComplete ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" title="Ready" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Needs attention" />
                    )}
                    {isSelected && <ChevronRight size={12} className="text-white/40" />}
                  </div>
                </div>
                {/* Status badges row */}
                <div className="flex items-center gap-1.5 mt-1">
                  {/* Hero badge */}
                  <span className={`text-[0.55rem] px-1.5 py-0.5 rounded font-semibold tracking-wide ${
                    hasHero
                      ? "bg-green-500/15 text-green-400"
                      : "bg-amber-500/15 text-amber-400"
                  }`}>
                    {hasHero ? "✓ HERO" : "! HERO"}
                  </span>
                  {/* Gallery count badge */}
                  <span className={`text-[0.55rem] px-1.5 py-0.5 rounded font-semibold tracking-wide ${
                    galleryCount > 0
                      ? "bg-blue-500/15 text-blue-400"
                      : "bg-white/8 text-white/25"
                  }`}>
                    {galleryCount} PHOTO{galleryCount !== 1 ? "S" : ""}
                  </span>
                  {/* Video count badge — only show if there are videos */}
                  {videoCount > 0 && (
                    <span className="text-[0.55rem] px-1.5 py-0.5 rounded font-semibold tracking-wide bg-purple-500/15 text-purple-400">
                      {videoCount} VID
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <PublishButton />
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-colors text-sm"
          >
            <LogOut size={14} /> Sign Out
          </button>
          <a href="/" className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-colors text-sm">
            ← Back to Site
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {selectedProject ? (
          <div className="p-8 max-w-5xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">{selectedProject.name}</h1>
              <p className="text-white/40 text-sm mt-1">Manage photos, hero image, and videos for this project</p>
            </div>
            <ProjectEditor slug={selectedProject.slug} name={selectedProject.name} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[60vh]">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
                <Image size={28} className="text-white/20" />
              </div>
              <h2 className="text-white/60 font-semibold">Select a project</h2>
              <p className="text-white/30 text-sm">Choose a project from the sidebar to manage its media</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
