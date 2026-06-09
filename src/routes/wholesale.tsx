import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import SectionHeading from "@/components/shared/SectionHeading";
import { Globe, Award, Package, Layers, Leaf, Clock } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";

export const Route = createFileRoute("/wholesale")({
  head: () => ({
    meta: [
      { title: "Wholesale Partner Program — INS Overseas | B2B Handmade Paper & Journals" },
      { name: "description", content: "Partner with INS Overseas for wholesale handmade leather journals, cotton rag paper and artisan gift products. MOQ 200 units. Export to 40+ countries. Request our B2B catalogue." },
      { name: "keywords", content: "handmade paper wholesale India, leather journal wholesale MOQ, B2B handmade journal exporter, artisan paper wholesale Jaipur, handmade gift product wholesale India" },
      { property: "og:title", content: "Wholesale — Partner With INS Overseas" },
      { property: "og:url", content: "https://ins-overseas.com/wholesale" },
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

function WholesaleForm() {
  const { submit, status } = useFormSubmit();
  const [fields, setFields] = useState({
    company: "", contact: "", email: "", phone: "",
    country: "", business: "", interest: "", volume: "", referral: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit({
      subject: `Wholesale Registration — ${fields.company} (${fields.country}) — INS Overseas`,
      from_name: fields.contact,
      ...fields,
    });
    if (status !== "error") {
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
          <WholesaleForm />
        </div>
      </section>
    </>
  );
}
