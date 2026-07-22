import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { DASHBOARD_ITEMS } from "@/lib/dashboard-items";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — Home Z" }] }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="mx-auto min-h-screen max-w-[440px] px-5 pb-28 pt-10">
      <h1 className="text-2xl font-bold">
        Your <span className="text-gradient-gold">Hub</span>
      </h1>
      <p className="mt-1 text-xs text-muted-foreground">Everything you need to bid, buy, and sell homes.</p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {[["Active", "4"], ["Won", "12"], ["Watching", "21"]].map(([l, v]) => (
          <div key={l} className="glass rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold text-gradient-gold">{v}</p>
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {DASHBOARD_ITEMS.map((it) => (
          <Link
            key={it.slug}
            to="/dashboard/$section"
            params={{ section: it.slug }}
            className="group relative flex flex-col items-center gap-1.5 rounded-lg border border-border bg-surface p-2.5 text-center transition hover:border-primary/40"
          >
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-primary/25 to-primary/5 text-primary">
              <it.icon className="h-4 w-4" />
            </span>
            <span className="text-[10px] font-medium leading-tight">{it.label}</span>
            {it.badge && (
              <span className="absolute right-1 top-1 rounded-md bg-gradient-gold px-1 py-0.5 text-[8px] font-bold text-primary-foreground">
                {it.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      <Link to="/home" className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 py-2.5 text-xs font-semibold text-destructive">
        <LogOut className="h-3.5 w-3.5" /> Logout
      </Link>

      <BottomNav />
    </div>
  );
}
