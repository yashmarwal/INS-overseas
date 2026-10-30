// Serves one product's page to browsers and search engines alike: the site's own page, with this product's title,
// description, social-share preview and structured data already in it (so a search engine or a WhatsApp preview sees the
// product without running any script). It also sends the short /p/<code> links to the product's own address.
// If anything goes wrong it falls back to the plain site page, so a visitor always gets a working page.
import { findProduct, idPartOfSlug, injectProduct, loadCatalogue, loadTemplate, pathOf, productSlug, withoutShell } from "./_lib.js";

const CACHE = "public, s-maxage=300, stale-while-revalidate=86400";

export default async function handler(req, res, deps = {}) {
  const fetchFn = deps.fetch || fetch;
  const slug = String(req.query?.slug ?? "").trim();
  const code = String(req.query?.code ?? "").trim();
  let template = null;
  try {
    const products = await loadCatalogue(fetchFn);
    const part = slug ? idPartOfSlug(slug) : code;
    const p = part ? findProduct(products, part) : null;

    // an old or shortened address, or a short /p/<code> link: send it to the product's current address
    if (p && (code || slug !== productSlug(p.id, p.name, p.code))) {
      res.statusCode = 301;
      res.setHeader("Location", pathOf(p));
      res.setHeader("Cache-Control", CACHE);
      return res.end();
    }

    template = await loadTemplate(req, fetchFn);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", CACHE);
    if (!p) {
      // no such product: the site's own "not found" page, and a 404 so search engines drop the address
      res.statusCode = 404;
      return res.end(withoutShell(template).replace(/<\/head>/i, () => `    <meta name="robots" content="noindex" />\n  </head>`));
    }
    res.statusCode = 200;
    return res.end(injectProduct(template, p));
  } catch {
    // the database or the template could not be read: still give the visitor a working page
    try {
      template = template || (await loadTemplate(req, fetchFn));
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      return res.end(withoutShell(template));
    } catch {
      res.statusCode = 302;
      res.setHeader("Location", code ? `/products?p=${encodeURIComponent(code)}` : "/products");
      res.setHeader("Cache-Control", "no-store");
      return res.end();
    }
  }
}
