import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useGalleryImages } from "@/hooks/useGalleryImages";
import PageHero from "@/components/shared/PageHero";
import { SITE_URL } from "@/lib/seo";
import { seoPages } from "@/data/seoPages";
import { galleryCopy as C, galleryInfo } from "@/data/copy";
import InfoSection from "@/components/shared/InfoSection";
import { isVideoUrl } from "@/lib/utils";

const PAGE = seoPages["/gallery"];
const CANONICAL = `${SITE_URL}/gallery`;
const TITLE = PAGE.title;
const DESCRIPTION = PAGE.description;

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { property: "og:title", content: PAGE.ogTitle ?? PAGE.title },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "INS Overseas gallery — handcrafted leather journals and artisan paper products from Sanganer, Jaipur" },
      { property: "og:site_name", content: "INS Overseas" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@ins_overseas" },
      { name: "twitter:title", content: PAGE.ogTitle ?? PAGE.title },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
      { name: "twitter:image:alt", content: "INS Overseas gallery" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${CANONICAL}#collection`,
              "name": TITLE,
              "description": DESCRIPTION,
              "url": CANONICAL,
              "publisher": { "@id": `${SITE_URL}/#organization` },
              "about": { "@id": `${SITE_URL}/#organization` },
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
                { "@type": "ListItem", "position": 2, "name": "Gallery", "item": CANONICAL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: GalleryPage,
});


// Tiles have a fixed shape (photos are cropped to it, the lightbox shows the full photo) so the grid
// never reflows while images load. Varying the shape by position keeps the masonry look.
const TILE_RATIOS = ["1 / 1", "4 / 5", "3 / 4", "1 / 1", "4 / 5", "5 / 4"];

function GalleryPage() {
  const { images, loading } = useGalleryImages();
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <PageHero
        eyebrow={C.eyebrow}
        title={<>{C.h1.plain} <em className="italic font-light">{C.h1.em}</em></>}
        subtitle={C.subtitle}
      />

      <section className="bg-parchment py-14 md:py-20">
        {/* min-h: the skeleton, the empty state and the real grid all differ in height; this keeps the footer
            below the fold in each, so it never visibly jumps when the data arrives */}
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 min-h-[70vh]">

          {/* Loading skeleton */}
          {loading && (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="break-inside-avoid bg-parchment-dark rounded-sm animate-pulse"
                  style={{ aspectRatio: TILE_RATIOS[i % TILE_RATIOS.length] }}
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
                  <div className="relative overflow-hidden bg-parchment-dark" style={{ aspectRatio: TILE_RATIOS[i % TILE_RATIOS.length] }}>
                    {isVideoUrl(img.url) ? (
                      <video
                        src={img.url}
                        muted loop autoPlay playsInline preload="metadata"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ filter: "sepia(0.1) saturate(1.1) brightness(0.97)" }}
                      />
                    ) : (
                      <img
                        loading="lazy"
                        decoding="async"
                        src={img.url}
                        alt={img.alt_text || "INS Overseas product"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ filter: "sepia(0.1) saturate(1.1) brightness(0.97)" }}
                      />
                    )}
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

      <InfoSection blocks={galleryInfo} />

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
            {(() => {
              const Media = isVideoUrl(lightbox) ? motion.video : motion.img;
              return (
                <Media
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={lightbox}
                  {...(isVideoUrl(lightbox) ? { controls: true, autoPlay: true, playsInline: true } : { alt: "Gallery" })}
                  className="max-w-full max-h-[90vh] object-contain rounded-sm"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
