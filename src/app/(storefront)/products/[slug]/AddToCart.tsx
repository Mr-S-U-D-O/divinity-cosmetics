"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingBag,
  Check,
} from "@phosphor-icons/react";
import { animate, spring } from "animejs";
import { useCart } from "@/lib/context/CartContext";
import { Product } from "@/lib/domain/products/types";

type DetailSection = "ingredients" | "ritual" | "delivery";

function formatRand(amount: number): string {
  return Number.isInteger(amount) ? amount.toFixed(0) : amount.toFixed(2);
}

export function AddToCart({ product }: { product: Product }) {
  const router = useRouter();
  const { items, addItem, updateQuantity, openCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [openSection, setOpenSection] = useState<DetailSection | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const isOutOfStock = Boolean(product.trackInventory && product.stock <= 0);
  const maxStock = product.trackInventory ? Math.max(1, product.stock) : 99;

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItem = items.find((i) => i.product.id === product.id);
  const cartQuantity = mounted ? cartItem?.quantity || 0 : 0;

  const handleDecrement = () => {
    setSelectedQty((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setSelectedQty((prev) => Math.min(maxStock, prev + 1));
  };

  const addSelectedQuantityToCart = () => {
    if (isOutOfStock) return;
    if (!cartItem) {
      addItem(product);
      if (selectedQty > 1) {
        updateQuantity(product.id, Math.min(maxStock, selectedQty));
      }
    } else {
      const nextQty = Math.min(maxStock, cartQuantity + selectedQty);
      updateQuantity(product.id, nextQty);
    }
  };

  const handleAddToBag = () => {
    if (isOutOfStock) return;
    if (btnRef.current) {
      animate(btnRef.current, {
        scale: [0.97, 1.01, 1],
        ease: spring({ mass: 1, stiffness: 240, damping: 14 }),
      });
    }
    addSelectedQuantityToCart();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
    openCart();
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (!cartItem) {
      addItem(product);
      if (selectedQty > 1) {
        updateQuantity(product.id, Math.min(maxStock, selectedQty));
      }
    } else if (cartQuantity < selectedQty) {
      updateQuantity(product.id, Math.min(maxStock, selectedQty));
    }
    router.push("/checkout");
  };

  const toggleSection = (section: DetailSection) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const lineTotal = product.basePrice * selectedQty;
  const ingredientsList =
    product.ingredients && product.ingredients.length > 0
      ? product.ingredients.join(" · ")
      : "10% Cold-Pressed Limpopo Marula Oil, 10% Wild-Harvested Mpumalanga Baobab Seed Oil, Botanical Emulsifiers. 0% parabens, mineral oil, sulfates, or synthetic perfume.";

  const detailRows: { id: DetailSection; title: string; content: string }[] = [
    {
      id: "ingredients",
      title: "Key Botanicals & Ingredients",
      content: ingredientsList,
    },
    {
      id: "ritual",
      title: "The 90-Day Barrier Ritual",
      content:
        "Apply daily within 3 minutes of a warm shower. Dense, cold-pressed seed oils take 2–3 minutes to sink in—forming a physical 24-hour moisture seal against dry Highveld air and hard tap water.",
    },
    {
      id: "delivery",
      title: "Shipping & Checkout",
      content:
        "Door-to-door courier delivery across all 9 provinces via The Courier Guy in 2–4 business days (3–5 days regional). Live rates are calculated at checkout (economy from around R142). Pay via Paystack or WhatsApp.",
    },
  ];

  return (
    <div className="flex flex-col w-full pt-6 border-t border-black">
      {/* Purchase Actions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {/* Quantity Stepper */}
          <div
            className="flex items-center border border-black rounded-full h-[50px] bg-white shrink-0"
            aria-label="Select quantity"
          >
            <button
              type="button"
              onClick={handleDecrement}
              disabled={isOutOfStock || selectedQty <= 1}
              aria-label="Decrease quantity"
              className="w-11 h-full flex items-center justify-center text-black hover:text-green disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Minus size={13} weight="bold" />
            </button>
            <span className="w-7 text-center text-sm font-semibold select-none text-black">
              {selectedQty}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={isOutOfStock || selectedQty >= maxStock}
              aria-label="Increase quantity"
              className="w-11 h-full flex items-center justify-center text-black hover:text-green disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Plus size={13} weight="bold" />
            </button>
          </div>

          {/* Primary Instant Purchase CTA */}
          <button
            ref={btnRef}
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="btn-primary flex-1 justify-center !h-[50px] !py-0 !px-6 text-xs sm:text-[13px] uppercase tracking-[0.14em]"
          >
            {isOutOfStock ? (
              <span>Currently Unavailable</span>
            ) : (
              <span>Buy Now · R{formatRand(lineTotal)}</span>
            )}
          </button>
        </div>

        {/* Secondary Add to Bag */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddToBag}
            disabled={isOutOfStock}
            className="btn-secondary flex-1 justify-center !h-[46px] !py-0 text-xs uppercase tracking-[0.14em]"
          >
            {justAdded ? (
              <>
                <Check size={14} weight="bold" className="text-[#3d7b32]" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} weight="regular" />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          {cartQuantity > 0 && (
            <button
              type="button"
              onClick={openCart}
              className="inline-flex items-center justify-center h-[46px] px-5 rounded-full border border-black bg-white hover:bg-black hover:text-white text-xs font-medium uppercase tracking-[0.12em] text-black transition-colors cursor-pointer shrink-0"
            >
              Bag ({cartQuantity})
            </button>
          )}
        </div>

        {/* Single Quiet Delivery Cue */}
        <p className="m-0 pt-1 text-xs text-black/75">
          Door-to-door courier delivery via The Courier Guy calculated live at checkout (economy from ~R142).{" "}
          <Link href="/shipping" className="underline underline-offset-4 hover:text-green">
            Shipping details
          </Link>
        </p>
      </div>

      {/* Progressive Disclosure Hairline Accordions */}
      <div className="mt-8 border-t border-black">
        {detailRows.map((row) => {
          const isOpen = openSection === row.id;
          const panelId = `pdp-detail-panel-${row.id}`;
          return (
            <div key={row.id} className="border-b border-black">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleSection(row.id)}
                className="w-full py-4 flex items-center justify-between gap-4 text-left cursor-pointer group"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black group-hover:text-green transition-colors">
                  {row.title}
                </span>
                <span className="text-black group-hover:text-green transition-colors shrink-0">
                  {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>
              {/* Always rendered (hidden when closed) so content is in SSR HTML. */}
              <div
                id={panelId}
                hidden={!isOpen}
                className="pb-4 pr-6 text-[13px] leading-relaxed text-black/80"
              >
                {row.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
