import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactStrip() {
  return (
    <section className="bg-umber text-cream py-14 md:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold-light" />
            <span className="text-gold-light uppercase text-[11px]" style={{ letterSpacing: "0.25em" }}>Get in Touch</span>
          </div>
          <h2 className="mt-6" style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.05 }}>
            Let's Begin a<br /><em className="italic font-light text-gold-light">Conversation</em>
          </h2>
          <div className="mt-10 space-y-6">
            <Row icon={MapPin}>Jain Nasiya Road, Near Jain Hostel, Sanganer, Jaipur – 302029, Rajasthan, India</Row>
            <Row icon={Phone}><a href="tel:+919680478483" className="hover:text-gold-light">+91 96804 78483</a></Row>
            <Row icon={Mail}><a href="mailto:Sezan@ins-overseas.com" className="hover:text-gold-light">Sezan@ins-overseas.com</a></Row>
            <Row icon={Clock}>Mon – Sat · 24 Hours</Row>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          onSubmit={(e) => { e.preventDefault(); alert("Thank you — we'll be in touch within 24 hours."); }}
          className="space-y-6"
        >
          {[
            { name: "name", label: "Your Name", type: "text" },
            { name: "email", label: "Email Address", type: "email" },
            { name: "company", label: "Company", type: "text" },
            { name: "country", label: "Country", type: "text" },
          ].map((f) => (
            <FloatField key={f.name} {...f} />
          ))}
          <FloatField name="message" label="Tell us about your enquiry" type="textarea" />
          <button type="submit" className="mt-2 inline-flex items-center gap-3 bg-gold text-ink px-8 py-4 uppercase text-[12px]" style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.15em" }}>
            Send Enquiry
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function Row({ icon: Icon, children }: { icon: typeof MapPin; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 items-start">
      <Icon className="text-gold-light shrink-0 mt-1" size={18} />
      <p className="text-cream/90 leading-relaxed">{children}</p>
    </div>
  );
}

function FloatField({ name, label, type }: { name: string; label: string; type: string }) {
  return (
    <div className="relative">
      {type === "textarea" ? (
        <textarea
          name={name}
          required
          rows={4}
          placeholder=" "
          className="peer w-full bg-transparent border-b border-cream/30 focus:border-gold-light pt-6 pb-2 text-cream placeholder-transparent focus:outline-none"
        />
      ) : (
        <input
          name={name}
          type={type}
          required
          placeholder=" "
          className="peer w-full bg-transparent border-b border-cream/30 focus:border-gold-light pt-6 pb-2 text-cream placeholder-transparent focus:outline-none"
        />
      )}
      <label className="absolute left-0 top-1 text-[11px] text-cream/60 uppercase peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-focus:top-1 peer-focus:text-[11px] peer-focus:uppercase peer-focus:text-gold-light transition-all" style={{ letterSpacing: "0.15em" }}>
        {label}
      </label>
    </div>
  );
}
