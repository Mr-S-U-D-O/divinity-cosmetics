"use server"

import { revalidatePath } from "next/cache";
import {
  createOrder,
  updateOrderStatus,
  markOrderAsPaid,
  markOrderPaymentFailed,
} from "./service";
import { OrderStatus } from "@prisma/client";
import {
  initializePaystackTransaction,
  verifyPaystackTransaction,
} from "@/lib/domain/payments/paystack";

export async function placeOrderAction(data: Parameters<typeof createOrder>[0]) {
  try {
    const order = await createOrder(data);
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

    return {
      success: true,
      authorizationUrl: paystackSession.authorizationUrl,
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

      revalidatePath("/admin/orders");
      revalidatePath(`/admin/orders/${order.id}`);

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
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update status." };
  }
}
