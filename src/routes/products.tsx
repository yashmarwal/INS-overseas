import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "@/components/shared/PageHero";
import { useProductImages, tagLabel } from "@/hooks/useProductImages";
import { X, Mail, Maximize2, ArrowUpRight, ChevronLeft, ChevronRight, Check, Plus, Share2 } from "lucide-react";
import ShareSheet from "@/components/ui/ShareSheet";
import { productShareUrl, shortCode } from "@/lib/share";
import { historyKey, savedProductView, saveProductView } from "@/lib/scrollMemory";
import { enquiryId, toggleEnquiry, useInEnquiry } from "@/lib/enquiryList";
import { WhatsAppGlyph } from "@/components/ui/FloatingDock";
import { useIsMobile } from "@/hooks/use-mobile";
import { SITE_URL } from "@/lib/seo";
import { CATEGORY_LABELS, CATEGORY_MOQ } from "@/data/catalogue";

// ── Filter definitions ────────────────────────────────────────────────────────
const filters = [
  { key: "all",                     label: "All"                   },
  { key: "leather-journals",        label: "Leather Journals"      },
  { key: "leather-bags",            label: "Leather Bags"          },
  { key: "handmade-paper-gift-box", label: "Paper Gift Box"        },
  { key: "handmade-paper-gift-bag", label: "Paper Gift Bag"        },
  { key: "handmade-seed-paper",     label: "Seed Paper"            },
  { key: "handmade-deckle-edge-paper", label: "Deckle Edge Paper"      },
  { key: "handblock-print-fabric",     label: "Handblock Print Fabric" },
] as const;


