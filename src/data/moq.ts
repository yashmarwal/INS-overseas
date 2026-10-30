// Minimum order per product, as confirmed by the client (2026-10-30). Plain data (no imports) so the build script can read it too;
// catalogue.ts re-exports it. Everything that shows a minimum order (cards, Wholesale page, quote list, PDF, llms.txt) reads it from here.
export const CATEGORY_MOQ: Record<string, string> = {
  "leather-journals":        "250 units minimum",
  "handmade-paper":          "500 units minimum",
  "handmade-paper-gift-box": "200 units minimum",
  "handmade-paper-gift-bag": "400 units minimum",
  "greeting-cards":          "500 units minimum",
  "handmade-seed-paper":     "1000 units minimum",
  "leather-bags":            "150 units minimum",
  // Deckle edge paper and handblock print fabric are NOT in the client's list: no number is shown for them ("confirmed in quote")
  // until the client gives one. Custom and private-label orders also have none.
};

/** The minimum order of one category as a number, e.g. 250 */
export const moqValue = (key: string) => Number(CATEGORY_MOQ[key].match(/\d+/)![0]);

/** The smallest minimum order of any category (read from the table above, so it can never drift from it). */
export const LOWEST_MOQ = Math.min(...Object.keys(CATEGORY_MOQ).map(moqValue));

/** The table on the Wholesale page: exactly the client's list, in their order. [label, category key] */
export const MOQ_TABLE: [string, string][] = [
  ["Leather journals", "leather-journals"],
  ["Handmade paper", "handmade-paper"],
  ["Gift boxes", "handmade-paper-gift-box"],
  ["Gift bags", "handmade-paper-gift-bag"],
  ["Greeting cards", "greeting-cards"],
  ["Seed paper", "handmade-seed-paper"],
  ["Leather bags", "leather-bags"],
];

// The four collections on the homepage show the smallest minimum among the products that belong to them.
// (Deckle edge paper is in the Handmade Paper collection on the Products page but has no minimum on record, so the card shows the
// client's "Handmade paper" figure and the deckle edge products themselves say "confirmed in quote".)
const COLLECTION_KEYS: Record<string, string[]> = {
  "/products/leather-journals": ["leather-journals"],
  "/products/handmade-paper": ["handmade-paper"],
  "/products/stationery": ["handmade-paper-gift-box", "handmade-paper-gift-bag", "greeting-cards"],
  "/products/leather-accessories": ["leather-bags"],
};
export const collectionMoq = (to: string) => Math.min(...COLLECTION_KEYS[to].map(moqValue));
