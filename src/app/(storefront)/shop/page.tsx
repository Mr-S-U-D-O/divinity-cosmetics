import type { Metadata } from "next";
import React from "react";
import { getAllProducts } from "@/lib/domain/products/service";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbSchema,
  buildProductListSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";
import { ShopClient } from "./ShopClient";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Shop Botanical Body Care",
  description:
    "Browse Divinity Cosmetics facial-grade body lotions crafted in South Africa. Shop our 400ml Marula & Baobab Body Lotion (R400) for 24-hour barrier hydration.",
  path: "/shop",
  keywords: [
    "shop botanical body lotion South Africa",
    "buy Marula and Baobab body lotion South Africa",
    "Divinity Cosmetics shop",
    "400ml Marula body lotion R400",
    "cold-pressed African botanical body care",
  ],
});

export default async function ShopPage() {
  const products = await getAllProducts({ onlyActive: true });
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Shop Botanical Formulations", path: "/shop" },
  ]);
  const productListJsonLd = buildProductListSchema(
    products.map((p) => ({
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.description,
      shortDescription: p.shortDescription,
      basePrice: p.basePrice,
      compareAtPrice: p.compareAtPrice,
      ingredients: p.ingredients,
      concerns: p.concerns,
      inStock: !p.trackInventory || p.stock > 0,
      images: p.images,
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([breadcrumbJsonLd, productListJsonLd]),
        }}
      />
      <ShopClient products={products} />
    </>
  );
}
