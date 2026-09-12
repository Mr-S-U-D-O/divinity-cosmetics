import React from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { 
  SquaresFour, 
  Package, 
  ShoppingCart, 
  Users,
  SignOut 
} from "@phosphor-icons/react/dist/ssr";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce authentication on the server-side
  const { userId, redirectToSignIn } = await auth();
  
  if (!userId) {
    return redirectToSignIn();
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-[#111]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/admin" className="font-black text-xl tracking-tighter">
            DIVINITY <span className="text-[#3d7b32]">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 text-gray-700 hover:text-[#111] transition-colors"
          >
            <SquaresFour size={20} weight="duotone" />
            Overview
          </Link>
          <Link 
            href="/admin/products" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 text-gray-700 hover:text-[#111] transition-colors"
          >
            <Package size={20} weight="duotone" />
            Products
          </Link>
          <Link 
            href="/admin/orders" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 text-gray-700 hover:text-[#111] transition-colors"
          >
            <ShoppingCart size={20} weight="duotone" />
            Orders
          </Link>
          <Link 
            href="/admin/resellers" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 text-gray-700 hover:text-[#111] transition-colors"
          >
            <Users size={20} weight="duotone" />
            Resellers
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <SignOut size={20} />
            Exit to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
