// The words on the pages, written once. The page components render from here AND scripts/prerender-seo.mjs puts the same words
// into each page's HTML for crawlers, so the two can never disagree. Keep it plain data (no imports): the build script reads it directly.
// (Search-engine titles and descriptions are in seoPages.ts; menus are in siteNav.ts.)
import { collectionMoq, LOWEST_MOQ, moqValue } from "./moq";

/** A heading whose second part is set in italics: { plain: "Partner With", em: "INS Overseas" } */
export type Heading = { plain: string; em?: string };
/** A short block of words under its own heading (see components/shared/InfoSection.tsx) */
export type InfoBlock = {
  title: string;
  p?: string[];
  links?: [string, string][];
  items?: { label: string; text: string; to: string }[];
};
export const headingText = (h: Heading) => (h.em ? `${h.plain} ${h.em}` : h.plain);
/** `{MOQ}` inside a sentence is the lowest minimum order, filled in from moq.ts by both the page and the build script */
export const fillTokens = (s: string, t: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (m, k) => (k in t ? String(t[k]) : m));

// ── Wholesale ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
export const wholesaleCopy = {
  eyebrow: "For Wholesale Buyers",
  h1: { plain: "Partner With", em: "INS Overseas" } as Heading,
  lead: "Manufacturer of handmade leather journals, cotton rag paper and artisan gift products in Sanganer, Jaipur. Minimum orders start from {MOQ} units and vary by product. Export to 40+ countries since 1995.",
  stats: [
    ["{MOQ}", "Units MOQ, from"],
    ["30", "Years exporting"],
    ["40+", "Countries served"],
    ["25+", "Artisans"],
  ] as [string, string][],
  why: { eyebrow: "Why Us", h2: { plain: "Why Source From", em: "INS Overseas" } as Heading },
  usps: ["30 Years Experience", "Export to 40+ Countries", "MOQ from {MOQ} Units", "Custom OEM Available", "Recycled Cotton Paper", "Handmade in Sanganer"],
  process: { eyebrow: "The Process", h2: { plain: "How It", em: "Works" } as Heading },
  steps: ["Send Enquiry", "Receive Catalogue & Pricing", "Sample Approval", "Place Order (30% advance)", "Production & Delivery (3–4 weeks)"],
  expect: {
    eyebrow: "What to Expect",
    h2: { plain: "Before You", em: "Order" } as Heading,
    blocks: [
      {
        title: "What we make",
        p: ["We manufacture handmade leather journals, leather bags and handmade paper products, in a wide range of styles, sizes and customisation options. Minimum orders start from {MOQ} units and depend on the product (see the table above). Browse the collections:"],
        links: [["Leather Journals", "/products/leather-journals"], ["Handmade Paper", "/products/handmade-paper"], ["Artisan Stationery", "/products/stationery"], ["Leather Accessories", "/products/leather-accessories"]],
      },
      {
        title: "Customisation and private label",
        p: ["Add your logo by debossing, embossing, gold or silver foil stamping or screen printing. Custom leather colours, hardware finishes and sizes are available, and so is fully branded packaging: boxes, tissue paper with your logo, ribbon, hang tags and labels. There is no minimum order for packaging when it is ordered with a product order. Custom and private-label orders are confirmed in your quote."],
      },
      {
        title: "Samples",
        p: ["Product samples are free of charge; you only pay the shipping cost. Custom samples with your logo or design are ready within 10 days of receiving your complete brief and logo files."],
      },
      {
        title: "Payment, production and shipping",
        p: [
          "Standard terms are 30% advance on order confirmation and 70% when the goods are ready for shipment. We accept SWIFT bank transfer, PayPal, Wise and Letter of Credit for large orders, in USD, EUR and GBP.",
          "Production takes 25 days after order confirmation and payment. After dispatch, air freight takes 7 to 10 days and sea freight 35 to 40 days. We ship worldwide and have export experience across 40+ countries.",
        ],
      },
      {
        title: "Documents and quality",
        p: ["We provide a Commercial Invoice, Packing List and Certificate of Origin, and further documents on request. Before every shipment we send photos and videos of the finished goods for your approval, and we dispatch once you confirm. Import duties and customs clearance at the destination are the buyer's responsibility."],
      },
    ] as InfoBlock[],
  },
  // the table of minimum orders by product (the numbers come from moq.ts)
  moqTable: {
    eyebrow: "Minimum Orders",
    h2: { plain: "By", em: "Product" } as Heading,
    intro: "Minimum order depends on the product. Custom and private-label orders are confirmed in your quote.",
    head: ["Product", "Minimum order"],
  },
  register: { eyebrow: "Register", h2: { plain: "Wholesale", em: "Registration" } as Heading },
};

