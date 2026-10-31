import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/lib/context/CartContext";
import "./tailwind.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://shopdivinitycosmetics.co.za"),
  title: {
    default: "Divinity Cosmetics | South African Botanical Skincare",
    template: "%s | Divinity Cosmetics",
  },
  description: "Handcrafted in South Africa with indigenous botanicals. Sustainably harvested cold-pressed Marula, wild Baobab, and Cape Chamomile for everyday rituals.",
  keywords: [
    "Divinity Cosmetics",
    "African botanicals",
    "South African skincare",
    "Marula oil",
    "Baobab lotion",
    "organic skincare South Africa",
    "shopdivinitycosmetics.co.za"
  ],
  authors: [{ name: "Divinity Cosmetics" }],
  openGraph: {
    title: "Divinity Cosmetics | Handcrafted African Botanicals",
    description: "Sustainably harvested botanical essences for daily skin restoration. Handcrafted in South Africa.",
    url: "https://shopdivinitycosmetics.co.za",
    siteName: "Divinity Cosmetics",
    locale: "en_ZA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased font-sans">
          <CartProvider>
            {children}
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
