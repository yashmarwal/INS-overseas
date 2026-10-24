import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { animate, AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import EditorialHeading, { headingLinkCls, headingLinkStyle } from "@/components/shared/EditorialHeading";
import { cardSquareBtn, InfoTile, QuoteToggle } from "@/components/home/HomeProductCard";
import { WhatsAppGlyph } from "@/components/ui/FloatingDock";
import FadeImg from "@/components/shared/FadeImg";
import { EASE } from "@/components/shared/Reveal";
import { productShareUrl } from "@/lib/share";
import { categoryLabel, productLead, productMoq } from "@/data/catalogue";
import { useProductTerms } from "@/hooks/useProductTerms";
import { useProductDetails } from "@/hooks/useProductDetails";
import { codeSuffix, productCode } from "@/data/productDetails";
import { trackProduct } from "@/lib/track";
import { productsQuery, tagLabel, type ProductImage } from "@/hooks/useProductImages";
import { useCategories } from "@/hooks/useCategories";

// "Fresh From The Workshop": its own homepage section, filled from the products ticked "Show on the homepage" in the
// admin (up to 6, in the admin's order). A centred carousel: the piece in front is large, the ones either side sit
// behind it, smaller and dimmed.
//
// ONE number drives everything: `pos`, how far along the row we are (in cards, a decimal while moving). Every card
// works out where it is from its own distance to `pos` (place, size, shade, fade), so autoplay, a drag by hand, a tap
// on a side card and the arrow keys are all the same continuous glide: nothing snaps, restarts or jumps. Cards sit on
// a ring (a loop), and a card going round to the far side does it while fully faded out. Few pieces are repeated
// round the ring so there are always enough cards to fill it.
//
// It always turns by itself, every few seconds; the turn itself takes TURN_S. Visitors who ask their device for less
// motion get the same turning without the gliding (the pieces just swap). Only transform and opacity are animated.
// With nothing ticked the section does not exist.
const MAX = 6;
const AUTO_MS = 3500; // from the start of one turn to the start of the next
const TURN_S = 1.8; // how long a turn takes (seconds)
// (the automated tests slow the rhythm down by setting window.__insCarouselMs; visitors never touch it)
const autoMs = () => (typeof window !== "undefined" && Number((window as unknown as { __insCarouselMs?: number }).__insCarouselMs)) || AUTO_MS;
const RING_MIN = 6; // cards on the ring, at the least
const GLIDE: [number, number, number, number] = [0.45, 0, 0.2, 1]; // a gentle start and a long, soft landing
const WHATSAPP = "https://wa.me/919680478483";
const blurb = (p: ProductImage) =>
  p.alt_text && p.alt_text.trim().toLowerCase() !== (p.product_name || "").trim().toLowerCase()
    ? p.alt_text
    : "Handmade in Sanganer, Jaipur. Custom branding available. Ships worldwide by air or sea.";

// a card's look by its distance `a` (in cards) from the front; the numbers between the resting places are interpolated
const xAt = (a: number) => (a <= 1 ? 66 * a : a <= 2 ? 66 + 46 * (a - 1) : 112 + 28 * (a - 2)); // % of the card's own width
const scaleAt = (a: number) => (a <= 1 ? 1 - 0.14 * a : a <= 2 ? 0.86 - 0.14 * (a - 1) : 0.72);
const dimAt = (a: number) => (a <= 1 ? 0.28 * a : a <= 2 ? 0.28 + 0.22 * (a - 1) : 0.5);
const fadeAt = (a: number) => (a <= 2 ? 1 : Math.max(0, 3 - a));
const nearAt = (a: number) => Math.max(0, 1 - a * 1.6); // the chips and the name on the front card
const SPACING = 0.66; // a neighbour sits this share of a card's width from the front one: how far a drag moves per card

/** the signed distance from the front to a card on a ring of n, in [-n/2, n/2) */
const around = (x: number, n: number) => {
  const m = ((x % n) + n) % n;
  return m >= n / 2 ? m - n : m;
};

function Slot({ pos, s, ring, it, active, eager, onPick }: { pos: MotionValue<number>; s: number; ring: number; it: ProductImage; active: boolean; eager: boolean; onPick: () => void }) {
  const d = useTransform(pos, (v) => around(s - v, ring));
  const x = useTransform(d, (v) => `${Math.sign(v) * xAt(Math.abs(v))}%`);
  const scale = useTransform(d, (v) => scaleAt(Math.abs(v)));
  const opacity = useTransform(d, (v) => fadeAt(Math.abs(v)));
  const zIndex = useTransform(d, (v) => 100 - Math.round(Math.abs(v) * 10));
  const dim = useTransform(d, (v) => dimAt(Math.abs(v)));
  const near = useTransform(d, (v) => nearAt(Math.abs(v)));
  const pointerEvents = useTransform(d, (v) => (Math.abs(v) > 2.4 ? "none" : "auto"));
  const tag = tagLabel(it.tag);
  const itName = it.product_name || "Handmade Product";
  return (
    <motion.div
      data-pid={it.id}
      className={`absolute inset-0 rounded-[26px] overflow-hidden img-shimmer bg-white ${active ? "" : "cursor-pointer"}`}
      style={{ x, scale, opacity, zIndex, pointerEvents, boxShadow: "0 30px 56px -26px rgba(26,20,16,0.5)" }}
      aria-hidden={!active}
      onClick={active ? undefined : onPick}
      role={active ? undefined : "button"}
      aria-label={active ? undefined : `Show ${itName}`}
      tabIndex={-1}
    >
      <FadeImg src={it.url} alt={active ? itName : ""} loading={eager ? "eager" : "lazy"} decoding="async" draggable={false} className="w-full h-full object-cover pointer-events-none" />
      <motion.span aria-hidden className="absolute inset-0 bg-ink pointer-events-none" style={{ opacity: dim }} />
      <motion.span aria-hidden className="absolute inset-0 pointer-events-none" style={{ opacity: near }}>
        <span className="absolute inset-x-0 bottom-0 h-2/5" style={{ background: "linear-gradient(to top, rgba(26,20,16,0.82), rgba(26,20,16,0))" }} />
        <span className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
          {tag && (
            <span className={`rounded-full px-3 py-1.5 ${it.tag === "best" ? "bg-gold text-ink" : "bg-ink text-white"}`} style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12 }}>{tag}</span>
          )}
          <span className="max-w-full truncate rounded-full bg-white/90 text-ink px-3 py-1.5" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12 }}>{categoryLabel(it.category)}</span>
        </span>
        <span className="absolute bottom-4 left-4 right-4 text-white line-clamp-2" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, lineHeight: 1.1, textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}>{itName}</span>
      </motion.span>
    </motion.div>
  );
}