// ── About ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────
export const aboutCopy = {
  eyebrow: "About Us",
  h1: { plain: "Four Generations of", em: "Handmade Paper from Sanganer" } as Heading,
  subtitle: "A four-generation legacy of handcrafted paper and gift products — born in Sanganer, Jaipur. Exported worldwide.",
  intro: [
    "INS Overseas is a manufacturer and exporter of handmade paper and premium handmade gift products from Sanganer, Jaipur. Our journey began in a single small room, where our great-grandfather started this craft with deep dedication and respect for nature.",
    "Today, with four generations of experience, we proudly meet large global demands with consistent quality. We create a wide range of handmade products — journals, seed papers, ornaments, paper bags, handmade sheets, and gift boxes — crafted using natural and recycled materials that do not harm the environment.",
    "Our brand stands for premium quality, customer satisfaction, ethical standards, and sustainable craftsmanship. Rooted in tradition yet driven by innovation, INS Overseas carries forward a legacy of eco-friendly paper-making that connects our heritage with a greener future.",
  ],
  vision: {
    label: "Our Vision",
    h3: "Trusted Maker of Sustainable Handmade Paper",
    text: "To be a trusted maker of sustainable, recycled handmade paper and premium gift paper products — setting benchmarks in quality, innovation, and eco-conscious manufacturing while preserving the rich heritage of papermaking and promoting a greener tomorrow.",
  },
  mission: {
    label: "Our Mission",
    h3: "Crafting Excellence, Honouring Tradition",
    list: [
      "Manufacture and export high-quality, eco-friendly handcrafted paper products that inspire creativity and sustainability.",
      "Serve customers with unmatched service, value, and reliability through continuous innovation.",
      "Uphold strong ethical standards, care for our artisans, and contribute to a cleaner planet.",
      "Honour the legacy of traditional papermaking while adopting modern methods to meet growing global demand.",
    ],
  },
  why: { eyebrow: "Why Choose Us", h2: { plain: "Built on Trust.", em: "Proven by Quality." } as Heading },
  values: [
    { title: "Made in Sanganer", text: "Cotton rag paper and gift products made by hand in Sanganer, Jaipur, and supplied to wholesale buyers in 40+ countries." },
    { title: "Eco-Friendly", text: "Our papers are crafted entirely from recycled cotton — an environmentally conscious solution that delivers premium quality without compromising the planet." },
    { title: "Premium Quality", text: "From soft textures to precision-bound journals, every product upholds the standard of excellence our global clients have trusted for over three decades." },
    { title: "Trusted Exporter", text: "Recognised globally for reliability, consistency, and outstanding service. We proudly export to clients across 40+ countries who continue to place repeat orders." },
  ],
  setsApart: "What Sets Us Apart",
  whyUs: [
    "Four generations of handmade cotton paper craft",
    "Four-generation family craft rooted in Sanganer, Jaipur",
    "100% recycled cotton rag — no wood pulp",
    "Wide range: journals, seed papers, gift boxes, ornaments, paper bags, handmade sheets",
    "Consistent quality across small samples and large bulk orders",
    "Competitive pricing with no compromise on craftsmanship",
    "Trusted by boutique retailers, corporates and designers in 40+ countries",
  ],
  location: {
    eyebrow: "Our Location",
    h2: { plain: "Rooted in", em: "Sanganer" } as Heading,
    text: "Jain Nasiya Road, Near Jain Hostel, Sanganer, Jaipur – 302029, Rajasthan, India. Trade buyers and visitors welcome by appointment.",
  },
};

