import React from "react";
import { CurrencyDollar, ShoppingCart, Users, FolderOpen } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [paidOrders, ordersToFulfill, activeResellers, pendingApplications] =
    await Promise.all([
      prisma.order.findMany({
        where: { paymentStatus: "PAID" },
        select: { total: true },
      }),
      prisma.order.count({
        where: { status: { in: ["PENDING", "PROCESSING"] } },
      }),
      prisma.resellerProfile.count({
        where: { status: "approved" },
      }),
      prisma.resellerProfile.count({
        where: { status: "pending" },
      }),
    ]);

  const grossRevenue = paidOrders.reduce(
    (total, order) => total + Number(order.total),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#111]">Dashboard Overview</h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm shadow-black/[0.01]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-[#3d7b32]">
              <CurrencyDollar size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Gross Revenue</p>
              <p className="text-2xl font-bold text-[#111]">R {grossRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm shadow-black/[0.01]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <ShoppingCart size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Orders to Fulfill</p>
              <p className="text-2xl font-bold text-[#111]">{ordersToFulfill}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm shadow-black/[0.01]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Users size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Resellers</p>
              <p className="text-2xl font-bold text-[#111]">{activeResellers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm shadow-black/[0.01]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <FolderOpen size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Applications</p>
              <p className="text-2xl font-bold text-[#111]">{pendingApplications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm shadow-black/[0.01] p-6 h-96 flex flex-col">
        <h2 className="text-lg font-bold text-[#111] mb-6">Revenue Over Time</h2>
        <div className="flex-1 w-full bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-400 font-medium text-sm">
            Revenue history will appear as orders are recorded.
          </p>
        </div>
      </div>
    </div>
  );
}
