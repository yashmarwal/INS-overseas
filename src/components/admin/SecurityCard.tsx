import { useEffect, useMemo, useState } from "react";
import { Copy, ShieldAlert, ShieldCheck } from "lucide-react";
import { buildSetupSql, probeLockdown, type Lockdown } from "@/lib/adminData";
import { GhostButton, MUTED, Panel, PrimaryButton } from "@/components/admin/AdminUI";

/** Tells the admin whether the database is protected, and if not, gives them the exact SQL to protect it. */
export default function SecurityCard({ email, showToast }: { email: string; showToast: (t: "success" | "error", m: string) => void }) {
  const [state, setState] = useState<Lockdown | "checking">("checking");
  const sql = useMemo(() => buildSetupSql(email), [email]);

  const check = async () => {
    setState("checking");
    try { setState(await probeLockdown()); } catch { setState("unknown"); }
  };
  useEffect(() => { void check(); }, []);

  const copy = async () => {
    try { await navigator.clipboard.writeText(sql); showToast("success", "Copied. Paste it into the Supabase SQL Editor and press Run."); }
    catch { showToast("error", "Couldn't copy automatically — select the text and copy it."); }
  };

  if (state === "checking") {
    return <p className="mb-6 text-[13px]" style={{ color: MUTED }} role="status">Checking your website's protection…</p>;
  }

  if (state === "locked") {
    return (
      <p className="mb-6 inline-flex items-center gap-2 rounded-xl bg-[#ECF6EE] border border-[#2E7D46]/25 px-4 py-2.5 text-[14px]" style={{ color: "#1F5A31" }} data-security="locked">
        <ShieldCheck size={17} aria-hidden /> Protected: only your admin login can change the website.
      </p>
    );
  }

  return (
    <Panel className="mb-6 p-5 sm:p-6 border-[#B42318]/30" >
      <div className="flex items-start gap-3" data-security={state}>
        <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: state === "open" ? "#FEF3F2" : "#F3EEE2", color: state === "open" ? "#B42318" : "#6B4C2A" }}><ShieldAlert size={20} /></span>
        <div className="min-w-0 flex-1">
          {state === "open" ? (
            <>
              <h2 className="text-[17px] font-semibold">Protect your website (2 minutes)</h2>
              <p className="mt-1 text-[14px] leading-relaxed" style={{ color: MUTED }}>
                Right now anyone who knows your website's public key could change or delete your photos and products. One setup step fixes that, so that only this login can make changes. Your visitors are not affected.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-[17px] font-semibold">Couldn't check your protection</h2>
              <p className="mt-1 text-[14px] leading-relaxed" style={{ color: MUTED }}>Check your internet connection and try again. If it keeps happening, run the setup below anyway; it is safe to run twice.</p>
            </>
          )}
          <ol className="mt-3 list-decimal pl-5 space-y-1 text-[14px] leading-relaxed" style={{ color: "#4A3219" }}>
            <li>Open your project at supabase.com → <b>SQL Editor</b> → <b>New query</b>.</li>
            <li>Press <b>Copy SQL</b>, paste it in and press <b>Run</b>. It is written for <b>{email}</b>, so only this login will be allowed to make changes.</li>
            <li>Come back and press <b>I've run it</b>. This box turns green.</li>
          </ol>
          <pre className="mt-3 max-h-56 overflow-auto rounded-xl bg-[#1A1410] text-[#F5EFE0] p-3 text-[12px] leading-relaxed whitespace-pre-wrap" tabIndex={0}>{sql}</pre>
          <div className="mt-3 flex flex-wrap gap-2">
            <PrimaryButton onClick={() => void copy()}><Copy size={15} /> Copy SQL</PrimaryButton>
            <GhostButton onClick={() => void check()}>I've run it</GhostButton>
          </div>
        </div>
      </div>
    </Panel>
  );
}
