import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Gavel, Trophy, XCircle, Clock, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { AUCTIONS, type Auction, type BidStatus } from "@/lib/auction-data";
import { useCountdown } from "@/lib/use-countdown";

export const Route = createFileRoute("/my-bids")({
  head: () => ({ meta: [{ title: "My Bids — Home Z" }] }),
  component: MyBids,
});

type Tab = "active" | "won" | "missed";

const TABS: { key: Tab; label: string; icon: typeof Gavel }[] = [
  { key: "active", label: "Active Bids", icon: Gavel },
  { key: "won", label: "Won", icon: Trophy },
  { key: "missed", label: "Missed", icon: XCircle },
];

function MyBids() {
  const [tab, setTab] = useState<Tab>("active");

  const list = useMemo(() => {
    if (tab === "active") return AUCTIONS.filter((a) => a.bidStatus === "bidding");
    if (tab === "won") return AUCTIONS.filter((a) => a.bidStatus === "won");
    return AUCTIONS.filter((a) => a.bidStatus === "outbid");
  }, [tab]);

  return (
    <div className="mx-auto min-h-screen max-w-[440px] px-5 pb-28 pt-10">
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="grid h-10 w-10 place-items-center rounded-lg border border-border">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-base font-semibold">My Bids</h1>
        <div className="h-10 w-10" />
      </div>

      <div className="mt-5 flex gap-1 rounded-md border border-border bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-2 text-[10px] font-semibold transition ${
              tab === t.key ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <t.icon className="h-3 w-3" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {list.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          list.map((a) => {
            if (tab === "won") return <WonCard key={a.id} a={a} />;
            if (tab === "missed") return <MissedCard key={a.id} a={a} />;
            return <ActiveCard key={a.id} a={a} />;
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  const copy =
    tab === "active"
      ? "No active bids yet. Join a live auction to get started."
      : tab === "won"
        ? "No wins yet — your next legend is waiting."
        : "No missed lots. Keep bidding!";
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-12 text-center">
      <p className="text-xs text-muted-foreground">{copy}</p>
      <Link
        to="/events"
        className="mt-4 inline-flex rounded-full bg-gradient-gold px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground"
      >
        Browse Events
      </Link>
    </div>
  );
}

function ActiveCard({ a }: { a: Auction }) {
  const { h, m, s, ready } = useCountdown(a.endsAt);
  const outbid = a.bidStatus === "outbid";
  return (
    <Link
      to="/auction/$id"
      params={{ id: a.id }}
      className="block overflow-hidden rounded-xl border border-border bg-surface transition hover:border-primary/40"
    >
      <div className="flex gap-3 p-3">
        <img src={a.image} alt="" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-1 text-xs font-semibold">{a.title}</p>
            <StatusPill status={a.bidStatus} />
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Your bid <span className="text-foreground">${a.myBid?.toLocaleString()}</span>
          </p>
          <p className="mt-0.5 text-sm font-bold text-gradient-gold">${a.currentBid.toLocaleString()}</p>
          <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3 text-primary" />
            {ready
              ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} left`
              : "—"}
          </p>
        </div>
      </div>
      {outbid && (
        <div className="border-t border-border bg-live/10 px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-live">
          You've been outbid — tap to raise
        </div>
      )}
    </Link>
  );
}

function WonCard({ a }: { a: Auction }) {
  return (
    <div className="overflow-hidden rounded-xl border border-success/30 bg-surface">
      <div className="flex gap-3 p-3">
        <img src={a.image} alt="" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-1 text-xs font-semibold">{a.title}</p>
            <StatusPill status="won" />
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Winning price</p>
          <p className="text-sm font-bold text-gradient-gold">${(a.myBid ?? a.currentBid).toLocaleString()}</p>
        </div>
      </div>
      <div className="flex border-t border-border">
        <Link
          to="/auction/$id"
          params={{ id: a.id }}
          className="flex flex-1 items-center justify-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
        >
          View Lot
        </Link>
        <Link
          to="/checkout/$id"
          params={{ id: a.id }}
          className="flex flex-1 items-center justify-center gap-1 border-l border-border bg-gradient-gold py-2.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground"
        >
          Checkout <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

function MissedCard({ a }: { a: Auction }) {
  return (
    <Link
      to="/auction/$id"
      params={{ id: a.id }}
      className="flex gap-3 rounded-xl border border-border bg-surface p-3 opacity-90"
    >
      <img src={a.image} alt="" className="h-20 w-20 shrink-0 rounded-lg object-cover grayscale-[30%]" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-1 text-xs font-semibold">{a.title}</p>
          <span className="rounded-md bg-muted px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Missed
          </span>
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">
          Your bid ${a.myBid?.toLocaleString()} · Sold ${a.currentBid.toLocaleString()}
        </p>
        <p className="mt-2 text-[10px] text-primary">View similar lots →</p>
      </div>
    </Link>
  );
}

function StatusPill({ status }: { status: BidStatus }) {
  if (status === "won")
    return <span className="rounded-md bg-success/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-success">Won</span>;
  if (status === "outbid")
    return <span className="rounded-md bg-live/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-live">Outbid</span>;
  if (status === "bidding")
    return <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">Winning</span>;
  return null;
}
