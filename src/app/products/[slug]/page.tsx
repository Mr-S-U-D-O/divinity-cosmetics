"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/domain/products/mock-data";
import Image from "next/image";

import { useCart } from "@/lib/context/CartContext";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage(props: PageProps) {
  const { slug } = use(props.params);
  const product = getProductBySlug(slug);
  const { addItem, openCart } = useCart();

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addItem(product);
    openCart();
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] pt-32 pb-48 w-full max-w-full overflow-x-hidden">
      {/* Container */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left: Cinematic Product Image (Sticky) */}
          <div className="lg:col-span-7 w-full rounded-sm group sticky top-32">
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm">
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                className="object-cover object-center transform transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right: Product Details & Bento Grid */}
          <div className="lg:col-span-5 flex flex-col pt-8 lg:pt-16">
            <h1 className="text-6xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.85] font-medium mb-10 w-full uppercase">
              {product.name}
            </h1>
            
            <p className="text-xl md:text-2xl leading-relaxed text-[#1a1a1a]/80 mb-16 max-w-xl">
              {product.description}
            </p>

            <div className="flex items-center gap-8 mb-16">
              <span className="text-4xl font-medium tracking-tight">R{product.basePrice}</span>
              <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-[#3d7b32] font-bold">
                <span className="text-lg">★</span>
                <span>{product.rating?.toFixed(1) || "5.0"}</span>
                <span className="text-[#1a1a1a]/40 ml-2 font-medium">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 w-full max-w-md mb-32">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-[#1a1a1a] text-[#f5f5f5] py-6 rounded-full uppercase tracking-[0.2em] text-sm font-bold hover:bg-[#3d7b32] transition-colors duration-500"
              >
                Add to Cart
              </button>
            </div>
            
            {/* Gapless Bento Grid for Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 grid-flow-dense">
              <div className="border-t border-[#1a1a1a]/15 pt-8">
                <h3 className="uppercase tracking-[0.15em] text-[11px] font-bold mb-4 text-[#1a1a1a]/50">Application</h3>
                <p className="text-base leading-relaxed text-[#1a1a1a]/90">Massage gently into clean, dry skin. Allow to absorb completely before dressing. Suitable for daily use.</p>
              </div>
              <div className="border-t border-[#1a1a1a]/15 pt-8">
                <h3 className="uppercase tracking-[0.15em] text-[11px] font-bold mb-4 text-[#1a1a1a]/50">Key Botanicals</h3>
                <p className="text-base leading-relaxed text-[#1a1a1a]/90">Sustainably harvested Marula oil, cold-pressed Baobab extract, and indigenous aloe.</p>
              </div>
              <div className="border-t border-[#1a1a1a]/15 pt-8 sm:col-span-2">
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
