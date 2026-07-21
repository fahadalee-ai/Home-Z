import {
  Gavel,
  Radio,
  ShoppingCart,
  Clapperboard,
  PackageCheck,
  Sparkles,
  MessagesSquare,
  Users2,
  ScrollText,
  CircleHelp,
  BellRing,
  Store,
  type LucideIcon,
} from "lucide-react";

export type DashboardItem = {
  slug: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  description: string;
};

export const DASHBOARD_ITEMS: DashboardItem[] = [
  { slug: "bids", label: "My Bids", icon: Gavel, badge: "4", description: "Track every active, winning, and outbid lot in one place." },
  { slug: "live", label: "Live Auctions", icon: Radio, description: "Jump into rooms currently streaming with real-time bidding." },
  { slug: "buy", label: "Buy Products", icon: ShoppingCart, description: "Curated buy-it-now memorabilia from vetted sellers." },
  { slug: "streams", label: "Auction Streams", icon: Clapperboard, description: "Replays and upcoming premieres of signature events." },
  { slug: "orders", label: "My Orders", icon: PackageCheck, description: "Authenticated shipping, insured delivery, and history." },
  { slug: "source", label: "Source Me", icon: Sparkles, description: "Tell us what you want — our specialists find it for you." },
  { slug: "messages", label: "Message Center", icon: MessagesSquare, badge: "2", description: "Direct messages with sellers, specialists, and support." },
  { slug: "community", label: "Community", icon: Users2, description: "Forums, collector clubs, and member-only drops." },
  { slug: "consignment", label: "Consignment", icon: ScrollText, description: "Submit your item to our consignment specialists." },
  { slug: "faq", label: "FAQ", icon: CircleHelp, description: "Answers to bidding, payment, and shipping questions." },
  { slug: "alerts", label: "Outbid Alerts", icon: BellRing, description: "Customize push and email alerts for your watchlist." },
  { slug: "selling", label: "Selling Hub", icon: Store, description: "List, manage, and monetize your collection." },
];

export function getDashboardItem(slug: string) {
  return DASHBOARD_ITEMS.find((d) => d.slug === slug);
}
