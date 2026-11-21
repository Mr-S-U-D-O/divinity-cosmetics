/**
 * Tier 1 — Technical SEO, Indexing, Metadata, Headings, Image Alts & JSON-LD Validation.
 * Exports modular pure validator functions for --self-test as well as runTier1Static / runTier1Live.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  PRODUCTION_ORIGIN,
  fetchWithTimeout,
  normalizeCanonicalUrl,
  resolveLocalUrl,
} from "./lib/assertions.mjs";
import {
  flattenJsonLdNodes,
  isRobotsPathAllowed,
  nodeHasType,
  parseHtml,
  parseJsonLdScripts,
  parseRobotsTxt,
  parseSitemapXml,
} from "./lib/parsers.mjs";

export const PUBLIC_ROUTES = [
  "/",
  "/shop",
  "/products/marula-baobab-body-lotion",
  "/about",
  "/rituals",
  "/faq",
  "/reseller",
  "/shipping",
  "/contact",
  "/privacy",
];

export const PRIVATE_ROUTES = [
  "/checkout",
  "/checkout/success",
  "/checkout/verify",
  "/order-status",
  "/account",
  "/reseller/apply",
  "/sign-in",
  "/sign-up",
];

export const API_PROBES = [
  "/api/shipping/label/TEST-ORDER",
  "/api/paystack/initialize",
];

const FILENAME_ALT_RE = /^[\w./-]+\.(jpe?g|png|webp|gif|svg|avif)$/i;

function deepContainsForbiddenKey(obj, forbiddenKeys) {
  const found = [];
  function walk(val, keyPath) {
    if (!val || typeof val !== "object") return;
    if (Array.isArray(val)) {
      val.forEach((item, idx) => walk(item, `${keyPath}[${idx}]`));
      return;
    }
    for (const [k, v] of Object.entries(val)) {
      if (forbiddenKeys.includes(k)) {
        found.push(`${keyPath ? `${keyPath}.` : ""}${k}`);
      }
      walk(v, `${keyPath ? `${keyPath}.` : ""}${k}`);
    }
  }
  walk(obj, "");
  return found;
}

/**
 * Pure validator for a single rendered public route HTML document.
 * Returns { title, description, issues[] } and records checks if collector provided.
 */
