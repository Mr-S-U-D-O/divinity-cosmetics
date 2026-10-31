import React from "react";
import Link from "next/link";
import { CurrencyDollar, ShoppingCart, Users, FolderOpen, Package } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export default async function AdminOverviewPage() {
  await requireAdmin();
  const [paidOrders, ordersToFulfill, activeResellers, pendingApplications, products, recentOrders] =
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
      prisma.product.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, name: true, stock: true, status: true, updatedAt: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, orderNumber: true, firstName: true, lastName: true, total: true, status: true, createdAt: true },
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#111]">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-[#3d7b32]">View all</Link>
          </div>
          <div className="space-y-4">
            {recentOrders.length === 0 ? <p className="text-sm text-gray-500">No orders yet.</p> : recentOrders.map((order) => (
              <Link href={`/admin/orders/${order.id}`} key={order.id} className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-[#111]">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.firstName} {order.lastName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#111]">R {Number(order.total).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{order.status}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#111]">Catalogue health</h2>
            <Link href="/admin/products" className="text-sm font-semibold text-[#3d7b32]">Manage</Link>
          </div>
          <div className="space-y-4">
            {products.length === 0 ? <p className="text-sm text-gray-500">No products yet.</p> : products.map((product) => (
              <Link href={`/admin/products/${product.id}/edit`} key={product.id} className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Package size={20} className="text-[#3d7b32]" />
                  <div>
                    <p className="font-semibold text-[#111]">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.status}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${product.stock > 0 ? "text-gray-700" : "text-red-600"}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
