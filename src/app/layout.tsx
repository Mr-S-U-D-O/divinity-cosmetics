import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/lib/context/CartContext";
import "./tailwind.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://shopdivinitycosmetics.co.za"),
  title: {
    default: "Divinity Cosmetics | Botanical Skincare from South Africa",
    template: "%s | Divinity Cosmetics",
  },
  description: "Shop Divinity Cosmetics: thoughtfully crafted South African skincare powered by indigenous Marula, Baobab and Cape Chamomile botanicals for nourished, restored skin.",
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
    title: "Divinity Cosmetics | Botanical Skincare from South Africa",
    description: "Thoughtfully crafted skincare powered by South African botanicals for nourished, restored skin.",
    url: "https://shopdivinitycosmetics.co.za",
    siteName: "Divinity Cosmetics",
    locale: "en_ZA",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png", sizes: "180x180" }],
  },
  twitter: {
    card: "summary",
    title: "Divinity Cosmetics | Botanical Skincare from South Africa",
    description: "Thoughtfully crafted skincare powered by South African botanicals for nourished, restored skin.",
    images: ["/favicon.png"],
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
