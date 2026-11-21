import React from "react";
import { getFeaturedProducts } from "@/lib/domain/products/service";
import { CollectionClient } from "./CollectionClient";

export async function Collection() {
  const products = await getFeaturedProducts(6);

  return (
    <section className="collection-section" aria-labelledby="collection-heading">
      <div className="collection-header">
        <h2 id="collection-heading" className="collection-title">
          Close the Vanity Divide.
        </h2>
        <p className="collection-subtext">
          You put real money into facial serums for 10% of your skin, then settle for thin supermarket pumps on the other 90%. Our 400ml lotion pairs 10% cold-pressed Limpopo Marula oil with 10% wild-harvested Mpumalanga Baobab oil for a physical 24-hour moisture seal.
        </p>
      </div>

      <CollectionClient products={products} />
    </section>
  );
}
