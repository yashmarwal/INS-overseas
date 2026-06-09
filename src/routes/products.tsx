import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductImages, PRODUCT_CATEGORIES } from "@/hooks/useProductImages";
import PageHero from "@/components/shared/PageHero";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Leather Journals, Seed Paper, Gift Boxes | INS Overseas" },
      { name: "description", content: "Browse our full range of handmade leather journals, seed paper, paper gift boxes, paper gift bags, leather bags and artisan stationery. Wholesale from Jaipur, India." },
      { name: "keywords", content: "handmade leather journal wholesale, seed paper manufacturer, paper gift box wholesale India, leather bag manufacturer Jaipur, handmade stationery wholesale" },
      { property: "og:title", content: "Products — Leather Journals, Seed Paper & Artisan Gifts | INS Overseas" },
      { property: "og:url", content: "https://insoverseas.com/products" },
    ],
  component: ProductsPage,
});

function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { images, loading } = useProductImages(activeCategory);

  return (
    <>
      <PageHero
        eyebrow="Our Products"
        title={<>Handcrafted With <em className="italic font-light">Intention</em></>}
        subtitle="Browse our full range of leather journals, handmade paper, artisan stationery and leather accessories."
      />

      {/* Category tab bar */}
      <div className="bg-parchment sticky top-[72px] z-20 border-b border-warm-grey-light/50">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
          <div className="flex overflow-x-auto gap-0 no-scrollbar">
            <button
              onClick={() => setActiveCategory("all")}
              className="shrink-0 px-6 py-4 text-xs uppercase border-b-2 transition-all"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                letterSpacing: "0.15em",
                borderBottomColor: activeCategory === "all" ? "var(--color-umber)" : "transparent",
                background: activeCategory === "all" ? "var(--color-umber)" : "transparent",
                color: activeCategory === "all" ? "var(--color-cream)" : "var(--color-umber)",
              }}
            >
              All Products
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="shrink-0 px-6 py-4 text-xs uppercase border-b-2 transition-all"
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  borderBottomColor: activeCategory === cat.id ? "var(--color-umber)" : "transparent",
                  background: activeCategory === cat.id ? "var(--color-umber)" : "transparent",
                  color: activeCategory === cat.id ? "var(--color-cream)" : "var(--color-umber)",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <section className="bg-parchment py-14 md:py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-parchment-dark rounded-sm aspect-[3/4] mb-3" />
                  <div className="h-4 bg-parchment-dark rounded w-3/4 mb-2" />
                  <div className="h-3 bg-parchment-dark rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && images.length === 0 && (
            <div className="text-center py-24">
              <p className="text-warm-grey" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 16 }}>
                No products in this category yet.
              </p>
            </div>
          )}

          {/* Product grid with animated transitions */}
          {!loading && images.length > 0 && (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              <AnimatePresence mode="popLayout">
                {images.map((img, i) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                    className="group"
                  >
                    <div className="relative overflow-hidden rounded-sm aspect-[3/4] mb-4 bg-parchment-dark">
                      <img
                        src={img.url}
                        alt={img.product_name || img.alt_text || "INS Overseas product"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ filter: "sepia(0.08) saturate(1.1) brightness(0.97)" }}
                      />
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className="backdrop-blur-sm"
                          style={{
                            background: "rgba(26,20,16,0.7)",
                            color: "#FAF7F0",
                            fontFamily: "var(--font-body)",
                            fontSize: 9,
                            fontWeight: 500,
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            padding: "3px 8px",
                            borderRadius: 2,
                          }}
                        >
                          {PRODUCT_CATEGORIES.find((c) => c.id === img.category)?.label || img.category}
                        </span>
                      </div>
                    </div>

                    {img.product_name && (
                      <h3
                        className="text-umber-dark mb-1"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 18, lineHeight: 1.2 }}
                      >
                        {img.product_name}
                      </h3>
                    )}

                    <a
                      href={`mailto:info@insoverseas.com?subject=Enquiry: ${encodeURIComponent(img.product_name || "Product")}`}
                      className="inline-flex items-center gap-2 mt-2 text-umber uppercase hover:gap-3 transition-all"
                      style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.15em" }}
                    >
                      <Mail size={12} />
                      Enquire
                    </a>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
