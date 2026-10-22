import { useRef, useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function useFormSubmit() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const lastSent = useRef(0);

  const submit = async (data: Record<string, string | boolean>) => {
    // one enquiry per 15 seconds: stops double-clicks and scripts hammering the form
    if (Date.now() - lastSent.current < 15_000) return;
    lastSent.current = Date.now();
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
        setStatus("success");
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return { submit, status };
}
