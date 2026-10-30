// Shared by the two server functions in this folder (the product pages and the products sitemap).
// It reads the same public data the website itself reads (the anon key below is the public one that is already in the
// site's own JavaScript; it can only read). Nothing here can change anything.
import { SITE_URL } from "../site.config.mjs";

export const SUPABASE_URL = "https://ebmhkylrkcrhxyzclevz.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVibWhreWxya2NyaHh5emNsZXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTYwNDQsImV4cCI6MjA5NjMzMjA0NH0.x7VXmmMYmUCRrlGpTDqvy2aWiFLVhgD1FkzaVN8fyAQ";
export const SITE = SITE_URL;

// The collection page each category belongs to (the same grouping the Products page uses); anything else goes to the full range.
const COLLECTION_OF = {
  "leather-journals": "/products/leather-journals",
  "handmade-deckle-edge-paper": "/products/handmade-paper",
  "handmade-seed-paper": "/products/handmade-paper",
  "handmade-paper-gift-box": "/products/stationery",
  "handmade-paper-gift-bag": "/products/stationery",
  "leather-bags": "/products/leather-accessories",
};
export const collectionPath = (category) => COLLECTION_OF[category] || "/products";

const CATEGORY_LABELS = {
  "leather-journals": "Leather Journal",
  "leather-bags": "Leather Bag",
  "handmade-paper-gift-box": "Paper Gift Box",
  "handmade-paper-gift-bag": "Paper Gift Bag",
  "handmade-seed-paper": "Seed Paper",
  "handmade-deckle-edge-paper": "Deckle Edge Paper",
  "handblock-print-fabric": "Handblock Print Fabric",
};
// The client's minimum orders (keep in step with src/data/moq.ts; a test compares the two). Deckle edge and handblock fabric are NOT in the
// client's list: no number, the pages say "confirmed in your quote".
const CATEGORY_MOQ = {
  "leather-journals": 250,
  "handmade-paper": 500,
  "handmade-paper-gift-box": 200,
  "handmade-paper-gift-bag": 400,
  "greeting-cards": 500,
  "handmade-seed-paper": 1000,
  "leather-bags": 150,
};
export const DEFAULT_LEAD_DAYS = 25;
export { CATEGORY_MOQ };
const termsText = (p) => `${p.moq == null ? "Minimum order confirmed in your quote" : `Minimum order ${p.moq} pcs`}, lead time ${p.lead} days`;

