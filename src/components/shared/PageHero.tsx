import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-32 bg-ink text-cream overflow-hidden">
      {image && (
        <div className="absolute inset-0 opacity-40">
          <img src={image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 to-ink" />
        </div>
      )}
      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
            className="flex items-center gap-3"
          >
            <span className="h-px w-10 bg-gold" />
            <span className="text-gold uppercase text-[11px]" style={{ letterSpacing: "0.25em" }}>{eyebrow}</span>
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.9 }}
          className="mt-6 max-w-4xl"
          style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(40px, 6vw, 96px)", lineHeight: 1.02, letterSpacing: "-0.02em" }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-7 max-w-2xl text-cream/80 text-lg font-light leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-parchment torn-edge-bottom" />
    </section>
  );
}
