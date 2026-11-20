import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import {
  WhatsappLogo,
  EnvelopeSimple,
  MapPin,
  Clock,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/config/site";
import { buildBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title:
    "Contact Us & WhatsApp Skincare Concierge | Customer Care & Stockist Inquiries",
  description:
    "Connect directly with Divinity Cosmetics in South Africa via WhatsApp Concierge (+27 66 485 9011) or email (support@shopdivinitycosmetics.co.za) for Marula & Baobab Body Lotion orders, barrier repair guidance, and stockist inquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Divinity Cosmetics South Africa | Direct WhatsApp Concierge",
    description:
      "Personal assistance for orders, 90-day skin barrier repair questions, and wholesale stockist partnerships across South Africa.",
    url: `${siteConfig.url}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hi Divinity Cosmetics team! I'm reaching out from shopdivinitycosmetics.co.za regarding the 400ml Marula & Baobab Body Lotion."
  )}`;

  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact Us", path: "/contact" },
  ]);

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Divinity Cosmetics South Africa",
    url: `${siteConfig.url}/contact`,
    mainEntity: {
      "@id": `${siteConfig.url}/#organization`,
    },
  };

  return (
    <main className="min-h-screen bg-[#fcfbf9] pt-32 md:pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, contactPageSchema]),
        }}
      />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-green block mb-4">
            Direct South African Concierge
          </span>
          <h1 className="font-chloe text-4xl md:text-5xl font-normal tracking-tight text-black mb-4">
            We&apos;re Here to Assist You
          </h1>
          <p className="text-black text-base leading-relaxed">
            Whether you have questions about our 400ml Marula &amp; Baobab Body Lotion (R400), want advice on starting your 90-day barrier repair cycle, or are inquiring about stockist territories, our team responds directly.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: WhatsApp Concierge */}
          <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="size-12 rounded-full flex items-center justify-center border-2 border-black text-black">
                <WhatsappLogo size={22} weight="regular" />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-black">
                Direct WhatsApp Concierge
              </h2>
              <p className="text-sm text-black leading-relaxed">
                Connect instantly with our team for priority orders, assisted EFT checkout, skin barrier consultations, and real-time courier tracking across South Africa.
              </p>
              <div className="pt-2 space-y-2 text-xs text-black">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-green shrink-0" weight="bold" />
                  <span>Mon – Sat: 08:00 – 18:00 (SAST)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green shrink-0" weight="bold" />
                  <span>Typical response time: Under 15 minutes</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-xs sm:text-sm text-center"
              >
                <WhatsappLogo size={18} weight="regular" className="shrink-0" />
                <span>Chat on WhatsApp <span className="whitespace-nowrap">({siteConfig.whatsappNumber})</span></span>
              </a>
            </div>
          </div>

          {/* Card 2: Official Support Email */}
          <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="size-12 rounded-full text-black flex items-center justify-center border-2 border-black">
                <EnvelopeSimple size={22} weight="regular" />
              </div>
              <h2 className="text-2xl font-medium tracking-tight text-black">
                Official Email Support
              </h2>
              <p className="text-sm text-black leading-relaxed">
                For formal inquiries, order receipts, authorized stockist verification, press, and customer service documentation.
              </p>
              <div className="pt-2 space-y-2 text-xs text-black">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-black" weight="bold" />
                  <span>Proudly Handcrafted &amp; Dispatched in South Africa</span>
                </div>
                <div className="flex items-center gap-2">
                  <EnvelopeSimple size={16} className="text-black" weight="bold" />
                  <span className="font-medium text-black">
                    {siteConfig.supportEmail}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black">
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="btn-secondary w-full"
              >
                <span>Email {siteConfig.supportEmail}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Order Notice Box */}
        <div className="bg-[#faf8f5] border-2 border-black rounded-3xl p-8 text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl font-medium text-gray-900">
            Ready to Start Your 90-Day Barrier Repair?
          </h2>
          <p className="text-sm text-black max-w-xl mx-auto leading-relaxed">
            Order our flagship <strong>400ml Marula &amp; Baobab Body Lotion (R400)</strong> online at <strong>{siteConfig.domain}</strong> with instant Paystack checkout (Visa, Mastercard, Capitec Pay, Ozow, Apple Pay) or direct WhatsApp assistance. Free courier shipping on orders over R500.
          </p>
          <div className="pt-2">
            <Link
              href="/products/marula-baobab-body-lotion"
              className="btn-primary"
            >
              <span>Shop 400ml Body Lotion — R400</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
