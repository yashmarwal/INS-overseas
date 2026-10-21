import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { IMAGE_SLOTS, type ImageSlot } from "@/data/imageSections";
import { useGalleryImages, type GalleryImage } from "@/hooks/useGalleryImages";
import { useProductImages, PRODUCT_CATEGORIES, type ProductCategory } from "@/hooks/useProductImages";
import { isVideoUrl } from "@/lib/utils";
import { compressImage } from "@/lib/compressImage";
import {
  ConfirmDialog, DropZone, EmptyState, GhostButton, MediaCard, MUTED, Panel, PrimaryButton, SectionHeader, Tip, Toast,
  type Confirm, type ToastState,
} from "@/components/admin/AdminUI";
import { ExternalLink, Eye, EyeOff, Image as ImageIcon, Images, LayoutGrid, LogOut, Monitor, Package, Play, Search, ShieldCheck, Trash2, X } from "lucide-react";

// Every upload gets a unique timestamped name, so browsers/CDN may cache it for a year.
const IMMUTABLE_CACHE = "31536000";
const MB = 1024 * 1024;

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "insadmin2025";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type SiteImage = { id: string; section: string; url: string; storage_path: string };
type Tab = "overview" | "banner" | "photos" | "products" | "gallery";

const BANNER_SLOTS = IMAGE_SLOTS.filter((s) => s.allowGif);
const PHOTO_SLOTS = IMAGE_SLOTS.filter((s) => !s.allowGif);
const PHOTO_GROUPS: { title: string; hint: string; match: (s: ImageSlot) => boolean }[] = [
  { title: "Collection cards", hint: "The four big category tiles on the homepage.", match: (s) => s.section.startsWith("category_") },
  { title: "Our Story", hint: "The two photos next to your story text.", match: (s) => s.section.startsWith("heritage_") },
  { title: "Bestsellers", hint: "The six cards under “Most Loved This Season”.", match: (s) => s.section.startsWith("featured_") },
  { title: "Wholesale banner", hint: "The wide picture behind the wholesale call-to-action.", match: (s) => s.section === "wholesale_bg" },
];

const IMG_TYPES = ["image/jpeg", "image/png", "image/webp"];

