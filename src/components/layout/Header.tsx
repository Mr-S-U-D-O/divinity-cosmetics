"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MagnifyingGlass, ShoppingCart } from "@phosphor-icons/react";

const SAFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="14" height="10" style={{ borderRadius: '2px', overflow: 'hidden' }}>
    <rect width="900" height="600" fill="#001489" />
    <polygon points="0,0 900,0 900,200 300,200" fill="#E03C31" />
    <polygon points="0,600 900,600 900,400 300,400" fill="#001489" />
    <polygon points="0,0 120,0 340,266 900,266 900,334 340,334 120,600 0,600" fill="#fff" />
    <polygon points="0,50 250,300 0,550" fill="#007749" />
    <polygon points="250,300 340,300 900,283 900,317 340,300" fill="#007749" />
    <polygon points="0,100 200,300 0,500" fill="#ffb81c" />
    <polygon points="0,150 150,300 0,450" fill="#000" />
  </svg>
);

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSolid = isScrolled || isHovered;

  return (
    <header 
      className={`header-wrapper ${isSolid ? 'header-solid' : 'header-transparent'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-left">
          <div className="top-pill">
            <SAFlag />
            <span>South African</span>
          </div>
          <div className="top-pill">
            <span>Free shipping on orders over R500</span>
          </div>
        </div>
        <div className="top-bar-right">
          <div className="top-pill">
            <span>Free shipping on orders over R500</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="nav-bar">
        <div className="nav-links">
          <a href="#">Shop</a>
          <a href="#">Rituals</a>
          <a href="#">About Us</a>
        </div>

        {/* Centered Logo */}
        <div className="nav-logo-container">
          <Image
            src="/images/divinity-logo.png"
            alt="Divinity Cosmetics"
            width={90}
            height={90}
            className="nav-logo-img"
            priority
          />
        </div>
        
        {/* Right Utils */}
        <div className="nav-utils">
          <button className="icon-btn" aria-label="Search">
            <MagnifyingGlass size={20} weight="regular" />
          </button>
          <button className="icon-btn" aria-label="Cart">
            <ShoppingCart size={20} weight="regular" />
            <span className="cart-badge">2</span>
          </button>
          <button className="btn-login">
            Login
          </button>
        </div>
      </nav>
    </header>
  );
}
