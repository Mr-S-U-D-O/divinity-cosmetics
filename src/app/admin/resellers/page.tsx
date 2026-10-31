"use client";

import React from "react";

export default function AdminResellersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#111]">Reseller Applications</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm shadow-black/[0.01] p-12 text-center">
        <h2 className="text-lg font-bold text-[#111]">No reseller applications yet</h2>
        <p className="text-sm text-gray-500 mt-2">
          Real reseller applications will appear here after they are submitted.
        </p>
      </div>
    </div>
  );
}
