import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

// ── Replace this with the real Vimeo video ID ──
// e.g. for https://vimeo.com/123456789 the ID is 123456789
const VIMEO_ID = "YOUR_VIMEO_ID_HERE";

export default function FactoryVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="bg-ink py-0 overflow-hidden">

      {/* Editorial layout — full bleed dark section */}
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

          {/* Left — text column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-16 lg:py-24"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-10 bg-gold" />
              <span
                className="text-gold uppercase"
                style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 11, letterSpacing: "0.25em" }}
              >
                Inside Our Workspace
              </span>
            </div>

            {/* Heading */}
            <h2
              className="text-cream mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(32px, 4vw, 58px)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              Where Every Sheet<br />
              <em className="italic font-light text-gold-light">
                is Born by Hand
              </em>
            </h2>

            {/* Body */}
            <p
              className="text-warm-grey-light mb-10 leading-relaxed max-w-md"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 16, lineHeight: 1.8 }}
            >
              Step inside our Sanganer workspace — where four generations
              of craft tradition meet the hands of 25 dedicated artisans.
              From raw cotton rags pulled into paper sheets, to leather
              hand-stitched around every spine. This is how we make it.
            </p>

            {/* Play CTA */}
            <motion.button
              onClick={() => setPlaying(true)}
              className="inline-flex items-center gap-4 group w-fit"
            >
              {/* Play circle */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-14 h-14 rounded-full border border-gold flex items-center justify-center shrink-0"
              >
                {/* Pulse ring */}
                <motion.span
                  className="absolute inset-0 rounded-full border border-gold"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
                <Play size={18} className="text-gold ml-1" fill="#C9973A" />
              </motion.div>

              <div className="text-left">
                <p
                  className="text-cream uppercase"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12, letterSpacing: "0.18em" }}
                >
                  Watch the Film
                </p>
                <p
                  className="text-warm-grey"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 12 }}
                >
                  3 minutes · Our workspace, Jaipur
                </p>
              </div>
            </motion.button>
          </motion.div>

          {/* Right — video thumbnail */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="relative cursor-pointer overflow-hidden min-h-[400px] lg:min-h-0"
            onClick={() => setPlaying(true)}
          >
            {/* Vimeo thumbnail */}
            <img
              src={`https://vumbnail.com/${VIMEO_ID}.jpg`}
              alt="INS Overseas workspace — watch the film"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.7) sepia(0.2)" }}
            />

            {/* Dark overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(26,20,16,0.6) 0%, rgba(26,20,16,0.2) 100%)"
              }}
            />

            {/* Large play button centered on thumbnail */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full bg-gold/90 flex items-center justify-center shadow-2xl"
              >
                <Play size={28} className="text-ink ml-2" fill="#1A1410" />
              </motion.div>
            </div>

            {/* Bottom label */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p
                className="text-cream uppercase"
                style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 10, letterSpacing: "0.25em" }}
              >
                Sanganer, Jaipur · Est. 1995
              </p>
            </div>

            {/* Editorial corner accents */}
            <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-gold/40" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-gold/40" />
          </motion.div>

        </div>
      </div>

      {/* ── Video Player Modal ── */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setPlaying(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setPlaying(false)}
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-cream/70 hover:text-cream transition-colors z-10"
              aria-label="Close video"
            >
              <X size={24} />
            </button>

            {/* Video container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="relative w-full max-w-5xl"
              style={{ aspectRatio: "16/9" }}
              onClick={e => e.stopPropagation()}
            >
              <iframe
                src={`https://player.vimeo.com/video/${VIMEO_ID}?autoplay=1&color=C9973A&title=0&byline=0&portrait=0&badge=0`}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="INS Overseas — Inside Our Workspace"
              />
            </motion.div>

            {/* Caption */}
            <p
              className="absolute bottom-6 text-warm-grey text-center"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 12, letterSpacing: "0.1em" }}
            >
              Press ESC or click outside to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
