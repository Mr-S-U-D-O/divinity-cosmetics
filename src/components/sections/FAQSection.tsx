import React from "react";
import Link from "next/link";
import { ArrowUpRight, CaretDown } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/config/site";

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
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="faq-section-inner">
        <div className="faq-intro">
          <h2 id="faq-heading" className="faq-heading">
            The facts,
            <br />
            <em>unfiltered.</em>
          </h2>
          <p className="faq-intro-copy">
            No marketing fluff or overnight miracle claims—just the science behind cold-pressed African botanicals, 24-hour barrier protection, and nationwide delivery.
          </p>
          <Link href="/faq" className="faq-link">
            Read all barrier &amp; order FAQs
            <ArrowUpRight size={17} weight="bold" />
          </Link>
        </div>

        <div className="faq-list">
          {HOMEPAGE_FAQ_ITEMS.map((item, index) => (
            <details className="faq-item" key={item.question}>
              <summary>
                <span className="faq-number">0{index + 1}</span>
                <span className="faq-question">{item.question}</span>
                <CaretDown className="faq-chevron" size={18} weight="bold" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
