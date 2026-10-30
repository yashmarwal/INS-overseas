// What a crawler (or a reader without scripts) gets as the body of each page: the page's headings, its words and links to related pages.
// It is built from the same copy.ts / seoPages.ts the pages themselves render from. scripts/prerender-seo.mjs turns this into HTML.
import {
  wholesaleCopy, aboutCopy, craftProcessCopy, ourCraftCopy, sustainabilityTeaserCopy, sustainabilityCopy,
  contactInfo, manufacturingInfo, galleryInfo, collectionCopy, type InfoBlock,
  contactCopy, contactStripCopy, manufacturingCopy, galleryCopy, journalCopy, faqCopy, faqGroups, homeCopy, productsCopy, headingText, fillTokens,
} from "./copy";
import { LOWEST_MOQ, MOQ_TABLE, moqValue } from "./moq";
import { posts } from "./blogPosts";
import { postParagraphs, isPostHeading } from "./postText";

export type ShellBlock = {
  h2?: string;
  p?: string[];
  list?: string[];
  ordered?: boolean;
  items?: { h3: string; p?: string; href?: string }[];
  links?: [string, string][];
};
export type ShellPage = { h1: string; lead?: string; blocks: ShellBlock[]; related?: [string, string][] };

const moq = { MOQ: LOWEST_MOQ };

const H = homeCopy;
// a block of words with its own heading becomes a section (items = its links with a line of text each)
const asBlocks = (list: InfoBlock[], fill: (t: string) => string = (t) => t): ShellBlock[] =>
  list.map((b) => ({
    h2: b.title,
    p: b.p?.map(fill),
    links: [...(b.links ?? []), ...(b.items ?? []).map((i) => [i.label, i.to] as [string, string])],
  }));
const craftBlock: ShellBlock = {
  h2: `${craftProcessCopy.line1} ${craftProcessCopy.line2}`,
  p: [craftProcessCopy.intro],
  items: craftProcessCopy.steps.map((s) => ({ h3: s.title, p: s.text })),
};
const sustainabilityBlock: ShellBlock = {
  h2: sustainabilityTeaserCopy.eyebrow,
  p: [sustainabilityTeaserCopy.quote],
  items: sustainabilityTeaserCopy.creds.map((c) => ({ h3: c.title, p: c.text })),
  links: [[sustainabilityTeaserCopy.link, "/sustainability"]],
};
const statText = (s: { value: number; suffix?: string; prefix?: string; plain?: boolean; group?: boolean }) =>
  `${s.prefix ?? ""}${s.plain || s.group === false ? s.value : s.value.toLocaleString("en-US")}${s.suffix ?? ""}`;
const collectionCards = H.collections.cards.map((c) => ({ h3: c.title, p: c.desc, href: c.to }));

