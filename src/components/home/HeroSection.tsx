import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useSiteImage, refreshSiteImages } from "@/hooks/useSiteImage";
import { preloader } from "@/components/ui/Preloader";

// Stamp-reveal: clips up from below with hard mechanical ease
const stampUp = (delay: number) => ({
  initial: { y: "100%", opacity: 0 },
  animate: { y: "0%", opacity: 1 },
  transition: {
    delay,
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
});

export default function HeroSection() {
  const desktopSrc = useSiteImage("hero_desktop");
  const mobileSrc = useSiteImage("hero_mobile");
  // Fade the media in once decoded instead of painting it in strips. Keyed by the URLs so that if
  // they change (admin replaced the hero, see refreshSiteImages) the new file fades in too.
  const mediaKey = `${desktopSrc}|${mobileSrc}`;
  const [readyKey, setReadyKey] = useState("");
  const ready = readyKey === mediaKey;
  // Text enters as the splash starts sliding away (it shows 900ms, slides out over 500ms), or almost immediately when there is none.
  const [BASE] = useState(() => (preloader.active ? 1.0 : 0.15));

  // Parallax: transform-only, desktop only (phones scroll native and stay calm), off for reduced motion.
  const reduce = useReducedMotion();
  const [wide] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches);
  const parallax = wide && !reduce;
  const { scrollY } = useScroll();
  const mediaY = useTransform(scrollY, [0, 900], [0, parallax ? 150 : 0]);
  const mediaScale = parallax ? 1.12 : 1; // overscan, so the shifted photo never shows an edge
  const textY = useTransform(scrollY, [0, 700], [0, parallax ? -60 : 0]);
  const textOpacity = useTransform(scrollY, [0, 520], [1, parallax ? 0.15 : 1]);
  return (
    <section
      className="relative min-h-[74svh] md:min-h-0 md:h-screen w-full overflow-hidden bg-ink"
    >
      {/* Hero media (GIF or image) — <picture> so only the matching variant downloads */}
      <motion.div className="absolute inset-0" style={{ y: mediaY, scale: mediaScale }}>
        {desktopSrc && mobileSrc && (
          <picture key={mediaKey} className="block w-full h-full">
            <source media="(min-width: 768px)" srcSet={desktopSrc} />
            <img
              src={mobileSrc}
              alt=""
              fetchPriority="high"
              decoding="async"
              ref={(el) => { if (el?.complete && !ready) setReadyKey(mediaKey); }}
              onLoad={() => setReadyKey(mediaKey)}
              onError={() => { refreshSiteImages().finally(() => setReadyKey(mediaKey)); }}
              className="w-full h-full object-cover transition-opacity duration-700"
              style={{ filter: "brightness(0.85)", opacity: ready ? 1 : 0 }}
              data-no-round
            />
          </picture>
        )}
        {/* Dark overlay — unchanged */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(26,20,16,0.2) 0%, rgba(26,20,16,0.75) 60%, rgba(26,20,16,0.95) 100%)",
          }}
        />
      </motion.div>

      {/* Content — phones: eyebrow sits right above the headline, all at the bottom of a compact hero.
          desktop: eyebrow top, main content bottom */}
      <motion.div
        className="relative z-10 min-h-[inherit] md:min-h-0 md:h-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 flex flex-col justify-end gap-6 md:justify-between md:gap-0 pt-28 md:pt-20 pb-16 sm:pb-20"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 64px)", y: textY, opacity: textOpacity }}
      >
        {/* ── Eyebrow — always just below the nav ── */}
        <div className="flex items-center gap-3 pt-2 overflow-hidden">
          {/* Gold line draws in like a telegraph signal */}
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            transition={{ delay: BASE, duration: 0.4, ease: "easeOut" }}
            className="h-px bg-gold shrink-0"
          />
          {/* Text stamps in after line */}
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: BASE + 0.35, duration: 0.4 }}
            className="text-gold uppercase"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: "0.25em",
            }}
          >
            Handcrafted in Jaipur since 1995
          </motion.span>
        </div>

        {/* ── Main content ── */}
        <div>
          {/* H1 — line-by-line clip reveal */}
          <h1
            className="text-cream max-w-[14ch]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(48px, 8vw, 120px)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
            }}
          >
            {/* Line 1 */}
            <div className="overflow-hidden pb-[0.2em] -mb-[0.2em]">
              <motion.div {...stampUp(BASE + 0.1)}>
                Where Every Page
              </motion.div>
            </div>

            {/* Line 2 */}
            <div className="overflow-hidden mt-1 pb-[0.2em] -mb-[0.2em]">
              <motion.div {...stampUp(BASE + 0.3)}>
                Tells a{" "}
                <span
                  className="italic text-gold-light"
                  style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}
                >
                  Story
                </span>
                <span className="text-gold-light">.</span>
              </motion.div>
            </div>
          </h1>

          {/* Subtext — clean fade, no movement */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: BASE + 0.55, duration: 0.7 }}
            className="mt-6 max-w-[480px] text-[18px] leading-relaxed"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              color: "rgba(250,247,240,0.8)",
            }}
          >
            Premium handmade leather journals, artisan stationery and eco-conscious
            paper — crafted by Rajasthani artisans, shipped to 40+ countries.
          </motion.p>

          {/* CTA buttons — stamp up as a unit */}
          <div className="overflow-hidden mt-8 md:mt-10">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: BASE + 0.75, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link
                to="/products"
                className="group inline-flex items-center justify-center gap-3 bg-gold text-ink px-9 uppercase text-[12px] hover:bg-gold-light transition-colors min-h-[52px] sm:min-h-0 sm:py-4"
                style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.12em" }}
              >
                Explore Collection
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
              <Link
                to="/wholesale"
                className="hidden sm:inline-flex group items-center justify-center gap-3 border border-cream text-cream px-9 py-4 uppercase text-[12px] hover:bg-cream hover:text-ink transition-colors"
                style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.12em" }}
              >
                Wholesale Enquiry
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: BASE + 1.2, duration: 1 }}
        className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-3 z-10"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="block h-10 w-px bg-cream/60"
        />
        <span
          className="uppercase text-cream/70 text-[10px]"
          style={{ letterSpacing: "0.3em" }}
        >
          Scroll
        </span>
      </motion.div>

      {/* Torn edge */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-parchment torn-edge-bottom" />
    </section>
  );
}
