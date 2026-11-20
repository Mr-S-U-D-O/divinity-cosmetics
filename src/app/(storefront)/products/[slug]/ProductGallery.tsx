"use client";

import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  badge?: string | null;
  inStock?: boolean;
}

export function ProductGallery({
  images,
  productName,
  badge,
  inStock = true,
}: ProductGalleryProps) {
  const primaryImage =
    images?.find(Boolean) || "/images/marula-baobab-body-lotion.jpg";

  return (
    <div className="w-full">
      <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[calc(100vh-10rem)] lg:min-h-[480px] lg:max-h-[620px] overflow-hidden rounded-2xl border border-black bg-[#f4f1ea]">
        <Image
          src={primaryImage}
          alt={`${productName} — 400ml Facial-Grade Botanical Body Lotion`}
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Minimalist floating corner badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black text-[10px] font-semibold uppercase tracking-[0.16em] text-black">
            {badge || "Flagship 400ml"}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border border-black text-[10px] font-semibold uppercase tracking-[0.14em] ${
              inStock
                ? "bg-white/90 text-black"
                : "bg-neutral-900/90 text-white"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                inStock ? "bg-[#3d7b32]" : "bg-red-500"
              }`}
            />
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
}
