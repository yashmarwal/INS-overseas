import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/shared/PageHero";
import SustainabilitySection from "@/components/home/SustainabilitySection";
import SectionHeading from "@/components/shared/SectionHeading";
import { motion } from "framer-motion";
import { SITE_URL } from "@/lib/seo";

const CANONICAL = `${SITE_URL}/sustainability`;
const TITLE = "Sustainability — Eco-Friendly Handmade Paper | INS Overseas";
const DESCRIPTION =
  "100% recycled cotton rag paper, no trees, no harsh chemicals. INS Overseas champions eco-friendly papermaking with zero-waste manufacturing in Sanganer, Jaipur.";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { property: "og:title", content: "Sustainability — Eco-Friendly Handmade Paper Manufacturing" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Eco-friendly handmade paper manufacturing at INS Overseas — zero trees, 100% recycled cotton" },
      { property: "og:site_name", content: "INS Overseas" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@ins_overseas" },
      { name: "twitter:title", content: "Sustainability — Eco-Friendly Paper Manufacturing" },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
      { name: "twitter:image:alt", content: "Eco-friendly handmade paper at INS Overseas" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${CANONICAL}#webpage`,
              "name": TITLE,
              "description": DESCRIPTION,
              "url": CANONICAL,
              "about": {
                "@type": "Thing",
                "name": "Sustainable handmade paper manufacturing",
                "description": "100% recycled cotton rag paper production, zero trees, no harsh chemicals, water recycling — INS Overseas, Sanganer, Jaipur.",
              },
              "publisher": { "@id": `${SITE_URL}/#organization` },
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
                { "@type": "ListItem", "position": 2, "name": "Sustainability", "item": CANONICAL },
              ],
            },
          ],
        }),
      },
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