// ── The craft process (on Our Craft and on the homepage) ──────────────────────────────────────────────────────────────────
export const craftProcessCopy = {
  eyebrow: "The Craft Process",
  count: "05 steps",
  line1: "From Raw Cotton to",
  line2: "Finished Journal",
  intro: "Five hand-done steps, from Jaipur's cotton rags to a journal on your shelf.",
  steps: [
    { title: "Cotton Rag Sourcing", text: "Leftover cotton rags from Jaipur's textile mills are collected, sorted, and cleaned — no trees, no wood pulp." },
    { title: "Manual Vat Pulling", text: "Artisans dip molds into cotton pulp vats, lifting each sheet by hand. Every page is unique — the deckle edges are natural, never cut." },
    { title: "Sun Drying", text: "Freshly pulled sheets are laid on raised frames under the Rajasthan sun. Natural light and heat give the paper its warmth and texture." },
    { title: "Leather Binding", text: "Full-grain buffalo leather is cut, burnished, and hand-stitched around signatures of dried paper. Brass hardware is hand-fitted." },
    { title: "Quality & Export", text: "Every journal is inspected, wrapped in tissue, boxed, and dispatched — from Sanganer to shelves across 40+ countries." },
  ],
};

// ── Our Craft ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
export const ourCraftCopy = {
  eyebrow: "The Atelier",
  h1: { plain: "The Craft,", em: "Step by Step" } as Heading,
  subtitle: "Walk through our Sanganer workspace — from cotton-rag pulping to leather binding to global export.",
  journey: { eyebrow: "Our Journey", h2: { plain: "Three Decades,", em: "One Atelier" } as Heading },
  timeline: [
    ["1995", "Founded in a single workspace in Sanganer, Jaipur."],
    ["2000", "First overseas order shipped — a stationery boutique in London."],
    ["2005", "Expanded to leather journal production."],
    ["2010", "Reached 20 countries. Custom OEM line launched."],
    ["2020", "Crossed 40 countries served, 5,000+ products shipped."],
    ["2025", "895,700+ products. New atelier wing for accessories."],
  ] as [string, string][],
};

// ── The sustainability teaser (on Sustainability and on the homepage) ─────────────────────────────────────────────────────
export const sustainabilityTeaserCopy = {
  eyebrow: "Sustainability",
  quote: "\"No trees were harmed in making this page.\"",
  link: "Our Sustainability Commitment",
  creds: [
    { title: "100% Cotton Rag Paper", text: "Made from recycled cotton rag. No wood pulp." },
    { title: "Pulped From Cotton Rags", text: "Rags are cleaned, pulped and pulled into sheets by hand. No wood pulp is used." },
    { title: "Offcuts Back Into the Pulp", text: "Scraps from our binding floor return to the pulp." },
  ],
};

// ── Sustainability ────────────────────────────────────────────────────────────────────────────────────────────────────────
export const sustainabilityCopy = {
  eyebrow: "Sustainability",
  h1: { plain: "Making Beautiful Things", em: "Without Costing the Earth" } as Heading,
  subtitle: "Every sheet of paper we make starts as discarded cotton from Jaipur's textile mills.",
  intro: [
    "Our paper starts as cotton offcuts from Jaipur's textile mills. We collect them, clean them, pulp them, and pull each sheet by hand into paper of remarkable warmth and texture.",
    "No wood pulp is used. Every sheet is pulled by hand, and every offcut from our binding floor returns to the pulp.",
  ],
  impact: { eyebrow: "Our Impact", h2: { plain: "By the", em: "Numbers" } as Heading },
  stats: [
    { value: "0", label: "Trees Cut" },
    { value: "100%", label: "Recycled Cotton Rag Paper" },
  ],
};

