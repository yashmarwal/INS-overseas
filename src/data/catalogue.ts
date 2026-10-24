import { useSyncExternalStore } from "react";

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

export const CATEGORY_MOQ: Record<string, string> = {
  "leather-journals":        "200 units minimum",
  "leather-bags":            "150 units minimum",
  "handmade-paper-gift-box": "200 units minimum",
  "handmade-paper-gift-bag": "800 units minimum",
  "handmade-seed-paper":     "1500 units minimum",
  "handmade-deckle-edge-paper": "200 units minimum",
  "handblock-print-fabric":     "200 units minimum",
};

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
export type CustomCategory = { id: string; label: string; moq: number; icon: string; rowId: string };
let custom: CustomCategory[] = [];
const subs = new Set<() => void>();
export const setCustomCategories = (list: CustomCategory[]) => { custom = list; subs.forEach((f) => f()); };
export const getCustomCategories = () => custom;
export const useCustomCategories = () => useSyncExternalStore((cb) => { subs.add(cb); return () => { subs.delete(cb); }; }, () => custom, () => custom);

/** The short name shown on a product card, for any category (built-in or custom). */
export const categoryLabel = (id: string) => CATEGORY_LABELS[id] ?? custom.find((c) => c.id === id)?.label ?? id;
/** e.g. "300 units minimum", for any category. */
export const categoryMoq = (id: string) => CATEGORY_MOQ[id] ?? (() => { const c = custom.find((x) => x.id === id); return c ? `${c.moq} units minimum` : "200 units minimum"; })();

/** The minimum order number for a category, e.g. "300". */
export const moqNumber = (categoryId?: string) => categoryMoq(categoryId ?? "").match(/\d+/)?.[0] ?? "200";

// A product can have its own minimum order and lead time. Without one it uses its category's minimum and 30 days.
// (Saved as one small row per product, see hooks/useProductTerms.)
export type ProductTerms = { rowId: string; moq?: number; lead?: number };
export const DEFAULT_LEAD_DAYS = 30;
let termsMap = new Map<string, ProductTerms>();
const termSubs = new Set<() => void>();
export const setProductTerms = (m: Map<string, ProductTerms>) => { termsMap = m; termSubs.forEach((f) => f()); };
export const getProductTerms = (productId: string) => termsMap.get(productId);
export const useProductTermsStore = () => useSyncExternalStore((cb) => { termSubs.add(cb); return () => { termSubs.delete(cb); }; }, () => termsMap, () => termsMap);

/** The minimum order for ONE product (its own if set, otherwise its category's), e.g. 300. */
export const productMoq = (productId: string | undefined, category: string): number =>
  (productId ? termsMap.get(productId)?.moq : undefined) ?? Number(moqNumber(category));
/** The lead time in days for ONE product (its own if set, otherwise 30). */
export const productLead = (productId: string | undefined): number =>
  (productId ? termsMap.get(productId)?.lead : undefined) ?? DEFAULT_LEAD_DAYS;
