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

/** The minimum order number for a category, e.g. "300". */
export const moqNumber = (categoryId?: string) => (CATEGORY_MOQ[categoryId ?? ""] || "200 units minimum").match(/\d+/)?.[0] ?? "200";