export function validatePublicRouteHtml(route, html, collector, expectedOrigin = PRODUCTION_ORIGIN) {
  const doc = parseHtml(html);
  const tier = "Tier 1";
  const prefix = `T1.PUB[${route}]`;

  // 1. Domain leakage check
  const hasLocalhostLeak = /https?:\/\/localhost:3000|localhost:3000/i.test(html);
  collector?.assert(
    `${prefix}.NO_LOCALHOST`,
    tier,
    `${route}: Zero localhost:3000 leakage in rendered HTML`,
    !hasLocalhostLeak,
    "Zero localhost:3000 references",
    "Found localhost:3000 reference in rendered HTML"
  );

  // 2. Title checks
  const title = doc.title || "";
  const brandMatches = title.match(/Divinity Cosmetics/gi) || [];
  const titleOk = title.length > 0 && title.length <= 65 && brandMatches.length <= 1;
  collector?.assert(
    `${prefix}.TITLE`,
    tier,
    `${route}: Title present, <= 65 chars, no double brand`,
    titleOk,
    `len=${title.length}: "${title}"`,
    `Invalid title (len=${title.length}, brandCount=${brandMatches.length}): "${title}"`
  );

  // 3. Meta description checks
  const description = (doc.metaByName.description || "").trim();
  const descOk = description.length >= 120 && description.length <= 165;
  collector?.assert(
    `${prefix}.DESCRIPTION`,
    tier,
    `${route}: Meta description 120–165 chars`,
    descOk,
    `len=${description.length}`,
    `Invalid meta description length=${description.length} (expected 120–165): "${description}"`
  );

  // 4. Canonical & hreflang="en-ZA"
  const expectedCanonical = normalizeCanonicalUrl(`${expectedOrigin}${route}`);
  const canonicalHref = doc.canonicalLinks[0]?.href || "";
  const normalizedCanonical = normalizeCanonicalUrl(canonicalHref);
  const canonicalOk =
    doc.canonicalLinks.length === 1 &&
    canonicalHref.startsWith("https://") &&
    normalizedCanonical === expectedCanonical;
  collector?.assert(
    `${prefix}.CANONICAL`,
    tier,
    `${route}: Self-referencing canonical (${expectedCanonical})`,
    canonicalOk,
    `canonical="${canonicalHref}"`,
    `Expected single self-canonical "${expectedCanonical}", got count=${doc.canonicalLinks.length}, href="${canonicalHref}"`
  );

  const enZaAlt = doc.alternateLinks.find(
    (l) => (l.hreflang || "").toLowerCase() === "en-za"
  );
  const hreflangOk =
    Boolean(enZaAlt?.href) &&
    enZaAlt.href.startsWith("https://") &&
    normalizeCanonicalUrl(enZaAlt.href) === expectedCanonical;
  collector?.assert(
    `${prefix}.HREFLANG`,
    tier,
    `${route}: Alternate hreflang="en-ZA" matches canonical`,
    hreflangOk,
    `hreflang="en-ZA" href="${enZaAlt?.href || ""}"`,
    `Missing or mismatched hreflang="en-ZA" (got "${enZaAlt?.href || "none"}")`
  );

  // 5. Open Graph
  const ogTitle = (doc.metaByProperty["og:title"] || "").trim();
  const ogDesc = (doc.metaByProperty["og:description"] || "").trim();
  const ogUrl = (doc.metaByProperty["og:url"] || "").trim();
  const ogSite = (doc.metaByProperty["og:site_name"] || "").trim();
  const ogLocale = (doc.metaByProperty["og:locale"] || "").trim();
  const ogType = (doc.metaByProperty["og:type"] || "").trim();
  const ogImage = (doc.metaByProperty["og:image"] || "").trim();
  const ogMissing = [];
  if (!ogTitle) ogMissing.push("og:title");
  if (!ogDesc) ogMissing.push("og:description");
  if (!ogUrl || !ogUrl.startsWith("https://")) ogMissing.push("og:url(https)");
  if (!ogSite) ogMissing.push("og:site_name");
  if (ogLocale !== "en_ZA") ogMissing.push(`og:locale(${ogLocale || "missing"})`);
  if (!ogType) ogMissing.push("og:type");
  if (!ogImage || !ogImage.startsWith("https://")) ogMissing.push("og:image(https)");
  collector?.assert(
    `${prefix}.OG`,
    tier,
    `${route}: Complete Open Graph tags with absolute HTTPS image`,
    ogMissing.length === 0,
    `type=${ogType}, locale=${ogLocale}, og:image=${ogImage}`,
    `Missing/invalid Open Graph tags: ${ogMissing.join(", ")}`
  );

  // 6. Twitter Card
  const twCard = (doc.metaByName["twitter:card"] || "").trim();
  const twTitle = (doc.metaByName["twitter:title"] || "").trim();
  const twDesc = (doc.metaByName["twitter:description"] || "").trim();
  const twImage = (doc.metaByName["twitter:image"] || "").trim();
  const twMissing = [];
  if (twCard !== "summary_large_image") twMissing.push(`twitter:card(${twCard || "missing"})`);
  if (!twTitle) twMissing.push("twitter:title");
  if (!twDesc) twMissing.push("twitter:description");
  if (!twImage || !twImage.startsWith("https://")) twMissing.push("twitter:image(https)");
  collector?.assert(
    `${prefix}.TWITTER`,
    tier,
    `${route}: Complete Twitter Card (summary_large_image + absolute HTTPS image)`,
    twMissing.length === 0,
    `twitter:card=${twCard}, twitter:image=${twImage}`,
    `Missing/invalid Twitter Card tags: ${twMissing.join(", ")}`
  );

  // 7. Single visible H1 & logical heading hierarchy
  const activeHeadings = doc.headings.filter((h) => !h.ariaHidden);
  const h1s = activeHeadings.filter((h) => h.level === 1);
  const h1Ok =
    h1s.length === 1 &&
    h1s[0].text.length > 0 &&
    !h1s[0].hasImgDescendant;
  collector?.assert(
    `${prefix}.H1`,
    tier,
    `${route}: Single visible <h1> with text and zero <img> inside`,
    h1Ok,
    `h1="${h1s[0]?.text.slice(0, 70) || ""}"`,
    `h1Count=${h1s.length}, hasImg=${Boolean(h1s[0]?.hasImgDescendant)}, textLen=${h1s[0]?.text.length ?? 0}`
  );

  const skippedLevels = [];
  let prevLevel = 0;
  for (const h of activeHeadings) {
    if (prevLevel === 0 && h.level > 1) {
      skippedLevels.push(`first heading is <h${h.level}> before <h1>`);
    } else if (prevLevel > 0 && h.level > prevLevel + 1) {
      skippedLevels.push(`h${prevLevel} -> h${h.level} ("${h.text.slice(0, 40)}")`);
    }
    prevLevel = h.level;
  }
  collector?.assert(
    `${prefix}.HEADING_HIERARCHY`,
    tier,
    `${route}: Logical heading hierarchy without skipped levels`,
    skippedLevels.length === 0,
    `Headings=${activeHeadings.length}`,
    `Skipped heading levels: ${skippedLevels.join("; ")}`
  );

  // 8. Image alt attributes
  const badImages = [];
  for (const img of doc.images) {
    if (!img.hasAltAttr) {
      badImages.push(`missing alt on src="${img.src}"`);
      continue;
    }
    const trimmedAlt = img.alt.trim();
    if (trimmedAlt === "") {
      if (!img.insideAriaHidden && !img.insideTabWithAriaLabel) {
        badImages.push(`empty alt="" on non-decorative src="${img.src}"`);
      }
    } else if (FILENAME_ALT_RE.test(trimmedAlt) || trimmedAlt.length < 4) {
      badImages.push(`non-descriptive alt="${trimmedAlt}" on src="${img.src}"`);
    }
  }
  collector?.assert(
    `${prefix}.IMG_ALT`,
    tier,
    `${route}: All <img> tags have valid alt (decorative exemption only for aria-hidden/tab)`,
    badImages.length === 0,
    `Checked ${doc.images.length} images`,
    `Image alt issues (${badImages.length}): ${badImages.slice(0, 5).join("; ")}`
  );

  // 9. JSON-LD syntax, XSS escaping, @context, no aggregateRating/review, route schemas
  const parsedLd = parseJsonLdScripts(doc);
  const syntaxErrors = parsedLd
    .filter((b) => !b.valid)
    .map((b) => `block#${b.index}: ${b.error}`);
  collector?.assert(
    `${prefix}.JSONLD_SYNTAX`,
    tier,
    `${route}: All JSON-LD blocks parse cleanly without unescaped '<'`,
    parsedLd.length > 0 && syntaxErrors.length === 0,
    `blocks=${parsedLd.length}`,
    parsedLd.length === 0 ? "No JSON-LD scripts found" : syntaxErrors.join("; ")
  );

  const allNodes = parsedLd.flatMap((b) => b.nodes);
  const badContexts = parsedLd
    .filter((b) => b.valid)
    .flatMap((b) => {
      const items = Array.isArray(b.data) ? b.data : [b.data];
      return items
        .filter((it) => it && typeof it === "object" && it["@context"] !== "https://schema.org")
        .map((it) => `block#${b.index} @context="${it["@context"] || "missing"}"`);
    });

  const forbiddenKeys = [];
  for (const b of parsedLd) {
    if (b.data) {
      forbiddenKeys.push(...deepContainsForbiddenKey(b.data, ["aggregateRating", "review"]));
    }
  }

  const schemaErrors = [...badContexts];
  if (forbiddenKeys.length > 0) {
    schemaErrors.push(`forbidden properties present: ${forbiddenKeys.join(", ")}`);
  }

  // Global Organization/OnlineStore & WebSite
  const orgNode = allNodes.find(
    (n) => nodeHasType(n, "Organization") || nodeHasType(n, "OnlineStore")
  );
  if (!orgNode) {
    schemaErrors.push("missing Organization/OnlineStore schema");
  } else {
    if (!orgNode.name || !orgNode.url || !orgNode.logo) {
      schemaErrors.push("Organization missing name/url/logo");
    }
  }

  const webSiteNode = allNodes.find((n) => nodeHasType(n, "WebSite"));
  if (!webSiteNode) {
    schemaErrors.push("missing WebSite schema");
  } else if (!webSiteNode.url || !webSiteNode.potentialAction) {
    schemaErrors.push("WebSite missing url or potentialAction SearchAction");
  }

  // Route-specific schema requirements
  const checkProductNode = (p) => {
    if (!p) return "missing Product";
    if (!p.name || !p.description || !p.sku || !p.image || !p.offers) {
      return "Product missing name/description/sku/image/offers";
    }
    const offer = Array.isArray(p.offers) ? p.offers[0] : p.offers;
    if (!offer?.price || !offer?.priceCurrency || !offer?.availability) {
      return "Product.offers missing price/priceCurrency/availability";
    }
    return null;
  };

  if (route === "/" || route === "/products/marula-baobab-body-lotion") {
    const err = checkProductNode(allNodes.find((n) => nodeHasType(n, "Product")));
    if (err) schemaErrors.push(err);
    const faq = allNodes.find((n) => nodeHasType(n, "FAQPage"));
    if (!faq || !Array.isArray(faq.mainEntity) || faq.mainEntity.length === 0) {
      schemaErrors.push("missing FAQPage mainEntity");
    }
  } else if (route === "/shop") {
    if (!allNodes.some((n) => nodeHasType(n, "CollectionPage"))) {
      schemaErrors.push("missing CollectionPage");
    }
    if (!allNodes.some((n) => nodeHasType(n, "ItemList"))) {
      schemaErrors.push("missing ItemList");
    }
  } else if (route === "/about") {
    if (!allNodes.some((n) => nodeHasType(n, "AboutPage"))) {
      schemaErrors.push("missing AboutPage");
    }
    const article = allNodes.find((n) => nodeHasType(n, "Article"));
    if (!article) {
      schemaErrors.push("missing Article");
    } else if (!article.headline || !article.author || !article.mainEntityOfPage) {
      schemaErrors.push("Article missing headline/author/mainEntityOfPage");
    }
  } else if (route === "/rituals") {
    if (!allNodes.some((n) => nodeHasType(n, "ItemList"))) {
      schemaErrors.push("missing ItemList");
    }
  } else if (route === "/faq") {
    const faq = allNodes.find((n) => nodeHasType(n, "FAQPage"));
    if (!faq || !Array.isArray(faq.mainEntity) || faq.mainEntity.length === 0) {
      schemaErrors.push("missing FAQPage");
    }
  } else if (route === "/reseller") {
    const faq = allNodes.find((n) => nodeHasType(n, "FAQPage"));
    if (!faq || !Array.isArray(faq.mainEntity) || faq.mainEntity.length === 0) {
      schemaErrors.push("missing FAQPage");
    }
    const hasWholesale = allNodes.some(
      (n) => nodeHasType(n, "Offer") || nodeHasType(n, "Service")
    );
    if (!hasWholesale) {
      schemaErrors.push("missing wholesale Offer/Service schema");
    }
  } else if (route === "/shipping" || route === "/privacy") {
    if (!allNodes.some((n) => nodeHasType(n, "WebPage"))) {
      schemaErrors.push("missing WebPage");
    }
  } else if (route === "/contact") {
    if (!allNodes.some((n) => nodeHasType(n, "ContactPage"))) {
      schemaErrors.push("missing ContactPage");
    }
  }

  collector?.assert(
    `${prefix}.JSONLD_SCHEMA`,
    tier,
    `${route}: Valid Schema.org types/properties & zero aggregateRating/review`,
    schemaErrors.length === 0,
    `nodes=${allNodes.length}`,
    schemaErrors.join("; ")
  );

  return {
    doc,
    title,
    description,
    parsedLd,
    allNodes,
    ogImage,
    twImage,
    hasLocalhostLeak,
  };
}

