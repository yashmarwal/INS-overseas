import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { MUTED, PrimaryButton } from "@/components/admin/AdminUI";

// Real sign-in through Supabase Auth. The password is checked on the server and never stored in this website's code.
// Success needs no callback: the admin page listens for the new session.
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw });
    setBusy(false);
    if (!err) { setPw(""); return; }
    const msg = err.message || "";
    if (err.status === 429 || /rate limit|too many/i.test(msg)) setError("Too many tries. Please wait a minute and try again.");
    else if (/not confirmed/i.test(msg)) setError("This login hasn't been confirmed yet. In Supabase, open Authentication → Users and confirm it.");
    else if (/invalid login|invalid credentials|invalid_credentials/i.test(msg) || err.status === 400) setError("That email or password isn't right. Please try again.");
    else if (/fetch|network/i.test(msg) || err.name === "AuthRetryableFetchError") setError("Couldn't reach the server. Check your internet connection and try again.");
    else setError(`Couldn't sign in: ${msg}`);
  };

  const field = `w-full h-12 px-4 rounded-xl border bg-white text-[15px] focus:outline-none focus:ring-2 ${error ? "border-[#B42318] focus:ring-[#B42318]/20" : "border-black/20 focus:border-[#6B4C2A] focus:ring-[#6B4C2A]/20"}`;

  return (
    <div data-admin data-lenis-prevent className="fixed inset-0 z-[90] overflow-y-auto bg-[#F6F4EF] flex justify-center px-4 py-10" style={{ fontFamily: "var(--font-body)" }}>
      <div className="w-full max-w-sm my-auto">
        <div className="text-center mb-8">
          <p className="text-[#1A1410]" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 30, letterSpacing: "0.02em" }}>INS Overseas</p>
          <p className="mt-1.5 text-[12px] uppercase" style={{ color: MUTED, letterSpacing: "0.18em" }}>Website manager</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl border border-black/10 shadow-[0_20px_50px_-24px_rgba(26,20,16,0.35)] p-6 sm:p-7">
          <span className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "#F3EEE2", color: "#6B4C2A" }}><ShieldCheck size={22} /></span>
          <h1 className="text-[#1A1410]" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28, lineHeight: 1.1 }}>Welcome back</h1>
          <p className="mt-1.5 text-[14px]" style={{ color: MUTED }}>Sign in to update your website's photos and products.</p>

          <label htmlFor="admin-email" className="block mt-6 text-[13px] font-medium text-[#1A1410]">Email</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            autoFocus
            autoComplete="username"
            required
            className={`${field} mt-2`}
          />

          <label htmlFor="admin-password" className="block mt-4 text-[13px] font-medium text-[#1A1410]">Password</label>
          <div className="relative mt-2">
            <input
              id="admin-password"
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(null); }}
              autoComplete="current-password"
              required
              aria-invalid={!!error}
              aria-describedby={error ? "login-error" : undefined}
              className={`${field} pr-12`}
            />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center hover:bg-black/5" style={{ color: MUTED }}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <p id="login-error" role="alert" className="mt-2 text-[13px] text-[#B42318]">{error}</p>}

          <PrimaryButton type="submit" busy={busy} className="w-full mt-5 h-12">Sign in</PrimaryButton>
        </form>
      </div>
    </div>
  );
}
