import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import PageHero from "@/components/shared/PageHero";

export const Route = createFileRoute("/manufacturing")({
  head: () => ({
    meta: [
      { title: "Manufacturing | INS Overseas — Watch Our Workspace in Jaipur" },
      { name: "description", content: "Watch how INS Overseas makes handmade leather journals and eco-friendly paper in Sanganer, Jaipur. Videos and photos from our workspace." },
      { property: "og:title", content: "Manufacturing — INS Overseas | Sanganer Workspace" },
      { property: "og:url", content: "https://ins-overseas.com/manufacturing" },
    ],
  }),
  component: Manufacturing,
});

// ── VIDEOS — Vimeo IDs ──
const videos = [
  { id: "1199824555" },
  { id: "1199824554" },
  { id: "1199824476" },
  { id: "1199824479" },
  { id: "1199824489" },
  { id: "1199824507" },
  { id: "1199824375" },
  { id: "1199824461" },
  { id: "1199824372" },
  { id: "1199824373" },
  { id: "1199824374" },
  { id: "1199824422" },
];

// ── PHOTOS — real workspace images ──
const photos = [
  "/manufacturing/workspace-1.jpg",
  "/manufacturing/workspace-2.jpg",
  "/manufacturing/workspace-3.jpg",
  "/manufacturing/workspace-4.jpg",
  "/manufacturing/workspace-5.jpg",
];

type ActiveMedia =
  | { type: "video"; id: string; index: number }
  | { type: "photo"; url: string; index: number };

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function Manufacturing() {
  const [active, setActive] = useState<ActiveMedia | null>(null);
  const [tab, setTab] = useState<"all" | "videos" | "photos">("all");

  const openVideo = (id: string, index: number) =>
    setActive({ type: "video", id, index });
  const openPhoto = (url: string, index: number) =>
    setActive({ type: "photo", url, index });
  const close = () => setActive(null);

  const goPrev = () => {
    if (!active) return;
    if (active.type === "video") {
      const newIndex = (active.index - 1 + videos.length) % videos.length;
      setActive({ type: "video", id: videos[newIndex].id, index: newIndex });
    } else {
      const newIndex = (active.index - 1 + photos.length) % photos.length;
      setActive({ type: "photo", url: photos[newIndex], index: newIndex });
    }
  };

  const goNext = () => {
    if (!active) return;
    if (active.type === "video") {
      const newIndex = (active.index + 1) % videos.length;
      setActive({ type: "video", id: videos[newIndex].id, index: newIndex });
    } else {
      const newIndex = (active.index + 1) % photos.length;
      setActive({ type: "photo", url: photos[newIndex], index: newIndex });
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Our Workspace"
        title={<>Made in <em className="italic font-light text-gold-light">Sanganer</em></>}
        subtitle="Videos and photographs from inside our Jaipur workspace — where every journal and every sheet of paper is made by hand."
      />

      {/* Tab filter */}
      <section className="sticky top-[72px] z-20 bg-cream/95 backdrop-blur border-b border-warm-grey-light/40">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 py-4 flex gap-3">
          {(["all", "videos", "photos"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`uppercase text-[11px] px-5 py-2 border transition-colors ${
                tab === t
                  ? "bg-umber text-cream border-umber"
                  : "border-warm-grey-light text-umber hover:border-umber"
              }`}
              style={{ letterSpacing: "0.15em" }}
            >
              {t === "all" ? "All" : t === "videos" ? `Videos (${videos.length})` : `Photos (${photos.length})`}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry grid */}
      <section className="bg-parchment py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">

            {/* Videos */}
            {(tab === "all" || tab === "videos") && videos.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-sm mb-3"
                style={{ aspectRatio: "16/10" }}
                onClick={() => openVideo(v.id, i)}
              >
                <img
                  src={`https://vumbnail.com/${v.id}.jpg`}
                  alt="Workspace video"
                  className="w-full h-full object-cover transition-transform duration-[2500ms] group-hover:scale-110"
                  style={{ filter: "brightness(0.7) sepia(0.1)" }}
                />
                <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/50 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center">
                    <Play size={16} className="text-ink ml-1" fill="#1A1410" />
                  </div>
                </div>
                <div
                  className="absolute top-2 left-2 bg-ink/70 text-gold text-[9px] uppercase px-2 py-0.5 rounded-full"
                  style={{ letterSpacing: "0.1em" }}
                >
                  Video
                </div>
              </motion.div>
            ))}

            {/* Photos */}
            {(tab === "all" || tab === "photos") && photos.map((url, i) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-sm mb-3"
                onClick={() => openPhoto(url, i)}
              >
                <img
                  src={url}
                  alt="Workspace photo"
                  className="w-full object-cover transition-transform duration-[2500ms] group-hover:scale-105"
                  style={{ filter: "sepia(0.08) brightness(0.95)" }}
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ImageIcon size={24} className="text-cream" />
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* ── Media Modal ── */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-4 md:p-10"
            onClick={close}
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center border border-white/20 text-cream/70 hover:text-cream rounded-full z-10 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Media */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="relative w-full max-w-5xl"
              style={{
                aspectRatio: active.type === "video" ? "16/9" : undefined,
                maxHeight: "80vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {active.type === "video" ? (
                <iframe
                  key={active.id}
                  src={`https://player.vimeo.com/video/${active.id}?autoplay=1&color=C9973A&title=0&byline=0&portrait=0`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="INS Overseas workspace"
                />
              ) : (
                <img
                  src={active.url}
                  alt="Workspace"
                  className="w-full h-full object-contain rounded-sm"
                />
              )}
            </motion.div>

            {/* Prev / Next */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-white/20 text-cream/70 hover:text-cream rounded-full transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-white/20 text-cream/70 hover:text-cream rounded-full transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
