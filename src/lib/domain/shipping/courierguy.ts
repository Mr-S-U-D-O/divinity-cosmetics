import { Prisma } from "@prisma/client";
import {
  CourierGuyConfig,
  CreateShipmentResult,
  ShiplogicAddress,
  ShiplogicParcel,
  ShiplogicShipmentPayload,
  ShiplogicShipmentResponse,
} from "./types";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;

interface ParsedCustomerAddress {
  streetAddress?: string;
  suburb?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

const SANDBOX_HOST = "api.shiplogic.com";
const DEFAULT_BASE_URL = `https://${SANDBOX_HOST}`;
const DEFAULT_SERVICE_LEVEL = "ECO";

/**
 * Normalises a Shiplogic base URL to its bare root host.
 * Strips trailing slashes and any `/v2` or `/v3` suffix so callers can append versioned paths.
 */
export function normalizeShiplogicBaseUrl(raw?: string | null): string {
  let url = (raw || "").trim() || DEFAULT_BASE_URL;
  url = url.replace(/\/+$/, "");
  url = url.replace(/\/v[23]$/i, "");
  return url.replace(/\/+$/, "");
}

/**
 * Loads The Courier Guy / Shiplogic configuration from environment variables.
 * Falls back to the Wright Crossing Shopping Centre hub in Springs, Gauteng.
 */
export function getCourierGuyConfig(): CourierGuyConfig | null {
  const apiKey =
    process.env.COURIER_GUY_API_KEY?.trim() ||
    process.env.COURIER_GUY_API_TEST_KEY?.trim() ||
    process.env.SHIPLOGIC_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  const hub = {
    company:
      process.env.DISPATCH_HUB_NAME?.trim() || "Divinity Cosmetics Dispatch Hub",
    streetAddress:
      process.env.DISPATCH_HUB_STREET?.trim() ||
      "Wright Crossing Shopping Centre, 70 Ermelo Rd",
    localArea: process.env.DISPATCH_HUB_SUBURB?.trim() || "Strubenvale",
    city: process.env.DISPATCH_HUB_CITY?.trim() || "Springs",
    zone: process.env.DISPATCH_HUB_PROVINCE?.trim() || "Gauteng",
    postalCode: process.env.DISPATCH_HUB_POSTAL_CODE?.trim() || "1559",
    country: "ZA",
    contactName:
      process.env.DISPATCH_HUB_CONTACT_NAME?.trim() ||
      "Divinity Cosmetics Warehouse Dispatch",
    phone:
      process.env.DISPATCH_HUB_PHONE?.trim() ||
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ||
      "0664859011",
    email:
      process.env.DISPATCH_HUB_EMAIL?.trim() ||
      process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() ||
      "fulfillment@shopdivinitycosmetics.co.za",
  };

  const baseUrl = normalizeShiplogicBaseUrl(
    process.env.COURIER_GUY_API_URL || process.env.SHIPLOGIC_API_URL
  );

  return {
    apiKey,
    baseUrl,
    isSandbox: baseUrl.includes(SANDBOX_HOST),
    serviceLevelCode:
      process.env.COURIER_GUY_SERVICE_LEVEL?.trim() || DEFAULT_SERVICE_LEVEL,
    hub,
  };
}

export function isCourierGuyConfigured(): boolean {
  return getCourierGuyConfig() !== null;
}

export function getShiplogicAuthHeader(apiKey: string): string {
  return apiKey.startsWith("Bearer ") ? apiKey : `Bearer ${apiKey}`;
}

/**
 * Extracts the customer-selected service level code from the stored shipping method.
 * Checkout stores it as e.g. "Premium Overnight Express (ONX)".
 */
export function resolveServiceLevelCode(
  shippingMethod: string | null | undefined,
  fallback: string = DEFAULT_SERVICE_LEVEL
): string {
  if (!shippingMethod) return fallback;

  const bracketed = shippingMethod.match(/\(([A-Z0-9]{2,8})\)\s*$/);
  if (bracketed) return bracketed[1];

  const known = shippingMethod.toUpperCase().match(/\b(ECO|ONX|SDX)\b/);
  if (known) return known[1];

  const lower = shippingMethod.toLowerCase();
  if (lower.includes("same day")) return "SDX";
  if (lower.includes("overnight")) return "ONX";
  if (lower.includes("economy")) return "ECO";

  return fallback;
}

/**
 * Normalises South African phone numbers to 10-digit format (e.g. 0664859011).
 */
function normalizePhoneNumber(rawPhone?: string | null): string {
  if (!rawPhone) return "0664859011";
  const cleaned = rawPhone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+27")) {
    return "0" + cleaned.slice(3);
  }
  if (cleaned.startsWith("27") && cleaned.length === 11) {
    return "0" + cleaned.slice(2);
  }
  return cleaned;
}