// ── Static fallback products ──────────────────────────────────────────────────
const staticProducts = [
  { id: "s1",  name: "Vintage Buffalo Leather Journal", category: "leather-journals",        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80",  description: "A5 · wrap-around strap · 240 deckle pages" },
  { id: "s2",  name: "Antique Goat Leather Diary",      category: "leather-journals",        image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80",  description: "A6 · brass closure · custom embossing" },
  { id: "s3",  name: "Refillable Leather Notebook",     category: "leather-journals",        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80",  description: "A5 · interchangeable inserts · hand-stitched spine" },
  { id: "s4",  name: "Travel Journal with Pocket",      category: "leather-journals",        image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=900&q=80",  description: "Pocket sized · expandable gusset · brass corner" },
  { id: "s5",  name: "Leather Crossbody Bag",           category: "leather-bags",            image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",  description: "Full-grain · brass buckles · adjustable strap" },
  { id: "s6",  name: "Buffalo Leather Tote",            category: "leather-bags",            image: "https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cb3?auto=format&fit=crop&w=900&q=80",  description: "Oversized · interior pocket · burnished handles" },
  { id: "s7",  name: "Handmade Paper Gift Box",         category: "handmade-paper-gift-box", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80",  description: "Recycled cotton paper · gold foil accent" },
  { id: "s8",  name: "Paper Gift Bags Set (12pc)",      category: "handmade-paper-gift-bag", image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=900&q=80",  description: "Recycled cotton · ribbon handles · assorted" },
  { id: "s9",  name: "Plantable Seed Paper Set",        category: "handmade-seed-paper",     image: "https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?auto=format&fit=crop&w=900&q=80",  description: "Wildflower mix · 20 sheets · biodegradable" },
  { id: "s10", name: "Deckle Edge Notebook (Set of 6)",    category: "handmade-deckle-edge-paper", image: "https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?auto=format&fit=crop&w=900&q=80",  description: "Cotton rag · unlined · A5 · deckle edges" },
  { id: "s11", name: "Deckle Edge Writing Pad",             category: "handmade-deckle-edge-paper", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80",  description: "120 gsm · fountain-pen friendly · A4" },
  { id: "s12", name: "Deckle Edge Loose Sheets (Pack 50)",  category: "handmade-deckle-edge-paper", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",  description: "Ivory cotton rag · A4 · deckle all four edges" },
  { id: "s13", name: "Block-Printed Cotton Fabric",         category: "handblock-print-fabric",     image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",  description: "Hand-blocked · natural dye · 44 inch width" },
  { id: "s14", name: "Indigo Block-Print Table Runner",     category: "handblock-print-fabric",     image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80",  description: "100% cotton · Sanganer motifs · 72 inch" },
  { id: "s15", name: "Floral Block-Print Fabric (Per Metre)",category: "handblock-print-fabric",    image: "https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?auto=format&fit=crop&w=900&q=80",  description: "Rajasthani floral pattern · reactive dye · 45 inch" },
];

type DynamicProduct = {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  isDynamic: boolean;
  tag?: string | null; // "best" | "new" (set in the admin)
};

// ── Route ─────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/products")({
  head: () => {
    const canonical = `${SITE_URL}/products`;
    const title = "Products — Leather Journals, Seed Paper, Gift Boxes | INS Overseas";
    const description =
      "Browse our full range of handmade leather journals, seed paper, paper gift boxes, paper gift bags, leather bags and artisan stationery. Wholesale from Jaipur, India.";

    const itemList = {
      "@type": "ItemList",
      "@id": `${canonical}#catalogue`,
      "name": "INS Overseas Wholesale Product Catalogue",
      "description": description,
      "url": canonical,
      "numberOfItems": 7,
      "itemListElement": filters
        .filter((f) => f.key !== "all")
        .map((f, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": f.label,
          "item": {
            "@type": "Product",
            "name": f.label,
            "brand": { "@type": "Brand", "name": "INS Overseas" },
            "manufacturer": { "@id": `${SITE_URL}/#organization` },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "seller": { "@id": `${SITE_URL}/#organization` },
            },
          },
        })),
    };

    const breadcrumb = {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "Products", "item": canonical },
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: "handmade leather journal wholesale, seed paper manufacturer, paper gift box wholesale India, leather bag manufacturer Jaipur, handmade stationery wholesale" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        { property: "og:title", content: "Products — Leather Journals, Seed Paper & Artisan Gifts | INS Overseas" },
        { property: "og:description", content: description },
        { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: "INS Overseas product catalogue — handmade leather journals and eco-friendly paper" },
        { property: "og:site_name", content: "INS Overseas" },
        { property: "og:locale", content: "en_IN" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@ins_overseas" },
        { name: "twitter:title", content: "Products — INS Overseas Wholesale Catalogue" },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
        { name: "twitter:image:alt", content: "INS Overseas wholesale product catalogue" },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [itemList, breadcrumb],
          }),
        },
      ],
    };
  },
  component: Products,
});


const BATCH = 12;

// The four collection links on the homepage (/products/leather-journals, /products/handmade-paper, …) open this same
// page already filtered to that collection. A collection is one product category, or a small group of them.
const COLLECTIONS: Record<string, { label: string; cats: string[] }> = {
  "leather-journals":    { label: "Leather Journals",    cats: ["leather-journals"] },
  "handmade-paper":      { label: "Handmade Paper",      cats: ["handmade-deckle-edge-paper", "handmade-seed-paper"] },
  "stationery":          { label: "Artisan Stationery",  cats: ["handmade-paper-gift-box", "handmade-paper-gift-bag"] },
  "leather-accessories": { label: "Leather Accessories", cats: ["leather-bags"] },
};
const filterForSlug = (slug: string) => {
  const c = COLLECTIONS[slug];
  if (!c) return "all";
  return c.cats.length === 1 ? c.cats[0] : `collection:${slug}`; // one category: reuse its own pill
};
const categoriesOf = (filter: string) => (filter.startsWith("collection:") ? COLLECTIONS[filter.slice(11)]?.cats ?? [] : filter === "all" ? null : [filter]);

// ── Products page ─────────────────────────────────────────────────────────────
function Products() {
  // /products/<collection> opens already filtered; /products shows everything
  const slug = useRouterState({ select: (s) => s.location.pathname.split("/")[2] ?? "" });
  // coming back with Back / Forward: the same category and the same number of cards as when the visitor left
  const viewKey = useRef(historyKey());
  const [filter, setFilter] = useState(() => savedProductView(viewKey.current)?.filter ?? filterForSlug(slug));
  const prevSlug = useRef(slug); // (compare, not "first run": React StrictMode runs effects twice in development)
  useEffect(() => {
    if (prevSlug.current === slug) return;
    prevSlug.current = slug;
    setFilter(filterForSlug(slug)); setCount(BATCH);
  }, [slug]);
  const { images: productRows, loading } = useProductImages();
  const [preview, setPreview] = useState<DynamicProduct | null>(null);
  const [shareFor, setShareFor] = useState<DynamicProduct | null>(null);
  const isMobile = useIsMobile(); // phones get a compact floating card instead of the wide two-column dialog

  // Back gesture closes lightbox instead of navigating away
  useEffect(() => {
    if (preview) {
      window.history.pushState({ previewOpen: true }, "");
      const handlePopState = () => setPreview(null);
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [preview]);

  const closePreview = () => {
    if (window.history.state?.previewOpen) {
      window.history.back();
    } else {
      setPreview(null);
    }
  };

  // Shared, cached query — instant on revisit, refreshed in the background
  const dynamicProducts: DynamicProduct[] = productRows.map((d) => ({
    id: d.id,
    name: d.product_name || "Handmade Product",
    category: d.category || "handmade-deckle-edge-paper",
    image: d.url,
    description: d.alt_text || "",
    isDynamic: true,
    tag: d.tag,
  }));

  // Merge: dynamic first, static as fallback
  const allProducts: DynamicProduct[] =
    dynamicProducts.length > 0
      ? dynamicProducts
      : staticProducts.map((p) => ({ ...p, isDynamic: false }));

  // drop the share code from the address bar once it has done its job
  const tidyAddress = () => {
    const u = new URL(window.location.href);
    if (!u.searchParams.has("p") && !u.searchParams.has("product")) return;
    u.searchParams.delete("p");
    u.searchParams.delete("product");
    window.history.replaceState(window.history.state, "", u.pathname + u.search + u.hash);
  };
  const deepHandled = useRef<string | null>(null);
  const deepOpened = useRef(false);
  useEffect(() => {
    if (loading) return;
    const qs = new URLSearchParams(window.location.search);
    const id = qs.get("p") ?? qs.get("product");
    if (!id || deepHandled.current === id) return;
    deepHandled.current = id;
    const p = allProducts.find((x) => shortCode(x.id) === id || x.id === id);
    if (p) { deepOpened.current = true; setPreview(p); } else tidyAddress(); // unknown link: just show the catalogue
  }, [loading, allProducts.length]);
  useEffect(() => {
    if (preview || !deepOpened.current) return;
    deepOpened.current = false;
    tidyAddress();
  }, [preview]);

  const activeCats = categoriesOf(filter);
  const visible = activeCats ? allProducts.filter((p) => activeCats.includes(p.category)) : allProducts;
  // a collection spanning several categories gets its own pill, right after "All"
  const pills: { key: string; label: string }[] = filter.startsWith("collection:")
    ? [filters[0], { key: filter, label: COLLECTIONS[filter.slice(11)]?.label ?? "Collection" }, ...filters.slice(1)]
    : [...filters];

  const pillBar = useRef<HTMLDivElement>(null);
  const pillsSection = useRef<HTMLElement>(null);
  const gridSection = useRef<HTMLElement>(null);

  // Changing category swaps in a different (usually shorter) list. If the visitor had scrolled down, the browser would
  // clamp them to the bottom of the page; instead start the new list right under the sticky pills.
  const firstFilter = useRef(true);
  useLayoutEffect(() => {
    if (firstFilter.current) { firstFilter.current = false; return; }
    const pills = pillsSection.current, grid = gridSection.current;
    if (!pills || !grid) return;
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 72;
    const target = grid.getBoundingClientRect().top + window.scrollY - navH - pills.offsetHeight;
    if (window.scrollY > target) window.scrollTo({ top: Math.max(0, target), behavior: "instant" as ScrollBehavior });
  }, [filter]);
  useEffect(() => {
    const bar = pillBar.current;
    const el = bar?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (bar && el) bar.scrollTo({ left: el.offsetLeft - (bar.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
  }, [filter]);

  // Render the catalogue in batches as the visitor scrolls, instead of 100+ cards at once.
  const [count, setCount] = useState(() => savedProductView(viewKey.current)?.count ?? BATCH);
  useEffect(() => { saveProductView(viewKey.current, { filter, count }); }, [filter, count]);
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);
  const shown = visible.slice(0, count);
  useEffect(() => {
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCount((c) => c + BATCH); }, { rootMargin: "800px" });
    io.observe(sentinel);
    return () => io.disconnect();
  }, [sentinel, count]);

  // Lightbox navigation
  const currentIndex = preview ? visible.findIndex((p) => p.id === preview.id) : -1;
  const goPrev = () => { if (currentIndex > 0) setPreview(visible[currentIndex - 1]); };
  const goNext = () => { if (currentIndex < visible.length - 1) setPreview(visible[currentIndex + 1]); };

  // Keyboard navigation
  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || shareFor) return; // the share sheet handles its own keys
      if (e.key === "Escape") closePreview();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview, currentIndex, visible, shareFor]);

  return (
    <>
      <PageHero
        eyebrow="The Collection"
        title={<>Every Piece, <em className="italic font-light text-gold-light">Handmade</em></>}
        subtitle="A curated catalogue of journals, papers, stationery and leather goods — crafted in Jaipur, shipped worldwide."
      />

      {/* Category pills */}
      <section ref={pillsSection} className="sticky top-[var(--nav-h,72px)] z-30 bg-parchment border-b border-umber/15 shadow-[0_6px_16px_-12px_rgba(26,20,16,0.35)]">
        <div className="max-w-[1400px] mx-auto pl-5 sm:pl-8 lg:pl-20 pr-0 lg:pr-20">
          <div
            ref={pillBar}
            role="group"
            aria-label="Filter products by category"
            className="relative flex gap-2.5 overflow-x-auto no-scrollbar py-3.5 pr-5 sm:pr-8 lg:pr-0"
          >
            {pills.map((f) => {
              const active = filter === f.key;
              const cats = categoriesOf(f.key);
              const n = cats ? allProducts.filter((p) => cats.includes(p.category)).length : allProducts.length;
              return (
                <button
                  key={f.key}
                  aria-pressed={active}
                  onClick={() => { setFilter(f.key); setCount(BATCH); }}
                  className={`shrink-0 inline-flex items-center gap-2 h-11 pl-5 pr-3 rounded-full border text-[13px] font-medium whitespace-nowrap transition-all duration-200 active:scale-95 [-webkit-tap-highlight-color:transparent] ${
                    active
                      ? "bg-umber text-cream border-umber shadow-[0_6px_16px_-6px_rgba(107,76,42,0.7)]"
                      : "bg-white text-umber-dark border-umber/40 hover:border-umber hover:bg-cream"
                  }`}
                  style={{ fontFamily: "var(--font-body)", letterSpacing: "0.03em" }}
                >
                  {f.label}
                  <span
                    className={`min-w-[26px] h-[26px] px-1.5 rounded-full inline-flex items-center justify-center text-[11px] tabular-nums ${
                      active ? "bg-cream/20 text-cream" : "bg-umber/10 text-umber"
                    }`}
                  >
                    {n}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section ref={gridSection} className="bg-cream py-6 sm:py-10 lg:py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">

          {/* Skeletons */}
          {loading && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white border border-ink/10 overflow-hidden">
                  <div className="aspect-[4/5] bg-parchment-dark" />
                  <div className="p-4">
                    <div className="h-4 bg-parchment-dark rounded w-3/4" />
                    <div className="h-3 bg-parchment-dark rounded mt-2.5 w-1/2" />
                    <div className="h-9 bg-parchment-dark rounded-full mt-4 w-28" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && visible.length === 0 && (
            <div
              className="text-center py-24 text-warm-grey"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 15 }}
            >
              No products in this category yet.
            </div>
          )}

          {/* Product grid */}
          {!loading && visible.length > 0 && (
            // key={filter}: switching category remounts the grid, so the new cards simply fade in
            // (no per-card layout tracking — that is what made 100+ products janky)
            <div key={filter} className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {shown.map((p, i) => {
                const moq = (CATEGORY_MOQ[p.category] || "200 units minimum").match(/\d+/)?.[0] ?? "200";
                const showDesc = !!p.description && p.description.trim().toLowerCase() !== p.name.trim().toLowerCase();
                return (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
                    className="group flex flex-col rounded-2xl bg-white border border-ink/10 shadow-[0_1px_2px_rgba(26,20,16,0.05),0_10px_24px_-16px_rgba(26,20,16,0.25)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-20px_rgba(26,20,16,0.4)]"
                  >
                    {/* Image — click to open the details lightbox */}
                    <div className="relative">
                    <button
                      type="button"
                      onClick={() => setPreview(p)}
                      aria-label={`View details: ${p.name}`}
                      className="relative block aspect-[4/5] w-full overflow-hidden bg-[#EFEBE3] text-left cursor-pointer"
                    >
                      <img
                        loading="lazy"
                        decoding="async"
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      />
                      <span
                        className="absolute top-2.5 left-2.5 max-w-[calc(100%-20px)] truncate bg-white/95 text-umber-dark uppercase px-2.5 py-1 rounded-full shadow-[0_1px_4px_rgba(26,20,16,0.15)]"
                        style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 9, letterSpacing: "0.14em" }}
                      >
                        {CATEGORY_LABELS[p.category] || p.category}
                      </span>
                      {tagLabel(p.tag) && (
                        <span
                          className={`absolute top-2.5 right-2.5 uppercase px-2.5 py-1 rounded-full shadow-[0_1px_4px_rgba(26,20,16,0.2)] ${p.tag === "best" ? "bg-gold text-ink" : "bg-ink text-cream"}`}
                          style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 9, letterSpacing: "0.12em" }}
                        >
                          {tagLabel(p.tag)}
                        </span>
                      )}
                      <span className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-cream text-umber flex items-center justify-center shadow-md md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300" aria-hidden>
                        <Maximize2 size={15} strokeWidth={1.8} />
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShareFor(p)}
                      aria-label={`Share ${p.name}`}
                      title="Share this product"
                      className="absolute bottom-2.5 left-2.5 w-9 h-9 rounded-full bg-cream text-umber flex items-center justify-center shadow-md hover:bg-white active:scale-95 transition-[background-color,transform] duration-200 [-webkit-tap-highlight-color:transparent]"
                    >
                      <Share2 size={15} strokeWidth={1.8} />
                    </button>
                    </div>

                    <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                      <h3
                        className="text-ink leading-snug line-clamp-2"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(16px, 1.7vw, 19px)" }}
                      >
                        {p.name}
                      </h3>
                      {showDesc && (
                        <p className="mt-1 line-clamp-2" style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 12.5, lineHeight: 1.5, color: "var(--grey-ink)" }}>
                          {p.description}
                        </p>
                      )}
                      <div className="mt-auto pt-3.5 flex flex-col gap-2.5">
                        <span className="uppercase" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10, letterSpacing: "0.14em", color: "var(--grey-ink)" }}>
                          MOQ {moq}+
                        </span>
                        <div className="flex items-center gap-2 w-full max-[399px]:flex-col">
                          <ListButton product={p} compact />
                          <EnquireButton product={p} compact />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}

          {/* Sentinel: when it nears the viewport, the next batch is rendered */}
          {!loading && shown.length < visible.length && <div ref={setSentinel} className="h-px" aria-hidden />}
        </div>
      </section>

      {/* ── Product details ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-5 md:p-6"
            onClick={closePreview}
          >
            {isMobile ? (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={preview.name}
                initial={{ opacity: 0, scale: 0.92, y: 28 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="relative w-full max-w-[360px] max-h-[92vh] overflow-y-auto overscroll-contain bg-white rounded-[32px] p-2.5 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.6)]"
                onClick={(e) => e.stopPropagation()}
              >
                <PhotoPane product={preview} count={visible.length} index={currentIndex} onPrev={goPrev} onNext={goNext} onClose={closePreview} className="aspect-square" />

                <div className="px-3.5 pt-4 pb-3">
                  <h2 className="text-ink leading-[1.1]" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 26, letterSpacing: "-0.01em" }}>
                    {preview.name}
                  </h2>
                  <p className="mt-1.5" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 15, color: "var(--grey-ink)" }}>
                    {CATEGORY_LABELS[preview.category] || preview.category}
                  </p>
                  <p className="mt-2 leading-snug" style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 13.5, color: "var(--grey-ink)" }}>
                    {preview.description && preview.description.trim().toLowerCase() !== preview.name.trim().toLowerCase()
                      ? preview.description
                      : "Handmade in Sanganer, Jaipur. Lead time 30 days · custom branding available · ships by air or sea."}
                  </p>
                  <ActionRow product={preview} className="mt-5" onShare={() => setShareFor(preview)} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={preview.name}
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 18 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="relative bg-white w-full max-w-[940px] max-h-[90vh] overflow-y-auto overscroll-contain rounded-[32px] p-3 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid md:grid-cols-[1.08fr_1fr] gap-3 md:gap-8">
                  {/* Same idea as the phone card: an inset rounded photo with the tag, close and browse controls floating on it */}
                  <PhotoPane product={preview} count={visible.length} index={currentIndex} onPrev={goPrev} onNext={goNext} onClose={closePreview} className="aspect-[4/3] md:aspect-auto md:min-h-[540px]" large />

                  <div className="flex flex-col px-2 pb-2 md:py-6 md:pr-6">
                    <h2 className="text-ink leading-[1.08]" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(28px, 3.2vw, 40px)", letterSpacing: "-0.01em" }}>
                      {preview.name}
                    </h2>
                    <p className="mt-2" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 15, color: "var(--grey-ink)" }}>
                      {CATEGORY_LABELS[preview.category] || preview.category}
                    </p>
                    {preview.description && preview.description.trim().toLowerCase() !== preview.name.trim().toLowerCase() && (
                      <p className="mt-3 leading-relaxed" style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 14.5, color: "var(--grey-ink)" }}>
                        {preview.description}
                      </p>
                    )}

                    <dl className="mt-6 flex flex-col gap-2">
                      {([
                        ["MOQ",       CATEGORY_MOQ[preview.category] || "200 units minimum"],
                        ["Lead Time", "30 days after order confirmation"],
                        ["Custom",    "Logo debossing, embossing, foil available"],
                        ["Shipping",  "Air 7–10 days · Sea 35–40 days"],
                      ] as [string, string][]).map(([k, v]) => (
                        <div key={k} className="flex items-baseline gap-4 rounded-2xl bg-[#F6F3EC] px-4 py-3">
                          <dt className="shrink-0 w-[78px] uppercase" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10.5, letterSpacing: "0.14em", color: "var(--grey-ink)" }}>
                            {k}
                          </dt>
                          <dd className="text-ink" style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 14, lineHeight: 1.4 }}>
                            {v}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <ActionRow product={preview} className="mt-7 md:mt-auto md:pt-6" onShare={() => setShareFor(preview)} />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ShareSheet
        product={shareFor ? { id: shareFor.id, name: shareFor.name, category: shareFor.category, image: shareFor.image } : null}
        onClose={() => setShareFor(null)}
      />
    </>
  );
}

