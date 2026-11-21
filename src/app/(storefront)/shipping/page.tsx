import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  ArrowClockwise,
} from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbSchema,
  buildShippingWebPageSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";

export const metadata: Metadata = buildPageMetadata({
  title: "Shipping & Returns Policy",
  description:
    "Nationwide courier delivery across all 9 South African provinces via The Courier Guy from Springs, Gauteng. Live rates at checkout and 14-day returns.",
  path: "/shipping",
  keywords: [
    "Divinity Cosmetics shipping",
    "The Courier Guy South Africa skincare delivery",
    "Divinity Cosmetics returns policy",
    "Springs Gauteng dispatch skincare",
  ],
});

export default function ShippingPage() {
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Shipping & Returns", path: "/shipping" },
  ]);
  const shippingWebPageJsonLd = buildShippingWebPageSchema();

  return (
    <main className="min-h-screen bg-[#fcfbf9] pt-32 md:pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([breadcrumbJsonLd, shippingWebPageJsonLd]),
        }}
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
            Every 400ml bottle of our Marula &amp; Baobab Body Lotion is prepared in small batches and dispatched from Springs, Gauteng via The Courier Guy to addresses across South Africa.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white border-2 border-black p-6 rounded-2xl text-center space-y-2">
            <span className="text-2xl font-bold text-green block">
              From ~R142
            </span>
            <p className="text-xs text-black uppercase tracking-wider font-semibold">
              Live Courier Guy Rates
            </p>
            <p className="text-xs text-black">
              Calculated live at checkout by suburb. Economy, Overnight Express, and Gauteng Same-Day options.
            </p>
          </div>

          <div className="bg-white border-2 border-black p-6 rounded-2xl text-center space-y-2">
            <span className="text-2xl font-bold text-green block">2–4 Days</span>
            <p className="text-xs text-black uppercase tracking-wider font-semibold">
              Springs, Gauteng Dispatch
            </p>
            <p className="text-xs text-black">
              Door-to-door delivery via The Courier Guy across all 9 South African provinces.
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
                We deliver to residential and business addresses across Gauteng, Western Cape, KwaZulu-Natal, Eastern Cape, Free State, Mpumalanga, Limpopo, North West, and Northern Cape. Live courier pricing is calculated at checkout based on your suburb and service tier:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-black">
                <li>
                  <strong>Main Metropolitan Centres (JHB, PTA, CPT, DBN):</strong> 2 to 4 business days via Economy Road Freight (from around R142) or 1–2 days via Overnight Express.
                </li>
                <li>
                  <strong>Regional &amp; Outlying Areas:</strong> 3 to 5 business days nationwide.
                </li>
                <li>
                  <strong>Gauteng Same-Day Express:</strong> Available for qualifying Gauteng suburbs on orders placed before 11:00.
                </li>
                <li>
                  <strong>Tracking:</strong> Follow your parcel anytime on our{" "}
                  <Link href="/order-status" className="underline underline-offset-4 hover:text-green">
                    order tracking page
                  </Link>{" "}
                  or via email and WhatsApp notifications.
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
              Need priority dispatch, delivery instructions added to your waybill, or EFT checkout help? Message our{" "}
              <Link href="/contact" className="underline underline-offset-4 hover:text-green">
                WhatsApp Concierge ({siteConfig.whatsappNumber})
              </Link>{" "}
              with your order number.
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
                Because our formulations contain unrefined cold-pressed Marula and Baobab oils without harsh synthetic preservatives, items must remain unopened with their tamper-evident seal intact to qualify for standard 14-day returns under South African hygiene rules.
              </p>
              <p>
                If your parcel arrived damaged in transit or you received the wrong item, email{" "}
                <strong>{siteConfig.supportEmail}</strong> or message WhatsApp within 48 hours of delivery with a photo for a free replacement or full refund. See our{" "}
                <Link href="/faq" className="underline underline-offset-4 hover:text-green">
                  FAQ
                </Link>{" "}
                for more order answers.
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
