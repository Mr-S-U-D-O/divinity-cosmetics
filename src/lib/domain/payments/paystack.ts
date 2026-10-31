import crypto from "crypto";

const PAYSTACK_API_BASE = "https://api.paystack.co";

export interface InitializePaystackParams {
  email: string;
  amountInCents: number;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
  currency?: string;
}

export interface InitializePaystackResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface VerifyPaystackResult {
  isSuccessful: boolean;
  status: string;
  reference: string;
  amountInCents: number;
  currency: string;
  channel?: string;
  gatewayResponse?: string;
  paidAt?: string;
  metadata?: Record<string, any>;
  customerEmail?: string;
}

function getPaystackSecretKey(): string {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not configured in environment variables. Please add it to your .env file."
    );
  }
  return secretKey;
}

/**
 * Initialize a transaction with Paystack.
 * Converts amount to integer cents and requests a secure checkout URL.
 */
export async function initializePaystackTransaction(
  params: InitializePaystackParams
): Promise<InitializePaystackResult> {
  const secretKey = getPaystackSecretKey();

  const payload: Record<string, any> = {
    email: params.email,
    amount: Math.round(params.amountInCents),
    reference: params.reference,
    currency: params.currency || "ZAR",
  };

  if (params.callbackUrl) {
    payload.callback_url = params.callbackUrl;
  }

  if (params.metadata) {
    payload.metadata = params.metadata;
  }

  const response = await fetch(`${PAYSTACK_API_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    const errorMsg = data.message || "Failed to initialize Paystack transaction";
    console.error("Paystack Initialize Error:", data);
    throw new Error(errorMsg);
  }

  return {
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference: data.data.reference,
  };
}

/**
 * Verifies a transaction reference directly against Paystack's API.
 */
export async function verifyPaystackTransaction(
  reference: string
): Promise<VerifyPaystackResult> {
  const secretKey = getPaystackSecretKey();

  const encodedRef = encodeURIComponent(reference);
  const response = await fetch(
    `${PAYSTACK_API_BASE}/transaction/verify/${encodedRef}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok || !data.status) {
    const errorMsg = data.message || "Failed to verify Paystack transaction";
    console.error("Paystack Verification Failed:", data);
    return {
      isSuccessful: false,
      status: "verification_failed",
      reference,
      amountInCents: 0,
      currency: "ZAR",
      gatewayResponse: errorMsg,
    };
  }

  const txData = data.data;
  const isSuccessful = txData.status === "success";

  return {
    isSuccessful,
    status: txData.status,
    reference: txData.reference,
    amountInCents: txData.amount,
    currency: txData.currency,
    channel: txData.channel,
    gatewayResponse: txData.gateway_response,
    paidAt: txData.paid_at,
    metadata: txData.metadata,
    customerEmail: txData.customer?.email,
  };
}

/**
 * Validates HMAC SHA512 signature for Paystack Webhook events.
 */
export function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  if (!signatureHeader) return false;
  try {
    const secretKey = getPaystackSecretKey();
    const hash = crypto
      .createHmac("sha512", secretKey)
      .update(rawBody)
      .digest("hex");
    return hash === signatureHeader;
  } catch (e) {
    console.error("Paystack signature validation error:", e);
    return false;
  }
}
