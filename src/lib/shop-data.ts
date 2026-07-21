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
    id: "ferragamo-coral-bag",
    title: "Ferragamo Coral Leather Bag",
    subtitle: "Top-handle — Smooth calfskin, Gancini hardware",
    image: handbag,
    price: 2850,
    category: "Luxury Fashion",
  },
  {
    id: "dutch-floral-still-life",
    title: "Dutch Floral Still Life",
    subtitle: "Oil on canvas — Golden Age style, private vault",
    image: painting,
    price: 12400,
    category: "Fine Art",
  },
  {
    id: "sony-alpha-kit",
    title: "Sony Alpha Mirrorless Kit",
    subtitle: "Full-frame body with prime lens set",
    image: camera,
    price: 4650,
    category: "Electronics",
  },
  {
    id: "ceramic-artisan-vase",
    title: "Artisan Stoneware Set",
    subtitle: "Hand-thrown vessels — Speckled glaze, studio signed",
    image: vase,
    price: 1850,
    category: "Antiques",
  },
  {
    id: "jordan-1-bred-toe",
    title: "Air Jordan 1 'Bred Toe'",
    subtitle: "Deadstock — Size 10, authenticated pair",
    image: sneakers,
    price: 2850,
    category: "Streetwear",
  },
  {
    id: "akoya-pearl-necklace",
    title: "Akoya Pearl Necklace",
    subtitle: "Strand with diamond rose clasp — Boxed",
    image: jewelry,
    price: 4200,
    category: "Fine Jewelry",
  },
];

export function getProduct(id: string) {
  return SHOP_PRODUCTS.find((p) => p.id === id);
}
