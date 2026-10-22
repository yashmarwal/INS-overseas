import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { WhatsAppGlyph } from "@/components/ui/FloatingDock";
import { cardEnquirePill, cardSquareBtn, InfoTile } from "@/components/home/HomeProductCard";

// Cards that stack as you scroll: each one pins under the header while the next slides up over it, and the ones
// underneath settle back a little. Only transform is animated (a scroll-linked scale), so it stays jitter-free; the
// pinning itself is plain CSS `position: sticky`. Used by the collections and by the products picked in the admin.

const STEP = 16; // px each card sits lower than the one beneath it, so the stack's edges peek out

const RUN_UP = 40;

/**
 * Put `ref` on the element that holds all the cards, hand `progress` to every <StackPin>, and give that element
 * a <StackTail hold={hold} /> after the last card. `hold` is how far the LAST card stays pinned, like every other card, while whatever comes
 * next on the page slides up over it. Give the section `marginBottom: -hold` and the next section a higher z-index,
 * and there is no empty gap: the next section simply takes the place of a fifth card.
 */
export function useStack() {
  const ref = useRef<HTMLDivElement>(null);
  const [hold, setHold] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const cards = el.querySelectorAll<HTMLElement>("[data-stack-card]");
      const last = cards[cards.length - 1];
      setHold(last ? last.offsetHeight + RUN_UP : 0);
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, progress: scrollYProgress, hold };
}

/** The extra scroll room that keeps the last card pinned. (It has to be a real child: padding would not extend a sticky card's range.) */
export function StackTail({ hold }: { hold: number }) {
  return <div aria-hidden style={{ height: hold }} />;
}

/**
 * The pin around one card. Each pin is exactly as tall as its card plus a small run-up, so the next card is already
 * peeking in just below while this one is pinned: no big empty stretch between cards. (Scroll distance per card =
 * card height + RUN_UP.) The last card is only as tall as itself; the extra pinned time it needs comes from the list's
 * `hold` padding (see useStack), which the next section overlaps.
 */
export function StackPin({ i, n, progress, children }: { i: number; n: number; progress: MotionValue<number>; children: ReactNode }) {
  const reduce = useReducedMotion();
  const card = useRef<HTMLDivElement>(null);
  const [cardH, setCardH] = useState(0);
  // measure the card (its layout height, unaffected by the scale animation) and keep up if it changes size
  useLayoutEffect(() => {
    const el = card.current;
    if (!el) return;
    const read = () => setCardH(el.offsetHeight);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // the deeper a card ends up in the stack, the smaller it settles
  const last = i === n - 1;
  // (the last one settles a touch too, as the next section comes up over it)
  const scale = useTransform(progress, [i / n, 1], [1, reduce ? 1 : last ? 0.97 : 1 - (n - 1 - i) * 0.04]);
  return (
    <div
      className="sticky top-0 flex items-start justify-center"
      style={{ height: last || !cardH ? undefined : cardH + RUN_UP, paddingTop: "calc(var(--nav-h, 64px) + 14px)", paddingBottom: last ? i * STEP + 12 : undefined }}
    >
      <motion.div ref={card} data-stack-card style={{ scale, top: i * STEP, transformOrigin: "50% 0%" }} className="relative w-full max-w-[1040px] will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

export type StackedCardProps = {
  index: number;
  total: number;
  photo: ReactNode; // fills the photo panel
  photoTo?: string; // makes the photo a link
  pill: string; // light chip next to the counter, e.g. "Collection" or the product's category
  tag?: { label: string; gold: boolean } | null; // optional dark/gold chip, e.g. "Best seller"
  title: string;
  desc: string;
  moqLabel?: string; // defaults to "MOQ"
  moqValue: string; // e.g. "200+ pcs"
  chatHref: string;
  chatLabel: string;
  secondary: { to: string; label: string; icon: ReactNode };
  primary: { label: string; to?: string; href?: string };
};

export function StackedCard({ index, total, photo, photoTo, pill, tag, title, desc, moqLabel = "MOQ", moqValue, chatHref, chatLabel, secondary, primary }: StackedCardProps) {
  const pillCls = "rounded-full px-3 py-1.5";
  const photoCls = "group relative block aspect-[4/3] md:aspect-auto md:min-h-[420px] rounded-[20px] overflow-hidden bg-[#EFEBE3]";
  const photoInner = (
    <>
      <div className="absolute inset-0 transition-transform duration-[1800ms] ease-out group-hover:scale-[1.05]">{photo}</div>
      <span className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
        <span className={`${pillCls} bg-ink text-white tabular-nums lining-nums`} style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12 }}>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {tag && (
          <span className={`${pillCls} ${tag.gold ? "bg-gold text-ink" : "bg-ink text-white"}`} style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12 }}>{tag.label}</span>
        )}
        <span className={`${pillCls} max-w-full truncate bg-white/90 text-ink`} style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12 }}>{pill}</span>
      </span>
    </>
  );
  const primaryCls = `${cardEnquirePill} mt-3 w-full justify-between pl-5`;
  const primaryStyle = { fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14 } as const;
  const primaryInner = (
    <>
      {primary.label}
      <span className="w-8 h-8 rounded-full bg-white text-ink flex items-center justify-center"><ArrowRight size={15} /></span>
    </>
  );

  return (
    <article className="grid md:grid-cols-[1.12fr_1fr] gap-2.5 md:gap-5 rounded-[28px] bg-white p-2.5 border border-ink/[0.06] shadow-[0_-8px_24px_-18px_rgba(26,20,16,0.45),0_30px_60px_-30px_rgba(26,20,16,0.45)]">
      {photoTo ? (
        <Link to={photoTo} aria-label={`Explore ${title}`} className={photoCls}>{photoInner}</Link>
      ) : (
        <div className={photoCls}>{photoInner}</div>
      )}

      <div className="flex flex-col px-1.5 pb-1.5 md:py-6 md:pr-5">
        <p className="uppercase" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10.5, letterSpacing: "0.16em", color: "var(--grey-ink)" }}>INS Overseas</p>
        <h3 className="mt-1.5 text-ink line-clamp-3" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(28px, 3.4vw, 44px)", lineHeight: 1.06, letterSpacing: "-0.01em" }}>{title}</h3>
        <p className="mt-2.5 md:mt-3.5 line-clamp-3" style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 15, lineHeight: 1.55, color: "var(--grey-ink)" }}>{desc}</p>

        <div className="mt-4 md:mt-auto md:pt-6">
          <div className="flex items-stretch gap-2">
            <InfoTile label={moqLabel} value={moqValue} grow />
            <InfoTile label="Lead" value="30 days" />
            <a href={chatHref} target="_blank" rel="noreferrer" aria-label={chatLabel} className={cardSquareBtn}>
              <WhatsAppGlyph size={20} />
            </a>
            <Link to={secondary.to} aria-label={secondary.label} className={`${cardSquareBtn} hidden sm:flex`}>
              {secondary.icon}
            </Link>
          </div>
          {primary.to ? (
            <Link to={primary.to} className={primaryCls} style={primaryStyle}>{primaryInner}</Link>
          ) : (
            <a href={primary.href} className={primaryCls} style={primaryStyle} aria-label={primary.label}>{primaryInner}</a>
          )}
        </div>
      </div>
    </article>
  );
}
