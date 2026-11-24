"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { verifyPaymentAction } from "@/lib/domain/orders/actions";
import { CheckCircle, XCircle, SpinnerGap } from "@phosphor-icons/react";
import Link from "next/link";

function VerifySkeletonCard() {
  return (
    <div className="max-w-md w-full bg-white border border-black p-8 md:p-12 rounded-3xl shadow-sm text-center space-y-6 animate-pulse">
      {/* Icon circle skeleton */}
      <div className="w-16 h-16 rounded-full bg-emerald-50 border border-black/20 flex items-center justify-center mx-auto text-green">
        <SpinnerGap size={36} className="animate-spin text-green" />
      </div>

      {/* Headings & copy skeletons */}
      <div className="space-y-3">
        <h1 className="text-xl font-medium tracking-tight text-gray-900">
          Verifying Payment
        </h1>
        <div className="h-3.5 w-72 max-w-full bg-stone-200 rounded-md mx-auto" />
        <div className="h-3.5 w-60 max-w-full bg-stone-200 rounded-md mx-auto" />
      </div>

      {/* Verification status pill */}
      <div className="pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-black/15 text-stone-600 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-green animate-ping" />
          <span>Confirming transaction with Paystack...</span>
        </div>
      </div>
    </div>
  );
}

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const reference = searchParams.get("reference") || searchParams.get("trxref") || "";

  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState<string>("");

  const hasCalled = useRef(false);

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      setErrorMessage("No transaction reference found in callback.");
      return;
    }

    if (hasCalled.current) return;
    hasCalled.current = true;

    async function handleVerification() {
      try {
        const result = await verifyPaymentAction(reference);

        if (result.success && result.orderNumber) {
          setOrderNumber(result.orderNumber);
          setStatus("success");
          clearCart();

          const successUrl = result.receiptToken
            ? `/checkout/success?order=${encodeURIComponent(result.orderNumber)}&token=${encodeURIComponent(result.receiptToken)}`
            : `/checkout/success?order=${encodeURIComponent(result.orderNumber)}`;

          // Smoothly redirect to the success receipt page
          setTimeout(() => {
            router.push(successUrl);
          }, 1500);
        } else {
          setStatus("failed");
          setErrorMessage(result.error || "Payment verification could not be completed.");
        }
      } catch (err: any) {
        setStatus("failed");
        setErrorMessage(err.message || "An unexpected error occurred during verification.");
      }
    }

    handleVerification();
  }, [reference, clearCart, router]);

  if (status === "verifying") {
    return <VerifySkeletonCard />;
  }

  return (
    <div className="max-w-md w-full bg-white border border-black p-8 md:p-12 rounded-3xl shadow-sm text-center">
      {status === "success" && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-center text-green">
            <CheckCircle size={64} weight="fill" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-gray-900">
            Payment Verified!
          </h1>
          <p className="text-sm text-gray-500">
            Order <span className="font-semibold text-gray-900">{orderNumber}</span> has been confirmed. Redirecting you to your order summary...
          </p>
        </div>
      )}

      {status === "failed" && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-center text-red-500">
            <XCircle size={64} weight="fill" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-gray-900">
            Payment Incomplete
          </h1>
          <p className="text-sm text-gray-600 bg-red-50 border border-red-500 p-4 rounded-xl">
            {errorMessage}
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <Link
              href="/checkout"
              className="btn-primary w-full justify-center"
            >
              Return to Checkout
            </Link>
            <Link
              href="/shop"
              className="btn-secondary w-full justify-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutVerifyPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 md:px-12 font-sans text-black">
      <Suspense fallback={<VerifySkeletonCard />}>
        <VerifyContent />
      </Suspense>
    </main>
  );
}
