import type { Metadata } from "next";
import { Hero } from "@/components/layout/Hero";
import { Collection } from "@/components/sections/Collection";
import { Story } from "@/components/sections/Story";
import { ResellerNetwork } from "@/components/sections/ResellerNetwork";
import { FAQSection, HOMEPAGE_FAQ_ITEMS } from "@/components/sections/FAQSection";
import {
  buildFlagshipProductSchema,
  buildFAQPageSchema,
  buildBreadcrumbSchema,
  buildHeroImageSchema,
} from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: {
    absolute:
      "Divinity Cosmetics | Marula & Baobab Body Lotion (400ml) | Facial-Grade Body Care South Africa",
  },
  description:
    "Why invest R1,000 in facial serums and settle for watery R100 supermarket body lotions? Discover Divinity Cosmetics Marula & Baobab Body Lotion (400ml, R400)—cold-pressed South African botanical oils for 24-hour hydration and 90-day barrier repair.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const productJsonLd = buildFlagshipProductSchema();
  const heroImageJsonLd = buildHeroImageSchema();
  const faqJsonLd = buildFAQPageSchema(HOMEPAGE_FAQ_ITEMS);
  const breadcrumbJsonLd = buildBreadcrumbSchema([{ name: "Home", path: "/" }]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productJsonLd, heroImageJsonLd, faqJsonLd, breadcrumbJsonLd]),
        }}
      />
      <Hero />
      <Collection />
      <Story />
      <ResellerNetwork />
      <FAQSection />
    </main>
  );
}
