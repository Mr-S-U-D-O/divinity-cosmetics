import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    question: "Why does this lotion take 2 to 3 minutes to sink in instead of disappearing in 5 seconds?",
    answer:
      "A lotion that vanishes in five seconds isn't fast-absorbing—it is mostly water and volatile fillers evaporating into thin air. Divinity Cosmetics Marula & Baobab Body Lotion uses dense, cold-pressed botanical seed oils that take 2 to 3 minutes to integrate into your skin, forming a physical 24-hour barrier seal against the climate.",
  },
  {
    question: "How long does one 400ml bottle last during the 90-Day Barrier Repair cycle?",
    answer:
      "With daily full-body application after showering, one 400ml bottle typically lasts 30 to 45 days. Many clients order two bottles (R800 total) to cover their full 90-day barrier restoration cycle and qualify automatically for free nationwide courier delivery (orders over R500 ship free).",
  },
  {
    question: "Will it help with crepey skin on my arms, legs, and décolletage?",
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
      images: (product.images || ["/images/body-lotion-marula-baobab-hero.jpg"]).map(
        (url) => ({
          url,
          width: 1200,
          height: 900,
          alt: `${product.name} (400ml) — Divinity Cosmetics South Africa`,
        })
      ),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images?.length
        ? [product.images[0]]
        : ["/images/body-lotion-marula-baobab-hero.jpg"],
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
    <main className="min-h-screen bg-white text-[#1a1a1a] pt-32 pb-36 w-full max-w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productJsonLd, breadcrumbJsonLd, faqJsonLd]),
        }}
      />
      {/* Container */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 space-y-24">
        {/* Editorial Split Layout */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-20">
          {/* Left: Cinematic Product Image (Sticky) */}
          <div className="lg:sticky lg:top-32 w-full rounded-sm lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Product Details & Bento Grid */}
          <div className="flex flex-col pt-0 lg:col-span-5 lg:pt-8">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#3d7b32]">
              Facial-Grade Botanical Body Care · Flagship Launch
            </p>
            <h1 className="mb-6 w-full max-w-xl break-words text-5xl font-medium uppercase leading-[0.92] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              {product.name}
            </h1>

            <p className="mb-6 max-w-xl text-base leading-relaxed text-black sm:text-lg">
              {product.description}
            </p>

            {/* Price & Volume Block */}
            <div className="mb-8 flex flex-wrap items-end gap-x-6 gap-y-2 border-y border-black py-5">
              <span className="text-3xl font-medium tracking-tight">
                R{product.basePrice.toFixed(2)}
              </span>
              <span className="text-sm text-black">
                400 ml / 13.5 fl oz · R{(product.basePrice / 400).toFixed(2)}/ml
              </span>
              <span className="text-sm font-semibold text-[#3d7b32]">
                {!inStock ? "Currently unavailable" : "In stock · Ready for dispatch"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mb-10 flex w-full max-w-md flex-col gap-4">
              <AddToCart product={product} />
              <div className="grid grid-cols-1 gap-2 text-center text-[11px] uppercase tracking-[0.13em] text-black sm:grid-cols-2">
                <span>Paystack &amp; WhatsApp Checkout</span>
                <span>Free SA delivery over R500</span>
              </div>
            </div>

            {/* Gapless Bento Grid for Details */}
            <div className="grid grid-flow-dense grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
              <div className="border-t border-black pt-6">
                <h2 className="uppercase tracking-[0.15em] text-[11px] font-bold mb-3 text-[#3d7b32]">
                  The Texture Truth (Why It Takes 2 Minutes)
                </h2>
                <p className="text-sm leading-relaxed text-black">
                  A lotion that vanishes in five seconds isn&apos;t fast-absorbing—it is evaporating into thin air. Divinity takes two to three minutes to sink in because it is packed with dense, cold-pressed African oils that physically seal your barrier for 24 hours.
                </p>
              </div>
              <div className="border-t border-black pt-6">
                <h2 className="uppercase tracking-[0.15em] text-[11px] font-bold mb-3 text-[#3d7b32]">
                  Active Cold-Pressed Botanicals
                </h2>
                <p className="text-sm leading-relaxed text-black">
                  High-concentration <strong>Marula Seed Oil</strong> (oleic acid &amp; antioxidants) and <strong>Baobab Seed Oil</strong> (Omegas 3, 6 &amp; 9). Zero synthetic perfume fillers, parabens, or mineral oils.
                </p>
              </div>
              <div className="border-t border-black pt-6 sm:col-span-2">
                <h2 className="uppercase tracking-[0.15em] text-[11px] font-bold mb-3 text-[#3d7b32]">
                  The 90-Day Barrier Repair Protocol
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-black">
                  Apply daily onto warm, slightly damp skin within 3 minutes of showering. Over a consistent 90-day epidermal cycle, watch your thinning moisture barrier rebuild, midday ashiness vanish, and crepey texture on arms, elbows, knees, and décolletage visibly soften.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table: Optimized for AEO & Buyer Conviction */}
        <section
          aria-labelledby="comparison-heading"
          className="rounded-3xl border border-black bg-[#faf9f6] p-8 md:p-12 space-y-8"
        >
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3d7b32]">
              Closing the Vanity Divide
            </span>
            <h2
              id="comparison-heading"
              className="text-3xl md:text-4xl font-normal text-black"
            >
              Divinity 400ml Botanical Treatment vs. Supermarket Pump Lotions
            </h2>
            <p className="text-sm md:text-base text-black">
              Why women who invest R300–R1,000 in facial serums are replacing their R100 commercial body lotion with facial-grade botanical nutrition.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-black bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black bg-gray-50">
                  <th className="p-4 md:p-5 text-xs font-bold uppercase tracking-wider text-black">
                    Standard
                  </th>
                  <th className="p-4 md:p-5 text-xs font-bold uppercase tracking-wider text-[#3d7b32]">
                    Divinity Marula &amp; Baobab Body Lotion (400ml — R400)
                  </th>
                  <th className="p-4 md:p-5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Commercial Supermarket Pump Lotion (~R100)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10 text-sm">
                <tr>
                  <td className="p-4 md:p-5 font-semibold text-black">
                    Formulation Base
                  </td>
                  <td className="p-4 md:p-5 text-black">
                    High-concentration cold-pressed South African Marula &amp; Baobab seed oils
                  </td>
                  <td className="p-4 md:p-5 text-black">
                    Up to 85% water, cheap emulsifiers, alcohol, and synthetic fragrance
                  </td>
                </tr>
                <tr>
                  <td className="p-4 md:p-5 font-semibold text-black">
                    Absorption Reality
                  </td>
                  <td className="p-4 md:p-5 text-black">
                    Sinks in over 2–3 minutes to form a breathable 24-hour physical climate seal
                  </td>
                  <td className="p-4 md:p-5 text-black">
                    Vanishes in 5 seconds because water and volatile carriers evaporate into thin air
                  </td>
                </tr>
                <tr>
                  <td className="p-4 md:p-5 font-semibold text-black">
                    Midday Skin State (1 PM)
                  </td>
                  <td className="p-4 md:p-5 text-black">
                    Supple, calm, deeply nourished skin; total wardrobe confidence in short sleeves
                  </td>
                  <td className="p-4 md:p-5 text-black">
                    Tight, itchy, and visibly ashy on elbows, knees, shins, and forearms
                  </td>
                </tr>
                <tr>
                  <td className="p-4 md:p-5 font-semibold text-black">
                    90-Day Outcome
                  </td>
                  <td className="p-4 md:p-5 text-black">
                    Rebuilds thinning moisture barrier and softens crepey mature skin texture
                  </td>
                  <td className="p-4 md:p-5 text-black">
                    Temporary surface slip with ongoing trans-epidermal moisture loss
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Product-Specific FAQ Block */}
        <section aria-labelledby="product-faq-heading" className="max-w-4xl space-y-6">
          <h2 id="product-faq-heading" className="text-3xl font-normal text-black">
            Questions About the 400ml Formulation
          </h2>
          <div className="space-y-4">
            {PRODUCT_FAQS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-black bg-white p-6 space-y-2"
              >
                <h3 className="text-lg font-medium text-black">{faq.question}</h3>
                <p className="text-sm text-black leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="pt-2">
            <Link
              href="/about#founders-note"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#3d7b32] underline underline-offset-4"
            >
              Read &ldquo;A Personal Note from the Founder&rdquo; &rarr;
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
