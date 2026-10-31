import { Product } from "@/lib/domain/products/types";

interface ProductFormProps {
  action: (formData: FormData) => void | Promise<void>;
  product?: Product;
}

export default function ProductForm({ action, product }: ProductFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          Name
          <input name="name" required defaultValue={product?.name} className="admin-input" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Slug
          <input name="slug" required defaultValue={product?.slug} className="admin-input" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Price (ZAR)
          <input name="basePrice" type="number" min="0" step="0.01" required defaultValue={product?.basePrice} className="admin-input" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Stock
          <input name="stock" type="number" min="0" step="1" required defaultValue={product?.stock ?? 0} className="admin-input" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Category
          <input name="category" required defaultValue={product?.category ?? "Body Care"} className="admin-input" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Status
          <select name="status" defaultValue={product?.status ?? "DRAFT"} className="admin-input">
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm font-medium">
        <input name="trackInventory" type="checkbox" defaultChecked={product?.trackInventory ?? true} className="h-4 w-4 accent-[#3d7b32]" />
        Track inventory and prevent overselling
      </label>

      <label className="space-y-2 text-sm font-medium">
        Description
        <textarea name="description" required rows={5} defaultValue={product?.description} className="admin-input" />
      </label>
      <label className="space-y-2 text-sm font-medium">
        Short description
        <textarea name="shortDescription" required rows={2} defaultValue={product?.shortDescription ?? ""} className="admin-input" />
      </label>
      <label className="space-y-2 text-sm font-medium">
        Image URLs (one per line)
        <textarea name="images" rows={3} defaultValue={product?.images.join("\n")} className="admin-input" />
      </label>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          Ingredients (comma-separated)
          <input name="ingredients" defaultValue={product?.ingredients.join(", ")} className="admin-input" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Concerns (comma-separated)
          <input name="concerns" defaultValue={product?.concerns.join(", ")} className="admin-input" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Badge
          <input name="badge" defaultValue={product?.badge ?? ""} className="admin-input" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Sort order
          <input name="sortOrder" type="number" step="1" defaultValue={product?.sortOrder ?? 0} className="admin-input" />
        </label>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          Meta title
          <input name="metaTitle" defaultValue={product?.metaTitle ?? ""} className="admin-input" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Meta description
          <input name="metaDescription" defaultValue={product?.metaDescription ?? ""} className="admin-input" />
        </label>
      </div>
      <button type="submit" className="rounded-lg bg-[#111] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3d7b32]">
        {product ? "Save product" : "Create product"}
      </button>
    </form>
  );
}
