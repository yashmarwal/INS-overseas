import { useEffect, useRef, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle, Eye, Info, RotateCcw, Upload, X } from "lucide-react";

// Small, calm UI kit for the admin. Plain words, big targets, high contrast (all text AA or better).

export const MUTED = "#655A4C"; // 6.4:1 on white
const PRIMARY = "#6B4C2A"; // 7.9:1 with white text

export function Spinner({ light = false }: { light?: boolean }) {
  return (
    <span
      aria-hidden
      className="inline-block w-4 h-4 rounded-full animate-spin shrink-0"
      style={{ border: `2px solid ${light ? "rgba(255,255,255,0.35)" : "rgba(107,76,42,0.25)"}`, borderTopColor: light ? "#fff" : PRIMARY }}
    />
  );
}

// ── Buttons ─────────────────────────────────────────────────────────────────────
export function PrimaryButton({ children, onClick, disabled, busy, className = "", type = "button" }: { children: ReactNode; onClick?: () => void; disabled?: boolean; busy?: boolean; className?: string; type?: "button" | "submit" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || busy}
      className={`inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-[14px] font-medium text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#4A3219] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6B4C2A] ${className}`}
      style={{ background: PRIMARY }}
    >
      {busy && <Spinner light />}
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, danger = false, className = "" }: { children: ReactNode; onClick?: () => void; danger?: boolean; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-[14px] font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        danger
          ? "border-[#B42318]/40 text-[#B42318] hover:bg-[#B42318]/5 focus-visible:ring-[#B42318]"
          : "border-black/15 text-[#1A1410] hover:bg-black/[0.04] focus-visible:ring-[#6B4C2A]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

// ── Page chrome ─────────────────────────────────────────────────────────────────
export function SectionHeader({ title, description, right }: { title: string; description: string; right?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div className="max-w-2xl">
        <h1 className="text-[#1A1410]" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(28px, 4vw, 36px)", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
          {title}
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed" style={{ color: MUTED }}>{description}</p>
      </div>
      {right}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl border border-black/10 shadow-[0_1px_2px_rgba(26,20,16,0.04)] ${className}`}>{children}</div>;
}

export function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-xl bg-[#F3EEE2] px-3.5 py-3 text-[13px] leading-snug" style={{ color: "#4A3219" }}>
      <Info size={16} className="shrink-0 mt-px" aria-hidden />
      <div>{children}</div>
    </div>
  );
}

// ── Toast ───────────────────────────────────────────────────────────────────────
export type ToastState = { type: "success" | "error"; msg: string } | null;
export function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  if (!toast) return null;
  const ok = toast.type === "success";
  return (
    <div className="fixed z-[120] inset-x-4 bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-sm" role="status" aria-live="polite">
      <div
        className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[0_12px_40px_-8px_rgba(26,20,16,0.35)] border-l-4"
        style={{ borderLeftColor: ok ? "#2F6B3F" : "#B42318" }}
      >
        {ok ? <CheckCircle size={20} className="shrink-0 mt-0.5" style={{ color: "#2F6B3F" }} /> : <AlertCircle size={20} className="shrink-0 mt-0.5" style={{ color: "#B42318" }} />}
        <p className="flex-1 text-[14px] leading-snug text-[#1A1410]">{toast.msg}</p>
        <button onClick={onClose} aria-label="Dismiss message" className="shrink-0 -mr-1 w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/5" style={{ color: MUTED }}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Confirm dialog (replaces the browser's confirm() pop-up) ────────────────────
export type Confirm = { title: string; message: string; confirmLabel: string; onConfirm: () => void } | null;
export function ConfirmDialog({ confirm, onClose }: { confirm: Confirm; onClose: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!confirm) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirm, onClose]);
  if (!confirm) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-[#1A1410]/50 p-4" onClick={onClose}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 id="confirm-title" className="text-[#1A1410]" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24 }}>{confirm.title}</h2>
        <p className="mt-2 text-[14px] leading-relaxed" style={{ color: MUTED }}>{confirm.message}</p>
        <div className="mt-6 flex gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center h-11 px-4 rounded-xl text-[14px] font-medium border border-black/15 text-[#1A1410] hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6B4C2A]"
          >
            Keep it
          </button>
          <button
            type="button"
            onClick={() => { confirm.onConfirm(); onClose(); }}
            className="flex-1 inline-flex items-center justify-center h-11 px-4 rounded-xl text-[14px] font-medium text-white hover:bg-[#8F1C12] transition-colors"
            style={{ background: "#B42318" }}
          >
            {confirm.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Photo card: used for the banner and the homepage photos ─────────────────────
export function MediaCard(props: {
  title: string;
  where: string;
  tip?: string;
  url: string;
  isCustom: boolean;
  busy: boolean;
  accept: string;
  aspect: string;
  limitText: string;
  viewHref?: string;
  onFile: (f: File) => void;
  onReset: () => void;
  onPreview: () => void;
  big?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <Panel className="overflow-hidden flex flex-col">
      <button
        type="button"
        onClick={props.onPreview}
        aria-label={`Preview ${props.title}`}
        className="group relative block w-full bg-[#EFEBE3] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6B4C2A]"
        style={{ aspectRatio: props.aspect }}
      >
        <img src={props.url} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${props.isCustom ? "bg-[#2F6B3F] text-white" : "bg-white text-[#1A1410] shadow-sm"}`}
        >
          {props.isCustom ? <><CheckCircle size={12} /> Your photo</> : "Default photo"}
        </span>
        <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden>
          <Eye size={16} className="text-[#1A1410]" />
        </span>
      </button>

      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-[#1A1410] text-[16px] font-semibold leading-snug">{props.title}</h3>
          <p className="mt-0.5 text-[13px] leading-snug" style={{ color: MUTED }}>{props.where}</p>
        </div>
        {props.tip && <Tip>{props.tip}</Tip>}
        <p className="text-[12px]" style={{ color: MUTED }}>{props.limitText}</p>

        <div className="mt-auto flex flex-col gap-2 pt-1">
          <PrimaryButton onClick={() => input.current?.click()} busy={props.busy} disabled={props.busy} className="w-full">
            {!props.busy && <Upload size={16} />}
            {props.busy ? "Uploading…" : props.isCustom ? "Replace photo" : "Upload a photo"}
          </PrimaryButton>
          <div className="flex items-center justify-between gap-2">
            {props.isCustom ? (
              <button type="button" onClick={props.onReset} className="inline-flex items-center gap-1.5 min-h-[44px] -ml-1 pr-2 pl-1 text-[13px] font-medium text-[#B42318] hover:underline">
                <RotateCcw size={14} /> Use default photo
              </button>
            ) : <span />}
            {props.viewHref && (
              <a href={props.viewHref} target="_blank" rel="noreferrer" className="inline-flex items-center min-h-[44px] pl-2 pr-1 text-[13px] font-medium hover:underline" style={{ color: "#4A3219" }}>
                See on website ↗
              </a>
            )}
          </div>
        </div>
        <input
          ref={input}
          type="file"
          accept={props.accept}
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) props.onFile(f); e.target.value = ""; }}
        />
      </div>
    </Panel>
  );
}

