import { motion } from "framer-motion";
import { MessageCircle, Phone, FileText } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function WholesaleCta() {
  return (
    <section className="relative py-14 md:py-24 lg:py-44 overflow-hidden bg-ink">
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
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/wholesale" className="inline-flex items-center justify-center gap-2 bg-gold text-ink px-7 py-4 uppercase text-[12px]" style={{ letterSpacing: "0.12em", fontWeight: 500 }}>
            <FileText size={16} /> Request Catalogue
          </Link>
          <a href="https://wa.me/919680478483" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 border border-cream px-7 py-4 uppercase text-[12px] hover:bg-cream hover:text-ink transition-colors" style={{ letterSpacing: "0.12em", fontWeight: 500 }}>
            <MessageCircle size={16} /> WhatsApp Us
          </a>
          <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-4 uppercase text-[12px] text-cream border border-cream/50 hover:bg-cream/10 transition-colors" style={{ letterSpacing: "0.12em", fontWeight: 500 }}>
            <Phone size={16} /> Book a Call
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
