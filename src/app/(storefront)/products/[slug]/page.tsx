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

  const formattedPrice = Number.isInteger(product.basePrice)
    ? product.basePrice.toFixed(0)
    : product.basePrice.toFixed(2);
  const formattedCompareAt =
    product.compareAtPrice && product.compareAtPrice > product.basePrice
      ? Number.isInteger(product.compareAtPrice)
        ? product.compareAtPrice.toFixed(0)
        : product.compareAtPrice.toFixed(2)
      : null;

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-[#1a1a1a] pt-28 sm:pt-32 lg:pt-36 pb-16 lg:pb-24 w-full max-w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productJsonLd, breadcrumbJsonLd, faqJsonLd]),
        }}
      />

      <div className="w-full max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Quiet Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/75 hover:text-green transition-colors"
          >
            <ArrowLeft size={13} weight="bold" />
            <span>Back to Shop</span>
          </Link>
        </div>

        {/* Minimalist 2-Column Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-16 items-start">
          {/* Left: Pure Studio Image */}
          <div className="lg:col-span-6 w-full lg:sticky lg:top-32">
            <ProductGallery
              images={product.images}
              productName={product.name}
              badge={product.badge}
              inStock={inStock}
            />
          </div>

          {/* Right: Uncluttered Details & Direct Purchase Flow */}
          <div className="lg:col-span-6 flex flex-col lg:pt-2">
            {/* Quiet Category & Volume Eyebrow */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-green">
                {product.category || "Body Care"} · 400 ml
              </span>

              {!inStock ? (
                <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-red-700">
                  Out of Stock
                </span>
              ) : product.trackInventory && product.stock <= 5 ? (
                <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#244e1d]">
                  {product.stock} left
                </span>
              ) : null}
            </div>

            {/* Product Name */}
            <h1 className="font-chloe text-3xl sm:text-4xl lg:text-[2.85rem] font-normal leading-[1.06] tracking-tight text-black m-0 mb-3">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-medium tracking-tight text-black">
                R{formattedPrice}
              </span>
              {formattedCompareAt && (
                <span className="text-sm text-black/40 line-through">
                  R{formattedCompareAt}
                </span>
              )}
            </div>

            {/* Immediate Summary Copy */}
            <p className="text-sm sm:text-[15px] leading-relaxed text-black/70 m-0 mb-7">
              {product.shortDescription ||
                product.description ||
                "A facial-grade 400ml botanical body emulsion formulated with cold-pressed South African Marula and wild-harvested Baobab seed oils for a physical 24-hour moisture seal."}
            </p>

            {/* Direct Purchase Controls + Clean Hairline Accordions */}
            <AddToCart product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
