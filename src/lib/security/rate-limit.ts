import { headers } from "next/headers";

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

interface MemoryBucket {
  count: number;
  resetAt: number;
}

const MAX_MEMORY_BUCKETS = 5000;
const memoryBuckets = new Map<string, MemoryBucket>();

function pruneMemoryBuckets(now: number) {
  if (memoryBuckets.size <= MAX_MEMORY_BUCKETS) return;
  for (const [k, v] of memoryBuckets) {
    if (v.resetAt <= now) {
      memoryBuckets.delete(k);
    }
  }
  if (memoryBuckets.size > MAX_MEMORY_BUCKETS) {
    const excess = memoryBuckets.size - MAX_MEMORY_BUCKETS;
    let deleted = 0;
    for (const key of memoryBuckets.keys()) {
      memoryBuckets.delete(key);
      deleted++;
      if (deleted >= excess) break;
    }
  }
}

function checkMemoryRateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  pruneMemoryBuckets(now);

  const existing = memoryBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return {
      allowed: true,
      remaining: Math.max(0, options.limit - 1),
      retryAfterSeconds: Math.ceil(options.windowMs / 1000),
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, options.limit - existing.count);
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((existing.resetAt - now) / 1000)
  );

  return {
    allowed: existing.count <= options.limit,
    remaining,
    retryAfterSeconds,
  };
}

async function checkUpstashRateLimit(
  key: string,
  options: RateLimitOptions
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    return null;
  }

  try {
    const cleanUrl = url.replace(/\/+$/, "");
    const response = await fetch(`${cleanUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["PTTL", key],
      ]),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const results = (await response.json()) as Array<{ result?: number }>;
    const count = Number(results?.[0]?.result ?? 1);
    let pttl = Number(results?.[1]?.result ?? -1);

    if (count === 1 || pttl < 0) {
      await fetch(`${cleanUrl}/pexpire/${encodeURIComponent(key)}/${options.windowMs}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }).catch(() => {});
      pttl = options.windowMs;
    }

    return {
      allowed: count <= options.limit,
      remaining: Math.max(0, options.limit - count),
      retryAfterSeconds: Math.max(1, Math.ceil(pttl / 1000)),
    };
  } catch {
    return null;
  }
}

/**
 * Checks a sliding/fixed rate-limit bucket using Upstash Redis REST when configured,
 * automatically falling back to a bounded in-memory limiter.
 */
export async function checkRateLimit(
  key: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const upstashResult = await checkUpstashRateLimit(key, options);
  if (upstashResult) {
    return upstashResult;
  }
  return checkMemoryRateLimit(key, options);
}

/**
 * Extracts the best-effort client IP address from Next.js request headers.
 */
export async function getClientIpFromHeaders(): Promise<string> {
  try {
    const hdrs = await headers();
    const forwardedFor = hdrs.get("x-forwarded-for");
    if (forwardedFor) {
      const first = forwardedFor.split(",")[0]?.trim();
      if (first) return first.slice(0, 64);
    }
    const realIp = hdrs.get("x-real-ip")?.trim();
    if (realIp) return realIp.slice(0, 64);
  } catch {
    // Non-HTTP context (e.g. unit test)
  }
  return "unknown";
}