// ── Drop zone: big, obvious, works with click, keyboard and drag-and-drop ───────
export function DropZone(props: { title: string; hint: string; accept: string; busy: boolean; progress?: string; onFiles: (files: File[]) => void; multiple?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={props.title}
      onClick={() => !props.busy && input.current?.click()}
      onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !props.busy) { e.preventDefault(); input.current?.click(); } }}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); if (!props.busy && e.dataTransfer.files.length) props.onFiles(Array.from(e.dataTransfer.files)); }}
      className={`rounded-2xl border-2 border-dashed px-5 py-9 text-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6B4C2A] ${
        over ? "border-[#6B4C2A] bg-[#F3EEE2]" : "border-[#6B4C2A]/35 bg-white hover:bg-[#FBF9F4] hover:border-[#6B4C2A]/60"
      } ${props.busy ? "cursor-wait" : ""}`}
    >
      {props.busy ? (
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block w-9 h-9 rounded-full animate-spin" style={{ border: "3px solid rgba(107,76,42,0.2)", borderTopColor: PRIMARY }} />
          <p className="text-[15px] font-medium text-[#1A1410]">{props.progress || "Uploading…"}</p>
          <p className="text-[13px]" style={{ color: MUTED }}>Please keep this page open.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <span className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#F3EEE2", color: PRIMARY }}>
            <Upload size={22} />
          </span>
          <p className="text-[16px] font-semibold text-[#1A1410]">{props.title}</p>
          <p className="text-[13px] max-w-md" style={{ color: MUTED }}>{props.hint}</p>
        </div>
      )}
      <input
        ref={input}
        type="file"
        accept={props.accept}
        multiple={props.multiple}
        className="hidden"
        onChange={(e) => { const picked = Array.from(e.target.files ?? []); e.target.value = ""; if (picked.length) props.onFiles(picked); }}
      />
    </div>
  );
}

export function EmptyState({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-black/15 bg-white/60 px-6 py-12 text-center">
      <p className="text-[16px] font-semibold text-[#1A1410]">{title}</p>
      <p className="mt-1 text-[14px] max-w-sm mx-auto" style={{ color: MUTED }}>{text}</p>
      {children && <div className="mt-4 flex justify-center">{children}</div>}
    </div>
  );
}
