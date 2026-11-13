import { useEffect, useState } from "react";

/** True while the page is scrolling, false once it has been still for 220 ms. The dock, the quote button and the video bubble step aside while it is true. */
export function useScrollTucked() {
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
  return [tucked, setTucked] as const;
}
