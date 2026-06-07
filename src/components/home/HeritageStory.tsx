import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSiteImage } from "@/hooks/useSiteImage";

export default function HeritageStory() {
  const artisanImg = useSiteImage("heritage_artisan");
  const paperImg   = useSiteImage("heritage_paper");
  return (
    <section className="bg-cream py-12 md:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <span className="text-gold uppercase text-[11px]" style={{ letterSpacing: "0.25em" }}>
              Our Story
            </span>
          </div>
          <h2
            className="mt-6 text-ink"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(36px, 5vw, 72px)", lineHeight: 1.05, letterSpacing: "-0.015em" }}
          >
            Thirty Years of
            <br />
            <em className="italic font-light text-umber">Rajasthani Craft</em>
          </h2>
          <div
            className="mt-8 space-y-5 max-w-xl text-umber-dark"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 16, lineHeight: 1.8 }}
          >
            <p>
              Founded in 1995 in Sanganer — the historic papermaking heart of Jaipur — INS Overseas was built
              on a simple belief: that handcrafted objects carry a spirit no machine can replicate.
            </p>
            <p>
              For three decades, our artisans have worked the same manual vats, pulled the same cotton-rag
              sheets, and hand-stitched the same leather spines that have made Rajasthan's craft legacy
              world-famous.
            </p>
            <p>
              Today, our journals and papers travel to boutique retailers, artists, and designers across 40+
              countries — carrying a little piece of Jaipur with them.
            </p>
          </div>
          <Link
            to="/about"
            className="group inline-flex items-center gap-2 mt-8 uppercase text-[12px] text-umber border-b border-umber pb-1 hover:gap-3 transition-all"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.15em" }}
          >
            Read Our Full Story
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Mobile: simple full-width image */}
        <div className="lg:hidden w-full h-56 overflow-hidden">
          <img
            src={artisanImg}
            alt="Indian artisan at work"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Desktop: asymmetric overlapping image layout */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1 }}
          className="hidden lg:block lg:col-span-5 relative h-[520px]"
        >
          <div className="absolute top-0 right-0 w-[78%] h-[70%] overflow-hidden">
            <img
              src={artisanImg}
              alt="Indian artisan at work"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 w-[60%] h-[48%] overflow-hidden border-[6px] border-cream shadow-2xl">
            <img
              src={paperImg}
              alt="Deckle edge paper close up"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-6 right-6 w-[78%] h-[70%] border border-gold -z-0 translate-x-4 translate-y-4" />
        </motion.div>
      </div>
    </section>
  );
}
