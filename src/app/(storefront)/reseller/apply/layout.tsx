import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Stockist & Reseller Application",
  description:
    "Submit your salon, clinic, spa, or boutique application to join the Divinity Cosmetics South Africa authorized stockist network.",
  path: "/reseller/apply",
  noIndex: true,
  follow: false,
});

export default function ResellerApplyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
