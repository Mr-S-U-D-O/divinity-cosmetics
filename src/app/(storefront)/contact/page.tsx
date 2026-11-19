import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import {
  WhatsappLogo,
  EnvelopeSimple,
  MapPin,
  Clock,
  Sparkle,
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
    <main className="min-h-screen bg-white pt-32 md:pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, contactPageSchema]),
        }}
      />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full text-[11px] font-bold tracking-widest uppercase mb-4">
            <Sparkle size={14} weight="fill" />
            <span>Direct South African Concierge</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-4">
            We&apos;re Here to Assist You
          </h1>
          <p className="text-black text-base leading-relaxed">
            Whether you have questions about our 400ml Marula &amp; Baobab Body Lotion (R400), want advice on starting your 90-day barrier repair cycle, or are inquiring about stockist territories, our team responds directly.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: WhatsApp Concierge */}
          <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center border-2 border-[#25D366]">
                <WhatsappLogo size={28} weight="fill" style={{ color: "#25D366" }} />
              </div>
              <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-gray-900">
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
                  <Sparkle size={16} className="text-green shrink-0" weight="bold" />
                  <span>Typical response time: Under 15 minutes</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-black">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full !bg-[#25D366] !border-2 !border-[#25D366] !text-white hover:!bg-[#20ba5a] hover:!border-[#20ba5a] text-xs sm:text-sm text-center"
              >
                <WhatsappLogo size={20} weight="fill" style={{ color: "#ffffff" }} className="shrink-0" />
                <span>Chat on WhatsApp <span className="whitespace-nowrap">({siteConfig.whatsappNumber})</span></span>
              </a>
            </div>
          </div>

          {/* Card 2: Official Support Email */}
          <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-900 flex items-center justify-center border-2 border-black">
                <EnvelopeSimple size={28} weight="regular" />
              </div>
              <h2 className="text-2xl font-medium tracking-tight text-gray-900">
                Official Email Support
              </h2>
              <p className="text-sm text-black leading-relaxed">
                For formal inquiries, order receipts, authorized stockist verification, press, and customer service documentation.
              </p>
              <div className="pt-2 space-y-2 text-xs text-black">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-700" weight="bold" />
                  <span>Proudly Handcrafted &amp; Dispatched in South Africa</span>
                </div>
                <div className="flex items-center gap-2">
                  <EnvelopeSimple size={16} className="text-gray-700" weight="bold" />
                  <span className="font-medium text-gray-900">
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
        <div className="bg-[#faf9f6] border border-black rounded-2xl p-8 text-center max-w-3xl mx-auto space-y-4">
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
