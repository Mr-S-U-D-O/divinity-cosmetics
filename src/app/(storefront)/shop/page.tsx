import React from "react";
import { getAllProducts } from "@/lib/domain/products/service";
import { ShopClient } from "./ShopClient";

export default async function ShopPage() {
  const products = await getAllProducts({ onlyActive: true });
  return <ShopClient products={products} />;
}
