import { COMPANY } from "@/data/company";

// Builds the wholesale catalogue as a PDF, in the browser, at the moment the visitor asks for it, from the products that are
// loaded right now, so it is never out of date. The PDF library (jsPDF) is loaded only here, on demand: most visitors never
// open this, so it must not add to the page's normal download.
//
// The document: a branded cover, an "about us" page, the products (two cards across, grouped by category), and a closing
// contact page. Warm paper pages, ink and gold, serif headings: the same look as the website. Only the PDF's own standard
// fonts are used (nothing embedded), so the file stays small.

export type CatalogItem = {
  id: string;
  name: string;
  category: string; // shown label, e.g. "Leather Journal"
  description: string;
  image: string; // photo URL ("" for none)
  moq: number | null; // null = no minimum on record, printed as "In quote"
  lead: number; // days
  url: string; // the product's own link
  tag?: string | null; // "Best seller" / "New"
  code?: string; // the item code, e.g. "LJ-014"
  specs?: string; // size and material in one line, e.g. "A5 - Buffalo leather"
};

export type BuildOptions = {
  filterLabel: string;
  onProgress: (status: string, fraction: number) => void;
  signal?: AbortSignal;
};

type RGB = [number, number, number];

// ── page geometry (A4 portrait, millimetres)
const W = 210, H = 297, M = 14;
const HEAD = 12; // the ink band at the top of an inner page
const FOOT = 21; // room kept for the footer
const TOP = HEAD + 8;
const LIMIT = H - FOOT - 1;
const GX = 8, GY = 5; // gaps between the product cards
const CW = (W - 2 * M - GX) / 2; // a card's width
const PAD = 2.5; // the white margin round a photo inside its card
const PH = 40; // a photo's height (its width is the card's minus the margins)
const PW = CW - 2 * PAD;
const CARD_H = 77; // a card's height
const BANNER = 14; // a category heading
const IMG_DPI = 120; // a photo printed 82 mm wide needs about 390 px, not a phone camera's 4000: this keeps the file small
const JPEG_QUALITY = 0.62;
const IMG_TIMEOUT = 8000;
const POOL = 24; // photos prepared at once (they come over one connection, so many at a time is fine)

const INK: RGB = [26, 20, 16];
const GOLD: RGB = [201, 151, 58];
const GOLD_DEEP: RGB = [140, 100, 30];
const GOLD_SOFT: RGB = [226, 196, 132];
const PAPER: RGB = [250, 247, 240];
const WHITE: RGB = [255, 255, 255];
const GREY: RGB = [101, 90, 76];
const RULE: RGB = [228, 220, 203];
const EDGE: RGB = [236, 229, 214];
const PLACEHOLDER: RGB = [241, 237, 228];
const CREAM_DIM: RGB = [215, 205, 185];

/** The PDF's standard fonts only know Latin-1: swap typographic characters and drop anything else, so text never garbles. */
const pdfText = (s: string) =>
  String(s ?? "")
    .replace(/[‘’‚]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/[–—−]/g, "-")
    .replace(/[·•‧]/g, "-")
    .replace(/…/g, "...")
    .replace(/×/g, "x")
    .replace(/ /g, " ")
    .replace(/[^ -~¡-ÿ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const slug = (s: string) => pdfText(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "catalogue";

/** Fetches one picture and re-draws it, smaller, on a canvas. Never throws and never hangs: any failure gives null. */
function loadScaled(url: string, widthMm: number, heightMm: number, background: string, signal?: AbortSignal, png = false): Promise<string | null> {
  if (!url) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    let done = false;
    const finish = (v: string | null) => { if (done) return; done = true; clearTimeout(timer); img.onload = img.onerror = null; resolve(v); };
    const timer = window.setTimeout(() => { img.src = ""; finish(null); }, IMG_TIMEOUT);
    signal?.addEventListener("abort", () => finish(null), { once: true });
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onerror = () => finish(null);
    img.onload = () => {
      try {
        const w = Math.max(16, Math.round((widthMm / 25.4) * IMG_DPI)), h = Math.max(16, Math.round((heightMm / 25.4) * IMG_DPI));
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        const ctx = c.getContext("2d");
        if (!ctx || !img.naturalWidth) return finish(null);
        ctx.fillStyle = background; ctx.fillRect(0, 0, w, h); // (a JPEG has no see-through parts, so transparent ones take this colour)
        // "cover": fill the box, centred, cropping what overhangs
        const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
        ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
        finish(png ? c.toDataURL("image/png") : c.toDataURL("image/jpeg", JPEG_QUALITY));
      } catch { finish(null); } // e.g. a picture the browser will not let a canvas read
    };
    img.src = url;
  });
}

/** Runs `worker` over every item, a few at a time. */
async function pool<T>(items: T[], size: number, worker: (item: T, i: number) => Promise<void>) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) { const i = next++; await worker(items[i], i); }
  }));
}

