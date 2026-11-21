import type { Metadata } from "next";
import React, { Suspense } from "react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { OrderStatusClient } from "./OrderStatusClient";

export const metadata: Metadata = buildPageMetadata({
  title: "Track Your Order",
  description:
    "Track your Divinity Cosmetics order in real time—view packing status, your Courier Guy waybill number, and live nationwide delivery milestones.",
  path: "/order-status",
  noIndex: true,
  follow: true,
});

export default function OrderStatusPage() {
  return (
    <main className="min-h-screen bg-[#fcfbf9] text-[#1a1a1a] pt-32 md:pt-36 pb-24 px-4 sm:px-6 md:px-12">
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto text-center py-20 text-xs uppercase tracking-widest text-black/50">
            Loading order tracker...
          </div>
        }
      >
        <OrderStatusClient />
      </Suspense>
    </main>
  );
}
