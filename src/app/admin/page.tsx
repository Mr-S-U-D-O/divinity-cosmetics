import React from "react";
import { CurrencyDollar, ShoppingCart, Users, FolderOpen } from "@phosphor-icons/react/dist/ssr";

export default function AdminOverviewPage() {
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
              <p className="text-2xl font-bold text-[#111]">$124,500.00</p>
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
              <p className="text-2xl font-bold text-[#111]">42</p>
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
              <p className="text-2xl font-bold text-[#111]">15</p>
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
              <p className="text-2xl font-bold text-[#111]">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm shadow-black/[0.01] p-6 h-96 flex flex-col">
        <h2 className="text-lg font-bold text-[#111] mb-6">Revenue Over Time</h2>
        <div className="flex-1 w-full bg-gradient-to-tr from-gray-50 to-gray-100 border border-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Faux grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50"></div>
          
          <div className="relative text-center px-4">
            <p className="text-gray-400 font-medium text-sm">[Chart Implementation Pending]</p>
            <p className="text-gray-300 text-xs mt-1">Requires charting library setup</p>
          </div>
        </div>
      </div>
    </div>
  );
}
