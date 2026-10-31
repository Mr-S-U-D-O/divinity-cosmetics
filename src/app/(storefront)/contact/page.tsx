import React from "react";
import Link from "next/link";
import { 
  WhatsappLogo, 
  EnvelopeSimple, 
  MapPin, 
  Clock, 
  Sparkle,
  ArrowRight
} from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/config/site";

export const metadata = {
  title: "Contact Us | Divinity Cosmetics",
  description: "Connect with the Divinity Cosmetics team via WhatsApp concierge or email for orders, customer support, and stockist inquiries.",
};

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    "Hi Divinity Cosmetics team! I'm reaching out from shopdivinitycosmetics.co.za with an inquiry."
  )}`;

  return (
    <main className="min-h-screen bg-white pt-32 md:pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-[#1a1a1a]">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8efe7] text-[#3d7b32] rounded-full text-[11px] font-bold tracking-widest uppercase mb-4">
            <Sparkle size={14} weight="fill" />
            <span>Dedicated Customer Care</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-4">
            We're Here to Assist You
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Whether you have questions about our botanical formulations, need assistance with an urgent order, or want to discuss stockist partnerships, our team is directly available.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Card 1: WhatsApp Concierge */}
          <div className="bg-white border border-[#3d7b32]/20 rounded-2xl p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center">
                <WhatsappLogo size={28} weight="fill" />
              </div>
              <h2 className="text-2xl font-medium tracking-tight text-gray-900">
                Direct WhatsApp Concierge
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Connect instantly with our team for priority orders, payment assistance, skin consultations, and real-time delivery tracking.
              </p>
              <div className="pt-2 space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#3d7b32]" weight="bold" />
                  <span>Mon – Sat: 08:00 – 18:00 (SAST)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkle size={16} className="text-[#3d7b32]" weight="bold" />
                  <span>Typical response time: Under 15 minutes</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 px-6 rounded-xl font-bold text-sm hover:bg-[#1ebd5a] transition-all shadow-sm"
              >
                <WhatsappLogo size={20} weight="fill" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 2: Official Support Email */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-8 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-900 flex items-center justify-center">
                <EnvelopeSimple size={28} weight="regular" />
              </div>
              <h2 className="text-2xl font-medium tracking-tight text-gray-900">
                Official Email Support
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                For formal inquiries, reseller verification, press, and customer service documentation.
              </p>
              <div className="pt-2 space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-700" weight="bold" />
                  <span>Proudly Handcrafted & Dispatched in South Africa</span>
                </div>
                <div className="flex items-center gap-2">
                  <EnvelopeSimple size={16} className="text-gray-700" weight="bold" />
                  <span className="font-medium text-gray-900">{siteConfig.supportEmail}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-900 py-3.5 px-6 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
              >
                <span>Email {siteConfig.supportEmail}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Pre-launch Notice Box */}
        <div className="bg-[#e8efe7]/60 border border-[#3d7b32]/20 rounded-2xl p-8 text-center max-w-3xl mx-auto space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Looking to Place an Order?</h3>
          <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Our online store at <strong>{siteConfig.domain}</strong> is open for browsing and cart building. Simply select your items and check out via our WhatsApp Concierge for direct priority fulfillment.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#3d7b32] text-white py-3 px-8 rounded-xl font-medium text-sm hover:bg-[#2c5a24] transition-colors"
            >
              <span>Explore Collection</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
