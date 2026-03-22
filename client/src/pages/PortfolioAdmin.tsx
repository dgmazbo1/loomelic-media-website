/**
 * Portfolio Admin — /admin/portfolio
 * Three-tab management panel for Photos, Videos, and Graphics.
 * Each tab supports: upload/add, tag assignment, drag-and-drop reorder, delete.
 */
import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  Upload, Trash2, GripVertical, Video, Image, Palette,
  Plus, X, Pencil, Check, Eye, EyeOff, Tag, ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
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

// ─── Types ────────────────────────────────────────────────────────────────────

type Tag = { id: number; name: string; slug: string; color: string | null; createdAt: Date };
type PhotoItem = { id: number; url: string; fileKey: string; title: string | null; caption: string | null; sortOrder: number; published: boolean; createdAt: Date; updatedAt: Date; tags: Tag[] };
type VideoItem = { id: number; vimeoUrl: string; title: string | null; caption: string | null; thumbnailUrl: string | null; sortOrder: number; published: boolean; createdAt: Date; updatedAt: Date; tags: Tag[] };
type GraphicItem = { id: number; url: string; fileKey: string; title: string | null; caption: string | null; sortOrder: number; published: boolean; createdAt: Date; updatedAt: Date; tags: Tag[] };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/(?:vimeo\.com\/)(\d+)/);
  return match ? match[1] : null;
}

function getVimeoThumbnail(url: string): string {
  const id = extractVimeoId(url);
  return id ? `https://vumbnail.com/${id}.jpg` : "";
}

// ─── Tag Chip ─────────────────────────────────────────────────────────────────

function TagChip({ tag, onRemove }: { tag: Tag; onRemove?: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono tracking-wider"
      style={{ backgroundColor: tag.color ?? "#333", color: "#fff" }}
    >
      {tag.name}
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-70 ml-0.5">
          <X size={10} />
        </button>
      )}
    </span>
  );
}

// ─── Tag Selector ─────────────────────────────────────────────────────────────

