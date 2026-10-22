import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { EASE } from "@/components/shared/Reveal";
import SiteImage from "@/components/shared/SiteImage";
import HomeProductCard from "@/components/home/HomeProductCard";

// The six bestsellers. Their photos are the "Bestsellers" photo slots in the admin (Homepage photos).
const products = [
  { name: "Vintage Buffalo Leather Journal",  cat: "Leather Journals",        catId: "leather-journals",           sectionKey: "featured_1" },
  { name: "Handmade Deckle Edge Notebook",    cat: "Handmade Paper Sheets",   catId: "handmade-deckle-edge-paper", sectionKey: "featured_2" },
  { name: "Leather Crossbody Bag",            cat: "Leather Bags",            catId: "leather-bags",               sectionKey: "featured_3" },
  { name: "Set of 6 Luxury Greeting Cards",   cat: "Handmade Stationery",     catId: undefined,                    sectionKey: "featured_4" },
  { name: "Corporate Leather Diary",          cat: "Leather Journals",        catId: "leather-journals",           sectionKey: "featured_5" },
  { name: "Paper Gift Bags Set (12pc)",       cat: "Handmade Paper Gift Bag", catId: "handmade-paper-gift-bag",    sectionKey: "featured_6" },
];

const pad = (n: number) => String(n).padStart(2, "0");
const show = { hide: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };
const mask = { hide: { y: "112%" }, show: { y: "0%", transition: { duration: 0.95, ease: EASE } } };
const stagger = { hide: {}, show: { transition: { staggerChildren: 0.1 } } };

const titleStyle = { fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(44px, 7.2vw, 92px)", lineHeight: 0.98, letterSpacing: "-0.015em" } as const;
const arrowBtn = "w-11 h-11 rounded-full flex items-center justify-center transition-[background-color,opacity,transform] duration-200 active:scale-95 disabled:opacity-30 disabled:pointer-events-none";

export default function FeaturedProducts() {
  const row = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  // phones only: which card is in front, and how far along the row is (drives the counter and the progress bar)
  const onScroll = useCallback(() => {
    const el = row.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    const gutter = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const kids = Array.from(el.children) as HTMLElement[];
    let best = 0;
    kids.forEach((k, i) => {
      if (Math.abs(k.offsetLeft - gutter - el.scrollLeft) < Math.abs(kids[best].offsetLeft - gutter - el.scrollLeft)) best = i;
    });
    setActive(best);
  }, []);

  useEffect(() => { onScroll(); }, [onScroll]);

  const go = (dir: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    const next = Math.min(products.length - 1, Math.max(0, active + dir));
    const gutter = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    el.scrollTo({ left: (el.children[next] as HTMLElement).offsetLeft - gutter, behavior: "smooth" });
  };

  return (
    <section className="bg-parchment py-14 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <motion.div
          variants={stagger}
          initial="hide"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <div>
            <motion.div variants={show} className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="uppercase text-[11px] text-gold" style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.2em" }}>Bestsellers</span>
              <span className="uppercase text-[10px] text-umber tabular-nums lining-nums rounded-full px-2.5 py-1 bg-ink/6" style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.12em" }}>
                {pad(products.length)} pieces
              </span>
            </motion.div>

            {/* the masks have a little padding so italic overhangs and descenders are not clipped */}
            <h2 className="mt-5 text-ink">
              <span className="block overflow-hidden px-2 -mx-2 pt-1 pb-2 -mb-2">
                <motion.span variants={mask} className="block" style={titleStyle}>Most Loved</motion.span>
              </span>
              <span className="block overflow-hidden px-2 -mx-2 pt-1 pb-3 -mb-3">
                <motion.span variants={mask} className="block italic text-umber" style={titleStyle}>This Season</motion.span>
              </span>
            </h2>

            <motion.p variants={show} className="mt-5 max-w-md text-umber" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 16, lineHeight: 1.7 }}>
              Six pieces from our collection. Ask for pricing and samples on any of them.
            </motion.p>
          </div>

          {/* desktop: a link to everything */}
          <motion.div variants={show} className="hidden md:block shrink-0">
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 h-12 pl-6 pr-1.5 rounded-full bg-ink text-white uppercase hover:bg-umber-dark transition-colors duration-200"
              style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12, letterSpacing: "0.12em" }}
            >
              See all products
              <span className="w-9 h-9 rounded-full bg-gold text-ink flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5"><ArrowRight size={16} /></span>
            </Link>
          </motion.div>

          {/* phones: a live counter, progress bar and arrows for the swipe row below */}
          <motion.div variants={show} className="md:hidden flex items-center gap-4">
            <div className="flex items-baseline gap-1.5 tabular-nums lining-nums shrink-0" aria-live="polite">
              <span className="text-ink" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 30, lineHeight: 1 }}>{pad(active + 1)}</span>
              <span className="text-umber/70" style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 13 }}>/ {pad(products.length)}</span>
            </div>
            <div className="relative flex-1 h-px bg-ink/15" aria-hidden>
              <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-gold origin-left transition-transform duration-200" style={{ transform: `translateY(-50%) scaleX(${0.16 + progress * 0.84})` }} />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button type="button" onClick={() => go(-1)} disabled={active === 0} aria-label="Previous piece" className={`${arrowBtn} bg-white text-ink shadow-[inset_0_0_0_1px_rgba(26,20,16,0.14)]`}>
                <ChevronLeft size={19} />
              </button>
              <button type="button" onClick={() => go(1)} disabled={active === products.length - 1} aria-label="Next piece" className={`${arrowBtn} bg-ink text-white`}>
                <ChevronRight size={19} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-8 md:mt-12 relative">
        {/* Phones: swipe sideways with snap. From tablets up: a calm grid of three. */}
        <div
          ref={row}
          onScroll={onScroll}
          className="flex gap-4 overflow-x-auto no-scrollbar px-5 sm:px-8 scroll-pl-5 sm:scroll-pl-8 pb-12 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:max-w-[1400px] md:mx-auto lg:px-20"
          style={{ WebkitOverflowScrolling: "touch", scrollSnapType: "x mandatory" }}
        >
          {products.map((p) => (
            <div
              key={p.name}
              className="shrink-0 w-[78vw] max-w-[330px] md:w-auto md:max-w-none"
              style={{ scrollSnapAlign: "start" }}
            >
              <HomeProductCard
                name={p.name}
                category={p.cat}
                categoryId={p.catId}
                image={<SiteImage section={p.sectionKey} alt={p.name} className="w-full h-full object-cover" />}
              />
            </div>
          ))}
        </div>

        {/* Right fade edge — signals more content on mobile */}
        <div
          className="md:hidden absolute top-0 right-0 w-12 h-full pointer-events-none z-10"
          style={{ background: "linear-gradient(to left, #F5EFE0 0%, transparent 100%)" }}
        />
      </div>
    </section>
  );
}
