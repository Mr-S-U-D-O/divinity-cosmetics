import crypto from "crypto";

const QUOTE_TOKEN_VERSION = "v1";
const DEFAULT_QUOTE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Ephemeral per-process secret used ONLY when no server secrets are configured
 * in environment variables (e.g., isolated unit tests).
 */
let ephemeralFallbackSecret: string | null = null;

function getShippingQuoteSecret(): string {
  const configured =
    process.env.SHIPPING_QUOTE_SECRET?.trim() ||
    process.env.PAYSTACK_SECRET_KEY?.trim() ||
    process.env.CLERK_SECRET_KEY?.trim() ||
    process.env.DATABASE_URL?.trim();

  if (configured) {
    return configured;
  }

  if (!ephemeralFallbackSecret) {
    ephemeralFallbackSecret = crypto.randomBytes(32).toString("hex");
  }
  return ephemeralFallbackSecret;
}

export interface DestinationInput {
  suburb?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
}

export interface NormalizedDestination {
  province: string;
  city: string;
  suburb: string;
  postalCode: string;
}

export interface SignedShippingQuotePayload {
  code: string;
  name: string;
  rate: number;
  currency: string;
  province: string;
  city: string;
  suburb: string;
  postalCode: string;
  weightInKg: number;
  exp: number;
}

export interface VerifiedShippingQuote {
  code: string;
  name: string;
  rate: number;
  currency: string;
}

/**
 * Single source of truth for parcel weight calculation across rate quoting,
 * order creation, and Shiplogic waybill booking.
 * Single 400ml bottle ~0.5kg, scaled by item count with a 0.5kg minimum.
 */
export function computeParcelWeightKg(totalItemCount: number): number {
  const safeCount =
    Number.isFinite(totalItemCount) && totalItemCount > 0
      ? Math.floor(totalItemCount)
      : 1;
  return Math.max(0.5, Math.round(safeCount * 0.5 * 10) / 10);
}

/**
 * Normalizes destination fields so rate quoting and quote verification
 * always compare identical canonical values.
 */
export function normalizeDestinationParams(
  params: DestinationInput
): NormalizedDestination {
  const province = (params.province || "").trim() || "Gauteng";
  const isGauteng = province.toLowerCase().includes("gauteng");
  const city = (params.city || "").trim() || (isGauteng ? "Johannesburg" : "Cape Town");
  const suburb = (params.suburb || "").trim() || "Rosebank";
  const postalCode = (params.postalCode || "").trim() || (isGauteng ? "2196" : "8001");

  return {
    province,
    city,
    suburb,
    postalCode,
  };
}

function canonicalizeField(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Safely parses a customer shipping address object (or JSON string) for order validation.
 */
export function parseOrderShippingAddress(rawAddress: unknown): {
  streetAddress: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
} {
  let parsed: Record<string, unknown> | null = null;

  if (typeof rawAddress === "string") {
    try {
      const maybeObj = JSON.parse(rawAddress);
      if (maybeObj && typeof maybeObj === "object" && !Array.isArray(maybeObj)) {
        parsed = maybeObj as Record<string, unknown>;
      }
    } catch {
      parsed = null;
    }
  } else if (rawAddress && typeof rawAddress === "object" && !Array.isArray(rawAddress)) {
    parsed = rawAddress as Record<string, unknown>;
  }

  if (!parsed) {
    throw new Error("A valid delivery address is required.");
  }

  const str = (val: unknown) => (typeof val === "string" ? val.trim() : "");

  const streetAddress = str(parsed.streetAddress);
  const suburb = str(parsed.suburb);
  const city = str(parsed.city);
  const province = str(parsed.province);
  const postalCode = str(parsed.postalCode);
  const country = str(parsed.country) || "South Africa";

  if (!province || !postalCode) {
    throw new Error(
      "Delivery province and postal code are required to verify shipping fees."
    );
  }

  return {
    streetAddress,
    suburb,
    city,
    province,
    postalCode,
    country,
  };
}

function signPayloadEncoded(encodedPayload: string): string {
  return crypto
    .createHmac("sha256", getShippingQuoteSecret())
    .update(encodedPayload)
    .digest("base64url");
}

/**
 * Creates a stateless HMAC-SHA256 signed token binding a shipping rate
 * to a specific service level, destination, parcel weight, and expiration.
 */
export function signShippingQuote(params: {
  code: string;
  name: string;
  rate: number;
  currency?: string;
  destination: NormalizedDestination;
  weightInKg: number;
  ttlMs?: number;
}): string {
  const payload: SignedShippingQuotePayload = {
    code: params.code.trim().toUpperCase(),
    name: params.name.trim(),
    rate: Math.round(params.rate * 100) / 100,
    currency: (params.currency || "ZAR").trim().toUpperCase(),
    province: canonicalizeField(params.destination.province),
    city: canonicalizeField(params.destination.city),
    suburb: canonicalizeField(params.destination.suburb),
    postalCode: canonicalizeField(params.destination.postalCode),
    weightInKg: Math.round(params.weightInKg * 10) / 10,
    exp: Date.now() + (params.ttlMs ?? DEFAULT_QUOTE_TTL_MS),
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  const signature = signPayloadEncoded(encodedPayload);
  return `${QUOTE_TOKEN_VERSION}.${encodedPayload}.${signature}`;
}

/**
 * Verifies an HMAC-signed shipping quote token against the order's actual
 * service level, normalized destination, parcel weight, and current time.
 * Returns null if the token is malformed, forged, expired, or mismatched.
 */
export function verifyShippingQuoteToken(
  token: string,
  expected: {
    serviceLevelCode: string;
    destination: NormalizedDestination;
    weightInKg: number;
  }
): VerifiedShippingQuote | null {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== QUOTE_TOKEN_VERSION) {
    return null;
  }

  const [, encodedPayload, providedSig] = parts;
  if (!encodedPayload || !providedSig) {
    return null;
  }

  const expectedSig = signPayloadEncoded(encodedPayload);
  const providedBuf = Buffer.from(providedSig, "utf8");
  const expectedBuf = Buffer.from(expectedSig, "utf8");

  if (
    providedBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(providedBuf, expectedBuf)
  ) {
    return null;
  }

  let payload: SignedShippingQuotePayload;
  try {
    payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as SignedShippingQuotePayload;
  } catch {
    return null;
  }

  if (
    !payload ||
    typeof payload.code !== "string" ||
    typeof payload.name !== "string" ||
    typeof payload.rate !== "number" ||
    !Number.isFinite(payload.rate) ||
    payload.rate <= 0 ||
    typeof payload.exp !== "number" ||
    payload.exp <= Date.now()
  ) {
    return null;
  }

  if (payload.code.toUpperCase() !== expected.serviceLevelCode.trim().toUpperCase()) {
    return null;
  }

  if (
    payload.province !== canonicalizeField(expected.destination.province) ||
    payload.city !== canonicalizeField(expected.destination.city) ||
    payload.suburb !== canonicalizeField(expected.destination.suburb) ||
    payload.postalCode !== canonicalizeField(expected.destination.postalCode)
  ) {
    return null;
  }

  const expectedWeight = Math.round(expected.weightInKg * 10) / 10;
  if (Math.abs(payload.weightInKg - expectedWeight) > 0.001) {
    return null;
  }

  return {
    code: payload.code.toUpperCase(),
    name: payload.name,
    rate: Math.round(payload.rate * 100) / 100,
    currency: payload.currency || "ZAR",
  };
}