// ── Main page ──────────────────────────────────────────────────────────────────
function AdminPage() {
  const [authed, setAuthed] = useState(
    () => typeof sessionStorage !== "undefined" && sessionStorage.getItem("ins_admin") === "true",
  );
  const [tab, setTab] = useState<Tab>(() => (typeof sessionStorage !== "undefined" && (sessionStorage.getItem("ins_admin_tab") as Tab)) || "overview");
  const selectTab = (t: Tab) => {
    setTab(t);
    try { sessionStorage.setItem("ins_admin_tab", t); } catch { /* ignore */ }
    document.getElementById("admin-scroll")?.scrollTo({ top: 0 });
  };

  // Fixed slots (banner + homepage photos)
  const [images, setImages] = useState<SiteImage[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);

  // Gallery
  const { images: galleryImages, loading: galleryLoading, refetch: refetchGallery } = useGalleryImages();
  const [galleryProgress, setGalleryProgress] = useState<string | null>(null);

  // Products
  const { images: productImages, loading: productLoading, refetch: refetchProducts } = useProductImages();
  const [productProgress, setProductProgress] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("leather-journals");
  const [productName, setProductName] = useState("");
  const [listFilter, setListFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState<ToastState>(null);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [previewSlot, setPreviewSlot] = useState<ImageSlot | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    window.setTimeout(() => setToast((t) => (t && t.msg === msg ? null : t)), type === "error" ? 7000 : 4000);
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

  const getImageForSection = (section: string) => images.find((img) => img.section === section);

  // ── Fixed slot upload (banner + homepage photos) ─────────────────────────────
  const slotCheck = (slot: ImageSlot, file: File): string | null => {
    const types = slot.allowGif ? [...IMG_TYPES, "image/gif"] : IMG_TYPES;
    const maxMB = slot.allowGif ? 10 : 5;
    if (!types.includes(file.type)) return `That file type isn't supported. Please choose a ${slot.allowGif ? "GIF, " : ""}JPG, PNG or WebP image.`;
    if (file.size > maxMB * MB) return `That file is too large (${(file.size / MB).toFixed(1)} MB). The limit is ${maxMB} MB.`;
    return null;
  };

  const handleUpload = async (slot: ImageSlot, rawFile: File) => {
    const problem = slotCheck(slot, rawFile);
    if (problem) { showToast("error", problem); return; }
    setUploading(slot.section);
    try {
      // Upload the new file first; only remove the old one once the new one is saved,
      // so a failed upload never leaves the live site without its image.
      const existing = getImageForSection(slot.section);
      const file = await compressImage(rawFile, slot.allowGif ? 2400 : 1400);
      const ext = file.name.split(".").pop();
      const path = `${slot.section}_${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("website-images")
        .upload(path, file, { upsert: true, cacheControl: IMMUTABLE_CACHE, contentType: file.type });
      if (uploadError) { console.error("Storage error:", uploadError); throw uploadError; }

      const { data: urlData } = supabase.storage.from("website-images").getPublicUrl(path);

      const { error: insertError } = await supabase.from("site_images").insert({
        section: slot.section,
        label: slot.label,
        url: urlData.publicUrl,
        storage_path: path,
      });
      if (insertError) {
        await supabase.storage.from("website-images").remove([path]);
        throw insertError;
      }

      if (existing) {
        await supabase.from("site_images").delete().eq("id", existing.id);
        if (existing.storage_path) await supabase.storage.from("website-images").remove([existing.storage_path]);
      }

      await fetchImages();
      showToast("success", `“${slot.label}” is updated and live on your website.`);
    } catch (e: any) {
      const msg = e?.message || e?.error_description || JSON.stringify(e);
      console.error("Upload error:", msg);
      showToast("error", `That photo couldn't be uploaded: ${msg}`);
    } finally {
      setUploading(null);
    }
  };

  const doResetSlot = async (slot: ImageSlot) => {
    const existing = getImageForSection(slot.section);
    if (!existing) return;
    await supabase.storage.from("website-images").remove([existing.storage_path]);
    await supabase.from("site_images").delete().eq("section", slot.section);
    await fetchImages();
    showToast("success", `“${slot.label}” is back to the default photo.`);
  };
  const askResetSlot = (slot: ImageSlot) =>
    setConfirm({
      title: "Use the default photo?",
      message: `Your uploaded photo for “${slot.label}” will be removed and the original default will show on the website instead.`,
      confirmLabel: "Use default",
      onConfirm: () => void doResetSlot(slot),
    });

  // ── Gallery upload ────────────────────────────────────────────────────────────
  const handleGalleryUpload = async (files: File[]) => {
    let added = 0;
    const skipped: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const rawFile = files[i];
        setGalleryProgress(`Uploading ${i + 1} of ${files.length}…`);
        const isVideo = rawFile.type.startsWith("video/");
        const okType = isVideo ? ["video/mp4", "video/webm"].includes(rawFile.type) : IMG_TYPES.includes(rawFile.type);
        if (!okType || rawFile.size > (isVideo ? 10 : 5) * MB) { skipped.push(rawFile.name); continue; }
        const file = await compressImage(rawFile); // no-op for videos
        const ext = file.name.split(".").pop();
        const path = `gallery_${Date.now()}_${i}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("website-images").upload(path, file, { upsert: true, cacheControl: IMMUTABLE_CACHE, contentType: file.type });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("website-images").getPublicUrl(path);
        const { error: insertError } = await supabase.from("site_images").insert({
          section: "gallery", label: "Gallery Image",
          url: urlData.publicUrl, storage_path: path,
          sort_order: galleryImages.length + i, alt_text: "INS Overseas product",
        });
        if (insertError) {
          await supabase.storage.from("website-images").remove([path]);
          throw insertError;
        }
        added++;
      }
      await refetchGallery();
      if (skipped.length) {
        showToast("error", `${added ? `${added} added. ` : ""}Skipped ${skipped.length} file${skipped.length > 1 ? "s" : ""} (${skipped.join(", ")}) — photos must be JPG/PNG/WebP under 5 MB, videos MP4/WebM under 10 MB.`);
      } else {
        showToast("success", `${added} file${added > 1 ? "s" : ""} added to the gallery.`);
      }
    } catch (e: any) {
      showToast("error", `The gallery upload stopped: ${e?.message || "unknown error"}`);
    } finally {
      setGalleryProgress(null);
    }
  };

  const doDeleteGallery = async (img: GalleryImage) => {
    await supabase.storage.from("website-images").remove([img.storage_path]);
    await supabase.from("site_images").delete().eq("id", img.id);
    await refetchGallery();
    showToast("success", "Removed from the gallery.");
  };
  const askDeleteGallery = (img: GalleryImage) =>
    setConfirm({
      title: isVideoUrl(img.url) ? "Remove this video?" : "Remove this photo?",
      message: "It will disappear from the Gallery page. This can't be undone.",
      confirmLabel: "Remove",
      onConfirm: () => void doDeleteGallery(img),
    });

  // ── Product upload ────────────────────────────────────────────────────────────
  const catLabelOf = (id: string) => PRODUCT_CATEGORIES.find((c) => c.id === id)?.label || id;

  const handleProductUpload = async (files: File[]) => {
    let added = 0;
    const skipped: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const rawFile = files[i];
        setProductProgress(`Uploading ${i + 1} of ${files.length}…`);
        if (!IMG_TYPES.includes(rawFile.type) || rawFile.size > 5 * MB) { skipped.push(rawFile.name); continue; }
        const file = await compressImage(rawFile);
        const ext = file.name.split(".").pop();
        const path = `product_${selectedCategory}_${Date.now()}_${i}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("website-images").upload(path, file, { upsert: true, cacheControl: IMMUTABLE_CACHE, contentType: file.type });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("website-images").getPublicUrl(path);
        const catLabel = catLabelOf(selectedCategory);
        const { error: insertError } = await supabase.from("site_images").insert({
          section: "product",
          label: productName || catLabel,
          url: urlData.publicUrl,
          storage_path: path,
          category: selectedCategory,
          product_name: productName.trim() || catLabel,
          alt_text: productName.trim() || catLabel,
          sort_order: productImages.filter((p) => p.category === selectedCategory).length + i,
        });
        if (insertError) {
          await supabase.storage.from("website-images").remove([path]);
          throw insertError;
        }
        added++;
      }
      await refetchProducts();
      setProductName("");
      if (skipped.length) {
        showToast("error", `${added ? `${added} added. ` : ""}Skipped ${skipped.length} file${skipped.length > 1 ? "s" : ""} (${skipped.join(", ")}) — photos must be JPG, PNG or WebP under 5 MB.`);
      } else {
        showToast("success", `${added > 1 ? `${added} products` : "Product"} added to ${catLabelOf(selectedCategory)}.`);
      }
    } catch (e: any) {
      showToast("error", `The upload stopped: ${e?.message || "unknown error"}`);
    } finally {
      setProductProgress(null);
    }
  };

  const doDeleteProduct = async (img: { id: string; storage_path: string }) => {
    await supabase.storage.from("website-images").remove([img.storage_path]);
    await supabase.from("site_images").delete().eq("id", img.id);
    await refetchProducts();
    showToast("success", "Product removed.");
  };
  const askDeleteProduct = (img: { id: string; storage_path: string; product_name?: string }) =>
    setConfirm({
      title: "Remove this product?",
      message: `“${img.product_name || "This product"}” will disappear from the Products page. This can't be undone.`,
      confirmLabel: "Remove",
      onConfirm: () => void doDeleteProduct(img),
    });

  // ── Derived numbers ───────────────────────────────────────────────────────────
  const bannerCustom = BANNER_SLOTS.filter((s) => getImageForSection(s.section)).length;
  const photosCustom = PHOTO_SLOTS.filter((s) => getImageForSection(s.section)).length;
  const videoCount = galleryImages.filter((g) => isVideoUrl(g.url)).length;

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return productImages.filter((p) => (listFilter === "all" || p.category === listFilter) && (!q || (p.product_name || "").toLowerCase().includes(q)));
  }, [productImages, listFilter, search]);

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "overview", label: "Overview", icon: <LayoutGrid size={18} /> },
    { id: "banner", label: "Homepage banner", icon: <Monitor size={18} /> },
    { id: "photos", label: "Homepage photos", icon: <Images size={18} /> },
    { id: "products", label: "Products", icon: <Package size={18} />, badge: String(productImages.length) },
    { id: "gallery", label: "Gallery", icon: <ImageIcon size={18} />, badge: String(galleryImages.length) },
  ];

  const renderSlot = (slot: ImageSlot, aspectOverride?: string) => {
    const existing = getImageForSection(slot.section);
    return (
      <MediaCard
        key={slot.section}
        title={slot.label.replace("Homepage Hero — ", "")}
        where={slot.location}
        tip={slot.tip}
        url={existing?.url ?? slot.defaultUrl}
        isCustom={!!existing}
        busy={uploading === slot.section}
        accept={slot.allowGif ? "image/jpeg,image/png,image/webp,image/gif" : "image/jpeg,image/png,image/webp"}
        aspect={aspectOverride ?? slot.aspectRatio.replace("/", " / ")}
        limitText={slot.allowGif ? "GIF, JPG, PNG or WebP · up to 10 MB" : "JPG, PNG or WebP · up to 5 MB"}
        viewHref={slot.pageUrl}
        onFile={(f) => void handleUpload(slot, f)}
        onReset={() => askResetSlot(slot)}
        onPreview={() => setPreviewSlot(slot)}
      />
    );
  };

  return (
    <div id="admin-scroll" data-admin data-lenis-prevent className="fixed inset-0 z-[90] overflow-y-auto bg-[#F6F4EF] text-[#1A1410]" style={{ fontFamily: "var(--font-body)" }}>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <ConfirmDialog confirm={confirm} onClose={() => setConfirm(null)} />

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-black/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[#1A1410] leading-none truncate" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 21, letterSpacing: "0.02em" }}>INS Overseas</p>
            <p className="mt-1 text-[11px] uppercase leading-none" style={{ color: MUTED, letterSpacing: "0.16em" }}>Website manager</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl text-[13px] font-medium border border-black/15 hover:bg-black/[0.04]">
              <ExternalLink size={15} /> View website
            </a>
            <button onClick={logout} className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl text-[13px] font-medium border border-black/15 hover:bg-black/[0.04]">
              <LogOut size={15} /> Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5 lg:py-8 lg:flex lg:gap-10">
        {/* Navigation: sidebar on desktop, scrollable pills on phones */}
        <nav aria-label="Sections" className="lg:w-60 lg:shrink-0 lg:sticky lg:top-[88px] lg:self-start">
          <ul className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-3 lg:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 sticky top-16 z-20 lg:static bg-[#F6F4EF] pt-1 lg:pt-0">
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <li key={t.id} className="shrink-0">
                  <button
                    onClick={() => selectTab(t.id)}
                    aria-current={active ? "page" : undefined}
                    className={`w-full flex items-center gap-2.5 h-11 px-4 rounded-xl text-[14px] font-medium whitespace-nowrap transition-colors ${
                      active ? "bg-[#6B4C2A] text-white shadow-sm" : "bg-white text-[#1A1410] border border-black/10 hover:bg-[#FBF9F4] lg:border-transparent lg:bg-transparent lg:hover:bg-white"
                    }`}
                  >
                    {t.icon}
                    <span className="flex-1 text-left">{t.label}</span>
                    {t.badge && (
                      <span className={`min-w-[24px] h-6 px-1.5 rounded-full text-[12px] inline-flex items-center justify-center tabular-nums ${active ? "bg-white/20 text-white" : "bg-black/[0.06] text-[#4A3219]"}`}>{t.badge}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex-1 min-w-0 mt-2 lg:mt-0 pb-24">
          {/* ── Overview ─────────────────────────────────────────────── */}
          {tab === "overview" && (
            <>
              <SectionHeader title="Welcome back" description="Update your photos and products here. Everything you change goes live on your website straight away — no need to do anything else." />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "banner" as Tab, icon: <Monitor size={20} />, title: "Homepage banner", big: `${bannerCustom} of ${BANNER_SLOTS.length}`, sub: "banners are your own photos", cta: "Change banner" },
                  { id: "photos" as Tab, icon: <Images size={20} />, title: "Homepage photos", big: `${photosCustom} of ${PHOTO_SLOTS.length}`, sub: "photos are your own", cta: "Change photos" },
                  { id: "products" as Tab, icon: <Package size={20} />, title: "Products", big: String(productImages.length), sub: `products in ${PRODUCT_CATEGORIES.length} categories`, cta: "Add or remove products" },
                  { id: "gallery" as Tab, icon: <ImageIcon size={20} />, title: "Gallery", big: String(galleryImages.length), sub: videoCount ? `items (${videoCount} video${videoCount > 1 ? "s" : ""})` : "photos and videos", cta: "Manage gallery" },
                ].map((c) => (
                  <button key={c.id} onClick={() => selectTab(c.id)} className="group text-left">
                    <Panel className="p-5 h-full transition-shadow group-hover:shadow-[0_10px_30px_-14px_rgba(26,20,16,0.35)] group-focus-visible:ring-2 group-focus-visible:ring-[#6B4C2A]">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#F3EEE2", color: "#6B4C2A" }}>{c.icon}</span>
                        <h2 className="text-[16px] font-semibold">{c.title}</h2>
                      </div>
                      <p className="mt-4 text-[#1A1410] tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 38, lineHeight: 1 }}>{c.big}</p>
                      <p className="mt-1 text-[14px]" style={{ color: MUTED }}>{c.sub}</p>
                      <p className="mt-4 text-[14px] font-medium" style={{ color: "#4A3219" }}>{c.cta} →</p>
                    </Panel>
                  </button>
                ))}
              </div>

              <Panel className="mt-6 p-5 sm:p-6">
                <h2 className="text-[16px] font-semibold">How it works</h2>
                <ol className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    ["Pick a section", "Use the menu to choose what you want to change."],
                    ["Upload a photo", "Click “Upload” and choose a photo from your computer or phone."],
                    ["See it live", "Your change appears on the website immediately."],
                  ].map(([t, d], i) => (
                    <li key={t} className="flex gap-3">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-[#6B4C2A] text-white text-[14px] font-semibold flex items-center justify-center">{i + 1}</span>
                      <div>
                        <p className="text-[15px] font-semibold">{t}</p>
                        <p className="mt-0.5 text-[14px] leading-snug" style={{ color: MUTED }}>{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Panel>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Tip>Photos are made smaller automatically, so the website stays fast. You don't need to resize anything.</Tip>
                <Tip>Made a mistake? Every banner and photo has a “Use default photo” button that puts the original back.</Tip>
              </div>
            </>
          )}

          {/* ── Homepage banner ──────────────────────────────────────── */}
          {tab === "banner" && (
            <>
              <SectionHeader
                title="Homepage banner"
                description="The big picture at the very top of your homepage. Visitors on computers see the Desktop one, visitors on phones see the Mobile one."
              />
              <Tip>An animated WebP loads fastest. GIFs work too, but large GIFs make the page slower — keep them as small as you can.</Tip>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                {BANNER_SLOTS.map((s) => renderSlot(s, s.section === "hero_mobile" ? "4 / 5" : "16 / 9"))}
              </div>
            </>
          )}

          {/* ── Homepage photos ──────────────────────────────────────── */}
          {tab === "photos" && (
            <>
              <SectionHeader title="Homepage photos" description="The pictures behind the sections of your homepage. Each one has a default photo, so nothing ever looks empty." />
              <div className="space-y-10">
                {PHOTO_GROUPS.map((g) => {
                  const slots = PHOTO_SLOTS.filter(g.match);
                  if (!slots.length) return null;
                  return (
                    <section key={g.title} aria-label={g.title}>
                      <div className="mb-3">
                        <h2 className="text-[18px] font-semibold">{g.title}</h2>
                        <p className="text-[14px]" style={{ color: MUTED }}>{g.hint}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 items-start">{slots.map((s) => renderSlot(s))}</div>
                    </section>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Products ─────────────────────────────────────────────── */}
          {tab === "products" && (
            <>
              <SectionHeader title="Products" description="Add a product by choosing its category, typing a name and adding its photo. It appears on your Products page straight away." />

              <Panel className="p-5 sm:p-6">
                <h2 className="text-[17px] font-semibold">Add a product</h2>

                <div className="mt-5 space-y-6">
                  <fieldset>
                    <legend className="flex items-center gap-2.5 text-[14px] font-semibold">
                      <span className="w-6 h-6 rounded-full bg-[#6B4C2A] text-white text-[12px] flex items-center justify-center">1</span> Choose a category
                    </legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {PRODUCT_CATEGORIES.map((c) => {
                        const on = selectedCategory === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setSelectedCategory(c.id as ProductCategory)}
                            className={`inline-flex items-center gap-2 h-11 px-4 rounded-full border text-[14px] font-medium transition-colors ${on ? "bg-[#6B4C2A] text-white border-[#6B4C2A] shadow-sm" : "bg-white text-[#1A1410] border-black/20 hover:border-[#6B4C2A] hover:bg-[#FBF9F4]"}`}
                          >
                            <span aria-hidden>{c.icon}</span> {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="product-name" className="flex items-center gap-2.5 text-[14px] font-semibold">
                      <span className="w-6 h-6 rounded-full bg-[#6B4C2A] text-white text-[12px] flex items-center justify-center">2</span> Product name <span className="font-normal" style={{ color: MUTED }}>(optional)</span>
                    </label>
                    <input
                      id="product-name"
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. Vintage Buffalo Leather Journal, A5"
                      className="mt-3 w-full h-12 px-4 rounded-xl border border-black/20 bg-white text-[15px] placeholder:text-[#8A8076] focus:outline-none focus:border-[#6B4C2A] focus:ring-2 focus:ring-[#6B4C2A]/20"
                    />
                    <p className="mt-2 text-[13px]" style={{ color: MUTED }}>This name is shown on the product card and in enquiry emails. If you add several photos at once, they all get this name.</p>
                  </div>

                  <div>
                    <p className="flex items-center gap-2.5 text-[14px] font-semibold mb-3">
                      <span className="w-6 h-6 rounded-full bg-[#6B4C2A] text-white text-[12px] flex items-center justify-center">3</span> Add the photo
                    </p>
                    <DropZone
                      title={`Add photos to ${catLabelOf(selectedCategory)}`}
                      hint="Click here or drag photos in. JPG, PNG or WebP, up to 5 MB each. You can choose many at once."
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      busy={!!productProgress}
                      progress={productProgress ?? undefined}
                      onFiles={(f) => void handleProductUpload(f)}
                    />
                  </div>
                </div>
              </Panel>

              <div className="mt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="text-[18px] font-semibold">Your products <span className="font-normal tabular-nums" style={{ color: MUTED }}>({filteredProducts.length}{filteredProducts.length !== productImages.length ? ` of ${productImages.length}` : ""})</span></h2>
                  <label className="relative block sm:w-72">
                    <span className="sr-only">Search products</span>
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: MUTED }} aria-hidden />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by name"
                      className="w-full h-11 pl-10 pr-3 rounded-xl border border-black/20 bg-white text-[14px] placeholder:text-[#8A8076] focus:outline-none focus:border-[#6B4C2A] focus:ring-2 focus:ring-[#6B4C2A]/20"
                    />
                  </label>
                </div>

                <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1" role="group" aria-label="Filter products by category">
                  {[{ id: "all", label: "All", icon: "" }, ...PRODUCT_CATEGORIES].map((c) => {
                    const on = listFilter === c.id;
                    const n = c.id === "all" ? productImages.length : productImages.filter((p) => p.category === c.id).length;
                    return (
                      <button
                        key={c.id}
                        aria-pressed={on}
                        onClick={() => setListFilter(c.id)}
                        className={`shrink-0 inline-flex items-center gap-2 h-10 pl-4 pr-2.5 rounded-full border text-[13px] font-medium whitespace-nowrap transition-colors ${on ? "bg-[#6B4C2A] text-white border-[#6B4C2A]" : "bg-white text-[#1A1410] border-black/20 hover:border-[#6B4C2A]"}`}
                      >
                        {c.label}
                        <span className={`min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] inline-flex items-center justify-center tabular-nums ${on ? "bg-white/20" : "bg-black/[0.06] text-[#4A3219]"}`}>{n}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5">
                  {productLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/5] rounded-2xl bg-black/[0.06] animate-pulse" />)}
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <EmptyState
                      title={productImages.length === 0 ? "No products yet" : "Nothing matches"}
                      text={productImages.length === 0 ? "Add your first product above — it takes about a minute." : "Try a different category or clear the search box."}
                    >
                      {search && <GhostButton onClick={() => setSearch("")}>Clear search</GhostButton>}
                    </EmptyState>
                  ) : (
                    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredProducts.map((p) => (
                        <li key={p.id}>
                          <Panel className="overflow-hidden h-full flex flex-col">
                            <div className="relative aspect-square bg-[#EFEBE3]">
                              <img src={p.url} alt={p.product_name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                              <button
                                onClick={() => askDeleteProduct(p)}
                                aria-label={`Remove ${p.product_name || "product"}`}
                                className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white text-[#B42318] shadow-md flex items-center justify-center hover:bg-[#FEF3F2]"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div className="p-3">
                              <p className="text-[14px] font-medium leading-snug line-clamp-2">{p.product_name || "Untitled"}</p>
                              <p className="mt-1 text-[12px]" style={{ color: MUTED }}>{catLabelOf(p.category)}</p>
                            </div>
                          </Panel>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── Gallery ──────────────────────────────────────────────── */}
          {tab === "gallery" && (
            <>
              <SectionHeader title="Gallery" description="Photos and short videos shown on your Gallery page. Add as many as you like." />
              <DropZone
                title="Add photos or videos"
                hint="Click here or drag files in. Photos: JPG, PNG or WebP up to 5 MB. Videos: MP4 or WebM up to 10 MB."
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                multiple
                busy={!!galleryProgress}
                progress={galleryProgress ?? undefined}
                onFiles={(f) => void handleGalleryUpload(f)}
              />

              <h2 className="mt-8 mb-4 text-[18px] font-semibold">In your gallery <span className="font-normal tabular-nums" style={{ color: MUTED }}>({galleryImages.length})</span></h2>
              {galleryLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => <div key={i} className="aspect-square rounded-2xl bg-black/[0.06] animate-pulse" />)}
                </div>
              ) : galleryImages.length === 0 ? (
                <EmptyState title="Your gallery is empty" text="Add a few photos above and they will appear on the Gallery page." />
              ) : (
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages.map((img) => {
                    const video = isVideoUrl(img.url);
                    return (
                      <li key={img.id}>
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#EFEBE3] border border-black/10">
                          {video ? <video src={img.url} muted playsInline preload="metadata" className="w-full h-full object-cover" /> : <img src={img.url} alt="Gallery item" loading="lazy" decoding="async" className="w-full h-full object-cover" />}
                          {video && (
                            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-[#1A1410]/80 text-white text-[11px] font-medium px-2.5 py-1"><Play size={11} fill="currentColor" /> Video</span>
                          )}
                          <button
                            onClick={() => askDeleteGallery(img)}
                            aria-label={video ? "Remove this video" : "Remove this photo"}
                            className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white text-[#B42318] shadow-md flex items-center justify-center hover:bg-[#FEF3F2]"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      {/* Photo preview */}
      {previewSlot && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 sm:p-8 bg-[#1A1410]/80" onClick={() => setPreviewSlot(null)} role="dialog" aria-modal="true" aria-label={`Preview: ${previewSlot.label}`}>
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreviewSlot(null)} aria-label="Close preview" className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-white text-[#1A1410] shadow-lg flex items-center justify-center"><X size={18} /></button>
            <img src={getImageForSection(previewSlot.section)?.url ?? previewSlot.defaultUrl} alt={previewSlot.label} className="w-full max-h-[78vh] object-contain rounded-2xl bg-[#EFEBE3]" />
            <p className="mt-3 text-center text-[14px] text-white/90">{previewSlot.label}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sign in ────────────────────────────────────────────────────────────────────
function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("ins_admin", "true");
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div data-admin data-lenis-prevent className="fixed inset-0 z-[90] overflow-y-auto bg-[#F6F4EF] flex items-center justify-center px-4 py-10" style={{ fontFamily: "var(--font-body)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-[#1A1410]" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 30, letterSpacing: "0.02em" }}>INS Overseas</p>
          <p className="mt-1.5 text-[12px] uppercase" style={{ color: MUTED, letterSpacing: "0.18em" }}>Website manager</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl border border-black/10 shadow-[0_20px_50px_-24px_rgba(26,20,16,0.35)] p-6 sm:p-7">
          <span className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "#F3EEE2", color: "#6B4C2A" }}><ShieldCheck size={22} /></span>
          <h1 className="text-[#1A1410]" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, lineHeight: 1.1 }}>Welcome back</h1>
          <p className="mt-1.5 text-[14px]" style={{ color: MUTED }}>Enter your password to update your website's photos and products.</p>

          <label htmlFor="admin-password" className="block mt-6 text-[13px] font-medium text-[#1A1410]">Password</label>
          <div className="relative mt-2">
            <input
              id="admin-password"
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(false); }}
              autoFocus
              autoComplete="current-password"
              aria-invalid={error}
              aria-describedby={error ? "pw-error" : undefined}
              className={`w-full h-12 pl-4 pr-12 rounded-xl border bg-white text-[15px] focus:outline-none focus:ring-2 ${error ? "border-[#B42318] focus:ring-[#B42318]/20" : "border-black/20 focus:border-[#6B4C2A] focus:ring-[#6B4C2A]/20"}`}
            />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center hover:bg-black/5" style={{ color: MUTED }}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <p id="pw-error" role="alert" className="mt-2 text-[13px] text-[#B42318]">That password isn't right. Please try again.</p>}

          <PrimaryButton type="submit" className="w-full mt-5 h-12">Sign in</PrimaryButton>
        </form>
      </div>
    </div>
  );
}
