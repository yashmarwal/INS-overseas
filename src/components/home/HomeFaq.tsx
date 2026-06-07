import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const faqs = [
  {
    q: "What is your minimum order quantity?",
    a: "300 pieces per design for standard wholesale orders. 500 pieces for custom/OEM orders with your logo or specific design. You can mix different products to reach the MOQ.",
  },
  {
    q: "Do you offer samples before placing a bulk order?",
    a: "Yes — product samples are free of charge. You only pay the shipping cost to your location. Custom samples with your logo take approximately 10 days to produce.",
  },
  {
    q: "How long does production and delivery take?",
    a: "Production begins 30 days after order confirmation and payment. Delivery after dispatch: 7–10 days by air (DHL/FedEx), 35–40 days by sea freight.",
  },
  {
    q: "Can you add our logo to the products?",
    a: "Yes. We offer debossing, embossing, foil stamping (gold/silver), and screen printing. We also do fully custom packaging — branded boxes, tissue paper, ribbon, and hang tags.",
  },
  {
    q: "Which payment methods and currencies do you accept?",
    a: "We accept SWIFT wire transfer, PayPal, and Wise. Currencies: USD, EUR, and GBP. Standard terms are 50% advance on order confirmation, 50% before shipment.",
  },
];

export default function HomeFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-parchment py-14 md:py-24 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-gold" />
              <span
                className="text-gold uppercase"
                style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 11, letterSpacing: "0.22em" }}
              >
                Common Questions
              </span>
            </div>
            <h2
              className="text-ink"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(32px, 4vw, 56px)",
                lineHeight: 1.08,
                letterSpacing: "-0.01em",
              }}
            >
              Before You{" "}
              <em className="italic font-light text-umber">Place Your First Order</em>
            </h2>
          </div>

          {/* Desktop CTA */}
          <Link
            to="/faq"
            className="hidden md:inline-flex group items-center gap-2 shrink-0 uppercase text-[12px] text-umber border-b border-umber pb-1 hover:gap-3 transition-all mb-2"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.15em" }}
          >
            View All FAQs
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Accordion */}
        <div className="border-t border-warm-grey-light/60">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-warm-grey-light/60"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 md:py-6 text-left group"
                >
                  <span
                    className="text-ink group-hover:text-umber transition-colors duration-200"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: "clamp(16px, 1.8vw, 22px)",
                      lineHeight: 1.3,
                    }}
                  >
                    {f.q}
                  </span>
                  <span
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                    style={{
                      background: isOpen ? "#6B4C2A" : "transparent",
                      border: "1px solid",
                      borderColor: isOpen ? "#6B4C2A" : "rgba(139,125,107,0.4)",
                    }}
                  >
                    {isOpen
                      ? <Minus size={14} color="#FAF7F0" />
                      : <Plus size={14} color="#6B4C2A" />
                    }
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p
                        className="pb-6 md:pb-8 pr-12 text-umber-dark"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 300,
                          fontSize: 15,
                          lineHeight: 1.8,
                          maxWidth: "680px",
                        }}
                      >
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden mt-8 text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 uppercase text-[12px] text-umber border-b border-umber pb-1"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.15em" }}
          >
            View All FAQs
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
