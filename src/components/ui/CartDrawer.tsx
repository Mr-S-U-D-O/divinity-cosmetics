"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { animate, stagger } from "animejs";
import { useCart } from "@/lib/context/CartContext";

export function CartDrawer() {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, cartTotal } = useCart();
  const listRef = useRef<HTMLDivElement>(null);

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      if (listRef.current) {
        const rows = listRef.current.querySelectorAll('[data-anime="cart-item"]');
        if (rows.length > 0) {
          animate(rows, {
            opacity: [0, 1],
            translateX: [24, 0],
            delay: stagger(65, { start: 120 }),
            duration: 600,
            ease: "outExpo",
          });
        }
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(price);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 z-[998] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white z-[999] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-black">
              <h2 className="text-xl font-medium tracking-tight">Your Cart</h2>
              <button
                onClick={closeCart}
                className="p-2 text-black border border-transparent hover:border-green hover:bg-green/10 hover:text-green rounded-full transition-all"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
                    <p className="text-sm text-gray-500 mt-1">Discover our natural botanicals to begin.</p>
                  </div>
                  <button 
                    onClick={closeCart}
                    className="btn-secondary mt-4 !px-6 !py-2.5 !text-xs"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} data-anime="cart-item" className="flex gap-4 group will-change-transform">
                    {/* Item Image */}
                    <div className="relative w-20 h-24 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0 border border-black">
                      <Image
                        src={item.product.images?.[0] || "/images/body-lotion-marula-baobab-hero.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover object-center"
                        sizes="80px"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 leading-tight pr-4">{item.product.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{formatPrice(item.product.basePrice)}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash size={16} />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-auto pt-4 flex items-center gap-3">
                        <div className="flex items-center border border-black rounded-full h-8 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-full flex items-center justify-center text-black hover:text-green hover:bg-green/10 transition-colors"
                          >
                            <Minus size={12} weight="bold" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-full flex items-center justify-center text-black hover:text-green hover:bg-green/10 transition-colors"
                          >
                            <Plus size={12} weight="bold" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-black bg-white">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-medium text-gray-900">Subtotal</span>
                  <span className="font-medium text-gray-900 text-lg">R {cartTotal.toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full !py-3.5 !text-xs sm:!text-sm uppercase tracking-wider"
                >
                  <span>Proceed to Checkout</span>
                </Link>
                <p className="text-[11px] text-gray-500 text-center mt-2.5">
                  Instant card, Capitec Pay &amp; EFT checkout via Paystack · Direct delivery across SA
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
