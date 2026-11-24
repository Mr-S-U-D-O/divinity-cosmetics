"use server"

import { cookies } from "next/headers";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import {
  createOrder,
  getOrderByNumber,
  verifyAndSettleOrderPayment,
} from "./service";
import {
  RECEIPT_COOKIE_NAME,
  RECEIPT_TOKEN_TTL_SECONDS,
  signOrderReceiptToken,
  verifyOrderReceiptToken,
} from "./receipt-token";
import {
  initializePaystackTransaction,
  verifyPaystackTransaction,
} from "@/lib/domain/payments/paystack";
import { fetchShiplogicRates, ShippingRateOption, GetRatesParams } from "@/lib/domain/shipping/rates";
import { computeParcelWeightKg } from "@/lib/domain/shipping/quote";
import { fetchZohoItemStock } from "@/lib/domain/zoho/service";

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

    // 1. Create order in database (server strictly recalculates prices, shipping, and auth userId)
    const { userId: sessionUserId } = await auth().catch(() => ({ userId: null }));

    const order = await createOrder({
      userId: sessionUserId ?? null,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      shippingAddress: data.shippingAddress,
      shippingMethod: data.shippingMethod,
      shippingServiceCode: data.shippingServiceCode,
      shippingQuoteToken: data.shippingQuoteToken,
      referralCode: data.referralCode,
      customerNotes: data.customerNotes,
      currency: "ZAR",
      items: data.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        name: item.name,
      })),
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
    const cleanReference = typeof reference === "string" ? reference.trim() : "";
    if (!cleanReference) {
      return { success: false, error: "No transaction reference provided." };
    }

    const existingOrder = await getOrderByNumber(cleanReference);
    if (!existingOrder) {
      return { success: false, error: "Order not found for payment reference." };
    }

    const verification = await verifyPaystackTransaction(cleanReference);
    const metaOrderNumber =
      typeof verification.metadata?.orderNumber === "string" &&
      verification.metadata.orderNumber.trim()
        ? verification.metadata.orderNumber.trim()
        : existingOrder.orderNumber;

    const settlement = await verifyAndSettleOrderPayment({
      orderNumber: metaOrderNumber,
      paymentReference: verification.reference || cleanReference,
      status: verification.isSuccessful ? "success" : verification.status,
      amountInCents: verification.amountInCents,
      currency: verification.currency,
      channel: verification.channel,
      gatewayResponse: verification.gatewayResponse,
    });

    if (settlement.settled) {
      const receiptToken = signOrderReceiptToken(settlement.orderNumber);

      try {
        const cookieStore = await cookies();
        cookieStore.set(RECEIPT_COOKIE_NAME, receiptToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: RECEIPT_TOKEN_TTL_SECONDS,
        });
      } catch {
        // Fallback to returning receiptToken for URL handoff if cookie mutation is unavailable
      }

      return {
        success: true,
        orderNumber: settlement.orderNumber,
        orderId: settlement.orderId,
        receiptToken,
      };
    }

    if (
      settlement.code === "AMOUNT_MISMATCH" ||
      settlement.code === "CURRENCY_MISMATCH" ||
      settlement.code === "REFERENCE_MISMATCH"
    ) {
      return {
        success: false,
        error: "Payment amount did not match the order total. Please contact support.",
      };
    }

    return {
      success: false,
      error:
        verification.gatewayResponse ||
        "Payment could not be verified or was cancelled.",
    };
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

async function isClerkUserAuthorizedForOrder(order: {
  userId: string | null;
  email: string;
}): Promise<boolean> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return false;

    if (order.userId && order.userId === clerkUser.id) {
      return true;
    }

    const clerkEmails = clerkUser.emailAddresses.map((e) =>
      e.emailAddress.trim().toLowerCase()
    );
    return clerkEmails.includes(order.email.trim().toLowerCase());
  } catch {
    return false;
  }
}

export interface OrderReceiptAuthOptions {
  receiptToken?: string;
  email?: string;
}

/**
 * Retrieves verified receipt details for a PAID order.
 * Enforces POPIA privacy protection by requiring EITHER:
 *  - A matching signed-in Clerk user (`userId` or verified email), OR
 *  - A valid HMAC-signed receipt token (via HttpOnly cookie or redirect handoff), OR
 *  - A matching checkout email address (for returning guests).
 */
