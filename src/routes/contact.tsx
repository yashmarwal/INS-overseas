import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/shared/PageHero";
import ContactStrip from "@/components/home/ContactStrip";
import { MessageCircle, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { revealProps } from "@/components/shared/Reveal";
import { SITE_URL } from "@/lib/seo";

const CANONICAL = `${SITE_URL}/contact`;
const TITLE = "Contact INS Overseas — Wholesale Enquiries, Jaipur India";
const DESCRIPTION =
  "Get in touch with INS Overseas for wholesale enquiries, custom orders and B2B partnerships. Located in Sanganer, Jaipur. WhatsApp: +91 96804 78483. Email: Sezan@ins-overseas.com";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { property: "og:title", content: "Contact INS Overseas — Wholesale Enquiries" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Contact INS Overseas — Sanganer, Jaipur, Rajasthan, India" },
      { property: "og:site_name", content: "INS Overseas" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@ins_overseas" },
      { name: "twitter:title", content: "Contact INS Overseas" },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
      { name: "twitter:image:alt", content: "Contact INS Overseas — Jaipur, India" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ContactPage",
              "@id": `${CANONICAL}#contactpage`,
              "name": TITLE,
              "url": CANONICAL,
              "about": { "@id": `${SITE_URL}/#organization` },
            },
            {
              "@type": "LocalBusiness",
              "@id": `${SITE_URL}/#localbusiness`,
              "name": "INS Overseas",
              "image": `${SITE_URL}/og-image.jpg`,
              "url": SITE_URL,
              "telephone": "+91-96804-78483",
              "email": "Sezan@ins-overseas.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jain Nasiya Road, Near Jain Hostel",
                "addressLocality": "Sanganer",
                "addressRegion": "Rajasthan",
                "postalCode": "302029",
                "addressCountry": "IN",
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 26.7784,
                "longitude": 75.7847,
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  "opens": "09:00",
                  "closes": "18:00",
                },
              ],
              "currenciesAccepted": "USD, EUR, GBP",
              "paymentAccepted": "Bank Transfer, PayPal, Wise, Letter of Credit",
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
                { "@type": "ListItem", "position": 2, "name": "Contact", "item": CANONICAL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: Contact,
});


function Contact() {
  return (
    <>
      <PageHero eyebrow="Get in Touch" title={<>Let's <em className="italic font-light text-gold-light">Talk</em></>} subtitle="Wholesale, custom orders, samples or just a conversation — we respond within 24 hours." />
      <ContactStrip />
      <section className="bg-parchment py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: MessageCircle, label: "WhatsApp", sub: "Fastest response", href: "https://wa.me/919680478483", cta: "Open WhatsApp" },
            { icon: Mail, label: "Email", sub: "Detailed enquiries", href: "mailto:Sezan@ins-overseas.com", cta: "Send Email" },
            { icon: Phone, label: "Call", sub: "Mon–Sat, 24 hours", href: "tel:+919680478483", cta: "Call Now" },
          ].map((c, i) => (
            <motion.a key={c.label} {...revealProps(24, i * 0.09)} href={c.href} target="_blank" rel="noreferrer" className="bg-white p-8 border border-ink/10 shadow-[0_1px_2px_rgba(26,20,16,0.05),0_12px_28px_-18px_rgba(26,20,16,0.3)] hover:border-gold transition-colors">
              <c.icon className="text-gold" size={28} />
              <h3 className="mt-4 text-ink text-2xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{c.label}</h3>
              <p className="mt-1 text-warm-grey text-sm">{c.sub}</p>
              <p className="mt-4 uppercase text-[11px] text-umber" style={{ letterSpacing: "0.2em" }}>{c.cta} →</p>
            </motion.a>
          ))}
        </div>
        <motion.div {...revealProps(28)} className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 mt-12 aspect-[16/7] overflow-hidden">
          <iframe title="INS Overseas, Sanganer" src="https://www.google.com/maps?q=Sanganer,Jaipur&output=embed" className="w-full h-full" loading="lazy" />
        </motion.div>
      </section>
    </>
  );
}
