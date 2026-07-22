import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  Radio,
  ShieldCheck,
  Lock,
  Play,
  Bell,
  Share2,
  UserPlus,
  Check,
  Trophy,
  MessageCircle,
  Timer,
  Star,
  Heart,
  MapPin,
  Package,
} from "lucide-react";
import { getEvent, getAuction, LIVE_EVENTS, type LiveEvent } from "@/lib/auction-data";
import { useCountdown } from "@/lib/use-countdown";

export const Route = createFileRoute("/events/$id")({
  head: ({ params }) => {
    const e = getEvent(params.id);
    return { meta: [{ title: e ? `${e.title} — Live Event` : "Event" }] };
  },
  loader: ({ params }) => {
    const e = getEvent(params.id);
    if (!e) throw notFound();
    return { event: e };
  },
  component: EventDetail,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center text-muted-foreground">Event not found</div>
  ),
});

function EventDetail() {
  const { id } = Route.useParams();
  const event = getEvent(id);
  if (!event) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Event not found</div>;
  }
  if (event.status === "upcoming") return <UpcomingDetail e={event} />;
  if (event.status === "past") return <PastDetail e={event} />;
  return <ActiveDetail e={event} />;
}

function ActiveDetail({ e }: { e: LiveEvent }) {
  const lots = e.lotIds.map(getAuction).filter(Boolean) as NonNullable<ReturnType<typeof getAuction>>[];
  return (
    <div className="mx-auto min-h-screen max-w-[440px] pb-28">
      <EventHero e={e} />
      <div className="px-5">
        <HostRow e={e} />
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{e.description}</p>
        <Link
          to="/live"
          search={{ event: e.id }}
          className="mt-5 flex items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold"
        >
          <Play className="h-4 w-4 fill-current" /> Join Live Stream
          {e.viewers && (
            <span className="ml-1 flex items-center gap-1 rounded-md bg-black/20 px-2 py-0.5 text-[10px]">
              <Users className="h-3 w-3" /> {e.viewers.toLocaleString()}
            </span>
          )}
        </Link>
        <LotsList lots={lots} mode="live" eventId={e.id} />
      </div>
      <StickyBar>
        <Link
          to="/live"
          search={{ event: e.id }}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-gold"
        >
          <Radio className="h-4 w-4" /> Enter Live Room
        </Link>
      </StickyBar>
    </div>
  );
}