/**
 * Maps database shipping address JSON to the Shiplogic delivery address schema.
 */
function mapCustomerDeliveryAddress(rawAddress: unknown): ShiplogicAddress {
  const addr: ParsedCustomerAddress =
    typeof rawAddress === "string"
      ? JSON.parse(rawAddress)
      : ((rawAddress as ParsedCustomerAddress) || {});

  return {
    type: "residential",
    street_address: addr.streetAddress || "Street Address Not Provided",
    local_area: addr.suburb || addr.city || "Gauteng",
    city: addr.city || "Johannesburg",
    zone: addr.province || "Gauteng",
    country: "ZA",
    code: addr.postalCode || "2000",
  };
}

/**
 * Builds the parcel for the shipment. Single 400ml bottle ~0.5kg, scaled by item count.
 */
function buildParcelsForOrder(order: OrderWithItems): ShiplogicParcel[] {
  const totalItemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalWeight = Math.max(0.5, Math.round(totalItemCount * 0.5 * 10) / 10);

  return [
    {
      submitted_length_cm: 15,
      submitted_width_cm: 10,
      submitted_height_cm: 12,
      submitted_weight_kg: totalWeight,
      parcel_description: `Divinity Cosmetics Order ${order.orderNumber} (${totalItemCount} item${
        totalItemCount > 1 ? "s" : ""
      })`,
    },
  ];
}

/**
 * Fetches the waybill PDF URL for an existing shipment.
 * Signed S3 URLs expire after ~24 hours, so call this again whenever a fresh label is needed.
 */
