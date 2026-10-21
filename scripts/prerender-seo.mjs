// Runs after `vite build`. This is a CSR (client-rendered) SPA, so Vercel serves one
// static index.html for every route. That means crawlers which don't execute JS see the
// homepage's canonical/title/JSON-LD on every URL — a duplicate-content trap.
//
// This script clones dist/index.html per route and swaps in that route's own
// title/description/canonical/OG/Twitter/JSON-LD, so the static HTML served for e.g.
// /products already has the right <head> before React ever hydrates. It does not
// touch routing/redirects — vercel.json rewrites (additive, not redirects) point each
// path at its prerendered file.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const SITE_URL = "https://ins-overseas.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const posts = [
  {
    slug: "art-of-deckle-edges",
    title: "The Art of Deckle Edges — Why Handmade Paper Feels Different",
    excerpt:
      "That soft, irregular fringe at the edge of a handmade sheet is not a flaw. It is the most honest thing about the paper. We explain how deckle edges form and why every serious paper collector prizes them.",
    img: "/blog/deckle-edges.jpg",
    datePublished: "2025-05-01",
    dateModified: "2025-05-01",
    cat: "Craft Stories",
  },
  {
    slug: "sanganer-village-papers-world",
    title: "Sanganer: The Ancient Village That Papers the World",
    excerpt:
      "Fifteen kilometres from Jaipur's old city, on the banks of the Sâmbhar river, a community has been making paper by hand for over 400 years. This is their story — and ours.",
    img: "/blog/sanganer-village.jpg",
    datePublished: "2025-04-01",
    dateModified: "2025-04-01",
    cat: "Jaipur Heritage",
  },
  {
    slug: "leather-journal-care-guide",
    title: "How to Care for Your Leather Journal — A Complete Guide",
    excerpt:
      "Buffalo leather improves with age — but only if you treat it right. Here is everything your customers need to know about conditioning, storing, and using their INS Overseas journal.",
    img: "/blog/leather-care.jpg",
    datePublished: "2025-03-01",
    dateModified: "2025-03-01",
    cat: "Product Care",
  },
  {
    slug: "paper-fountain-pen-vs-watercolour",
    title: "Choosing Paper for Fountain Pens vs Watercolour — What Actually Matters",
    excerpt:
      "Not all handmade paper is the same. The weight, surface texture, and sizing treatment all determine whether your pen glides or catches, whether your colours bleed or bloom. A practical guide.",
    img: "/blog/fountain-pen-paper.jpg",
    datePublished: "2025-02-01",
    dateModified: "2025-02-01",
    cat: "How-To Guides",
  },
  {
    slug: "hand-stitched-bindings",
    title: "Hand-Stitched Bindings: An Ancient Skill That Holds Everything Together",
    excerpt:
      "The binding is the most technically demanding part of making a journal. We use three traditional stitch methods — Coptic, long stitch, and saddle stitch. Here is what each one does and why it matters.",
    img: "/blog/hand-stitched-binding.jpg",
    datePublished: "2025-01-01",
    dateModified: "2025-01-01",
    cat: "Craft Stories",
  },
  {
    slug: "wholesale-guide-sourcing-handmade-paper-india",
    title: "The Complete Guide to Sourcing Handmade Paper Products from India",
    excerpt:
      "For boutique retailers, gift shops and stationery brands considering India as a source market — what to look for, what to avoid, and how to build a reliable supply relationship.",
    img: "/blog/wholesale-sourcing.jpg",
    datePublished: "2024-12-01",
    dateModified: "2024-12-01",
    cat: "Wholesale Guide",
  },
];

const productCategories = [
  {
    slug: "leather-journals",
    label: "Leather Journals",
    description:
      "Hand-stitched full-grain buffalo and goat leather journals, bound around deckle-edge cotton paper.",
  },
  {
    slug: "handmade-paper",
    label: "Handmade Paper",
    description:
      "100% cotton rag paper, sun-dried in Sanganer. Tree-free, bleed-resistant, made for fountain pens and watercolour.",
  },
  {
    slug: "stationery",
    label: "Artisan Stationery",
    description:
      "Greeting cards, envelopes, paper bags and gifting essentials — printed and stitched by hand in our Jaipur atelier.",
  },
  {
    slug: "leather-accessories",
    label: "Leather Accessories",
    description:
      "Crossbody bags, portfolios, totes and corporate gifts in full-grain leather with hand-fitted brass hardware.",
  },
];

function breadcrumb(items) {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": items.map(([name, url], i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": name,
      "item": url,
    })),
  };
}

