import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/shared/PageHero";
import CraftProcess from "@/components/home/CraftProcess";
import { motion } from "framer-motion";

export const Route = createFileRoute("/our-craft")({
  head: () => ({
    meta: [
      { title: "Our Craft — How We Make Handmade Paper & Leather Journals | INS Overseas" },
      { name: "description", content: "From recycled cotton rags to finished leather journals — discover the traditional Sanganer papermaking process passed down through four generations at INS Overseas." },
      { property: "og:title", content: "Our Craft — Traditional Sanganer Papermaking" },
      { property: "og:url", content: "https://insoverseas.com/our-craft" },
    ],
  }),
  component: OurCraft,
});

const timeline = [
  ["1995", "Founded in a single workspace in Sanganer, Jaipur."],
  ["2000", "First overseas order shipped — a stationery boutique in London."],
  ["2005", "Expanded to leather journal production."],
  ["2010", "Reached 20 countries. Custom OEM line launched."],
  ["2015", "Sustainability certification process initiated."],
  ["2020", "Crossed 40 countries served, 5,000+ products shipped."],
  ["2025", "895,700+ products. New atelier wing for accessories."],
];

function OurCraft() {
  return (
    <>
      <PageHero
        eyebrow="The Atelier"
        title={<>The Craft, <em className="italic font-light text-gold-light">Step by Step</em></>}
        subtitle="Walk through our Sanganer workspace — from cotton-rag pulping to leather binding to global export."
        image="https://images.unsplash.com/photo-1597149959983-9ac80c4a9e64?auto=format&fit=crop&w=2200&q=80"
      />
      <CraftProcess />

      <section className="bg-ink text-cream py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <p className="text-gold uppercase text-[11px] mb-3" style={{ letterSpacing: "0.25em" }}>Our Journey</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.05 }}>
            Three Decades, <em className="italic font-light text-gold-light">One Atelier</em>
          </h2>
          <ol className="mt-14 space-y-10 border-l border-gold/30 pl-10">
            {timeline.map(([year, text], i) => (
              <motion.li key={year}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.06 }}
                className="relative"
              >
                <span className="absolute -left-[44px] top-2 w-3 h-3 rounded-full bg-gold" />
                <span className="text-gold-light" style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 28 }}>{year}</span>
                <p className="mt-1 text-cream/80">{text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
