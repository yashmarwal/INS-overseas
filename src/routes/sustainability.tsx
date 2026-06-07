import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/shared/PageHero";
import SustainabilitySection from "@/components/home/SustainabilitySection";
import SectionHeading from "@/components/shared/SectionHeading";
import { motion } from "framer-motion";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability | INS Overseas — Tree-Free Cotton Rag Paper" },
      { name: "description", content: "Our paper is 100% cotton rag, made from textile industry waste. Zero deforestation, chemical-free, zero-waste manufacturing." },
    ],
  }),
  component: Sust,
});

const stats = [
  { value: "0", label: "Trees Cut" },
  { value: "300+", label: "Tonnes Textile Waste Repurposed" },
  { value: "100%", label: "Chemical-Free Paper" },
];

function Sust() {
  return (
    <>
      <PageHero
        eyebrow="Sustainability"
        title={<>Making Beautiful Things<br /><em className="italic font-light text-gold-light">Without Costing the Earth</em></>}
        subtitle="Every sheet of paper we make starts as discarded cotton from Jaipur's textile mills."
        image="https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=2200&q=80"
      />
      <section className="bg-cream py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-6 text-umber-dark leading-relaxed" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 17 }}>
          <p>
            The textile mills around Jaipur produce tonnes of cotton offcuts every year. For three
            decades, we have been collecting that waste, cleaning it, pulping it, and turning it into
            paper of remarkable warmth and texture.
          </p>
          <p>
            No trees are felled. No chlorine, no acids. The water we use is recycled back into the vats.
            Every offcut from our binding floor returns to the pulp.
          </p>
        </div>
      </section>
      <SustainabilitySection />
      <section className="bg-parchment py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
          <SectionHeading eyebrow="Our Impact" title={<>By the <em className="italic font-light">Numbers</em></>} />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-cream p-10 border-t-2 border-gold"
              >
                <p className="text-gold" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: 64, lineHeight: 1 }}>{s.value}</p>
                <p className="mt-4 uppercase text-umber text-xs" style={{ letterSpacing: "0.2em" }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
