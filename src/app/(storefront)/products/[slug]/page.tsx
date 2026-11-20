import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { getProductBySlug } from "@/lib/domain/products/service";
import { siteConfig } from "@/lib/config/site";
import {
  buildBreadcrumbSchema,
  buildFlagshipProductSchema,
  buildFAQPageSchema,
} from "@/lib/seo/schema";

import { AddToCart } from "./AddToCart";
import { ProductGallery } from "./ProductGallery";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PRODUCT_FAQS = [
  {
    question:
      "Why does this lotion take 2 to 3 minutes to sink in instead of disappearing in 5 seconds?",
    answer:
      "A lotion that vanishes in five seconds isn't fast-absorbing—it is mostly water and volatile fillers evaporating into thin air. Divinity Cosmetics Marula & Baobab Body Lotion uses dense, cold-pressed botanical seed oils that take 2 to 3 minutes to integrate into your skin, forming a physical 24-hour barrier seal against the climate.",
  },
  {
    question:
      "How long does one 400ml bottle last during the 90-Day Barrier Repair cycle?",
    answer:
      "With daily full-body application after showering, one 400ml bottle typically lasts 30 to 45 days. Many clients order two bottles (R800 total) to cover their full 90-day barrier restoration cycle and qualify automatically for free nationwide courier delivery (orders over R500 ship free).",
  },
  {
    question:
      "Will it help with crepey skin on my arms, legs, and décolletage?",
    answer:
      "Yes. Crepey texture is caused by age-related lipid depletion and a thinning moisture barrier aggravated by UV and dry air. Cold-pressed Marula oil (rich in oleic acid and antioxidants) and Baobab oil (rich in Omegas 3, 6, and 9) replenish structural lipids over a 90-day cellular renewal cycle, visibly softening crepey texture.",
  },
];

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product || product.status !== "ACTIVE") {
    return {
      title: "Product Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title =
    product.metaTitle ||
    `${product.name} (400ml) — R${product.basePrice} | Facial-Grade Botanical Body Care`;
  const description =
    product.metaDescription ||
    `Shop Divinity Cosmetics ${product.name} (400ml) at R${product.basePrice}. Formulated with cold-pressed South African Marula & Baobab oils for 24-hour hydration, crepey skin smoothing, and 90-day barrier repair.`;

  return {
    title,
    description,
    keywords: [
      product.name,
      "Marula and Baobab body lotion 400ml",
      "buy Marula body lotion South Africa",
      "Baobab body lotion for dry winter skin",
      "best body lotion for crepey skin South Africa",
      "facial-grade body lotion R400",
      "Divinity Cosmetics body lotion",
    ],
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/products/${product.slug}`,
      type: "website",
      images: (
        product.images?.length
          ? product.images
          : ["/images/marula-baobab-body-lotion.jpg"]
      ).map((url) => ({
        url,
        width: 1200,
        height: 900,
        alt: `${product.name} (400ml) — Divinity Cosmetics South Africa`,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images?.length
        ? [product.images[0]]
        : ["/images/marula-baobab-body-lotion.jpg"],
    },
  };
}

export default async function ProductPage(props: PageProps) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product || product.status !== "ACTIVE") {
    notFound();
  }

  const inStock = !product.trackInventory || product.stock > 0;
  const productJsonLd = buildFlagshipProductSchema({
    name: product.name,
    slug: product.slug,
    description: product.description || undefined,
    price: product.basePrice,
    inStock,
    images: product.images,
  });
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: `${product.name} (400ml)`, path: `/products/${product.slug}` },
  ]);
  const faqJsonLd = buildFAQPageSchema(PRODUCT_FAQS);

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-[#1a1a1a] pt-24 sm:pt-28 lg:pt-32 pb-10 lg:pb-14 w-full max-w-full overflow-x-hidden flex items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productJsonLd, breadcrumbJsonLd, faqJsonLd]),
        }}
      />

      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Compact Back / Breadcrumb Strip */}
        <div className="mb-3 sm:mb-4 flex items-center justify-between gap-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/70 hover:text-[#3d7b32] transition-colors"
          >
            <ArrowLeft size={13} weight="bold" />
            <span>Back to Shop</span>
          </Link>

          <span className="text-[11px] font-mono uppercase tracking-widest text-black/50">
            SKU · {siteConfig.flagshipProduct.sku}
          </span>
        </div>

        {/* Single-Viewport Modern Minimalist Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 lg:gap-12 items-center">
          {/* Left: Single Product Image Showcase */}
          <div className="lg:col-span-6 w-full">
            <ProductGallery
              images={product.images}
              productName={product.name}
              badge={product.badge}
              inStock={inStock}
            />
          </div>

          {/* Right: Essential Product Info + Tabbed Details + Hero Buy Controls */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4 sm:gap-5">
            {/* 1. Status & Availability Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#3d7b32]">
                <span>{product.category || "Body Care"}</span>
                <span aria-hidden="true">·</span>
                <span>Facial-Grade Standard</span>
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border border-black px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                  inStock
                    ? "bg-[#3d7b32]/10 text-[#244e1d]"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    inStock ? "bg-[#3d7b32] animate-pulse" : "bg-red-500"
                  }`}
                />
                {inStock
                  ? product.trackInventory
                    ? `In Stock · ${product.stock} Available`
                    : "In Stock · Ready for Dispatch"
                  : "Currently Out of Stock"}
              </span>
            </div>

            {/* 2. Product Name */}
            <div>
              <h1 className="font-chloe text-3xl sm:text-4xl lg:text-[2.85rem] font-normal leading-[1.02] tracking-tight text-black m-0">
                {product.name}
              </h1>
            </div>

            {/* 3. Price & Size Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-y border-black py-3">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-black">
                  R{product.basePrice.toFixed(2)}
                </span>
                {product.compareAtPrice &&
                  product.compareAtPrice > product.basePrice && (
                    <span className="text-sm text-black/45 line-through">
                      R{product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                <span className="text-xs text-black/60">
                  (R{(product.basePrice / 400).toFixed(2)} / ml)
                </span>
              </div>

              {/* Size Pill */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-black bg-white px-3 py-1 text-xs font-semibold tracking-wide text-black">
                  Size: 400 ml / 13.5 fl oz
                </span>
              </div>
            </div>

            {/* 4. Interactive Condensed Tabbed Description + Quantity & Buy Focus CTA */}
            <AddToCart product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
