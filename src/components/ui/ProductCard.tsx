"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Check } from "@phosphor-icons/react/dist/ssr";

import { Product } from "@/lib/domain/products/types";
import { useCart } from "@/lib/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
      {/* Image with Badge */}
      <Link href={`/products/${product.slug}`} className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 block bg-gray-50">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {product.badge && (
          <div className="absolute top-3 left-3 bg-[#3d7b32] text-white text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full shadow-sm z-10">
            {product.badge}
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] text-[#3d7b32] font-semibold tracking-widest uppercase">
            {product.category}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="flex text-[#ffb81c]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} weight={i < Math.floor(product.rating || 0) ? "fill" : "regular"} />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">({product.reviewCount || 0})</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`} className="hover:text-[#3d7b32] transition-colors mb-2">
          <h3 className="text-[17px] font-bold text-gray-900 leading-snug tracking-tight">{product.name}</h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-6 flex-1">
          {product.description}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">PRICE</span>
            <span className="text-xs font-bold bg-[#e8efe7] text-[#3d7b32] px-2.5 py-1 rounded-md">R{product.basePrice}</span>
          </div>
          <button 
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[11px] font-bold tracking-wide transition-all ${
              added ? "bg-black text-white" : "bg-[#3d7b32] text-white hover:bg-[#2c5a24]"
            }`}
          >
            {added ? <Check size={14} weight="bold" /> : <ShoppingCart size={14} weight="bold" />}
            <span>{added ? "Added!" : "Add to Cart"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
