import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, Clock, ShieldCheck, ArrowLeft, SlidersHorizontal, Gavel, Ban, Trophy } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { AUCTIONS, FILTER_CATEGORIES, type Auction, type BidStatus } from "@/lib/auction-data";
import { useCountdown } from "@/lib/use-countdown";

export const Route = createFileRoute("/auctions")({
  head: () => ({ meta: [{ title: "Active Auctions — Home Z" }] }),
  component: Auctions,
});

const STATUS_TABS = ["All", "Already Bid", "Out of Bid", "Won"] as const;

function Auctions() {
  const [cat, setCat] = useState<string>("All");
  const [tab, setTab] = useState<(typeof STATUS_TABS)[number]>("All");

  const list = useMemo(() => {
    return AUCTIONS.filter((a) => (cat === "All" ? true : a.category === cat)).filter((a) => {
      if (tab === "All") return true;
      if (tab === "Already Bid") return a.bidStatus === "bidding";
      if (tab === "Out of Bid") return a.bidStatus === "outbid";
      if (tab === "Won") return a.bidStatus === "won";
      return true;
    });
  }, [cat, tab]);

  return (
    <div className="mx-auto min-h-screen max-w-[440px] px-5 pb-28 pt-10">
      <div className="flex items-center justify-between">
        <Link to="/home" className="grid h-10 w-10 place-items-center rounded-lg border border-border"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="font-display text-base font-semibold">Active Auctions</h1>
        <button className="grid h-10 w-10 place-items-center rounded-lg border border-border"><SlidersHorizontal className="h-4 w-4" /></button>
      </div>

      {/* Category chips */}
      <div className="hide-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        {FILTER_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-md border px-3 py-1.5 text-[11px] font-semibold transition ${cat === c ? "border-primary bg-gradient-gold text-primary-foreground" : "border-border bg-surface text-muted-foreground"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Status tabs */}
      <div className="mt-3 flex gap-1 rounded-md border border-border bg-surface p-1">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md px-2 py-1.5 text-[10px] font-semibold transition ${tab === t ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="mt-3 text-[10px] text-muted-foreground">{list.length} lots</p>

      <div className="mt-2 space-y-2.5">
        {list.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-surface/40 p-8 text-center">
            <p className="text-xs text-muted-foreground">No auctions match this filter.</p>
          </div>
        ) : (
          list.map((a) => <Row key={a.id} a={a} />)
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function StatusBadge({ status }: { status: BidStatus }) {
  if (status === "bidding") return (
    <span className="flex items-center gap-1 rounded-md bg-primary/15 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
      <Gavel className="h-2.5 w-2.5" /> Already Bid
    </span>
  );
  if (status === "outbid") return (
    <span className="flex items-center gap-1 rounded-md bg-live/15 px-1.5 py-0.5 text-[9px] font-semibold text-live">
      <Ban className="h-2.5 w-2.5" /> Out of Bid
    </span>
  );
  if (status === "won") return (
    <span className="flex items-center gap-1 rounded-md bg-success/15 px-1.5 py-0.5 text-[9px] font-semibold text-success">
      <Trophy className="h-2.5 w-2.5" /> Won
    </span>
  );
  return null;
}

function Row({ a }: { a: Auction }) {
  const { h, m, s, ended } = useCountdown(a.endsAt);
  return (
    <Link to="/auction/$id" params={{ id: a.id }} className="flex gap-3 rounded-lg border border-border bg-surface p-2 transition hover:border-primary/40">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
        <img src={a.image} alt={a.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[8px] uppercase tracking-wider text-primary">{a.category}</span>
            <StatusBadge status={a.bidStatus} />
          </div>
          <h3 className="mt-1 line-clamp-1 text-xs font-semibold">{a.title}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-[9px] text-muted-foreground">
            <ShieldCheck className="h-2.5 w-2.5 text-primary" /> Verified · {a.totalBids} bids
          </p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-wider text-muted-foreground">Current bid</p>
            <p className="text-sm font-bold text-gradient-gold leading-none">${a.currentBid.toLocaleString()}</p>
          </div>
          <span className="flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">
            <Clock className="h-2.5 w-2.5" /> {ended ? "Ended" : `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`}
          </span>
        </div>
      </div>
      <button onClick={(e) => e.preventDefault()} className="self-start text-muted-foreground"><Heart className="h-3.5 w-3.5" /></button>
    </Link>
  );
}
