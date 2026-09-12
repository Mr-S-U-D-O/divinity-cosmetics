import React from "react";
import Link from "next/link";
import * as motion from "motion/react-client";
import { 
  ArrowRight, 
  Leaf, 
  Globe, 
  ShieldCheck, 
  Handshake, 
  TrendUp,
  Percent
} from "@phosphor-icons/react/dist/ssr";

export default function ResellerLandingPage() {
  return (
    <main className="overflow-x-hidden w-full max-w-full bg-[#f5f5f5] text-[#1a1a1a]">
      {/* 
        ========================================
        HERO SECTION 
        Cinematic Center, 2-line Headline
        ========================================
      */}
      <section className="relative w-full min-h-[100dvh] flex items-center justify-center pt-24 pb-16 px-6">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=2000" 
            alt="Premium Botanical Setup" 
            className="w-full h-full object-cover opacity-70 grayscale mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f5f5f5]/50 via-[#f5f5f5]/80 to-[#f5f5f5]"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-6 max-w-4xl mx-auto text-[#111]">
              Elevate your retail <br /> with Divinity.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-lg md:text-xl text-gray-700 max-w-[50ch] mx-auto mb-10 font-medium">
              Join our exclusive reseller program. Premium botanical formulations designed for leading salons, boutiques, and wellness curators.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link 
              href="/reseller/apply"
              className="inline-flex items-center justify-center gap-2 bg-[#3d7b32] text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#2d5e24] transition-colors"
            >
              Apply to Become a Reseller <ArrowRight weight="bold" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 
        ========================================
        BENTO GRID: WHY PARTNER WITH DIVINITY
        ========================================
      */}
      <section className="py-32 px-6 md:px-12 w-full max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tight max-w-2xl text-[#111]">
            Why partner <br className="hidden md:block"/> with Divinity.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 grid-flow-dense">
          {/* Card 1: Large Featured */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 md:row-span-1 bg-white p-8 md:p-12 rounded-3xl border border-black/5 overflow-hidden relative group"
          >
            <div className="relative z-10 h-full flex flex-col justify-end">
              <Leaf size={40} className="text-[#3d7b32] mb-6" weight="duotone" />
              <h3 className="text-2xl font-bold mb-2">Uncompromising Quality</h3>
              <p className="text-gray-600 max-w-md">Our formulations are rooted in rare African botanicals, offering your clients a distinct and luxurious ritual they won't find anywhere else.</p>
            </div>
            {/* Subtle background decoration */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#3d7b32]/5 rounded-full blur-3xl group-hover:bg-[#3d7b32]/10 transition-colors duration-700"></div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-1 md:row-span-1 bg-white p-8 md:p-12 rounded-3xl border border-black/5"
          >
            <Globe size={40} className="text-[#111] mb-6" weight="duotone" />
            <h3 className="text-2xl font-bold mb-2">Global Appeal</h3>
            <p className="text-gray-600">A universally loved aesthetic that elevates your retail shelves.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-1 md:row-span-1 bg-white p-8 md:p-12 rounded-3xl border border-black/5"
          >
            <ShieldCheck size={40} className="text-[#111] mb-6" weight="duotone" />
            <h3 className="text-2xl font-bold mb-2">Dedicated Support</h3>
            <p className="text-gray-600">Direct access to our brand team for product education and assets.</p>
          </motion.div>

          {/* Card 4: Wide */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-2 md:row-span-1 bg-[#111] text-white p-8 md:p-12 rounded-3xl overflow-hidden relative group"
          >
            <div className="relative z-10 h-full flex flex-col justify-end">
              <Handshake size={40} className="text-white/80 mb-6" weight="duotone" />
              <h3 className="text-2xl font-bold mb-2">Exclusive Territory</h3>
              <p className="text-gray-400 max-w-md">We curate our retail partners carefully, ensuring your boutique maintains exclusivity in your immediate geographical area.</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3d7b32]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </motion.div>
        </div>
      </section>

      {/* 
        ========================================
        PRICING & COMMISSIONS
        ========================================
      */}
      <section className="py-32 px-6 md:px-12 border-t border-black/5 bg-white">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <div className="flex-1 w-full">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#111] mb-6">
              Wholesale Pricing Tiers &amp; Commissions
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-[50ch]">
              Our structure is designed to reward your growth. As your order volume increases, so do your margins.
            </p>

            <ul className="grid gap-6">
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-start gap-4 p-6 bg-[#f5f5f5] rounded-2xl"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-[#3d7b32]">
                  <Percent weight="bold" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Tier 1: 30% Margin</h4>
                  <p className="text-gray-600 text-sm">For initial orders and boutique retailers. Low minimum order quantities to help you test the market.</p>
                </div>
              </motion.li>

              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-start gap-4 p-6 bg-[#f5f5f5] rounded-2xl"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-[#3d7b32]">
                  <TrendUp weight="bold" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Tier 2: 45% Margin</h4>
                  <p className="text-gray-600 text-sm">For established partners exceeding standard volumes. Priority fulfillment and dedicated support.</p>
                </div>
              </motion.li>
            </ul>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200" 
                alt="Divinity Products on display"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border border-black/10 rounded-3xl z-10 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================
        FINAL CTA
        ========================================
      */}
      <section className="py-32 px-6 text-center bg-[#f5f5f5]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 text-[#111]">
            Ready to curate Divinity?
          </h2>
          <Link 
            href="/reseller/apply"
            className="inline-flex items-center justify-center gap-2 bg-[#111] text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#3d7b32] transition-colors"
          >
            Submit Application <ArrowRight weight="bold" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
