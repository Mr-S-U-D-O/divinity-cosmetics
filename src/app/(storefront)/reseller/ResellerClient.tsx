"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  CheckCircle,
  Truck,
  Sparkle,
  MapPin,
  Percent,
  WhatsappLogo,
  CaretDown,
  Package,
  Storefront,
  Users,
  Clock,
  Handshake,
} from "@phosphor-icons/react";
import { siteConfig } from "@/lib/config/site";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface FAQItem {
  question: string;
  answer: string;
}

const stockistFAQs: FAQItem[] = [
  {
    question: "What is the minimum opening order quantity (MOQ)?",
    answer:
      "Our opening minimum order is just 12 units (one carton) of the flagship 400ml Marula & Baobab Body Lotion (R3,360 total wholesale investment). This low-barrier commitment allows you to test client demand with zero risk before scaling up.",
  },
  {
    question: "How do you protect our local territory from competing stockists?",
    answer:
      "We enforce a strict geographic territory radius (typically 3km to 5km in metropolitan areas). Once your account is active and maintaining consistent quarterly volume, no other salon or boutique within your protected perimeter will be approved to retail Divinity.",
  },
  {
    question: "Do you supply tester bottles and marketing collateral?",
    answer:
      "Yes. Every initial opening order includes a complimentary full-size 400ml tester bottle, luxury counter display tent cards, and therapist formulation guides. Partner and Premier tiers also receive client sample trial sachets for your treatment rooms.",
  },
  {
    question: "What is the recommended retail price (RRP) policy?",
    answer:
      "The flagship 400ml Marula & Baobab Body Lotion retails at a strictly enforced R400 incl. VAT nationwide. We strictly prohibit discounting below RRP to protect partner margins and preserve the brand's luxury positioning across South Africa.",
  },
  {
    question: "How fast is wholesale courier fulfillment?",
    answer:
      "All wholesale orders dispatch within 24 hours from our South African fulfillment hub via insured, door-to-door courier. Delivery takes 2 to 4 business days across all 9 provinces with real-time SMS and email tracking.",
  },
  {
    question: "Can home-based therapists or mobile aesthetic practitioners apply?",
    answer:
      "Yes. We welcome qualified somatologists, clinical dermal therapists, and registered beauty professionals operating private practices. You will simply need to provide proof of professional qualification or trade registration during application.",
  },
];

