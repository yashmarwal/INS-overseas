import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/components/shared/Reveal";

// The homepage's section header: left-aligned, a small eyebrow (optionally with a count chip), a two-line title whose
// second line is italic, one line of copy, and an optional slot on the right for a link or controls.
// The title lines rise out of a mask, the eyebrow and copy rise and fade; staggered, plays once, transform + opacity only.
const show = { hide: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };
const mask = { hide: { y: "112%" }, show: { y: "0%", transition: { duration: 0.95, ease: EASE } } };
const stagger = { hide: {}, show: { transition: { staggerChildren: 0.1 } } };

const titleStyle = { fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(42px, 6.4vw, 84px)", lineHeight: 0.98, letterSpacing: "-0.015em" } as const;

export default function EditorialHeading({
  eyebrow,
  count,
  line1,
  line2,
  intro,
  light = false,
  id,
  aside,
  className = "",
}: {
  eyebrow: string;
  count?: string;
  line1: ReactNode;
  line2: ReactNode;
  intro?: ReactNode;
  light?: boolean;
  id?: string;
  /** right-hand slot (desktop) / below the copy (phones): a link, or the carousel controls */
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={stagger}
      initial="hide"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      className={`flex flex-col md:flex-row md:items-end md:justify-between gap-8 ${className}`}
    >
      <div>
        <motion.div variants={show} className="flex items-center gap-3">
          <span className={`h-px w-10 ${light ? "bg-gold-light" : "bg-gold"}`} />
          <span className={`uppercase text-[11px] ${light ? "text-gold-light" : "text-gold"}`} style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.2em" }}>{eyebrow}</span>
          {count && (
            <span
              className={`uppercase text-[10px] tabular-nums lining-nums rounded-full px-2.5 py-1 ${light ? "text-cream/80 bg-cream/10" : "text-umber bg-ink/6"}`}
              style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.12em" }}
            >
              {count}
            </span>
          )}
        </motion.div>

        {/* the masks have a little padding so italic overhangs and descenders are not clipped */}
        <h2 id={id} className={`mt-5 ${light ? "text-cream" : "text-ink"}`}>
          <span className="block overflow-hidden px-2 -mx-2 pt-1 pb-2 -mb-2">
            <motion.span variants={mask} className="block" style={titleStyle}>{line1}</motion.span>
          </span>
          {" "}
          <span className="block overflow-hidden px-2 -mx-2 pt-1 pb-3 -mb-3">
            <motion.span variants={mask} className={`block italic ${light ? "text-gold-light" : "text-umber"}`} style={titleStyle}>{line2}</motion.span>
          </span>
        </h2>

        {intro && (
          <motion.p
            variants={show}
            className={`mt-5 max-w-md ${light ? "text-warm-grey-light" : "text-umber"}`}
            style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 16, lineHeight: 1.7 }}
          >
            {intro}
          </motion.p>
        )}
      </div>

      {aside && <motion.div variants={show} className="shrink-0">{aside}</motion.div>}
    </motion.div>
  );
}

/** Classes for the dark pill link that sits in the header’s right-hand slot (use on a router <Link>). */
export const headingLinkCls = "group inline-flex items-center gap-3 h-12 pl-6 pr-1.5 rounded-full uppercase bg-ink text-white hover:bg-umber-dark transition-colors duration-200";
export const headingLinkStyle = { fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12, letterSpacing: "0.12em" } as const;
