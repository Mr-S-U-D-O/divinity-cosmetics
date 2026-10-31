"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const galleryImages = images.filter(Boolean);

  if (galleryImages.length === 0) {
    return (
      <div className="aspect-square rounded-sm bg-[#f7f7f4]" aria-label="Product image unavailable" />
    );
  }

  return (
    <div className="w-full">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-[#f7f7f4] sm:aspect-[4/5]">
        <Image
          src={galleryImages[selectedImage]}
          alt={`${productName} product view ${selectedImage + 1}`}
          fill
          className="object-cover object-center transition-opacity duration-500"
          priority={selectedImage === 0}
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
        {galleryImages.length > 1 && (
          <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/60 backdrop-blur-sm">
            {selectedImage + 1} / {galleryImages.length}
          </div>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className="mt-4 grid grid-cols-2 gap-3" aria-label="Product image selector">
          {galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedImage(index)}
              aria-label={`View ${productName} image ${index + 1}`}
              aria-current={selectedImage === index}
              className={`relative aspect-[4/3] overflow-hidden rounded-sm bg-[#f7f7f4] transition-opacity ${
                selectedImage === index ? "ring-2 ring-[#3d7b32] ring-offset-2" : "opacity-65 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 50vw, 30vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
