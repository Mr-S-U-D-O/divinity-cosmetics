import React from "react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";

const mockOrders = [
  { id: "DIV-1042", customer: "Sarah Jenkins", date: "2024-05-12", total: 420.00, status: "Unfulfilled" },
  { id: "DIV-1041", customer: "Michael Chen", date: "2024-05-11", total: 85.50, status: "Shipped" },
  { id: "DIV-1040", customer: "Emma Roberts", date: "2024-05-10", total: 1250.00, status: "Delivered" },
  { id: "DIV-1039", customer: "David Wilson", date: "2024-05-10", total: 45.00, status: "Delivered" },
  { id: "DIV-1038", customer: "Olivia Davis", date: "2024-05-09", total: 320.00, status: "Shipped" },
];

export default function AdminOrdersPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Unfulfilled":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">Unfulfilled</span>;
      case "Shipped":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">Shipped</span>;
      case "Delivered":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">Delivered</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
    }
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
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Customer Name</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Total</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Fulfillment Status</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#111]">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-[#111] font-medium">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 font-medium text-[#111]">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-[#111] transition-colors p-1">
                      <CaretRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
