import handbag from "@/assets/shop-handbag.jpg";
import painting from "@/assets/shop-painting.jpg";
import camera from "@/assets/shop-camera.jpg";
import vase from "@/assets/shop-vase.jpg";
import sneakers from "@/assets/shop-sneakers.jpg";
import jewelry from "@/assets/shop-jewelry.jpg";

export type ShopProduct = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  price: number;
  category: string;
};

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "scottsdale-courtyard-home",
    title: "Scottsdale Courtyard Home",
    subtitle: "3 bed · Desert landscaping, outdoor kitchen",
    image: handbag,
    price: 685000,
    category: "Single Family",
  },
  {
    id: "brooklyn-brownstone",
    title: "Brooklyn Brownstone Flat",
    subtitle: "2 bed · Historic facade, renovated interior",
    image: painting,
    price: 1240000,
    category: "Townhomes",
  },
  {
    id: "nashville-loft",
    title: "Nashville Downtown Loft",
    subtitle: "1 bed · Open plan, rooftop access",
    image: camera,
    price: 465000,
    category: "Lofts",
  },
  {
    id: "seattle-lakeview-condo",
    title: "Seattle Lakeview Condo",
    subtitle: "2 bed · Water views, parking included",
    image: vase,
    price: 785000,
    category: "Condos",
  },
  {
    id: "denver-garden-flat",
    title: "Denver Garden Flat",
    subtitle: "2 bed · Private patio, walkable district",
    image: sneakers,
    price: 425000,
    category: "Apartments",
  },
  {
    id: "austin-starter-bungalow",
    title: "Austin Starter Bungalow",
    subtitle: "3 bed · Updated kitchen, fenced yard",
    image: jewelry,
    price: 520000,
    category: "Starter Homes",
  },
];

export function getProduct(id: string) {
  return SHOP_PRODUCTS.find((p) => p.id === id);
}
