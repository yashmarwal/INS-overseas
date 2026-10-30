import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/shared/PageHero";
import CraftProcess from "@/components/home/CraftProcess";
import { motion } from "framer-motion";
import { SITE_URL } from "@/lib/seo";
import { ourCraftCopy as C } from "@/data/copy";
import { seoPages } from "@/data/seoPages";

const PAGE = seoPages["/our-craft"];
const CANONICAL = `${SITE_URL}/our-craft`;
const TITLE = PAGE.title;
const DESCRIPTION = PAGE.description;

export const Route = createFileRoute("/our-craft")({
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
      { property: "og:image:alt", content: "Traditional handmade paper craft at INS Overseas, Sanganer Jaipur" },
      { property: "og:site_name", content: "INS Overseas" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@ins_overseas" },
      { name: "twitter:title", content: PAGE.ogTitle ?? PAGE.title },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
      { name: "twitter:image:alt", content: "Traditional handmade paper craft at INS Overseas" },
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
              "about": { "@id": `${SITE_URL}/#organization` },
              "publisher": { "@id": `${SITE_URL}/#organization` },
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
                { "@type": "ListItem", "position": 2, "name": "Our Craft", "item": CANONICAL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: OurCraft,
});


const timeline = C.timeline;

function OurCraft() {
  return (
    <>
      <PageHero
        eyebrow={C.eyebrow}
        title={<>{C.h1.plain} <em className="italic font-light text-gold-light">{C.h1.em}</em></>}
        subtitle={C.subtitle}
        image="/manufacturing/workspace-3.jpg"
      />
      <CraftProcess />

      <section className="bg-ink text-cream py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <p className="text-gold uppercase text-[11px] mb-3" style={{ letterSpacing: "0.25em" }}>{C.journey.eyebrow}</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.05 }}>
            {C.journey.h2.plain} <em className="italic font-light text-gold-light">{C.journey.h2.em}</em>
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
