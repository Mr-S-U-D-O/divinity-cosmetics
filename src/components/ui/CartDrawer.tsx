"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/lib/context/CartContext";

export function CartDrawer() {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, cartTotal } = useCart();

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
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
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[999] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-medium tracking-tight">Your Cart</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                    className="mt-4 px-6 py-2 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 group">
                    {/* Item Image */}
                    <div className="relative w-20 h-24 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
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
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash size={16} />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-auto pt-4 flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-full h-8">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                          >
                            <Minus size={12} weight="bold" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
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
              <div className="p-6 border-t border-gray-100 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-medium text-gray-900">Subtotal</span>
                  <span className="font-medium text-gray-900 text-lg">R {cartTotal.toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full block text-center bg-black text-white py-4 font-medium uppercase tracking-wider text-sm hover:bg-[#3d7b32] transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
