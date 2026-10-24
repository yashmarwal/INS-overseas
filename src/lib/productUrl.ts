import { SITE_URL } from "@/lib/seo";
import { shortCode } from "@/lib/share";

// A product's own page: ins-overseas.com/product/<readable-name-and-code>-<short id>
// e.g. /product/handmade-mat-leather-journal-lj-014-3f9a1c2b. The words are for people and search engines; the last part
// (the short id, the same one the /p/<code> share links use) is what finds the product, so a renamed product still opens.
export const slugify = (s: string) =>
  String(s ?? "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70).replace(/-+$/g, "");

export const productSlug = (id: string, name: string, code?: string) => {
  const words = slugify([name, code].filter(Boolean).join(" ")) || "product";
  return `${words}-${shortCode(id)}`;
};
export const productPath = (id: string, name: string, code?: string) => `/product/${productSlug(id, name, code)}`;
export const productPageUrl = (id: string, name: string, code?: string) => `${SITE_URL}${productPath(id, name, code)}`;
/** The short id at the end of a product address. */
export const idPartOfSlug = (slug: string) => slug.slice(slug.lastIndexOf("-") + 1);