const routes = [
  {
    path: "products",
    title: "Products — Leather Journals, Seed Paper, Gift Boxes | INS Overseas",
    description:
      "Browse our full range of handmade leather journals, seed paper, paper gift boxes, paper gift bags, leather bags and artisan stationery. Wholesale from Jaipur, India.",
    ogTitle: "Products — Leather Journals, Seed Paper & Artisan Gifts | INS Overseas",
    schema: [breadcrumb([["Home", SITE_URL], ["Products", `${SITE_URL}/products`]])],
  },
  {
    path: "wholesale",
    title: "Wholesale Partner Program — INS Overseas | B2B Handmade Paper & Journals",
    description:
      "Partner with INS Overseas for wholesale handmade leather journals, cotton rag paper and artisan gift products. MOQ 200 units. Export to 40+ countries. Request our B2B catalogue.",
    ogTitle: "Wholesale — Partner With INS Overseas",
    schema: [breadcrumb([["Home", SITE_URL], ["Wholesale", `${SITE_URL}/wholesale`]])],
  },
  {
    path: "about",
    title: "About Us — Four-Generation Handmade Paper Legacy | INS Overseas Jaipur",
    description:
      "INS Overseas is one of India's largest manufacturers of eco-friendly handmade paper and leather journals. A four-generation family legacy from Sanganer, Jaipur since 1995.",
    ogTitle: "About INS Overseas — India's Leading Eco-Friendly Paper Manufacturer",
    ogImage: `${SITE_URL}/about-hero.jpg`,
    schema: [breadcrumb([["Home", SITE_URL], ["About", `${SITE_URL}/about`]])],
  },
  {
    path: "contact",
    title: "Contact INS Overseas — Wholesale Enquiries, Jaipur India",
    description:
      "Get in touch with INS Overseas for wholesale enquiries, custom orders and B2B partnerships. Located in Sanganer, Jaipur. WhatsApp: +91 96804 78483. Email: Sezan@ins-overseas.com",
    ogTitle: "Contact INS Overseas — Wholesale Enquiries",
    schema: [breadcrumb([["Home", SITE_URL], ["Contact", `${SITE_URL}/contact`]])],
  },
  {
    path: "our-craft",
    title: "Our Craft — How We Make Handmade Paper & Leather Journals | INS Overseas",
    description:
      "From recycled cotton rags to finished leather journals — discover the traditional Sanganer papermaking process passed down through four generations at INS Overseas.",
    ogTitle: "Our Craft — Traditional Sanganer Papermaking",
    schema: [breadcrumb([["Home", SITE_URL], ["Our Craft", `${SITE_URL}/our-craft`]])],
  },
  {
    path: "sustainability",
    title: "Sustainability — Eco-Friendly Handmade Paper | INS Overseas",
    description:
      "100% recycled cotton rag paper, no trees, no harsh chemicals. INS Overseas champions eco-friendly papermaking with zero-waste manufacturing in Sanganer, Jaipur.",
    ogTitle: "Sustainability — Eco-Friendly Handmade Paper Manufacturing",
    schema: [breadcrumb([["Home", SITE_URL], ["Sustainability", `${SITE_URL}/sustainability`]])],
  },
  {
    path: "gallery",
    title: "Gallery — Handmade Journals & Artisan Paper Products | INS Overseas",
    description:
      "Browse our workspace and product gallery — handcrafted leather journals, seed paper, gift boxes and artisan stationery made in Sanganer, Jaipur.",
    ogTitle: "Gallery — INS Overseas Workspace & Products",
    schema: [breadcrumb([["Home", SITE_URL], ["Gallery", `${SITE_URL}/gallery`]])],
  },
  {
    path: "faq",
    title: "FAQ — Wholesale Orders, Shipping & Custom Products | INS Overseas",
    description:
      "Answers to the most common wholesale questions about INS Overseas — MOQ, shipping, custom orders, payment, lead times, certifications and more.",
    ogTitle: "Frequently Asked Questions — INS Overseas",
    schema: [breadcrumb([["Home", SITE_URL], ["FAQ", `${SITE_URL}/faq`]])],
  },
  {
    path: "manufacturing",
    title: "Manufacturing | INS Overseas — Watch Our Workspace in Jaipur",
    description:
      "Watch how INS Overseas makes handmade leather journals and eco-friendly paper in Sanganer, Jaipur. Videos and photos from our workspace.",
    ogTitle: "Manufacturing — INS Overseas | Sanganer Workspace",
    schema: [breadcrumb([["Home", SITE_URL], ["Manufacturing", `${SITE_URL}/manufacturing`]])],
  },
  {
    path: "journal",
    title: "Journal | INS Overseas — Craft Stories & Jaipur Heritage",
    description:
      "Essays on handmade paper, leather binding, Rajasthani craft, and care guides for your INS Overseas pieces.",
    ogTitle: "The INS Overseas Journal — Craft Stories & Jaipur Heritage",
    schema: [breadcrumb([["Home", SITE_URL], ["Journal", `${SITE_URL}/journal`]])],
  },
  {
    path: "privacy-policy",
    title: "Privacy Policy | INS Overseas",
    description: "INS Overseas privacy policy.",
    noindex: true,
  },
  {
    path: "terms-of-use",
    title: "Terms of Use | INS Overseas",
    description: "INS Overseas terms of use.",
    noindex: true,
  },
  ...productCategories.map((c) => {
    const canonical = `${SITE_URL}/products/${c.slug}`;
    return {
      path: `products/${c.slug}`,
      title: `${c.label} | INS Overseas`,
      description: c.description,
      schema: [
        breadcrumb([
          ["Home", SITE_URL],
          ["Products", `${SITE_URL}/products`],
          [c.label, canonical],
        ]),
      ],
    };
  }),
  ...posts.map((p) => {
    const canonical = `${SITE_URL}/journal/${p.slug}`;
    const ogImage = p.img.startsWith("http") ? p.img : `${SITE_URL}${p.img}`;
    return {
      path: `journal/${p.slug}`,
      title: `${p.title} | INS Overseas Journal`,
      description: p.excerpt,
      ogTitle: p.title,
      ogImage,
      ogType: "article",
      schema: [
        {
          "@type": "BlogPosting",
          "@id": `${canonical}#article`,
          "headline": p.title,
          "description": p.excerpt,
          "image": { "@type": "ImageObject", "url": ogImage },
          "datePublished": p.datePublished,
          "dateModified": p.dateModified,
          "author": { "@type": "Person", "name": "INS Overseas Team", "url": `${SITE_URL}/about` },
          "publisher": { "@id": `${SITE_URL}/#organization` },
          "mainEntityOfPage": { "@type": "WebPage", "@id": canonical },
          "articleSection": p.cat,
          "url": canonical,
          "inLanguage": "en-IN",
          "isPartOf": { "@id": `${SITE_URL}/#website` },
        },
        breadcrumb([
          ["Home", SITE_URL],
          ["Journal", `${SITE_URL}/journal`],
          [p.title, canonical],
        ]),
      ],
    };
  }),
];

