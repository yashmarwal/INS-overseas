import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { homeCopy } from "@/data/copy";

const faqs = homeCopy.faq.items;

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
                {homeCopy.faq.eyebrow}
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
              {homeCopy.faq.h2.plain}{" "}
              <em className="italic font-light text-umber">{homeCopy.faq.h2.em}</em>
            </h2>
          </div>

          {/* Desktop CTA */}
          <Link
            to="/faq"
            className="hidden md:inline-flex group items-center gap-2 shrink-0 uppercase text-[12px] text-umber border-b border-umber pb-1 hover:gap-3 transition-all mb-2"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.15em" }}
          >
            {homeCopy.faq.link}
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
                  aria-expanded={isOpen}
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

                {/* the answer stays in the page; closed = no height, invisible */}
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  style={{ visibility: isOpen ? "visible" : "hidden", transition: isOpen ? "visibility 0s" : "visibility 0s linear 0.32s" }}
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
            {homeCopy.faq.link}
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
