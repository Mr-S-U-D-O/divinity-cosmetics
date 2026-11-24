import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface StoredTrackingEvent {
  id: string;
  date: string;
  status: string;
  message: string;
  location?: string | null;
  parcel_id?: number;
  source?: string | null;
}

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Maps raw Shiplogic shipment status to Prisma `OrderStatus`.
 * Returns `null` when the current status should be preserved.
 */
function mapShiplogicStatusToOrderStatus(
  rawStatus?: string | null
): OrderStatus | null {
  const s = (rawStatus || "").toLowerCase().trim();
  if (!s) return null;

  if (s === "delivered") {
    return "DELIVERED";
  }

  if (s === "cancelled") {
    return "CANCELLED";
  }

  const shippedStatuses = new Set([
    "submitted",
    "collection-assigned",
    "collection-accepted",
    "collection-unassigned",
    "collection-rejected",
    "collected",
    "at-hub",
    "on-hold",
    "on-hold-internal",
    "manifested",
    "ready-for-dispatch",
    "in-transit",
    "at-destination-hub",
    "delivery-scheduled",
    "delivery-assigned",
    "delivery-unassigned",
    "delivery-rejected",
    "out-for-delivery",
    "in-locker",
    "ready-for-pickup",
  ]);

  if (shippedStatuses.has(s)) {
    return "SHIPPED";
  }

  return null;
}

/**
 * Normalizes, merges, deduplicates (by event `id`), and chronologically sorts tracking events.
 */
function mergeAndSortTrackingEvents(
  existingRaw: unknown,
  incomingRaw: unknown
): StoredTrackingEvent[] {
  const map = new Map<string, StoredTrackingEvent>();

  const ingest = (list: unknown) => {
    if (!Array.isArray(list)) return;
    for (const ev of list) {
      if (!ev || typeof ev !== "object") continue;
      const record = ev as Record<string, unknown>;
      const date = String(record.date || record.event_time || "").trim();
      const status = String(record.status || "").trim();
      const message = String(record.message || status || "Status updated").trim();
      const location =
        record.location !== undefined && record.location !== null
          ? String(record.location).trim()
          : null;
      const id =
        record.id !== undefined && record.id !== null && String(record.id).trim() !== ""
          ? String(record.id).trim()
          : `${date}|${status}|${message}`;

      map.set(id, {
        id,
        date,
        status,
        message,
        location,
        ...(typeof record.parcel_id === "number" ? { parcel_id: record.parcel_id } : {}),
        ...(record.source ? { source: String(record.source) } : {}),
      });
    }
  };

  ingest(existingRaw);
  ingest(incomingRaw);

  return Array.from(map.values()).sort((a, b) => {
    const ta = a.date ? Date.parse(a.date) : 0;
    const tb = b.date ? Date.parse(b.date) : 0;
    return (Number.isNaN(ta) ? 0 : ta) - (Number.isNaN(tb) ? 0 : tb);
  });
}

