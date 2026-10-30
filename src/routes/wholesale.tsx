import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import InfoSection from "@/components/shared/InfoSection";
import { Globe, Award, Package, Layers, Leaf, Clock } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { LOWEST_MOQ, MOQ_TABLE, moqValue } from "@/data/moq";
import { wholesaleCopy, fillTokens } from "@/data/copy";
import { SITE_URL } from "@/lib/seo";
import { seoPages } from "@/data/seoPages";

const PAGE = seoPages["/wholesale"];
const CANONICAL = `${SITE_URL}/wholesale`;
const TITLE = PAGE.title;
const DESCRIPTION = PAGE.description;

export const Route = createFileRoute("/wholesale")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: "handmade paper wholesale India, leather journal wholesale MOQ, B2B handmade journal exporter, artisan paper wholesale Jaipur, handmade gift product wholesale India" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { property: "og:title", content: PAGE.ogTitle ?? PAGE.title },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "INS Overseas wholesale partner programme — handmade paper and leather journals" },
      { property: "og:site_name", content: "INS Overseas" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@ins_overseas" },
      { name: "twitter:title", content: PAGE.ogTitle ?? PAGE.title },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
      { name: "twitter:image:alt", content: "INS Overseas wholesale partner programme" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "@id": `${CANONICAL}#service`,
              "name": "INS Overseas Wholesale Export Programme",
              "description": DESCRIPTION,
              "url": CANONICAL,
              "provider": { "@id": `${SITE_URL}/#organization` },
              "serviceType": "Wholesale Manufacturing & Export",
              "areaServed": "Worldwide",
              "audience": {
                "@type": "Audience",
                "audienceType": "Wholesale buyers, retailers, importers, brand owners",
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Wholesale Product Catalogue",
                "url": `${SITE_URL}/products`,
              },
              "offers": {
                "@type": "Offer",
                "priceCurrency": "USD",
                "eligibleQuantity": {
                  "@type": "QuantitativeValue",
                  "minValue": LOWEST_MOQ,
                  "unitText": "units",
                },
              },
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
                { "@type": "ListItem", "position": 2, "name": "Wholesale", "item": CANONICAL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: Wholesale,
});


const uspIcons = [Award, Globe, Package, Layers, Leaf, Clock];
const usps = wholesaleCopy.usps.map((title, i) => ({ icon: uspIcons[i], title: fillTokens(title, { MOQ: LOWEST_MOQ }) }));
const steps = wholesaleCopy.steps;

function WholesaleForm() {
  const { submit, status } = useFormSubmit();
  const [trap, setTrap] = useState(false); // honeypot: real visitors never see or tick this, bots tick everything
  const [fields, setFields] = useState({
    company: "", contact: "", email: "", phone: "",
    country: "", business: "", interest: "", volume: "", referral: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sent = await submit({
      subject: `Wholesale Registration — ${fields.company} (${fields.country}) — INS Overseas`,
      from_name: fields.contact,
      botcheck: trap, // Web3Forms silently discards anything with this ticked
      ...fields,
    });
    if (sent) {
      setFields({ company: "", contact: "", email: "", phone: "", country: "", business: "", interest: "", volume: "", referral: "" });
    }
  };

  const fieldDefs: [keyof typeof fields, string][] = [
    ["company",  "Company Name"],
    ["contact",  "Contact Person"],
    ["email",    "Email"],
    ["phone",    "Phone"],
    ["country",  "Country"],
    ["business", "Business Type"],
    ["interest", "Products of Interest"],
    ["volume",   "Estimated Annual Volume"],
  ];

  return (
    <form onSubmit={handleSubmit} className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <input type="checkbox" name="botcheck" checked={trap} onChange={(e) => setTrap(e.target.checked)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px opacity-0" />
      {fieldDefs.map(([n, l]) => (
        <input
          key={n}
          required={n !== "volume"}
          name={n}
          placeholder={l}
          value={fields[n]}
          onChange={handleChange}
          className="bg-transparent border-b border-warm-grey py-3 text-sm focus:outline-none focus:border-gold placeholder-warm-grey"
        />
      ))}
      <textarea
        name="referral"
        rows={3}
        placeholder="How did you hear about us?"
        value={fields.referral}
        onChange={handleChange}
        className="sm:col-span-2 bg-transparent border-b border-warm-grey py-3 text-sm focus:outline-none focus:border-gold placeholder-warm-grey resize-none"
      />

      <button
        type="submit"
        disabled={status === "submitting"}
        className="sm:col-span-2 mt-4 bg-umber text-cream px-8 py-4 uppercase text-[12px] disabled:opacity-60 hover:bg-umber-dark transition-colors inline-flex items-center justify-center gap-3"
        style={{ letterSpacing: "0.15em", fontWeight: 500 }}
      >
        {status === "submitting" ? (
          <><Loader2 size={14} className="animate-spin" /> Submitting...</>
        ) : "Submit Registration"}
      </button>

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="sm:col-span-2 flex items-center gap-3 bg-sage/20 text-umber-dark rounded-sm px-4 py-3"
        >
          <CheckCircle size={18} className="text-sage shrink-0" />
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14 }}>
            Registration received! We'll send our catalogue within 24 hours.
          </p>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="sm:col-span-2 flex items-center gap-3 bg-red-50 text-red-700 rounded-sm px-4 py-3"
        >
          <AlertCircle size={18} className="shrink-0" />
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14 }}>
            Submission failed. Please email Sezan@ins-overseas.com directly.
          </p>
        </motion.div>
      )}
    </form>
  );
}

