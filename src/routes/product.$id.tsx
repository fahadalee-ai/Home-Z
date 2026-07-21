import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Heart, Share2, ShieldCheck, Star, Truck, RotateCcw, Lock, Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { SHOP_PRODUCTS, getProduct } from "@/lib/shop-data";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = getProduct(params.id);
    return { meta: [{ title: p ? `${p.title} — Supreme Signatures` : "Product" }] };
  },
  loader: ({ params }) => {
    if (!getProduct(params.id)) throw notFound();
    return null;
  },
  notFoundComponent: () => <div className="grid min-h-screen place-items-center text-muted-foreground">Product not found</div>,
  errorComponent: ({ error }) => <div className="grid min-h-screen place-items-center text-muted-foreground">{error.message}</div>,
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const a = getProduct(id)!;
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"description" | "details" | "shipping">("description");
  const [added, setAdded] = useState(false);
  const price = a.price;
  const oldPrice = Math.round(price * 1.15);

  return (
    <div className="mx-auto min-h-screen max-w-[440px] pb-32">
      {/* Hero */}
      <div className="relative h-[420px] overflow-hidden bg-surface">
        <img src={a.image} alt={a.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-10">
          <Link to="/shop" className="grid h-10 w-10 place-items-center rounded-full bg-black/50 backdrop-blur"><ArrowLeft className="h-4 w-4" /></Link>
          <div className="flex gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full bg-black/50 backdrop-blur"><Share2 className="h-4 w-4" /></button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-black/50 backdrop-blur"><Heart className="h-4 w-4" /></button>
          </div>
        </div>
        {/* Thumbs */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {[0,1,2,3].map((i) => (
            <span key={i} className={`h-1.5 rounded-full transition ${i === 0 ? "w-6 bg-primary" : "w-1.5 bg-white/40"}`} />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pt-5">
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary">{a.category}</p>
        <h1 className="mt-1 font-display text-2xl font-bold leading-tight">{a.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">{a.subtitle}</p>

        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-primary text-primary" /> 4.9 (218)</span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-1 text-primary"><ShieldCheck className="h-3.5 w-3.5" /> Authenticated</span>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-end gap-3">
          <p className="font-display text-3xl font-bold text-gradient-gold leading-none">${price.toLocaleString()}</p>
          <p className="pb-0.5 text-sm text-muted-foreground line-through">${oldPrice.toLocaleString()}</p>
          <span className="ml-auto rounded-md bg-success/15 px-2 py-1 text-[10px] font-semibold text-success">In stock</span>
        </div>

        {/* Quantity */}
        <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
          <p className="text-sm font-medium">Quantity</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-8 w-8 place-items-center rounded-md border border-primary/40">
              <Minus className="h-3.5 w-3.5 text-primary" />
            </button>
            <span className="w-6 text-center font-display text-base font-bold">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="grid h-8 w-8 place-items-center rounded-md border border-primary/40">
              <Plus className="h-3.5 w-3.5 text-primary" />
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { icon: Truck, label: "Free Ship" },
            { icon: RotateCcw, label: "14-Day Return" },
            { icon: Lock, label: "Secure Pay" },
          ].map((t) => (
            <div key={t.label} className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface p-3">
              <t.icon className="h-4 w-4 text-primary" />
              <p className="text-[10px] text-muted-foreground">{t.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-5 border-b border-border">
          {(["description", "details", "shipping"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative pb-3 text-xs font-semibold capitalize transition ${tab === t ? "text-primary" : "text-muted-foreground"}`}
            >
              {t}
              {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-gold" />}
            </button>
          ))}
        </div>

        <div className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {tab === "description" && (
            <p>An authenticated piece from our private vault collection. Every item is independently verified, photo-matched where applicable, and includes a Certificate of Authenticity. Climate-controlled storage and insured shipping included.</p>
          )}
          {tab === "details" && (
            <div className="grid grid-cols-2 gap-2">
              {[["Condition", "Mint"], ["Year", "1996"], ["COA", "PSA/DNA"], ["Vault ID", "SS-0421"]].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-border bg-surface p-2.5">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</p>
                  <p className="mt-0.5 text-xs font-semibold text-foreground">{v}</p>
                </div>
              ))}
            </div>
          )}
          {tab === "shipping" && (
            <ul className="space-y-2">
              <li className="flex gap-2"><Check className="h-3.5 w-3.5 shrink-0 text-primary" /> Free insured shipping worldwide.</li>
              <li className="flex gap-2"><Check className="h-3.5 w-3.5 shrink-0 text-primary" /> Tracked white-glove delivery, 3–5 business days.</li>
              <li className="flex gap-2"><Check className="h-3.5 w-3.5 shrink-0 text-primary" /> 14-day no-questions return window.</li>
            </ul>
          )}
        </div>

        {/* Reviews snippet */}
        <div className="mt-6 rounded-xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold">Reviews</h3>
            <button className="text-[10px] uppercase tracking-widest text-primary">See all</button>
          </div>
          <div className="mt-3 flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-gold text-[11px] font-bold text-primary-foreground">JL</div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold">James L.</p>
                <span className="flex items-center gap-0.5 text-primary">
                  {Array.from({length:5}).map((_,i)=>(<Star key={i} className="h-3 w-3 fill-current" />))}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Exactly as described. The COA and packaging exceeded expectations. Truly white-glove.</p>
            </div>
          </div>
        </div>

        {/* You may also like */}
        <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">You may also like</p>
        <div className="hide-scrollbar mt-2 flex gap-3 overflow-x-auto pb-1">
          {SHOP_PRODUCTS.filter((x) => x.id !== a.id).slice(0, 4).map((r) => (
            <Link to="/product/$id" params={{ id: r.id }} key={r.id} className="w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
              <div className="h-28 w-full overflow-hidden">
                <img src={r.image} alt={r.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-2">
                <p className="line-clamp-1 text-[11px] font-medium">{r.title}</p>
                <p className="mt-0.5 font-display text-sm font-bold text-gradient-gold">${r.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[440px] border-t border-border bg-background/95 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</p>
            <p className="font-display text-lg font-bold text-gradient-gold leading-none">${(price * qty).toLocaleString()}</p>
          </div>
          <button
            onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1600); }}
            className="ml-auto grid h-12 w-12 place-items-center rounded-full border border-primary/40 text-primary"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold">
            Buy Now
          </button>
        </div>
      </div>

      {added && (
        <div className="fixed inset-x-0 bottom-24 z-50 mx-auto flex max-w-[320px] items-center justify-center gap-2 rounded-full bg-gradient-gold px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-gold animate-in fade-in slide-in-from-bottom">
          <Check className="h-4 w-4" /> Added to cart
        </div>
      )}
    </div>
  );
}
