import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Secure Checkout",
  description:
    "Complete your Divinity Cosmetics order securely via Paystack with nationwide South African courier delivery.",
  path: "/checkout",
  noIndex: true,
  follow: false,
});

export default function CheckoutLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
