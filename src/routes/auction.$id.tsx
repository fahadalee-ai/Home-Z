import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Heart, ShieldCheck, Share2, Plus, Minus, X, Check, HelpCircle, Gavel, Clock, Lock } from "lucide-react";
import { getAuction, getEvent, AUCTIONS } from "@/lib/auction-data";
import { useCountdown } from "@/lib/use-countdown";

export const Route = createFileRoute("/auction/$id")({
  validateSearch: (search: Record<string, unknown>): { locked: boolean; event?: string } => ({
    locked: search.locked === true || search.locked === "true" || search.locked === "1",
    ...(typeof search.event === "string" ? { event: search.event } : {}),
  }),
  head: ({ params }) => {
    const a = getAuction(params.id);
    return { meta: [{ title: a ? `${a.title} — Home Z` : "Auction" }] };
  },
  loader: ({ params }) => {
    const a = getAuction(params.id);
    if (!a) throw notFound();
    return null;
  },
  component: AuctionDetail,
  notFoundComponent: () => <div className="grid min-h-screen place-items-center text-muted-foreground">Auction not found</div>,
  errorComponent: ({ error }) => <div className="grid min-h-screen place-items-center text-muted-foreground">{error.message}</div>,
});

function AuctionDetail() {
  const { id } = Route.useParams();
  const { locked, event: eventId } = Route.useSearch();
  const a = getAuction(id)!;
  const event = eventId ? getEvent(eventId) : undefined;
  const [tab, setTab] = useState<"overview" | "history">("overview");
  const [bidOpen, setBidOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const { h, m, s, ended } = useCountdown(a.endsAt);
  const eventCountdown = useCountdown(event?.startsAt ?? Date.now());
  const startingBid = Math.round(a.currentBid * 0.72);
  const estimated = Math.round(a.currentBid * 1.35);
  const backTo = eventId
    ? ({ to: "/events/$id" as const, params: { id: eventId } })
    : ({ to: "/auctions" as const });

  return (
    <div className="mx-auto min-h-screen max-w-[440px] pb-28">
      {/* Hero gallery */}
      <div className="relative h-[480px] overflow-hidden">
        <img src={a.image} alt={a.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-10">
          {"params" in backTo ? (
            <Link to={backTo.to} params={backTo.params} className="grid h-10 w-10 place-items-center rounded-full bg-black/50 backdrop-blur">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          ) : (
            <Link to={backTo.to} className="grid h-10 w-10 place-items-center rounded-full bg-black/50 backdrop-blur">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
          <div className="flex gap-2">
            {locked && (
              <span className="flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                <Lock className="h-3 w-3" /> Preview
              </span>
            )}
            <button className="grid h-10 w-10 place-items-center rounded-full bg-black/50 backdrop-blur"><Share2 className="h-4 w-4" /></button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-black/50 backdrop-blur"><Heart className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="absolute bottom-5 left-5 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">Verified Listing Guaranteed</span>
        </div>
      </div>

      {/* Info */}
      <div className="px-5 -mt-6">
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary">{a.category}</p>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight">{a.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{a.subtitle}</p>

        {/* Auction box */}
        <div className="mt-5 glass-gold rounded-3xl p-5">
          {locked ? (
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Starting bid</p>
                <p className="font-display text-3xl font-bold text-gradient-gold">${startingBid.toLocaleString()}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Est. value ${estimated.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Auction starts</p>
                {event ? (
                  <p className="mt-1 font-display text-sm font-bold tabular-nums">
                    {eventCountdown.ready
                      ? `${eventCountdown.d > 0 ? `${eventCountdown.d}d ` : ""}${String(eventCountdown.h).padStart(2, "0")}:${String(eventCountdown.m).padStart(2, "0")}:${String(eventCountdown.s).padStart(2, "0")}`
                      : "—"}
                  </p>
                ) : (
                  <p className="mt-1 text-xs font-semibold text-primary">Soon</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Current bid</p>
                <p className="font-display text-3xl font-bold text-gradient-gold">${a.currentBid.toLocaleString()}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{a.totalBids} bids · Increment ${a.bidIncrement}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Ends in</p>
                <p className="flex items-center gap-1 font-display text-xl font-bold">
                  <Clock className="h-4 w-4 text-primary" />
                  {ended ? "Ended" : `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {locked && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 text-[11px] text-primary">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            This listing is in preview. Bidding unlocks when the live auction begins.
          </div>
        )}

        {/* Tabs */}
        <div className="mt-6 flex gap-6 border-b border-border">
          {(["overview", "history"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative pb-3 text-sm font-semibold capitalize transition ${tab === t ? "text-primary" : "text-muted-foreground"}`}
            >
              {t === "history" ? "Bid History" : "Overview"}
              {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-gold" />}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          <div className="mt-5 space-y-5 text-sm text-muted-foreground">
            <p>A standout property in a prime location. This listing is fully verified with clear title documentation, recent inspection reports, and professional photography. Schedule a private tour or bid live during the auction window.</p>
            <div className="grid grid-cols-2 gap-3">
              {[["Condition", "Move-in Ready"], ["Built", "2019"], ["Title", "Clear"], ["Insurance", "Available"]].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-border bg-surface p-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</p>
                  <p className="mt-1 font-semibold text-foreground">{v}</p>
                </div>
              ))}
            </div>
          </div>
        ) : locked ? (
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-surface/50 px-4 py-10 text-center">
            <Lock className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-2 text-xs text-muted-foreground">Bid history will appear once the auction goes live.</p>
          </div>
        ) : (
          <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-surface">
            {[ ["VaultKing", a.currentBid, "2m ago"],
               ["Collector_NYC", a.currentBid - a.bidIncrement, "8m ago"],
               ["JordanFan23", a.currentBid - a.bidIncrement * 2, "14m ago"],
               ["AutoBid #4421", a.currentBid - a.bidIncrement * 3, "27m ago"] ].map(([u, amt, t]) => (
              <div key={t as string} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{u}</p>
                  <p className="text-[11px] text-muted-foreground">{t}</p>
                </div>
                <p className="font-display font-bold text-gradient-gold">${(amt as number).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">You may also like</p>
        <div className="hide-scrollbar mt-2 flex gap-3 overflow-x-auto">
          {AUCTIONS.filter((x) => x.id !== a.id).slice(0, 4).map((r) => (
            <Link
              to="/auction/$id"
              params={{ id: r.id }}
              search={locked ? { locked: true, event: eventId } : undefined}
              key={r.id}
              className="w-32 shrink-0"
            >
              <div className="h-32 w-32 overflow-hidden rounded-xl"><img src={r.image} alt={r.title} className="h-full w-full object-cover" loading="lazy" /></div>
              <p className="mt-2 line-clamp-1 text-xs font-medium">{r.title}</p>
              <p className="font-display text-sm font-bold text-gradient-gold">${r.currentBid.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[440px] border-t border-border bg-background/95 px-5 py-3 backdrop-blur">
        {locked ? (
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Starting bid</p>
              <p className="font-display text-lg font-bold leading-none text-gradient-gold">${startingBid.toLocaleString()}</p>
            </div>
            <button
              disabled
              className="ml-auto flex cursor-not-allowed items-center gap-2 rounded-full border border-border bg-surface px-5 py-3.5 text-sm font-bold uppercase tracking-widest text-muted-foreground opacity-80"
            >
              <Lock className="h-4 w-4" /> Auction Starts Soon
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Top bid</p>
              <p className="font-display text-lg font-bold text-gradient-gold leading-none">${a.currentBid.toLocaleString()}</p>
            </div>
            <button onClick={() => setBidOpen(true)} className="ml-auto flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-gold">
              <Gavel className="h-4 w-4" /> Place Bid
            </button>
          </div>
        )}
      </div>

      {!locked && bidOpen && <BidModal a={a} onClose={() => setBidOpen(false)} onPlaced={() => { setBidOpen(false); setSuccess(true); }} />}
      {success && <BidSuccess onClose={() => setSuccess(false)} />}
    </div>
  );
}

function BidModal({ a, onClose, onPlaced }: { a: ReturnType<typeof getAuction> & {}; onClose: () => void; onPlaced: () => void }) {
  const [amount, setAmount] = useState(a!.currentBid + a!.bidIncrement);
  const [proxy, setProxy] = useState(false);
  const [maxBid, setMaxBid] = useState(a!.currentBid + a!.bidIncrement * 10);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-[440px] rounded-t-3xl border-t border-primary/20 bg-background p-5 pb-8 animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/15" />
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Place A Bid</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-border"><X className="h-4 w-4" /></button>
        </div>

        {/* Amount stepper */}
        <div className="mt-5 rounded-3xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">Your bid amount</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <button onClick={() => setAmount(Math.max(a!.currentBid + a!.bidIncrement, amount - a!.bidIncrement))} className="grid h-12 w-12 place-items-center rounded-full border border-primary/40">
              <Minus className="h-5 w-5 text-primary" />
            </button>
            <div className="flex-1 text-center">
              <p className="font-display text-3xl font-bold text-gradient-gold">${amount.toLocaleString()}</p>
            </div>
            <button onClick={() => setAmount(amount + a!.bidIncrement)} className="grid h-12 w-12 place-items-center rounded-full border border-primary/40">
              <Plus className="h-5 w-5 text-primary" />
            </button>
          </div>
        </div>

        {/* Auction info */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[["Highest", `$${a!.currentBid.toLocaleString()}`], ["Increment", `$${a!.bidIncrement}`], ["Bids", `${a!.totalBids}`]].map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-border bg-surface px-2 py-2">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{k}</p>
              <p className="mt-0.5 text-sm font-bold">{v}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">Bid in increments of ${a!.bidIncrement}.</p>

        {/* Auto bid */}
        <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Enable Proxy Bidding</p>
              <p className="text-[11px] text-muted-foreground">Auto-bid for you up to your max.</p>
            </div>
            <button onClick={() => setProxy(!proxy)} className={`relative h-6 w-11 rounded-full transition ${proxy ? "bg-gradient-gold" : "bg-white/15"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${proxy ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
          {proxy && (
            <div className="mt-3">
              <input
                value={maxBid}
                onChange={(e) => setMaxBid(Number(e.target.value) || 0)}
                type="number"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              <p className="mt-2 rounded-xl bg-primary/10 p-2 text-[10px] text-primary">The system places bids on your behalf up to ${maxBid.toLocaleString()}.</p>
            </div>
          )}
        </div>

        <label className="mt-3 flex items-start gap-2 text-[11px] text-muted-foreground">
          <input type="checkbox" defaultChecked className="mt-0.5 accent-[color:var(--primary)]" />
          By placing a bid, you agree to our Terms & Conditions.
        </label>

        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          <p className="text-[11px] text-muted-foreground">Any questions? <span className="text-primary">Visit our Help Centre</span></p>
        </div>

        <button onClick={onPlaced} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-gold">
          <Gavel className="h-4 w-4" /> Place Bid
        </button>
      </div>
    </div>
  );
}

function BidSuccess({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 px-6 backdrop-blur">
      <div className="w-full max-w-sm rounded-3xl border border-primary/30 bg-background p-7 text-center animate-in zoom-in duration-300">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-gold pulse-gold">
          <Check className="h-10 w-10" strokeWidth={3} />
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold">
          Bid placed <span className="text-gradient-gold">successfully</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">We'll notify you instantly if you're outbid.</p>
        <button onClick={onClose} className="mt-6 w-full rounded-full bg-gradient-gold py-3.5 text-sm font-bold uppercase tracking-widest text-primary-foreground">
          Continue Watching
        </button>
      </div>
    </div>
  );
}
