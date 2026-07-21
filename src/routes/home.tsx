import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Heart, Search, Play, Users, ChevronRight, ShieldCheck, Flame, Clock, ShoppingBag } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { AUCTIONS, CATEGORIES } from "@/lib/auction-data";
import { SHOP_PRODUCTS, type ShopProduct } from "@/lib/shop-data";
import { useCountdown } from "@/lib/use-countdown";
import liveStream from "@/assets/live-stream.jpg";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — Supreme Signatures" }] }),
  component: Home,
});

function Home() {
  return (
    <div className="mx-auto min-h-screen max-w-[440px] pb-28">
      {/* Header */}
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 px-5 pt-10">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-gold text-primary-foreground font-display font-bold">
          AC
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Welcome back</p>
          <p className="truncate font-display text-lg font-semibold">Alexander Chen</p>
        </div>
        <IconBadge icon={Heart} />
        <IconBadge icon={Bell} badge="3" />
      </header>

      {/* Search */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <Search className="h-4 w-4 text-primary" />
          <input
            placeholder="Search auctions, products and streams"
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none"
          />
        </div>
      </div>

      {/* Featured live stream */}
      <section className="px-5 pt-7">
        <SectionHeader title="Upcoming Live Stream" cta="View all" to="/events" />
        <FeaturedStream />
      </section>

      {/* Categories */}
      <section className="pt-6">
        <div className="px-5">
          <SectionHeader title="Categories" cta="See all" to="/shop" />
        </div>
        <div className="hide-scrollbar scroll-fade-x mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
          {CATEGORIES.map((c) => (
            <Link to="/shop" key={c.name} className="group w-20 shrink-0">
              <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-border">
                <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
              </div>
              <p className="mt-1.5 line-clamp-1 text-center text-[10px] font-medium text-muted-foreground">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Active auctions */}
      <section className="pt-6">
        <div className="px-5">
          <SectionHeader title="Active Auctions" cta="View all" to="/auctions" icon={<Flame className="h-3.5 w-3.5 text-primary" />} />
        </div>
        <div className="hide-scrollbar scroll-fade-x mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
          {AUCTIONS.map((a) => <AuctionCard key={a.id} a={a} />)}
        </div>
      </section>

      {/* Buy products */}
      <section className="pt-6">
        <div className="px-5">
          <SectionHeader title="Buy Products" cta="View all" to="/shop" icon={<ShoppingBag className="h-3.5 w-3.5 text-primary" />} />
        </div>
        <div className="hide-scrollbar scroll-fade-x mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
          {SHOP_PRODUCTS.map((p) => <BuyProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Sell banner */}
      <section className="px-5 pt-8">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-surface to-background p-6">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Sell on Supreme</p>
          <h3 className="mt-2 font-display text-2xl font-bold leading-tight">
            Have something <span className="text-gradient-gold">legendary?</span>
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">Submit your item to our consignment specialists.</p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground">
            Submit Item <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}

function IconBadge({ icon: Icon, badge }: { icon: any; badge?: string }) {
  return (
    <button className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-surface">
      <Icon className="h-4 w-4" />
      {badge && (
        <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-gold px-1 text-[9px] font-bold text-primary-foreground">
          {badge}
        </span>
      )}
    </button>
  );
}

function SectionHeader({ title, cta, to, icon }: { title: string; cta?: string; to?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-display text-base font-semibold">
        {icon}{title}
      </h2>
      {cta && (
        to ? <Link to={to} className="text-[11px] uppercase tracking-widest text-primary">{cta}</Link>
           : <span className="text-[11px] uppercase tracking-widest text-primary">{cta}</span>
      )}
    </div>
  );
}

function FeaturedStream() {
  const target = Date.now() + 1000 * 60 * 47;
  const { h, m, s } = useCountdown(target);
  return (
    <Link to="/live" search={{ event: "legends-night" }} className="mt-3 block">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Image area */}
        <div className="relative h-44">
          <img src={liveStream} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />

          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-live/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-white pulse-live" /> Soon
            </span>
            <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] text-white/90 backdrop-blur">
              <Users className="h-3 w-3" /> 1.2k
            </span>
          </div>

          <button className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-gold pulse-gold">
            <Play className="h-4 w-4 fill-current" />
          </button>
        </div>

        {/* Info below image */}
        <div className="p-3.5">
          <p className="text-[10px] uppercase tracking-widest text-primary">Hosted by Marcus Reid</p>
          <h3 className="mt-1 line-clamp-1 font-display text-base font-bold">Legends Night: Signed Jersey Vault</h3>
          <div className="mt-3 flex items-center gap-1.5">
            {[["H", h], ["M", m], ["S", s]].map(([l, v]) => (
              <div key={l as string} className="flex items-baseline gap-0.5 rounded-md border border-primary/30 bg-primary/10 px-2 py-1">
                <span className="font-display text-xs font-bold text-gradient-gold">{String(v).padStart(2, "0")}</span>
                <span className="text-[8px] uppercase tracking-widest text-muted-foreground">{l}</span>
              </div>
            ))}
            <span className="ml-auto text-[10px] uppercase tracking-widest text-muted-foreground">Starts soon</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function AuctionCard({ a }: { a: import("@/lib/auction-data").Auction }) {
  const { h, m, ended, ready } = useCountdown(a.endsAt);
  return (
    <Link to="/auction/$id" params={{ id: a.id }} className="group block w-40 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
      <div className="relative h-32 w-full overflow-hidden">
        <img src={a.image} alt={a.title} className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
        <button onClick={(e) => e.preventDefault()} className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-md bg-black/50 backdrop-blur">
          <Heart className="h-3.5 w-3.5 text-white" />
        </button>
        <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-primary backdrop-blur">
          <Clock className="h-2.5 w-2.5" /> {ready ? (ended ? "Ended" : `${h}h ${m}m`) : "--"}
        </span>
      </div>
      <div className="p-2.5">
        <p className="text-[8px] uppercase tracking-widest text-primary/80">{a.category}</p>
        <h3 className="mt-0.5 line-clamp-1 text-xs font-semibold leading-tight">{a.title}</h3>
        <div className="mt-1.5 flex items-end justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-wider text-muted-foreground">Bid</p>
            <p className="text-sm font-bold text-gradient-gold leading-none">${a.currentBid.toLocaleString()}</p>
          </div>
          <ShieldCheck className="h-3 w-3 text-primary" />
        </div>
      </div>
    </Link>
  );
}

function BuyProductCard({ p }: { p: ShopProduct }) {
  return (
    <Link to="/product/$id" params={{ id: p.id }} className="group block w-40 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
      <div className="relative h-32 w-full overflow-hidden">
        <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
        <button onClick={(e) => e.preventDefault()} className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-md bg-black/50 backdrop-blur">
          <Heart className="h-3.5 w-3.5 text-white" />
        </button>
        <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-primary backdrop-blur">
          <ShoppingBag className="h-2.5 w-2.5" /> Buy Now
        </span>
      </div>
      <div className="p-2.5">
        <p className="text-[8px] uppercase tracking-widest text-primary/80">{p.category}</p>
        <h3 className="mt-0.5 line-clamp-1 text-xs font-semibold leading-tight">{p.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-[9px] text-muted-foreground">{p.subtitle}</p>
        <div className="mt-1.5 flex items-end justify-between gap-1.5">
          <div className="min-w-0">
            <p className="text-[8px] uppercase tracking-wider text-muted-foreground">Price</p>
            <p className="text-sm font-bold text-gradient-gold leading-none">${p.price.toLocaleString()}</p>
          </div>
          <span className="shrink-0 rounded-md bg-gradient-gold px-2 py-1 text-[8px] font-semibold uppercase tracking-widest text-primary-foreground">
            Buy Now
          </span>
        </div>
      </div>
    </Link>
  );
}
