import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useLayoutEffect } from "react";
import { MotionConfig } from "framer-motion";

import { reportLovableError } from "../lib/lovable-error-reporting";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";
import Preloader from "@/components/ui/Preloader";
import FloatingDock from "@/components/ui/FloatingDock";
import EnquiryList from "@/components/ui/EnquiryList";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

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

// Jump to the top only once the new page is actually on screen. `location` changes the moment a link is clicked,
// while the old page is still showing, so keying on it would flash the old page at the top before the swap.
function ScrollToTop() {
  const path = useRouterState({ select: (s) => s.resolvedLocation?.pathname });
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [path]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useSmoothScroll();
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
      </MotionConfig>
    </QueryClientProvider>
  );
}
