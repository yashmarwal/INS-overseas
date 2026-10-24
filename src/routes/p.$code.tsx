import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";
import { productSlug } from "@/lib/productUrl";
import { shortCode } from "@/lib/share";

// Short share link: ins-overseas.com/p/<code>. On the live site the server sends it straight to the product's own page;
// here (and wherever the server step is not running) the browser finds the product itself and goes there.
// (The data code is loaded only now, so it is not part of the page every visitor downloads.)
export const Route = createFileRoute("/p/$code")({
  beforeLoad: async ({ params, context }) => {
    try {
      const [{ productsQuery }, { productDetailsQuery }] = await Promise.all([import("@/hooks/useProductImages"), import("@/hooks/useProductDetails")]);
      const [rows, det] = await Promise.all([context.queryClient.ensureQueryData(productsQuery()), context.queryClient.ensureQueryData(productDetailsQuery())]);
      const row = rows.find((r) => shortCode(r.id) === params.code || r.id === params.code);
      if (row) throw redirect({ to: "/product/$slug", params: { slug: productSlug(row.id, row.product_name || "Handmade Product", det.get(row.id)?.code) }, replace: true });
    } catch (e) {
      if (isRedirect(e)) throw e; // (the redirect above)
    }
    throw redirect({ to: "/products", search: { p: params.code } as never, replace: true }); // unknown or offline: the Products page copes
  },
});
