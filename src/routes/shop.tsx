import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShoppingCart, Star, Search } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { SHOP_PRODUCTS } from "@/lib/shop-data";

export const Route = createFileRoute("/shop")({
  head: () => ({ meta: [{ title: "Shop — Supreme Signatures" }] }),
  component: Shop,
});

function Shop() {
  return (
    <div className="mx-auto min-h-screen max-w-[440px] px-5 pb-28 pt-10">
      <div className="flex items-center justify-between">
        <Link to="/home" className="grid h-10 w-10 place-items-center rounded-full border border-border"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="font-display text-lg font-semibold">Buy Now</h1>
        <button className="relative grid h-10 w-10 place-items-center rounded-full border border-border">
          <ShoppingCart className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-gold px-1 text-[9px] font-bold text-primary-foreground">2</span>
        </button>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
        <Search className="h-4 w-4 text-primary" />
        <input placeholder="Search products" className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none" />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">Curated luxury memorabilia available at fixed prices.</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {SHOP_PRODUCTS.map((p) => (
          <Link
            to="/product/$id"
            params={{ id: p.id }}
            key={p.id}
            className="group overflow-hidden rounded-xl border border-border bg-surface transition hover:border-primary/40"
          >
            <div className="relative aspect-square overflow-hidden">
              <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
            </div>
            <div className="p-2.5">
              <p className="text-[9px] uppercase tracking-widest text-primary">{p.category}</p>
              <h3 className="mt-0.5 line-clamp-2 text-xs font-semibold leading-tight">{p.title}</h3>
              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                <Star className="h-3 w-3 fill-primary text-primary" /> 4.9 · Authentic
              </div>
              <div className="mt-2 flex items-end justify-between">
                <p className="font-display text-sm font-bold text-gradient-gold">${p.price.toLocaleString()}</p>
                <span className="rounded-md bg-gradient-gold px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-primary-foreground">Buy</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
