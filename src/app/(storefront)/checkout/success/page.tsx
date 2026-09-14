"use client";

import React, { Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "";

  if (!isLoaded) {
    return <div className="min-h-screen pt-40 flex justify-center text-gray-500">Processing...</div>;
  }

  const firstName = user?.firstName || "there";

  if (isLoaded && !user) {
    // If not logged in, they shouldn't be on the success page, maybe redirect to home
    // But actually, guest checkout is possible, so we shouldn't force redirect if we plan to support it.
    // However, our current checkout page redirects to "/" if not user.
    // Let's just allow it or redirect. For now, since user is optional, we'll let it render.
  }

  return (
    <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Success Icon */}
      <div className="text-[#3d7b32] mb-4">
        <CheckCircle size={80} weight="fill" />
      </div>

      {/* Heading (2-Line Iron Rule) */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-tight max-w-xl mx-auto">
        Thank you, {firstName}. <br className="hidden md:block" /> Your order is confirmed.
      </h1>

      {/* Details */}
      <div className="space-y-2 text-gray-500 max-w-md mx-auto">
        <p className="text-lg">
          We've received your order and are preparing it for shipment.
        </p>
        {orderNumber && (
          <p className="text-sm tracking-wider uppercase font-medium text-gray-400 mt-6">
            Order Number: <span className="text-gray-900">{orderNumber}</span>
          </p>
        )}
      </div>

      {/* Action */}
      <div className="pt-12 w-full flex justify-center">
        <Link 
          href="/shop" 
          className="inline-block bg-black text-white px-10 py-4 font-medium uppercase tracking-wider text-sm hover:bg-[#3d7b32] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
      
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-6 md:px-12 font-sans text-[#1a1a1a]">
      <Suspense fallback={<div className="min-h-screen pt-40 flex justify-center text-gray-500">Processing...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
