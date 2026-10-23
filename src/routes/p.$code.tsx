import { createFileRoute, redirect } from "@tanstack/react-router";

// Short share link: ins-overseas.com/p/<code>. It forwards to the Products page, which opens that product's details.
export const Route = createFileRoute("/p/$code")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/products", search: { p: params.code } as never, replace: true });
  },
});
