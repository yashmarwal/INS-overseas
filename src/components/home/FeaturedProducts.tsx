import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import EditorialHeading, { headingLinkCls, headingLinkStyle } from "@/components/shared/EditorialHeading";
import SiteImage from "@/components/shared/SiteImage";
import TornTop from "@/components/shared/TornTop";
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
    <section className="relative bg-parchment py-14 md:py-24 lg:py-32 overflow-hidden">
      <TornTop color="#566A4B" />
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <EditorialHeading
          eyebrow="Bestsellers"
          count={`${pad(products.length)} pieces`}
          line1="Most Loved"
          line2="This Season"
          intro="Six pieces from our collection. Ask for pricing and samples on any of them."
          aside={
            <>
              {/* desktop: a link to everything */}
              <Link to="/products" className={`${headingLinkCls} max-md:hidden`} style={headingLinkStyle}>
                See all products
                <span className="w-9 h-9 rounded-full bg-gold text-ink flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5"><ArrowRight size={16} /></span>
              </Link>

              {/* phones: a live counter, progress bar and arrows for the swipe row below */}
              <div className="md:hidden flex items-center gap-4">
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
              </div>
            </>
          }
        />
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
                hoverImage={<SiteImage section={`${p.sectionKey}_hover`} alt="" className="w-full h-full object-cover" />}
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