// ── Contact ───────────────────────────────────────────────────────────────────────────────────────────────────────────────
export const contactCopy = {
  eyebrow: "Get in Touch",
  h1: { plain: "Let's", em: "Talk" } as Heading,
  subtitle: "Wholesale, custom orders, samples or just a conversation — we respond within 24 hours.",
  channels: [
    { label: "WhatsApp", sub: "Fastest response", href: "https://wa.me/919680478483", cta: "Open WhatsApp" },
    { label: "Email", sub: "Detailed enquiries", href: "mailto:Sezan@ins-overseas.com", cta: "Send Email" },
    { label: "Call", sub: "Mon–Sat", href: "tel:+919680478483", cta: "Call Now" },
  ],
};
// the dark "Let's Begin a Conversation" block with the enquiry form (on Contact and on the homepage)
export const contactStripCopy = {
  eyebrow: "Get in Touch",
  h2: { plain: "Let's Begin a", em: "Conversation" } as Heading,
  address: "Jain Nasiya Road, Near Jain Hostel, Sanganer, Jaipur – 302029, Rajasthan, India",
  phone: "+91 96804 78483",
  phoneHref: "tel:+919680478483",
  email: "Sezan@ins-overseas.com",
  hours: "Mon – Sat",
};

// ── Manufacturing, Gallery, Journal ───────────────────────────────────────────────────────────────────────────────────────
export const manufacturingCopy = {
  eyebrow: "Our Workspace",
  h1: { plain: "Made in", em: "Sanganer" } as Heading,
  subtitle: "Videos and photographs from inside our Jaipur workspace — where every journal and every sheet of paper is made by hand.",
};
export const manufacturingInfo: InfoBlock[] = [
  {
    title: "Made by hand in Sanganer",
    p: ["Artisans dip molds into vats of cotton pulp and lift each sheet by hand. The deckle edges are natural, never cut, and the sheets dry in the Rajasthan sun. Leather is cut, burnished and hand-stitched around signatures of dried paper, with brass hardware hand-fitted."],
  },
  { title: "How we bind", p: ["We bind with three traditional methods: Coptic, long stitch and saddle stitch."] },
  {
    title: "Checked before it ships",
    p: ["Every journal is inspected, wrapped in tissue, boxed and dispatched. We check every production stage and send photos and videos of the finished goods before shipment."],
  },
  {
    title: "Visit us",
    p: ["Trade buyers and visitors are welcome by appointment at Jain Nasiya Road, Near Jain Hostel, Sanganer, Jaipur – 302029. Contact us to arrange a visit."],
    links: [["Contact us", "/contact"]],
  },
];
export const contactInfo: InfoBlock[] = [
  {
    title: "What to send us",
    p: ["To start a custom order, tell us the product type, size, leather colour, paper type, hardware finish and the quantity you need, and send your logo in vector format (AI, EPS or high-resolution PDF) with Pantone or CMYK colour references."],
  },
  {
    title: "What happens next",
    p: ["We reply within 24 hours and send our catalogue and pricing within 24 hours of your enquiry. Product samples are free of charge (you pay the shipping), and custom samples are ready within 10 days of a complete brief."],
  },
  { title: "Where we are", p: ["Jain Nasiya Road, Near Jain Hostel, Sanganer, Jaipur – 302029, Rajasthan, India. We are available Monday to Saturday."] },
  {
    title: "More answers",
    p: ["Read the wholesale questions and answers, or the wholesale page for minimum orders and terms."],
    links: [["Wholesale questions and answers", "/faq"], ["Wholesale", "/wholesale"]],
  },
];
export const galleryInfo: InfoBlock[] = [
  {
    title: "About these photos",
    p: ["Photographs and videos from our workshop in Sanganer, Jaipur, and of the pieces we make by hand: leather journals, handmade paper, gift boxes and bags, and leather accessories."],
  },
  {
    title: "Browse by collection",
    items: [
      { label: "Leather Journals", text: "Full-grain buffalo leather, hand-stitched bindings, deckle-edge pages", to: "/products/leather-journals" },
      { label: "Handmade Paper", text: "100% cotton rag, tree-free, fountain pen & watercolour friendly", to: "/products/handmade-paper" },
      { label: "Artisan Stationery", text: "Greeting cards, envelopes, paper bags — luxury gifting essentials", to: "/products/stationery" },
      { label: "Leather Accessories", text: "Crossbody bags, travel journals, corporate leather gifts", to: "/products/leather-accessories" },
    ],
  },
  { title: "See how it is made", p: ["Watch the videos on the Manufacturing page."], links: [["Manufacturing", "/manufacturing"]] },
];
const u = (key: string) => `${moqValue(key).toLocaleString("en-US")} units`; // e.g. "1,000 units", read from moq.ts
const ASK = "Tell us what you need and we will confirm samples and pricing.";
export const collectionCopy: Record<string, { label: string; h1: Heading; subtitle: string; blocks: InfoBlock[] }> = {
  "/products/leather-journals": {
    label: "Leather Journals",
    h1: { plain: "Custom leather journals,", em: "hand-stitched in Jaipur" },
    subtitle: "Full-grain buffalo and goat leather, bound around deckle-edge cotton paper and stitched by hand in Sanganer.",
    blocks: [
      {
        title: "How our leather journals are made",
        p: ["Each journal starts as handmade cotton rag paper, pulled by hand and dried in the Rajasthan sun. The leather is cut, burnished and hand-stitched around signatures of dried paper, and brass hardware is hand-fitted. We bind with three traditional methods: Coptic, long stitch and saddle stitch."],
      },
      {
        title: "Custom branding and private label",
        p: ["Add your logo by debossing, embossing, gold or silver foil stamping or screen printing. Custom leather colours, hardware finishes, sizes and packaging (branded boxes, tissue paper, ribbon) are available, and private label orders are welcome."],
      },
      {
        title: "Sizes and ordering",
        p: [`Journals are made in A4, A5, A6 and pocket sizes, and custom sizes can be made. Minimum order: leather journals from ${u("leather-journals")}. Custom and private-label orders are confirmed in your quote. ${ASK}`],
        links: [["How our journals are made", "/manufacturing"], ["Wholesale and private label", "/wholesale"], ["Care guide for leather journals", "/journal/leather-journal-care-guide"]],
      },
    ],
  },
  "/products/handmade-paper": {
    label: "Handmade Paper",
    h1: { plain: "Handmade cotton rag and", em: "deckle edge paper" },
    subtitle: "Cotton rag paper made by hand in Sanganer, Jaipur: tree-free, bleed-resistant and made for fountain pens and watercolour.",
    blocks: [
      {
        title: "What it is made from",
        p: ["Our paper is made from cotton rags, the leftover offcuts of Jaipur's textile mills, collected, cleaned and pulped. No trees are used."],
      },
      {
        title: "How it is made",
        p: ["Artisans dip molds into vats of cotton pulp and lift each sheet by hand. The deckle edges are natural, never cut, and the sheets dry in the sun."],
      },
      {
        title: "Deckle edge paper and seed paper",
        p: [`This collection includes deckle edge paper in cotton rag, from 120 to 300 gsm, and plantable seed paper with wildflower seeds. Minimum orders: handmade paper from ${u("handmade-paper")} and seed paper from ${u("handmade-seed-paper")}. Deckle edge paper is confirmed in your quote. ${ASK}`],
        links: [["The art of deckle edges", "/journal/art-of-deckle-edges"], ["Choosing paper for fountain pens and watercolour", "/journal/paper-fountain-pen-vs-watercolour"], ["Wholesale and private label", "/wholesale"]],
      },
    ],
  },
  "/products/stationery": {
    label: "Artisan Stationery",
    h1: { plain: "Gift boxes, gift bags and", em: "artisan stationery" },
    subtitle: "Greeting cards, envelopes, paper bags and gift boxes, made by hand in our Jaipur workshop.",
    blocks: [
      {
        title: "What we make",
        p: ["Handmade paper gift boxes with gold foil accents and paper gift bags with ribbon handles, both made from recycled cotton paper, plus greeting cards and envelopes."],
      },
      {
        title: "Branded packaging",
        p: ["Fully custom packaging is available, with your logo on boxes, tissue paper, ribbon and hang tags."],
      },
      {
        title: "Ordering",
        p: [`Minimum orders: gift boxes from ${u("handmade-paper-gift-box")}, gift bags from ${u("handmade-paper-gift-bag")} and greeting cards from ${u("greeting-cards")}. ${ASK} Looking for seed paper? See Handmade Paper.`],
        links: [["Handmade paper", "/products/handmade-paper"], ["Wholesale and private label", "/wholesale"]],
      },
    ],
  },
  "/products/leather-accessories": {
    label: "Leather Accessories",
    h1: { plain: "Leather bags and accessories,", em: "made in Jaipur" },
    subtitle: "Crossbody bags, totes, portfolios and corporate gifts in full-grain leather with hand-fitted brass hardware.",
    blocks: [
      {
        title: "What we make",
        p: ["Crossbody bags, totes and pouches in full-grain leather, plus travel journals and corporate leather gifts."],
      },
      {
        title: "Branding and ordering",
        p: [`Logo debossing, embossing and foil stamping, and custom leather colours and hardware finishes are available. Minimum order: leather bags from ${u("leather-bags")}. ${ASK}`],
        links: [["Leather journals", "/products/leather-journals"], ["Wholesale and private label", "/wholesale"]],
      },
    ],
  },
};

