import localFont from "next/font/local";

/**
 * Chloe - Classic Luxury Editorial Display Serif
 * Designer: Josh Ownby
 * Note: Acquired via personal-use trial; commercial webfont license required for production.
 */
export const chloe = localFont({
  src: "./fonts/chloe/Chloe-Regular.otf",
  variable: "--font-chloe",
  display: "swap",
});

/**
 * Code Next - Ultra-Modern Geometric Hairline Sans
 * Foundry: Fontfabric (Svetoslav Simov)
 * Weight: Hairline (100) - display and accent usage only.
 * Note: Acquired via personal-use trial; commercial webfont license required for production.
 */
export const codeNext = localFont({
  src: "./fonts/code-next/CodeNext-Hairline.otf",
  variable: "--font-code-next",
  display: "swap",
  weight: "100",
});

