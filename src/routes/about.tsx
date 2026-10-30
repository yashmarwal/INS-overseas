import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/shared/PageHero";
import SectionHeading from "@/components/shared/SectionHeading";
import TrustBar from "@/components/home/TrustBar";
import { motion } from "framer-motion";
import { Leaf, Globe, Star, Award } from "lucide-react";
import { SITE_URL } from "@/lib/seo";
import { aboutCopy as C } from "@/data/copy";
import { seoPages } from "@/data/seoPages";

const PAGE = seoPages["/about"];
const CANONICAL = `${SITE_URL}/about`;
const TITLE = PAGE.title;
const DESCRIPTION = PAGE.description;

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { property: "og:title", content: PAGE.ogTitle ?? PAGE.title },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: `${SITE_URL}/about-hero.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "INS Overseas workshop in Sanganer, Jaipur — four generations of handmade paper craft" },
      { property: "og:site_name", content: "INS Overseas" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@ins_overseas" },
      { name: "twitter:title", content: PAGE.ogTitle ?? PAGE.title },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/about-hero.jpg` },
      { name: "twitter:image:alt", content: "INS Overseas — four-generation handmade paper legacy from Sanganer, Jaipur" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "AboutPage",
              "@id": `${CANONICAL}#aboutpage`,
              "name": TITLE,
              "description": DESCRIPTION,
              "url": CANONICAL,
              "about": { "@id": `${SITE_URL}/#organization` },
              "publisher": { "@id": `${SITE_URL}/#organization` },
            },
            {
              "@type": "Person",
              "@id": `${SITE_URL}/#person-sezan`,
              "name": "Sezan (INS Overseas Sales)",
              "jobTitle": "Wholesale Manager",
              "worksFor": { "@id": `${SITE_URL}/#organization` },
              "email": "Sezan@ins-overseas.com",
              "telephone": "+91-96804-78483",
              "url": CANONICAL,
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
                { "@type": "ListItem", "position": 2, "name": "About", "item": CANONICAL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: About,
});


const valueIcons = [Award, Leaf, Star, Globe];
const values = C.values.map((v, i) => ({ icon: valueIcons[i], ...v }));
const whyUs = C.whyUs;

function About() {
  return (
    <>
      <PageHero
        eyebrow={C.eyebrow}
        title={
          <>
            {C.h1.plain}<br />
            <em className="italic font-light text-gold-light">
              {C.h1.em}
            </em>
          </>
        }
        subtitle={C.subtitle}
      />

      {/* Intro */}
      <section className="bg-cream py-24 lg:py-32">
        <div
          className="max-w-3xl mx-auto px-5 sm:px-8 space-y-7 text-umber-dark"
          style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 17, lineHeight: 1.85 }}
        >
          {C.intro.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-parchment-dark linen py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-l-2 border-gold pl-8"
          >
            <p
              className="text-gold uppercase mb-4"
              style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 11, letterSpacing: "0.25em" }}
            >
              {C.vision.label}
            </p>
            <h3
              className="text-ink mb-6"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.2 }}
            >
              {C.vision.h3}
            </h3>
            <p
              className="text-umber-dark leading-relaxed"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 16, lineHeight: 1.8 }}
            >
              {C.vision.text}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="border-l-2 border-gold pl-8"
          >
            <p
              className="text-gold uppercase mb-4"
              style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 11, letterSpacing: "0.25em" }}
            >
              {C.mission.label}
            </p>
            <h3
              className="text-ink mb-6"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.2 }}
            >
              {C.mission.h3}
            </h3>
            <ul
              className="space-y-3 text-umber-dark"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 15, lineHeight: 1.75 }}
            >
              {C.mission.list.map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <TrustBar />

      {/* Why Choose Us */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
          <SectionHeading
            eyebrow={C.why.eyebrow}
            title={<>{C.why.h2.plain} <em className="italic font-light">{C.why.h2.em}</em></>}
          />

          {/* 4 value cards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-parchment p-8 border-t-2 border-gold"
              >
                <v.icon className="text-gold mb-5" size={28} />
                <h3
                  className="text-ink mb-4"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 22 }}
                >
                  {v.title}
                </h3>
                <p
                  className="text-umber leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, lineHeight: 1.75 }}
                >
                  {v.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Why us checklist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 bg-parchment-dark linen p-8 md:p-12"
          >
            <p
              className="text-gold uppercase mb-8"
              style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 11, letterSpacing: "0.25em" }}
            >
              {C.setsApart}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whyUs.map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="mt-1 shrink-0 text-gold" style={{ fontSize: 18 }}>✓</span>
                  <p
                    className="text-umber-dark"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 15, lineHeight: 1.7 }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-parchment py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              eyebrow={C.location.eyebrow}
              align="left"
              title={<>{C.location.h2.plain} <em className="italic font-light">{C.location.h2.em}</em></>}
            >
              {C.location.text}
            </SectionHeading>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-sm">
            <iframe
              title="Sanganer, Jaipur map"
              src="https://www.google.com/maps?q=Sanganer,Jaipur&output=embed"
              className="w-full h-full grayscale-[40%] sepia-[20%]"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
