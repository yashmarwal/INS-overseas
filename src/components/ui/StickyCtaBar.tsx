import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const messages = [
  { text: "Request Catalogue",  href: "/wholesale",                isLink: true  },
  { text: "WhatsApp Us",        href: "https://wa.me/919680478483", isLink: false },
  { text: "Get Free Samples",   href: "/wholesale",                isLink: true  },
  { text: "Talk to Our Team",   href: "https://wa.me/919680478483", isLink: false },
];

export default function StickyCtaBar() {
  const [visible, setVisible] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight;
      const max = document.documentElement.scrollHeight - h - 800;
      setVisible(window.scrollY > h * 0.9 && window.scrollY < max);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cycle messages every 3 seconds
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length);
    }, 3000);
    return () => clearInterval(t);
  }, [visible]);

  const msg = messages[msgIndex];

  const pillContent = (
    <motion.div
      className="flex items-center gap-2.5 px-5 py-3"
      whileHover={{ gap: 14 }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={msgIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-ink font-medium uppercase whitespace-nowrap"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            letterSpacing: "0.15em",
            fontWeight: 500,
          }}
        >
          {msg.text}
        </motion.span>
      </AnimatePresence>
      <motion.div
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowRight size={14} className="text-ink" />
      </motion.div>
    </motion.div>
  );

  return (
    <>
      {/* ── Desktop side rail — unchanged ── */}
      <Link
        to="/wholesale"
        className={`hidden lg:flex fixed left-0 top-1/2 z-30 -translate-y-1/2 origin-top-left items-center gap-3 bg-umber text-cream px-5 py-3 uppercase text-[11px] transition-all duration-500 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          fontFamily: "var(--font-body)",
          letterSpacing: "0.25em",
          transform: `translateY(-50%) rotate(-90deg) translateX(${visible ? 0 : -20}px)`,
        }}
      >
        Request Wholesale Catalogue
        <span className="h-px w-6 bg-gold" />
      </Link>

      {/* ── Mobile floating pill — replaces bottom bar ── */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed z-40 left-0 right-0 flex justify-center items-center"
            style={{ bottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
          >
            {/* Glow behind pill */}
            <div
              className="absolute inset-0 rounded-full blur-md opacity-40"
              style={{ background: "#C9973A", transform: "scale(1.2)" }}
            />

            {msg.isLink ? (
              <Link
                to={msg.href}
                className="relative block rounded-full shadow-2xl overflow-hidden"
                style={{ background: "#C9973A" }}
              >
                {pillContent}
              </Link>
            ) : (
              <a
                href={msg.href}
                target="_blank"
                rel="noreferrer"
                className="relative block rounded-full shadow-2xl overflow-hidden"
                style={{ background: "#C9973A" }}
              >
                {pillContent}
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
