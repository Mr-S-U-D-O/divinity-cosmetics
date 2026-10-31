import { NextRequest } from "next/server";
import { verifyPaystackWebhookSignature } from "@/lib/domain/payments/paystack";
import { markOrderAsPaid, markOrderPaymentFailed } from "@/lib/domain/orders/service";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      console.warn("Paystack Webhook: Missing x-paystack-signature header");
      return new Response("Missing signature", { status: 400 });
    }

    const isValid = verifyPaystackWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.error("Paystack Webhook: Invalid signature detected");
      return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(rawBody);
    console.log(`Paystack Webhook Received Event: ${event.event}`);

    switch (event.event) {
      case "charge.success": {
        const data = event.data;
        const reference = data.reference;
        const orderNumber = data.metadata?.orderNumber || reference;
        const channel = data.channel ? `Paystack (${data.channel.toUpperCase()})` : "Paystack";

        console.log(`Processing successful charge for order: ${orderNumber}`);
        try {
          await markOrderAsPaid(orderNumber, {
            paymentId: reference,
            paymentMethod: channel,
          });
          console.log(`Order ${orderNumber} marked as PAID via webhook`);
        } catch (err) {
          console.error(`Failed to update order ${orderNumber} in webhook:`, err);
          return new Response("Webhook processing failed", { status: 500 });
        }
        break;
      }

      case "charge.failed": {
        const data = event.data;
        const reference = data.reference;
        const orderNumber = data.metadata?.orderNumber || reference;
        const reason = data.gateway_response || "Payment failed";

        console.log(`Processing failed charge for order: ${orderNumber}`);
        try {
          await markOrderPaymentFailed(orderNumber, reason);
        } catch (err) {
          console.error(`Failed to record failed payment for ${orderNumber}:`, err);
          return new Response("Webhook processing failed", { status: 500 });
        }
        break;
      }

      default:
        // Acknowledge other event types (e.g. transfer, refund) without failing
        break;
    }

    return Response.json({ received: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("Paystack Webhook Error:", error);
    const message = error instanceof Error ? error.message : "Unknown webhook error";
    return new Response(`Webhook Error: ${message}`, { status: 500 });
  }
}
