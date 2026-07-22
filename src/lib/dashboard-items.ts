import {
  Gavel,
  Radio,
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
  { slug: "bids", label: "My Bids", icon: Gavel, badge: "4", description: "Track every active, winning, and outbid property in one place." },
  { slug: "live", label: "Live Auctions", icon: Radio, description: "Jump into rooms currently streaming with real-time bidding." },
  { slug: "streams", label: "Auction Streams", icon: Clapperboard, description: "Replays and upcoming premieres of signature property events." },
  { slug: "orders", label: "My Closings", icon: PackageCheck, description: "Escrow status, closing docs, and purchase history." },
  { slug: "source", label: "Source Me", icon: Sparkles, description: "Tell us what you want — our agents find the right home." },
  { slug: "messages", label: "Message Center", icon: MessagesSquare, badge: "2", description: "Direct messages with sellers, agents, and support." },
  { slug: "community", label: "Community", icon: Users2, description: "Buyer forums, investor clubs, and member-only drops." },
  { slug: "consignment", label: "List a Home", icon: ScrollText, description: "Submit your property to our listing specialists." },
  { slug: "faq", label: "FAQ", icon: CircleHelp, description: "Answers to bidding, payment, and closing questions." },
  { slug: "alerts", label: "Outbid Alerts", icon: BellRing, description: "Customize push and email alerts for your watchlist." },
  { slug: "selling", label: "Selling Hub", icon: Store, description: "List, manage, and sell your properties." },
];

export function getDashboardItem(slug: string) {
  return DASHBOARD_ITEMS.find((d) => d.slug === slug);
}
