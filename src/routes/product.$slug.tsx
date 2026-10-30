import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import FadeImg from "@/components/shared/FadeImg";
import { QuoteToggle } from "@/components/home/HomeProductCard";
import { WhatsAppGlyph } from "@/components/ui/FloatingDock";
import { tagLabel, useProductImages, type ProductImage } from "@/hooks/useProductImages";
import { useProductDetails } from "@/hooks/useProductDetails";
import { useProductTerms } from "@/hooks/useProductTerms";
import { useCategories } from "@/hooks/useCategories";
import { categoryLabel, moqPcs, productLead, productMoq } from "@/data/catalogue";
import { specLine, type ProductDetails } from "@/data/productDetails";
import { idPartOfSlug, productPageUrl, productPath, productSlug } from "@/lib/productUrl";
import { productShareUrl, shortCode } from "@/lib/share";
import { trackProduct } from "@/lib/track";
import { buildBreadcrumb, ORG_ID, SITE_URL } from "@/lib/seo";

// A product's own page: photos, item code, size, material, colours, customisation, minimum order and lead time, and the
// buttons to enquire. It has its own address, title, description and structured data, so search engines can list it.
const WHATSAPP = "https://wa.me/919680478483";

const descriptionOf = (p: ProductImage) => {
  const name = (p.product_name || "").trim().toLowerCase();
  return p.alt_text && p.alt_text.trim().toLowerCase() !== name ? p.alt_text.trim() : "";
};

/** Title, description and structured data for one product (also used for the page's head). */
function productHead(row: ProductImage, d?: Omit<ProductDetails, "rowId"> | null) {
  const name = row.product_name || "Handmade Product";
  const canonical = productPageUrl(row.id, name, d?.code);
  const cat = categoryLabel(row.category);
  const moq = productMoq(row.id, row.category), lead = productLead(row.id);
  const spec = specLine(d ?? undefined);
  const title = `${name}${d?.code ? ` (${d.code})` : ""} | ${cat} | INS Overseas`;
  const description = [descriptionOf(row), spec, `Wholesale ${cat.toLowerCase()} from Jaipur, India. ${moq == null ? "Minimum order confirmed in your quote" : `Minimum order ${moq} pcs`}, lead time ${lead} days. Custom branding available.`]
    .filter(Boolean).join(" ").replace(/\s+/g, " ").slice(0, 300);
  const images = [row.url, ...(d?.photos ?? []).map((p) => p.url)];
  const product = {
    "@type": "Product",
    "@id": `${canonical}#product`,
    name,
    url: canonical,
    image: images,
    description,
    ...(d?.code ? { sku: d.code, mpn: d.code } : {}),
    brand: { "@type": "Brand", name: "INS Overseas" },
    manufacturer: { "@id": ORG_ID },
    category: cat,
    ...(d?.material ? { material: d.material } : {}),
    ...(d?.colours ? { color: d.colours } : {}),
    ...(d?.size ? { size: d.size } : {}),
    additionalProperty: [
      ...(moq == null ? [] : [{ "@type": "PropertyValue", name: "Minimum order quantity", value: `${moq} pcs` }]),
      { "@type": "PropertyValue", name: "Lead time", value: `${lead} days` },
      ...(d?.custom ? [{ "@type": "PropertyValue", name: "Customisation", value: d.custom }] : []),
    ],
  };
  return { name, canonical, cat, moq, lead, title, description, images, schema: [product, buildBreadcrumb([{ name: "Home", url: SITE_URL }, { name: "Products", url: `${SITE_URL}/products` }, { name: cat, url: `${SITE_URL}/products` }, { name, url: canonical }])] };
}

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ context, params }) => {
    let rows: ProductImage[], det: Map<string, ProductDetails>;
    try {
      // (loaded only now: the data code is not part of the page every visitor downloads)
      const [{ productsQuery }, { productDetailsQuery }] = await Promise.all([import("@/hooks/useProductImages"), import("@/hooks/useProductDetails")]);
      [rows, det] = await Promise.all([context.queryClient.ensureQueryData(productsQuery()), context.queryClient.ensureQueryData(productDetailsQuery())]);
    } catch {
      return { row: null as ProductImage | null, details: null as ProductDetails | null, failed: true }; // offline or slow: the page itself retries
    }
    const id = idPartOfSlug(params.slug);
    const row = rows.find((r) => shortCode(r.id) === id) ?? null;
    if (!row) throw notFound();
    return { row, details: det.get(row.id) ?? null, failed: false };
  },
  component: ProductPage,
});

/**
 * This site fixes each page's title and description when it is built (see scripts/prerender-seo.mjs), and for a product the
 * server does it (api/product.js). For a visitor who arrives by clicking inside the site, the page sets them itself, and puts
 * the old ones back when they leave.
 */
