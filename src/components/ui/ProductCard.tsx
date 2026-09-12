import React from "react";
import Image from "next/image";
import { Star, ShoppingCart } from "@phosphor-icons/react/dist/ssr";

interface ProductCardProps {
  title: string;
  imageSrc: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
}

export function ProductCard({ title, imageSrc, description, price, rating, reviewCount }: ProductCardProps) {
  return (
    <div className="product-card">
      <div className="card-image-wrapper">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="card-image"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          <div className="card-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} weight={i < Math.floor(rating) ? "fill" : "regular"} className="star-icon" />
              ))}
            </div>
            <span className="review-count">({reviewCount})</span>
          </div>
        </div>
        <p className="card-description">{description}</p>
        <div className="card-footer">
          <div className="price-container">
            <span className="price-label">PRICE</span>
            <span className="price-pill">R{price}</span>
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
