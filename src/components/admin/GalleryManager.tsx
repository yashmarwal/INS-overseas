import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, GripVertical, Play, Trash2 } from "lucide-react";
import type { GalleryImage } from "@/hooks/useGalleryImages";
import { isVideoUrl } from "@/lib/utils";
import { useDragReorder, useSavedOrder } from "@/components/admin/reorder";
import { SetupPanel } from "@/components/admin/ProductManager";
import { buildSetupSql } from "@/lib/adminData";
import { EmptyState, MUTED } from "@/components/admin/AdminUI";

type Props = {
  images: GalleryImage[];
  loading: boolean;
  refetch: () => Promise<unknown>;
  onDelete: (img: GalleryImage) => void;
  showToast: (type: "success" | "error", msg: string) => void;
  adminEmail: string;
};

export default function GalleryManager({ images, loading, refetch, onDelete, showToast, adminEmail }: Props) {
  const [arrange, setArrange] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const { order, moveTo, saveState } = useSavedOrder(images, refetch, (permission) => {
    showToast("error", permission ? "Supabase isn't allowing changes yet. Run the one-time setup shown below." : "Some of the new order couldn't be saved. Please try again.");
    if (permission) setShowSetup(true);
  });
  const { dragId, overId, itemProps } = useDragReorder(moveTo);

  const ordered = useMemo(() => {
    const byId = new Map(images.map((g) => [g.id, g]));
    const known = order.map((id) => byId.get(id)).filter((g): g is GalleryImage => !!g);
    const seen = new Set(order);
    return [...known, ...images.filter((g) => !seen.has(g.id))];
  }, [order, images]);

  return (
    <>
      <div className="mt-8 mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-semibold">In your gallery <span className="font-normal tabular-nums" style={{ color: MUTED }}>({images.length})</span></h2>
        {images.length > 1 && (
          <button
            type="button"
            aria-pressed={arrange}
            onClick={() => setArrange((a) => !a)}
            className={`inline-flex items-center gap-2 h-10 px-4 rounded-xl border text-[14px] font-medium transition-colors ${arrange ? "bg-[#1A1410] text-white border-[#1A1410]" : "bg-white border-black/20 hover:border-[#6B4C2A]"}`}
          >
            <ArrowUpDown size={16} /> Arrange order
          </button>
        )}
      </div>

      {showSetup && <SetupPanel sql={buildSetupSql(adminEmail)} missing={false} onRecheck={() => showToast("success", "Thanks — try arranging again.")} onClose={() => setShowSetup(false)} showToast={showToast} />}

      {arrange && (
        <p className="mb-4 rounded-xl bg-[#FBF3E1] border border-[#C9973A]/40 px-4 py-3 text-[14px] leading-relaxed" style={{ color: "#4A3219" }} role="status">
          Drag a photo to a new place, or use the ◀ ▶ buttons. This is the order on your Gallery page.{" "}
          <span className="font-medium">{saveState === "saving" ? "Saving…" : saveState === "saved" ? "✓ Saved" : saveState === "error" ? "Not saved — try again" : ""}</span>
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-square rounded-2xl bg-black/[0.06] animate-pulse" />)}
        </div>
      ) : ordered.length === 0 ? (
        <EmptyState title="Your gallery is empty" text="Add a few photos above and they will appear on the Gallery page." />
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {ordered.map((img, i) => {
            const video = isVideoUrl(img.url);
            return (
              <li key={img.id} data-gallery-card {...(arrange ? itemProps(img.id) : {})} className={`transition-opacity ${dragId === img.id ? "opacity-40" : ""}`}>
                <div className={`relative aspect-square rounded-2xl overflow-hidden bg-[#EFEBE3] border border-black/10 ${overId === img.id ? "ring-2 ring-[#C9973A]" : ""}`}>
                  {video ? <video src={img.url} muted playsInline preload="metadata" className="w-full h-full object-cover" /> : <img src={img.url} alt="Gallery item" loading="lazy" decoding="async" draggable={false} className="w-full h-full object-cover" />}
                  {video && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-[#1A1410]/80 text-white text-[11px] font-medium px-2.5 py-1"><Play size={11} fill="currentColor" /> Video</span>
                  )}
                  {!arrange && (
                    <button
                      onClick={() => onDelete(img)}
                      aria-label={video ? "Remove this video" : "Remove this photo"}
                      className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white text-[#B42318] shadow-md flex items-center justify-center hover:bg-[#FEF3F2]"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  {arrange && (
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-2 bg-black/45">
                      <button onClick={() => ordered[i - 1] && moveTo(img.id, ordered[i - 1].id)} disabled={i === 0} aria-label="Move earlier" className="w-9 h-9 rounded-full bg-white text-[#1A1410] shadow flex items-center justify-center disabled:opacity-30"><ChevronLeft size={18} /></button>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 text-[#1A1410] text-[12px] font-medium px-2.5 h-7 cursor-grab"><GripVertical size={14} /> Drag</span>
                      <button onClick={() => ordered[i + 1] && moveTo(img.id, ordered[i + 1].id)} disabled={i === ordered.length - 1} aria-label="Move later" className="w-9 h-9 rounded-full bg-white text-[#1A1410] shadow flex items-center justify-center disabled:opacity-30"><ChevronRight size={18} /></button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
