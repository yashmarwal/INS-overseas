// Runs after `vite build`. This is a CSR (client-rendered) SPA, so Vercel serves one static index.html for every route.
// That means crawlers which don't execute JS would see the homepage's canonical/title/JSON-LD on every URL — a duplicate-content trap.
//
// This script clones dist/index.html per route and swaps in that route's own title/description/canonical/OG/Twitter/JSON-LD, so the
// static HTML served for e.g. /products already has the right <head> before React ever hydrates. It does not touch routing/redirects:
// the vercel.json rewrites (additive, not redirects) point each path at its prerendered file.
//
// Where the text comes from (nothing is written twice):
//   - the site address ........ site.config.mjs
//   - titles / descriptions ... src/data/seoPages.ts (pages) and src/data/blogPosts.ts (journal posts), the same files the routes read
// It also writes dist/sitemap.xml, dist/robots.txt and dist/llms.txt (from public/, with the address filled in), and stops the build
// if a title is over 60 characters or a description over 155.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { SITE_URL } from "../site.config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// the data files are plain TypeScript data (they may import each other, never React), so they are bundled and read here directly
async function loadTs(rel) {
  const r = await build({ entryPoints: [join(ROOT, rel)], bundle: true, format: "esm", platform: "neutral", write: false, logLevel: "silent" });
  return import(`data:text/javascript;base64,${Buffer.from(r.outputFiles[0].text).toString("base64")}`);
}
const { seoPages, SEO_LIMITS } = await loadTs("src/data/seoPages.ts");
const { posts } = await loadTs("src/data/blogPosts.ts");
const { shellPages, postShell } = await loadTs("src/data/shell.ts");
const { homeCopy } = await loadTs("src/data/copy.ts");
const { moqValue, LOWEST_MOQ } = await loadTs("src/data/moq.ts");
const { MOBILE_NAV, FOOTER_COLUMNS, FOOTER_CONTACT, LEGAL_LINKS } = await loadTs("src/data/siteNav.ts");

const abs = (u) => (u.startsWith("http") ? u : `${SITE_URL}${u}`);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function breadcrumb(items) {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": items.map(([name, url], i) => ({ "@type": "ListItem", "position": i + 1, "name": name, "item": url })),
  };
}

// a list of the four collections (on the homepage and the Products page)
const collectionsList = (id, name) => ({
  "@type": "ItemList",
  "@id": id,
  "name": name,
  "numberOfItems": homeCopy.collections.cards.length,
  "itemListElement": homeCopy.collections.cards.map((c, i) => ({ "@type": "ListItem", "position": i + 1, "name": c.title, "url": `${SITE_URL}${c.to}` })),
});
// a collection page; the list of its products is added below once they have been read (mainEntity points at it)
const collectionPage = (path, p, listId) => ({
  "@type": "CollectionPage",
  "@id": `${SITE_URL}${path}#collectionpage`,
  "name": p.crumb,
  "description": p.description,
  "url": `${SITE_URL}${path}`,
  "isPartOf": { "@id": `${SITE_URL}/#website` },
  ...(listId ? { "mainEntity": { "@id": listId } } : {}),
});

// ── every page ─────────────────────────────────────────────────────────────────
const routes = [];

for (const [path, p] of Object.entries(seoPages)) {
  const trail = [["Home", SITE_URL]];
  if (path.startsWith("/products/")) trail.push([seoPages["/products"].crumb, `${SITE_URL}/products`]);
  if (path !== "/") trail.push([p.crumb, `${SITE_URL}${path}`]);
  routes.push({
    path: path === "/" ? "" : path.slice(1),
    title: p.title,
    description: p.description,
    ogTitle: p.ogTitle,
    ogImage: p.ogImage ? abs(p.ogImage) : undefined,
    noindex: p.noindex,
    modified: p.modified,
    trail,
    shell: shellPages[path],
    // the site-wide entities (organisation, website, local business) are written once, on the homepage; other pages point to them by @id
    keepLd: path === "/" ? ["Organization", "LocalBusiness", "WebSite"] : [],
    schema:
      path === "/"
        ? [collectionsList(`${SITE_URL}/#collections`, "INS Overseas product collections")]
        : path === "/products"
          ? [collectionPage(path, p, `${SITE_URL}/products#collections`), collectionsList(`${SITE_URL}/products#collections`, "INS Overseas product collections"), breadcrumb(trail)]
          : path.startsWith("/products/")
            ? [collectionPage(path, p), breadcrumb(trail)]
        : path === "/contact"
          ? [
              {
                "@type": "ContactPage",
                "@id": `${SITE_URL}/contact#contactpage`,
                "name": p.title,
                "url": `${SITE_URL}/contact`,
                "about": { "@id": `${SITE_URL}/#localbusiness` },
                "isPartOf": { "@id": `${SITE_URL}/#website` },
              },
              breadcrumb(trail),
            ]
          : [breadcrumb(trail)],
  });
}

