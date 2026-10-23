import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Mail, ShoppingBag, Trash2, X } from "lucide-react";
import { WhatsAppGlyph } from "@/components/ui/FloatingDock";
import { clearEnquiry, enquiryMailBody, enquiryWhatsAppText, removeEnquiry, useEnquiryList } from "@/lib/enquiryList";

const WHATSAPP = "https://wa.me/919680478483";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// The floating "Enquiry list" pill (it sits just above the dock, and steps aside while the page scrolls, like the dock does)
// and the sheet it opens: the ticked pieces, remove buttons, and one-tap send by WhatsApp or email.
export default function EnquiryList() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const list = useEnquiryList();
  const [open, setOpen] = useState(false);
  const [tucked, setTucked] = useState(false);

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

  const mail = `mailto:Sezan@ins-overseas.com?subject=${encodeURIComponent(`Enquiry: ${list.length} piece${list.length === 1 ? "" : "s"}`)}&body=${encodeURIComponent(enquiryMailBody(list))}`;
  const wa = `${WHATSAPP}?text=${encodeURIComponent(enquiryWhatsAppText(list))}`;
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
            className="fixed z-40 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 bottom-[calc(env(safe-area-inset-bottom)+92px)] md:bottom-[92px]"
          >
            <DialogPrimitive.Trigger
              className="inline-flex items-center gap-2.5 h-12 pl-4 pr-1.5 rounded-full bg-gold text-ink shadow-[0_12px_30px_-10px_rgba(26,20,16,0.55)] active:scale-95 transition-transform duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ink [-webkit-tap-highlight-color:transparent]"
              style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, letterSpacing: "0.08em" }}
              aria-label={`Open your enquiry list, ${list.length} piece${list.length === 1 ? "" : "s"}`}
            >
              <ShoppingBag size={17} strokeWidth={1.8} />
              <span className="uppercase">Enquiry list</span>
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
              <DialogPrimitive.Title className="text-ink" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, lineHeight: 1.05 }}>Your enquiry list</DialogPrimitive.Title>
              <p className="mt-1.5 text-umber" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, lineHeight: 1.5 }}>One message for everything you have picked. We reply with pricing, MOQ and samples.</p>
            </div>
            <DialogPrimitive.Close aria-label="Close" className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[#F1EEE8] text-ink hover:bg-[#E8E3D8] transition-colors"><X size={18} /></DialogPrimitive.Close>
          </div>

          <ul className="flex-1 overflow-y-auto overscroll-contain px-4 pb-2 space-y-2">
            {list.map((it) => (
              <li key={it.id} className="flex items-center gap-3 rounded-2xl bg-[#F1EEE8] pl-4 pr-2 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-ink truncate" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, lineHeight: 1.15 }}>{it.name}</p>
                  <p className="mt-0.5 text-grey-ink tabular-nums lining-nums" style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 12 }}>{it.category} · MOQ from {it.moq}</p>
                </div>
                <button type="button" onClick={() => removeEnquiry(it.id)} aria-label={`Remove ${it.name}`} className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-ink/70 hover:bg-ink/10 hover:text-ink transition-colors">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>

          <div className="px-4 pt-3 pb-5">
            <div className="flex gap-2.5">
              <a href={wa} target="_blank" rel="noreferrer" className={`${action} bg-ink text-white hover:bg-umber-dark`} style={actionStyle}>
                <WhatsAppGlyph size={18} /> WhatsApp
              </a>
              <a href={mail} className={`${action} bg-gold text-ink hover:bg-gold-light`} style={actionStyle}>
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
