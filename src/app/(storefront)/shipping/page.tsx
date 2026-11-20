import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  ArrowClockwise,
} from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/config/site";
import { buildBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title:
    "Shipping & Returns Policy | Nationwide South African Courier Delivery",
  description:
    "Door-to-door courier delivery across all 9 South African provinces for Divinity Cosmetics. Flat R100 shipping, FREE delivery on orders over R500 (such as two 400ml Marula & Baobab Body Lotions), and our 14-day purity guarantee.",
  alternates: {
    canonical: "/shipping",
  },
  openGraph: {
    title:
      "Shipping & Returns Across South Africa | Divinity Cosmetics",
    description:
      "Fast 2–4 day metropolitan courier dispatch across South Africa. Free nationwide shipping on orders over R500.",
    url: `${siteConfig.url}/shipping`,
    type: "website",
  },
};

export default function ShippingPage() {
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Shipping & Returns", path: "/shipping" },
  ]);

  return (
    <main className="min-h-screen bg-[#fcfbf9] pt-32 md:pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-green block mb-4">
            South Africa Nationwide Delivery
          </span>
          <h1 className="font-chloe text-4xl md:text-5xl font-normal tracking-tight text-black mb-4">
            Shipping &amp; Returns
          </h1>
          <p className="text-black text-base leading-relaxed">
            Every 400ml bottle of our Marula &amp; Baobab Body Lotion is freshly prepared in small batches and carefully packed for door-to-door courier delivery across South Africa.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white border-2 border-black p-6 rounded-2xl text-center space-y-2">
            <span className="text-2xl font-bold text-green block">
              Free Delivery
            </span>
            <p className="text-xs text-black uppercase tracking-wider font-semibold">
              Orders Over R500
            </p>
            <p className="text-xs text-black">
              Flat R100 under R500. Two 400ml bottles (R800) ship free nationwide.
            </p>
          </div>

          <div className="bg-white border-2 border-black p-6 rounded-2xl text-center space-y-2">
            <span className="text-2xl font-bold text-green block">2–4 Days</span>
            <p className="text-xs text-black uppercase tracking-wider font-semibold">
              Fast Courier Dispatch
            </p>
            <p className="text-xs text-black">
              Dispatched via registered door-to-door South African courier services.
            </p>
          </div>

          <div className="bg-white border-2 border-black p-6 rounded-2xl text-center space-y-2">
            <span className="text-2xl font-bold text-green block">14 Days</span>
            <p className="text-xs text-black uppercase tracking-wider font-semibold">
              Purity Guarantee
            </p>
            <p className="text-xs text-black">
              Immediate replacement or refund for transit-damaged or incorrect items.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white border-2 border-black rounded-2xl p-8 md:p-12 space-y-10">
          <section className="space-y-4">
            <h2 className="text-xl font-medium tracking-tight text-gray-900 flex items-center gap-2">
              <Truck size={22} className="text-green" weight="bold" />
              <span>Courier Delivery Across All 9 Provinces</span>
            </h2>
            <div className="text-sm text-black leading-relaxed space-y-3">
              <p>
                We deliver to all residential and business addresses across South Africa, covering Gauteng, Western Cape, KwaZulu-Natal, Eastern Cape, Free State, Mpumalanga, Limpopo, North West, and Northern Cape.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-black">
                <li>
                  <strong>Main Metropolitan Centers (JHB, PTA, CPT, DBN):</strong> 2 to 4 business days.
                </li>
                <li>
                  <strong>Regional &amp; Outlying Areas:</strong> 3 to 5 business days.
                </li>
                <li>
                  <strong>Tracking:</strong> Real-time courier tracking link sent via email and WhatsApp upon dispatch.
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-t border-black" />

          <section className="space-y-4">
            <h2 className="text-xl font-medium tracking-tight text-gray-900 flex items-center gap-2">
              <ShieldCheck size={22} className="text-green" weight="bold" />
              <span>Priority Orders &amp; WhatsApp Concierge</span>
            </h2>
            <p className="text-sm text-black leading-relaxed">
              Need priority dispatch or assistance combining bottles to qualify for free delivery over R500? Message our WhatsApp Concierge directly upon placing your order and our dispatch team will prioritize your parcel.
            </p>
          </section>

          <hr className="border-t border-black" />

          <section className="space-y-4">
            <h2 className="text-xl font-medium tracking-tight text-gray-900 flex items-center gap-2">
              <ArrowClockwise size={22} className="text-green" weight="bold" />
              <span>Returns &amp; Refunds</span>
            </h2>
            <div className="text-sm text-black leading-relaxed space-y-3">
              <p>
                Because our formulations contain active, unrefined cold-pressed Marula and Baobab oils without harsh synthetic preservatives, items must remain unopened and in their original tamper-evident seal to be eligible for standard 14-day returns under South African hygiene regulations.
              </p>
              <p>
                If your parcel arrived damaged in transit or you received an incorrect item, notify us within 48 hours of delivery at <strong>{siteConfig.supportEmail}</strong> or via WhatsApp with a photo for an immediate free replacement or full refund.
              </p>
            </div>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/products/marula-baobab-body-lotion"
            className="btn-primary"
          >
            <span>Shop 400ml Marula &amp; Baobab Body Lotion — R400</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
