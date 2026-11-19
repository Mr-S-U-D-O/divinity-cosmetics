"use server";

import { ProductStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// ============================================================================
// NOTE [ZOHO ONE SUITE INTEGRATION]:
// Admin dashboard has been deprecated and deleted in favor of Zoho One Suite applications.
// - Catalog management, SKU creation, and stock tracking will connect to Zoho Inventory.
// - Sales, orders, and pricing will be synchronized via Zoho Inventory / Zoho Books.
// The actions below serve backend catalog mutations and will interface with Zoho APIs.
// ============================================================================

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
    isFeatured: formData.get("isFeatured") === "on",
  };
}

export async function createProductAction(formData: FormData) {
  // TODO [ZOHO INTEGRATION - Zoho Inventory]:
  // Product creation will be pushed or synchronized from Zoho Inventory item catalog.
  try {
    const data = productData(formData);
    if (data.isFeatured) {
      const currentFeaturedCount = await prisma.product.count({
        where: { isFeatured: true },
      });
      if (currentFeaturedCount >= 6) {
        throw new Error("Maximum of 6 products can be featured in Our Collection. Please uncheck featured or unfeature another product first.");
      }
    }
    const product = await prisma.product.create({ data });
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/products/${product.slug}`);
    return { success: true, product };
  } catch (error) {
    console.error("Failed to create product:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create product.");
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  // TODO [ZOHO INTEGRATION - Zoho Inventory]:
  // Product updates will sync with Zoho Inventory item master records.
  try {
    const data = productData(formData);
    if (data.isFeatured) {
      const currentFeaturedCount = await prisma.product.count({
        where: {
          isFeatured: true,
          id: { not: id },
        },
      });
      if (currentFeaturedCount >= 6) {
        throw new Error("Maximum of 6 products can be featured in Our Collection. Please uncheck featured or unfeature another product first.");
      }
    }
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/products/${product.slug}`);
    return { success: true, product };
  } catch (error) {
    console.error("Failed to update product:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update product.");
  }
}

export async function toggleProductFeaturedAction(productId: string, isFeatured: boolean) {
  // TODO [ZOHO INTEGRATION]:
  // Homepage featured collection curation (max 6) can be driven by a Zoho Inventory custom field or tag.
  if (isFeatured) {
    const currentFeaturedCount = await prisma.product.count({
      where: {
        isFeatured: true,
        id: { not: productId },
      },
    });

    if (currentFeaturedCount >= 6) {
      return {
        success: false,
        error: "Maximum of 6 products can be featured in Our Collection. Please unfeature another product first.",
        featuredCount: currentFeaturedCount,
      };
    }
  }

  try {
    const updated = await prisma.product.update({
      where: { id: productId },
      data: { isFeatured },
      select: { id: true, name: true, isFeatured: true },
    });

    const totalFeatured = await prisma.product.count({
      where: { isFeatured: true },
    });

    revalidatePath("/");
    revalidatePath("/shop");

    return {
      success: true,
      product: updated,
      featuredCount: totalFeatured,
    };
  } catch (error) {
    console.error("Failed to toggle product featured status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update featured status.",
    };
  }
}
