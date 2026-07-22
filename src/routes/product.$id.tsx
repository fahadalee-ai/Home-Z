import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/product/$id")({
  beforeLoad: () => {
    throw redirect({ to: "/auctions" });
  },
  component: () => null,
});
