"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Copy,
  Package,
  Truck,
  MapPin,
  ArrowUpRight,
  MagnifyingGlass,
  SpinnerGap,
  WarningCircle,
  Clock,
  Receipt,
} from "@phosphor-icons/react";
import {
  lookupOrderTrackingAction,
  TrackingEventDTO,
} from "@/lib/domain/orders/actions";

interface TrackedOrder {
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  firstName: string;
  email: string;
  shippingMethod: string;
  shippingCost: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  currency: string;
  destinationSummary: string;
  waybillNumber: string | null;
  trackingUrl: string | null;
  trackingStatus: string | null;
  trackingEvents: TrackingEventDTO[];
  shippedAt: string | null;
  deliveredAt: string | null;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
    image: string;
  }>;
}

/**
 * Computes active progress step (1..4):
 * 1: Order Confirmed
 * 2: Packed & Assigned (waybill issued / collection-assigned)
 * 3: In Transit (collected / at-hub / in-transit / out-for-delivery)
 * 4: Delivered
 */
function computeFulfillmentStep(order: TrackedOrder): number {
  const s = (order.trackingStatus || "").toLowerCase();
  if (order.status === "DELIVERED" || s === "delivered") return 4;

  const inTransitStatuses = new Set([
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
  ]);
  if (inTransitStatuses.has(s)) return 3;

  if (
    order.waybillNumber ||
    order.status === "SHIPPED" ||
    s === "submitted" ||
    s === "collection-assigned" ||
    s === "collection-accepted"
  ) {
    return 2;
  }

  return 1;
}

