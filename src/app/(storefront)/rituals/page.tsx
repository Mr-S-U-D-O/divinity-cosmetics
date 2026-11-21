import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { Sun, Moon } from "@phosphor-icons/react/dist/ssr";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbSchema,
  buildRitualItemListSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";

export const metadata: Metadata = buildPageMetadata({
  title: "90-Day Barrier Ritual & Oils",
  description:
    "How cold-pressed 10% Limpopo Marula and 10% Mpumalanga Baobab oils rebuild a thinning moisture barrier over a 90-day South African body care ritual.",
  path: "/rituals",
  ogType: "article",
  keywords: [
    "90-day skin barrier repair body ritual",
    "how to apply Marula and Baobab body lotion",
    "cold-pressed Marula and Baobab oil skin benefits",
    "how to improve crepey skin naturally South Africa",
    "Highveld winter dry skin body care routine",
  ],
});

export default function RitualsPage() {
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Ingredients & 90-Day Rituals", path: "/rituals" },
  ]);
  const ritualListSchema = buildRitualItemListSchema();

  return (
    <main className="min-h-screen bg-[#fcfbf9] pt-32 md:pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-[#1a1a1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([breadcrumbJsonLd, ritualListSchema]),
        }}
      />
      <div className="max-w-5xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-green block">
            Botanical Science &amp; The 90-Day Protocol
          </span>
          <h1 className="font-chloe text-4xl md:text-6xl font-normal tracking-tight text-black leading-tight">
            The 90-Day Barrier Repair Ritual.
          </h1>
          <p className="text-black text-base md:text-lg leading-relaxed">
            A 90-day skin barrier ritual pairs daily damp-skin application with concentrated African lipids so moisture stays locked in for 24 hours. Instead of evaporating in five seconds like water-heavy supermarket lotions, 10% cold-pressed Marula and 10% Baobab oils sink in over 2 to 3 minutes to support full epidermal renewal.
          </p>
        </div>

        {/* Active Botanicals Deep Dive */}
        <section aria-labelledby="botanicals-heading" className="space-y-8">
          <div className="max-w-2xl">
            <h2 id="botanicals-heading" className="text-3xl md:text-4xl font-normal text-black">
              10% Marula &amp; 10% Baobab Lipid Science
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl border-2 border-black bg-white p-8 md:p-10 space-y-4">
              <p className="text-xs italic text-black/75">
                Sclerocarya birrea · 10% Cold-Pressed Limpopo Harvest
              </p>
              <h3 className="text-2xl md:text-3xl font-normal text-black">
                Cold-Pressed Marula Seed Oil
              </h3>
              <p className="text-sm md:text-base text-black leading-relaxed">
                With 70–78% oleic acid alongside catechins, flavonoids, and Vitamins C and E, cold-pressed Marula oil closely mirrors natural skin sebum. It absorbs steadily beneath the surface to replenish dry, paper-thin skin on arms, legs, and décolletage.
              </p>
            </div>

            <div className="rounded-3xl border-2 border-black bg-white p-8 md:p-10 space-y-4">
              <p className="text-xs italic text-black/75">
                Adansonia digitata · 10% Wild-Harvested Mpumalanga Seeds
              </p>
              <h3 className="text-2xl md:text-3xl font-normal text-black">
                Wild-Harvested Baobab Seed Oil
              </h3>
              <p className="text-sm md:text-base text-black leading-relaxed">
                Pressed from Baobab seeds, this lipid-rich oil provides Omega 3, 6, and 9 fatty acids and phytosterols. It forms a breathable 24-hour surface seal that limits trans-epidermal water loss (TEWL) in dry Highveld winters and coastal winds.
              </p>
            </div>
          </div>
        </section>

        {/* Daily Morning & Evening Application Sequence */}
        <section aria-labelledby="daily-sequence-heading" className="space-y-8">
          <div className="max-w-2xl">
            <h2 id="daily-sequence-heading" className="text-3xl md:text-4xl font-normal text-black">
              How to Apply for 24-Hour Hydration
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Morning Ritual */}
            <div className="bg-white border-2 border-black p-8 md:p-10 rounded-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-black pb-4">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-green">
                  Morning · Climate Seal
                </span>
                <Sun size={20} weight="regular" className="text-black" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-medium text-black">
                Stop Midday Ashiness Before It Starts
              </h3>
              <div className="space-y-4 text-sm text-black leading-relaxed">
                <div className="border-l-2 border-black pl-4 space-y-1">
                  <p className="font-semibold text-black">
                    Step 1: Shower in Warm Water (Avoid Scalding Heat)
                  </p>
                  <p>
                    Boiling-hot hard municipal water strips surface sebum. Rinse with warm water and pat lightly with a towel so skin stays slightly damp.
                  </p>
                </div>
                <div className="border-l-2 border-black pl-4 space-y-1">
                  <p className="font-semibold text-black">
                    Step 2: Apply Within 3 Minutes on Damp Skin
                  </p>
                  <p>
                    Massage our 400ml Marula &amp; Baobab Body Lotion over arms, elbows, knees, shins, and décolletage while pores are still warm.
                  </p>
                </div>
                <div className="border-l-2 border-black pl-4 space-y-1">
                  <p className="font-semibold text-black">
                    Step 3: Allow 2 to 3 Minutes to Seal
                  </p>
                  <p>
                    Give the cold-pressed oils two to three minutes to sink in before dressing. That short pause is what locks in comfort past 1 PM.
                  </p>
                </div>
              </div>
            </div>

            {/* Evening Ritual */}
            <div className="bg-white border-2 border-black p-8 md:p-10 rounded-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-black pb-4">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-green">
                  90-Day Cycle · Lipid Renewal
                </span>
                <Moon size={20} weight="regular" className="text-black" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-medium text-black">
                Three Phases of Barrier Restoration
              </h3>
              <div className="space-y-4 text-sm text-black leading-relaxed">
                <div className="border-l-2 border-black pl-4 space-y-1">
                  <p className="font-semibold text-black">
                    Days 1–14: Immediate Surface Comfort
                  </p>
                  <p>
                    Tightness after showering and winter itchiness ease as Baobab omegas slow moisture loss across the stratum corneum.
                  </p>
                </div>
                <div className="border-l-2 border-black pl-4 space-y-1">
                  <p className="font-semibold text-black">
                    Days 15–45: Steady Lipid Replenishment
                  </p>
                  <p>
                    Daily oleic acid from cold-pressed Marula oil rebuilds lipid density on sun-exposed forearms, shins, and chest.
                  </p>
                </div>
                <div className="border-l-2 border-black pl-4 space-y-1">
                  <p className="font-semibold text-black">
                    Days 46–90: Softer Crepey Texture
                  </p>
                  <p>
                    Across a full 90-day cellular turnover cycle, mature skin holds moisture more evenly and crepey texture looks smoother.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Range Roadmap */}
        <section
          aria-labelledby="roadmap-heading"
          className="rounded-3xl border-2 border-black bg-[#faf8f5] p-8 md:p-10 space-y-4"
        >
          <h2 id="roadmap-heading" className="text-2xl md:text-3xl font-normal text-black">
            Launching With One Core Formulation — Expanding Soon.
          </h2>
          <p className="text-sm md:text-base text-black leading-relaxed max-w-3xl">
            Divinity Cosmetics launches with one perfected daily treatment: our{" "}
            <Link href="/products/marula-baobab-body-lotion" className="font-semibold underline underline-offset-4 hover:text-green">
              400ml Marula &amp; Baobab Body Lotion (R400)
            </Link>
            . Pure botanical body oils, facial-grade barrier serums, and 90-day refill bundles are in stability testing for upcoming release. Have questions about texture or delivery? Check our{" "}
            <Link href="/faq" className="underline underline-offset-4 hover:text-green">
              FAQ
            </Link>{" "}
            or{" "}
            <Link href="/shipping" className="underline underline-offset-4 hover:text-green">
              South African shipping guide
            </Link>
            .
          </p>
        </section>

        {/* Bottom CTA */}
        <div className="bg-[#faf8f5] border-2 border-black rounded-3xl p-6 sm:p-8 md:p-12 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900">
            Start Your 90-Day Barrier Repair Today
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-black max-w-xl mx-auto leading-relaxed">
            Replace your bathroom pump bottle with 400ml of cold-pressed Marula &amp; Baobab nutrition for R400 (R1.00/ml), or order two bottles (R800) to cover a full 90-day cycle.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/products/marula-baobab-body-lotion"
              className="btn-primary w-full sm:w-auto text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap"
            >
              <span>Shop Marula &amp; Baobab (400ml) — R400</span>
            </Link>
            <Link
              href="/about#founders-note"
              className="btn-secondary w-full sm:w-auto text-xs sm:text-sm whitespace-nowrap"
            >
              <span>Read the Founder&apos;s Note</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
