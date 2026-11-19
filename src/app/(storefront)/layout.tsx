import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { AnimeOrchestrator } from "@/components/animations/AnimeOrchestrator";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnimeOrchestrator />
      <Header />
      {children}
      <Footer />
      <CartDrawer />
    </>
  );
}
