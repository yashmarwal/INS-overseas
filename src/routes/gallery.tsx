import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useGalleryImages } from "@/hooks/useGalleryImages";
import PageHero from "@/components/shared/PageHero";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Handmade Journals & Artisan Paper Products | INS Overseas" },
      { name: "description", content: "Browse our workspace and product gallery — handcrafted leather journals, seed paper, gift boxes and artisan stationery made in Sanganer, Jaipur." },
      { property: "og:title", content: "Gallery — INS Overseas Workspace & Products" },
      { property: "og:url", content: "https://insoverseas.com/gallery" },
    ],
  component: GalleryPage,
});

function GalleryPage() {
  const { images, loading } = useGalleryImages();
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title={<>From Our <em className="italic font-light">Workspace</em></>}
        subtitle="Handcrafted leather journals and artisan paper products made in Sanganer, Jaipur."
      />

      <section className="bg-parchment py-14 md:py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-parchment-dark rounded-sm animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && images.length === 0 && (
            <div className="text-center py-20">
              <p
                className="text-warm-grey"
                style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 16 }}
              >
                Gallery coming soon.
              </p>
            </div>
          )}

          {/* Masonry grid */}
          {!loading && images.length > 0 && (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {images.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                  className="break-inside-avoid cursor-pointer group overflow-hidden rounded-sm"
                  onClick={() => setLightbox(img.url)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.alt_text || "INS Overseas product"}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ filter: "sepia(0.1) saturate(1.1) brightness(0.97)" }}
                    />
                    <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span
                        className="text-cream uppercase"
                        style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.2em" }}
                      >
                        View
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4 md:p-8"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-cream/70 hover:text-cream transition-colors"
              onClick={() => setLightbox(null)}
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={lightbox}
              alt="Gallery"
              className="max-w-full max-h-[90vh] object-contain rounded-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