function useProductHead(h: ReturnType<typeof productHead> | null) {
  const key = h ? h.canonical + "|" + h.title + "|" + h.description : "";
  useEffect(() => {
    if (!h) return;
    const undo: (() => void)[] = [];
    const prevTitle = document.title;
    document.title = h.title;
    undo.push(() => { document.title = prevTitle; });
    const set = (selector: string, make: () => HTMLElement, attr: "content" | "href", value: string) => {
      let el = document.head.querySelector<HTMLElement>(selector);
      const created = !el;
      if (!el) { el = make(); document.head.appendChild(el); }
      const prev = el.getAttribute(attr);
      el.setAttribute(attr, value);
      undo.push(() => { if (created) el!.remove(); else if (prev !== null) el!.setAttribute(attr, prev); });
    };
    const meta = (k: "name" | "property", v: string) => () => { const m = document.createElement("meta"); m.setAttribute(k, v); return m; };
    set("meta[name=description]", meta("name", "description"), "content", h.description.slice(0, 160));
    set("link[rel=canonical]", () => { const l = document.createElement("link"); l.rel = "canonical"; return l; }, "href", h.canonical);
    set("meta[property='og:title']", meta("property", "og:title"), "content", h.title);
    set("meta[property='og:description']", meta("property", "og:description"), "content", h.description.slice(0, 160));
    set("meta[property='og:url']", meta("property", "og:url"), "content", h.canonical);
    set("meta[property='og:image']", meta("property", "og:image"), "content", h.images[0]);
    // (arriving from a search engine or a link, the server has already put this product's data in the page: no second copy)
    const have = [...document.head.querySelectorAll('script[type="application/ld+json"]')].some((s) => s.textContent?.includes(`${h.canonical}#product`));
    if (!have) {
      const ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.dataset.product = "1";
      ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": h.schema });
      document.head.appendChild(ld);
      undo.push(() => ld.remove());
    }
    return () => { undo.reverse().forEach((f) => f()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

const label = { fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10.5, letterSpacing: "0.14em", color: "var(--grey-ink)" } as const;

function ProductPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { images: rows, loading } = useProductImages();
  const { details, loading: detailsLoading } = useProductDetails();
  useProductTerms();
  useCategories();
  const id = idPartOfSlug(slug);
  const row = rows.find((r) => shortCode(r.id) === id);
  const d = row ? details.get(row.id) : undefined;
  const [active, setActive] = useState(0);

  // the address has the product's current name and code in it; an old or shortened one is swapped for it
  const wanted = row ? productSlug(row.id, row.product_name || "Handmade Product", d?.code) : "";
  useEffect(() => {
    if (row && !detailsLoading && wanted && wanted !== slug) void navigate({ to: "/product/$slug", params: { slug: wanted }, replace: true });
  }, [row, detailsLoading, wanted, slug, navigate]);
  useEffect(() => { setActive(0); }, [row?.id]);
  useEffect(() => { if (row) trackProduct(row.id, "view"); }, [row?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useProductHead(row ? productHead(row, d) : null);
  const related = useMemo(() => (row ? rows.filter((r) => r.category === row.category && r.id !== row.id).slice(0, 4) : []), [rows, row]);

  if (!row) {
    return (
      <main className="bg-cream min-h-[60vh] pt-36 pb-24 px-5 text-center">
        <p className="text-umber" style={{ fontFamily: "var(--font-body)" }}>{loading ? "Loading the product…" : "We couldn't find this product. It may have been removed."}</p>
        {!loading && <Link to="/products" className="inline-block mt-6 border border-umber text-umber px-6 py-3 uppercase text-xs tracking-[0.15em]">See all products</Link>}
      </main>
    );
  }

  const name = row.product_name || "Handmade Product";
  const h = productHead(row, d);
  const photos = [row.url, ...(d?.photos ?? []).map((p) => p.url)];
  const tag = tagLabel(row.tag);
  const desc = descriptionOf(row);
  const code = d?.code ?? "";
  const mail = `mailto:Sezan@ins-overseas.com?subject=${encodeURIComponent(`Product Enquiry: ${name}${code ? ` (${code})` : ""} - INS Overseas`)}&body=${encodeURIComponent(`Hi INS Overseas Team,\n\nI am interested in the following product:\n\nProduct: ${name}\n${code ? `Item code: ${code}\n` : ""}Category: ${h.cat}\nProduct link: ${productShareUrl(row.id)}\n\nPlease share:\n- Wholesale pricing\n- Available sizes and variants\n- MOQ details\n- Lead time for bulk order\n- Custom branding options (if any)\n\nCompany: \nCountry: \nEstimated Quantity: \n\nThank you,`)}`;
  const rows2: [string, string][] = [
    ...(code ? [["Item code", code] as [string, string]] : []),
    ...(d?.size ? [["Size", d.size] as [string, string]] : []),
    ...(d?.material ? [["Material", d.material] as [string, string]] : []),
    ...(d?.colours ? [["Colours", d.colours] as [string, string]] : []),
    ["Min. order", h.moq == null ? "Confirmed in quote" : `${h.moq} units minimum`],
    ["Lead time", `${h.lead} days after order confirmation`],
    ["Custom", d?.custom || "Logo debossing, embossing, foil available"],
    ["Shipping", "Air 7–10 days · Sea 35–40 days"],
  ];

  return (
    <main className="bg-cream pt-28 sm:pt-32 pb-20 sm:pb-28">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--grey-ink)" }}>
          <Link to="/" className="hover:text-ink">Home</Link><ChevronRight size={13} aria-hidden />
          <Link to="/products" className="hover:text-ink">Products</Link><ChevronRight size={13} aria-hidden />
          <span>{h.cat}</span><ChevronRight size={13} aria-hidden />
          <span className="text-ink font-medium line-clamp-1" aria-current="page">{name}</span>
        </nav>

        <div className="mt-6 grid lg:grid-cols-[1.08fr_1fr] gap-8 lg:gap-14 items-start">
          {/* photos */}
          <div>
            <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden bg-[#EFEBE3] img-shimmer shadow-[0_30px_60px_-34px_rgba(26,20,16,0.5)]">
              <FadeImg key={photos[active]} src={photos[active]} alt={active === 0 ? name : `${name} - photo ${active + 1}`} className="w-full h-full object-cover" />
            </div>
            {photos.length > 1 && (
              <ul className="mt-3 flex flex-wrap gap-2.5" aria-label="More photos">
                {photos.map((u, i) => (
                  <li key={u}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Show photo ${i + 1} of ${photos.length}`}
                      aria-pressed={active === i}
                      className={`block w-[72px] h-[72px] rounded-2xl overflow-hidden bg-[#EFEBE3] transition-shadow ${active === i ? "ring-2 ring-umber" : "ring-1 ring-ink/10 hover:ring-umber/50"}`}
                    >
                      <img src={u} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* facts and buttons */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="uppercase px-3 py-1.5 rounded-full bg-white text-umber-dark shadow-[0_1px_4px_rgba(26,20,16,0.12)]" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10, letterSpacing: "0.14em" }}>{h.cat}</span>
              {tag && <span className={`uppercase px-3 py-1.5 rounded-full ${row.tag === "best" ? "bg-gold text-ink" : "bg-ink text-cream"}`} style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 10, letterSpacing: "0.12em" }}>{tag}</span>}
            </div>
            <h1 className="mt-4 text-ink leading-[1.05]" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.015em" }}>{name}</h1>
            {code && <p className="mt-2 tabular-nums" style={{ ...label, fontSize: 12, letterSpacing: "0.16em" }}>ITEM CODE {code}</p>}
            {desc && <p className="mt-4 leading-relaxed" style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 15.5, color: "var(--grey-ink)" }}>{desc}</p>}

            <dl className="mt-7 flex flex-col gap-2">
              {rows2.map(([k, v]) => (
                <div key={k} className="flex items-baseline gap-4 rounded-2xl bg-[#F6F3EC] px-4 py-3">
                  <dt className="shrink-0 w-[92px] uppercase" style={label}>{k}</dt>
                  <dd className="text-ink" style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 14, lineHeight: 1.45 }}>{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={mail}
                onClick={() => trackProduct(row.id, "enquire")}
                aria-label={`Enquire about ${name}`}
                className="inline-flex items-center gap-2.5 h-12 pl-6 pr-1.5 rounded-full bg-ink text-white hover:bg-umber-dark active:scale-95 transition-[background-color,transform]"
                style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14 }}
              >
                Enquire
                <span className="w-9 h-9 rounded-full bg-white text-ink flex items-center justify-center"><ArrowUpRight size={16} /></span>
              </a>
              <QuoteToggle item={{ id: row.id, name, code: code || undefined, category: h.cat, moq: moqPcs(h.moq), url: productShareUrl(row.id), productId: row.id }} className="!h-12 !px-5 !shadow-none border border-umber/40" />
              <a
                href={`${WHATSAPP}?text=${encodeURIComponent(`Hi INS Overseas, I'm interested in "${name}"${code ? ` (${code})` : ""}. Please share wholesale pricing and MOQ.\n${productShareUrl(row.id)}`)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackProduct(row.id, "enquire")}
                className="inline-flex items-center gap-2 h-12 px-4 rounded-full text-umber-dark hover:text-ink underline underline-offset-4 decoration-umber/40"
                style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14 }}
              >
                <WhatsAppGlyph size={18} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 sm:mt-24" aria-labelledby="more-title">
            <h2 id="more-title" className="text-ink" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(26px, 3vw, 36px)" }}>More {h.cat.toLowerCase()}</h2>
            <ul className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {related.map((r) => {
                const rd = details.get(r.id);
                const rn = r.product_name || "Handmade Product";
                return (
                  <li key={r.id}>
                    <Link to="/product/$slug" params={{ slug: productPath(r.id, rn, rd?.code).slice("/product/".length) }} className="group block rounded-2xl bg-white border border-ink/10 overflow-hidden hover:-translate-y-1 hover:shadow-[0_22px_44px_-20px_rgba(26,20,16,0.4)] transition-all duration-300">
                      <div className="aspect-[4/5] bg-[#EFEBE3] overflow-hidden"><img src={r.url} alt={rn} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" /></div>
                      <div className="p-3.5">
                        <p className="text-ink leading-snug line-clamp-2" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17 }}>{rn}</p>
                        {rd?.code && <p className="mt-1 tabular-nums" style={label}>{rd.code}</p>}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
