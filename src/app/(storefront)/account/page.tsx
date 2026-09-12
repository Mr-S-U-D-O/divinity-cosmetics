import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function AccountPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] pt-40 pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl tracking-tighter font-medium mb-12">
          Welcome back, {user.firstName || "Guest"}.
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="text-xl font-medium tracking-tight mb-4">Order History</h2>
            <p className="text-gray-500 mb-6">You haven&apos;t placed any orders yet.</p>
            <button className="text-sm font-medium underline underline-offset-4 hover:text-[#3d7b32] transition-colors">
              Continue Shopping
            </button>
          </div>
          
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="text-xl font-medium tracking-tight mb-4">Profile Settings</h2>
            <p className="text-gray-500 mb-6">Manage your account details and addresses.</p>
            <button className="text-sm font-medium underline underline-offset-4 hover:text-[#3d7b32] transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
