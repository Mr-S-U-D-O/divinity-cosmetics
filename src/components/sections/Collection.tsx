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
          You refuse to put cheap synthetic fillers on your face—stop settling for watery supermarket pump lotions on the other 90% of your body. Formulated with high concentrations of cold-pressed South African Marula and wild-harvested Baobab seed oils to physically seal your skin barrier for 24 hours.
        </p>
      </div>

      <CollectionClient products={products} />
    </section>
  );
}
