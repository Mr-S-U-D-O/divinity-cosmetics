"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Headset, MapPin } from "@phosphor-icons/react";
import { animate, spring } from "animejs";

const cardBase =
  "rounded-2xl border-2 border-black bg-white";

const iconBadge =
  "flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-black text-black transition-colors duration-300 hover:border-green hover:bg-green/10 hover:text-green";

export function ResellerNetwork() {
  const handleCardEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const badge = e.currentTarget.querySelector('[data-anime="reseller-badge"]');
    if (badge) {
      animate(badge, {
        scale: [1, 1.15, 1],
        rotate: [0, 8, 0],
        ease: spring({ mass: 1, stiffness: 220, damping: 12 }),
      });
    }
  };

  return (
    <section
      id="network"
      aria-labelledby="reseller-heading"
      className="w-full bg-white px-4 py-20 sm:px-6 md:py-32 lg:px-12 lg:py-40"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Heading with an inline image pill, resized and relayered for mobile editorial impact */}
        <h2
          id="reseller-heading"
          className="m-0 max-w-6xl text-[clamp(2.85rem,11.5vw,6.25rem)] leading-[0.96] md:leading-[1.04] font-normal tracking-tight text-black"
        >
          {/* Mobile Relayered (sm:hidden): 3 balanced editorial lines */}
          <span data-anime="reseller-line" className="block sm:hidden will-change-transform">
            Join our
          </span>
          <span data-anime="reseller-line" className="flex sm:hidden items-center gap-[0.25em] will-change-transform">
            <span
              data-anime="reseller-pill"
              aria-hidden="true"
              className="relative inline-block h-[0.7em] w-[1.85em] overflow-hidden rounded-full border-2 border-black shrink-0 origin-center will-change-transform"
            >
              <Image
                src="/images/bento-story-lotion.jpg"
                alt=""
                fill
                sizes="160px"
                className="object-cover object-[40%_55%]"
              />
            </span>
            <span>exclusive</span>
          </span>
          <span data-anime="reseller-line" className="block sm:hidden will-change-transform">
            network.
          </span>

          {/* Tablet & Desktop Layout (hidden sm:block): classic 2-line lockup */}
          <span data-anime="reseller-line" className="hidden sm:block will-change-transform">
            Join our
            <span
              data-anime="reseller-pill"
              aria-hidden="true"
              className="relative mx-[0.18em] inline-block h-[0.7em] w-[1.9em] translate-y-[0.04em] overflow-hidden rounded-full border-2 border-black align-baseline origin-center will-change-transform"
            >
              <Image
                src="/images/bento-story-lotion.jpg"
                alt=""
                fill
                sizes="160px"
                className="object-cover object-[40%_55%]"
              />
            </span>
            exclusive
          </span>
          <span data-anime="reseller-line" className="hidden sm:block will-change-transform">
            network.
          </span>
        </h2>

        {/* Gapless bento: 5 + 4 + 3 on row one, 5 (image) + 7 on row two */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:gap-5 lg:grid-cols-12 lg:grid-flow-dense lg:gap-6">
          {/* Image card */}
          <div
            data-anime="reseller-card"
            className={`group relative min-h-[340px] overflow-hidden bg-[#f3dcc4] md:col-span-2 lg:col-span-5 lg:row-span-2 lg:min-h-[560px] will-change-transform ${cardBase}`}
          >
            <Image
              data-reseller-img="bottle"
              src="/images/reseller-lifestyle-tall.jpg"
              alt="Divinity Cosmetics Marula and Baobab body lotion packed with travel tote and luggage under sunlit blue skies"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center scale-110 will-change-transform"
            />
          </div>

          {/* Support */}
          <div
            data-anime="reseller-card"
            onMouseEnter={handleCardEnter}
            className={`flex flex-col justify-between gap-10 p-6 md:p-7 lg:col-span-4 lg:p-8 will-change-transform cursor-pointer ${cardBase}`}
          >
            <span data-anime="reseller-badge" className={`${iconBadge} will-change-transform`}>
              <Headset size={22} weight="regular" aria-hidden="true" />
            </span>
            <div>
              <h3 className="m-0 text-[1.7rem] leading-[1.1] font-normal text-black">
                Dedicated support
              </h3>
              <p className="mt-3 mb-0 max-w-[34ch] text-[1.05rem] leading-relaxed">
                Direct access to our brand team for product education and marketing assets.
              </p>
            </div>
          </div>

          {/* Territory */}
          <div
            data-anime="reseller-card"
            onMouseEnter={handleCardEnter}
            className={`flex flex-col justify-between gap-10 p-6 md:p-7 lg:col-span-3 lg:p-8 will-change-transform cursor-pointer ${cardBase}`}
          >
            <span data-anime="reseller-badge" className={`${iconBadge} will-change-transform`}>
              <MapPin size={22} weight="regular" aria-hidden="true" />
            </span>
            <div>
              <h3 className="m-0 text-[1.7rem] leading-[1.1] font-normal text-black">
                Exclusive territory
              </h3>
              <p className="mt-3 mb-0 max-w-[30ch] text-[1.05rem] leading-relaxed">
                Curated partners only, so your boutique stays exclusive in your area.
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div
            data-anime="reseller-card"
            className={`relative flex flex-col justify-between gap-10 overflow-hidden p-7 md:p-9 lg:col-span-7 lg:p-10 will-change-transform ${cardBase} bg-[#faf8f5]`}
          >
            <div className="max-w-xl">
              <h3 className="m-0 text-[clamp(2rem,3.4vw,3.1rem)] leading-[1.02] font-normal text-black">
                Bring Divinity to your shelves.
              </h3>
              <p className="mt-4 mb-0 max-w-[46ch] text-[1.05rem] leading-relaxed text-black/80">
                Partner with us to offer premium, sustainably sourced African botanicals to
                your clientele, with favorable margins for our authorized stockists.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row pt-2">
              <Link
                href="/reseller/apply"
                className="btn-primary whitespace-nowrap"
              >
                Apply to partner
              </Link>
              <Link
                href="/reseller"
                className="btn-secondary whitespace-nowrap"
              >
                How the program works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
