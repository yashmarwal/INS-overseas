// Remembers, per history entry (the router gives every entry its own key), how far the page was scrolled and what the
// Products page was showing, so Back / Forward return to exactly where the visitor was instead of the top.
// A new page opened by a click is a new entry: nothing is remembered for it, so it opens at the top as before.
const scrolls = new Map<string, number>();
const productView = new Map<string, { filter: string; count: number }>();

export const historyKey = (): string => {
  const s = typeof window !== "undefined" ? (window.history.state as { __TSR_key?: string } | null) : null;
  return s?.__TSR_key ?? (typeof window !== "undefined" ? window.location.href : "");
};

export const saveScroll = (key: string, y: number) => { if (key) scrolls.set(key, y); };
export const savedScroll = (key: string) => scrolls.get(key);

export const saveProductView = (key: string, v: { filter: string; count: number }) => { if (key) productView.set(key, v); };
export const savedProductView = (key: string) => productView.get(key);
