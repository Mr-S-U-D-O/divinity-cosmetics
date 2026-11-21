"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

          {/* Desktop Right: Nationwide Courier Delivery */}
          <div className="top-bar-right">
            <Link 
              href="/shipping" 
              className="top-bar-link top-bar-pill group"
              title="View nationwide delivery details"
            >
              <span>Nationwide delivery via The Courier Guy</span>
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
              <span>The Courier Guy</span>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchTerm.trim()) {
                      setSearchOpen(false);
                      router.push(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
                    }
                  }}
                  aria-label="Search formulations"
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchTerm.trim()) {
                        setSearchOpen(false);
                        router.push(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
                      }
                    }}
                    aria-label="Search formulations"
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


      {/* Mega Menu Dropdowns (Desktop Only) */}
      <AnimatePresence>
        {activeMenu === 'shop' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 w-full bg-[#fcfbf9] border-t border-b border-black shadow-[0_28px_56px_-16px_rgba(0,0,0,0.06)] z-[990] overflow-hidden hidden lg:block"
            onMouseEnter={() => handleMouseEnter('shop')}
          >
            <div className="max-w-7xl mx-auto px-10 xl:px-14 pt-11 pb-8">
              <div className="grid grid-cols-12 gap-10 xl:gap-14">
                {/* Column 1: The Formulations (3 cols) */}
                <div data-anime="mega-item" className="col-span-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] tracking-[0.24em] font-bold text-green uppercase block mb-6">
                      The Formulations
                    </span>

                    <ul className="space-y-4">
                      <li>
                        <Link
                          href="/shop"
                          onClick={() => setActiveMenu(null)}
                          className="group/link flex items-center justify-between text-[15px] font-medium text-black hover:text-green-dark transition-colors"
                        >
                          <span>All Formulations</span>
                          <ArrowRight size={13} className="text-black group-hover/link:text-green-dark group-hover/link:translate-x-1 transition-all" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/products/marula-baobab-body-lotion"
                          onClick={() => setActiveMenu(null)}
                          className="group/link flex items-center justify-between text-[15px] font-medium text-black hover:text-green-dark transition-colors"
                        >
                          <span>Body Care</span>
                          <ArrowRight size={13} className="text-black group-hover/link:text-green-dark group-hover/link:translate-x-1 transition-all" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/rituals"
                          onClick={() => setActiveMenu(null)}
                          className="group/link flex items-center justify-between text-[15px] font-medium text-black hover:text-green-dark transition-colors"
                        >
                          <span>Daily Regimens</span>
                          <ArrowRight size={13} className="text-black group-hover/link:text-green-dark group-hover/link:translate-x-1 transition-all" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/reseller"
                          onClick={() => setActiveMenu(null)}
                          className="group/link flex items-center justify-between text-[15px] font-medium text-black hover:text-green-dark transition-colors"
                        >
                          <span>Reseller Stockists</span>
                          <ArrowRight size={13} className="text-black group-hover/link:text-green-dark group-hover/link:translate-x-1 transition-all" />
                        </Link>
                      </li>
                    </ul>

                    {/* Curated By Need */}
                    <div className="mt-8 pt-6 border-t border-black">
                      <span className="text-[10px] tracking-[0.24em] font-bold text-green uppercase block mb-3.5">
                        Curated by Need
                      </span>
                      <ul className="space-y-2.5">
                        <li>
                          <Link
                            href="/shop"
                            onClick={() => setActiveMenu(null)}
                            className="text-xs text-black/75 hover:text-black transition-colors block py-0.5"
                          >
                            Barrier Repair &amp; Dryness
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/shop"
                            onClick={() => setActiveMenu(null)}
                            className="text-xs text-black/75 hover:text-black transition-colors block py-0.5"
                          >
                            Highveld Winter Hydration
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/shop"
                            onClick={() => setActiveMenu(null)}
                            className="text-xs text-black/75 hover:text-black transition-colors block py-0.5"
                          >
                            Cold-Pressed Seed Oils
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Column 2: House & Rituals (4 cols) */}
                <div data-anime="mega-item" className="col-span-4 flex flex-col justify-between border-l border-black pl-10 xl:pl-14">
                  <div>
                    <span className="text-[10px] tracking-[0.24em] font-bold text-green uppercase block mb-6">
                      The House &amp; Rituals
                    </span>

                    <div className="space-y-6">
                      <Link
                        href="/rituals"
                        onClick={() => setActiveMenu(null)}
                        className="group/ritual block"
                      >
                        <p className="font-chloe text-xl text-black group-hover/ritual:text-green-dark transition-colors mb-1.5 flex items-center justify-between">
                          <span>90-Day Barrier Repair</span>
                          <ArrowRight size={14} className="text-black group-hover/ritual:text-green-dark group-hover/ritual:translate-x-1 transition-all" />
                        </p>
                        <p className="text-xs text-black/75 leading-relaxed font-normal">
                          Restoring lipid density against dry Highveld winds and hard municipal tap water.
                        </p>
                      </Link>

                      <Link
                        href="/about"
                        onClick={() => setActiveMenu(null)}
                        className="group/ritual block pt-5 border-t border-black"
                      >
                        <p className="font-chloe text-xl text-black group-hover/ritual:text-green-dark transition-colors mb-1.5 flex items-center justify-between">
                          <span>South African Lineage</span>
                          <ArrowRight size={14} className="text-black group-hover/ritual:text-green-dark group-hover/ritual:translate-x-1 transition-all" />
                        </p>
                        <p className="text-xs text-black/75 leading-relaxed font-normal">
                          Cold-pressed Limpopo Marula and wild-harvested Mpumalanga Baobab seed oils.
                        </p>
                      </Link>

                      <Link
                        href="/about"
                        onClick={() => setActiveMenu(null)}
                        className="group/ritual block pt-5 border-t border-black"
                      >
                        <p className="font-chloe text-xl text-black group-hover/ritual:text-green-dark transition-colors mb-1.5 flex items-center justify-between">
                          <span>The Facial-Grade Thesis</span>
                          <ArrowRight size={14} className="text-black group-hover/ritual:text-green-dark group-hover/ritual:translate-x-1 transition-all" />
                        </p>
                        <p className="text-xs text-black/75 leading-relaxed font-normal">
                          Extending the biological standards of facial serums to full-body care.
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Column 3: The Featured Flagship Still Life (5 cols) */}
                <div data-anime="mega-feature" className="col-span-5 border-l border-black pl-10 xl:pl-14">
                  <span className="text-[10px] tracking-[0.24em] font-bold text-green uppercase block mb-6">
                    Featured Formulation
                  </span>

                  <Link
                    href="/products/marula-baobab-body-lotion"
                    onClick={() => setActiveMenu(null)}
                    className="group/flagship flex flex-row items-center gap-6 bg-[#faf8f5] hover:bg-white rounded-2xl p-5 border-2 border-black transition-all duration-300"
                  >
                    {/* Bottle Visual with Calm Breathing Room */}
                    <div className="relative w-36 h-44 xl:w-40 xl:h-48 rounded-xl overflow-hidden bg-white border-2 border-black shrink-0">
                      <Image
                        src="/images/mega-menu-lotion.jpg"
                        alt="Divinity Cosmetics Marula & Baobab Body Lotion 400ml"
                        fill
                        className="object-cover object-center group-hover/flagship:scale-[1.03] transition-transform duration-700 ease-out"
                        sizes="(max-width: 1280px) 160px, 180px"
                      />
                    </div>

                    {/* Editorial Details */}
                    <div className="flex-1 min-w-0 pr-2">
                      <span className="inline-block text-[9.5px] font-bold tracking-[0.18em] uppercase text-green mb-1.5">
                        Botanical Flagship
                      </span>
                      <p className="font-chloe text-xl xl:text-2xl text-black font-normal leading-snug tracking-tight mb-1 group-hover/flagship:text-green-dark transition-colors">
                        Marula &amp; Baobab Body Lotion
                      </p>
                      <p className="text-xs font-semibold text-black tracking-tight mb-2.5">
                        400ml · R400
                      </p>
                      <p className="text-xs text-black/75 font-normal leading-relaxed mb-4 line-clamp-2">
                        Facial-grade cold-pressed emulsion delivering a physical 24-hour lipid barrier seal.
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-black group-hover/flagship:text-green-dark uppercase tracking-wider transition-colors">
                        <span>Discover Formulation</span>
                        <ArrowRight size={12} className="group-hover/flagship:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Bottom Assurance Bar */}
              <div className="mt-8 pt-5 border-t border-black flex items-center justify-between text-[11px] text-black/75">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-black">Divinity Cosmetics</span>
                  <span>·</span>
                  <span>Limpopo Marula &amp; Mpumalanga Baobab</span>
                  <span>·</span>
                  <span>Cruelty-Free Botanical Formulation</span>
                </div>
                <div className="flex items-center gap-2 text-black">
                  <span>Live courier rates at checkout</span>
                  <span>·</span>
                  <Link
                    href="/shipping"
                    onClick={() => setActiveMenu(null)}
                    className="text-black hover:text-green-dark transition-colors underline underline-offset-4"
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
