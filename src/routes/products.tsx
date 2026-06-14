import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "@/components/shared/PageHero";
import { supabase } from "@/lib/supabase";
import { X, Mail, ChevronLeft, ChevronRight } from "lucide-react";

// ── Filter definitions ────────────────────────────────────────────────────────
const filters = [
  { key: "all",                     label: "All"                   },
  { key: "leather-journals",        label: "Leather Journals"      },
  { key: "leather-bags",            label: "Leather Bags"          },
  { key: "handmade-paper-gift-box", label: "Paper Gift Box"        },
  { key: "handmade-paper-gift-bag", label: "Paper Gift Bag"        },
  { key: "handmade-seed-paper",     label: "Seed Paper"            },
  { key: "handmade-deckle-edge-paper", label: "Deckle Edge Paper"      },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  "leather-journals":        "Leather Journal",
  "leather-bags":            "Leather Bag",
  "handmade-paper-gift-box": "Paper Gift Box",
  "handmade-paper-gift-bag": "Paper Gift Bag",
  "handmade-seed-paper":     "Seed Paper",
  "handmade-deckle-edge-paper": "Deckle Edge Paper",
};

const CATEGORY_MOQ: Record<string, string> = {
  "leather-journals":        "200 units minimum",
  "leather-bags":            "150 units minimum",
  "handmade-paper-gift-box": "200 units minimum",
  "handmade-paper-gift-bag": "800 units minimum",
  "handmade-seed-paper":     "1500 units minimum",
  "handmade-deckle-edge-paper": "200 units minimum",
};

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
  { id: "s9",  name: "Plantable Seed Paper Set",        category: "handmade-seed-paper",     image: "https://images.unsplash.com/photo-1599492816851-9cc4f3f06f88?auto=format&fit=crop&w=900&q=80",  description: "Wildflower mix · 20 sheets · biodegradable" },
  { id: "s10", name: "Deckle Edge Notebook (Set of 6)",    category: "handmade-deckle-edge-paper", image: "https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?auto=format&fit=crop&w=900&q=80",  description: "Cotton rag · unlined · A5 · deckle edges" },
  { id: "s11", name: "Deckle Edge Writing Pad",             category: "handmade-deckle-edge-paper", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80",  description: "120 gsm · fountain-pen friendly · A4" },
  { id: "s12", name: "Deckle Edge Loose Sheets (Pack 50)",  category: "handmade-deckle-edge-paper", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",  description: "Ivory cotton rag · A4 · deckle all four edges" },
];

type DynamicProduct = {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  isDynamic: boolean;
};

// ── Route ─────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Leather Journals, Seed Paper, Gift Boxes | INS Overseas" },
      { name: "description", content: "Browse our full range of handmade leather journals, seed paper, paper gift boxes, paper gift bags, leather bags and artisan stationery. Wholesale from Jaipur, India." },
      { name: "keywords", content: "handmade leather journal wholesale, seed paper manufacturer, paper gift box wholesale India, leather bag manufacturer Jaipur, handmade stationery wholesale" },
      { property: "og:title", content: "Products — Leather Journals, Seed Paper & Artisan Gifts | INS Overseas" },
      { property: "og:url", content: "https://ins-overseas.com/products" },
    ],
  }),
  component: Products,
});