function Wholesale() {
  return (
    <>
      {/* Dark text-only hero — no image */}
      <section className="bg-ink pt-24 pb-14 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-10 bg-gold" />
              <span
                className="text-gold uppercase"
                style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 11, letterSpacing: "0.25em" }}
              >
                {wholesaleCopy.eyebrow}
              </span>
            </div>
            <h1
              className="text-cream mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(40px, 6vw, 88px)",
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                maxWidth: "14ch",
              }}
            >
              {wholesaleCopy.h1.plain}{" "}
              <em className="italic font-light text-gold-light">{wholesaleCopy.h1.em}</em>
            </h1>
            <p
              className="text-warm-grey max-w-xl leading-relaxed"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 17, lineHeight: 1.8 }}
            >
              {fillTokens(wholesaleCopy.lead, { MOQ: LOWEST_MOQ })}
            </p>
            {/* Quick stats */}
            <div className="flex flex-wrap gap-10 mt-12 pt-10 border-t border-white/10">
              {wholesaleCopy.stats.map(([n0, l]) => { const n = fillTokens(n0, { MOQ: LOWEST_MOQ }); return (
                <div key={l}>
                  <p
                    className="text-gold"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: 36, lineHeight: 1 }}
                  >
                    {n}
                  </p>
                  <p
                    className="text-warm-grey mt-1 uppercase"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 11, letterSpacing: "0.15em" }}
                  >
                    {l}
                  </p>
                </div>
              ); })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-parchment py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
          <SectionHeading eyebrow={wholesaleCopy.why.eyebrow} title={<>{wholesaleCopy.why.h2.plain} <em className="italic font-light">{wholesaleCopy.why.h2.em}</em></>} />
          <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-8">
            {usps.map((u, i) => (
              <motion.div key={u.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.06 }}
                className="border border-ink/10 shadow-[0_1px_2px_rgba(26,20,16,0.05),0_12px_28px_-18px_rgba(26,20,16,0.3)] p-8 text-center bg-white"
              >
                <u.icon className="text-gold mx-auto" size={28} />
                <p className="mt-5 text-ink" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 18 }}>{u.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
          <SectionHeading eyebrow={wholesaleCopy.process.eyebrow} title={<>{wholesaleCopy.process.h2.plain} <em className="italic font-light">{wholesaleCopy.process.h2.em}</em></>} />
          <ol className="mt-14 grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-2">
            {steps.map((s, i) => (
              <motion.li key={s}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}
                className="relative px-4"
              >
                <span className="text-gold" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: 48 }}>0{i + 1}</span>
                <p className="mt-3 text-ink leading-snug" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 18 }}>{s}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-parchment py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <SectionHeading eyebrow={wholesaleCopy.moqTable.eyebrow} title={<>{wholesaleCopy.moqTable.h2.plain} <em className="italic font-light">{wholesaleCopy.moqTable.h2.em}</em></>}>
            {wholesaleCopy.moqTable.intro}
          </SectionHeading>
          <table className="mt-12 w-full border-collapse text-left">
            <caption className="sr-only">{wholesaleCopy.moqTable.intro}</caption>
            <thead>
              <tr className="text-warm-grey uppercase" style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 11, letterSpacing: "0.2em" }}>
                <th scope="col" className="pb-4 font-normal">{wholesaleCopy.moqTable.head[0]}</th>
                <th scope="col" className="pb-4 font-normal text-right">{wholesaleCopy.moqTable.head[1]}</th>
              </tr>
            </thead>
            <tbody>
              {MOQ_TABLE.map(([label, key]) => (
                <tr key={key} className="border-t border-ink/10">
                  <th scope="row" className="py-4 text-ink font-normal" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 20 }}>{label}</th>
                  <td className="py-4 text-right text-ink tabular-nums lining-nums" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 16 }}>{moqValue(key).toLocaleString("en-US")} units</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <InfoSection
        eyebrow={wholesaleCopy.expect.eyebrow}
        title={wholesaleCopy.expect.h2}
        level={3}
        blocks={wholesaleCopy.expect.blocks.map((b) => ({ ...b, p: b.p?.map((t) => fillTokens(t, { MOQ: LOWEST_MOQ })) }))}
      />

      <section className="bg-parchment-dark linen py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <SectionHeading eyebrow={wholesaleCopy.register.eyebrow} title={<>{wholesaleCopy.register.h2.plain} <em className="italic font-light">{wholesaleCopy.register.h2.em}</em></>} />
          <WholesaleForm />
        </div>
      </section>
    </>
  );
}
