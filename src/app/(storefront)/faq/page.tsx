import type { Metadata } from "next";
import React from "react";
import { siteConfig } from "@/lib/config/site";
import { buildBreadcrumbSchema, buildFAQPageSchema } from "@/lib/seo/schema";
import { FAQClient } from "./FAQClient";

export const metadata: Metadata = {
  title:
    "Frequently Asked Questions | Marula & Baobab Body Lotion, 90-Day Barrier Repair & Delivery",
  description:
    "Direct answers on why commercial lotions evaporate in 5 seconds, how Divinity Cosmetics' 400ml Marula & Baobab Body Lotion (R400) repairs crepey mature skin over 90 days, Paystack & WhatsApp checkout, and nationwide South African delivery.",
  keywords: [
    "Divinity Cosmetics FAQ",
    "why does body lotion evaporate in 5 seconds",
    "best body lotion for crepey skin South Africa",
    "Marula and Baobab body lotion price R400",
    "body lotion for Highveld winter dry skin",
    "Divinity Cosmetics delivery South Africa",
  ],
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title:
      "Frequently Asked Questions | Divinity Cosmetics South Africa",
    description:
      "Straight-talking answers on cold-pressed Marula & Baobab oils, the 5-Second Myth, the 90-Day Barrier Repair cycle, and nationwide delivery.",
    url: `${siteConfig.url}/faq`,
    type: "website",
  },
};

const FAQS = [
  {
    category: "Formulation" as const,
    question:
      "Why does a commercial supermarket lotion vanish in 5 seconds and leave my skin ashy by midday?",
    answer:
      "A lotion that disappears in five seconds isn't 'fast-absorbing'—it is simply evaporating into thin air. Standard R100 supermarket pump lotions are up to 80–85% water, alcohol, and synthetic slip fillers. Once that water evaporates, your thinning skin barrier is left unsealed against dry air, causing tightness, itching, and visible ashiness by 1 PM.",
  },
  {
    category: "Formulation" as const,
    question:
      "Why does Divinity Cosmetics Marula & Baobab Body Lotion take 2 to 3 minutes to sink in?",
    answer:
      "Real 24-hour hydration requires dense, cold-pressed African botanical seed oils that physically seal the stratum corneum. Our 400ml formulation uses high concentrations of unrefined Marula and Baobab oils rather than watery fillers. Taking two to three minutes to absorb is deliberate proof of active lipid density locking moisture in for a full 24 hours.",
  },
  {
    category: "90-Day Care" as const,
    question:
      "How does the 90-Day Barrier Repair cycle help with crepey skin on arms, legs, and décolletage?",
    answer:
      "Healthy, resilient mature skin is not built by overnight miracle claims. Crepey texture develops when age-related lipid depletion, UV exposure, and harsh winters thin the skin barrier. By feeding your skin cold-pressed Marula (oleic acid and Vitamins C & E) and Baobab (Omegas 3, 6 & 9) daily over a 90-day epidermal turnover cycle, your barrier rebuilds its structural resilience and visibly softens paper-thin texture.",
  },
  {
    category: "Formulation" as const,
    question:
      "Why is the 400ml Marula & Baobab Body Lotion priced at R400?",
    answer:
      "Most women willingly invest R300 to R1,000 in facial serums because they refuse to put synthetic fillers on their face, yet settle for R100 supermarket pumps on the other 90% of their body. At R400 for a generous 400ml bottle (R1.00 per ml), Divinity closes that 'Vanity Divide'—giving your body facial-grade, cold-pressed South African botanical nutrition without the R1,500+ price tag of imported luxury creams.",
  },
  {
    category: "90-Day Care" as const,
    question:
      "How does this lotion protect against South African Highveld winters, hard water, and UV stress?",
    answer:
      "South African skin battles severe environmental stressors: biting Highveld winter dryness, hard municipal water that strips natural sebum, intense UV exposure, and coastal humidity shifts. Applying Divinity within 3 minutes of a warm shower traps hydration beneath an occlusive Baobab omega shield that prevents trans-epidermal water loss all day.",
  },
  {
    category: "90-Day Care" as const,
    question:
      "Do you have other products besides the Marula & Baobab Body Lotion?",
    answer:
      "We are launching exclusively with our flagship 400ml Marula & Baobab Body Lotion (R400) first so you can experience our foundational 90-day barrier repair standard. We are actively preparing a full range of complementary facial-grade botanical body oils, barrier serums, and refill bundles for future rollout.",
  },
  {
    category: "Orders & Stockists" as const,
    question:
      "How do I place an order and what payment methods do you accept?",
    answer: `Add the 400ml Marula & Baobab Body Lotion to your cart on ${siteConfig.domain} and proceed to checkout. You can pay instantly online via our PCI-DSS Level 1 certified Paystack gateway (supporting Visa, Mastercard, Capitec Pay, Ozow Instant EFT, and Apple Pay) or choose our direct WhatsApp Concierge for assisted EFT ordering.`,
  },
  {
    category: "Orders & Stockists" as const,
    question:
      "How much is courier delivery across South Africa and how long does it take?",
    answer:
      "Door-to-door courier delivery is a flat R100 anywhere in South Africa across all 9 provinces, and completely FREE on all orders of R500 or more (for example, ordering two 400ml bottles at R800 for your 90-day cycle ships free). Main metropolitan centers (Johannesburg, Pretoria, Cape Town, Durban) arrive in 2 to 4 business days; regional areas take 3 to 5 business days.",
  },
  {
    category: "Formulation" as const,
    question:
      "Are Divinity Cosmetics formulations cruelty-free and free from synthetic fillers?",
    answer:
      "Yes, 100%. Divinity Cosmetics is proudly cruelty-free and handcrafted in South Africa. We never test on animals and strictly exclude parabens, drying sulfates, mineral oil/petrolatum, and heavy artificial perfumes.",
  },
  {
    category: "Orders & Stockists" as const,
    question:
      "Can my salon, boutique, or aesthetics clinic become an authorized stockist?",
    answer:
      "Yes. We partner with selected boutiques, salons, spas, and dermatology practices across Southern Africa with 30% to 45% retail margins and exclusive territory protection. Visit our Reseller page to review wholesale tiers and apply.",
  },
];

export default function FAQPage() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Hi Divinity Cosmetics! I have a question about the 400ml Marula & Baobab Body Lotion."
  )}`;

  const faqJsonLd = buildFAQPageSchema(
    FAQS.map((item) => ({ question: item.question, answer: item.answer }))
  );
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Frequently Asked Questions", path: "/faq" },
  ]);

  return (
    <main className="min-h-screen bg-[#fcfbf9] pt-32 md:pt-40 pb-24 px-5 sm:px-8 lg:px-12 font-sans text-[#1a1a1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([faqJsonLd, breadcrumbJsonLd]),
        }}
      />
      <FAQClient faqs={FAQS} whatsappUrl={whatsappUrl} />
    </main>
  );
}
