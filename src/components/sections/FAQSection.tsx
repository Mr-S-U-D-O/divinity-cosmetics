import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/config/site";
import { FAQAccordion } from "@/components/ui/FAQAccordion";

export const HOMEPAGE_FAQ_ITEMS = [
  {
    question: "Why does Divinity take a few minutes to sink in instead of vanishing in 5 seconds?",
    answer:
      "A lotion that vanishes in five seconds isn't 'fast-absorbing'—it is mostly water, alcohol, and synthetic slip evaporating into thin air, which is why ashiness returns by midday. Divinity Marula & Baobab Body Lotion is formulated with dense, cold-pressed African botanical seed oils that take 2 to 3 minutes to sink in, forming a physical 24-hour seal against the South African climate.",
  },
  {
    question: "How does the 90-Day Barrier Repair cycle improve crepey, mature skin?",
    answer:
      "Healthy, resilient skin is not built by overnight miracle claims. Age-related moisture loss and a thinning skin barrier on your arms, legs, and décolletage require consistent lipid nutrition. Feeding your skin high concentrations of cold-pressed Marula (oleic acid & Vitamin E) and Baobab (Omegas 3, 6 & 9) daily over a 90-day cellular turnover cycle visibly softens crepey texture and restores lasting elasticity.",
  },
  {
    question: "Why is the 400ml Marula & Baobab Body Lotion priced at R400?",
    answer:
      "You already invest R300 to R1,000 in facial serums because you refuse to put cheap fillers on your face. Your body faces the exact same UV, dry Highveld winters, and hard municipal water. At R400 for a generous 400ml bottle (R1.00 per ml), Divinity replaces ineffective R100 supermarket pumps with undiluted, facial-grade botanical nutrition you can use every day.",
  },
  {
    question: "How do I order and how much is nationwide delivery in South Africa?",
    answer: `Order online at ${siteConfig.domain} via instant Paystack checkout (Visa, Mastercard, Capitec Pay, Ozow Instant EFT, Apple Pay) or through our personal WhatsApp Concierge. Door-to-door courier delivery is R100 nationwide across all 9 provinces, and completely FREE on orders over R500 (such as two 400ml bottles for your 90-day cycle).`,
  },
];

export function FAQSection() {
  return (
    <section
      className="w-full bg-[#fcfbf9] px-5 sm:px-8 lg:px-12 py-24 md:py-32"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Sticky Intro */}
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-green mb-4 block">
            Common Questions
          </span>
          <h2
            id="faq-heading"
            className="font-chloe text-4xl sm:text-5xl lg:text-[3.5rem] font-normal leading-[1.02] tracking-tight text-black m-0 mb-5"
          >
            The facts,
            <br />
            <em className="italic text-[#3d7b32]">unfiltered.</em>
          </h2>
          <div className="text-sm sm:text-[15px] leading-relaxed text-black/80 max-w-[34ch] mb-7">
            The science behind cold-pressed African botanicals, 24-hour barrier protection, and nationwide delivery.
          </div>
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:text-green border-b border-black hover:border-green pb-1.5 transition-colors group"
          >
            <span>Read all FAQs</span>
            <ArrowUpRight
              size={14}
              weight="regular"
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* Right Clean Hairline Accordion */}
        <div className="lg:col-span-7">
          <FAQAccordion items={HOMEPAGE_FAQ_ITEMS} defaultOpenIndex={0} />
        </div>
      </div>
    </section>
  );
}
