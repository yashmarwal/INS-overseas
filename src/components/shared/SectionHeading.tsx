import { motion } from "framer-motion";
import type { ReactNode } from "react";

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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={align === "center" ? "text-center" : "text-left"}
    >
      {eyebrow && (
        <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
          <span className="h-px w-10 bg-gold" />
          <span
            className={`uppercase text-[11px] ${light ? "text-gold-light" : "text-gold"}`}
            style={{ fontFamily: "var(--font-body)", fontWeight: 400, letterSpacing: "0.2em" }}
          >
            {eyebrow}
          </span>
        </div>
      )}
      <h2
        className={`mt-5 ${light ? "text-cream" : "text-ink"}`}
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          fontSize: "clamp(32px, 4vw, 60px)",
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      {children && (
        <p
          className={`mt-5 max-w-2xl ${align === "center" ? "mx-auto" : ""} ${light ? "text-warm-grey-light" : "text-umber"}`}
          style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 16, lineHeight: 1.7 }}
        >
          {children}
        </p>
      )}
    </motion.div>
  );
}
