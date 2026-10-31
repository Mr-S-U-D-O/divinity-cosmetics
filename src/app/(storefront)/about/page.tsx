import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkle, ShieldCheck, Heart, Leaf, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/config/site";

export const metadata = {
  title: "Our Story | Divinity Cosmetics",
  description: "Learn about the heritage, indigenous botanical ingredients, and conscious craftsmanship behind Divinity Cosmetics.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] pt-32 md:pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-[#1a1a1a]">
      <div className="max-w-5xl mx-auto space-y-20">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8efe7] text-[#3d7b32] rounded-full text-[11px] font-bold tracking-widest uppercase mb-2">
            <Leaf size={14} weight="fill" />
            <span>Rooted in African Soil</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-gray-900 leading-tight">
            Pure Botanicals, Conscious Craftsmanship.
          </h1>
          <p className="text-base md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Divinity Cosmetics was born from a profound respect for South Africa's indigenous botanicals—formulated to nourish, protect, and restore your skin's natural radiance.
          </p>
        </div>

        {/* Narrative Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm bg-gray-100">
            <Image
              src="https://images.unsplash.com/photo-1608248597359-0056973e738c?auto=format&fit=crop&q=80&w=1000"
              alt="Natural botanicals harvesting"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-900 tracking-tight">
              An Everyday Ritual of Restoration
            </h2>
            <p>
              South Africa is home to some of the planet's most resilient and nutrient-dense flora. From the vitamin-rich marula groves of Limpopo to wild baobab trees that withstand the harshest droughts, our active botanicals are biologically tuned to protect against moisture loss and environmental stress.
            </p>
            <p>
              We craft each small batch with zero compromise on ingredient purity. No synthetic parabens, no harsh drying sulfates, and no artificial dyes—only cold-pressed seed oils, indigenous extracts, and soothing plant hydrosols.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#3d7b32] text-white py-3 px-6 rounded-xl font-medium text-sm hover:bg-[#2c5a24] transition-colors"
              >
                <span>Explore Formulations</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          </div>
        </div>

        {/* Pillar Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#e8efe7] text-[#3d7b32] flex items-center justify-center">
              <Leaf size={22} weight="bold" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Indigenous Sourcing</h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              We partner directly with sustainable rural harvesting initiatives, ensuring fair compensation and biodiversity preservation.
            </p>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#e8efe7] text-[#3d7b32] flex items-center justify-center">
              <ShieldCheck size={22} weight="bold" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Cruelty-Free Always</h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              We test on willing human beings, never animals. Our formulas respect delicate, sensitive, and dry skin types.
            </p>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#e8efe7] text-[#3d7b32] flex items-center justify-center">
              <Heart size={22} weight="bold" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Handcrafted in ZA</h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              Proudly formulated, manufactured, and bottled on South African soil, designed for our climate and unique beauty.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
