"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FAQAccordion, FAQAccordionItem } from "@/components/ui/FAQAccordion";

type FAQCategory = "All" | "Formulation" | "90-Day Care" | "Orders & Stockists";

interface CategorizedFAQ extends FAQAccordionItem {
  category: Exclude<FAQCategory, "All">;
}

interface FAQClientProps {
  faqs: CategorizedFAQ[];
  whatsappUrl: string;
}

const CATEGORIES: FAQCategory[] = [
  "All",
  "Formulation",
  "90-Day Care",
  "Orders & Stockists",
];

export function FAQClient({ faqs, whatsappUrl }: FAQClientProps) {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("All");

  const filteredFaqs = useMemo(() => {
    if (activeCategory === "All") return faqs;
    return faqs.filter((item) => item.category === activeCategory);
  }, [activeCategory, faqs]);

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Sticky Header & Clean Topic Filters */}
        <div className="lg:col-span-4 lg:sticky lg:top-32">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-green mb-4 block">
            Support &amp; Formulation
          </span>
          <h1 className="font-chloe text-4xl sm:text-5xl font-normal leading-[1.04] tracking-tight text-black m-0 mb-5">
            Frequently Asked Questions
          </h1>
          <div className="text-sm sm:text-[15px] leading-relaxed text-black/80 max-w-[34ch] mb-6">
            Clear answers on cold-pressed Marula &amp; Baobab oils, the 90-day barrier cycle, and South African delivery.
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] mb-7">
            <Link href="/rituals" className="text-black/80 hover:text-green underline underline-offset-4">
              90-Day Ritual
            </Link>
            <Link href="/shipping" className="text-black/80 hover:text-green underline underline-offset-4">
              Shipping
            </Link>
            <Link href="/about#founders-note" className="text-black/80 hover:text-green underline underline-offset-4">
              Founder&apos;s Note
            </Link>
            <Link href="/reseller" className="text-black/80 hover:text-green underline underline-offset-4">
              Stockists
            </Link>
          </div>

          {/* Minimalist Topic Tabs */}
          <div
            role="tablist"
            aria-label="Filter questions by topic"
            className="flex flex-wrap lg:flex-col items-start gap-2.5 sm:gap-3"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              const count =
                category === "All"
                  ? faqs.length
                  : faqs.filter((f) => f.category === category).length;

              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] py-1 transition-colors cursor-pointer border-b ${
                    isActive
                      ? "text-black font-semibold border-black"
                      : "text-black/60 hover:text-black border-transparent"
                  }`}
                >
                  <span>{category}</span>
                  <span className="text-[10px] text-black/50">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Clean Hairline Accordion */}
        <div className="lg:col-span-8">
          <FAQAccordion
            key={activeCategory}
            items={filteredFaqs}
            defaultOpenIndex={0}
          />
        </div>
      </div>

      {/* Minimalist Bottom Assurance Strip */}
      <div className="mt-20 pt-12 border-t border-black flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-lg">
          <h2 className="font-chloe text-2xl sm:text-3xl font-normal tracking-tight text-black m-0 mb-2">
            Still have a question?
          </h2>
          <div className="text-sm sm:text-[15px] text-black/65 leading-relaxed">
            Shop our flagship 400ml formulation or message our botanical team directly on WhatsApp.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Link
            href="/products/marula-baobab-body-lotion"
            className="btn-primary whitespace-nowrap justify-center"
          >
            <span>Shop 400ml Lotion · R400</span>
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary whitespace-nowrap justify-center"
          >
            <span>Ask on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
