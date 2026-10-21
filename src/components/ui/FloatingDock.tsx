import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Handshake, Mail, Phone, ShoppingBag, Sparkles } from "lucide-react";
import { preloader } from "@/components/ui/Preloader";

// The chat panel is its own chunk, fetched on first hover/tap of the Ask icon.
const loadChat = () => import("@/components/ui/AiHelpAgent");
const AiHelpAgent = lazy(loadChat);

const WHATSAPP = "https://wa.me/919680478483";
const PHONE = "tel:+919680478483";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function WhatsAppGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// One dock slot. The icon swells as the cursor approaches (macOS-dock style); on touch screens
// there is no hover, so a short label sits under the icon instead of a tooltip.
function DockIcon({ mouseX, label, short, icon, active = false, children }: { mouseX: MotionValue<number>; label: string; short?: string; icon: ReactNode; active?: boolean; children: (inner: ReactNode) => ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const distance = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect();
    return b ? x - (b.left + b.width / 2) : Infinity;
  });
  const scale = useSpring(useTransform(distance, [-110, 0, 110], [1, 1.32, 1]), { mass: 0.1, stiffness: 170, damping: 14 });

  return children(
    <>
      <motion.span
        ref={ref}
        style={{
          scale,
          transformOrigin: "50% 100%",
          background: active ? "rgba(201,151,58,0.22)" : "rgba(250,247,240,0.07)",
          boxShadow: active ? "inset 0 0 0 1px rgba(201,151,58,0.9)" : "none",
        }}
        className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-colors duration-200 group-hover:bg-[rgba(250,247,240,0.14)]"
      >
        {icon}
      </motion.span>
      <span className={`md:hidden mt-1 uppercase leading-none ${active ? "text-gold" : "text-cream/70"}`} style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 8, letterSpacing: "0.1em" }}>
        {/* narrow phones get the short word so neighbours are never cramped; wider ones get the full label */}
        <span className="min-[420px]:hidden">{short ?? label}</span>
        <span className="hidden min-[420px]:inline">{label}</span>
      </span>
      <span
        aria-hidden
        className="hidden md:block pointer-events-none absolute left-1/2 -translate-x-1/2 -top-[52px] whitespace-nowrap bg-ink text-cream px-2.5 py-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
        style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", border: "1px solid rgba(201,151,58,0.4)" }}
      >
        {label}
      </span>
    </>,
  );
}

const slot = "group relative flex flex-col items-center justify-center min-w-[44px] md:min-w-0 min-h-[48px] md:min-h-0 outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl";
const iconCls = "text-cream";

// Page shortcuts (left) and direct-contact actions (right), split by a hairline
const pages = [
  { to: "/products", label: "Products", short: "Shop", icon: <ShoppingBag size={18} strokeWidth={1.6} className={iconCls} /> },
  { to: "/wholesale", label: "Wholesale", short: "Trade", icon: <Handshake size={19} strokeWidth={1.6} className={iconCls} /> },
  { to: "/contact", label: "Contact", icon: <Mail size={18} strokeWidth={1.6} className={iconCls} /> },
] as const;

export default function FloatingDock() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [chat, setChat] = useState(false);
  const [chatMounted, setChatMounted] = useState(false); // stays mounted after first use so the conversation is kept
  const [shown, setShown] = useState(false);
  const mouseX = useMotionValue(Infinity);

  // Appear once the splash has gone (or straight away when there is none)
  useEffect(() => {
    const t = setTimeout(() => setShown(true), preloader.active ? 1600 : 400);
    return () => clearTimeout(t);
  }, []);

  const closeChat = useCallback(() => setChat(false), []);
  const toggleChat = () => { setChatMounted(true); setChat((c) => !c); };

  // Admin is a tool, not the storefront: no floating contact widgets there
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {chatMounted && (
        <Suspense fallback={null}>
          <AiHelpAgent open={chat} onClose={closeChat} />
        </Suspense>
      )}

      <motion.nav
        aria-label="Quick contact"
        initial={{ opacity: 0, y: 24 }}
        animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: EASE }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        // on phones the chat is a bottom sheet that would sit under the dock, so the dock steps aside while it is open
        // (the trailing ! makes the class beat the inline opacity / pointer-events that framer sets)
        className={`fixed z-40 inset-x-3 mx-auto max-w-[420px] md:inset-x-auto md:mx-0 md:right-6 md:w-max md:max-w-none bottom-[calc(env(safe-area-inset-bottom)+14px)] md:bottom-6 flex items-end justify-evenly md:justify-start md:gap-3 px-2 md:px-4 py-2 md:py-2.5 rounded-full ${chat ? "max-md:opacity-0! max-md:pointer-events-none!" : ""}`}
        style={{
          pointerEvents: shown ? "auto" : "none",
          background: "rgba(26,20,16,0.96)",
          border: "1px solid rgba(201,151,58,0.32)",
          boxShadow: "0 10px 30px rgba(26,20,16,0.38)",
        }}
      >
        {pages.map((p) => {
          const active = pathname === p.to || pathname.startsWith(p.to + "/");
          return (
            <DockIcon key={p.to} mouseX={mouseX} label={p.label} short={"short" in p ? p.short : undefined} icon={p.icon} active={active}>
              {(inner) => (
                <Link className={slot} to={p.to} aria-label={p.label} aria-current={active ? "page" : undefined}>
                  {inner}
                </Link>
              )}
            </DockIcon>
          );
        })}

        <span aria-hidden className="self-stretch w-px my-1.5 mx-0.5 md:mx-1.5 bg-gold/30" />

        <DockIcon mouseX={mouseX} label="Ask" icon={<Sparkles size={18} strokeWidth={1.7} className={iconCls} />} active={chat}>
          {(inner) => (
            <button type="button" className={slot} onClick={toggleChat} onMouseEnter={() => void loadChat()} onTouchStart={() => void loadChat()} aria-pressed={chat} aria-label="Ask our assistant">
              {inner}
            </button>
          )}
        </DockIcon>

        <DockIcon mouseX={mouseX} label="WhatsApp" icon={<WhatsAppGlyph />}>
          {(inner) => (
            <a className={slot} href={WHATSAPP} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
              {inner}
            </a>
          )}
        </DockIcon>

        <DockIcon mouseX={mouseX} label="Call" icon={<Phone size={17} strokeWidth={1.7} className={iconCls} />}>
          {(inner) => (
            <a className={slot} href={PHONE} aria-label="Call INS Overseas">
              {inner}
            </a>
          )}
        </DockIcon>
      </motion.nav>
    </>
  );
}
