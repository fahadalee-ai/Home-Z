import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Users, Play, Clock, Calendar, Radio } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { LIVE_EVENTS, type EventStatus, type LiveEvent } from "@/lib/auction-data";
import { useCountdown } from "@/lib/use-countdown";

export const Route = createFileRoute("/events/")({
  head: () => ({ meta: [{ title: "Live Stream Auctions — Home Z" }] }),
  component: Events,
});

const TABS: { key: EventStatus; label: string }[] = [
  { key: "active", label: "Live Now" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

function Events() {
  const [tab, setTab] = useState<EventStatus>("active");
  const list = useMemo(() => LIVE_EVENTS.filter((e) => e.status === tab), [tab]);

  return (
    <div className="mx-auto min-h-screen max-w-[440px] px-5 pb-28 pt-10">
      <div className="flex items-center justify-between">
        <Link to="/home" className="grid h-10 w-10 place-items-center rounded-lg border border-border"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="font-display text-base font-semibold">Live Stream Auctions</h1>
        <div className="h-10 w-10" />
      </div>

      <div className="mt-5 flex gap-1 rounded-md border border-border bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-md px-3 py-2 text-[11px] font-semibold transition ${tab === t.key ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {list.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-surface/40 p-10 text-center">
            <p className="text-xs text-muted-foreground">No {tab} events.</p>
          </div>
        ) : (
          list.map((e) => <EventCard key={e.id} e={e} />)
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function EventCard({ e }: { e: LiveEvent }) {
  const { d, h, m, s, ready } = useCountdown(e.startsAt);
  return (
    <Link
      to="/events/$id"
      params={{ id: e.id }}
      className="block overflow-hidden rounded-lg border border-border bg-surface transition hover:border-primary/40 active:scale-[0.99]"
    >
      <div className="relative h-36">
        <img src={e.cover} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          {e.status === "active" && (
            <span className="flex items-center gap-1 rounded-md bg-live px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white pulse-live" /> Live
            </span>
          )}
          {e.status === "upcoming" && (
            <span className="flex items-center gap-1 rounded-md bg-primary/90 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-primary-foreground">
              <Calendar className="h-2.5 w-2.5" /> Upcoming
            </span>
          )}
          {e.status === "past" && (
            <span className="rounded-md bg-black/70 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white/80">Replay</span>
          )}
          {e.viewers && (
            <span className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[9px] text-white backdrop-blur">
              <Users className="h-2.5 w-2.5" /> {e.viewers.toLocaleString()}
            </span>
          )}
        </div>

        {e.status === "active" && (
          <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-gold pulse-gold">
            <Play className="h-4 w-4 fill-current" />
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="text-[9px] uppercase tracking-widest text-primary">Hosted by {e.host}</p>
        <h3 className="mt-1 line-clamp-1 font-display text-sm font-bold">{e.title}</h3>
        <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{e.description}</p>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">{e.lotIds.length} lots</p>
          {e.status === "upcoming" && ready && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-primary">
              <Clock className="h-3 w-3" /> Starts in {d > 0 ? `${d}d ` : ""}{String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}
            </span>
          )}
          {e.status === "active" && (
            <span className="flex items-center gap-1 rounded-md bg-gradient-gold px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-primary-foreground">
              <Radio className="h-2.5 w-2.5" /> Join Live
            </span>
          )}
          {e.status === "past" && (
            <span className="text-[10px] uppercase tracking-widest text-primary">View Replay</span>
          )}
        </div>
      </div>
    </Link>
  );
}
