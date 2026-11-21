import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { Product, ProductStatus } from "./types"
import { Prisma, Product as PrismaProduct } from "@prisma/client"
import { syncProductsStockFromZoho } from "@/lib/domain/zoho/service"
import { runWithZohoRevalidate } from "@/lib/domain/zoho/client"
import { siteConfig } from "@/lib/config/site"

export interface SitemapProduct {
  slug: string
  updatedAt: Date
  images: string[]
}

const SITEMAP_FALLBACK_DATE = new Date("2026-11-20T00:00:00.000Z")

// Helper to convert Prisma Decimal to number
function toNumber(value: Prisma.Decimal | number | null | undefined): number {
  if (value === null || value === undefined) return 0
  return typeof value === "number" ? value : Number(value)
}

// Convert Prisma product to our frontend Product type
function mapProduct(product: PrismaProduct, liveStock?: number): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    zohoItemId: product.zohoItemId,
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
    stock: liveStock !== undefined ? liveStock : product.stock,
    trackInventory: product.trackInventory,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    sortOrder: product.sortOrder,
    isFeatured: Boolean(product.isFeatured),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

async function hydrateWithZohoStock(products: PrismaProduct[]): Promise<Product[]> {
  if (products.length === 0) return []
  const stockMap = await runWithZohoRevalidate(60, () =>
    syncProductsStockFromZoho(products)
  )
  return products.map((p) => mapProduct(p, stockMap.get(p.id)))
}

export async function getAllProducts(options?: {
  status?: ProductStatus
  onlyActive?: boolean
}): Promise<Product[]> {
  const where: Prisma.ProductWhereInput = {}

  if (options?.onlyActive) {
    where.status = "ACTIVE"
  } else if (options?.status) {
    where.status = options.status
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { sortOrder: "asc" },
  })

  return hydrateWithZohoStock(products)
}

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) return null
  const [hydrated] = await hydrateWithZohoStock([product])
  return hydrated
})

export async function getProductById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product) return null
  const [hydrated] = await hydrateWithZohoStock([product])
  return hydrated
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const featured = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      isFeatured: true,
    },
    orderBy: [
      { sortOrder: "asc" },
      { updatedAt: "desc" },
    ],
    take: limit,
  })

  if (featured.length > 0) {
    return hydrateWithZohoStock(featured)
  }

  // Graceful fallback: if no products are marked as featured yet, return active products up to 6
  const fallback = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    orderBy: { sortOrder: "asc" },
    take: limit,
  })

  return hydrateWithZohoStock(fallback)
}

export async function getFeaturedCount(): Promise<number> {
  return prisma.product.count({
    where: {
      isFeatured: true,
    },
  })
}

export async function getSitemapProducts(): Promise<SitemapProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: {
        slug: true,
        updatedAt: true,
        images: true,
      },
      orderBy: { sortOrder: "asc" },
    })

    if (products.length > 0) {
      return products
    }
  } catch (error) {
    console.warn(
      "[Sitemap] Falling back to flagship product because database is unreachable:",
      error
    )
  }

  return [
    {
      slug: siteConfig.flagshipProduct.slug,
      updatedAt: SITEMAP_FALLBACK_DATE,
      images: [siteConfig.flagshipProduct.image],
    },
  ]
}
