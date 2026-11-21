import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { getProductBySlug, getSitemapProducts } from "@/lib/domain/products/service";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbSchema,
  buildFlagshipProductSchema,
  buildFAQPageSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";
import { FAQAccordion } from "@/components/ui/FAQAccordion";

import { AddToCart } from "./AddToCart";
import { ProductGallery } from "./ProductGallery";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PRODUCT_FAQS = [
  {
    question:
      "Why does this lotion take 2 to 3 minutes to sink in instead of disappearing in 5 seconds?",
    answer:
      "Lotions that vanish in five seconds are mostly water, alcohol, and volatile slip fillers evaporating off the surface. Divinity Cosmetics Marula & Baobab Body Lotion uses dense, cold-pressed African seed oils (10% Marula and 10% Baobab) that take 2 to 3 minutes to absorb and form a physical 24-hour moisture seal.",
  },
  {
    question:
      "How long does one 400ml bottle last during the 90-day barrier cycle?",
    answer:
      "With daily full-body application after showering, one 400ml bottle typically lasts 30 to 45 days. Many clients order two bottles (R800 total) to cover a full 90-day barrier cycle. Nationwide door-to-door courier rates are calculated live at checkout via The Courier Guy.",
  },
  {
    question:
      "Will it help with crepey skin on my arms, legs, and décolletage?",
    answer:
      "Yes. Crepey texture develops when age-related lipid loss, UV exposure, and dry air thin the skin barrier. Daily application of cold-pressed Marula oil (70–78% oleic acid, Vitamins C and E) and Baobab oil (Omegas 3, 6, and 9) replenishes structural lipids over a 90-day turnover cycle.",
  },
];

export async function generateStaticParams() {
  const products = await getSitemapProducts();
  return products.map((p) => ({ slug: p.slug }));
}

