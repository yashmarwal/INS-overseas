import { useEffect, useRef, useState, type ReactNode } from "react";

// Mounts children (and so loads their code/scripts/data) only once the placeholder nears the viewport.
// The placeholder (className / aspectRatio) is kept permanently: the content may take a moment to arrive
// (lazy chunk, third-party script), and dropping the reserved space meanwhile would make the page jump twice.
// It must match the real content's height at every width, so nothing below moves when the content lands.
export default function LazyMount({ children, className, aspectRatio, rootMargin = "800px" }: { children: ReactNode; className?: string; aspectRatio?: number; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { setShow(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShow(true); io.disconnect(); }
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className} style={aspectRatio ? { aspectRatio } : undefined}>
      {show ? children : null}
    </div>
  );
}
