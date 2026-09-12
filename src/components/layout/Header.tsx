"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlass, ShoppingCart, ArrowRight } from "@phosphor-icons/react";
import { useCart } from "@/lib/context/CartContext";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { cartCount, openCart } = useCart();
  const { isSignedIn } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (menu: string | null) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const isSolid = isScrolled || activeMenu !== null;

  return (
    <header 
      className={`header-wrapper ${isSolid ? 'header-solid' : 'header-transparent'}`}
      onMouseLeave={handleMouseLeave}
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
          <Link 
            href="/shop"
            onMouseEnter={() => handleMouseEnter('shop')}
            onClick={() => setActiveMenu(null)}
          >
            Shop
          </Link>
          <Link 
            href="#"
            onMouseEnter={() => handleMouseEnter('rituals')}
          >
            Rituals
          </Link>
          <Link 
            href="#"
            onMouseEnter={() => handleMouseEnter('about')}
          >
            About Us
          </Link>
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
          <button className="icon-btn" aria-label="Cart" onClick={openCart}>
            <ShoppingCart size={20} weight="regular" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          {isSignedIn ? (
            <div className="flex items-center justify-center w-[100px]">
              <UserButton />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="btn-login">
                Login
              </button>
            </SignInButton>
          )}
        </div>
      </nav>

      {/* Mega Menu Dropdowns */}
      <AnimatePresence>
        {activeMenu === 'shop' && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-sm z-[990] overflow-hidden"
            onMouseEnter={() => handleMouseEnter('shop')}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12 flex flex-col md:flex-row gap-16">
              {/* Left Column: Categories */}
              <div className="flex-1 grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-6">Categories</h3>
                  <ul className="space-y-4">
                    <li><Link href="/shop?category=Body+Care" className="text-xl text-gray-800 hover:text-black transition-colors" onClick={() => setActiveMenu(null)}>Body Care</Link></li>
                    <li><Link href="/shop?category=Face+Care" className="text-xl text-gray-800 hover:text-black transition-colors" onClick={() => setActiveMenu(null)}>Face Care</Link></li>
                    <li><Link href="/shop?category=Oils+%26+Serums" className="text-xl text-gray-800 hover:text-black transition-colors" onClick={() => setActiveMenu(null)}>Oils & Serums</Link></li>
                    <li><Link href="/shop?category=Bundles" className="text-xl text-gray-800 hover:text-black transition-colors" onClick={() => setActiveMenu(null)}>Curated Bundles</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-6">Featured</h3>
                  <ul className="space-y-4">
                    <li><Link href="/shop" className="text-xl text-gray-800 hover:text-black transition-colors" onClick={() => setActiveMenu(null)}>New Arrivals</Link></li>
                    <li><Link href="/shop" className="text-xl text-gray-800 hover:text-black transition-colors" onClick={() => setActiveMenu(null)}>Best Sellers</Link></li>
                    <li><Link href="/shop" className="text-xl text-gray-800 hover:text-black transition-colors" onClick={() => setActiveMenu(null)}>Travel Sizes</Link></li>
                  </ul>
                </div>
              </div>
              {/* Right Column: Featured Image */}
              <div className="flex-1 hidden md:block relative group cursor-pointer h-72">
                <Link href="/shop" onClick={() => setActiveMenu(null)}>
                  <div className="w-full h-full bg-gray-100 relative overflow-hidden rounded-sm">
                    <Image 
                      src="https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=800" 
                      alt="Featured Product" 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white">
                      <div>
                        <p className="text-xs tracking-widest uppercase font-medium mb-1">Discover</p>
                        <p className="text-2xl font-light">The Night Repair Serum</p>
                      </div>
                      <ArrowRight size={24} className="transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
