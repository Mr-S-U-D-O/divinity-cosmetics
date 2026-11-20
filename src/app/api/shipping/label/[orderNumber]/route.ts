import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { fetchShipmentLabelUrl } from "@/lib/domain/shipping/courierguy";

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * On-Demand A4 Waybill PDF Route for Wright Crossing Warehouse Staff.
 *
 * Usage (from Zoho Sales Order Comment):
 *   GET /api/shipping/label/DIV-YYYYMMDD-XXXX?token=<ZOHO_WEBHOOK_SECRET>
 *
 * Fetches a fresh 24-hour signed S3 A4 PDF URL from Shiplogic (`/v3/shipments/label?id=...`),
 * updates `Order.labelUrl` in Prisma, and returns a 302 redirect directly to the PDF.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const expectedSecret = process.env.ZOHO_WEBHOOK_SECRET?.trim();
    const providedToken = req.nextUrl.searchParams.get("token")?.trim();

    if (
      !expectedSecret ||
      !providedToken ||
      !secretsMatch(providedToken, expectedSecret)
    ) {
      return NextResponse.json(
        { status: "unauthorized", message: "Invalid or missing print token." },
        { status: 401 }
      );
    }

    const { orderNumber } = await context.params;
    const cleanOrderNumber = decodeURIComponent(orderNumber || "").trim();

    if (!cleanOrderNumber) {
      return NextResponse.json(
        { status: "bad_request", message: "Order number is required." },
        { status: 400 }
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

    return NextResponse.redirect(freshLabelUrl, { status: 302 });
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
