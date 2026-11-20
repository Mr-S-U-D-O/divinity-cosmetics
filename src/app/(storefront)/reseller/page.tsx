import type { Metadata } from "next";
import React from "react";
import { siteConfig } from "@/lib/config/site";
import { buildBreadcrumbSchema, buildFAQPageSchema } from "@/lib/seo/schema";
import { ResellerClient } from "./ResellerClient";

export const metadata: Metadata = {
  title:
    "Authorized Stockist & Wholesale Program | Facial-Grade Botanical Skincare South Africa",
  description:
    "Partner with Divinity Cosmetics as an authorized South African stockist. Retail our flagship 400ml Marula & Baobab Body Lotion with 30%–45% wholesale margins, 12-unit starter orders, free full-size tester, and protected local territory.",
  keywords: [
    "skincare stockist South Africa",
    "wholesale botanical body lotion South Africa",
    "salon retail products South Africa",
    "spa wholesale skincare supplier ZA",
    "Marula body lotion wholesale",
    "Divinity Cosmetics reseller program",
  ],
  alternates: {
    canonical: "/reseller",
  },
  openGraph: {
    title:
      "Authorized Stockist & Wholesale Program | Divinity Cosmetics South Africa",
    description:
      "Bring facial-grade South African Marula & Baobab body care to your salon, aesthetic clinic, or spa with 30%–45% wholesale margins and territory protection.",
    url: `${siteConfig.url}/reseller`,
    type: "website",
    images: [
      {
        url: "/images/marula-baobab-body-lotion.jpg",
        width: 1200,
        height: 900,
        alt: "Divinity Cosmetics Authorized Stockist & Reseller Program South Africa",
      },
    ],
  },
};

const stockistFAQs = [
  {
    question: "What is the minimum opening order quantity (MOQ)?",
    answer:
      "Our opening minimum order is just 12 units (one carton) of the flagship 400ml Marula & Baobab Body Lotion (R3,360 total wholesale investment). This low-barrier commitment allows you to test client demand with zero risk before scaling up.",
  },
  {
    question: "How do you protect our local territory from competing stockists?",
    answer:
      "We enforce a strict geographic territory radius (typically 3km to 5km in metropolitan areas). Once your account is active and maintaining consistent quarterly volume, no other salon or boutique within your protected perimeter will be approved to retail Divinity.",
  },
  {
    question: "Do you supply tester bottles and marketing collateral?",
    answer:
      "Yes. Every initial opening order includes a complimentary full-size 400ml tester bottle, luxury counter display tent cards, and therapist formulation guides. Partner and Premier tiers also receive client sample trial sachets for your treatment rooms.",
  },
  {
    question: "What is the recommended retail price (RRP) policy?",
    answer:
      "The flagship 400ml Marula & Baobab Body Lotion retails at a strictly enforced R400 incl. VAT nationwide. We strictly prohibit discounting below RRP to protect partner margins and preserve the brand's luxury positioning across South Africa.",
  },
  {
    question: "How fast is wholesale courier fulfillment?",
    answer:
      "All wholesale orders dispatch within 24 hours from our South African fulfillment hub via insured, door-to-door courier. Delivery takes 2 to 4 business days across all 9 provinces with real-time SMS and email tracking.",
  },
  {
    question: "Can home-based therapists or mobile aesthetic practitioners apply?",
    answer:
      "Yes. We welcome qualified somatologists, clinical dermal therapists, and registered beauty professionals operating private practices. You will simply need to provide proof of professional qualification or trade registration during application.",
  },
];

export default function ResellerLandingPage() {
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Authorized Stockist & Wholesale Program", path: "/reseller" },
  ]);

  const faqJsonLd = buildFAQPageSchema(stockistFAQs);

  return (
    <main className="overflow-x-hidden w-full max-w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ResellerClient />
    </main>
  );
}
