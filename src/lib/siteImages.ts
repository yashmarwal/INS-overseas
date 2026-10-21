import { useSyncExternalStore } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabaseConfig";
import { IMAGE_SLOTS } from "@/data/imageSections";

// Every fixed-slot image (hero, categories, heritage, bestsellers) comes from ONE request,
// started at module load — before React renders. The last answer is kept in localStorage,
// so repeat visits paint the right image immediately and just revalidate in the background.
// Until the first answer there is no image at all (never the default-then-swap flash).
//
// When the admin replaces an image the old file is deleted, so a visitor's saved URL 404s.
// Images call refreshSiteImages() on error, which pulls the current list and swaps them over.

type ImageMap = Record<string, string>;

const CACHE_KEY = "ins_site_images_v1";
const TIMEOUT_MS = 3000;
const MIN_REFRESH_GAP_MS = 10_000; // stops a genuinely broken image from re-fetching in a loop

let map: ImageMap | null = null;
let inflight: Promise<void> | null = null;
let lastOkAt = 0; // only a SUCCESSFUL lookup throttles refreshes; after a failed one a retry is allowed
const listeners = new Set<() => void>();

function load(): Promise<void> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  inflight = fetch(
    `${SUPABASE_URL}/rest/v1/site_images?select=section,url&section=not.in.(gallery,product)&order=created_at.desc`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }, signal: ctrl.signal },
  )
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((rows: { section: string; url: string }[]) => {
      const next: ImageMap = {};
      for (const row of rows) if (!(row.section in next)) next[row.section] = row.url; // newest row wins
      if (JSON.stringify(next) !== JSON.stringify(map)) map = next;
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      lastOkAt = Date.now();
    })
    .catch(() => { map = map ?? {}; }) // offline / slow: keep what we have, else the bundled defaults
    .finally(() => { clearTimeout(timer); inflight = null; listeners.forEach((l) => l()); });

  return inflight;
}

if (typeof window !== "undefined") {
  try { map = JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); } catch { /* private mode */ }
  load();
}

/** Re-check which images are current. Joins a request already in flight; otherwise throttled. */
export function refreshSiteImages(): Promise<void> {
  if (inflight) return inflight;
  if (Date.now() - lastOkAt < MIN_REFRESH_GAP_MS) return Promise.resolve();
  return load();
}

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

/** URL for a fixed slot, or "" until the lookup has answered (render nothing yet). */
export function useSiteImage(section: string): string {
  const m = useSyncExternalStore(subscribe, () => map, () => null);
  if (!m) return "";
  return m[section] ?? IMAGE_SLOTS.find((s) => s.section === section)?.defaultUrl ?? "";
}
