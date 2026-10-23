import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Mail, Menu, Phone, X } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { preloader } from "@/components/ui/Preloader";
import { WhatsAppGlyph } from "@/components/ui/FloatingDock";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/our-craft", label: "Our Craft" },
  { to: "/manufacturing", label: "Manufacturing" },
  { to: "/gallery", label: "Gallery" },
  { to: "/sustainability", label: "Sustainability" },
  { to: "/wholesale", label: "Wholesale" },
  { to: "/contact", label: "Contact" },
] as const;

// The phone menu has room for one more entry than the desktop pill: the Journal sits right after the Gallery.
const mobileLinks = [...links.slice(0, 6), { to: "/journal", label: "Journal" }, ...links.slice(6)] as const;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // the page that is actually on screen (`pathname` flips the moment a link is tapped, before the new page is ready)
  const renderedPath = useRouterState({ select: (s) => s.resolvedLocation?.pathname ?? s.location.pathname });
  const headerRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Publish the real header height as --nav-h so sticky bars (product filters etc.) sit flush under it at every breakpoint
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () => document.documentElement.style.setProperty("--nav-h", `${Math.round(el.getBoundingClientRect().height)}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The header slides in with the hero text: after the splash on a first visit, almost at once otherwise.
  const [enterDelay] = useState(() => (preloader.active ? 1.0 : 0.05));

  // Menu open: the page behind is locked, Escape closes it, and any navigation closes it
  // The menu stays up while the next page loads and closes only once it is on screen, so the old page never flashes
  // between the tap and the swap. (Tapping a link to the page you are already on closes it straight away.)
  useEffect(() => { setOpen(false); }, [renderedPath]);
  const closeIfSamePage = (to: string) => { if (to === renderedPath) setOpen(false); };
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { html.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);

  useEffect(() => {
    // One scrollY read per frame (reading it on every scroll event forces a layout each time)
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; setScrolled(window.scrollY > 80); });
    };
    setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: enterDelay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 transition-colors duration-500"
        style={{
          background: scrolled
            ? "rgb(250, 247, 240)"
            : "linear-gradient(to bottom, rgba(26,20,16,0.7) 0%, rgba(26,20,16,0.0) 100%)",
          borderBottom: scrolled ? "1px solid rgba(107,76,42,0.12)" : "1px solid transparent",
          // kept out of the page cross-dissolve (see styles.css) so the sliding active pill is never doubled by a faded copy;
          // not while the mobile menu is open, as the menu has to dissolve over the header
          viewTransitionName: open ? undefined : "site-nav",
        }}
      >
        <div className={`max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-8 xl:px-12 2xl:px-20 flex items-center justify-between gap-6 transition-[padding] duration-300 ${scrolled ? "py-4 lg:py-2.5" : "py-4 lg:py-3.5"}`}>
          <Link to="/" className="flex items-center gap-2.5 leading-none shrink-0">
            {/* the real INS Overseas crest (gold on transparent), taller than the text so it reads as the brand mark */}
            <img src="/logo-mark.png" alt="" aria-hidden width={39} height={52} className={`shrink-0 h-11 w-auto lg:h-14 -my-3 transition-[filter] duration-500 ${scrolled ? "brightness-[0.72] saturate-150" : ""}`} />
            <div>
              <div
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                className={`text-[15px] sm:text-lg lg:text-[15px] xl:text-lg tracking-[0.15em] lg:tracking-[0.1em] xl:tracking-[0.15em] whitespace-nowrap ${scrolled ? "text-ink" : "text-cream"}`}
              >
                INS OVERSEAS
              </div>
              {scrolled && (
                <div
                  style={{ fontFamily: "var(--font-body)", fontWeight: 300, letterSpacing: "0.2em", color: "var(--grey-ink)" }}
                  className="hidden sm:block text-[9px] mt-1"
                >
                  EST. 1995 · JAIPUR, INDIA
                </div>
              )}
            </div>
          </Link>

          {/* Desktop: links live in a floating pill. A highlight glides to whatever you hover; a gold marker shows the page you are on
              and slides across when you navigate. Settles into a calm tinted pill once the page is scrolled. */}
          <nav aria-label="Main" className="hidden lg:flex flex-1 justify-center">
            <LayoutGroup id="desktop-nav">
              <ul
                onPointerLeave={() => setHovered(null)}
                className="flex items-center gap-0.5 rounded-full p-1.5 transition-[background,box-shadow] duration-300"
                style={
                  scrolled
                    ? { background: "rgba(26,20,16,0.045)", boxShadow: "inset 0 0 0 1px rgba(26,20,16,0.09)" }
                    : { background: "rgba(26,20,16,0.5)", boxShadow: "inset 0 0 0 1px rgba(250,247,240,0.17), 0 14px 34px -16px rgba(0,0,0,0.65)" }
                }
              >
                {links.map((l) => {
                  const active = l.to === "/" ? pathname === "/" : pathname === l.to || pathname.startsWith(l.to + "/");
                  const hot = hovered === l.to && !active;
                  return (
                    <li key={l.to} className="relative">
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                          className="absolute inset-0 rounded-full"
                          style={{ background: scrolled ? "#6B4C2A" : "#C9973A" }}
                        />
                      )}
                      {hot && (
                        <motion.span
                          layoutId="nav-hover"
                          transition={{ type: "spring", stiffness: 520, damping: 38 }}
                          className="absolute inset-0 rounded-full"
                          style={{ background: scrolled ? "rgba(26,20,16,0.075)" : "rgba(250,247,240,0.17)" }}
                        />
                      )}
                      <Link
                        to={l.to}
                        aria-current={active ? "page" : undefined}
                        onPointerEnter={(e) => { if (e.pointerType === "mouse") setHovered(l.to); }}
                        className="relative z-10 block px-2 xl:px-3 2xl:px-3.5 py-2 rounded-full whitespace-nowrap uppercase text-[11px] xl:text-[12px] transition-colors duration-200"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: active ? 500 : 400,
                          letterSpacing: "0.1em",
                          color: active ? (scrolled ? "#FAF7F0" : "#1A1410") : scrolled ? "#1A1410" : "rgba(250,247,240,0.94)",
                        }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </LayoutGroup>
          </nav>

          <Link
            to="/wholesale"
            className="group relative overflow-hidden hidden min-[1440px]:inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap h-11 pl-5 pr-1.5 rounded-full uppercase text-[12px] bg-gold text-ink hover:bg-gold-light transition-[background-color,box-shadow] duration-300 hover:shadow-[0_6px_18px_rgba(201,151,58,0.38)]"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.1em" }}
          >
            {/* light sweep: one slow pass across the pill on hover (transform only) */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-[20deg] -translate-x-full group-hover:translate-x-[420%] motion-reduce:hidden transition-transform duration-[900ms] ease-out"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }}
            />
            <span className="relative">Request Catalogue</span>
            <span className="relative w-8 h-8 rounded-full flex items-center justify-center bg-ink text-gold">
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>

          <button
            className={`lg:hidden ${scrolled ? "text-ink" : "text-cream"}`}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={26} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] bg-ink flex flex-col overflow-y-auto overscroll-contain"
          >
            {/* Header: brand + close */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0">
              <Link to="/" onClick={() => closeIfSamePage("/")} className="flex items-center gap-3 leading-none">
                <img src="/logo-mark.png" alt="" aria-hidden width={39} height={52} className="shrink-0 h-12 w-auto" />
                <span>
                <span className="block text-cream" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 19, letterSpacing: "0.15em" }}>
                  INS OVERSEAS
                </span>
                <span className="block mt-1.5 text-gold/80 uppercase" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 9, letterSpacing: "0.3em" }}>
                  Est. 1995 · Jaipur
                </span>
                </span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="w-11 h-11 rounded-full flex items-center justify-center text-cream"
                style={{ boxShadow: "inset 0 0 0 1px rgba(201,151,58,0.5)" }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="mx-6 h-px shrink-0 bg-gold/30" />

            {/* Links: index · label · state */}
            <nav className="px-6 pt-1 shrink-0" aria-label="Main">
              {mobileLinks.map((l, i) => {
                const active = l.to === "/" ? pathname === "/" : pathname === l.to || pathname.startsWith(l.to + "/");
                return (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.04, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      to={l.to}
                      onClick={() => closeIfSamePage(l.to)}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-center gap-4 py-3 [@media(max-height:740px)]:py-2 border-b border-cream/10"
                    >
                      <span
                        className={`w-6 shrink-0 tabular-nums ${active ? "text-gold" : "text-gold/50"}`}
                        style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 10, letterSpacing: "0.2em" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`flex-1 leading-none transition-colors ${active ? "text-gold" : "text-cream group-active:text-gold"}`}
                        style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: 27 }}
                      >
                        {l.label}
                      </span>
                      {active ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" aria-hidden />
                      ) : (
                        <ArrowUpRight size={16} className="shrink-0 text-cream/30 group-active:text-gold" aria-hidden />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer: primary action, direct contact, location */}
            <div className="mt-auto px-6 pt-7 pb-[calc(env(safe-area-inset-bottom)+22px)] shrink-0">
              <Link
                to="/wholesale"
                onClick={() => closeIfSamePage("/wholesale")}
                className="flex items-center justify-center gap-2.5 w-full py-4 bg-gold text-ink uppercase active:bg-gold-light transition-colors"
                style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12, letterSpacing: "0.16em" }}
              >
                Request Catalogue
                <ArrowRight size={15} />
              </Link>
              <div className="mt-5 flex items-center justify-center gap-3">
                {[
                  { href: "https://wa.me/919680478483", label: "WhatsApp", icon: <WhatsAppGlyph size={20} />, ext: true },
                  { href: "tel:+919680478483", label: "Call", icon: <Phone size={18} strokeWidth={1.6} className="text-cream" />, ext: false },
                  { href: "mailto:Sezan@ins-overseas.com", label: "Email", icon: <Mail size={18} strokeWidth={1.6} className="text-cream" />, ext: false },
                ].map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    aria-label={c.label}
                    {...(c.ext ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="w-12 h-12 rounded-full flex items-center justify-center active:bg-cream/10 transition-colors"
                    style={{ boxShadow: "inset 0 0 0 1px rgba(201,151,58,0.4)" }}
                  >
                    {c.icon}
                  </a>
                ))}
              </div>
              <p className="mt-4 text-center text-warm-grey uppercase [@media(max-height:740px)]:hidden" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 9, letterSpacing: "0.28em" }}>
                Sanganer · Jaipur · Rajasthan
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
