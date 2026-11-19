import React from "react";

export default function CheckoutLoading() {
  return (
    <main
      style={{ paddingTop: "220px" }}
      className="min-h-screen bg-[#faf9f6]/40 text-black pb-28 px-6 md:px-12 lg:px-24 font-sans animate-pulse"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-6">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-stone-200 rounded-md" />
            <div className="h-9 w-64 bg-stone-200 rounded-xl" />
          </div>
          <div className="h-8 w-44 bg-stone-100 border-2 border-black rounded-full" />
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Cards Skeleton (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact Details Card */}
            <div className="bg-white border-2 border-black p-6 md:p-8 rounded-3xl shadow-xs space-y-4">
              <div className="border-b-2 border-black pb-3">
                <div className="h-5 w-40 bg-stone-200 rounded-md" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <div className="h-3 w-20 bg-stone-200 rounded" />
                  <div className="h-10 w-full bg-stone-100 rounded-xl border border-black/10" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-20 bg-stone-200 rounded" />
                  <div className="h-10 w-full bg-stone-100 rounded-xl border border-black/10" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-stone-200 rounded" />
                  <div className="h-10 w-full bg-stone-100 rounded-xl border border-black/10" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-28 bg-stone-200 rounded" />
                  <div className="h-10 w-full bg-stone-100 rounded-xl border border-black/10" />
                </div>
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="bg-white border-2 border-black p-6 md:p-8 rounded-3xl shadow-xs space-y-5">
              <div className="border-b-2 border-black pb-3">
                <div className="h-5 w-48 bg-stone-200 rounded-md" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <div className="h-3 w-28 bg-stone-200 rounded" />
                  <div className="h-10 w-full bg-stone-50 rounded-xl border border-black/20" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-stone-200 rounded" />
                  <div className="h-10 w-full bg-stone-50 rounded-xl border border-black/20" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-28 bg-stone-200 rounded" />
                  <div className="h-10 w-full bg-stone-50 rounded-xl border border-black/20" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-20 bg-stone-200 rounded" />
                  <div className="h-10 w-full bg-stone-50 rounded-xl border border-black/20" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-stone-200 rounded" />
                  <div className="h-10 w-full bg-stone-50 rounded-xl border border-black/20" />
                </div>
              </div>

              {/* The Courier Guy Rate Skeleton */}
              <div className="mt-5 pt-5 border-t-2 border-black space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 w-44 bg-stone-200 rounded-md" />
                  <div className="h-3 w-28 bg-stone-200 rounded-md" />
                </div>
                <div className="bg-[#FAF8F5] border-2 border-black p-4 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-200 shrink-0" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-40 bg-stone-200 rounded-md" />
                        <div className="h-3 w-56 bg-stone-200 rounded-md" />
                      </div>
                    </div>
                    <div className="h-4 w-16 bg-stone-200 rounded-md" />
                  </div>
                  <div className="pt-2 border-t-2 border-black/10 flex items-center justify-center gap-2">
                    <div className="h-3 w-16 bg-stone-200 rounded-md" />
                    <div className="h-4 w-20 bg-stone-200 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Skeleton (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white border-2 border-black p-6 md:p-8 rounded-3xl shadow-lg shadow-black/[0.03] space-y-5">
              <div className="flex justify-between items-center border-b-2 border-black pb-3">
                <div className="h-5 w-32 bg-stone-200 rounded-md" />
                <div className="h-5 w-16 bg-stone-100 rounded-full border border-black/20" />
              </div>

              {/* Items Skeleton */}
              <div className="space-y-3">
                {[1, 2].map((idx) => (
                  <div key={idx} className="flex items-center gap-3.5 py-2 border-b border-black/10">
                    <div className="w-14 h-16 rounded-xl bg-stone-100 border border-black/20 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 w-36 bg-stone-200 rounded-md" />
                      <div className="h-2.5 w-24 bg-stone-200 rounded-md" />
                    </div>
                    <div className="h-3.5 w-14 bg-stone-200 rounded-md shrink-0" />
                  </div>
                ))}
              </div>

              {/* Totals Skeleton */}
              <div className="space-y-2.5 border-t-2 border-black pt-4">
                <div className="flex justify-between">
                  <div className="h-3.5 w-20 bg-stone-200 rounded" />
                  <div className="h-3.5 w-16 bg-stone-200 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3.5 w-32 bg-stone-200 rounded" />
                  <div className="h-3.5 w-16 bg-stone-200 rounded" />
                </div>
              </div>

              {/* Total Due Skeleton */}
              <div className="flex justify-between items-center border-t-2 border-black pt-4">
                <div className="space-y-1">
                  <div className="h-4 w-20 bg-stone-200 rounded" />
                  <div className="h-2.5 w-32 bg-stone-200 rounded" />
                </div>
                <div className="h-8 w-28 bg-stone-200 rounded-lg" />
              </div>

              {/* Pay Button Skeleton */}
              <div className="h-14 w-full bg-stone-200 rounded-2xl" />

              <div className="pt-2 flex justify-center">
                <div className="h-3 w-48 bg-stone-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
