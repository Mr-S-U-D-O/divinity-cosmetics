import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import {
  Sparkle,
  Sun,
  Moon,
  Drop,
  ShieldCheck,
  Clock,
} from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/config/site";
import { buildBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title:
    "Ingredients & The 90-Day Barrier Repair Ritual | Cold-Pressed Marula & Baobab",
  description:
    "Learn why watery commercial lotions evaporate in 5 seconds and how Divinity Cosmetics' cold-pressed South African Marula and Baobab seed oils rebuild a thinning moisture barrier over a 90-day cycle.",
  keywords: [
    "Marula and Baobab skin benefits",
    "90-day skin barrier repair ritual",
    "why body lotion evaporates",
    "how to fix crepey skin on arms and legs naturally",
    "Highveld winter dry skin routine South Africa",
    "cold-pressed Marula oil vs commercial lotion",
  ],
  alternates: {
    canonical: "/rituals",
  },
  openGraph: {
    title:
      "The 90-Day Barrier Repair Ritual & Botanical Science | Divinity Cosmetics",
    description:
      "Dismantling the 5-Second Evaporation Myth. Discover how undiluted cold-pressed Marula & Baobab seed oils physically seal South African skin for 24 hours.",
    url: `${siteConfig.url}/rituals`,
    type: "article",
  },
};