function formatTrackingLabel(raw?: string | null, fallbackStatus?: string): string {
  if (raw) {
    return raw
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  switch (fallbackStatus) {
    case "DELIVERED":
      return "Delivered";
    case "SHIPPED":
      return "Dispatched with Courier";
    case "PROCESSING":
    case "PAID":
      return "Preparing at Wright Crossing Hub";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Order Received";
  }
}

function formatDateTime(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderStatusClient() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") || "";
  const initialEmail = searchParams.get("email") || "";

  const [orderInput, setOrderInput] = useState(initialOrder);
  const [emailInput, setEmailInput] = useState(initialEmail);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(initialOrder));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedWaybill, setCopiedWaybill] = useState(false);

  const performLookup = useCallback(async (orderNo: string, email?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    const res = await lookupOrderTrackingAction(orderNo, email);
    if (res.success && res.order) {
      setOrder(res.order);
    } else {
      setOrder(null);
      setErrorMessage(res.error || "Order not found.");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (initialOrder) {
      performLookup(initialOrder, initialEmail);
    }
  }, [initialOrder, initialEmail, performLookup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(orderInput, emailInput);
  };

  const handleCopyWaybill = () => {
    if (!order?.waybillNumber) return;
    navigator.clipboard.writeText(order.waybillNumber);
    setCopiedWaybill(true);
    setTimeout(() => setCopiedWaybill(false), 2000);
  };

  const activeStep = order ? computeFulfillmentStep(order) : 0;

  const steps = [
    {
      num: 1,
      title: "Order Confirmed",
      subtitle: "Payment verified & queued",
      Icon: Check,
    },
    {
      num: 2,
      title: "Packed & Assigned",
      subtitle: "Waybill issued at Springs Hub",
      Icon: Package,
    },
    {
      num: 3,
      title: "In Transit",
      subtitle: "Moving via The Courier Guy",
      Icon: Truck,
    },
    {
      num: 4,
      title: "Delivered",
      subtitle: "Arrived at your doorstep",
      Icon: MapPin,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-black bg-white px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3d7b32]">
          <Truck size={13} weight="bold" />
          <span>Live Dispatch Tracking</span>
        </span>
        <h1 className="font-chloe text-4xl sm:text-5xl font-normal tracking-tight text-black m-0">
          Track Your Order.
        </h1>
        <p className="text-xs sm:text-sm text-black/70 leading-relaxed">
          Enter your Divinity Cosmetics order reference and checkout email to view real-time packing, waybill, and courier milestones.
        </p>
      </div>

      {/* Lookup Form Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-black bg-white p-5 sm:p-7 shadow-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
          <div className="sm:col-span-5">
            <label
              htmlFor="track-order-number"
              className="block text-[10px] font-bold uppercase tracking-[0.16em] text-black/70 mb-1.5"
            >
              Order Number
            </label>
            <input
              id="track-order-number"
              type="text"
              required
              maxLength={40}
              value={orderInput}
              onChange={(e) => setOrderInput(e.target.value)}
              placeholder="e.g. DIV-20261120-7959"
              className="w-full h-11 rounded-full border border-black bg-[#fcfbf9] px-4 text-sm text-black outline-none focus:border-[#3d7b32]"
            />
          </div>

          <div className="sm:col-span-5">
            <label
              htmlFor="track-order-email"
              className="block text-[10px] font-bold uppercase tracking-[0.16em] text-black/70 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="track-order-email"
              type="email"
              maxLength={160}
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-11 rounded-full border border-black bg-[#fcfbf9] px-4 text-sm text-black outline-none focus:border-[#3d7b32]"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full !h-11 !py-0 !px-4 text-xs uppercase tracking-[0.14em] justify-center"
            >
              {isLoading ? (
                <SpinnerGap size={16} className="animate-spin" />
              ) : (
                <>
                  <MagnifyingGlass size={15} weight="bold" />
                  <span>Track</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-red-600/40 bg-red-50 px-4 py-3 text-xs text-red-800">
            <WarningCircle size={16} weight="fill" className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>

      {/* Live Order Tracking View */}
      {order && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Status & Progress Card */}
          <div className="rounded-3xl border border-black bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-black">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#3d7b32] mb-1">
                  Order {order.orderNumber}
                </p>
                <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-black m-0">
                  {formatTrackingLabel(order.trackingStatus, order.status)}
                </h2>
                {order.destinationSummary && (
                  <p className="text-xs text-black/60 mt-1">
                    Destination: {order.destinationSummary}
                  </p>
                )}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-black bg-[#fcfbf9] px-3.5 py-1.5 text-xs font-semibold text-black w-fit">
                <Clock size={14} weight="bold" className="text-[#3d7b32]" />
                <span>{order.shippingMethod}</span>
              </div>
            </div>

            {/* 4-Step Live Progress Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {steps.map(({ num, title, subtitle, Icon }) => {
                const isDone = activeStep > num || (num === 4 && activeStep === 4);
                const isCurrent = activeStep === num && num < 4;

                return (
                  <div
                    key={num}
                    className={`rounded-2xl border-2 border-black p-4 flex items-start gap-3 transition-colors ${
                      isDone
                        ? "bg-[#3d7b32]/10"
                        : isCurrent
                        ? "bg-[#fcfbf9]"
                        : "bg-white opacity-60"
                    }`}
                  >
                    <div
                      className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                        isDone
                          ? "bg-[#3d7b32] text-white"
                          : isCurrent
                          ? "bg-black text-white"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      <Icon size={15} weight="bold" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-black/60">
                        Step {num} · {isDone ? "Done" : isCurrent ? "Active" : "Upcoming"}
                      </span>
                      <h3 className="text-xs font-bold text-black mt-0.5">{title}</h3>
                      <p className="text-[11px] text-black/65 mt-0.5 leading-snug">
                        {subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Waybill & External Courier Tracking Bar */}
            {order.waybillNumber ? (
              <div className="rounded-2xl border border-black bg-[#fcfbf9] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-black/60">
                    The Courier Guy Waybill Number
                  </span>
                  <div className="mt-1 flex items-center gap-2.5">
                    <span className="font-mono text-base sm:text-lg font-bold text-black">
                      {order.waybillNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyWaybill}
                      className="inline-flex items-center gap-1 rounded-full border border-black bg-white px-2.5 py-0.5 text-[11px] font-semibold text-black hover:text-[#3d7b32] cursor-pointer"
                    >
                      {copiedWaybill ? (
                        <>
                          <Check size={12} weight="bold" className="text-[#3d7b32]" />
                          <span className="text-[#3d7b32]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} weight="bold" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary !h-10 !py-0 !px-5 text-xs uppercase tracking-[0.14em] justify-center shrink-0"
                  >
                    <span>Track on The Courier Guy</span>
                  </a>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-black bg-[#fcfbf9] p-4 text-xs text-black/80">
                Your order is currently being carefully packed at our Wright Crossing Hub. Your Courier Guy waybill number will appear here automatically the moment dispatch is booked.
              </div>
            )}
          </div>

          {/* Scan Timeline & Itemized Order Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Live Scan Timeline */}
            <div className="lg:col-span-7 rounded-3xl border-2 border-black bg-white p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-black pb-3">
                <h3 className="text-base font-bold text-black m-0">
                  Courier Scan Timeline
                </h3>
                <span className="text-[11px] font-mono text-black/65">
                  {order.trackingEvents.length} {order.trackingEvents.length === 1 ? "event" : "events"}
                </span>
              </div>

              {order.trackingEvents.length > 0 ? (
                <ol className="m-0 list-none p-0 space-y-4">
                  {order.trackingEvents.map((ev, index) => (
                    <li
                      key={ev.id}
                      className="relative pl-6 pb-4 last:pb-0 border-l-2 border-black last:border-l-transparent"
                    >
                      <span
                        className={`absolute -left-[5px] top-1 size-2.5 rounded-full border border-black ${
                          index === 0 ? "bg-[#3d7b32]" : "bg-white"
                        }`}
                      />
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="text-xs font-bold text-black">
                          {ev.message || formatTrackingLabel(ev.status)}
                        </span>
                        {ev.date && (
                          <span className="text-[11px] text-black/55 font-mono">
                            {formatDateTime(ev.date)}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-black/65">
                        {ev.status && (
                          <span className="uppercase tracking-wider font-semibold text-[#3d7b32]">
                            {formatTrackingLabel(ev.status)}
                          </span>
                        )}
                        {ev.location && <span>· {ev.location}</span>}
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-xs text-black/65 leading-relaxed m-0">
                  Live courier scan checkpoints (collection, hub sorting, out for delivery, and proof of delivery) will appear here as soon as The Courier Guy scans your parcel.
                </p>
              )}
            </div>

            {/* Right: Itemized Order Summary */}
            <div className="lg:col-span-5 rounded-3xl border-2 border-black bg-white p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-black pb-3">
                <h3 className="text-base font-bold text-black m-0 flex items-center gap-2">
                  <Receipt size={16} weight="bold" />
                  <span>Order Summary</span>
                </h3>
                <span className="text-[11px] text-black/65">
                  {new Date(order.createdAt).toLocaleDateString("en-ZA", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 pb-3 border-b border-black last:border-0 last:pb-0"
                  >
                    <div className="relative size-12 rounded-xl overflow-hidden border border-black bg-[#fcfbf9] shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-black truncate m-0">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-black/60 m-0">
                        Qty {item.quantity} × R{item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-black shrink-0">
                      R{item.total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-black pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-black/75">
                  <span>Subtotal</span>
                  <span>R{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-black/75">
                  <span>Courier Shipping</span>
                  <span>
                    {order.shippingCost === 0
                      ? "FREE"
                      : `R${order.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[#3d7b32]">
                    <span>Discount</span>
                    <span>-R{order.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-black text-sm font-bold text-black">
                  <span>Total Paid</span>
                  <span>R{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer helper link */}
      <div className="text-center pt-2">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-black/70 hover:text-[#3d7b32] transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowUpRight size={14} weight="bold" />
        </Link>
      </div>
    </div>
  );
}
