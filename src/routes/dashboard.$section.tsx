import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { DASHBOARD_ITEMS, getDashboardItem } from "@/lib/dashboard-items";
import { AUCTIONS } from "@/lib/auction-data";

export const Route = createFileRoute("/dashboard/$section")({
  head: ({ params }) => {
    const item = getDashboardItem(params.section);
    return { meta: [{ title: `${item?.label ?? "Dashboard"} — Supreme Signatures` }] };
  },
  loader: ({ params }) => {
    const item = getDashboardItem(params.section);
    if (!item) throw notFound();
    return { item };
  },
  component: Section,
  notFoundComponent: () => (
    <div className="mx-auto max-w-[440px] px-5 pt-20 text-center">
      <p className="text-sm text-muted-foreground">Section not found.</p>
      <Link to="/dashboard" className="mt-3 inline-block text-xs text-primary">Back to Dashboard</Link>
    </div>
  ),
});

function Section() {
  const { item } = Route.useLoaderData();
  const Icon = item.icon;

  return (
    <div className="mx-auto min-h-screen max-w-[440px] px-5 pb-28 pt-10">
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="grid h-9 w-9 place-items-center rounded-lg border border-border">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-base font-semibold">{item.label}</h1>
        <div className="h-9 w-9" />
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-xl border border-primary/25 bg-gradient-to-br from-primary/15 via-surface to-background p-4">
        <span className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-gold text-primary-foreground">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-primary">Supreme Signatures</p>
          <p className="text-xs text-muted-foreground">{item.description}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5">
        <Search className="h-3.5 w-3.5 text-primary" />
        <input
          placeholder={`Search ${item.label.toLowerCase()}...`}
          className="flex-1 bg-transparent text-xs placeholder:text-muted-foreground/70 focus:outline-none"
        />
      </div>

      <SectionBody slug={item.slug} />

      <div className="mt-6">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Quick jump</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {DASHBOARD_ITEMS.filter((d) => d.slug !== item.slug).slice(0, 8).map((d) => (
            <Link
              key={d.slug}
              to="/dashboard/$section"
              params={{ section: d.slug }}
              className="flex flex-col items-center gap-1 rounded-lg border border-border bg-surface p-2 text-center"
            >
              <d.icon className="h-3.5 w-3.5 text-primary" />
              <span className="text-[9px] leading-tight">{d.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function SectionBody({ slug }: { slug: string }) {
  if (slug === "bids") {
    return (
      <div className="mt-5 space-y-3">
        <Link
          to="/my-bids"
          className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-4 py-3"
        >
          <div>
            <p className="text-xs font-semibold">Open full My Bids</p>
            <p className="text-[10px] text-muted-foreground">Active · Won · Missed</p>
          </div>
          <ChevronRight className="h-4 w-4 text-primary" />
        </Link>
        {AUCTIONS.filter((a) => a.bidStatus !== "none").map((a) => {
          const won = a.bidStatus === "won";
          const outbid = a.bidStatus === "outbid";
          return (
            <div key={a.id} className="rounded-lg border border-border bg-surface p-2.5">
              <Link to="/auction/$id" params={{ id: a.id }} className="flex items-center gap-3">
                <img src={a.image} alt="" className="h-14 w-14 rounded-md object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-semibold">{a.title}</p>
                  <p className="text-[10px] text-muted-foreground">My bid: ${a.myBid?.toLocaleString() ?? "—"}</p>
                  <p className="mt-0.5 text-xs font-bold text-gradient-gold">${a.currentBid.toLocaleString()}</p>
                </div>
                <span
                  className={`shrink-0 rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
                    won ? "bg-success/20 text-success" : outbid ? "bg-live/20 text-live" : "bg-primary/15 text-primary"
                  }`}
                >
                  {won ? "Won" : outbid ? "Outbid" : "Bidding"}
                </span>
              </Link>
              {won && (
                <Link
                  to="/checkout/$id"
                  params={{ id: a.id }}
                  className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-gold py-2 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-gold"
                >
                  Pay ${a.currentBid.toLocaleString()} Now
                </Link>
              )}
              {outbid && (
                <Link to="/auction/$id" params={{ id: a.id }} className="mt-2.5 flex w-full items-center justify-center rounded-md border border-primary/40 py-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                  Place Higher Bid
                </Link>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (slug === "orders" || slug === "live" || slug === "streams") {
    return (
      <div className="mt-5 space-y-2.5">
        {AUCTIONS.slice(0, 4).map((a) => (
          <Link key={a.id} to="/auction/$id" params={{ id: a.id }} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-2.5">
            <img src={a.image} alt="" className="h-14 w-14 rounded-md object-cover" loading="lazy" />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-xs font-semibold">{a.title}</p>
              <p className="text-[10px] text-muted-foreground">{a.category}</p>
              <p className="mt-0.5 text-xs font-bold text-gradient-gold">${a.currentBid.toLocaleString()}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    );
  }

  if (slug === "messages") {
    const threads = [
      { from: "Marcus Reid", msg: "Your Rolex bid was matched.", time: "2m" },
      { from: "Support", msg: "Authentication complete on lot #142.", time: "1h" },
      { from: "Sophie L.", msg: "Interested in your consignment?", time: "Yesterday" },
    ];
    return (
      <div className="mt-5 space-y-2">
        {threads.map((t) => (
          <div key={t.from} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-gold text-primary-foreground text-xs font-bold">
              {t.from.split(" ").map((w) => w[0]).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold">{t.from}</p>
              <p className="line-clamp-1 text-[11px] text-muted-foreground">{t.msg}</p>
            </div>
            <span className="text-[9px] text-muted-foreground">{t.time}</span>
          </div>
        ))}
      </div>
    );
  }

  if (slug === "faq") {
    const faqs = [
      "How does proxy bidding work?",
      "When do I get charged for a winning bid?",
      "How is authentication verified?",
      "What is the return policy?",
      "How are shipping fees calculated?",
    ];
    return (
      <div className="mt-5 space-y-2">
        {faqs.map((q) => (
          <details key={q} className="rounded-lg border border-border bg-surface p-3">
            <summary className="cursor-pointer text-xs font-semibold">{q}</summary>
            <p className="mt-2 text-[11px] text-muted-foreground">Detailed answer coming soon. Our specialists are here to help 24/7.</p>
          </details>
        ))}
      </div>
    );
  }

  if (slug === "alerts") {
    const alerts = ["Outbid notifications", "Auction starting soon", "Watchlist drops", "Specialist replies", "Order updates"];
    return (
      <div className="mt-5 space-y-2">
        {alerts.map((a, i) => (
          <label key={a} className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
            <span className="text-xs">{a}</span>
            <input type="checkbox" defaultChecked={i < 3} className="h-4 w-4 accent-[color:var(--primary)]" />
          </label>
        ))}
      </div>
    );
  }

  // generic empty state
  return (
    <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/40 p-8 text-center">
      <p className="text-xs font-semibold">Coming soon</p>
      <p className="mt-1 max-w-[240px] text-[11px] text-muted-foreground">
        This experience is being curated for you. Check back shortly.
      </p>
      <Link to="/auctions" className="mt-4 rounded-lg bg-gradient-gold px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground">
        Browse Auctions
      </Link>
    </div>
  );
}
