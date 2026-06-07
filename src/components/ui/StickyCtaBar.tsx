import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

export default function StickyCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - h - 600;
      setVisible(window.scrollY > h * 0.8 && window.scrollY < maxScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop side rail — fixed to left edge, centered vertically */}
      <div
        className={`hidden lg:block fixed z-30 transition-all duration-500 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <Link
          to="/wholesale"
          style={{
            display: "block",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
            background: "var(--color-umber, #6B4C2A)",
            color: "#FAF7F0",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            padding: "20px 14px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Request Wholesale Catalogue
        </Link>
      </div>

      {/* Mobile bottom bar */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 flex transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}
        style={{
          background: "rgba(26,20,16,0.97)",
          backdropFilter: "blur(14px)",
          paddingBottom: "env(safe-area-inset-bottom)",
          borderTop: "1px solid rgba(201,151,58,0.2)",
        }}
      >
        <Link
          to="/wholesale"
          className="flex-1 flex items-center justify-center bg-gold text-ink uppercase"
          style={{
            height: 56,
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: "0.14em",
            textDecoration: "none",
          }}
        >
          Catalogue
        </Link>
        <a
          href="https://wa.me/919680478483"
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-2 text-cream uppercase"
          style={{
            height: 56,
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: "0.14em",
            borderLeft: "1px solid rgba(250,247,240,0.15)",
          }}
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
      </div>
    </>
  );
}