// ── Pieces shared by the phone card and the desktop dialog ─────────────────────
function PhotoPane({ product, count, index, onPrev, onNext, onClose, className = "", large = false }: {
  product: DynamicProduct; count: number; index: number; onPrev: () => void; onNext: () => void; onClose: () => void; className?: string; large?: boolean;
}) {
  const arrow = `absolute top-1/2 -translate-y-1/2 ${large ? "w-11 h-11" : "w-9 h-9"} rounded-full bg-white/90 text-ink shadow-md flex items-center justify-center active:scale-95 transition-all disabled:opacity-0 disabled:pointer-events-none`;
  return (
    <div className={`relative rounded-[24px] overflow-hidden bg-[#EFEBE3] ${className}`}>
      <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
      <span
        className="absolute top-3.5 left-3.5 max-w-[60%] truncate bg-ink/55 text-white rounded-full px-3 py-1.5"
        style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12 }}
      >
        {CATEGORY_LABELS[product.category] || product.category}
      </span>
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white text-ink shadow-[0_2px_10px_rgba(0,0,0,0.25)] flex items-center justify-center active:scale-95 hover:bg-parchment transition-all"
      >
        <X size={18} />
      </button>
      {count > 1 && (
        <>
          <button onClick={onPrev} disabled={index === 0} aria-label="Previous product" className={`${arrow} left-2.5`}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={onNext} disabled={index === count - 1} aria-label="Next product" className={`${arrow} right-2.5`}>
            <ChevronRight size={18} />
          </button>
          <span
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-ink/55 text-white rounded-full px-2.5 py-1 tabular-nums"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11 }}
          >
            {index + 1} / {count}
          </span>
        </>
      )}
    </div>
  );
}

