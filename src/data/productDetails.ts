import { useSyncExternalStore } from "react";

// What a buyer wants to know about a piece, beyond its name and photo: an item code, size, material, colours, how it can
// be customised, and more photos. Saved as ONE small row per product (see hooks/useProductDetails), kept here so every part
// of the site (cards, product page, PDF, quote message, CSV) reads it the same way.
export type ProductPhoto = { url: string; path: string };
export type ProductDetails = {
  rowId: string;
  code?: string;
  size?: string;
  material?: string;
  colours?: string;
  custom?: string;
  photos: ProductPhoto[];
};

export const DETAIL_LIMITS = { code: 24, size: 60, material: 80, colours: 80, custom: 200, photos: 5 } as const;

let detailsMap = new Map<string, ProductDetails>();
const subs = new Set<() => void>();
export const setProductDetails = (m: Map<string, ProductDetails>) => { detailsMap = m; subs.forEach((f) => f()); };
export const getProductDetails = (productId: string | undefined) => (productId ? detailsMap.get(productId) : undefined);
export const useProductDetailsStore = () => useSyncExternalStore((cb) => { subs.add(cb); return () => { subs.delete(cb); }; }, () => detailsMap, () => detailsMap);

/** The item code, e.g. "LJ-014" ("" when the admin has not given the piece one). */
export const productCode = (productId: string | undefined) => getProductDetails(productId)?.code ?? "";
/** One short line for a card: size and material, e.g. "A5 · Buffalo leather". */
export const specLine = (d?: Pick<ProductDetails, "size" | "material">) => [d?.size, d?.material].filter(Boolean).join(" · ");
/** The item code in brackets for a message, e.g. " (LJ-014)", or nothing. */
export const codeSuffix = (productId: string | undefined) => { const c = productCode(productId); return c ? ` (${c})` : ""; };
