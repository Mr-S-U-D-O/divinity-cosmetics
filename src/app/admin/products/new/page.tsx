import Link from "next/link";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import ProductForm from "../ProductForm";
import { createProductAction } from "@/lib/domain/products/actions";

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-[#111]">← Back to products</Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#111]">Add product</h1>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <ProductForm action={createProductAction} />
      </div>
    </div>
  );
}
