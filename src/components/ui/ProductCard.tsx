import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "@phosphor-icons/react/dist/ssr";

import { Product } from "@/lib/domain/products/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <Link href={`/products/${product.slug}`} className="card-image-wrapper block relative">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          priority
          className="card-image"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </Link>
      <div className="card-content">
        <div className="card-header">
          <Link href={`/products/${product.slug}`} className="hover:opacity-70 transition-opacity">
            <h3 className="card-title">{product.name}</h3>
          </Link>
          <div className="card-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} weight={i < Math.floor(product.rating || 0) ? "fill" : "regular"} className="star-icon" />
              ))}
            </div>
            <span className="review-count">({product.reviewCount || 0})</span>
          </div>
        </div>
        <p className="card-description">{product.description}</p>
        <div className="card-footer">
          <div className="price-container">
            <span className="price-label">PRICE</span>
            <span className="price-pill">R{product.basePrice}</span>
          </div>
          <button className="add-to-cart-btn" aria-label="Add to cart">
            <ShoppingCart size={16} weight="bold" />
            <span>add to cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
