import { useSyncExternalStore } from "react";

// A visitor's "quote list": pieces they tick on the cards, sent to us in ONE message instead of one per product.
// Kept in localStorage (and synced between tabs); it never leaves the browser until they press Send.
export type EnquiryItem = {
  id: string;
  name: string;
  category: string;
  moq: string;
  url?: string;
  /** the catalogue product's own id, when there is one (used for the popularity stats) */
  productId?: string;
  /** the item code the admin gave the piece, e.g. "LJ-014" (named in the message so the buyer and we mean the same piece) */
  code?: string;
  /** how many pieces the buyer wants (optional, digits only) */
  qty?: string;
};

const KEY = "ins_enquiry_list_v2";
const BUYER_KEY = "ins_buyer_v1";
export const LIST_MAX = 20;
const EMPTY: EnquiryItem[] = [];

const read = (): EnquiryItem[] => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(v)) return EMPTY;
    const seen = new Set<string>();
    // a piece is identified by its product id (lists saved earlier used a slug of the name, which two products with the same name shared)
    return v
      .filter((i) => i && typeof i.id === "string" && typeof i.name === "string")
      .map((i): EnquiryItem => (typeof i.productId === "string" && i.productId ? { ...i, id: i.productId } : i))
      .filter((i) => !seen.has(i.id) && !!seen.add(i.id))
      .slice(0, LIST_MAX);
  } catch { return EMPTY; }
};

let items: EnquiryItem[] = typeof window === "undefined" ? EMPTY : read();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const save = (next: EnquiryItem[]) => {
  items = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode: it still works for this visit */ }
  emit();
};

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) { items = read(); emit(); }
    if (e.key === BUYER_KEY) { buyer = readBuyer(); emit(); }
  });
}

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

export const useEnquiryList = () => useSyncExternalStore(subscribe, () => items, () => EMPTY);
export const useInEnquiry = (id: string) => useEnquiryList().some((i) => i.id === id);

export const enquiryId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type AddedHook = (item: EnquiryItem) => void;
let onAdded: AddedHook | null = null;
/** lets the popularity tracker hear about additions without this file knowing about it */
export const setOnQuoteAdded = (fn: AddedHook | null) => { onAdded = fn; };

/** Adds the piece, or takes it off if it is already there. A full list (LIST_MAX pieces) accepts nothing new. */
export const toggleEnquiry = (item: EnquiryItem) => {
  if (items.some((i) => i.id === item.id)) { save(items.filter((i) => i.id !== item.id)); return; }
  if (items.length >= LIST_MAX) return;
  save([...items, item]);
  try { onAdded?.(item); } catch { /* stats must never get in the way */ }
};
export const removeEnquiry = (id: string) => save(items.filter((i) => i.id !== id));
export const clearEnquiry = () => save([]);
/** Sets how many pieces of one item the buyer wants (digits only, up to 7). */
export const setQty = (id: string, qty: string) => save(items.map((i) => (i.id === id ? { ...i, qty: qty.replace(/\D/g, "").slice(0, 7) } : i)));

// ── The buyer's own details (all optional). Kept on this device so a returning buyer need not type them again.
export type Buyer = { name: string; company: string; country: string };
const NO_BUYER: Buyer = { name: "", company: "", country: "" };
// one line, no control characters: whatever is typed can never break the structure of the message
const clean = (s: unknown, max: number) => String(s ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
const LIMITS: Record<keyof Buyer, number> = { name: 60, company: 80, country: 60 };
const readBuyer = (): Buyer => {
  try {
    const b = JSON.parse(localStorage.getItem(BUYER_KEY) || "{}");
    return { name: clean(b.name, LIMITS.name), company: clean(b.company, LIMITS.company), country: clean(b.country, LIMITS.country) };
  } catch { return NO_BUYER; }
};
let buyer: Buyer = typeof window === "undefined" ? NO_BUYER : readBuyer();
export const useBuyer = () => useSyncExternalStore(subscribe, () => buyer, () => NO_BUYER);
/** Updates one field. The text is kept as typed (so spaces can be typed); it is cleaned when the message is built. */
export const setBuyerField = (field: keyof Buyer, value: string) => {
  buyer = { ...buyer, [field]: value.replace(/[\u0000-\u001f\u007f]+/g, " ").slice(0, LIMITS[field]) };
  try { localStorage.setItem(BUYER_KEY, JSON.stringify(buyer)); } catch { /* ignore */ }
  emit();
};
export const clearBuyer = () => {
  buyer = NO_BUYER;
  try { localStorage.removeItem(BUYER_KEY); } catch { /* ignore */ }
  emit();
};

// ── The message that reaches the owner
const buyerLines = (b: Buyer) =>
  [["Name", b.name], ["Company", b.company], ["Country", b.country]]
    .map(([k, v]) => [k, clean(v, 80)])
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);

const lines = (list: EnquiryItem[]) =>
  list
    .map((i, n) => {
      const qty = i.qty && Number(i.qty) > 0 ? `\n   Quantity: ${Number(i.qty)} pcs` : "";
      return `${n + 1}. ${i.name}${i.code ? ` [${clean(i.code, 24)}]` : ""} (${i.category}, MOQ from ${i.moq})${qty}${i.url ? `\n   ${i.url}` : ""}`;
    })
    .join("\n");

const withBuyer = (b: Buyer) => { const l = buyerLines(b); return l.length ? `${l.join("\n")}\n\n` : ""; };

export const enquiryWhatsAppText = (list: EnquiryItem[], b: Buyer = NO_BUYER) =>
  `Hi INS Overseas, I'd like a wholesale quote (pricing and MOQ) for these pieces:\n\n${withBuyer(b)}${lines(list)}\n\nThank you`;
export const enquiryMailBody = (list: EnquiryItem[], b: Buyer = NO_BUYER) =>
  `Hi INS Overseas team,\r\n\r\nPlease send a quote with pricing, MOQ and sample details for these pieces:\r\n\r\n${withBuyer(b).replace(/\n/g, "\r\n")}${lines(list).replace(/\n/g, "\r\n")}\r\n\r\nThank you`;
export const enquiryMailSubject = (list: EnquiryItem[], b: Buyer = NO_BUYER) => {
  const company = clean(b.company, 80);
  return `Quote request: ${list.length} piece${list.length === 1 ? "" : "s"}${company ? ` - ${company}` : ""}`;
};
