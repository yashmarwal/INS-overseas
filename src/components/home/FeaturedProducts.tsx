import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import SiteImage from "@/components/shared/SiteImage";
import { PRODUCT_CATEGORIES, productsQuery, tagLabel } from "@/hooks/useProductImages";

// The homepage "Most Loved" row. It shows the products ticked "Show on the homepage" in the admin (up to 6, in the
// admin's order). Until some are ticked it keeps showing the six classic cards below, so nothing is ever empty.
type Card = { key: string; name: string; cat: string; desc: string; tag?: string | null; image?: string; sectionKey?: string };

const classic: Card[] = [
  { key: "f1", name: "Vintage Buffalo Leather Journal",  cat: "Leather Journals",        desc: "A5, wrap-around strap, 240 deckle pages",  sectionKey: "featured_1" },
  { key: "f2", name: "Handmade Deckle Edge Notebook",    cat: "Handmade Paper Sheets",   desc: "Cotton rag, unlined, A5",                  sectionKey: "featured_2" },
  { key: "f3", name: "Leather Crossbody Bag",            cat: "Leather Bags",            desc: "Full-grain, hand-fitted brass buckles",     sectionKey: "featured_3" },
  { key: "f4", name: "Set of 6 Luxury Greeting Cards",   cat: "Handmade Stationery",     desc: "Cotton paper, hand-stamped",               sectionKey: "featured_4" },
  { key: "f5", name: "Corporate Leather Diary",          cat: "Leather Journals",        desc: "Custom embossing available",               sectionKey: "featured_5" },
  { key: "f6", name: "Paper Gift Bags Set (12pc)",       cat: "Handmade Paper Gift Bag", desc: "Recycled cotton, ribbon handles",           sectionKey: "featured_6" },
];

const catLabel = (id: string) => PRODUCT_CATEGORIES.find((c) => c.id === id)?.label ?? id;

function ProductCard({ p }: { p: Card }) {
  const tag = tagLabel(p.tag);
  return (
    <div className="flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-parchment-dark">
        {p.image ? (
          <img src={p.image} alt={p.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-110" />
        ) : (
          <SiteImage section={p.sectionKey!} alt={p.name} className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-110" />
        )}
        {tag && (
          <span
            className={`absolute top-3 left-3 uppercase px-3 py-1.5 rounded-full shadow-[0_1px_4px_rgba(26,20,16,0.2)] ${p.tag === "best" ? "bg-gold text-ink" : "bg-ink text-cream"}`}
            style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 10, letterSpacing: "0.12em" }}
          >
            {tag}
          </span>
        )}
      </div>
      <p className="mt-5 text-gold uppercase text-[11px]" style={{ letterSpacing: "0.2em" }}>{p.cat}</p>
      <h3 className="mt-2 text-ink text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
        {p.name}
      </h3>
      {p.desc && <p className="mt-1 text-warm-grey text-sm font-light">{p.desc}</p>}
      <a
        href={`mailto:Sezan@ins-overseas.com?subject=${encodeURIComponent(`Enquiry: ${p.name}`)}&body=${encodeURIComponent(`Hi INS Overseas team,\r\n\r\nI am interested in ${p.name}. Please share more details including pricing and MOQ.\r\n\r\nThank you`)}`}
        className="inline-flex items-center gap-2 mt-3 text-umber uppercase hover:gap-3 transition-all duration-200 group"
        style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.15em" }}
      >
        Enquire
        <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
      </a>
    </div>
  );
}

/** Same footprint as a real card, so the row never changes size when the products arrive. */
function CardSkeleton() {
  return (
    <div className="flex flex-col" aria-hidden>
      <div className="aspect-[3/4] bg-parchment-dark" />
      <div className="mt-5 h-3 w-24 bg-parchment-dark" />
      <div className="mt-3 h-6 w-4/5 bg-parchment-dark" />
      <div className="mt-2 h-4 w-3/5 bg-parchment-dark" />
      <div className="mt-4 h-3 w-16 bg-parchment-dark" />
    </div>
  );
}

export default function FeaturedProducts() {
  const q = useQuery(productsQuery()); // shared with the Products page; pre-fetched when the browser is idle
  const picked: Card[] = (q.data ?? [])
    .filter((p) => p.featured)
    .slice(0, 6)
    .map((p) => ({
      key: p.id,
      name: p.product_name || "Handmade Product",
      cat: catLabel(p.category),
      desc: p.alt_text && p.alt_text.trim().toLowerCase() !== (p.product_name || "").trim().toLowerCase() ? p.alt_text : "",
      tag: p.tag,
      image: p.url,
    }));
  const loading = q.isPending;
  const cards = picked.length > 0 ? picked : classic;

  return (
    <section className="bg-parchment py-14 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <SectionHeading eyebrow="Bestsellers" title={<>Most Loved <em className="italic font-light">This Season</em></>} />
      </div>

      <div className="mt-10 relative">
        {/* Swipe hint — mobile only */}
        <div className="md:hidden flex items-center justify-center gap-2 mb-5">
          <motion.div
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={14} className="text-warm-grey" />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                letterSpacing: "0.15em",
                color: "var(--grey-ink)",
              }}
            >
              SWIPE TO EXPLORE
            </span>
            <ChevronRight size={14} className="text-warm-grey" />
          </motion.div>
        </div>

        {/* Scroll container — native momentum + snap */}
        <div
          className="flex gap-5 overflow-x-auto no-scrollbar px-5 sm:px-8 lg:px-20 pb-2 md:justify-center"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {(loading ? classic : cards).map((p) => (
            <div
              key={p.key}
              className="shrink-0 w-[72vw] sm:w-[300px] md:w-[calc((100%-6.25rem)/6)]" /* desktop: one sixth of the row, so 2 or 6 cards are the same size */
              style={{ scrollSnapAlign: "start" }}
            >
              {loading ? <CardSkeleton /> : <ProductCard p={p} />}
            </div>
          ))}
        </div>

        {/* Right fade edge — signals more content on mobile */}
        <div
          className="md:hidden absolute top-0 right-0 w-12 h-full pointer-events-none z-10"
          style={{
            background: "linear-gradient(to left, #F5EFE0 0%, transparent 100%)",
          }}
        />
      </div>
    </section>
  );
}