// Every photo is fetched and shrunk once, then kept: the dialog starts on them while the visitor is still choosing what to
// include (see warmPhotos), so by the time "Download" is pressed most are ready and the PDF is built almost at once.
const photoCache = new Map<string, Promise<string | null>>();
const photoFor = (url: string): Promise<string | null> => {
  if (!url) return Promise.resolve(null);
  let p = photoCache.get(url);
  if (!p) {
    p = loadScaled(url, PW, PH, "#ffffff").then((v) => { if (!v) photoCache.delete(url); return v; }); // a failed one is tried again next time
    photoCache.set(url, p);
  }
  return p;
};
/** Starts preparing these products' photos in the background. Safe to call again and again. */
export function warmPhotos(items: { image: string }[]) {
  void pool(items, POOL, async (it) => { await photoFor(it.image); });
}

export async function buildCatalogPdf(items: CatalogItem[], opts: BuildOptions): Promise<{ blob: Blob; filename: string; pages: number; photos: number }> {
  const { onProgress, signal } = opts;
  const stop = () => { if (signal?.aborted) throw new DOMException("Cancelled", "AbortError"); };

  onProgress("Loading the PDF tools...", 0.02);
  const { jsPDF } = await import("jspdf"); // loaded only now
  stop();

  // 1. the pictures (one slow or broken one never holds up the rest)
  const photos = new Map<string, string | null>();
  if (items.length) {
    let got = 0;
    onProgress(`Fetching photos 0 of ${items.length}...`, 0.05);
    await pool(items, POOL, async (it) => {
      if (signal?.aborted) return;
      photos.set(it.id, await photoFor(it.image));
      got++;
      onProgress(`Fetching photos ${got} of ${items.length}...`, 0.05 + 0.6 * (got / items.length));
    });
    stop();
  }
  const logo = await loadScaled("/logo-mark.png", 40, 53.3, "#1a1410", signal, true); // flattened onto the ink colour (a PNG, so no compression smudge round the mark)
  stop();

  // 2. the pages
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  const now = new Date();
  const today = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const edition = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const label = pdfText(opts.filterLabel) || "All products";
  const title = `${COMPANY.name} - Wholesale catalogue - ${label}`;
  doc.setProperties({ title, subject: "Wholesale product catalogue", author: COMPANY.name, creator: `${COMPANY.website} (generated ${today})` });

  const fill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
  const ink = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
  const line = (c: RGB, w: number) => { doc.setDrawColor(c[0], c[1], c[2]); doc.setLineWidth(w); };
  const font = (f: "helvetica" | "times", style: "normal" | "bold" | "italic", size: number) => { doc.setFont(f, style); doc.setFontSize(size); };
  /** letter-spaced text that really is centred / right-aligned (the built-in alignment ignores the spacing) */
  const spaced = (s: string, x: number, y: number, cs: number, align: "left" | "center" | "right" = "left") => {
    const w = doc.getTextWidth(s) + cs * Math.max(0, s.length - 1);
    const left = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
    doc.text(s, left, y, { charSpace: cs });
    return w;
  };
  const diamond = (cx: number, cy: number, r: number) => { doc.triangle(cx - r, cy, cx, cy - r, cx + r, cy, "F"); doc.triangle(cx - r, cy, cx, cy + r, cx + r, cy, "F"); };
  /** a thin gold rule with a small diamond in the middle */
  const ornament = (cx: number, y: number, half: number) => {
    line(GOLD, 0.3); doc.line(cx - half, y, cx - 3.2, y); doc.line(cx + 3.2, y, cx + half, y);
    fill(GOLD); diamond(cx, y, 1.5);
  };
  const paper = () => { fill(PAPER); doc.rect(0, 0, W, H, "F"); };
  const ink_page = () => { fill(INK); doc.rect(0, 0, W, H, "F"); };
  const frame = () => { line(GOLD, 0.4); doc.rect(8, 8, W - 16, H - 16, "S"); line(GOLD_DEEP, 0.15); doc.rect(10.5, 10.5, W - 21, H - 21, "S"); };

  // the groups (by category, in the order they first appear); a single category needs no headings
  const groups: { label: string; items: CatalogItem[] }[] = [];
  for (const it of items) {
    const g = groups.find((x) => x.label === it.category);
    if (g) g.items.push(it); else groups.push({ label: it.category, items: [it] });
  }
  const headed = groups.length > 1;
  const count = items.length;
  const noun = `piece${count === 1 ? "" : "s"}`;

  // ── page 1: the cover
  ink_page(); frame();
  if (logo) doc.addImage(logo, "PNG", W / 2 - 17, 30, 34, 45.3, undefined, "FAST");
  ink(WHITE); font("times", "bold", 27); spaced(pdfText(COMPANY.name).toUpperCase(), W / 2, 94, 3.2, "center");
  ink(GOLD); font("helvetica", "normal", 7.8); spaced(pdfText(COMPANY.tagline).toUpperCase(), W / 2, 102, 1.1, "center");
  ornament(W / 2, 114, 38);
  ink(PAPER); font("times", "normal", 44); doc.text("Wholesale", W / 2, 140, { align: "center" });
  ink(GOLD); font("times", "italic", 44); doc.text("Catalogue", W / 2, 157, { align: "center" });
  ink(CREAM_DIM); font("helvetica", "bold", 9.5); spaced(label.toUpperCase(), W / 2, 170, 2.4, "center");
  const covers = items.map((it) => photos.get(it.id)).filter((d): d is string => !!d).slice(0, 3);
  if (covers.length) {
    const cw = 56, ch = cw * (PH / PW), gap = 4;
    const total = covers.length * cw + (covers.length - 1) * gap;
    covers.forEach((d, i) => {
      const x = W / 2 - total / 2 + i * (cw + gap);
      line(GOLD, 0.3); doc.roundedRect(x - 0.9, 183 - 0.9, cw + 1.8, ch + 1.8, 1.4, 1.4, "S");
      doc.addImage(d, "JPEG", x, 183, cw, ch, undefined, "FAST");
    });
  }
  ink(PAPER); font("times", "italic", 13); doc.text(`${count} ${noun}   -   ${edition}`, W / 2, 232, { align: "center" });
  ornament(W / 2, 244, 20);
  ink(CREAM_DIM); font("helvetica", "normal", 8.2);
  COMPANY.addressLines.forEach((l, i) => doc.text(pdfText(l), W / 2, 256 + i * 4.4, { align: "center" }));
  ink(GOLD); font("helvetica", "bold", 8.6);
  doc.text(`${pdfText(COMPANY.email)}   |   ${COMPANY.phone}   |   ${COMPANY.website}`, W / 2, 268, { align: "center" });
  const reg = pdfText(COMPANY.registration);
  if (reg) { ink(CREAM_DIM); font("helvetica", "normal", 7.4); doc.text(reg, W / 2, 275, { align: "center" }); }

  // ── an inner page: paper, the ink band with the wordmark, a gold line
  const innerPage = (running: string) => {
    doc.addPage(); paper();
    fill(INK); doc.rect(0, 0, W, HEAD, "F");
    fill(GOLD); doc.rect(0, HEAD, W, 0.6, "F");
    let x = M;
    if (logo) { doc.addImage(logo, "PNG", M, 1.7, 6.3, 8.4, undefined, "FAST"); x = M + 9.5; }
    ink(PAPER); font("times", "bold", 11.5); spaced(pdfText(COMPANY.name).toUpperCase(), x, 7.9, 1.6);
    ink(GOLD); font("helvetica", "normal", 7.6); spaced(pdfText(running).toUpperCase(), W - M, 7.7, 0.7, "right");
  };

  // ── page 2: about us
  innerPage("About us");
  ink(GOLD_DEEP); font("helvetica", "bold", 8); line(GOLD, 0.5); doc.line(M, 31.5, M + 11, 31.5); spaced("OUR STORY", M + 14.5, 32.6, 2.2);
  ink(INK); font("times", "normal", 29); doc.text("Crafted by hand in Jaipur,", M, 46);
  ink(GOLD_DEEP); font("times", "italic", 29); doc.text("since 1995.", M, 57);
  ink(GREY); font("helvetica", "normal", 10.2);
  const story = "INS Overseas makes handmade leather journals, artisan stationery and eco-conscious handmade paper in Sanganer, Jaipur. Every piece is crafted by Rajasthani artisans and shipped to buyers in more than 40 countries. This catalogue lists the pieces we make for wholesale, with the minimum order and the lead time for each.";
  (doc.splitTextToSize(story, 152) as string[]).forEach((l, i) => doc.text(l, M, 70 + i * 5.3));

  const feats: [string, string, string][] = [
    ["01", "Handmade", "Each piece is made by hand by Rajasthani artisans."],
    ["02", "Custom branding", "Your logo and your packaging, on request."],
    ["03", "Ships worldwide", "To buyers in 40+ countries, by air or sea."],
    ["04", "Clear terms", "Minimum order and lead time on every piece."],
  ];
  const fw = (W - 2 * M - 3 * 5) / 4;
  feats.forEach(([n, t, d], i) => {
    const x = M + i * (fw + 5);
    fill(WHITE); line(RULE, 0.2); doc.roundedRect(x, 100, fw, 38, 2.5, 2.5, "FD");
    ink(GOLD); font("times", "italic", 19); doc.text(n, x + 4, 111.5);
    ink(INK); font("helvetica", "bold", 9); doc.text(t, x + 4, 120);
    ink(GREY); font("helvetica", "normal", 7.8);
    (doc.splitTextToSize(d, fw - 8) as string[]).slice(0, 3).forEach((l, k) => doc.text(l, x + 4, 125.2 + k * 3.8));
  });

  // what is inside
  ink(GOLD_DEEP); font("helvetica", "bold", 8); line(GOLD, 0.5); doc.line(M, 152.5, M + 11, 152.5); spaced("IN THIS CATALOGUE", M + 14.5, 153.6, 2.2);
  const shown = groups.slice(0, 9);
  shown.forEach((g, i) => {
    const y = 164 + i * 7.6;
    ink(INK); font("times", "normal", 13); doc.text(pdfText(g.label), M, y);
    ink(GREY); font("helvetica", "normal", 8.6); doc.text(`${g.items.length} ${g.items.length === 1 ? "piece" : "pieces"}`, W - M, y, { align: "right" });
    line(RULE, 0.25); doc.line(M, y + 2.6, W - M, y + 2.6);
  });
  if (groups.length > shown.length) { ink(GREY); font("helvetica", "italic", 8.6); doc.text(`and ${groups.length - shown.length} more ${groups.length - shown.length === 1 ? "category" : "categories"}`, M, 164 + shown.length * 7.6); }

  // how to order
  const oy = 238;
  ink(GOLD_DEEP); font("helvetica", "bold", 8); line(GOLD, 0.5); doc.line(M, oy, M + 11, oy); spaced("HOW TO ORDER", M + 14.5, oy + 1.1, 2.2);
  const steps: [string, string][] = [
    ["Choose", "the pieces you like, in this catalogue or on our website."],
    ["Send your list", "by e-mail or WhatsApp, with the quantities."],
    ["We confirm", "the price, samples and lead time for your order."],
    ["We ship", "worldwide, by air or sea."],
  ];
  steps.forEach(([t, d], i) => {
    const x = M + i * (fw + 5);
    fill(GOLD); doc.circle(x + 3.6, oy + 12, 3.6, "F");
    ink(INK); font("helvetica", "bold", 9); doc.text(String(i + 1), x + 3.6, oy + 13.2, { align: "center" });
    font("helvetica", "bold", 9.2); doc.text(t, x + 9.6, oy + 12.9);
    ink(GREY); font("helvetica", "normal", 7.8);
    (doc.splitTextToSize(d, fw) as string[]).slice(0, 3).forEach((l, k) => doc.text(l, x, oy + 21 + k * 3.8));
  });

  // ── the products
  const cardH = CARD_H;
  const running = `${label} - ${count} ${noun}`;
  let y = TOP;
  const nextPage = () => { innerPage(running); y = TOP; };
  nextPage();

  const drawBanner = (g: { label: string; items: CatalogItem[] }) => {
    ink(INK); font("times", "italic", 19); doc.text(pdfText(g.label), M, y + 8);
    ink(GREY); font("helvetica", "normal", 8.4); doc.text(`${g.items.length} ${g.items.length === 1 ? "piece" : "pieces"}`, W - M, y + 8, { align: "right" });
    line(RULE, 0.25); doc.line(M, y + 11, W - M, y + 11);
    line(GOLD, 0.7); doc.line(M, y + 11, M + 16, y + 11);
    y += BANNER;
  };

  const drawCard = (it: CatalogItem, x: number) => {
    fill(EDGE); doc.roundedRect(x + 0.4, y + 0.7, CW, cardH, 2.5, 2.5, "F"); // a hair of shadow
    fill(WHITE); line(RULE, 0.2); doc.roundedRect(x, y, CW, cardH, 2.5, 2.5, "FD");
    const data = photos.get(it.id);
    const px = x + PAD, py = y + PAD;
    if (data) {
      doc.saveGraphicsState();
      doc.roundedRect(px, py, PW, PH, 1.6, 1.6, null as unknown as string); // the picture's rounded corners (a clip)
      doc.clip(); doc.discardPath();
      doc.addImage(data, "JPEG", px, py, PW, PH, undefined, "FAST");
      doc.restoreGraphicsState();
    } else {
      fill(PLACEHOLDER); doc.roundedRect(px, py, PW, PH, 1.6, 1.6, "F");
      ink(GREY); font("helvetica", "normal", 7.5); doc.text("Photo not available", px + PW / 2, py + PH / 2 + 1, { align: "center" });
    }
    if (it.tag) {
      font("helvetica", "bold", 6.6);
      const t = pdfText(it.tag).toUpperCase(), tw = doc.getTextWidth(t) + t.length * 0.3 + 5;
      fill(GOLD); doc.roundedRect(px + 2.4, py + 2.4, tw, 5, 2.5, 2.5, "F");
      ink(INK); spaced(t, px + 2.4 + 2.5, py + 5.9, 0.3);
    }
    const ty = y + PAD + PH;
    const tx = x + PAD + 1.5, tw = CW - 2 * PAD - 3;

    // the category on the left, the item code on the right (the category is shortened if the two would meet)
    const codeText = pdfText(it.code || "");
    let codeW = 0;
    if (codeText) { ink(INK); font("helvetica", "bold", 7); codeW = spaced(codeText, x + CW - PAD - 1.5, ty + 5.6, 0.4, "right"); }
    font("helvetica", "bold", 6.8);
    let cat = pdfText(it.category).toUpperCase();
    const catRoom = tw - (codeW ? codeW + 3 : 0);
    while (cat.length > 3 && doc.getTextWidth(cat) + 0.7 * (cat.length - 1) > catRoom) cat = cat.slice(0, -4) + "...";
    ink(GOLD_DEEP); spaced(cat, tx, ty + 5.6, 0.7);

    ink(INK); font("times", "bold", 12.6);
    const nameLines = (doc.splitTextToSize(pdfText(it.name) || "Handmade product", tw) as string[]).slice(0, 2);
    nameLines.forEach((l, i) => doc.text(l, tx, ty + 11.4 + i * 5));
    const afterName = ty + 11.4 + (nameLines.length - 1) * 5;

    // size and material, then as much of the description as fits
    const specs = pdfText(it.specs || "");
    if (specs) {
      ink(INK); font("helvetica", "bold", 7.6);
      doc.text((doc.splitTextToSize(specs, tw) as string[])[0], tx, afterName + 4.6);
    }
    const desc = pdfText(it.description);
    if (desc && desc.toLowerCase() !== pdfText(it.name).toLowerCase()) {
      ink(GREY); font("helvetica", "normal", 7.9);
      const room = specs ? (nameLines.length === 1 ? 1 : 0) : (nameLines.length === 1 ? 2 : 1);
      if (room > 0) {
        const all = doc.splitTextToSize(desc, tw) as string[];
        const dl = all.slice(0, room);
        if (all.length > room) dl[room - 1] = dl[room - 1].replace(/\s*\S{0,3}$/, "") + "...";
        dl.forEach((l, i) => doc.text(l, tx, afterName + (specs ? 8.6 : 4.6) + i * 3.7));
      }
    }

    // the facts, and the product's own link
    const fy = y + cardH - 10.4;
    line(RULE, 0.25); doc.line(x + PAD + 1.5, fy, x + CW - PAD - 1.5, fy);
    ink(GREY); font("helvetica", "normal", 5.9);
    spaced("MIN. ORDER", tx, fy + 3.7, 0.6); spaced("LEAD TIME", tx + 27, fy + 3.7, 0.6);
    ink(INK); font("helvetica", "bold", 9);
    doc.text(it.moq == null ? "In quote" : `${it.moq} pcs`, tx, fy + 8); doc.text(`${it.lead} days`, tx + 27, fy + 8);
    ink(GOLD_DEEP); font("helvetica", "bold", 7.6);
    const lw = doc.getTextWidth("View online");
    const lx = x + CW - PAD - 1.5 - lw;
    doc.textWithLink("View online", lx, fy + 8, { url: it.url });
    line(GOLD, 0.35); doc.line(lx, fy + 8.9, lx + lw, fy + 8.9);
  };

  let done = 0;
  const total = Math.max(1, count);
  for (const g of groups) {
    stop();
    if (headed) {
      if (y + BANNER + cardH > LIMIT) nextPage();
      drawBanner(g);
    }
    let col = 0;
    for (const it of g.items) {
      if (col === 0 && y + cardH > LIMIT) nextPage();
      drawCard(it, M + col * (CW + GX));
      done++;
      onProgress(`Building pages: ${done} of ${count}...`, 0.68 + 0.28 * (done / total));
      col++;
      if (col === 2) { col = 0; y += cardH + GY; }
    }
    if (col !== 0) y += cardH + GY;
    y += headed ? 3 : 0;
  }
  if (count === 0) {
    ink(GREY); font("helvetica", "normal", 11);
    doc.text("There are no products in this selection yet.", M, y + 6);
  }

  // ── the last page: get in touch
  doc.addPage(); ink_page(); frame();
  if (logo) doc.addImage(logo, "PNG", W / 2 - 11, 40, 22, 29.3, undefined, "FAST");
  ink(GOLD); font("helvetica", "bold", 8); spaced("GET IN TOUCH", W / 2, 90, 2.6, "center");
  ink(PAPER); font("times", "normal", 36); doc.text("Let us make it", W / 2, 110, { align: "center" });
  ink(GOLD); font("times", "italic", 36); doc.text("together.", W / 2, 124, { align: "center" });
  ornament(W / 2, 135, 30);
  ink(CREAM_DIM); font("helvetica", "normal", 10.2);
  (doc.splitTextToSize("Tell us which pieces you like, in what quantity, and where they should go. We will reply with pricing, samples and lead times. Custom branding is available on request.", 118) as string[]).forEach((l, i) => doc.text(l, W / 2, 148 + i * 5.6, { align: "center" }));
  const blocks: [string, string, string?][] = [
    ["E-MAIL", pdfText(COMPANY.email), `mailto:${COMPANY.email}`],
    ["PHONE / WHATSAPP", COMPANY.phone, `https://wa.me/${COMPANY.phone.replace(/\D/g, "")}`],
    ["WEBSITE", COMPANY.website, `https://${COMPANY.website}`],
  ];
  blocks.forEach(([k, v, url], i) => {
    const y0 = 183 + i * 15;
    ink(GOLD); font("helvetica", "bold", 6.8); spaced(k, W / 2, y0, 2, "center");
    ink(PAPER); font("times", "normal", 15);
    if (url) doc.textWithLink(v, W / 2 - doc.getTextWidth(v) / 2, y0 + 6.6, { url }); else doc.text(v, W / 2, y0 + 6.6, { align: "center" });
  });
  ink(GOLD); font("helvetica", "bold", 6.8); spaced("WORKSHOP", W / 2, 228, 2, "center");
  ink(CREAM_DIM); font("helvetica", "normal", 9);
  COMPANY.addressLines.forEach((l, i) => doc.text(pdfText(l), W / 2, 234 + i * 4.6, { align: "center" }));
  if (reg) { ink(CREAM_DIM); font("helvetica", "normal", 7.6); doc.text(reg, W / 2, 252, { align: "center" }); }
  ink(GOLD_SOFT); font("helvetica", "italic", 7.2); doc.text("Prices on request. Photos are indicative; minimum orders and lead times are as shown.", W / 2, 262, { align: "center" });

  // 3. the footer on every inner page (not the cover, not the last page)
  const pages = doc.getNumberOfPages();
  for (let p = 2; p < pages; p++) {
    doc.setPage(p);
    line(GOLD, 0.35); doc.line(M, H - FOOT + 2, W - M, H - FOOT + 2);
    ink(INK); font("helvetica", "bold", 7.8);
    doc.text(`${pdfText(COMPANY.email)}   |   ${COMPANY.phone}   |   ${COMPANY.website}`, M, H - FOOT + 7);
    font("times", "italic", 9.5); doc.text(`Page ${p} of ${pages}`, W - M, H - FOOT + 7, { align: "right" });
    ink(GREY); font("helvetica", "normal", 7);
    doc.text(COMPANY.addressLines.map(pdfText).join(", "), M, H - FOOT + 11);
    if (reg) doc.text(reg, M, H - FOOT + 15);
    doc.text("Prices on request. Photos are indicative.", W - M, H - FOOT + 15, { align: "right" });
  }

  onProgress("Finishing...", 0.98);
  const blob = doc.output("blob");
  stop();
  const ymd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const filename = `INS-Overseas-Catalogue-${slug(opts.filterLabel)}-${ymd}.pdf`;
  onProgress("Done", 1);
  return { blob, filename, pages, photos: [...photos.values()].filter(Boolean).length };
}

/** Starts the browser's own download of a finished file. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
