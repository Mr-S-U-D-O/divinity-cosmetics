/**
 * Structured test result collector and R3-resilient assertion helpers.
 */

import { decodeHtmlEntities } from "./parsers.mjs";

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "has",
  "have",
  "he",
  "her",
  "his",
  "how",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "me",
  "my",
  "no",
  "not",
  "of",
  "on",
  "or",
  "our",
  "out",
  "she",
  "so",
  "that",
  "the",
  "their",
  "them",
  "they",
  "this",
  "to",
  "up",
  "us",
  "was",
  "we",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "will",
  "with",
  "you",
  "your",
]);

export function normalizeComparisonText(input) {
  return decodeHtmlEntities(String(input || ""))
    .toLowerCase()
    .replace(/[\u2018\u2019']/g, "'")
    .replace(/[\u201C\u201D"]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractSignificantTokens(input) {
  const norm = normalizeComparisonText(input).replace(/[^\p{L}\p{N}%]+/gu, " ");
  const tokens = norm.split(/\s+/).filter(Boolean);
  const significant = tokens.filter((t) => !STOPWORDS.has(t) && t.length > 1);
  return significant.length > 0 ? significant : tokens;
}

/**
 * R3-resilient parity check:
 * Returns matched=true if normalized needle is an exact substring of normalized haystack
 * OR >= minOverlap (default 85%) of needle's non-stopword tokens exist in haystack.
 */
export function matchTextResilient(needle, haystack, minOverlap = 0.85) {
  const normNeedle = normalizeComparisonText(needle);
  const normHaystack = normalizeComparisonText(haystack);

  if (!normNeedle) {
    return { matched: false, ratio: 0, method: "empty-needle" };
  }

  if (normHaystack.includes(normNeedle)) {
    return { matched: true, ratio: 1, method: "substring" };
  }

  // Also check punctuation-stripped substring
  const alnumNeedle = normNeedle.replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
  const alnumHaystack = normHaystack.replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();
  if (alnumNeedle && alnumHaystack.includes(alnumNeedle)) {
    return { matched: true, ratio: 1, method: "alnum-substring" };
  }

  const needleTokens = extractSignificantTokens(needle);
  const haystackSet = new Set(extractSignificantTokens(haystack));
  if (needleTokens.length === 0) {
    return { matched: false, ratio: 0, method: "no-tokens" };
  }

  let hits = 0;
  const missing = [];
  for (const tok of needleTokens) {
    if (haystackSet.has(tok)) {
      hits++;
    } else {
      missing.push(tok);
    }
  }
  const ratio = hits / needleTokens.length;
  return {
    matched: ratio >= minOverlap,
    ratio,
    method: "token-overlap",
    missing: missing.slice(0, 8),
  };
}

export class TestCollector {
  constructor() {
    this.results = [];
  }

  record({ id, tier, name, status, details = "" }) {
    this.results.push({ id, tier, name, status, details });
  }

  pass(id, tier, name, details = "") {
    this.record({ id, tier, name, status: "PASS", details });
  }

  fail(id, tier, name, details = "") {
    this.record({ id, tier, name, status: "FAIL", details });
  }

  warn(id, tier, name, details = "") {
    this.record({ id, tier, name, status: "WARN", details });
  }

  skip(id, tier, name, details = "") {
    this.record({ id, tier, name, status: "SKIP", details });
  }

  assert(id, tier, name, condition, passDetails = "", failDetails = "") {
    if (condition) {
      this.pass(id, tier, name, passDetails);
    } else {
      this.fail(id, tier, name, failDetails || passDetails);
    }
    return Boolean(condition);
  }

  getSummary() {
    const counts = { total: 0, passed: 0, failed: 0, warned: 0, skipped: 0 };
    const byTier = {};

    for (const r of this.results) {
      counts.total++;
      if (r.status === "PASS") counts.passed++;
      else if (r.status === "FAIL") counts.failed++;
      else if (r.status === "WARN") counts.warned++;
      else if (r.status === "SKIP") counts.skipped++;

      if (!byTier[r.tier]) {
        byTier[r.tier] = { total: 0, passed: 0, failed: 0, warned: 0, skipped: 0 };
      }
      byTier[r.tier].total++;
      if (r.status === "PASS") byTier[r.tier].passed++;
      else if (r.status === "FAIL") byTier[r.tier].failed++;
      else if (r.status === "WARN") byTier[r.tier].warned++;
      else if (r.status === "SKIP") byTier[r.tier].skipped++;
    }

    return { counts, byTier };
  }

  formatReport() {
    const lines = [];
    const { counts, byTier } = this.getSummary();

    let currentTier = null;
    for (const r of this.results) {
      if (r.tier !== currentTier) {
        currentTier = r.tier;
        lines.push("");
        lines.push(`=== ${currentTier} ===`);
      }
      const badge = r.status.padEnd(4, " ");
      const detailSuffix = r.details ? ` — ${r.details}` : "";
      lines.push(`[${badge}] ${r.id} | ${r.name}${detailSuffix}`);
    }

    lines.push("");
    lines.push("=== Summary ===");
    for (const [tier, c] of Object.entries(byTier)) {
      lines.push(
        `  ${tier}: ${c.passed} passed, ${c.failed} failed, ${c.warned} warned, ${c.skipped} skipped (total ${c.total})`
      );
    }
    lines.push(
      `  OVERALL: ${counts.passed} passed, ${counts.failed} failed, ${counts.warned} warned, ${counts.skipped} skipped (total ${counts.total})`
    );
    return lines.join("\n");
  }

  toJSON() {
    return {
      summary: this.getSummary(),
      results: this.results,
    };
  }
}

export async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export const PRODUCTION_ORIGIN = "https://shopdivinitycosmetics.co.za";

export function normalizeCanonicalUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  try {
    const parsed = new URL(rawUrl, PRODUCTION_ORIGIN);
    const pathname = parsed.pathname === "/" ? "/" : parsed.pathname.replace(/\/+$/, "");
    return `${parsed.origin}${pathname}`;
  } catch {
    return rawUrl.trim();
  }
}

export function resolveLocalUrl(rawUrl, localBaseUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  if (rawUrl.startsWith("/")) {
    return `${localBaseUrl.replace(/\/+$/, "")}${rawUrl}`;
  }
  try {
    const parsed = new URL(rawUrl);
    if (
      parsed.origin === PRODUCTION_ORIGIN ||
      parsed.hostname === "shopdivinitycosmetics.co.za" ||
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1"
    ) {
      return `${localBaseUrl.replace(/\/+$/, "")}${parsed.pathname}${parsed.search}`;
    }
    return rawUrl;
  } catch {
    return rawUrl;
  }
}
