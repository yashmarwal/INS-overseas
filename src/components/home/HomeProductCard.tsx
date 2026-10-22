import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { WhatsAppGlyph } from "@/components/ui/FloatingDock";
import { tagLabel } from "@/hooks/useProductImages";
import { moqNumber } from "@/data/catalogue";

// The homepage product card: a soft white card with an inset rounded photo, label chips floating on the photo,
// a row of little info tiles and quick actions, and the name with a single clear "Enquire" button underneath.
// Used by both the "Most Loved" row and the admin-picked "Fresh From The Workshop" section.

const WHATSAPP = "https://wa.me/919680478483";
export const cardTile = "rounded-2xl bg-[#F1EEE8]";
export const cardSquareBtn = `${cardTile} w-10 h-10 @[296px]:w-11 @[296px]:h-11 @[330px]:w-[52px] @[330px]:h-[52px] shrink-0 flex items-center justify-center text-ink hover:bg-[#E8E3D8] active:scale-95 transition-[background-color,transform] duration-200`;
export const cardEnquirePill = "shrink-0 inline-flex items-center gap-2 h-11 pl-4 pr-1.5 rounded-full bg-ink text-white hover:bg-umber-dark active:scale-95 transition-[background-color,transform] duration-200";

/** A small info tile: a tiny label over a bold value. */
export function InfoTile({ label, value, grow = false }: { label: string; value: string; grow?: boolean }) {
  return (
    <div className={`${cardTile} px-2.5 @[296px]:px-3 @[330px]:px-3.5 py-2 flex flex-col justify-center ${grow ? "flex-1 shrink-0" : "items-center shrink-0"}`}>
      <span className="uppercase leading-none" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10, letterSpacing: "0.12em", color: "var(--grey-ink)" }}>{label}</span>
      <span className="mt-1 text-ink tabular-nums lining-nums leading-none whitespace-nowrap text-[14px] @[330px]:text-[15px]" style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}>{value}</span>
    </div>
  );
}

export type HomeCardProps = {
  name: string;
  category: string; // shown label, e.g. "Leather Journals"
  categoryId?: string; // used to look up the minimum order
  tag?: string | null; // "best" | "new"
  /** The photo, e.g. <img className="w-full h-full object-cover"> or <SiteImage …>. It fills the photo panel. */
  image: ReactNode;
};

export default function HomeProductCard({ name, category, categoryId, tag, image }: HomeCardProps) {
  const label = tagLabel(tag);
  const mail = `mailto:Sezan@ins-overseas.com?subject=${encodeURIComponent(`Enquiry: ${name}`)}&body=${encodeURIComponent(`Hi INS Overseas team,\r\n\r\nI am interested in ${name}. Please share more details including pricing and MOQ.\r\n\r\nThank you`)}`;
  const chat = `${WHATSAPP}?text=${encodeURIComponent(`Hi INS Overseas, I'm interested in "${name}". Please share wholesale pricing and MOQ.`)}`;

  return (
    <article className="group h-full flex flex-col rounded-[28px] bg-white p-2.5 border border-ink/[0.06] shadow-[0_22px_44px_-30px_rgba(26,20,16,0.45)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_56px_-30px_rgba(26,20,16,0.5)]">
      {/* photo */}
      <div className="relative aspect-square rounded-[20px] overflow-hidden bg-[#EFEBE3]">
        <div className="absolute inset-0 transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]">{image}</div>
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
          {label && (
            <span
              className={`rounded-full px-3 py-1.5 ${tag === "best" ? "bg-gold text-ink" : "bg-ink text-white"}`}
              style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12 }}
            >
              {label}
            </span>
          )}
          <span className="max-w-full truncate rounded-full bg-white/90 text-ink px-3 py-1.5" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12 }}>
            {category}
          </span>
        </div>
      </div>

      {/* info tiles + quick actions */}
      <div className="@container mt-2.5">
       <div className="flex items-stretch gap-1.5 @[296px]:gap-2">
        <InfoTile label="MOQ" value={`${moqNumber(categoryId)}+ pcs`} grow />
        <InfoTile label="Lead" value="30 days" />
        <a href={chat} target="_blank" rel="noreferrer" aria-label={`Chat on WhatsApp about ${name}`} className={cardSquareBtn}>
          <WhatsAppGlyph size={20} />
        </a>
        <Link to="/products" aria-label="See the full catalogue" className={`${cardSquareBtn} @max-[259px]:hidden`}>
          <ShoppingBag size={19} strokeWidth={1.7} />
        </Link>
       </div>
      </div>

      {/* name + enquire */}
      <div className="mt-auto pt-3 px-1.5 pb-1.5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="uppercase" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10.5, letterSpacing: "0.16em", color: "var(--grey-ink)" }}>INS Overseas</p>
          <h3 className="mt-1 text-ink line-clamp-2" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 21, lineHeight: 1.12, letterSpacing: "-0.005em" }}>{name}</h3>
        </div>
        <a
          href={mail}
          aria-label={`Enquire about ${name}`}
          className={cardEnquirePill}
          style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13 }}
        >
          Enquire
          <span className="w-8 h-8 rounded-full bg-white text-ink flex items-center justify-center"><ArrowUpRight size={15} /></span>
        </a>
      </div>
    </article>
  );
}
