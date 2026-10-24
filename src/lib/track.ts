import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabaseConfig";
import { setOnQuoteAdded } from "@/lib/enquiryList";

// Popularity stats: which products visitors open, share, add to a quote and enquire about. Each event is one tiny row in the
// product_events table. It is best-effort and invisible: if the table is not set up yet, or anything fails, nothing happens
// and the visitor never sees a thing. No names, e-mail addresses or anything personal is recorded: just the product and what happened.
// It sends one small request with plain fetch (the same way the site's photo lookup does), so the Supabase library is not
// pulled into every page just for this.
export type ProductEvent = "view" | "share" | "quote" | "enquire";

const SEEN_KEY = "ins_events_seen_v1";
const MAX_SEEN = 600;
let off = false; // set when the table is missing or refuses us: stop trying for this visit
let seen: Set<string> | null = null;

const isBot = () => typeof navigator !== "undefined" && /bot|crawl|spider|slurp|facebookexternalhit|preview|headless/i.test(navigator.userAgent);

const loadSeen = (): Set<string> => {
  if (seen) return seen;
  try { seen = new Set<string>(JSON.parse(sessionStorage.getItem(SEEN_KEY) || "[]")); } catch { seen = new Set(); }
  return seen;
};
const rememberSeen = (key: string) => {
  const s = loadSeen();
  s.add(key);
  try { sessionStorage.setItem(SEEN_KEY, JSON.stringify([...s].slice(-MAX_SEEN))); } catch { /* ignore */ }
};

/** Records one event for a product. The same event for the same product counts once per visit (a tab session). */
export function trackProduct(productId: string | undefined, event: ProductEvent) {
  try {
    if (!productId || off || typeof window === "undefined" || isBot()) return;
    if (window.location.pathname.startsWith("/admin")) return;
    try { if (localStorage.getItem("ins_no_track") === "1") return; } catch { /* ignore */ } // the owner's own browser
    const id = String(productId).slice(0, 80);
    const key = `${event}:${id}`;
    if (loadSeen().has(key)) return;
    rememberSeen(key);
    fetch(`${SUPABASE_URL}/rest/v1/product_events`, {
      method: "POST",
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ product_id: id, event }),
      keepalive: true, // still delivered if the visitor taps a WhatsApp / e-mail link straight after
    }).then(
      (r) => { if (!r.ok) off = true; },
      () => { off = true; },
    );
  } catch { /* stats must never get in the way */ }
}

// adding a piece to the quote list counts as a "quote" for that product
setOnQuoteAdded((item) => trackProduct(item.productId, "quote"));
