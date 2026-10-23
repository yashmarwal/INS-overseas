import { useSiteImage, refreshSiteImages } from "@/hooks/useSiteImage";
import FadeImg from "@/components/shared/FadeImg";

// Below-the-fold slot image: lazy-loaded, eases in when ready, and absent (parent's background shows) until the URL is known.
// If the saved URL is dead (admin replaced the image), re-check the current list and switch over.
export default function SiteImage({ section, alt, className }: { section: string; alt: string; className?: string }) {
  const src = useSiteImage(section);
  return src ? <FadeImg src={src} alt={alt} loading="lazy" decoding="async" onError={() => { refreshSiteImages(); }} className={className} /> : null;
}
