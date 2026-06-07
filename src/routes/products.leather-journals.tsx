import { createFileRoute } from "@tanstack/react-router";
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
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Sent — we'll be in touch."); }}>
              <input required type="email" placeholder="Your email" className="w-full bg-transparent border-b border-warm-grey/50 py-2 text-sm focus:outline-none focus:border-gold" />
              <textarea required rows={3} placeholder="What are you looking for?" className="w-full bg-transparent border-b border-warm-grey/50 py-2 text-sm focus:outline-none focus:border-gold" />
              <button className="border border-umber text-umber text-[11px] uppercase px-5 py-2.5 hover:bg-umber hover:text-cream" style={{ letterSpacing: "0.15em" }}>Send Enquiry</button>
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