// ── the same address rules as src/lib/share.ts and src/lib/productUrl.ts (keep them in step)
export const shortCode = (id) => (id.length > 12 ? id.replace(/-/g, "").slice(0, 8) : id);
export const slugify = (s) =>
  String(s ?? "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70).replace(/-+$/g, "");
export const productSlug = (id, name, code) => `${slugify([name, code].filter(Boolean).join(" ")) || "product"}-${shortCode(id)}`;
export const idPartOfSlug = (slug) => slug.slice(slug.lastIndexOf("-") + 1);

export const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clean = (v, max) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
const json = (alt) => { try { const v = JSON.parse(String(alt ?? "")); return v && typeof v === "object" ? v : {}; } catch { return {}; } };

/** Every product with its details, terms and category name, from the live database. Throws if the database cannot be read. */
export async function loadCatalogue(fetchFn = fetch) {
  const url = `${SUPABASE_URL}/rest/v1/site_images?select=*&section=in.(product,product_details,product_terms,product_category)&order=sort_order.asc&limit=5000`;
  const r = await fetchFn(url, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
  if (!r.ok) throw new Error(`database answered ${r.status}`);
  const rows = await r.json();
  if (!Array.isArray(rows)) throw new Error("unexpected answer");

  const details = new Map(), terms = new Map(), customCats = new Map();
  for (const row of rows) {
    if (row.section === "product_details" && row.storage_path) details.set(row.storage_path, json(row.alt_text));
    else if (row.section === "product_terms" && row.storage_path) terms.set(row.storage_path, json(row.alt_text));
    else if (row.section === "product_category" && row.category && row.product_name) customCats.set(row.category, { label: row.product_name, moq: Math.round(Number(json(row.alt_text).moq)) >= 1 ? Math.round(Number(json(row.alt_text).moq)) : null });
  }
  const products = rows
    .filter((row) => row.section === "product" && row.id && row.url)
    .map((row) => {
      const d = details.get(row.id) || {}, t = terms.get(row.id) || {};
      const name = clean(row.product_name, 120) || "Handmade Product";
      const cat = row.category || "";
      const catLabel = CATEGORY_LABELS[cat] || customCats.get(cat)?.label || cat || "Handmade";
      const code = clean(d.code, 24);
      const desc = clean(row.alt_text, 600);
      return {
        id: row.id,
        name,
        code,
        category: cat,
        categoryLabel: catLabel,
        description: desc && desc.toLowerCase() !== name.toLowerCase() ? desc : "",
        image: row.url,
        photos: (Array.isArray(d.photos) ? d.photos : []).map((p) => p && p.url).filter((u) => typeof u === "string" && /^https?:\/\//.test(u)).slice(0, 5),
        size: clean(d.size, 60),
        material: clean(d.material, 80),
        colours: clean(d.colours, 80),
        custom: clean(d.custom, 200),
        moq: Math.round(Number(t.moq)) >= 1 ? Math.round(Number(t.moq)) : CATEGORY_MOQ[cat] || customCats.get(cat)?.moq || null,
        lead: Math.max(1, Math.round(Number(t.lead)) || DEFAULT_LEAD_DAYS),
        tag: row.tag === "best" ? "Best seller" : row.tag === "new" ? "New" : "",
        created: row.created_at,
      };
    });
  return products;
}

export const findProduct = (products, part) => products.find((p) => shortCode(p.id) === part || p.id === part);
export const pathOf = (p) => `/product/${productSlug(p.id, p.name, p.code)}`;

/** The origin to read the page template from: our own site (or a Vercel preview of it), never an arbitrary host. */
export function originOf(req) {
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").toLowerCase().split(",")[0].trim();
  if (/^(www\.)?ins-overseas\.com$/.test(host)) return SITE;
  if (/^[a-z0-9-]+\.vercel\.app$/.test(host)) return `https://${host}`;
  return SITE;
}

/** The page's head tags and a plain-text copy of the product for readers that do not run scripts. */
export function productMarkup(p) {
  const canonical = SITE + pathOf(p);
  const title = `${p.name}${p.code ? ` (${p.code})` : ""} | ${p.categoryLabel} | INS Overseas`;
  const spec = [p.size, p.material].filter(Boolean).join(" · ");
  const description = [p.description, spec, `Wholesale ${p.categoryLabel.toLowerCase()} from Jaipur, India. ${termsText(p)}. Custom branding available.`]
    .filter(Boolean).join(" ").replace(/\s+/g, " ").slice(0, 160);
  const images = [p.image, ...p.photos];
  const crumbs = [["Home", SITE], ["Products", `${SITE}/products`], [p.categoryLabel, `${SITE}${collectionPath(p.category)}`], [p.name, canonical]];
  const ld = [
    {
      "@type": "Product",
      "@id": `${canonical}#product`,
      name: p.name,
      url: canonical,
      image: images,
      description: [p.description, spec, `Wholesale ${p.categoryLabel.toLowerCase()} from Jaipur, India. ${termsText(p)}. Custom branding available.`].filter(Boolean).join(" ").slice(0, 300),
      ...(p.code ? { sku: p.code, mpn: p.code } : {}),
      brand: { "@type": "Brand", name: "INS Overseas" },
      manufacturer: { "@id": `${SITE}/#organization` },
      category: p.categoryLabel,
      ...(p.material ? { material: p.material } : {}),
      ...(p.colours ? { color: p.colours } : {}),
      ...(p.size ? { size: p.size } : {}),
      additionalProperty: [
        ...(p.moq == null ? [] : [{ "@type": "PropertyValue", name: "Minimum order quantity", value: `${p.moq} pcs` }]),
        { "@type": "PropertyValue", name: "Lead time", value: `${p.lead} days` },
        ...(p.custom ? [{ "@type": "PropertyValue", name: "Customisation", value: p.custom }] : []),
      ],
    },
    { "@type": "BreadcrumbList", itemListElement: crumbs.map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })) },
  ];
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:type" content="product" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${esc(p.image)}" />`,
    `<meta property="og:image:alt" content="${esc(p.name)}" />`,
    `<meta property="og:site_name" content="INS Overseas" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(p.image)}" />`,
    `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": ld }).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
  const facts = [
    p.code && `Item code: ${p.code}`, p.size && `Size: ${p.size}`, p.material && `Material: ${p.material}`, p.colours && `Colours: ${p.colours}`,
    p.moq == null ? "Minimum order: confirmed in your quote" : `Minimum order: ${p.moq} pcs`, `Lead time: ${p.lead} days`, p.custom && `Customisation: ${p.custom}`,
  ].filter(Boolean);
  const trail =
    `<nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/products">Products</a></li>` +
    `<li><a href="${collectionPath(p.category)}">${esc(p.categoryLabel)}</a></li><li>${esc(p.name)}</li></ol></nav>`;
  const body =
    `<main data-product-prerender>` + trail +
    `<h1>${esc(p.name)}</h1><p>${esc(p.categoryLabel)}${p.tag ? ` - ${esc(p.tag)}` : ""}</p>${p.description ? `<p>${esc(p.description)}</p>` : ""}` +
    `<ul>${facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>` +
    images.map((u) => `<img src="${esc(u)}" alt="${esc(p.name)}" />`).join("") +
    `<p>Wholesale from INS Overseas, Sanganer, Jaipur, India. Ask for pricing and samples.</p>` +
    `<ul><li><a href="/contact">Contact INS Overseas</a></li><li><a href="/wholesale">Wholesale and private label</a></li><li><a href="${collectionPath(p.category)}">More ${esc(p.categoryLabel.toLowerCase())} products</a></li></ul></main>`;
  return { head, body, title, canonical };
}

