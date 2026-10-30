// The site's menus, written once. The header (Navigation.tsx), the footer (Footer.tsx) and the crawler-readable copy of both that
// scripts/prerender-seo.mjs puts in every page's HTML all read this file. Keep it plain data (no imports).

export const MAIN_NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/our-craft", label: "Our Craft" },
  { to: "/manufacturing", label: "Manufacturing" },
  { to: "/gallery", label: "Gallery" },
  { to: "/sustainability", label: "Sustainability" },
  { to: "/wholesale", label: "Wholesale" },
  { to: "/contact", label: "Contact" },
] as const;

// The phone menu has room for one more entry than the desktop pill: the Journal sits right after the Gallery.
export const MOBILE_NAV = [...MAIN_NAV.slice(0, 6), { to: "/journal", label: "Journal" }, ...MAIN_NAV.slice(6)] as const;

export const FOOTER_COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Products",
    links: [
      ["Leather Journals", "/products/leather-journals"],
      ["Handmade Paper", "/products/handmade-paper"],
      ["Artisan Stationery", "/products/stationery"],
      ["Leather Accessories", "/products/leather-accessories"],
      ["Custom Orders", "/wholesale"],
      ["Wholesale Catalogue", "/wholesale"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Us", "/about"],
      ["Our Craft", "/our-craft"],
      ["Sustainability", "/sustainability"],
      ["Gallery", "/gallery"],
      ["Journal", "/journal"],
      ["Contact", "/contact"],
    ],
  },
];

export const LEGAL_LINKS: [string, string][] = [
  ["Privacy Policy", "/privacy-policy"],
  ["Terms of Use", "/terms-of-use"],
];

/** What the footer prints under "Contact" (the PDF catalogue's COMPANY data has the same address on two lines) */
export const FOOTER_CONTACT = {
  addressLines: ["Jain Nasiya Road, Near Jain Hostel,", "Sanganer, Jaipur – 302029", "Rajasthan, India"],
  phone: "+91 96804 78483",
  phoneHref: "tel:+919680478483",
  email: "Sezan@ins-overseas.com",
  hours: "Mon–Sat",
};