routes.push(
  ...posts.map((p) => {
    const canonical = `${SITE_URL}/journal/${p.slug}`;
    const ogImage = abs(p.img);
    return {
      path: `journal/${p.slug}`,
      title: p.seoTitle,
      description: p.seoDescription,
      ogTitle: p.seoTitle,
      ogImage,
      ogType: "article",
      modified: p.dateModified,
      trail: [["Home", SITE_URL], [seoPages["/journal"].crumb, `${SITE_URL}/journal`], [p.title, canonical]],
      shell: postShell(p.slug),
      keepLd: [],
      schema: [
        {
          "@type": "BlogPosting",
          "@id": `${canonical}#article`,
          "headline": p.title,
          "description": p.seoDescription,
          "image": { "@type": "ImageObject", "url": ogImage },
          "datePublished": p.datePublished,
          "dateModified": p.dateModified,
          "author": { "@id": `${SITE_URL}/#organization` },
          "publisher": { "@id": `${SITE_URL}/#organization` },
          "mainEntityOfPage": { "@type": "WebPage", "@id": canonical },
          "articleSection": p.cat,
          "url": canonical,
          "inLanguage": "en-IN",
          "isPartOf": { "@id": `${SITE_URL}/#website` },
        },
        breadcrumb([["Home", SITE_URL], [seoPages["/journal"].crumb, `${SITE_URL}/journal`], [p.title, canonical]]),
      ],
    };
  }),
);

// ── product links in the Products and collection pages' bodies ───────────────────────────────────────────────────────────────
// The product grid on screen loads 12 at a time as you scroll, so the page body lists every product that has a photo, as links to each
// product's own page. It is read from the live database when the site is built (the same read-only data the product pages use); if that
// cannot be read the build still succeeds, the pages just carry no product list and the products sitemap covers discovery.
try {
  const { loadCatalogue, pathOf, collectionPath } = await import("../api/_lib.js");
  const catalogue = await Promise.race([loadCatalogue(), new Promise((_, rej) => setTimeout(() => rej(new Error("timed out")), 15000))]);
  const withPhoto = catalogue.filter((p) => p.image);
  const link = (p) => [`${p.name}${p.code ? ` (${p.code})` : ""}`, pathOf(p)];
  for (const r of routes) {
    if (!r.shell) continue;
    const here = r.path === "products" ? withPhoto : r.path.startsWith("products/") ? withPhoto.filter((p) => collectionPath(p.category) === `/${r.path}`) : null;
    if (here?.length) r.shell = { ...r.shell, blocks: [...r.shell.blocks, { h2: r.path === "products" ? "All products" : "Products in this collection", links: here.map(link) }] };
    // the same products as a list in the page's structured data (collection pages only; the Products page lists the four collections)
    if (r.path.startsWith("products/") && here?.length) {
      const listId = `${SITE_URL}/${r.path}#itemlist`;
      r.schema = [
        ...r.schema.map((s) => (s["@type"] === "CollectionPage" ? { ...s, mainEntity: { "@id": listId } } : s)),
        {
          "@type": "ItemList",
          "@id": listId,
          "name": `${seoPages["/" + r.path].crumb} products`,
          "numberOfItems": here.length,
          "itemListElement": here.map((p, i) => ({ "@type": "ListItem", "position": i + 1, "name": p.name, "url": `${SITE_URL}${pathOf(p)}` })),
        },
      ];
    }
  }
  console.log(`prerender-seo: listed ${withPhoto.length} products as links in the Products and collection pages`);
} catch (e) {
  console.warn("prerender-seo: product list not added (" + e.message + ")");
}

