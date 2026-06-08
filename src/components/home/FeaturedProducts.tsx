import { motion } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import { useSiteImage } from "@/hooks/useSiteImage";

const products = [
  { name: "Vintage Buffalo Leather Journal",  cat: "Leather Journals",         desc: "A5, wrap-around strap, 240 deckle pages",         sectionKey: "featured_1" },
  { name: "Handmade Deckle Edge Notebook",     cat: "Handmade Paper Sheets",    desc: "Cotton rag, unlined, A5",                         sectionKey: "featured_2" },
  { name: "Leather Crossbody Bag",             cat: "Leather Bags",             desc: "Full-grain, hand-fitted brass buckles",            sectionKey: "featured_3" },
  { name: "Set of 6 Luxury Greeting Cards",    cat: "Handmade Stationery",      desc: "Cotton paper, hand-stamped",                      sectionKey: "featured_4" },
  { name: "Corporate Leather Diary",           cat: "Leather Journals",         desc: "Custom embossing available",                      sectionKey: "featured_5" },
  { name: "Paper Gift Bags Set (12pc)",        cat: "Handmade Paper Gift Bag",  desc: "Recycled cotton, ribbon handles",                  sectionKey: "featured_6" },
];

function ProductItem({ p, i }: { p: (typeof products)[0]; i: number }) {
  const img = useSiteImage(p.sectionKey);
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: i * 0.06 }}
      className="snap-start shrink-0 w-[85vw] sm:w-[360px]"
    >
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
      <button
        className="mt-4 border border-umber text-umber text-[11px] uppercase px-5 py-2.5 hover:bg-umber hover:text-cream transition-colors"
        style={{ letterSpacing: "0.15em" }}
      >
        Enquire
      </button>
    </motion.article>
  );
}

export default function FeaturedProducts() {
  return (
    <section className="bg-parchment py-14 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <SectionHeading eyebrow="Bestsellers" title={<>Most Loved <em className="italic font-light">This Season</em></>} />
        {/* Swipe hint — mobile only */}
        <div className="flex md:hidden items-center gap-2 mt-3">
          <motion.span
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-warm-grey"
            style={{ fontSize: 16 }}
          >
            ←→
          </motion.span>
          <span
            className="text-warm-grey"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 12, letterSpacing: "0.08em" }}
          >
            Swipe to explore
          </span>
        </div>
      </div>
      <div className="mt-10 md:mt-16 overflow-x-auto no-scrollbar">
        <div className="flex gap-6 px-5 sm:px-8 lg:px-20 pb-4 snap-x snap-mandatory">
          {products.map((p, i) => (
            <ProductItem key={p.name} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
