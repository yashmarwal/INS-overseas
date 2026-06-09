import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { IMAGE_SLOTS, type ImageSlot } from "@/data/imageSections";
import { useGalleryImages, type GalleryImage } from "@/hooks/useGalleryImages";
import { useProductImages, PRODUCT_CATEGORIES, type ProductCategory } from "@/hooks/useProductImages";
import { Upload, Trash2, CheckCircle, AlertCircle, Eye, LogOut, ExternalLink, Plus } from "lucide-react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "insadmin2025";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type SiteImage = {
  id: string;
  section: string;
  url: string;
  storage_path: string;
};

// ── Main page ──────────────────────────────────────────────────────────────────
function AdminPage() {
  const [authed, setAuthed] = useState(
    () => typeof sessionStorage !== "undefined" && sessionStorage.getItem("ins_admin") === "true"
  );
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  // Fixed slots
  const [images, setImages] = useState<SiteImage[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);

  // Gallery
  const { images: galleryImages, loading: galleryLoading, refetch: refetchGallery } = useGalleryImages();
  const [galleryUploading, setGalleryUploading] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Products
  const { images: productImages, loading: productLoading, refetch: refetchProducts } = useProductImages();
  const [productUploading, setProductUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("leather-journals");
  const [productName, setProductName] = useState("");
  const [adminProductTab, setAdminProductTab] = useState<string>("leather-journals");
  const productInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [previewSlot, setPreviewSlot] = useState<ImageSlot | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("ins_admin", "true");
      setAuthed(true);
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 2000);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("ins_admin");
    setAuthed(false);
  };

  const fetchImages = async () => {
    const { data } = await supabase.from("site_images").select("*");
    if (data) setImages(data);
  };

  useEffect(() => {
    if (authed) fetchImages();
  }, [authed]);

  const getImageForSection = (section: string) =>
    images.find((img) => img.section === section);

  // ── Fixed slot upload ─────────────────────────────────────────────────────────
  const handleUpload = async (slot: ImageSlot, file: File) => {
    setUploading(slot.section);
    try {
      const existing = getImageForSection(slot.section);
      if (existing?.storage_path) {
        await supabase.storage.from("website-images").remove([existing.storage_path]);
        await supabase.from("site_images").delete().eq("section", slot.section);
      }

      const ext = file.name.split(".").pop();
      const path = `${slot.section}_${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("website-images")
        .upload(path, file, { upsert: true });

      if (uploadError) { console.error("Storage error:", uploadError); throw uploadError; }

      const { data: urlData } = supabase.storage.from("website-images").getPublicUrl(path);

      await supabase.from("site_images").insert({
        section: slot.section,
        label: slot.label,
        url: urlData.publicUrl,
        storage_path: path,
      });

      await fetchImages();
      showToast("success", `✓ ${slot.label} updated`);
    } catch (e: any) {
      const msg = e?.message || e?.error_description || JSON.stringify(e);
      console.error("Upload error:", msg);
      showToast("error", `Upload failed: ${msg}`);
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (slot: ImageSlot) => {
    const existing = getImageForSection(slot.section);
    if (!existing) return;
    if (!confirm(`Remove custom image for "${slot.label}"?\n\nThe default image will be shown instead.`)) return;
    await supabase.storage.from("website-images").remove([existing.storage_path]);
    await supabase.from("site_images").delete().eq("section", slot.section);
    await fetchImages();
    showToast("success", `Removed — default image restored for ${slot.label}`);
  };

  // ── Gallery upload ────────────────────────────────────────────────────────────
  const handleGalleryUpload = async (files: FileList) => {
    setGalleryUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) continue;
        const ext = file.name.split(".").pop();
        const path = `gallery_${Date.now()}_${i}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("website-images").upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("website-images").getPublicUrl(path);
        await supabase.from("site_images").insert({
          section: "gallery", label: "Gallery Image",
          url: urlData.publicUrl, storage_path: path,
          sort_order: galleryImages.length + i, alt_text: "INS Overseas product",
        });
      }
      await refetchGallery();
      showToast("success", `✓ ${files.length} image${files.length > 1 ? "s" : ""} added to gallery`);
    } catch (e: any) {
      showToast("error", `Gallery upload failed: ${e?.message || "Unknown error"}`);
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleGalleryDelete = async (img: GalleryImage) => {
    if (!confirm("Remove this image from the gallery?")) return;
    await supabase.storage.from("website-images").remove([img.storage_path]);
    await supabase.from("site_images").delete().eq("id", img.id);
    await refetchGallery();
    showToast("success", "Image removed from gallery");
  };

  // ── Product upload ────────────────────────────────────────────────────────────
  const handleProductUpload = async (files: FileList) => {
    setProductUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) continue;
        const ext = file.name.split(".").pop();
        const path = `product_${selectedCategory}_${Date.now()}_${i}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("website-images").upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("website-images").getPublicUrl(path);
        const catLabel = PRODUCT_CATEGORIES.find((c) => c.id === selectedCategory)?.label || "";
        await supabase.from("site_images").insert({
          section: "product",
          label: productName || catLabel,
          url: urlData.publicUrl,
          storage_path: path,
          category: selectedCategory,
          product_name: productName.trim() || catLabel,
          alt_text: productName.trim() || catLabel,
          sort_order: productImages.filter((p) => p.category === selectedCategory).length + i,
        });
      }
      await refetchProducts();
      setProductName("");
      showToast("success", `✓ Product added to ${PRODUCT_CATEGORIES.find((c) => c.id === selectedCategory)?.label}`);
    } catch (e: any) {
      showToast("error", `Upload failed: ${e?.message}`);
    } finally {
      setProductUploading(false);
    }
  };

  const handleProductDelete = async (img: any) => {
    if (!confirm(`Remove "${img.product_name || "this product"}" from the website?`)) return;
    await supabase.storage.from("website-images").remove([img.storage_path]);
    await supabase.from("site_images").delete().eq("id", img.id);
    await refetchProducts();
    showToast("success", "Product removed");
  };

  // ── Login screen ──────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" data-admin style={{ background: "#0F0B08" }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <p className="text-gold uppercase tracking-[0.3em] text-[11px] mb-3" style={{ fontFamily: "var(--font-body)" }}>INS Overseas</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: 32, color: "#FAF7F0" }}>Image Manager</h1>
          </div>
          <div style={{ background: "#EDE3CC", borderRadius: 2, padding: "2rem" }}>
            <label className="block mb-1 uppercase" style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", color: "#6B4C2A" }}>Password</label>
            <input
              type="password" value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="w-full bg-transparent py-2 text-ink focus:outline-none"
              style={{ borderBottom: `2px solid ${pwError ? "#ef4444" : "rgba(107,76,42,0.35)"}`, transition: "border-color 0.2s", fontFamily: "var(--font-body)", fontSize: 15 }}
              placeholder="Enter admin password" autoFocus
            />
            {pwError && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>Incorrect password</p>}
            <button onClick={login} className="w-full mt-6 py-3 uppercase transition-colors" style={{ background: "#6B4C2A", color: "#FAF7F0", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12, letterSpacing: "0.18em" }}>
              Enter
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" data-admin style={{ background: "#F5EDD8" }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 shadow-xl text-sm" style={{ borderRadius: 4, background: toast.type === "success" ? "#4A7C59" : "#dc2626", color: "#FAF7F0", fontFamily: "var(--font-body)" }}>
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Sticky header */}
      <div className="sticky top-0 z-40" style={{ background: "#0F0B08", borderBottom: "1px solid rgba(201,151,58,0.2)" }}>
        <div className="flex items-center justify-between px-5 sm:px-8 py-4">
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: 20, color: "#FAF7F0" }}>INS Overseas — Image Manager</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(250,247,240,0.45)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>Upload, replace, or remove website images</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 transition-colors" style={{ color: "rgba(250,247,240,0.45)", fontSize: 13, fontFamily: "var(--font-body)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FAF7F0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(250,247,240,0.45)")}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Helper banner */}
      <div className="mx-4 sm:mx-6 mt-5 mb-1 px-4 py-3 rounded-sm flex items-start gap-3" style={{ background: "rgba(201,151,58,0.1)", border: "1px solid rgba(201,151,58,0.2)" }}>
        <span style={{ fontSize: 16, marginTop: 2 }}>📸</span>
        <div>
          <p className="text-sm font-medium" style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "#FAF7F0" }}>How to update an image</p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "rgba(250,247,240,0.55)" }}>
            Find the section → click <strong style={{ color: "#C9973A" }}>Upload</strong> → select a photo → done. Changes appear on the website immediately.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-16">

        {/* ── SECTION 1: Fixed Homepage Images ── */}
        <div>
          <SectionHeader title="🏠 Homepage — Background Images" subtitle="These images appear as backgrounds across the homepage" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {IMAGE_SLOTS.map((slot) => {
              const existing = getImageForSection(slot.section);
              return (
                <ImageCard
                  key={slot.section}
                  slot={slot}
                  currentUrl={existing?.url ?? slot.defaultUrl}
                  hasCustom={!!existing}
                  isUploading={uploading === slot.section}
                  onUpload={(file) => handleUpload(slot, file)}
                  onDelete={() => handleDelete(slot)}
                  onPreview={() => setPreviewSlot(slot)}
                />
              );
            })}
          </div>
        </div>

        {/* ── SECTION 2: Product Manager ── */}
        <div>
          <SectionHeader
            title="📦 Products — Add / Remove"
            subtitle="Add product photos by category. They appear instantly on the Products page."
            count={`${productImages.length} product${productImages.length !== 1 ? "s" : ""}`}
          />

          {/* Upload form */}
          <div className="mt-6 rounded-sm p-5 mb-6" style={{ background: "#FAF7F0", border: "1px solid rgba(139,125,107,0.2)" }}>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14, color: "#4A3219", marginBottom: 16 }}>Add a new product photo</p>

            {/* Step 1 — Category */}
            <div className="mb-4">
              <label className="block mb-2 uppercase" style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.15em", color: "#8B7D6B" }}>Step 1 — Select category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as ProductCategory)}
                    className="flex items-center gap-2 px-3 py-2.5 text-left transition-all"
                    style={{
                      borderRadius: 2,
                      border: `1px solid ${selectedCategory === cat.id ? "#6B4C2A" : "rgba(139,125,107,0.3)"}`,
                      background: selectedCategory === cat.id ? "#6B4C2A" : "transparent",
                      color: selectedCategory === cat.id ? "#FAF7F0" : "#6B4C2A",
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span className="leading-tight">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — Product name */}
            <div className="mb-4">
              <label className="block mb-2 uppercase" style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.15em", color: "#8B7D6B" }}>
                Step 2 — Product name <span className="normal-case opacity-60">(optional)</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Vintage Buffalo Leather Journal A5 — be specific, this shows on the website"
                className="w-full bg-transparent py-2 text-ink focus:outline-none text-sm"
                style={{ borderBottom: "1px solid rgba(107,76,42,0.3)", fontFamily: "var(--font-body)" }}
              />
              <p className="text-warm-grey/60 text-[11px] mt-1" style={{ fontFamily: "var(--font-body)", color: "rgba(139,125,107,0.6)" }}>
                This name appears on the product card and in enquiry emails sent to you.
              </p>
            </div>

            {/* Step 3 — Upload */}
            <div>
              <label className="block mb-2 uppercase" style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.15em", color: "#8B7D6B" }}>Step 3 — Upload photo</label>
              <button
                onClick={() => productInputRef.current?.click()}
                disabled={productUploading}
                className="flex items-center gap-3 px-5 py-3 uppercase text-xs transition-colors disabled:opacity-50"
                style={{ background: "#6B4C2A", color: "#FAF7F0", fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.15em", borderRadius: 2 }}
              >
                {productUploading ? (
                  <><div className="w-3 h-3 rounded-full animate-spin" style={{ border: "1.5px solid rgba(250,247,240,0.3)", borderTopColor: "#FAF7F0" }} />Uploading…</>
                ) : (
                  <><Upload size={14} />Select photo → adds to {PRODUCT_CATEGORIES.find((c) => c.id === selectedCategory)?.label}</>
                )}
              </button>
              <input
                ref={productInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
                onChange={(e) => { if (e.target.files?.length) handleProductUpload(e.target.files); e.target.value = ""; }}
              />
            </div>
          </div>

          {/* Category tabs for managing existing */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {PRODUCT_CATEGORIES.map((cat) => {
              const count = productImages.filter((p) => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setAdminProductTab(cat.id)}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    border: `1px solid ${adminProductTab === cat.id ? "#6B4C2A" : "rgba(139,125,107,0.3)"}`,
                    background: adminProductTab === cat.id ? "#6B4C2A" : "transparent",
                    color: adminProductTab === cat.id ? "#FAF7F0" : "#6B4C2A",
                  }}
                >
                  {cat.icon} {cat.label}
                  {count > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: adminProductTab === cat.id ? "rgba(255,255,255,0.2)" : "rgba(107,76,42,0.1)", color: adminProductTab === cat.id ? "#FAF7F0" : "#6B4C2A" }}
                    >{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Products grid */}
          {productLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => <div key={i} className="aspect-[3/4] rounded-sm animate-pulse" style={{ background: "#EDE3CC" }} />)}
            </div>
          ) : (() => {
            const filtered = productImages.filter((p) => p.category === adminProductTab);
            if (filtered.length === 0) return (
              <div className="text-center py-10 rounded-sm" style={{ border: "2px dashed rgba(139,125,107,0.25)", fontFamily: "var(--font-body)", fontSize: 13, color: "#8B7D6B" }}>
                No products in {PRODUCT_CATEGORIES.find((c) => c.id === adminProductTab)?.label} yet.
                <br /><span style={{ fontSize: 11, opacity: 0.6 }}>Select this category above and upload a photo.</span>
              </div>
            );
            return (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {filtered.map((img) => (
                  <div key={img.id} className="relative group">
                    <div className="aspect-[3/4] overflow-hidden rounded-sm" style={{ background: "#EDE3CC" }}>
                      <img src={img.url} alt={img.product_name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm flex items-center justify-center" style={{ background: "rgba(15,11,8,0.6)" }}>
                        <button onClick={() => handleProductDelete(img)} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ background: "#dc2626" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#b91c1c"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#dc2626"; }}
                        ><Trash2 size={15} color="#fff" /></button>
                      </div>
                    </div>
                    {img.product_name && (
                      <p className="mt-1.5 truncate" style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#6B4C2A" }} title={img.product_name}>{img.product_name}</p>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* ── SECTION 3: Gallery Manager ── */}
        <div>
          <SectionHeader
            title="🎨 Gallery — Add / Remove Images"
            subtitle="Photos uploaded here appear in the Gallery page masonry grid."
            count={`${galleryImages.length} image${galleryImages.length !== 1 ? "s" : ""}`}
          />

          {/* Drop zone */}
          <div
            className="mt-6 border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-all mb-6"
            style={{ borderColor: "rgba(107,76,42,0.25)" }}
            onClick={() => galleryInputRef.current?.click()}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,151,58,0.5)"; e.currentTarget.style.background = "rgba(201,151,58,0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(107,76,42,0.25)"; e.currentTarget.style.background = "transparent"; }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) handleGalleryUpload(e.dataTransfer.files); }}
          >
            {galleryUploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full animate-spin" style={{ border: "2px solid rgba(201,151,58,0.3)", borderTopColor: "#C9973A" }} />
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#8B7D6B" }}>Uploading…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(107,76,42,0.1)" }}>
                  <Plus size={28} style={{ color: "rgba(107,76,42,0.5)" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 15, color: "#4A3219" }}>Add photos to gallery</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#8B7D6B", marginTop: 4 }}>
                    Click to select or drag and drop · Multiple at once · JPG, PNG, WebP · Max 5MB each
                  </p>
                </div>
              </div>
            )}
            <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
              onChange={(e) => { if (e.target.files?.length) handleGalleryUpload(e.target.files); e.target.value = ""; }}
            />
          </div>

          {/* Gallery thumbnails */}
          {galleryLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => <div key={i} className="aspect-square rounded-sm animate-pulse" style={{ background: "#EDE3CC" }} />)}
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-10" style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#8B7D6B" }}>
              No gallery images yet. Upload your first photo above.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {galleryImages.map((img) => (
                <div key={img.id} className="relative group aspect-square">
                  <img src={img.url} alt="Gallery" className="w-full h-full object-cover rounded-sm" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm flex items-center justify-center" style={{ background: "rgba(15,11,8,0.6)" }}>
                    <button onClick={() => handleGalleryDelete(img)} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ background: "#dc2626" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#b91c1c"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#dc2626"; }}
                    ><Trash2 size={15} color="#fff" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="mt-4 text-center" style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(139,125,107,0.5)" }}>
            Changes appear on the Gallery page immediately after upload
          </p>
        </div>

      </div>

      {/* Preview modal */}
      {previewSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.85)" }} onClick={() => setPreviewSlot(null)}>
          <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={getImageForSection(previewSlot.section)?.url ?? previewSlot.defaultUrl} alt={previewSlot.label} className="w-full object-cover" style={{ borderRadius: 2 }} />
            <p className="text-center mt-3 text-sm" style={{ color: "rgba(250,247,240,0.7)", fontFamily: "var(--font-body)" }}>{previewSlot.label}</p>
            <p className="text-center text-xs mt-1" style={{ color: "rgba(250,247,240,0.35)", fontFamily: "var(--font-body)" }}>Click anywhere to close</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shared section header ──────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, count }: { title: string; subtitle?: string; count?: string }) {
  return (
    <div className="flex items-start justify-between pb-3" style={{ borderBottom: "1px solid rgba(107,76,42,0.2)" }}>
      <div>
        <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B4C2A" }}>{title}</h2>
        {subtitle && <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#8B7D6B", marginTop: 3 }}>{subtitle}</p>}
      </div>
      {count && <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#8B7D6B", flexShrink: 0 }}>{count}</span>}
    </div>
  );
}

// ── Image card (fixed slots) ───────────────────────────────────────────────────
function ImageCard({ slot, currentUrl, hasCustom, isUploading, onUpload, onDelete, onPreview }: {
  slot: ImageSlot; currentUrl: string; hasCustom: boolean; isUploading: boolean;
  onUpload: (file: File) => void; onDelete: () => void; onPreview: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { alert("Only JPG, PNG, and WebP images are supported."); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB."); return; }
    onUpload(file);
    e.target.value = "";
  };

  return (
    <div style={{ background: "#FAF7F0", borderRadius: 2, overflow: "hidden", border: "1px solid rgba(139,125,107,0.2)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div className="relative overflow-hidden cursor-pointer group" style={{ aspectRatio: slot.aspectRatio, background: "#EDE3CC" }} onClick={onPreview}>
        <img src={currentUrl} alt={slot.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(15,11,8,0.55)" }}><Eye size={22} color="#FAF7F0" /></div>
        <div className="absolute top-2 right-2" style={{ background: hasCustom ? "#C9973A" : "rgba(15,11,8,0.6)", color: hasCustom ? "#1A1410" : "#FAF7F0", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 20 }}>
          {hasCustom ? "Custom" : "Default"}
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 15, color: "#1A1410", marginBottom: 8 }}>{slot.label}</p>
        <div className="flex items-center gap-1.5 mb-3">
          <span style={{ fontSize: 11 }}>📍</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#8B7D6B", lineHeight: 1.4 }}>{slot.location}</span>
        </div>
        <div className="flex items-start gap-1.5 mb-4 px-3 py-2" style={{ background: "rgba(201,151,58,0.08)", border: "1px solid rgba(201,151,58,0.15)", borderRadius: 3 }}>
          <span style={{ fontSize: 11, marginTop: 1 }}>💡</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(201,151,58,0.9)", lineHeight: 1.5 }}>{slot.tip}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => inputRef.current?.click()} disabled={isUploading} className="flex-1 flex items-center justify-center gap-2 transition-colors"
            style={{ background: isUploading ? "rgba(107,76,42,0.5)" : "#6B4C2A", color: "#FAF7F0", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 0", borderRadius: 2, cursor: isUploading ? "not-allowed" : "pointer" }}>
            {isUploading ? <><div className="w-3 h-3 rounded-full animate-spin" style={{ border: "1.5px solid rgba(250,247,240,0.3)", borderTopColor: "#FAF7F0" }} />Uploading…</> : <><Upload size={13} />{hasCustom ? "Replace" : "Upload"}</>}
          </button>
          {hasCustom && (
            <button onClick={onDelete} className="flex items-center justify-center transition-colors" style={{ width: 40, border: "1px solid rgba(220,38,38,0.35)", color: "#dc2626", borderRadius: 2 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            ><Trash2 size={14} /></button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
        <a href={slot.pageUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 mt-3 transition-colors"
          style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.08em", color: "rgba(139,125,107,0.6)", textDecoration: "none" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#8B7D6B"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(139,125,107,0.6)"; }}
        ><ExternalLink size={11} />View on site</a>
      </div>
    </div>
  );
}
