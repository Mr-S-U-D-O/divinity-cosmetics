"use client";

import React, { useId, useState } from "react";
import { Plus, Minus } from "@phosphor-icons/react";
import { motion } from "motion/react";

export interface FAQAccordionItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQAccordionProps {
  items: FAQAccordionItem[];
  defaultOpenIndex?: number | null;
}

/**
 * Minimalist hairline-divided FAQ accordion shared across storefront sections.
 */
export function FAQAccordion({
  items,
  defaultOpenIndex = 0,
}: FAQAccordionProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="border-t border-black">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.question} className="border-b border-black">
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => handleToggle(index)}
              className="w-full py-5 sm:py-6 flex items-start sm:items-center justify-between gap-6 text-left cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3d7b32]"
            >
              <span className="font-system text-[15px] sm:text-[17px] font-semibold tracking-tight text-black group-hover:text-green transition-colors leading-snug">
                {item.question}
              </span>
              <span
                className="text-black group-hover:text-green transition-colors shrink-0 mt-0.5 sm:mt-0"
                aria-hidden="true"
              >
                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
              </span>
            </button>

            {/* Always rendered in SSR DOM so search & AI crawlers index full answers; collapsed visually via height: 0 */}
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              inert={!isOpen || undefined}
              initial={false}
              animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-6 pr-6 sm:pr-12 text-sm sm:text-[15px] leading-relaxed text-black/80 max-w-[62ch]">
                {item.answer}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
