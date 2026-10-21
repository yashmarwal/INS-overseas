import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Mail, Menu, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // The header slides in with the hero text: after the splash on a first visit, almost at once otherwise.
  const [enterDelay] = useState(() => (preloader.active ? 1.0 : 0.05));

  // Menu open: the page behind is locked, Escape closes it, and any navigation closes it
  useEffect(() => { setOpen(false); }, [pathname]);
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
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: enterDelay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 transition-colors duration-500"
        style={{
          background: scrolled
            ? "rgb(250, 247, 240)"
            : "linear-gradient(to bottom, rgba(26,20,16,0.7) 0%, rgba(26,20,16,0.0) 100%)",
          borderBottom: scrolled ? "1px solid rgba(107,76,42,0.12)" : "1px solid transparent",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-8 xl:px-12 2xl:px-20 flex items-center justify-between gap-6 py-4">
          <Link to="/" className="block leading-none shrink-0">
            <div
              style={{ fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "0.15em" }}
              className={`text-[15px] sm:text-lg whitespace-nowrap ${scrolled ? "text-ink" : "text-cream"}`}
            >
              INS OVERSEAS
            </div>
            {scrolled && (
              <div
                style={{ fontFamily: "var(--font-body)", fontWeight: 300, letterSpacing: "0.2em" }}
                className="hidden sm:block text-[9px] mt-1 text-warm-grey"
              >
                EST. 1995 · JAIPUR, INDIA
              </div>
            )}
          </Link>

          <nav className="hidden lg:flex flex-1 items-center justify-center gap-4 xl:gap-6 2xl:gap-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`relative uppercase whitespace-nowrap text-[11px] xl:text-[12px] group ${scrolled ? "text-ink" : "text-cream"}`}
                style={{ fontFamily: "var(--font-body)", fontWeight: 400, letterSpacing: "0.1em" }}
                activeProps={{ className: "text-gold" }}
              >
                {l.label}
                <span className="absolute left-0 -bottom-1 h-px bg-gold transition-all duration-300 w-0 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <Link
            to="/wholesale"
            className={`hidden xl:inline-block shrink-0 whitespace-nowrap px-5 py-3 uppercase text-[12px] border transition-all duration-300 ${
              scrolled
                ? "border-umber text-umber hover:bg-umber hover:text-cream"
                : "border-cream text-cream hover:bg-cream hover:text-ink"
            }`}
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.1em" }}
          >
            Request Catalogue
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
            style={{ backgroundImage: "radial-gradient(circle at 88% 4%, rgba(201,151,58,0.17) 0%, transparent 50%)" }}
          >
            {/* Header: brand + close */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0">
              <Link to="/" onClick={() => setOpen(false)} className="leading-none">
                <span className="block text-cream" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 19, letterSpacing: "0.15em" }}>
                  INS OVERSEAS
                </span>
                <span className="block mt-1.5 text-gold/80 uppercase" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 9, letterSpacing: "0.3em" }}>
                  Est. 1995 · Jaipur
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
            <div className="mx-6 h-px shrink-0" style={{ background: "linear-gradient(to right, rgba(201,151,58,0.55), rgba(201,151,58,0.12) 60%, transparent)" }} />

            {/* Links: index · label · state */}
            <nav className="px-6 pt-1 shrink-0" aria-label="Main">
              {links.map((l, i) => {
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
                      onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
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
