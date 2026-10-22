import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, RotateCcw, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const suggestedQuestions = [
  "What's your minimum order quantity?",
  "How do I place a wholesale order?",
  "Can I get samples first?",
  "Do you offer custom branding?",
  "How long does shipping take?",
  "What payment methods do you accept?",
];

const knowledgeBase = [
  {
    keywords: ["product", "sell", "offer", "categories", "range", "what do you make"],
    response:
      'We make three main product categories: Handmade Leather Journals, Leather Bags, and Handmade Paper Products. Our leather journals come in sizes 7"×5", 8"×6", 7"×10" and custom. All products can be fully customised with your logo and branding.',
  },
  {
    keywords: ["leather", "material", "buffalo", "hide", "skin"],
    response:
      "We use genuine buffalo leather for all our journals and bags. Our leather is ethically sourced from Kanpur and Chennai — India's established leather regions — and is chrome-free. Available in multiple colors, all hand-finished by our artisans.",
  },
  {
    keywords: ["paper", "handmade paper", "cotton", "gsm", "deckle", "fountain pen", "watercolour", "watercolor"],
    response:
      "Our handmade paper is 100% recycled cotton rag — completely tree-free and chemical-free. Raw cotton comes from textile offcuts from Tirupur, Bengaluru, and Punjab. We can produce any GSM weight and any size. It's bleed-resistant and loved by fountain pen writers, calligraphers, and watercolour artists worldwide.",
  },
  {
    keywords: ["moq", "minimum", "minimum order", "how many"],
    response:
      "Our MOQ is 300 pieces per design for standard wholesale orders, and 500 pieces for custom/OEM orders with your logo. You can mix different products across our catalogue to reach the MOQ.",
  },
  {
    keywords: ["sample", "samples", "try before", "test"],
    response:
      "Yes! Product samples are free — you only pay the shipping cost to your location. Custom samples (with your logo or specific design) take about 10 days to produce. Contact us on WhatsApp or email to request your samples.",
  },
  {
    keywords: ["custom", "oem", "logo", "branding", "personalised", "personalized", "my logo", "deboss", "emboss", "foil"],
    response:
      "We offer full customisation: debossing, embossing, foil stamping (gold/silver), screen printing, custom leather colors, custom hardware, and custom packaging. MOQ for custom orders is 500 pieces. Share your logo and brief and we'll send a sample within 10 days.",
  },
  {
    keywords: ["custom process", "how does custom work", "order process", "steps"],
    response:
      "Our custom order process: 1) You share your brief and logo files 2) We confirm specs and send a quote 3) Custom sample in ~10 days 4) You approve the sample 5) 50% advance payment 6) Production in 30 days 7) We send step-by-step photos & video 8) 50% balance before shipment 9) We dispatch and share tracking.",
  },
  {
    keywords: ["packaging", "box", "tissue", "ribbon", "gift box", "branded packaging"],
    response:
      "Yes! We can create fully custom packaging — branded boxes, tissue paper with your logo, ribbon, hang tags, and labels. No minimum order quantity for packaging when ordered alongside your products.",
  },
  {
    keywords: ["price", "pricing", "cost", "how much", "rate", "catalogue", "catalog"],
    response:
      "We don't publish prices publicly as they depend on product specs, quantity, and customisation. We'll send you our complete price list and catalogue within 24 hours of your enquiry. WhatsApp us at +91 96804 78483 or email Sezan@ins-overseas.com to request it.",
  },
  {
    keywords: ["discount", "repeat", "bulk", "volume"],
    response:
      "Yes — repeat buyers receive a 5% discount on all subsequent orders. For large volume orders, we're open to discussing additional pricing arrangements. Get in touch to discuss your requirements.",
  },
  {
    keywords: ["payment", "pay", "transfer", "swift", "paypal", "wise", "wire"],
    response:
      "We accept SWIFT bank wire transfer, PayPal, Wise, and Letter of Credit (for large orders). We accept USD, EUR, and GBP. Standard terms are 50% advance on order confirmation, 50% when goods are ready to ship.",
  },
  {
    keywords: ["payment terms", "advance", "deposit", "how to pay"],
    response:
      "Our standard payment terms are 50% advance when you confirm the order, and 50% balance when goods are ready for shipment. For repeat buyers, we offer a 5% discount.",
  },
  {
    keywords: ["shipping", "ship", "delivery", "how long", "lead time", "dispatch"],
    response:
      "Production takes 30 days after order and payment confirmation. Delivery after dispatch: by air (DHL/FedEx/UPS) — 7 to 10 days worldwide. By sea freight — 35 to 40 days. We ship to all countries — no restrictions.",
  },
  {
    keywords: ["dhl", "fedex", "ups", "sea", "air", "freight", "courier"],
    response:
      "We ship via DHL, FedEx, UPS for air freight and sea freight (LCL or FCL) for larger orders. We also use India Post for smaller shipments. We'll recommend the best option based on your order size and timeline.",
  },
  {
    keywords: ["customs", "duty", "import", "tax", "clearance"],
    response:
      "Import duties and customs clearance at the destination country are the buyer's responsibility. We provide full export documentation — commercial invoice, packing list, and certificate of origin — to make customs clearance easy.",
  },
  {
    keywords: ["tracking", "track", "where is my order"],
    response:
      "Yes — once your order is dispatched, we share the tracking number with you directly so you can monitor your shipment in real time.",
  },
  {
    keywords: ["documents", "documentation", "export docs", "invoice", "coo", "certificate of origin"],
    response:
      "We provide all standard export documentation: Commercial Invoice, Packing List, and Certificate of Origin. We can provide additional documents required by your country's customs authority on request.",
  },
  {
    keywords: ["quality", "defect", "damaged", "broken", "wrong", "problem", "issue"],
    response:
      "We send step-by-step photos and videos of finished goods before every shipment — your approval is required before we dispatch. If any goods arrive damaged or defective, we will remake and reship at no extra cost. Your satisfaction is our guarantee.",
  },
  {
    keywords: ["return", "returns", "refund"],
    response:
      "Yes, we accept returns for manufacturing defects or goods significantly different from approved samples. Please contact us within 7 days of receiving your shipment and we will resolve it promptly.",
  },
  {
    keywords: ["eco", "sustainable", "environment", "green", "tree free", "cotton", "recycled"],
    response:
      "Our handmade paper is 100% recycled cotton rag — no trees, no chemicals. Cotton comes from textile offcuts from Tirupur, Bengaluru, and Punjab. Our leather is chrome-free, ethically sourced from Kanpur and Chennai. We are a four-generation family craft business, and sustainability is the foundation of everything we make.",
  },
  {
    keywords: ["certification", "certified", "iec", "msme", "fair trade"],
    response:
      "We hold an IEC (Import Export Code) as a registered Indian exporter and are registered under MSME/Udyam. Our eco-friendly paper-making process aligns with fair trade principles. We are committed to responsible, sustainable manufacturing.",
  },
  {
    keywords: ["story", "history", "founded", "heritage", "family", "how long", "generations"],
    response:
      "Our family has practised the craft of handmade paper-making in Sanganer, Jaipur for over 400 years. INS Overseas was formally established as an export company 30 years ago. Today we are a four-generation family business with 25 skilled artisans, exporting to 40+ countries worldwide.",
  },
  {
    keywords: ["artisan", "craftsman", "workers", "team", "employees"],
    response:
      "We have 25 skilled artisans and craftsmen working with us — many from families who have practised these traditional Rajasthani crafts for generations. Every journal and every sheet of paper is made by hand.",
  },
  {
    keywords: ["trade fair", "exhibition", "fair", "epch", "ihgf", "delhi fair"],
    response:
      "Yes — we exhibit at EPCH and the IHGF Delhi Fair, India's largest handicraft export fairs. These are great opportunities to see our full range in person and meet our team. Contact us for our upcoming fair dates.",
  },
  {
    keywords: ["address", "location", "where are you", "visit", "showroom", "sanganer"],
    response:
      "We're located at: Jain Nasiya Road, Near Jain Hostel, Sanganer, Jaipur – 302029, Rajasthan, India. Sanganer is the historic heart of Indian papermaking, and we've been here for generations. You're welcome to visit — we're available Monday to Saturday, 24 hours.",
  },
  {
    keywords: ["contact", "reach", "phone", "email", "whatsapp", "call"],
    response:
      "You can reach us anytime:\n📱 WhatsApp: +91 96804 78483\n📧 Email: Sezan@ins-overseas.com\nWe're available Monday to Saturday. We typically respond within a few hours.",
  },
  {
    keywords: ["hours", "open", "working hours", "available", "saturday", "sunday"],
    response:
      "We are available 24 hours, Monday to Saturday. WhatsApp us at +91 96804 78483 or email Sezan@ins-overseas.com anytime.",
  },
  {
    keywords: ["order", "start", "begin", "first step", "how to order", "place order", "get started"],
    response:
      "Getting started is easy:\n1. WhatsApp us at +91 96804 78483 or fill the enquiry form on our website\n2. We send you our full catalogue and price list within 24 hours\n3. Request free samples if you'd like to check quality first\n4. Confirm your order and pay 50% advance\n5. Production in 30 days — we keep you updated with photos throughout\n6. Pay balance and we ship to your door with tracking",
  },
];