/** MOQ pill + dark Enquire pill, with the WhatsApp alternative underneath. */
function ActionRow({ product, className = "", onShare }: { product: DynamicProduct; className?: string; onShare: () => void }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center h-11 px-4 rounded-full bg-[#F1EEE8] text-ink tabular-nums" style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 15 }}>
          MOQ {(CATEGORY_MOQ[product.category] || "200 units minimum").match(/\d+/)?.[0] ?? "200"}+
        </span>
        <a
          href={enquiryHref(product)}
          aria-label={`Enquire about ${product.name}`}
          className="inline-flex items-center gap-2.5 h-11 pl-5 pr-1.5 rounded-full bg-ink text-white active:scale-95 hover:bg-umber-dark transition-all"
          style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14 }}
        >
          Enquire
          <span className="w-8 h-8 rounded-full bg-white text-ink flex items-center justify-center"><ArrowUpRight size={16} /></span>
        </a>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <ListButton product={product} />
        <button
          type="button"
          onClick={onShare}
          className="shrink-0 h-11 px-4 rounded-full inline-flex items-center justify-center gap-2 border border-umber/40 text-umber-dark hover:bg-umber hover:border-umber hover:text-cream active:scale-95 transition-[background-color,color,transform] duration-200"
          style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13 }}
        >
          <Share2 size={16} strokeWidth={1.8} /> Share
        </button>
      </div>
      <a
        href={`https://wa.me/919680478483?text=${encodeURIComponent(`Hi INS Overseas, I'm interested in "${product.name}". Please share wholesale pricing and MOQ.\n${productShareUrl(product.id)}`)}`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex items-center justify-center gap-2 text-umber-dark hover:text-ink transition-colors underline underline-offset-4 decoration-umber/40"
        style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 13 }}
      >
        <WhatsAppGlyph size={16} />
        Prefer chat? Message us on WhatsApp
      </a>
    </div>
  );
}

