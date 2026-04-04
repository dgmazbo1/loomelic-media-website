/* ============================================================
   Featured Work Admin — /admin/featured-work
   Manage the cards shown on the public Use Cases "Featured Work" tab.
   Features: drag-to-reorder, add (with image upload), edit, delete, publish toggle
   ============================================================ */
import { useState, useRef, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import AdminLayout, { TW, TWCard } from "@/components/AdminLayout";
import {
  GripVertical, Trash2, Plus, X, Pencil, Check, Eye, EyeOff,
  LogOut, Image as ImageIcon, Loader2, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type FeaturedItem = {
  id: number;
  title: string;
  category: string | null;
  imageUrl: string;
  imageKey: string | null;
  slug: string | null;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// ─── Convert file to base64 ───────────────────────────────────────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Sortable Row ─────────────────────────────────────────────────────────────
function SortableRow({
  item,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  item: FeaturedItem;
  onEdit: (item: FeaturedItem) => void;
  onDelete: (id: number) => void;
  onTogglePublish: (id: number, published: boolean) => void;
}) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
        isDragging
          ? "bg-white/10 border-white/30 shadow-2xl"
          : "bg-white/5 border-white/10 hover:border-white/20"
      }`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="p-1.5 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/10 cursor-grab active:cursor-grabbing transition-colors shrink-0"
        title="Drag to reorder"
      >
        <GripVertical size={16} />
      </div>

      {/* Thumbnail */}
      <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">{item.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {item.category && (
            <span className="text-white/40 text-[0.6rem] tracking-wider uppercase">{item.category}</span>
          )}
          {item.slug && (
            <span className="text-white/25 text-[0.6rem] font-mono truncate">/{item.slug}</span>
          )}
        </div>
      </div>

      {/* Published badge */}
      <Badge
        className={`text-[0.6rem] shrink-0 cursor-pointer select-none ${
          item.published
            ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
            : "bg-white/8 text-white/30 hover:bg-white/15"
        }`}
        onClick={() => onTogglePublish(item.id, !item.published)}
      >
        {item.published ? <Eye size={10} className="mr-1" /> : <EyeOff size={10} className="mr-1" />}
        {item.published ? "Live" : "Hidden"}
      </Badge>

      {/* Actions */}
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={() => onEdit(item)}
          className="p-1.5 rounded-lg bg-white/8 hover:bg-white/15 transition-colors"
          title="Edit"
        >
          <Pencil size={13} className="text-white/60" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 transition-colors"
          title="Delete"
        >
          <Trash2 size={13} className="text-red-400" />
        </button>
      </div>
    </div>
  );
}

// ─── Add / Edit Form ──────────────────────────────────────────────────────────
function ItemForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial?: Partial<FeaturedItem>;
  onSave: (data: {
    title: string; category: string; imageUrl: string; imageKey: string;
    slug: string; published: boolean;
  }) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [imageKey, setImageKey] = useState(initial?.imageKey ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadMut = trpc.featuredWork.uploadCoverImage.useMutation({
    onSuccess: (data) => {
      setImageUrl(data.url);
      setImageKey(data.key);
      setUploading(false);
      toast.success("Image uploaded");
    },
    onError: (e) => { setUploading(false); toast.error(e.message); },
  });

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const base64 = await fileToBase64(file);
    uploadMut.mutate({ filename: file.name, mimeType: file.type, base64 });
    e.target.value = "";
  }, [uploadMut]);

  const canSave = title.trim() && imageUrl;

  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/15 space-y-4">
      <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">
        {initial?.id ? "Edit Card" : "New Card"}
      </p>

      {/* Image upload */}
      <div>
        <p className="text-white/40 text-[0.65rem] mb-1.5">Cover Image *</p>
        {imageUrl ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-white/5 mb-2">
            <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
            <button
              onClick={() => { setImageUrl(""); setImageKey(""); }}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 transition-colors"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="w-full aspect-video rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-white/3 hover:bg-white/5"
          >
            {uploading ? (
              <Loader2 size={20} className="text-white/40 animate-spin" />
            ) : (
              <>
                <ImageIcon size={20} className="text-white/20" />
                <span className="text-white/30 text-xs">Click to upload cover image</span>
              </>
            )}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {/* Title */}
      <div>
        <p className="text-white/40 text-[0.65rem] mb-1.5">Title *</p>
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Lexus of Henderson"
          className="bg-white/5 border-white/20 text-white placeholder:text-white/25"
        />
      </div>

      {/* Category */}
      <div>
        <p className="text-white/40 text-[0.65rem] mb-1.5">Category</p>
        <Input
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="e.g. Inventory Photography"
          className="bg-white/5 border-white/20 text-white placeholder:text-white/25"
        />
      </div>

      {/* Slug */}
      <div>
        <p className="text-white/40 text-[0.65rem] mb-1.5">Link Slug (optional)</p>
        <Input
          value={slug}
          onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          placeholder="e.g. lexus-of-henderson"
          className="bg-white/5 border-white/20 text-white/70 font-mono placeholder:text-white/20"
        />
        <p className="text-white/20 text-[0.55rem] mt-1 px-1">Links to /projects/{slug || "url-slug"} when clicked</p>
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPublished(v => !v)}
          className={`w-10 h-5 rounded-full transition-colors relative ${published ? "bg-green-500" : "bg-white/20"}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${published ? "left-5" : "left-0.5"}`} />
        </button>
        <span className="text-white/50 text-xs">{published ? "Visible on site" : "Hidden from site"}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          disabled={!canSave || isSaving || uploading}
          onClick={() => onSave({ title, category, imageUrl, imageKey, slug, published })}
          className="flex-1"
        >
          {isSaving ? <><Loader2 size={13} className="animate-spin mr-1.5" /> Saving...</> : <><Check size={13} className="mr-1.5" /> Save Card</>}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} className="text-white/40">
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FeaturedWorkAdmin() {
  const { user, loading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const [editingItem, setEditingItem] = useState<FeaturedItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const { data: items = [], isLoading } = trpc.featuredWork.listAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const [localItems, setLocalItems] = useState<FeaturedItem[]>([]);
  // Sync local state when server data arrives
  useEffect(() => {
    setLocalItems(items as FeaturedItem[]);
  }, [items]);

  const createMut = trpc.featuredWork.create.useMutation({
    onSuccess: () => { utils.featuredWork.listAll.invalidate(); setShowAddForm(false); toast.success("Card added"); },
    onError: (e) => toast.error(e.message),
  });

  const updateMut = trpc.featuredWork.update.useMutation({
    onSuccess: () => { utils.featuredWork.listAll.invalidate(); setEditingItem(null); toast.success("Card updated"); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMut = trpc.featuredWork.delete.useMutation({
    onSuccess: () => { utils.featuredWork.listAll.invalidate(); setDeleteConfirm(null); toast.success("Card deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const reorderMut = trpc.featuredWork.reorder.useMutation({
    onError: (e) => { toast.error(e.message); utils.featuredWork.listAll.invalidate(); },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLocalItems(prev => {
      const oldIndex = prev.findIndex(i => i.id === active.id);
      const newIndex = prev.findIndex(i => i.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      // Persist new order
      reorderMut.mutate(reordered.map((item, idx) => ({ id: item.id, sortOrder: idx })));
      return reordered;
    });
  };

  const handleSaveNew = (data: { title: string; category: string; imageUrl: string; imageKey: string; slug: string; published: boolean }) => {
    createMut.mutate({
      title: data.title,
      category: data.category || undefined,
      imageUrl: data.imageUrl,
      imageKey: data.imageKey || undefined,
      slug: data.slug || undefined,
      sortOrder: localItems.length,
      published: data.published,
    });
  };

  const handleSaveEdit = (data: { title: string; category: string; imageUrl: string; imageKey: string; slug: string; published: boolean }) => {
    if (!editingItem) return;
    updateMut.mutate({
      id: editingItem.id,
      title: data.title,
      category: data.category || undefined,
      imageUrl: data.imageUrl,
      imageKey: data.imageKey || undefined,
      slug: data.slug || undefined,
      published: data.published,
    });
  };

  const handleTogglePublish = (id: number, published: boolean) => {
    updateMut.mutate({ id, published });
    setLocalItems(prev => prev.map(i => i.id === id ? { ...i, published } : i));
  };

  // Auth guard
  if (loading) {
    return (
      <AdminLayout title="Featured Work">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={24} className="animate-spin" style={{ color: TW.indigo }} />
        </div>
      </AdminLayout>
    );
  }
  if (!isAuthenticated || user?.role !== "admin") {
    window.location.href = getLoginUrl("/admin/featured-work");
    return null;
  }

  return (
    <AdminLayout
      title="Featured Work"
      subtitle={`${localItems.length} card${localItems.length !== 1 ? "s" : ""}`}
      actions={
        <Button
          size="sm"
          onClick={() => { setShowAddForm(true); setEditingItem(null); }}
          disabled={showAddForm}
          className="h-8 text-xs gap-1.5"
        >
          <Plus size={13} /> Add Card
        </Button>
      }
    >
      <div className="max-w-2xl space-y-4">
        {/* Add form */}
        {showAddForm && (
          <ItemForm
            onSave={handleSaveNew}
            onCancel={() => setShowAddForm(false)}
            isSaving={createMut.isPending}
          />
        )}

        {/* Edit form */}
        {editingItem && (
          <ItemForm
            initial={editingItem}
            onSave={handleSaveEdit}
            onCancel={() => setEditingItem(null)}
            isSaving={updateMut.isPending}
          />
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="text-white/20 animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && localItems.length === 0 && !showAddForm && (
          <div className="text-center py-16 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
              <ImageIcon size={24} className="text-white/20" />
            </div>
            <p className="text-white/40 text-sm">No featured work cards yet</p>
            <Button size="sm" onClick={() => setShowAddForm(true)} className="gap-1.5">
              <Plus size={13} /> Add Your First Card
            </Button>
          </div>
        )}

        {/* Drag-to-reorder list */}
        {localItems.length > 0 && (
          <>
            <p className="text-white/25 text-[0.65rem] uppercase tracking-widest px-1">
              Drag to reorder · changes save automatically
            </p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={localItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {localItems.map(item => (
                    deleteConfirm === item.id ? (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                        <p className="flex-1 text-sm text-red-300">Delete <strong>{item.title}</strong>?</p>
                        <button
                          onClick={() => deleteMut.mutate({ id: item.id })}
                          disabled={deleteMut.isPending}
                          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {deleteMut.isPending ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />} Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs text-white/40 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <SortableRow
                        key={item.id}
                        item={item}
                        onEdit={(i) => { setEditingItem(i); setShowAddForm(false); }}
                        onDelete={(id) => setDeleteConfirm(id)}
                        onTogglePublish={handleTogglePublish}
                      />
                    )
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </>
        )}

        {/* Live preview link */}
        {localItems.length > 0 && (
          <div className="pt-4" style={{ borderTop: `1px solid ${TW.border}` }}>
            <a
              href="/use-cases"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs transition-colors"
              style={{ color: TW.textMuted }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = TW.indigo; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = TW.textMuted; }}
            >
              <Eye size={12} /> Preview on Use Cases page →
            </a>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
