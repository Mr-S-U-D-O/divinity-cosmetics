import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Heart, Leaf, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Our Story | Divinity Cosmetics",
  description: "Learn about the heritage, indigenous botanical ingredients, and conscious craftsmanship behind Divinity Cosmetics.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white px-6 pb-24 pt-32 font-sans text-[#1a1a1a] md:px-12 md:pt-40 lg:px-24">
      <div className="mx-auto max-w-6xl space-y-24">
        
        {/* Hero Section */}
        <div className="grid items-end gap-8 border-b border-[#1a1a1a]/10 pb-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e8efe7] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#3d7b32]">
            <Leaf size={14} weight="fill" />
            <span>Rooted in African Soil</span>
          </div>
          <h1 className="max-w-3xl text-5xl font-medium leading-[0.95] tracking-[-0.06em] text-gray-900 md:text-7xl">
            Skincare with a sense of place.
          </h1>
          </div>
          <p className="max-w-md text-base leading-relaxed text-gray-600 md:text-lg">
            Divinity Cosmetics was born from a profound respect for South Africa's indigenous botanicals—formulated to nourish, protect, and restore your skin's natural radiance.
          </p>
        </div>

        {/* Narrative Split */}
        <div className="grid grid-cols-1 items-stretch gap-10 md:grid-cols-[0.95fr_1.05fr] md:gap-16">
          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-[#0f3d2c] shadow-sm md:min-h-0">
            <Image
              src="/images/divinity-our-story.jpg"
              alt="Hands holding Divinity Cosmetics Marula and Baobab Body Lotion"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/90 p-5 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#3d7b32]">Made for every body</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#1a1a1a]/75">
                A shared ritual, made with botanicals that belong to home.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center text-gray-700">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#3d7b32]">Our story</p>
            <h2 className="max-w-xl text-3xl font-medium leading-tight tracking-tight text-gray-900 md:text-5xl">
              An everyday ritual of restoration.
            </h2>
            <div className="mt-7 max-w-xl space-y-5 leading-relaxed">
              <p>
              South Africa is home to some of the planet's most resilient and nutrient-dense flora. From the vitamin-rich marula groves of Limpopo to wild baobab trees that withstand the harshest droughts, our active botanicals are biologically tuned to protect against moisture loss and environmental stress.
              </p>
              <p>
              We craft each small batch with zero compromise on ingredient purity. No synthetic parabens, no harsh drying sulfates, and no artificial dyes—only cold-pressed seed oils, indigenous extracts, and soothing plant hydrosols.
              </p>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 rounded-full bg-[#1a1a1a] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#3d7b32]"
              >
                <span>Shop our signature lotion</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
              <Link href="/contact" className="inline-flex items-center rounded-full border border-[#1a1a1a]/20 px-6 py-3.5 text-sm font-bold text-[#1a1a1a] transition-colors hover:border-[#1a1a1a]">
                Talk to us
              </Link>
            </div>
          </div>
        </div>

        {/* Pillar Values */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[2rem] border border-[#1a1a1a]/10 bg-[#1a1a1a]/10 md:grid-cols-3">
          <div className="space-y-3 bg-[#f7f8f4] p-8 md:p-10">
            <div className="w-10 h-10 rounded-lg bg-[#e8efe7] text-[#3d7b32] flex items-center justify-center">
              <Leaf size={22} weight="bold" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Indigenous Sourcing</h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              We partner directly with sustainable rural harvesting initiatives, ensuring fair compensation and biodiversity preservation.
            </p>
          </div>

          <div className="space-y-3 bg-[#f7f8f4] p-8 md:p-10">
            <div className="w-10 h-10 rounded-lg bg-[#e8efe7] text-[#3d7b32] flex items-center justify-center">
              <ShieldCheck size={22} weight="bold" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Cruelty-Free Always</h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              We test on willing human beings, never animals. Our formulas respect delicate, sensitive, and dry skin types.
            </p>
          </div>

          <div className="space-y-3 bg-[#f7f8f4] p-8 md:p-10">
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