function UpcomingDetail({ e }: { e: LiveEvent }) {
  const { d, h, m, s, ready } = useCountdown(e.startsAt);
  const lots = e.lotIds.map(getAuction).filter(Boolean) as NonNullable<ReturnType<typeof getAuction>>[];
  const [reminded, setReminded] = useState(false);
  const [following, setFollowing] = useState(false);
  const [calendar, setCalendar] = useState(false);
  const [shared, setShared] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const notifyMe = () => {
    setReminded(true);
    showToast("Reminder set — we'll notify you before go-live");
  };

  const addCalendar = () => {
    setCalendar(true);
    showToast("Added to your calendar");
  };

  const shareEvent = () => {
    setShared(true);
    showToast("Event link copied");
  };

  return (
    <div className="mx-auto min-h-screen max-w-[440px] pb-32">
      {/* Large event banner */}
      <div className="relative h-80 overflow-hidden">
        <img src={e.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-background" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-10">
          <Link to="/events" className="grid h-10 w-10 place-items-center rounded-full bg-black/50 backdrop-blur">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
              <Calendar className="h-3 w-3" /> Upcoming
            </span>
            <button
              onClick={shareEvent}
              className="grid h-10 w-10 place-items-center rounded-full bg-black/50 backdrop-blur"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Countdown overlay on banner */}
        <div className="absolute inset-x-5 bottom-6">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] text-primary">Live in</p>
          <div className="mt-2 flex justify-center gap-2">
            {(ready ? [["D", d], ["H", h], ["M", m], ["S", s]] : [["D", "--"], ["H", "--"], ["M", "--"], ["S", "--"]]).map(([k, v]) => (
              <div key={k as string} className="flex min-w-[56px] flex-col items-center rounded-xl border border-primary/40 bg-black/55 px-2 py-2 backdrop-blur">
                <span className="font-display text-xl font-bold tabular-nums text-gradient-gold">
                  {typeof v === "number" ? String(v).padStart(2, "0") : v}
                </span>
                <span className="text-[8px] uppercase tracking-widest text-white/60">{k as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5">
        {/* Host profile */}
        <div className="mt-4 flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-gold text-base font-bold text-primary-foreground shadow-gold">
            {e.hostInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{e.host}</p>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-0.5 text-primary">
                <Star className="h-3 w-3 fill-primary" /> {e.hostRating.toFixed(1)}
              </span>
              <span className="h-3 w-px bg-border" />
              <span>{(e.hostFollowers / 1000).toFixed(1)}k followers</span>
            </div>
          </div>
          <button
            onClick={() => {
              setFollowing((f) => !f);
              if (!following) showToast(`Following ${e.host}`);
            }}
            className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-wider ${
              following ? "border border-border text-muted-foreground" : "bg-gradient-gold text-primary-foreground"
            }`}
          >
            {following ? <Check className="h-3 w-3" /> : <UserPlus className="h-3 w-3" />}
            {following ? "Following" : "Follow"}
          </button>
        </div>

        {/* Event name & description */}
        <h1 className="mt-5 font-display text-2xl font-bold leading-tight">{e.title}</h1>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{e.description}</p>

        {/* Date & time + products */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <MetaCard
            icon={Calendar}
            label="Date"
            value={new Date(e.startsAt).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
          />
          <MetaCard
            icon={Clock}
            label="Time"
            value={new Date(e.startsAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
          />
          <MetaCard icon={Package} label="Products" value={`${lots.length} lots`} />
          <MetaCard
            icon={Timer}
            label="Duration"
            value={`~${Math.round((e.endsAt - e.startsAt) / 60_000)} min`}
          />
        </div>

        {/* Location */}
        {e.location && (
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-border bg-surface p-3.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Event Location</p>
              <p className="mt-0.5 text-xs font-semibold">{e.location}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">Streamed live worldwide</p>
            </div>
          </div>
        )}

        {/* Categories */}
        <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Auction Categories</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {e.categories.map((c) => (
            <span key={c} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-[10px] font-semibold text-primary">
              {c}
            </span>
          ))}
        </div>

        {/* Featured products — horizontal scroll */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold">Featured Products</h2>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{lots.length} items</span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">Browse lots now — bidding unlocks when the event goes live.</p>

        <div className="hide-scrollbar scroll-fade-x -mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
          {lots.map((a) => {
            const starting = Math.round(a.currentBid * 0.72);
            const estimate = Math.round(a.currentBid * 1.35);
            const isLiked = !!liked[a.id];
            return (
              <Link
                key={a.id}
                to="/auction/$id"
                params={{ id: a.id }}
                search={{ locked: true, event: e.id }}
                className="group w-40 shrink-0 overflow-hidden rounded-xl border border-border bg-surface transition hover:border-primary/40"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
                    loading="lazy"
                  />
                  <button
                    onClick={(ev) => {
                      ev.preventDefault();
                      setLiked((prev) => ({ ...prev, [a.id]: !prev[a.id] }));
                    }}
                    className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-md bg-black/50 backdrop-blur"
                  >
                    <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-live text-live" : "text-white"}`} />
                  </button>
                  <span className="absolute left-1.5 top-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-primary backdrop-blur">
                    Preview
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="text-[8px] uppercase tracking-widest text-primary/80">{a.category}</p>
                  <h3 className="mt-0.5 line-clamp-2 text-xs font-semibold leading-tight">{a.title}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="text-[8px] uppercase tracking-wider text-muted-foreground">Start</span>
                      <span className="text-xs font-bold text-gradient-gold">${starting.toLocaleString()}</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="text-[8px] uppercase tracking-wider text-muted-foreground">Est.</span>
                      <span className="text-[10px] text-muted-foreground">${estimate.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="mt-2 flex items-center justify-center gap-1 rounded-md border border-border bg-surface-2 py-1.5 text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Lock className="h-2.5 w-2.5" /> Starts soon
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Seller information */}
        <p className="mt-7 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Seller Information</p>
        <div className="mt-2 rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-gold text-xs font-bold text-primary-foreground">
              {e.hostInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{e.host}</p>
              <p className="text-[11px] text-muted-foreground">Verified Home Z Host</p>
            </div>
            <span className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
              <Star className="h-3 w-3 fill-primary" /> {e.hostRating.toFixed(1)}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              ["Sales", "1.2k"],
              ["Tours", "Live"],
              ["Title", "Clear"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-border bg-background p-2">
                <p className="font-display text-sm font-bold text-gradient-gold">{v}</p>
                <p className="text-[8px] uppercase tracking-wider text-muted-foreground">{k}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            All listings are verified with clear title packages, recent inspections, and professional photography before going live.
          </p>
        </div>

        {/* Rules & terms */}
        <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Event Rules & Terms</p>
        <div className="mt-2 space-y-2 rounded-2xl border border-border bg-surface p-4">
          {[
            "Bidding opens only when the live stream starts.",
            "All bids are binding once placed during the live event.",
            "Winning listings require checkout within 24 hours.",
            "Title verification guarantee and escrow protection on every sale.",
          ].map((rule) => (
            <div key={rule} className="flex gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span>{rule}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <button
            onClick={notifyMe}
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-[10px] font-semibold transition active:scale-[0.98] ${
              reminded ? "border-success/40 bg-success/10 text-success" : "border-border bg-surface text-muted-foreground"
            }`}
          >
            {reminded ? <Check className="h-4 w-4" /> : <Bell className="h-4 w-4 text-primary" />}
            {reminded ? "Notified" : "Notify Me"}
          </button>
          <button
            onClick={addCalendar}
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-[10px] font-semibold transition active:scale-[0.98] ${
              calendar ? "border-success/40 bg-success/10 text-success" : "border-border bg-surface text-muted-foreground"
            }`}
          >
            {calendar ? <Check className="h-4 w-4" /> : <Calendar className="h-4 w-4 text-primary" />}
            {calendar ? "Added" : "Calendar"}
          </button>
          <button
            onClick={shareEvent}
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-[10px] font-semibold transition active:scale-[0.98] ${
              shared ? "border-success/40 bg-success/10 text-success" : "border-border bg-surface text-muted-foreground"
            }`}
          >
            {shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4 text-primary" />}
            Share
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-primary/25 bg-primary/5 px-3 py-2.5 text-[10px] text-primary">
          <Lock className="h-3 w-3" />
          Bidding remains disabled until this auction goes live
        </div>
      </div>

      <StickyBar>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFollowing(true);
              showToast(`Following ${e.host}`);
            }}
            className={`flex items-center justify-center gap-1.5 rounded-full border px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider ${
              following ? "border-border text-muted-foreground" : "border-primary/40 text-primary"
            }`}
          >
            {following ? <Check className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
            {following ? "Following" : "Follow"}
          </button>
          <button
            onClick={notifyMe}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 py-3.5 text-sm font-bold uppercase tracking-widest text-primary"
          >
            {reminded ? (
              <>
                <Check className="h-4 w-4" /> Reminder Set
              </>
            ) : (
              <>
                <Bell className="h-4 w-4" /> Notify Me
              </>
            )}
          </button>
        </div>
      </StickyBar>

      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-50 mx-auto flex max-w-[320px] items-center justify-center gap-2 rounded-full bg-gradient-gold px-4 py-2.5 text-[11px] font-semibold text-primary-foreground shadow-gold animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-3.5 w-3.5" /> {toast}
        </div>
      )}
    </div>
  );
}

function PastDetail({ e }: { e: LiveEvent }) {
  const lots = e.lotIds.map(getAuction).filter(Boolean) as NonNullable<ReturnType<typeof getAuction>>[];
  const [following, setFollowing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const durationMins = Math.round((e.endsAt - e.startsAt) / 60_000);
  const similar = LIVE_EVENTS.filter((x) => x.id !== e.id).slice(0, 3);

  return (
    <div className="mx-auto min-h-screen max-w-[440px] pb-28">
      {/* Replay banner */}
      <div className="relative h-72 overflow-hidden">
        <img src={e.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-10">
          <Link to="/events" className="grid h-10 w-10 place-items-center rounded-full bg-black/50 backdrop-blur">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="rounded-full bg-black/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/80">
            Replay
          </span>
        </div>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-gold"
        >
          <Play className={`h-6 w-6 ${playing ? "" : "fill-current"}`} />
        </button>
        {playing && (
          <div className="absolute inset-x-8 bottom-16">
            <div className="h-1 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-2/5 bg-gradient-gold" />
            </div>
            <p className="mt-1 text-center text-[10px] text-white/70">Replay · 00:48:12 / 02:00:00</p>
          </div>
        )}
      </div>

      <div className="px-5">
        <HostRow e={e} following={following} onFollow={() => setFollowing((f) => !f)} />
        <h1 className="mt-4 font-display text-2xl font-bold leading-tight">{e.title}</h1>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{e.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <MetaCard
            icon={Calendar}
            label="Aired"
            value={new Date(e.startsAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          />
          <MetaCard icon={Timer} label="Duration" value={`${durationMins} min`} />
          <MetaCard icon={Users} label="Viewers" value={(e.viewers ?? 0).toLocaleString()} />
          <MetaCard icon={Trophy} label="Sold" value={`${(e.winners ?? []).length} lots`} />
        </div>

        {/* Sold products */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold">Sold Products</h2>
          <span className="text-[10px] uppercase tracking-widest text-primary">Final prices</span>
        </div>
        <div className="mt-3 space-y-2.5">
          {(e.winners ?? []).map((w) => {
            const lot = getAuction(w.lotId);
            if (!lot) return null;
            return (
              <div key={w.lotId} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-2.5">
                <img src={lot.image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-semibold">{lot.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Won by <span className="text-primary">{w.user}</span>
                  </p>
                  <p className="mt-1 font-display text-sm font-bold text-gradient-gold">${w.amount.toLocaleString()}</p>
                </div>
                <span className="rounded-md bg-success/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-success">
                  Sold
                </span>
              </div>
            );
          })}
        </div>

        {/* Read-only comments */}
        <div className="mt-6 flex items-center gap-2">
          <MessageCircle className="h-3.5 w-3.5 text-primary" />
          <h2 className="font-display text-sm font-semibold">Comments</h2>
          <span className="text-[10px] text-muted-foreground">(Read only)</span>
        </div>
        <div className="mt-3 space-y-2">
          {(e.replayComments ?? []).map((c, i) => (
            <div key={i} className="flex items-start gap-2 rounded-xl border border-border bg-surface p-2.5">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-2 text-[9px] font-bold">
                {c.initials}
              </div>
              <div>
                <p className="text-[11px] font-semibold">{c.user}</p>
                <p className="text-[11px] text-muted-foreground">{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Similar events */}
        <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Similar Live Events</p>
        <div className="hide-scrollbar mt-2 flex gap-3 overflow-x-auto pb-1">
          {similar.map((s) => (
            <Link
              key={s.id}
              to="/events/$id"
              params={{ id: s.id }}
              className="w-36 shrink-0 overflow-hidden rounded-xl border border-border bg-surface"
            >
              <div className="relative h-20">
                <img src={s.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="p-2">
                <p className="line-clamp-2 text-[11px] font-semibold leading-tight">{s.title}</p>
                <p className="mt-1 text-[9px] uppercase tracking-wider text-primary">{s.status}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <StickyBar>
        <button
          onClick={() => setPlaying(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface py-3.5 text-sm font-bold uppercase tracking-widest text-foreground"
        >
          <Play className="h-4 w-4 fill-current text-primary" /> Watch Replay
        </button>
      </StickyBar>
    </div>
  );
}

function EventHero({ e }: { e: LiveEvent }) {
  return (
    <div className="relative h-64 overflow-hidden">
      <img src={e.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-10">
        <Link to="/events" className="grid h-10 w-10 place-items-center rounded-full bg-black/50 backdrop-blur">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        {e.status === "active" && (
          <span className="flex items-center gap-1 rounded-full bg-live px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white pulse-live" /> Live
          </span>
        )}
        {e.status === "upcoming" && (
          <span className="flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
            <Calendar className="h-3 w-3" /> Upcoming
          </span>
        )}
      </div>
      {e.status !== "upcoming" && (
        <div className="absolute inset-x-5 bottom-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-primary">Hosted by {e.host}</p>
          <h1 className="mt-1 font-display text-2xl font-bold leading-tight">{e.title}</h1>
        </div>
      )}
    </div>
  );
}

function HostRow({
  e,
  following,
  onFollow,
}: {
  e: LiveEvent;
  following?: boolean;
  onFollow?: () => void;
}) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-gold text-sm font-bold text-primary-foreground">
        {e.hostInitials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{e.host}</p>
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="text-primary">{e.hostRating.toFixed(1)}★</span>
          <span>·</span>
          <span>{(e.hostFollowers / 1000).toFixed(1)}k followers</span>
        </p>
      </div>
      {onFollow && (
        <button
          onClick={onFollow}
          className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-wider ${
            following
              ? "border border-border text-muted-foreground"
              : "bg-gradient-gold text-primary-foreground"
          }`}
        >
          {following ? <Check className="h-3 w-3" /> : <UserPlus className="h-3 w-3" />}
          {following ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
}

function MetaCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <p className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3 text-primary" /> {label}
      </p>
      <p className="mt-1 text-xs font-semibold">{value}</p>
    </div>
  );
}

function LotsList({
  lots,
  mode,
  eventId,
}: {
  lots: NonNullable<ReturnType<typeof getAuction>>[];
  mode: "live" | "locked";
  eventId: string;
}) {
  return (
    <div className="mt-3 space-y-2.5">
      {lots.map((a) => (
        <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-2.5">
          <img src={a.image} alt={a.title} className="h-16 w-16 shrink-0 rounded-lg object-cover" loading="lazy" />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] uppercase tracking-widest text-primary">{a.category}</p>
            <p className="line-clamp-1 text-xs font-semibold">{a.title}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[9px] text-muted-foreground">
              <ShieldCheck className="h-2.5 w-2.5 text-primary" /> Verified
            </p>
            <p className="mt-1 text-sm font-bold leading-none text-gradient-gold">${a.currentBid.toLocaleString()}</p>
          </div>
          {mode === "live" ? (
            <Link
              to="/live"
              search={{ event: eventId }}
              className="shrink-0 rounded-md bg-gradient-gold px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-primary-foreground"
            >
              Bid Live
            </Link>
          ) : (
            <span className="flex shrink-0 items-center gap-1 rounded-md border border-border bg-surface-2 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              <Lock className="h-3 w-3" /> Locked
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function StickyBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[440px] border-t border-border bg-background/95 px-5 py-3 backdrop-blur">
      {children}
    </div>
  );
}
