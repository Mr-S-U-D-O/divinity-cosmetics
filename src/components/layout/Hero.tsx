"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  animate,
  createAnimatable,
  spring,
} from "animejs";

const communityAvatars = [
  {
    src: "/images/avatars/woman-1.webp",
    alt: "Naledi, 48 - Divinity Skincare Community",
  },
  {
    src: "/images/avatars/woman-2.webp",
    alt: "Eleanor, 68 - Divinity Skincare Community",
  },
  {
    src: "/images/avatars/woman-3.webp",
    alt: "Priya, 54 - Divinity Skincare Community",
  },
  {
    src: "/images/avatars/woman-4.webp",
    alt: "Nomvula, 62 - Divinity Skincare Community",
  },
  {
    src: "/images/avatars/woman-5.webp",
    alt: "Zahra, 42 - Divinity Skincare Community",
  },
];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const desktopCenterpieceRef = useRef<HTMLDivElement>(null);
  const desktopCenterpieceImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // 1. Living Botanical Breathing on Hero Centerpiece Image
    const imgEl = desktopCenterpieceImgRef.current;
    let breathingAnim: ReturnType<typeof animate> | null = null;
    if (imgEl) {
      breathingAnim = animate(imgEl, {
        translateY: [-3.5, 3.5],
        duration: 6800,
        alternate: true,
        loop: true,
        ease: "inOutSine",
      });
    }

    // 2. Living Botanical Breathing on Hero Cream Swirl
    const swirlImg = heroRef.current?.querySelector('[data-anime="hero-swirl-img"]');
    let swirlAnim: ReturnType<typeof animate> | null = null;
    if (swirlImg) {
      swirlAnim = animate(swirlImg, {
        scale: [1, 1.025],
        duration: 7400,
        alternate: true,
        loop: true,
        ease: "inOutSine",
      });
    }

    // 3. Kinetic spatial parallax on the desktop centerpiece product container
    const cardEl = desktopCenterpieceRef.current;
    let animatableImg: ReturnType<typeof createAnimatable> | null = null;

    if (cardEl && imgEl) {
      animatableImg = createAnimatable(imgEl, {
        translateX: 500,
        translateY: 500,
        scale: 600,
        ease: "outQuart",
      });
    }

    const handlePointerMove = (e: MouseEvent) => {
      if (!cardEl || !animatableImg) return;
      const rect = cardEl.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      animatableImg.translateX(relX * -8);
      animatableImg.translateY(relY * -8);
      animatableImg.scale(1);
    };

    const handlePointerLeave = () => {
      if (!animatableImg) return;
      animatableImg.translateX(0);
      animatableImg.translateY(0);
      animatableImg.scale(1);
    };

    if (cardEl) {
      cardEl.addEventListener("mousemove", handlePointerMove);
      cardEl.addEventListener("mouseleave", handlePointerLeave);
    }

    // 4. Botanical Active Proof Percentage Counter & Reveal Animation
    const proofWrappers = heroRef.current?.querySelectorAll('[data-anime="hero-proofs"]');
    const proofDividers = heroRef.current?.querySelectorAll('[data-anime="hero-proof-divider"]');
    const proofNumEls = heroRef.current?.querySelectorAll<HTMLElement>('[data-hero-proof-num]');
    const proofAnims: Array<{ revert: () => void }> = [];

    if (proofWrappers && proofWrappers.length > 0) {
      const anim = animate(proofWrappers, {
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 900,
        delay: 200,
        ease: "outExpo",
      });
      proofAnims.push(anim);
    }

    if (proofDividers && proofDividers.length > 0) {
      const anim = animate(proofDividers, {
        scaleY: [0, 1],
        duration: 800,
        delay: 350,
        ease: "outCubic",
      });
      proofAnims.push(anim);
    }

    if (proofNumEls && proofNumEls.length > 0) {
      proofNumEls.forEach((el) => {
        const countObj = { value: 0 };
        const anim = animate(countObj, {
          value: [0, 10],
          round: 1,
          duration: 1300,
          delay: 250,
          ease: "outExpo",
          onUpdate: () => {
            el.textContent = `${countObj.value}%`;
          },
        });
        proofAnims.push(anim);
      });
    }

    return () => {
      if (cardEl) {
        cardEl.removeEventListener("mousemove", handlePointerMove);
        cardEl.removeEventListener("mouseleave", handlePointerLeave);
      }
      if (animatableImg) {
        animatableImg.revert();
      }
      if (breathingAnim) {
        breathingAnim.revert();
      }
      if (swirlAnim) {
        swirlAnim.revert();
      }
      proofAnims.forEach((anim) => anim.revert());
    };
  }, []);

  const handleAvatarEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    animate(e.currentTarget, {
      translateY: -6,
      scale: 1.14,
      ease: spring({ mass: 1, stiffness: 220, damping: 12 }),
    });
  };

  const handleAvatarLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    animate(e.currentTarget, {
      translateY: 0,
      scale: 1,
      duration: 350,
      ease: "outExpo",
    });
  };

  return (
    <section
      ref={heroRef}
      aria-label="Divinity Cosmetics Flagship Hero"
      className="relative flex h-svh max-h-svh min-h-[640px] w-full items-stretch justify-center overflow-hidden bg-white px-4 pt-[112px] pb-4 sm:px-6 md:pt-[124px] md:pb-6 lg:px-12 lg:pt-[132px] lg:pb-7 xl:pt-[138px] xl:pb-9"
    >
      {/* =====================================================================
          DESKTOP & LARGE TABLET (lg+): 3-Column Asymmetric Editorial Bento
          Fits 100% within the viewport height on 1366x768, 1440x900, 1920x1080
         ===================================================================== */}
      <div className="mx-auto my-auto hidden h-full max-h-[590px] min-h-0 w-full max-w-[1440px] lg:grid lg:grid-cols-[1.48fr_0.68fr_0.84fr] lg:items-stretch lg:gap-6 xl:grid-cols-[1.46fr_0.7fr_0.84fr] xl:gap-8">
        {/* LEFT COLUMN: Staggered Heading + 5-Circle Stack + 2 Bento Containers */}
        <div className="relative z-10 flex h-full min-h-0 min-w-0 flex-col justify-between gap-3.5 xl:gap-4">
          <h1 className="hero-heading m-0 flex shrink-0 flex-col gap-3.5 xl:gap-4">
            {/* Row 1: Heading Line 1 ("Natural") + Floating Headshot Avatars + Social Proof */}
            <span className="flex items-center gap-2.5 xl:gap-3 flex-nowrap">
              <span
                data-anime="hero-word-1"
                className="font-chloe block shrink-0 text-[clamp(2.2rem,3.2vw,3.5rem)] leading-[0.95] font-normal tracking-tight text-black select-none will-change-transform"
              >
                Natural
              </span>

              {/* Floating Headshots Stack: Women aged 40-70, diverse skin tones */}
              <span
                className="flex shrink-0 items-center -space-x-3 xl:-space-x-3.5"
                aria-label="Community of 88+ women across South Africa"
              >
                {communityAvatars.map((avatar, index) => (
                  <span
                    key={index}
                    data-anime="hero-avatar"
                    style={{ zIndex: index + 1 }}
                    onMouseEnter={handleAvatarEnter}
                    onMouseLeave={handleAvatarLeave}
                    className="relative block h-10 w-10 xl:h-11 xl:w-11 overflow-hidden rounded-full border border-white bg-neutral-100 shadow-sm hover:z-20 cursor-pointer will-change-transform"
                  >
                    <Image
                      src={avatar.src}
                      alt={avatar.alt}
                      fill
                      sizes="(min-width: 1280px) 44px, 40px"
                      className="object-cover"
                    />
                  </span>
                ))}
              </span>

              {/* Social Proof Micro-Copy: Proportionate, non-overlapping lockup */}
              <div
                data-anime="hero-proof"
                className="hero-social-proof flex flex-col justify-center min-w-0 pl-1.5 xl:pl-2 select-none will-change-transform"
              >
                <span className="hero-social-proof-title whitespace-nowrap">
                  Recommended by 88+ women
                </span>
                <span className="hero-social-proof-subtitle whitespace-nowrap mt-0.5">
                  Across South Africa
                </span>
              </div>
            </span>

            {/* Row 2: Wide Inline Bento Container (Cream Texture) + Heading Line 2 ("Restoration") */}
            <span className="grid grid-cols-[1fr_auto] items-center gap-3.5 xl:gap-5">
              <span
                data-anime="hero-swirl"
                className="relative block h-[78px] w-full min-w-[130px] xl:h-[92px] rounded-2xl overflow-hidden border-2 border-black bg-[#2d5a27] shadow-sm origin-left will-change-transform"
              >
                <Image
                  data-anime="hero-swirl-img"
                  src="/images/hero-cream-swirl.webp"
                  alt="Divinity restorative cream formula"
                  fill
                  sizes="(max-width: 1024px) 160px, 280px"
                  className="object-cover will-change-transform"
                  priority
                />
              </span>

              <span
                data-anime="hero-word-2"
                className="font-chloe block shrink-0 text-[clamp(2.3rem,3.45vw,3.6rem)] leading-[0.95] font-normal tracking-tight text-black select-none will-change-transform"
              >
                Restoration
              </span>
              <span className="sr-only">
                {" "}— Divinity Cosmetics Facial-Grade Marula &amp; Baobab Body Lotion (400ml) for 24-Hour Barrier Repair in South Africa
              </span>
            </span>
          </h1>

          {/* Row 3: Left Column Bottom Section (Reduced ~65% Bento Container + ~35% Botanical Proofs) */}
          <div className="relative flex min-h-0 w-full flex-1 flex-col justify-between gap-3">
            {/* The reduced container (~65% of the space) featuring the bottles showcase */}
            <div className="relative min-h-0 w-full flex-[1.8] overflow-hidden rounded-2xl border-2 border-black bg-[#faf8f5]">
              <Image
                src="/images/divinity-hero-bottles-lineup.jpg"
                alt="Divinity Cosmetics cold-pressed Marula and Baobab body lotion bottles lined up under warm natural sunlight"
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover object-center"
                priority
              />
            </div>

            {/* Botanical Proofs Section (~35% of the space, no outer borders, clean vertical divide) */}
            <div
              data-anime="hero-proofs"
              className="flex w-full items-center justify-between py-1 select-none will-change-transform"
            >
              {/* Left Proof: 10% Marula */}
              <div className="flex flex-1 flex-col items-center justify-center text-center pr-4">
                <span
                  data-hero-proof-num
                  className="font-chloe text-2xl xl:text-3xl font-bold tracking-tight text-black leading-none"
                >
                  10%
                </span>
                <span className="text-[11px] xl:text-xs font-semibold uppercase tracking-widest text-black/85 mt-1.5">
                  Marula
                </span>
              </div>

              {/* Vertical divider */}
              <div
                data-anime="hero-proof-divider"
                className="h-8 xl:h-9 w-[1.5px] bg-black shrink-0 origin-center will-change-transform"
                aria-hidden="true"
              />

              {/* Right Proof: 10% Baobab */}
              <div className="flex flex-1 flex-col items-center justify-center text-center pl-4">
                <span
                  data-hero-proof-num
                  className="font-chloe text-2xl xl:text-3xl font-bold tracking-tight text-black leading-none"
                >
                  10%
                </span>
                <span className="text-[11px] xl:text-xs font-semibold uppercase tracking-widest text-black/85 mt-1.5">
                  Baobab
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Hero Product Botanical Showcase Container */}
        <div
          ref={desktopCenterpieceRef}
          data-anime="hero-centerpiece"
          role="figure"
          aria-label="Divinity Cosmetics Flagship Formulation Showcase"
          className="group relative z-10 flex h-full min-h-0 min-w-0 w-full overflow-hidden rounded-2xl border-2 border-black bg-[#172314] shadow-sm will-change-transform aspect-[3/4]"
        >
          <Image
            ref={desktopCenterpieceImgRef}
            data-anime="hero-centerpiece-img"
            src="/images/divinity-hero-model-showcase.jpg"
            alt="Model with radiant, deeply moisturised skin holding Divinity Cosmetics Marula & Baobab Body Lotion (400ml), formulated with cold-pressed South African botanicals for 24-hour facial-grade barrier repair"
            title="Divinity Cosmetics Flagship 400ml Marula & Baobab Body Lotion — 24-Hour Barrier Seal"
            fill
            sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 25vw, 360px"
            className="object-cover object-center will-change-transform"
            priority
          />
        </div>

        {/* RIGHT COLUMN: Tall Feature Bento Container + Dual Stacked Pill CTAs */}
        <div className="relative z-10 flex h-full min-h-0 min-w-0 flex-col justify-between gap-3.5 xl:gap-4">
          {/* Top-Right Tall Bento Container */}
          <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-2xl border-2 border-black bg-[#faf8f5]">
            <Image
              src="/images/divinity-hero-botanical-canopy.jpg"
              alt="Sunlit South African Baobab and Marula tree canopy bearing wild botanical fruit"
              fill
              sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 28vw, 380px"
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Bottom-Right Dual Stacked Full-Width Pill CTAs */}
          <div className="flex w-full shrink-0 flex-col gap-3">
            <Link
              href="/shop"
              data-anime="hero-cta"
              className="btn-primary w-full !h-[52px] xl:!h-[58px] !text-sm xl:!text-base will-change-transform"
            >
              Explore Collection
            </Link>

            <Link
              href="#story"
              data-anime="hero-cta"
              className="btn-secondary w-full !h-[52px] xl:!h-[58px] !text-sm xl:!text-base will-change-transform"
            >
              Our Rituals
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MOBILE & SMALL TABLET (< 1024px): Touch-First Single-Viewport Bento
          Fits 100% within mobile/tablet viewport (390x844, 768x1024)
         ===================================================================== */}
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[720px] flex-col justify-between gap-2.5 sm:gap-3.5 lg:hidden">
        {/* Top Block: Staggered Two-Row Heading + 5-Circle Stack + Inline Box */}
        <h2 className="relative z-10 m-0 flex shrink-0 flex-col gap-2 sm:gap-3">
          {/* Row 1: "Natural" + Floating Headshots + Social Proof */}
          <span className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span
              data-anime="hero-word-1"
              className="font-chloe block shrink-0 text-[clamp(1.75rem,6.5vw,2.55rem)] leading-[0.95] font-normal tracking-tight text-black select-none will-change-transform"
            >
              Natural
            </span>

            <div className="flex items-center gap-2 sm:gap-2.5">
              <span
                className="flex shrink-0 items-center -space-x-2 sm:-space-x-2.5"
                aria-label="Community of 88+ women across South Africa"
              >
                {communityAvatars.map((avatar, index) => (
                  <span
                    key={index}
                    data-anime="hero-avatar"
                    style={{ zIndex: index + 1 }}
                    className="relative block h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full border border-white bg-neutral-100 shadow-sm will-change-transform"
                  >
                    <Image
                      src={avatar.src}
                      alt={avatar.alt}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </span>
                ))}
              </span>

              <div
                data-anime="hero-proof"
                className="hero-social-proof flex flex-col justify-center min-w-0 pl-1 select-none will-change-transform"
              >
                <span className="hero-social-proof-title whitespace-nowrap">
                  Recommended by 88+ women
                </span>
                <span className="hero-social-proof-subtitle whitespace-nowrap mt-0.5">
                  Across South Africa
                </span>
              </div>
            </div>
          </span>

          {/* Row 2: Inline Bento Container (Cream Texture) + "Restoration" */}
          <span className="grid grid-cols-[1fr_auto] items-center gap-2.5 sm:gap-4">
            <span
              data-anime="hero-swirl"
              className="relative block h-[52px] w-full min-w-[110px] overflow-hidden rounded-xl border-2 border-black bg-[#2d5a27] shadow-sm sm:h-[68px] sm:rounded-2xl origin-left will-change-transform"
            >
              <Image
                data-anime="hero-swirl-img"
                src="/images/hero-cream-swirl.webp"
                alt="Divinity restorative cream formula"
                fill
                sizes="160px"
                className="object-cover will-change-transform"
              />
            </span>

            <span
              data-anime="hero-word-2"
              className="font-chloe block shrink-0 text-[clamp(1.75rem,6.5vw,2.55rem)] leading-[0.95] font-normal tracking-tight text-black select-none will-change-transform"
            >
              Restoration
            </span>
          </span>
        </h2>

        {/* Middle Showcase Grid: Bento Containers + Centerpiece Box Container */}
        <div className="grid min-h-0 flex-1 grid-cols-[1.12fr_0.88fr] items-stretch gap-2.5 sm:gap-4">
          {/* Left Sub-Column: Bottom-Left & Top-Right Bento Containers */}
          <div className="relative z-10 flex min-h-0 min-w-0 flex-col gap-2.5 sm:gap-4">
            <div
              data-anime="hero-bento"
              className="min-h-0 w-full flex-1 rounded-2xl border-2 border-black bg-white p-3.5 sm:p-5 will-change-transform"
            />
            {/* Bottom Sub-Column Section: Reduced Container (~65%) + Mobile Proofs (~35%) */}
            <div className="relative flex min-h-0 w-full flex-[1.25] flex-col justify-between gap-2">
              <div className="relative min-h-0 w-full flex-[1.8] overflow-hidden rounded-2xl border-2 border-black bg-[#faf8f5]">
                <Image
                  src="/images/divinity-hero-bottles-lineup.jpg"
                  alt="Divinity Cosmetics cold-pressed Marula and Baobab body lotion bottles lined up under warm natural sunlight"
                  fill
                  sizes="(max-width: 640px) 50vw, 240px"
                  className="object-cover object-center"
                  priority
                />
              </div>

              {/* Mobile Botanical Proofs: Clean dual-stat layout for 10% Marula & 10% Baobab */}
              <div
                data-anime="hero-proofs"
                className="flex w-full items-center justify-around py-1 px-1 select-none will-change-transform"
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <span
                    data-hero-proof-num
                    className="font-chloe text-xl sm:text-2xl font-bold tracking-tight text-black leading-none"
                  >
                    10%
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-black/85 mt-1">
                    Marula
                  </span>
                </div>

                <div
                  data-anime="hero-proof-divider"
                  className="h-6 w-[1.5px] bg-black shrink-0 origin-center will-change-transform"
                  aria-hidden="true"
                />

                <div className="flex flex-col items-center justify-center text-center">
                  <span
                    data-hero-proof-num
                    className="font-chloe text-xl sm:text-2xl font-bold tracking-tight text-black leading-none"
                  >
                    10%
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-black/85 mt-1">
                    Baobab
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sub-Column: Hero Product Botanical Showcase Container */}
          <div
            data-anime="hero-centerpiece"
            role="figure"
            aria-label="Divinity Cosmetics Flagship Formulation Showcase"
            className="group relative z-10 flex min-h-0 min-w-0 w-full overflow-hidden rounded-2xl border-2 border-black bg-[#172314] shadow-sm will-change-transform aspect-[3/4]"
          >
            <Image
              data-anime="hero-centerpiece-img"
              src="/images/divinity-hero-model-showcase.jpg"
              alt="Model with radiant, deeply moisturised skin holding Divinity Cosmetics Marula & Baobab Body Lotion (400ml), formulated with cold-pressed South African botanicals for 24-hour facial-grade barrier repair"
              title="Divinity Cosmetics Flagship 400ml Marula & Baobab Body Lotion — 24-Hour Barrier Seal"
              fill
              sizes="(max-width: 640px) 45vw, 320px"
              className="object-cover object-center will-change-transform"
              priority
            />
          </div>
        </div>

        {/* Bottom Thumb-Zone Block: Dual Stacked Full-Width Pill CTAs */}
        <div className="relative z-10 flex w-full shrink-0 flex-col gap-2 sm:gap-2.5">
          <Link
            href="/shop"
            data-anime="hero-cta"
            className="btn-primary w-full !h-[48px] sm:!h-[54px] !text-xs sm:!text-sm will-change-transform"
          >
            Explore Collection
          </Link>

          <Link
            href="#story"
            data-anime="hero-cta"
            className="btn-secondary w-full !h-[48px] sm:!h-[54px] !text-xs sm:!text-sm will-change-transform"
          >
            Our Rituals
          </Link>
        </div>
      </div>
    </section>
  );
}
