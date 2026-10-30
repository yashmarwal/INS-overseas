import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { SITE_URL } from "./site.config.mjs";

// index.html is written with __SITE_URL__ wherever the site's address appears; this fills it in (dev server and build alike)
const siteUrl = () => ({
  name: "site-url",
  transformIndexHtml: { order: "pre" as const, handler: (html: string) => html.split("__SITE_URL__").join(SITE_URL) },
});

export default defineConfig({
  plugins: [
    siteUrl(),
    tsConfigPaths(),
    TanStackRouterVite({ autoCodeSplitting: true }),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  build: {
    outDir: "dist",
  },
});
