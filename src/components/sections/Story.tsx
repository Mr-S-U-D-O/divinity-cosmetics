import React from "react";
import Image from "next/image";
import Link from "next/link";

export function Story() {
  return (
    <section id="story" className="story-section">
      <div className="story-content-creative">
        <h2 className="story-title-creative">
          <span className="story-title-line line-1">Rooted in</span>
          <span className="story-title-line line-2">African <em>Soil</em></span>
        </h2>

        {/* Bento Box Grid: Reordered on mobile by size with largest image (hands) at top */}
        <div className="mt-10 grid w-full grid-cols-1 gap-5 md:mt-16 md:grid-cols-2 md:gap-6 items-stretch">
          {/* 1. Largest Picture (Hands) - Top on mobile, right column full height on desktop */}
          <div
            data-story-card="hands"
            className="order-1 md:order-none md:col-start-2 md:row-start-1 md:row-span-3 relative aspect-[4/5] sm:aspect-[3/4] md:aspect-auto md:h-full min-h-[380px] md:min-h-[640px] overflow-hidden rounded-3xl border-2 border-black bg-[#1f4a30]"
          >
            <Image
              data-story-img="hands"
              src="/images/bento-story-hands.jpg"
              alt="Divinity Cosmetics Marula & Baobab Body Lotion held in hands"
              fill
              className="object-cover object-top scale-110 will-change-transform"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* 2. Second Largest Picture (Lotion being poured) */}
          <div
            data-story-card="lotion"
            className="order-2 md:order-none md:col-start-1 md:row-start-1 relative min-h-[260px] sm:min-h-[300px] md:min-h-[340px] w-full overflow-hidden rounded-3xl border-2 border-black bg-[#ded6c9]"
          >
            <Image
              data-story-img="lotion"
              src="/images/bento-story-lotion.jpg"
              alt="Rich Divinity Cosmetics botanical lotion being poured into hand"
              fill
              className="object-cover object-center scale-110 will-change-transform"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* 3. Third Picture (Botanical Seeds Apothecary Jar - 1024x571 aspect) */}
          <Link
            href="/about"
            data-story-card="jar"
            className="order-3 md:order-none md:col-start-1 md:row-start-2 group/jar relative aspect-[1024/571] w-full shrink-0 overflow-hidden rounded-3xl border-2 border-black bg-[#efeeeb] block"
            aria-label="Find out more about our wild-harvested Marula and Baobab botanical seeds"
          >
            <Image
              data-story-img="jar"
              src="/images/bento-story-jar.jpg"
              alt="Glass apothecary jar filled with wild-harvested Marula and Baobab botanical seeds"
              fill
              className="object-cover object-center scale-110 will-change-transform"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </Link>

          {/* 4. Text Card (Breaking the 5-Second Myth) */}
          <div
            data-story-card="myth"
            className="order-4 md:order-none md:col-start-1 md:row-start-3 relative flex flex-col justify-between rounded-3xl border-2 border-black bg-white p-6 md:p-8 space-y-3 shadow-xs"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-green">
              Breaking the 5-Second Myth
            </span>
            <div className="space-y-2.5">
              <h3 className="text-lg sm:text-xl md:text-2xl font-normal text-black leading-snug">
                A lotion that vanishes in five seconds isn&apos;t fast-absorbing—it is evaporating into thin air.
              </h3>
              <p className="text-xs sm:text-sm text-black leading-relaxed">
                Real 24-hour hydration requires dense, cold-pressed Marula and Baobab oils that take two to three minutes to sink in—physically sealing your moisture barrier against Highveld winters, harsh UV, and hard municipal water over a 90-day restoration cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
