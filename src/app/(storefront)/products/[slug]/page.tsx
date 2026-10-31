import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/domain/products/service";

import { AddToCart } from "./AddToCart";
import { ProductGallery } from "./ProductGallery";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage(props: PageProps) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product || product.status !== "ACTIVE") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-[#1a1a1a] pt-32 pb-48 w-full max-w-full overflow-x-hidden">
      {/* Container */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Editorial Split Layout */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-20">
          
          {/* Left: Cinematic Product Image (Sticky) */}
          <div className="sticky top-32 w-full rounded-sm lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Product Details & Bento Grid */}
          <div className="flex flex-col pt-0 lg:col-span-5 lg:pt-12">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#3d7b32]">
              Signature body care
            </p>
            <h1 className="mb-6 w-full max-w-xl break-words text-5xl font-medium uppercase leading-[0.92] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              {product.name}
            </h1>
            
            <p className="mb-8 max-w-xl text-base leading-relaxed text-[#1a1a1a]/75 sm:text-lg">
              {product.description}
            </p>

            <div className="mb-8 flex flex-wrap items-end gap-x-6 gap-y-2 border-y border-[#1a1a1a]/10 py-5">
              <span className="text-3xl font-medium tracking-tight">R{product.basePrice.toFixed(2)}</span>
              <span className="text-sm text-[#1a1a1a]/55">400 ml / 13.5 fl oz</span>
              <span className="text-sm font-medium text-[#3d7b32]">
                {product.trackInventory && product.stock <= 0 ? "Currently unavailable" : "In stock"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mb-10 flex w-full max-w-md flex-col gap-4">
              <AddToCart product={product} />
              <div className="grid grid-cols-1 gap-2 text-center text-[11px] uppercase tracking-[0.13em] text-[#1a1a1a]/55 sm:grid-cols-2">
                <span>Secure checkout</span>
                <span>Free delivery over R500</span>
              </div>
            </div>
            
            {/* Gapless Bento Grid for Details */}
            <div className="grid grid-flow-dense grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
              <div className="border-t border-[#1a1a1a]/15 pt-6">
                <h3 className="uppercase tracking-[0.15em] text-[11px] font-bold mb-4 text-[#1a1a1a]/50">Application</h3>
                <p className="text-base leading-relaxed text-[#1a1a1a]/90">Massage gently into clean, dry skin. Allow to absorb completely before dressing. Suitable for daily use.</p>
              </div>
              <div className="border-t border-[#1a1a1a]/15 pt-6">
                <h3 className="uppercase tracking-[0.15em] text-[11px] font-bold mb-4 text-[#1a1a1a]/50">Key Botanicals</h3>
                <p className="text-base leading-relaxed text-[#1a1a1a]/90">
                  {product.ingredients.join(", ")} botanicals selected for a nourishing, comfortable daily ritual.
                </p>
              </div>
              <div className="border-t border-[#1a1a1a]/15 pt-6 sm:col-span-2">
                <h3 className="uppercase tracking-[0.15em] text-[11px] font-bold mb-4 text-[#1a1a1a]/50">Sustainability Commitment</h3>
                <p className="text-base md:text-lg leading-relaxed text-[#1a1a1a]/90">
                  Packaged in 100% recyclable glass. Our botanical ingredients are ethically sourced through fair-trade partnerships with local communities in the Eastern Cape, ensuring environmental preservation and economic empowerment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
