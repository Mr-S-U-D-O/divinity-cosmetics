import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Heart,
  Leaf,
} from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/lib/config/site";
import {
  buildBreadcrumbSchema,
  buildFounderNoteArticleSchema,
} from "@/lib/seo/schema";

export const metadata: Metadata = {
  title:
    "Our Story & A Personal Note from the Founder | Closing the Vanity Divide",
  description:
    "Read 'A Personal Note from the Founder' of Divinity Cosmetics. Discover why South African women who invest R1,000 in facial serums are replacing watery R100 supermarket lotions with our 400ml Marula & Baobab Body Lotion for 90-day barrier repair.",
  keywords: [
    "Divinity Cosmetics story",
    "A Personal Note from the Founder Divinity Cosmetics",
    "The Vanity Divide skincare",
    "The 5-Second Myth body lotion",
    "90-day skin barrier repair South Africa",
    "Marula and Baobab body lotion founder story",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title:
      "A Personal Note from the Founder | Divinity Cosmetics South Africa",
    description:
      "The skin on your body faces the exact same harsh South African elements as your face—and it deserves the exact same facial-grade botanical standard.",
    url: `${siteConfig.url}/about`,
    type: "article",
    images: [
      {
        url: "/images/divinity-our-story.jpg",
        width: 1200,
        height: 900,
        alt: "Hands holding Divinity Cosmetics Marula & Baobab Body Lotion (400ml)",
      },
    ],
  },
};

const CORE_BELIEFS = [
  {
    number: "01",
    title: "The Ingredient Belief",
    subtitle: "Pure Botanical Density vs. Water Fillers",
    body: "Commercial supermarket lotions are mostly water, cheap emulsifying fillers, and synthetic fragrance. Real barrier repair requires high concentrations of pure, undiluted cold-pressed African botanical seed oils.",
  },
  {
    number: "02",
    title: "The Texture Belief (The 5-Second Myth)",
    subtitle: "Absorption vs. Evaporation",
    body: "A lotion that disappears in five seconds isn't 'fast-absorbing'—it is evaporating into thin air. A rich, nutrient-dense formula that takes a few minutes to sink in is deliberate proof that it is physically sealing your skin barrier against climate stress.",
  },
  {
    number: "03",
    title: "The Consistency Belief",
    subtitle: "The 90-Day Barrier Repair Cycle",
    body: "Healthy, resilient mature skin is not built by overnight miracle claims. Restoring a thinning moisture barrier and softening crepey texture requires clean, honest lipid nutrition applied consistently over a 90-day cycle.",
  },
  {
    number: "04",
    title: "The Body-Equals-Face Belief",
    subtitle: "Eliminating the Vanity Divide",
    body: "The skin on your body faces the exact same harsh elements and biological aging process as your face—and it deserves the exact same clean, facial-grade botanical standard.",
  },
];

const STORY_ARC_STEPS = [
  {
    letter: "S",
    stage: "Stage — The Vanity Divide",
    description:
      "You stand in your bathroom investing R300 to R1,000 in advanced facial serums because you demand quality—yet turn to the other 90% of your body and apply a watery, heavily perfumed supermarket pump lotion simply because a trustworthy local alternative didn't exist.",
  },
  {
    letter: "T",
    stage: "Tension — The Midday Betrayal & Wardrobe Anxiety",
    description:
      "South African climate stress—biting Highveld winters, harsh UV, hard municipal water, and coastal humidity shifts—attacks a thinning skin barrier. Because commercial lotion evaporates, by 1 PM your skin is tight, itchy, and visibly ashy, quietly dictating whether you wear short sleeves or dresses.",
  },
  {
    letter: "O",
    stage: "Opportunity — Breaking the 5-Second Myth",
    description:
      "You discover the truth about commercial lotions: they vanish in five seconds because they are mostly water and alcohol. True 24-hour hydration requires dense, cold-pressed Marula and Baobab nutrition that takes a couple of minutes to sink in and form a physical climate seal.",
  },
  {
    letter: "R",
    stage: "Resolution — The 90-Day Barrier Repair",
    description:
      "Instead of a momentary fragrance illusion, you feed your skin honest, cold-pressed African botanical oils day after day. Over a 90-day cellular renewal cycle, your moisture barrier rebuilds, crepey texture softens, and your skin regains lasting resilience.",
  },
  {
    letter: "Y",
    stage: "Yes — Total Wardrobe Freedom",
    description:
      "You move through your entire day with 24-hour physical comfort and open your wardrobe every morning wearing whatever you want with absolute confidence—permanently closing the vanity divide.",
  },
];

