// Item codes for pieces that have none yet, e.g. LJ-001, LJ-002 … for leather journals. The admin presses one button; the
// numbers follow the order the products are shown in, and carry on after the highest code a category already has.
const PREFIX: Record<string, string> = {
  "leather-journals": "LJ",
  "leather-bags": "LB",
  "handmade-paper-gift-box": "GB",
  "handmade-paper-gift-bag": "GG",
  "handmade-seed-paper": "SP",
  "handmade-deckle-edge-paper": "DP",
  "handblock-print-fabric": "HF",
};

/** The letters in front of the number for a category: fixed for the built-in ones, the initials of the name for the admin's own. */
export const codePrefix = (categoryId: string, label: string) => {
  if (PREFIX[categoryId]) return PREFIX[categoryId];
  const words = label.toUpperCase().replace(/[^A-Z0-9 ]+/g, " ").split(/\s+/).filter(Boolean);
  const letters = (words.length > 1 ? words.map((w) => w[0]).join("") : (words[0] ?? "")).slice(0, 3);
  return letters.length >= 2 ? letters : (letters + "IN").slice(0, 2);
};

type P = { id: string; category: string };

/** product id -> new code, for every product in `ordered` that has no code. `codeOf` reads a product's existing code. */
export function planCodes(ordered: P[], codeOf: (id: string) => string, labelOf: (categoryId: string) => string): Map<string, string> {
  const taken = new Set(ordered.map((p) => codeOf(p.id).toLowerCase()).filter(Boolean));
  const next = new Map<string, number>(); // prefix -> the next number to use
  const bump = (prefix: string, n: number) => next.set(prefix, Math.max(next.get(prefix) ?? 1, n + 1));
  for (const p of ordered) {
    const c = codeOf(p.id);
    const m = /^([A-Z0-9]+)-(\d+)$/i.exec(c);
    if (m) bump(m[1].toUpperCase(), Number(m[2]));
  }
  const out = new Map<string, string>();
  for (const p of ordered) {
    if (codeOf(p.id)) continue;
    const prefix = codePrefix(p.category, labelOf(p.category));
    let n = next.get(prefix) ?? 1;
    let code = `${prefix}-${String(n).padStart(3, "0")}`;
    while (taken.has(code.toLowerCase())) { n++; code = `${prefix}-${String(n).padStart(3, "0")}`; }
    taken.add(code.toLowerCase());
    next.set(prefix, n + 1);
    out.set(p.id, code);
  }
  return out;
}
