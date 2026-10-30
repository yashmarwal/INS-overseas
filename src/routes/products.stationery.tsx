import { createFileRoute } from "@tanstack/react-router";
import { seoPages } from "@/data/seoPages";
import PageHero from "@/components/shared/PageHero";
import ProductCard from "@/components/shared/ProductCard";
import { products, categoryMeta } from "@/data/products";

const slug = "stationery" as const;
const meta = categoryMeta[slug];

export const Route = createFileRoute("/products/stationery")({
  head: () => ({ meta: [{ title: seoPages["/products/stationery"].title }, { name: "description", content: seoPages["/products/stationery"].description }] }),
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
