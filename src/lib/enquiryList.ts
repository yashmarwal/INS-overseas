import { useSyncExternalStore } from "react";

// A visitor's "enquiry list": pieces they tick on the homepage cards, sent to us in ONE message instead of one per product.
// Kept in localStorage (and synced between tabs); it never leaves the browser until they press Send.
export type EnquiryItem = { id: string; name: string; category: string; moq: string; url?: string };

const KEY = "ins_enquiry_list_v2";
const MAX = 20;
const EMPTY: EnquiryItem[] = [];

const read = (): EnquiryItem[] => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((i) => i && typeof i.id === "string" && typeof i.name === "string").slice(0, MAX) : EMPTY;
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
  window.addEventListener("storage", (e) => { if (e.key === KEY) { items = read(); emit(); } });
}

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

export const useEnquiryList = () => useSyncExternalStore(subscribe, () => items, () => EMPTY);
export const useInEnquiry = (id: string) => useEnquiryList().some((i) => i.id === id);

export const enquiryId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const toggleEnquiry = (item: EnquiryItem) =>
  save(items.some((i) => i.id === item.id) ? items.filter((i) => i.id !== item.id) : [...items, item].slice(-MAX));
export const removeEnquiry = (id: string) => save(items.filter((i) => i.id !== id));
export const clearEnquiry = () => save([]);

const lines = (list: EnquiryItem[]) => list.map((i, n) => `${n + 1}. ${i.name} (${i.category}, MOQ from ${i.moq})${i.url ? `\n   ${i.url}` : ""}`).join("\n");
export const enquiryWhatsAppText = (list: EnquiryItem[]) =>
  `Hi INS Overseas, I'd like a wholesale quote (pricing and MOQ) for these pieces:\n\n${lines(list)}\n\nThank you`;
export const enquiryMailBody = (list: EnquiryItem[]) =>
  `Hi INS Overseas team,\r\n\r\nPlease send a quote with pricing, MOQ and sample details for these pieces:\r\n\r\n${lines(list).replace(/\n/g, "\r\n")}\r\n\r\nThank you`;
