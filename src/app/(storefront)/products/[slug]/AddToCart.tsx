"use client";

import React from "react";
import { useCart } from "@/lib/context/CartContext";
import { Product } from "@/lib/domain/products/types";

export function AddToCart({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    addItem(product);
    openCart();
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="w-full bg-[#1a1a1a] text-[#f5f5f5] py-6 rounded-full uppercase tracking-[0.2em] text-sm font-bold hover:bg-[#3d7b32] transition-colors duration-500"
    >
      Add to Cart
    </button>
  );
}
