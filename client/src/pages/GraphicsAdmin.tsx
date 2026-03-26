/* ============================================================
   Graphics Admin — /admin/graphics
   Manage the portfolio graphics shown on the public Portfolio page.
   Features: drag-to-reorder, add (with image upload), edit, delete, publish toggle
   ============================================================ */
import { useState, useRef, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  GripVertical, Trash2, Plus, X, Pencil, Check, Eye, EyeOff,
  Image as ImageIcon, Loader2, ArrowLeft,
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

type GraphicItem = {
  id: number;
  title: string | null;
  caption: string | null;
  url: string;
  fileKey: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function SortableRow({
  item,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  item: GraphicItem;
  onEdit: (item: GraphicItem) => void;
  onDelete: (id: number) => void;
  onTogglePublish: (id: number, published: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
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
        isDragging ? "bg-white/10 border-white/30 shadow-2xl" : "bg-white/5 border-white/10 hover:border-white/20"
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="p-1.5 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/10 cursor-grab active:cursor-grabbing transition-colors shrink-0"
        title="Drag to reorder"
      >
        <GripVertical size={16} />
      </div>

      <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0">
        <img src={item.url} alt={item.title ?? ""} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">{item.title ?? "(untitled)"}</p>
        {item.caption && (
          <p className="text-white/40 text-[0.6rem] truncate mt-0.5">{item.caption}</p>
        )}
      </div>

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

function ItemForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial?: Partial<GraphicItem>;
  onSave: (data: { title: string; caption: string; url: string; fileKey: string; published: boolean }) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [caption, setCaption] = useState(initial?.caption ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [fileKey, setFileKey] = useState(initial?.fileKey ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadMut = trpc.portfolioGraphics.uploadImage.useMutation({
    onSuccess: (data) => {
      setUrl(data.url);
      setFileKey(data.key);
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

  const canSave = url;

  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/15 space-y-4">
      <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">
        {initial?.id ? "Edit Graphic" : "New Graphic"}
      </p>

      <div>
        <p className="text-white/40 text-[0.65rem] mb-1.5">Image *</p>
        {url ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-white/5 mb-2">
            <img src={url} alt="Graphic" className="w-full h-full object-cover" />
            <button
              onClick={() => { setUrl(""); setFileKey(""); }}
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
                <span className="text-white/30 text-xs">Click to upload graphic</span>
              </>
            )}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      <div>
        <p className="text-white/40 text-[0.65rem] mb-1.5">Title</p>
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Findlay Nissan — Presidents Day"
          className="bg-white/5 border-white/20 text-white placeholder:text-white/25"
        />
      </div>

      <div>
        <p className="text-white/40 text-[0.65rem] mb-1.5">Caption</p>
        <Input
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="e.g. Social media graphic for Presidents Day campaign"
          className="bg-white/5 border-white/20 text-white placeholder:text-white/25"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setPublished(v => !v)}
          className={`w-10 h-5 rounded-full transition-colors relative ${published ? "bg-green-500" : "bg-white/20"}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${published ? "left-5" : "left-0.5"}`} />
        </button>
        <span className="text-white/50 text-xs">{published ? "Visible on site" : "Hidden from site"}</span>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          disabled={!canSave || isSaving || uploading}
          onClick={() => onSave({ title, caption, url, fileKey, published })}
          className="flex-1"
        >
          {isSaving ? <><Loader2 size={13} className="animate-spin mr-1.5" /> Saving...</> : <><Check size={13} className="mr-1.5" /> Save Graphic</>}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} className="text-white/40">
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function GraphicsAdmin() {
  const { user, loading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const [editingItem, setEditingItem] = useState<GraphicItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const { data: items = [], isLoading } = trpc.portfolioGraphics.listAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const [localItems, setLocalItems] = useState<GraphicItem[]>([]);
  useEffect(() => {
    setLocalItems(items as GraphicItem[]);
  }, [items]);

  const createMut = trpc.portfolioGraphics.create.useMutation({
    onSuccess: () => { utils.portfolioGraphics.listAll.invalidate(); setShowAddForm(false); toast.success("Graphic added"); },
    onError: (e) => toast.error(e.message),
  });

  const updateMut = trpc.portfolioGraphics.update.useMutation({
    onSuccess: () => { utils.portfolioGraphics.listAll.invalidate(); setEditingItem(null); toast.success("Graphic updated"); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMut = trpc.portfolioGraphics.delete.useMutation({
    onSuccess: () => { utils.portfolioGraphics.listAll.invalidate(); setDeleteConfirm(null); toast.success("Graphic deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const reorderMut = trpc.portfolioGraphics.reorder.useMutation({
    onError: (e) => { toast.error(e.message); utils.portfolioGraphics.listAll.invalidate(); },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLocalItems(prev => {
      const oldIndex = prev.findIndex(i => i.id === active.id);
      const newIndex = prev.findIndex(i => i.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      reorderMut.mutate(reordered.map((item, idx) => ({ id: item.id, sortOrder: idx })));
      return reordered;
    });
  };

  const handleSaveNew = (data: { title: string; caption: string; url: string; fileKey: string; published: boolean }) => {
    createMut.mutate({
      title: data.title || undefined,
      caption: data.caption || undefined,
      url: data.url,
      fileKey: data.fileKey,
      sortOrder: localItems.length,
      published: data.published,
    });
  };

  const handleSaveEdit = (data: { title: string; caption: string; url: string; fileKey: string; published: boolean }) => {
    if (!editingItem) return;
    updateMut.mutate({
      id: editingItem.id,
      title: data.title || undefined,
      caption: data.caption || undefined,
      published: data.published,
    });
  };

  const handleTogglePublish = (id: number, published: boolean) => {
    updateMut.mutate({ id, published });
    setLocalItems(prev => prev.map(i => i.id === id ? { ...i, published } : i));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[oklch(0.07_0_0)] flex items-center justify-center">
        <Loader2 size={24} className="text-white/30 animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated || user?.role !== "admin") {
    window.location.href = getLoginUrl("/admin/graphics");
    return null;
  }

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] text-white">
      <header className="sticky top-0 z-20 bg-[oklch(0.07_0_0)]/95 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <a
          href="/admin"
          className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={14} /> Admin
        </a>
        <span className="text-white/20">/</span>
        <h1 className="text-white font-semibold text-sm">Graphics</h1>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-white/30 text-xs">{localItems.length} graphic{localItems.length !== 1 ? "s" : ""}</span>
          <Button
            size="sm"
            onClick={() => { setShowAddForm(true); setEditingItem(null); }}
            disabled={showAddForm}
            className="h-8 text-xs gap-1.5"
          >
            <Plus size={13} /> Add Graphic
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-4">
        {showAddForm && (
          <ItemForm
            onSave={handleSaveNew}
            onCancel={() => setShowAddForm(false)}
            isSaving={createMut.isPending}
          />
        )}

        {editingItem && (
          <ItemForm
            initial={editingItem}
            onSave={handleSaveEdit}
            onCancel={() => setEditingItem(null)}
            isSaving={updateMut.isPending}
          />
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="text-white/20 animate-spin" />
          </div>
        )}

        {!isLoading && localItems.length === 0 && !showAddForm && (
          <div className="text-center py-16 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
              <ImageIcon size={24} className="text-white/20" />
            </div>
            <p className="text-white/40 text-sm">No graphics yet</p>
            <Button size="sm" onClick={() => setShowAddForm(true)} className="gap-1.5">
              <Plus size={13} /> Add Your First Graphic
            </Button>
          </div>
        )}

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
                        <p className="flex-1 text-sm text-red-300">Delete <strong>{item.title ?? "this graphic"}</strong>?</p>
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

        {localItems.length > 0 && (
          <div className="pt-4 border-t border-white/10">
            <a
              href="/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              <Eye size={12} /> Preview on Portfolio page
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
