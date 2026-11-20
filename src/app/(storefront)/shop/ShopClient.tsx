"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  MagnifyingGlass, 
  CaretDown, 
  FunnelSimple, 
  X, 
  Check, 
  ArrowClockwise,
  SlidersHorizontal,
  Package
} from "@phosphor-icons/react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Product } from "@/lib/domain/products/types";
import { animate, stagger } from "animejs";

interface ShopClientProps {
  products: Product[];
}

export function ShopClient({ products }: ShopClientProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("featured");
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedPricePreset, setSelectedPricePreset] = useState<string | null>(null);
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  // Mobile Drawer State
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const gridTopRef = useRef<HTMLDivElement>(null);

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery, 
    selectedCategories, 
    selectedConcerns, 
    selectedIngredients, 
    selectedPricePreset, 
    minPriceInput, 
    maxPriceInput, 
    inStockOnly, 
    sortOrder
  ]);

  // Dynamic Facets Derived from Products
  const categoriesList = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      if (p.category) {
        map.set(p.category, (map.get(p.category) || 0) + 1);
      }
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  const concernsList = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      (p.concerns || []).forEach((c) => {
        if (c.trim()) {
          map.set(c.trim(), (map.get(c.trim()) || 0) + 1);
        }
      });
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  const ingredientsList = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      (p.ingredients || []).forEach((i) => {
        if (i.trim()) {
          map.set(i.trim(), (map.get(i.trim()) || 0) + 1);
        }
      });
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  const inStockCount = useMemo(() => {
    return products.filter((p) => !p.trackInventory || p.stock > 0).length;
  }, [products]);

  // Toggle helper
  const toggleItem = (item: string, current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (current.includes(item)) {
      setter(current.filter((i) => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedConcerns([]);
    setSelectedIngredients([]);
    setSelectedPricePreset(null);
    setMinPriceInput("");
    setMaxPriceInput("");
    setInStockOnly(false);
    setSearchQuery("");
    setSortOrder("featured");
    setCurrentPage(1);
  };

  // Active filters count for badges
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedConcerns.length > 0) count += selectedConcerns.length;
    if (selectedIngredients.length > 0) count += selectedIngredients.length;
    if (selectedPricePreset) count += 1;
    if (minPriceInput || maxPriceInput) count += 1;
    if (inStockOnly) count += 1;
    if (searchQuery.trim()) count += 1;
    return count;
  }, [
    selectedCategories,
    selectedConcerns,
    selectedIngredients,
    selectedPricePreset,
    minPriceInput,
    maxPriceInput,
    inStockOnly,
    searchQuery,
  ]);

  // Filter & Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.badge?.toLowerCase().includes(q) ||
          p.ingredients?.some((ing) => ing.toLowerCase().includes(q)) ||
          p.concerns?.some((c) => c.toLowerCase().includes(q))
      );
    }

    // 2. In Stock Only
    if (inStockOnly) {
      result = result.filter((p) => !p.trackInventory || p.stock > 0);
    }

    // 3. Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // 4. Skin Concerns Filter (Must match ANY selected)
    if (selectedConcerns.length > 0) {
      result = result.filter((p) =>
        p.concerns && p.concerns.some((c) => selectedConcerns.includes(c))
      );
    }

    // 5. Botanical Ingredients Filter (Must match ANY selected)
    if (selectedIngredients.length > 0) {
      result = result.filter((p) =>
        p.ingredients && p.ingredients.some((i) => selectedIngredients.includes(i))
      );
    }

    // 6. Price Preset Filter
    if (selectedPricePreset === "under-200") {
      result = result.filter((p) => p.basePrice < 200);
    } else if (selectedPricePreset === "200-500") {
      result = result.filter((p) => p.basePrice >= 200 && p.basePrice <= 500);
    } else if (selectedPricePreset === "500-plus") {
      result = result.filter((p) => p.basePrice > 500);
    }

    // 7. Custom Min/Max Price Filter
    const parsedMin = minPriceInput ? parseFloat(minPriceInput) : null;
    const parsedMax = maxPriceInput ? parseFloat(maxPriceInput) : null;
    if (parsedMin !== null && !isNaN(parsedMin)) {
      result = result.filter((p) => p.basePrice >= parsedMin);
    }
    if (parsedMax !== null && !isNaN(parsedMax)) {
      result = result.filter((p) => p.basePrice <= parsedMax);
    }

    // 8. Sorting
    if (sortOrder === "price-low") {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortOrder === "price-high") {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortOrder === "alpha") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "newest") {
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else {
      // "featured": prioritize isFeatured, then sortOrder
      result.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (a.sortOrder || 0) - (b.sortOrder || 0);
      });
    }

    return result;
  }, [
    products,
    searchQuery,
    inStockOnly,
    selectedCategories,
    selectedConcerns,
    selectedIngredients,
    selectedPricePreset,
    minPriceInput,
    maxPriceInput,
    sortOrder,
  ]);

  // Pagination calculation
  const totalItems = filteredAndSortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (!gridTopRef.current) return;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const cards = gridTopRef.current.querySelectorAll(".anime-product-card");
    if (cards.length === 0) return;

    const anim = animate(cards, {
      opacity: [0.85, 1],
      translateY: [6, 0],
      delay: stagger(35),
      duration: 380,
      ease: "outQuart",
    });

    return () => {
      anim.revert();
    };
  }, [paginatedProducts]);

  return (
    <main className="min-h-screen bg-[#faf9f6]/40 pt-28 pb-32 font-sans text-[#1a1a1a]">
      {/* Header Banner */}
      <section className="px-6 md:px-12 lg:px-16 pt-8 pb-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black pb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-normal text-black">
              Shop Formulations
            </h1>
            <p className="text-xs md:text-sm text-black mt-2 max-w-2xl font-sans leading-relaxed">
              Launching with our signature <strong>400ml Marula &amp; Baobab Body Lotion (R400)</strong>—formulated with high-concentration, cold-pressed South African botanical oils to physically seal your moisture barrier for 24 hours and rebuild thinning, crepey skin over a 90-day cycle.
            </p>
          </div>
          <div className="text-xs text-gray-500 font-medium">
            Showing <strong className="text-black font-semibold">{totalItems}</strong> active flagship {products.length === 1 ? "formulation" : "formulations"}
          </div>
        </div>
      </section>

      {/* Top Pills Section (Dynamic categories from admin products) */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 mb-8 max-w-[1400px] mx-auto">
        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-none py-1.5">
          <button
            onClick={() => setSelectedCategories([])}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full whitespace-nowrap text-xs font-bold tracking-wide transition-all shrink-0 ${
              selectedCategories.length === 0
                ? "bg-[#1a1a1a] text-white border-2 border-black shadow-xs"
                : "bg-white text-gray-800 border-2 border-black hover:border-green hover:text-green hover:bg-green/5"
            }`}
          >
            All Formulations ({products.length})
          </button>
          {categoriesList.map((cat) => {
            const isSelected = selectedCategories.includes(cat.name);
            return (
              <button
                key={cat.name}
                onClick={() => toggleItem(cat.name, selectedCategories, setSelectedCategories)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full whitespace-nowrap text-xs font-bold tracking-wide transition-all shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#1a1a1a] text-white border-2 border-black shadow-xs"
                    : "bg-white text-gray-800 border-2 border-black hover:border-green hover:text-green hover:bg-green/5"
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section ref={gridTopRef} className="px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden flex items-center justify-between gap-3 w-full">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-black py-3 rounded-full text-xs font-bold tracking-wider shadow-sm hover:border-green hover:text-green hover:bg-green/5 transition-colors"
          >
            <FunnelSimple size={18} weight="bold" />
            <span>FILTER & REFINE</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-green text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-200 border border-transparent hover:border-black transition-all"
            >
              Reset
            </button>
          )}
        </div>

        {/* Sidebar Filters Desktop */}
        <aside
          className={`w-full lg:w-72 flex-shrink-0 bg-white rounded-3xl p-6 border border-black shadow-sm h-fit lg:sticky lg:top-24 hidden lg:block`}
        >
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-black">
            <div className="flex items-center gap-2 text-black">
              <SlidersHorizontal size={18} weight="bold" />
              <h2 className="text-xs font-bold tracking-widest uppercase">Refine Catalog</h2>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <ArrowClockwise size={12} weight="bold" />
                Reset ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* In-Stock Toggle */}
          <div className="mb-6 p-3.5 bg-gray-50/70 rounded-2xl border border-black flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-900">In Stock Only</div>
              <div className="text-[11px] text-gray-500">{inStockCount} available</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={inStockOnly}
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                inStockOnly ? "bg-green" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  inStockOnly ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Categories Filter */}
          {categoriesList.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[11px] font-bold tracking-widest uppercase text-gray-900 mb-3">
                Categories
              </h3>
              <div className="space-y-2.5">
                {categoriesList.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.name);
                  return (
                    <label
                      key={cat.name}
                      onClick={() => toggleItem(cat.name, selectedCategories, setSelectedCategories)}
                      className="flex items-center justify-between group cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-black border-black text-white"
                              : "border-black group-hover:border-green"
                          }`}
                        >
                          {isChecked && <Check size={11} weight="bold" />}
                        </div>
                        <span className="text-[13px] text-gray-700 group-hover:text-black font-medium">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">({cat.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Skin & Body Concerns */}
          {concernsList.length > 0 && (
            <div className="mb-6 border-t border-black pt-5">
              <h3 className="text-[11px] font-bold tracking-widest uppercase text-gray-900 mb-3">
                Skin & Body Concern
              </h3>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {concernsList.map((concern) => {
                  const isChecked = selectedConcerns.includes(concern.name);
                  return (
                    <label
                      key={concern.name}
                      onClick={() => toggleItem(concern.name, selectedConcerns, setSelectedConcerns)}
                      className="flex items-center justify-between group cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-black border-black text-white"
                              : "border-black group-hover:border-green"
                          }`}
                        >
                          {isChecked && <Check size={11} weight="bold" />}
                        </div>
                        <span className="text-[13px] text-gray-700 group-hover:text-black">
                          {concern.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">({concern.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botanical Ingredients */}
          {ingredientsList.length > 0 && (
            <div className="mb-6 border-t border-black pt-5">
              <h3 className="text-[11px] font-bold tracking-widest uppercase text-gray-900 mb-3">
                Botanical Ingredients
              </h3>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {ingredientsList.map((ing) => {
                  const isChecked = selectedIngredients.includes(ing.name);
                  return (
                    <label
                      key={ing.name}
                      onClick={() => toggleItem(ing.name, selectedIngredients, setSelectedIngredients)}
                      className="flex items-center justify-between group cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-black border-black text-white"
                              : "border-black group-hover:border-green"
                          }`}
                        >
                          {isChecked && <Check size={11} weight="bold" />}
                        </div>
                        <span className="text-[13px] text-gray-700 group-hover:text-black">
                          {ing.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">({ing.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div className="border-t border-black pt-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[11px] font-bold tracking-widest uppercase text-gray-900">
                Price (ZAR)
              </h3>
              {(selectedPricePreset || minPriceInput || maxPriceInput) && (
                <button
                  onClick={() => {
                    setSelectedPricePreset(null);
                    setMinPriceInput("");
                    setMaxPriceInput("");
                  }}
                  className="text-[10px] text-gray-500 hover:text-green font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedPricePreset(selectedPricePreset === "under-200" ? null : "under-200");
                  setMinPriceInput("");
                  setMaxPriceInput("");
                }}
                className={`py-1.5 text-[11px] font-bold rounded-lg border transition-colors ${
                  selectedPricePreset === "under-200"
                    ? "bg-[#1a1a1a] text-white border-black"
                    : "bg-white text-gray-600 border-black hover:border-green hover:text-green"
                }`}
              >
                &lt; R200
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPricePreset(selectedPricePreset === "200-500" ? null : "200-500");
                  setMinPriceInput("");
                  setMaxPriceInput("");
                }}
                className={`py-1.5 text-[11px] font-bold rounded-lg border transition-colors ${
                  selectedPricePreset === "200-500"
                    ? "bg-[#1a1a1a] text-white border-black"
                    : "bg-white text-gray-600 border-black hover:border-green hover:text-green"
                }`}
              >
                R200-500
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPricePreset(selectedPricePreset === "500-plus" ? null : "500-plus");
                  setMinPriceInput("");
                  setMaxPriceInput("");
                }}
                className={`py-1.5 text-[11px] font-bold rounded-lg border transition-colors ${
                  selectedPricePreset === "500-plus"
                    ? "bg-[#1a1a1a] text-white border-black"
                    : "bg-white text-gray-600 border-black hover:border-green hover:text-green"
                }`}
              >
                R500+
              </button>
            </div>

            {/* Custom Min / Max inputs */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">R</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => {
                    setSelectedPricePreset(null);
                    setMinPriceInput(e.target.value);
                  }}
                  className="w-full pl-6 pr-2 py-1.5 text-xs rounded-lg border border-black bg-white focus:outline-none focus:border-green"
                />
              </div>
              <span className="text-gray-400 text-xs">-</span>
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">R</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => {
                    setSelectedPricePreset(null);
                    setMaxPriceInput(e.target.value);
                  }}
                  className="w-full pl-6 pr-2 py-1.5 text-xs rounded-lg border border-black bg-white focus:outline-none focus:border-green"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer / Modal */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            {/* Drawer */}
            <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto z-10 border-l border-black">
              <div className="flex items-center justify-between pb-4 border-b border-black mb-6">
                <div className="flex items-center gap-2 font-bold text-black text-sm">
                  <SlidersHorizontal size={18} weight="bold" />
                  <span>Filters</span>
                </div>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1.5 rounded-full text-black border border-transparent hover:border-green hover:bg-green/10 hover:text-green transition-colors"
                  aria-label="Close filters"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              {/* Mobile In Stock */}
              <div className="mb-6 p-3 bg-gray-50 rounded-xl border border-black flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900">In Stock Only</div>
                  <div className="text-[11px] text-gray-500">{inStockCount} items</div>
                </div>
                <button
                  type="button"
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    inStockOnly ? "bg-green" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      inStockOnly ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Mobile Categories */}
              {categoriesList.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-[11px] font-bold tracking-widest uppercase text-gray-900 mb-3">
                    Categories
                  </h4>
                  <div className="space-y-2">
                    {categoriesList.map((cat) => {
                      const isChecked = selectedCategories.includes(cat.name);
                      return (
                        <label
                          key={cat.name}
                          onClick={() => toggleItem(cat.name, selectedCategories, setSelectedCategories)}
                          className="flex items-center justify-between py-1 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                isChecked ? "bg-black border-black text-white" : "border-black"
                              }`}
                            >
                              {isChecked && <Check size={11} weight="bold" />}
                            </div>
                            <span className="text-xs text-gray-800">{cat.name}</span>
                          </div>
                          <span className="text-xs text-gray-400">({cat.count})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mobile Concerns */}
              {concernsList.length > 0 && (
                <div className="mb-6 border-t border-black pt-4">
                  <h4 className="text-[11px] font-bold tracking-widest uppercase text-gray-900 mb-3">
                    Concerns
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {concernsList.map((concern) => {
                      const isChecked = selectedConcerns.includes(concern.name);
                      return (
                        <label
                          key={concern.name}
                          onClick={() => toggleItem(concern.name, selectedConcerns, setSelectedConcerns)}
                          className="flex items-center justify-between py-1 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                isChecked ? "bg-black border-black text-white" : "border-black"
                              }`}
                            >
                              {isChecked && <Check size={11} weight="bold" />}
                            </div>
                            <span className="text-xs text-gray-800">{concern.name}</span>
                          </div>
                          <span className="text-xs text-gray-400">({concern.count})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mobile Drawer Actions */}
              <div className="mt-auto pt-6 border-t border-black flex gap-3">
                <button
                  onClick={handleResetFilters}
                  className="btn-secondary-sm flex-1 justify-center"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="btn-primary-sm flex-1 justify-center"
                >
                  Apply ({totalItems})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Content Area */}
        <div className="flex-1">
          {/* Controls Bar: Search & Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6 bg-white p-4 rounded-2xl border-2 border-black">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <MagnifyingGlass size={16} weight="bold" />
              </div>
              <input
                type="text"
                placeholder="Search formulations, ingredients, concerns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-black bg-gray-50/50 text-xs font-medium focus:outline-none focus:border-green focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green transition-colors"
                  aria-label="Clear search"
                >
                  <X size={14} weight="bold" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Sort:</span>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="pl-3.5 pr-8 py-2.5 rounded-xl border border-black bg-gray-50/50 text-xs font-bold text-gray-800 focus:outline-none focus:border-green cursor-pointer appearance-none transition-colors"
                >
                  <option value="featured">Featured Botanicals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Additions</option>
                  <option value="alpha">Alphabetical (A - Z)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                  <CaretDown size={12} weight="bold" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mr-1">
                Active:
              </span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-800 font-medium">
                  Query: &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery("")} className="hover:text-red-600">
                    <X size={12} weight="bold" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs text-black border border-black font-medium">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)} className="hover:text-red-600">
                    <X size={12} weight="bold" />
                  </button>
                </span>
              )}
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-xs text-stone-800 font-medium"
                >
                  {cat}
                  <button
                    onClick={() => toggleItem(cat, selectedCategories, setSelectedCategories)}
                    className="hover:text-red-600"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </span>
              ))}
              {selectedConcerns.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs text-black border border-black font-medium"
                >
                  {c}
                  <button
                    onClick={() => toggleItem(c, selectedConcerns, setSelectedConcerns)}
                    className="hover:text-red-600"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </span>
              ))}
              {selectedIngredients.map((i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs text-black border border-black font-medium"
                >
                  {i}
                  <button
                    onClick={() => toggleItem(i, selectedIngredients, setSelectedIngredients)}
                    className="hover:text-red-600"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </span>
              ))}
              {selectedPricePreset && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-800 font-medium">
                  Price: {selectedPricePreset === "under-200" ? "< R200" : selectedPricePreset === "200-500" ? "R200 - R500" : "R500+"}
                  <button onClick={() => setSelectedPricePreset(null)} className="hover:text-red-600">
                    <X size={12} weight="bold" />
                  </button>
                </span>
              )}
              {(minPriceInput || maxPriceInput) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-800 font-medium">
                  Price: R{minPriceInput || "0"} - R{maxPriceInput || "∞"}
                  <button
                    onClick={() => {
                      setMinPriceInput("");
                      setMaxPriceInput("");
                    }}
                    className="hover:text-red-600"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-gray-400 hover:text-black underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid */}
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Working Pagination Bar */}
              <div className="mt-12 flex flex-col sm:flex-row justify-between items-center text-xs text-black/75 border-t border-black pt-6 gap-4 font-medium">
                <span>
                  Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} botanical {totalItems === 1 ? "creation" : "creations"}
                </span>
                
                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5" role="navigation" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-black hover:border-green hover:text-green disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous page"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      const isActive = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                            isActive
                              ? "bg-[#1a1a1a] text-white border border-black"
                              : "border border-black bg-white text-black hover:border-green hover:text-green"
                          }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-black hover:border-green hover:text-green disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next page"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-28 px-4 bg-white border-2 border-black rounded-3xl">
              <div className="size-14 bg-[#faf8f5] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black text-black">
                <Package size={26} weight="regular" />
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2 text-black">
                No formulations found
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto text-xs leading-relaxed mb-6">
                We couldn&apos;t find any products matching your specific combination of filters. Try broadening your criteria or reset filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="btn-primary"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
