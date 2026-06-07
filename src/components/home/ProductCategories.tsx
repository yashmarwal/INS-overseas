import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import SectionHeading from "@/components/shared/SectionHeading";
import { ArrowRight } from "lucide-react";
import { useSiteImage } from "@/hooks/useSiteImage";

const cats = [
  {
    title: "Leather Journals",
    desc: "Full-grain buffalo leather, hand-stitched bindings, deckle-edge pages",
    section: "category_leather_journals",
    to: "/products/leather-journals",
  },
  {
    title: "Handmade Paper",
    desc: "100% cotton rag, tree-free, fountain pen & watercolour friendly",
    section: "category_handmade_paper",
    to: "/products/handmade-paper",
  },
  {
    title: "Artisan Stationery",
    desc: "Greeting cards, envelopes, paper bags — luxury gifting essentials",
    section: "category_stationery",
    to: "/products/stationery",
  },
  {
    title: "Leather Accessories",
    desc: "Crossbody bags, travel journals, corporate leather gifts",
    section: "category_leather_accessories",
    to: "/products/leather-accessories",
  },
];

function CategoryCard({ cat, i }: { cat: (typeof cats)[0]; i: number }) {
  const img = useSiteImage(cat.section);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={cat.to} data-cursor-view className="group block relative overflow-hidden bg-ink">
        <div className="aspect-[5/4] overflow-hidden">
          <img
            src={img}
            alt={cat.title}
            className="w-full h-full object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 text-cream">
          <h3
            className="text-3xl lg:text-4xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {cat.title}
          </h3>
          <p className="mt-3 text-sm font-light text-warm-grey-light max-w-md">{cat.desc}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-gold-light uppercase text-[11px] tracking-[0.2em]">
            Explore <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProductCategories() {
  return (
    <section className="bg-parchment py-14 md:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <SectionHeading eyebrow="Our Collections" title={<>Crafted With <em className="italic font-light">Intention</em></>} />
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {cats.map((c, i) => (
            <CategoryCard key={c.title} cat={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
