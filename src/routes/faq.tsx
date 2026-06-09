import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import PageHero from "@/components/shared/PageHero";

const groups: { cat: string; items: [string, string][] }[] = [
  {
    cat: "Products & Materials",
    items: [
      [
        "What are your main product categories?",
        "We manufacture three main categories: Handmade Leather Journals, Leather Bags, and Handmade Paper Products. Within these, we offer a wide range of styles, sizes, and customisation options to suit every buyer's requirements.",
      ],
      [
        "What leather do you use for your journals?",
        'We use genuine buffalo leather for all our journals and bags. Standard sizes are 7"×5", 8"×6", and 7"×10" — and we can manufacture any custom size as per your requirement. Leather is ethically sourced from Kanpur and Chennai and is chrome-free.',
      ],
      [
        "How is your handmade paper made?",
        "Our paper is made entirely by hand using a traditional process passed down through four generations of our family in Sanganer, Jaipur. We use 100% recycled cotton sourced from textile industry offcuts from Tirupur, Bengaluru, and Punjab — completely tree-free and chemical-free.",
      ],
      [
        "Is your paper suitable for fountain pens and watercolour?",
        "Yes. Our 100% cotton rag paper is naturally bleed-resistant and handles both fountain pen ink and watercolour paints beautifully. Many of our global buyers are artists, calligraphers, and stationery brands who source our paper specifically for this quality.",
      ],
      [
        "What customisation options are available?",
        "We offer full customisation: logo debossing, embossing, foil stamping (gold/silver), screen printing, custom leather colors, custom hardware finishes, custom sizes, and fully branded packaging including boxes, tissue paper, and ribbon.",
      ],
      [
        "What is your bestselling product?",
        "Our Handmade Leather Journals are our most popular product globally, followed closely by our Handmade Deckle Edge Paper sheets.",
      ],
    ],
  },
  {
    cat: "Orders & Pricing",
    items: [
      [
        "What is the minimum order quantity (MOQ)?",
        "Our MOQ for standard wholesale orders is 300 pieces per design. For custom/OEM orders with your logo or specific design, the MOQ is 500 pieces.",
      ],
      [
        "Can I mix different products to reach the MOQ?",
        "Yes. You are welcome to mix different products across our catalogue to reach the minimum order quantity — for example, leather journals, paper notebooks, and bags can be combined in one order.",
      ],
      [
        "How do I get pricing?",
        "We share our full price list with buyers after enquiry — prices vary by product specs, quantity, and customisation. Contact us via WhatsApp or the enquiry form and we'll send our complete catalogue and pricing within 24 hours.",
      ],
      [
        "Do you offer discounts for repeat orders?",
        "Yes — repeat buyers receive a 5% discount on all subsequent orders. For large volume or long-term partnerships, we are open to discussing additional arrangements.",
      ],
      [
        "Do you offer samples?",
        "Yes. Product samples are free of charge — you only pay the shipping cost to your location. Custom samples (with your logo or design) take approximately 10 days to produce.",
      ],
      [
        "Do you attend trade fairs or exhibitions?",
        "Yes — we exhibit at EPCH and the IHGF Delhi Fair, India's largest handicraft export fairs. Contact us for our upcoming schedule.",
      ],
    ],
  },
  {
    cat: "Custom Orders",
    items: [
      [
        "How does the custom order process work?",
        "1) Share your brief — product type, size, leather color, paper type, logo files\n2) We confirm specs and send a quotation\n3) Custom sample produced in ~10 days\n4) You approve the sample\n5) 50% advance payment\n6) Production in 30 days with step-by-step photo/video updates\n7) 50% balance before shipment\n8) Dispatch with tracking details shared",
      ],
      [
        "How long does a custom sample take?",
        "Custom samples are ready within 10 days of receiving your complete brief and logo files.",
      ],
      [
        "What files do I need to send for a custom order?",
        "Please send: your logo in vector format (AI, EPS, or high-res PDF), Pantone or CMYK color references, product dimensions if non-standard, paper type preference, leather color, hardware finish, and required quantity.",
      ],
      [
        "Can you do custom packaging?",
        "Yes — fully branded boxes, tissue paper with your logo, ribbon, hang tags, and labels. No minimum order quantity for packaging when ordered alongside a product order.",
      ],
    ],
  },
  {
    cat: "Payment",
    items: [
      [
        "What are your payment terms?",
        "Standard terms are 50% advance on order confirmation, and 50% balance when goods are ready for shipment.",
      ],
      [
        "What payment methods do you accept?",
        "We accept SWIFT bank wire transfer, PayPal, Wise (formerly TransferWise), and Letter of Credit (LC) for large orders.",
      ],
      [
        "Which currencies do you accept?",
        "We accept USD (US Dollar), EUR (Euro), and GBP (British Pound).",
      ],
      [
        "Do you offer different terms for large orders?",
        "Yes — for large or long-term orders we are open to discussing flexible payment arrangements. Please reach out to discuss.",
      ],
    ],
  },
  {
    cat: "Shipping & Delivery",
    items: [
      [
        "How long does production and delivery take?",
        "Production begins 30 days after order confirmation and payment. After dispatch: by air (DHL/FedEx/UPS) — 7 to 10 days worldwide. By sea freight (LCL/FCL) — 35 to 40 days.",
      ],
      [
        "Which shipping methods do you use?",
        "DHL, FedEx, and UPS for air freight. Sea freight LCL (Less than Container Load) or FCL (Full Container Load) for larger orders. India Post/EMS for smaller shipments.",
      ],
      [
        "Do you ship to all countries?",
        "Yes — we ship worldwide with no country restrictions. We have active export experience across 40+ countries.",
      ],
      [
        "Who pays import duties and customs?",
        "Import duties and customs clearance at the destination are the buyer's responsibility. We provide all required export documentation to make clearance straightforward.",
      ],
      [
        "What export documents do you provide?",
        "We provide Commercial Invoice, Packing List, and Certificate of Origin. Additional documents required by your customs authority are available on request.",
      ],
      [
        "Do you provide shipment tracking?",
        "Yes — once dispatched, we share the tracking number directly so you can monitor your shipment in real time.",
      ],
    ],
  },
  {
    cat: "Quality & Returns",
    items: [
      [
        "What is your quality control process?",
        "We conduct thorough checks at every production stage. Before shipment, we send step-by-step photos and videos of finished goods for your approval. We only dispatch after you confirm you're satisfied.",
      ],
      [
        "Do you send photos before shipping?",
        "Yes — always. Detailed photos and videos of finished goods are sent before every shipment. Your approval is required before we dispatch.",
      ],
      [
        "What if I receive damaged or defective goods?",
        "We will remake and reship the affected pieces at no additional cost. We stand fully behind the quality of every order.",
      ],
      [
        "Do you accept returns?",
        "Yes — for manufacturing defects or goods significantly different from approved samples. Please contact us within 7 days of receiving your shipment.",
      ],
    ],
  },
  {
    cat: "Sustainability",
    items: [
      [
        "Is your paper eco-friendly?",
        "100% yes. Our handmade paper is made from recycled cotton rags sourced from textile offcuts from Tirupur, Bengaluru, and Punjab. No trees are cut. No harsh chemicals. Every sheet is hand-pulled in our Sanganer workshop.",
      ],
      [
        "Where is your leather sourced?",
        "Our leather is ethically sourced from Kanpur and Chennai — India's established leather-producing regions. We use chrome-free leather, making it safer for artisans and more environmentally responsible.",
      ],
      [
        "Do you have certifications?",
        "We hold an IEC (Import Export Code) as a registered Indian exporter and are registered under MSME/Udyam. Our paper-making process aligns with eco-friendly and fair trade principles.",
      ],
      [
        "How long has your family been making paper?",
        "Our family has practised handmade paper-making in Sanganer, Jaipur for over 400 years. INS Overseas has been formally exporting globally for 30 years. We are a four-generation family business.",
      ],
    ],
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Wholesale Orders, Shipping & Custom Products | INS Overseas" },
      { name: "description", content: "Answers to the most common wholesale questions about INS Overseas — MOQ, shipping, custom orders, payment, lead times, certifications and more." },
      { property: "og:title", content: "Frequently Asked Questions — INS Overseas" },
      { property: "og:url", content: "https://ins-overseas.com/faq" },
    ],
  }),
  component: FAQ,
});

