import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Copy, Download, Gauge, GripVertical, Hash, ImagePlus, ListChecks, Pencil, Search, Star, Trash2, X, ArrowUpDown } from "lucide-react";
import { PRODUCT_TAGS, tagLabel, type ProductImage } from "@/hooks/useProductImages";
import { adminCategoryLabel, useCategories } from "@/hooks/useCategories";
import { assignCodes, buildSetupSql, deleteProducts, probeExtraColumns, removePhotoFiles, saveProductDetails, saveProductTerms, updateRows, uploadProductPhoto } from "@/lib/adminData";
import { useProductTerms } from "@/hooks/useProductTerms";
import { useProductDetails } from "@/hooks/useProductDetails";
import { DETAIL_LIMITS, type ProductDetails, type ProductPhoto } from "@/data/productDetails";
import { planCodes } from "@/lib/productCodes";
import { buildProductsCsv, downloadCsv, type CsvProduct } from "@/lib/exportCsv";
import { productPageUrl } from "@/lib/productUrl";
import PhotoOptimizer from "@/components/admin/PhotoOptimizer";
import { DEFAULT_LEAD_DAYS, moqNumber, productLead, productMoq } from "@/data/catalogue";
import { useDragReorder, useSavedOrder } from "@/components/admin/reorder";
import { EmptyState, GhostButton, MUTED, Panel, PrimaryButton, type Confirm } from "@/components/admin/AdminUI";

const HOME_SLOTS = 6; // how many featured products the homepage "Fresh From The Workshop" section can show
const catLabelOf = adminCategoryLabel;
const field = "w-full rounded-xl border border-black/20 bg-white text-[15px] placeholder:text-[#8A8076] focus:outline-none focus:border-[#6B4C2A] focus:ring-2 focus:ring-[#6B4C2A]/20";

type Mode = "browse" | "select" | "arrange";
type Extras = "unknown" | "ok" | "missing";

type Props = {
  products: ProductImage[];
  loading: boolean;
  refetch: () => Promise<unknown>;
  showToast: (type: "success" | "error", msg: string) => void;
  setConfirm: (c: Confirm) => void;
  adminEmail: string;
};