const fallbackResponse =
  "Thank you for your question! For the most accurate answer, please reach out to our team directly:\n📱 WhatsApp: +91 96804 78483\n📧 Email: Sezan@ins-overseas.com\nWe respond within a few hours, Monday to Saturday.";

const getResponse = (input: string): string => {
  const lower = input.toLowerCase();

  // Find best matching knowledge base entry
  const match = knowledgeBase.find((entry) =>
    entry.keywords.some((keyword) => lower.includes(keyword))
  );

  return match ? match.response : fallbackResponse;
};

// ───────────────────────────────────────────────────────────────────────────────
// "INS Assistant": the assistant as a sheet of paper on a desk, not a chat widget stuck to a corner.
// Desktop: a centred sheet that unrolls from its top edge. Phone: a full page that slides in from the side.
// While it works, a pen draws a looping handwritten stroke (3 seconds), then the reply is written in
// sentence by sentence with an ink-dry wipe. Everything animates transform / opacity / clip-path only, and the
// reply keeps its final size from the first frame, so nothing reflows or jitters.
// ───────────────────────────────────────────────────────────────────────────────

const THINK_MS = 3000;
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const WRITING_LINES = ["Looking through the ledger…", "Asking around the atelier…", "Writing your reply…"];
const WHATSAPP = "https://wa.me/919680478483";
const GOLD_INK = "#7A5710"; // gold that passes contrast on paper

