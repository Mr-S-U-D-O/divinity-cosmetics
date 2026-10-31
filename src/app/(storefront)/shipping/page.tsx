import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, ArrowClockwise, Sparkle, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/config/site";

export const metadata = {
  title: "Shipping & Returns | Divinity Cosmetics",
  description: "Information regarding door-to-door courier delivery across South Africa, free shipping thresholds, and our botanical return policy.",
};

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] pt-32 md:pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-[#1a1a1a]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8efe7] text-[#3d7b32] rounded-full text-[11px] font-bold tracking-widest uppercase mb-4">
            <Truck size={14} weight="bold" />
            <span>South Africa Nationwide Delivery</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-4">
            Shipping & Returns
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Every bottle and jar is freshly prepared and carefully packed to ensure pristine arrival at your door.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-center space-y-2">
            <span className="text-2xl font-bold text-[#3d7b32] block">Free Delivery</span>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Orders Over R500</p>
            <p className="text-xs text-gray-600">Standard delivery is flat R100 for orders under R500.</p>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-center space-y-2">
            <span className="text-2xl font-bold text-[#3d7b32] block">2–4 Days</span>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Fast Courier Dispatch</p>
            <p className="text-xs text-gray-600">Dispatched via trusted door-to-door courier services.</p>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-center space-y-2">
            <span className="text-2xl font-bold text-[#3d7b32] block">14 Days</span>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Purity Guarantee</p>
            <p className="text-xs text-gray-600">Unhindered replacement for damaged or incorrect items.</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-sm space-y-10">
          
          <section className="space-y-4">
            <h2 className="text-xl font-medium tracking-tight text-gray-900 flex items-center gap-2">
              <Truck size={22} className="text-[#3d7b32]" weight="bold" />
              <span>Courier Delivery Across South Africa</span>
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                We deliver to all residential and commercial addresses across South Africa, covering all 9 provinces including Gauteng, Western Cape, KwaZulu-Natal, Eastern Cape, Free State, Mpumalanga, Limpopo, North West, and Northern Cape.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                <li><strong>Main Metropolitan Centers:</strong> 2 to 4 business days.</li>
                <li><strong>Regional & Outlying Areas:</strong> 3 to 5 business days.</li>
                <li><strong>Tracking:</strong> Real-time courier tracking number sent to your WhatsApp and email as soon as your parcel is dispatched.</li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section className="space-y-4">
            <h2 className="text-xl font-medium tracking-tight text-gray-900 flex items-center gap-2">
              <ShieldCheck size={22} className="text-[#3d7b32]" weight="bold" />
              <span>Urgent Orders & WhatsApp Concierge</span>
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              If you require emergency dispatch for a special occasion or ritual, contact our direct WhatsApp Concierge immediately upon placing your order. We prioritize packaging and courier booking for urgent orders.
            </p>
          </section>

          <hr className="border-gray-100" />

          <section className="space-y-4">
            <h2 className="text-xl font-medium tracking-tight text-gray-900 flex items-center gap-2">
              <ArrowClockwise size={22} className="text-[#3d7b32]" weight="bold" />
              <span>Returns & Refunds</span>
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                Because our cosmetic formulations contain active botanical extracts and natural oils, items must remain unopened and in their original tamper-evident seal to be eligible for returns due to hygiene regulations.
              </p>
              <p>
                If your parcel arrived damaged in transit or you received an incorrect item, please notify us within 48 hours of delivery at <strong>{siteConfig.supportEmail}</strong> or via WhatsApp with a photo, and our team will issue an immediate replacement or refund.
              </p>
            </div>
          </section>

        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#3d7b32] text-white py-3.5 px-8 rounded-xl font-medium text-sm hover:bg-[#2c5a24] transition-colors shadow-sm"
          >
            <span>Browse Botanical Range</span>
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>

      </div>
    </main>
  );
}