// ── Enquiry list button ────────────────────────────────────────────────────────
// Puts the piece on the visitor's quote list (the gold "Quote list" pill above the dock sends the whole list in one message).
// compact = the round button on a grid card; otherwise the labelled button in the details popup.
function ListButton({ product, compact = false }: { product: DynamicProduct; compact?: boolean }) {
  const moq = (CATEGORY_MOQ[product.category] || "200 units minimum").match(/\d+/)?.[0] ?? "200";
  const item = { id: enquiryId(product.name), name: product.name, category: CATEGORY_LABELS[product.category] || product.category, moq: `${moq}+ pcs`, url: productShareUrl(product.id) };
  const on = useInEnquiry(item.id);
  const label = on ? `Remove ${product.name} from your quote list` : `Add ${product.name} to your quote list`;
  if (compact) {
    return (
      <button
        type="button"
        onClick={() => toggleEnquiry(item)}
        aria-pressed={on}
        aria-label={label}
        className={`h-9 sm:h-10 flex-1 max-[399px]:flex-none max-[399px]:w-full min-w-0 px-2 sm:px-3 rounded-full inline-flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 transition-[background-color,color,transform] duration-200 text-[12px] [-webkit-tap-highlight-color:transparent] ${on ? "bg-ink text-gold" : "border border-umber/40 text-umber-dark hover:bg-umber hover:border-umber hover:text-cream"}`}
        style={{ fontFamily: "var(--font-body)", fontWeight: 600, letterSpacing: "0.02em" }}
      >
        {on ? <Check size={14} strokeWidth={2.4} /> : <Plus size={14} strokeWidth={2.2} />}
        {on ? "Added" : <><span className="sm:hidden">Quote</span><span className="hidden sm:inline">Add to quote</span></>}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => toggleEnquiry(item)}
      aria-pressed={on}
      className={`flex-1 min-w-0 h-11 px-3 rounded-full inline-flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.98] transition-[background-color,color,transform] duration-200 ${on ? "bg-ink text-gold" : "border border-umber/40 text-umber-dark hover:bg-umber hover:border-umber hover:text-cream"}`}
      style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13 }}
    >
      {on ? <><Check size={16} strokeWidth={2.2} /> Added to quote list</> : <><Plus size={16} strokeWidth={2.2} /> Add to quote list</>}
    </button>
  );
}

