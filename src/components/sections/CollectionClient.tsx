"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Product } from "@/lib/domain/products/types";
import Link from "next/link";
import { animate, spring, stagger } from "animejs";

export function CollectionClient({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Extract distinct categories from the curated collection
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filter products by active category and search query
  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeTab !== "All") {
      result = result.filter((p) => p.category.toLowerCase() === activeTab.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.ingredients?.some((ing) => ing.toLowerCase().includes(q)) ||
          p.concerns?.some((c) => c.toLowerCase().includes(q))
      );
    }

    return result;
  }, [products, activeTab, searchQuery]);

  // Gentle soft crossfade for product cards when filter tab or search query changes
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".anime-product-card");
    if (cards.length === 0) return;

    const anim = animate(cards, {
      opacity: [0.82, 1],
      translateY: [6, 0],
      delay: stagger(35),
      duration: 380,
      ease: "outQuart",
    });

    return () => {
      anim.revert();
    };
  }, [activeTab, searchQuery]);

  const handleTabClick = (tab: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(tab);
    animate(e.currentTarget, {
      scale: [0.94, 1.04, 1],
      ease: spring({ mass: 1, stiffness: 220, damping: 12 }),
    });
  };

  return (
    <div ref={containerRef}>
      <div className="collection-controls">
        {/* On mobile: Search Bar is placed on top (order-1), desktop on right (md:order-2) */}
        <div className="search-box order-1 md:order-2">
          <MagnifyingGlass size={16} className="search-icon" weight="bold" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search featured collection..."
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-gray-400 hover:text-green pr-2 transition-colors"
              aria-label="Clear search"
            >
              <X size={14} weight="bold" />
            </button>
          )}
        </div>

        {/* On mobile: Filter pills are placed directly under search bar in one clean row (order-2), desktop on left (md:order-1) */}
        <div className="filter-group order-2 md:order-1">
          <button
            className={`filter-pill ${activeTab === "All" ? "active" : ""}`}
            onClick={(e) => handleTabClick("All", e)}
          >
            All Formulations ({products.length})
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${activeTab === cat ? "active" : ""}`}
              onClick={(e) => handleTabClick(cat, e)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div ref={gridRef} className="collection-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 px-4 border border-black rounded-3xl bg-white shadow-sm mb-16">
          <h3 className="text-2xl font-bold tracking-tight mb-3 text-black">
            No matching formulations found
          </h3>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed mb-6">
            We couldn&apos;t find any featured products matching &ldquo;{searchQuery}&rdquo;. 
            Explore our full catalog to discover all botanical formulations.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("All");
              }}
              className="btn-secondary !py-2.5 !px-6 !text-xs"
            >
              Reset Filters
            </button>
            <Link href="/shop" className="btn-primary !py-2.5 !px-6 !text-xs">
              View Entire Shop
            </Link>
          </div>
        </div>
      )}

      <div className="collection-footer">
        <div className="pagination">
          <span className="text-xs text-gray-500 font-medium">
            Showing {filteredProducts.length} curated {filteredProducts.length === 1 ? "formulation" : "formulations"}
          </span>
        </div>
        
        <Link href="/shop" className="btn-primary">
          Explore Entire Shop
        </Link>
      </div>
    </div>
  );
}
