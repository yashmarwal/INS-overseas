import { motion } from "framer-motion";
import { useCounter } from "@/hooks/useCounter";
import { EASE } from "@/components/shared/Reveal";

const stats = [
  { label: "Established", value: 1995, suffix: "", prefix: "EST. ", plain: true }, // a year: no thousands separator
  { label: "Countries Served", value: 40, suffix: "+" },
  { label: "Years of Craft", value: 30, suffix: "" },
  { label: "Products Shipped", value: 895700, suffix: "+" },
];

const rise = { hide: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };
const draw = { hide: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease: EASE, delay: 0.25 } } };

function Stat({ value, suffix, prefix, label, plain, cell }: { value: number; suffix?: string; prefix?: string; label: string; plain?: boolean; cell: string }) {
  const { value: v, ref } = useCounter(value, 2200);
  return (
    <motion.div variants={rise} className={`flex flex-col items-center text-center px-3 py-6 md:py-2 ${cell}`}>
      <span
        ref={ref}
        className="text-gold-light lining-nums tabular-nums leading-none"
        style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(34px, 4.6vw, 58px)" }}
      >
        {prefix}{plain ? v : v.toLocaleString()}{suffix}
      </span>
      {/* a short gold rule draws in under each number */}
      <motion.span variants={draw} style={{ transformOrigin: "50% 50%" }} className="mt-4 h-px w-10 bg-gold" />
      <span
        className="mt-3.5 text-cream/85 uppercase"
        style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 11, letterSpacing: "0.22em" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

// On phones the four stats sit in a 2x2 grid with thin gold crosshairs between them; from tablets up they form one row.
const cells = [
  "border-b border-r border-gold/25 md:border-b-0",
  "border-b border-gold/25 md:border-b-0 md:border-r",
  "border-r border-gold/25",
  "",
];

export default function TrustBar() {
  return (
    <section className="relative bg-umber py-4 md:py-12 overflow-hidden" style={{ backgroundImage: "radial-gradient(70% 140% at 50% 0%, rgba(241,202,133,0.12), transparent 70%)" }}>
      <motion.div
        initial="hide"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        variants={{ hide: {}, show: { transition: { staggerChildren: 0.12 } } }}
        className="max-w-[1400px] mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4"
      >
        {stats.map((s, i) => (
          <Stat key={s.label} {...s} cell={cells[i]} />
        ))}
      </motion.div>
    </section>
  );
}
