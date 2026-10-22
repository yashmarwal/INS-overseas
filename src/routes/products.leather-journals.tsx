import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import PageHero from "@/components/shared/PageHero";
import ProductCard from "@/components/shared/ProductCard";
import { products, categoryMeta } from "@/data/products";

const slug = "leather-journals" as const;
const meta = categoryMeta[slug];

export const Route = createFileRoute("/products/leather-journals")({
  head: () => ({ meta: [{ title: `${meta.label} | INS Overseas` }, { name: "description", content: meta.description }] }),
  component: CategoryPage,
});

function CategoryPage() {
  const { submit, status } = useFormSubmit();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState(false); // honeypot, as on the other forms
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const sent = await submit({ subject: `Quick Enquiry — ${meta.label} — INS Overseas`, from_name: email, email, message, botcheck: trap });
    if (sent) { setEmail(""); setMessage(""); }
  };
  const items = products.filter((p) => p.category === slug);
  return (
    <>
      <PageHero eyebrow="Collection" title={meta.label} subtitle={meta.description} image={meta.hero} />
      <section className="bg-cream py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
          <aside className="lg:col-span-1 space-y-8 lg:sticky lg:top-32 self-start">
            <h3 className="text-xs uppercase text-gold tracking-[0.2em]">Quick Enquiry</h3>
            <p className="text-sm text-umber-dark leading-relaxed">
              Wholesale, custom branding, sample requests — tell us what you need and we'll respond within 24 hours.
            </p>
            <form className="space-y-4" onSubmit={send}>
              <input type="checkbox" name="botcheck" checked={trap} onChange={(e) => setTrap(e.target.checked)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px opacity-0" />
              <input required type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" aria-label="Your email" className="w-full bg-transparent border-b border-warm-grey/50 py-2 text-sm focus:outline-none focus:border-gold" />
              <textarea required rows={3} name="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What are you looking for?" aria-label="What are you looking for?" className="w-full bg-transparent border-b border-warm-grey/50 py-2 text-sm focus:outline-none focus:border-gold" />
              <button type="submit" disabled={status === "submitting"} className="border border-umber text-umber text-[11px] uppercase px-5 py-2.5 hover:bg-umber hover:text-cream disabled:opacity-60" style={{ letterSpacing: "0.15em" }}>{status === "submitting" ? "Sending…" : "Send Enquiry"}</button>
              {status === "success" && <p role="status" className="text-sm text-umber-dark">Thank you! We'll get back to you within 24 hours.</p>}
              {status === "error" && <p role="alert" className="text-sm text-[#B42318]">Something went wrong. Please email us at Sezan@ins-overseas.com</p>}
            </form>
          </aside>
          <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((p, i) => (<ProductCard key={p.id} product={p} i={i} />))}
          </div>
        </div>
      </section>
    </>
  );
}
