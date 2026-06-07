import { useState } from "react";
import { Feather, X, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
      "We don't publish prices publicly as they depend on product specs, quantity, and customisation. We'll send you our complete price list and catalogue within 24 hours of your enquiry. WhatsApp us at +91 96804 78483 or email info@insoverseas.com to request it.",
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
      "You can reach us anytime:\n📱 WhatsApp: +91 96804 78483\n📧 Email: info@insoverseas.com\nWe're available Monday to Saturday. We typically respond within a few hours.",
  },
  {
    keywords: ["hours", "open", "working hours", "available", "saturday", "sunday"],
    response:
      "We are available 24 hours, Monday to Saturday. WhatsApp us at +91 96804 78483 or email info@insoverseas.com anytime.",
  },
  {
    keywords: ["order", "start", "begin", "first step", "how to order", "place order", "get started"],
    response:
      "Getting started is easy:\n1. WhatsApp us at +91 96804 78483 or fill the enquiry form on our website\n2. We send you our full catalogue and price list within 24 hours\n3. Request free samples if you'd like to check quality first\n4. Confirm your order and pay 50% advance\n5. Production in 30 days — we keep you updated with photos throughout\n6. Pay balance and we ship to your door with tracking",
  },
];

const fallbackResponse =
  "Thank you for your question! For the most accurate answer, please reach out to our team directly:\n📱 WhatsApp: +91 96804 78483\n📧 Email: info@insoverseas.com\nWe respond within a few hours, Monday to Saturday.";

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

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }, { role: "agent", text: getResponse(text) }]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-40 w-[52px] h-[52px] rounded-full bg-umber text-cream flex items-center justify-center shadow-2xl hover:bg-umber-dark transition-colors"
        aria-label="Ask INS Overseas"
      >
        {open ? <X size={20} /> : <Feather size={20} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-40 bg-cream border border-warm-grey-light shadow-2xl flex flex-col
              inset-x-0 bottom-0 h-[72vh] rounded-t-2xl
              md:inset-x-auto md:bottom-24 md:left-6 md:w-[320px] md:h-[440px] md:rounded-none"
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
              className="border-t border-warm-grey-light/40 p-3 flex gap-2"
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
