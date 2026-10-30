import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import { revealProps } from "@/components/shared/Reveal";
import type { Heading, InfoBlock } from "@/data/copy";

// A plain text section: short blocks of words under their own headings, in two columns on wide screens. Used for the practical
// information on the Wholesale, Manufacturing, Contact and Gallery pages. The words live in src/data/copy.ts.
const link = "text-umber underline underline-offset-4 decoration-gold/60 hover:text-gold transition-colors";

export default function InfoSection({
  blocks,
  eyebrow,
  title,
  level = 2,
  tone = "cream",
}: {
  blocks: InfoBlock[];
  eyebrow?: string;
  title?: Heading;
  /** the heading level of each block's title: 3 when the section has a title of its own, otherwise 2 */
  level?: 2 | 3;
  /** the section's background (use "parchment" under a cream section) */
  tone?: "cream" | "parchment";
}) {
  const H = level === 2 ? "h2" : "h3";
  return (
    <section className={`${tone === "parchment" ? "bg-parchment" : "bg-cream"} py-16 md:py-24`}>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        {title && <SectionHeading eyebrow={eyebrow} title={<>{title.plain}{title.em && <> <em className="italic font-light">{title.em}</em></>}</>} />}
        <div className={`${title ? "mt-14 " : ""}grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl mx-auto`}>
          {blocks.map((b, i) => (
            <motion.div key={b.title} {...revealProps(20, (i % 2) * 0.08)}>
              <H className="text-ink" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 24, lineHeight: 1.2 }}>{b.title}</H>
              {b.p?.map((t) => (
                <p key={t} className="mt-3 text-umber-dark" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 16, lineHeight: 1.85 }}>{t}</p>
              ))}
              {b.items && (
                <ul className="mt-3 space-y-2 text-umber-dark" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 16, lineHeight: 1.7 }}>
                  {b.items.map((it) => (
                    <li key={it.to}><Link to={it.to} className={link}>{it.label}</Link> — {it.text}</li>
                  ))}
                </ul>
              )}
              {b.links && (
                <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1" style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 15 }}>
                  {b.links.map(([label, to]) => (
                    <Link key={to} to={to} className={link}>{label}</Link>
                  ))}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
