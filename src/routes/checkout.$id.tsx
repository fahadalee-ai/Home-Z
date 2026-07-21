import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  ShieldCheck,
  Check,
  ChevronRight,
  Truck,
  Lock,
} from "lucide-react";
import { getAuction } from "@/lib/auction-data";

export const Route = createFileRoute("/checkout/$id")({
  head: ({ params }) => {
    const a = getAuction(params.id);
    return { meta: [{ title: a ? `Checkout — ${a.title}` : "Checkout" }] };
  },
  loader: ({ params }) => {
    if (!getAuction(params.id)) throw notFound();
    return null;
  },
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center text-muted-foreground">Item not found</div>
  ),
  component: Checkout,
});

function Checkout() {
  const { id } = Route.useParams();
  const a = getAuction(id)!;
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [address] = useState("128 Park Ave, New York, NY 10017");
  const [payment] = useState("Visa ···· 4242");

  const price = a.myBid ?? a.currentBid;
  const shipping = 0;
  const insurance = Math.round(price * 0.015);
  const tax = Math.round(price * 0.08875);
  const total = price + shipping + insurance + tax;

  if (placed) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[440px] flex-col items-center justify-center px-8 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-gold">
          <Check className="h-7 w-7" />
        </span>
        <p className="mt-5 text-[11px] uppercase tracking-[0.3em] text-primary">Order Placed</p>
        <h1 className="mt-2 font-display text-2xl font-bold">
          You're all <span className="text-gradient-gold">set</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your item is secured in our vault and will ship with white-glove insured delivery.
        </p>
        <img src={a.image} alt="" className="mt-6 h-36 w-36 rounded-2xl object-cover border border-border" />
        <p className="mt-3 text-xs font-semibold">{a.title}</p>
        <p className="font-display text-lg font-bold text-gradient-gold">${total.toLocaleString()}</p>
        <Link
          to="/home"
          className="mt-8 w-full rounded-full bg-gradient-gold py-3.5 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-gold"
        >
          Back to Home
        </Link>
        <Link to="/my-bids" className="mt-3 text-xs uppercase tracking-widest text-primary">
          View My Bids
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-[440px] px-5 pb-32 pt-10">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: "/my-bids" })}
          className="grid h-10 w-10 place-items-center rounded-lg border border-border"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="font-display text-base font-semibold">Checkout</h1>
        <div className="h-10 w-10" />
      </div>

      {/* Order summary */}
      <section className="mt-6">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Order Summary</p>
        <div className="mt-3 flex gap-3 rounded-2xl border border-border bg-surface p-3">
          <img src={a.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] uppercase tracking-widest text-primary">{a.category}</p>
            <p className="mt-0.5 line-clamp-2 text-sm font-semibold">{a.title}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{a.subtitle}</p>
            <p className="mt-2 font-display text-base font-bold text-gradient-gold">${price.toLocaleString()}</p>
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section className="mt-5">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <MapPin className="h-3 w-3 text-primary" /> Shipping Address
          </p>
          <button className="text-[10px] uppercase tracking-widest text-primary">Edit</button>
        </div>
        <button className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold">Alexander Chen</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{address}</p>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-primary">
              <Truck className="h-3 w-3" /> Free insured white-glove shipping
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </section>

      {/* Payment */}
      <section className="mt-5">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <CreditCard className="h-3 w-3 text-primary" /> Payment Method
          </p>
          <button className="text-[10px] uppercase tracking-widest text-primary">Change</button>
        </div>
        <button className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-gold text-primary-foreground">
            <CreditCard className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold">{payment}</p>
            <p className="text-[10px] text-muted-foreground">Expires 08/28</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </section>

      {/* Breakdown */}
      <section className="mt-5 rounded-2xl border border-border bg-surface p-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Price Breakdown</p>
        <div className="mt-3 space-y-2 text-xs">
          <Row label="Winning bid" value={`$${price.toLocaleString()}`} />
          <Row label="Shipping" value="Free" />
          <Row label="Vault insurance" value={`$${insurance.toLocaleString()}`} />
          <Row label="Tax" value={`$${tax.toLocaleString()}`} />
          <div className="border-t border-border pt-2" />
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-display text-lg font-bold text-gradient-gold">${total.toLocaleString()}</span>
          </div>
        </div>
      </section>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
        <Lock className="h-3 w-3 text-primary" />
        <ShieldCheck className="h-3 w-3 text-primary" />
        Encrypted checkout · Authenticated & insured
      </p>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[440px] border-t border-border bg-background/95 px-5 py-3 backdrop-blur">
        <button
          onClick={() => setPlaced(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-gold active:scale-[0.98]"
        >
          Place Order · ${total.toLocaleString()}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
