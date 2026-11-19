"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Minus, Plus } from "@phosphor-icons/react";
import { animate } from "animejs";

import { Product } from "@/lib/domain/products/types";
import { useCart } from "@/lib/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const isOutOfStock = Boolean(product.trackInventory && product.stock <= 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = mounted ? cartItem?.quantity || 0 : 0;

  const primaryImage = product.images?.[0] || "/images/body-lotion-marula-baobab-hero.jpg";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product);

    if (cardRef.current) {
      const media = cardRef.current.querySelector('[data-anime="card-media"]');
      if (media) {
        animate(media, {
          scale: [1, 1.025, 1],
          duration: 520,
          ease: "outQuart",
        });
      }
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity - 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.trackInventory && quantity >= product.stock) return;
    updateQuantity(product.id, quantity + 1);
  };

  return (
    <article
      ref={cardRef}
      className="anime-product-card group flex flex-col h-full bg-transparent transition-all duration-300 will-change-transform"
    >
      {/* Editorial Media Canvas */}
      <Link
        href={`/products/${product.slug}`}
        data-anime="card-media"
        className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#f4f2ee] mb-4 block will-change-transform border border-black"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {isOutOfStock ? (
          <div className="absolute top-3.5 left-3.5 bg-stone-900/90 text-stone-100 text-[10px] font-medium tracking-[0.14em] uppercase px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20 z-10">
            Sold Out
          </div>
        ) : product.badge ? (
          <div className="absolute top-3.5 left-3.5 bg-white/95 text-stone-800 text-[10px] font-bold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full backdrop-blur-md border border-black shadow-sm z-10">
            {product.badge}
          </div>
        ) : null}
      </Link>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1">
        {/* Category micro-tag */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-green uppercase tracking-[0.18em]">
            {product.category}
          </span>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="block group/title mb-1.5">
          <h3 className="font-heading text-lg sm:text-xl text-stone-900 font-normal leading-snug tracking-tight group-hover/title:text-green transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Formulation Summary */}
        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.shortDescription || product.description}
        </p>

        {/* Pricing & Minimalist Action */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-black">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-stone-900 tracking-tight">
              R{product.basePrice}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
              <span className="text-xs text-stone-400 line-through">
                R{product.compareAtPrice}
              </span>
            )}
          </div>

          {quantity === 0 ? (
            <button
              ref={btnRef}
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label={isOutOfStock ? `${product.name} is sold out` : `Add ${product.name} to bag`}
              className={`inline-flex items-center justify-center gap-1.5 min-h-[38px] px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 cursor-pointer will-change-transform ${
                isOutOfStock
                  ? "!border !border-stone-200 !bg-stone-100 !text-stone-400 !cursor-not-allowed"
                  : "border border-black text-black bg-transparent hover:bg-black hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
              }`}
            >
              {isOutOfStock ? (
                <span>Sold Out</span>
              ) : (
                <>
                  <ShoppingBag size={14} weight="bold" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          ) : (
            <div
              className="inline-flex items-center border border-black rounded-full h-[38px] overflow-hidden bg-white shadow-sm will-change-transform"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <button
                type="button"
                onClick={handleDecrement}
                aria-label={`Decrease quantity of ${product.name}`}
                className="w-8 h-full flex items-center justify-center text-black hover:text-green hover:bg-green/10 active:scale-90 transition-colors cursor-pointer"
              >
                <Minus size={12} weight="bold" />
              </button>
              <span className="w-6 text-center text-xs font-bold select-none text-black font-sans">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={Boolean(product.trackInventory && quantity >= product.stock)}
                aria-label={`Increase quantity of ${product.name}`}
                className="w-8 h-full flex items-center justify-center text-black hover:text-green hover:bg-green/10 active:scale-90 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus size={12} weight="bold" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