export default function AboutPage() {
  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Our Story & Founder's Note", path: "/about" },
  ]);
  const articleJsonLd = buildFounderNoteArticleSchema();

  return (
    <main className="min-h-screen bg-white px-6 pb-24 pt-32 font-sans text-black md:px-12 md:pt-40 lg:px-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, articleJsonLd]),
        }}
      />
      <div className="mx-auto max-w-6xl space-y-24">
        {/* Hero Section */}
        <div className="grid items-end gap-8 border-b border-black pb-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
          <div>
            <h1 className="max-w-3xl text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-gray-900 md:text-7xl">
              Closing the Vanity Divide.
            </h1>
          </div>
          <p className="max-w-md text-base leading-relaxed text-black md:text-lg">
            Why do we invest heavily in clean serums for the 10% of skin on our face, while settling for watery, synthetic supermarket lotions on the other 90% of our body? Divinity Cosmetics was founded to end that compromise.
          </p>
        </div>

        {/* Founder's Note + Editorial Image Split */}
        <article
          id="founders-note"
          aria-labelledby="founders-note-heading"
          className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16"
        >
          <div className="lg:sticky lg:top-32 space-y-6">
            <div className="relative min-h-[480px] md:min-h-[600px] overflow-hidden rounded-[2rem] border border-black bg-black shadow-sm">
              <Image
                src="/images/divinity-our-story.jpg"
                alt="Hands holding Divinity Cosmetics Marula and Baobab Body Lotion (400ml)"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
              />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-black bg-white/95 p-6 backdrop-blur-md">
                <p className="text-sm leading-relaxed text-black">
                  &ldquo;A lotion that vanishes in five seconds isn&apos;t fast-absorbing—it is simply evaporating into thin air.&rdquo;
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-black bg-[#faf9f6] p-6 space-y-3">
              <h2 className="text-2xl font-normal text-black">
                Marula &amp; Baobab Body Lotion (400ml)
              </h2>
              <p className="text-sm text-black leading-relaxed">
                Formulated with high concentrations of cold-pressed South African Marula and Baobab seed oils. Priced at <strong>R400 (R1.00/ml)</strong> to replace the commercial pump bottle on your bathroom counter.
              </p>
              <div className="pt-2">
                <Link
                  href="/products/marula-baobab-body-lotion"
                  className="btn-primary w-full justify-center !py-3 !text-xs uppercase tracking-wider"
                >
                  <span>Replace Your Lotion — R400</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Full Personal Note from the Founder */}
          <div className="rounded-[2rem] border border-black bg-white p-8 md:p-12 lg:p-14 shadow-sm">
            <h2
              id="founders-note-heading"
              className="text-3xl md:text-5xl font-normal leading-tight text-black mb-8"
            >
              A Personal Note from the Founder
            </h2>

            <div className="space-y-5 text-base leading-relaxed text-black">
              <p>
                I want to talk to you about something I notice in almost every woman I meet who takes her personal presentation seriously.
              </p>
              <p>
                If I walked into your bathroom right now, I&apos;d likely see R1,000 serums and carefully chosen moisturizers sitting on your vanity. You invest in your face because you understand your skin, you respect yourself, and you refuse to put cheap synthetic fillers on it.
              </p>
              <p className="font-semibold">
                But then there&apos;s the rest of your body.
              </p>
              <p>
                Like so many of us living in South Africa, your skin is fighting constant environmental stressors—the biting dry cold of Highveld winters, intense UV, hard municipal water, or sudden coastal humidity shifts. As the years pass, your skin barrier thins, moisture disappears faster, and by lunchtime your skin feels tight, dry, and uncomfortable.
              </p>
              <p>
                Yet for years, when it comes to the other 90% of your skin, you&apos;ve had to settle for R100 supermarket pump lotions. You use them not because you want to, but because there hasn&apos;t been a trustworthy, local alternative that meets the standard you demand for your face.
              </p>
              <p>
                And let&apos;s be honest about what happens with those supermarket lotions. They feel light, they smell heavily of artificial perfume, and they disappear in five seconds. We&apos;ve been trained to think that&apos;s convenience. It isn&apos;t. That lotion vanished because it was mostly water and synthetic fillers evaporating into thin air, leaving nothing behind to protect you against the climate two hours later.
              </p>
              <p>
                By midday, the ashiness returns on your elbows or knees, or you notice crepey texture on your arms. Suddenly, without even realizing it, you&apos;re choosing your outfits around your skin—avoiding short sleeves or certain dresses because you don&apos;t feel completely comfortable or confident.
              </p>
              <p>
                That vanity divide never made sense to me. The skin on your body ages and faces the identical elements as the skin on your face, and it deserves the exact same level of respect and clean, botanical nutrition.
              </p>
              <p>
                That is why I created Divinity Cosmetics. I refused to accept that we had to choose between cheap, water-based pumps and imported luxury creams we couldn&apos;t justify using every day.
              </p>
              <p>
                I wanted to formulate a body treatment using pure, cold-pressed African botanicals—specifically Marula and Baobab seed oils—at high concentrations that actually work.
              </p>
              <p>
                When you apply Divinity, it won&apos;t disappear in five seconds. It takes a couple of minutes to sink in. That density isn&apos;t an inconvenience; it is the honest proof of active, undiluted plant oils creating a physical seal that holds hydration in your skin for a full 24 hours.
              </p>
              <p>
                Restoring a compromised moisture barrier and smoothing mature skin texture doesn&apos;t happen with overnight magic tricks. It happens by feeding your skin clean, honest nutrition day after day. Over a 90-day cycle, you will watch your skin barrier rebuild itself.
              </p>
              <p>
                I want you to experience what it feels like to go through your entire day with deeply comfortable, nourished skin—and to open your wardrobe every morning wearing whatever you want with absolute confidence.
              </p>
              <p>
                Your body deserves the same standard of luxury you demand for your face. Secure your first 400ml bottle of our Marula &amp; Baobab Body Lotion for R400, replace the supermarket pump bottle on your counter, and start your 90-day barrier repair today.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-lg font-semibold text-black">
                  — {siteConfig.founderSignOff}
                </p>
                <p className="text-xs text-black/60 mt-1">
                  Handcrafted in South Africa · Official Store
                </p>
              </div>
              <Link
                href="/products/marula-baobab-body-lotion"
                className="btn-primary w-full sm:w-auto text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap text-center"
              >
                <span>Secure Your 400ml Bottle — R400</span>
              </Link>
            </div>
          </div>
        </article>

        {/* The 4 Core Beliefs (ABC Framework) */}
        <section aria-labelledby="beliefs-heading" className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <h2
              id="beliefs-heading"
              className="text-3xl md:text-5xl font-normal text-black leading-tight"
            >
              Four Truths the Commercial Skincare Industry Won&apos;t Tell You.
            </h2>
            <p className="text-base text-black leading-relaxed">
              We don&apos;t use marketing gimmicks, overnight miracle claims, or synthetic perfume clouds. Every formulation decision at Divinity Cosmetics is anchored in four biological realities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CORE_BELIEFS.map((belief) => (
              <div
                key={belief.number}
                className="rounded-3xl border border-black bg-white p-8 md:p-10 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between gap-4 border-b border-black/15 pb-3">
                    <span className="font-chloe text-2xl text-black/45">
                      {belief.number}
                    </span>
                    <span className="text-xs text-black/60 text-right">
                      {belief.subtitle}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-normal text-black">
                    {belief.title}
                  </h3>
                </div>
                <p className="text-sm md:text-base text-black leading-relaxed">
                  {belief.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* The S.T.O.R.Y. Arc: From Midday Ashiness to Total Wardrobe Freedom */}
        <section
          aria-labelledby="story-arc-heading"
          className="rounded-[2rem] border border-black bg-[#faf9f6] p-8 md:p-12 lg:p-16 space-y-10"
        >
          <div className="max-w-3xl space-y-3">
            <h2
              id="story-arc-heading"
              className="text-3xl md:text-5xl font-normal text-black leading-tight"
            >
              From Midday Betrayal to Total Wardrobe Freedom.
            </h2>
            <p className="text-base text-black leading-relaxed">
              Designed for South African women aged 30 to 70 navigating age-related moisture loss, crepey texture, and harsh local climate shifts.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {STORY_ARC_STEPS.map((item) => (
              <div
                key={item.letter}
                className="grid grid-cols-1 md:grid-cols-[72px_1fr] items-start gap-4 md:gap-6 rounded-2xl border border-black bg-white p-6 md:p-7"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green text-white text-2xl font-bold">
                  {item.letter}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-normal text-black">
                    {item.stage}
                  </h3>
                  <p className="text-sm md:text-base text-black leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pillar Values */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[2rem] border border-black bg-black md:grid-cols-3">
          <div className="space-y-3 bg-white p-8 md:p-10">
            <Leaf size={22} weight="regular" className="text-black/80" aria-hidden="true" />
            <h3 className="text-xl font-normal text-gray-900">
              Cold-Pressed Indigenous Oils
            </h3>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
              High concentrations of unrefined South African Marula and wild-harvested Baobab seed oils—never diluted with cheap mineral oil or petrolatum.
            </p>
          </div>

          <div className="space-y-3 bg-white p-8 md:p-10">
            <ShieldCheck size={22} weight="regular" className="text-black/80" aria-hidden="true" />
            <h3 className="text-xl font-normal text-gray-900">
              Built for the South African Climate
            </h3>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
              Engineered to physically seal your moisture barrier against biting Highveld winters, harsh UV, hard municipal water, and coastal humidity shifts.
            </p>
          </div>

          <div className="space-y-3 bg-white p-8 md:p-10">
            <Heart size={22} weight="regular" className="text-black/80" aria-hidden="true" />
            <h3 className="text-xl font-normal text-gray-900">
              Cruelty-Free &amp; Future-Ready
            </h3>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
              100% cruelty-free and handcrafted in South Africa. Launching with our flagship 400ml Body Lotion, with our extended botanical range in development.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
