import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import { StackedCard, StackPin, StackTail, useStack } from "@/components/home/StackedCard";
import { moqNumber } from "@/data/catalogue";
import { PRODUCT_CATEGORIES, productsQuery, tagLabel, type ProductImage } from "@/hooks/useProductImages";

// "Fresh From The Workshop": its own homepage section, filled from the products ticked "Show on the homepage" in the
// admin (up to 6, in the admin's order), as cards that stack while you scroll. With nothing ticked the section does
// not exist, so the page is as it was.
const MAX = 6;
const WHATSAPP = "https://wa.me/919680478483";
const catLabel = (id: string) => PRODUCT_CATEGORIES.find((c) => c.id === id)?.label ?? id;
const blurb = (p: ProductImage) =>
  p.alt_text && p.alt_text.trim().toLowerCase() !== (p.product_name || "").trim().toLowerCase()
    ? p.alt_text
    : "Handmade in Sanganer, Jaipur. Custom branding available. Ships worldwide by air or sea.";

export default function FeaturedCollection() {
  const q = useQuery(productsQuery()); // shared with the Products page; fetched ahead of time when the browser is idle
  const { ref, progress, hold } = useStack();
  const picks = (q.data ?? []).filter((p) => p.featured).slice(0, MAX);
  if (picks.length === 0) return null;

  return (
    <section className="bg-cream pt-16 md:pt-24 lg:pt-32" style={{ marginBottom: -hold }} aria-labelledby="handpicked-title">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <SectionHeading eyebrow="Handpicked" title={<span id="handpicked-title">Fresh From <em className="italic font-light">The Workshop</em></span>}>
          A few pieces we are especially proud of right now. Ask for pricing and samples on any of them.
        </SectionHeading>
        <div className="mt-5 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-umber uppercase hover:gap-3 transition-all duration-200"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12, letterSpacing: "0.16em" }}
          >
            See all products <ArrowRight size={14} />
          </Link>
        </div>

        <div ref={ref} className="mt-6 md:mt-10">
          {picks.map((p, i) => {
            const name = p.product_name || "Handmade Product";
            const tag = tagLabel(p.tag);
            return (
              <StackPin key={p.id} i={i} n={picks.length} progress={progress}>
                <StackedCard
                  index={i}
                  total={picks.length}
                  photo={<img src={p.url} alt={name} loading="lazy" decoding="async" className="w-full h-full object-cover" />}
                  pill={catLabel(p.category)}
                  tag={tag ? { label: tag, gold: p.tag === "best" } : null}
                  title={name}
                  desc={blurb(p)}
                  moqValue={`${moqNumber(p.category)}+ pcs`}
                  chatHref={`${WHATSAPP}?text=${encodeURIComponent(`Hi INS Overseas, I'm interested in "${name}". Please share wholesale pricing and MOQ.`)}`}
                  chatLabel={`Chat on WhatsApp about ${name}`}
                  secondary={{ to: "/products", label: "See the full catalogue", icon: <ShoppingBag size={19} strokeWidth={1.7} /> }}
                  primary={{
                    label: "Enquire",
                    href: `mailto:Sezan@ins-overseas.com?subject=${encodeURIComponent(`Enquiry: ${name}`)}&body=${encodeURIComponent(`Hi INS Overseas team,\r\n\r\nI am interested in ${name}. Please share more details including pricing and MOQ.\r\n\r\nThank you`)}`,
                  }}
                />
              </StackPin>
            );
          })}
          <StackTail hold={hold} />
        </div>

      </div>
    </section>
  );
}
