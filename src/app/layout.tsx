import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/lib/context/CartContext";
import { siteConfig } from "@/lib/config/site";
import { DEFAULT_OG_IMAGE } from "@/lib/seo/metadata";
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
    default: "Divinity Cosmetics | Facial-Grade Body Care South Africa",
    template: "%s | Divinity Cosmetics",
  },
  description:
    "Facial-grade South African body care with 10% cold-pressed Marula and 10% Baobab oils for 24-hour hydration, smoother skin, and 90-day barrier repair.",
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
    title: "Divinity Cosmetics | Facial-Grade Body Care South Africa",
    description:
      "Your body deserves the same botanical standard as your face. Cold-pressed South African Marula and Baobab seed oils for 24-hour climate protection.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_ZA",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Divinity Cosmetics | Marula & Baobab Body Lotion (400ml)",
    description:
      "Replace water-heavy supermarket lotions with cold-pressed African Marula and Baobab oils for 24-hour hydration and 90-day barrier repair.",
    images: ["/twitter-image"],
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
