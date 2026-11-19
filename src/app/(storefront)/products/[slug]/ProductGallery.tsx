"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { animate, createSpring } from "animejs";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const galleryImages = images.filter(Boolean);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!stageRef.current) return;

    const anim = animate(stageRef.current, {
      opacity: [0.35, 1],
      scale: [1.045, 1],
      duration: 650,
      ease: "outExpo",
    });

    return () => {
      anim.revert();
    };
  }, [selectedImage]);

  if (galleryImages.length === 0) {
    return (
      <div className="aspect-square rounded-sm bg-[#f7f7f4]" aria-label="Product image unavailable" />
    );
  }

  const handleThumbClick = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedImage(index);
    animate(e.currentTarget, {
      scale: [0.94, 1],
      ease: createSpring({ mass: 1, stiffness: 220, damping: 12 }),
    });
  };

  return (
    <div className="w-full">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-black bg-[#f7f7f4] sm:aspect-[4/5]">
        <div ref={stageRef} className="relative h-full w-full">
          <Image
            src={galleryImages[selectedImage]}
            alt={`${productName} product view ${selectedImage + 1}`}
            fill
            className="object-cover object-center"
            priority={selectedImage === 0}
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
        {galleryImages.length > 1 && (
          <div className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-black border border-black">
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
              onClick={(e) => handleThumbClick(index, e)}
              aria-label={`View ${productName} image ${index + 1}`}
              aria-current={selectedImage === index}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl border transition-colors ${
                selectedImage === index ? "border-green" : "border-black"
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
