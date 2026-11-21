import type { Metadata } from "next";
import React from "react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildResellerPageSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";
import { ResellerClient } from "./ResellerClient";

export const metadata: Metadata = buildPageMetadata({
  title: "Stockist & Wholesale Program",
  description:
    "Stock Divinity Cosmetics Marula & Baobab Body Lotion in your South African salon, clinic, or spa. 30%–45% margins, 12-unit MOQ, and protected territory.",
  path: "/reseller",
  keywords: [
    "skincare stockist program South Africa",
    "wholesale body lotion for salons and spas South Africa",
    "salon retail skincare margins South Africa",
    "spa wholesale skincare supplier ZA",
    "Marula body lotion wholesale",
    "Divinity Cosmetics reseller program",
  ],
});

const stockistFAQs = [
  {
    question: "What is the minimum opening order quantity (MOQ)?",
    answer:
      "Our opening minimum order is 12 units (one carton) of the flagship 400ml Marula & Baobab Body Lotion (R3,360 total wholesale investment). This allows salons and clinics to gauge client demand before scaling up.",
  },
  {
    question: "How do you protect our local territory from competing stockists?",
    answer:
      "We enforce a strict geographic territory radius (3km for Studio Partners and 5km for Premier Stockists in metropolitan areas). Active accounts maintaining quarterly orders receive perimeter protection in their area.",
  },
  {
    question: "Do you supply tester bottles and marketing collateral?",
    answer:
      "Yes. Every opening order includes a complimentary full-size 400ml tester bottle, counter display tent cards, and therapist formulation guides. Partner and Premier tiers also receive client trial sachets.",
  },
  {
    question: "What is the recommended retail price (RRP) policy?",
    answer:
      "The flagship 400ml Marula & Baobab Body Lotion retails at a fixed R400 incl. VAT nationwide. Discounting below RRP is prohibited to protect stockist margins across South Africa.",
  },
  {
    question: "How fast is wholesale courier fulfilment?",
    answer:
      "Wholesale orders dispatch within 24 hours from our Springs, Gauteng fulfilment hub via insured door-to-door courier. Delivery takes 2 to 4 business days across all 9 provinces with tracking updates.",
  },
  {
    question: "Can home-based therapists or mobile aesthetic practitioners apply?",
    answer:
      "Yes. Qualified somatologists, clinical dermal therapists, and registered beauty professionals running private practices are welcome to apply with proof of qualification or trade registration.",
  },
];

export default function ResellerLandingPage() {
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Authorized Stockist & Wholesale Program", path: "/reseller" },
  ]);
  const resellerPageJsonLd = buildResellerPageSchema();
  const faqJsonLd = buildFAQPageSchema(stockistFAQs);

  return (
    <main className="overflow-x-hidden w-full max-w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([
            breadcrumbJsonLd,
            resellerPageJsonLd,
            faqJsonLd,
          ]),
        }}
      />
      <ResellerClient />
    </main>
  );
}
