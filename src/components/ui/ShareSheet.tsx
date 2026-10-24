import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, Copy, Mail, Share2, X } from "lucide-react";
import { WhatsAppGlyph } from "@/components/ui/FloatingDock";
import { copyText, productShareUrl, shareCopy } from "@/lib/share";

export type ShareProduct = { id: string; name: string; category: string; image: string };

// "Share this product": a sheet with the product's own link and one-tap Copy / WhatsApp / Email (and the phone's own share
// menu where there is one). Opening the link lands on the Products page with exactly this product's details open.
export default function ShareSheet({ product, onClose, onShared }: { product: ShareProduct | null; onClose: () => void; onShared?: (productId: string) => void }) {
  const [copied, setCopied] = useState(false);
  const [selected, setSelected] = useState(false); // copy was blocked: the link is selected instead, ready for Ctrl+C / long-press
  const timer = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { setCopied(false); setSelected(false); window.clearTimeout(timer.current); }, [product?.id]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const url = product ? productShareUrl(product.id) : "";
  const txt = product ? shareCopy(product.name, url) : null;
  const canNative = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const doCopy = async () => {
    // the Clipboard API first; if the browser blocks it, copy from the visible field; if even that fails, leave it selected
    let ok = await copyText(url);
    if (!ok && input.current) {
      input.current.focus();
      input.current.select();
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      if (!ok) { setSelected(true); return; }
    }
    if (!ok) return;
    setSelected(false);
    setCopied(true);
    if (product) onShared?.(product.id);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };
  const doNative = async () => {
    if (!product) return;
    try { await navigator.share({ title: product.name, text: `${product.name} — INS Overseas`, url }); onShared?.(product.id); } catch { /* cancelled */ }
  };

  const action = "flex-1 min-w-[96px] inline-flex items-center justify-center gap-2 h-12 rounded-full uppercase active:scale-[0.98] transition-[background-color,transform] duration-200";
  const actionStyle = { fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, letterSpacing: "0.1em" } as const;

  return (
    <DialogPrimitive.Root open={!!product} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[110] bg-ink/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed z-[111] inset-x-0 bottom-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-t-[28px] md:rounded-[28px] shadow-2xl pb-[env(safe-area-inset-bottom)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 max-md:data-[state=open]:slide-in-from-bottom max-md:data-[state=closed]:slide-out-to-bottom duration-300"
        >
          {product && txt && (
            <>
              <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
                <div className="min-w-0">
                  <DialogPrimitive.Title className="text-ink" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, lineHeight: 1.05 }}>Share this product</DialogPrimitive.Title>
                  <p className="mt-1.5 text-umber" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, lineHeight: 1.5 }}>The link opens this exact product, not the whole catalogue.</p>
                </div>
                <DialogPrimitive.Close aria-label="Close" className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[#F1EEE8] text-ink hover:bg-[#E8E3D8] transition-colors"><X size={18} /></DialogPrimitive.Close>
              </div>

              <div className="mx-4 flex items-center gap-3 rounded-2xl bg-[#F1EEE8] p-2.5">
                <img src={product.image} alt="" className="w-14 h-14 rounded-xl object-cover bg-[#EFEBE3] shrink-0" />
                <p className="min-w-0 text-ink line-clamp-2" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, lineHeight: 1.15 }}>{product.name}</p>
              </div>

              <div className="mx-4 mt-3 flex items-center gap-2">
                <input
                  ref={input}
                  readOnly
                  value={url}
                  aria-label="Product link"
                  onFocus={(e) => e.currentTarget.select()}
                  className="min-w-0 flex-1 h-12 rounded-full bg-white px-4 text-ink shadow-[inset_0_0_0_1px_rgba(26,20,16,0.18)] outline-none focus-visible:shadow-[inset_0_0_0_2px_#6B4C2A]"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 13 }}
                />
                <button
                  type="button"
                  onClick={doCopy}
                  className={`shrink-0 h-12 px-5 rounded-full inline-flex items-center gap-2 active:scale-95 transition-[background-color,color,transform] duration-200 ${copied ? "bg-ink text-gold" : "bg-gold text-ink hover:bg-gold-light"}`}
                  style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, letterSpacing: "0.08em" }}
                >
                  {copied ? <Check size={16} strokeWidth={2.2} /> : <Copy size={15} />}
                  <span className="uppercase">{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className={selected ? "mx-6 mt-2 text-umber" : "sr-only"} style={selected ? { fontFamily: "var(--font-body)", fontSize: 13 } : undefined} aria-live="polite">
                {copied ? "Link copied" : selected ? "Link selected. Press Ctrl+C (or long-press) to copy it." : ""}
              </p>

              <div className="px-4 pt-3 pb-6 flex flex-wrap gap-2.5">
                <a href={`https://wa.me/?text=${encodeURIComponent(txt.whatsapp)}`} target="_blank" rel="noreferrer" onClick={() => onShared?.(product.id)} className={`${action} bg-ink text-white hover:bg-umber-dark`} style={actionStyle}>
                  <WhatsAppGlyph size={18} /> WhatsApp
                </a>
                <a href={`mailto:?subject=${encodeURIComponent(txt.mailSubject)}&body=${encodeURIComponent(txt.mailBody)}`} onClick={() => onShared?.(product.id)} className={`${action} bg-white text-ink shadow-[inset_0_0_0_1px_rgba(26,20,16,0.25)] hover:bg-[#F1EEE8]`} style={actionStyle}>
                  <Mail size={17} /> Email
                </a>
                {canNative && (
                  <button type="button" onClick={doNative} className={`${action} bg-white text-ink shadow-[inset_0_0_0_1px_rgba(26,20,16,0.25)] hover:bg-[#F1EEE8]`} style={actionStyle}>
                    <Share2 size={16} /> More
                  </button>
                )}
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
