import { motion } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import { Sprout, Droplet, Sun, BookOpen, Truck } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Sprout,
    title: "Cotton Rag Sourcing",
    text: "Leftover cotton rags from Jaipur's textile mills are collected, sorted, and cleaned — no trees, no chemicals.",
  },
  {
    n: "02",
    icon: Droplet,
    title: "Manual Vat Pulling",
    text: "Artisans dip molds into cotton pulp vats, lifting each sheet by hand. Every page is unique — the deckle edges are natural, never cut.",
  },
  {
    n: "03",
    icon: Sun,
    title: "Sun Drying",
    text: "Freshly pulled sheets are laid on raised frames under the Rajasthan sun. Natural light and heat give the paper its warmth and texture.",
  },
  {
    n: "04",
    icon: BookOpen,
    title: "Leather Binding",
    text: "Full-grain buffalo leather is cut, burnished, and hand-stitched around signatures of dried paper. Brass hardware is hand-fitted.",
  },
  {
    n: "05",
    icon: Truck,
    title: "Quality & Export",
    text: "Every journal is inspected, wrapped in tissue, boxed, and dispatched — from Sanganer to shelves across 40+ countries.",
  },
];

export default function CraftProcess() {
  return (
    <section className="bg-parchment-dark linen py-14 md:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <SectionHeading
          eyebrow="The Craft Process"
          title={
            <>
              From Raw Cotton to
              <br />
              <em className="italic font-light">Finished Journal</em>
            </>
          }
        />

        {/* ── DESKTOP: 5-column grid (unchanged) ── */}
        <div className="hidden lg:grid mt-20 grid-cols-5 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <span
                className="absolute -top-10 -left-2 text-umber/[0.08] select-none pointer-events-none"
                style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: 160, lineHeight: 1 }}
              >
                {s.n}
              </span>
              <div className="relative">
                <s.icon className="text-gold" size={32} />
                <h3
                  className="mt-5 text-umber-dark"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 24 }}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-3 text-umber"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 15, lineHeight: 1.7 }}
                >
                  {s.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── MOBILE: vertical timeline ── */}
        <div className="lg:hidden mt-10 relative">

          {/* Vertical gold connecting line */}
          <div
            className="absolute left-[27px] top-4 bottom-4 w-px"
            style={{ background: "linear-gradient(to bottom, transparent, #C9973A 8%, #C9973A 92%, transparent)" }}
          />

          <div className="flex flex-col gap-0">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isLast = i === steps.length - 1;

              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex gap-5 ${!isLast ? "pb-8" : ""}`}
                >
                  {/* Step node — icon circle on the line */}
                  <div className="relative z-10 shrink-0 flex flex-col items-center" style={{ width: 56 }}>
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: "#EDE3CC",
                        border: "1.5px solid #C9973A",
                        boxShadow: "0 0 0 4px #EDE3CC",
                      }}
                    >
                      <Icon size={22} className="text-gold" />
                    </div>
                  </div>

                  {/* Step content card */}
                  <div
                    className="flex-1 rounded-sm overflow-hidden"
                    style={{
                      background: "rgba(250,247,240,0.7)",
                      border: "0.5px solid rgba(201,151,58,0.2)",
                      marginTop: 8,
                    }}
                  >
                    {/* Card header */}
                    <div className="px-4 py-3 flex items-center gap-3">
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 300,
                          fontSize: 13,
                          color: "#C9973A",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {s.n}
                      </span>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 500,
                          fontSize: 18,
                          color: "#4A3219",
                          lineHeight: 1.2,
                        }}
                      >
                        {s.title}
                      </h3>
                    </div>

                    {/* Description — always visible, no accordion */}
                    <div className="px-4 pb-4">
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 300,
                          fontSize: 13.5,
                          lineHeight: 1.75,
                          color: "#6B4C2A",
                        }}
                      >
                        {s.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Journey end marker */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex items-center gap-4 mt-2 pl-1"
          >
            <div
              className="w-14 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "#C9973A" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  color: "#1A1410",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                }}
              >
                DONE
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: 12,
                color: "#8B7D6B",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Ready for 40+ countries
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
