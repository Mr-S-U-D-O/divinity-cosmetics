import type { Metadata } from "next";
import { Hero } from "@/components/layout/Hero";
import { Collection } from "@/components/sections/Collection";
import { Story } from "@/components/sections/Story";
import { ResellerNetwork } from "@/components/sections/ResellerNetwork";
import { FAQSection, HOMEPAGE_FAQ_ITEMS } from "@/components/sections/FAQSection";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildFlagshipProductSchema,
  buildFAQPageSchema,
  buildBreadcrumbSchema,
  buildHeroImageSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Divinity Cosmetics | Facial-Grade Body Care South Africa",
  absoluteTitle: true,
  description:
    "Close the Vanity Divide with Divinity Cosmetics. Cold-pressed Marula & Baobab Body Lotion (400ml, R400) for 24-hour hydration and 90-day barrier repair.",
  path: "/",
  keywords: [
    "Divinity Cosmetics South Africa",
    "facial-grade botanical body care South Africa",
    "Marula and Baobab body lotion 400ml",
    "24-hour skin barrier repair South Africa",
    "body lotion for dry Highveld winter skin",
  ],
});

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
          __html: serializeJsonLd([
            productJsonLd,
            heroImageJsonLd,
            faqJsonLd,
            breadcrumbJsonLd,
          ]),
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
