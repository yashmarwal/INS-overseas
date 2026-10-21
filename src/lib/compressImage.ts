// Resizes + re-encodes a photo to WebP in the browser before it is uploaded, so visitors never
// download a 4MB phone photo. Returns the ORIGINAL file whenever re-encoding wouldn't help or could
// do harm: GIFs and animated WebP (would lose the animation), non-images, any failure, or a bigger result.

const isAnimatedWebp = async (file: File) => {
  const b = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  const tag = (o: number) => String.fromCharCode(b[o], b[o + 1], b[o + 2], b[o + 3]);
  return tag(0) === "RIFF" && tag(8) === "WEBP" && tag(12) === "VP8X" && (b[20] & 0x02) !== 0;
};

export async function compressImage(file: File, maxEdge = 1400, quality = 0.82): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    if (file.type === "image/webp" && (await isAnimatedWebp(file))) return file;

    const bitmap = await createImageBitmap(file); // applies EXIF rotation
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", quality));
    // Older Safari silently returns PNG here — keep the original in that case.
    if (!blob || blob.type !== "image/webp" || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return file;
  }
}
