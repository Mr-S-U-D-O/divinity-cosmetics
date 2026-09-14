import React from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { ProductCard } from "@/components/ui/ProductCard";
import { getAllProducts } from "@/lib/domain/products/service";

export async function Collection() {
  const products = await getAllProducts({ onlyActive: true });

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
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="collection-footer">
        <div className="pagination">
          <button className="page-nav" disabled>&lt;</button>
          <button className="page-number active">1</button>
          <button className="page-number">2</button>
          <button className="page-number">3</button>
          <span className="page-ellipsis">...</span>
          <button className="page-number">8</button>
          <button className="page-nav">&gt;</button>
        </div>
        
        <button className="shop-more-btn">
          Shop More Products
        </button>
      </div>
    </section>
  );
}
