import { Product } from "./types";

export const mockProducts: Product[] = [
  {
    id: "prod_01J8F",
    slug: "body-lotion-a",
    name: "Body Lotion A",
    description: "Infused with African botanicals and cold-pressed marula oil. Deeply replenishes moisture barriers while soothing sensitive skin. Fast-absorbing, velvet finish.",
    basePrice: 200,
    images: ["/images/body-lotion-a.jpg"],
    status: "active",
    rating: 5,
    reviewCount: 48,
  },
  {
    id: "prod_02J8F",
    slug: "body-lotion-b",
    name: "Body Lotion B",
    description: "Formulated with nourishing neroli, frankincense, and calming chamomile extract. Restores elasticity and revitalizes natural tone throughout the day. Ultra-hydrating and gentle.",
    basePrice: 45,
    images: ["/images/body-lotion-b.jpg"],
    status: "active",
    rating: 5,
    reviewCount: 16,
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((p) => p.slug === slug);
}

