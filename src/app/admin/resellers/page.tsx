"use client";

import React from "react";

const mockResellers = [
  { id: "RES-001", applicant: "Amanda Sterling", business: "Aura Wellness Spa", channel: "Salon/Spa", status: "Pending" },
  { id: "RES-002", applicant: "Thomas Wright", business: "Wright Organics", channel: "Retail Store", status: "Approved" },
  { id: "RES-003", applicant: "Jessica Bloom", business: "@jessicabloom_beauty", channel: "Online/Social Media", status: "Pending" },
  { id: "RES-004", applicant: "Mark Taylor", business: "Taylor Supply Co.", channel: "Direct to Network", status: "Rejected" },
  { id: "RES-005", applicant: "Rachel Green", business: "Green Leaf Boutique", channel: "Retail Store", status: "Pending" },
];

export default function AdminResellersPage() {
  const handleApprove = (id: string, business: string) => {
    console.log(`[ACTION] Approving Reseller Application: ${id} - ${business}`);
  };

  const handleReject = (id: string, business: string) => {
    console.log(`[ACTION] Rejecting Reseller Application: ${id} - ${business}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">Pending</span>;
      case "Approved":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">Approved</span>;
      case "Rejected":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#111]">Reseller Applications</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm shadow-black/[0.01] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Applicant Name</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Business Name</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Sales Channel</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockResellers.map((reseller) => (
                <tr key={reseller.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#111]">
                    {reseller.applicant}
                  </td>
                  <td className="px-6 py-4 text-[#111]">
                    {reseller.business}
                  </td>
                  <td className="px-6 py-4">
                    {reseller.channel}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(reseller.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {reseller.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleApprove(reseller.id, reseller.business)}
                          className="text-xs font-bold text-[#3d7b32] hover:bg-emerald-50 px-3 py-1.5 rounded transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(reseller.id, reseller.business)}
                          className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Processed</span>
                    )}
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
