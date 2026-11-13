// One shared page scroll lock for every overlay that freezes the page (menu, chat, video player).
//
// Each overlay used to save <html>'s `overflow` / `padding-right` when it opened and put that saved value back when it closed.
// With two open at once and closed in the "wrong" order, the later one restored the earlier one's "hidden" and the page
// stayed frozen. Here the locks are counted: the first one saves the page's real values and freezes it, the last one to let
// go puts the real values back, whatever order they close in.
let count = 0;
let saved = { overflow: "", paddingRight: "" };

/** Freezes page scrolling and returns the function that lets go. `compensate` holds the scrollbar's width as padding so the page does not shift sideways. */
export function acquireScrollLock(compensate = false): () => void {
  const html = document.documentElement;
  if (count === 0) {
    saved = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    const bar = window.innerWidth - html.clientWidth; // measured before hiding the scrollbar
    html.style.overflow = "hidden";
    if (compensate && bar > 0) html.style.paddingRight = bar + "px";
  }
  count++;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    count = Math.max(0, count - 1);
    if (count === 0) {
      html.style.overflow = saved.overflow;
      html.style.paddingRight = saved.paddingRight;
    }
  };
}