/** The template (the site's own index.html) with this product's tags and text put in. */
export function injectProduct(template, p) {
  const { head, body } = productMarkup(p);
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/i, "")
    .replace(/<link\s+rel="canonical"[^>]*>/i, "")
    .replace(/<meta\s+property="og:(?:type|url|title|description|image|image:width|image:height|image:alt)"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:(?:title|description|image|image:alt|url)"[^>]*>/gi, "");
  // (the template's own Product block describes the homepage, not this product)
  html = html.replace(/\s*<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "Product",[\s\S]*?<\/script>/, "");
  html = html.replace(/<\/head>/i, () => `    ${head}\n  </head>`);
  // the page's own header and footer links come from the template (the prerender script writes them there from siteNav.ts)
  const header = (template.match(/<header data-shell="header">[\s\S]*?<\/header>/i) || [""])[0];
  const footer = (template.match(/<footer data-shell="footer">[\s\S]*?<\/footer>/i) || [""])[0];
  html = html.replace(/<div id="root">(?:<!--seo-shell-start-->[\s\S]*?<!--seo-shell-end-->)?\s*<\/div>/i, () => `<div id="root"><div class="seo-shell">${header}${body}${footer}</div></div>`);
  return html;
}

/** The template without the home page's crawler body: used wherever the page is NOT about the homepage (an unknown product, a database that is down). */
export const withoutShell = (t) => t.replace(/<!--seo-shell-start-->[\s\S]*?<!--seo-shell-end-->/, "");

export async function loadTemplate(req, fetchFn = fetch) {
  const r = await fetchFn(`${originOf(req)}/index.html`, { headers: { "user-agent": "ins-overseas-product-page" } });
  if (!r.ok) throw new Error(`template answered ${r.status}`);
  const t = await r.text();
  if (!/<div id="root">/i.test(t)) throw new Error("template has no root");
  return t;
}
