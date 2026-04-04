/* ============================================================
   Admin Panel — Media Management
   Route: /admin (protected, admin role only)
   Features:
   - Project list sidebar
   - Gallery manager: upload, delete, drag-to-reorder
   - Hero image picker (upload or promote from gallery)
   - Video manager: add/edit/delete embed URLs
   ============================================================ */
import React, { useState, useRef, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Upload, Trash2, GripVertical, Video, Image, ChevronRight, LogOut, Star, Plus, X, Pencil, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AdminLayout, { TW, TWCard } from "@/components/AdminLayout";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

// ─── Sortable Gallery Image Card (drag-and-drop) ─────────────────────────────
function SortableGalleryCard({
  image,
  index,
  onDelete,
  onSetHero,
  isHero,
}: {
  image: { id: number; url: string; altText?: string | null; sortOrder: number };
  index: number;
  onDelete: (id: number) => void;
  onSetHero: (url: string) => void;
  isHero: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-xl overflow-hidden border-2 transition-colors ${
        isHero ? "border-amber-400" : "border-white/10 hover:border-white/30"
      } ${isDragging ? "shadow-2xl ring-2 ring-white/30" : ""}`}
    >
      <img src={image.url} alt={image.altText ?? ""} className="w-full aspect-square object-cover" />

      {/* Hero badge */}
      {isHero && (
        <div className="absolute top-2 left-2">
          <Badge className="bg-amber-400 text-black text-[0.6rem] font-bold px-2 py-0.5">HERO</Badge>
        </div>
      )}

      {/* Drag handle — top-right corner, always visible */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-black/50 hover:bg-black/70 cursor-grab active:cursor-grabbing transition-colors opacity-0 group-hover:opacity-100"
        title="Drag to reorder"
      >
        <GripVertical size={14} className="text-white/80" />
      </div>

      {/* Hover action buttons */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 pointer-events-none">
        <div className="flex gap-1.5 pointer-events-auto">
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

      {/* Position number */}
      <div className="absolute bottom-1 left-1 bg-black/60 text-white/50 text-[0.55rem] px-1.5 py-0.5 rounded">
        #{index + 1}
      </div>
    </div>
  );
}

// ─── Sortable Video Row ──────────────────────────────────────────────────────
function SortableVideoRow({
  video,
  onUpdate,
  onDelete,
}: {
  video: { id: number; label?: string | null; embedUrl: string; portrait?: boolean; sortOrder: number };
  onUpdate: (id: number, label: string, embedUrl: string, portrait: boolean) => void;
  onDelete: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <VideoRow video={video} onUpdate={onUpdate} onDelete={onDelete} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

// ─── Video Row ────────────────────────────────────────────────────────────────
function VideoRow({
  video,
  onUpdate,
  onDelete,
  dragHandleProps,
}: {
  video: { id: number; label?: string | null; embedUrl: string; portrait?: boolean };
  onUpdate: (id: number, label: string, embedUrl: string, portrait: boolean) => void;
  onDelete: (id: number) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(video.label ?? "");
  const [url, setUrl] = useState(video.embedUrl);
  const [portrait, setPortrait] = useState(video.portrait ?? false);

  const save = () => {
    onUpdate(video.id, label, url, portrait);
    setEditing(false);
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
      {/* Drag handle */}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="mt-1 p-1 rounded cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 transition-colors shrink-0"
          title="Drag to reorder"
        >
          <GripVertical size={14} />
        </div>
      )}
      <Video size={16} className="text-white/40 mt-1 shrink-0" />
      {editing ? (
        <div className="flex-1 flex flex-col gap-2">
          <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label (e.g. Walk-around)" className="h-8 text-xs bg-white/5 border-white/20 text-white" />
          <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="Embed URL" className="h-8 text-xs bg-white/5 border-white/20 text-white" />
          {/* Portrait toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setPortrait(p => !p)}
              className={`relative w-9 h-5 rounded-full transition-colors ${ portrait ? 'bg-purple-500' : 'bg-white/20' }`}
            >
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${ portrait ? 'translate-x-4' : '' }`} />
            </div>
            <span className="text-xs text-white/50">Portrait / Vertical (9:16)</span>
          </label>
          <div className="flex gap-2">
            <button onClick={save} className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300"><Check size={12} /> Save</button>
            <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-xs text-white/40 hover:text-white/60"><X size={12} /> Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white/80 text-xs font-medium truncate">{video.label || "Untitled"}</p>
            {video.portrait && (
              <span className="shrink-0 text-[0.55rem] font-bold tracking-wide text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded-full">9:16</span>
            )}
          </div>
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

// ─── Upload Queue Item ──────────────────────────────────────────────────────
type UploadItem = {
  id: string;           // local uuid
  file: File;
  previewUrl: string;   // object URL for thumbnail
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

// ─── Bulk Upload Drop Zone ───────────────────────────────────────────────────
function BulkUploadZone({
  onFilesSelected,
  disabled,
}: {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (files.length) onFilesSelected(files);
  }, [disabled, onFilesSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onFilesSelected(files);
    e.target.value = "";
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
        dragging
          ? "border-blue-400/60 bg-blue-500/10 scale-[1.01]"
          : disabled
          ? "border-white/10 opacity-50 cursor-not-allowed"
          : "border-white/20 hover:border-white/40 hover:bg-white/3"
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
        dragging ? "bg-blue-500/20" : "bg-white/5"
      }`}>
        <Upload size={22} className={dragging ? "text-blue-400" : "text-white/30"} />
      </div>
      <div className="text-center">
        <p className={`text-sm font-medium ${ dragging ? "text-blue-300" : "text-white/50" }`}>
          {dragging ? "Drop to upload" : "Drop photos here or click to browse"}
        </p>
        <p className="text-white/20 text-xs mt-1">JPG, PNG, WEBP · Select multiple files at once</p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
    </div>
  );
}

// ─── Upload Queue Panel ───────────────────────────────────────────────────────
function UploadQueuePanel({
  items,
  onDismiss,
}: {
  items: UploadItem[];
  onDismiss: () => void;
}) {
  if (items.length === 0) return null;

  const done = items.filter(i => i.status === "done").length;
  const errors = items.filter(i => i.status === "error").length;
  const total = items.length;
  const allFinished = items.every(i => i.status === "done" || i.status === "error");
  const progress = Math.round((done / total) * 100);

  return (
    <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-xs font-semibold">
            {allFinished
              ? errors > 0
                ? `Upload complete — ${errors} failed`
                : `All ${total} photos uploaded`
              : `Uploading ${done}/${total}…`}
          </span>
          {errors > 0 && (
            <span className="flex items-center gap-1 text-[0.6rem] text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full">
              <AlertTriangle size={10} /> {errors} error{errors !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {allFinished && (
          <button onClick={onDismiss} className="p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Overall progress bar */}
      {!allFinished && (
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Per-file thumbnail grid */}
      <div className="p-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {items.map(item => (
          <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
            <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover" />
            {/* Status overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all ${
              item.status === "uploading" ? "bg-black/40" :
              item.status === "done" ? "bg-black/0" :
              item.status === "error" ? "bg-red-900/50" :
              "bg-black/30"
            }`}>
              {item.status === "uploading" && (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {item.status === "done" && (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={11} className="text-white" />
                </div>
              )}
              {item.status === "error" && (
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center" title={item.error}>
                  <X size={11} className="text-white" />
                </div>
              )}
              {item.status === "pending" && (
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/60" />
                </div>
              )}
            </div>
            {/* Filename tooltip */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 truncate text-[0.5rem] text-white/50">
              {item.file.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Add Video Form ────────────────────────────────────────────────────────────────
function AddVideoForm({
  onAdd,
  onCancel,
  isPending,
}: {
  onAdd: (label: string, embedUrl: string, portrait: boolean) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [portrait, setPortrait] = useState(false);

  return (
    <div className="p-4 rounded-xl space-y-2" style={{ background: TW.indigoBg, border: `1px solid ${TW.border}` }}>
      <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label (e.g. Walk-around Tour)" className="h-8 text-xs" />
      <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="Vimeo or YouTube embed URL" className="h-8 text-xs" />
      {/* Portrait toggle */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <div
          onClick={() => setPortrait(p => !p)}
          className="relative w-9 h-5 rounded-full transition-colors"
          style={{ background: portrait ? TW.indigo : TW.border }}
        >
          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${ portrait ? 'translate-x-4' : '' }`} />
        </div>
        <span className="text-xs" style={{ color: TW.textSecondary }}>Portrait / Vertical (9:16)</span>
      </label>
      <div className="flex gap-2">
        <Button
          size="sm"
          className="h-7 text-xs"
          onClick={() => onAdd(label, url, portrait)}
          disabled={!url || isPending}
        >
          {isPending ? "Adding..." : "Add Video"}
        </Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs" style={{ color: TW.textMuted }} onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

// ─── Project Editor ────────────────────────────────────────────────────────────────
function ProjectEditor({ slug, name }: { slug: string; name: string }) {
  const utils = trpc.useUtils();
  const heroInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
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

  const uploadGalleryMut = trpc.admin.uploadGalleryImage.useMutation();

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
    onSuccess: () => { utils.admin.getProject.invalidate({ slug }); setAddingVideo(false); toast.success("Video added"); },
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

  const reorderVideos = trpc.admin.reorderVideos.useMutation({
    onSuccess: () => utils.admin.getProject.invalidate({ slug }),
    onError: (e) => toast.error(e.message),
  });

  // Local video order state for optimistic drag-and-drop
  const [localVideos, setLocalVideos] = useState<typeof videos>([]);
  useEffect(() => {
    setLocalVideos(data?.videos ?? []);
  }, [data?.videos]);

  const handleVideoDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLocalVideos(prev => {
      const oldIndex = prev.findIndex(v => v.id === active.id);
      const newIndex = prev.findIndex(v => v.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      reorderVideos.mutate({ updates: reordered.map((v, i) => ({ id: v.id, sortOrder: i })) });
      return reordered;
    });
  }, [reorderVideos]);

  // ── Bulk upload handler ──────────────────────────────────────────────────────
  // Enqueues all selected files, then fires parallel uploads (max 3 concurrent)
  const handleBulkUpload = useCallback(async (files: File[]) => {
    if (!files.length) return;

    // Build queue items with local preview URLs
    const items: UploadItem[] = files.map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      previewUrl: URL.createObjectURL(file),
      status: "pending" as const,
    }));

    setUploadQueue(prev => [...prev, ...items]);

    // Upload with concurrency limit of 3
    const CONCURRENCY = 3;
    let index = 0;

    const uploadNext = async (): Promise<void> => {
      if (index >= items.length) return;
      const item = items[index++];

      // Mark as uploading
      setUploadQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: "uploading" } : i));

      try {
        const base64 = await fileToBase64(item.file);
        await uploadGalleryMut.mutateAsync({
          slug,
          filename: item.file.name,
          mimeType: item.file.type,
          base64,
        });
        setUploadQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: "done" } : i));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setUploadQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: "error", error: msg } : i));
      }

      // Chain next upload
      await uploadNext();
    };

    // Kick off CONCURRENCY parallel chains
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, uploadNext));

    // Refresh gallery after all done
    utils.admin.getProject.invalidate({ slug });
  }, [slug, uploadGalleryMut, utils]);

  const handleHeroUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const base64 = await fileToBase64(file);
    await uploadHero.mutateAsync({ slug, filename: file.name, mimeType: file.type, base64 });
  }, [slug, uploadHero]);

  // Local gallery order state for optimistic drag-and-drop
  const [localGallery, setLocalGallery] = useState<typeof gallery>([]);
  useEffect(() => {
    setLocalGallery(data?.gallery ?? []);
  }, [data?.gallery]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLocalGallery(prev => {
      const oldIndex = prev.findIndex(img => img.id === active.id);
      const newIndex = prev.findIndex(img => img.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      // Persist to server
      reorder.mutate({ updates: reordered.map((img, i) => ({ id: img.id, sortOrder: i })) });
      return reordered;
    });
  }, [reorder]);

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
          <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: `${TW.border} ${TW.border} ${TW.border} ${TW.indigo}` }} />
          {seeding && <p className="text-xs" style={{ color: TW.textMuted }}>Setting up project...</p>}
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
          <h3 className="text-sm font-semibold tracking-widest uppercase flex items-center gap-2" style={{ color: TW.textPrimary }}>
            <Star size={14} style={{ color: "oklch(0.7 0.18 85)" }} /> Cover / Hero Image
          </h3>
          <button
            onClick={() => heroInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: TW.indigoBg, color: TW.indigo }}
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
            className="rounded-2xl aspect-video max-w-md flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
            style={{ border: `2px dashed ${TW.border}` }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = TW.indigo; (e.currentTarget as HTMLElement).style.background = TW.indigoBg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = TW.border; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <Image size={32} style={{ color: TW.textMuted }} />
            <p className="text-sm" style={{ color: TW.textMuted }}>Click to upload hero image</p>
          </div>
        )}
      </section>

      {/* Gallery */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold tracking-widest uppercase flex items-center gap-2" style={{ color: TW.textPrimary }}>
            <Image size={14} style={{ color: TW.indigo }} /> Gallery ({gallery.length} photos)
          </h3>
          <button
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.multiple = true;
              input.onchange = () => {
                const files = Array.from(input.files ?? []);
                if (files.length) handleBulkUpload(files);
              };
              input.click();
            }}
            disabled={uploadQueue.some(i => i.status === "uploading" || i.status === "pending")}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            style={{ background: TW.indigoBg, color: TW.indigo }}
          >
            <Upload size={12} /> Add Photos
          </button>
        </div>

        {/* Live upload queue panel */}
        <UploadQueuePanel
          items={uploadQueue}
          onDismiss={() => setUploadQueue([])}
        />

        {localGallery.length === 0 && uploadQueue.length === 0 ? (
          <BulkUploadZone onFilesSelected={handleBulkUpload} />
        ) : (
          <>
            <p className="text-[0.65rem] mb-2 flex items-center gap-1" style={{ color: TW.textMuted }}>
              <GripVertical size={11} className="inline" /> Drag the grip handle to reorder
            </p>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localGallery.map(img => img.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {localGallery.map((img, i) => (
                    <SortableGalleryCard
                      key={img.id}
                      image={img}
                      index={i}
                      onDelete={(id) => deleteImage.mutate({ id })}
                      onSetHero={handleSetHero}
                      isHero={heroUrl === img.url}
                    />
                  ))}
                  {/* Bulk-upload tile at the end of the grid */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
                      if (files.length) handleBulkUpload(files);
                    }}
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.multiple = true;
                      input.onchange = () => {
                        const files = Array.from(input.files ?? []);
                        if (files.length) handleBulkUpload(files);
                      };
                      input.click();
                    }}
                    className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                    style={{ borderColor: TW.border }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = TW.indigo; (e.currentTarget as HTMLElement).style.background = TW.indigoBg; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = TW.border; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <Plus size={20} style={{ color: TW.textMuted }} />
                    <span className="text-[0.6rem]" style={{ color: TW.textMuted }}>Add More</span>
                  </div>
                </div>
              </SortableContext>
            </DndContext>
          </>
        )}
      </section>

      {/* Videos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold tracking-widest uppercase flex items-center gap-2" style={{ color: TW.textPrimary }}>
            <Video size={14} style={{ color: "oklch(0.55 0.15 290)" }} /> Videos ({videos.length})
          </h3>
          <button
            onClick={() => setAddingVideo(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: TW.indigoBg, color: TW.indigo }}
          >
            <Plus size={12} /> Add Video
          </button>
        </div>

        {localVideos.length > 1 && (
          <p className="text-[0.65rem] mb-2 flex items-center gap-1" style={{ color: TW.textMuted }}>
            <GripVertical size={11} className="inline" /> Drag the grip handle to reorder
          </p>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleVideoDragEnd}
        >
          <SortableContext
            items={localVideos.map(v => v.id)}
            strategy={rectSortingStrategy}
          >
            <div className="space-y-2">
              {addingVideo && (
                <AddVideoForm
                  onAdd={(label, embedUrl, portrait) => addVideo.mutate({ slug, label, embedUrl, portrait })}
                  onCancel={() => setAddingVideo(false)}
                  isPending={addVideo.isPending}
                />
              )}
              {localVideos.length === 0 && !addingVideo && (
                <p className="text-sm text-center py-6" style={{ color: TW.textMuted }}>No videos yet — click "Add Video" to add a Vimeo or YouTube embed URL</p>
              )}
              {localVideos.map(v => (
                <SortableVideoRow
                  key={v.id}
                  video={v}
                  onUpdate={(id, label, embedUrl, portrait) => updateVideo.mutate({ id, label, embedUrl, portrait })}
                  onDelete={(id) => deleteVideo.mutate({ id })}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
  const { logout } = useAuth();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const utils = trpc.useUtils();

  // Query runs unconditionally — no auth required
  const { data: projectStatuses, refetch: refetchStatuses } = trpc.admin.listProjectsWithStatus.useQuery(
    undefined,
    { refetchOnWindowFocus: false }
  );

  const createProjectMut = trpc.admin.createProject.useMutation({
    onSuccess: (newProject) => {
      toast.success(`Project "${newProject?.name}" created`);
      setShowNewProject(false);
      setNewName("");
      setNewSlug("");
      refetchStatuses();
      if (newProject?.slug) setSelectedSlug(newProject.slug);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteProjectMut = trpc.admin.deleteProject.useMutation({
    onSuccess: () => {
      toast.success("Project deleted");
      setDeleteConfirm(null);
      if (selectedSlug) {
        const stillExists = (projectStatuses ?? []).some(p => p.slug === selectedSlug && p.id !== deleteConfirm);
        if (!stillExists) setSelectedSlug(null);
      }
      refetchStatuses();
      utils.admin.getProject.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setNewName(val);
    setNewSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  };

  // Use DB-driven project list (falls back to empty while loading)
  const projects = projectStatuses ?? [];
  const selectedProject = projects.find(p => p.slug === selectedSlug);

  const publishActions = <PublishButton />;

  return (
    <AdminLayout
      title="Media Management"
      subtitle="Manage projects, gallery, and videos"
      actions={publishActions}
    >
      <div className="flex gap-6 h-full">
        {/* Project list panel */}
        <TWCard className="w-64 shrink-0 flex flex-col overflow-hidden" style={{ height: "calc(100vh - 120px)" }}>
          <div className="p-4" style={{ borderBottom: `1px solid ${TW.border}` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: TW.textPrimary }}>Projects</p>
                {projects.length > 0 && (
                  <p className="text-xs mt-0.5" style={{ color: TW.textMuted }}>
                    {projects.filter(p => p.hasHero).length}/{projects.length} ready
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowNewProject(v => !v)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: TW.indigoBg, color: TW.indigo }}
                title="Add new project"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">

          {/* New project form */}
          {showNewProject && (
            <div className="mb-2 p-3 rounded-xl space-y-2" style={{ background: TW.indigoBg, border: `1px solid ${TW.border}` }}>
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: TW.indigo }}>New Project</p>
              <Input
                value={newName}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="Project name"
                className="h-7 text-xs"
                autoFocus
              />
              <div className="space-y-1">
                <Input
                  value={newSlug}
                  onChange={e => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="url-slug"
                  className="h-7 text-xs font-mono"
                />
                <p className="text-[0.55rem] px-1" style={{ color: TW.textMuted }}>URL: /projects/{newSlug || "url-slug"}</p>
              </div>
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  className="h-6 text-[0.65rem] px-2 flex-1"
                  disabled={!newName || !newSlug || createProjectMut.isPending}
                  onClick={() => createProjectMut.mutate({ name: newName, slug: newSlug })}
                >
                  {createProjectMut.isPending ? "Creating..." : "Create"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[0.65rem] px-2"
                  style={{ color: TW.textMuted }}
                  onClick={() => { setShowNewProject(false); setNewName(""); setNewSlug(""); }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Project list */}
          {projects.map(p => {
            const isSelected = selectedSlug === p.slug;
            const isComplete = p.hasHero && p.galleryCount > 0;

            return (
              <div key={p.slug} className="group/item relative">
                <button
                  onClick={() => { setSelectedSlug(p.slug); refetchStatuses(); }}
                  className="w-full flex flex-col px-3 py-2.5 rounded-xl text-left transition-all pr-8"
                  style={{
                    background: isSelected ? TW.indigo : "transparent",
                    color: isSelected ? "white" : TW.textSecondary,
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = TW.indigoBg; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {/* Project name row */}
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate text-sm font-medium">{p.name}</span>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {isComplete ? (
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: TW.green }} title="Ready" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Needs attention" />
                      )}
                      {isSelected && <ChevronRight size={12} className="opacity-60" />}
                    </div>
                  </div>
                  {/* Status badges row */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[0.55rem] px-1.5 py-0.5 rounded font-semibold tracking-wide"
                      style={p.hasHero
                        ? { background: isSelected ? "rgba(255,255,255,0.2)" : TW.greenBg, color: isSelected ? "white" : TW.green }
                        : { background: "oklch(0.96 0.06 85)", color: "oklch(0.55 0.15 85)" }}>
                      {p.hasHero ? "✓ HERO" : "! HERO"}
                    </span>
                    <span className="text-[0.55rem] px-1.5 py-0.5 rounded font-semibold tracking-wide"
                      style={p.galleryCount > 0
                        ? { background: isSelected ? "rgba(255,255,255,0.2)" : TW.indigoBg, color: isSelected ? "white" : TW.indigo }
                        : { background: "oklch(0.95 0.005 265)", color: TW.textMuted }}>
                      {p.galleryCount} PHOTO{p.galleryCount !== 1 ? "S" : ""}
                    </span>
                    {p.videoCount > 0 && (
                      <span className="text-[0.55rem] px-1.5 py-0.5 rounded font-semibold tracking-wide"
                        style={{ background: isSelected ? "rgba(255,255,255,0.2)" : "oklch(0.95 0.04 290)", color: isSelected ? "white" : "oklch(0.45 0.18 290)" }}>
                        {p.videoCount} VID
                      </span>
                    )}
                  </div>
                </button>

                {/* Delete button — appears on hover */}
                {deleteConfirm === p.id ? (
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      onClick={() => deleteProjectMut.mutate({ id: p.id })}
                      className="p-1 rounded bg-red-500 hover:bg-red-600 transition-colors"
                      title="Confirm delete"
                    >
                      <Check size={11} className="text-white" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="p-1 rounded transition-colors"
                      style={{ background: TW.border }}
                      title="Cancel"
                    >
                      <X size={11} style={{ color: TW.textMuted }} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(p.id); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg opacity-0 group-hover/item:opacity-100 hover:!text-red-500 transition-all"
                    style={{ color: TW.textMuted }}
                    title="Delete project"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            );
          })}

          {projects.length === 0 && !showNewProject && (
            <p className="text-xs text-center py-6" style={{ color: TW.textMuted }}>No projects yet — click + to add one</p>
          )}
        </nav>

        </TWCard>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {selectedProject ? (
            <TWCard className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold" style={{ color: TW.textPrimary }}>{selectedProject.name}</h2>
                <p className="text-sm mt-1" style={{ color: TW.textSecondary }}>Manage photos, hero image, and videos for this project</p>
              </div>
              <ProjectEditor slug={selectedProject.slug} name={selectedProject.name} />
            </TWCard>
          ) : (
            <TWCard className="flex items-center justify-center" style={{ minHeight: "400px" }}>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: TW.indigoBg }}>
                  <Image size={28} style={{ color: TW.indigo }} />
                </div>
                <h2 className="font-semibold" style={{ color: TW.textSecondary }}>Select a project</h2>
                <p className="text-sm" style={{ color: TW.textMuted }}>Choose a project from the left panel to manage its media</p>
              </div>
            </TWCard>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
