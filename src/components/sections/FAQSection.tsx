import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/config/site";
import { FAQAccordion } from "@/components/ui/FAQAccordion";

export const HOMEPAGE_FAQ_ITEMS = [
  {
    question: "Why does Divinity take 2 to 3 minutes to sink in instead of vanishing in 5 seconds?",
    answer:
      "Lotions that vanish in five seconds are up to 80–85% water, alcohol, and volatile carriers that evaporate quickly, leaving skin ashy by midday. Divinity Marula & Baobab Body Lotion uses dense, cold-pressed African botanical seed oils that take 2 to 3 minutes to absorb and form a 24-hour barrier seal.",
  },
  {
    question: "How does the 90-day barrier repair cycle improve crepey, mature skin?",
    answer:
      "Age-related moisture loss and a thinning moisture barrier on arms, legs, and décolletage respond to steady lipid nutrition rather than overnight promises. Daily use of cold-pressed Marula oil (70–78% oleic acid, Vitamins C and E) and Baobab oil (Omegas 3, 6, and 9) softens crepey texture over a 90-day turnover cycle.",
  },
  {
    question: "Why is the 400ml Marula & Baobab Body Lotion priced at R400?",
    answer:
      "Many South African women spend R300 to R1,000 on facial serums while settling for R80 to R150 water-based supermarket pumps for the rest of their body. At R400 for 400ml (R1.00 per ml), Divinity delivers undiluted, facial-grade botanical nutrition built for daily full-body use.",
  },
  {
    question: "How do I order and how are courier delivery rates calculated in South Africa?",
    answer: `Order online at ${siteConfig.domain} with Paystack (Visa, Mastercard, Capitec Pay, Ozow Instant EFT, Apple Pay) or via our WhatsApp Concierge. Door-to-door shipping across all 9 provinces is handled by The Courier Guy from Springs, Gauteng, with live rates calculated at checkout (economy from around R142 in 2–4 business days for main centres).`,
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
            Cold-pressed African seed oils, 24-hour barrier protection, and nationwide South African delivery.
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
