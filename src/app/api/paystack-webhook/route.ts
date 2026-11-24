import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackWebhookSignature } from "@/lib/domain/payments/paystack";
import {
  markOrderPaymentFailed,
  verifyAndSettleOrderPayment,
} from "@/lib/domain/orders/service";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    // 1. Verify signature presence
    if (!signature) {
      console.warn("[Paystack Webhook] Missing x-paystack-signature header");
      return new NextResponse("Missing signature header", { status: 400 });
    }

    // 2. Cryptographically verify signature using Secret Key & HMAC-SHA512
    const isValid = verifyPaystackWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.error("[Paystack Webhook] Invalid signature detected. Request rejected.");
      return new NextResponse("Invalid signature", { status: 401 });
    }

    // 3. Parse incoming webhook payload
    let event: {
      event?: string;
      data?: {
        reference?: string;
        status?: string;
        amount?: number;
        currency?: string;
        channel?: string;
        gateway_response?: string;
        metadata?: {
          orderNumber?: string;
        };
      };
    };

    try {
      event = JSON.parse(rawBody);
    } catch {
      console.warn("[Paystack Webhook] Malformed JSON payload.");
      return new NextResponse("Invalid JSON payload", { status: 400 });
    }

    console.log(`[💳 PAYSTACK WEBHOOK] Authenticated HMAC-SHA512 event: ${event.event}`);

    // 4. Handle event types
    switch (event.event) {
      case "charge.success": {
        const data = event.data;
        const reference = typeof data?.reference === "string" ? data.reference.trim() : "";
        const orderNumber =
          typeof data?.metadata?.orderNumber === "string" &&
          data.metadata.orderNumber.trim()
            ? data.metadata.orderNumber.trim()
            : reference;
        const status = typeof data?.status === "string" ? data.status : "";
        const amountInCents = Number(data?.amount);
        const amountInRands = Number.isFinite(amountInCents) ? amountInCents / 100 : 0;
        const currency = typeof data?.currency === "string" ? data.currency : "";

        console.log(`[💳 PAYSTACK WEBHOOK] Charge Success Received:`);
        console.log(`   ├─ Order: ${orderNumber}`);
        console.log(`   ├─ Reference: ${reference}`);
        console.log(`   ├─ Amount: R${amountInRands.toFixed(2)} (${amountInCents} cents ${currency || "UNKNOWN"})`);
        console.log(`   └─ Channel: ${data?.channel || "Paystack"}`);

        const settlement = await verifyAndSettleOrderPayment({
          orderNumber,
          paymentReference: reference,
          status,
          amountInCents,
          currency,
          channel: data?.channel,
          gatewayResponse: data?.gateway_response,
        });

        if (settlement.settled) {
          console.log("Payment Verified");
          console.log(
            `[Paystack Webhook] Payment Verified: R${amountInRands.toFixed(2)} received for Order ${settlement.orderNumber} (Reference: ${reference}${settlement.alreadyPaid ? ", already paid" : ""})`
          );
        } else {
          console.warn(
            `[Paystack Webhook] Settlement rejected (${settlement.code}): ${settlement.reason}`
          );
        }

        break;
      }

      case "charge.failed": {
        const data = event.data;
        const reference = typeof data?.reference === "string" ? data.reference.trim() : "";
        const orderNumber =
          typeof data?.metadata?.orderNumber === "string" &&
          data.metadata.orderNumber.trim()
            ? data.metadata.orderNumber.trim()
            : reference;
        const reason = data?.gateway_response || "Payment failed";

        if (orderNumber) {
          console.log(`[Paystack Webhook] Processing failed charge for order: ${orderNumber}`);
          try {
            await markOrderPaymentFailed(orderNumber, reason);
          } catch (dbErr) {
            console.error(`[Paystack Webhook] Failed to record payment failure for ${orderNumber}:`, dbErr);
          }
        }
        break;
      }

      default:
        console.log(`[Paystack Webhook] Unhandled event type acknowledged: ${event.event}`);
        break;
    }

    return NextResponse.json({ status: "success", message: "Webhook processed" }, { status: 200 });
  } catch (error: unknown) {
    console.error("[Paystack Webhook Error]:", error);
    const message = error instanceof Error ? error.message : "Internal webhook error";
    return new NextResponse(`Webhook Error: ${message}`, { status: 500 });
  }
}
