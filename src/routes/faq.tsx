import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import { SITE_URL } from "@/lib/seo";
import { seoPages } from "@/data/seoPages";
import { revealProps } from "@/components/shared/Reveal";
import { faqCopy, faqGroups } from "@/data/copy";

const groups = faqGroups;

export const Route = createFileRoute("/faq")({
  head: () => {
    const canonical = `${SITE_URL}/faq`;
    const title = seoPages["/faq"].title;
    const description = seoPages["/faq"].description;

    const faqSchema = {
      "@type": "FAQPage",
      "@id": `${canonical}#faqpage`,
      "name": title,
      "url": canonical,
      "mainEntity": groups.flatMap((g) =>
        g.items.map(([q, a]) => ({
          "@type": "Question",
          "name": q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": a,
          },
        })),
      ),
    };

    const breadcrumb = {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "FAQ", "item": canonical },
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        { property: "og:title", content: seoPages["/faq"].ogTitle ?? title },
        { property: "og:description", content: description },
        { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: "INS Overseas FAQ — Wholesale ordering questions answered" },
        { property: "og:site_name", content: "INS Overseas" },
        { property: "og:locale", content: "en_IN" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@ins_overseas" },
        { name: "twitter:title", content: seoPages["/faq"].ogTitle ?? title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
        { name: "twitter:image:alt", content: "INS Overseas FAQ" },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [faqSchema, breadcrumb],
          }),
        },
      ],
    };
  },
  component: FAQ,
});


function FAQ() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <PageHero
        eyebrow={faqCopy.eyebrow}
        title={
          <>
            {faqCopy.h1.plain}{" "}
            <em className="italic font-light text-gold-light">{faqCopy.h1.em}</em>
          </>
        }
        subtitle={faqCopy.subtitle}
      />
      <section className="bg-cream py-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-14">
          {groups.map((g) => (
            <motion.div key={g.cat} {...revealProps(24)}>
              <h2
                className="text-xs uppercase text-gold mb-6"
                style={{ letterSpacing: "0.25em" }}
              >
                {g.cat}
              </h2>
              <ul className="border-t border-warm-grey-light">
                {g.items.map(([q, a]) => {
                  const id = `${g.cat}-${q}`;
                  const isOpen = open === id;
                  return (
                    <li key={q} className="border-b border-warm-grey-light">
                      <button
                        onClick={() => setOpen(isOpen ? null : id)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-4 py-5 text-left"
                      >
                        <span
                          className="text-ink text-lg"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 500,
                          }}
                        >
                          {q}
                        </span>
                        {isOpen ? (
                          <Minus
                            size={18}
                            className="text-umber shrink-0"
                          />
                        ) : (
                          <Plus size={18} className="text-umber shrink-0" />
                        )}
                      </button>
                      {/* the answer stays in the page (search engines and readers can find it); closed = no height, invisible */}
                      <motion.div
                        initial={false}
                        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                        style={{ visibility: isOpen ? "visible" : "hidden", transition: isOpen ? "visibility 0s" : "visibility 0s linear 0.3s" }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-umber-dark leading-relaxed whitespace-pre-line">
                          {a}
                        </p>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