function FAQ() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <PageHero
        eyebrow="Support"
        title={
          <>
            Frequently Asked{" "}
            <em className="italic font-light text-gold-light">Questions</em>
          </>
        }
        subtitle="Everything you need to know before placing your first order."
      />
      <section className="bg-cream py-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-14">
          {groups.map((g) => (
            <div key={g.cat}>
              <h2
                className="text-xs uppercase text-gold mb-6"
                style={{ letterSpacing: "0.25em" }}
              >
                {g.cat}
              </h2>
              <ul className="border-t border-warm-grey-light">
                {g.items.map(([q, a]) => {
                  const id = `${g.cat}-${q}`;
                  const isOpen = open === id;
                  return (
                    <li key={q} className="border-b border-warm-grey-light">
                      <button
                        onClick={() => setOpen(isOpen ? null : id)}
                        className="w-full flex items-center justify-between gap-4 py-5 text-left"
                      >
                        <span
                          className="text-ink text-lg"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 500,
                          }}
                        >
                          {q}
                        </span>
                        {isOpen ? (
                          <Minus
                            size={18}
                            className="text-umber shrink-0"
                          />
                        ) : (
                          <Plus size={18} className="text-umber shrink-0" />
                        )}
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="pb-6 text-umber-dark leading-relaxed whitespace-pre-line">
                              {a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
