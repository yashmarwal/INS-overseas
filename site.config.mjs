// The ONE place the public address of the site is written. Everything else reads it from here:
// the page heads, the prerender script, the sitemaps, robots.txt, llms.txt, the product server functions and index.html.
// The primary domain in Vercel must be this one (the other spelling redirects to it).
export const SITE_URL = "https://ins-overseas.com";
