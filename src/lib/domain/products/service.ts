import { prisma } from "@/lib/prisma"
import { Product, ProductStatus } from "./types"
import { Prisma } from "@prisma/client"

// Helper to convert Prisma Decimal to number
function toNumber(value: Prisma.Decimal | number | null | undefined): number {
  if (value === null || value === undefined) return 0
  return typeof value === "number" ? value : Number(value)
}

// Convert Prisma product to our frontend Product type
function mapProduct(product: any): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    basePrice: toNumber(product.basePrice),
    compareAtPrice: product.compareAtPrice ? toNumber(product.compareAtPrice) : null,
    images: product.images || [],
    category: product.category,
    status: product.status as ProductStatus,
    badge: product.badge,
    concerns: product.concerns || [],
    ingredients: product.ingredients || [],
    stock: product.stock,
    trackInventory: product.trackInventory,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    sortOrder: product.sortOrder,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

export async function getAllProducts(options?: {
  status?: ProductStatus
  onlyActive?: boolean
}): Promise<Product[]> {
  const where: any = {}

  if (options?.onlyActive) {
    where.status = "ACTIVE"
  } else if (options?.status) {
    where.status = options.status
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { sortOrder: "asc" },
  })

  return products.map(mapProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
  })

  return product ? mapProduct(product) : null
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
  })

  return product ? mapProduct(product) : null
}
