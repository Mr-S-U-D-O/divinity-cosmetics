import { AsyncLocalStorage } from "node:async_hooks";
import { ZohoAuthConfig, ZohoTokenResponse } from "./types";

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

const zohoRevalidateStorage = new AsyncLocalStorage<number>();

/**
 * Executes an async operation in a context where read-only Zoho GET calls
 * (and OAuth token refreshes needed for them) use Next.js `next: { revalidate }`
 * instead of `cache: "no-store"`, keeping storefront ISR pages statically cacheable.
 */
export function runWithZohoRevalidate<T>(
  seconds: number,
  fn: () => Promise<T>
): Promise<T> {
  return zohoRevalidateStorage.run(seconds, fn);
}

/**
 * Validates and retrieves Zoho configuration from environment variables.
 * Returns null if any required credential is missing or empty.
 */
export function getZohoConfig(): ZohoAuthConfig | null {
  const clientId = process.env.ZOHO_CLIENT_ID?.trim();
  const clientSecret = process.env.ZOHO_CLIENT_SECRET?.trim();
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN?.trim();
  const organizationId = process.env.ZOHO_ORG_ID?.trim();

  if (!clientId || !clientSecret || !refreshToken || !organizationId) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    refreshToken,
    organizationId,
    accountsUrl: process.env.ZOHO_ACCOUNTS_URL?.trim() || "https://accounts.zoho.com",
    apiBaseUrl: process.env.ZOHO_API_BASE_URL?.trim() || "https://www.zohoapis.com/books/v3",
  };
}

/**
 * Checks whether Zoho API credentials are configured in the current environment.
 */
export function isZohoConfigured(): boolean {
  return getZohoConfig() !== null;
}

/**
 * Exchanges the Zoho Refresh Token for a valid OAuth Access Token.
 * Tokens are cached in-memory and refreshed 5 minutes before expiration.
 */
export async function getZohoAccessToken(): Promise<string> {
  const config = getZohoConfig();
  if (!config) {
    throw new Error(
      "[Zoho API] Missing credentials. Please configure ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_ORG_ID, and ZOHO_REFRESH_TOKEN in .env.local."
    );
  }

  // Use cached token if still valid (with a 5-minute safety buffer)
  const now = Date.now();
  if (cachedAccessToken && now < tokenExpiresAt - 300_000) {
    return cachedAccessToken;
  }

  const tokenUrl = `${config.accountsUrl.replace(/\/+$/, "")}/oauth/v2/token`;

  const params = new URLSearchParams({
    refresh_token: config.refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "refresh_token",
  });

  const revalidateSeconds = zohoRevalidateStorage.getStore();
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    ...(revalidateSeconds !== undefined
      ? { next: { revalidate: revalidateSeconds } }
      : { cache: "no-store" }),
  });

  const data = (await response.json()) as ZohoTokenResponse;

  if (!response.ok || data.error || !data.access_token) {
    const errorDetails = data.error || response.statusText || "Token exchange failed";
    console.error("[Zoho Auth Error]:", data);
    throw new Error(`[Zoho API] Failed to refresh OAuth access token: ${errorDetails}`);
  }

  cachedAccessToken = data.access_token;
  // Default to 3600 seconds if expires_in is omitted
  const expiresInSeconds = data.expires_in || 3600;
  tokenExpiresAt = now + expiresInSeconds * 1000;

  console.log(`[Zoho Auth] Successfully acquired new access token. Valid for ${expiresInSeconds}s.`);
  return cachedAccessToken;
}

/**
 * Generic HTTP client for Zoho Books / Inventory REST APIs.
 * Automatically injects the OAuth bearer token, organization ID, and validates responses.
 */
export async function zohoFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const config = getZohoConfig();
  if (!config) {
    throw new Error("[Zoho API] Cannot execute request. Zoho credentials are not configured.");
  }

  const accessToken = await getZohoAccessToken();
  const cleanEndpoint = endpoint.replace(/^\/+/, "");
  const separator = cleanEndpoint.includes("?") ? "&" : "?";

  // Organization ID is required both as a query parameter and header by Zoho Books & Inventory
  const fullUrl = `${config.apiBaseUrl.replace(/\/+$/, "")}/${cleanEndpoint}${separator}organization_id=${encodeURIComponent(
    config.organizationId
  )}`;

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Zoho-oauthtoken ${accessToken}`);
  headers.set("X-com-zoho-books-organizationid", config.organizationId);
  headers.set("Content-Type", "application/json;charset=UTF-8");

  const method = (options.method || "GET").toUpperCase();
  const revalidateSeconds = zohoRevalidateStorage.getStore();
  const useRevalidate =
    method === "GET" &&
    options.cache !== "no-store" &&
    revalidateSeconds !== undefined;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
    ...(useRevalidate
      ? { next: { revalidate: revalidateSeconds } }
      : { cache: "no-store" }),
  });

  const rawText = await response.text().catch(() => "");
  let json: { code?: number; message?: string } | null = null;
  try {
    json = rawText
      ? (JSON.parse(rawText) as { code?: number; message?: string })
      : null;
  } catch {
    json = null;
  }

  // In Zoho Books API, code: 0 signifies an operation success
  if (!response.ok || (json && typeof json.code === "number" && json.code !== 0)) {
    const code = json?.code ?? response.status;
    const message = json?.message || response.statusText || "Unknown Zoho API Error";
    console.error(
      `[Zoho API Error] ${options.method || "GET"} /${cleanEndpoint} | HTTP ${response.status} | code=${code} | message=${message} | fullResponse=${rawText}`
    );
    throw new Error(`Zoho API Error (${code}): ${message}`);
  }

  return json as T;
}
