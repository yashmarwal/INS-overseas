import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Mail, ShoppingBag, Trash2, X } from "lucide-react";
import { WhatsAppGlyph } from "@/components/ui/FloatingDock";
import { trackProduct } from "@/lib/track";
import { clearBuyer, clearEnquiry, enquiryMailBody, enquiryMailSubject, enquiryWhatsAppText, removeEnquiry, setBuyerField, setQty, useBuyer, useEnquiryList } from "@/lib/enquiryList";

const WHATSAPP = "https://wa.me/919680478483";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// The floating "Enquiry list" pill (it sits just above the dock, and steps aside while the page scrolls, like the dock does)
// and the sheet it opens: the ticked pieces, remove buttons, and one-tap send by WhatsApp or email.
export default function EnquiryList() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const list = useEnquiryList();
  const buyer = useBuyer();
  const [open, setOpen] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [tip, setTip] = useState(false);
  const prevLen = useRef(0);

  // the first time someone adds a piece, a short hint explains what the list is (shown once, ever)
  useEffect(() => {
    let t = 0;
    if (prevLen.current === 0 && list.length === 1) {
      try {
        if (!localStorage.getItem("ins_quote_tip_seen")) {
          localStorage.setItem("ins_quote_tip_seen", "1");
          setTip(true);
          t = window.setTimeout(() => setTip(false), 7000);
        }
      } catch { /* private mode: no hint */ }
    }
    if (list.length === 0) setTip(false);
    prevLen.current = list.length;
    return () => window.clearTimeout(t);
  }, [list.length]);

  useEffect(() => {
    let last = window.scrollY;
    let idle = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 2) return;
      last = y;
      setTucked(true);
      window.clearTimeout(idle);
      idle = window.setTimeout(() => setTucked(false), 220);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.clearTimeout(idle); };
  }, []);

  // an emptied list closes its own sheet
  useEffect(() => { if (list.length === 0) setOpen(false); }, [list.length]);

  if (pathname.startsWith("/admin")) return null;

  const mail = `mailto:Sezan@ins-overseas.com?subject=${encodeURIComponent(enquiryMailSubject(list, buyer))}&body=${encodeURIComponent(enquiryMailBody(list, buyer))}`;
  const wa = `${WHATSAPP}?text=${encodeURIComponent(enquiryWhatsAppText(list, buyer))}`;
  const input = "w-full h-11 rounded-xl bg-white px-3.5 text-[16px] text-ink placeholder:text-[#8A8076] shadow-[inset_0_0_0_1px_rgba(26,20,16,0.18)] outline-none focus-visible:shadow-[inset_0_0_0_2px_#6B4C2A]";
  const action = "flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full uppercase active:scale-[0.98] transition-[background-color,transform] duration-200";
  const actionStyle = { fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, letterSpacing: "0.1em" } as const;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {list.length > 0 && (
          <motion.div
            key="pill"
            initial={{ opacity: 0, y: 16 }}
            animate={tucked ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ pointerEvents: tucked ? "none" : "auto" }}
            className="fixed z-40 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 bottom-[calc(env(safe-area-inset-bottom)+97px)] md:bottom-[108px]"
          >
            {tip && (
              <button
                type="button"
                onClick={() => setTip(false)}
                className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 w-[260px] text-left rounded-2xl bg-ink text-cream px-4 py-3 shadow-[0_14px_34px_-12px_rgba(26,20,16,0.6)]"
                style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 13, lineHeight: 1.45 }}
              >
                <span className="block text-gold-light" style={{ fontWeight: 600 }}>Added to your quote list</span>
                Add more pieces, then tap this button to send them all in one message and get one quote.
              </button>
            )}
            <DialogPrimitive.Trigger
              className="inline-flex items-center gap-2.5 h-12 pl-4 pr-1.5 rounded-full bg-gold text-ink shadow-[0_12px_30px_-10px_rgba(26,20,16,0.55)] active:scale-95 transition-transform duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ink [-webkit-tap-highlight-color:transparent]"
              style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, letterSpacing: "0.08em" }}
              aria-label={`Open your quote list, ${list.length} piece${list.length === 1 ? "" : "s"}`}
            >
              <ShoppingBag size={17} strokeWidth={1.8} />
              <span className="uppercase">Quote list</span>
              <span className="min-w-9 h-9 px-2 rounded-full bg-ink text-gold flex items-center justify-center tabular-nums lining-nums" style={{ fontSize: 13 }}>{list.length}</span>
            </DialogPrimitive.Trigger>
          </motion.div>
        )}
      </AnimatePresence>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-ink/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed z-[71] inset-x-0 bottom-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-md max-h-[86vh] flex flex-col bg-white rounded-t-[28px] md:rounded-[28px] shadow-2xl pb-[env(safe-area-inset-bottom)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 max-md:data-[state=open]:slide-in-from-bottom max-md:data-[state=closed]:slide-out-to-bottom duration-300"
        >
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
            <div>
              <DialogPrimitive.Title className="text-ink" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, lineHeight: 1.05 }}>Your quote list</DialogPrimitive.Title>
              <p className="mt-1.5 text-umber" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, lineHeight: 1.5 }}>Pick as many pieces as you like, then send them all in one message, each with its link. We reply with pricing, MOQ and samples.</p>
            </div>
            <DialogPrimitive.Close aria-label="Close" className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[#F1EEE8] text-ink hover:bg-[#E8E3D8] transition-colors"><X size={18} /></DialogPrimitive.Close>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
            <ul className="px-4 pb-2 space-y-2">
              {list.map((it) => {
                const minQty = Number(it.moq.match(/\d+/)?.[0] ?? 0);
                const below = !!it.qty && minQty > 0 && Number(it.qty) > 0 && Number(it.qty) < minQty;
                return (
                  <li key={it.id} className="rounded-2xl bg-[#F1EEE8] pl-4 pr-2 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        {it.url ? (
                          <a href={it.url} target="_blank" rel="noreferrer" className="block text-ink truncate hover:underline underline-offset-2" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, lineHeight: 1.15 }}>{it.name}</a>
                        ) : (
                          <p className="text-ink truncate" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, lineHeight: 1.15 }}>{it.name}</p>
                        )}
                        <p className="mt-0.5 text-grey-ink tabular-nums lining-nums" style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 12 }}>{it.category} · MOQ from {it.moq}</p>
                      </div>
                      <button type="button" onClick={() => removeEnquiry(it.id)} aria-label={`Remove ${it.name}`} className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-ink/70 hover:bg-ink/10 hover:text-ink transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-1.5 pr-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <label htmlFor={`qty-${it.id}`} className="text-[12px] text-grey-ink" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>How many?</label>
                      <div className="relative w-32">
                        <input
                          id={`qty-${it.id}`}
                          inputMode="numeric"
                          autoComplete="off"
                          value={it.qty ?? ""}
                          onChange={(e) => setQty(it.id, e.target.value)}
                          placeholder={minQty ? String(minQty) : "Qty"}
                          aria-label={`Quantity of ${it.name} (optional)`}
                          aria-describedby={below ? `qty-hint-${it.id}` : undefined}
                          className="w-full h-10 rounded-xl bg-white pl-3 pr-10 text-[16px] tabular-nums lining-nums text-ink placeholder:text-[#8A8076] shadow-[inset_0_0_0_1px_rgba(26,20,16,0.18)] outline-none focus-visible:shadow-[inset_0_0_0_2px_#6B4C2A]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-grey-ink" aria-hidden>pcs</span>
                      </div>
                      {below && <span id={`qty-hint-${it.id}`} className="text-[12px] text-[#9A5B00]" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>Our minimum is {minQty} pcs</span>}
                    </div>
                  </li>
                );
              })}
            </ul>

            <fieldset className="mx-4 mt-3 mb-3 rounded-2xl border border-black/10 p-4">
              <legend className="px-1 text-umber uppercase" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.16em" }}>Your details <span className="normal-case tracking-normal font-normal text-grey-ink">(optional)</span></legend>
              <div className="grid gap-2.5 sm:grid-cols-2">
                <label className="block"><span className="sr-only">Your name</span>
                  <input value={buyer.name} onChange={(e) => setBuyerField("name", e.target.value)} autoComplete="name" placeholder="Your name" maxLength={60} className={input} /></label>
                <label className="block"><span className="sr-only">Company</span>
                  <input value={buyer.company} onChange={(e) => setBuyerField("company", e.target.value)} autoComplete="organization" placeholder="Company" maxLength={80} className={input} /></label>
                <label className="block sm:col-span-2"><span className="sr-only">Country</span>
                  <input value={buyer.country} onChange={(e) => setBuyerField("country", e.target.value)} autoComplete="country-name" placeholder="Country" maxLength={60} className={input} /></label>
              </div>
              <p className="mt-2.5 text-grey-ink" style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 12, lineHeight: 1.5 }}>
                These go into your message so we can reply properly. They are saved on this device only.{" "}
                {(buyer.name || buyer.company || buyer.country) && <button type="button" onClick={clearBuyer} className="underline underline-offset-2 hover:text-ink">Clear my details</button>}
              </p>
            </fieldset>
          </div>

          <div className="px-4 pt-3 pb-5">
            <p className="mb-2.5 px-1 text-umber uppercase" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.16em" }}>Send your quote request</p>
            <div className="flex gap-2.5">
              <a href={wa} target="_blank" rel="noreferrer" onClick={() => list.forEach((i) => trackProduct(i.productId, "enquire"))} className={`${action} bg-ink text-white hover:bg-umber-dark`} style={actionStyle}>
                <WhatsAppGlyph size={18} /> WhatsApp
              </a>
              <a href={mail} onClick={() => list.forEach((i) => trackProduct(i.productId, "enquire"))} className={`${action} bg-gold text-ink hover:bg-gold-light`} style={actionStyle}>
                <Mail size={17} /> Email
              </a>
            </div>
            <button type="button" onClick={clearEnquiry} className="mt-3 w-full text-center text-umber hover:text-ink uppercase transition-colors" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.16em" }}>Clear list</button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
