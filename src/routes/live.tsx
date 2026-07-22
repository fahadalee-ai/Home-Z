import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Share2,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Users,
  Send,
  Heart,
  Gavel,
  X,
  Delete,
  Trophy,
  ShoppingBag,
} from "lucide-react";
import {
  getActiveEvent,
  getAuction,
  getEvent,
  LIVE_CHAT_POOL,
  LIVE_CHAT_SEED,
} from "@/lib/auction-data";
import { useCountdown } from "@/lib/use-countdown";

export const Route = createFileRoute("/live")({
  validateSearch: (search: Record<string, unknown>) => ({
    event: typeof search.event === "string" ? search.event : undefined,
  }),
  head: () => ({ meta: [{ title: "Live Auction — Home Z" }] }),
  component: Live,
});

type ChatMsg = { id: number; user: string; initials: string; text: string; gold?: boolean };
type BidFlash = "winning" | "outbid" | null;
type FloatEmoji = { id: number; emoji: string; left: number };

const EMOJIS = ["🔥", "👏", "❤️", "💰", "😱", "🙌"];

function Live() {
  const navigate = useNavigate();
  const { event: eventId } = Route.useSearch();
  const event = (eventId ? getEvent(eventId) : null) ?? getActiveEvent();
  const featured = getAuction(event.lotIds[0]) ?? getAuction("jordan-23-jersey")!;

  const [muted, setMuted] = useState(false);
  const [following, setFollowing] = useState(false);
  const [viewers, setViewers] = useState(event.viewers ?? 1284);
  const [comments, setComments] = useState<ChatMsg[]>(
    LIVE_CHAT_SEED.map((c, i) => ({ id: i + 1, ...c })),
  );
  const [text, setText] = useState("");
  const [currentBid, setCurrentBid] = useState(featured.currentBid);
  const [highestBidder, setHighestBidder] = useState("JordanFan23");
  const [myBid, setMyBid] = useState<number | null>(null);
  const [bidFlash, setBidFlash] = useState<BidFlash>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [won, setWon] = useState(false);
  const [lotEndsAt] = useState(() => Date.now() + 55_000);
  const [floatEmojis, setFloatEmojis] = useState<FloatEmoji[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);
  const outbidTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { m, s, ended, ready } = useCountdown(lotEndsAt);
  const increment = featured.bidIncrement;
  const quickBids = [currentBid + increment, currentBid + increment * 2, currentBid + increment * 4];

  useEffect(() => {
    const id = setInterval(() => setViewers((v) => Math.max(800, v + Math.floor(Math.random() * 7) - 2)), 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const pool = LIVE_CHAT_POOL[Math.floor(Math.random() * LIVE_CHAT_POOL.length)];
      setComments((c) => [...c.slice(-40), { id: Date.now(), ...pool }]);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [comments]);

  useEffect(() => {
    if (ready && ended && myBid !== null && myBid >= currentBid && !won) {
      setWon(true);
      setBidFlash(null);
    }
  }, [ready, ended, myBid, currentBid, won]);

  useEffect(() => () => {
    if (outbidTimer.current) clearTimeout(outbidTimer.current);
  }, []);

  const placeBid = (amount: number) => {
    if (amount <= currentBid) return;
    setCurrentBid(amount);
    setMyBid(amount);
    setHighestBidder("You");
    setBidFlash("winning");
    setSheetOpen(false);
    setComments((c) => [
      ...c,
      { id: Date.now(), user: "You", initials: "AC", text: `Bid $${amount.toLocaleString()}`, gold: true },
    ]);

    if (outbidTimer.current) clearTimeout(outbidTimer.current);
    outbidTimer.current = setTimeout(() => {
      setMyBid((mine) => {
        if (mine === null) return null;
        setCurrentBid((prev) => {
          if (mine < prev) return prev;
          const next = mine + increment * (1 + Math.floor(Math.random() * 2));
          setHighestBidder("VaultKing");
          setBidFlash("outbid");
          setComments((c) => [
            ...c,
            {
              id: Date.now() + 1,
              user: "VaultKing",
              initials: "VK",
              text: `Outbid at $${next.toLocaleString()}`,
              gold: true,
            },
          ]);
          return next;
        });
        return mine;
      });
    }, 7000);
  };

  const send = () => {
    if (!text.trim()) return;
    setComments((c) => [...c, { id: Date.now(), user: "You", initials: "AC", text: text.trim() }]);
    setText("");
  };

  const burstEmoji = (emoji: string) => {
    const id = Date.now() + Math.random();
    setFloatEmojis((e) => [...e, { id, emoji, left: 55 + Math.random() * 35 }]);
    setTimeout(() => setFloatEmojis((e) => e.filter((x) => x.id !== id)), 1800);
  };

  if (won) {
    return (
      <WinScreen
        product={featured}
        price={myBid ?? currentBid}
        onContinue={() => {
          setWon(false);
          setMyBid(null);
          setBidFlash(null);
          setCurrentBid(featured.currentBid + increment * 3);
          setHighestBidder("JordanFan23");
        }}
        onCheckout={() => navigate({ to: "/checkout/$id", params: { id: featured.id } })}
      />
    );
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-[440px] overflow-hidden bg-black">
      {/* Full-bleed video plane */}
      <img src={event.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/90" />

      {/* Floating emoji reactions */}
      {floatEmojis.map((e) => (
        <span
          key={e.id}
          className="pointer-events-none absolute bottom-48 z-30 animate-in fade-in slide-in-from-bottom-8 duration-700 text-2xl"
          style={{ left: `${e.left}%` }}
        >
          {e.emoji}
        </span>
      ))}

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-20 px-4 pt-10">
        <div className="flex items-center gap-2">
          <Link
            to="/events/$id"
            params={{ id: event.id }}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/50 backdrop-blur"
          >
            <ChevronDown className="h-4 w-4" />
          </Link>

          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-black/45 py-1 pl-1 pr-2 backdrop-blur">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-gold text-[10px] font-bold text-primary-foreground">
              {event.hostInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold leading-tight">{event.host}</p>
              <p className="text-[9px] text-white/60">{(event.hostFollowers / 1000).toFixed(1)}k followers</p>
            </div>
            <button
              onClick={() => setFollowing((f) => !f)}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                following ? "border border-white/30 text-white" : "bg-gradient-gold text-primary-foreground"
              }`}
            >
              {following ? "Following" : "Follow"}
            </button>
          </div>

          <span className="flex shrink-0 items-center gap-1 rounded-full bg-live px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white pulse-live" /> Live
          </span>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[9px] backdrop-blur">
            <Users className="h-3 w-3" /> {viewers.toLocaleString()}
          </span>
          <button
            onClick={() => setMuted((m) => !m)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/50 backdrop-blur"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/50 backdrop-blur">
            <Share2 className="h-3.5 w-3.5" />
          </button>
          <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/50 backdrop-blur">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Floating live comments */}
      <div
        ref={feedRef}
        className="absolute inset-x-0 bottom-52 z-10 hide-scrollbar max-h-52 space-y-2 overflow-y-auto px-4 mask-image-fade"
        style={{ maskImage: "linear-gradient(to bottom, transparent, black 20%, black 100%)" }}
      >
        {comments.map((c) => (
          <div key={c.id} className="flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-black/55 text-[8px] font-bold backdrop-blur">
              {c.initials}
            </div>
            <p className={`rounded-2xl bg-black/40 px-2.5 py-1.5 text-[11px] leading-snug backdrop-blur ${c.gold ? "text-primary" : "text-white/90"}`}>
              <span className="mr-1.5 font-semibold text-white">{c.user}</span>
              {c.text}
            </p>
          </div>
        ))}
      </div>

      {/* Bid status overlays */}
      {bidFlash && (
        <div className="absolute inset-x-0 top-28 z-30 flex justify-center px-6 animate-in fade-in zoom-in-95 duration-300">
          <div
            className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest shadow-elevated ${
              bidFlash === "winning"
                ? "bg-success text-success-foreground"
                : "bg-live text-white"
            }`}
          >
            {bidFlash === "winning" ? "You're Winning" : "You've Been Outbid"}
          </div>
        </div>
      )}

      {/* Active product card + composer */}
      <div className="absolute inset-x-0 bottom-0 z-20 space-y-2 px-4 pb-5 pt-2">
        <div className="overflow-hidden rounded-2xl border border-primary/30 bg-black/75 backdrop-blur-xl">
          <div className="flex gap-3 p-3">
            <img src={featured.image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-xs font-semibold">{featured.title}</p>
              <div className="mt-1 flex items-end justify-between gap-2">
                <div>
                  <p className="text-[8px] uppercase tracking-wider text-muted-foreground">Current Bid</p>
                  <p className="font-display text-lg font-bold leading-none text-gradient-gold">
                    ${currentBid.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] uppercase tracking-wider text-muted-foreground">Ends in</p>
                  <p className="font-display text-sm font-bold tabular-nums">
                    {ready ? `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : "--:--"}
                  </p>
                </div>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Highest: <span className="text-primary">{highestBidder}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 border-t border-white/10 px-3 py-2.5">
            {quickBids.map((amt) => (
              <button
                key={amt}
                onClick={() => placeBid(amt)}
                className="flex-1 rounded-full border border-primary/40 bg-primary/10 py-2 text-[10px] font-bold text-primary active:scale-[0.97]"
              >
                ${amt.toLocaleString()}
              </button>
            ))}
            <button
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-1 rounded-full bg-gradient-gold px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-gold active:scale-[0.97]"
            >
              <Gavel className="h-3 w-3" /> Custom
            </button>
          </div>
        </div>

        {/* Emoji row + chat input */}
        <div className="flex items-center gap-1.5">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => burstEmoji(e)}
              className="grid h-8 w-8 place-items-center rounded-full bg-black/50 text-sm backdrop-blur active:scale-90"
            >
              {e}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Say something..."
            className="flex-1 rounded-full border border-white/15 bg-black/50 px-4 py-2.5 text-sm text-white placeholder:text-white/40 backdrop-blur focus:outline-none"
          />
          <button onClick={() => burstEmoji("❤️")} className="grid h-10 w-10 place-items-center rounded-full bg-black/50 backdrop-blur">
            <Heart className="h-4 w-4 text-primary" />
          </button>
          <button onClick={send} className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold text-primary-foreground">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {sheetOpen && (
        <CustomBidSheet
          product={featured}
          currentBid={currentBid}
          increment={increment}
          onClose={() => setSheetOpen(false)}
          onConfirm={placeBid}
        />
      )}
    </div>
  );
}

function CustomBidSheet({
  product,
  currentBid,
  increment,
  onClose,
  onConfirm,
}: {
  product: NonNullable<ReturnType<typeof getAuction>>;
  currentBid: number;
  increment: number;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}) {
  const minBid = currentBid + increment;
  const [digits, setDigits] = useState("");
  const amount = digits ? Number(digits) : 0;
  const valid = amount >= minBid;

  const press = (key: string) => {
    if (key === "del") {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (digits.length >= 7) return;
    setDigits((d) => (d === "0" ? key : d + key));
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <button className="flex-1" onClick={onClose} aria-label="Close" />
      <div className="rounded-t-3xl border border-border bg-background px-5 pb-8 pt-3 animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold">Custom Bid</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full border border-border">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
          <img src={product.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-xs font-semibold">{product.title}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Current <span className="font-semibold text-primary">${currentBid.toLocaleString()}</span>
            </p>
            <p className="text-[10px] text-muted-foreground">Min bid ${minBid.toLocaleString()}</p>
          </div>
        </div>

        <p className="mt-5 text-center font-display text-4xl font-bold text-gradient-gold tabular-nums">
          ${amount ? amount.toLocaleString() : "0"}
        </p>
        {!valid && digits && (
          <p className="mt-1 text-center text-[10px] text-live">Must be at least ${minBid.toLocaleString()}</p>
        )}

        <div className="mt-5 grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k, i) =>
            k === "" ? (
              <div key={i} />
            ) : (
              <button
                key={k}
                onClick={() => press(k)}
                className="grid h-12 place-items-center rounded-xl border border-border bg-surface text-lg font-semibold active:bg-surface-2"
              >
                {k === "del" ? <Delete className="h-4 w-4" /> : k}
              </button>
            ),
          )}
        </div>

        <button
          disabled={!valid}
          onClick={() => onConfirm(amount)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-gold disabled:opacity-40"
        >
          <Gavel className="h-4 w-4" /> Confirm Bid
        </button>
      </div>
    </div>
  );
}

function WinScreen({
  product,
  price,
  onContinue,
  onCheckout,
}: {
  product: NonNullable<ReturnType<typeof getAuction>>;
  price: number;
  onContinue: () => void;
  onCheckout: () => void;
}) {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-[440px] flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      <Confetti />
      <div className="relative z-10 flex flex-col items-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-gold pulse-gold">
          <Trophy className="h-7 w-7" />
        </span>
        <p className="mt-5 text-[11px] uppercase tracking-[0.3em] text-primary">Auction Won</p>
        <h1 className="mt-2 font-display text-3xl font-bold">
          You own a <span className="text-gradient-gold">legend</span>
        </h1>
        <div className="mt-6 overflow-hidden rounded-2xl border border-primary/30 bg-surface">
          <img src={product.image} alt="" className="h-44 w-64 object-cover" />
          <div className="p-4">
            <p className="text-sm font-semibold">{product.title}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">{product.subtitle}</p>
            <p className="mt-3 font-display text-2xl font-bold text-gradient-gold">${price.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-8 flex w-full flex-col gap-3">
          <button
            onClick={onCheckout}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-gold"
          >
            <ShoppingBag className="h-4 w-4" /> Checkout Now
          </button>
          <button
            onClick={onContinue}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 py-3.5 text-sm font-bold uppercase tracking-widest text-primary"
          >
            Continue Watching
          </button>
        </div>
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: (i * 37) % 100,
    delay: (i % 8) * 0.12,
    color: i % 3 === 0 ? "#f6d51b" : i % 3 === 1 ? "#c02328" : "#ffffff",
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 h-2 w-2 rounded-sm opacity-80"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animation: `confetti-fall 2.8s ease-in ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
