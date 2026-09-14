import React from "react";
import Link from "next/link";
import { Plus, CaretRight, Package } from "@phosphor-icons/react/dist/ssr";
import { getAllProducts } from "@/lib/domain/products/service";
import Image from "next/image";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-[#111]">Products</h1>
        <Link 
          href="#"
          className="inline-flex items-center gap-2 bg-[#111] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#3d7b32] transition-colors"
        >
          <Plus size={16} weight="bold" />
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
            <Package size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-[#111] mb-2">No products yet</h3>
          <p className="text-gray-500 max-w-sm mb-6">
            You haven't created any products yet. Add your first botanical creation to get started.
          </p>
          <Link 
            href="#"
            className="inline-flex items-center gap-2 bg-[#111] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#3d7b32] transition-colors"
          >
            <Plus size={16} weight="bold" />
            Add Product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm shadow-black/[0.01] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-4 font-bold tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-4 font-bold tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-4 font-bold tracking-wider">Stock</th>
                  <th scope="col" className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const statusColors = {
                    ACTIVE: "bg-emerald-100 text-emerald-800 border-emerald-200",
                    DRAFT: "bg-amber-100 text-amber-800 border-amber-200",
                    ARCHIVED: "bg-gray-100 text-gray-800 border-gray-200"
                  };
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200 flex-shrink-0">
                            {product.images?.[0] ? (
                              <Image 
                                src={product.images[0]} 
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={20} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-[#111]">{product.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#111]">
                        R {product.basePrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {product.stock > 0 ? (
                          <span className="text-gray-600">{product.stock} in stock</span>
                        ) : (
                          <span className="text-red-600 font-medium">Out of stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${statusColors[product.status]}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href="#" className="inline-block text-gray-400 hover:text-[#111] transition-colors p-1">
                          <CaretRight size={20} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
