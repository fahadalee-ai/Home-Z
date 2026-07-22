import jersey from "@/assets/jersey.jpg";
import baseball from "@/assets/baseball.jpg";
import watch from "@/assets/watch.jpg";
import football from "@/assets/football.jpg";
import cards from "@/assets/cards.jpg";
import liveStream from "@/assets/live-stream.jpg";

export type BidStatus = "none" | "bidding" | "outbid" | "won";

export type Auction = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  currentBid: number;
  totalBids: number;
  bidIncrement: number;
  endsAt: number; // ms timestamp
  category: string;
  authenticated: true;
  myBid?: number;
  bidStatus: BidStatus;
};

const now = Date.now();
const hr = 3600_000;

export const AUCTIONS: Auction[] = [
  { id: "malibu-ocean-villa", title: "Malibu Oceanfront Villa", subtitle: "5 bed · 6 bath — Private beach access", image: jersey, currentBid: 4850000, totalBids: 87, bidIncrement: 25000, endsAt: now + 2 * hr + 14 * 60_000, category: "Luxury Villas", authenticated: true, myBid: 4825000, bidStatus: "bidding" },
  { id: "austin-modern-estate", title: "Austin Hilltop Modern Estate", subtitle: "4 bed · 4.5 bath — Smart home, pool", image: baseball, currentBid: 1870000, totalBids: 64, bidIncrement: 10000, endsAt: now + 5 * hr, category: "Modern Homes", authenticated: true, myBid: 1850000, bidStatus: "outbid" },
  { id: "manhattan-penthouse", title: "Manhattan Skyline Penthouse", subtitle: "3 bed · Floor-to-ceiling city views", image: watch, currentBid: 6230000, totalBids: 31, bidIncrement: 50000, endsAt: now + 9 * hr + 40 * 60_000, category: "Penthouses", authenticated: true, bidStatus: "none" },
  { id: "miami-waterfront-condo", title: "Miami Waterfront Condo", subtitle: "2 bed · Marina views — Turnkey", image: football, currentBid: 875000, totalBids: 65, bidIncrement: 5000, endsAt: now + 1 * hr + 22 * 60_000, category: "Condos", authenticated: true, myBid: 875000, bidStatus: "won" },
  { id: "aspen-ski-chalet", title: "Aspen Mountain Chalet", subtitle: "6 bed · Ski-in/ski-out — Private spa", image: cards, currentBid: 3290000, totalBids: 49, bidIncrement: 15000, endsAt: now + 3 * hr + 5 * 60_000, category: "Mountain Homes", authenticated: true, bidStatus: "none" },
];

export const CATEGORIES = [
  { name: "Luxury Villas", image: jersey },
  { name: "Modern Homes", image: baseball },
  { name: "Penthouses", image: watch },
  { name: "Mountain Homes", image: cards },
  { name: "Condos", image: football },
];

export const FILTER_CATEGORIES = ["All", ...CATEGORIES.map((c) => c.name)];

export function getAuction(id: string) {
  return AUCTIONS.find((a) => a.id === id);
}

// ===== Live Stream Events =====
export type EventStatus = "upcoming" | "active" | "past";

export type LiveComment = {
  user: string;
  text: string;
  initials: string;
};

export type LiveEvent = {
  id: string;
  title: string;
  host: string;
  hostInitials: string;
  hostFollowers: number;
  hostRating: number;
  description: string;
  cover: string;
  startsAt: number;
  endsAt: number;
  status: EventStatus;
  lotIds: string[];
  categories: string[];
  location?: string;
  viewers?: number;
  winners?: { lotId: string; user: string; amount: number }[];
  replayComments?: LiveComment[];
};

