import { prisma } from "@/lib/prisma";
import { zohoFetch, isZohoConfigured } from "./client";
import {
  ZohoAddress,
  ZohoCreateContactPayload,
  ZohoCreateSalesOrderPayload,
  ZohoCreateInvoicePayload,
  ZohoCreatePaymentPayload,
  ZohoSyncResult,
} from "./types";
import { Prisma } from "@prisma/client";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: {
          select: {
            id: true;
            name: true;
            sku: true;
            zohoItemId: true;
          };
        };
      };
    };
  };
}>;

interface ParsedShippingAddress {
  streetAddress?: string;
  suburb?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

const STOCK_CACHE_TTL_MS = 60_000; // 60-second TTL for storefront browsing
const zohoStockCache = new Map<string, { stock: number; expiresAt: number }>();

/**
 * Fetches live stock for a single Zoho Inventory item (`GET /items/{zohoItemId}`).
 * Reads `available_stock`, falling back to `stock_on_hand`.
 * Pass `{ bypassCache: true }` for strict pre-checkout validation.
 */
export async function fetchZohoItemStock(
  zohoItemId: string,
  options?: { bypassCache?: boolean }
): Promise<number | null> {
  if (!zohoItemId || !isZohoConfigured()) {
    return null;
  }

  const now = Date.now();
  if (!options?.bypassCache) {
    const cached = zohoStockCache.get(zohoItemId);
    if (cached && now < cached.expiresAt) {
      return cached.stock;
    }
  }

  try {
    const res = await zohoFetch<{
      item?: {
        available_stock?: number | string | null;
        stock_on_hand?: number | string | null;
        actual_available_stock?: number | string | null;
      };
    }>(`items/${encodeURIComponent(zohoItemId)}`);

    const rawStock =
      res.item?.available_stock ??
      res.item?.stock_on_hand ??
      res.item?.actual_available_stock;

    if (rawStock === undefined || rawStock === null || rawStock === "") {
      return null;
    }

    const parsed = Math.max(0, Math.floor(Number(rawStock)));
    if (Number.isNaN(parsed)) {
      return null;
    }

    zohoStockCache.set(zohoItemId, {
      stock: parsed,
      expiresAt: now + STOCK_CACHE_TTL_MS,
    });

    return parsed;
  } catch (error) {
    console.error(
      `[Zoho Inventory] Failed to fetch live stock for zohoItemId=${zohoItemId}:`,
      error
    );
    return null;
  }
}

/**
 * Mirrors live Zoho Inventory stock (with 60s TTL cache) into Prisma `Product.stock`
 * so storefront pages always reflect Zoho as the Single Source of Truth.
 */
export async function syncProductsStockFromZoho(
  products: Array<{ id: string; zohoItemId?: string | null; stock: number }>
): Promise<Map<string, number>> {
  const result = new Map<string, number>();
  if (!isZohoConfigured() || products.length === 0) {
    for (const p of products) {
      result.set(p.id, p.stock);
    }
    return result;
  }

  await Promise.all(
    products.map(async (p) => {
      if (!p.zohoItemId) {
        result.set(p.id, p.stock);
        return;
      }

      const liveStock = await fetchZohoItemStock(p.zohoItemId, {
        bypassCache: false,
      });

      if (liveStock === null) {
        result.set(p.id, p.stock);
        return;
      }

      result.set(p.id, liveStock);

      // Mirror into Prisma when stock differs so DB stays aligned with Zoho
      if (liveStock !== p.stock) {
        prisma.product
          .update({
            where: { id: p.id },
            data: { stock: liveStock },
          })
          .catch((err) => {
            console.warn(
              `[Zoho Inventory] Failed to mirror stock=${liveStock} to Prisma for product ${p.id}:`,
              err
            );
          });
      }
    })
  );

  return result;
}

/**
 * Clears cached stock for a Zoho item (e.g., right after a paid order syncs).
 */
export function invalidateZohoStockCache(zohoItemId?: string | null) {
  if (zohoItemId) {
    zohoStockCache.delete(zohoItemId);
  } else {
    zohoStockCache.clear();
  }
}

function parseOrderShippingAddress(rawAddress: unknown): ZohoAddress {
  if (!rawAddress) {
    return {
      country: "South Africa",
    };
  }

  const addr: ParsedShippingAddress =
    typeof rawAddress === "string"
      ? JSON.parse(rawAddress)
      : ((rawAddress as ParsedShippingAddress) || {});

  const street = (addr.streetAddress || "").slice(0, 95);
  const cityWithSuburb = addr.suburb && addr.suburb.toLowerCase() !== (addr.city || "").toLowerCase()
    ? `${addr.suburb}, ${addr.city || ""}`
    : addr.city || addr.suburb || "";

  return {
    address: street,
    city: cityWithSuburb.slice(0, 50),
    state: (addr.province || "Gauteng").slice(0, 50),
    zip: (addr.postalCode || "").slice(0, 20),
    country: (addr.country || "South Africa").slice(0, 50),
  };
}

function formatShippingAddressSummary(rawAddress: unknown): string {
  const addr = parseOrderShippingAddress(rawAddress);
  return [addr.address, addr.city, addr.state, addr.zip, addr.country]
    .filter(Boolean)
    .join(", ");
}

/**
 * Maps storefront payment method labels (e.g. "Paystack (CARD)") to Zoho Books
 * recognized payment modes so `POST /customerpayments` never rejects the mode.
 */
function mapZohoPaymentMode(rawMethod?: string | null): string {
  const lower = (rawMethod || "").toLowerCase();
  if (lower.includes("bank") || lower.includes("eft") || lower.includes("ozow") || lower.includes("transfer")) {
    return "Bank Transfer";
  }
  if (lower.includes("cash")) {
    return "Cash";
  }
  return "Credit Card";
}

/**
 * Cached map of Zoho Inventory items (fallback only for products missing `zohoItemId` in Prisma).
 */
let cachedZohoItems: Map<string, { itemId: string; name: string; sku?: string }> | null = null;

async function getOrFetchZohoItems(): Promise<Map<string, { itemId: string; name: string; sku?: string }>> {
  if (cachedZohoItems) return cachedZohoItems;
  const map = new Map<string, { itemId: string; name: string; sku?: string }>();
  try {
    const res = await zohoFetch<{ items: Array<{ item_id: string; name: string; sku?: string }> }>("items");
    if (res.items && Array.isArray(res.items)) {
      for (const item of res.items) {
        map.set(item.name.toLowerCase().trim(), { itemId: item.item_id, name: item.name, sku: item.sku });
        if (item.sku) {
          map.set(item.sku.toLowerCase().trim(), { itemId: item.item_id, name: item.name, sku: item.sku });
        }
      }
    }
    cachedZohoItems = map;
  } catch (err) {
    console.warn("[Zoho Sync] Failed to fetch items catalog for fallback mapping:", err);
  }
  return map;
}

/**
 * Resolves Zoho line items dynamically from Prisma `Product.zohoItemId` / `Product.sku`.
 * Scales cleanly to 100+ SKUs without any hardcoded item IDs.
 */
export async function resolveZohoLineItems(
  items: OrderWithItems["items"]
) {
  let fallbackMap: Map<string, { itemId: string; name: string; sku?: string }> | null = null;

  const resolved = [];
  for (const item of items) {
    const dbZohoItemId = item.product?.zohoItemId?.trim();
    const dbSku = item.product?.sku?.trim();

    if (dbZohoItemId) {
      resolved.push({
        item_id: dbZohoItemId,
        name: item.name,
        description: `Divinity Cosmetics ${item.name}${dbSku ? ` (${dbSku})` : ""}`,
        rate: Number(item.price),
        quantity: item.quantity,
      });
      continue;
    }

    // Fallback for legacy products not yet assigned a zohoItemId in Prisma
    if (!fallbackMap) {
      fallbackMap = await getOrFetchZohoItems();
    }

    const match =
      (dbSku ? fallbackMap.get(dbSku.toLowerCase()) : undefined) ||
      fallbackMap.get(item.name.toLowerCase().trim());

    resolved.push({
      ...(match?.itemId ? { item_id: match.itemId } : {}),
      name: match?.name || item.name,
      description: `Divinity Cosmetics ${match?.name || item.name}`,
      rate: Number(item.price),
      quantity: item.quantity,
    });
  }

  return resolved;
}

/**
 * Searches Zoho Contacts by email. If not found, creates a new individual customer.
 */
export async function findOrCreateZohoCustomer(
  order: OrderWithItems
): Promise<string> {
  const customerEmail = order.email.trim();

  console.log(`[Zoho Sync] Searching for contact with email: ${customerEmail}`);
  const searchResult = await zohoFetch<{
    contacts: Array<{ contact_id: string; contact_name: string; email: string }>;
  }>(`contacts?email=${encodeURIComponent(customerEmail)}`);

  if (searchResult.contacts && searchResult.contacts.length > 0) {
    const existingId = searchResult.contacts[0].contact_id;
    console.log(`[Zoho Sync] Found existing Zoho contact: ${existingId} (${customerEmail})`);
    return existingId;
  }

  const zohoAddress = parseOrderShippingAddress(order.shippingAddress);
  const fullName = `${order.firstName} ${order.lastName}`.trim() || customerEmail;

  const contactPayload: ZohoCreateContactPayload = {
    contact_name: fullName,
    company_name: "Divinity Cosmetics Client",
    customer_sub_type: "individual",
    contact_type: "customer",
    currency_code: order.currency || "ZAR",
    contact_persons: [
      {
        first_name: order.firstName || "Customer",
        last_name: order.lastName || "",
        email: customerEmail,
        phone: order.phone || undefined,
        is_primary_contact: true,
      },
    ],
    billing_address: zohoAddress,
    shipping_address: zohoAddress,
    notes: `Created automatically via Divinity Cosmetics Storefront Checkout (Order ${order.orderNumber}).`,
  };

  console.log(`[Zoho Sync] Creating new Zoho customer: ${fullName}`);
  const createResult = await zohoFetch<{ contact: { contact_id: string } }>(
    "contacts",
    {
      method: "POST",
      body: JSON.stringify(contactPayload),
    }
  );

  const contactId = createResult.contact.contact_id;
  console.log(`[Zoho Sync] Successfully created Zoho contact ID: ${contactId}`);
  return contactId;
}

/**
 * Creates a Confirmed Sales Order in Zoho Inventory / Books.
 * Note: Do NOT pass an inline `shipping_address` object to `POST /salesorders` — Zoho Books v3
 * automatically inherits the structured shipping address from the Contact and throws Error 15
 * if an inline address object is stringified (>100 chars).
 */
export async function createZohoSalesOrder(
  customerId: string,
  order: OrderWithItems
): Promise<{ salesOrderId: string; salesOrderNumber: string }> {
  const orderDate = new Date(order.createdAt).toISOString().slice(0, 10);
  const lineItems = await resolveZohoLineItems(order.items);
  const deliverySummary = formatShippingAddressSummary(order.shippingAddress);

  const notesParts = [
    order.customerNotes ? `Customer note: ${order.customerNotes}` : null,
    deliverySummary ? `Deliver to: ${deliverySummary}` : null,
  ].filter(Boolean);

  const payload: ZohoCreateSalesOrderPayload = {
    customer_id: customerId,
    salesorder_number: order.orderNumber,
    reference_number: order.orderNumber,
    date: orderDate,
    shipment_date: orderDate,
    line_items: lineItems,
    shipping_charge: Number(order.shippingCost),
    notes:
      notesParts.join(" | ") ||
      "Standard Door-to-Door Courier Delivery (Wright Crossing Hub)",
    terms:
      "Paid in full via Paystack. Fulfillment hub: Wright Crossing Shopping Centre.",
    delivery_method: order.shippingMethod || "Standard Door-to-Door Courier",
  };

  console.log(
    `[Zoho Sync] Creating Sales Order for ${order.orderNumber} (Customer: ${customerId}) with ${lineItems.length} items`
  );

  const result = await zohoFetch<{
    salesorder: { salesorder_id: string; salesorder_number: string };
  }>("salesorders?ignore_auto_number_generation=true", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const salesOrderId = result.salesorder.salesorder_id;
  const salesOrderNumber = result.salesorder.salesorder_number;

  // Explicitly mark the Sales Order as Confirmed so it enters the Zoho Inventory packing queue
  try {
    await zohoFetch(`salesorders/${encodeURIComponent(salesOrderId)}/status/confirmed`, {
      method: "POST",
    });
    console.log(
      `[Zoho Sync] Sales Order ${salesOrderNumber} (ID: ${salesOrderId}) confirmed in Zoho Inventory.`
    );
  } catch (confirmErr) {
    console.error(
      `[Zoho Sync] Sales Order ${salesOrderId} created, but failed to mark as confirmed:`,
      confirmErr
    );
  }

  return { salesOrderId, salesOrderNumber };
}

/**
 * Creates a Tax Invoice linked to the Sales Order in Zoho Books and marks it as Sent.
 */
export async function createZohoInvoiceForSalesOrder(
  customerId: string,
  salesOrderId: string,
  order: OrderWithItems
): Promise<string> {
  const orderDate = new Date(order.createdAt).toISOString().slice(0, 10);
  const lineItems = await resolveZohoLineItems(order.items);

  const invoicePayload: ZohoCreateInvoicePayload = {
    customer_id: customerId,
    salesorder_id: salesOrderId,
    reference_number: order.orderNumber,
    date: orderDate,
    due_date: orderDate,
    line_items: lineItems,
    shipping_charge: Number(order.shippingCost),
    notes: "Thank you for choosing Divinity Cosmetics. Paid in full via Paystack.",
    terms: "Online transaction processed securely via Paystack.",
    is_inclusive_tax: true,
  };

  console.log(`[Zoho Sync] Creating Tax Invoice for Sales Order ${salesOrderId}`);
  const invoiceResult = await zohoFetch<{ invoice: { invoice_id: string } }>(
    "invoices",
    {
      method: "POST",
      body: JSON.stringify(invoicePayload),
    }
  );

  const invoiceId = invoiceResult.invoice.invoice_id;
  console.log(`[Zoho Sync] Successfully created Invoice ID: ${invoiceId}`);

  // Mark invoice as sent so customerpayments can cleanly apply against it
  try {
    await zohoFetch(`invoices/${encodeURIComponent(invoiceId)}/status/sent`, {
      method: "POST",
    });
    console.log(`[Zoho Sync] Invoice ${invoiceId} marked as SENT.`);
  } catch (sentErr) {
    console.error(
      `[Zoho Sync] Invoice ${invoiceId} created, but failed to mark as sent:`,
      sentErr
    );
  }

  return invoiceId;
}

/**
 * Records customer payment in Zoho Books to mark the Tax Invoice as PAID.
 */
export async function recordZohoInvoicePayment(
  customerId: string,
  invoiceId: string,
  order: OrderWithItems
): Promise<string> {
  const paymentDate = new Date(order.createdAt).toISOString().slice(0, 10);
  const totalAmount = Number(order.total);
  const zohoPaymentMode = mapZohoPaymentMode(order.paymentMethod);

  const paymentPayload: ZohoCreatePaymentPayload = {
    customer_id: customerId,
    payment_mode: zohoPaymentMode,
    amount: totalAmount,
    date: paymentDate,
    reference_number: order.paymentId || order.orderNumber,
    description: `Payment for Order ${order.orderNumber} via ${order.paymentMethod || "Paystack"}`,
    invoices: [
      {
        invoice_id: invoiceId,
        amount_applied: totalAmount,
      },
    ],
  };

  console.log(
    `[Zoho Sync] Recording payment of R${totalAmount.toFixed(2)} (${zohoPaymentMode}) against Invoice ${invoiceId}`
  );
  const paymentResult = await zohoFetch<{ payment: { payment_id: string } }>(
    "customerpayments",
    {
      method: "POST",
      body: JSON.stringify(paymentPayload),
    }
  );

  const paymentId = paymentResult.payment.payment_id;
  console.log(`[Zoho Sync] Successfully recorded Payment ID: ${paymentId}. Invoice marked PAID.`);
  return paymentId;
}

/**
 * Primary Orchestrator: Pushes a paid order into Zoho One (Books & Inventory).
 * Safe, idempotent, non-blocking: persists partial Zoho IDs as each step succeeds and logs
 * any Zoho API failure loudly with full error details.
 */
export async function syncPaidOrderToZoho(
  orderNumber: string
): Promise<ZohoSyncResult> {
  let customerId: string | undefined;
  let salesOrderId: string | undefined;
  let invoiceId: string | undefined;

  try {
    if (!isZohoConfigured()) {
      console.warn(
        `[💼 ZOHO PIPELINE] Zoho One credentials incomplete in environment (ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_ORG_ID, or ZOHO_REFRESH_TOKEN missing). Skipping Zoho push.`
      );
      return {
        success: false,
        skipped: true,
        reason: "credentials_not_configured",
      };
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                zohoItemId: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      console.error(`[Zoho Sync] Order ${orderNumber} not found in database.`);
      return {
        success: false,
        error: `Order with number ${orderNumber} not found.`,
      };
    }

    // Idempotency Check: if already fully synced, skip duplicate creation
    if (order.zohoSalesOrderId && order.zohoInvoiceId && order.zohoStatus === "SYNCED") {
      console.log(
        `[Zoho Sync] Order ${orderNumber} is already synchronized to Zoho (SO: ${order.zohoSalesOrderId}, Inv: ${order.zohoInvoiceId}). Skipping.`
      );
      return {
        success: true,
        skipped: true,
        customerId: order.zohoContactId || undefined,
        salesOrderId: order.zohoSalesOrderId,
        invoiceId: order.zohoInvoiceId,
      };
    }

    console.log(`[Zoho Sync] Beginning Phase 1 sync for paid order: ${orderNumber}...`);

    // Step A: Find or Create Customer
    customerId = order.zohoContactId || (await findOrCreateZohoCustomer(order));

    // Step B: Create Confirmed Sales Order (for Inventory packing queue)
    if (order.zohoSalesOrderId) {
      salesOrderId = order.zohoSalesOrderId;
    } else {
      const so = await createZohoSalesOrder(customerId, order);
      salesOrderId = so.salesOrderId;
    }

    // Step C: Create Tax Invoice in Zoho Books
    invoiceId =
      order.zohoInvoiceId ||
      (await createZohoInvoiceForSalesOrder(customerId, salesOrderId, order));

    // Step D: Record payment to mark Invoice as PAID
    const paymentId = await recordZohoInvoicePayment(
      customerId,
      invoiceId,
      order
    );

    // Step E: Update local order record with Zoho IDs
    const syncNote = `[Zoho One Sync Success] Contact: ${customerId} | SO: ${salesOrderId} | Inv: ${invoiceId} | Payment: ${paymentId}`;
    await prisma.order.update({
      where: { orderNumber },
      data: {
        zohoContactId: customerId,
        zohoSalesOrderId: salesOrderId,
        zohoInvoiceId: invoiceId,
        zohoStatus: "SYNCED",
        internalNotes: order.internalNotes
          ? `${order.internalNotes} | ${syncNote}`
          : syncNote,
      },
    });

    // Invalidate live Zoho stock cache for all items in this order
    for (const item of order.items) {
      if (item.product?.zohoItemId) {
        invalidateZohoStockCache(item.product.zohoItemId);
      }
    }

    console.log(`[Zoho Sync] Phase 1 completed successfully for order ${orderNumber}!`);

    return {
      success: true,
      customerId,
      salesOrderId,
      invoiceId,
      paymentId,
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(
      `[Zoho Sync Error] Failed to sync order ${orderNumber} to Zoho (Contact=${customerId ?? "none"}, SO=${salesOrderId ?? "none"}, Inv=${invoiceId ?? "none"}):`,
      error
    );

    // Persist any IDs already created + error message so retries don't duplicate
    try {
      const existing = await prisma.order.findUnique({
        where: { orderNumber },
        select: { internalNotes: true },
      });
      const failNote = `[Zoho Sync Failed: ${errorMsg}]`;
      await prisma.order.update({
        where: { orderNumber },
        data: {
          ...(customerId ? { zohoContactId: customerId } : {}),
          ...(salesOrderId ? { zohoSalesOrderId: salesOrderId } : {}),
          ...(invoiceId ? { zohoInvoiceId: invoiceId } : {}),
          zohoStatus: "FAILED",
          internalNotes: existing?.internalNotes
            ? `${existing.internalNotes} | ${failNote}`
            : failNote,
        },
      });
    } catch (dbErr) {
      console.error("[Zoho Sync] Failed to update failure note in DB:", dbErr);
    }

    return {
      success: false,
      error: errorMsg,
    };
  }
}