export const shellPages: Record<string, ShellPage> = {
  "/": {
    h1: `${H.hero.line1} ${H.hero.line2} ${H.hero.em}.`,
    lead: H.hero.lead,
    blocks: [
      { links: [[H.hero.cta1, "/products"], [H.hero.cta2, "/wholesale"]] },
      { list: H.trust.map((s) => `${statText(s)} ${s.label}`) },
      { h2: `${H.collections.line1} ${H.collections.line2}`, p: [H.collections.intro], items: collectionCards },
      { h2: headingText(H.heritage.h2), p: H.heritage.paragraphs, links: [[H.heritage.link, "/about"]] },
      craftBlock,
      sustainabilityBlock,
      { h2: `${H.bestsellers.line1} ${H.bestsellers.line2}`, p: [H.bestsellers.intro], links: [[H.bestsellers.link, "/products"]] },
      { h2: `${H.handpicked.line1} ${H.handpicked.line2}`, p: [H.handpicked.intro], links: [[H.handpicked.link, "/products"]] },
      { h2: `${H.globalReach.line1} ${H.globalReach.line2}`, p: [H.globalReach.intro], list: H.globalReach.stats.map((s) => `${statText(s)} ${s.label}`) },
      {
        h2: `${H.ordering.line1} ${H.ordering.line2}`,
        p: [H.ordering.intro],
        items: H.ordering.phases.map((ph) => ({ h3: ph.title, p: ph.steps.map((s) => `${s.t}. ${s.d}`).join(" ") })),
        links: [[H.ordering.link, "/wholesale"]],
      },
      { h2: headingText(H.wholesaleCta.h2), p: [H.wholesaleCta.text], links: [[H.wholesaleCta.request, "/wholesale"], [H.wholesaleCta.call, "/contact"]] },
      { h2: headingText(H.manufacturing.h2), p: [H.manufacturing.text], list: H.manufacturing.stats.map(([n, l]) => `${n} ${l}`), links: [[H.manufacturing.link, "/manufacturing"]] },
      { h2: headingText(H.faq.h2), items: H.faq.items.map((i) => ({ h3: i.q, p: i.a })), links: [[H.faq.link, "/faq"]] },
      {
        h2: `${H.blog.line1} ${H.blog.line2}`,
        p: [H.blog.intro],
        items: posts.slice(0, 3).map((p) => ({ h3: p.title, p: p.excerpt, href: `/journal/${p.slug}` })),
        links: [[H.blog.link, "/journal"]],
      },
      {
        h2: headingText(contactStripCopy.h2),
        p: [contactStripCopy.address, contactStripCopy.hours],
        links: [[contactStripCopy.phone, contactStripCopy.phoneHref], [contactStripCopy.email, `mailto:${contactStripCopy.email}`]],
      },
    ],
    related: [
      ["About INS Overseas", "/about"],
      ["Our craft, step by step", "/our-craft"],
      ["Sustainable handmade paper", "/sustainability"],
      ["Gallery of our work", "/gallery"],
    ],
  },

  "/products": {
    h1: headingText(productsCopy.h1),
    lead: productsCopy.subtitle,
    blocks: [{ h2: "Collections", items: collectionCards }],
    related: [
      ["Wholesale and private label", "/wholesale"],
      ["How our journals are made", "/manufacturing"],
      ["Wholesale questions and answers", "/faq"],
      ["Contact INS Overseas", "/contact"],
    ],
  },

  "/contact": {
    h1: headingText(contactCopy.h1),
    lead: contactCopy.subtitle,
    blocks: [
      {
        h2: headingText(contactStripCopy.h2),
        p: [contactStripCopy.address, contactStripCopy.hours],
        links: [[contactStripCopy.phone, contactStripCopy.phoneHref], [contactStripCopy.email, `mailto:${contactStripCopy.email}`]],
      },
      { h2: contactCopy.eyebrow, items: contactCopy.channels.map((c) => ({ h3: c.label, p: c.sub, href: c.href })) },
      ...asBlocks(contactInfo),
    ],
    related: [
      ["Wholesale and private label", "/wholesale"],
      ["Browse the products", "/products"],
      ["Wholesale questions and answers", "/faq"],
      ["About INS Overseas", "/about"],
    ],
  },

  "/manufacturing": {
    h1: headingText(manufacturingCopy.h1),
    lead: manufacturingCopy.subtitle,
    blocks: asBlocks(manufacturingInfo),
    related: [
      ["Our craft, step by step", "/our-craft"],
      ["Gallery of our work", "/gallery"],
      ["Leather journals", "/products/leather-journals"],
      ["Handmade paper", "/products/handmade-paper"],
      ["Wholesale and private label", "/wholesale"],
    ],
  },

  "/gallery": {
    h1: headingText(galleryCopy.h1),
    lead: galleryCopy.subtitle,
    blocks: asBlocks(galleryInfo),
    related: [
      ["How our journals are made", "/manufacturing"],
      ["Browse the products", "/products"],
      ["Our craft, step by step", "/our-craft"],
      ["Contact INS Overseas", "/contact"],
    ],
  },

  "/faq": {
    h1: headingText(faqCopy.h1),
    lead: faqCopy.subtitle,
    blocks: faqGroups.map((g) => ({ h2: g.cat, items: g.items.map(([q, a]) => ({ h3: q, p: a })) })),
    related: [
      ["Wholesale and private label", "/wholesale"],
      ["Browse the products", "/products"],
      ["Contact INS Overseas", "/contact"],
    ],
  },

  "/journal": {
    h1: headingText(journalCopy.h1),
    lead: journalCopy.subtitle,
    blocks: [{ h2: "Articles", items: posts.map((p) => ({ h3: p.title, p: p.excerpt, href: `/journal/${p.slug}` })) }],
    related: [
      ["Our craft, step by step", "/our-craft"],
      ["Wholesale and private label", "/wholesale"],
      ["Browse the products", "/products"],
    ],
  },

  "/wholesale": {
    h1: headingText(wholesaleCopy.h1),
    lead: fillTokens(wholesaleCopy.lead, moq),
    blocks: [
      { h2: "In numbers", list: wholesaleCopy.stats.map(([n, l]) => `${fillTokens(n, moq)} ${l}`) },
      { h2: headingText(wholesaleCopy.why.h2), items: wholesaleCopy.usps.map((h3) => ({ h3: fillTokens(h3, moq) })) },
      { h2: headingText(wholesaleCopy.process.h2), list: wholesaleCopy.steps, ordered: true },
      {
        h2: `${wholesaleCopy.moqTable.eyebrow} ${headingText(wholesaleCopy.moqTable.h2)}`,
        p: [wholesaleCopy.moqTable.intro],
        list: MOQ_TABLE.map(([label, key]) => `${label}: ${moqValue(key).toLocaleString("en-US")} units`),
      },
      {
        h2: `${wholesaleCopy.expect.eyebrow} ${headingText(wholesaleCopy.expect.h2)}`,
        items: wholesaleCopy.expect.blocks.map((b) => ({ h3: b.title, p: fillTokens((b.p ?? []).join(" "), moq) })),
        links: wholesaleCopy.expect.blocks.flatMap((b) => b.links ?? []),
      },
      {
        h2: headingText(wholesaleCopy.register.h2),
        p: ["Register by email at Sezan@ins-overseas.com or on WhatsApp at +91 96804 78483 and we will send our catalogue."],
        links: [["Contact INS Overseas", "/contact"]],
      },
    ],
    related: [
      ["Browse the wholesale product range", "/products"],
      ["Leather journals for wholesale", "/products/leather-journals"],
      ["Handmade paper for wholesale", "/products/handmade-paper"],
      ["How our journals are made", "/manufacturing"],
      ["Wholesale questions and answers", "/faq"],
      ["About INS Overseas", "/about"],
    ],
  },

  "/about": {
    h1: headingText(aboutCopy.h1),
    lead: aboutCopy.subtitle,
    blocks: [
      { p: aboutCopy.intro },
      { h2: aboutCopy.vision.label, items: [{ h3: aboutCopy.vision.h3, p: aboutCopy.vision.text }] },
      { h2: aboutCopy.mission.label, items: [{ h3: aboutCopy.mission.h3 }], list: aboutCopy.mission.list },
      { h2: headingText(aboutCopy.why.h2), items: aboutCopy.values.map((v) => ({ h3: v.title, p: v.text })) },
      { h2: aboutCopy.setsApart, list: aboutCopy.whyUs },
      { h2: headingText(aboutCopy.location.h2), p: [aboutCopy.location.text] },
    ],
    related: [
      ["Our craft, step by step", "/our-craft"],
      ["How our journals are made", "/manufacturing"],
      ["Sustainable handmade paper", "/sustainability"],
      ["Wholesale and private label", "/wholesale"],
      ["Browse the products", "/products"],
      ["Contact INS Overseas", "/contact"],
    ],
  },

  "/our-craft": {
    h1: headingText(ourCraftCopy.h1),
    lead: ourCraftCopy.subtitle,
    blocks: [
      {
        h2: `${craftProcessCopy.line1} ${craftProcessCopy.line2}`,
        p: [craftProcessCopy.intro],
        items: craftProcessCopy.steps.map((s) => ({ h3: s.title, p: s.text })),
      },
      { h2: headingText(ourCraftCopy.journey.h2), list: ourCraftCopy.timeline.map(([y, t]) => `${y}: ${t}`) },
    ],
    related: [
      ["How our journals are made", "/manufacturing"],
      ["Leather journals", "/products/leather-journals"],
      ["Handmade paper", "/products/handmade-paper"],
      ["Sustainable handmade paper", "/sustainability"],
      ["About INS Overseas", "/about"],
      ["Wholesale and private label", "/wholesale"],
    ],
  },

  "/sustainability": {
    h1: headingText(sustainabilityCopy.h1),
    lead: sustainabilityCopy.subtitle,
    blocks: [
      { p: sustainabilityCopy.intro },
      { h2: sustainabilityTeaserCopy.eyebrow, p: [sustainabilityTeaserCopy.quote], items: sustainabilityTeaserCopy.creds.map((c) => ({ h3: c.title, p: c.text })) },
      { h2: headingText(sustainabilityCopy.impact.h2), list: sustainabilityCopy.stats.map((s) => `${s.value} ${s.label}`) },
    ],
    related: [
      ["Our craft, step by step", "/our-craft"],
      ["Handmade paper", "/products/handmade-paper"],
      ["Seed paper and eco stationery", "/products/stationery"],
      ["About INS Overseas", "/about"],
      ["Wholesale and private label", "/wholesale"],
    ],
  },
};

