import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/components/shared/Reveal";

// Heading entrance: the gold rule draws in, the eyebrow rises, the title slides up out of a mask (the same
// "stamp" reveal the hero uses), then the intro paragraph settles. Staggered, plays once, transform + opacity only.
const container = { hide: {}, show: { transition: { staggerChildren: 0.11 } } };
const rise = { hide: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };
const rule = { hide: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } } };
const mask = { hide: { y: "110%" }, show: { y: "0%", transition: { duration: 0.95, ease: EASE } } };

export default function SectionHeading({
  eyebrow,
  title,
  align = "center",
  light = false,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  children?: ReactNode;
}) {
  return (
    <motion.div
      variants={container}
      initial="hide"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      className={align === "center" ? "text-center" : "text-left"}
    >
      {eyebrow && (
        <motion.div variants={rise} className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
          <motion.span variants={rule} style={{ transformOrigin: "0% 50%" }} className="h-px w-10 bg-gold" />
          <span
            className={`uppercase text-[11px] ${light ? "text-gold-light" : "text-gold"}`}
            style={{ fontFamily: "var(--font-body)", fontWeight: 400, letterSpacing: "0.2em" }}
          >
            {eyebrow}
          </span>
        </motion.div>
      )}
      {/* the mask has a little padding so italic overhangs and descenders are not clipped */}
      <div className="mt-5 overflow-hidden px-2 -mx-2 pt-1 pb-2 -mb-2">
        <motion.h2
          variants={mask}
          className={light ? "text-cream" : "text-ink"}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(32px, 4vw, 60px)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </motion.h2>
      </div>
      {children && (
        <motion.p
          variants={rise}
          className={`mt-5 max-w-2xl ${align === "center" ? "mx-auto" : ""} ${light ? "text-warm-grey-light" : "text-umber"}`}
          style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 16, lineHeight: 1.7 }}
        >
          {children}
        </motion.p>
      )}
    </motion.div>
  );
}
