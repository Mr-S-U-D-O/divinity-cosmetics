import { NextRequest, NextResponse } from "next/server";
import { initializePaystackTransaction } from "@/lib/domain/payments/paystack";
import { getOrderByNumber } from "@/lib/domain/orders/service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderNumber =
      typeof body.orderNumber === "string"
        ? body.orderNumber.trim()
        : typeof body.reference === "string"
        ? body.reference.trim()
        : "";

    if (!orderNumber) {
      return NextResponse.json(
        { status: false, message: "A valid orderNumber is required." },
        { status: 400 }
      );
    }

    const order = await getOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json(
        { status: false, message: "Order not found." },
        { status: 404 }
      );
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { status: false, message: "Order is already paid." },
        { status: 409 }
      );
    }

    // Never trust client-supplied amounts — use authoritative DB order total
    const amountInCents = Math.round(Number(order.total) * 100);
    if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
      return NextResponse.json(
        { status: false, message: "Invalid order total." },
        { status: 400 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, "") ||
      req.nextUrl.origin ||
      "http://localhost:3000";
    const callbackUrl = `${origin}/checkout/verify?reference=${encodeURIComponent(order.orderNumber)}`;

    const result = await initializePaystackTransaction({
      email: order.email,
      amountInCents,
      currency: order.currency || "ZAR",
      reference: order.orderNumber,
      callbackUrl,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    });

    return NextResponse.json({
      status: true,
      message: "Authorization URL created",
      data: {
        authorization_url: result.authorizationUrl,
        access_code: result.accessCode,
        reference: result.reference,
        amount: amountInCents,
        currency: order.currency || "ZAR",
      },
    });
  } catch (error: unknown) {
    console.error("Paystack API Initialization Error:", error);
    const message = error instanceof Error ? error.message : "Failed to initialize Paystack transaction";
    return NextResponse.json(
      { status: false, message },
      { status: 500 }
    );
  }
}
