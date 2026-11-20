import type { Metadata } from "next";
import React from "react";
import { getAllProducts } from "@/lib/domain/products/service";
import { siteConfig } from "@/lib/config/site";
import {
  buildBreadcrumbSchema,
  buildFlagshipProductSchema,
} from "@/lib/seo/schema";
import { ShopClient } from "./ShopClient";

export const metadata: Metadata = {
  title:
    "Shop Marula & Baobab Body Lotion (400ml) | Facial-Grade Botanical Catalog",
  description:
    "Shop the Divinity Cosmetics flagship Marula & Baobab Body Lotion (400ml, R400)—cold-pressed South African botanical nutrition for 24-hour hydration, crepey skin smoothing, and 90-day barrier repair. Free nationwide delivery over R500.",
  keywords: [
    "buy Marula and Baobab body lotion South Africa",
    "Divinity Cosmetics shop",
    "400ml Marula body lotion R400",
    "facial-grade body care South Africa",
    "best lotion for dry Highveld winter skin",
  ],
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title:
      "Shop Divinity Cosmetics | Marula & Baobab Body Lotion (400ml) — R400",
    description:
      "Replace watery R100 supermarket pump lotions with facial-grade, cold-pressed South African Marula & Baobab nutrition.",
    url: `${siteConfig.url}/shop`,
    type: "website",
    images: [
      {
        url: "/images/marula-baobab-body-lotion.jpg",
        width: 1200,
        height: 900,
        alt: "Divinity Cosmetics Marula & Baobab Body Lotion 400ml — R400",
      },
    ],
  },
};

export default async function ShopPage() {
  const products = await getAllProducts({ onlyActive: true });
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Shop Botanical Formulations", path: "/shop" },
  ]);
  const flagshipProductJsonLd = buildFlagshipProductSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, flagshipProductJsonLd]),
        }}
      />
      <ShopClient products={products} />
    </>
  );
}