type Msg = { id: number; role: "user" | "agent"; text: string; pending?: boolean };

/** The circular gold orb: a slowly turning gold ring around a dark core. */
function Orb({ size = 36, mode = "idle" }: { size?: number; mode?: "idle" | "thinking" }) {
  const reduce = useReducedMotion();
  const spin = mode === "thinking" ? 1.3 : 9;
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }} aria-hidden>
      <motion.span
        className="absolute rounded-full"
        style={{ inset: "-28%", background: "radial-gradient(circle, rgba(241,202,133,0.5) 0%, rgba(201,151,58,0.16) 45%, transparent 70%)" }}
        animate={reduce ? undefined : { scale: mode === "thinking" ? [1, 1.2, 1] : [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: mode === "thinking" ? 0.9 : 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: "conic-gradient(from 0deg, #F8DDA8, #C9973A, #6B4C2A, #E8B96A, #F8DDA8)" }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: spin, repeat: Infinity, ease: "linear" }}
      />
      <span className="absolute rounded-full" style={{ inset: size * 0.13, background: "radial-gradient(circle at 35% 28%, #3B2D1F 0%, #130F0B 72%)" }} />
      <span
        className="absolute rounded-full"
        style={{ left: size * 0.3, top: size * 0.26, width: size * 0.17, height: size * 0.17, background: "rgba(255,244,214,0.95)", boxShadow: "0 0 8px rgba(255,236,190,0.85)" }}
      />
    </span>
  );
}

