import { useEffect, useRef, useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

// Sends an enquiry through Web3Forms (it emails it to the inbox). `submit` resolves to true only when it was sent, so
// the form can keep what the visitor typed if it was not.
export function useFormSubmit() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const busy = useRef(false);
  const lastSent = useRef(0);
  // The "back to idle" timer. Only one may be pending: a leftover one from an earlier send would otherwise knock a newer
  // send's "submitting" (or its result) back to idle early, and none may fire after the form is gone.
  const settle = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(settle.current), []);
  const finish = (next: "success" | "error", ms: number) => {
    setStatus(next);
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => setStatus("idle"), ms);
  };

  const submit = async (data: Record<string, string | boolean>): Promise<boolean> => {
    // already sending, or just sent one: ignore double-clicks and scripts hammering the form (a FAILED send can be retried at once)
    if (busy.current || Date.now() - lastSent.current < 15_000) return false;
    busy.current = true;
    window.clearTimeout(settle.current);
    // nobody types more than this into a form; it keeps junk and oversized payloads out of the inbox
    const clean = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, typeof v === "string" ? v.slice(0, 2000) : v]));
    setStatus("submitting");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "c961f959-af08-432d-9702-b7906233abc0",
          ...clean,
        }),
      });
      const json = await res.json();
      if (json.success) {
        lastSent.current = Date.now();
        finish("success", 5000);
        return true;
      }
      finish("error", 6000);
      return false;
    } catch {
      finish("error", 6000);
      return false;
    } finally {
      busy.current = false;
    }
  };

  return { submit, status };
}
