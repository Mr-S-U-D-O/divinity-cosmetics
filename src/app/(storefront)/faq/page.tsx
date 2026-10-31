import React from "react";
import Link from "next/link";
import { Question, Sparkle, WhatsappLogo, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/config/site";

export const metadata = {
  title: "Frequently Asked Questions | Divinity Cosmetics",
  description: "Find answers regarding orders, WhatsApp direct checkout, payment methods, shipping times, and our botanical ingredients.",
};

const FAQS = [
  {
    q: "How does the WhatsApp Concierge checkout work?",
    a: `Simply browse our collection on ${siteConfig.domain}, add your favorite botanical products to your cart, and click 'Proceed to Checkout'. Enter your delivery details and tap 'Place Order via WhatsApp Concierge'. This immediately sends your complete order and delivery address to our team on WhatsApp, where we confirm availability and provide simple, instant payment instructions.`,
  },
  {
    q: "Why are orders currently routed through WhatsApp instead of direct card entry?",
    a: `We are currently conducting final banking security and encryption compliance audits with our South African merchant gateway ahead of our full public launch. To ensure zero payment interruptions or security concerns for our clients, our founders are personally overseeing every priority order via WhatsApp with white-glove service.`,
  },
  {
    q: "What payment methods are supported for WhatsApp orders?",
    a: `We accept Instant EFT across all major South African banks (Capitec, FNB, Standard Bank, Nedbank, Absa, Discovery Bank), Capitec Pay, direct bank transfer, and SnapScan. Proof of payment or instant verification is processed immediately in chat.`,
  },
  {
    q: "How much is delivery and how long does it take?",
    a: `Delivery is flat R100 nationwide, and completely FREE for all orders of R500 or more. Deliveries to main metropolitan areas (Johannesburg, Pretoria, Cape Town, Durban) take 2 to 4 business days. Regional areas take 3 to 5 business days via registered courier.`,
  },
  {
    q: "Are Divinity Cosmetics formulations all-natural and cruelty-free?",
    a: `Yes, 100%. Our formulations are developed with cold-pressed Marula oil, wild-harvested Baobab, Cape Chamomile, and nourishing botanical extracts. We never test on animals and avoid harsh synthetic parabens, sulphates, and mineral oils.`,
  },
  {
    q: "Can I become an authorized reseller or stockist?",
    a: `Yes! We offer favorable wholesale margins and dedicated brand assets for salons, spas, dermatologists, and independent beauty stockists across Southern Africa. You can apply directly through our Reseller Portal.`,
  },
];

export default function FAQPage() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    "Hi Divinity Cosmetics! I have a question about placing an order."
  )}`;

  return (
    <main className="min-h-screen bg-[#fafafa] pt-32 md:pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-[#1a1a1a]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8efe7] text-[#3d7b32] rounded-full text-[11px] font-bold tracking-widest uppercase mb-4">
            <Question size={14} weight="bold" />
            <span>Got Questions?</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Everything you need to know about our South African botanicals, priority ordering, and courier fulfillment.
          </p>
        </div>

        {/* Accordion / List */}
        <div className="space-y-4 mb-16">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm transition-all hover:border-gray-200"
            >
              <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-3 tracking-tight">
                {faq.q}
              </h2>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Still have questions banner */}
        <div className="bg-white border border-[#3d7b32]/20 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-[#25D366] rounded-xl flex items-center justify-center mx-auto">
            <WhatsappLogo size={28} weight="fill" />
          </div>
          <h3 className="text-xl font-medium text-gray-900">Have a Question Not Listed Here?</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Chat directly with our team on WhatsApp or send us an email. We're always delighted to assist with recommendations or custom orders.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white py-3 px-6 rounded-xl font-bold text-sm hover:bg-[#1ebd5a] transition-all shadow-sm"
            >
              <WhatsappLogo size={18} weight="fill" />
              <span>Ask on WhatsApp</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all"
            >
              <span>Contact Page</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
