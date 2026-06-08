import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/shared/PageHero";
import ContactStrip from "@/components/home/ContactStrip";
import { MessageCircle, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact | INS Overseas" }, { name: "description", content: "Reach our team in Sanganer, Jaipur. WhatsApp, email, phone, and detailed enquiry form." }] }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHero eyebrow="Get in Touch" title={<>Let's <em className="italic font-light text-gold-light">Talk</em></>} subtitle="Wholesale, custom orders, samples or just a conversation — we respond within 24 hours." />
      <ContactStrip />
      <section className="bg-parchment py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: MessageCircle, label: "WhatsApp", sub: "Fastest response", href: "https://wa.me/919680478483", cta: "Open WhatsApp" },
            { icon: Mail, label: "Email", sub: "Detailed enquiries", href: "mailto:Sezan@ins-overseas.com", cta: "Send Email" },
            { icon: Phone, label: "Call", sub: "Mon–Sat, 24 hours", href: "tel:+919680478483", cta: "Call Now" },
          ].map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="bg-cream p-8 border border-warm-grey-light hover:border-gold transition-colors">
              <c.icon className="text-gold" size={28} />
              <h3 className="mt-4 text-ink text-2xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{c.label}</h3>
              <p className="mt-1 text-warm-grey text-sm">{c.sub}</p>
              <p className="mt-4 uppercase text-[11px] text-umber" style={{ letterSpacing: "0.2em" }}>{c.cta} →</p>
            </a>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 mt-12 aspect-[16/7] overflow-hidden">
          <iframe title="INS Overseas, Sanganer" src="https://www.google.com/maps?q=Sanganer,Jaipur&output=embed" className="w-full h-full" loading="lazy" />
        </div>
      </section>
    </>
  );
}
