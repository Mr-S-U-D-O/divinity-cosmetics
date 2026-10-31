import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getProductById } from "@/lib/domain/products/service";
import { updateProductAction } from "@/lib/domain/products/actions";
import ProductForm from "../../ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-[#111]">← Back to products</Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#111]">Edit product</h1>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <ProductForm action={updateProductAction.bind(null, product.id)} product={product} />
      </div>
    </div>
  );
}
