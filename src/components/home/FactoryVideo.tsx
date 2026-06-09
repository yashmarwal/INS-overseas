import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

// ── ADD ALL VIMEO IDs HERE ──
// e.g. https://vimeo.com/123456789 → id: "123456789"
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

type Video = typeof videos[number];

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function FactoryVideo() {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const openVideo = (video: Video, index: number) => {
    setActiveVideo(video);
    setActiveIndex(index);
  };

  const goPrev = () => {
    const newIndex = (activeIndex - 1 + videos.length) % videos.length;
    setActiveVideo(videos[newIndex]);
    setActiveIndex(newIndex);
  };

  const goNext = () => {
    const newIndex = (activeIndex + 1) % videos.length;
    setActiveVideo(videos[newIndex]);
    setActiveIndex(newIndex);
  };

  return (
    <section className="bg-ink py-20 md:py-28 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">

        {/* Section heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-gold" />
              <span
                className="text-gold uppercase"
                style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 11, letterSpacing: "0.25em" }}
              >
                Inside Our Workspace
              </span>
            </div>
            <h2
              className="text-cream"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(32px, 4vw, 58px)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              Watch Us Make It.<br />
              <em className="italic font-light text-gold-light">Every Step, By Hand.</em>
            </h2>
          </div>
          <p
            className="text-warm-grey max-w-xs md:text-right leading-relaxed"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, lineHeight: 1.8 }}
          >
            From cotton rags to finished journals — our Sanganer workspace, captured on film.
          </p>
        </div>

        {/* Featured first video — large */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative cursor-pointer group mb-4 overflow-hidden"
          style={{ aspectRatio: "16/7" }}
          onClick={() => openVideo(videos[0], 0)}
        >
          <img
            src={`https://vumbnail.com/${videos[0].id}.jpg`}
            alt="INS Overseas workspace video"
            className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105"
            style={{ filter: "brightness(0.65) sepia(0.15)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(26,20,16,0.5) 0%, rgba(26,20,16,0.1) 60%)" }}
          />
          {/* Corner accents */}
          <div className="absolute top-5 left-5 w-8 h-8 border-t border-l border-gold/50" />
          <div className="absolute top-5 right-5 w-8 h-8 border-t border-r border-gold/50" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 rounded-full bg-gold/80 group-hover:bg-gold flex items-center justify-center shadow-2xl transition-colors duration-300"
            >
              <Play size={28} className="text-ink ml-2" fill="#1A1410" />
            </motion.div>
          </div>
        </motion.div>

        {/* Remaining videos — grid */}
        {videos.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {videos.slice(1).map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="relative cursor-pointer group overflow-hidden"
                style={{ aspectRatio: "16/10" }}
                onClick={() => openVideo(video, i + 1)}
              >
                <img
                  src={`https://vumbnail.com/${video.id}.jpg`}
                  alt="INS Overseas workspace video"
                  className="w-full h-full object-cover transition-transform duration-[2500ms] group-hover:scale-110"
                  style={{ filter: "brightness(0.6) sepia(0.15)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "rgba(26,20,16,0.3)" }}
                />
                {/* Play icon — appears on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-gold/80 flex items-center justify-center">
                    <Play size={16} className="text-ink ml-1" fill="#1A1410" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-ink/97 flex flex-col items-center justify-center p-4 md:p-8"
            onClick={() => setActiveVideo(null)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setActiveVideo(null);
              if (e.key === "ArrowLeft") goPrev();
              if (e.key === "ArrowRight") goNext();
            }}
            tabIndex={-1}
          >
            {/* Close */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center text-cream/60 hover:text-cream transition-colors z-10 border border-cream/20 rounded-full"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Player */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="relative w-full max-w-5xl shadow-2xl"
              style={{ aspectRatio: "16/9" }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                key={activeVideo.id}
                src={`https://player.vimeo.com/video/${activeVideo.id}?autoplay=1&color=C9973A&title=0&byline=0&portrait=0&badge=0`}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="INS Overseas workspace video"
              />
            </motion.div>

            {/* Nav */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-6 mt-5"
            >
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="flex items-center gap-2 text-warm-grey hover:text-cream transition-colors"
                style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.1em" }}
              >
                <ChevronLeft size={16} />
                <span className="hidden md:inline uppercase">Previous</span>
              </button>

              {/* Dot indicators */}
              <div className="flex gap-2 items-center">
                {videos.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); openVideo(videos[i], i); }}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === activeIndex ? "bg-gold w-6" : "bg-warm-grey/40 w-1.5 hover:bg-warm-grey"
                    }`}
                    aria-label={`Video ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="flex items-center gap-2 text-warm-grey hover:text-cream transition-colors"
                style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.1em" }}
              >
                <span className="hidden md:inline uppercase">Next</span>
                <ChevronRight size={16} />
              </button>
            </motion.div>

            <p className="text-warm-grey/40 mt-3 text-center" style={{ fontFamily: "var(--font-body)", fontSize: 11 }}>
              {activeIndex + 1} / {videos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
