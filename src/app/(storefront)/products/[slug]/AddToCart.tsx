"use client";

import React from "react";
import { useCart } from "@/lib/context/CartContext";
import { Product } from "@/lib/domain/products/types";

export function AddToCart({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const isOutOfStock = product.trackInventory && product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product);
    openCart();
  };

  return (
    <button 
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className="w-full rounded-full bg-[#1a1a1a] py-5 text-sm font-bold uppercase tracking-[0.2em] text-[#f5f5f5] transition-colors duration-500 hover:bg-[#3d7b32] disabled:cursor-not-allowed disabled:bg-[#d9d9d5] disabled:text-[#1a1a1a]/50"
    >
      {isOutOfStock ? "Currently unavailable" : "Add to Cart"}
    </button>
  );
}
