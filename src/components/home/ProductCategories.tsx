import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import EditorialHeading from "@/components/shared/EditorialHeading";
import SiteImage from "@/components/shared/SiteImage";
import { StackedCard, StackPin, StackTail, useStack } from "@/components/home/StackedCard";
import { absoluteUrl } from "@/lib/share";
import { homeCopy } from "@/data/copy";

// The four collections, as cards that stack while you scroll (see StackedCard).
// The photos are the "Collection cards" slots in the admin (Homepage photos).
// `moq` is the smallest minimum order in that collection (see data/catalogue.ts).
const sections = ["category_leather_journals", "category_handmade_paper", "category_stationery", "category_leather_accessories"];
const cats = homeCopy.collections.cards.map((c, i) => ({ ...c, section: sections[i] }));

const WHATSAPP = "https://wa.me/919680478483";

export default function ProductCategories() {
  const { ref, progress, hold } = useStack();

  return (
    <section className="bg-parchment pt-14 md:pt-24 lg:pt-32" style={{ marginBottom: -hold }}>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <EditorialHeading eyebrow={homeCopy.collections.eyebrow} count={`${String(cats.length).padStart(2, "0")} collections`} line1={homeCopy.collections.line1} line2={homeCopy.collections.line2} intro={homeCopy.collections.intro} />
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
                chatHref={`${WHATSAPP}?text=${encodeURIComponent(`Hi INS Overseas, I'd like to see your ${c.title} range. Please share the catalogue and wholesale pricing.
${absoluteUrl(c.to)}`)}`}
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
