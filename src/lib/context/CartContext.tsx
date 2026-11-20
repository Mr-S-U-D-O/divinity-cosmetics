"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/lib/domain/products/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  cartTotal: number;
  cartCount: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount and self-heal stale product snapshots (e.g. old R300 price or deleted image paths)
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("divinity_cart");
      if (storedCart) {
        const parsed: CartItem[] = JSON.parse(storedCart);
        const sanitized = Array.isArray(parsed)
          ? parsed.map((item) => {
              if (!item?.product) return item;
              const isFlagshipLotion =
                item.product.slug === "marula-baobab-body-lotion" ||
                item.product.name?.toLowerCase().includes("marula");
              return {
                ...item,
                product: {
                  ...item.product,
                  basePrice:
                    isFlagshipLotion && Number(item.product.basePrice) !== 400
                      ? 400
                      : Number(item.product.basePrice),
                  images: ["/images/marula-baobab-body-lotion.jpg"],
                },
              };
            })
          : [];
        setItems(sanitized);
      }
    } catch (e) {
      console.error("Failed to parse cart from local storage", e);
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage whenever items change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("divinity_cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const cartTotal = items.reduce(
    (total, item) => total + item.product.basePrice * item.quantity,
    0
  );

  const cartCount = items.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, product, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        cartTotal,
        cartCount,
        addItem,
        removeItem,
        updateQuantity,
        openCart,
        closeCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
