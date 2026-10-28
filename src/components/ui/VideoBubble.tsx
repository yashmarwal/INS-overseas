import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { preloader } from "@/components/ui/Preloader";

// The INS Overseas reel as a small round "video bubble" in the bottom-left corner. It plays a tiny muted preview; a tap
// grows it into a proper player (sound on) in the middle of the screen; while the page scrolls the circle steps aside, like the dock; the little ✕ on the circle's edge removes it for as long as
// the visitor stays on the site. Nothing is remembered: every refresh and every new visit shows the bubble again.
// Three files in /public/video: the full reel (540x960, with sound), a tiny silent preview for the circle, and a poster.
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const FULL = "/video/ins-reel.mp4";
const PREVIEW = "/video/ins-reel-preview.mp4";
const POSTER = "/video/ins-reel-poster.jpg";

export default function VideoBubble() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [shown, setShown] = useState(false);
  const [gone, setGone] = useState(false); // set by the ✕; lives only as long as this page load, so a refresh brings it back
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ended, setEnded] = useState(false);
  const [ready, setReady] = useState(false); // the full video has enough data to show frames
  const [tucked, setTucked] = useState(false); // true while the page is scrolling (the circle steps aside, like the dock)
  const preview = useRef<HTMLVideoElement>(null);
  const full = useRef<HTMLVideoElement>(null);
  const bubbleBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ id: number; x0: number; y0: number; t0: number; dy: number; on: boolean } | null>(null);

  // data saver: the circle shows the still poster and nothing downloads until it is opened
  const [calm] = useState(() => {
    if (typeof window === "undefined") return true;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    return !!conn?.saveData;
  });

  // appears a moment after the splash and the dock, so it never competes with the first paint
  useEffect(() => {
    const t = window.setTimeout(() => setShown(true), preloader.active ? 3400 : 2000);
    return () => window.clearTimeout(t);
  }, []);

  // like the dock: while the page is scrolling the circle steps aside, and comes back once it is still
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

  // the little silent preview only runs while it is on screen and the circle is the thing being shown
  useEffect(() => {
    const p = preview.current;
    if (!p || calm) return;
    p.muted = true; // (set as a property too: some browsers ignore the attribute and then refuse to autoplay)
    const sync = () => { if (open || document.hidden) p.pause(); else p.play().catch(() => {}); };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [open, shown, gone, calm]);

  const collapse = useCallback(() => {
    full.current?.pause();
    setPlaying(false);
    setOpen(false);
    window.setTimeout(() => bubbleBtn.current?.focus({ preventScroll: true }), 50);
  }, []);

  const expand = () => {
    const f = full.current;
    setOpen(true);
    setEnded(false);
    setProgress(0);
    if (f) {
      f.currentTime = 0;
      f.muted = false;
      setMuted(false);
      f.play().then(() => setPlaying(true)).catch(() => {
        // the browser refused sound: start muted instead (the sound button is right there)
        f.muted = true;
        setMuted(true);
        f.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      });
    }
    window.setTimeout(() => closeBtn.current?.focus({ preventScroll: true }), 120);
  };

  const dismiss = () => setGone(true);

  // The player is open: the page behind it must not move (wheel, finger or keys). The smooth-scroll library is told to leave
  // these events alone (data-lenis-prevent on the backdrop and the player), and the browser's own scrolling is switched off.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = { overflow: html.style.overflow, pad: html.style.paddingRight };
    const bar = window.innerWidth - html.clientWidth; // the scrollbar's width, held so the page does not shift sideways
    html.style.overflow = "hidden";
    if (bar > 0) html.style.paddingRight = bar + "px";
    const stop = (e: Event) => { if (e.cancelable) e.preventDefault(); };
    window.addEventListener("wheel", stop, { passive: false });
    window.addEventListener("touchmove", stop, { passive: false });
    return () => {
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.pad;
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
    };
  }, [open]);

  // Swipe down on the player to close it (finger or pen; a mouse keeps its buttons): the card follows the finger, and lets go
  // of the page when it has been pulled far enough (or flicked). A short pull, or a sideways / upward one, springs back.
  const onSwipeDown = (e: React.PointerEvent) => {
    if (!open || e.pointerType === "mouse") return;
    swipe.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: e.timeStamp, dy: 0, on: false }; // (the touch's own time stamp: how fast the finger moved, not how fast the page got to hear about it)
  };
  const onSwipeMove = (e: React.PointerEvent) => {
    const s = swipe.current, c = clip.current;
    if (!s || !c || s.id !== e.pointerId) return;
    const dy = e.clientY - s.y0, dx = e.clientX - s.x0;
    if (!s.on) {
      if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy)) { swipe.current = null; return; } // a sideways move is not a swipe down
      if (dy < 10) return;
      s.on = true;
      c.style.transition = "none";
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* it still follows while the finger stays on the player */ }
    }
    s.dy = Math.max(0, dy);
    c.style.transform = `translateY(${s.dy}px) scale(${1 - Math.min(s.dy, 400) / 3200})`;
  };
  const onSwipeEnd = (e: React.PointerEvent, cancelled = false) => {
    const s = swipe.current, c = clip.current;
    swipe.current = null;
    if (!s || !c || !s.on) return;
    const speed = s.dy / Math.max(1, e.timeStamp - s.t0); // px per ms
    c.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
    c.style.transform = "";
    if (!cancelled && (s.dy > 100 || (s.dy > 40 && speed > 0.35))) collapse();
  };

  // Escape closes the player; Tab stays inside it while it is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); collapse(); return; }
      if (e.key !== "Tab" || !root.current) return;
      const items = Array.from(root.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]")).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (items.length === 0) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, collapse]);

  // moving to another page closes an open player
  useEffect(() => { if (open) collapse(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [pathname]);

  if (pathname.startsWith("/admin") || gone) return null;

  const toggle = () => {
    const f = full.current;
    if (!f) return;
    if (ended) { f.currentTime = 0; setEnded(false); }
    if (f.paused) f.play().then(() => setPlaying(true)).catch(() => {}); else { f.pause(); setPlaying(false); }
  };
  const toggleMute = () => { const f = full.current; if (!f) return; f.muted = !f.muted; setMuted(f.muted); };
  const replay = () => { const f = full.current; if (!f) return; f.currentTime = 0; setEnded(false); f.play().then(() => setPlaying(true)).catch(() => {}); };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const f = full.current; if (!f || !f.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    f.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * f.duration;
    setEnded(false);
  };

  const visible = shown && (open || !tucked); // an open player never hides
  const ctl = "w-10 h-10 rounded-full flex items-center justify-center bg-ink/55 text-white hover:bg-ink/75 active:scale-95 transition-[background-color,transform] duration-200 [-webkit-tap-highlight-color:transparent]";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="reel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={collapse}
            aria-hidden
            data-lenis-prevent
            className="fixed inset-0 z-[84] bg-ink/60 touch-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        ref={root}
        initial={{ opacity: 0, y: 24, scale: 0.85 }}
        animate={visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.85 }}
        transition={{ duration: tucked && !open ? 0.3 : 0.5, ease: EASE }}
        onFocusCapture={() => setTucked(false)}
        onPointerDown={onSwipeDown}
        onPointerMove={onSwipeMove}
        onPointerUp={onSwipeEnd}
        onPointerCancel={(e) => onSwipeEnd(e, true)}
        className="reel"
        data-open={open}
        data-lenis-prevent={open ? "" : undefined}
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        aria-label={open ? "INS Overseas video" : undefined}
        style={{ pointerEvents: visible ? "auto" : "none", transformOrigin: "0% 100%" }}
      >
        {/* everything that must be clipped to the circle / rounded card lives in here; the ✕ sits outside it, on the edge */}
        <div ref={clip} className="reel-clip">
          <video
            ref={preview}
            src={calm || !shown ? undefined : PREVIEW}
            poster={POSTER}
            muted
            loop
            autoPlay
            playsInline
            preload={calm || !shown ? "none" : "auto"}
            onCanPlay={(e) => { if (!open && !document.hidden) e.currentTarget.play().catch(() => {}); }}
            aria-hidden
            tabIndex={-1}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <video
            ref={full}
            src={FULL}
            poster={POSTER}
            playsInline
            preload="none"
            onCanPlay={() => setReady(true)}
            onTimeUpdate={(e) => { const v = e.currentTarget; if (v.duration) setProgress(v.currentTime / v.duration); }}
            onEnded={() => { setEnded(true); setPlaying(false); }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="reel-full absolute inset-0 w-full h-full object-cover"
            style={{ opacity: open ? 1 : 0 }}
            aria-label="INS Overseas reel"
          />

          {/* the circle: one big invisible button over it */}
          <button
            ref={bubbleBtn}
            type="button"
            onClick={expand}
            onPointerEnter={() => { if (full.current && full.current.preload === "none") full.current.preload = "metadata"; }}
            aria-label="Watch the INS Overseas video"
            aria-hidden={open}
            tabIndex={open ? -1 : 0}
            className="reel-hit absolute inset-0 outline-none focus-visible:shadow-[inset_0_0_0_3px_#F1CA85]"
            style={{ pointerEvents: open ? "none" : "auto" }}
          >
          </button>

          {/* the player's own controls (visible only when open) */}
          <div className="reel-ui" aria-hidden={!open}>
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/60 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/70 to-transparent pointer-events-none" />

            <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} tabIndex={open ? 0 : -1} className="absolute inset-0 outline-none" />

            <button ref={closeBtn} type="button" onClick={collapse} aria-label="Close the video" tabIndex={open ? 0 : -1} className={`${ctl} absolute top-3 right-3`}>
              <X size={18} />
            </button>

            <div className="absolute left-3 right-3 bottom-3 flex items-center gap-2.5">
              <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} tabIndex={open ? 0 : -1} className={ctl}>
                {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
              </button>
              <div role="slider" aria-label="Video progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} onClick={seek} className="flex-1 h-6 flex items-center cursor-pointer">
                <div className="relative w-full h-[3px] rounded-full bg-white/30 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-gold-light" style={{ width: `${progress * 100}%` }} />
                </div>
              </div>
              <button type="button" onClick={toggleMute} aria-label={muted ? "Turn sound on" : "Turn sound off"} tabIndex={open ? 0 : -1} className={ctl}>
                {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
            </div>

            {!ready && open && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="reel-spinner" aria-hidden /></div>}

            {ended && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/70 px-6 text-center">
                <p className="text-cream" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 24, lineHeight: 1.15 }}>Handmade in Jaipur.<br /><em className="text-gold-light">Shipped worldwide.</em></p>
                <Link to="/wholesale" onClick={collapse} tabIndex={open ? 0 : -1} className="inline-flex items-center gap-2 h-11 pl-5 pr-1.5 rounded-full bg-gold text-ink uppercase" style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, letterSpacing: "0.1em" }}>
                  Request catalogue
                  <span className="w-8 h-8 rounded-full bg-ink text-gold flex items-center justify-center"><ArrowUpRight size={15} /></span>
                </Link>
                <button type="button" onClick={replay} tabIndex={open ? 0 : -1} className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-cream/90 hover:text-white" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 13 }}>
                  <RotateCcw size={15} /> Watch again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* the small ✕ on the circle's edge: removes the bubble */}
        <button type="button" onClick={dismiss} aria-label="Remove this video" tabIndex={open ? -1 : 0} className="reel-x">
          <X size={11} strokeWidth={3} />
        </button>
      </motion.div>
    </>
  );
}
