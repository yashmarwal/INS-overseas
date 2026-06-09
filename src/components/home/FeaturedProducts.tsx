import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import { useSiteImage } from "@/hooks/useSiteImage";

const products = [
  { name: "Vintage Buffalo Leather Journal",  cat: "Leather Journals",        desc: "A5, wrap-around strap, 240 deckle pages",  sectionKey: "featured_1" },
  { name: "Handmade Deckle Edge Notebook",    cat: "Handmade Paper Sheets",   desc: "Cotton rag, unlined, A5",                  sectionKey: "featured_2" },
  { name: "Leather Crossbody Bag",            cat: "Leather Bags",            desc: "Full-grain, hand-fitted brass buckles",     sectionKey: "featured_3" },
  { name: "Set of 6 Luxury Greeting Cards",   cat: "Handmade Stationery",     desc: "Cotton paper, hand-stamped",               sectionKey: "featured_4" },
  { name: "Corporate Leather Diary",          cat: "Leather Journals",        desc: "Custom embossing available",               sectionKey: "featured_5" },
  { name: "Paper Gift Bags Set (12pc)",       cat: "Handmade Paper Gift Bag", desc: "Recycled cotton, ribbon handles",           sectionKey: "featured_6" },
];

function ProductCard({ p }: { p: (typeof products)[0] }) {
  const img = useSiteImage(p.sectionKey);
  return (
    <div className="flex flex-col">
      <div className="aspect-[3/4] overflow-hidden bg-parchment-dark">
        <img
          src={img}
          alt={p.name}
          className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-110"
        />
      </div>
      <p className="mt-5 text-gold uppercase text-[11px]" style={{ letterSpacing: "0.2em" }}>{p.cat}</p>
      <h3 className="mt-2 text-ink text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
        {p.name}
      </h3>
      <p className="mt-1 text-warm-grey text-sm font-light">{p.desc}</p>
      <a
        href={`mailto:Sezan@ins-overseas.com?subject=Enquiry: ${p.name}&body=Hi INS Overseas team,%0D%0A%0D%0AI am interested in ${p.name}. Please share more details including pricing and MOQ.%0D%0A%0D%0AThank you`}
        className="inline-flex items-center gap-2 mt-3 text-umber uppercase hover:gap-3 transition-all duration-200 group"
        style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.15em" }}
      >
        Enquire
        <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
      </a>
    </div>
  );
}

export default function FeaturedProducts() {
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
                color: "var(--color-warm-grey, #9A8F85)",
              }}
            >
              SWIPE TO EXPLORE
            </span>
            <ChevronRight size={14} className="text-warm-grey" />
          </motion.div>
        </div>

        {/* Scroll container — native momentum + snap */}
        <div
          className="flex gap-5 overflow-x-auto no-scrollbar px-5 sm:px-8 lg:px-20 pb-2"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {products.map((p) => (
            <div
              key={p.name}
              className="shrink-0 w-[72vw] sm:w-[300px] md:w-auto md:flex-1"
              style={{ scrollSnapAlign: "start" }}
            >
              <ProductCard p={p} />
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
