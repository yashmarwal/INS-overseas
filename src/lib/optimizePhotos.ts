import { supabase } from "@/lib/supabase";

// "Make photos lighter" (admin): the product photos already on the site are re-saved smaller, with no change anyone can see.
//
// How it stays safe:
//  - every photo is shrunk and re-saved as WebP at a high quality, then COMPARED with the original (PSNR); a photo that
//    would look even slightly different, or that would not get at least 10% smaller, is left exactly as it is;
//  - before a photo is replaced, its original is copied to the "originals-backup" folder; if the copy fails, nothing is replaced;
//  - the photo keeps its address (same file name), so nothing else on the site (links, the PDF, the quote list, product codes)
//    has to change; only the file behind the address is lighter;
//  - "Restore originals" puts every backed-up original back.
export const MAX_EDGE = 1400; // the longest side, in pixels (the largest slot on the site shows a photo about 1,100 px wide on a sharp screen)
export const QUALITY = 0.82; // WebP quality
export const MIN_SAVING = 0.1; // replace only when the new file is at least this much smaller
export const MIN_PSNR = 38; // dB; above 40 is not visible to the eye, 38 is the floor we accept
export const BACKUP_DIR = "originals-backup/";
const BUCKET = "website-images";
const CACHE_SECONDS = "86400"; // a day: repeat visitors do not ask for the photo again, and a mistake would be fixed within a day

export type PhotoRef = { id: string; url: string; storage_path: string; name: string };
export type Plan = {
  ref: PhotoRef;
  before: number;
  after: number;
  psnr: number;
  w: number;
  h: number;
  action: "replace" | "keep";
  reason: string;
  blob: Blob | null; // the lighter copy (only when action is "replace")
  original: Blob | null; // kept so it can be backed up (only when action is "replace")
};

const canvasOf = (w: number, h: number) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };

/** PSNR in dB between two same-sized canvases (all four channels). Infinity when identical. */
function psnr(a: HTMLCanvasElement, b: HTMLCanvasElement) {
  const da = a.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, a.width, a.height).data;
  const db = b.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, b.width, b.height).data;
  let sum = 0;
  for (let i = 0; i < da.length; i++) { const d = da[i] - db[i]; sum += d * d; }
  const mse = sum / da.length;
  return mse === 0 ? Infinity : 10 * Math.log10((255 * 255) / mse);
}

/** Looks at one photo and decides: a lighter copy (kept in memory, nothing is written anywhere) or leave it alone. */
export async function planPhoto(ref: PhotoRef, signal?: AbortSignal): Promise<Plan> {
  const keep = (reason: string, extra: Partial<Plan> = {}): Plan => ({ ref, before: 0, after: 0, psnr: 0, w: 0, h: 0, action: "keep", reason, blob: null, original: null, ...extra });
  const res = await fetch(ref.url, { cache: "no-store", signal });
  if (!res.ok) throw new Error(`the photo could not be read (${res.status})`);
  const original = await res.blob();
  const before = original.size;
  if (!/^image\/(jpeg|png|webp)$/.test(original.type)) return keep("not a photo this tool handles", { before });

  const bmp = await createImageBitmap(original); // (honours the photo's own rotation, like the browser does when it shows it)
  const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * scale)), h = Math.max(1, Math.round(bmp.height * scale));
  const ref1 = canvasOf(w, h);
  const ctx = ref1.getContext("2d", { willReadFrequently: true })!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();

  const out = await new Promise<Blob | null>((r) => ref1.toBlob(r, "image/webp", QUALITY));
  if (!out || out.type !== "image/webp") throw new Error("this browser cannot make WebP photos (use Chrome or Edge)");
  if (out.size > before * (1 - MIN_SAVING)) return keep("already light", { before, after: out.size, w, h });

  // how close is the lighter copy to the original? (compared at the same size)
  const back = await createImageBitmap(out);
  const ref2 = canvasOf(w, h);
  ref2.getContext("2d", { willReadFrequently: true })!.drawImage(back, 0, 0);
  back.close();
  const score = psnr(ref1, ref2);
  if (score < MIN_PSNR) return keep(`would not look identical (${score.toFixed(1)} dB)`, { before, after: out.size, psnr: score, w, h });
  return { ref, before, after: out.size, psnr: score, w, h, action: "replace", reason: "lighter", blob: out, original };
}

/** Replaces one photo with its lighter copy, after saving the original. Throws (and replaces nothing) if the original cannot be saved. */
export async function applyPlan(p: Plan) {
  if (p.action !== "replace" || !p.blob || !p.original) return;
  const bucket = supabase.storage.from(BUCKET);
  const saved = await bucket.upload(BACKUP_DIR + p.ref.storage_path, p.original, { upsert: false, contentType: p.original.type || "image/jpeg", cacheControl: "31536000" });
  // (an earlier run may already have saved this original: that copy is the true original, so it is kept as it is)
  if (saved.error && !/already exists|duplicate|resource already/i.test(saved.error.message)) throw new Error(`the original could not be saved first (${saved.error.message}); nothing was changed`);
  const put = await bucket.upload(p.ref.storage_path, p.blob, { upsert: true, contentType: "image/webp", cacheControl: CACHE_SECONDS });
  if (put.error) throw new Error(`the photo could not be replaced (${put.error.message}); the original is untouched`);
}

/** The photos that have a saved original (file names, without the folder). */
export async function listBackups(): Promise<string[]> {
  const names: string[] = [];
  for (let offset = 0; offset < 5000; offset += 1000) {
    const { data, error } = await supabase.storage.from(BUCKET).list(BACKUP_DIR.replace(/\/$/, ""), { limit: 1000, offset });
    if (error || !Array.isArray(data)) break;
    names.push(...data.map((f) => f.name).filter((n) => n && n !== ".emptyFolderPlaceholder"));
    if (data.length < 1000) break;
  }
  return names;
}

/** Puts one saved original back where it came from. */
export async function restorePhoto(name: string) {
  const bucket = supabase.storage.from(BUCKET);
  const url = bucket.getPublicUrl(BACKUP_DIR + name).data.publicUrl;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`the saved original could not be read (${res.status})`);
  const blob = await res.blob();
  const put = await bucket.upload(name, blob, { upsert: true, contentType: blob.type || "image/jpeg", cacheControl: CACHE_SECONDS });
  if (put.error) throw new Error(`could not put it back (${put.error.message})`);
}

/** Runs `fn` over the items a few at a time; a failure on one never stops the others. */
export async function inParallel<T, R>(items: T[], size: number, fn: (item: T, i: number) => Promise<R>, stop?: () => boolean): Promise<(R | Error)[]> {
  const out: (R | Error)[] = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length && !stop?.()) {
      const i = next++;
      try { out[i] = await fn(items[i], i); } catch (e) { out[i] = e instanceof Error ? e : new Error(String(e)); }
    }
  }));
  return out;
}
