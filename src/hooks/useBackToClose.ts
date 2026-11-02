import { useCallback, useEffect, useRef } from "react";

const KEY = "overlayOpen";

// The browser's Back button (or a phone's back gesture) closes an open sheet instead of leaving the page. Opening adds one history
// entry; Back removes it and closes the sheet. Use the returned function as the sheet's onOpenChange: closing it any other way
// (X, Escape, tapping outside) goes Back too, so no stray entry is left behind.
export function useBackToClose(open: boolean, setOpen: (open: boolean) => void) {
  const set = useRef(setOpen);
  set.current = setOpen;

  useEffect(() => {
    if (!open) return;
    window.history.pushState({ [KEY]: true }, "");
    const onPop = () => set.current(false);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [open]);

  return useCallback((next: boolean) => {
    if (next) set.current(true);
    else if (window.history.state?.[KEY]) window.history.back();
    else set.current(false);
  }, []);
}