export const galleryCopy = {
  eyebrow: "Our Work",
  h1: { plain: "From Our", em: "Workspace" } as Heading,
  subtitle: "Handcrafted leather journals and artisan paper products made in Sanganer, Jaipur.",
};
export const journalCopy = {
  eyebrow: "The Journal",
  h1: { plain: "Stories From", em: "Sanganer" } as Heading,
  subtitle: "Essays on handmade paper, leather craft, Rajasthani heritage, and guides for retailers and collectors.",
};

// ── FAQ ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────
export const faqCopy = {
  eyebrow: "Support",
  h1: { plain: "Frequently Asked", em: "Questions" } as Heading,
  subtitle: "Everything you need to know before placing your first order.",
};
export const faqGroups: { cat: string; items: [string, string][] }[] = [
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
        "Our paper is made entirely by hand using a traditional process passed down through four generations of our family in Sanganer, Jaipur. We use 100% recycled cotton sourced from textile industry offcuts from Tirupur, Bengaluru, and Punjab — completely tree-free, with no wood pulp.",
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
        `Minimum order depends on the product, from ${LOWEST_MOQ} units. See the list on our Wholesale page. Custom and private-label orders are confirmed in your quote.`,
      ],
      [
        "Can I mix different products to reach the MOQ?",
        "Minimums apply per product. If you want to combine products, tell us and we will confirm in your quote.",
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
        "1) Share your brief — product type, size, leather color, paper type, logo files\n2) We confirm specs and send a quotation\n3) Custom sample produced in ~10 days\n4) You approve the sample\n5) 30% advance payment\n6) Production in 25 days with step-by-step photo/video updates\n7) 70% balance when goods are ready\n8) Dispatch with tracking details shared",
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
        "Standard terms are 30% advance on order confirmation, and 70% balance when goods are ready for shipment.",
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
        "Production takes 25 days after order confirmation and payment. After dispatch: by air (DHL/FedEx/UPS) — 7 to 10 days worldwide. By sea freight (LCL/FCL) — 35 to 40 days.",
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
        "100% yes. Our handmade paper is made from recycled cotton rags sourced from textile offcuts from Tirupur, Bengaluru, and Punjab. No trees are cut and no wood pulp is used. Every sheet is hand-pulled in our Sanganer workshop.",
      ],
      [
        "Where is your leather sourced?",
        "Our leather is ethically sourced from Kanpur and Chennai — India's established leather-producing regions. We use chrome-free leather, making it safer for artisans and more environmentally responsible.",
      ],
      [
        "Do you have certifications?",
        "We hold an IEC (Import Export Code) as a registered Indian exporter and are registered under MSME/Udyam. Our paper is made from recycled cotton rag, not wood pulp.",
      ],
      [
        "How long has your family been making paper?",
        "Sanganer has been a papermaking town for centuries, and our family has practised handmade paper-making there for four generations. INS Overseas was founded in 1995 and has been exporting since then. We are a four-generation family business.",
      ],
    ],
  },
];

