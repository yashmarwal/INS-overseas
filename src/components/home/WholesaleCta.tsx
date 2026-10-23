import { motion } from "framer-motion";
import { ArrowUpRight, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import TornTop from "@/components/shared/TornTop";
import { WhatsAppGlyph } from "@/components/ui/FloatingDock";

const pill = "group relative overflow-hidden inline-flex items-center justify-between gap-6 h-14 pl-7 pr-1.5 rounded-full uppercase text-[12px] active:scale-[0.98] transition-[background-color,box-shadow,transform] duration-300";
const pillStyle = { fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.12em" } as const;
const chip = "w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105";
const nudge = "transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5";

export default function WholesaleCta() {
  return (
    <section className="relative py-14 md:py-24 lg:py-44 overflow-hidden bg-ink">
      <TornTop color="#FAF7F0" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center text-cream"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gold" />
          <span className="text-gold uppercase text-[11px]" style={{ letterSpacing: "0.25em" }}>For Wholesale Buyers</span>
          <span className="h-px w-10 bg-gold" />
        </div>
        <h2
          className="mt-7"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(36px, 5vw, 72px)", lineHeight: 1.05 }}
        >
          Your Next Bestseller
          <br />
          <em className="italic font-light text-gold-light">Starts in Jaipur</em>
        </h2>
        <p className="mt-7 text-cream/85 max-w-xl mx-auto font-light leading-relaxed">
          Join 500+ retailers worldwide who source handcrafted leather and paper goods from INS Overseas.
          Request our full wholesale catalogue with pricing, MOQ details, and custom options.
        </p>
        {/* three pills in the site's button language: label on the left, a round icon chip on the right */}
        <div className="mt-10 flex flex-col sm:flex-row sm:flex-wrap md:flex-nowrap md:-mx-20 gap-3 sm:gap-4 justify-center">
          <Link to="/wholesale" className={`${pill} bg-gold text-ink hover:bg-gold-light hover:shadow-[0_10px_28px_-10px_rgba(201,151,58,0.7)]`} style={pillStyle}>
            <span className="relative">Request Catalogue</span>
            <span className={`${chip} bg-ink text-gold`}><ArrowUpRight size={18} className={nudge} /></span>
          </Link>
          <a href="https://wa.me/919680478483" target="_blank" rel="noreferrer" className={`${pill} text-cream bg-cream/[0.06] shadow-[inset_0_0_0_1px_rgba(250,247,240,0.3)] hover:bg-cream/[0.12] hover:shadow-[inset_0_0_0_1px_rgba(250,247,240,0.55)]`} style={pillStyle}>
            <span className="relative">WhatsApp Us</span>
            <span className={`${chip} bg-cream text-[#25D366]`}><WhatsAppGlyph size={20} /></span>
          </a>
          <Link to="/contact" className={`${pill} text-cream shadow-[inset_0_0_0_1px_rgba(201,151,58,0.55)] hover:bg-gold/10 hover:shadow-[inset_0_0_0_1px_rgba(201,151,58,0.9)]`} style={pillStyle}>
            <span className="relative">Book a Call</span>
            <span className={`${chip} bg-gold/15 text-gold-light`}><Phone size={17} className={nudge} /></span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