/** The page body for one journal post: its title, summary and text (headings found by the same rule the post page uses). */
export function postShell(slug: string): ShellPage {
  const post = posts.find((p) => p.slug === slug)!;
  const blocks: ShellBlock[] = [];
  let cur: ShellBlock = { p: [] };
  blocks.push(cur);
  for (const para of postParagraphs(post.content)) {
    if (isPostHeading(para)) { cur = { h2: para, p: [] }; blocks.push(cur); } else cur.p!.push(para);
  }
  const i = posts.findIndex((p) => p.slug === slug);
  const near = [posts[i - 1], posts[i + 1]].filter(Boolean).map((p) => [p.title, `/journal/${p.slug}`] as [string, string]);
  return {
    h1: post.title,
    lead: post.excerpt,
    blocks: blocks.filter((b) => b.h2 || b.p!.length),
    related: [...near, ["All journal articles", "/journal"], ["Wholesale and private label", "/wholesale"], ["Browse the products", "/products"]],
  };
}

// The four collection pages: their own heading, subtitle and text (the Products page shows the same words)
for (const c of H.collections.cards) {
  const cc = collectionCopy[c.to];
  shellPages[c.to] = {
    h1: headingText(cc.h1),
    lead: cc.subtitle,
    blocks: [{ h2: `About This Collection: ${cc.label}`, items: cc.blocks.map((b) => ({ h3: b.title, p: (b.p ?? []).join(" ") })), links: cc.blocks.flatMap((b) => b.links ?? []) }, { h2: "Collections", items: collectionCards }],
    related: [
      ["All products", "/products"],
      ["Wholesale and private label", "/wholesale"],
      ["How our journals are made", "/manufacturing"],
      ["Contact INS Overseas", "/contact"],
    ],
  };
}
