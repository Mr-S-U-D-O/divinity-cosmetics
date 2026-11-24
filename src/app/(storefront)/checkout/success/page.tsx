"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  CheckCircle, 
  Check, 
  Copy, 
  Printer, 
  Truck, 
  Package, 
  Clock, 
  MapPin, 
  WhatsappLogo, 
  EnvelopeSimple, 
  ShieldCheck,
  Sparkle
} from "@phosphor-icons/react";
import { getOrderDetailsAction } from "@/lib/domain/orders/actions";
import { siteConfig } from "@/lib/config/site";

interface OrderData {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  shippingAddress: {
    streetAddress?: string;
    suburb?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
  };
  shippingMethod: string;
  shippingCost: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  currency: string;
  waybillNumber?: string | null;
  trackingUrl?: string | null;
  trackingStatus?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  items: {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
    image: string;
    category?: string;
  }[];
}

function OrderSuccessSkeleton() {
  return (
    <div className="max-w-5xl w-full mx-auto space-y-12 animate-pulse">
      {/* 1. Brand Celebration Header Skeleton */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50/80 border border-black/20 shadow-sm mb-2">
          <div className="w-8 h-8 rounded-full bg-stone-200" />
        </div>

        <div className="space-y-2">
          <div className="h-9 sm:h-12 w-80 sm:w-96 max-w-full bg-stone-200 rounded-xl mx-auto" />
          <div className="h-7 sm:h-9 w-60 sm:w-72 max-w-full bg-stone-200 rounded-xl mx-auto" />
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="h-3.5 w-full max-w-lg bg-stone-200 rounded-md mx-auto" />
          <div className="h-3.5 w-full max-w-sm bg-stone-200 rounded-md mx-auto" />
        </div>

        {/* Order Reference Pill Skeleton */}
        <div className="pt-2 flex items-center justify-center">
          <div className="h-9 w-64 bg-white border border-black/20 rounded-full shadow-sm flex items-center justify-between px-4">
            <div className="h-3 w-20 bg-stone-200 rounded" />
            <div className="h-3.5 w-24 bg-stone-200 rounded" />
          </div>
        </div>
      </div>

      {/* 2. Order Fulfillment Journey Tracker Skeleton */}
      <div className="bg-white/90 backdrop-blur-sm border border-black rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-black">
          <div className="space-y-1.5">
            <div className="h-5 w-48 bg-stone-200 rounded-md" />
            <div className="h-3 w-64 bg-stone-200 rounded-md" />
          </div>
          <div className="h-8 w-60 bg-stone-100 border border-black/20 rounded-full" />
        </div>

        {/* 4-Step Visual Progress Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className="p-4 rounded-2xl bg-stone-50 border border-black/20 flex items-start gap-3.5"
            >
              <div className="w-8 h-8 rounded-full bg-stone-200 shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="h-2.5 w-20 bg-stone-200 rounded" />
                <div className="h-3.5 w-28 bg-stone-200 rounded" />
                <div className="h-2.5 w-36 bg-stone-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Detailed Receipt & Destination Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Itemized Purchase Receipt Skeleton (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-black rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-black pb-3">
            <div className="space-y-1">
              <div className="h-5 w-44 bg-stone-200 rounded-md" />
              <div className="h-3 w-36 bg-stone-200 rounded-md" />
            </div>
            <div className="h-6 w-24 bg-stone-100 rounded-full border border-black/20" />
          </div>

          {/* 2 Items Skeletons */}
          <div className="space-y-3.5">
            {[1, 2].map((idx) => (
              <div key={idx} className="flex items-center gap-4 py-2 border-b border-black/10 last:border-0">
                <div className="w-14 h-16 rounded-xl bg-stone-100 border border-black/15 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 max-w-full bg-stone-200 rounded-md" />
                  <div className="h-3 w-28 bg-stone-200 rounded-md" />
                </div>
                <div className="h-4 w-16 bg-stone-200 rounded-md shrink-0" />
              </div>
            ))}
          </div>

          {/* Totals Breakdown Skeleton */}
          <div className="border-t border-black pt-4 space-y-2.5">
            <div className="flex justify-between">
              <div className="h-3.5 w-20 bg-stone-200 rounded" />
              <div className="h-3.5 w-16 bg-stone-200 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-3.5 w-40 bg-stone-200 rounded" />
              <div className="h-3.5 w-16 bg-stone-200 rounded" />
            </div>
            <div className="flex justify-between items-center border-t border-black pt-3">
              <div className="space-y-1">
                <div className="h-4 w-32 bg-stone-200 rounded" />
                <div className="h-2.5 w-44 bg-stone-200 rounded" />
              </div>
              <div className="h-7 w-28 bg-stone-200 rounded-lg" />
            </div>
          </div>

          {/* Verification Badge Skeleton */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-black/20 flex items-center justify-between">
            <div className="h-3.5 w-36 bg-stone-200 rounded" />
            <div className="h-5 w-24 bg-stone-200 rounded-full" />
          </div>
        </div>

        {/* Right: Destination & Customer Care Skeleton (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Shipping Address Card Skeleton */}
          <div className="bg-white border border-black rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="border-b border-black pb-3 flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-stone-200 shrink-0" />
              <div className="h-4 w-32 bg-stone-200 rounded-md" />
            </div>

            <div className="space-y-2 pt-1">
              <div className="h-4 w-40 bg-stone-200 rounded" />
              <div className="h-3 w-56 max-w-full bg-stone-200 rounded" />
              <div className="h-3 w-48 max-w-full bg-stone-200 rounded" />
              <div className="h-3 w-36 bg-stone-200 rounded" />
            </div>

            <div className="pt-3 border-t border-black space-y-2">
              <div className="h-3 w-48 bg-stone-200 rounded" />
              <div className="h-3 w-32 bg-stone-200 rounded" />
            </div>
          </div>

          {/* Customer Support & Concierge Card Skeleton */}
          <div className="bg-[#faf9f6] border border-black rounded-3xl p-6 shadow-sm space-y-3.5">
            <div className="h-3.5 w-48 bg-stone-200 rounded" />
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-stone-200 rounded" />
              <div className="h-3 w-4/5 bg-stone-200 rounded" />
            </div>
            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <div className="h-10 w-full sm:w-1/2 bg-stone-200 rounded-full" />
              <div className="h-10 w-full sm:w-1/2 bg-stone-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons Footer Skeleton */}
      <div className="pt-6 border-t border-black flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="h-12 w-full sm:w-64 bg-stone-200 rounded-full" />
        <div className="h-12 w-full sm:w-48 bg-stone-200 rounded-full" />
      </div>
    </div>
  );
}

function SuccessContent() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "";
  const urlReceiptToken = searchParams.get("token") || "";

  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(orderNumber));
  const [copied, setCopied] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [manualOrderInput, setManualOrderInput] = useState(orderNumber);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [receiptToken] = useState(() => urlReceiptToken);

  useEffect(() => {
    if (!orderNumber) {
      return;
    }

    let isMounted = true;
    getOrderDetailsAction(orderNumber, {
      receiptToken: receiptToken || undefined,
    })
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.order) {
          setOrder(res.order as OrderData);
          setAuthError(null);
          if (
            typeof window !== "undefined" &&
            window.location.search.includes("token=")
          ) {
            window.history.replaceState(
              null,
              "",
              `/checkout/success?order=${encodeURIComponent(orderNumber)}`
            );
          }
        } else {
          setOrder(null);
          setAuthError(
            res.error ||
              "Please enter the email address used at checkout (or sign in) to view this order receipt."
          );
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load order receipt:", err);
        if (isMounted) {
          setAuthError("Unable to verify receipt access right now. Please try again.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [orderNumber, receiptToken]);

  const handleGuestEmailUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetOrder = (orderNumber || manualOrderInput).trim();
    const cleanEmail = verifyEmail.trim();
    if (!targetOrder || !cleanEmail) return;

    setIsVerifyingEmail(true);
    setAuthError(null);
    try {
      const res = await getOrderDetailsAction(targetOrder, {
        receiptToken: receiptToken || undefined,
        email: cleanEmail,
      });
      if (res.success && res.order) {
        setOrder(res.order as OrderData);
      } else {
        setAuthError(
          res.error ||
            "We could not verify that email address for this order. Please double-check and try again."
        );
      }
    } catch {
      setAuthError("Unable to verify your receipt right now. Please try again.");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleCopyOrder = () => {
    const textToCopy = order?.orderNumber || orderNumber;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (isLoading) {
    return <OrderSuccessSkeleton />;
  }

  if (!order) {
    return (
      <div className="max-w-lg w-full mx-auto bg-white border border-black rounded-3xl p-7 sm:p-10 shadow-sm space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-green border border-black mx-auto">
            <ShieldCheck size={28} weight="bold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
            Verify Your Order Receipt
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            To protect your personal delivery details, please enter the email address used at checkout or sign in to your account.
          </p>
        </div>

        <form onSubmit={handleGuestEmailUnlock} className="space-y-4">
          {!orderNumber && (
            <div className="space-y-1.5">
              <label
                htmlFor="receipt-order-number"
                className="block text-[10px] font-bold uppercase tracking-[0.16em] text-stone-700"
              >
                Order Reference
              </label>
              <input
                id="receipt-order-number"
                type="text"
                required
                maxLength={40}
                value={manualOrderInput}
                onChange={(e) => setManualOrderInput(e.target.value)}
                placeholder="e.g. DIV-20261125-A3F9C102"
                className="w-full h-11 rounded-full border border-black bg-[#faf9f6] px-4 text-sm text-black outline-none focus:border-green"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="receipt-checkout-email"
              className="block text-[10px] font-bold uppercase tracking-[0.16em] text-stone-700"
            >
              Checkout Email Address
            </label>
            <input
              id="receipt-checkout-email"
              type="email"
              required
              maxLength={160}
              value={verifyEmail}
              onChange={(e) => setVerifyEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-11 rounded-full border border-black bg-[#faf9f6] px-4 text-sm text-black outline-none focus:border-green"
            />
          </div>

          {authError && (
            <p className="text-xs text-red-700 bg-red-50 border border-red-300 rounded-2xl px-4 py-2.5">
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={isVerifyingEmail}
            className="btn-primary w-full justify-center"
          >
            {isVerifyingEmail ? "Verifying..." : "View Order Receipt"}
          </button>
        </form>

        <div className="pt-4 border-t border-black/15 flex flex-wrap items-center justify-center gap-3 text-xs">
          <Link href="/sign-in" className="font-semibold text-black underline underline-offset-4 hover:text-green">
            Sign in with Clerk
          </Link>
          <span className="text-stone-300">•</span>
          <Link href="/order-status" className="font-semibold text-black underline underline-offset-4 hover:text-green">
            Track an Order
          </Link>
        </div>
      </div>
    );
  }

  const customerName = order.firstName || user?.firstName || "there";
  const displayOrderNumber = order.orderNumber || orderNumber;

  return (
    <div className="max-w-5xl w-full mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* 1. Brand Celebration Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-green border border-black shadow-sm mb-2">
          <CheckCircle size={36} weight="fill" />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight leading-tight">
          Thank you, {customerName}. <br />
          <span className="font-normal text-stone-700">Your order is confirmed.</span>
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
          We have received your order and payment. Our apothecary team is carefully preparing your botanical formulations for dispatch.
        </p>

        {/* Order Reference Pill & Track Order CTA */}
        {displayOrderNumber && (
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-black shadow-sm text-xs">
              <span className="text-gray-400 font-semibold tracking-wider uppercase text-[10px]">
                Order Reference
              </span>
              <span className="font-mono font-bold text-black text-xs md:text-sm">
                {displayOrderNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyOrder}
                className="inline-flex items-center gap-1 pl-2 border-l border-black text-stone-500 hover:text-green font-semibold text-[11px] transition-colors"
                title="Copy Order Reference"
              >
                {copied ? (
                  <>
                    <Check size={13} weight="bold" className="text-green" />
                    <span className="text-green">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} weight="bold" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <Link
              href={
                order?.email
                  ? `/order-status?order=${encodeURIComponent(displayOrderNumber)}&email=${encodeURIComponent(order.email)}`
                  : `/order-status?order=${encodeURIComponent(displayOrderNumber)}`
              }
              className="btn-primary !h-9 !py-0 !px-5 text-xs uppercase tracking-[0.14em]"
            >
              <Truck size={15} weight="bold" />
              <span>Track Your Order</span>
            </Link>
          </div>
        )}
      </div>

      {/* 2. Order Fulfillment Journey Tracker */}
      <div className="bg-white/90 backdrop-blur-sm border border-black rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-black">
          <div>
            <h2 className="text-sm md:text-base font-bold text-gray-900 tracking-tight">
              Order Fulfillment Journey
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Door-to-door courier updates will be sent to your email &amp; phone.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 border border-black text-stone-700 text-xs font-semibold w-fit">
            <Clock size={14} weight="bold" />
            <span>Estimated Delivery: 2–4 Business Days</span>
          </div>
        </div>

        {/* 4-Step Live Visual Progress Grid */}
        {(() => {
          const ts = (order?.trackingStatus || "").toLowerCase();
          const isDelivered = order?.status === "DELIVERED" || ts === "delivered";
          const isInTransit =
            isDelivered ||
            [
              "collected",
              "at-hub",
              "manifested",
              "ready-for-dispatch",
              "in-transit",
              "at-destination-hub",
              "delivery-scheduled",
              "delivery-assigned",
              "out-for-delivery",
              "in-locker",
              "ready-for-pickup",
            ].includes(ts);
          const isDispatched = isInTransit || Boolean(order?.waybillNumber) || order?.status === "SHIPPED";
          const liveStep = isDelivered ? 4 : isInTransit ? 3 : isDispatched ? 2 : 1;

          const journeySteps = [
            {
              step: 1,
              title: "Order Confirmed",
              desc: "Processed via Paystack PCI-DSS gateway",
              Icon: Check,
            },
            {
              step: 2,
              title: "Packed & Assigned",
              desc: order?.waybillNumber
                ? `Waybill ${order.waybillNumber} issued`
                : "Inspected, bottled & gift-wrapped at Springs Hub",
              Icon: Package,
            },
            {
              step: 3,
              title: "In Transit",
              desc: order?.waybillNumber
                ? "Moving via The Courier Guy"
                : "Waybill tracking issued upon dispatch",
              Icon: Truck,
            },
            {
              step: 4,
              title: "Doorstep Delivery",
              desc: isDelivered ? "Delivered to your address" : "Safely delivered to your address",
              Icon: MapPin,
            },
          ];

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              {journeySteps.map(({ step, title, desc, Icon }) => {
                const isComplete = liveStep > step || (step === 4 && liveStep === 4) || (step === 1 && liveStep >= 1);
                const isActive = (liveStep === 1 && step === 2) || (liveStep === step && step > 1 && step < 4);

                return (
                  <div
                    key={step}
                    className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                      isComplete
                        ? "bg-emerald-50/70 border-black"
                        : isActive
                        ? "bg-stone-50 border-black"
                        : "bg-stone-50/50 border-black/40 opacity-70"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                        isComplete
                          ? "bg-green text-white"
                          : isActive
                          ? "bg-black text-white"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      <Icon size={16} weight="bold" />
                    </div>
                    <div>
                      <span
                        className={`text-[10px] font-bold tracking-wider uppercase block ${
                          isComplete
                            ? "text-emerald-800"
                            : isActive
                            ? "text-stone-700"
                            : "text-stone-500"
                        }`}
                      >
                        Step {step} · {isComplete ? "Completed" : isActive ? "In Progress" : "Upcoming"}
                      </span>
                      <h3 className="text-xs font-bold text-gray-900 mt-0.5">{title}</h3>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* 3. Detailed Receipt & Destination Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Itemized Purchase Receipt (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-black rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-black pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">Itemized Order Receipt</h2>
              <p className="text-xs text-gray-500 mt-0.5">Authoritative invoice breakdown</p>
            </div>
            {order && (
              <span className="text-xs font-bold bg-stone-100 text-stone-700 px-3 py-1 rounded-full border border-black">
                {order.items.length} {order.items.length === 1 ? "Product" : "Products"}
              </span>
            )}
          </div>

          {/* Items List */}
          <div className="space-y-3.5">
            {order?.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-2 border-b border-black/10 last:border-0">
                  <div className="w-14 h-16 relative bg-[#faf9f6] rounded-xl overflow-hidden shrink-0 border border-black">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute top-1 right-1 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs md:text-sm text-gray-900 truncate">{item.name}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      R {item.price.toFixed(2)} each · Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="font-bold text-xs md:text-sm text-gray-900">
                    R {item.total.toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-xs text-stone-500 italic">
                Formulation items recorded securely under order #{displayOrderNumber}.
              </div>
            )}
          </div>

          {/* Totals Breakdown */}
          <div className="border-t border-black pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">
                R {(order?.subtotal || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Door-to-Door Courier Delivery</span>
              <span className="font-semibold text-stone-900">
                {order?.shippingCost === 0 ? (
                  <span className="text-green font-bold">FREE</span>
                ) : (
                  `R ${(order?.shippingCost || 0).toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-black pt-3 text-sm">
              <div>
                <span className="font-bold text-gray-900 block">Total Amount Paid</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Inclusive of 15% VAT &amp; Courier</span>
              </div>
              <span className="text-xl md:text-2xl font-serif font-bold text-black">
                R {(order?.total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Security & Verification Note */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-black flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} weight="bold" className="text-green shrink-0" />
              <span>Payment Gateway Status</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-black">
              <Check size={12} weight="bold" />
              <span>PAID &amp; VERIFIED</span>
            </span>
          </div>

        </div>

        {/* Right: Destination & Customer Care (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Shipping Address Card */}
          <div className="bg-white border border-black rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="border-b border-black pb-3 flex items-center gap-2.5">
              <MapPin size={18} weight="bold" className="text-green" />
              <h2 className="text-sm md:text-base font-bold text-gray-900 tracking-tight">Delivery Address</h2>
            </div>

        {order?.shippingAddress ? (
          <div className="text-xs text-stone-600 space-y-1 leading-relaxed">
            <p className="font-bold text-gray-900 text-sm">
              {order.firstName} {order.lastName}
            </p>
            {order.shippingAddress.streetAddress && (
              <p>{order.shippingAddress.streetAddress}</p>
            )}
            <p>
              {[
                order.shippingAddress.suburb,
                order.shippingAddress.city !== order.shippingAddress.suburb ? order.shippingAddress.city : null,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p>
              {[order.shippingAddress.province, order.shippingAddress.postalCode]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p className="text-stone-400 font-medium pt-1">South Africa</p>
          </div>
        ) : (
              <p className="text-xs text-stone-500 italic">
                Door-to-door courier address recorded for order #{displayOrderNumber}.
              </p>
            )}

            <div className="pt-3 border-t border-black space-y-1.5 text-[11px] text-stone-500">
              <div className="flex items-center gap-2">
                <EnvelopeSimple size={14} className="text-stone-400" />
                <span className="truncate">{order?.email || user?.primaryEmailAddress?.emailAddress || "Receipt sent to customer email"}</span>
              </div>
              {order?.phone && (
                <div className="flex items-center gap-2">
                  <span className="w-3.5 text-center font-bold text-stone-400">TEL</span>
                  <span>{order.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Support & Concierge Card */}
          <div className="bg-[#faf9f6] border border-black rounded-3xl p-6 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold tracking-tight uppercase text-stone-700">
              Questions or Delivery Customization?
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Our botanical concierge team is available to help with tracking questions, delivery instructions, or routine advice.
            </p>
            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20Divinity%20Cosmetics%20Team!%20I%20have%20an%20inquiry%20regarding%20my%20Order%20${encodeURIComponent(displayOrderNumber)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: "#25D366", color: "#ffffff", borderColor: "#1a1a1a" }}
                className="btn-primary"
              >
                <WhatsappLogo size={16} weight="fill" className="text-white" />
                <span>WhatsApp Concierge</span>
              </a>
              <a
                href={`mailto:${siteConfig.supportEmail || "support@shopdivinitycosmetics.co.za"}?subject=Order%20Inquiry%20${encodeURIComponent(displayOrderNumber)}`}
                className="btn-secondary"
              >
                <EnvelopeSimple size={16} weight="bold" />
                <span>Email Support</span>
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Action Buttons Footer */}
      <div className="pt-6 border-t border-black flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/shop"
          className="btn-primary"
        >
          <span>Continue Exploring Formulations</span>
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="btn-secondary"
        >
          <Printer size={16} weight="bold" />
          <span>Print / Save Tax Receipt</span>
        </button>
      </div>

    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main 
      style={{ paddingTop: "220px" }}
      className="min-h-screen bg-[#faf9f6]/40 pb-28 px-6 md:px-12 lg:px-24 font-sans text-black"
    >
      <Suspense fallback={<OrderSuccessSkeleton />}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
