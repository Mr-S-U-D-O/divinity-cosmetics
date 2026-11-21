import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbSchema,
  buildPrivacyWebPageSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy & POPIA",
  description:
    "POPIA privacy notice, Paystack payment security, and customer data protection practices for Divinity Cosmetics South Africa (shopdivinitycosmetics.co.za).",
  path: "/privacy",
  keywords: [
    "Divinity Cosmetics privacy policy",
    "Divinity Cosmetics POPIA compliance",
    "Paystack payment security South Africa",
  ],
});

export default function PrivacyPage() {
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy" },
  ]);
  const privacyWebPageJsonLd = buildPrivacyWebPageSchema();

  return (
    <main className="min-h-screen bg-[#fcfbf9] pt-32 md:pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([breadcrumbJsonLd, privacyWebPageJsonLd]),
        }}
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
              {siteConfig.legalName} (&ldquo;Divinity Cosmetics&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates {siteConfig.domain}. We protect your personal information in strict compliance with the South African Protection of Personal Information Act, 4 of 2013 (POPIA).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">
              2. Information We Collect
            </h2>
            <p>
              When you purchase our{" "}
              <Link href="/products/marula-baobab-body-lotion" className="underline underline-offset-4 hover:text-green">
                400ml Marula &amp; Baobab Body Lotion
              </Link>{" "}
              via Paystack or WhatsApp, or apply to become an{" "}
              <Link href="/reseller" className="underline underline-offset-4 hover:text-green">
                authorized stockist
              </Link>
              , we collect only the details needed to fulfil your request:
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
              Your contact and shipping details are used solely for order fulfilment, door-to-door courier delivery (see our{" "}
              <Link href="/shipping" className="underline underline-offset-4 hover:text-green">
                Shipping &amp; Returns Policy
              </Link>
              ), and customer care. We never sell, rent, or trade personal information with third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">
              4. Contact Our Information Officer
            </h2>
            <p>
              If you have questions about your personal information, or wish to access, update, or delete your customer record under POPIA, email our Information Officer at{" "}
              <strong>{siteConfig.supportEmail}</strong> or reach us via our{" "}
              <Link href="/contact" className="underline underline-offset-4 hover:text-green">
                Contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
