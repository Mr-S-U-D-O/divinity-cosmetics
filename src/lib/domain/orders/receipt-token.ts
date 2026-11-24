import crypto from "crypto";

const RECEIPT_TOKEN_VERSION = "v1";
export const RECEIPT_COOKIE_NAME = "divinity_receipt_token";
export const RECEIPT_TOKEN_TTL_SECONDS = 60 * 60; // 1 hour

/**
 * Ephemeral per-process secret used ONLY when no server secrets are configured
 * in environment variables (e.g., isolated unit tests).
 */
let ephemeralFallbackSecret: string | null = null;

function getReceiptTokenSecret(): string {
  const configured =
    process.env.RECEIPT_TOKEN_SECRET?.trim() ||
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

interface ReceiptTokenPayload {
  orderNumber: string;
  exp: number;
}

function signEncodedPayload(encodedPayload: string): string {
  return crypto
    .createHmac("sha256", getReceiptTokenSecret())
    .update(encodedPayload)
    .digest("base64url");
}

/**
 * Mints an HMAC-SHA256 signed token authorizing receipt access for a specific paid order.
 */
export function signOrderReceiptToken(
  orderNumber: string,
  ttlSeconds: number = RECEIPT_TOKEN_TTL_SECONDS
): string {
  const cleanOrderNumber = orderNumber.trim();
  if (!cleanOrderNumber) {
    throw new Error("Order number is required to sign a receipt token.");
  }

  const payload: ReceiptTokenPayload = {
    orderNumber: cleanOrderNumber,
    exp: Date.now() + ttlSeconds * 1000,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  const signature = signEncodedPayload(encodedPayload);
  return `${RECEIPT_TOKEN_VERSION}.${encodedPayload}.${signature}`;
}

/**
 * Verifies an order-specific receipt token using constant-time HMAC comparison.
 * Returns true only if the signature is valid, unexpired, and matches expectedOrderNumber.
 */
export function verifyOrderReceiptToken(
  token: string | null | undefined,
  expectedOrderNumber: string
): boolean {
  if (!token || typeof token !== "string" || !expectedOrderNumber) {
    return false;
  }

  const cleanExpectedOrder = expectedOrderNumber.trim();
  const parts = token.trim().split(".");
  if (parts.length !== 3 || parts[0] !== RECEIPT_TOKEN_VERSION) {
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

  let payload: ReceiptTokenPayload;
  try {
    payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as ReceiptTokenPayload;
  } catch {
    return false;
  }

  if (
    !payload ||
    typeof payload.orderNumber !== "string" ||
    typeof payload.exp !== "number" ||
    payload.exp <= Date.now()
  ) {
    return false;
  }

  return payload.orderNumber.trim() === cleanExpectedOrder;
}
