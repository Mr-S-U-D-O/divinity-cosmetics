"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { verifyPaymentAction } from "@/lib/domain/orders/actions";
import { CheckCircle, XCircle, SpinnerGap } from "@phosphor-icons/react";
import Link from "next/link";

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

          // Smoothly redirect to the success receipt page
          setTimeout(() => {
            router.push(`/checkout/success?order=${result.orderNumber}`);
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

  return (
    <div className="max-w-md w-full bg-white border border-gray-100 p-8 md:p-12 rounded-sm shadow-sm text-center">
      {status === "verifying" && (
        <div className="space-y-6">
          <div className="flex justify-center text-black">
            <SpinnerGap size={56} className="animate-spin text-[#3d7b32]" />
          </div>
          <h2 className="text-2xl font-medium tracking-tight text-gray-900">
            Confirming Payment
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Please wait while we verify your transaction with Paystack. Do not refresh or close this page.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-center text-[#3d7b32]">
            <CheckCircle size={64} weight="fill" />
          </div>
          <h2 className="text-2xl font-medium tracking-tight text-gray-900">
            Payment Verified!
          </h2>
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
          <h2 className="text-2xl font-medium tracking-tight text-gray-900">
            Payment Incomplete
          </h2>
          <p className="text-sm text-gray-600 bg-red-50 border border-red-100 p-4 rounded-sm">
            {errorMessage}
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <Link
              href="/checkout"
              className="w-full inline-block bg-black text-white py-3 px-6 font-medium uppercase tracking-wider text-xs hover:bg-[#3d7b32] transition-colors"
            >
              Return to Checkout
            </Link>
            <Link
              href="/shop"
              className="text-xs text-gray-500 hover:text-black transition-colors"
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
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 md:px-12 font-sans text-[#1a1a1a]">
      <Suspense
        fallback={
          <div className="min-h-screen pt-40 flex justify-center text-gray-500">
            Loading verification...
          </div>
        }
      >
        <VerifyContent />
      </Suspense>
    </main>
  );
}
