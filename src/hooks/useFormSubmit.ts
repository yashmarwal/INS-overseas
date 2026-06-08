import { useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function useFormSubmit() {
  const [status, setStatus] = useState<FormStatus>("idle");

  const submit = async (data: Record<string, string>) => {
    setStatus("submitting");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "c961f959-af08-432d-9702-b7906233abc0",
          ...data,
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
