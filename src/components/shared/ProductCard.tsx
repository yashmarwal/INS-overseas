import { motion } from "framer-motion";
import type { Product } from "@/data/products";

export default function ProductCard({ product, i = 0 }: { product: Product; i?: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, delay: (i % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group"
      data-cursor-view
    >
      <div className="aspect-[3/4] overflow-hidden bg-parchment-dark">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
      </div>
      <h3 className="mt-5 text-ink text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
        {product.name}
      </h3>
      <p className="mt-1 text-warm-grey text-sm font-light">{product.description}</p>
      <button className="mt-4 border border-umber text-umber text-[11px] uppercase px-5 py-2.5 hover:bg-umber hover:text-cream transition-colors" style={{ letterSpacing: "0.15em" }}>
        Enquire
      </button>
    </motion.article>
  );
}