/** What shows during the 3-second pause: the orb spins faster while a status line changes. */
function Writing() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => Math.min(n + 1, WRITING_LINES.length - 1)), THINK_MS / WRITING_LINES.length);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div role="status" aria-label="Writing your reply" className="flex items-center gap-4 border-l-2 pl-4 py-1" style={{ borderColor: "rgba(201,151,58,0.6)" }}>
      <span className="px-2"><Orb size={30} mode="thinking" /></span>
      <span className="relative h-6 min-w-[200px] overflow-hidden" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500, fontSize: 18, color: "var(--grey-ink)" }}>
        <AnimatePresence initial={false}>
          <motion.span
            key={i}
            className="absolute left-0 top-0 whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            {WRITING_LINES[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}

const toSentences = (text: string) =>
  text.split("\n").flatMap((line) => {
    if (!line.trim()) return [];
    const out: string[] = [];
    let cur = "";
    for (const w of line.split(" ")) {
      cur += (cur ? " " : "") + w;
      if (/[.!?]$/.test(w) && !/^\d+\.$/.test(w)) { out.push(cur); cur = ""; }
    }
    if (cur) out.push(cur);
    return out;
  });

/** The reply, written in one sentence at a time with an ink-dry wipe. Each sentence is already in the DOM at
    full size (just clipped), so the bubble never grows while it plays. */
function Written({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const parts = toSentences(text);
  if (reduce) return <>{parts.map((p, i) => <span key={i} className="block mb-2 last:mb-0">{p}</span>)}</>;
  let t = 0.05;
  return (
    <>
      {parts.map((p, i) => {
        const dur = Math.min(1, 0.35 + p.length * 0.0055);
        const delay = t;
        t += dur * 0.6;
        return (
          <motion.span
            key={i}
            className="block mb-2 last:mb-0"
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.25 }}
            animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            transition={{ duration: dur, delay, ease: "easeOut" }}
          >
            {p}
          </motion.span>
        );
      })}
    </>
  );
}

