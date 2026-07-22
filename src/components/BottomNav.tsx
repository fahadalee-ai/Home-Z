import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Gavel, LayoutGrid, User } from "lucide-react";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/auctions", label: "Auctions", icon: Gavel },
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[440px] px-3 pb-3">
      <div className="bg-gradient-gold rounded-xl px-1.5 py-1.5 shadow-elevated border border-primary/40">
        <ul className="flex items-center justify-between">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  className="group flex flex-col items-center gap-0.5 rounded-lg py-1.5 transition"
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-lg transition ${
                      active ? "bg-background text-primary shadow-elevated" : "text-primary-foreground/90"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={active ? 2.4 : 2} />
                  </span>
                  <span className={`text-[9px] font-semibold tracking-wide ${active ? "text-background" : "text-primary-foreground/90"}`}>
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
