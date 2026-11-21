import type { Metadata } from "next";
import React from "react";
import { siteConfig } from "@/lib/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";
import { FAQClient } from "./FAQClient";

export const metadata: Metadata = buildPageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Direct answers on cold-pressed Marula & Baobab absorption, 90-day barrier repair for crepey skin, Paystack checkout, and Courier Guy delivery across SA.",
  path: "/faq",
  keywords: [
    "Divinity Cosmetics FAQ",
    "why does body lotion evaporate in 5 seconds",
    "best body lotion for crepey skin South Africa",
    "Marula and Baobab body lotion price R400",
    "body lotion for Highveld winter dry skin",
    "Divinity Cosmetics delivery South Africa",
  ],
});

const FAQS = [
  {
    category: "Formulation" as const,
    question:
      "Why does supermarket lotion vanish in 5 seconds and leave my skin ashy by midday?",
    answer:
      "Lotions that disappear in five seconds are typically 80–85% water, alcohol, and synthetic slip carriers. Once that moisture evaporates, a thinning skin barrier is exposed to dry South African air, leaving elbows, knees, and legs tight and ashy by 1 PM.",
  },
  {
    category: "Formulation" as const,
    question:
      "Why does Divinity Cosmetics Marula & Baobab Body Lotion take 2 to 3 minutes to sink in?",
    answer:
      "This 400ml lotion contains 10% cold-pressed Limpopo Marula seed oil and 10% wild-harvested Mpumalanga Baobab seed oil rather than volatile fillers. Those two to three minutes allow dense oleic and omega fatty acids to seal the stratum corneum for 24 hours.",
  },
  {
    category: "90-Day Care" as const,
    question:
      "How does the 90-day barrier repair cycle improve crepey skin on arms and legs?",
    answer:
      "Crepey texture develops as age-related lipid depletion, UV exposure, and dry air thin the outer skin barrier. Daily application of cold-pressed Marula (oleic acid and Vitamins C & E) and Baobab (Omegas 3, 6 & 9) across a 90-day cellular turnover cycle helps smooth texture and restore suppleness.",
  },
  {
    category: "Formulation" as const,
    question:
      "Why is the 400ml Marula & Baobab Body Lotion priced at R400?",
    answer:
      "Many South African women spend R300 to R1,000 on facial serums while buying R80 to R150 supermarket body pumps, yet avoid R1,200+ imported luxury creams. At R400 for 400ml (R1.00 per ml), Divinity brings facial-grade botanical concentrations to everyday body care.",
  },
  {
    category: "90-Day Care" as const,
    question:
      "How does it protect against Highveld winters, hard municipal water, and UV stress?",
    answer:
      "Dry Highveld air and mineral-heavy municipal tap water strip protective sebum during hot showers. Applying Divinity within 3 minutes of stepping out of a warm shower locks residual hydration beneath an occlusive Baobab omega barrier.",
  },
  {
    category: "90-Day Care" as const,
    question:
      "Do you have other products besides the Marula & Baobab Body Lotion?",
    answer:
      "We launched with our flagship 400ml Marula & Baobab Body Lotion (R400, SKU DIV-MBL-400) first. Complementary cold-pressed botanical body oils, facial-grade barrier serums, and 90-day refill bundles are currently in testing for upcoming release.",
  },
  {
    category: "Orders & Stockists" as const,
    question:
      "How do I place an order and which South African payment methods are accepted?",
    answer: `Add the 400ml Marula & Baobab Body Lotion to your bag on ${siteConfig.domain} and proceed to checkout. Pay online via our PCI-DSS Level 1 Paystack gateway (Visa, Mastercard, Capitec Pay, Ozow Instant EFT, Apple Pay) or arrange assisted EFT via our WhatsApp Concierge (${siteConfig.whatsappNumber}).`,
  },
  {
    category: "Orders & Stockists" as const,
    question:
      "How are courier delivery rates calculated across South Africa and how long does shipping take?",
    answer:
      "Door-to-door courier delivery across all 9 provinces is dispatched from Springs, Gauteng via The Courier Guy. Live rates are calculated at checkout by suburb, with economy road freight starting around R142 (2 to 4 business days for main centres, 3 to 5 days regional) plus overnight and Gauteng same-day options.",
  },
  {
    category: "Formulation" as const,
    question:
      "Are Divinity Cosmetics formulations cruelty-free and free from synthetic fillers?",
    answer:
      "Yes. Every batch is handcrafted in South Africa, 100% cruelty-free, and formulated without parabens, drying sulfates, mineral oil, petrolatum, or heavy artificial perfume.",
  },
  {
    category: "Orders & Stockists" as const,
    question:
      "Can my salon, boutique, or aesthetics clinic become an authorized stockist?",
    answer:
      "Yes. Selected salons, day spas, somatologists, boutiques, and dermal clinics across South Africa qualify for 30% to 45% wholesale margins starting at a 12-unit opening order, with 3km to 5km territory protection.",
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
          __html: serializeJsonLd([faqJsonLd, breadcrumbJsonLd]),
        }}
      />
      <FAQClient faqs={FAQS} whatsappUrl={whatsappUrl} />
    </main>
  );
}