// ── Enquire button ─────────────────────────────────────────────────────────────
function enquiryHref(product: DynamicProduct) {
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;
  const subject = encodeURIComponent(`Product Enquiry: ${product.name} — INS Overseas`);
  const body = encodeURIComponent(
    `Hi INS Overseas Team,\n\nI am interested in the following product:\n\nProduct: ${product.name}\nCategory: ${categoryLabel}\nProduct link: ${productShareUrl(product.id)}\n\nPlease share:\n- Wholesale pricing\n- Available sizes and variants\n- MOQ details\n- Lead time for bulk order\n- Custom branding options (if any)\n\nCompany: \nCountry: \nEstimated Quantity: \n\nThank you,`
  );
  return `mailto:Sezan@ins-overseas.com?subject=${subject}&body=${body}`;
}

function EnquireButton({ product, large = false, compact = false }: { product: DynamicProduct; large?: boolean; compact?: boolean }) {
  return (
    <a
      href={enquiryHref(product)}
      aria-label={`Enquire about ${product.name}`}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 [-webkit-tap-highlight-color:transparent] ${
        large
          ? "w-full bg-umber text-cream px-6 py-4 hover:bg-umber-dark uppercase text-[12px]"
          : compact
            ? "h-9 sm:h-10 flex-1 max-[399px]:flex-none max-[399px]:w-full min-w-0 px-2 sm:px-4 rounded-full border border-umber/40 text-umber-dark hover:bg-umber hover:border-umber hover:text-cream active:scale-95 text-[12px]"
            : "mt-4 border border-umber text-umber px-5 py-2.5 hover:bg-umber hover:text-cream uppercase text-[11px]"
      }`}
      style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: compact ? "0.04em" : "0.15em" }}
    >
      <Mail size={large ? 15 : 13} strokeWidth={1.8} className={compact ? "hidden sm:block" : ""} />
      {compact ? "Enquire" : "Enquire about this product"}
    </a>
  );
}
