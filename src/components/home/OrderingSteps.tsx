import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import EditorialHeading, { headingLinkCls, headingLinkStyle } from "@/components/shared/EditorialHeading";
import TornTop from "@/components/shared/TornTop";
import { EASE } from "@/components/shared/Reveal";

// How a wholesale order runs, from the first message to a tracked shipment. The nine steps and their numbers are the
// same ones the INS Assistant gives (and the shipping times are the ones on the Products page and in the FAQ).
type Step = { t: string; d: string; chip?: string };
const phases: { title: string; steps: Step[] }[] = [
  {
    title: "Brief & Quote",
    steps: [
      { t: "Share your brief and logo files", d: "Tell us the product, quantity and branding you have in mind." },
      { t: "We confirm specs and send a quote", d: "Pricing depends on specs, quantity and customisation." },
    ],
  },
  {
    title: "Sample & Approval",
    steps: [
      { t: "Custom sample in about 10 days", d: "Made with your logo or design.", chip: "~10 days" },
      { t: "You approve the sample", d: "Check the quality, colour and finish in hand." },
      { t: "50% advance payment", d: "Half now, half before shipment.", chip: "50%" },
    ],
  },
  {
    title: "Production & Shipping",
    steps: [
      { t: "Production in 30 days", d: "Handmade in Sanganer, Jaipur.", chip: "30 days" },
      { t: "Photos and video as it is made", d: "Step-by-step updates, so you see your order take shape." },
      { t: "50% balance before shipment", d: "Paid before we dispatch.", chip: "50%" },
      { t: "We dispatch and share tracking", d: "Air 7–10 days, sea 35–40 days.", chip: "Tracked" },
    ],
  },
];

const colV = { hide: {}, show: { transition: { staggerChildren: 0.12 } } };
const rise = { hide: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };
const pop = { hide: { scale: 0.6, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: EASE } } };
const grow = { hide: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 1.4, ease: EASE } } };

export default function OrderingSteps() {
  let n = 0;
  return (
    <section className="relative bg-cream py-14 md:py-24 lg:py-32">
      <TornTop color="#0F0B08" />
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <EditorialHeading
          eyebrow="How Ordering Works"
          count="09 steps"
          line1="From Brief"
          line2="To Your Door"
          intro="Clear steps, clear terms. You always know what happens next."
          aside={
            <Link to="/wholesale" className={`${headingLinkCls} max-md:hidden`} style={headingLinkStyle}>
              Start your order
              <span className="w-9 h-9 rounded-full bg-gold text-ink flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5"><ArrowRight size={16} /></span>
            </Link>
          }
        />

        <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-10">
          {phases.map((ph, pi) => (
            <motion.div key={ph.title} variants={colV} initial="hide" whileInView="show" viewport={{ once: true, margin: "0px 0px -12% 0px" }}>
              <motion.div variants={rise} className="flex items-baseline gap-3 pb-4 border-b border-gold/40">
                <span className="text-gold uppercase tabular-nums lining-nums" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.2em" }}>Phase 0{pi + 1}</span>
                <h3 className="text-ink" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 26, lineHeight: 1.1 }}>{ph.title}</h3>
              </motion.div>

              <ol className="relative mt-7">
                {/* the rail: a quiet line with a gold one drawing down over it */}
                <span aria-hidden className="absolute left-5 top-5 bottom-8 w-px -translate-x-1/2 bg-ink/12" />
                <motion.span aria-hidden variants={grow} style={{ transformOrigin: "top" }} className="absolute left-5 top-5 bottom-8 w-px -translate-x-1/2 bg-gold" />
                {ph.steps.map((s) => {
                  n += 1;
                  return (
                    <motion.li key={s.t} variants={rise} className="relative pl-16 pb-8 last:pb-0">
                      <motion.span
                        variants={pop}
                        className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white flex items-center justify-center text-ink tabular-nums lining-nums shadow-[inset_0_0_0_1.5px_#C9973A]"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17 }}
                      >
                        {String(n).padStart(2, "0")}
                      </motion.span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 min-h-10">
                        <h4 className="text-ink" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 21, lineHeight: 1.15 }}>{s.t}</h4>
                        {s.chip && (
                          <span className="uppercase text-umber rounded-full px-2.5 py-1 bg-gold/20" style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 10, letterSpacing: "0.12em" }}>{s.chip}</span>
                        )}
                      </div>
                      <p className="mt-1 text-umber max-w-sm" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 15, lineHeight: 1.6 }}>{s.d}</p>
                    </motion.li>
                  );
                })}
              </ol>
            </motion.div>
          ))}
        </div>

        <div className="md:hidden mt-12">
          <Link to="/wholesale" className={`${headingLinkCls} w-full justify-between`} style={headingLinkStyle}>
            Start your order
            <span className="w-9 h-9 rounded-full bg-gold text-ink flex items-center justify-center"><ArrowRight size={16} /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