export default function RitualsPage() {
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Ingredients & 90-Day Rituals", path: "/rituals" },
  ]);

  const ritualListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The Divinity Cosmetics 90-Day Barrier Repair Protocol",
    description:
      "A three-phase daily body care protocol using cold-pressed South African Marula and Baobab seed oils to restore a thinning skin barrier over 90 days.",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Days 1–14: The 24-Hour Physical Climate Seal",
        description:
          "Apply Divinity Marula & Baobab Body Lotion (400ml) within 3 minutes of stepping out of a warm shower. Allow 2–3 minutes for the dense oils to absorb and halt midday ashiness.",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Days 15–45: Deep Epidermal Lipid Replenishment",
        description:
          "Consistent daily application of oleic acid (Marula) and Omegas 3, 6, and 9 (Baobab) replenishes intercellular lipids stripped by hard municipal water and Highveld dry air.",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Days 46–90: Structural Barrier Renewal & Softened Crepey Texture",
        description:
          "Across a full 90-day epidermal turnover cycle, the moisture barrier rebuilds its natural thickness and bounce, softening crepey skin on arms, knees, elbows, and décolletage.",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white pt-32 md:pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-[#1a1a1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, ritualListSchema]),
        }}
      />
      <div className="max-w-5xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e8efe7] text-[#3d7b32] rounded-full text-[11px] font-bold tracking-widest uppercase mb-2">
            <Sparkle size={14} weight="fill" />
            <span>Botanical Science &amp; The 90-Day Standard</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-gray-900 leading-tight">
            Dismantling the 5-Second Myth.
          </h1>
          <p className="text-black text-base md:text-lg leading-relaxed">
            A lotion that vanishes in five seconds isn&apos;t &ldquo;fast-absorbing&rdquo;—it is simply evaporating into thin air. Real 24-hour hydration requires dense, cold-pressed African botanical oils that take two to three minutes to sink in and physically seal your skin against the South African climate.
          </p>
        </div>

        {/* Active Botanicals Deep Dive */}
        <section aria-labelledby="botanicals-heading" className="space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3d7b32]">
              Active African Lipid Nutrition
            </span>
            <h2 id="botanicals-heading" className="text-3xl md:text-4xl font-normal text-black">
              Why Cold-Pressed Marula &amp; Baobab Outperform Watery Fillers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-black bg-white p-8 md:p-10 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#3d7b32]">
                <Drop size={16} weight="fill" />
                <span>Sclerocarya birrea · Limpopo Harvest</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-normal text-black">
                Cold-Pressed Marula Seed Oil
              </h3>
              <p className="text-sm md:text-base text-black leading-relaxed">
                Containing 70–78% oleic acid alongside potent catechins, flavonoids, and Vitamins C and E, cold-pressed Marula oil mimics the skin&apos;s natural sebum. It penetrates beneath the surface to restore suppleness where age-related lipid loss causes paper-thin, crepey texture.
              </p>
            </div>

            <div className="rounded-3xl border border-black bg-white p-8 md:p-10 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#3d7b32]">
                <ShieldCheck size={16} weight="fill" />
                <span>Adansonia digitata · Wild-Harvested</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-normal text-black">
                Wild-Harvested Baobab Seed Oil
              </h3>
              <p className="text-sm md:text-base text-black leading-relaxed">
                Pressed from the seeds of the resilient African &ldquo;Tree of Life,&rdquo; Baobab oil delivers a balanced triad of Omega 3, 6, and 9 fatty acids and plant sterols. It forms a breathable, 24-hour physical seal that prevents trans-epidermal water loss during dry Highveld winters and coastal wind shifts.
              </p>
            </div>
          </div>
        </section>

        {/* Daily Morning & Evening Application Sequence */}
        <section aria-labelledby="daily-sequence-heading" className="space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3d7b32]">
              Daily Application Architecture
            </span>
            <h2 id="daily-sequence-heading" className="text-3xl md:text-4xl font-normal text-black">
              How to Apply for 24-Hour Wardrobe Freedom
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Morning Ritual */}
            <div className="bg-white border border-black p-8 md:p-10 rounded-3xl shadow-sm space-y-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sun size={26} weight="bold" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Morning Climate Shield
                </span>
                <h3 className="text-2xl font-medium text-gray-900">
                  Seal Against Midday Ashiness
                </h3>
              </div>
              <div className="space-y-4 text-sm text-black leading-relaxed">
                <div className="border-l border-[#3d7b32] pl-4 space-y-1">
                  <p className="font-semibold text-gray-900">
                    Step 1: Warm Water Only (Skip Boiling Showers)
                  </p>
                  <p>
                    Steaming hot municipal water strips your skin&apos;s remaining lipid mantle. Rinse with warm water and pat gently with a towel so skin remains slightly damp.
                  </p>
                </div>
                <div className="border-l border-[#3d7b32] pl-4 space-y-1">
                  <p className="font-semibold text-gray-900">
                    Step 2: The 3-Minute Damp-Skin Application
                  </p>
                  <p>
                    Within 3 minutes of stepping out of the shower, massage Divinity Marula &amp; Baobab Body Lotion generously over arms, elbows, knees, legs, and décolletage.
                  </p>
                </div>
                <div className="border-l border-[#3d7b32] pl-4 space-y-1">
                  <p className="font-semibold text-gray-900">
                    Step 3: The 2-Minute Absorption Window
                  </p>
                  <p>
                    Give the dense botanical oils 2 to 3 minutes to sink in before dressing. This forms your 24-hour physical climate seal—eliminating 1 PM ashiness and wardrobe anxiety.
                  </p>
                </div>
              </div>
            </div>

            {/* Evening Ritual */}
            <div className="bg-white border border-black p-8 md:p-10 rounded-3xl shadow-sm space-y-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Moon size={26} weight="bold" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Overnight Barrier Restoration
                </span>
                <h3 className="text-2xl font-medium text-gray-900">
                  Feed the 90-Day Renewal Cycle
                </h3>
              </div>
              <div className="space-y-4 text-sm text-black leading-relaxed">
                <div className="border-l border-[#3d7b32] pl-4 space-y-1">
                  <p className="font-semibold text-gray-900">
                    Days 1–14: Immediate Comfort &amp; Relief
                  </p>
                  <p>
                    Surface tightness, winter itchiness, and midday dry patches subside as Baobab omegas seal micro-fissures in the stratum corneum.
                  </p>
                </div>
                <div className="border-l border-[#3d7b32] pl-4 space-y-1">
                  <p className="font-semibold text-gray-900">
                    Days 15–45: Deep Lipid Replenishment
                  </p>
                  <p>
                    Cold-pressed Marula oleic acid restores intercellular lipid density on high-exposure zones like forearms, shins, and chest.
                  </p>
                </div>
                <div className="border-l border-[#3d7b32] pl-4 space-y-1">
                  <p className="font-semibold text-gray-900">
                    Days 46–90: Visibly Softened Crepey Texture
                  </p>
                  <p>
                    As your epidermis completes a full 90-day cellular turnover nourished by clean botanical oils, thinning, crepey texture looks smoother, firmer, and more resilient.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Range Roadmap */}
        <section
          aria-labelledby="roadmap-heading"
          className="rounded-3xl border border-black bg-[#faf9f6] p-8 md:p-10 space-y-4"
        >
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#3d7b32]">
            <Clock size={16} weight="bold" />
            <span>Future Formulations Roadmap</span>
          </div>
          <h2 id="roadmap-heading" className="text-2xl md:text-3xl font-normal text-black">
            Launching with One Uncompromising Essential—Expanding Soon.
          </h2>
          <p className="text-sm md:text-base text-black leading-relaxed max-w-3xl">
            We chose to launch Divinity Cosmetics with a single, perfected flagship formulation: our <strong>400ml Marula &amp; Baobab Body Lotion (R400)</strong>. Additional facial-grade African botanical treatments—including our pure botanical lipid oil, targeted barrier serums, and 90-day refill bundles—are currently in small-batch stability testing for upcoming release.
          </p>
        </section>

        {/* Bottom CTA */}
        <div className="bg-[#faf9f6] border-2 border-black rounded-3xl p-6 sm:p-8 md:p-12 text-center space-y-4 shadow-sm">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900">
            Start Your 90-Day Barrier Repair Today
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-black max-w-xl mx-auto leading-relaxed">
            Replace the watery supermarket pump bottle on your bathroom counter with 400ml of cold-pressed Marula &amp; Baobab nutrition for R400. Order two bottles (R800) for free nationwide courier delivery.
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
