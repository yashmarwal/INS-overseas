import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useSiteImage } from "@/hooks/useSiteImage";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 320]);
  const heroImg = useSiteImage("hero_main");

  return (
    <section ref={ref} className="relative h-[100svh] md:h-screen w-full overflow-hidden bg-ink">
      <motion.div style={{ y }} className="absolute inset-0 -top-20 -bottom-20">
        <img
          src={heroImg}
          alt="Leather journals on aged wood"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 md:bg-[linear-gradient(to_bottom,rgba(26,20,16,0.35)_0%,rgba(26,20,16,0.7)_100%)]"
          style={{ background: "linear-gradient(to bottom, rgba(26,20,16,0.2) 0%, rgba(26,20,16,0.75) 60%, rgba(26,20,16,0.95) 100%)" }}
        />
      </motion.div>

      <div
        className="relative z-10 h-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 flex flex-col justify-end pb-20 md:justify-center md:pb-0 pt-20 md:pt-0"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 80px)" }}
      >
        {/* Eyebrow — desktop only, above H1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="hidden md:flex items-center gap-3 mb-8"
        >
          <span className="h-px w-10 bg-gold" />
          <span
            className="text-gold uppercase"
            style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 11, letterSpacing: "0.25em" }}
          >
            Handcrafted in Jaipur since 1995
          </span>
        </motion.div>

        <h1
          className="text-cream max-w-[14ch]"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(48px, 8vw, 120px)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {"Where Every Page".split(" ").map((w, i) => (
            <motion.span
              key={i}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block mr-[0.25em]"
            >
              {w}
            </motion.span>
          ))}
          <br />
          <motion.span
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block mr-[0.25em]"
          >
            Tells a
          </motion.span>
          <motion.span
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.58, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block italic text-gold-light"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}
          >
            Story
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.72 }}
            className="text-gold-light"
          >
            .
          </motion.span>
        </h1>

        {/* Eyebrow — mobile only, below H1 so it never collides with nav */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="flex md:hidden items-center gap-3 mt-4"
        >
          <span className="h-px w-8 bg-gold" />
          <span
            className="text-gold uppercase"
            style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 10, letterSpacing: "0.2em" }}
          >
            Handcrafted in Jaipur since 1995
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8 max-w-[480px] text-[18px] leading-relaxed"
          style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "rgba(250,247,240,0.8)" }}
        >
          Premium handmade leather journals, artisan stationery and eco-conscious paper —
          crafted by Rajasthani artisans, shipped to 40+ countries.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-3 z-10"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="block h-10 w-px bg-cream/60"
        />
        <span className="uppercase text-cream/70 text-[10px]" style={{ letterSpacing: "0.3em" }}>
          Scroll
        </span>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-parchment torn-edge-bottom" />
    </section>
  );
}
