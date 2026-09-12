"use client";

import React from "react";
import { Plus, CaretRight } from "@phosphor-icons/react";
import { mockProducts } from "@/lib/domain/products/mock-data";

export default function AdminProductsPage() {
  const handleAddProduct = () => {
    alert("New product modal coming soon");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-[#111]">Products</h1>
        <button 
          onClick={handleAddProduct}
          className="inline-flex items-center gap-2 bg-[#111] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#3d7b32] transition-colors"
        >
          <Plus size={16} weight="bold" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm shadow-black/[0.01] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Product Name</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Category</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Price</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Stock Status</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#111]">
                    {product.name}
                  </td>
                  <td className="px-6 py-4">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 font-medium text-[#111]">
                    ${product.basePrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {/* Mock stock logic based on price for variety */}
                    {product.basePrice < 100 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        In Stock
                      </span>
                    )}
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
