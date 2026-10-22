import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
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
                color: "var(--grey-ink)",
              }}
            >
              SWIPE TO EXPLORE
            </span>
            <ChevronRight size={14} className="text-warm-grey" />
          </motion.div>
        </div>

        {/* Phones: swipe sideways with snap. From tablets up: a calm grid of three. */}
        <div
          className="flex gap-4 overflow-x-auto no-scrollbar px-5 sm:px-8 pb-6 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:max-w-[1400px] md:mx-auto lg:px-20"
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
