"use server"

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  createOrder,
  getOrderByNumber,
  updateOrderStatus,
  markOrderAsPaid,
  markOrderPaymentFailed,
} from "./service";
import { OrderStatus } from "@prisma/client";
import {
  initializePaystackTransaction,
  verifyPaystackTransaction,
} from "@/lib/domain/payments/paystack";
import { fetchShiplogicRates, ShippingRateOption, GetRatesParams } from "@/lib/domain/shipping/rates";
import { fetchZohoItemStock } from "@/lib/domain/zoho/service";

export async function placeOrderAction(data: Parameters<typeof createOrder>[0]) {
  try {
    const order = await createOrder(data);

    // TODO [ZOHO INTEGRATION - Zoho Inventory & Zoho CRM]:
    // Connect Zoho Inventory API to push new sales orders for inventory allocation,
    // order fulfillment, and Zoho CRM contact synchronization.

    return { success: true, orderNumber: order.orderNumber };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to place order. Please try again." };
  }
}

/**
 * Creates an order in PENDING status and initializes a Paystack transaction.
 * Returns the Paystack authorization URL for client redirection.
 */
export async function initiateCheckoutWithPaystackAction(
  data: Parameters<typeof createOrder>[0],
  originUrl?: string
) {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return {
        success: false,
        error:
          "Paystack Secret Key is not configured. Please add PAYSTACK_SECRET_KEY to your .env file.",
      };
    }

    // 0. Strict Pre-Checkout Live Stock Gate (Zoho Inventory Single Source of Truth)
    // Performs a live, uncached stock check against Zoho Inventory BEFORE creating any order or Paystack session.
    if (data.items && data.items.length > 0) {
      const productIds = Array.from(new Set(data.items.map((i) => i.productId)));
      const dbProducts = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: {
          id: true,
          name: true,
          stock: true,
          trackInventory: true,
          zohoItemId: true,
        },
      });
      const productById = new Map(dbProducts.map((p) => [p.id, p]));

      for (const item of data.items) {
        const product = productById.get(item.productId);
        if (!product || !product.trackInventory) continue;

        const requestedQty = Math.floor(Number(item.quantity));
        if (product.zohoItemId) {
          const liveZohoStock = await fetchZohoItemStock(product.zohoItemId, {
            bypassCache: true,
          });

          if (liveZohoStock !== null) {
            // Keep Prisma mirrored with live Zoho stock
            if (liveZohoStock !== product.stock) {
              await prisma.product
                .update({
                  where: { id: product.id },
                  data: { stock: liveZohoStock },
                })
                .catch(() => {});
            }

            if (liveZohoStock < requestedQty) {
              console.warn(
                `[Zoho Stock Gate] Blocked checkout for "${product.name}" (requested=${requestedQty}, zohoAvailableStock=${liveZohoStock}).`
              );
              return {
                success: false,
                error:
                  liveZohoStock <= 0
                    ? `Sorry, ${product.name} is currently out of stock.`
                    : `Sorry, only ${liveZohoStock} unit${
                        liveZohoStock === 1 ? "" : "s"
                      } of ${product.name} ${
                        liveZohoStock === 1 ? "is" : "are"
                      } currently available in stock.`,
              };
            }
          }
        } else if (product.stock < requestedQty) {
          return {
            success: false,
            error:
              product.stock <= 0
                ? `Sorry, ${product.name} is currently out of stock.`
                : `Sorry, only ${product.stock} unit${
                    product.stock === 1 ? "" : "s"
                  } of ${product.name} ${
                    product.stock === 1 ? "is" : "are"
                  } currently available in stock.`,
          };
        }
      }
    }

    // 1. Create order in database (server strictly recalculates prices from DB)
    const order = await createOrder({
      ...data,
      currency: "ZAR",
    });

    // 2. Determine base URL for callback
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      originUrl ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const callbackUrl = `${baseUrl.replace(/\/+$/, "")}/checkout/verify?reference=${order.orderNumber}`;

    // 3. Initialize transaction with Paystack (amount must be in cents for ZAR)
    const amountInCents = Math.round(Number(order.total) * 100);

    console.log(`[💳 PAYSTACK INITIALIZE] Creating transaction session for ${order.orderNumber}:`);
    console.log(`   ├─ Amount: ${amountInCents} cents (R${Number(order.total).toFixed(2)})`);
    console.log(`   ├─ Customer: ${order.email}`);
    console.log(`   └─ Callback: ${callbackUrl}`);

    const paystackSession = await initializePaystackTransaction({
      email: order.email,
      amountInCents,
      currency: "ZAR",
      reference: order.orderNumber,
      callbackUrl,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: `${order.firstName} ${order.lastName}`,
        phone: order.phone,
      },
    });

    console.log(`[💳 PAYSTACK INITIALIZE] Session ready. Authorization URL: ${paystackSession.authorizationUrl}`);

    return {
      success: true,
      authorizationUrl: paystackSession.authorizationUrl,
      accessCode: paystackSession.accessCode,
      reference: order.orderNumber,
      orderNumber: order.orderNumber,
    };
  } catch (error: unknown) {
    console.error("Error initiating Paystack checkout:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to initiate payment. Please try again.",
    };
  }
}

