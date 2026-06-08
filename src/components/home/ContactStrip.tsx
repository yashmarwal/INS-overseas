import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useFormSubmit } from "@/hooks/useFormSubmit";

export default function ContactStrip() {
  const { submit, status } = useFormSubmit();
  const [fields, setFields] = useState({
    name: "", email: "", company: "", country: "", message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit({
      subject: `Website Enquiry from ${fields.name} — INS Overseas`,
      from_name: fields.name,
      ...fields,
    });
    if (status !== "error") {
      setFields({ name: "", email: "", company: "", country: "", message: "" });
    }
  };

  return (
    <section className="bg-umber text-cream py-14 md:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Left — contact info */}
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
            <Row icon={Clock}>Mon – Sat · Available 24 hours</Row>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {[
            { name: "name",    label: "Your Name",     type: "text"  },
            { name: "email",   label: "Email Address", type: "email" },
            { name: "company", label: "Company",       type: "text"  },
            { name: "country", label: "Country",       type: "text"  },
          ].map((f) => (
            <FloatField
              key={f.name}
              {...f}
              value={fields[f.name as keyof typeof fields]}
              onChange={handleChange}
            />
          ))}

          <div className="relative">
            <textarea
              name="message"
              required
              rows={4}
              placeholder=" "
              value={fields.message}
              onChange={handleChange}
              className="peer w-full bg-transparent border-b border-cream/30 focus:border-gold-light pt-6 pb-2 text-cream placeholder-transparent focus:outline-none resize-none"
            />
            <label className="absolute left-0 top-1 text-[11px] text-cream/60 uppercase peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-focus:top-1 peer-focus:text-[11px] peer-focus:uppercase peer-focus:text-gold-light transition-all" style={{ letterSpacing: "0.15em" }}>
              Tell us about your enquiry
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-2 inline-flex items-center gap-3 bg-gold text-ink px-8 py-4 uppercase text-[12px] disabled:opacity-60 hover:bg-gold-light transition-colors"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.15em" }}
          >
            {status === "submitting" ? (
              <><Loader2 size={14} className="animate-spin" /> Sending...</>
            ) : (
              <><Send size={14} /> Send Enquiry</>
            )}
          </button>

          {/* Success */}
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-white/10 rounded-sm px-4 py-3"
            >
              <CheckCircle size={18} className="text-gold-light shrink-0" />
              <p className="text-cream" style={{ fontFamily: "var(--font-body)", fontSize: 14 }}>
                Thank you! We'll get back to you within 24 hours.
              </p>
            </motion.div>
          )}

          {/* Error */}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-red-900/30 rounded-sm px-4 py-3"
            >
              <AlertCircle size={18} className="text-red-400 shrink-0" />
              <p className="text-cream" style={{ fontFamily: "var(--font-body)", fontSize: 14 }}>
                Something went wrong. Please email us at Sezan@ins-overseas.com
              </p>
            </motion.div>
          )}
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

function FloatField({ name, label, type, value, onChange }: {
  name: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <input
        name={name}
        type={type}
        required
        placeholder=" "
        value={value}
        onChange={onChange}
        className="peer w-full bg-transparent border-b border-cream/30 focus:border-gold-light pt-6 pb-2 text-cream placeholder-transparent focus:outline-none"
      />
      <label className="absolute left-0 top-1 text-[11px] text-cream/60 uppercase peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-focus:top-1 peer-focus:text-[11px] peer-focus:uppercase peer-focus:text-gold-light transition-all" style={{ letterSpacing: "0.15em" }}>
        {label}
      </label>
    </div>
  );
}
