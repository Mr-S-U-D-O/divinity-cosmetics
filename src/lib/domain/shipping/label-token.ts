import crypto from "crypto";

const LABEL_TOKEN_VERSION = "v1";
const LABEL_TOKEN_SCOPE = "waybill-label";
export const WAYBILL_LABEL_TOKEN_TTL_SECONDS = 90 * 24 * 60 * 60; // 90 days for warehouse reprints

/**
 * Ephemeral per-process secret used ONLY when no server secrets are configured
 * in environment variables (e.g., isolated unit tests).
 */
let ephemeralFallbackSecret: string | null = null;

function getLabelTokenSecret(): string {
  const dedicated = process.env.LABEL_TOKEN_SECRET?.trim();
  if (dedicated) {
    return dedicated;
  }

  // Derive a domain-separated key from an existing server secret so the raw
  // master secret (e.g. ZOHO_WEBHOOK_SECRET) is never placed in URLs or derivable.
  const baseSecret =
    process.env.ZOHO_WEBHOOK_SECRET?.trim() ||
    process.env.RECEIPT_TOKEN_SECRET?.trim() ||
    process.env.SHIPPING_QUOTE_SECRET?.trim() ||
    process.env.PAYSTACK_SECRET_KEY?.trim() ||
    process.env.CLERK_SECRET_KEY?.trim() ||
    process.env.DATABASE_URL?.trim();

  if (baseSecret) {
    return crypto
      .createHmac("sha256", "divinity-waybill-label-key-v1")
      .update(baseSecret)
      .digest("hex");
  }

  if (!ephemeralFallbackSecret) {
    ephemeralFallbackSecret = crypto.randomBytes(32).toString("hex");
  }
  return ephemeralFallbackSecret;
}

interface WaybillLabelTokenPayload {
  scope: string;
  orderNumber: string;
  exp: number;
}

function signEncodedPayload(encodedPayload: string): string {
  return crypto
    .createHmac("sha256", getLabelTokenSecret())
    .update(encodedPayload)
    .digest("base64url");
}

/**
 * Mints a scoped, order-specific HMAC-SHA256 print token for `/api/shipping/label/[orderNumber]`.
 * A leaked link for one order cannot open any other order or authenticate Zoho webhooks.
 */
export function signWaybillLabelToken(
  orderNumber: string,
  ttlSeconds: number = WAYBILL_LABEL_TOKEN_TTL_SECONDS
): string {
  const cleanOrderNumber = orderNumber.trim();
  if (!cleanOrderNumber) {
    throw new Error("Order number is required to sign a waybill label token.");
  }

  const payload: WaybillLabelTokenPayload = {
    scope: LABEL_TOKEN_SCOPE,
    orderNumber: cleanOrderNumber,
    exp: Date.now() + ttlSeconds * 1000,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  const signature = signEncodedPayload(encodedPayload);
  return `${LABEL_TOKEN_VERSION}.${encodedPayload}.${signature}`;
}

/**
 * Verifies a waybill print token against the exact requested orderNumber.
 */
export function verifyWaybillLabelToken(
  token: string | null | undefined,
  expectedOrderNumber: string
): boolean {
  if (!token || typeof token !== "string" || !expectedOrderNumber) {
    return false;
  }

  const cleanExpectedOrder = expectedOrderNumber.trim();
  const parts = token.trim().split(".");
  if (parts.length !== 3 || parts[0] !== LABEL_TOKEN_VERSION) {
    return false;
  }

  const [, encodedPayload, providedSig] = parts;
  if (!encodedPayload || !providedSig) {
    return false;
  }

  const expectedSig = signEncodedPayload(encodedPayload);
  const providedBuf = Buffer.from(providedSig, "utf8");
  const expectedBuf = Buffer.from(expectedSig, "utf8");

  if (
    providedBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(providedBuf, expectedBuf)
  ) {
    return false;
  }

  let payload: WaybillLabelTokenPayload;
  try {
    payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as WaybillLabelTokenPayload;
  } catch {
    return false;
  }

  if (
    !payload ||
    payload.scope !== LABEL_TOKEN_SCOPE ||
    typeof payload.orderNumber !== "string" ||
    typeof payload.exp !== "number" ||
    payload.exp <= Date.now()
  ) {
    return false;
  }

  return payload.orderNumber.trim() === cleanExpectedOrder;
}