export function ResellerClient() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTier, setActiveTier] = useState<"starter" | "partner" | "premier">("partner");

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hi Divinity team, I am interested in stocking Divinity Cosmetics in my salon/spa. Could you share wholesale details?"
  )}`;

  return (
    <div className="w-full bg-[#fcfbf9] text-[#1a1a1a] selection:bg-[#3d7b32] selection:text-white">
      {/* =========================================================================
          1. HERO SECTION (Attention: Editorial Asymmetric Split)
          ========================================================================= */}
      <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-44 lg:pb-32 px-6 md:px-12 lg:px-20 overflow-hidden border-b border-black/[0.06]">
        {/* Subtle ambient botanical background glow */}
        <div 
          className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-[#3d7b32]/[0.04] blur-3xl pointer-events-none"
          aria-hidden="true" 
        />
        <div 
          className="absolute -bottom-20 -left-40 w-[500px] h-[500px] rounded-full bg-[#3d7b32]/[0.03] blur-3xl pointer-events-none"
          aria-hidden="true" 
        />

        <div className="max-w-[1400px] mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="flex items-center gap-2.5 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#3d7b32]" aria-hidden="true" />
            <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.16em] text-black/70">
              Authorized Stockist &amp; Wholesale Program · South Africa
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Copy & Value Proposition */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: easeOutExpo }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              <h1 className="font-chloe text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] leading-[1.05] tracking-tight text-black m-0 font-normal">
                High-margin botanical body care. <br className="hidden sm:block" />
                <span className="italic">Formulated for high-trust retail.</span>
              </h1>

              <p className="mt-6 text-base md:text-lg text-black/75 max-w-[56ch] leading-relaxed">
                Partner with Divinity Cosmetics as an authorized stockist. Offer your clients facial-grade South African Marula &amp; Baobab barrier repair with 
                <strong className="text-black font-semibold"> 30% to 45% wholesale margins</strong>, low 12-unit starter orders, and protected local territory.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Link
                  href="/reseller/apply"
                  className="btn-primary text-center"
                >
                  <span>Apply for Wholesale Access</span>
                </Link>

                <a
                  href="#tiers"
                  className="btn-secondary text-center"
                >
                  <span>View Wholesale Margins</span>
                </a>
              </div>

              {/* Trust Micro-Checkmarks */}
              <div className="mt-10 pt-8 border-t border-black/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 w-full text-xs text-black/70 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[#3d7b32] shrink-0" />
                  <span>12-Unit Low MOQ</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[#3d7b32] shrink-0" />
                  <span>Free Full Tester</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[#3d7b32] shrink-0" />
                  <span>Territory Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-[#3d7b32] shrink-0" />
                  <span>2–4 Day Courier</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Hero Visual & Floating Unit Economics Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: easeOutExpo }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] w-full rounded-3xl overflow-hidden border border-black/10 bg-[#f4efe8] shadow-xl shadow-black/[0.03]">
                <Image
                  src="/images/marula-baobab-body-lotion.jpg"
                  alt="Divinity Cosmetics Flagship 400ml Marula & Baobab Body Lotion for Salons and Stockists"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Unit Economics Card */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg text-black">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#3d7b32]">Flagship Unit Economics</span>
                    <span className="text-[10px] font-semibold text-black/50">400ml Pump Bottle</span>
                  </div>
                  <p className="font-chloe text-xl font-normal leading-tight text-black mb-3">
                    Marula &amp; Baobab Body Lotion
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/[0.07] text-center">
                    <div>
                      <p className="text-[10px] text-black/50 uppercase">RRP</p>
                      <p className="font-semibold text-sm text-black">R400</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-black/50 uppercase">Wholesale</p>
                      <p className="font-semibold text-sm text-black/80">R220–R280</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-black/50 uppercase font-bold text-[#3d7b32]">Your Profit</p>
                      <p className="font-bold text-sm text-[#3d7b32]">+R120–R180</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. RETAIL ECONOMICS: ANCHORING & UNIT MARGINS (Interest)
          ========================================================================= */}
      <section id="margins" className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-white border-b border-black/[0.06]">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3d7b32] mb-3 block">
              Predictable Retail Economics
            </span>
            <h2 className="font-chloe text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-black leading-tight">
              Turn 30cm of counter space into recurring monthly retail profit.
            </h2>
            <p className="mt-4 text-base md:text-lg text-black/70 leading-relaxed">
              Supermarket pump lotions sell for R80–R120 and offer zero salon profitability. Divinity gives your practice a premium R400 facial-grade retail hero with protected margins and genuine 90-day client retention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Metric Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 md:p-10 rounded-3xl bg-[#fcfbf9] border border-black/[0.08] flex flex-col justify-between hover:border-black/25 transition-colors"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[#3d7b32]/10 text-[#3d7b32] flex items-center justify-center mb-6">
                  <Percent size={24} weight="bold" />
                </div>
                <h3 className="font-chloe text-2xl font-normal text-black mb-2">30% to 45% Gross Margins</h3>
                <p className="text-black/70 text-sm leading-relaxed mb-6">
                  Earn R120 to R180 on every 400ml bottle sold at our strictly enforced R400 retail price. High-margin retail income that complements treatment bookings without added therapist hours.
                </p>
              </div>
              <div className="pt-4 border-t border-black/[0.06] text-xs text-black/60 font-medium">
                Selling just 10 bottles/week = <strong className="text-black font-semibold">R4,800 to R7,200 monthly profit</strong>
              </div>
            </motion.div>

            {/* Metric Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 md:p-10 rounded-3xl bg-[#fcfbf9] border border-black/[0.08] flex flex-col justify-between hover:border-black/25 transition-colors"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[#3d7b32]/10 text-[#3d7b32] flex items-center justify-center mb-6">
                  <Package size={24} weight="bold" />
                </div>
                <h3 className="font-chloe text-2xl font-normal text-black mb-2">Low-Risk 12-Unit MOQ</h3>
                <p className="text-black/70 text-sm leading-relaxed mb-6">
                  Test your client appetite with a manageable 12-bottle carton (R3,360 total investment). No R10,000+ opening commitments or slow-moving stock gathering dust on your shelves.
                </p>
              </div>
              <div className="pt-4 border-t border-black/[0.06] text-xs text-black/60 font-medium">
                Fast turn: Most salons sell through 12 units in <strong className="text-black font-semibold">under 14 days</strong>
              </div>
            </motion.div>

            {/* Metric Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 md:p-10 rounded-3xl bg-[#fcfbf9] border border-black/[0.08] flex flex-col justify-between hover:border-black/25 transition-colors"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[#3d7b32]/10 text-[#3d7b32] flex items-center justify-center mb-6">
                  <Clock size={24} weight="bold" />
                </div>
                <h3 className="font-chloe text-2xl font-normal text-black mb-2">60–90 Day Refill Habit</h3>
                <p className="text-black/70 text-sm leading-relaxed mb-6">
                  400ml delivers 60 to 90 days of daily full-body barrier repair. Once clients experience lasting relief from Highveld winter dryness and crepey skin, they return to your salon for repeat purchases.
                </p>
              </div>
              <div className="pt-4 border-t border-black/[0.06] text-xs text-black/60 font-medium">
                High retention: <strong className="text-black font-semibold">Over 78% of clients repurchase</strong> within 90 days
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CURATED AUDIENCE: WHO THE PROGRAM IS BUILT FOR
          ========================================================================= */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-[#fcfbf9] border-b border-black/[0.06]">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3d7b32] mb-3 block">
              Authorized Stockist Partners
            </span>
            <h2 className="font-chloe text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-black leading-tight">
              Designed for elevated spaces that prioritize skincare integrity.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Profile 1 */}
            <div className="p-7 rounded-2xl bg-white border border-black/[0.07] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black mb-4">
                  <Sparkle size={20} weight="regular" />
                </div>
                <h3 className="font-chloe text-xl font-normal text-black mb-2">Aesthetic &amp; Dermal Clinics</h3>
                <p className="text-xs text-black/70 leading-relaxed">
                  Ideal as aftercare for clients post-chemical peels, laser therapy, and Highveld dryness seeking pure barrier replenishment without fragrance flare-ups.
                </p>
              </div>
              <p className="mt-6 pt-3 border-t border-black/[0.05] text-[11px] font-semibold text-[#3d7b32] uppercase tracking-wider">
                Clinical Barrier Recovery
              </p>
            </div>

            {/* Profile 2 */}
            <div className="p-7 rounded-2xl bg-white border border-black/[0.07] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black mb-4">
                  <Storefront size={20} weight="regular" />
                </div>
                <h3 className="font-chloe text-xl font-normal text-black mb-2">Day Spas &amp; Wellness Sanctuaries</h3>
                <p className="text-xs text-black/70 leading-relaxed">
                  Elevate treatment wrap rituals and offer clients a sensorial, cold-pressed African botanical keepsake that extends the spa experience at home.
                </p>
              </div>
              <p className="mt-6 pt-3 border-t border-black/[0.05] text-[11px] font-semibold text-[#3d7b32] uppercase tracking-wider">
                Spa Ritual Extension
              </p>
            </div>

            {/* Profile 3 */}
            <div className="p-7 rounded-2xl bg-white border border-black/[0.07] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black mb-4">
                  <Users size={20} weight="regular" />
                </div>
                <h3 className="font-chloe text-xl font-normal text-black mb-2">Boutique Salons &amp; Studios</h3>
                <p className="text-xs text-black/70 leading-relaxed">
                  Effortless impulse conversion at reception. Clients test the non-greasy silk texture while settling accounts and add a bottle to their appointment ticket.
                </p>
              </div>
              <p className="mt-6 pt-3 border-t border-black/[0.05] text-[11px] font-semibold text-[#3d7b32] uppercase tracking-wider">
                Reception Upsell Hero
              </p>
            </div>

            {/* Profile 4 */}
            <div className="p-7 rounded-2xl bg-white border border-black/[0.07] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black mb-4">
                  <Handshake size={20} weight="regular" />
                </div>
                <h3 className="font-chloe text-xl font-normal text-black mb-2">Safari Lodges &amp; Luxury Boutiques</h3>
                <p className="text-xs text-black/70 leading-relaxed">
                  Provide international and local guests with authentic South African botanical skincare crafted from certified Marula and wild-harvested Baobab.
                </p>
              </div>
              <p className="mt-6 pt-3 border-t border-black/[0.05] text-[11px] font-semibold text-[#3d7b32] uppercase tracking-wider">
                Authentic Cape Provenance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. GAPLESS BENTO GRID: THE STOCKIST ADVANTAGE (Desire)
          ========================================================================= */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-white border-b border-black/[0.06]">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3d7b32] mb-3 block">
              Turnkey Stockist Support
            </span>
            <h2 className="font-chloe text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-black leading-tight">
              Everything you need to sell out your first carton within 14 days.
            </h2>
          </div>

          {/* Mathematical Gapless Bento (2x2 / col-span interlocking) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-flow-dense">
            {/* Bento Cell 1: Large Featured Card with Real Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 relative min-h-[380px] rounded-3xl overflow-hidden border border-black bg-[#22441d] text-white p-8 md:p-12 flex flex-col justify-end group"
            >
              <Image
                src="/images/bento-story-hands.jpg"
                alt="Therapist hands applying Divinity Marula and Baobab Body Lotion"
                fill
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover object-center opacity-40 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#142812]/95 via-[#142812]/70 to-transparent pointer-events-none" />

              <div className="relative z-10 max-w-xl">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] font-semibold tracking-wider uppercase mb-4 border border-white/20">
                  <MapPin size={14} weight="bold" />
                  <span>Territory Protection</span>
                </span>
                <h3 className="font-chloe text-2xl md:text-3xl font-normal text-white mb-3">
                  Guaranteed Geographic Exclusivity
                </h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  We protect our stockists by enforcing strict perimeter boundaries (3km to 5km radius in metropolitan areas). Your business remains the singular destination for Divinity in your neighborhood—preventing retail price wars and safeguarding your margins.
                </p>
              </div>
            </motion.div>

            {/* Bento Cell 2: Fast Door-to-Door Courier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-1 rounded-3xl border border-black bg-[#fcfbf9] p-8 md:p-10 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[#3d7b32]/10 text-[#3d7b32] flex items-center justify-center mb-6">
                  <Truck size={24} weight="bold" />
                </div>
                <h3 className="font-chloe text-2xl font-normal text-black mb-3">2–4 Day Courier Dispatch</h3>
                <p className="text-black/70 text-sm leading-relaxed">
                  Reliable tracked delivery from our Johannesburg fulfillment center directly to your reception desk across all 9 provinces. Free courier shipping on Partner and Premier orders.
                </p>
              </div>
              <div className="pt-6 border-t border-black text-xs font-semibold text-black/80 flex items-center gap-1.5">
                <span>Direct delivery to your doorstep</span>
                <ArrowRight size={14} className="text-[#3d7b32]" />
              </div>
            </motion.div>

            {/* Bento Cell 3: Turnkey POS Marketing Kit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-1 rounded-3xl border border-black bg-[#fcfbf9] p-8 md:p-10 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[#3d7b32]/10 text-[#3d7b32] flex items-center justify-center mb-6">
                  <Sparkle size={24} weight="bold" />
                </div>
                <h3 className="font-chloe text-2xl font-normal text-black mb-3">POS Merchandising Kit</h3>
                <p className="text-black/70 text-sm leading-relaxed">
                  Every stockist receives acrylic counter tent cards, therapist cheat-sheets highlighting Marula &amp; Baobab lipid science, and high-resolution digital image packs for your salon’s Instagram.
                </p>
              </div>
              <div className="pt-6 border-t border-black text-xs font-semibold text-black/80 flex items-center gap-1.5">
                <span>Display-ready on day one</span>
                <ArrowRight size={14} className="text-[#3d7b32]" />
              </div>
            </motion.div>

            {/* Bento Cell 4: Complimentary Full Tester Bottle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="md:col-span-2 relative min-h-[320px] rounded-3xl overflow-hidden border border-black bg-[#1a1a1a] text-white p-8 md:p-12 flex flex-col justify-end group"
            >
              <Image
                src="/images/marula-baobab-body-lotion.jpg"
                alt="Full size 400ml lotion bottle tester for stockists"
                fill
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover object-center opacity-30 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

              <div className="relative z-10 max-w-xl">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] font-semibold tracking-wider uppercase mb-4 border border-white/15">
                  <CheckCircle size={14} weight="bold" />
                  <span>Zero Tester Expense</span>
                </span>
                <h3 className="font-chloe text-2xl md:text-3xl font-normal text-white mb-3">
                  Complimentary 400ml Tester with Opening Order
                </h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  We never ask stockists to sacrifice retail margin to provide salon testers. Every opening carton includes a dedicated 400ml pump tester bottle for your front desk, plus luxury trial sachets for clients to sample at home.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. WHOLESALE TIERS & MARGIN BREAKDOWN TABLE (Interest & Transparency)
          ========================================================================= */}
      <section id="tiers" className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-[#fcfbf9] border-b border-black/[0.06]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3d7b32] mb-3 block">
              Transparent Tier Architecture
            </span>
            <h2 className="font-chloe text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-black leading-tight">
              Wholesale Pricing Tiers &amp; Margins
            </h2>
            <p className="mt-4 text-sm md:text-base text-black/70 leading-relaxed">
              Transparent margin tiers designed to reward your salon’s growth. All pricing in South African Rands (ZAR). Strictly maintained R400 RRP protects your retail margin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* TIER 1: Starter Pack */}
            <div 
              onClick={() => setActiveTier("starter")}
              className={`p-8 md:p-10 rounded-3xl transition-all duration-300 flex flex-col justify-between border cursor-pointer ${
                activeTier === "starter"
                  ? "bg-white border-black/80 shadow-xl shadow-black/[0.03]"
                  : "bg-white/70 border-black/[0.08] hover:border-black/30"
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/60">Tier 1 · Low MOQ</span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/5 text-black/80">30% Margin</span>
                </div>
                <h3 className="font-chloe text-3xl font-normal text-black mb-2">Starter Carton</h3>
                <p className="text-xs text-black/60 mb-6">Designed for boutique salons and private practices testing initial client response.</p>

                <div className="mb-6 p-4 rounded-2xl bg-black/[0.03]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-black font-sans">R280</span>
                    <span className="text-xs text-black/60">/ bottle wholesale</span>
                  </div>
                  <p className="text-xs text-[#3d7b32] font-semibold mt-1">Earn R120 profit per bottle sold</p>
                </div>

                <ul className="space-y-3 text-xs text-black/80 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#3d7b32] shrink-0" weight="fill" />
                    <span><strong>12 to 23 Units</strong> (Carton opening order)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#3d7b32] shrink-0" weight="fill" />
                    <span><strong>1 Free 400ml Tester</strong> included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#3d7b32] shrink-0" weight="fill" />
                    <span>Acrylic counter display tent card</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#3d7b32] shrink-0" weight="fill" />
                    <span>Digital product &amp; ingredient guide</span>
                  </li>
                  <li className="flex items-center gap-2 text-black/50">
                    <span className="w-4 h-4 rounded-full border border-black/20 flex items-center justify-center shrink-0">·</span>
                    <span>Standard courier delivery (R100)</span>
                  </li>
                </ul>
              </div>

              <div>
                <Link
                  href="/reseller/apply"
                  className="btn-secondary w-full text-center block text-xs py-3"
                >
                  Apply for Starter Tier
                </Link>
                <p className="text-[11px] text-center text-black/50 mt-3">R3,360 initial investment for 12 units</p>
              </div>
            </div>

            {/* TIER 2: Studio Partner (Recommended / Most Popular) */}
            <div 
              onClick={() => setActiveTier("partner")}
              className={`p-8 md:p-10 rounded-3xl transition-all duration-300 flex flex-col justify-between border relative cursor-pointer ${
                activeTier === "partner"
                  ? "bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-2xl shadow-black/10 scale-[1.02]"
                  : "bg-white border-black/[0.08] hover:border-black/30"
              }`}
            >
              {/* Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#3d7b32] text-white text-[10px] font-bold tracking-widest uppercase shadow-md">
                Most Popular for Day Spas &amp; Salons
              </div>

              <div>
                <div className="flex justify-between items-center mb-4 pt-2">
                  <span className={`text-xs font-bold uppercase tracking-widest ${activeTier === "partner" ? "text-white/60" : "text-black/60"}`}>
                    Tier 2 · Growth Partner
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#3d7b32] text-white">
                    38% Margin
                  </span>
                </div>
                <h3 className={`font-chloe text-3xl font-normal mb-2 ${activeTier === "partner" ? "text-white" : "text-black"}`}>
                  Studio Partner
                </h3>
                <p className={`text-xs mb-6 ${activeTier === "partner" ? "text-white/70" : "text-black/60"}`}>
                  Ideal for established aesthetics clinics and busy day spas with 2+ treatment rooms.
                </p>

                <div className={`mb-6 p-4 rounded-2xl ${activeTier === "partner" ? "bg-white/10" : "bg-black/[0.03]"}`}>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold font-sans ${activeTier === "partner" ? "text-white" : "text-black"}`}>
                      R248
                    </span>
                    <span className={`text-xs ${activeTier === "partner" ? "text-white/60" : "text-black/60"}`}>
                      / bottle wholesale
                    </span>
                  </div>
                  <p className="text-xs text-[#52b144] font-semibold mt-1">Earn R152 profit per bottle sold</p>
                </div>

                <ul className={`space-y-3 text-xs mb-8 ${activeTier === "partner" ? "text-white/90" : "text-black/80"}`}>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#52b144] shrink-0" weight="fill" />
                    <span><strong>24 to 47 Units</strong> (Two-carton bundle)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#52b144] shrink-0" weight="fill" />
                    <span><strong>1 Free 400ml Tester + 20 Sample Sachets</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#52b144] shrink-0" weight="fill" />
                    <span><strong>Free Express Courier Delivery</strong> (Nationwide)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#52b144] shrink-0" weight="fill" />
                    <span>Protected 3km Territory Perimeter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#52b144] shrink-0" weight="fill" />
                    <span>Staff Product Cheat-Sheet &amp; Scripting Guide</span>
                  </li>
                </ul>
              </div>

              <div>
                <Link
                  href="/reseller/apply"
                  className={`w-full text-center block text-xs py-3.5 rounded-full font-semibold transition-all ${
                    activeTier === "partner"
                      ? "bg-white text-black hover:bg-[#3d7b32] hover:text-white"
                      : "btn-primary"
                  }`}
                >
                  Apply for Partner Tier
                </Link>
                <p className={`text-[11px] text-center mt-3 ${activeTier === "partner" ? "text-white/50" : "text-black/50"}`}>
                  R5,952 investment for 24 units with free shipping
                </p>
              </div>
            </div>

            {/* TIER 3: Premier Stockist */}
            <div 
              onClick={() => setActiveTier("premier")}
              className={`p-8 md:p-10 rounded-3xl transition-all duration-300 flex flex-col justify-between border cursor-pointer ${
                activeTier === "premier"
                  ? "bg-white border-black/80 shadow-xl shadow-black/[0.03]"
                  : "bg-white/70 border-black/[0.08] hover:border-black/30"
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-black/60">Tier 3 · Flagship</span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/5 text-black/80">45% Margin</span>
                </div>
                <h3 className="font-chloe text-3xl font-normal text-black mb-2">Premier Stockist</h3>
                <p className="text-xs text-black/60 mb-6">For multi-location clinic groups, luxury hotels, and high-volume retail boutiques.</p>

                <div className="mb-6 p-4 rounded-2xl bg-black/[0.03]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-black font-sans">R220</span>
                    <span className="text-xs text-black/60">/ bottle wholesale</span>
                  </div>
                  <p className="text-xs text-[#3d7b32] font-semibold mt-1">Earn R180 profit per bottle sold</p>
                </div>

                <ul className="space-y-3 text-xs text-black/80 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#3d7b32] shrink-0" weight="fill" />
                    <span><strong>48+ Units</strong> (Volume tier)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#3d7b32] shrink-0" weight="fill" />
                    <span><strong>2 Free 400ml Testers + 50 Sample Sachets</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#3d7b32] shrink-0" weight="fill" />
                    <span><strong>Guaranteed 5km Exclusive Territory</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#3d7b32] shrink-0" weight="fill" />
                    <span>Featured on Official Divinity Stockist Map</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#3d7b32] shrink-0" weight="fill" />
                    <span>Dedicated WhatsApp Account Concierge</span>
                  </li>
                </ul>
              </div>

              <div>
                <Link
                  href="/reseller/apply"
                  className="btn-secondary w-full text-center block text-xs py-3"
                >
                  Apply for Premier Tier
                </Link>
                <p className="text-[11px] text-center text-black/50 mt-3">Maximum margin: R8,640 profit per 48 units</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. HOW ONBOARDING WORKS: 4-STEP FRICTIONLESS JOURNEY
          ========================================================================= */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-white border-b border-black/[0.06]">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3d7b32] mb-3 block">
              Frictionless Onboarding
            </span>
            <h2 className="font-chloe text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-black leading-tight">
              From application to retail display in four straightforward steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col">
              <span className="font-chloe text-5xl font-normal text-[#3d7b32]/40 mb-3">01</span>
              <h3 className="font-chloe text-xl font-normal text-black mb-2">Submit Application</h3>
              <p className="text-xs text-black/70 leading-relaxed">
                Complete our brief 2-minute online form with your salon details, location, and preferred opening carton size.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col">
              <span className="font-chloe text-5xl font-normal text-[#3d7b32]/40 mb-3">02</span>
              <h3 className="font-chloe text-xl font-normal text-black mb-2">Territory Vetting</h3>
              <p className="text-xs text-black/70 leading-relaxed">
                Our team reviews your application within 24 to 48 hours and confirms geographic exclusivity for your neighborhood.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col">
              <span className="font-chloe text-5xl font-normal text-[#3d7b32]/40 mb-3">03</span>
              <h3 className="font-chloe text-xl font-normal text-black mb-2">Wholesale Portal Access</h3>
              <p className="text-xs text-black/70 leading-relaxed">
                Receive authorized stockist credentials to place wholesale orders with instant EFT, card, or invoice terms.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col">
              <span className="font-chloe text-5xl font-normal text-[#3d7b32]/40 mb-3">04</span>
              <h3 className="font-chloe text-xl font-normal text-black mb-2">Dispatched to Door</h3>
              <p className="text-xs text-black/70 leading-relaxed">
                Your opening stock, POS display tent cards, and complimentary tester arrive via tracked courier in 2–4 business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. STOCKIST FAQ (Objection Handling)
          ========================================================================= */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-[#fcfbf9] border-b border-black/[0.06]">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3d7b32] mb-3 block">
              Stockist Inquiries
            </span>
            <h2 className="font-chloe text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-black leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-black/70">
              Clear answers regarding our wholesale policies, MOQs, and territory terms.
            </p>
          </div>

          <div className="space-y-4">
            {stockistFAQs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-black/[0.08] bg-white overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#3d7b32]"
                  >
                    <span className="font-chloe text-lg md:text-xl font-normal text-black">
                      {faq.question}
                    </span>
                    <CaretDown
                      size={18}
                      className={`text-black/60 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#3d7b32]" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 text-sm text-black/75 leading-relaxed border-t border-black/[0.05] pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center p-6 rounded-2xl bg-white border border-black/[0.06]">
            <p className="text-xs text-black/70 mb-3">
              Have a custom inquiry or multiple clinic locations across South Africa?
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#3d7b32] hover:underline"
            >
              <WhatsappLogo size={16} weight="fill" />
              <span>Chat directly with our Stockist Concierge on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. FINAL CTA: CONVERSION & FAST ACTION (Action)
          ========================================================================= */}
      <section className="py-24 md:py-36 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-[1200px] mx-auto rounded-3xl bg-[#1a1a1a] text-white p-10 md:p-16 lg:p-20 relative overflow-hidden text-center flex flex-col items-center">
          {/* Ambient green gradient highlight */}
          <div 
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#3d7b32]/25 blur-3xl pointer-events-none" 
            aria-hidden="true" 
          />
          <div 
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#3d7b32]/20 blur-3xl pointer-events-none" 
            aria-hidden="true" 
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative z-10 max-w-2xl mx-auto flex flex-col items-center"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#52b144] mb-4">
              Secure Territory in Your Area
            </span>

            <h2 className="font-chloe text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-[1.08] mb-6">
              Bring South Africa&apos;s flagship botanical ritual to your shelves.
            </h2>

            <p className="text-sm md:text-base text-white/75 leading-relaxed max-w-xl mb-10">
              Applications are reviewed within 24 to 48 hours. Protect your salon territory before neighboring practices apply.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/reseller/apply"
                className="btn-primary w-full sm:w-auto text-center"
              >
                <span>Apply to Become a Stockist</span>
              </Link>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full sm:w-auto text-center !border !border-white !text-white hover:!bg-white hover:!text-black"
              >
                <WhatsappLogo size={18} weight="fill" style={{ color: "#25D366" }} />
                <span>WhatsApp Desk</span>
              </a>
            </div>

            <p className="text-[11px] text-white/40 mt-8">
              No long-term contracts · 12-unit opening MOQ · Verified South African trade partners only
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