function replaceTag(html, regex, replacement) {
  return regex.test(html) ? html.replace(regex, replacement) : html;
}

function setMetaContent(html, matchAttr, value) {
  const re = new RegExp(`(<meta[^>]*${matchAttr}[^>]*content=")[^"]*("[^>]*/?>)`, "i");
  return replaceTag(html, re, `$1${value.replace(/\$/g, "$$$$")}$2`);
}

function buildRouteHtml(base, route) {
  const canonical = `${SITE_URL}/${route.path}`.replace(/\/$/, "") || SITE_URL;
  const title = route.title;
  const description = route.description;
  const ogTitle = route.ogTitle || title;
  const ogDescription = route.ogDescription || description;
  const ogImage = route.ogImage || DEFAULT_OG_IMAGE;
  const ogType = route.ogType || "website";

  let html = base;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = setMetaContent(html, 'name="description"', description);
  html = setMetaContent(html, 'property="og:type"', ogType);
  html = setMetaContent(html, 'property="og:url"', canonical);
  html = setMetaContent(html, 'property="og:title"', ogTitle);
  html = setMetaContent(html, 'property="og:description"', ogDescription);
  html = setMetaContent(html, 'property="og:image"(?!:)', ogImage);
  html = setMetaContent(html, 'name="twitter:url"', canonical);
  html = setMetaContent(html, 'name="twitter:title"', ogTitle);
  html = setMetaContent(html, 'name="twitter:description"', ogDescription);
  html = setMetaContent(html, 'name="twitter:image"(?!:)', ogImage);
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${canonical}" />`,
  );

  if (route.noindex) {
    if (/<meta name="robots"/.test(html)) {
      html = html.replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, follow" />');
    } else {
      html = html.replace("</head>", '  <meta name="robots" content="noindex, follow" />\n</head>');
    }
  }

  // Drop the homepage-only Product JSON-LD block on every other route — it doesn't
  // belong sitewide and would otherwise duplicate on every prerendered page.
  html = html.replace(
    /\s*<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "Product",[\s\S]*?<\/script>/,
    "",
  );

  if (route.schema && route.schema.length > 0) {
    const script = `    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": route.schema,
    })}</script>\n`;
    html = html.replace("</head>", `${script}  </head>`);
  }

  return html;
}

function run() {
  const base = readFileSync(join(DIST, "index.html"), "utf8");
  for (const route of routes) {
    const html = buildRouteHtml(base, route);
    const dir = join(DIST, route.path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html, "utf8");
  }
  console.log(`prerender-seo: wrote ${routes.length} route HTML files`);
}

run();
