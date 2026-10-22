import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import SiteImage from "@/components/shared/SiteImage";
import { StackedCard, StackPin, StackTail, useStack } from "@/components/home/StackedCard";

// The four collections, as cards that stack while you scroll (see StackedCard).
// The photos are the "Collection cards" slots in the admin (Homepage photos).
// `moq` is the smallest minimum order in that collection (see data/catalogue.ts).
const cats = [
  {
    title: "Leather Journals",
    desc: "Full-grain buffalo leather, hand-stitched bindings, deckle-edge pages",
    section: "category_leather_journals",
    to: "/products/leather-journals",
    moq: "200",
  },
  {
    title: "Handmade Paper",
    desc: "100% cotton rag, tree-free, fountain pen & watercolour friendly",
    section: "category_handmade_paper",
    to: "/products/handmade-paper",
    moq: "200",
  },
  {
    title: "Artisan Stationery",
    desc: "Greeting cards, envelopes, paper bags — luxury gifting essentials",
    section: "category_stationery",
    to: "/products/stationery",
    moq: "200",
  },
  {
    title: "Leather Accessories",
    desc: "Crossbody bags, travel journals, corporate leather gifts",
    section: "category_leather_accessories",
    to: "/products/leather-accessories",
    moq: "150",
  },
] as const;

const WHATSAPP = "https://wa.me/919680478483";

export default function ProductCategories() {
  const { ref, progress, hold } = useStack();

  return (
    <section className="bg-parchment pt-14 md:pt-24 lg:pt-32" style={{ marginBottom: -hold }}>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <SectionHeading eyebrow="Our Collections" title={<>Crafted With <em className="italic font-light">Intention</em></>} />
        <div ref={ref} className="mt-6 md:mt-10">
          {cats.map((c, i) => (
            <StackPin key={c.title} i={i} n={cats.length} progress={progress}>
              <StackedCard
                index={i}
                total={cats.length}
                photo={<SiteImage section={c.section} alt={c.title} className="w-full h-full object-cover" />}
                photoTo={c.to}
                pill="Collection"
                title={c.title}
                desc={c.desc}
                moqLabel="MOQ from"
                moqValue={`${c.moq} pcs`}
                chatHref={`${WHATSAPP}?text=${encodeURIComponent(`Hi INS Overseas, I'd like to see your ${c.title} range. Please share the catalogue and wholesale pricing.`)}`}
                chatLabel={`Chat on WhatsApp about ${c.title}`}
                secondary={{ to: c.to, label: `See all ${c.title}`, icon: <ArrowUpRight size={19} strokeWidth={1.7} /> }}
                primary={{ label: `Explore ${c.title}`, to: c.to }}
              />
            </StackPin>
          ))}
          <StackTail hold={hold} />
        </div>
      </div>
    </section>
  );
}