// ── Homepage ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
export const homeCopy = {
  hero: {
    eyebrow: "Handcrafted in Jaipur since 1995",
    line1: "Where Every Page",
    line2: "Tells a",
    em: "Story",
    lead: "Premium handmade leather journals, artisan stationery and eco-conscious paper — crafted by Rajasthani artisans, shipped to 40+ countries.",
    cta1: "Explore Collection",
    cta2: "Wholesale Enquiry",
  },
  // the four numbers under the hero (value is counted up on screen; plain = a year, no thousands separator)
  trust: [
    { label: "Established", value: 1995, suffix: "", prefix: "EST. ", plain: true },
    { label: "Countries Served", value: 40, suffix: "+" },
    { label: "Years of Craft", value: 30, suffix: "" },
    { label: "Products Shipped", value: 895700, suffix: "+" },
  ] as { label: string; value: number; suffix?: string; prefix?: string; plain?: boolean }[],
  collections: {
    eyebrow: "Our Collections",
    line1: "Crafted With",
    line2: "Intention",
    intro: "Leather, handmade paper and artisan stationery, made by hand in Jaipur and shipped worldwide.",
    cards: [
      { title: "Leather Journals", desc: "Full-grain buffalo leather, hand-stitched bindings, deckle-edge pages", to: "/products/leather-journals", moq: String(collectionMoq("/products/leather-journals")) },
      { title: "Handmade Paper", desc: "100% cotton rag, tree-free, fountain pen & watercolour friendly", to: "/products/handmade-paper", moq: String(collectionMoq("/products/handmade-paper")) },
      { title: "Artisan Stationery", desc: "Greeting cards, envelopes, paper bags — luxury gifting essentials", to: "/products/stationery", moq: String(collectionMoq("/products/stationery")) },
      { title: "Leather Accessories", desc: "Crossbody bags, travel journals, corporate leather gifts", to: "/products/leather-accessories", moq: String(collectionMoq("/products/leather-accessories")) },
    ],
  },
  heritage: {
    eyebrow: "Our Story",
    h2: { plain: "Thirty Years of", em: "Rajasthani Craft" } as Heading,
    paragraphs: [
      "Founded in 1995 in Sanganer — the historic papermaking heart of Jaipur — INS Overseas was built on a simple belief: that handcrafted objects carry a spirit no machine can replicate.",
      "For three decades, our artisans have worked the same manual vats, pulled the same cotton-rag sheets, and hand-stitched the same leather spines that have made Rajasthan's craft legacy world-famous.",
      "Today, our journals and papers travel to boutique retailers, artists, and designers across 40+ countries — carrying a little piece of Jaipur with them.",
    ],
    link: "Read Our Full Story",
  },
  bestsellers: { eyebrow: "Bestsellers", line1: "Most Loved", line2: "This Season", intro: "Six pieces from our collection. Ask for pricing and samples on any of them.", link: "See all products" },
  handpicked: { eyebrow: "Handpicked", line1: "Fresh From", line2: "The Workshop", intro: "A few pieces we are especially proud of right now. Ask for pricing and samples on any of them.", link: "See all products" },
  globalReach: {
    eyebrow: "Global Reach",
    count: "40+ countries",
    line1: "Crafted in Jaipur.",
    line2: "Loved in 40+ Countries.",
    intro: "Wholesale orders leave Sanganer by air and by sea, to buyers across Europe, the UK, the USA, the Middle East and Asia-Pacific.",
    stats: [
      { value: 40, suffix: "+", label: "Countries" },
      { value: 3, label: "Continents" },
      { value: 1995, label: "Since", group: false },
      { value: 895700, suffix: "+", label: "Products Shipped" },
    ] as { value: number; suffix?: string; label: string; group?: boolean }[],
  },
  ordering: {
    eyebrow: "How Ordering Works",
    count: "09 steps",
    line1: "From Brief",
    line2: "To Your Door",
    intro: "Clear steps, clear terms. You always know what happens next.",
    link: "Start your order",
    phases: [
      { title: "Brief & Quote", steps: [
        { t: "Share your brief and logo files", d: "Tell us the product, quantity and branding you have in mind." },
        { t: "We confirm specs and send a quote", d: "Pricing depends on specs, quantity and customisation." },
      ] },
      { title: "Sample & Approval", steps: [
        { t: "Custom sample in about 10 days", d: "Made with your logo or design.", chip: "~10 days" },
        { t: "You approve the sample", d: "Check the quality, colour and finish in hand." },
        { t: "30% advance payment", d: "30% now, 70% when goods are ready.", chip: "30%" },
      ] },
      { title: "Production & Shipping", steps: [
        { t: "Production in 25 days", d: "Handmade in Sanganer, Jaipur.", chip: "25 days" },
        { t: "Photos and video as it is made", d: "Step-by-step updates, so you see your order take shape." },
        { t: "70% balance when goods are ready", d: "Paid before we dispatch.", chip: "70%" },
        { t: "We dispatch and share tracking", d: "Air 7–10 days, sea 35–40 days.", chip: "Tracked" },
      ] },
    ] as { title: string; steps: { t: string; d: string; chip?: string }[] }[],
  },
  wholesaleCta: {
    eyebrow: "For Wholesale Buyers",
    h2: { plain: "Your Next Bestseller", em: "Starts in Jaipur" } as Heading,
    text: "Join 500+ retailers worldwide who source handcrafted leather and paper goods from INS Overseas. Request our full wholesale catalogue with pricing, MOQ details, and custom options.",
    request: "Request Catalogue",
    whatsapp: "WhatsApp Us",
    call: "Book a Call",
  },
  manufacturing: {
    eyebrow: "Inside Our Workspace",
    h2: { plain: "See How We", em: "Make Everything" } as Heading,
    text: "From recycled cotton rags pulled into handmade paper sheets, to buffalo leather hand-stitched around every journal spine — watch the full process in our Sanganer workspace.",
    stats: [["25+", "Artisans"], ["4", "Generations"], ["30", "Years exporting"]] as [string, string][],
    link: "Watch & Explore",
  },
  faq: {
    eyebrow: "Common Questions",
    h2: { plain: "Before You", em: "Place Your First Order" } as Heading,
    link: "View All FAQs",
    items: [
      { q: "What is your minimum order quantity?", a: `Minimum order depends on the product, from ${LOWEST_MOQ} units. See the list on our Wholesale page. Custom and private-label orders are confirmed in your quote.` },
      { q: "Do you offer samples before placing a bulk order?", a: "Yes — product samples are free of charge. You only pay the shipping cost to your location. Custom samples with your logo take approximately 10 days to produce." },
      { q: "How long does production and delivery take?", a: "Production takes 25 days after order confirmation and payment. Delivery after dispatch: 7–10 days by air (DHL/FedEx), 35–40 days by sea freight." },
      { q: "Can you add our logo to the products?", a: "Yes. We offer debossing, embossing, foil stamping (gold/silver), and screen printing. We also do fully custom packaging — branded boxes, tissue paper, ribbon, and hang tags." },
      { q: "Which payment methods and currencies do you accept?", a: "We accept SWIFT wire transfer, PayPal, and Wise. Currencies: USD, EUR, and GBP. Standard terms are 30% advance on order confirmation, 70% when goods are ready to ship." },
    ],
  },
  instagram: { eyebrow: "Follow Our Journey", handle: "@ins_overseas", follow: "Follow on Instagram" },
  blog: { eyebrow: "The Journal", line1: "Notes From", line2: "The Workshop Floor", intro: "Stories on leather, paper and the people who make them.", link: "Read the journal" },
};

// ── Products ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
export const productsCopy = {
  eyebrow: "The Collection",
  h1: { plain: "Every Piece,", em: "Handmade" } as Heading,
  subtitle: "A curated catalogue of journals, papers, stationery and leather goods — crafted in Jaipur, shipped worldwide.",
};
