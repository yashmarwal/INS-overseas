import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import "./styles.css";

const queryClient = new QueryClient();

// A photo's loading shimmer (.img-shimmer) is hidden behind the photo once it has faded in; switch it off then, so finished cards
// stop animating (it would otherwise keep every card on the page redrawing for as long as the page is open).
// "load" does not bubble, so listen in the capture phase. (A data attribute, so React re-rendering the class list never wipes it.)
document.addEventListener("load", (e) => {
  if (!(e.target instanceof HTMLImageElement)) return;
  const frame = e.target.closest(".img-shimmer");
  if (frame) setTimeout(() => frame.setAttribute("data-loaded", ""), 700); // after the 0.5s fade-in
}, true);

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent", // fetch a page's code on hover / touch-start, so the click feels instant
  // The browser cross-dissolves old page into new (CSS in styles.css). Only for real page changes: the chat adds a history
  // entry for the Back button, and a transition there would freeze the screen mid-animation.
  defaultViewTransition: { types: ({ pathChanged }) => (pathChanged ? ["page"] : false) },
});

// Once the home page is settled, warm the data the two image-heavy pages need.
// (dynamic import: keeps supabase-js out of the entry bundle)
const warm = async () => {
  const [{ productsQuery }, { galleryQuery }] = await Promise.all([
    import("./hooks/useProductImages"),
    import("./hooks/useGalleryImages"),
  ]);
  queryClient.prefetchQuery(productsQuery());
  queryClient.prefetchQuery(galleryQuery);
  import("./components/ui/CatalogueHost").catch(() => {}); // the (small) catalogue dialog, so the PDF button opens at once
};
if ("requestIdleCallback" in window) requestIdleCallback(warm, { timeout: 5000 });
else setTimeout(warm, 3000);

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
