import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<"default" | "hover" | "view">("default");
  const [hidden, setHidden] = useState(true);

  // Never override the native cursor on the admin page
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname === "/admin";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (isAdmin) return; // keep native cursor on admin
    setHidden(false);

    let mx = 0, my = 0, rx = 0, ry = 0;
    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
      }
      const t = e.target as HTMLElement;
      if (t.closest("[data-cursor-view]")) setVariant("view");
      else if (t.closest("a, button, [role='button'], input, textarea, select, label")) setVariant("hover");
      else setVariant("default");
    };
    const raf = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
      requestAnimationFrame(raf);
    };
    window.addEventListener("mousemove", move);
    const id = requestAnimationFrame(raf);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(id); };
  }, []);

  if (hidden || isAdmin) return null;
  const size = variant === "view" ? 64 : variant === "hover" ? 60 : 40;
  return (
    <>
      <div
        ref={dot}
        className="fixed top-0 left-0 z-[100] pointer-events-none w-3 h-3 rounded-full bg-umber"
        style={{ mixBlendMode: "difference" }}
      />
      <div
        ref={ring}
        className="fixed top-0 left-0 z-[100] pointer-events-none rounded-full border border-umber transition-[width,height,opacity,background] duration-300 ease-out flex items-center justify-center text-[10px] tracking-[0.2em] uppercase text-cream"
        style={{
          width: size,
          height: size,
          marginLeft: (40 - size) / 2,
          marginTop: (40 - size) / 2,
          background: variant === "view" ? "rgba(107,76,42,0.85)" : variant === "hover" ? "rgba(107,76,42,0.18)" : "transparent",
        }}
      >
        {variant === "view" ? "View" : ""}
      </div>
    </>
  );
}