/**
 * Pure validator for robots.txt content.
 */
export function validateRobotsTxtContent(text, collector, expectedOrigin = PRODUCTION_ORIGIN) {
  const tier = "Tier 1";
  const parsed = parseRobotsTxt(text);

  const hasLocalhost = /localhost:3000/i.test(text);
  collector?.assert(
    "T1.ROBOTS.NO_LOCALHOST",
    tier,
    "/robots.txt: Zero localhost:3000 references",
    !hasLocalhost,
    "No localhost:3000",
    "Found localhost:3000 in robots.txt"
  );

  const expectedSitemap = `${expectedOrigin}/sitemap.xml`;
  collector?.assert(
    "T1.ROBOTS.SITEMAP",
    tier,
    `/robots.txt: Declares Sitemap: ${expectedSitemap}`,
    parsed.sitemaps.includes(expectedSitemap),
    `Sitemap=${parsed.sitemaps.join(", ")}`,
    `Expected Sitemap "${expectedSitemap}", got [${parsed.sitemaps.join(", ")}]`
  );

  const disallowedTargets = [
    "/account",
    "/account/",
    "/checkout",
    "/checkout/",
    "/checkout/success",
    "/sign-in",
    "/sign-in/",
    "/sign-up",
    "/sign-up/",
    "/reseller/apply",
    "/reseller/apply/",
    "/order-status",
    "/order-status/",
    "/api/paystack/initialize",
  ];
  const allowedTargets = ["/", "/shop", "/llms.txt", "/llms-full.txt", "/pricing.md"];
  const userAgents = ["*", "GPTBot", "PerplexityBot", "ClaudeBot"];

  const disallowFailures = [];
  const allowFailures = [];
  for (const ua of userAgents) {
    for (const p of disallowedTargets) {
      if (isRobotsPathAllowed(parsed, ua, p)) {
        disallowFailures.push(`${ua} allowed ${p}`);
      }
    }
    for (const p of allowedTargets) {
      if (!isRobotsPathAllowed(parsed, ua, p)) {
        allowFailures.push(`${ua} blocked ${p}`);
      }
    }
  }

  collector?.assert(
    "T1.ROBOTS.DISALLOWS",
    tier,
    "/robots.txt: Disallows private/auth/API routes (exact + trailing paths)",
    disallowFailures.length === 0,
    `Verified ${disallowedTargets.length} paths × ${userAgents.length} UAs`,
    `Leaked private paths: ${disallowFailures.slice(0, 8).join("; ")}`
  );

  collector?.assert(
    "T1.ROBOTS.ALLOWS",
    tier,
    "/robots.txt: Allows /, /shop, /llms.txt, /llms-full.txt, /pricing.md for * & AI bots",
    allowFailures.length === 0,
    `Verified ${allowedTargets.length} paths × ${userAgents.length} UAs`,
    `Blocked public/AI paths: ${allowFailures.join("; ")}`
  );

  return parsed;
}