/**
 * Incoming Shiplogic / The Courier Guy Tracking Webhook (`POST /api/webhooks/shiplogic`).
 * Receives live scan events (`collection-assigned`, `collected`, `at-hub`, `out-for-delivery`, `delivered`),
 * deduplicates and sorts `tracking_events`, and persists live delivery status to Prisma.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Mandatory shared secret verification (fail closed in production or live mode)
    const expectedSecret = process.env.SHIPLOGIC_WEBHOOK_SECRET?.trim();
    const requireSecret =
      process.env.NODE_ENV === "production" ||
      Boolean(process.env.COURIER_GUY_API_KEY?.trim());

    if (!expectedSecret) {
      if (requireSecret) {
        console.error(
          "[Shiplogic Webhook] SHIPLOGIC_WEBHOOK_SECRET is not configured. Rejecting request."
        );
        return NextResponse.json(
          { status: "unauthorized", message: "Webhook secret is not configured." },
          { status: 401 }
        );
      }
      console.warn(
        "[Shiplogic Webhook] SHIPLOGIC_WEBHOOK_SECRET not set in local dev; allowing local test request."
      );
    } else {
      const provided =
        req.headers.get("x-shiplogic-secret")?.trim() ||
        req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ||
        req.nextUrl.searchParams.get("secret")?.trim();

      if (!provided || !secretsMatch(provided, expectedSecret)) {
        console.warn("[Shiplogic Webhook] Unauthorized attempt with invalid secret.");
        return NextResponse.json(
          { status: "unauthorized", message: "Invalid webhook secret." },
          { status: 401 }
        );
      }
    }

    const payload = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { status: "bad_request", message: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const shortRef = payload.short_tracking_reference
      ? String(payload.short_tracking_reference).trim()
      : null;
    const customRef = payload.custom_tracking_reference
      ? String(payload.custom_tracking_reference).trim()
      : null;
    const shipmentId =
      payload.shipment_id !== undefined && payload.shipment_id !== null
        ? String(payload.shipment_id).trim()
        : null;
    const rawStatus = payload.status ? String(payload.status).trim() : null;
    const incomingEvents = Array.isArray(payload.tracking_events)
      ? payload.tracking_events
      : [];

    console.log(
      `[📦 SHIPLOGIC WEBHOOK] Received event: shipment_id=${shipmentId ?? "n/a"} | short_ref=${shortRef ?? "n/a"} | custom_ref=${customRef ?? "n/a"} | status=${rawStatus ?? "n/a"} | events=${incomingEvents.length}`
    );

    const orClauses: Prisma.OrderWhereInput[] = [];
    if (shortRef) orClauses.push({ waybillNumber: shortRef });
    if (customRef) {
      orClauses.push({ waybillNumber: customRef });
      orClauses.push({ orderNumber: customRef });
    }
    if (shipmentId) orClauses.push({ shiplogicShipmentId: shipmentId });

    if (orClauses.length === 0) {
      return NextResponse.json(
        { status: "ignored", message: "No shipment_id or tracking reference provided." },
        { status: 200 }
      );
    }

    const order = await prisma.order.findFirst({
      where: { OR: orClauses },
    });

    if (!order) {
      console.warn(
        `[📦 SHIPLOGIC WEBHOOK] No matching order found for shipment_id=${shipmentId}, short_ref=${shortRef}, custom_ref=${customRef}.`
      );
      return NextResponse.json(
        { status: "not_found", message: "No matching order found; acknowledged." },
        { status: 200 }
      );
    }

    const mergedEvents = mergeAndSortTrackingEvents(
      order.trackingEvents,
      incomingEvents
    );

    const mappedStatus = mapShiplogicStatusToOrderStatus(rawStatus);
    const deliveredDateRaw = payload.shipment_delivered_date
      ? new Date(String(payload.shipment_delivered_date))
      : null;
    const validDeliveredAt =
      deliveredDateRaw && !Number.isNaN(deliveredDateRaw.getTime())
        ? deliveredDateRaw
        : mappedStatus === "DELIVERED"
        ? new Date()
        : undefined;

    await prisma.order.update({
      where: { id: order.id },
      data: {
        ...(rawStatus ? { trackingStatus: rawStatus } : {}),
        trackingEvents: mergedEvents as unknown as Prisma.InputJsonValue,
        ...(mappedStatus && order.status !== "DELIVERED" ? { status: mappedStatus } : {}),
        ...(mappedStatus === "DELIVERED" && !order.deliveredAt && validDeliveredAt
          ? { deliveredAt: validDeliveredAt }
          : {}),
        ...(!order.shippedAt && mappedStatus === "SHIPPED"
          ? { shippedAt: new Date() }
          : {}),
      },
    });

    console.log(
      `[📦 SHIPLOGIC WEBHOOK] Updated Order ${order.orderNumber}: trackingStatus=${rawStatus ?? order.trackingStatus}, orderStatus=${mappedStatus ?? order.status}, totalEvents=${mergedEvents.length}`
    );

    return NextResponse.json(
      {
        status: "success",
        orderNumber: order.orderNumber,
        trackingStatus: rawStatus,
        eventsStored: mergedEvents.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Shiplogic Webhook Error]:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to process Shiplogic tracking webhook." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    service: "Divinity Cosmetics Shiplogic Tracking Webhook",
    timestamp: new Date().toISOString(),
  });
}
