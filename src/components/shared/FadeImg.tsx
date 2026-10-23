import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

// An <img> that eases in once it has loaded instead of popping in. Cached images (already complete on mount) show at once.
// The parent's own background, or the .img-shimmer class on it, is what shows while the photo is on its way.
export default function FadeImg({ className = "", onLoad, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { if (ref.current?.complete && ref.current.naturalWidth > 0) setReady(true); }, [rest.src]);
  return (
    <img
      ref={ref}
      {...rest}
      onLoad={(e) => { setReady(true); onLoad?.(e); }}
      className={`${className} transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}
