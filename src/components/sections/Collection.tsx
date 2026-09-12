import React from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { ProductCard } from "@/components/ui/ProductCard";

export function Collection() {
  return (
    <section className="collection-section">
      <div className="collection-header">
        <h2 className="collection-title">Our Collection</h2>
        <p className="collection-subtext">
          Pure botanical essences sustainably harvested to restore and nourish your skin. Experience our restorative formulas handcrafted in South Africa.
        </p>
      </div>

      <div className="collection-controls">
        <div className="filter-group">
          <button className="filter-pill active">BODY LOTION</button>
          <button className="filter-pill">HAIR CARE</button>
          <button className="filter-pill">ORAL CARE</button>
        </div>
        <div className="search-box">
          <MagnifyingGlass size={16} className="search-icon" weight="bold" />
          <input type="text" placeholder="Search a product..." className="search-input" />
        </div>
      </div>

      <div className="collection-grid">
        <ProductCard
          title="Body Lotion A"
          imageSrc="/images/body-lotion-a.jpg"
          description="Infused with African botanicals and cold-pressed marula oil. Deeply replenishes moisture barriers while soothing sensitive skin. Fast-absorbing, velvet finish."
          price={200}
          rating={5}
          reviewCount={48}
        />
        <ProductCard
          title="Body Lotion B"
          imageSrc="/images/body-lotion-b.jpg"
          description="Formulated with nourishing neroli, frankincense, and calming chamomile extract. Restores elasticity and revitalizes natural tone throughout the day. Ultra-hydrating and gentle."
          price={45}
          rating={5}
          reviewCount={16}
        />
      </div>
    </section>
  );
}
