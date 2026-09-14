import React from "react";
import { getOrderById } from "@/lib/domain/orders/service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, User, MapPin, Receipt } from "@phosphor-icons/react/dist/ssr";
import StatusDropdown from "./StatusDropdown";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/admin/orders" className="text-sm font-medium text-gray-500 hover:text-[#111] transition-colors flex items-center gap-2 mb-2">
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#111]">{order.orderNumber}</h1>
            {getPaymentBadge(order.paymentStatus)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Fulfillment:</span>
          <StatusDropdown orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items & Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm shadow-black/[0.01] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center gap-2">
              <Package size={20} className="text-gray-500" />
              <h2 className="font-semibold text-[#111]">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item: any) => (
                <div key={item.id} className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-md flex items-center justify-center shrink-0">
                    <span className="text-gray-400 font-medium text-xs text-center">No<br/>Image</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#111]">{item.name}</h3>
                    <p className="text-sm text-gray-500">R {Number(item.price).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="font-medium text-[#111] mt-1">R {Number(item.total).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm shadow-black/[0.01] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center gap-2">
              <Receipt size={20} className="text-gray-500" />
              <h2 className="font-semibold text-[#111]">Payment Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-[#111]">R {Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping ({order.shippingMethod})</span>
                <span className="font-medium text-[#111]">R {Number(order.shippingCost).toFixed(2)}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-green-600">-R {Number(order.discountAmount).toFixed(2)}</span>
                </div>
              )}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-semibold text-[#111]">Total</span>
                <span className="font-bold text-xl text-[#111]">R {Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Customer Info */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm shadow-black/[0.01] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center gap-2">
              <User size={20} className="text-gray-500" />
              <h2 className="font-semibold text-[#111]">Customer</h2>
            </div>
            <div className="p-6">
              <p className="font-medium text-[#111]">{order.firstName} {order.lastName}</p>
              <p className="text-sm text-gray-500 mt-1">{order.email}</p>
              {order.phone && <p className="text-sm text-gray-500 mt-1">{order.phone}</p>}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm shadow-black/[0.01] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center gap-2">
              <MapPin size={20} className="text-gray-500" />
              <h2 className="font-semibold text-[#111]">Shipping Address</h2>
            </div>
            <div className="p-6 text-sm text-gray-600 space-y-1">
              {(() => {
                const addr = order.shippingAddress as any;
                if (!addr) return <p className="text-gray-400 italic">No address provided</p>;
                return (
                  <>
                    <p className="text-[#111] font-medium mb-2">{addr.streetAddress}</p>
                    {addr.suburb && <p>{addr.suburb}</p>}
                    <p>{addr.city}, {addr.province}</p>
                    <p>{addr.postalCode}</p>
                    <p className="mt-2 text-gray-500">South Africa</p>
                  </>
                );
              })()}
            </div>
          </div>
          
          {/* Notes */}
          {order.customerNotes && (
            <div className="bg-yellow-50 rounded-xl border border-yellow-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-yellow-100">
                <h2 className="font-semibold text-yellow-800 text-sm">Customer Notes</h2>
              </div>
              <div className="p-6 text-sm text-yellow-900 leading-relaxed">
                {order.customerNotes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