function formatPriceLabel(price: number): string {
  return Number.isInteger(price) ? price.toFixed(0) : price.toFixed(2);
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product || product.status !== "ACTIVE") {
    return buildPageMetadata({
      title: "Product Not Found",
      description: "The requested botanical skincare formulation could not be found.",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  const priceStr = formatPriceLabel(product.basePrice);
  const rawDbTitle = product.metaTitle
    ? product.metaTitle.replace(/\s*\|\s*Divinity Cosmetics.*$/i, "").trim()
    : "";
  const title =
    rawDbTitle && rawDbTitle.length <= 42
      ? rawDbTitle
      : `${product.name} (400ml) — R${priceStr}`;

  const dbDesc = (product.metaDescription || "").trim();
  const dbDescSafe =
    dbDesc.length >= 120 &&
    dbDesc.length <= 165 &&
    !/R500|R100|watery/i.test(dbDesc);
  const description = dbDescSafe
    ? dbDesc
    : `Shop ${product.name} (400ml, R${priceStr}) by Divinity Cosmetics. Cold-pressed Marula & Baobab oils for 24-hour hydration and 90-day skin barrier repair.`;

  return buildPageMetadata({
    title,
    description,
    path: `/products/${product.slug}`,
    keywords: [
      product.name,
      "Marula and Baobab body lotion 400ml",
      "buy Marula body lotion South Africa",
      "Baobab body lotion for dry winter skin",
      "best body lotion for crepey skin South Africa",
      `facial-grade body lotion R${priceStr}`,
      "DIV-MBL-400",
    ],
  });
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
    sku: product.sku,
    description: product.description || undefined,
    price: product.basePrice,
    compareAtPrice: product.compareAtPrice,
    ingredients: product.ingredients,
    concerns: product.concerns,
    inStock,
    images: product.images,
    url: `/products/${product.slug}`,
  });
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: `${product.name} (400ml)`, path: `/products/${product.slug}` },
  ]);
  const faqJsonLd = buildFAQPageSchema(PRODUCT_FAQS);

  const formattedPrice = formatPriceLabel(product.basePrice);
  const formattedCompareAt =
    product.compareAtPrice && product.compareAtPrice > product.basePrice
      ? formatPriceLabel(product.compareAtPrice)
      : null;

  const fullDescription =
    product.description ||
    "A facial-grade botanical body treatment formulated with 10% cold-pressed South African Marula and 10% wild-harvested Baobab seed oils for 24-hour skin barrier hydration and 90-day barrier repair.";

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-[#1a1a1a] pt-28 sm:pt-32 lg:pt-36 pb-16 lg:pb-24 w-full max-w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([productJsonLd, breadcrumbJsonLd, faqJsonLd]),
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
              {product.shortDescription || fullDescription}
            </p>

            {/* Direct Purchase Controls + Clean Hairline Accordions */}
            <AddToCart product={product} />
          </div>
        </div>

        {/* Formulation Profile, Comparison & Product FAQs (SSR crawlable & AEO-structured) */}
        <section
          aria-labelledby="pdp-formulation-heading"
          className="mt-16 lg:mt-24 pt-12 border-t border-black grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start"
        >
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-green block">
              Formulation Profile · {product.sku || "DIV-MBL-400"}
            </span>
            <h2
              id="pdp-formulation-heading"
              className="font-chloe text-2xl sm:text-3xl font-normal tracking-tight text-black m-0"
            >
              Built for 24-Hour Climate Protection
            </h2>
            <p className="text-sm leading-relaxed text-black/80 m-0">
              {fullDescription}
            </p>
            <div className="pt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.14em]">
              <Link href="/rituals" className="text-black hover:text-green underline underline-offset-4">
                90-Day Ritual
              </Link>
              <Link href="/about#founders-note" className="text-black hover:text-green underline underline-offset-4">
                Founder&apos;s Note
              </Link>
              <Link href="/shipping" className="text-black hover:text-green underline underline-offset-4">
                Shipping &amp; Returns
              </Link>
              <Link href="/faq" className="text-black hover:text-green underline underline-offset-4">
                All FAQs
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-black m-0">
              Divinity 400ml vs. Standard Supermarket Lotion
            </h3>
            <div className="overflow-x-auto border border-black rounded-2xl bg-white">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-black bg-[#faf8f5]">
                    <th className="py-3 px-4 font-semibold text-black">Standard</th>
                    <th className="py-3 px-4 font-semibold text-black">Divinity 400ml (R{formattedPrice})</th>
                    <th className="py-3 px-4 font-semibold text-black/70">Supermarket Pump</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/15">
                  <tr>
                    <td className="py-3 px-4 font-medium text-black">Active Oils</td>
                    <td className="py-3 px-4 text-black">10% Marula + 10% Baobab cold-pressed oils</td>
                    <td className="py-3 px-4 text-black/70">80–85% water, mineral oil &amp; fillers</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-black">Absorption</td>
                    <td className="py-3 px-4 text-black">2–3 minutes to seal the moisture barrier</td>
                    <td className="py-3 px-4 text-black/70">~5 seconds evaporation</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-black">Wear Time</td>
                    <td className="py-3 px-4 text-black">24-hour protection, no 1 PM ashiness</td>
                    <td className="py-3 px-4 text-black/70">Tight, dry skin within 2–3 hours</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-black">Unit Value</td>
                    <td className="py-3 px-4 text-black">R1.00/ml facial-grade body treatment</td>
                    <td className="py-3 px-4 text-black/70">R80–R150 repeated reapplication</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Product FAQs */}
        <section
          aria-labelledby="pdp-faq-heading"
          className="mt-14 pt-12 border-t border-black grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start"
        >
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-green mb-3 block">
              Product Questions
            </span>
            <h2
              id="pdp-faq-heading"
              className="font-chloe text-2xl sm:text-3xl font-normal tracking-tight text-black m-0"
            >
              Texture, Barrier Repair &amp; Delivery
            </h2>
          </div>
          <div className="lg:col-span-7">
            <FAQAccordion items={PRODUCT_FAQS} defaultOpenIndex={0} />
          </div>
        </section>
      </div>
    </main>
  );
}
