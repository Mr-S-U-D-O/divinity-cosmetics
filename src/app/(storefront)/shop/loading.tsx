import React from "react";

export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-[#faf9f6]/40 pt-28 pb-32 font-sans text-[#1a1a1a] animate-pulse">
      {/* Header Banner Skeleton */}
      <section className="px-6 md:px-12 lg:px-16 pt-8 pb-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black pb-6">
          <div className="space-y-3">
            <div className="h-3 w-48 bg-stone-200 rounded" />
            <div className="h-10 w-72 bg-stone-200 rounded-xl" />
            <div className="space-y-1.5 max-w-2xl">
              <div className="h-3.5 w-full bg-stone-200 rounded" />
              <div className="h-3.5 w-3/4 bg-stone-200 rounded" />
            </div>
          </div>
          <div className="h-9 w-40 bg-stone-100 rounded-full border border-black/20" />
        </div>
      </section>

      {/* Filter Bar & Controls Skeleton */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md border-y border-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-3.5 flex items-center justify-between gap-4">
          <div className="h-10 w-72 max-w-full bg-stone-100 rounded-full border border-black/20" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-28 bg-stone-100 rounded-full border border-black/20" />
            <div className="h-10 w-36 bg-stone-100 rounded-full border border-black/20" />
          </div>
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white border border-black rounded-3xl overflow-hidden shadow-xs flex flex-col"
            >
              {/* Image Skeleton */}
              <div className="aspect-square bg-stone-100 border-b border-black/10 relative" />

              {/* Product Info Skeleton */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-stone-200 rounded" />
                  <div className="h-5 w-48 bg-stone-200 rounded-md" />
                  <div className="h-3 w-full bg-stone-200 rounded" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-black/10">
                  <div className="h-6 w-20 bg-stone-200 rounded-md" />
                  <div className="h-10 w-28 bg-stone-200 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
