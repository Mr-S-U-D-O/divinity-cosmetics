"use client";

import React, { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Product } from "@/lib/domain/products/types";
import Link from "next/link";

export function CollectionClient({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState("Body Lotion");

  return (
    <>
      <div className="collection-controls">
        <div className="filter-group">
          <button 
            className={`filter-pill ${activeTab === "Body Lotion" ? "active" : ""}`}
            onClick={() => setActiveTab("Body Lotion")}
          >
            Body Lotion
          </button>
        </div>
        <div className="search-box">
          <MagnifyingGlass size={16} className="search-icon" weight="bold" />
          <input type="text" placeholder="Search a product..." className="search-input" />
        </div>
      </div>

      {activeTab === "Body Lotion" ? (
        <div className="collection-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 px-4 border border-gray-100 rounded-3xl bg-white shadow-sm mb-16">
          <h3 className="text-2xl font-bold tracking-tight mb-3 text-[#1a1a1a]">More {activeTab} formulations coming soon.</h3>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Divinity Cosmetics is currently focused on perfecting our flagship body care line. 
            We are meticulously developing new botanical blends for our {activeTab.toLowerCase()} range. 
            Join our network to be notified when they launch.
          </p>
        </div>
      )}

      {activeTab === "Body Lotion" && (
        <div className="collection-footer">
          <div className="pagination">
            <button className="page-nav" disabled>&lt;</button>
            <button className="page-number active">1</button>
          </div>
          
          <Link href="/shop" className="btn-primary">
            View Product Details
          </Link>
        </div>
      )}
    </>
  );
}