export const LIVE_EVENTS: LiveEvent[] = [
  {
    id: "legends-night",
    title: "Coastal Classics: Oceanfront Drop",
    host: "Marcus Reid",
    hostInitials: "MR",
    hostFollowers: 48200,
    hostRating: 4.9,
    description: "A curated live auction of premium oceanfront and waterfront homes. Walkthroughs with local specialists and live Q&A on each listing.",
    cover: liveStream,
    startsAt: now - 20 * 60_000,
    endsAt: now + 90 * 60_000,
    status: "active",
    lotIds: ["malibu-ocean-villa", "miami-waterfront-condo", "austin-modern-estate"],
    categories: ["Luxury Villas", "Condos", "Waterfront"],
    location: "Home Z Live Studio · Los Angeles",
    viewers: 1284,
  },
  {
    id: "watch-icons",
    title: "Skyline Icons: Penthouse Night",
    host: "Sophie Laurent",
    hostInitials: "SL",
    hostFollowers: 31900,
    hostRating: 4.8,
    description: "Investment-grade penthouses and high-rise residences with full listing packages. Preview every home before bidding opens — virtual tours live on air.",
    cover: watch,
    startsAt: now + 6 * hr,
    endsAt: now + 8 * hr,
    status: "upcoming",
    lotIds: ["manhattan-penthouse", "malibu-ocean-villa", "austin-modern-estate", "miami-waterfront-condo", "aspen-ski-chalet"],
    categories: ["Penthouses", "Investment Grade", "City Living"],
    location: "Home Z Live Studio · New York Desk",
  },
  {
    id: "rookie-drops",
    title: "Mountain Escape: Chalet Vault",
    host: "Damien Cole",
    hostInitials: "DC",
    hostFollowers: 22100,
    hostRating: 4.7,
    description: "Ski-in chalets and alpine retreats from Aspen to the Rockies. Limited consigned lots only. Tour every property before the stream goes live.",
    cover: cards,
    startsAt: now + 28 * hr,
    endsAt: now + 30 * hr,
    status: "upcoming",
    lotIds: ["aspen-ski-chalet", "miami-waterfront-condo", "malibu-ocean-villa", "austin-modern-estate"],
    categories: ["Mountain Homes", "Vacation Homes", "Luxury"],
    location: "Home Z Live Studio · Denver",
  },
  {
    id: "diamond-classics",
    title: "Modern Homes Replay",
    host: "Marcus Reid",
    hostInitials: "MR",
    hostFollowers: 48200,
    hostRating: 4.9,
    description: "Replay of last week's modern estate auction. Browse winners, final prices, and the full chat archive.",
    cover: baseball,
    startsAt: now - 6 * 24 * hr,
    endsAt: now - 6 * 24 * hr + 2 * hr,
    status: "past",
    lotIds: ["austin-modern-estate", "miami-waterfront-condo"],
    categories: ["Modern Homes", "Estates"],
    location: "Home Z Live Studio · Austin",
    viewers: 2140,
    winners: [
      { lotId: "austin-modern-estate", user: "HomeHunter", amount: 1920000 },
      { lotId: "miami-waterfront-condo", user: "CoastalBuyer", amount: 895000 },
    ],
    replayComments: [
      { user: "HomeHunter", initials: "HH", text: "Got the Austin estate! Unreal night 🔥" },
      { user: "Buyer_NYC", initials: "BN", text: "That virtual tour segment was elite" },
      { user: "CoastalBuyer", initials: "CB", text: "Miami condo secured — thank you Marcus!" },
      { user: "BidBoss", initials: "BB", text: "Prices were fair tonight. Great show." },
      { user: "SophieL", initials: "SL", text: "Replay quality is crystal clear" },
    ],
  },
];

export function getEvent(id: string) {
  return LIVE_EVENTS.find((e) => e.id === id);
}

export function getActiveEvent() {
  return LIVE_EVENTS.find((e) => e.status === "active") ?? LIVE_EVENTS[0];
}

export const LIVE_CHAT_SEED: (LiveComment & { gold?: boolean })[] = [
  { user: "HomeHunter", initials: "HH", text: "That kitchen is unreal!" },
  { user: "CoastalBuyer", initials: "CB", text: "Bidding hard — let's go 🔥", gold: true },
  { user: "Buyer_NYC", initials: "BN", text: "Inspection report looks solid" },
  { user: "BidBoss", initials: "BB", text: "Who else is in on this listing?" },
  { user: "LuxLiving", initials: "LL", text: "Increment +$25k 👀" },
];

export const LIVE_CHAT_POOL = [
  { user: "AuctionAce", initials: "AA", text: "Raise it!" },
  { user: "HomeHunter", initials: "HH", text: "Title looks clean 💯" },
  { user: "SophieL", initials: "SL", text: "Love this property" },
  { user: "BidBoss", initials: "BB", text: "I'm out — too rich for me" },
  { user: "CoastalBuyer", initials: "CB", text: "Don't sleep on this one", gold: true },
  { user: "Buyer_NYC", initials: "BN", text: "Closing costs included?" },
  { user: "LuxLiving", initials: "LL", text: "🔥🔥🔥" },
  { user: "CondoKing", initials: "CK", text: "Next listing please!" },
  { user: "VillaWiz", initials: "VW", text: "What a night" },
  { user: "FirstHome", initials: "FH", text: "Emoji spam 👏👏" },
];