/**
 * Verifies a payment reference with Paystack and updates order status.
 */
export async function verifyPaymentAction(reference: string) {
  try {
    if (!reference) {
      return { success: false, error: "No transaction reference provided." };
    }

    const verification = await verifyPaystackTransaction(reference);

    if (verification.isSuccessful) {
      const order = await markOrderAsPaid(reference, {
        paymentId: verification.reference,
        paymentMethod: verification.channel
          ? `Paystack (${verification.channel.toUpperCase()})`
          : "Paystack",
      });

      return {
        success: true,
        orderNumber: order.orderNumber,
        orderId: order.id,
      };
    } else {
      await markOrderPaymentFailed(
        reference,
        verification.gatewayResponse || verification.status
      );

      return {
        success: false,
        error:
          verification.gatewayResponse ||
          "Payment could not be verified or was cancelled.",
      };
    }
  } catch (error: unknown) {
    console.error("Error in verifyPaymentAction:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while verifying your payment.",
    };
  }
}

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  try {
    await updateOrderStatus(id, status);

    // TODO [ZOHO INTEGRATION - Zoho Inventory / Zoho Desk]:
    // Order status changes and shipping dispatch will be handled via Zoho Inventory webhooks.

    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update status." };
  }
}

/**
 * Retrieves public, verified receipt details for an order by order number.
 */
export async function getOrderDetailsAction(orderNumber: string) {
  try {
    if (!orderNumber) {
      return { success: false, error: "Order number is required." };
    }

    const order = await getOrderByNumber(orderNumber.trim());
    if (!order) {
      return { success: false, error: "Order not found." };
    }

    return {
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt.toISOString(),
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod || "Paystack",
        paymentId: order.paymentId,
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.email,
        phone: order.phone,
        shippingAddress: order.shippingAddress as {
          streetAddress?: string;
          suburb?: string;
          city?: string;
          province?: string;
          postalCode?: string;
          country?: string;
        },
        shippingMethod: order.shippingMethod || "Door-to-Door Courier",
        shippingCost: Number(order.shippingCost),
        subtotal: Number(order.subtotal),
        discountAmount: Number(order.discountAmount),
        total: Number(order.total),
        currency: order.currency || "ZAR",
        items: order.items.map((i) => ({
          id: i.id,
          productId: i.productId,
          name: i.name,
          price: Number(i.price),
          quantity: i.quantity,
          total: Number(i.total),
          image: i.product?.images?.[0] || "/images/marula-baobab-body-lotion.jpg",
          category: i.product?.category,
        })),
      },
    };
  } catch (error: unknown) {
    console.error("Error fetching order details:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to retrieve order receipt.",
    };
  }
}

/**
 * Server action to fetch dynamic shipping rate options from The Courier Guy / Shiplogic.
 */
export async function getShippingRatesAction(params: GetRatesParams): Promise<{
  success: boolean;
  rates: ShippingRateOption[];
  error?: string;
}> {
  try {
    const rates = await fetchShiplogicRates(params);
    return { success: true, rates };
  } catch (error: unknown) {
    console.error("Error fetching shipping rates:", error);
    return {
      success: false,
      rates: [],
      error: error instanceof Error ? error.message : "Failed to load live shipping rates.",
    };
  }
}