// ── length limits: a build that breaks them does not ship ──────────────────────
const problems = [];
for (const r of routes) {
  if (r.noindex) continue;
  if (!r.title || r.title.length > SEO_LIMITS.title) problems.push(`/${r.path}: title is ${r.title?.length} characters (max ${SEO_LIMITS.title})`);
  if (!r.description || r.description.length > SEO_LIMITS.description) problems.push(`/${r.path}: description is ${r.description?.length} characters (max ${SEO_LIMITS.description})`);
}
// a sitemap date is the date the page's content last really changed (its `modified` field), never "today" and never the build date
// (one day of slack: it is already tomorrow in India while it is still today in UTC)
const today = new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10);
for (const r of routes) if (!r.noindex && (!/^\d{4}-\d{2}-\d{2}$/.test(r.modified || "") || r.modified > today)) problems.push(`/${r.path}: "modified" must be a real past date (YYYY-MM-DD), got ${r.modified}`);
if (new Set(routes.map((r) => r.title)).size !== routes.length) problems.push("two pages share the same title");
if (problems.length) {
  console.error("prerender-seo: SEO text is out of limits:\n  " + problems.join("\n  "));
  process.exit(1);
}

// ── the body of a page, for crawlers and for readers without scripts ─────────────────────────────────────────────────────────
// It sits inside <div id="root"> and is replaced the moment the site's own scripts start (React clears the container), and a style rule
// in index.html keeps it out of sight while scripts run, so nobody sees it flash or shift. It holds the same words the page itself renders.
const ln = ([label, href]) => `<a href="${esc(href)}">${esc(label)}</a>`;
const ul = (items, tag = "ul") => `<${tag}>${items.map((i) => `<li>${i}</li>`).join("")}</${tag}>`;
const toPath = (u) => u.replace(SITE_URL, "") || "/";

function shellHeader() {
  return `<header data-shell="header"><p><a href="/">INS Overseas</a></p><nav aria-label="Main">${ul(MOBILE_NAV.map((l) => ln([l.label, l.to])))}</nav></header>`;
}
function shellFooter() {
  const cols = FOOTER_COLUMNS.map((c) => `<div><p><strong>${esc(c.title)}</strong></p>${ul(c.links.map(ln))}</div>`).join("");
  const c = FOOTER_CONTACT;
  return `<footer data-shell="footer"><nav aria-label="Footer">${cols}</nav><address>${c.addressLines.map(esc).join("<br>")}<br><a href="${esc(c.phoneHref)}">${esc(c.phone)}</a><br><a href="mailto:${esc(c.email)}">${esc(c.email)}</a><br>${esc(c.hours)}</address><p>${LEGAL_LINKS.map(ln).join(" · ")}</p><p>© INS Overseas</p></footer>`;
}
function shellMain(route) {
  const crumbs = route.trail.length > 1
    ? `<nav aria-label="Breadcrumb">${ul(route.trail.map(([name, url], i) => (i === route.trail.length - 1 ? esc(name) : ln([name, toPath(url)]))), "ol")}</nav>`
    : "";
  const s = route.shell;
  if (!s) return `<main>${crumbs}</main>`;
  const blocks = s.blocks.map((b) => {
    const parts = [];
    if (b.h2) parts.push(`<h2>${esc(b.h2)}</h2>`);
    for (const t of b.p ?? []) parts.push(`<p>${esc(t)}</p>`);
    if (b.items) parts.push(b.items.map((i) => `<h3>${i.href ? ln([i.h3, i.href]) : esc(i.h3)}</h3>${i.p ? `<p>${esc(i.p)}</p>` : ""}`).join(""));
    if (b.list) parts.push(ul(b.list.map(esc), b.ordered ? "ol" : "ul"));
    if (b.links) parts.push(ul(b.links.map(ln)));
    return `<section>${parts.join("")}</section>`;
  });
  const related = s.related?.length ? `<nav aria-label="Related pages"><h2>Related pages</h2>${ul(s.related.map(ln))}</nav>` : "";
  return `<main>${crumbs}<h1>${esc(s.h1)}</h1>${s.lead ? `<p>${esc(s.lead)}</p>` : ""}${blocks.join("")}${related}</main>`;
}
const shellHtml = (route) => `<!--seo-shell-start--><div class="seo-shell">${shellHeader()}${shellMain(route)}${shellFooter()}</div><!--seo-shell-end-->`;

// ── building one page's HTML ───────────────────────────────────────────────────
const replaceTag = (html, regex, replacement) => (regex.test(html) ? html.replace(regex, replacement) : html);

function setMetaContent(html, matchAttr, value) {
  const re = new RegExp(`(<meta[^>]*${matchAttr}[^>]*content=")[^"]*("[^>]*/?>)`, "i");
  return replaceTag(html, re, (_, a, b) => `${a}${esc(value)}${b}`);
}

