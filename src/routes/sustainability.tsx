import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/shared/PageHero";
import SustainabilitySection from "@/components/home/SustainabilitySection";
import SectionHeading from "@/components/shared/SectionHeading";
import { motion } from "framer-motion";
import { SITE_URL } from "@/lib/seo";
import { sustainabilityCopy as C } from "@/data/copy";
import { seoPages } from "@/data/seoPages";

const PAGE = seoPages["/sustainability"];
const CANONICAL = `${SITE_URL}/sustainability`;
const TITLE = PAGE.title;
const DESCRIPTION = PAGE.description;

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { property: "og:title", content: PAGE.ogTitle ?? PAGE.title },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Eco-friendly handmade paper manufacturing at INS Overseas — zero trees, 100% recycled cotton" },
      { property: "og:site_name", content: "INS Overseas" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@ins_overseas" },
      { name: "twitter:title", content: PAGE.ogTitle ?? PAGE.title },
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
                "description": "100% recycled cotton rag paper production, no wood pulp — INS Overseas, Sanganer, Jaipur.",
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


const stats = C.stats;

function Sust() {
  return (
    <>
      <PageHero
        eyebrow={C.eyebrow}
        title={<>{C.h1.plain}<br /><em className="italic font-light text-gold-light">{C.h1.em}</em></>}
        subtitle={C.subtitle}
      />
      <section className="bg-cream py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-6 text-umber-dark leading-relaxed" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 17 }}>
          {C.intro.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </section>
      <SustainabilitySection />
      <section className="bg-parchment py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
          <SectionHeading eyebrow={C.impact.eyebrow} title={<>{C.impact.h2.plain} <em className="italic font-light">{C.impact.h2.em}</em></>} />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 md:max-w-3xl md:mx-auto gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-white p-10 border-t-2 border-gold shadow-[0_1px_2px_rgba(26,20,16,0.05),0_12px_28px_-18px_rgba(26,20,16,0.3)]"
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
