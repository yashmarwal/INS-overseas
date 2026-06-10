import { createFileRoute, Outlet } from "@tanstack/react-router";

// journal.tsx acts as the layout shell for /journal and /journal/$slug
// The actual list is in journal.index.tsx, the post detail in journal.$slug.tsx
export const Route = createFileRoute("/journal")({
  component: () => <Outlet />,
});