export default function FeaturedCollection() {
  const q = useQuery(productsQuery());
  useCategories(); // the admin's own category names, for the chip on each card
  useProductTerms(); // a product's own minimum order / lead time
  useProductDetails(); // its item code, for the quote and enquiry messages
  const reduce = useReducedMotion();

  const all = (q.data ?? []).filter((p) => p.featured).slice(0, MAX);
  const n = all.length;
  const ring = n < 2 ? n : n * Math.ceil(RING_MIN / n); // a whole number of laps of the pieces

  const pos = useMotionValue(0);
  const [target, setTarget] = useState(0); // where the row is heading (whole cards, counted on without end)
  const [slot, setSlot] = useState(0); // the card in front right now (changes half way through a turn)
  const [dragging, setDragging] = useState(false);
  const by = useRef<"auto" | "hand">("auto"); // what started the turn in progress (a hand release lands softer)
  const hand = useRef<{ x0: number; p0: number; id: number; on: boolean } | null>(null);
  const moved = useRef(false); // a drag just ended: the tap that follows it is not a choice of card
  const sizer = useRef<HTMLDivElement>(null);
  // every photo is fetched as soon as the section is near the screen: a card waiting off to the side of the ring is not
  // 'visible' to the browser, so a lazy photo would only start loading as the card slid in, and pop in half way
  const area = useRef<HTMLElement>(null);
  const near = useInView(area, { once: true, margin: "900px 0px 900px 0px" });

  useMotionValueEvent(pos, "change", (v) => {
    const r = Math.round(v);
    setSlot((cur) => (cur === r ? cur : r));
  });

  // glide to the target (from wherever the row is right now, so a change of mind mid-turn carries on smoothly)
  useEffect(() => {
    if (dragging || ring < 2) return;
    if (reduce) { pos.set(target); return; }
    const c = animate(pos, target, { duration: TURN_S, ease: by.current === "hand" ? EASE : GLIDE });
    return () => c.stop();
  }, [target, dragging, ring, reduce, pos]);

  // the next turn, a while after this one began; any turn (also by hand) restarts the wait
  useEffect(() => {
    if (n < 2 || dragging) return;
    const t = window.setTimeout(() => { by.current = "auto"; setTarget((v) => v + 1); }, autoMs());
    return () => window.clearTimeout(t);
  }, [target, n, dragging]);

  if (n === 0) return null;

  const front = ((slot % ring) + ring) % ring;
  const p = all[front % n];
  const name = p.product_name || "Handmade Product";
  const moq = `${productMoq(p.id, p.category)}+ pcs`;

  const turn = (by_: number) => { by.current = "hand"; setTarget((v) => v + by_); };
  const pickSlot = (s: number) => { by.current = "hand"; setTarget((v) => v + around(s - v, ring)); };

  return (
    <section
      ref={area}
      className="bg-cream pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-24 lg:pb-32 overflow-x-clip"
      aria-labelledby="handpicked-title"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <EditorialHeading
          id="handpicked-title"
          eyebrow="Handpicked"
          count={`${String(n).padStart(2, "0")} new`}
          line1="Fresh From"
          line2="The Workshop"
          intro="A few pieces we are especially proud of right now. Ask for pricing and samples on any of them."
          aside={
            <Link to="/products" className={headingLinkCls} style={headingLinkStyle}>
              See all products
              <span className="w-9 h-9 rounded-full bg-gold text-ink flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5"><ArrowRight size={16} /></span>
            </Link>
          }
        />
      </div>

      {/* the carousel: drag it, tap a side card, or use the arrow keys; it also turns by itself */}
      <div
        className="relative isolate mt-8 md:mt-12 py-8 outline-none cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: "pan-y" }}
        role="group"
        aria-roledescription="carousel"
        aria-label="Handpicked pieces"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); turn(1); }
          else if (e.key === "ArrowLeft") { e.preventDefault(); turn(-1); }
        }}
        onPointerDown={(e) => {
          if (n < 2 || (e.pointerType === "mouse" && e.button !== 0)) return;
          hand.current = { x0: e.clientX, p0: pos.get(), id: e.pointerId, on: false };
          moved.current = false;
        }}
        onPointerMove={(e) => {
          const h = hand.current;
          if (!h || e.pointerId !== h.id) return;
          const dx = e.clientX - h.x0;
          if (!h.on) {
            if (Math.abs(dx) < 8) return; // still a tap
            h.on = true;
            moved.current = true;
            setDragging(true); // stops the glide where it is; the hand takes over from there
            try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* it still follows while the pointer stays over it */ }
          }
          const w = (sizer.current?.offsetWidth || 300) * SPACING;
          pos.set(h.p0 - dx / w); // the row moves with the hand, one-to-one with the neighbouring card
        }}
        onPointerUp={(e) => {
          const h = hand.current;
          hand.current = null;
          if (!h?.on) return;
          const dx = e.clientX - h.x0;
          const base = Math.round(h.p0);
          by.current = "hand";
          setTarget(Math.abs(dx) > 48 ? base + (dx < 0 ? 1 : -1) : base); // the glide carries on from the hand's place
          setDragging(false);
        }}
        onPointerCancel={() => {
          const h = hand.current;
          hand.current = null;
          if (h?.on) { by.current = "hand"; setTarget(Math.round(h.p0)); setDragging(false); }
        }}
      >
        <div ref={sizer} className="relative mx-auto w-[min(68vw,290px)] md:w-[300px] lg:w-[340px] aspect-[4/5]">
          {Array.from({ length: ring }, (_, s) => (
            <Slot
              key={s}
              pos={pos}
              s={s}
              ring={ring}
              it={all[s % n]}
              active={s === front}
              eager={near}
              onPick={() => { if (moved.current) { moved.current = false; return; } pickSlot(s); }}
            />
          ))}
        </div>
      </div>

      {/* what you can do with the piece in front */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={p.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="mt-7 md:mt-9 mx-auto max-w-[560px] text-center"
          >
            <p className="mx-auto line-clamp-2 min-h-[3.3em] text-umber" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 15.5, lineHeight: 1.65 }}>{blurb(p)}</p>
            <div className="@container mt-5 flex flex-wrap items-stretch justify-center gap-2">
              <InfoTile label="MOQ" value={moq} />
              <InfoTile label="Lead" value={`${productLead(p.id)} days`} />
              <QuoteToggle item={{ id: p.id, name, code: productCode(p.id) || undefined, category: categoryLabel(p.category), moq, url: productShareUrl(p.id), productId: p.id }} className="self-center" />
              <a
                href={`${WHATSAPP}?text=${encodeURIComponent(`Hi INS Overseas, I'm interested in "${name}"${codeSuffix(p.id)}. Please share wholesale pricing and MOQ.\n${productShareUrl(p.id)}`)}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Chat on WhatsApp about ${name}`}
                onClick={() => trackProduct(p.id, "enquire")}
                className={cardSquareBtn}
              >
                <WhatsAppGlyph size={20} />
              </a>
              <a
                href={`mailto:Sezan@ins-overseas.com?subject=${encodeURIComponent(`Enquiry: ${name}${codeSuffix(p.id)}`)}&body=${encodeURIComponent(`Hi INS Overseas team,\r\n\r\nI am interested in ${name}${codeSuffix(p.id)}. Please share more details including pricing and MOQ.\r\n\r\nProduct link: ${productShareUrl(p.id)}\r\n\r\nThank you`)}`}
                onClick={() => trackProduct(p.id, "enquire")}
                aria-label={`Enquire about ${name}`}
                className="shrink-0 inline-flex items-center gap-2 h-11 pl-5 pr-1.5 rounded-full bg-ink text-white hover:bg-umber-dark active:scale-95 transition-[background-color,transform] duration-200 self-center"
                style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14 }}
              >
                Enquire
                <span className="w-8 h-8 rounded-full bg-white text-ink flex items-center justify-center"><ArrowUpRight size={15} /></span>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
