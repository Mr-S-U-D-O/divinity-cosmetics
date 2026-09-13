export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED"

export type ProductCategory = "Body Care" | "Face Care" | "Oils & Serums" | "Bundles" | string

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string | null
  basePrice: number          // we will convert Decimal → number when fetching
  compareAtPrice?: number | null
  images: string[]
  category: string
  status: ProductStatus
  badge?: string | null
  concerns: string[]
  ingredients: string[]
  stock: number
  trackInventory: boolean
  metaTitle?: string | null
  metaDescription?: string | null
  sortOrder: number
  createdAt?: Date
  updatedAt?: Date
  // Temporary UI fields (can stay for now)
  rating?: number
  reviewCount?: number
}
