import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { createCourierGuyShipment } from "@/lib/domain/shipping/courierguy";
import { sendCustomerDispatchNotification } from "@/lib/domain/shipping/notifications";
import { postZohoSalesOrderComment } from "@/lib/domain/zoho/service";
import { siteConfig } from "@/lib/config/site";

/**
 * Constant-time comparison of the provided secret against the expected one.
 */
function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Zoho Inventory Packing Gate Webhook
 * 
 * Triggered when a staff member at Wright Crossing Shopping Centre marks an order as 'Packed' in Zoho Inventory.
 * Next.js receives this event and automatically books a Door-to-Door collection with The Courier Guy (Shiplogic API).
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Mandatory secret verification via the `x-zoho-webhook-secret` header
    const webhookSecret = process.env.ZOHO_WEBHOOK_SECRET?.trim();
    const providedSecret = req.headers.get("x-zoho-webhook-secret")?.trim();

    if (!webhookSecret) {
      console.error("[Zoho Dispatch Webhook] ZOHO_WEBHOOK_SECRET is not configured. Rejecting request.");
    }

    if (!webhookSecret || !providedSecret || !secretsMatch(providedSecret, webhookSecret)) {
      console.warn("[Zoho Dispatch Webhook] Unauthorized: missing or invalid x-zoho-webhook-secret header.");
      return NextResponse.json(
        { status: "unauthorized", message: "Invalid or missing webhook secret." },
        { status: 401 }
      );
    }

    // 2. Parse Incoming Payload (supports JSON, Form-data, and Query String)
    let payload: Record<string, any> = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      payload = await req.json().catch(() => ({}));
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData().catch(() => null);
      if (formData) {
        formData.forEach((value, key) => {
          payload[key] = value.toString();
        });
      }
    }

    // Also merge URL search params as fallbacks
    req.nextUrl.searchParams.forEach((val, key) => {
      if (!payload[key]) payload[key] = val;
    });

    console.log("[📦 PACKING GATE] Received Zoho Inventory webhook event:", JSON.stringify(payload));

    // 3. Extract Order Identifiers
    // Zoho can send salesorder_number, reference_number, salesorder_id, package_id, or nested objects
    const rawSalesOrderNumber =
      payload.salesorder_number ||
      payload.sales_order_number ||
      payload.sales_order?.salesorder_number ||
      payload.package?.salesorder_number ||
      payload.salesorder?.salesorder_number;

    const rawReferenceNumber =
      payload.reference_number ||
      payload.reference ||
      payload.sales_order?.reference_number ||
      payload.salesorder?.reference_number;

    const rawOrderNumber =
      payload.orderNumber ||
      payload.order_number;

    const rawSalesOrderId =
      payload.salesorder_id ||
      payload.sales_order_id ||
      payload.sales_order?.salesorder_id ||
      payload.salesorder?.salesorder_id;

    if (!rawSalesOrderNumber && !rawReferenceNumber && !rawOrderNumber && !rawSalesOrderId) {
      console.warn("[📦 PACKING GATE] Missing order identifier in payload.");
      return NextResponse.json(
        {
          status: "bad_request",
          message:
            "Missing order identifier. Webhook must include 'salesorder_number', 'reference_number', or 'salesorder_id'.",
        },
        { status: 400 }
      );
    }

    // 4. Validate Event Status (if supplied)
    // Zoho Inventory sends { "status": "packed" } when staff mark the order as packed
    if (payload.status && typeof payload.status === "string") {
      const normalizedStatus = payload.status.toLowerCase().trim();
      if (normalizedStatus !== "packed" && normalizedStatus !== "fulfilled") {
        console.warn(`[📦 PACKING GATE] Received status "${payload.status}". Ignoring non-packed status event.`);
        return NextResponse.json(
          {
            status: "ignored",
            message: `Event status "${payload.status}" is not "packed". Courier booking only triggers when order is packed.`,
          },
          { status: 200 }
        );
      }
    }

    console.log(
      `[📦 PACKING GATE] Locating order using identifiers: SO=${rawSalesOrderNumber || "n/a"}, Ref=${rawReferenceNumber || "n/a"}, OrderNo=${rawOrderNumber || "n/a"}, ID=${rawSalesOrderId || "n/a"}...`
    );

    // 5. Query Database for Matching Order
    const candidateOrderNumbers = [
      rawOrderNumber,
      rawReferenceNumber,
      rawSalesOrderNumber,
    ]
      .filter((v): v is string => Boolean(v && typeof v === "string" && v.trim().length > 0))
      .map((v) => v.trim());

    const candidateZohoIds = [
      rawSalesOrderId,
      rawSalesOrderNumber,
    ]
      .filter((v): v is string => Boolean(v && typeof v === "string" && v.trim().length > 0))
      .map((v) => v.trim());

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          ...candidateOrderNumbers.map((num) => ({ orderNumber: num })),
          ...candidateZohoIds.map((id) => ({ zohoSalesOrderId: id })),
        ],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      console.error(
        `[📦 PACKING GATE ERROR] Order not found in database for identifiers: ${JSON.stringify({ candidateOrderNumbers, candidateZohoIds })}`
      );
      return NextResponse.json(
        {
          status: "not_found",
          message: `Order not found in database for identifier: ${rawReferenceNumber || rawSalesOrderNumber || rawOrderNumber || rawSalesOrderId}`,
        },
        { status: 404 }
      );
    }

    console.log(`[📦 PACKING GATE] Found Order: ${order.orderNumber} (ID: ${order.id}) | Payment: ${order.paymentStatus}`);

    // 6. Hard Idempotency Guard: Prevent duplicate courier bookings
    if (order.waybillNumber || order.status === "SHIPPED") {
      console.log(
        `[🛡️ IDEMPOTENCY GUARD] Order ${order.orderNumber} already has waybill (${order.waybillNumber}). Skipping duplicate courier booking.`
      );
      return NextResponse.json(
        {
          status: "already_dispatched",
          message: `Order ${order.orderNumber} has already been dispatched with The Courier Guy.`,
          orderNumber: order.orderNumber,
          waybillNumber: order.waybillNumber,
          trackingUrl: order.trackingUrl,
        },
        { status: 200 }
      );
    }

    // 6. Execute Shipment Creation with The Courier Guy (Shiplogic)
    console.log(
      `[🚚 THE COURIER GUY] Initiating collection booking from Wright Crossing Hub for Order ${order.orderNumber}...`
    );

    const shipmentResult = await createCourierGuyShipment(order);

    if (!shipmentResult.success || !shipmentResult.waybillNumber) {
      throw new Error(shipmentResult.error || "Courier booking failed without a waybill number.");
    }

    const { waybillNumber, shiplogicShipmentId, trackingUrl, labelUrl, serviceLevel } = shipmentResult;

    console.log(`[🚚 THE COURIER GUY] Waybill successfully issued: ${waybillNumber}`);
    console.log(`   ├─ Shiplogic Shipment ID: ${shiplogicShipmentId || "N/A"}`);
    console.log(`   ├─ Tracking URL: ${trackingUrl}`);
    console.log(`   ├─ Service Level: ${serviceLevel}`);
    console.log(`   └─ Label URL: ${labelUrl ? "received" : "N/A"}`);

    // 7. Update Order in Database
    const dispatchNote = `[Courier Guy Dispatched: Waybill ${waybillNumber} (${serviceLevel})]`;
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "SHIPPED",
        waybillNumber,
        shiplogicShipmentId: shiplogicShipmentId ?? null,
        labelUrl: labelUrl ?? null,
        trackingUrl: trackingUrl || null,
        shippedAt: new Date(),
        internalNotes: order.internalNotes
          ? `${order.internalNotes} | ${dispatchNote}`
          : dispatchNote,
      },
      include: {
        items: true,
      },
    });

    console.log(`[💾 DATABASE] Order ${order.orderNumber} updated: status=SHIPPED, waybill=${waybillNumber}`);

    // 8. Zoho Write-Back: Post Waybill & On-Demand A4 Print Link Comment onto the Zoho Sales Order
    // Wrapped in try/catch so a Zoho comment failure never rolls back or fails the booked waybill.
    const baseSiteUrl = (
      process.env.NEXT_PUBLIC_APP_URL?.trim() || siteConfig.url
    ).replace(/\/+$/, "");
    const printableLabelUrl = `${baseSiteUrl}/api/shipping/label/${encodeURIComponent(
      order.orderNumber
    )}?token=${encodeURIComponent(webhookSecret)}`;

    const targetZohoSalesOrderId =
      updatedOrder.zohoSalesOrderId || rawSalesOrderId || null;

    if (targetZohoSalesOrderId) {
      try {
        const commentLines = [
          `The Courier Guy Collection Booked`,
          `Courier: The Courier Guy (${serviceLevel || "ECO"})`,
          `Waybill / Tracking Number: ${waybillNumber}`,
          `Live Tracking URL: ${trackingUrl || `https://thecourierguy.co.za/tracking?tracking_number=${encodeURIComponent(waybillNumber)}`}`,
          `Print A4 Waybill PDF: ${printableLabelUrl}`,
        ];
        await postZohoSalesOrderComment(
          String(targetZohoSalesOrderId),
          commentLines.join("\n")
        );
      } catch (zohoCommentErr) {
        console.error(
          `[Zoho Write-Back Warning] Waybill ${waybillNumber} was booked successfully, but posting the comment to Zoho Sales Order ${targetZohoSalesOrderId} failed:`,
          zohoCommentErr
        );
      }
    }

    // 9. Trigger Customer Dispatch Notification
    await sendCustomerDispatchNotification(
      updatedOrder,
      waybillNumber,
      trackingUrl || `https://thecourierguy.co.za/tracking?tracking_number=${waybillNumber}`
    );

    console.log(
      `[📦 PACKING GATE COMPLETE] Order ${order.orderNumber} successfully processed and marked SHIPPED.`
    );

    return NextResponse.json(
      {
        status: "success",
        message: `Order ${order.orderNumber} successfully booked with The Courier Guy.`,
        orderNumber: order.orderNumber,
        waybillNumber,
        trackingUrl,
        labelUrl,
        printableLabelUrl,
        pickupLocation: "Wright Crossing Shopping Centre, Springs, Gauteng",
        dispatchedAt: updatedOrder.shippedAt?.toISOString(),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal server error";
    console.error("[Zoho Dispatch Webhook Error]:", error);

    return NextResponse.json(
      {
        status: "error",
        message: `Failed to process dispatch: ${errorMsg}`,
      },
      { status: 500 }
    );
  }
}

/**
 * Health check / verification handler for Zoho Webhook test pings
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: "online",
    service: "Divinity Cosmetics Zoho Dispatch Webhook",
    destination: "The Courier Guy (Shiplogic API)",
    pickupHub: "Wright Crossing Shopping Centre, Springs, Gauteng",
    timestamp: new Date().toISOString(),
  });
}

