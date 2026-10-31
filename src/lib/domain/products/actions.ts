"use server";

import { ProductStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";

function requiredText(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${name} is required.`);
  }
  return value.trim();
}

function optionalText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function listValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string"
    ? value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean)
    : [];
}

function productData(formData: FormData) {
  const price = Number(requiredText(formData, "basePrice"));
  const stock = Number(requiredText(formData, "stock"));

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a non-negative number.");
  }
  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error("Stock must be a non-negative whole number.");
  }

  const status = requiredText(formData, "status");
  if (!Object.values(ProductStatus).includes(status as ProductStatus)) {
    throw new Error("Invalid product status.");
  }

  return {
    name: requiredText(formData, "name"),
    slug: requiredText(formData, "slug"),
    description: requiredText(formData, "description"),
    shortDescription: requiredText(formData, "shortDescription"),
    basePrice: price,
    images: listValue(formData, "images"),
    category: requiredText(formData, "category"),
    status: status as ProductStatus,
    badge: optionalText(formData, "badge"),
    concerns: listValue(formData, "concerns"),
    ingredients: listValue(formData, "ingredients"),
    stock,
    trackInventory: formData.get("trackInventory") === "on",
    metaTitle: optionalText(formData, "metaTitle"),
    metaDescription: optionalText(formData, "metaDescription"),
    sortOrder: Number(formData.get("sortOrder") || 0),
  };
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  try {
    const product = await prisma.product.create({ data: productData(formData) });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/products/${product.slug}`);
  } catch (error) {
    console.error("Failed to create product:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create product.");
  }
  redirect("/admin/products");
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin();
  try {
    const product = await prisma.product.update({
      where: { id },
      data: productData(formData),
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/products/${product.slug}`);
  } catch (error) {
    console.error("Failed to update product:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update product.");
  }
  redirect("/admin/products");
}
