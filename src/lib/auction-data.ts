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
  { id: "jordan-23-jersey", title: "Michael Jordan Signed Jersey", subtitle: "1996 Chicago Bulls — Game Worn", image: jersey, currentBid: 24500, totalBids: 87, bidIncrement: 250, endsAt: now + 2 * hr + 14 * 60_000, category: "Signed Jerseys", authenticated: true, myBid: 24250, bidStatus: "bidding" },
  { id: "ruth-baseball", title: "Babe Ruth Autographed Baseball", subtitle: "PSA/DNA Authenticated, 1934", image: baseball, currentBid: 18700, totalBids: 64, bidIncrement: 100, endsAt: now + 5 * hr, category: "Signed Balls", authenticated: true, myBid: 18500, bidStatus: "outbid" },
  { id: "rolex-daytona", title: "Rolex Daytona 18K Yellow Gold", subtitle: "Reference 116508, Black Dial", image: watch, currentBid: 42300, totalBids: 31, bidIncrement: 500, endsAt: now + 9 * hr + 40 * 60_000, category: "Luxury Watches", authenticated: true, bidStatus: "none" },
  { id: "brady-football", title: "Tom Brady Signed Football", subtitle: "Super Bowl LV — Tristar COA", image: football, currentBid: 7500, totalBids: 65, bidIncrement: 50, endsAt: now + 1 * hr + 22 * 60_000, category: "Signed Balls", authenticated: true, myBid: 7500, bidStatus: "won" },
  { id: "rookie-cards-lot", title: "Rookie Card Holographic Lot", subtitle: "Mahomes, Luka, Trout — Graded", image: cards, currentBid: 12900, totalBids: 49, bidIncrement: 100, endsAt: now + 3 * hr + 5 * 60_000, category: "Trading Cards", authenticated: true, bidStatus: "none" },
];

export const CATEGORIES = [
  { name: "Signed Jerseys", image: jersey },
  { name: "Signed Balls", image: baseball },
  { name: "Luxury Watches", image: watch },
  { name: "Trading Cards", image: cards },
  { name: "Footballs", image: football },
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
    title: "Legends Night: Signed Jersey Vault",
    host: "Marcus Reid",
    hostInitials: "MR",
    hostFollowers: 48200,
    hostRating: 4.9,
    description: "A curated drop of game-worn, signed jerseys from NBA royalty. Specialists on-air for live authentication walkthroughs.",
    cover: liveStream,
    startsAt: now - 20 * 60_000,
    endsAt: now + 90 * 60_000,
    status: "active",
    lotIds: ["jordan-23-jersey", "brady-football", "ruth-baseball"],
    categories: ["Signed Jerseys", "Signed Balls", "Memorabilia"],
    location: "Supreme Live Studio · New York",
    viewers: 1284,
  },
  {
    id: "watch-icons",
    title: "Watch Icons: Daytona & Beyond",
    host: "Sophie Laurent",
    hostInitials: "SL",
    hostFollowers: 31900,
    hostRating: 4.8,
    description: "Six investment-grade luxury watches with full provenance, hosted by our watch specialist team. Preview every lot before bidding opens — authentication walkthroughs live on air.",
    cover: watch,
    startsAt: now + 6 * hr,
    endsAt: now + 8 * hr,
    status: "upcoming",
    lotIds: ["rolex-daytona", "jordan-23-jersey", "ruth-baseball", "brady-football", "rookie-cards-lot"],
    categories: ["Luxury Watches", "Investment Grade", "Memorabilia"],
    location: "Supreme Live Studio · Geneva Desk",
  },
  {
    id: "rookie-drops",
    title: "Rookie Drops: Holo Card Vault",
    host: "Damien Cole",
    hostInitials: "DC",
    hostFollowers: 22100,
    hostRating: 4.7,
    description: "Graded rookie holos featuring NBA & NFL future hall-of-famers. Limited consigned lots only. Browse every card before the stream goes live.",
    cover: cards,
    startsAt: now + 28 * hr,
    endsAt: now + 30 * hr,
    status: "upcoming",
    lotIds: ["rookie-cards-lot", "brady-football", "jordan-23-jersey", "ruth-baseball"],
    categories: ["Trading Cards", "Graded", "Sports"],
    location: "Supreme Live Studio · Los Angeles",
  },
  {
    id: "diamond-classics",
    title: "Diamond Classics Replay",
    host: "Marcus Reid",
    hostInitials: "MR",
    hostFollowers: 48200,
    hostRating: 4.9,
    description: "Replay of last week's signed-baseball auction. Browse winners, final prices, and the full chat archive.",
    cover: baseball,
    startsAt: now - 6 * 24 * hr,
    endsAt: now - 6 * 24 * hr + 2 * hr,
    status: "past",
    lotIds: ["ruth-baseball", "brady-football"],
    categories: ["Signed Balls", "Sports Memorabilia"],
    location: "Supreme Live Studio · New York",
    viewers: 2140,
    winners: [
      { lotId: "ruth-baseball", user: "VaultKing", amount: 19200 },
      { lotId: "brady-football", user: "JordanFan23", amount: 7950 },
    ],
    replayComments: [
      { user: "VaultKing", initials: "VK", text: "Got the Ruth! Unreal night 🔥" },
      { user: "Collector_NYC", initials: "CN", text: "That authentication segment was elite" },
      { user: "JordanFan23", initials: "JF", text: "Brady football secured — thank you Marcus!" },
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
  { user: "Vault_Master", initials: "VM", text: "That signature is pristine!" },
  { user: "JordanFan23", initials: "JF", text: "Bidding hard — let's go 🔥", gold: true },
  { user: "Collector_NYC", initials: "CN", text: "Authentication looks perfect" },
  { user: "BidBoss", initials: "BB", text: "Who else is in on this lot?" },
  { user: "LuxHunter", initials: "LH", text: "Increment +$250 👀" },
];

export const LIVE_CHAT_POOL = [
  { user: "AuctionAce", initials: "AA", text: "Raise it!" },
  { user: "Vault_Master", initials: "VM", text: "COA looks clean 💯" },
  { user: "SophieL", initials: "SL", text: "Love this piece" },
  { user: "BidBoss", initials: "BB", text: "I'm out — too rich for me" },
  { user: "JordanFan23", initials: "JF", text: "Don't sleep on this one", gold: true },
  { user: "Collector_NYC", initials: "CN", text: "Shipping insured?" },
  { user: "LuxHunter", initials: "LH", text: "🔥🔥🔥" },
  { user: "CardKing", initials: "CK", text: "Next lot please!" },
  { user: "WatchWiz", initials: "WW", text: "What a night" },
  { user: "RookiePro", initials: "RP", text: "Emoji spam 👏👏" },
];
