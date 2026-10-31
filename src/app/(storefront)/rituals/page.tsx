import React from "react";
import Link from "next/link";
import { Sparkle, Sun, Moon, Drop, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Botanical Rituals | Divinity Cosmetics",
  description: "Discover conscious daily skincare rituals infused with African botanicals for deep hydration and barrier protection.",
};

export default function RitualsPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] pt-32 md:pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-[#1a1a1a]">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8efe7] text-[#3d7b32] rounded-full text-[11px] font-bold tracking-widest uppercase mb-2">
            <Sparkle size={14} weight="fill" />
            <span>Daily Botanical Care</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 leading-tight">
            Curated Skincare Rituals
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Transform everyday skin application into an intentional moment of calm and restoration using indigenous botanical essences.
          </p>
        </div>

        {/* Ritual Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Morning Ritual */}
          <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-2xl shadow-sm space-y-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sun size={26} weight="bold" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Morning Sequence</span>
              <h2 className="text-2xl font-medium text-gray-900">Awaken & Protect</h2>
            </div>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <div className="border-l-2 border-[#3d7b32] pl-4 space-y-1">
                <p className="font-semibold text-gray-900">Step 1: Clarify</p>
                <p>Cleanse with lukewarm water and a drop of clarifying botanical wash to remove overnight buildup without stripping natural lipids.</p>
              </div>
              <div className="border-l-2 border-[#3d7b32] pl-4 space-y-1">
                <p className="font-semibold text-gray-900">Step 2: Hydrate</p>
                <p>Apply Body Lotion A with cold-pressed marula oil immediately onto damp skin to lock in 24-hour hydration.</p>
              </div>
              <div className="border-l-2 border-[#3d7b32] pl-4 space-y-1">
                <p className="font-semibold text-gray-900">Step 3: Shield</p>
                <p>Seal key high-exposure areas with a delicate layer of face oil for an effortless, non-greasy velvet finish.</p>
              </div>
            </div>
          </div>

          {/* Evening Ritual */}
          <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-2xl shadow-sm space-y-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Moon size={26} weight="bold" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Evening Sequence</span>
              <h2 className="text-2xl font-medium text-gray-900">Restore & Replenish</h2>
            </div>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <div className="border-l-2 border-[#3d7b32] pl-4 space-y-1">
                <p className="font-semibold text-gray-900">Step 1: Dissolve</p>
                <p>Melt away urban pollutants and sunscreen with gentle circular motions using warm water.</p>
              </div>
              <div className="border-l-2 border-[#3d7b32] pl-4 space-y-1">
                <p className="font-semibold text-gray-900">Step 2: Soothe</p>
                <p>Massage Cape Chamomile and Baobab extract into sensitive areas to calm redness and inflammation.</p>
              </div>
              <div className="border-l-2 border-[#3d7b32] pl-4 space-y-1">
                <p className="font-semibold text-gray-900">Step 3: Cell Repair</p>
                <p>Allow rich essential fatty acids to soak in overnight while cellular regeneration peaks.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="bg-[#e8efe7]/60 border border-[#3d7b32]/20 rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-xl font-medium text-gray-900">Ready to Begin Your Ritual?</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Explore our curated bundles and individual botanical formulations crafted specifically for lasting skin health.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#3d7b32] text-white py-3.5 px-8 rounded-xl font-medium text-sm hover:bg-[#2c5a24] transition-colors"
            >
              <span>Shop All Formulations</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
