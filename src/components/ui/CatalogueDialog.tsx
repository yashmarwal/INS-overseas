import { useEffect, useMemo, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertCircle, Check, FileDown, Loader2, X } from "lucide-react";
import type { CatalogItem } from "@/lib/catalogPdf";

export type CatalogOption = { key: string; label: string; items: CatalogItem[] };

const pagesFor = (n: number) => (n <= 5 ? 1 : 1 + Math.ceil((n - 5) / 6));

// "Download catalogue (PDF)": pick what to include (everything, one category, or your quote list), see how many products that is,
// and build the PDF on the spot from the products loaded right now. The PDF tools are only fetched when "Download" is pressed.
export default function CatalogueDialog({ open, onClose, options, initialKey, loading = false }: { open: boolean; onClose: () => void; options: CatalogOption[]; initialKey: string; loading?: boolean }) {
  const [choice, setChoice] = useState(initialKey);
  const [photos, setPhotos] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [fraction, setFraction] = useState(0);
  const [error, setError] = useState("");
  const [needsReload, setNeedsReload] = useState(false); // the PDF tools could not be downloaded: the browser remembers that until the page is reloaded
  const [doneName, setDoneName] = useState("");
  const abort = useRef<AbortController | null>(null);

  // each time it opens: start from the page's current filter (or "all"), forget the last run
  useEffect(() => {
    if (!open) return;
    import("jspdf").catch(() => { /* Download will try again and say what went wrong */ }); // the PDF tools download while the visitor picks what to include, so the button is quick
    setChoice(options.some((o) => o.key === initialKey) ? initialKey : "all");
    setError(""); setNeedsReload(false); setDoneName(""); setStatus(""); setFraction(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, loading]);
  // a choice that disappeared (e.g. the quote list was emptied) falls back to "all"
  useEffect(() => { if (!options.some((o) => o.key === choice)) setChoice("all"); }, [options, choice]);

  const current = useMemo(() => options.find((o) => o.key === choice) ?? options[0], [options, choice]);
  const count = current?.items.length ?? 0;

  const close = () => { abort.current?.abort(); setBusy(false); onClose(); };

  const generate = async () => {
    if (!current || busy) return;
    setBusy(true); setError(""); setDoneName(""); setFraction(0.01); setStatus("Starting...");
    const ctl = new AbortController();
    abort.current = ctl;
    try {
      const { buildCatalogPdf, downloadBlob } = await import("@/lib/catalogPdf");
      const r = await buildCatalogPdf(current.items, {
        filterLabel: current.label,
        includePhotos: photos,
        signal: ctl.signal,
        onProgress: (s, f) => { setStatus(s); setFraction(f); },
      });
      downloadBlob(r.blob, r.filename);
      setDoneName(r.filename);
      setStatus(`Downloaded: ${r.pages} page${r.pages === 1 ? "" : "s"}, ${(r.blob.size / 1024 / 1024).toFixed(1)} MB`);
    } catch (e) {
      if ((e as Error)?.name === "AbortError") { setStatus(""); }
      else {
        // the selection stays exactly as it was, so "Try again" is one tap
        const msg = e instanceof Error && e.message ? e.message : "something went wrong";
        setNeedsReload(/dynamically imported module|importing a module script|loading chunk|failed to fetch/i.test(msg));
        setError(msg);
        setStatus("");
      }
    } finally {
      setBusy(false);
      abort.current = null;
    }
  };

  const radio = (on: boolean) => `w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-colors disabled:opacity-60 ${on ? "bg-ink text-white" : "bg-[#F1EEE8] text-ink hover:bg-[#E8E3D8]"}`;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => { if (!o) close(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[110] bg-ink/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed z-[111] inset-x-0 bottom-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-md max-h-[90vh] flex flex-col bg-white rounded-t-[28px] md:rounded-[28px] shadow-2xl pb-[env(safe-area-inset-bottom)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 max-md:data-[state=open]:slide-in-from-bottom max-md:data-[state=closed]:slide-out-to-bottom duration-300"
        >
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-3">
            <div className="min-w-0">
              <DialogPrimitive.Title className="text-ink" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, lineHeight: 1.05 }}>Download catalogue</DialogPrimitive.Title>
              <p className="mt-1.5 text-umber" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, lineHeight: 1.5 }}>A PDF made right now from our current products, so it is always up to date.</p>
            </div>
            <DialogPrimitive.Close aria-label="Close" className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[#F1EEE8] text-ink hover:bg-[#E8E3D8] transition-colors"><X size={18} /></DialogPrimitive.Close>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 px-4 pb-2">
            <p className="px-2 pb-2 text-umber uppercase" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.16em" }} id="cat-choose">What to include</p>
            <div role="radiogroup" aria-labelledby="cat-choose" className="space-y-2">
              {options.map((o) => {
                const on = o.key === choice;
                return (
                  <button key={o.key} type="button" role="radio" aria-checked={on} disabled={busy} onClick={() => { setChoice(o.key); setError(""); setDoneName(""); setStatus(""); }} className={radio(on)} style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 15 }}>
                    <span className="min-w-0 truncate">{o.label}</span>
                    <span className={`shrink-0 text-[13px] tabular-nums lining-nums ${on ? "text-gold-light" : "text-grey-ink"}`}>{o.items.length}</span>
                  </button>
                );
              })}
            </div>

            <label className="mt-4 mx-2 flex items-center gap-3 cursor-pointer select-none" style={{ fontFamily: "var(--font-body)", fontSize: 14 }}>
              <input type="checkbox" checked={photos} disabled={busy} onChange={(e) => setPhotos(e.target.checked)} className="w-5 h-5 accent-[#6B4C2A]" />
              <span><span className="text-ink font-medium">Include product photos</span> <span className="text-grey-ink">(a smaller, faster file without them)</span></span>
            </label>
          </div>

          <div className="px-4 pt-3 pb-5">
            <p className="px-2 mb-2.5 text-ink" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14 }} aria-live="polite" data-testid="cat-count">
              {loading ? "Loading our products..." : count === 0 ? "Nothing to include yet." : `${count} product${count === 1 ? "" : "s"} will be included, about ${pagesFor(count)} page${pagesFor(count) === 1 ? "" : "s"}.`}
            </p>

            {busy && (
              <div className="mb-3 px-2" role="status" aria-live="polite">
                <div className="h-2 rounded-full bg-[#EFEBE3] overflow-hidden"><div className="h-full bg-gold transition-[width] duration-200" style={{ width: `${Math.round(fraction * 100)}%` }} /></div>
                <p className="mt-2 text-[13px] text-umber inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> <span data-testid="cat-status">{status}</span></p>
              </div>
            )}
            {error && !busy && (
              <div role="alert" className="mb-3 mx-2 rounded-xl bg-[#FEF3F2] border border-[#B42318]/25 px-3.5 py-3 text-[13px] text-[#B42318] flex gap-2.5">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>
                  {needsReload
                    ? "The PDF tools could not be downloaded (check your connection). Please reload the page and try again."
                    : `Couldn't make the PDF (${error}). Your choice is kept, so you can try again.`}
                  {needsReload && <> <button type="button" onClick={() => window.location.reload()} className="font-semibold underline underline-offset-2">Reload page</button></>}
                </span>
              </div>
            )}
            {doneName && !busy && (
              <p className="mb-3 mx-2 text-[13px] text-[#1F5A31] inline-flex items-start gap-2" role="status"><Check size={16} className="mt-0.5 shrink-0" /> <span>{status}. <span className="text-grey-ink break-all">{doneName}</span></span></p>
            )}

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => void generate()}
                disabled={busy || loading || count === 0}
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full bg-gold text-ink uppercase hover:bg-gold-light active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-[background-color,transform] duration-200"
                style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, letterSpacing: "0.1em" }}
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={17} />}
                {busy ? "Making your PDF..." : error ? "Try again" : doneName ? "Download again" : "Download PDF"}
              </button>
              {busy && (
                <button type="button" onClick={() => abort.current?.abort()} className="h-12 px-5 rounded-full bg-white text-ink shadow-[inset_0_0_0_1px_rgba(26,20,16,0.25)] hover:bg-[#F1EEE8] uppercase" style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, letterSpacing: "0.1em" }}>Cancel</button>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
