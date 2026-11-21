import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/lib/context/CartContext";
import { siteConfig } from "@/lib/config/site";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  serializeJsonLd,
} from "@/lib/seo/schema";
import { chloe, codeNext } from "./fonts";
import "./tailwind.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Divinity Cosmetics | Facial-Grade Botanical Body Care",
    template: "%s | Divinity Cosmetics",
  },
  description:
    "Facial-grade South African body care with cold-pressed Marula and Baobab oils for 24-hour hydration, smoother skin, and 90-day barrier repair.",
  applicationName: "Divinity Cosmetics",
  keywords: [
    "Divinity Cosmetics",
    "Marula & Baobab Body Lotion",
    "Marula and Baobab body lotion South Africa",
    "facial-grade body lotion South Africa",
    "body lotion for crepey skin South Africa",
    "body lotion for dry winter skin Highveld",
    "cold-pressed Marula oil body lotion",
    "Baobab oil skin barrier repair",
    "natural body lotion mature skin South Africa",
    "24-hour hydration body lotion",
    "shopdivinitycosmetics.co.za",
  ],
  authors: [{ name: siteConfig.founderSignOff, url: `${siteConfig.url}/about` }],
  creator: siteConfig.name,
  publisher: siteConfig.legalName,
  category: "Beauty & Skincare",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title:
      "Divinity Cosmetics | Facial-Grade Marula & Baobab Body Lotion (400ml)",
    description:
      "Your body deserves the exact same botanical standard you demand for your face. Cold-pressed South African Marula & Baobab seed oils for 24-hour climate protection and 90-day barrier repair.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Divinity Cosmetics | Marula & Baobab Body Lotion (400ml) — R400",
    description:
      "Stop settling for watery supermarket lotions that evaporate in 5 seconds. Experience 24-hour hydration and 90-day barrier repair with cold-pressed African botanicals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = buildOrganizationSchema();
  const webSiteJsonLd = buildWebSiteSchema();

  return (
    <ClerkProvider>
      <html lang="en-ZA" className={`${chloe.variable} ${codeNext.variable}`}>
        <body className="antialiased font-sans">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: serializeJsonLd([organizationJsonLd, webSiteJsonLd]),
            }}
          />
          <CartProvider>{children}</CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
