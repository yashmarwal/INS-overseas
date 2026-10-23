import { SITE_URL } from "@/lib/seo";

// A shared product link is short, ins-overseas.com/p/<code>, and opens the Products page with THAT product's details open.
// The code is the first 8 characters of the product's id (ids that are already short are used as they are).
// On the live site it always uses the canonical address (no "www"); anywhere else (localhost, a Vercel preview) it uses the
// address you are on, so the link can be tested before it is deployed.
const siteBase = () => {
  if (typeof window === "undefined") return SITE_URL;
  const host = window.location.hostname.replace(/^www\./, "");
  return host === new URL(SITE_URL).hostname ? SITE_URL : window.location.origin;
};
export const absoluteUrl = (path: string) => siteBase() + path;
export const shortCode = (id: string) => (id.length > 12 ? id.replace(/-/g, "").slice(0, 8) : id);
export const productShareUrl = (id: string) => `${siteBase()}/p/${encodeURIComponent(shortCode(id))}`;

// The homepage "Most Loved" cards are fixed photo slots, not catalogue records, so they cannot link to one product;
// they link to the collection page that holds it instead.
const COLLECTION_OF: Record<string, string> = {
  "leather-journals": "leather-journals",
  "leather-bags": "leather-accessories",
  "handmade-deckle-edge-paper": "handmade-paper",
  "handmade-seed-paper": "handmade-paper",
  "handmade-paper-gift-box": "stationery",
  "handmade-paper-gift-bag": "stationery",
};
export const collectionShareUrl = (categoryId?: string) => {
  const slug = COLLECTION_OF[categoryId ?? ""];
  return `${siteBase()}/products${slug ? `/${slug}` : ""}`;
};

export const shareCopy = (name: string, url: string) => ({
  whatsapp: `Have a look at "${name}" from INS Overseas:\n${url}`,
  mailSubject: `${name} — INS Overseas`,
  mailBody: `Hi,\r\n\r\nI thought you would like this from INS Overseas (handmade leather and paper, Jaipur):\r\n\r\n${name}\r\n${url}\r\n`,
});

/** Copy text to the clipboard; falls back to a hidden textarea where the Clipboard API is unavailable. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
