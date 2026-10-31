import React from "react";
import { getAllProducts } from "@/lib/domain/products/service";
import { CollectionClient } from "./CollectionClient";

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

      <CollectionClient products={products} />
    </section>
  );
}

