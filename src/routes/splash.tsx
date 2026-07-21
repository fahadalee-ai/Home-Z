import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import heroAuction from "@/assets/hero-auction.jpg";

export const Route = createFileRoute("/splash")({
  head: () => ({
    meta: [
      { title: "Supreme Signatures — Bid. Win. Own Legends." },
      { name: "description", content: "Premium auction marketplace for authenticated luxury memorabilia and rare collectibles." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setProgress((p) => Math.min(100, p + 4)), 70);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src={heroAuction}
        alt="Luxury auction"
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[440px] flex-col items-center justify-between px-8 py-16 text-center">
        <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary/80">
          <span className="h-px w-6 bg-primary/60" />
          Est. 2024
          <span className="h-px w-6 bg-primary/60" />
        </div>

        <div className="flex flex-col items-center gap-6">
          <Logo className="h-28 w-auto drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]" />
          <p className="font-display text-2xl italic text-gradient-gold">
            Bid. Win. Own Legends.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-6">
          <div className="h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-gradient-gold transition-all" style={{ width: `${progress}%` }} />
          </div>
          <Link
            to="/onboarding"
            className="w-full rounded-full bg-gradient-gold py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-gold transition active:scale-[0.98]"
          >
            Enter the Auction Floor
          </Link>
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Authenticated · Insured · Global
          </p>
        </div>
      </div>
    </div>
  );
}