/**
 * Pure validator for sitemap.xml content.
 */
export function validateSitemapXmlContent(xml, collector, expectedOrigin = PRODUCTION_ORIGIN) {
  const tier = "Tier 1";
  const parsed = parseSitemapXml(xml);

  collector?.assert(
    "T1.SITEMAP.XML_VALID",
    tier,
    "/sitemap.xml: Well-formed XML with <urlset> entries",
    parsed.valid,
    `urls=${parsed.urls.length}`,
    parsed.error || "Invalid sitemap XML"
  );

  const locs = parsed.urls.map((u) => u.loc);
  const nonProd = locs.filter((l) => !l.startsWith(expectedOrigin));
  collector?.assert(
    "T1.SITEMAP.ORIGIN",
    tier,
    `/sitemap.xml: All URLs use ${expectedOrigin} (zero localhost:3000)`,
    locs.length > 0 && nonProd.length === 0 && !/localhost:3000/i.test(xml),
    `All ${locs.length} URLs match ${expectedOrigin}`,
    `Non-production URLs: ${nonProd.join(", ")}`
  );

  const normalizedLocs = new Set(locs.map((l) => normalizeCanonicalUrl(l)));
  const expectedPublic = PUBLIC_ROUTES.map((r) =>
    normalizeCanonicalUrl(`${expectedOrigin}${r}`)
  );
  const missingPublic = expectedPublic.filter((u) => !normalizedLocs.has(u));
  collector?.assert(
    "T1.SITEMAP.PUBLIC_ROUTES",
    tier,
    "/sitemap.xml: Exposes all 9 static public routes + active product PDP",
    missingPublic.length === 0,
    `All ${expectedPublic.length} expected public routes present`,
    `Missing routes: ${missingPublic.join(", ")}`
  );

  const leakedPrivate = PRIVATE_ROUTES.filter((r) =>
    locs.some((l) => {
      try {
        const pathname = new URL(l).pathname;
        return pathname === r || pathname.startsWith(`${r}/`);
      } catch {
        return false;
      }
    })
  );
  collector?.assert(
    "T1.SITEMAP.NO_PRIVATE",
    tier,
    "/sitemap.xml: Zero private/auth/checkout routes exposed",
    leakedPrivate.length === 0,
    "Zero private routes in sitemap",
    `Private routes found in sitemap: ${leakedPrivate.join(", ")}`
  );

  return parsed;
}

