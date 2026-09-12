export type ProductStatus = "active" | "draft" | "archived";
export type ProductCategory = "Body Care" | "Face Care" | "Oils & Serums" | "Bundles";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  status: ProductStatus;
  category: ProductCategory;
  badge?: string;
  concerns?: string[];
  ingredients?: string[];
  // Temporary fields for the current UI iteration
  rating?: number;
  reviewCount?: number;
}
