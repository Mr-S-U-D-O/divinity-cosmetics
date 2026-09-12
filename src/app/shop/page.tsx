"use client";

import React, { useState, useMemo } from "react";
import { MagnifyingGlass, CaretDown, FunnelSimple } from "@phosphor-icons/react";
import { mockProducts } from "@/lib/domain/products/mock-data";
import { ProductCard } from "@/components/ui/ProductCard";

const CATEGORIES = ["Body Care", "Face Care", "Oils & Serums", "Bundles"];
const CONCERNS = ["Deep Hydration", "Barrier Repair", "Soothing & Sensitive", "Glow & Radiance"];
const INGREDIENTS = ["Cold-Pressed Marula", "Wild Baobab Oil", "Cape Chamomile", "Neroli & Frankincense"];

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("featured");
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleCheckbox = (value: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (state.includes(value)) {
      setState(state.filter(item => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedConcerns([]);
    setSelectedIngredients([]);
    setSelectedPrice(null);
    setSearchQuery("");
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...mockProducts];

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    // Filter by Categories
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Filter by Concerns (must match ANY of the selected concerns)
    if (selectedConcerns.length > 0) {
      result = result.filter(p => p.concerns && p.concerns.some(c => selectedConcerns.includes(c)));
    }

    // Filter by Ingredients (must match ANY of the selected ingredients)
    if (selectedIngredients.length > 0) {
      result = result.filter(p => p.ingredients && p.ingredients.some(i => selectedIngredients.includes(i)));
    }

    // Filter by Price
    if (selectedPrice === 'under-200') {
      result = result.filter(p => p.basePrice < 200);
    } else if (selectedPrice === '200-500') {
      result = result.filter(p => p.basePrice >= 200 && p.basePrice <= 500);
    } else if (selectedPrice === '500-plus') {
      result = result.filter(p => p.basePrice > 500);
    }

    // Sort
    if (sortOrder === "price-low") {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortOrder === "price-high") {
      result.sort((a, b) => b.basePrice - a.basePrice);
    }

    return result;
  }, [searchQuery, selectedCategories, selectedConcerns, selectedIngredients, selectedPrice, sortOrder]);

  const topCategories = ["ALL FORMULATIONS", "BODY CARE", "FACE CARE", "OILS & SERUMS", "BUNDLES"];

  return (
    <main className="min-h-screen bg-[#fafafa] pt-32 pb-32 font-sans text-[#1a1a1a]">
      
      {/* Top Pills Section (Matches Mockup) */}
      <section className="px-6 md:px-12 lg:px-16 mb-8 border-b border-gray-200 pb-4">
        <div className="max-w-[1400px] mx-auto flex gap-3 overflow-x-auto scrollbar-hide">
          {topCategories.map((cat, idx) => {
            const isActive = idx === 0 ? selectedCategories.length === 0 : selectedCategories.includes(CATEGORIES[idx - 1]);
            const handleTopPill = () => {
              if (idx === 0) {
                setSelectedCategories([]);
              } else {
                handleCheckbox(CATEGORIES[idx - 1], selectedCategories, setSelectedCategories);
              }
            };
            return (
              <button
                key={cat}
                onClick={handleTopPill}
                className={`px-5 py-2.5 rounded-full whitespace-nowrap text-[10px] font-bold tracking-widest transition-colors ${
                  isActive 
                    ? "bg-[#3d7b32] text-white" 
                    : "bg-white text-gray-500 border border-gray-200 hover:border-[#3d7b32] hover:text-[#3d7b32]"
                }`}
              >
                {cat} {idx !== 0 && `(${mockProducts.filter(p => p.category === CATEGORIES[idx - 1]).length})`}
              </button>
            )
          })}
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-10">
        
        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="lg:hidden w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-full text-sm font-bold tracking-wider"
        >
          <FunnelSimple size={18} />
          {isMobileFiltersOpen ? "HIDE FILTERS" : "SHOW FILTERS"}
        </button>

        {/* Sidebar Filters */}
        <aside className={`w-full lg:w-72 flex-shrink-0 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'} h-fit lg:sticky lg:top-24`}>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 text-[#3d7b32]">
              <FunnelSimple size={18} weight="bold" />
              <h2 className="text-xs font-bold tracking-widest uppercase">Refine Catalog</h2>
            </div>
            <button onClick={handleReset} className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase">Reset</button>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-[11px] font-bold tracking-widest uppercase text-gray-800 mb-4">Categories</h3>
            <div className="space-y-3">
              {CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-[#3d7b32] border-[#3d7b32]' : 'border-gray-300 group-hover:border-[#3d7b32]'}`}>
                      {selectedCategories.includes(cat) && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-[13px] text-gray-600 group-hover:text-black">{cat}</span>
                  </div>
                  <span className="text-xs text-gray-400">{mockProducts.filter(p => p.category === cat).length}</span>
                  <input type="checkbox" className="hidden" checked={selectedCategories.includes(cat)} onChange={() => handleCheckbox(cat, selectedCategories, setSelectedCategories)} />
                </label>
              ))}
            </div>
          </div>

          {/* Skin & Body Concern */}
          <div className="mb-8">
            <h3 className="text-[11px] font-bold tracking-widest uppercase text-gray-800 mb-4">Skin & Body Concern</h3>
            <div className="space-y-3">
              {CONCERNS.map(concern => (
                <label key={concern} className="flex items-center gap-3 group cursor-pointer">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedConcerns.includes(concern) ? 'bg-[#3d7b32] border-[#3d7b32]' : 'border-gray-300 group-hover:border-[#3d7b32]'}`}>
                    {selectedConcerns.includes(concern) && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-[13px] text-gray-600 group-hover:text-black">{concern}</span>
                  <input type="checkbox" className="hidden" checked={selectedConcerns.includes(concern)} onChange={() => handleCheckbox(concern, selectedConcerns, setSelectedConcerns)} />
                </label>
              ))}
            </div>
          </div>

          {/* Botanical Ingredients */}
          <div className="mb-8">
            <h3 className="text-[11px] font-bold tracking-widest uppercase text-gray-800 mb-4">Botanical Ingredients</h3>
            <div className="space-y-3">
              {INGREDIENTS.map(ing => (
                <label key={ing} className="flex items-center gap-3 group cursor-pointer">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedIngredients.includes(ing) ? 'bg-[#3d7b32] border-[#3d7b32]' : 'border-gray-300 group-hover:border-[#3d7b32]'}`}>
                    {selectedIngredients.includes(ing) && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-[13px] text-gray-600 group-hover:text-black">{ing}</span>
                  <input type="checkbox" className="hidden" checked={selectedIngredients.includes(ing)} onChange={() => handleCheckbox(ing, selectedIngredients, setSelectedIngredients)} />
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-[11px] font-bold tracking-widest uppercase text-gray-800 mb-4 flex justify-between">
              <span>Price Range</span>
              <span className="text-gray-400 font-normal tracking-normal text-[10px]">ZAR - RAND</span>
            </h3>
            {/* Fake Slider visual */}
            <div className="h-1.5 w-full bg-[#3d7b32] rounded-full mb-6 relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-[20%] w-3 h-3 bg-white border-2 border-[#3d7b32] rounded-full"></div>
              <div className="absolute top-1/2 -translate-y-1/2 right-[20%] w-3 h-3 bg-white border-2 border-[#3d7b32] rounded-full"></div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedPrice(selectedPrice === 'under-200' ? null : 'under-200')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-full border transition-colors ${selectedPrice === 'under-200' ? 'bg-[#3d7b32] text-white border-[#3d7b32]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#3d7b32]'}`}
              >
                Under R200
              </button>
              <button 
                onClick={() => setSelectedPrice(selectedPrice === '200-500' ? null : '200-500')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-full border transition-colors ${selectedPrice === '200-500' ? 'bg-[#3d7b32] text-white border-[#3d7b32]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#3d7b32]'}`}
              >
                R200 - R500
              </button>
              <button 
                onClick={() => setSelectedPrice(selectedPrice === '500-plus' ? null : '500-plus')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-full border transition-colors ${selectedPrice === '500-plus' ? 'bg-[#3d7b32] text-white border-[#3d7b32]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#3d7b32]'}`}
              >
                R500+
              </button>
            </div>
          </div>

        </aside>

        {/* Right Content Area */}
        <div className="flex-1">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlass size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search formulations, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 bg-white text-[13px] focus:outline-none focus:border-black shadow-sm"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 whitespace-nowrap">Sort By:</span>
              <div className="relative w-full sm:w-auto">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full sm:w-auto pl-4 pr-10 py-2.5 rounded-full border border-gray-200 bg-white text-[11px] font-bold focus:outline-none focus:border-black shadow-sm appearance-none cursor-pointer tracking-wide"
                >
                  <option value="featured">Featured Botanicals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <CaretDown size={12} weight="bold" />
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredAndSortedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="mt-16 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 border-t border-gray-200 pt-8 gap-4 font-medium">
                <span>Showing 1 - {filteredAndSortedProducts.length} of {mockProducts.length} botanical creations</span>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-300 cursor-not-allowed">&lt;</button>
                  <button className="w-8 h-8 rounded-full bg-[#3d7b32] text-white flex items-center justify-center font-bold">1</button>
                  <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-black hover:text-black transition-colors">2</button>
                  <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-black hover:text-black transition-colors">3</button>
                  <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-black hover:text-black transition-colors">&gt;</button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-32 bg-white border border-gray-100 rounded-3xl shadow-sm">
              <h3 className="text-xl font-bold tracking-tight mb-3">No formulations found.</h3>
              <p className="text-gray-500 max-w-sm mx-auto text-sm mb-6">
                We couldn't find any products matching your current filters. Try adjusting your criteria.
              </p>
              <button 
                onClick={handleReset}
                className="px-6 py-2.5 bg-black text-white rounded-full font-bold uppercase tracking-wider text-[10px] hover:bg-[#3d7b32] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

      </section>
    </main>
  );
}
