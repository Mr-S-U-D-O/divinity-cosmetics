import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./tailwind.css";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/lib/context/CartContext";
import { CartDrawer } from "@/components/ui/CartDrawer";

export const metadata: Metadata = {
  title: "Divinity Cosmetics",
  description: "Premium African botanicals for everyday rituals.",
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
            <Header />
            {children}
            <Footer />
            <CartDrawer />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
