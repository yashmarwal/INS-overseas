import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { MotionConfig } from "framer-motion";

import { reportLovableError } from "../lib/lovable-error-reporting";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";
import Preloader from "@/components/ui/Preloader";
import FloatingDock from "@/components/ui/FloatingDock";
import EnquiryList from "@/components/ui/EnquiryList";
import VideoBubble from "@/components/ui/VideoBubble";
import { useCatalogueUi } from "@/lib/catalogueUi";

// The catalogue dialog and the product data behind it load only after the first click on a "Download catalogue" button.
const CatalogueHost = lazy(() => import("@/components/ui/CatalogueHost"));
import "@/lib/track"; // popularity stats: hears about every "added to quote"
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { historyKey, saveScroll, savedScroll } from "@/lib/scrollMemory";

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment px-6 text-center">
      <div>
        <p className="text-gold uppercase text-xs tracking-[0.3em]">404</p>
        <h1 className="mt-4 text-5xl text-ink" style={{ fontFamily: "var(--font-display)" }}>Page not found</h1>
        <p className="mt-3 text-umber">The page you're looking for has wandered off the workspace floor.</p>
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
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// A page opened by a click starts at the top; Back / Forward return to where the visitor was on that page.
// This runs only once the new page is actually on screen. `location` changes the moment a link is clicked,
// while the old page is still showing, so keying on it would flash the old page at the top before the swap.
function ScrollToTop() {
  const path = useRouterState({ select: (s) => s.resolvedLocation?.pathname });
  const shown = useRef(""); // history entry of the page that is on screen: scroll positions are saved under it
  const restoring = useRef(false);

  // the browser must not restore scroll by itself (it would fight this); keep a running note of the scroll position
  useEffect(() => {
    try { window.history.scrollRestoration = "manual"; } catch { /* ignore */ }
    let raf = 0;
    const onScroll = () => {
      if (raf || restoring.current || !shown.current) return;
      raf = requestAnimationFrame(() => { raf = 0; if (!restoring.current) saveScroll(shown.current, window.scrollY); });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useLayoutEffect(() => {
    const key = historyKey();
    shown.current = key;
    const target = savedScroll(key);
    if (!target) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      saveScroll(key, 0);
      return;
    }
    // Back / Forward: return to the saved spot. Lazy sections can still be growing, so keep nudging for a moment,
    // and stop the instant the visitor scrolls, taps or presses a key themselves.
    restoring.current = true;
    let stop = false;
    const t0 = performance.now();
    const finish = () => { stop = true; restoring.current = false; saveScroll(key, window.scrollY); cleanup(); };
    const cancel = () => finish();
    const cleanup = () => ["wheel", "touchstart", "keydown", "pointerdown"].forEach((e) => window.removeEventListener(e, cancel));
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((e) => window.addEventListener(e, cancel, { passive: true }));
    const step = () => {
      if (stop) return;
      window.scrollTo({ top: target, behavior: "instant" as ScrollBehavior });
      if (Math.abs(window.scrollY - target) <= 2 || performance.now() - t0 > 1800) { finish(); return; }
      requestAnimationFrame(step);
    };
    step();
    return () => { stop = true; restoring.current = false; cleanup(); };
  }, [path]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useSmoothScroll();
  const catalogueUi = useCatalogueUi();
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <Preloader />
        <ScrollToTop />
        <Navigation />
        <main>
          <Outlet />
        </main>
        <Footer />
        <FloatingDock />
        <EnquiryList />
        <VideoBubble />
        {catalogueUi.everOpened && <Suspense fallback={null}><CatalogueHost /></Suspense>}
      </MotionConfig>
    </QueryClientProvider>
  );
}
