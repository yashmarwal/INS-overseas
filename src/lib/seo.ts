/**
 * Shared SEO utility for TanStack Router head() functions.
 *
 * Usage:
 *   import { buildPageHead, buildJsonLd } from "@/lib/seo";
 *
 *   export const Route = createFileRoute("/my-page")({
 *     head: () => buildPageHead({
 *       title: "My Page | INS Overseas",
 *       description: "...",
 *       canonical: "https://ins-overseas.com/my-page",
 *       schema: { "@type": "WebPage", ... },
 *     }),
 *   });
 */

export const SITE_NAME = "INS Overseas";
export const SITE_URL = "https://ins-overseas.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const DEFAULT_OG_IMAGE_ALT =
  "INS Overseas — Handmade leather journals and eco-friendly paper from Sanganer, Jaipur";
export const TWITTER_HANDLE = "@ins_overseas";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Organization reference — use in schema `publisher`, `author`, etc.
 */
export const ORG_REF = { "@id": ORG_ID };

/**
 * Build a TanStack Router head() return value.
 * Emits: title, description, canonical, OG, Twitter, optional JSON-LD.
 */
export function buildPageHead({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = DEFAULT_OG_IMAGE_ALT,
  ogType = "website",
  schema,
}: {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
}) {
  const meta = [
    { title },
    { name: "description", content: description },
    // Open Graph
    { property: "og:type", content: ogType },
    { property: "og:url", content: canonical },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: ogImageAlt },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_IN" },
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: TWITTER_HANDLE },
    { name: "twitter:creator", content: TWITTER_HANDLE },
    { name: "twitter:url", content: canonical },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:image:alt", content: ogImageAlt },
  ];

  const links = [{ rel: "canonical", href: canonical }];

  const scripts = schema
    ? [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            Array.isArray(schema)
              ? { "@context": "https://schema.org", "@graph": schema }
              : { "@context": "https://schema.org", ...schema },
            null,
            0,
          ),
        },
      ]
    : [];

  return { meta, links, scripts };
}

/**
 * Build a BreadcrumbList schema.
 * Items: [{ name, url }]
 */
export function buildBreadcrumb(
  items: { name: string; url: string }[],
): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    "@id": `${items[items.length - 1]?.url}#breadcrumb`,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}
