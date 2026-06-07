import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/shared/PageHero";
import ProductCard from "@/components/shared/ProductCard";
import { products, categoryMeta } from "@/data/products";

const slug = "leather-accessories" as const;
const meta = categoryMeta[slug];

export const Route = createFileRoute("/products/leather-accessories")({
  head: () => ({ meta: [{ title: `${meta.label} | INS Overseas` }, { name: "description", content: meta.description }] }),
  component: CategoryPage,
});

function CategoryPage() {
  const items = products.filter((p) => p.category === slug);
  return (
    <>
      <PageHero eyebrow="Collection" title={meta.label} subtitle={meta.description} image={meta.hero} />
      <section className="bg-cream py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 grid grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((p, i) => (<ProductCard key={p.id} product={p} i={i} />))}
        </div>
      </section>
    </>
  );
}
