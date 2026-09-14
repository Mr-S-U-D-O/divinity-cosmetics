import React from "react";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { getAllOrders } from "@/lib/domain/orders/service";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  const getFulfillmentBadge = (status: string) => {
    switch (status) {
      case "PENDING":
      case "PROCESSING":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">{status}</span>;
      case "SHIPPED":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">{status}</span>;
      case "DELIVERED":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">{status}</span>;
      case "CANCELLED":
      case "REFUNDED":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">{status}</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">{status}</span>;
      case "PAID":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">{status}</span>;
      case "FAILED":
      case "REFUNDED":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">{status}</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#111]">Orders</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm shadow-black/[0.01] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Order Number</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Customer Name</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Total</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Payment</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Fulfillment</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#111]">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-[#111] font-medium">
                      {order.firstName} {order.lastName}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#111]">
                      R {Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {getPaymentBadge(order.paymentStatus)}
                    </td>
                    <td className="px-6 py-4">
                      {getFulfillmentBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="inline-block text-gray-400 hover:text-[#111] transition-colors p-1">
                        <CaretRight size={20} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
