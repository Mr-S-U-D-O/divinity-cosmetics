import type { Metadata } from "next";
import React from "react";
import { siteConfig } from "@/lib/config/site";
import { buildBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Privacy Policy & POPIA Compliance",
  description:
    "Privacy policy, Paystack payment security, and South African Protection of Personal Information Act (POPIA) compliance for Divinity Cosmetics (shopdivinitycosmetics.co.za).",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy" },
  ]);

  return (
    <main className="min-h-screen bg-[#fcfbf9] pt-32 md:pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="space-y-4">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-green block">
            POPIA Compliant · South Africa
          </span>
          <h1 className="font-chloe text-4xl font-normal tracking-tight text-black">
            Privacy Policy
          </h1>
          <p className="text-xs text-black/75">
            Last updated: November 2026 · Official Domain: {siteConfig.domain}
          </p>
        </div>

        <div className="bg-white border-2 border-black p-8 md:p-12 rounded-2xl text-sm text-black leading-relaxed space-y-8">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">
              1. Commitment to Your Privacy (POPIA)
            </h2>
            <p>
              {siteConfig.legalName} (&ldquo;Divinity Cosmetics&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates {siteConfig.domain}. We are committed to protecting your personal information in strict compliance with the South African Protection of Personal Information Act, 4 of 2013 (POPIA).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">
              2. Information We Collect
            </h2>
            <p>
              When you purchase our Marula &amp; Baobab Body Lotion via Paystack online checkout or our WhatsApp Concierge, or apply to become an authorized stockist, we collect only the details required to fulfill your request:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-black">
              <li>
                Full name, delivery street address, suburb, city, province, and postal code.
              </li>
              <li>
                Phone number and email address for Paystack receipts, order notifications, and courier tracking.
              </li>
              <li>
                Payment processing is handled directly via Paystack (PCI-DSS Level 1 certified); we never store raw credit or debit card numbers on our servers.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">
              3. How We Use and Protect Your Data
            </h2>
            <p>
              Your contact and shipping details are used strictly for order fulfillment, door-to-door delivery via registered South African courier partners, and direct customer care communication. We never sell, rent, or trade your personal information with third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">
              4. Contact Our Information Officer
            </h2>
            <p>
              If you have any questions regarding your personal information, or wish to access, update, or delete your customer record under POPIA, please contact our Information Officer at <strong>{siteConfig.supportEmail}</strong>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
