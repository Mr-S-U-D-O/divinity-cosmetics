"use client";

import React, { useRef, useState, useEffect } from "react";
import { Minus, Plus } from "@phosphor-icons/react";
import { animate, createSpring } from "animejs";
import { useCart } from "@/lib/context/CartContext";
import { Product } from "@/lib/domain/products/types";

export function AddToCart({ product }: { product: Product }) {
  const { items, addItem, updateQuantity, openCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const isOutOfStock = Boolean(product.trackInventory && product.stock <= 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = mounted ? cartItem?.quantity || 0 : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (btnRef.current) {
      animate(btnRef.current, {
        scale: [0.95, 1.03, 1],
        ease: createSpring({ mass: 1, stiffness: 240, damping: 12 }),
      });
    }
    addItem(product);
  };

  const handleDecrement = () => {
    updateQuantity(product.id, quantity - 1);
  };

  const handleIncrement = () => {
    if (product.trackInventory && quantity >= product.stock) return;
    updateQuantity(product.id, quantity + 1);
  };

  if (quantity === 0) {
    return (
      <button 
        ref={btnRef}
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className="btn-primary w-full justify-center !py-5 text-sm uppercase tracking-[0.2em]"
      >
        {isOutOfStock ? "Currently unavailable" : "Add to Cart"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 w-full animate-in fade-in duration-300">
      {/* Counter pill like the one in the cart */}
      <div className="flex items-center border border-black rounded-full h-[54px] overflow-hidden bg-white shadow-sm shrink-0">
        <button
          type="button"
          onClick={handleDecrement}
          aria-label={`Decrease quantity of ${product.name}`}
          className="w-12 h-full flex items-center justify-center text-black hover:text-green hover:bg-green/10 active:scale-90 transition-colors cursor-pointer"
        >
          <Minus size={15} weight="bold" />
        </button>
        <span className="w-10 text-center text-base font-bold select-none text-black font-sans">
          {quantity}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={Boolean(product.trackInventory && quantity >= product.stock)}
          aria-label={`Increase quantity of ${product.name}`}
          className="w-12 h-full flex items-center justify-center text-black hover:text-green hover:bg-green/10 active:scale-90 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus size={15} weight="bold" />
        </button>
      </div>

      {/* Primary View Bag / Checkout CTA */}
      <button
        type="button"
        onClick={openCart}
        className="btn-primary flex-1 justify-center !py-4 text-xs sm:text-sm uppercase tracking-[0.16em]"
      >
        <span>View Bag ({quantity})</span>
      </button>
    </div>
  );
}