export async function runTier1Static(repoRoot, collector) {
  const tscBin = path.join(repoRoot, "node_modules", "typescript", "bin", "tsc");
  if (!fs.existsSync(tscBin)) {
    collector.fail(
      "T1.BUILD.TSC",
      "Tier 1",
      "TypeScript compiler check (tsc --noEmit)",
      `Missing ${tscBin}`
    );
    return;
  }

  const res = spawnSync(process.execPath, [tscBin, "--noEmit"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  collector.assert(
    "T1.BUILD.TSC",
    "Tier 1",
    "TypeScript compiler check (tsc --noEmit)",
    res.status === 0,
    "tsc --noEmit exited 0",
    `tsc --noEmit exited ${res.status}: ${(res.stdout || res.stderr || "").trim().slice(0, 400)}`
  );
}

export async function runTier1Live(baseUrl, collector) {
  const tier = "Tier 1";
  const titles = new Map();
  const descriptions = new Map();
  const routeResults = new Map();

  // Public routes
  for (const route of PUBLIC_ROUTES) {
    const url = `${baseUrl}${route}`;
    let res;
    let html = "";
    try {
      res = await fetchWithTimeout(url, { redirect: "manual" });
      html = await res.text();
    } catch (err) {
      collector.fail(`T1.PUB[${route}].HTTP`, tier, `${route}: HTTP 200`, err.message);
      continue;
    }

    collector.assert(
      `T1.PUB[${route}].HTTP`,
      tier,
      `${route}: HTTP 200`,
      res.status === 200,
      "HTTP 200",
      `Expected 200, got HTTP ${res.status}`
    );

    if (res.status !== 200) continue;

    const validated = validatePublicRouteHtml(route, html, collector, PRODUCTION_ORIGIN);
    routeResults.set(route, validated);

    if (validated.title) {
      if (!titles.has(validated.title)) titles.set(validated.title, []);
      titles.get(validated.title).push(route);
    }
    if (validated.description) {
      if (!descriptions.has(validated.description)) descriptions.set(validated.description, []);
      descriptions.get(validated.description).push(route);
    }
  }

  // Uniqueness checks across all 10 routes
  const dupTitles = [...titles.entries()].filter(([, routes]) => routes.length > 1);
  collector.assert(
    "T1.PUB.UNIQUE_TITLES",
    tier,
    "All 10 public routes have unique <title> tags",
    dupTitles.length === 0 && titles.size === PUBLIC_ROUTES.length,
    `${titles.size}/${PUBLIC_ROUTES.length} unique titles`,
    `Duplicate or missing titles: ${dupTitles.map(([t, r]) => `${r.join("+")}="${t}"`).join("; ")}`
  );

  const dupDescs = [...descriptions.entries()].filter(([, routes]) => routes.length > 1);
  collector.assert(
    "T1.PUB.UNIQUE_DESCRIPTIONS",
    tier,
    "All 10 public routes have unique <meta name=\"description\"> tags",
    dupDescs.length === 0 && descriptions.size === PUBLIC_ROUTES.length,
    `${descriptions.size}/${PUBLIC_ROUTES.length} unique descriptions`,
    `Duplicate or missing descriptions: ${dupDescs.map(([, r]) => r.join("+")).join("; ")}`
  );

  // /robots.txt
  try {
    const robotsRes = await fetchWithTimeout(`${baseUrl}/robots.txt`);
    const robotsTxt = await robotsRes.text();
    collector.assert(
      "T1.ROBOTS.HTTP",
      tier,
      "/robots.txt: HTTP 200",
      robotsRes.status === 200,
      "HTTP 200",
      `HTTP ${robotsRes.status}`
    );
    if (robotsRes.status === 200) {
      validateRobotsTxtContent(robotsTxt, collector, PRODUCTION_ORIGIN);
    }
  } catch (err) {
    collector.fail("T1.ROBOTS.HTTP", tier, "/robots.txt: HTTP 200", err.message);
  }

  // /sitemap.xml
  try {
    const smRes = await fetchWithTimeout(`${baseUrl}/sitemap.xml`);
    const smXml = await smRes.text();
    collector.assert(
      "T1.SITEMAP.HTTP",
      tier,
      "/sitemap.xml: HTTP 200",
      smRes.status === 200,
      "HTTP 200",
      `HTTP ${smRes.status}`
    );
    if (smRes.status === 200) {
      validateSitemapXmlContent(smXml, collector, PRODUCTION_ORIGIN);
    }
  } catch (err) {
    collector.fail("T1.SITEMAP.HTTP", tier, "/sitemap.xml: HTTP 200", err.message);
  }

  // Private routes & API probes (redirect: "manual")
  for (const route of PRIVATE_ROUTES) {
    const url = `${baseUrl}${route}`;
    try {
      const res = await fetchWithTimeout(url, { redirect: "manual" });
      const xRobots = (res.headers.get("x-robots-tag") || "").toLowerCase();
      collector.assert(
        `T1.PRIV[${route}].X_ROBOTS`,
        tier,
        `${route}: X-Robots-Tag header contains noindex (HTTP ${res.status})`,
        xRobots.includes("noindex"),
        `X-Robots-Tag="${res.headers.get("x-robots-tag")}" (status ${res.status})`,
        `Missing noindex in X-Robots-Tag (got "${res.headers.get("x-robots-tag") || "none"}", status ${res.status})`
      );

      let targetRes = res;
      let html = "";
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location") || "";
        const localTarget = loc.startsWith("/")
          ? `${baseUrl}${loc}`
          : resolveLocalUrl(loc, baseUrl);
        if (localTarget.startsWith(baseUrl)) {
          const followed = await fetchWithTimeout(localTarget, { redirect: "manual" });
          if (followed.status === 200) {
            targetRes = followed;
            html = await followed.text();
          }
        }
      } else if (res.status === 200) {
        html = await res.text();
      }

      if (html && targetRes.status === 200) {
        const doc = parseHtml(html);
        const metaRobots = (doc.metaByName.robots || "").toLowerCase();
        collector.assert(
          `T1.PRIV[${route}].META_ROBOTS`,
          tier,
          `${route}: <meta name="robots"> contains noindex`,
          metaRobots.includes("noindex"),
          `robots="${doc.metaByName.robots}"`,
          `Missing noindex in <meta name="robots"> (got "${doc.metaByName.robots || "none"}")`
        );

        const canon = doc.canonicalLinks[0]?.href || "";
        const normCanon = normalizeCanonicalUrl(canon);
        const leaksHomeCanonical =
          canon === "/" ||
          normCanon === normalizeCanonicalUrl(PRODUCTION_ORIGIN) ||
          normCanon === normalizeCanonicalUrl(`${PRODUCTION_ORIGIN}/`);
        collector.assert(
          `T1.PRIV[${route}].NO_HOME_CANONICAL`,
          tier,
          `${route}: Canonical does NOT leak homepage "/"`,
          !leaksHomeCanonical,
          canon ? `canonical="${canon}"` : "No canonical emitted",
          `Private route leaks homepage canonical="${canon}"`
        );

        if (route === "/checkout/verify") {
          const h1s = doc.headings.filter((h) => h.level === 1 && !h.ariaHidden);
          collector.assert(
            "T1.PRIV[/checkout/verify].H1",
            tier,
            "/checkout/verify: Renders an <h1>",
            h1s.length >= 1,
            `h1="${h1s[0]?.text || ""}"`,
            "Missing <h1> on /checkout/verify"
          );
        }
      }
    } catch (err) {
      collector.fail(`T1.PRIV[${route}].FETCH`, tier, `${route}: Private route check`, err.message);
    }
  }

  for (const apiRoute of API_PROBES) {
    try {
      const res = await fetchWithTimeout(`${baseUrl}${apiRoute}`, { redirect: "manual" });
      const xRobots = (res.headers.get("x-robots-tag") || "").toLowerCase();
      collector.assert(
        `T1.API[${apiRoute}].X_ROBOTS`,
        tier,
        `${apiRoute}: X-Robots-Tag contains noindex (HTTP ${res.status})`,
        xRobots.includes("noindex"),
        `X-Robots-Tag="${res.headers.get("x-robots-tag")}" (HTTP ${res.status})`,
        `Missing noindex in X-Robots-Tag (got "${res.headers.get("x-robots-tag") || "none"}", HTTP ${res.status})`
      );
    } catch (err) {
      collector.fail(`T1.API[${apiRoute}].X_ROBOTS`, tier, `${apiRoute}: API header check`, err.message);
    }
  }

  return routeResults;
}