// ── Products page ─────────────────────────────────────────────────────────────
function Products() {
  const [filter, setFilter] = useState("all");
  const [dynamicProducts, setDynamicProducts] = useState<DynamicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<DynamicProduct | null>(null);

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

  // Fetch from Supabase
  useEffect(() => {
    supabase
      .from("site_images")
      .select("*")
      .eq("section", "product")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDynamicProducts(
            data.map((d) => ({
              id: d.id,
              name: d.product_name || d.label || "Handmade Product",
              category: d.category || "handmade-deckle-edge-paper",
              image: d.url,
              description: d.alt_text || "",
              isDynamic: true,
            }))
          );
        }
        setLoading(false);
      });
  }, []);

  // Merge: dynamic first, static as fallback
  const allProducts: DynamicProduct[] =
    dynamicProducts.length > 0
      ? dynamicProducts
      : staticProducts.map((p) => ({ ...p, isDynamic: false }));

  const visible =
    filter === "all" ? allProducts : allProducts.filter((p) => p.category === filter);

  // Lightbox navigation
  const currentIndex = preview ? visible.findIndex((p) => p.id === preview.id) : -1;
  const goPrev = () => { if (currentIndex > 0) setPreview(visible[currentIndex - 1]); };
  const goNext = () => { if (currentIndex < visible.length - 1) setPreview(visible[currentIndex + 1]); };

  // Keyboard navigation
  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview, currentIndex, visible]);

  return (
    <>
      <PageHero
        eyebrow="The Collection"
        title={<>Every Piece, <em className="italic font-light text-gold-light">Handmade</em></>}
        subtitle="A curated catalogue of journals, papers, stationery and leather goods — crafted in Jaipur, shipped worldwide."
      />

      {/* Filter tabs */}
      <section className="sticky top-[72px] z-30 bg-cream/95 backdrop-blur border-b border-warm-grey-light/40">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 py-4 flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 uppercase text-[11px] px-4 py-2 border transition-all duration-200 ${
                filter === f.key
                  ? "bg-umber text-cream border-umber"
                  : "border-warm-grey-light/60 text-umber hover:border-umber"
              }`}
              style={{ letterSpacing: "0.15em" }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">

          {/* Skeletons */}
          {loading && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-parchment-dark rounded-sm" />
                  <div className="h-4 bg-parchment-dark rounded mt-4 w-3/4" />
                  <div className="h-3 bg-parchment-dark rounded mt-2 w-1/2" />
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
            <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              <AnimatePresence mode="popLayout">
                {visible.map((p, i) => (
                  <motion.article
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
                    className="group cursor-pointer"
                  >
                    {/* Image — click to open lightbox */}
                    <div
                      className="aspect-[3/4] overflow-hidden bg-parchment-dark relative"
                      onClick={() => setPreview(p)}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span
                          className="text-cream uppercase border border-cream/60 px-4 py-2"
                          style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em" }}
                        >
                          View Details
                        </span>
                      </div>
                    </div>

                    {/* Category */}
                    <p
                      className="mt-4 text-gold uppercase"
                      style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.22em" }}
                    >
                      {CATEGORY_LABELS[p.category] || p.category}
                    </p>

                    {/* Name */}
                    <h3
                      className="mt-1 text-ink leading-snug"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(16px, 1.8vw, 20px)" }}
                    >
                      {p.name}
                    </h3>

                    {p.description && (
                      <p className="mt-1 text-warm-grey text-sm font-light">{p.description}</p>
                    )}

                    <EnquireButton product={p} />
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Lightbox ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-4 md:p-8"
            onClick={closePreview}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
              className="relative bg-cream w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
              style={{ borderRadius: 2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={closePreview}
                className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-ink/10 hover:bg-ink/20 rounded-full transition-colors"
                aria-label="Close"
              >
                <X size={18} className="text-ink" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image */}
                <div className="aspect-[3/4] md:aspect-auto overflow-hidden bg-parchment-dark">
                  <img
                    src={preview.image}
                    alt={preview.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-7 md:p-9 flex flex-col justify-between">
                  <div>
                    {/* Category tag */}
                    <span
                      className="inline-block text-gold uppercase mb-4"
                      style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.22em" }}
                    >
                      {CATEGORY_LABELS[preview.category] || preview.category}
                    </span>

                    {/* Name */}
                    <h2
                      className="text-ink leading-tight mb-3"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(22px, 3vw, 30px)" }}
                    >
                      {preview.name}
                    </h2>

                    {preview.description && (
                      <p
                        className="text-warm-grey mb-6 leading-relaxed"
                        style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 15 }}
                      >
                        {preview.description}
                      </p>
                    )}

                    <div className="h-px bg-warm-grey-light/40 mb-6" />

                    {/* Details list */}
                    <div className="space-y-2.5 mb-8">
                      {([
                        ["MOQ",       CATEGORY_MOQ[preview.category] || "200 units minimum"],
                        ["Lead Time", "30 days after order confirmation"],
                        ["Custom",    "Logo debossing, embossing, foil available"],
                        ["Shipping",  "Air 7–10 days · Sea 35–40 days"],
                      ] as [string, string][]).map(([k, v]) => (
                        <div key={k} className="flex gap-3">
                          <span
                            className="text-gold uppercase shrink-0 w-20"
                            style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.15em", paddingTop: 2 }}
                          >
                            {k}
                          </span>
                          <span
                            className="text-umber-dark"
                            style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 13 }}
                          >
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <EnquireButton product={preview} large />
                </div>
              </div>

              {/* Lightbox nav */}
              {visible.length > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-warm-grey-light/30">
                  <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-1.5 text-umber disabled:opacity-30 hover:text-ink transition-colors"
                    style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.1em" }}
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <span
                    className="text-warm-grey"
                    style={{ fontFamily: "var(--font-body)", fontSize: 12 }}
                  >
                    {currentIndex + 1} / {visible.length}
                  </span>
                  <button
                    onClick={goNext}
                    disabled={currentIndex === visible.length - 1}
                    className="flex items-center gap-1.5 text-umber disabled:opacity-30 hover:text-ink transition-colors"
                    style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.1em" }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Enquire button ─────────────────────────────────────────────────────────────
function EnquireButton({ product, large = false }: { product: DynamicProduct; large?: boolean }) {
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;
  const subject = encodeURIComponent(`Product Enquiry: ${product.name} — INS Overseas`);
  const body = encodeURIComponent(
    `Hi INS Overseas Team,\n\nI am interested in the following product:\n\nProduct: ${product.name}\nCategory: ${categoryLabel}\n\nPlease share:\n- Wholesale pricing\n- Available sizes and variants\n- MOQ details\n- Lead time for bulk order\n- Custom branding options (if any)\n\nCompany: \nCountry: \nEstimated Quantity: \n\nThank you,`
  );

  return (
    <a
      href={`mailto:Sezan@ins-overseas.com?subject=${subject}&body=${body}`}
      className={`inline-flex items-center gap-2 transition-all duration-200 group ${
        large
          ? "w-full justify-center bg-umber text-cream px-6 py-4 hover:bg-umber-dark uppercase text-[12px]"
          : "mt-4 border border-umber text-umber px-5 py-2.5 hover:bg-umber hover:text-cream uppercase text-[11px]"
      }`}
      style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.15em" }}
    >
      <Mail size={large ? 15 : 12} />
      Enquire about this product
    </a>
  );
}
