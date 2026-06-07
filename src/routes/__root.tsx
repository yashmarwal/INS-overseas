import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";
import Preloader from "@/components/ui/Preloader";
import CustomCursor from "@/components/ui/CustomCursor";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import StickyCtaBar from "@/components/ui/StickyCtaBar";
import AiHelpAgent from "@/components/ui/AiHelpAgent";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment px-6 text-center">
      <div>
        <p className="text-gold uppercase text-xs tracking-[0.3em]">404</p>
        <h1 className="mt-4 text-5xl text-ink" style={{ fontFamily: "var(--font-display)" }}>Page not found</h1>
        <p className="mt-3 text-umber">The page you're looking for has wandered off the workshop floor.</p>
        <a href="/" className="inline-block mt-8 border border-umber text-umber px-6 py-3 uppercase text-xs tracking-[0.15em]">Return Home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment px-6 text-center">
      <div>
        <h1 className="text-3xl text-ink" style={{ fontFamily: "var(--font-display)" }}>Something didn't load.</h1>
        <p className="mt-3 text-umber">Try refreshing — the page should reappear.</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="inline-block mt-6 bg-umber text-cream px-6 py-3 uppercase text-xs tracking-[0.15em]">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "INS Overseas — Handmade Leather Journals & Artisan Stationery | Wholesale from Jaipur" },
      { name: "description", content: "Premium handmade leather journals, cotton rag paper & artisan stationery manufactured in Jaipur, India since 1995. Wholesale export to 40+ countries." },
      { property: "og:title", content: "INS Overseas — Handmade Leather Journals & Artisan Stationery" },
      { property: "og:description", content: "Handcrafted in Sanganer, Jaipur since 1995. Wholesale export to 40+ countries." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "INS Overseas" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="grain-overlay">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ScrollToTop() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [path]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useSmoothScroll();
  return (
    <QueryClientProvider client={queryClient}>
      <Preloader />
      <CustomCursor />
      <ScrollToTop />
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <StickyCtaBar />
      <AiHelpAgent />
    </QueryClientProvider>
  );
}
