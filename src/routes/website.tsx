import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/website")({
  head: () => ({ meta: [{ title: "User Website — Supreme Signatures" }] }),
  component: UserWebsitePlaceholder,
});

function UserWebsitePlaceholder() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[440px] flex-col items-center justify-center px-8 text-center">
      <span className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Globe className="h-7 w-7" />
      </span>
      <Logo className="mb-6 h-12 w-auto" />
      <h1 className="font-display text-2xl font-bold text-white">
        User <span className="text-gradient-gold">Website</span>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        This platform flow is coming soon. It will be linked here once the design is complete.
      </p>
      <Link
        to="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary transition active:scale-[0.98]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to platforms
      </Link>
    </div>
  );
}
