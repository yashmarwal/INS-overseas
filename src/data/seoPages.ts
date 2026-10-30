// The ONE place every page's search-engine text lives: <title>, description, share-card title, breadcrumb name.
// Read by the page routes (their head()) AND by scripts/prerender-seo.mjs (the HTML Google receives), so the two can never disagree.
// Keep this file plain data (no imports): the prerender script loads it directly.
//
// Limits (the build fails if they are broken): title <= 60 characters, description <= 155 characters.
// `modified` is the date the page's content last really changed; the sitemap's <lastmod> comes from it. Update it when you edit a page.

export type SeoPage = {
  title: string;
  description: string;
  /** shown when the page is shared (WhatsApp, LinkedIn…); defaults to `title` */
  ogTitle?: string;
  /** a full address, or a path on this site such as "/about-hero.jpg"; defaults to the site-wide share image */
  ogImage?: string;
  /** the name in the breadcrumb trail */
  crumb?: string;
  /** kept out of search results and out of the sitemap */
  noindex?: boolean;
  /** YYYY-MM-DD */
  modified: string;
};

export const seoPages: Record<string, SeoPage> = {
  "/": {
    title: "Handmade Leather Journals & Paper Wholesale | INS Overseas",
    description:
      "Handmade leather journals, cotton rag paper and seed paper from Sanganer, Jaipur. Wholesale and private label, exported to 40+ countries since 1995.",
    ogTitle: "INS Overseas — Handmade Leather Journals & Paper Wholesale",
    crumb: "Home",
    modified: "2026-10-30",
  },
  "/products": {
    title: "Wholesale Leather Journals, Paper & Gifts | INS Overseas",
    description:
      "Browse handmade leather journals, seed paper, gift boxes, gift bags and leather bags made in Jaipur. Request a wholesale catalogue and samples.",
    ogTitle: "Wholesale Leather Journals, Paper & Gifts — INS Overseas",
    crumb: "Products",
    modified: "2026-10-30",
  },
  "/wholesale": {
    title: "Wholesale & Private Label Journals | INS Overseas",
    description:
      "Wholesale and private label handmade journals, paper and gifts from Jaipur. Minimum orders vary by product. Export to 40+ countries. Request our catalogue.",
    ogTitle: "Wholesale & Private Label — Partner With INS Overseas",
    crumb: "Wholesale",
    modified: "2026-10-30",
  },
  "/about": {
    title: "About INS Overseas | Handmade Paper Makers Since 1995",
    description:
      "Four generations of handmade paper makers in Sanganer, Jaipur. How INS Overseas makes cotton rag paper and leather journals, and exports them worldwide.",
    ogTitle: "About INS Overseas — Four Generations of Handmade Paper",
    ogImage: "/about-hero.jpg",
    crumb: "About",
    modified: "2026-10-30",
  },
  "/contact": {
    title: "Contact INS Overseas | Wholesale Enquiries, Jaipur",
    description:
      "Request a catalogue, samples or a quote. WhatsApp +91 96804 78483 or email Sezan@ins-overseas.com. Based in Sanganer, Jaipur, India.",
    ogTitle: "Contact INS Overseas — Wholesale Enquiries",
    crumb: "Contact",
    modified: "2026-10-30",
  },
  "/our-craft": {
    title: "Our Craft: Handmade Paper & Leather Journals | INS Overseas",
    description:
      "From recycled cotton rags to finished leather journals: the traditional Sanganer papermaking process, practised across four generations.",
    ogTitle: "Our Craft — Traditional Sanganer Papermaking",
    crumb: "Our Craft",
    modified: "2026-10-30",
  },
  "/sustainability": {
    title: "Sustainable Handmade Paper | INS Overseas Jaipur",
    description:
      "Handmade paper made from recycled cotton rag, not wood pulp. How INS Overseas works responsibly in Sanganer, Jaipur.",
    ogTitle: "Sustainable Handmade Paper — INS Overseas",
    crumb: "Sustainability",
    modified: "2026-10-30",
  },
  "/gallery": {
    title: "Gallery: Handmade Journals & Workshop Photos | INS Overseas",
    description:
      "Photos and videos from our Sanganer, Jaipur workshop: handcrafted leather journals, seed paper, gift boxes and artisan stationery.",
    ogTitle: "Gallery — INS Overseas Workshop & Products",
    crumb: "Gallery",
    modified: "2026-10-30",
  },
  "/faq": {
    title: "Wholesale FAQ: MOQ, Samples, Shipping | INS Overseas",
    description:
      "Answers on MOQ, samples, shipping, custom orders and payment for wholesale orders from INS Overseas, Jaipur.",
    ogTitle: "Wholesale Questions, Answered — INS Overseas",
    crumb: "FAQ",
    modified: "2026-10-30",
  },
  "/manufacturing": {
    title: "How Our Journals Are Made | INS Overseas Jaipur Workshop",
    description:
      "See how INS Overseas makes handmade leather journals and cotton rag paper in its Sanganer, Jaipur workshop. Videos and photos from the floor.",
    ogTitle: "How Our Journals Are Made — INS Overseas Workshop",
    crumb: "Manufacturing",
    modified: "2026-10-30",
  },
  "/journal": {
    title: "The Journal: Craft Stories from Sanganer | INS Overseas",
    description:
      "Essays on handmade paper, leather binding and Rajasthani craft, plus care guides and a wholesale sourcing guide from INS Overseas.",
    ogTitle: "The INS Overseas Journal — Craft Stories & Jaipur Heritage",
    crumb: "Journal",
    modified: "2026-10-30",
  },
  "/products/leather-journals": {
    title: "Custom Leather Journals Wholesale | INS Overseas",
    description:
      "Custom leather journals, hand-stitched in Jaipur from full-grain buffalo and goat leather with deckle edge cotton paper. Wholesale and private label.",
    ogTitle: "Custom Leather Journals, Hand-Stitched in Jaipur",
    crumb: "Leather Journals",
    modified: "2026-10-30",
  },
  "/products/handmade-paper": {
    title: "Cotton Rag & Deckle Edge Paper Wholesale | INS Overseas",
    description:
      "Handmade cotton rag, deckle edge and plantable seed paper from Sanganer, Jaipur. Wholesale supply for stationers and brands.",
    ogTitle: "Handmade Cotton Rag & Deckle Edge Paper — INS Overseas",
    crumb: "Handmade Paper",
    modified: "2026-10-30",
  },
  "/products/stationery": {
    title: "Gift Boxes, Gift Bags & Stationery Wholesale | INS Overseas",
    description:
      "Handmade paper gift boxes, gift bags, greeting cards and envelopes made in Jaipur. Custom branded packaging and wholesale supply.",
    ogTitle: "Gift Boxes, Gift Bags & Artisan Stationery — INS Overseas",
    crumb: "Artisan Stationery",
    modified: "2026-10-30",
  },
  "/products/leather-accessories": {
    title: "Leather Accessories Wholesale from Jaipur | INS Overseas",
    description:
      "Crossbody bags, portfolios, totes and corporate gifts in full-grain leather with brass hardware, made in Jaipur. Wholesale supply.",
    ogTitle: "Leather Bags & Accessories, Made in Jaipur — INS Overseas",
    crumb: "Leather Accessories",
    modified: "2026-10-30",
  },
  "/privacy-policy": {
    title: "Privacy Policy | INS Overseas",
    description: "How INS Overseas handles information sent through its enquiry forms and website.",
    crumb: "Privacy Policy",
    noindex: true,
    modified: "2026-10-29",
  },
  "/terms-of-use": {
    title: "Terms of Use | INS Overseas",
    description: "The terms for using the INS Overseas website.",
    crumb: "Terms of Use",
    noindex: true,
    modified: "2026-10-29",
  },
};

export const SEO_LIMITS = { title: 60, description: 155 } as const;