export async function getOrderDetailsAction(
  orderNumber: string,
  authOptions?: OrderReceiptAuthOptions
) {
  try {
    const cleanOrderNumber = (orderNumber || "").trim();
    if (!cleanOrderNumber) {
      return {
        success: false,
        requiresVerification: true,
        error: "Order number is required.",
      };
    }

    const order = await getOrderByNumber(cleanOrderNumber);

    let cookieToken: string | undefined;
    try {
      const cookieStore = await cookies();
      cookieToken = cookieStore.get(RECEIPT_COOKIE_NAME)?.value;
    } catch {
      cookieToken = undefined;
    }

    const cleanEmail = (authOptions?.email || "").trim().toLowerCase();

    let authorized = false;
    if (order && order.paymentStatus === "PAID") {
      if (await isClerkUserAuthorizedForOrder(order)) {
        authorized = true;
      } else if (
        verifyOrderReceiptToken(authOptions?.receiptToken, order.orderNumber) ||
        verifyOrderReceiptToken(cookieToken, order.orderNumber)
      ) {
        authorized = true;
      } else if (
        cleanEmail.length > 0 &&
        order.email.trim().toLowerCase() === cleanEmail
      ) {
        authorized = true;
      }
    }

    if (!order || order.paymentStatus !== "PAID" || !authorized) {
      // Uniform error message prevents order-number existence enumeration
      return {
        success: false,
        requiresVerification: true,
        error:
          "Please enter the email address used at checkout (or sign in) to view this order receipt.",
      };
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
        waybillNumber: order.waybillNumber,
        trackingUrl: order.trackingUrl,
        trackingStatus: normalizeUserFacingTrackingStatus(order.trackingStatus),
        trackingEvents: parseTrackingEvents(order.trackingEvents),
        shippedAt: order.shippedAt ? order.shippedAt.toISOString() : null,
        deliveredAt: order.deliveredAt ? order.deliveredAt.toISOString() : null,
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

export interface TrackingEventDTO {
  id: string;
  date: string;
  status: string;
  message: string;
  location?: string | null;
}

function normalizeUserFacingTrackingStatus(raw?: string | null): string | null {
  if (!raw) return null;
  const s = raw.toLowerCase().trim();
  const internalMap: Record<string, string> = {
    "collection-unassigned": "collection-assigned",
    "collection-rejected": "collection-assigned",
    "delivery-unassigned": "delivery-assigned",
    "delivery-rejected": "delivery-assigned",
    "on-hold-internal": "at-hub",
  };
  return internalMap[s] || s;
}

function parseTrackingEvents(raw: unknown): TrackingEventDTO[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item, idx) => ({
      id: String(item.id ?? idx),
      date: String(item.date ?? ""),
      status: normalizeUserFacingTrackingStatus(String(item.status ?? "")) || "",
      message: String(item.message ?? item.status ?? "Status updated"),
      location: item.location ? String(item.location) : null,
    }))
    .sort((a, b) => {
      const ta = a.date ? Date.parse(a.date) : 0;
      const tb = b.date ? Date.parse(b.date) : 0;
      return (Number.isNaN(tb) ? 0 : tb) - (Number.isNaN(ta) ? 0 : ta);
    });
}

/**
 * Secure public order tracking lookup for `/order-status`.
 * Authorizes access if EITHER:
 *  - The signed-in Clerk user owns the order (by `userId` or verified email), OR
 *  - The submitted `email` matches `order.email` (case-insensitive).
 */
export async function lookupOrderTrackingAction(
  orderNumber: string,
  email?: string
) {
  try {
    const cleanOrderNumber = (orderNumber || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanOrderNumber) {
      return { success: false, error: "Please enter your order number (e.g. DIV-20261120-7959)." };
    }

    const order = await getOrderByNumber(cleanOrderNumber);
    if (!order) {
      return {
        success: false,
        error: "We could not find an order matching those details. Please double-check your order number and email address.",
      };
    }

    // Check Clerk ownership first
    const authorizedByClerk = await isClerkUserAuthorizedForOrder(order);

    if (!authorizedByClerk) {
      if (!cleanEmail) {
        return {
          success: false,
          requiresEmail: true,
          error: "Please enter the email address used at checkout to verify your order.",
        };
      }
      if (order.email.trim().toLowerCase() !== cleanEmail) {
        return {
          success: false,
          error: "We could not find an order matching those details. Please double-check your order number and email address.",
        };
      }
    }

    const addr = (order.shippingAddress || {}) as {
      suburb?: string;
      city?: string;
      province?: string;
      postalCode?: string;
    };

    return {
      success: true,
      order: {
        orderNumber: order.orderNumber,
        createdAt: order.createdAt.toISOString(),
        status: order.status,
        paymentStatus: order.paymentStatus,
        firstName: order.firstName,
        email: order.email,
        shippingMethod: order.shippingMethod || "Door-to-Door Courier",
        shippingCost: Number(order.shippingCost),
        subtotal: Number(order.subtotal),
        discountAmount: Number(order.discountAmount),
        total: Number(order.total),
        currency: order.currency || "ZAR",
        destinationSummary: [addr.suburb, addr.city, addr.province, addr.postalCode]
          .filter(Boolean)
          .join(", "),
        waybillNumber: order.waybillNumber,
        trackingUrl: order.trackingUrl,
        trackingStatus: normalizeUserFacingTrackingStatus(order.trackingStatus),
        trackingEvents: parseTrackingEvents(order.trackingEvents),
        shippedAt: order.shippedAt ? order.shippedAt.toISOString() : null,
        deliveredAt: order.deliveredAt ? order.deliveredAt.toISOString() : null,
        items: order.items.map((i) => ({
          id: i.id,
          name: i.name,
          price: Number(i.price),
          quantity: i.quantity,
          total: Number(i.total),
          image: i.product?.images?.[0] || "/images/marula-baobab-body-lotion.jpg",
        })),
      },
    };
  } catch (error: unknown) {
    console.error("Error looking up order tracking:", error);
    return {
      success: false,
      error: "Unable to look up order status right now. Please try again shortly.",
    };
  }
}

/**
 * Server action to fetch dynamic shipping rate options from The Courier Guy / Shiplogic.
 * Parcel weight is always derived server-side from itemCount, and each option
 * includes an HMAC-signed quoteToken bound to destination, service code, and weight.
 */
export async function getShippingRatesAction(params: GetRatesParams): Promise<{
  success: boolean;
  rates: ShippingRateOption[];
  error?: string;
}> {
  try {
    const safeItemCount =
      typeof params.itemCount === "number" &&
      Number.isInteger(params.itemCount) &&
      params.itemCount > 0
        ? params.itemCount
        : 1;

    const rates = await fetchShiplogicRates({
      suburb: params.suburb,
      city: params.city,
      province: params.province,
      postalCode: params.postalCode,
      itemCount: safeItemCount,
      weightInKg: computeParcelWeightKg(safeItemCount),
    });
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
