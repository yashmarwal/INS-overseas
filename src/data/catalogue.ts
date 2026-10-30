import { useSyncExternalStore } from "react";
import { CATEGORY_MOQ, LOWEST_MOQ } from "./moq";

// Shared by the Products page and the homepage product cards.
export const CATEGORY_LABELS: Record<string, string> = {
  "leather-journals":        "Leather Journal",
  "leather-bags":            "Leather Bag",
  "handmade-paper-gift-box": "Paper Gift Box",
  "handmade-paper-gift-bag": "Paper Gift Bag",
  "handmade-seed-paper":     "Seed Paper",
  "handmade-deckle-edge-paper": "Deckle Edge Paper",
  "handblock-print-fabric":     "Handblock Print Fabric",
};

export { CATEGORY_MOQ, LOWEST_MOQ };

/** The filter buttons for the built-in categories (the Products page and the catalogue PDF both use this list). */
export const CATEGORY_PILLS = [
  { key: "leather-journals", label: "Leather Journals" },
  { key: "leather-bags", label: "Leather Bags" },
  { key: "handmade-paper-gift-box", label: "Paper Gift Box" },
  { key: "handmade-paper-gift-bag", label: "Paper Gift Bag" },
  { key: "handmade-seed-paper", label: "Seed Paper" },
  { key: "handmade-deckle-edge-paper", label: "Deckle Edge Paper" },
  { key: "handblock-print-fabric", label: "Handblock Print Fabric" },
] as const;

// Categories the admin adds himself (stored as rows in the database, see hooks/useCategories). They are kept here so
// every part of the site can ask for a label or minimum order the same way for built-in and custom categories.
export type CustomCategory = { id: string; label: string; moq?: number; icon: string; rowId: string };
let custom: CustomCategory[] = [];
const subs = new Set<() => void>();
export const setCustomCategories = (list: CustomCategory[]) => { custom = list; subs.forEach((f) => f()); };
export const getCustomCategories = () => custom;
export const useCustomCategories = () => useSyncExternalStore((cb) => { subs.add(cb); return () => { subs.delete(cb); }; }, () => custom, () => custom);

/** The short name shown on a product card, for any category (built-in or custom). */
export const categoryLabel = (id: string) => CATEGORY_LABELS[id] ?? custom.find((c) => c.id === id)?.label ?? id;
/** e.g. "250 units minimum", for any category; null when no minimum is on record (the site then says "confirmed in quote"). */
export const categoryMoq = (id: string): string | null => CATEGORY_MOQ[id] ?? (() => { const c = custom.find((x) => x.id === id); return c?.moq ? `${c.moq} units minimum` : null; })();

/** The minimum order number for a category, e.g. "250"; null when none is on record. */
export const moqNumber = (categoryId?: string): string | null => categoryMoq(categoryId ?? "")?.match(/\d+/)?.[0] ?? null;

export const QUOTE_TEXT = "Confirmed in quote";
/** "250+ pcs" for a card, or "Confirmed in quote" when there is no minimum on record. */
export const moqPcs = (n: number | string | null | undefined) => (n == null || n === "" ? QUOTE_TEXT : `${n}+ pcs`);

// A product can have its own minimum order and lead time. Without one it uses its category's minimum and 25 days.
// (Saved as one small row per product, see hooks/useProductTerms.)
export type ProductTerms = { rowId: string; moq?: number; lead?: number };
export const DEFAULT_LEAD_DAYS = 25;
let termsMap = new Map<string, ProductTerms>();
const termSubs = new Set<() => void>();
export const setProductTerms = (m: Map<string, ProductTerms>) => { termsMap = m; termSubs.forEach((f) => f()); };
export const getProductTerms = (productId: string) => termsMap.get(productId);
export const useProductTermsStore = () => useSyncExternalStore((cb) => { termSubs.add(cb); return () => { termSubs.delete(cb); }; }, () => termsMap, () => termsMap);

/** The minimum order for ONE product (its own if set, otherwise its category's), e.g. 250; null when there is none on record. */
export const productMoq = (productId: string | undefined, category: string): number | null => {
  const own = productId ? termsMap.get(productId)?.moq : undefined;
  if (own) return own;
  const n = moqNumber(category);
  return n ? Number(n) : null;
};
/** The lead time in days for ONE product (its own if set, otherwise 25). */
export const productLead = (productId: string | undefined): number =>
  (productId ? termsMap.get(productId)?.lead : undefined) ?? DEFAULT_LEAD_DAYS;