export default function ProductManager({ products, loading, refetch, showToast, setConfirm, adminEmail }: Props) {
  const { all: allCats } = useCategories();
  const { terms, refetch: refetchTerms } = useProductTerms();
  const { details, refetch: refetchDetails } = useProductDetails();
  const [listFilter, setListFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<Mode>("browse");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<ProductImage | null>(null);
  const [extras, setExtras] = useState<Extras>("unknown");
  const [showSetup, setShowSetup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  // Is the one-time Supabase setup (tag / featured columns) done?
  const checkExtras = async () => setExtras((await probeExtraColumns()) ? "ok" : "missing");
  useEffect(() => { void checkExtras(); }, []);

  // ── Order: shown instantly, saved to Supabase a moment later ───────────────────────────────
  const { order, moveTo, saveState } = useSavedOrder(products, refetch, (permission) => {
    showToast("error", permission ? "Supabase isn't allowing changes yet. Open “One-time setup” below and run the SQL once." : "Some of the new order couldn't be saved. Please try again.");
    if (permission) setShowSetup(true);
  });
  const { dragId, overId, itemProps } = useDragReorder(moveTo);

  // ── What is shown ─────────────────────────────────────────────────────────────
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const ordered = useMemo(() => {
    const known = order.map((id) => byId.get(id)).filter((p): p is ProductImage => !!p);
    const seen = new Set(order);
    return [...known, ...products.filter((p) => !seen.has(p.id))];
  }, [order, byId, products]);

  const featuredCount = products.filter((p) => p.featured).length;
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ordered.filter((p) => {
      const inList = listFilter === "all" ? true : listFilter === "featured" ? !!p.featured : p.category === listFilter;
      return inList && (!q || (p.product_name || "").toLowerCase().includes(q) || (details.get(p.id)?.code ?? "").toLowerCase().includes(q));
    });
  }, [ordered, listFilter, search, details]);

  // pieces that share a name (buyers cannot tell them apart without a code), and the pieces that still have no code
  const nameCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of products) { const k = (p.product_name || "").trim().toLowerCase(); m.set(k, (m.get(k) ?? 0) + 1); }
    return m;
  }, [products]);
  const missingCodes = ordered.filter((p) => !details.get(p.id)?.code).length;
  const bare = (d?: ProductDetails): Omit<ProductDetails, "rowId"> => { if (!d) return { photos: [] }; const { rowId: _rowId, ...rest } = d; return rest; };

  const switchMode = (m: Mode) => { setMode((cur) => (cur === m ? "browse" : m)); setSelected(new Set()); };
  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectedItems = ordered.filter((p) => selected.has(p.id));

  // ── Changes ───────────────────────────────────────────────────────────────────
  const explain = (r: Exclude<Awaited<ReturnType<typeof updateRows>>, { ok: true }>) => {
    if (r.kind === "permission" || r.kind === "columns") {
      showToast("error", r.kind === "columns" ? "Tags and homepage featuring need a one-time Supabase setup. Open “One-time setup” and run the SQL." : "Supabase isn't allowing changes yet. Open “One-time setup” and run the SQL once.");
      setShowSetup(true);
      if (r.kind === "columns") setExtras("missing");
    } else {
      showToast("error", `That change couldn't be saved: ${r.message}`);
    }
  };

  const bulk = async (patch: Record<string, unknown>, done: string) => {
    if (!selectedItems.length) return;
    setBusy(true);
    const r = await updateRows(selectedItems.map((p) => p.id), patch);
    if (r.ok) { await refetch(); showToast("success", done); setSelected(new Set()); } else explain(r);
    setBusy(false);
  };

  const askDelete = (items: ProductImage[]) =>
    setConfirm({
      title: items.length > 1 ? `Remove ${items.length} products?` : "Remove this product?",
      message: items.length > 1 ? "They will disappear from the Products page. This can't be undone." : `“${items[0].product_name || "This product"}” will disappear from the Products page. This can't be undone.`,
      confirmLabel: "Remove",
      onConfirm: () => {
        void (async () => {
          setBusy(true);
          const { error } = await deleteProducts(items);
          await Promise.all([refetch(), refetchDetails()]);
          setBusy(false);
          if (error) showToast("error", `Couldn't remove: ${error.message}`);
          else { showToast("success", items.length > 1 ? `${items.length} products removed.` : "Product removed."); setSelected(new Set()); setEditing(null); }
        })();
      },
    });

  const featuredOverflow = featuredCount > HOME_SLOTS;

  const askAssignCodes = () =>
    setConfirm({
      title: `Give item codes to ${missingCodes} product${missingCodes === 1 ? "" : "s"}?`,
      message: "Each gets a code like LJ-001, numbered in the order shown here (LJ for leather journals, LB for leather bags, and so on). Codes you have already set are kept, and you can change any code afterwards.",
      confirmLabel: "Give codes",
      onConfirm: () => {
        void (async () => {
          setBusy(true);
          const plan = planCodes(ordered, (id) => details.get(id)?.code ?? "", (c) => catLabelOf(c));
          const r = await assignCodes([...plan].map(([productId, code]) => ({ productId, rowId: details.get(productId)?.rowId, code, current: bare(details.get(productId)) })));
          await refetchDetails();
          setBusy(false);
          if (r.ok) showToast("success", `${plan.size} item code${plan.size === 1 ? "" : "s"} added.`);
          else explain(r);
        })();
      },
    });

  const exportCsv = () => {
    const rows: CsvProduct[] = ordered.map((p) => {
      const d = details.get(p.id);
      const name = p.product_name || "Handmade Product";
      const desc = p.alt_text && p.alt_text.trim().toLowerCase() !== name.trim().toLowerCase() ? p.alt_text : "";
      return {
        code: d?.code ?? "", name, category: catLabelOf(p.category), description: desc,
        moq: productMoq(p.id, p.category), lead: productLead(p.id),
        size: d?.size ?? "", material: d?.material ?? "", colours: d?.colours ?? "", custom: d?.custom ?? "",
        label: tagLabel(p.tag) ?? "", onHomepage: !!p.featured, photo: p.url, morePhotos: (d?.photos ?? []).map((x) => x.url),
        page: productPageUrl(p.id, name, d?.code), id: p.id,
      };
    });
    const n = new Date();
    const ymd = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
    downloadCsv(buildProductsCsv(rows), `INS-Overseas-products-${ymd}.csv`);
    showToast("success", `Exported ${rows.length} product${rows.length === 1 ? "" : "s"} to a spreadsheet file.`);
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-[18px] font-semibold">Your products <span className="font-normal tabular-nums" style={{ color: MUTED }}>({filtered.length}{filtered.length !== products.length ? ` of ${products.length}` : ""})</span></h2>
        <label className="relative block sm:w-72">
          <span className="sr-only">Search products</span>
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: MUTED }} aria-hidden />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name" className={`${field} h-11 pl-10 pr-3 text-[14px]`} />
        </label>
      </div>

      {/* Setup banner: tags + featuring need two optional database changes */}
      {(extras === "missing" || showSetup) && (
        <SetupPanel
          sql={buildSetupSql(adminEmail)}
          missing={extras === "missing"}
          onRecheck={async () => { await checkExtras(); showToast("success", "Checked."); }}
          onClose={() => setShowSetup(false)}
          showToast={showToast}
        />
      )}

      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1" role="group" aria-label="Filter products by category">
        {[{ id: "all", label: "All" }, ...(extras === "ok" ? [{ id: "featured", label: "★ On homepage" }] : []), ...allCats].map((c) => {
          const on = listFilter === c.id;
          const n = c.id === "all" ? products.length : c.id === "featured" ? featuredCount : products.filter((p) => p.category === c.id).length;
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

      {/* Mode switches */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-pressed={mode === "select"}
          onClick={() => switchMode("select")}
          className={`inline-flex items-center gap-2 h-10 px-4 rounded-xl border text-[14px] font-medium transition-colors ${mode === "select" ? "bg-[#1A1410] text-white border-[#1A1410]" : "bg-white border-black/20 hover:border-[#6B4C2A]"}`}
        >
          <ListChecks size={16} /> Select several
        </button>
        <button
          type="button"
          aria-pressed={mode === "arrange"}
          onClick={() => switchMode("arrange")}
          className={`inline-flex items-center gap-2 h-10 px-4 rounded-xl border text-[14px] font-medium transition-colors ${mode === "arrange" ? "bg-[#1A1410] text-white border-[#1A1410]" : "bg-white border-black/20 hover:border-[#6B4C2A]"}`}
        >
          <ArrowUpDown size={16} /> Arrange order
        </button>
        {missingCodes > 0 && !loading && (
          <button type="button" disabled={busy} onClick={askAssignCodes} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border text-[14px] font-medium bg-white border-black/20 hover:border-[#6B4C2A] disabled:opacity-60 transition-colors">
            <Hash size={16} /> Give item codes <span className="tabular-nums" style={{ color: MUTED }}>({missingCodes})</span>
          </button>
        )}
        <button type="button" onClick={exportCsv} disabled={products.length === 0} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border text-[14px] font-medium bg-white border-black/20 hover:border-[#6B4C2A] disabled:opacity-60 transition-colors">
          <Download size={16} /> Export CSV
        </button>
        <button type="button" onClick={() => setOptimizing(true)} disabled={products.length === 0} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border text-[14px] font-medium bg-white border-black/20 hover:border-[#6B4C2A] disabled:opacity-60 transition-colors">
          <Gauge size={16} /> Make photos lighter
        </button>
        {mode === "select" && filtered.length > 0 && (
          <button type="button" onClick={() => setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map((p) => p.id)))} className="h-10 px-3 text-[14px] font-medium underline underline-offset-4" style={{ color: "#4A3219" }}>
            {selected.size === filtered.length ? "Clear selection" : `Select all ${filtered.length} shown`}
          </button>
        )}
        {extras === "ok" && (
          <span className={`ml-auto text-[13px] tabular-nums ${featuredOverflow ? "text-[#B42318] font-medium" : ""}`} style={featuredOverflow ? undefined : { color: MUTED }}>
            Homepage: {Math.min(featuredCount, HOME_SLOTS)} of {HOME_SLOTS} featured{featuredOverflow ? ` · only the first ${HOME_SLOTS} are shown` : ""}
          </span>
        )}
      </div>

      {mode === "arrange" && (
        <p className="mt-3 rounded-xl bg-[#FBF3E1] border border-[#C9973A]/40 px-4 py-3 text-[14px] leading-relaxed" style={{ color: "#4A3219" }} role="status">
          Drag a card to a new place, or use the ◀ ▶ buttons. This is the order visitors see on the Products page.{" "}
          <span className="font-medium">
            {saveState === "saving" ? "Saving…" : saveState === "saved" ? "✓ Saved" : saveState === "error" ? "Not saved — try again" : ""}
          </span>
        </p>
      )}

      <div className={`mt-5 ${mode === "select" && selected.size > 0 ? "pb-28" : ""}`}>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/5] rounded-2xl bg-black/[0.06] animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={products.length === 0 ? "No products yet" : "Nothing matches"}
            text={products.length === 0 ? "Add your first product above — it takes about a minute." : "Try a different category or clear the search box."}
          >
            {search && <GhostButton onClick={() => setSearch("")}>Clear search</GhostButton>}
          </EmptyState>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p, i) => {
              const isSel = selected.has(p.id);
              const tag = tagLabel(p.tag);
              const dragging = dragId === p.id;
              const over = overId === p.id;
              return (
                <li key={p.id} data-product-card {...(mode === "arrange" ? itemProps(p.id) : {})} className={`transition-opacity ${dragging ? "opacity-40" : ""}`}>
                  <Panel className={`overflow-hidden h-full flex flex-col transition-shadow ${isSel ? "ring-2 ring-[#6B4C2A]" : ""} ${over ? "ring-2 ring-[#C9973A]" : ""}`}>
                    <div className="relative aspect-square bg-[#EFEBE3]">
                      <img src={p.url} alt={p.product_name} loading="lazy" decoding="async" draggable={false} className="w-full h-full object-cover" />

                      {/* tag + homepage star */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        {tag && <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${p.tag === "best" ? "bg-[#C9973A] text-[#1A1410]" : "bg-[#1A1410] text-white"}`}>{tag}</span>}
                        {p.featured && <span title="Shown on the homepage" className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center"><Star size={13} className="text-[#C9973A]" fill="currentColor" /></span>}
                      </div>

                      {mode === "browse" && (
                        <>
                          <button
                            onClick={() => setEditing(p)}
                            aria-label={`Edit ${p.product_name || "product"}`}
                            className="absolute top-2 right-12 w-9 h-9 rounded-full bg-white text-[#1A1410] shadow-md flex items-center justify-center hover:bg-[#F6F4EF]"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => askDelete([p])}
                            aria-label={`Remove ${p.product_name || "product"}`}
                            className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white text-[#B42318] shadow-md flex items-center justify-center hover:bg-[#FEF3F2]"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}

                      {mode === "select" && (
                        <button
                          type="button"
                          onClick={() => toggle(p.id)}
                          aria-pressed={isSel}
                          aria-label={`${isSel ? "Deselect" : "Select"} ${p.product_name || "product"}`}
                          className={`absolute inset-0 flex items-start justify-end p-2 ${isSel ? "bg-[#6B4C2A]/15" : ""}`}
                        >
                          <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${isSel ? "bg-[#6B4C2A] border-[#6B4C2A] text-white" : "bg-white/90 border-black/30"}`}>
                            {isSel && <Check size={15} strokeWidth={3} />}
                          </span>
                        </button>
                      )}

                      {mode === "arrange" && (
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-2 bg-black/45">
                          <button
                            onClick={() => filtered[i - 1] && moveTo(p.id, filtered[i - 1].id)}
                            disabled={i === 0}
                            aria-label={`Move ${p.product_name || "product"} earlier`}
                            className="w-9 h-9 rounded-full bg-white text-[#1A1410] shadow flex items-center justify-center disabled:opacity-30"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 text-[#1A1410] text-[12px] font-medium px-2.5 h-7 cursor-grab"><GripVertical size={14} /> Drag</span>
                          <button
                            onClick={() => filtered[i + 1] && moveTo(p.id, filtered[i + 1].id)}
                            disabled={i === filtered.length - 1}
                            aria-label={`Move ${p.product_name || "product"} later`}
                            className="w-9 h-9 rounded-full bg-white text-[#1A1410] shadow flex items-center justify-center disabled:opacity-30"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-[14px] font-medium leading-snug line-clamp-2">{p.product_name || "Untitled"}</p>
                      <p className="mt-1 text-[12px]" style={{ color: MUTED }}>{catLabelOf(p.category)}</p>
                      {details.get(p.id)?.code ? (
                        <p className="mt-1 text-[11.5px] font-semibold tabular-nums tracking-wide" style={{ color: "#4A3219" }}>{details.get(p.id)!.code}</p>
                      ) : (nameCount.get((p.product_name || "").trim().toLowerCase()) ?? 0) > 1 ? (
                        <p className="mt-1 text-[11.5px] font-medium text-[#B54708]">Same name as another product</p>
                      ) : null}
                      {(terms.get(p.id)?.moq || terms.get(p.id)?.lead) && (
                        <p className="mt-1 text-[11.5px] font-medium tabular-nums" style={{ color: "#6B4C2A" }}>
                          {[terms.get(p.id)?.moq ? `Min. ${terms.get(p.id)!.moq} pcs` : "", terms.get(p.id)?.lead ? `${terms.get(p.id)!.lead} days` : ""].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  </Panel>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Bulk action bar */}
      {mode === "select" && selected.size > 0 && (
        <div role="toolbar" aria-label="Actions for the selected products" className="fixed bottom-4 inset-x-3 mx-auto max-w-3xl z-40 rounded-2xl bg-[#1A1410] text-white shadow-2xl p-3 flex flex-wrap items-center gap-2">
          <span className="px-2 text-[14px] font-medium tabular-nums">{selected.size} selected</span>
          <select
            aria-label="Move selected products to a category"
            disabled={busy}
            value=""
            onChange={(e) => { const c = e.target.value; if (c) void bulk({ category: c }, `Moved ${selected.size} to ${catLabelOf(c)}.`); }}
            className="h-10 rounded-xl bg-white text-[#1A1410] text-[14px] px-3 disabled:opacity-60"
          >
            <option value="">Move to category…</option>
            {allCats.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          {extras === "ok" && (
            <>
              <select
                aria-label="Set a tag on the selected products"
                disabled={busy}
                value=""
                onChange={(e) => { const t = e.target.value; if (t) void bulk({ tag: t === "none" ? null : t }, t === "none" ? "Tag removed." : `Tagged ${selected.size} as “${tagLabel(t)}”.`); }}
                className="h-10 rounded-xl bg-white text-[#1A1410] text-[14px] px-3 disabled:opacity-60"
              >
                <option value="">Set tag…</option>
                {PRODUCT_TAGS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                <option value="none">No tag</option>
              </select>
              <button disabled={busy} onClick={() => void bulk({ featured: true }, `${selected.size} added to the homepage.`)} className="h-10 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[14px] font-medium disabled:opacity-60">★ Put on homepage</button>
              <button disabled={busy} onClick={() => void bulk({ featured: false }, `${selected.size} removed from the homepage.`)} className="h-10 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[14px] font-medium disabled:opacity-60">Take off homepage</button>
            </>
          )}
          <button disabled={busy} onClick={() => askDelete(selectedItems)} className="h-10 px-3.5 rounded-xl bg-[#B42318] hover:bg-[#8F1C12] text-[14px] font-medium disabled:opacity-60 inline-flex items-center gap-1.5"><Trash2 size={15} /> Remove</button>
          <button onClick={() => setSelected(new Set())} aria-label="Clear selection" className="ml-auto w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center"><X size={18} /></button>
        </div>
      )}

      {optimizing && (
        <PhotoOptimizer
          photos={ordered.filter((p) => p.url && p.storage_path).map((p) => ({ id: p.id, url: p.url, storage_path: p.storage_path, name: p.product_name || "Product" }))}
          onClose={() => setOptimizing(false)}
          showToast={showToast}
        />
      )}

      {editing && (
        <EditDialog
          product={editing}
          terms={terms.get(editing.id)}
          details={details.get(editing.id)}
          otherNames={new Set(products.filter((p) => p.id !== editing.id).map((p) => (p.product_name || "").trim().toLowerCase()))}
          otherCodes={new Set(products.filter((p) => p.id !== editing.id).map((p) => (details.get(p.id)?.code ?? "").toLowerCase()).filter(Boolean))}
          extras={extras}
          onClose={() => setEditing(null)}
          onDelete={() => askDelete([editing])}
          onOpenSetup={() => { setEditing(null); setShowSetup(true); }}
          onSave={async (patch, own, extra) => {
            const r = await updateRows([editing.id], patch);
            if (!r.ok) { explain(r); return; }
            const t = await saveProductTerms(editing.id, terms.get(editing.id)?.rowId, own.moq, own.lead);
            const dr = await saveProductDetails(editing.id, details.get(editing.id)?.rowId, extra.details);
            await Promise.all([refetch(), refetchTerms(), refetchDetails()]);
            if (dr.ok) await removePhotoFiles(extra.removedPaths); // photos taken off the product are deleted from storage
            if (!t.ok) { showToast("error", `The product was saved, but its own minimum order / lead time couldn't be: ${t.message}`); return; }
            if (!dr.ok) { showToast("error", `The product was saved, but its details couldn't be: ${dr.message}`); return; }
            showToast("success", "Saved. The website is updated.");
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

// ── Edit one product ─────────────────────────────────────────────────────────────
function EditDialog({ product, terms, details, otherNames, otherCodes, extras, onClose, onSave, onDelete, onOpenSetup }: {
  product: ProductImage;
  terms?: { rowId: string; moq?: number; lead?: number };
  details?: ProductDetails;
  otherNames: Set<string>;
  otherCodes: Set<string>;
  extras: Extras;
  onClose: () => void;
  onSave: (patch: Record<string, unknown>, own: { moq: number | null; lead: number | null }, extra: { details: Omit<ProductDetails, "rowId">; removedPaths: string[] }) => Promise<void>;
  onDelete: () => void;
  onOpenSetup: () => void;
}) {
  const { all: allCats } = useCategories();
  const [name, setName] = useState(product.product_name || "");
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(
    product.alt_text && product.alt_text.trim().toLowerCase() !== (product.product_name || "").trim().toLowerCase() ? product.alt_text : "",
  );
  const [tag, setTag] = useState<string>(product.tag || "");
  const [featured, setFeatured] = useState(!!product.featured);
  const [moq, setMoq] = useState(terms?.moq ? String(terms.moq) : "");
  const [lead, setLead] = useState(terms?.lead ? String(terms.lead) : "");
  const [termsError, setTermsError] = useState("");
  const [code, setCode] = useState(details?.code ?? "");
  const [size, setSize] = useState(details?.size ?? "");
  const [material, setMaterial] = useState(details?.material ?? "");
  const [colours, setColours] = useState(details?.colours ?? "");
  const [custom, setCustom] = useState(details?.custom ?? "");
  const [photos, setPhotos] = useState<ProductPhoto[]>(details?.photos ?? []);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [saving, setSaving] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const uploaded = useRef(new Set<string>()); // files uploaded in this dialog and not saved yet
  const removedOld = useRef(new Set<string>()); // saved photos taken off, deleted from storage once the save goes through

  // closing without saving throws away the photos uploaded meanwhile (they would otherwise sit unused in storage)
  const close = () => { void removePhotoFiles([...uploaded.current]); onClose(); };
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    nameRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeRef.current(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const addPhotos = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setPhotoError(""); setUploading(true);
    let room = DETAIL_LIMITS.photos - photos.length;
    const problems: string[] = [];
    for (const file of Array.from(files)) {
      if (room <= 0) { problems.push(`${file.name}: only ${DETAIL_LIMITS.photos} extra photos fit`); continue; }
      try {
        const p = await uploadProductPhoto(file, product.id);
        uploaded.current.add(p.path);
        setPhotos((cur) => [...cur, p]);
        room--;
      } catch (e) { problems.push(`${file.name}: ${e instanceof Error ? e.message : "the upload failed"}`); }
    }
    if (problems.length) setPhotoError(problems.join(" · "));
    setUploading(false);
  };
  const removePhoto = (p: ProductPhoto) => {
    setPhotos((cur) => cur.filter((x) => x.path !== p.path || x.url !== p.url));
    if (uploaded.current.has(p.path)) { uploaded.current.delete(p.path); void removePhotoFiles([p.path]); } else if (p.path) removedOld.current.add(p.path);
  };

  const submit = async () => {
    const m = moq.trim() ? Number(moq) : null, l = lead.trim() ? Number(lead) : null;
    if ((m !== null && (!Number.isInteger(m) || m < 1 || m > 100000)) || (l !== null && (!Number.isInteger(l) || l < 1 || l > 365))) {
      setTermsError("Minimum order must be a whole number (1 to 100000) and lead time whole days (1 to 365). Leave a box empty to use the category's default.");
      return;
    }
    setTermsError("");
    const cleanCode = code.replace(/\s+/g, " ").trim();
    if (cleanCode && otherCodes.has(cleanCode.toLowerCase())) { setCodeError("Another product already uses this code. Each piece needs its own."); return; }
    setCodeError("");
    setSaving(true);
    const finalName = name.trim() || catLabelOf(category);
    const patch: Record<string, unknown> = { product_name: finalName, label: finalName, category, alt_text: description.trim() || finalName };
    if (extras === "ok") { patch.tag = tag || null; patch.featured = featured; }
    await onSave(patch, { moq: m, lead: l }, { details: { code: cleanCode || undefined, size: size.trim() || undefined, material: material.trim() || undefined, colours: colours.trim() || undefined, custom: custom.trim() || undefined, photos }, removedPaths: [...removedOld.current] });
    uploaded.current.clear(); // saved: they belong to the product now
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-[#1A1410]/50 p-0 sm:p-4" onClick={close}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-title"
        onSubmit={(e) => { e.preventDefault(); void submit(); }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <img src={product.url} alt="" className="w-20 h-20 rounded-xl object-cover bg-[#EFEBE3] shrink-0" />
          <div className="min-w-0 flex-1">
            <h2 id="edit-title" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24 }}>Edit product</h2>
            <p className="mt-1 text-[13px]" style={{ color: MUTED }}>Changes appear on your website right after you save.</p>
          </div>
          <button type="button" onClick={close} aria-label="Close" className="w-10 h-10 rounded-full hover:bg-black/[0.05] flex items-center justify-center shrink-0"><X size={18} /></button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="edit-name" className="text-[14px] font-semibold">Product name</label>
            <input id="edit-name" ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} className={`${field} mt-2 h-12 px-4`} placeholder="e.g. Vintage Buffalo Leather Journal, A5" />
            {name.trim() && otherNames.has(name.trim().toLowerCase()) && (
              <p className="mt-1.5 text-[13px] font-medium text-[#B54708]">Another product has exactly this name. Give each one an item code below (or a more specific name) so buyers can tell them apart.</p>
            )}
          </div>

          <div>
            <label htmlFor="edit-cat" className="text-[14px] font-semibold">Category</label>
            <select id="edit-cat" value={category} onChange={(e) => setCategory(e.target.value)} className={`${field} mt-2 h-12 px-3`}>
              {allCats.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="edit-desc" className="text-[14px] font-semibold">Short description <span className="font-normal" style={{ color: MUTED }}>(optional)</span></label>
            <textarea id="edit-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={`${field} mt-2 px-4 py-3`} placeholder="e.g. A5 · wrap-around strap · 240 deckle pages" />
          </div>

          <fieldset>
            <legend className="text-[14px] font-semibold">This product's own terms <span className="font-normal" style={{ color: MUTED }}>(optional)</span></legend>
            <p className="mt-1 text-[13px]" style={{ color: MUTED }}>Leave empty to use the category's: minimum order {moqNumber(category)} pcs, lead time {DEFAULT_LEAD_DAYS} days.</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="edit-moq" className="text-[13px] font-medium">Minimum order</label>
                <div className="relative mt-1">
                  <input id="edit-moq" inputMode="numeric" value={moq} onChange={(e) => { setMoq(e.target.value.replace(/[^0-9]/g, "")); setTermsError(""); }} placeholder={moqNumber(category)} className={`${field} h-12 pl-4 pr-12 tabular-nums`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px]" style={{ color: MUTED }}>pcs</span>
                </div>
              </div>
              <div>
                <label htmlFor="edit-lead" className="text-[13px] font-medium">Lead time</label>
                <div className="relative mt-1">
                  <input id="edit-lead" inputMode="numeric" value={lead} onChange={(e) => { setLead(e.target.value.replace(/[^0-9]/g, "")); setTermsError(""); }} placeholder={String(DEFAULT_LEAD_DAYS)} className={`${field} h-12 pl-4 pr-14 tabular-nums`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px]" style={{ color: MUTED }}>days</span>
                </div>
              </div>
            </div>
            {termsError && <p role="alert" className="mt-2 text-[13px] font-medium text-[#B42318]">{termsError}</p>}
          </fieldset>

          <fieldset>
            <legend className="text-[14px] font-semibold">Details for buyers <span className="font-normal" style={{ color: MUTED }}>(optional)</span></legend>
            <p className="mt-1 text-[13px]" style={{ color: MUTED }}>Shown on the product's own page and in the PDF catalogue. The item code is also added to every quote message.</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="edit-code" className="text-[13px] font-medium">Item code</label>
                <input id="edit-code" value={code} maxLength={DETAIL_LIMITS.code} onChange={(e) => { setCode(e.target.value); setCodeError(""); }} placeholder="e.g. LJ-014" className={`${field} mt-1 h-12 px-4`} />
              </div>
              <div>
                <label htmlFor="edit-size" className="text-[13px] font-medium">Size</label>
                <input id="edit-size" value={size} maxLength={DETAIL_LIMITS.size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. A5, 21 x 15 cm" className={`${field} mt-1 h-12 px-4`} />
              </div>
              <div className="col-span-2">
                <label htmlFor="edit-material" className="text-[13px] font-medium">Material</label>
                <input id="edit-material" value={material} maxLength={DETAIL_LIMITS.material} onChange={(e) => setMaterial(e.target.value)} placeholder="e.g. Buffalo leather, 100% cotton rag paper" className={`${field} mt-1 h-12 px-4`} />
              </div>
              <div className="col-span-2">
                <label htmlFor="edit-colours" className="text-[13px] font-medium">Colours</label>
                <input id="edit-colours" value={colours} maxLength={DETAIL_LIMITS.colours} onChange={(e) => setColours(e.target.value)} placeholder="e.g. Brown, black, tan" className={`${field} mt-1 h-12 px-4`} />
              </div>
              <div className="col-span-2">
                <label htmlFor="edit-custom" className="text-[13px] font-medium">Customisation</label>
                <input id="edit-custom" value={custom} maxLength={DETAIL_LIMITS.custom} onChange={(e) => setCustom(e.target.value)} placeholder="e.g. Logo embossing, custom sizes, branded packaging" className={`${field} mt-1 h-12 px-4`} />
              </div>
            </div>
            {codeError && <p role="alert" className="mt-2 text-[13px] font-medium text-[#B42318]">{codeError}</p>}

            <div className="mt-4">
              <p className="text-[13px] font-medium">More photos <span className="font-normal tabular-nums" style={{ color: MUTED }}>({photos.length} of {DETAIL_LIMITS.photos})</span></p>
              <div className="mt-2 flex flex-wrap gap-2">
                {photos.map((p) => (
                  <div key={p.path || p.url} className="relative w-[72px] h-[72px] rounded-xl overflow-hidden bg-[#EFEBE3]">
                    <img src={p.url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removePhoto(p)} aria-label="Remove this photo" className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/95 shadow flex items-center justify-center hover:bg-white"><X size={13} /></button>
                  </div>
                ))}
                {photos.length < DETAIL_LIMITS.photos && (
                  <label className={`w-[72px] h-[72px] rounded-xl border-2 border-dashed border-black/25 flex flex-col items-center justify-center gap-0.5 text-[11.5px] font-medium cursor-pointer hover:border-[#6B4C2A] ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                    <ImagePlus size={18} />
                    {uploading ? "Adding…" : "Add"}
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple aria-label="Add more photos of this product" className="sr-only" onChange={(e) => { void addPhotos(e.target.files); e.target.value = ""; }} />
                  </label>
                )}
              </div>
              {photoError && <p role="alert" className="mt-2 text-[13px] font-medium text-[#B42318]">{photoError}</p>}
            </div>
          </fieldset>

          {extras === "ok" ? (
            <>
              <fieldset>
                <legend className="text-[14px] font-semibold">Label on the product card</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[{ id: "", label: "None" }, ...PRODUCT_TAGS].map((t) => (
                    <button
                      key={t.id || "none"}
                      type="button"
                      aria-pressed={tag === t.id}
                      onClick={() => setTag(t.id)}
                      className={`h-10 px-4 rounded-full border text-[14px] font-medium transition-colors ${tag === t.id ? "bg-[#6B4C2A] text-white border-[#6B4C2A]" : "bg-white border-black/20 hover:border-[#6B4C2A]"}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="flex items-start gap-3 rounded-xl border border-black/15 p-3.5 cursor-pointer hover:bg-[#FBF9F4]">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="mt-0.5 w-5 h-5 accent-[#6B4C2A]" />
                <span>
                  <span className="block text-[14px] font-semibold">Show on the homepage</span>
                  <span className="block text-[13px]" style={{ color: MUTED }}>Appears in its own “Fresh From The Workshop” section on the homepage (up to {HOME_SLOTS} products, in your chosen order).</span>
                </span>
              </label>
            </>
          ) : extras === "missing" ? (
            <p className="rounded-xl bg-[#FBF3E1] border border-[#C9973A]/40 px-4 py-3 text-[13px] leading-relaxed" style={{ color: "#4A3219" }}>
              Labels (Best seller / New) and “Show on the homepage” need a one-time Supabase setup.{" "}
              <button type="button" onClick={onOpenSetup} className="font-semibold underline underline-offset-4">Show the setup steps</button>
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center gap-3">
          <button type="button" onClick={onDelete} className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-[14px] font-medium text-[#B42318] hover:bg-[#B42318]/5"><Trash2 size={15} /> Remove product</button>
          <div className="sm:ml-auto flex gap-3">
            <GhostButton onClick={close} className="flex-1 sm:flex-none">Cancel</GhostButton>
            <PrimaryButton type="submit" busy={saving} className="flex-1 sm:flex-none">Save changes</PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
}

// ── One-time Supabase setup help ─────────────────────────────────────────────────
export function SetupPanel({ sql, missing, onRecheck, onClose, showToast }: { sql: string; missing: boolean; onRecheck: () => void; onClose: () => void; showToast: (t: "success" | "error", m: string) => void }) {
  const copy = async () => {
    try { await navigator.clipboard.writeText(sql); showToast("success", "Copied. Paste it into the Supabase SQL Editor."); }
    catch { showToast("error", "Couldn't copy automatically — select the text and copy it."); }
  };
  return (
    <section className="mt-4 rounded-2xl border border-[#C9973A]/50 bg-[#FBF3E1] p-4 sm:p-5" aria-label="One-time setup">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-semibold" style={{ color: "#3A2A14" }}>One-time database setup {missing ? "needed for labels and homepage featuring" : ""}</h3>
          <ol className="mt-2 list-decimal pl-5 space-y-1 text-[14px] leading-relaxed" style={{ color: "#4A3219" }}>
            <li>Open your project at supabase.com and choose <b>SQL Editor</b>, then <b>New query</b>.</li>
            <li>Press <b>Copy SQL</b> below, paste it in, and press <b>Run</b>. It also makes your database read-only for everyone except you. It is safe to run more than once and doesn't touch your existing products.</li>
            <li>Come back here and press <b>I've run it</b>.</li>
          </ol>
        </div>
        <button type="button" onClick={onClose} aria-label="Hide setup steps" className="w-10 h-10 rounded-full hover:bg-black/[0.06] flex items-center justify-center shrink-0"><X size={16} /></button>
      </div>
      <pre className="mt-3 max-h-48 overflow-auto rounded-xl bg-[#1A1410] text-[#F5EFE0] p-3 text-[12px] leading-relaxed whitespace-pre-wrap">{sql}</pre>
      <div className="mt-3 flex flex-wrap gap-2">
        <PrimaryButton onClick={() => void copy()}><Copy size={15} /> Copy SQL</PrimaryButton>
        <GhostButton onClick={onRecheck}>I've run it</GhostButton>
      </div>
    </section>
  );
}
