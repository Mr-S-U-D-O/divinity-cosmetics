import React from "react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { updateResellerApplicationStatusAction } from "@/lib/domain/resellers/actions";

export default async function AdminResellersPage() {
  await requireAdmin();
  const applications = await prisma.resellerApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#111]">Reseller Applications</h1>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <h2 className="text-lg font-bold text-[#111]">No reseller applications yet</h2>
          <p className="text-sm text-gray-500 mt-2">Applications will appear here after they are submitted.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Business</th>
                <th className="px-6 py-4">Channel</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((application) => (
                <tr key={application.id}>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#111]">{application.user.firstName} {application.user.lastName}</p>
                    <p className="text-xs text-gray-500">{application.user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{application.businessName}</td>
                  <td className="px-6 py-4 text-gray-700">{application.primaryChannel}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold uppercase">{application.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <form action={updateResellerApplicationStatusAction.bind(null, application.id, "approved")}>
                        <button className="rounded-md bg-[#3d7b32] px-3 py-2 text-xs font-bold text-white">Approve</button>
                      </form>
                      <form action={updateResellerApplicationStatusAction.bind(null, application.id, "rejected")}>
                        <button className="rounded-md border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700">Reject</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
