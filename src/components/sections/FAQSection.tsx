import React from "react";
import Link from "next/link";
import { ArrowUpRight, CaretDown, Question } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/config/site";

const FAQ_ITEMS = [
  {
    question: "How do I place an order?",
    answer: `Choose your formulations, add them to your cart, and continue to checkout. Our ${siteConfig.domain} concierge will confirm your order, delivery details, and payment instructions personally.`,
  },
  {
    question: "How much is delivery?",
    answer: `Delivery is R100 nationwide and free for orders over R500. Main metropolitan areas typically arrive within 2–4 business days, with regional deliveries taking 3–5 business days.`,
  },
  {
    question: "What makes your formulations different?",
    answer: "Each formulation is created around carefully selected South African botanicals, including cold-pressed Marula, Baobab, and Cape Chamomile. We focus on considered ingredients, comfortable textures, and everyday rituals that restore rather than overwhelm.",
  },
  {
    question: "Are your products cruelty-free?",
    answer: "Yes. Divinity Cosmetics is proudly cruelty-free. Our products are made for real routines and real skin, with no animal testing.",
  },
];

export function FAQSection() {
  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="faq-section-inner">
        <div className="faq-intro">
          <div className="faq-eyebrow">
            <Question size={15} weight="bold" />
            <span>A little clarity</span>
          </div>
          <h2 id="faq-heading" className="faq-heading">
            Your questions,
            <br />
            <em>answered.</em>
          </h2>
          <p className="faq-intro-copy">
            From first order to final delivery, here are the details that make
            choosing your botanical ritual feel effortless.
          </p>
          <Link href="/faq" className="faq-link">
            Explore all questions
            <ArrowUpRight size={17} weight="bold" />
          </Link>
        </div>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, index) => (
            <details className="faq-item" key={item.question} open={index === 0}>
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