function TagSelector({
  allTags,
  selectedIds,
  onChange,
  onCreateTag,
}: {
  allTags: Tag[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  onCreateTag: (name: string) => Promise<void>;
}) {
  const [newTagName, setNewTagName] = useState("");
  const [creating, setCreating] = useState(false);

  const toggle = (id: number) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  };

  const handleCreate = async () => {
    if (!newTagName.trim()) return;
    setCreating(true);
    try {
      await onCreateTag(newTagName.trim());
      setNewTagName("");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {allTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => toggle(tag.id)}
            className={`px-2 py-0.5 rounded text-xs font-mono tracking-wider border transition-all ${
              selectedIds.includes(tag.id)
                ? "border-white/60 opacity-100"
                : "border-white/20 opacity-50 hover:opacity-70"
            }`}
            style={{ backgroundColor: selectedIds.includes(tag.id) ? (tag.color ?? "#333") : "transparent", color: "#fff" }}
          >
            {tag.name}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="New tag name…"
          className="h-7 text-xs bg-white/5 border-white/20 text-white placeholder:text-white/30"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={handleCreate}
          disabled={creating || !newTagName.trim()}
          className="h-7 text-xs border-white/20 text-white hover:bg-white/10"
        >
          <Plus size={12} className="mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
}

// ─── Sortable Photo Card ───────────────────────────────────────────────────────

function SortablePhotoCard({
  item,
  allTags,
  onUpdate,
  onDelete,
  onCreateTag,
}: {
  item: PhotoItem;
  allTags: Tag[];
  onUpdate: (id: number, data: { title?: string; caption?: string; published?: boolean; tagIds?: number[] }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onCreateTag: (name: string) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title ?? "");
  const [caption, setCaption] = useState(item.caption ?? "");
  const [selectedTagIds, setSelectedTagIds] = useState(item.tags.map((t) => t.id));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(item.id, { title, caption, tagIds: selectedTagIds });
      setEditing(false);
      toast.success("Photo updated");
    } catch {
      toast.error("Failed to update photo");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group bg-[#111] border border-white/10 rounded-lg overflow-hidden">
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing text-white/40 hover:text-white/80 bg-black/60 rounded p-1"
      >
        <GripVertical size={14} />
      </div>

      {/* Visibility badge */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => onUpdate(item.id, { published: !item.published })}
          className={`p-1 rounded bg-black/60 ${item.published ? "text-green-400" : "text-white/30"}`}
          title={item.published ? "Published — click to hide" : "Hidden — click to publish"}
        >
          {item.published ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>

      {/* Image */}
      <div className="aspect-square bg-black">
        <img src={item.url} alt={item.title ?? ""} className="w-full h-full object-cover" loading="lazy" />
      </div>

      {/* Info / Edit area */}
      <div className="p-3 space-y-2">
        {editing ? (
          <>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title…"
              className="h-7 text-xs bg-white/5 border-white/20 text-white placeholder:text-white/30"
            />
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption…"
              className="h-7 text-xs bg-white/5 border-white/20 text-white placeholder:text-white/30"
            />
            <TagSelector
              allTags={allTags}
              selectedIds={selectedTagIds}
              onChange={setSelectedTagIds}
              onCreateTag={onCreateTag}
            />
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleSave} disabled={saving} className="h-7 text-xs flex-1">
                <Check size={12} className="mr-1" /> Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="h-7 text-xs border-white/20 text-white hover:bg-white/10">
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-white/70 truncate">{item.title || <span className="text-white/30 italic">Untitled</span>}</p>
            <div className="flex flex-wrap gap-1">
              {item.tags.map((t) => <TagChip key={t.id} tag={t} />)}
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="h-7 text-xs flex-1 border-white/20 text-white hover:bg-white/10">
                <Pencil size={12} className="mr-1" /> Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => { if (confirm("Delete this photo?")) onDelete(item.id); }}
                className="h-7 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={12} />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Sortable Video Card ───────────────────────────────────────────────────────

function SortableVideoCard({
  item,
  allTags,
  onUpdate,
  onDelete,
  onCreateTag,
}: {
  item: VideoItem;
  allTags: Tag[];
  onUpdate: (id: number, data: { vimeoUrl?: string; title?: string; caption?: string; published?: boolean; tagIds?: number[] }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onCreateTag: (name: string) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const [editing, setEditing] = useState(false);
  const [vimeoUrl, setVimeoUrl] = useState(item.vimeoUrl);
  const [title, setTitle] = useState(item.title ?? "");
  const [caption, setCaption] = useState(item.caption ?? "");
  const [selectedTagIds, setSelectedTagIds] = useState(item.tags.map((t) => t.id));
  const [saving, setSaving] = useState(false);

  const thumbnail = getVimeoThumbnail(item.vimeoUrl);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(item.id, { vimeoUrl, title, caption, tagIds: selectedTagIds });
      setEditing(false);
      toast.success("Video updated");
    } catch {
      toast.error("Failed to update video");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group bg-[#111] border border-white/10 rounded-lg overflow-hidden">
      <div {...attributes} {...listeners} className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing text-white/40 hover:text-white/80 bg-black/60 rounded p-1">
        <GripVertical size={14} />
      </div>
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => onUpdate(item.id, { published: !item.published })}
          className={`p-1 rounded bg-black/60 ${item.published ? "text-green-400" : "text-white/30"}`}
        >
          {item.published ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>

      {/* Thumbnail */}
      <div className="aspect-video bg-black relative">
        {thumbnail ? (
          <img src={thumbnail} alt={item.title ?? ""} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <Video size={32} />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-black/70 flex items-center justify-center">
            <Video size={16} className="text-white ml-0.5" />
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2">
        {editing ? (
          <>
            <Input
              value={vimeoUrl}
              onChange={(e) => setVimeoUrl(e.target.value)}
              placeholder="https://vimeo.com/…"
              className="h-7 text-xs bg-white/5 border-white/20 text-white placeholder:text-white/30"
            />
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title…"
              className="h-7 text-xs bg-white/5 border-white/20 text-white placeholder:text-white/30"
            />
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption…"
              className="h-7 text-xs bg-white/5 border-white/20 text-white placeholder:text-white/30"
            />
            <TagSelector allTags={allTags} selectedIds={selectedTagIds} onChange={setSelectedTagIds} onCreateTag={onCreateTag} />
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleSave} disabled={saving} className="h-7 text-xs flex-1">
                <Check size={12} className="mr-1" /> Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="h-7 text-xs border-white/20 text-white hover:bg-white/10">
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-white/70 truncate">{item.title || <span className="text-white/30 italic">Untitled</span>}</p>
            <p className="text-[10px] text-white/30 font-mono truncate">{item.vimeoUrl}</p>
            <div className="flex flex-wrap gap-1">
              {item.tags.map((t) => <TagChip key={t.id} tag={t} />)}
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="h-7 text-xs flex-1 border-white/20 text-white hover:bg-white/10">
                <Pencil size={12} className="mr-1" /> Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => { if (confirm("Delete this video?")) onDelete(item.id); }} className="h-7 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">
                <Trash2 size={12} />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Sortable Graphic Card (same structure as Photo) ──────────────────────────

function SortableGraphicCard({
  item,
  allTags,
  onUpdate,
  onDelete,
  onCreateTag,
}: {
  item: GraphicItem;
  allTags: Tag[];
  onUpdate: (id: number, data: { title?: string; caption?: string; published?: boolean; tagIds?: number[] }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onCreateTag: (name: string) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title ?? "");
  const [caption, setCaption] = useState(item.caption ?? "");
  const [selectedTagIds, setSelectedTagIds] = useState(item.tags.map((t) => t.id));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(item.id, { title, caption, tagIds: selectedTagIds });
      setEditing(false);
      toast.success("Graphic updated");
    } catch {
      toast.error("Failed to update graphic");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group bg-[#111] border border-white/10 rounded-lg overflow-hidden">
      <div {...attributes} {...listeners} className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing text-white/40 hover:text-white/80 bg-black/60 rounded p-1">
        <GripVertical size={14} />
      </div>
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => onUpdate(item.id, { published: !item.published })}
          className={`p-1 rounded bg-black/60 ${item.published ? "text-green-400" : "text-white/30"}`}
        >
          {item.published ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>
      <div className="aspect-square bg-black">
        <img src={item.url} alt={item.title ?? ""} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-3 space-y-2">
        {editing ? (
          <>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title…" className="h-7 text-xs bg-white/5 border-white/20 text-white placeholder:text-white/30" />
            <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption…" className="h-7 text-xs bg-white/5 border-white/20 text-white placeholder:text-white/30" />
            <TagSelector allTags={allTags} selectedIds={selectedTagIds} onChange={setSelectedTagIds} onCreateTag={onCreateTag} />
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleSave} disabled={saving} className="h-7 text-xs flex-1">
                <Check size={12} className="mr-1" /> Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="h-7 text-xs border-white/20 text-white hover:bg-white/10">Cancel</Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-white/70 truncate">{item.title || <span className="text-white/30 italic">Untitled</span>}</p>
            <div className="flex flex-wrap gap-1">{item.tags.map((t) => <TagChip key={t.id} tag={t} />)}</div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="h-7 text-xs flex-1 border-white/20 text-white hover:bg-white/10">
                <Pencil size={12} className="mr-1" /> Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => { if (confirm("Delete this graphic?")) onDelete(item.id); }} className="h-7 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">
                <Trash2 size={12} />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Photos Tab ───────────────────────────────────────────────────────────────

function PhotosTab() {
  const utils = trpc.useUtils();
  const { data: photos = [], isLoading } = trpc.portfolio.listAllPhotos.useQuery();
  const { data: allTags = [] } = trpc.portfolio.listTags.useQuery();
  const [items, setItems] = useState<PhotoItem[]>([]);
  const [pendingTagIds, setPendingTagIds] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync server data → local state
  const photosKey = JSON.stringify(photos.map((p) => p.id));
  const prevPhotosKey = useRef("");
  if (photosKey !== prevPhotosKey.current) {
    prevPhotosKey.current = photosKey;
    setItems(photos as PhotoItem[]);
  }

  const uploadMutation = trpc.portfolio.uploadPhoto.useMutation({
    onSuccess: () => { utils.portfolio.listAllPhotos.invalidate(); toast.success("Photo uploaded"); },
    onError: () => toast.error("Upload failed"),
  });
  const updateMutation = trpc.portfolio.updatePhoto.useMutation({
    onSuccess: () => utils.portfolio.listAllPhotos.invalidate(),
  });
  const deleteMutation = trpc.portfolio.deletePhoto.useMutation({
    onSuccess: () => { utils.portfolio.listAllPhotos.invalidate(); toast.success("Photo deleted"); },
  });
  const reorderMutation = trpc.portfolio.reorderPhotos.useMutation();
  const createTagMutation = trpc.portfolio.createTag.useMutation({
    onSuccess: () => utils.portfolio.listTags.invalidate(),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);
        reorderMutation.mutate({ order: reordered.map((item, idx) => ({ id: item.id, sortOrder: idx })) });
        return reordered;
      });
    },
    [reorderMutation]
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const base64 = await fileToBase64(file);
        await uploadMutation.mutateAsync({
          filename: file.name,
          contentType: file.type,
          base64,
          tagIds: pendingTagIds,
        });
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUpdate = async (id: number, data: { title?: string; caption?: string; published?: boolean; tagIds?: number[] }) => {
    await updateMutation.mutateAsync({ id, ...data });
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync({ id });
  };

  const handleCreateTag = async (name: string) => {
    await createTagMutation.mutateAsync({ name });
  };

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div className="border border-dashed border-white/20 rounded-xl p-6 bg-white/[0.02]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 space-y-2">
            <p className="text-sm text-white/60">Upload one or more photos. They will be appended to the end of the grid.</p>
            <div className="space-y-1">
              <p className="text-xs text-white/40">Assign tags to new uploads:</p>
              <TagSelector
                allTags={allTags as Tag[]}
                selectedIds={pendingTagIds}
                onChange={setPendingTagIds}
                onCreateTag={handleCreateTag}
              />
            </div>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-white text-black hover:bg-white/90 font-mono text-xs tracking-wider"
            >
              <Upload size={14} className="mr-2" />
              {uploading ? "UPLOADING…" : "UPLOAD PHOTOS"}
            </Button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="text-white/40 text-sm py-12 text-center">Loading photos…</div>
      ) : items.length === 0 ? (
        <div className="text-white/30 text-sm py-12 text-center">No photos yet. Upload your first photo above.</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {items.map((item) => (
                <SortablePhotoCard
                  key={item.id}
                  item={item}
                  allTags={allTags as Tag[]}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onCreateTag={handleCreateTag}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

// ─── Videos Tab ───────────────────────────────────────────────────────────────

function VideosTab() {
  const utils = trpc.useUtils();
  const { data: videos = [], isLoading } = trpc.portfolio.listAllVideos.useQuery();
  const { data: allTags = [] } = trpc.portfolio.listTags.useQuery();
  const [items, setItems] = useState<VideoItem[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [pendingTagIds, setPendingTagIds] = useState<number[]>([]);
  const [adding, setAdding] = useState(false);

  const videosKey = JSON.stringify(videos.map((v) => v.id));
  const prevVideosKey = useRef("");
  if (videosKey !== prevVideosKey.current) {
    prevVideosKey.current = videosKey;
    setItems(videos as VideoItem[]);
  }

  const createMutation = trpc.portfolio.createVideo.useMutation({
    onSuccess: () => { utils.portfolio.listAllVideos.invalidate(); toast.success("Video added"); },
    onError: () => toast.error("Failed to add video"),
  });
  const updateMutation = trpc.portfolio.updateVideo.useMutation({
    onSuccess: () => utils.portfolio.listAllVideos.invalidate(),
  });
  const deleteMutation = trpc.portfolio.deleteVideo.useMutation({
    onSuccess: () => { utils.portfolio.listAllVideos.invalidate(); toast.success("Video deleted"); },
  });
  const reorderMutation = trpc.portfolio.reorderVideos.useMutation();
  const createTagMutation = trpc.portfolio.createTag.useMutation({
    onSuccess: () => utils.portfolio.listTags.invalidate(),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);
        reorderMutation.mutate({ order: reordered.map((item, idx) => ({ id: item.id, sortOrder: idx })) });
        return reordered;
      });
    },
    [reorderMutation]
  );

  const handleAdd = async () => {
    if (!newUrl.trim()) return;
    setAdding(true);
    try {
      await createMutation.mutateAsync({ vimeoUrl: newUrl.trim(), title: newTitle.trim() || undefined, tagIds: pendingTagIds });
      setNewUrl("");
      setNewTitle("");
      setPendingTagIds([]);
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (id: number, data: { vimeoUrl?: string; title?: string; caption?: string; published?: boolean; tagIds?: number[] }) => {
    await updateMutation.mutateAsync({ id, ...data });
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync({ id });
  };

  const handleCreateTag = async (name: string) => {
    await createTagMutation.mutateAsync({ name });
  };

  return (
    <div className="space-y-6">
      <div className="border border-dashed border-white/20 rounded-xl p-6 bg-white/[0.02] space-y-4">
        <p className="text-sm text-white/60">Add a Vimeo video by pasting the URL. The thumbnail will be fetched automatically.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://vimeo.com/123456789"
            className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
          />
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title (optional)"
            className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-white/40">Tags:</p>
          <TagSelector
            allTags={allTags as Tag[]}
            selectedIds={pendingTagIds}
            onChange={setPendingTagIds}
            onCreateTag={handleCreateTag}
          />
        </div>
        <Button
          onClick={handleAdd}
          disabled={adding || !newUrl.trim()}
          className="bg-white text-black hover:bg-white/90 font-mono text-xs tracking-wider"
        >
          <Plus size={14} className="mr-2" />
          {adding ? "ADDING…" : "ADD VIDEO"}
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="text-white/40 text-sm py-12 text-center">Loading videos…</div>
      ) : items.length === 0 ? (
        <div className="text-white/30 text-sm py-12 text-center">No videos yet. Add your first Vimeo URL above.</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {items.map((item) => (
                <SortableVideoCard
                  key={item.id}
                  item={item}
                  allTags={allTags as Tag[]}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onCreateTag={handleCreateTag}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

// ─── Graphics Tab ─────────────────────────────────────────────────────────────

function GraphicsTab() {
  const utils = trpc.useUtils();
  const { data: graphics = [], isLoading } = trpc.portfolio.listAllGraphics.useQuery();
  const { data: allTags = [] } = trpc.portfolio.listTags.useQuery();
  const [items, setItems] = useState<GraphicItem[]>([]);
  const [pendingTagIds, setPendingTagIds] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const graphicsKey = JSON.stringify(graphics.map((g) => g.id));
  const prevGraphicsKey = useRef("");
  if (graphicsKey !== prevGraphicsKey.current) {
    prevGraphicsKey.current = graphicsKey;
    setItems(graphics as GraphicItem[]);
  }

  const uploadMutation = trpc.portfolio.uploadGraphic.useMutation({
    onSuccess: () => { utils.portfolio.listAllGraphics.invalidate(); toast.success("Graphic uploaded"); },
    onError: () => toast.error("Upload failed"),
  });
  const updateMutation = trpc.portfolio.updateGraphic.useMutation({
    onSuccess: () => utils.portfolio.listAllGraphics.invalidate(),
  });
  const deleteMutation = trpc.portfolio.deleteGraphic.useMutation({
    onSuccess: () => { utils.portfolio.listAllGraphics.invalidate(); toast.success("Graphic deleted"); },
  });
  const reorderMutation = trpc.portfolio.reorderGraphics.useMutation();
  const createTagMutation = trpc.portfolio.createTag.useMutation({
    onSuccess: () => utils.portfolio.listTags.invalidate(),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);
        reorderMutation.mutate({ order: reordered.map((item, idx) => ({ id: item.id, sortOrder: idx })) });
        return reordered;
      });
    },
    [reorderMutation]
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const base64 = await fileToBase64(file);
        await uploadMutation.mutateAsync({
          filename: file.name,
          contentType: file.type,
          base64,
          tagIds: pendingTagIds,
        });
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUpdate = async (id: number, data: { title?: string; caption?: string; published?: boolean; tagIds?: number[] }) => {
    await updateMutation.mutateAsync({ id, ...data });
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync({ id });
  };

  const handleCreateTag = async (name: string) => {
    await createTagMutation.mutateAsync({ name });
  };

  return (
    <div className="space-y-6">
      <div className="border border-dashed border-white/20 rounded-xl p-6 bg-white/[0.02]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 space-y-2">
            <p className="text-sm text-white/60">Upload design work, brand assets, social graphics, and other visual content.</p>
            <div className="space-y-1">
              <p className="text-xs text-white/40">Assign tags to new uploads:</p>
              <TagSelector allTags={allTags as Tag[]} selectedIds={pendingTagIds} onChange={setPendingTagIds} onCreateTag={handleCreateTag} />
            </div>
          </div>
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-white text-black hover:bg-white/90 font-mono text-xs tracking-wider"
            >
              <Upload size={14} className="mr-2" />
              {uploading ? "UPLOADING…" : "UPLOAD GRAPHICS"}
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-white/40 text-sm py-12 text-center">Loading graphics…</div>
      ) : items.length === 0 ? (
        <div className="text-white/30 text-sm py-12 text-center">No graphics yet. Upload your first graphic above.</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {items.map((item) => (
                <SortableGraphicCard
                  key={item.id}
                  item={item}
                  allTags={allTags as Tag[]}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onCreateTag={handleCreateTag}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

// ─── Tags Management Tab ──────────────────────────────────────────────────────

function TagsTab() {
  const utils = trpc.useUtils();
  const { data: allTags = [] } = trpc.portfolio.listTags.useQuery();
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#555555");

  const createMutation = trpc.portfolio.createTag.useMutation({
    onSuccess: () => { utils.portfolio.listTags.invalidate(); toast.success("Tag created"); setNewName(""); },
    onError: () => toast.error("Failed to create tag"),
  });
  const deleteMutation = trpc.portfolio.deleteTag.useMutation({
    onSuccess: () => { utils.portfolio.listTags.invalidate(); toast.success("Tag deleted"); },
    onError: () => toast.error("Failed to delete tag"),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="border border-dashed border-white/20 rounded-xl p-6 bg-white/[0.02] space-y-4">
        <p className="text-sm text-white/60">Tags are shared across Photos, Videos, and Graphics. Create tags here or inline when editing an item.</p>
        <div className="flex gap-3 items-center">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createMutation.mutate({ name: newName, color: newColor })}
            placeholder="Tag name…"
            className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
          />
          <div className="flex items-center gap-2">
            <label className="text-xs text-white/40">Color</label>
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-white/20 bg-transparent"
            />
          </div>
          <Button
            onClick={() => createMutation.mutate({ name: newName, color: newColor })}
            disabled={!newName.trim()}
            className="bg-white text-black hover:bg-white/90 font-mono text-xs tracking-wider shrink-0"
          >
            <Plus size={14} className="mr-1" /> Add Tag
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {(allTags as Tag[]).map((tag) => (
          <div key={tag.id} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/10 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: tag.color ?? "#555" }} />
              <span className="text-sm font-mono text-white">{tag.name}</span>
              <span className="text-xs text-white/30">/{tag.slug}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { if (confirm(`Delete tag "${tag.name}"? This will remove it from all items.`)) deleteMutation.mutate({ id: tag.id }); }}
              className="h-7 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        ))}
        {allTags.length === 0 && <p className="text-white/30 text-sm py-4 text-center">No tags yet.</p>}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TabId = "photos" | "videos" | "graphics" | "tags";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "photos", label: "Photos", icon: <Image size={16} /> },
  { id: "videos", label: "Videos", icon: <Video size={16} /> },
  { id: "graphics", label: "Graphics", icon: <Palette size={16} /> },
  { id: "tags", label: "Tags", icon: <Tag size={16} /> },
];

export default function PortfolioAdmin() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("photos");

  if (loading) {
    return (
      <div className="min-h-screen bg-[oklch(0.07_0_0)] flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading…</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = getLoginUrl("/admin/portfolio");
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[oklch(0.07_0_0)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white/60">You don't have permission to access this page.</p>
          <Link href="/">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <button className="text-white/40 hover:text-white/80 transition-colors flex items-center gap-1.5 text-sm">
                <ChevronLeft size={16} />
                Admin
              </button>
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-sm font-mono tracking-wider text-white">PORTFOLIO</span>
          </div>
          <Link href="/portfolio">
            <button className="text-xs text-white/40 hover:text-white/70 font-mono tracking-wider transition-colors">
              VIEW LIVE →
            </button>
          </Link>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-white/10 bg-black/20">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-mono tracking-wider border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-white text-white"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                {tab.icon}
                {tab.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        {activeTab === "photos" && <PhotosTab />}
        {activeTab === "videos" && <VideosTab />}
        {activeTab === "graphics" && <GraphicsTab />}
        {activeTab === "tags" && <TagsTab />}
      </div>
    </div>
  );
}