const LD = /\s*<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

function buildRouteHtml(base, route) {
  const canonical = route.path ? `${SITE_URL}/${route.path}` : `${SITE_URL}/`;
  const ogTitle = route.ogTitle || route.title;
  const ogImage = route.ogImage || DEFAULT_OG_IMAGE;
  const ogType = route.ogType || "website";

  let html = base;
  html = html.replace(/<title>[^<]*<\/title>/, () => `<title>${esc(route.title)}</title>`);
  html = setMetaContent(html, 'name="description"', route.description);
  html = setMetaContent(html, 'property="og:type"', ogType);
  html = setMetaContent(html, 'property="og:url"', canonical);
  html = setMetaContent(html, 'property="og:title"', ogTitle);
  html = setMetaContent(html, 'property="og:description"', route.description);
  html = setMetaContent(html, 'property="og:image"(?!:)', ogImage);
  html = setMetaContent(html, 'name="twitter:url"', canonical);
  html = setMetaContent(html, 'name="twitter:title"', ogTitle);
  html = setMetaContent(html, 'name="twitter:description"', route.description);
  html = setMetaContent(html, 'name="twitter:image"(?!:)', ogImage);
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, () => `<link rel="canonical" href="${canonical}" />`);

  if (route.noindex) {
    html = /<meta name="robots"/.test(html)
      ? html.replace(/<meta name="robots" content="[^"]*" \/>/, () => '<meta name="robots" content="noindex, follow" />')
      : html.replace("</head>", () => '  <meta name="robots" content="noindex, follow" />\n</head>');
  }

  // index.html carries the site-wide data blocks; each page keeps only the ones that belong to it
  html = html.replace(LD, (all, json) => {
    try {
      const j = JSON.parse(json);
      const types = [].concat(j["@graph"] || j).flatMap((x) => [].concat(x["@type"]));
      return types.some((t) => route.keepLd.includes(t)) ? all : "";
    } catch {
      return "";
    }
  });

  html = html.replace('<div id="root"></div>', () => `<div id="root">${shellHtml(route)}</div>`);

  if (route.schema.length > 0) {
    const script = `    <script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": route.schema })}</script>\n`;
    html = html.replace("</head>", () => `${script}  </head>`);
  }
  return html;
}

function run() {
  // (safe to run twice: a body written by an earlier run is taken out first)
  const base = readFileSync(join(DIST, "index.html"), "utf8").replace(/<!--seo-shell-start-->[\s\S]*?<!--seo-shell-end-->/, "");
  for (const route of routes) {
    const html = buildRouteHtml(base, route);
    const dir = join(DIST, route.path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html, "utf8");
  }
  console.log(`prerender-seo: wrote ${routes.length} route HTML files`);

  // Unknown addresses get a real 404 (not the homepage with a 200). This is the page Vercel shows for them: the same app, which
  // opens its own "Page not found" screen, with a noindex tag and without the homepage's canonical address.
  const notFound = base
    .replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, nofollow" />')
    .replace(/\s*<link rel="canonical" href="[^"]*" \/>/, "")
    .replace(LD, "");
  writeFileSync(join(DIST, "404.html"), notFound, "utf8");
  console.log("prerender-seo: wrote 404.html");

  // sitemap: every indexable page, dated by when its content last really changed
  const urls = routes
    .filter((r) => !r.noindex)
    .map((r) => `  <url>\n    <loc>${SITE_URL}${r.path ? `/${r.path}` : "/"}</loc>\n    <lastmod>${r.modified}</lastmod>\n  </url>`);
  writeFileSync(join(DIST, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`, "utf8");
  console.log(`prerender-seo: wrote sitemap.xml (${urls.length} pages)`);

  // robots.txt and llms.txt are kept in public/ with __SITE_URL__ where the address goes
  for (const f of ["robots.txt", "llms.txt"]) {
    const t = readFileSync(join(ROOT, "public", f), "utf8").split("__SITE_URL__").join(SITE_URL).split("__MOQ:lowest__").join(String(LOWEST_MOQ)).replace(/__MOQ:([a-z-]+)__/g, (_, k) => String(moqValue(k)));
    writeFileSync(join(DIST, f), t, "utf8");
  }
  console.log("prerender-seo: wrote robots.txt and llms.txt");
}

run();
