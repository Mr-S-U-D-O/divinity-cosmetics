"use client";

import { useTransition } from "react";
import { updateOrderStatusAction } from "@/lib/domain/orders/actions";
import { useRouter } from "next/navigation";

export default function StatusDropdown({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      await updateOrderStatusAction(orderId, newStatus);
      router.refresh();
    });
  };

  return (
    <div className="relative inline-block w-40">
      <select 
        value={currentStatus} 
        onChange={handleChange}
        disabled={isPending}
        className="appearance-none w-full bg-white border border-gray-200 text-[#111] py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d7b32] focus:border-transparent text-sm font-medium shadow-sm shadow-black/[0.02] cursor-pointer disabled:opacity-50 transition-colors"
      >
        <option value="PENDING">Pending</option>
        <option value="PROCESSING">Processing</option>
        <option value="SHIPPED">Shipped</option>
        <option value="DELIVERED">Delivered</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
}
