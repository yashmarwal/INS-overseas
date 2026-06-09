import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import type { Product } from "@/data/products";

export default function ProductCard({ product, i = 0 }: { product: Product; i?: number }) {
  const subject = encodeURIComponent(`Product Enquiry: ${product.name} — INS Overseas`);
  const body = encodeURIComponent(
    `Hi INS Overseas Team,\n\nI am interested in: ${product.name}\n\nPlease share pricing, MOQ, and availability.\n\nCompany: \nCountry: \nQuantity needed: `
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, delay: (i % 6) * 0.05, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="group"
    >
      <div className="aspect-[3/4] overflow-hidden bg-parchment-dark">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
        />
      </div>
      <h3
        className="mt-5 text-ink text-xl"
        style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
      >
        {product.name}
      </h3>
      <p className="mt-1 text-warm-grey text-sm font-light">{product.description}</p>
      <a
        href={`mailto:Sezan@ins-overseas.com?subject=${subject}&body=${body}`}
        className="mt-4 inline-flex items-center gap-2 border border-umber text-umber text-[11px] uppercase px-5 py-2.5 hover:bg-umber hover:text-cream transition-colors"
        style={{ letterSpacing: "0.15em", fontFamily: "var(--font-body)", fontWeight: 500 }}
      >
        <Mail size={11} />
        Enquire
      </a>
    </motion.article>
  );
}
