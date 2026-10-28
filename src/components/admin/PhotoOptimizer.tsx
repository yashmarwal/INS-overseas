import { useEffect, useRef, useState } from "react";
import { Check, Loader2, RotateCcw, X } from "lucide-react";
import { applyPlan, inParallel, listBackups, MIN_PSNR, planPhoto, restorePhoto, type Plan, type PhotoRef } from "@/lib/optimizePhotos";
import { GhostButton, MUTED, PrimaryButton } from "@/components/admin/AdminUI";

type Stage = "idle" | "checking" | "ready" | "applying" | "done" | "restoring";
const MB = (n: number) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

// "Make photos lighter": check what it would save (changes nothing), try it on 3 photos, then do the rest. Originals are saved first.
export default function PhotoOptimizer({ photos, onClose, showToast }: { photos: PhotoRef[]; onClose: () => void; showToast: (t: "success" | "error", m: string) => void }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [progress, setProgress] = useState({ n: 0, of: 0 });
  const [scope, setScope] = useState<"test" | "all">("test");
  const [failures, setFailures] = useState<{ name: string; msg: string }[]>([]);
  const [saved, setSaved] = useState(0); // bytes saved by the last run
  const [replaced, setReplaced] = useState(0);
  const [backups, setBackups] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const stop = useRef(false);

  useEffect(() => {
    void listBackups().then((l) => setBackups(l.length)).catch(() => setBackups(0));
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && stage !== "applying" && stage !== "restoring") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, stage]);

  const check = async () => {
    stop.current = false; setStage("checking"); setFailures([]); setNote(""); setProgress({ n: 0, of: photos.length });
    let n = 0;
    const out = await inParallel(photos, 4, async (p) => { const r = await planPhoto(p); setProgress({ n: ++n, of: photos.length }); return r; }, () => stop.current);
    const ok = out.filter((r): r is Plan => !!r && !(r instanceof Error));
    setFailures(out.flatMap((r, i) => (r instanceof Error ? [{ name: photos[i].name, msg: r.message }] : [])));
    setPlans(ok);
    setStage("ready");
  };

  const toReplace = plans.filter((p) => p.action === "replace");
  const chosen = scope === "test" ? toReplace.slice(0, 3) : toReplace;
  const before = toReplace.reduce((s, p) => s + p.before, 0), after = toReplace.reduce((s, p) => s + p.after, 0);
  const total = plans.reduce((s, p) => s + p.before, 0);
  const lowest = toReplace.length ? Math.min(...toReplace.map((p) => p.psnr)) : 0;
  const kept = plans.filter((p) => p.action === "keep");
  const alreadyLight = kept.filter((p) => p.reason === "already light").length;
  const notSame = kept.filter((p) => p.reason.startsWith("would not look identical")).length;
  const otherKept = kept.length - alreadyLight - notSame;

  const apply = async () => {
    stop.current = false; setStage("applying"); setFailures([]); setProgress({ n: 0, of: chosen.length });
    let n = 0;
    const out = await inParallel(chosen, 3, async (p) => { await applyPlan(p); setProgress({ n: ++n, of: chosen.length }); return p; }, () => stop.current);
    const done = out.filter((r): r is Plan => !!r && !(r instanceof Error));
    setFailures(out.flatMap((r, i) => (r instanceof Error ? [{ name: chosen[i].ref.name, msg: r.message }] : [])));
    setReplaced(done.length);
    setSaved(done.reduce((s, p) => s + (p.before - p.after), 0));
    setPlans([]);
    setStage("done");
    void listBackups().then((l) => setBackups(l.length)).catch(() => undefined);
    if (done.length) showToast("success", `${done.length} photo${done.length === 1 ? "" : "s"} made lighter.`);
  };

  const restore = async () => {
    stop.current = false; setStage("restoring"); setFailures([]); setNote("");
    const names = await listBackups().catch(() => [] as string[]);
    setProgress({ n: 0, of: names.length });
    let n = 0;
    const out = await inParallel(names, 3, async (name) => { await restorePhoto(name); setProgress({ n: ++n, of: names.length }); return name; }, () => stop.current);
    setFailures(out.flatMap((r, i) => (r instanceof Error ? [{ name: names[i], msg: r.message }] : [])));
    setNote(`${out.filter((r) => !(r instanceof Error)).length} of ${names.length} original photos were put back.`);
    setPlans([]); setStage("done"); setReplaced(0); setSaved(0);
  };

  const busy = stage === "checking" || stage === "applying" || stage === "restoring";
  const pct = progress.of ? Math.round((progress.n / progress.of) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-[#1A1410]/50 p-0 sm:p-4" onClick={() => { if (!busy) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="opt-title" onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <h2 id="opt-title" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24 }}>Make photos lighter</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed" style={{ color: MUTED }}>
              Your {photos.length} product photos can be saved in a lighter format so the website loads faster. Each photo is compared with its original: any that would look even slightly different, or would not get at least 10% lighter, is left exactly as it is. <b>Your original photos are saved first</b>, and you can put them all back at any time. Nothing else on the site changes.
            </p>
          </div>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Close" className="w-10 h-10 rounded-full hover:bg-black/[0.05] flex items-center justify-center shrink-0 disabled:opacity-40"><X size={18} /></button>
        </div>

        {busy && (
          <div className="mt-5" role="status" aria-live="polite">
            <div className="h-2 rounded-full bg-[#EFEBE3] overflow-hidden"><div className="h-full bg-[#C9973A] transition-[width] duration-200" style={{ width: `${pct}%` }} /></div>
            <p className="mt-2 text-[14px] inline-flex items-center gap-2" data-testid="opt-status"><Loader2 size={15} className="animate-spin" />
              {stage === "checking" ? "Looking at photo" : stage === "applying" ? "Making photo" : "Putting back photo"} {Math.min(progress.n + 1, progress.of)} of {progress.of}…
            </p>
            <GhostButton onClick={() => { stop.current = true; }} className="mt-3">Stop</GhostButton>
          </div>
        )}

        {stage === "idle" && (
          <div className="mt-5">
            <PrimaryButton onClick={() => void check()}>Check what it would save</PrimaryButton>
            <p className="mt-2 text-[13px]" style={{ color: MUTED }}>This only looks at the photos. It changes nothing.</p>
          </div>
        )}

        {stage === "ready" && (
          <div className="mt-5 space-y-4">
            <p className="rounded-xl bg-[#F6F3EC] px-4 py-3 text-[14.5px] leading-relaxed" data-testid="opt-summary">
              {toReplace.length === 0
                ? <>Nothing to change: all {plans.length} photos are already light (about {MB(total)} in total).</>
                : <><b>{toReplace.length} of {plans.length}</b> photos can be made lighter: <b>{MB(before)} → {MB(after)}</b> (about {Math.round(100 - (100 * after) / before)}% less for those photos). The other {kept.length} stay exactly as they are{kept.length ? <> ({[alreadyLight ? `${alreadyLight} already light` : "", notSame ? `${notSame} would not look identical` : "", otherKept ? `${otherKept} not a photo this tool handles` : ""].filter(Boolean).join(", ")})</> : null}. The closest comparison with an original is {lowest.toFixed(1)} dB (above {MIN_PSNR} dB is the floor we accept; above 40 dB is invisible).</>}
            </p>
            {toReplace.length > 0 && (
              <fieldset className="space-y-2">
                <legend className="text-[14px] font-semibold">Which photos?</legend>
                {([["test", `Try it on ${Math.min(3, toReplace.length)} photo${Math.min(3, toReplace.length) === 1 ? "" : "s"} first (recommended)`], ["all", `All ${toReplace.length} photos`]] as const).map(([v, label]) => (
                  <label key={v} className="flex items-center gap-3 rounded-xl border border-black/15 p-3 cursor-pointer hover:bg-[#FBF9F4]">
                    <input type="radio" name="opt-scope" checked={scope === v} onChange={() => setScope(v)} className="w-5 h-5 accent-[#6B4C2A]" />
                    <span className="text-[14px] font-medium">{label}</span>
                  </label>
                ))}
              </fieldset>
            )}
            <div className="flex flex-wrap gap-3">
              {toReplace.length > 0 && <PrimaryButton onClick={() => void apply()}>Make {chosen.length} photo{chosen.length === 1 ? "" : "s"} lighter</PrimaryButton>}
              <GhostButton onClick={() => setStage("idle")}>Back</GhostButton>
            </div>
          </div>
        )}

        {stage === "done" && (
          <div className="mt-5 space-y-3" role="status" data-testid="opt-done">
            {replaced > 0 && (
              <p className="rounded-xl bg-[#EEF7EF] border border-[#1F5A31]/25 px-4 py-3 text-[14.5px] leading-relaxed text-[#1F5A31] inline-flex gap-2"><Check size={17} className="mt-0.5 shrink-0" />
                <span><b>{replaced} photo{replaced === 1 ? "" : "s"} made lighter</b>, saving {MB(saved)}. Refresh your website to see them. If you tried 3 first, open the website, check those products look right (and share one of their links on WhatsApp to see the preview), then check again and do the rest.</span>
              </p>
            )}
            {note && <p className="rounded-xl bg-[#EEF7EF] border border-[#1F5A31]/25 px-4 py-3 text-[14.5px] text-[#1F5A31]">{note}</p>}
            <GhostButton onClick={() => { setStage("idle"); setPlans([]); }}>Check again</GhostButton>
          </div>
        )}

        {failures.length > 0 && !busy && (
          <div role="alert" className="mt-4 rounded-xl bg-[#FEF3F2] border border-[#B42318]/25 px-4 py-3 text-[13px] text-[#B42318]">
            <p className="font-semibold">{failures.length} photo{failures.length === 1 ? "" : "s"} could not be processed (they were not changed):</p>
            <ul className="mt-1 list-disc pl-5 space-y-0.5">{failures.slice(0, 5).map((f) => <li key={f.name}>{f.name}: {f.msg}</li>)}</ul>
            {failures.length > 5 && <p className="mt-1">…and {failures.length - 5} more.</p>}
          </div>
        )}

        {(backups ?? 0) > 0 && !busy && stage !== "ready" && (
          <div className="mt-6 border-t border-black/10 pt-4">
            <p className="text-[14px] font-semibold">Original photos saved: {backups}</p>
            <p className="mt-1 text-[13px]" style={{ color: MUTED }}>Changed your mind? This puts every original photo back exactly as it was.</p>
            <GhostButton onClick={() => void restore()} className="mt-2"><RotateCcw size={15} /> Put the original photos back</GhostButton>
          </div>
        )}
      </div>
    </div>
  );
}
