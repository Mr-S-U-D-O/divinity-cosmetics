"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlass, ShoppingCart, ArrowRight, X, User, List } from "@phosphor-icons/react";
import { useCart } from "@/lib/context/CartContext";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "motion/react";
import { animate, spring, stagger } from "animejs";

const SAFlag = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 900 600" 
    width="15" 
    height="10" 
    className="rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] shrink-0 overflow-hidden"
    aria-label="South Africa"
    role="img"
  >
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const cartBtnRef = useRef<HTMLButtonElement>(null);
  const prevCartCountRef = useRef<number>(0);
  const { cartCount, openCart } = useCart();
  const { isSignedIn } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);



  // Cart Badge Spring Pulse when items are added
  useEffect(() => {
    if (cartCount > prevCartCountRef.current && cartBtnRef.current) {
      animate(cartBtnRef.current, {
        scale: [1, 1.26, 1],
        ease: spring({ mass: 1, stiffness: 240, damping: 10 }),
      });
      const badge = cartBtnRef.current.querySelector(".cart-badge");
      if (badge) {
        animate(badge, {
          scale: [0.5, 1.35, 1],
          ease: spring({ mass: 1, stiffness: 260, damping: 9 }),
        });
      }
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  // Mega-Menu Staggered Cascade when Shop Menu Opens
  useEffect(() => {
    if (activeMenu === "shop" && headerRef.current) {
      const items = headerRef.current.querySelectorAll('[data-anime="mega-item"]');
      const feature = headerRef.current.querySelector('[data-anime="mega-feature"]');
      if (items.length > 0) {
        animate(items, {
          opacity: [0, 1],
          translateY: [14, 0],
          delay: stagger(45),
          duration: 550,
          ease: "outExpo",
        });
      }
      if (feature) {
        animate(feature, {
          opacity: [0, 1],
          scale: [0.96, 1],
          duration: 680,
          ease: "outExpo",
        });
      }
    }
  }, [activeMenu]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 25;
      setIsScrolled(scrolled);
      if (scrolled && activeMenu) {
        setActiveMenu(null);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeMenu]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
      ref={headerRef}
      className={`header-wrapper ${isSolid ? 'header-solid' : 'header-transparent'} ${isScrolled ? 'header-scrolled' : ''}`}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Bar (smoothly collapses and hides upward on scroll) */}
      <motion.div
        className="top-bar-motion-wrapper"
        initial={false}
        animate={{
          height: isScrolled ? 0 : "auto",
          opacity: isScrolled ? 0 : 1,
          y: isScrolled ? -10 : 0,
        }}
        transition={{
          duration: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          overflow: "hidden",
          pointerEvents: isScrolled ? "none" : "auto",
        }}
      >
        <div className="top-bar">
          {/* Desktop Left: Provenance & Standards */}
          <div className="top-bar-left">
            <span className="inline-flex items-center gap-2">
              <SAFlag />
              <span className="font-medium text-black/85">South African Botanicals</span>
            </span>
            <span className="top-bar-separator" aria-hidden="true">·</span>
            <span className="text-black/60 font-normal">Cruelty-Free</span>
          </div>

          {/* Desktop Right: Complimentary Delivery offer */}
          <div className="top-bar-right">
            <Link 
              href="/shipping" 
              className="top-bar-link top-bar-pill group"
              title="View nationwide delivery details"
            >
              <span>Complimentary delivery on orders over R500</span>
              <ArrowRight 
                size={11} 
                className="top-bar-arrow" 
                aria-hidden="true" 
              />
            </Link>
          </div>

          {/* Mobile Single-Line Centered Announcement */}
          <div className="top-bar-mobile">
            <Link 
              href="/shipping" 
              className="top-bar-link group"
              title="View nationwide delivery details"
            >
              <SAFlag />
              <span>Orders over R500 ship free</span>
              <span className="top-bar-separator" aria-hidden="true">·</span>
              <span className="text-white/85 font-normal">Nationwide</span>
              <ArrowRight 
                size={10} 
                className="top-bar-arrow text-white" 
                aria-hidden="true" 
              />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Main Nav (persistent sticky bar) */}
      <nav className="nav-bar relative">
        {/* Mobile & Tablet Dedicated Search Overlay (frosted glass sitting on top of nav) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-[80] flex items-center justify-between gap-2 bg-white/55 backdrop-blur-md px-2 lg:hidden"
            >
              <div className="flex flex-1 items-center gap-2 rounded-full border border-black bg-white/75 backdrop-blur-xl px-3.5 py-1.5 shadow-lg">
                <MagnifyingGlass size={17} className="text-black shrink-0" weight="bold" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search formulations..."
                  className="w-full bg-transparent text-xs font-medium text-black outline-none placeholder:text-neutral-500"
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-black/25 bg-white/80 backdrop-blur-xl text-black hover:text-green shadow-sm"
                aria-label="Close search"
              >
                <X size={17} weight="bold" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className="mobile-menu-button shrink-0"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={22} /> : <List size={22} />}
        </button>
        <div className="nav-links">
          <Link 
            href="/shop"
            onMouseEnter={() => handleMouseEnter('shop')}
            onClick={() => setActiveMenu(null)}
          >
            Shop
          </Link>
          <Link 
            href="/rituals"
            onMouseEnter={() => handleMouseEnter(null)}
            onClick={() => setActiveMenu(null)}
          >
            Ingredients & Rituals
          </Link>
          <Link 
            href="/about"
            onMouseEnter={() => handleMouseEnter(null)}
            onClick={() => setActiveMenu(null)}
          >
            Our Story
          </Link>
          <Link 
            href="/reseller"
            onMouseEnter={() => handleMouseEnter(null)}
            onClick={() => setActiveMenu(null)}
          >
            Resellers
          </Link>
        </div>

        {/* Centered Logo */}
        <Link href="/" className="nav-logo-container" aria-label="Divinity Cosmetics Home">
          <Image
            src="/images/divinity-logo.png"
            alt="Divinity Cosmetics"
            width={150}
            height={85}
            className="nav-logo-img"
            priority
          />
        </Link>
        
        {/* Right Utils */}
        <div className="nav-utils shrink-0">
          <div className="relative flex items-center">
            {/* Desktop Expandable Input */}
            <div className="hidden lg:flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    className="absolute right-8 h-8 px-3 text-sm bg-white border border-black rounded-full outline-none text-black placeholder:text-gray-400 font-medium"
                  />
                )}
              </AnimatePresence>
            </div>
            <button 
              className="icon-btn z-10" 
              aria-label="Search"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              {searchOpen ? <X size={20} weight="regular" /> : <MagnifyingGlass size={20} weight="regular" />}
            </button>
          </div>
          <button ref={cartBtnRef} className="icon-btn" aria-label="Cart" onClick={openCart}>
            <ShoppingCart size={20} weight="regular" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          {isSignedIn ? (
            <div className="flex items-center justify-center shrink-0">
              <UserButton />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="icon-btn" aria-label="Sign In" title="Sign In">
                <User size={20} weight="regular" />
              </button>
            </SignInButton>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-navigation"
          >
            {[
              ["/shop", "Shop"],
              ["/rituals", "Ingredients & Rituals"],
              ["/about", "Our Story"],
              ["/reseller", "Resellers"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
                <ArrowRight size={16} />
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>


      {/* Mega Menu Dropdowns */}
      <AnimatePresence>
        {activeMenu === 'shop' && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 w-full bg-[#fcfbf9] border-t border-b border-black/[0.08] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)] z-[990] overflow-hidden"
            onMouseEnter={() => handleMouseEnter('shop')}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-10 pb-7">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
                {/* Column 1: The Formulary (4 cols) */}
                <div className="md:col-span-4 lg:col-span-4 flex flex-col justify-between md:border-r md:border-black/[0.07] md:pr-8 lg:pr-10">
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-[10px] font-mono tracking-widest text-black/40 uppercase">01</span>
                      <span className="h-px w-5 bg-black/15" />
                      <span className="text-[10px] tracking-[0.24em] font-medium text-black/55 uppercase">
                        The Formulary
                      </span>
                    </div>

                    {/* Active Flagship Category: Body Care */}
                    <div data-anime="mega-item" className="group/item mb-6">
                      <Link
                        href="/products/marula-baobab-body-lotion"
                        className="block p-4 -mx-4 rounded-xl hover:bg-black/[0.03] transition-all duration-200"
                        onClick={() => setActiveMenu(null)}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-chloe text-2xl text-black group-hover/item:text-green-dark transition-colors tracking-tight">
                            Body Care
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[9.5px] font-semibold tracking-[0.16em] uppercase px-2.5 py-0.5 rounded-full bg-green/10 text-green-dark border border-green/25">
                            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                            Flagship Live
                          </span>
                        </div>
                        <p className="text-xs text-black/60 font-normal leading-relaxed">
                          Marula &amp; Baobab Botanical Emulsion (400ml)
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-green uppercase tracking-wider mt-2.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <span>View Flagship</span>
                          <ArrowRight size={12} className="group-hover/item:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </div>

                    {/* Forthcoming Lineages with quiet editorial typography */}
                    <div className="pt-4 border-t border-black/[0.06]">
                      <div className="flex items-center justify-between mb-3.5">
                        <span className="text-[9.5px] tracking-[0.2em] font-medium text-black/40 uppercase">
                          Future Formulations
                        </span>
                        <span className="text-[10px] font-mono text-black/30">Pipeline</span>
                      </div>

                      <ul className="space-y-3">
                        <li data-anime="mega-item" className="flex items-center justify-between text-sm py-1 border-b border-black/[0.03]">
                          <span className="text-black/50 font-light">Face Care</span>
                          <span className="text-[11px] font-serif italic text-black/35">In formulation</span>
                        </li>
                        <li data-anime="mega-item" className="flex items-center justify-between text-sm py-1 border-b border-black/[0.03]">
                          <span className="text-black/50 font-light">Oils &amp; Serums</span>
                          <span className="text-[11px] font-serif italic text-black/35">Late 2026</span>
                        </li>
                        <li data-anime="mega-item" className="flex items-center justify-between text-sm py-1">
                          <span className="text-black/50 font-light">Curated Bundles</span>
                          <span className="text-[11px] font-serif italic text-black/35">Seasonal release</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Catalog Link */}
                  <div className="pt-6 mt-4">
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-black hover:text-green transition-colors group/all"
                      onClick={() => setActiveMenu(null)}
                    >
                      <span>Explore All Formulations</span>
                      <ArrowRight size={13} className="group-hover/all:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Column 2: House & Rituals (4 cols) */}
                <div className="md:col-span-4 lg:col-span-4 flex flex-col justify-between md:border-r md:border-black/[0.07] md:pr-8 lg:pr-10">
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-[10px] font-mono tracking-widest text-black/40 uppercase">02</span>
                      <span className="h-px w-5 bg-black/15" />
                      <span className="text-[10px] tracking-[0.24em] font-medium text-black/55 uppercase">
                        The 90-Day Standard
                      </span>
                    </div>

                    <div className="space-y-2">
                      {/* Ritual 1 */}
                      <div data-anime="mega-item" className="group/item">
                        <Link
                          href="/rituals"
                          className="block p-3.5 -mx-3.5 rounded-xl hover:bg-black/[0.03] transition-all duration-200"
                          onClick={() => setActiveMenu(null)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-chloe text-lg text-black group-hover/item:text-green-dark transition-colors tracking-tight">
                              90-Day Barrier Repair Ritual
                            </span>
                            <ArrowRight size={14} className="text-black/30 group-hover/item:text-black group-hover/item:translate-x-1 transition-all" />
                          </div>
                          <p className="text-xs text-black/60 font-normal leading-relaxed">
                            Restoring lipid density against Highveld winters and harsh municipal water.
                          </p>
                        </Link>
                      </div>

                      {/* Ritual 2 */}
                      <div data-anime="mega-item" className="group/item">
                        <Link
                          href="/about"
                          className="block p-3.5 -mx-3.5 rounded-xl hover:bg-black/[0.03] transition-all duration-200"
                          onClick={() => setActiveMenu(null)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-chloe text-lg text-black group-hover/item:text-green-dark transition-colors tracking-tight">
                              A Note from the Founder
                            </span>
                            <ArrowRight size={14} className="text-black/30 group-hover/item:text-black group-hover/item:translate-x-1 transition-all" />
                          </div>
                          <p className="text-xs text-black/60 font-normal leading-relaxed">
                            Why investing in facial serums while settling for watery body lotion creates the vanity divide.
                          </p>
                        </Link>
                      </div>

                      {/* Ritual 3 */}
                      <div data-anime="mega-item" className="group/item">
                        <Link
                          href="/rituals"
                          className="block p-3.5 -mx-3.5 rounded-xl hover:bg-black/[0.03] transition-all duration-200"
                          onClick={() => setActiveMenu(null)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-chloe text-lg text-black group-hover/item:text-green-dark transition-colors tracking-tight">
                              South African Botanical Lineage
                            </span>
                            <ArrowRight size={14} className="text-black/30 group-hover/item:text-black group-hover/item:translate-x-1 transition-all" />
                          </div>
                          <p className="text-xs text-black/60 font-normal leading-relaxed">
                            Cold-pressed Marula from Limpopo &amp; wild-harvested Baobab seed oils.
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Editorial Quote */}
                  <div className="pt-6 mt-4 border-t border-black/[0.06]">
                    <p className="text-[11px] font-serif italic text-black/45 leading-relaxed">
                      &ldquo;Facial-grade nutrition is not a luxury for the face alone; your body demands equal biological respect.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Column 3: Featured Atelier Showcase (Keeping the image) (4 cols) */}
                <div data-anime="mega-feature" className="md:col-span-4 lg:col-span-4 flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-[10px] font-mono tracking-widest text-black/40 uppercase">03</span>
                      <span className="h-px w-5 bg-black/15" />
                      <span className="text-[10px] tracking-[0.24em] font-medium text-black/55 uppercase">
                        Flagship Plate
                      </span>
                    </div>

                    {/* Exhibition Plate Link */}
                    <Link
                      href="/products/marula-baobab-body-lotion"
                      onClick={() => setActiveMenu(null)}
                      className="group/feature block bg-white rounded-2xl border border-black/[0.08] p-4 hover:border-black/25 hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.08)] transition-all duration-300"
                    >
                      {/* Image Canvas */}
                      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#f4f2ee] mb-4">
                        <Image
                          src="/images/marula-baobab-body-lotion.jpg"
                          alt="Divinity Cosmetics Marula & Baobab Body Lotion 400ml"
                          fill
                          className="object-cover object-center group-hover/feature:scale-[1.03] transition-transform duration-700 ease-out"
                          sizes="(max-width: 1024px) 100vw, 380px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-40 group-hover/feature:opacity-20 transition-opacity" />
                        
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-black/10 text-[9px] font-bold tracking-[0.16em] uppercase text-black">
                          400ml · Flagship
                        </div>
                      </div>

                      {/* Museum Plaque Typography */}
                      <div className="flex items-baseline justify-between gap-2 mb-1.5">
                        <h4 className="font-chloe text-xl text-black font-normal tracking-tight group-hover/feature:text-green-dark transition-colors">
                          Marula &amp; Baobab Body Lotion
                        </h4>
                        <span className="text-sm font-semibold text-black tracking-tight shrink-0">
                          R400
                        </span>
                      </div>

                      <p className="text-xs text-black/60 font-normal leading-relaxed line-clamp-2 mb-4">
                        A rich, facial-grade botanical emulsion forming a physical 24-hour moisture seal.
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-black/[0.06]">
                        <span className="inline-flex items-center gap-1.5 text-green text-[11px] font-semibold tracking-wider uppercase group-hover/feature:text-green-dark transition-colors">
                          <span>Acquire Formulation</span>
                          <ArrowRight size={13} className="group-hover/feature:translate-x-1.5 transition-transform duration-300" />
                        </span>
                        <span className="text-[10px] text-black/40 font-mono tracking-widest uppercase">
                          Limpopo Batch
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Ribbon / Atelier Footnote */}
              <div className="mt-8 pt-5 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-black/50">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green" />
                  <span className="font-medium text-black/70">Divinity Cosmetics</span>
                  <span className="text-black/30">·</span>
                  <span>South African Botanical Formulary</span>
                  <span className="text-black/30 hidden md:inline">·</span>
                  <span className="hidden md:inline">Limpopo Marula &amp; Mpumalanga Baobab</span>
                </div>
                <div className="flex items-center gap-3 text-black/60">
                  <span>Complimentary delivery over R500</span>
                  <span className="text-black/30">·</span>
                  <Link
                    href="/shipping"
                    onClick={() => setActiveMenu(null)}
                    className="text-black/75 hover:text-green transition-colors underline underline-offset-2"
                  >
                    Nationwide Dispatch
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
