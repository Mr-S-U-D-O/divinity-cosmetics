import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Package, Truck, User } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "My Account & Orders | Divinity Cosmetics",
  robots: { index: false, follow: false },
};

function formatStatusBadge(status: string, trackingStatus?: string | null) {
  if (trackingStatus) {
    return trackingStatus
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  switch (status) {
    case "DELIVERED":
      return "Delivered";
    case "SHIPPED":
      return "Shipped";
    case "PROCESSING":
      return "Processing";
    case "PAID":
      return "Paid";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Pending";
  }
}

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userEmails = user.emailAddresses
    .map((e) => e.emailAddress.trim())
    .filter(Boolean);

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { userId: user.id },
        ...(userEmails.length > 0
          ? userEmails.map((email) => ({
              email: { equals: email, mode: "insensitive" as const },
            }))
          : []),
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  const primaryEmail = user.emailAddresses[0]?.emailAddress || "";

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-[#1a1a1a] pt-32 md:pt-36 pb-24 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Account Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-black">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3d7b32] mb-2">
              <User size={13} weight="bold" />
              <span>Divinity Member Account</span>
            </span>
            <h1 className="font-chloe text-4xl md:text-5xl font-normal tracking-tight text-black m-0">
              Welcome back, {user.firstName || "Guest"}.
            </h1>
            {primaryEmail && (
              <p className="text-xs sm:text-sm text-black/65 mt-1.5 m-0">
                {primaryEmail}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/order-status"
              className="btn-secondary !h-10 !py-0 !px-5 text-xs uppercase tracking-[0.14em]"
            >
              <Truck size={15} weight="bold" />
              <span>Track an Order</span>
            </Link>
            <Link
              href="/shop"
              className="btn-primary !h-10 !py-0 !px-5 text-xs uppercase tracking-[0.14em]"
            >
              <span>Shop</span>
            </Link>
          </div>
        </div>

        {/* Order History Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-black m-0 flex items-center gap-2">
              <Package size={18} weight="bold" className="text-[#3d7b32]" />
              <span>Order History</span>
            </h2>
            <span className="text-xs font-mono text-black/60">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-black text-center space-y-4">
              <p className="text-sm text-black/70 m-0">
                You haven&apos;t placed any orders yet.
              </p>
              <Link
                href="/shop"
                className="btn-primary !h-10 !py-0 !px-6 text-xs uppercase tracking-[0.14em]"
              >
                Explore the Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusLabel = formatStatusBadge(
                  order.status,
                  order.trackingStatus
                );
                const isDelivered = order.status === "DELIVERED";
                const isShipped = order.status === "SHIPPED";
                const itemCount = order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );

                return (
                  <article
                    key={order.id}
                    className="rounded-2xl border border-black bg-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-sm sm:text-base font-bold text-black">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border border-black px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isDelivered
                              ? "bg-[#3d7b32] text-white"
                              : isShipped
                              ? "bg-[#3d7b32]/15 text-[#244e1d]"
                              : "bg-[#fcfbf9] text-black"
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-black/65">
                        <span>
                          {new Date(order.createdAt).toLocaleDateString("en-ZA", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span>·</span>
                        <span>
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </span>
                        <span>·</span>
                        <span className="font-semibold text-black">
                          R{Number(order.total).toFixed(2)}
                        </span>
                        {order.waybillNumber && (
                          <>
                            <span>·</span>
                            <span className="font-mono text-black">
                              Waybill: {order.waybillNumber}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <Link
                        href={`/order-status?order=${encodeURIComponent(order.orderNumber)}`}
                        className="btn-primary !h-10 !py-0 !px-5 text-xs uppercase tracking-[0.14em]"
                      >
                        <span>Track Order</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
