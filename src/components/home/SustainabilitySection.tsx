import { motion } from "framer-motion";
import { Leaf, Droplet, Recycle, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const creds = [
  { icon: Leaf, title: "100% Cotton Rag Paper", text: "Made from recycled textile waste. Zero deforestation." },
  { icon: Droplet, title: "Chemical-Free Process", text: "No bleach, no acids. Safe for artists and the planet." },
  { icon: Recycle, title: "Zero Waste Manufacturing", text: "Every offcut, every scrap is reused in our process." },
];

export default function SustainabilitySection() {
  return (
    <section className="bg-sage text-cream py-14 md:py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold-light" />
            <span className="text-gold-light uppercase text-[11px]" style={{ letterSpacing: "0.25em" }}>Sustainability</span>
          </div>
          <p
            className="mt-8 italic text-cream"
            style={{ fontFamily: "var(--font-accent)", fontWeight: 400, fontSize: "clamp(28px, 3.6vw, 44px)", lineHeight: 1.2 }}
          >
            "No trees were harmed in making this page."
          </p>
          <Link
            to="/sustainability"
            className="group mt-10 inline-flex items-center gap-2 uppercase text-[12px] border-b border-gold-light pb-1"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.15em" }}
          >
            Our Sustainability Commitment
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="space-y-8">
          {creds.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="flex gap-5 border-b border-cream/15 pb-7 last:border-0"
            >
              <c.icon className="text-gold-light shrink-0 mt-1" size={28} />
              <div>
                <h3 className="text-cream text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  {c.title}
                </h3>
                <p className="mt-2 text-cream/80 text-sm font-light leading-relaxed">{c.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
