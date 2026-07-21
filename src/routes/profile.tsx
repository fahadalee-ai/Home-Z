import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, User, MapPin, CreditCard, Bell, Shield, Lock, HelpCircle, FileText, LogOut, Award } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Supreme Signatures" }] }),
  component: Profile,
});

const SECTIONS: { title: string; items: { label: string; icon: any; hint?: string }[] }[] = [
  { title: "Account", items: [
    { label: "Edit Profile", icon: User },
    { label: "Address Book", icon: MapPin, hint: "3 saved" },
    { label: "Payment Methods", icon: CreditCard, hint: "Visa •• 4242" },
  ]},
  { title: "Preferences", items: [
    { label: "Notification Preferences", icon: Bell },
    { label: "Security", icon: Shield },
    { label: "Privacy", icon: Lock },
  ]},
  { title: "Support", items: [
    { label: "Help Center", icon: HelpCircle },
    { label: "Terms & Conditions", icon: FileText },
  ]},
];

function Profile() {
  return (
    <div className="mx-auto min-h-screen max-w-[440px] px-5 pb-28 pt-10">
      <h1 className="font-display text-2xl font-semibold">Profile</h1>

      {/* Hero */}
      <div className="mt-5 glass-gold rounded-3xl p-5">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-gold text-xl font-bold text-primary-foreground font-display">AC</div>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-bold">Alexander Chen</p>
            <p className="truncate text-xs text-muted-foreground">alex.chen@supreme.com</p>
            <div className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-black/30 px-2 py-0.5 text-[10px] text-primary">
              <Award className="h-3 w-3" /> Platinum Bidder
            </div>
          </div>
        </div>
      </div>

      {SECTIONS.map((sec) => (
        <div key={sec.title} className="mt-6">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">{sec.title}</p>
          <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-surface">
            {sec.items.map((it, i) => (
              <button key={it.label} className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface-2 ${i !== sec.items.length - 1 ? "border-b border-border" : ""}`}>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <it.icon className="h-4 w-4" />
                </span>
                <span className="flex-1 text-sm">{it.label}</span>
                {it.hint && <span className="text-xs text-muted-foreground">{it.hint}</span>}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      ))}

      <Link to="/" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 py-3.5 text-sm font-semibold text-destructive">
        <LogOut className="h-4 w-4" /> Logout
      </Link>

      <BottomNav />
    </div>
  );
}