export async function fetchShipmentLabelUrl(
  shipmentId: string
): Promise<string | undefined> {
  const config = getCourierGuyConfig();
  if (!config) return undefined;

  try {
    const response = await fetch(
      `${config.baseUrl}/v3/shipments/label?id=${encodeURIComponent(shipmentId)}`,
      {
        method: "GET",
        headers: {
          Authorization: getShiplogicAuthHeader(config.apiKey),
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.warn(`[The Courier Guy] Label fetch for shipment ${shipmentId} returned HTTP ${response.status}.`);
      return undefined;
    }

    const data: unknown = await response.json().catch(() => null);
    if (typeof data === "string") return data;
    if (data && typeof data === "object" && "url" in data) {
      const url = (data as { url?: unknown }).url;
      return typeof url === "string" ? url : undefined;
    }
    return undefined;
  } catch (error) {
    console.warn(`[The Courier Guy] Label fetch for shipment ${shipmentId} failed:`, error);
    return undefined;
  }
}

/**
 * Creates a door-to-door shipment with The Courier Guy via Shiplogic (`POST /v3/shipments`).
 * Collection is locked to the Wright Crossing Shopping Centre hub.
 */
export async function createCourierGuyShipment(
  order: OrderWithItems
): Promise<CreateShipmentResult> {
  const config = getCourierGuyConfig();

  if (!config) {
    if (process.env.NODE_ENV !== "production" || process.env.ALLOW_MOCK_COURIER === "true") {
      console.warn(
        `[The Courier Guy] API key not set. Simulating test shipment for Order ${order.orderNumber}...`
      );
      const testRef = `TCG-TEST-${Date.now().toString().slice(-7)}`;
      return {
        success: true,
        waybillNumber: testRef,
        shiplogicShipmentId: undefined,
        trackingUrl: `https://thecourierguy.co.za/tracking?tracking_number=${testRef}`,
        serviceLevel: "ECO (Simulated)",
        rawResponse: { simulated: true, orderNumber: order.orderNumber },
      };
    }

    throw new Error(
      "[The Courier Guy] Missing API key. Set COURIER_GUY_API_KEY (live) or COURIER_GUY_API_TEST_KEY (sandbox)."
    );
  }

  const { isSandbox } = config;
  const serviceLevelCode = resolveServiceLevelCode(order.shippingMethod, config.serviceLevelCode);
  const deliveryAddress = mapCustomerDeliveryAddress(order.shippingAddress);
  const parcels = buildParcelsForOrder(order);
  const customerMobile = normalizePhoneNumber(order.phone);
  const hubMobile = normalizePhoneNumber(config.hub.phone);

  const collectionInstructions =
    "Pickup from Divinity Cosmetics at Wright Crossing Shopping Centre. Packed parcel ready for dispatch.";
  const deliveryInstructions =
    order.customerNotes || "Fragile cosmetic glassware / skincare products. Handle with care.";

  const payload: ShiplogicShipmentPayload = {
    service_level_code: serviceLevelCode,
    customer_reference: order.orderNumber,
    customer_reference_name: "Order no.",
    collection_address: {
      type: "business",
      company: config.hub.company,
      street_address: config.hub.streetAddress,
      local_area: config.hub.localArea,
      city: config.hub.city,
      zone: config.hub.zone,
      country: config.hub.country,
      code: config.hub.postalCode,
    },
    collection_contact: {
      name: config.hub.contactName,
      mobile_number: hubMobile,
      email: config.hub.email,
    },
    delivery_address: deliveryAddress,
    delivery_contact: {
      name: `${order.firstName} ${order.lastName}`.trim() || "Valued Customer",
      mobile_number: customerMobile,
      email: order.email,
    },
    parcels,
    declared_value: Number(order.total),
    // Sandbox: never notify real customers. Live: let TCG send tracking SMS/email.
    mute_notifications: isSandbox ? true : false,
    special_instructions_collection: isSandbox
      ? `[SANDBOX TEST - DO NOT COLLECT] ${collectionInstructions}`
      : collectionInstructions,
    special_instructions_delivery: isSandbox
      ? `[SANDBOX TEST - DO NOT DELIVER] ${deliveryInstructions}`
      : deliveryInstructions,
  };

  const endpoint = `${config.baseUrl}/v3/shipments`;
  console.log(`[THE COURIER GUY] ${isSandbox ? "SANDBOX" : "LIVE"} booking request -> ${endpoint}`);
  console.log(`   ├─ Service Level: ${serviceLevelCode} (from "${order.shippingMethod ?? "n/a"}")`);
  console.log(`   ├─ Collection Hub: ${config.hub.company} (${config.hub.streetAddress}, ${config.hub.city})`);
  console.log(`   ├─ Delivery: ${deliveryAddress.street_address}, ${deliveryAddress.city} (${deliveryAddress.code})`);
  console.log(
    `   └─ Parcels (${parcels.length}): ${parcels
      .map((p) => `${p.submitted_weight_kg}kg [${p.submitted_length_cm}x${p.submitted_width_cm}x${p.submitted_height_cm}cm]`)
      .join(", ")}`
  );

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: getShiplogicAuthHeader(config.apiKey),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const responseData: ShiplogicShipmentResponse = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      responseData.message ||
      (responseData.errors ? JSON.stringify(responseData.errors) : response.statusText);
    console.error(`[THE COURIER GUY ERROR] HTTP ${response.status}:`, responseData);
    throw new Error(`The Courier Guy Shiplogic Error (${response.status}): ${errorMsg}`);
  }

  const shiplogicShipmentId =
    responseData.id !== undefined && responseData.id !== null ? String(responseData.id) : undefined;

  const waybillNumber =
    responseData.short_tracking_reference ||
    responseData.tracking_reference ||
    responseData.custom_tracking_reference ||
    responseData.waybill_number ||
    shiplogicShipmentId;

  if (!waybillNumber) {
    console.error("[The Courier Guy] Response missing tracking reference:", responseData);
    throw new Error("The Courier Guy responded successfully but did not return a tracking reference.");
  }

  const trackingUrl =
    responseData.tracking_url ||
    `https://thecourierguy.co.za/tracking?tracking_number=${encodeURIComponent(waybillNumber)}`;

  let labelUrl = responseData.labels?.[0]?.url;
  if (!labelUrl && shiplogicShipmentId) {
    labelUrl = await fetchShipmentLabelUrl(shiplogicShipmentId);
  }

  console.log(
    `[The Courier Guy Success] Waybill ${waybillNumber} (shipment ${shiplogicShipmentId ?? "n/a"}) for ${order.orderNumber}.`
  );

  return {
    success: true,
    waybillNumber,
    shiplogicShipmentId,
    trackingUrl,
    labelUrl,
    serviceLevel: responseData.service_level?.name || responseData.service_level_code || serviceLevelCode,
    rawResponse: responseData,
  };
}
