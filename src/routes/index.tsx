import { createFileRoute, Link } from "@tanstack/react-router";
import { Smartphone, LayoutDashboard, TabletSmartphone, Globe, ChevronRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import heroAuction from "@/assets/hero-auction.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Supreme Signatures — Select Platform" },
      { name: "description", content: "Choose a role or platform to enter the Supreme Signatures prototype." },
    ],
  }),
  component: RoleSelection,
});

const roles = [
  {
    to: "/splash" as const,
    label: "User Mobile App",
    description: "Bidder experience — auctions, shop & live events",
    icon: Smartphone,
    ready: true,
  },
  {
    to: "/admin" as const,
    label: "Admin Dashboard",
    description: "Web console for operations & inventory",
    icon: LayoutDashboard,
    ready: false,
  },
  {
    to: "/admin-mobile" as const,
    label: "Admin Mobile App",
    description: "On-the-go management for staff",
    icon: TabletSmartphone,
    ready: false,
  },
  {
    to: "/website" as const,
    label: "User Website",
    description: "Public web experience for collectors",
    icon: Globe,
    ready: false,
  },
];

function RoleSelection() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src={heroAuction}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[440px] flex-col px-6 py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary/80">
            <span className="h-px w-6 bg-primary/60" />
            Prototype
            <span className="h-px w-6 bg-primary/60" />
          </div>
          <Logo className="h-16 w-auto drop-shadow-[0_0_24px_rgba(212,175,55,0.35)]" />
          <div>
            <h1 className="font-display text-2xl font-bold text-white">
              Select a <span className="text-gradient-gold">Platform</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose which role flow to explore
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-1 flex-col gap-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.to}
                to={role.to}
                className="group glass flex items-center gap-4 rounded-2xl p-4 transition active:scale-[0.99] hover:border-primary/30"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="flex items-center gap-2">
                    <span className="font-display text-[15px] font-semibold text-white">
                      {role.label}
                    </span>
                    {!role.ready && (
                      <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-primary/80">
                        Soon
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {role.description}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Authenticated · Insured · Global
        </p>
      </div>
    </div>
  );
}
