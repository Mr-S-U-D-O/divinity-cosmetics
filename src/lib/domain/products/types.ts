export type ProductStatus = "active" | "draft" | "archived";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  status: ProductStatus;
  // Temporary fields for the current UI iteration
  rating?: number;
  reviewCount?: number;
}
