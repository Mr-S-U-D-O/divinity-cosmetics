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
  include: { items: true };
}>;

interface ParsedShippingAddress {
  streetAddress?: string;
  suburb?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

function parseOrderShippingAddress(rawAddress: any): ZohoAddress {
  if (!rawAddress) {
    return {
      country: "South Africa",
    };
  }

  const addr: ParsedShippingAddress =
    typeof rawAddress === "string" ? JSON.parse(rawAddress) : rawAddress;

  const street = addr.streetAddress || "";
  const cityWithSuburb = addr.suburb ? `${addr.suburb}, ${addr.city || ""}` : addr.city || "";

  return {
    address: street,
    city: cityWithSuburb,
    state: addr.province || "Gauteng",
    zip: addr.postalCode || "",
    country: addr.country || "South Africa",
  };
}

/**
 * Cached map of Zoho Inventory items to link sales order lines to tracked stock.
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
    console.warn("[Zoho Sync] Failed to fetch items catalog for mapping:", err);
  }
  return map;
}

export async function resolveZohoLineItems(
  items: Array<{ name: string; price: any; quantity: number }>
) {
  const itemsMap = await getOrFetchZohoItems();

  return items.map((item) => {
    const lowerName = item.name.toLowerCase().trim();
    let match = itemsMap.get(lowerName);

    if (!match) {
      for (const [key, val] of itemsMap.entries()) {
        if (
          (key.includes("marula") && lowerName.includes("marula")) ||
          (key.includes("baobab") && lowerName.includes("baobab"))
        ) {
          match = val;
          break;
        }
      }
    }

    return {
      ...(match?.itemId ? { item_id: match.itemId } : {}),
      name: match?.name || item.name,
      description: `Divinity Cosmetics ${match?.name || item.name}`,
      rate: Number(item.price),
      quantity: item.quantity,
    };
  });
}

/**
 * Searches Zoho Contacts by email. If not found, creates a new individual customer.
 */
export async function findOrCreateZohoCustomer(
  order: OrderWithItems
): Promise<string> {
  const customerEmail = order.email.trim();

  // 1. Search for existing contact by email
  console.log(`[Zoho Sync] Searching for contact with email: ${customerEmail}`);
  const searchResult = await zohoFetch<{
    contacts: Array<{ contact_id: string; contact_name: string; email: string }>;
  }>(`contacts?email=${encodeURIComponent(customerEmail)}`);

  if (searchResult.contacts && searchResult.contacts.length > 0) {
    const existingId = searchResult.contacts[0].contact_id;
    console.log(`[Zoho Sync] Found existing Zoho contact: ${existingId} (${customerEmail})`);
    return existingId;
  }

  // 2. Format customer address and contact details
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
 * Confirmed status places the order directly into the packaging & fulfillment queue.
 */
export async function createZohoSalesOrder(
  customerId: string,
  order: OrderWithItems
): Promise<{ salesOrderId: string; salesOrderNumber: string }> {
  const zohoAddress = parseOrderShippingAddress(order.shippingAddress);
  const orderDate = new Date(order.createdAt).toISOString().slice(0, 10);

  const lineItems = await resolveZohoLineItems(order.items);

  const payload: ZohoCreateSalesOrderPayload = {
    customer_id: customerId,
    salesorder_number: order.orderNumber,
    reference_number: order.orderNumber,
    date: orderDate,
    shipment_date: orderDate,
    status: "confirmed", // Important: places it in Zoho Inventory packing queue
    line_items: lineItems,
    shipping_charge: Number(order.shippingCost),
    notes:
      order.customerNotes ||
      "Standard Door-to-Door Courier Delivery (Wright Crossing Hub)",
    terms:
      "Paid in full via Paystack. Fulfillment and packaging gate: Wright Crossing Shopping Centre Hub.",
    delivery_method: order.shippingMethod || "Standard Door-to-Door Courier",
    shipping_address: zohoAddress,
  };

  console.log(
    `[Zoho Sync] Creating confirmed Sales Order for ${order.orderNumber} (Customer: ${customerId}) with ${lineItems.length} items (linked to Zoho catalog)`
  );

  const result = await zohoFetch<{
    salesorder: { salesorder_id: string; salesorder_number: string };
  }>("salesorders?ignore_auto_number_generation=true", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const salesOrderId = result.salesorder.salesorder_id;
  const salesOrderNumber = result.salesorder.salesorder_number;
  console.log(
    `[Zoho Sync] Successfully created Sales Order: ${salesOrderNumber} (ID: ${salesOrderId})`
  );

  return { salesOrderId, salesOrderNumber };
}

/**
 * Creates a Tax Invoice linked to the Sales Order in Zoho Books.
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
    status: "sent",
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

  const paymentPayload: ZohoCreatePaymentPayload = {
    customer_id: customerId,
    payment_mode: order.paymentMethod || "Paystack",
    amount: totalAmount,
    date: paymentDate,
    reference_number: order.paymentId || order.orderNumber,
    description: `Payment for Order ${order.orderNumber} via Paystack`,
    invoices: [
      {
        invoice_id: invoiceId,
        amount_applied: totalAmount,
      },
    ],
  };

  console.log(`[Zoho Sync] Recording payment of R${totalAmount.toFixed(2)} against Invoice ${invoiceId}`);
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
 * Safe, idempotent, non-blocking: never crashes order confirmation flow if Zoho credentials
 * are missing or external API has network interruptions.
 */
export async function syncPaidOrderToZoho(
  orderNumber: string
): Promise<ZohoSyncResult> {
  try {
    // 1. Check if Zoho credentials are configured
    if (!isZohoConfigured()) {
      console.log(
        `[💼 ZOHO PIPELINE] Zoho One credentials incomplete in .env.local (ZOHO_ORG_ID or ZOHO_REFRESH_TOKEN is blank). Skipping Zoho push so sandbox payment succeeds cleanly.`
      );
      return {
        success: false,
        skipped: true,
        reason: "credentials_not_configured",
      };
    }

    // 2. Load order and items from database
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) {
      console.error(`[Zoho Sync] Order ${orderNumber} not found in database.`);
      return {
        success: false,
        error: `Order with number ${orderNumber} not found.`,
      };
    }

    // 3. Idempotency Check: if already synced, skip duplicate creation
    if (order.zohoSalesOrderId && order.zohoInvoiceId) {
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
    const customerId = await findOrCreateZohoCustomer(order);

    // Step B: Create Confirmed Sales Order (for Inventory packing queue)
    const { salesOrderId } = await createZohoSalesOrder(customerId, order);

    // Step C: Create Tax Invoice in Zoho Books
    const invoiceId = await createZohoInvoiceForSalesOrder(
      customerId,
      salesOrderId,
      order
    );

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

    console.log(`[Zoho Sync] Phase 1 completed successfully for order ${orderNumber}!`);

    return {
      success: true,
      customerId,
      salesOrderId,
      invoiceId,
      paymentId,
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Zoho Sync Error] Failed to sync order ${orderNumber} to Zoho:`, errorMsg);

    // Mark order status as FAILED in local DB without crashing caller
    try {
      const existing = await prisma.order.findUnique({
        where: { orderNumber },
        select: { internalNotes: true },
      });
      const failNote = `[Zoho Sync Failed: ${errorMsg}]`;
      await prisma.order.update({
        where: { orderNumber },
        data: {
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

