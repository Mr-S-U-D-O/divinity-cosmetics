import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchShipmentLabelUrl } from "@/lib/domain/shipping/courierguy";
import { verifyWaybillLabelToken } from "@/lib/domain/shipping/label-token";

/**
 * On-Demand A4 Waybill PDF Route for Wright Crossing Warehouse Staff.
 *
 * Usage (from Zoho Sales Order Comment):
 *   GET /api/shipping/label/DIV-YYYYMMDD-XXXXXXXX?token=<per-order HMAC token>
 *
 * Verifies the order-scoped HMAC-SHA256 token, fetches a fresh 24-hour signed S3 A4 PDF URL
 * from Shiplogic (`/v3/shipments/label?id=...`), updates `Order.labelUrl` in Prisma,
 * and returns a non-cached 302 redirect directly to the PDF.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await context.params;
    const cleanOrderNumber = decodeURIComponent(orderNumber || "").trim();

    if (!cleanOrderNumber || cleanOrderNumber.length > 64) {
      return NextResponse.json(
        { status: "bad_request", message: "A valid order number is required." },
        { status: 400 }
      );
    }

    const providedToken = req.nextUrl.searchParams.get("token")?.trim();

    if (!providedToken || !verifyWaybillLabelToken(providedToken, cleanOrderNumber)) {
      return NextResponse.json(
        { status: "unauthorized", message: "Invalid or missing print token." },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: cleanOrderNumber },
      select: {
        id: true,
        orderNumber: true,
        waybillNumber: true,
        shiplogicShipmentId: true,
        labelUrl: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          status: "not_found",
          message: `Order ${cleanOrderNumber} not found.`,
        },
        { status: 404 }
      );
    }

    if (!order.shiplogicShipmentId) {
      return NextResponse.json(
        {
          status: "not_ready",
          message: `Order ${order.orderNumber} does not have a Shiplogic shipment ID yet.`,
        },
        { status: 404 }
      );
    }

    // Fetch a fresh 24-hour signed S3 A4 PDF label URL from Shiplogic
    const freshLabelUrl = await fetchShipmentLabelUrl(order.shiplogicShipmentId);

    if (!freshLabelUrl) {
      return NextResponse.json(
        {
          status: "label_unavailable",
          message: `Unable to retrieve A4 waybill PDF from Shiplogic for shipment ${order.shiplogicShipmentId}.`,
        },
        { status: 502 }
      );
    }

    // Persist refreshed signed URL on the Order record
    await prisma.order
      .update({
        where: { id: order.id },
        data: { labelUrl: freshLabelUrl },
      })
      .catch((err) => {
        console.warn(
          `[A4 Waybill Route] Could not persist refreshed labelUrl for ${order.orderNumber}:`,
          err
        );
      });

    const res = NextResponse.redirect(freshLabelUrl, { status: 302 });
    res.headers.set("Cache-Control", "no-store, private");
    return res;
  } catch (error) {
    console.error("[A4 Waybill Route Error]:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to retrieve A4 waybill PDF.",
      },
      { status: 500 }
    );
  }
}
