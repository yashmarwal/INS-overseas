import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import "./styles.css";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent", // fetch a page's code on hover / touch-start, so the click feels instant
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
