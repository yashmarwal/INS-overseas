import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import PageHero from "@/components/shared/PageHero";
import SectionHeading from "@/components/shared/SectionHeading";
import { Globe, Award, Package, Layers, Leaf, Clock } from "lucide-react";

export const Route = createFileRoute("/wholesale")({
  head: () => ({
    meta: [
      { title: "Wholesale Leather Journals & Handmade Paper | INS Overseas B2B" },
      { name: "description", content: "Source handmade leather journals, cotton rag paper and artisan stationery from Jaipur. MOQ from 200 units. Full OEM, custom branding, export to 40+ countries." },
    ],
  }),
  component: Wholesale,
});

const usps = [
  { icon: Award, title: "30 Years Experience" },
  { icon: Globe, title: "Export to 40+ Countries" },
  { icon: Package, title: "MOQ from 200 Units" },
  { icon: Layers, title: "Custom OEM Available" },
  { icon: Leaf, title: "Eco-Certified Materials" },
  { icon: Clock, title: "Fast Lead Times" },
];

const steps = [
  "Send Enquiry",
  "Receive Catalogue & Pricing",
  "Sample Approval",
  "Place Order (50% advance)",
  "Production & Delivery (3–4 weeks)",
];

function Wholesale() {
  return (
    <>
      <PageHero
        eyebrow="Wholesale"
        title={<>Partner <em className="italic font-light text-gold-light">With Us</em></>}
        subtitle="Source handmade leather and paper goods directly from Jaipur. Boutique-grade quality, B2B pricing, custom branding."
        image="https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=2200&q=80"
      />

      <section className="bg-parchment py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
          <SectionHeading eyebrow="Why Us" title={<>Why Source From <em className="italic font-light">INS Overseas</em></>} />
          <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-8">
            {usps.map((u, i) => (
              <motion.div key={u.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.06 }}
                className="border border-warm-grey-light/60 p-8 text-center bg-cream"
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
          <SectionHeading eyebrow="The Process" title={<>How It <em className="italic font-light">Works</em></>} />
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

      <section className="bg-parchment-dark linen py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <SectionHeading eyebrow="Register" title={<>Wholesale <em className="italic font-light">Registration</em></>} />
          <form className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); alert("Thank you — we'll send our catalogue within 24 hours."); }}>
            {[
              ["company", "Company Name"], ["contact", "Contact Person"],
              ["email", "Email"], ["phone", "Phone"],
              ["country", "Country"], ["business", "Business Type"],
              ["interest", "Products of Interest"], ["volume", "Estimated Annual Volume"],
            ].map(([n, l]) => (
              <input key={n} required name={n} placeholder={l} className="bg-transparent border-b border-warm-grey py-3 text-sm focus:outline-none focus:border-gold placeholder-warm-grey" />
            ))}
            <textarea name="referral" rows={3} placeholder="How did you hear about us?" className="sm:col-span-2 bg-transparent border-b border-warm-grey py-3 text-sm focus:outline-none focus:border-gold placeholder-warm-grey" />
            <button className="sm:col-span-2 mt-4 bg-umber text-cream px-8 py-4 uppercase text-[12px]" style={{ letterSpacing: "0.15em", fontWeight: 500 }}>
              Submit Registration
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