// The chat panel only. It is opened/closed by FloatingDock (which owns the launcher button).
export default function AiHelpAgent({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const timers = useRef<number[]>([]);
  const reduce = useReducedMotion();
  // phone = full page that slides in; desktop = centred sheet that unrolls (decided at the moment it opens)
  const mobile = useMemo(() => open && window.matchMedia("(max-width: 767px)").matches, [open]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  // Android back button: push history state when chat opens,
  // intercept popstate to close chat instead of navigating away
  useEffect(() => {
    if (open) {
      window.history.pushState({ chatOpen: true }, "");
      const handlePopState = () => onClose();
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [open, onClose]);

  const handleClose = useCallback(() => {
    onClose();
    if (window.history.state?.chatOpen) window.history.back();
  }, [onClose]);

  // Locking page scroll re-lays-out the whole page, so it must not happen in the middle of the open / close animation:
  // lock before the first frame is painted, release only after the exit animation has finished.
  const unlockRef = useRef<(() => void) | null>(null);
  const unlock = useCallback(() => { unlockRef.current?.(); unlockRef.current = null; }, []);
  useLayoutEffect(() => {
    if (!open || unlockRef.current) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    // Hiding the scrollbar would widen the page by its width and nudge everything sideways, so hold that width.
    // (Set directly on the few elements involved: a custom property or attribute on <html> would restyle the whole page.)
    const sw = window.innerWidth - html.clientWidth;
    const header = document.querySelector<HTMLElement>("header");
    const dock = document.querySelector<HTMLElement>("nav[aria-label=\"Quick contact\"]");
    if (sw > 0) { html.style.paddingRight = sw + "px"; if (header) header.style.right = sw + "px"; if (dock) dock.style.marginRight = sw + "px"; }
    html.style.overflow = "hidden";
    unlockRef.current = () => { html.style.overflow = prev; html.style.paddingRight = ""; if (header) header.style.right = ""; if (dock) dock.style.marginRight = ""; };
  }, [open]);
  useEffect(() => unlock, [unlock]);

  // While the desk is open: Escape closes, and on desktop the box is ready to type in
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    const focusTimer = window.matchMedia("(pointer: fine)").matches ? window.setTimeout(() => inputRef.current?.focus(), 500) : 0;
    return () => { window.clearTimeout(focusTimer); window.removeEventListener("keydown", onKey); };
  }, [open, handleClose]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [msgs, reduce]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const uid = nextId.current++;
    const aid = nextId.current++;
    setMsgs((m) => [...m, { id: uid, role: "user", text: q }, { id: aid, role: "agent", text: "", pending: true }]);
    setInput("");
    setBusy(true);
    timers.current.push(
      window.setTimeout(() => {
        setMsgs((m) => m.map((x) => (x.id === aid ? { ...x, text: getResponse(q), pending: false } : x)));
        setBusy(false);
      }, THINK_MS),
    );
  };

  const reset = () => { if (!busy) setMsgs([]); };

  const asked = new Set(msgs.filter((m) => m.role === "user").map((m) => m.text));
  const followUps = suggestedQuestions.filter((q) => !asked.has(q)).slice(0, 3);
  const last = msgs[msgs.length - 1];

  const enter = mobile
    ? { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: { type: "spring" as const, stiffness: 300, damping: 34 } }
    : {
        // transform + opacity only: composited on the GPU, so opening never repaints the large panel
        initial: { opacity: 0, y: 18, scale: 0.975 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.985 },
        transition: { duration: 0.42, ease: EASE },
      };

  return (
    <AnimatePresence onExitComplete={unlock}>
      {open && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(14,10,7,0.62)" }}
            aria-hidden
          />
          <div className="fixed inset-0 z-[61] flex items-center justify-center md:p-8 pointer-events-none">
            <motion.div
              key="desk"
              role="dialog"
              aria-modal="true"
              aria-label="INS Assistant — ask INS Overseas"
              {...enter}
              className="pointer-events-auto relative flex flex-col overflow-hidden bg-cream text-ink w-full h-full md:h-[min(720px,calc(100vh-64px))] md:max-w-[640px] md:rounded-[28px]"
              style={{ boxShadow: "0 30px 70px -28px rgba(0,0,0,0.7)", willChange: "transform, opacity" }}
            >
              {/* header: ink band with a torn paper edge */}
              <div
                className="relative shrink-0 bg-ink text-cream px-5 sm:px-7 pb-10"
                style={{ paddingTop: "max(20px, env(safe-area-inset-top))", backgroundImage: "radial-gradient(90% 140% at 100% 0%, rgba(201,151,58,0.2) 0%, transparent 60%)" }}
              >
                <div className="flex items-center gap-4">
                  <Orb size={42} />
                  <div className="flex-1 min-w-0">
                    <h3 className="leading-none text-cream" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 25, letterSpacing: "0.01em" }}>INS Assistant</h3>
                    <p className="mt-1.5" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 12.5, color: "rgba(250,247,240,0.72)" }}>Ask us about orders, samples and shipping</p>
                  </div>
                  {msgs.length > 0 && (
                    <button onClick={reset} disabled={busy} aria-label="Start a new chat" className="w-10 h-10 rounded-full flex items-center justify-center text-cream/85 hover:bg-white/10 disabled:opacity-40 transition-colors">
                      <RotateCcw size={17} />
                    </button>
                  )}
                  <button onClick={handleClose} aria-label="Close chat" className="w-10 h-10 rounded-full flex items-center justify-center text-cream hover:bg-white/10 transition-colors" style={{ boxShadow: "inset 0 0 0 1px rgba(250,247,240,0.28)" }}>
                    <X size={18} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-cream torn-edge-bottom" aria-hidden />
              </div>

              {/* the page */}
              <div ref={scroller} data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7 pb-4" aria-live="polite">
                {msgs.length === 0 ? (
                  <div className="pt-2 pb-2">
                    <motion.h4
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
                      className="text-ink"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(32px, 6vw, 40px)", lineHeight: 1.05, letterSpacing: "-0.01em" }}
                    >
                      How may we <em className="italic font-light" style={{ color: "#6B4C2A" }}>help?</em>
                    </motion.h4>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.5 }}
                      className="mt-3 max-w-md"
                      style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 15, lineHeight: 1.6, color: "var(--grey-ink)" }}
                    >
                      Pick a question below, or write your own at the bottom of the page.
                    </motion.p>
                    <div className="mt-6 border-t border-ink/12" style={{ borderColor: "rgba(26,20,16,0.12)" }}>
                      {suggestedQuestions.slice(0, 4).map((q, i) => (
                        <motion.button
                          key={q}
                          type="button"
                          onClick={() => send(q)}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.55, ease: EASE, delay: 0.6 + i * 0.08 }}
                          className="group w-full flex items-center gap-4 py-4 text-left border-b active:bg-black/[0.03] transition-colors"
                          style={{ borderColor: "rgba(26,20,16,0.12)" }}
                        >
                          <span className="w-6 shrink-0 tabular-nums" style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em", color: GOLD_INK }}>{String(i + 1).padStart(2, "0")}</span>
                          <span className="flex-1 text-ink" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 21, lineHeight: 1.2 }}>{q}</span>
                          <ArrowUpRight size={18} className="shrink-0 text-umber transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 pt-3">
                    {msgs.map((m) =>
                      m.role === "user" ? (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, x: 24, scale: 0.97 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 340, damping: 30 }}
                          className="self-end max-w-[84%] rounded-2xl rounded-br-sm px-4 py-2.5 bg-umber text-cream"
                          style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 15, lineHeight: 1.45 }}
                        >
                          {m.text}
                        </motion.div>
                      ) : (
                        <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                          <p className="mb-2 uppercase" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10, letterSpacing: "0.22em", color: GOLD_INK }}>INS Assistant</p>
                          {m.pending ? (
                            <Writing />
                          ) : (
                            <div data-answer className="border-l-2 pl-4" style={{ borderColor: "#C9973A", fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 15.5, lineHeight: 1.7, color: "var(--ink)" }}>
                              <Written text={m.text} />
                            </div>
                          )}
                        </motion.div>
                      ),
                    )}

                    {!busy && last?.role === "agent" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }} className="pl-4">
                        <p className="mb-1 uppercase" style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10, letterSpacing: "0.22em", color: "var(--grey-ink)" }}>You might also ask</p>
                        {followUps.map((q) => (
                          <button
                            key={q}
                            data-followup
                            type="button"
                            onClick={() => send(q)}
                            className="group w-full flex items-center gap-3 py-3 text-left border-t active:bg-black/[0.03]"
                            style={{ borderColor: "rgba(26,20,16,0.12)", fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 14.5, color: "#4A3219" }}
                          >
                            <span className="flex-1">{q}</span>
                            <ArrowUpRight size={16} className="shrink-0 text-umber transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </button>
                        ))}
                        <a
                          href={WHATSAPP}
                          target="_blank"
                          rel="noreferrer"
                          className="group w-full flex items-center gap-3 py-3 border-t"
                          style={{ borderColor: "rgba(26,20,16,0.12)", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14.5, color: "#4A3219" }}
                        >
                          <span className="flex-1">Talk to a person on WhatsApp</span>
                          <ArrowUpRight size={16} className="shrink-0 text-umber transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* write here */}
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="shrink-0 px-5 sm:px-7 pt-3 border-t bg-cream"
                style={{ borderColor: "rgba(26,20,16,0.12)", paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
              >
                <div className="flex items-end gap-3">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={busy}
                    placeholder={busy ? "One moment…" : "Write your question…"}
                    aria-label="Type your question"
                    className="flex-1 min-w-0 bg-transparent py-3 border-b-2 text-ink placeholder:text-[#7A6F62] focus:outline-none focus:border-[#6B4C2A] transition-colors disabled:opacity-60"
                    style={{ borderColor: "rgba(26,20,16,0.28)", fontFamily: "var(--font-body)", fontSize: 16 }}
                  />
                  <button
                    type="submit"
                    disabled={busy || !input.trim()}
                    aria-label="Send"
                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-umber text-cream hover:bg-umber-dark transition-all active:scale-90 disabled:opacity-35"
                  >
                    <ArrowUp size={19} strokeWidth={2.2} />
                  </button>
                </div>
                <p className="mt-2.5" style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--grey-ink)" }}>
                  Replies are automated. For anything specific, WhatsApp us.
                </p>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
