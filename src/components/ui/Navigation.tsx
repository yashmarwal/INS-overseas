import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/our-craft", label: "Our Craft" },
  { to: "/manufacturing", label: "Manufacturing" },
  { to: "/sustainability", label: "Sustainability" },
  { to: "/wholesale", label: "Wholesale" },
  { to: "/contact", label: "Contact" },
] as const;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 transition-colors duration-500"
        style={{
          background: scrolled
            ? "rgba(250, 247, 240, 0.95)"
            : "linear-gradient(to bottom, rgba(26,20,16,0.7) 0%, rgba(26,20,16,0.0) 100%)",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(107,76,42,0.12)" : "1px solid transparent",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 flex items-center justify-between py-4">
          <Link to="/" className="block leading-none">
            <div
              style={{ fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "0.15em" }}
              className={`text-base sm:text-lg ${scrolled ? "text-ink" : "text-cream"}`}
            >
              <span className="hidden sm:inline">INS OVERSEAS</span>
              <span className="sm:hidden text-gold text-[22px]">INS</span>
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

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`relative uppercase text-[12px] group ${scrolled ? "text-ink" : "text-cream"}`}
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
            className={`hidden lg:inline-block px-5 py-3 uppercase text-[12px] border transition-all duration-300 ${
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] bg-ink flex flex-col"
          >
            <div className="flex items-center justify-between p-6">
              <div
                className="text-cream"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "0.15em" }}
              >
                INS OVERSEAS
              </div>
              <button onClick={() => setOpen(false)} className="text-cream" aria-label="Close menu">
                <X size={28} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col items-center justify-center gap-6">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="text-cream text-4xl"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                to="/wholesale"
                onClick={() => setOpen(false)}
                className="mt-6 px-6 py-3 border border-gold text-gold uppercase text-xs"
                style={{ fontFamily: "var(--font-body)", letterSpacing: "0.1em" }}
              >
                Request Catalogue
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
