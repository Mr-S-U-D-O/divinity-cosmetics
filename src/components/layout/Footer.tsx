"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import {
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  Storefront,
  TiktokLogo,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { siteConfig } from "@/lib/config/site";
import { animate, createSpring } from "animejs";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: siteConfig.social.instagram,
    Icon: InstagramLogo,
    color: "#E4405F",
    hoverBg: "hover:bg-[#E4405F]/10 hover:border-[#E4405F]",
  },
  {
    label: "Facebook",
    href: siteConfig.social.facebook,
    Icon: FacebookLogo,
    color: "#1877F2",
    hoverBg: "hover:bg-[#1877F2]/10 hover:border-[#1877F2]",
  },
  {
    label: "TikTok",
    href: siteConfig.social.tiktok,
    Icon: TiktokLogo,
    color: "#000000",
    hoverBg: "hover:bg-neutral-100 hover:border-black",
  },
];

const BRAND_LETTERS = "Divinity".split("");

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSocialEnter = (e: React.MouseEvent<HTMLElement>) => {
    animate(e.currentTarget, {
      scale: [1, 1.12, 1],
      ease: createSpring({ mass: 1, stiffness: 220, damping: 12 }),
    });
  };

  return (
    <footer className="footer-container">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Tier 1 & 2: Grid */}
        <div className="footer-main-grid grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 lg:gap-8">
          {/* Tier 1: The Hook (Newsletter) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2
              data-anime="footer-newsletter"
              className="footer-newsletter-heading font-chloe text-3xl sm:text-5xl lg:text-7xl font-light tracking-tight mb-5 sm:mb-8 text-black will-change-transform"
            >
              Join our Newsletter.
            </h2>
            <form
              data-anime="footer-newsletter"
              className="editorial-input-wrapper will-change-transform"
              onSubmit={(e) => e.preventDefault()}
            >
              <input 
                type="email" 
                placeholder="Email address" 
                className="editorial-input" 
                required
              />
              <button type="submit" className="editorial-submit" aria-label="Subscribe">
                &rarr;
              </button>
            </form>
          </div>

          {/* Tier 2: The Nav */}
          <div className="footer-nav-grid">
            <div className="footer-link-group">
              <h4 className="footer-link-heading">Explore</h4>
              <Link href="/shop" className="footer-link">Shop Collection</Link>
              <Link href="/about" className="footer-link">Our Story</Link>
              <Link href="/reseller" className="footer-link">Reseller Program</Link>
              <Link href="/rituals" className="footer-link">Formulations</Link>
            </div>
            <div className="footer-link-group">
              <h4 className="footer-link-heading">Support</h4>
              <Link href="/contact" className="footer-link">Contact Us</Link>
              <Link href="/shipping" className="footer-link">Shipping & Returns</Link>
              <Link href="/faq" className="footer-link">FAQ</Link>
              <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            </div>
          </div>
        </div>

        {/* Contact, socials & copyright - Relayered on mobile with tighter, elegant hierarchy */}
        <div
          data-anime="footer-meta"
          className="mt-10 sm:mt-16 lg:mt-24 flex flex-col gap-6 sm:gap-10 border-t border-black/25 lg:border-black pt-7 sm:pt-10 will-change-transform"
        >
          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Contact details */}
            <ul className="m-0 flex list-none flex-col gap-4 sm:gap-5 p-0 sm:flex-row sm:gap-12">
              <li className="flex items-center gap-3.5">
                <span className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-full border border-black text-black transition-all duration-300 hover:border-green hover:bg-green/10 hover:text-green cursor-pointer">
                  <Storefront size={18} weight="regular" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-[0.68rem] uppercase tracking-[0.14em] opacity-60">Official store</span>
                  <span className="text-[0.92rem] sm:text-[1rem] break-words">{siteConfig.domain}</span>
                </span>
              </li>
              <li className="flex items-center gap-3.5">
                <span className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-full border border-black text-black transition-all duration-300 hover:border-green hover:bg-green/10 hover:text-green cursor-pointer">
                  <EnvelopeSimple size={18} weight="regular" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-[0.68rem] uppercase tracking-[0.14em] opacity-60">Support</span>
                  <a
                    href={`mailto:${siteConfig.supportEmail}`}
                    className="text-[0.92rem] sm:text-[1rem] break-words underline decoration-black/30 underline-offset-4 transition-colors duration-300 hover:text-green hover:decoration-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green"
                  >
                    {siteConfig.supportEmail}
                  </a>
                </span>
              </li>
            </ul>

            {/* Social icons */}
            <ul className="m-0 flex list-none items-center gap-2.5 sm:gap-3 p-0" aria-label="Follow Divinity Cosmetics">
              {SOCIAL_LINKS.map(({ label, href, Icon, color, hoverBg }) => (
                <li
                  key={label}
                  data-anime="footer-social"
                  className="will-change-transform"
                  onMouseEnter={handleSocialEnter}
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className={`flex size-10 sm:size-11 items-center justify-center rounded-full border border-black transition-all duration-300 ${hoverBg} shadow-sm active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green`}
                  >
                    <Icon size={18} weight="fill" style={{ color }} aria-hidden="true" />
                  </a>
                </li>
              ))}
              <li
                data-anime="footer-social"
                className="will-change-transform"
                onMouseEnter={handleSocialEnter}
              >
                <Link
                  href="/checkout"
                  aria-label="WhatsApp Concierge"
                  title="WhatsApp Concierge"
                  className="flex size-10 sm:size-11 items-center justify-center rounded-full border border-[#25D366] bg-transparent text-[#25D366] transition-all duration-300 hover:bg-[#25D366]/15 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green active:scale-95"
                >
                  <WhatsappLogo size={18} weight="fill" style={{ color: "#25D366" }} aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          <small className="block text-[0.78rem] sm:text-[0.8rem] leading-relaxed opacity-60">
            © {currentYear} Divinity Cosmetics (Pty) Ltd. Handcrafted in South Africa.
          </small>
        </div>
      </div>

      {/* Tier 3: The Anchor - Sized up and lifted up */}
      <div className="footer-massive-text-container overflow-hidden pt-1 pb-2 sm:pb-5">
        <div
          aria-hidden="true"
          data-anime="footer-watermark"
          className="footer-massive-text flex will-change-transform"
        >
          {BRAND_LETTERS.map((char, index) => (
            <span
              key={index}
              data-anime="footer-char"
              className="inline-block will-change-transform"
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
