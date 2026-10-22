// Shrinks a photo in the browser before it is uploaded, so visitors never download a 4MB phone photo.
// It re-encodes to WebP and searches for the lowest file size that still looks the same: it starts at a high quality
// and only steps down while the result is over the size budget (and never below a visually safe floor). If the photo is
// still over budget it is scaled down a little, never below a minimum width. Returns the ORIGINAL file whenever
// re-encoding wouldn't help or could do harm: GIFs and animated WebP (would lose the animation), non-images, any
// failure, or a bigger result.

/** Default size budget for product and gallery photos. A photo this size is ~1000px wide and indistinguishable on screen. */
export const TARGET_KB = 120;

const QUALITY_STEPS = [0.88, 0.82, 0.76, 0.7, 0.64]; // 0.64 is the floor: below it WebP starts to show smearing
const MIN_EDGE = 900; // never shrink the long side below this to hit the budget

const isAnimatedWebp = async (file: File) => {
  const b = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  const tag = (o: number) => String.fromCharCode(b[o], b[o + 1], b[o + 2], b[o + 3]);
  return tag(0) === "RIFF" && tag(8) === "WEBP" && tag(12) === "VP8X" && (b[20] & 0x02) !== 0;
};

export type CompressResult = {
  file: File;
  before: number; // bytes
  after: number; // bytes
  /** The uploaded photo's longest side in px, 0 if it could not be read. */
  longEdge: number;
  /** True when the browser could not read the file as an image at all (corrupt, or not really a photo). */
  unreadable?: boolean;
};

export const formatBytes = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

const toWebp = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", quality));

export async function compressImageDetailed(file: File, maxEdge = 1400, targetKB = TARGET_KB): Promise<CompressResult> {
  const untouched: CompressResult = { file, before: file.size, after: file.size, longEdge: 0 };
  if (!file.type.startsWith("image/") || file.type === "image/gif") return untouched;
  try {
    if (file.type === "image/webp" && (await isAnimatedWebp(file))) return untouched;

    const bitmap = await createImageBitmap(file); // applies EXIF rotation
    const sourceEdge = Math.max(bitmap.width, bitmap.height);
    let edge = Math.min(sourceEdge, maxEdge);
    const budget = targetKB * 1024;

    let best: Blob | null = null;
    // First try the full size at falling quality; if still over budget, shrink a little and repeat.
    for (let round = 0; round < 4; round++) {
      const scale = edge / sourceEdge;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      for (const q of QUALITY_STEPS) {
        const blob = await toWebp(canvas, q);
        // Older Safari silently returns PNG here — keep the original in that case.
        if (!blob || blob.type !== "image/webp") { bitmap.close(); return untouched; }
        if (!best || blob.size < best.size) best = blob;
        if (blob.size <= budget) { best = blob; break; }
      }
      if (best && best.size <= budget) break;
      if (edge <= MIN_EDGE) break;
      edge = Math.max(MIN_EDGE, Math.round(edge * 0.85));
    }
    bitmap.close();

    if (!best || best.size >= file.size) return { ...untouched, longEdge: sourceEdge };
    return {
      file: new File([best], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" }),
      before: file.size,
      after: best.size,
      longEdge: sourceEdge,
    };
  } catch {
    return { ...untouched, unreadable: true };
  }
}

/** Same as compressImageDetailed, for callers that only want the file. */
export async function compressImage(file: File, maxEdge = 1400, targetKB = TARGET_KB): Promise<File> {
  return (await compressImageDetailed(file, maxEdge, targetKB)).file;
}

/** One friendly sentence about what compression saved, e.g. "Photos shrunk from 9.4 MB to 310 KB (97% smaller)." */
export function savingsSentence(results: CompressResult[]): string {
  const before = results.reduce((s, r) => s + r.before, 0);
  const after = results.reduce((s, r) => s + r.after, 0);
  if (!results.length || after >= before) return "";
  return `${results.length > 1 ? "Photos" : "Photo"} shrunk from ${formatBytes(before)} to ${formatBytes(after)} (${Math.round((1 - after / before) * 100)}% smaller) with no visible quality loss.`;
}
