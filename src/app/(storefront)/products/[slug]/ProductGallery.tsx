"use client";

import React, { useState } from "react";
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
  inStock = true,
}: ProductGalleryProps) {
  const validImages = images?.filter(Boolean) ?? [];
  const galleryImages =
    validImages.length > 0
      ? validImages
      : ["/images/marula-baobab-body-lotion.jpg"];

  const [activeIndex, setActiveIndex] = useState(0);
  const currentImage = galleryImages[activeIndex] || galleryImages[0];

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="relative w-full aspect-[4/5] sm:aspect-[5/5] lg:aspect-[4/4.6] max-h-[620px] overflow-hidden rounded-2xl border-2 border-black bg-[#f4f1ea]">
        <Image
          src={currentImage}
          alt={`${productName} (400ml) — Facial-Grade Marula and Baobab Body Lotion by Divinity Cosmetics`}
          fill
          className="object-cover object-center transition-opacity duration-300"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {!inStock && (
          <div className="absolute top-4 left-4 pointer-events-none">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-900/90 text-white text-[10px] font-medium uppercase tracking-[0.16em]">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div
          className="flex items-center gap-2.5 overflow-x-auto pt-1"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {galleryImages.map((src, index) => {
            const isSelected = index === activeIndex;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`View ${productName} image ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`relative w-16 h-16 rounded-xl overflow-hidden bg-[#f4f1ea] shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "border-2 border-black opacity-100"
                    : "border border-black opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="64px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
