// /sitemap-products.xml: one entry for every product's own page (with its photo), made from the live catalogue, so a product
// the admin adds is listed for search engines without any rebuild. (The other pages are in /sitemap.xml.)
import { SITE, esc, loadCatalogue, pathOf } from "./_lib.js";

export default async function handler(_req, res, deps = {}) {
  try {
    const products = await loadCatalogue(deps.fetch || fetch);
    const urls = products.map((p) => {
      const last = p.created ? String(p.created).slice(0, 10) : "";
      return `  <url>\n    <loc>${esc(SITE + pathOf(p))}</loc>${/^\d{4}-\d{2}-\d{2}$/.test(last) ? `\n    <lastmod>${last}</lastmod>` : ""}\n    <image:image>\n      <image:loc>${esc(p.image)}</image:loc>\n      <image:title>${esc(p.name)}</image:title>\n    </image:image>\n  </url>`;
    });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join("\n")}\n</urlset>\n`);
  } catch {
    res.statusCode = 503; // the database could not be read: search engines simply ask again later
    res.setHeader("Retry-After", "600");
    res.setHeader("Cache-Control", "no-store");
    return res.end("Sitemap temporarily unavailable");
  }
}
