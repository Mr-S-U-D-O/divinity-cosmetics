import React from "react";
import Link from "next/link";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/config/site";

export const metadata = {
  title: "Privacy Policy | Divinity Cosmetics",
  description: "Privacy policy and POPIA compliance for Divinity Cosmetics.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] pt-32 md:pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-[#1a1a1a]">
      <div className="max-w-3xl mx-auto space-y-10">
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8efe7] text-[#3d7b32] rounded-full text-[11px] font-bold tracking-widest uppercase">
            <ShieldCheck size={14} weight="bold" />
            <span>POPIA Compliant</span>
          </div>
          <h1 className="text-4xl font-medium tracking-tight text-gray-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500">
            Last updated: October 2026 · Official Domain: {siteConfig.domain}
          </p>
        </div>

        <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-2xl shadow-sm text-sm text-gray-700 leading-relaxed space-y-8">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">1. Commitment to Your Privacy</h2>
            <p>
              Divinity Cosmetics ("we", "us", or "our") operates {siteConfig.domain}. We are fully committed to protecting your personal information and ensuring compliance with the South African Protection of Personal Information Act (POPIA).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">2. Information We Collect</h2>
            <p>
              When you browse our catalog or place an order via our WhatsApp Concierge, we collect only the necessary information to fulfill your purchase:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Full name, delivery street address, suburb, city, province, and postal code.</li>
              <li>WhatsApp phone number and email address for order notifications and courier dispatch tracking.</li>
              <li>Order selections and special delivery requests.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">3. How We Use and Protect Your Data</h2>
            <p>
              Your contact and shipping details are used strictly for order fulfillment, courier delivery via registered South African courier partners, and direct customer care communication. We never sell, rent, or trade your personal information with third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">4. Contact Our Information Officer</h2>
            <p>
              If you have any questions regarding your personal information, or wish to update or delete your customer record, please reach out directly to our Information Officer at <strong>{siteConfig.supportEmail}</strong>.
            </p>
          </section>
        </div>

      </div>
    </main>
  );
}
