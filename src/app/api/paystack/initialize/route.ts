import { NextRequest, NextResponse } from "next/server";
import { initializePaystackTransaction } from "@/lib/domain/payments/paystack";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email || "customer@example.com";
    
    // Amount in cents: default to 40000 cents (ZAR 400.00)
    const amountInCents = body.amount 
      ? Math.round(Number(body.amount) > 1000 ? Number(body.amount) : Number(body.amount) * 100) 
      : 40000;

    const reference = body.orderNumber || body.reference || `DIV-${Date.now().toString().slice(-8)}`;

    const origin = req.nextUrl.origin || "http://localhost:3000";
    const callbackUrl = `${origin}/checkout/verify?reference=${reference}`;

    const result = await initializePaystackTransaction({
      email,
      amountInCents,
      currency: "ZAR",
      reference,
      callbackUrl,
      metadata: {
        orderNumber: reference,
        customFields: body.metadata || {},
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
        currency: "ZAR",
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
