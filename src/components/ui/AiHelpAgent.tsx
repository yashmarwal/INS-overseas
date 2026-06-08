import { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// ── Morphing trigger button ───────────────────────────────────────────────────
function MorphButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  const [showLeaf, setShowLeaf] = useState(true);

  useEffect(() => {
    if (open) return;
    const interval = setInterval(() => setShowLeaf(prev => !prev), 2000);
    return () => clearInterval(interval);
  }, [open]);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-40 w-[56px] h-[56px] rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
      style={{ background: "#6B4C2A" }}
      aria-label="Ask INS Overseas"
    >
      {/* Pulsing ring — only when closed */}
      {!open && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: "rgba(107,76,42,0.4)" }}
          animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <X size={20} color="#FAF7F0" />
          </motion.div>
        ) : showLeaf ? (
          <motion.div
            key="leaf"
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <motion.path
                d="M12 2C6 2 3 7 3 12C3 17 7 21 12 21C17 21 21 17 21 12C21 7 16 2 12 2Z"
                fill="#C9973A"
                opacity={0.25}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <path
                d="M12 3C12 3 5 6 5 13C5 17.4 8.1 20.5 12 21C12 21 7 14 12 9C12 9 17 14 12 21C15.9 20.5 19 17.4 19 13C19 6 12 3 12 3Z"
                fill="#FAF7F0"
              />
              <motion.line
                x1="12" y1="21" x2="12" y2="23"
                stroke="#C9973A"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              />
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="ask"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center leading-none"
          >
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 15, color: "#FAF7F0", letterSpacing: "0.05em" }}>
              Ask
            </span>
            <motion.span
              style={{ display: "block", height: 1, background: "#C9973A", width: 0 }}
              animate={{ width: 20 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

type Msg = { role: "user" | "agent"; text: string };

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

export default function AiHelpAgent() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "agent",
      text: "Hello — I'm here to help with anything about INS Overseas. Pick a question below or type your own.",
    },
  ]);
  const [input, setInput] = useState("");

  // Android back button: push history state when chat opens,
  // intercept popstate to close chat instead of navigating away
  useEffect(() => {
    if (open) {
      window.history.pushState({ chatOpen: true }, "");
      const handlePopState = () => setOpen(false);
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    if (window.history.state?.chatOpen) window.history.back();
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }, { role: "agent", text: getResponse(text) }]);
    setInput("");
  };

  return (
    <>
      <MorphButton open={open} onClick={() => setOpen(o => !o)} />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-40 bg-cream border border-warm-grey-light shadow-2xl flex flex-col
              inset-x-0 bottom-0 rounded-t-2xl
              md:inset-x-auto md:bottom-24 md:left-6 md:w-[320px] md:h-[440px] md:rounded-none"
            style={{
              height: "72vh",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            <div className="md:hidden flex justify-center pt-2 pb-1">
              <span className="block h-1 w-8 rounded-full bg-warm-grey/50" />
            </div>
            <div className="p-4 border-b border-warm-grey-light/40 bg-parchment">
              <h3
                className="text-ink text-lg"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                Ask INS Overseas
              </h3>
              <p className="text-[10px] tracking-[0.15em] uppercase text-warm-grey mt-1">
                Powered by AI
              </p>
            </div>
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              style={{ overscrollBehavior: "contain" }}
            >
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`text-sm leading-relaxed whitespace-pre-line ${
                    m.role === "agent"
                      ? "text-umber-dark"
                      : "text-cream bg-umber px-3 py-2 ml-8 self-end"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {msgs.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestedQuestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-[11px] uppercase tracking-[0.08em] border border-umber/30 text-umber px-3 py-1.5 hover:bg-umber hover:text-cream transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-warm-grey-light/40 p-3 flex gap-2 shrink-0"
              style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a question…"
                className="flex-1 bg-transparent border-b border-warm-grey/40 px-1 py-2 text-sm focus:outline-none focus:border-gold"
              />
              <button type="submit" className="text-umber hover:text-gold" aria-label="Send">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
