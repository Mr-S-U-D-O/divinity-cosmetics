"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Check,
  Sparkle,
  Drop,
  Truck,
  ShieldCheck,
} from "@phosphor-icons/react";
import { animate, spring } from "animejs";
import { useCart } from "@/lib/context/CartContext";
import { Product } from "@/lib/domain/products/types";

type InfoTab = "description" | "benefits" | "ingredients" | "delivery";

export function AddToCart({ product }: { product: Product }) {
  const router = useRouter();
  const { items, addItem, updateQuantity, openCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<InfoTab>("description");
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
        scale: [0.96, 1.02, 1],
        ease: spring({ mass: 1, stiffness: 240, damping: 12 }),
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

  const lineTotal = product.basePrice * selectedQty;
  const qualifiesFreeDelivery = lineTotal >= 500;

  const tabs: { id: InfoTab; label: string }[] = [
    { id: "description", label: "Overview" },
    { id: "benefits", label: "90-Day Ritual" },
    { id: "ingredients", label: "Ingredients" },
    { id: "delivery", label: "Shipping" },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Condensed Interactive Tab Navigation + Single Switchable Content Panel */}
      <div className="rounded-2xl border border-black bg-[#faf9f6] p-3.5 sm:p-4">
        {/* Segmented Tab Bar */}
        <div
          role="tablist"
          aria-label="Product information tabs"
          className="grid grid-cols-4 gap-1 rounded-full border border-black bg-white p-1 mb-3"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full py-1.5 px-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer truncate ${
                  isActive
                    ? "bg-[#3d7b32] text-white shadow-xs"
                    : "bg-transparent text-black/70 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Tab Content (Fixed compact footprint so everything stays in viewport) */}
        <div className="min-h-[88px] sm:min-h-[84px] flex flex-col justify-between gap-2.5 text-xs sm:text-[13px] leading-relaxed text-black">
          {activeTab === "description" && (
            <>
              <p className="m-0 text-black/90">
                {product.shortDescription ||
                  "A facial-grade 400ml botanical body emulsion formulated with cold-pressed South African Marula and wild-harvested Baobab seed oils for a physical 24-hour moisture seal."}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-black bg-white px-2.5 py-0.5 text-[10px] font-medium">
                  <ShieldCheck size={12} className="text-[#3d7b32]" weight="bold" />
                  24-Hour Barrier Seal
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-black bg-white px-2.5 py-0.5 text-[10px] font-medium">
                  <Drop size={12} className="text-[#3d7b32]" weight="bold" />
                  Cold-Pressed Oils
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-black bg-white px-2.5 py-0.5 text-[10px] font-medium">
                  <Sparkle size={12} className="text-[#3d7b32]" weight="bold" />
                  Cruelty-Free · SA
                </span>
              </div>
            </>
          )}

          {activeTab === "benefits" && (
            <ul className="m-0 list-none p-0 space-y-1.5 text-xs sm:text-[13px]">
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 rounded-full bg-[#3d7b32] shrink-0" />
                <span>
                  <strong>2–3 Minute Absorption:</strong> Dense botanical lipids sink in steadily rather than evaporating like watery 5-second lotions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 rounded-full bg-[#3d7b32] shrink-0" />
                <span>
                  <strong>90-Day Barrier Repair:</strong> Softens crepey texture on arms, legs, and décolletage while eliminating midday ashiness.
                </span>
              </li>
            </ul>
          )}

          {activeTab === "ingredients" && (
            <div className="space-y-1.5">
              <p className="m-0">
                <strong>10% Cold-Pressed Marula Oil</strong> (Oleic Acid, Vitamins C &amp; E) +{" "}
                <strong>10% Wild-Harvested Baobab Oil</strong> (Omegas 3, 6 &amp; 9).
              </p>
              <p className="m-0 text-[11px] text-black/70">
                0% parabens, mineral oil, drying sulfates, or synthetic perfume fillers. Crafted for Highveld winters &amp; hard water.
              </p>
            </div>
          )}

          {activeTab === "delivery" && (
            <div className="space-y-1.5">
              <p className="m-0 flex items-center gap-1.5 font-medium">
                <Truck size={15} className="text-[#3d7b32] shrink-0" weight="bold" />
                <span>
                  Door-to-door via The Courier Guy (2–4 business days nationwide).
                </span>
              </p>
              <p className="m-0 text-[11px] text-black/75">
                Orders over <strong>R500 ship free</strong> (2 bottles = R800, covering a full 90-day cycle). Instant Paystack or WhatsApp checkout.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Purchase Control Block — Quantity Selector + Hero Buy CTA */}
      <div className="rounded-2xl border border-black bg-white p-3.5 sm:p-4 space-y-3 shadow-xs">
        {/* Top micro-row: Quantity label & dynamic Free Shipping indicator */}
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="font-semibold uppercase tracking-[0.14em] text-black/75">
            Quantity · {selectedQty} {selectedQty === 1 ? "Bottle (400ml)" : "Bottles"}
          </span>
          <span
            className={`inline-flex items-center gap-1 font-semibold ${
              qualifiesFreeDelivery ? "text-[#3d7b32]" : "text-black/65"
            }`}
          >
            <Truck size={13} weight="bold" />
            {qualifiesFreeDelivery
              ? "Free SA delivery unlocked"
              : "Add 2 bottles for free delivery"}
          </span>
        </div>

        {/* Primary Row: Quantity Stepper Pill + Main Buy Now Button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quantity Button Pill */}
          <div
            className="flex items-center border border-black rounded-full h-[50px] sm:h-[54px] bg-[#faf9f6] shrink-0"
            aria-label="Select quantity"
          >
            <button
              type="button"
              onClick={handleDecrement}
              disabled={isOutOfStock || selectedQty <= 1}
              aria-label="Decrease quantity"
              className="w-10 sm:w-11 h-full flex items-center justify-center text-black hover:text-[#3d7b32] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Minus size={14} weight="bold" />
            </button>
            <span className="w-7 sm:w-8 text-center text-sm sm:text-base font-bold select-none text-black font-sans">
              {selectedQty}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={isOutOfStock || selectedQty >= maxStock}
              aria-label="Increase quantity"
              className="w-10 sm:w-11 h-full flex items-center justify-center text-black hover:text-[#3d7b32] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Plus size={14} weight="bold" />
            </button>
          </div>

          {/* Hero Buy Now CTA (Main Visual Focus) */}
          <button
            ref={btnRef}
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="btn-primary flex-1 justify-center !h-[50px] sm:!h-[54px] !py-0 !px-5 text-xs sm:text-sm uppercase tracking-[0.16em]"
          >
            {isOutOfStock ? (
              <span>Currently Unavailable</span>
            ) : (
              <>
                <span>Buy Now · R{lineTotal.toFixed(0)}</span>
                <ArrowRight size={16} weight="bold" />
              </>
            )}
          </button>
        </div>

        {/* Secondary Action Row: Add to Bag & View Bag */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToBag}
            disabled={isOutOfStock}
            className="btn-secondary flex-1 justify-center !h-[42px] !py-0 text-[11px] sm:text-xs uppercase tracking-[0.15em]"
          >
            {justAdded ? (
              <>
                <Check size={14} weight="bold" className="text-[#3d7b32]" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} weight="bold" />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          {cartQuantity > 0 && (
            <button
              type="button"
              onClick={openCart}
              className="inline-flex items-center justify-center gap-1.5 h-[42px] px-4 rounded-full border border-black bg-[#faf9f6] hover:bg-black hover:text-white text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
            >
              <span>Bag ({cartQuantity})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
