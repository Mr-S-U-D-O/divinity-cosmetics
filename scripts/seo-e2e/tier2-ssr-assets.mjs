/**
 * Tier 2 — SSR HTML Crawlability, SearchAction (?q=), 404 Handling,
 * Binary Image Dimensions, and Cross-File Fact Consistency.
 */

import fs from "node:fs";
import path from "node:path";
import {
  PRODUCTION_ORIGIN,
  fetchWithTimeout,
  matchTextResilient,
  resolveLocalUrl,
} from "./lib/assertions.mjs";
import {
  nodeHasType,
  parseHtml,
  parseImageDimensions,
  parseJsonLdScripts,
} from "./lib/parsers.mjs";

const FAQ_MIN_COUNTS = {
  "/": 4,
  "/faq": 10,
  "/reseller": 6,
  "/products/marula-baobab-body-lotion": 3,
};

/**
 * Pure validator: verifies every FAQPage Question and Answer in JSON-LD
 * appears in non-script SSR visibleText (R3-resilient substring or >=85% token overlap).
 */
export function validateSsrFaqVisibility(route, html, collector, minCount = 1) {
  const tier = "Tier 2";
  const prefix = `T2.SSR_FAQ[${route}]`;
  const doc = parseHtml(html);
  const parsedLd = parseJsonLdScripts(doc);
  const allNodes = parsedLd.flatMap((b) => b.nodes);
  const faqNodes = allNodes.filter((n) => nodeHasType(n, "FAQPage"));

  const items = [];
  for (const faq of faqNodes) {
    if (Array.isArray(faq.mainEntity)) {
      for (const q of faq.mainEntity) {
        if (q?.name && q?.acceptedAnswer?.text) {
          items.push({
            question: String(q.name),
            answer: String(q.acceptedAnswer.text),
          });
        }
      }
    }
  }

  collector?.assert(
    `${prefix}.COUNT`,
    tier,
    `${route}: FAQPage JSON-LD contains >= ${minCount} Q&As`,
    items.length >= minCount,
    `count=${items.length}`,
    `Expected >= ${minCount} FAQ items, found ${items.length}`
  );

  const missingQuestions = [];
  const missingAnswers = [];
  items.forEach((item, idx) => {
    const qMatch = matchTextResilient(item.question, doc.visibleText, 0.85);
    if (!qMatch.matched) {
      missingQuestions.push(
        `Q#${idx + 1} (${Math.round(qMatch.ratio * 100)}%): "${item.question.slice(0, 50)}"`
      );
    }
    const aMatch = matchTextResilient(item.answer, doc.visibleText, 0.85);
    if (!aMatch.matched) {
      missingAnswers.push(
        `A#${idx + 1} (${Math.round(aMatch.ratio * 100)}%): "${item.answer.slice(0, 60)}"`
      );
    }
  });

  collector?.assert(
    `${prefix}.QUESTIONS_VISIBLE`,
    tier,
    `${route}: All ${items.length} FAQ questions visible in raw SSR DOM`,
    items.length > 0 && missingQuestions.length === 0,
    `${items.length}/${items.length} questions matched`,
    `Hidden FAQ questions (${missingQuestions.length}/${items.length}): ${missingQuestions.slice(0, 4).join("; ")}`
  );

  collector?.assert(
    `${prefix}.ANSWERS_VISIBLE`,
    tier,
    `${route}: All ${items.length} FAQ answers visible in raw SSR DOM (no JS)`,
    items.length > 0 && missingAnswers.length === 0,
    `${items.length}/${items.length} answers matched`,
    `Hidden FAQ answers (${missingAnswers.length}/${items.length}): ${missingAnswers.slice(0, 4).join("; ")}`
  );

  return { doc, items, missingQuestions, missingAnswers };
}

/**
 * Pure validator: verifies PDP Product.description matches SSR visibleText
 * and >= 3 detail accordion sections / invariant facts appear in raw SSR DOM.
 */
export function validatePdpSsrVisibility(html, collector) {
  const tier = "Tier 2";
  const doc = parseHtml(html);
  const parsedLd = parseJsonLdScripts(doc);
  const allNodes = parsedLd.flatMap((b) => b.nodes);
  const product = allNodes.find((n) => nodeHasType(n, "Product"));

  const desc = String(product?.description || "").trim();
  const descMatch = desc ? matchTextResilient(desc, doc.visibleText, 0.85) : { matched: false, ratio: 0 };
  collector?.assert(
    "T2.PDP.DESCRIPTION_VISIBLE",
    tier,
    "/products/marula-baobab-body-lotion: Product.description visible in raw SSR DOM",
    Boolean(desc) && descMatch.matched,
    `ratio=${Math.round(descMatch.ratio * 100)}% (${descMatch.method})`,
    desc
      ? `Product.description missing from raw SSR visible text (${Math.round(descMatch.ratio * 100)}% match)`
      : "Product.description missing from JSON-LD"
  );

  // Check >= 3 detail accordion triggers/panels in AddToCart raw SSR DOM
  const accordionMatches =
    html.match(/aria-controls=["'][^"']*(?:ingredients|ritual|delivery|detail|accordion)[^"']*["']|data-pdp-accordion/gi) ||
    [];
  const detailHeadingHits = [
    /Key Botanicals/i.test(doc.visibleText),
    /90-Day/i.test(doc.visibleText),
    /Shipping\s*(&|and)\s*Checkout/i.test(doc.visibleText),
  ].filter(Boolean).length;

  const invariantFacts = {
    marula: /\bmarula\b/i.test(doc.visibleText),
    baobab: /\bbaobab\b/i.test(doc.visibleText),
    courierShipping: /\b(?:R\s?142|Courier Guy)\b/i.test(doc.visibleText),
    volume400: /\b400\s?ml\b/i.test(doc.visibleText),
  };
  const missingFacts = Object.entries(invariantFacts)
    .filter(([, ok]) => !ok)
    .map(([k]) => k);

  collector?.assert(
    "T2.PDP.ACCORDION_SSR",
    tier,
    "/products/marula-baobab-body-lotion: >= 3 detail panels + invariant facts in raw SSR DOM",
    (accordionMatches.length >= 3 || detailHeadingHits >= 3) && missingFacts.length === 0,
    `sections=${Math.max(accordionMatches.length, detailHeadingHits)}, facts=Marula,Baobab,CourierGuy/R142,400ml`,
    `Detail sections=${Math.max(accordionMatches.length, detailHeadingHits)} (need >=3), missing facts=[${missingFacts.join(", ")}]`
  );

  return { descMatch, missingFacts };
}

/**
 * Pure validator for image binary dimensions against expected dimensions.
 */
export function validateImageBufferDimensions(label, buffer, expectedWidth, expectedHeight, collector, id) {
  const parsed = parseImageDimensions(buffer);
  const ok =
    !parsed.error &&
    parsed.width === expectedWidth &&
    parsed.height === expectedHeight;
  collector?.assert(
    id,
    "Tier 2",
    `${label}: Binary dimensions match ${expectedWidth}x${expectedHeight}`,
    ok,
    `${parsed.format.toUpperCase()} ${parsed.width}x${parsed.height}`,
    parsed.error
      ? `Image parse error: ${parsed.error}`
      : `Expected ${expectedWidth}x${expectedHeight}, got ${parsed.format.toUpperCase()} ${parsed.width}x${parsed.height}`
  );
  return parsed;
}

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

export async function runTier2Static(repoRoot, collector) {
  const tier = "Tier 2";

  // 1. Logo dimensions (306x174) & schema.ts parity
  const logoPath = path.join(repoRoot, "public", "images", "divinity-logo.png");
  if (fs.existsSync(logoPath)) {
    const logoBuf = fs.readFileSync(logoPath);
    validateImageBufferDimensions(
      "public/images/divinity-logo.png",
      logoBuf,
      306,
      174,
      collector,
      "T2.ASSET.LOGO_BINARY"
    );
  } else {
    collector.fail("T2.ASSET.LOGO_BINARY", tier, "public/images/divinity-logo.png exists", "File not found");
  }

  const schemaSrc = readIfExists(path.join(repoRoot, "src", "lib", "seo", "schema.ts"));
  const hasLogo306x174 =
    /width:\s*306\b/.test(schemaSrc) && /height:\s*174\b/.test(schemaSrc);
  collector.assert(
    "T2.ASSET.SCHEMA_LOGO_DIMS",
    tier,
    "src/lib/seo/schema.ts declares Organization.logo width=306, height=174",
    hasLogo306x174,
    "width: 306, height: 174",
    "schema.ts does not declare width: 306 and height: 174 for Organization.logo"
  );

  // 2. Shop ?q= URL parameter wiring check
  const shopClientSrc = readIfExists(
    path.join(repoRoot, "src", "app", "(storefront)", "shop", "ShopClient.tsx")
  );
  const shopPageSrc = readIfExists(
    path.join(repoRoot, "src", "app", "(storefront)", "shop", "page.tsx")
  );
  const readsSearchParams =
    /useSearchParams\s*\(/.test(shopClientSrc) ||
    /searchParams/.test(shopPageSrc);
  collector.assert(
    "T2.SHOP.SEARCH_PARAM_WIRING",
    tier,
    "Shop page / ShopClient reads ?q= via useSearchParams or searchParams",
    readsSearchParams,
    "URL query param wired",
    "ShopClient/shop/page.tsx ignores ?q= URL search parameter"
  );

  // 3. Cross-file SKU consistency (DIV-MBL-400)
  const siteSrc = readIfExists(path.join(repoRoot, "src", "lib", "config", "site.ts"));
  const seedSrc = readIfExists(path.join(repoRoot, "prisma", "seed.ts"));
  const pricingMd = readIfExists(path.join(repoRoot, "public", "pricing.md"));
  const llmsTxt = readIfExists(path.join(repoRoot, "public", "llms.txt"));
  const llmsFullTxt = readIfExists(path.join(repoRoot, "public", "llms-full.txt"));

  const skuMissing = [];
  if (!siteSrc.includes("DIV-MBL-400")) skuMissing.push("src/lib/config/site.ts");
  if (!seedSrc.includes("DIV-MBL-400")) skuMissing.push("prisma/seed.ts");
  if (!pricingMd.includes("DIV-MBL-400")) skuMissing.push("public/pricing.md");
  if (pricingMd.includes("DIV-MB-BL-400") || llmsTxt.includes("DIV-MB-BL-400") || llmsFullTxt.includes("DIV-MB-BL-400")) {
    skuMissing.push("stale DIV-MB-BL-400 present");
  }
  collector.assert(
    "T2.FACTS.SKU_CONSISTENCY",
    tier,
    "SKU DIV-MBL-400 consistent across site.ts, seed.ts, pricing.md (zero DIV-MB-BL-400)",
    skuMissing.length === 0,
    "DIV-MBL-400 verified across files",
    `SKU mismatch: ${skuMissing.join(", ")}`
  );

  // 4. Formulation, pricing & live Courier Guy shipping constants (10% Marula & 10% Baobab, 400ml, R400, R142, no stale R500 free-shipping promise)
  const shippingPageSrc = readIfExists(
    path.join(repoRoot, "src", "app", "(storefront)", "shipping", "page.tsx")
  );
  const faqPageSrc = readIfExists(
    path.join(repoRoot, "src", "app", "(storefront)", "faq", "page.tsx")
  );
  const headerSrc = readIfExists(
    path.join(repoRoot, "src", "components", "layout", "Header.tsx")
  );

  const factIssues = [];
  for (const [label, txt] of [
    ["public/llms.txt", llmsTxt],
    ["public/llms-full.txt", llmsFullTxt],
    ["public/pricing.md", pricingMd],
  ]) {
    if (!/400\s?ml/i.test(txt)) factIssues.push(`${label} missing 400ml`);
    if (!/R400/i.test(txt)) factIssues.push(`${label} missing R400`);
    if (!/10%/.test(txt)) factIssues.push(`${label} missing 10% concentration`);
    if (/orders?\s+(?:over|of)\s+R500|free\s+(?:nationwide\s+)?(?:courier\s+)?(?:delivery|shipping)\s+(?:over|on\s+orders)/i.test(txt)) {
      factIssues.push(`${label} still has stale free-over-R500 shipping claim`);
    }
  }
  if (!/R142/.test(llmsTxt) || !/R142/.test(pricingMd)) {
    factIssues.push("llms.txt/pricing.md missing R142 live Courier Guy rate");
  }
  if (!/R142/.test(shippingPageSrc) || /over R500/i.test(shippingPageSrc)) {
    factIssues.push("shipping/page.tsx missing R142 or still has stale R500 waiver");
  }
  if (/over R500/i.test(faqPageSrc) || /over R500/i.test(headerSrc)) {
    factIssues.push("faq/page.tsx or Header.tsx still has stale R500 free shipping text");
  }
  collector.assert(
    "T2.FACTS.PRICING_SHIPPING_ACTIVES",
    tier,
    "10% Marula/Baobab, 400ml, R400, live Courier Guy (R142) consistent across site & AI files",
    factIssues.length === 0,
    "All formulation, pricing, and live shipping facts consistent",
    `Fact inconsistencies: ${factIssues.join("; ")}`
  );

  // 5. Contact & WhatsApp consistency (+27 66 485 9011 / 27664859011, support@shopdivinitycosmetics.co.za)
  const footerSrc = readIfExists(
    path.join(repoRoot, "src", "components", "layout", "Footer.tsx")
  );
  const checkoutSuccessSrc = readIfExists(
    path.join(repoRoot, "src", "app", "(storefront)", "checkout", "success", "page.tsx")
  );
  const resellerFormSrc = readIfExists(
    path.join(repoRoot, "src", "components", "reseller", "ResellerForm.tsx")
  );
  const contactPageSrc = readIfExists(
    path.join(repoRoot, "src", "app", "(storefront)", "contact", "page.tsx")
  );

  const contactIssues = [];
  if (!siteSrc.includes("+27 66 485 9011")) contactIssues.push("site.ts missing +27 66 485 9011");
  if (!siteSrc.includes("support@shopdivinitycosmetics.co.za")) {
    contactIssues.push("site.ts missing support@shopdivinitycosmetics.co.za");
  }
  if (/27821234567/.test(checkoutSuccessSrc) || /27821234567/.test(contactPageSrc)) {
    contactIssues.push("hardcoded dummy WhatsApp 27821234567 found");
  }
  if (/aria-label=["']WhatsApp Concierge["']/.test(footerSrc) && /href=["']\/checkout["']/.test(footerSrc)) {
    contactIssues.push("Footer WhatsApp Concierge button links to /checkout");
  }
  if (/\+1\s*\(555\)/.test(resellerFormSrc)) {
    contactIssues.push("ResellerForm.tsx uses US +1 (555) placeholder");
  }
  collector.assert(
    "T2.FACTS.CONTACT_WHATSAPP",
    tier,
    "WhatsApp (+27 66 485 9011) & support email consistent (no 27821234567, Footer /checkout, or +1 555)",
    contactIssues.length === 0,
    "Contact channels verified",
    `Contact inconsistencies: ${contactIssues.join("; ")}`
  );

  // 6. Unverified / conflicting reseller claims guard
  const resellerClientSrc = readIfExists(
    path.join(repoRoot, "src", "app", "(storefront)", "reseller", "ResellerClient.tsx")
  );
  const bannedClaims = [
    { label: "within 14 days", re: /within 14 days/i },
    { label: "under 14 days", re: /under 14 days/i },
    { label: "78% repurchase claim", re: /\b78%\b/i },
    { label: "Cape Provenance", re: /Cape Provenance/i },
    { label: "Johannesburg fulfillment", re: /Johannesburg fulfillment/i },
  ];
  const foundBanned = bannedClaims
    .filter((b) => b.re.test(resellerClientSrc))
    .map((b) => b.label);
  collector.assert(
    "T2.FACTS.NO_UNVERIFIED_RESELLER_CLAIMS",
    tier,
    "ResellerClient.tsx contains zero unverified/conflicting claims",
    foundBanned.length === 0,
    "Zero banned unverified claims",
    `Found unverified/conflicting claims in ResellerClient.tsx: ${foundBanned.join(", ")}`
  );
}

export async function runTier2Live(baseUrl, collector) {
  const tier = "Tier 2";
  const checkedImageUrls = new Map();

  // 1. Raw SSR FAQ visibility on /, /faq, /reseller, /products/marula-baobab-body-lotion
  for (const [route, minCount] of Object.entries(FAQ_MIN_COUNTS)) {
    try {
      const res = await fetchWithTimeout(`${baseUrl}${route}`);
      const html = await res.text();
      if (res.status !== 200) {
        collector.fail(
          `T2.SSR_FAQ[${route}].HTTP`,
          tier,
          `${route}: HTTP 200 for SSR FAQ check`,
          `HTTP ${res.status}`
        );
        continue;
      }
      validateSsrFaqVisibility(route, html, collector, minCount);
      if (route === "/products/marula-baobab-body-lotion") {
        validatePdpSsrVisibility(html, collector);
      }
    } catch (err) {
      collector.fail(`T2.SSR_FAQ[${route}].FETCH`, tier, `${route}: Fetch for SSR check`, err.message);
    }
  }

  // 2. SearchAction template & /shop?q= handling
  try {
    const homeRes = await fetchWithTimeout(`${baseUrl}/`);
    const homeHtml = await homeRes.text();
    const homeNodes = parseJsonLdScripts(homeHtml).flatMap((b) => b.nodes);
    const webSite = homeNodes.find((n) => nodeHasType(n, "WebSite"));
    const urlTemplate = webSite?.potentialAction?.target?.urlTemplate || "";
    const expectedTemplate = `${PRODUCTION_ORIGIN}/shop?q={search_term_string}`;
    collector.assert(
      "T2.SHOP.SEARCH_ACTION_URL",
      tier,
      `WebSite SearchAction urlTemplate === ${expectedTemplate}`,
      urlTemplate === expectedTemplate,
      `urlTemplate="${urlTemplate}"`,
      `Expected "${expectedTemplate}", got "${urlTemplate}"`
    );
  } catch (err) {
    collector.fail("T2.SHOP.SEARCH_ACTION_URL", tier, "WebSite SearchAction check", err.message);
  }

  try {
    const qHitRes = await fetchWithTimeout(`${baseUrl}/shop?q=marula`);
    const qHitHtml = await qHitRes.text();
    const hasFlagshipLink = qHitHtml.includes("/products/marula-baobab-body-lotion");
    collector.assert(
      "T2.SHOP.QUERY_MATCH",
      tier,
      "GET /shop?q=marula returns 200 with flagship product link",
      qHitRes.status === 200 && hasFlagshipLink,
      "HTTP 200 with /products/marula-baobab-body-lotion",
      `status=${qHitRes.status}, hasFlagshipLink=${hasFlagshipLink}`
    );

    const qMissRes = await fetchWithTimeout(`${baseUrl}/shop?q=nonexistent-xyz-999`);
    await qMissRes.text();
    collector.assert(
      "T2.SHOP.QUERY_NO_MATCH",
      tier,
      "GET /shop?q=nonexistent-xyz-999 returns 200 cleanly",
      qMissRes.status === 200,
      "HTTP 200",
      `Expected HTTP 200, got ${qMissRes.status}`
    );
  } catch (err) {
    collector.fail("T2.SHOP.QUERY_TEST", tier, "/shop?q= HTTP check", err.message);
  }

  // 3. 404 & noindex on nonexistent product slug
  try {
    const notFoundRes = await fetchWithTimeout(`${baseUrl}/products/nonexistent-product-slug`, {
      redirect: "manual",
    });
    const notFoundHtml = await notFoundRes.text();
    const notFoundDoc = parseHtml(notFoundHtml);
    const xRobots = (notFoundRes.headers.get("x-robots-tag") || "").toLowerCase();
    const metaRobots = (notFoundDoc.metaByName.robots || "").toLowerCase();
    const hasNoindex = xRobots.includes("noindex") || metaRobots.includes("noindex");
    collector.assert(
      "T2.PDP.NOT_FOUND_404",
      tier,
      "GET /products/nonexistent-product-slug returns HTTP 404 with noindex",
      notFoundRes.status === 404 && hasNoindex,
      `status=${notFoundRes.status}, noindex=${hasNoindex}`,
      `Expected 404 + noindex, got status=${notFoundRes.status}, X-Robots-Tag="${xRobots}", meta="${metaRobots}"`
    );
  } catch (err) {
    collector.fail("T2.PDP.NOT_FOUND_404", tier, "Nonexistent product 404 check", err.message);
  }

  // 4. Live OG/Twitter image & Organization.logo binary dimension verification (1200x630 & 306x174)
  try {
    const publicRoutes = [
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
    for (const route of publicRoutes) {
      const res = await fetchWithTimeout(`${baseUrl}${route}`);
      if (res.status !== 200) continue;
      const html = await res.text();
      const doc = parseHtml(html);

      const ogImg = (doc.metaByProperty["og:image"] || "").trim();
      const twImg = (doc.metaByName["twitter:image"] || "").trim();
      const ogW = Number.parseInt(doc.metaByProperty["og:image:width"] || "", 10);
      const ogH = Number.parseInt(doc.metaByProperty["og:image:height"] || "", 10);

      if (ogImg) {
        let info = checkedImageUrls.get(ogImg);
        if (!info) {
          const fetchUrl = resolveLocalUrl(ogImg, baseUrl);
          const imgRes = await fetchWithTimeout(fetchUrl);
          const buf = Buffer.from(await imgRes.arrayBuffer());
          info = { status: imgRes.status, dims: parseImageDimensions(buf) };
          checkedImageUrls.set(ogImg, info);
        }
        const dimsMatch =
          info.status === 200 &&
          !info.dims.error &&
          info.dims.width === 1200 &&
          info.dims.height === 630 &&
          (!Number.isFinite(ogW) || ogW === 1200) &&
          (!Number.isFinite(ogH) || ogH === 630);
        collector.assert(
          `T2.IMAGE.OG[${route}]`,
          tier,
          `${route}: og:image resolves 200 & binary is 1200x630 matching meta`,
          dimsMatch,
          `${ogImg} -> ${info.dims.format} ${info.dims.width}x${info.dims.height}`,
          `og:image=${ogImg}, HTTP ${info.status}, binary=${info.dims.width}x${info.dims.height} (${info.dims.error || "ok"}), meta=${ogW || "?"}x${ogH || "?"}`
        );
      } else {
        collector.fail(`T2.IMAGE.OG[${route}]`, tier, `${route}: og:image binary check`, "Missing og:image");
      }

      if (twImg) {
        let info = checkedImageUrls.get(twImg);
        if (!info) {
          const fetchUrl = resolveLocalUrl(twImg, baseUrl);
          const imgRes = await fetchWithTimeout(fetchUrl);
          const buf = Buffer.from(await imgRes.arrayBuffer());
          info = { status: imgRes.status, dims: parseImageDimensions(buf) };
          checkedImageUrls.set(twImg, info);
        }
        const twOk =
          info.status === 200 &&
          !info.dims.error &&
          info.dims.width === 1200 &&
          info.dims.height === 630;
        collector.assert(
          `T2.IMAGE.TWITTER[${route}]`,
          tier,
          `${route}: twitter:image resolves 200 & binary is 1200x630`,
          twOk,
          `${twImg} -> ${info.dims.format} ${info.dims.width}x${info.dims.height}`,
          `twitter:image=${twImg}, HTTP ${info.status}, binary=${info.dims.width}x${info.dims.height}`
        );
      } else {
        collector.fail(`T2.IMAGE.TWITTER[${route}]`, tier, `${route}: twitter:image binary check`, "Missing twitter:image");
      }

      if (route === "/") {
        const nodes = parseJsonLdScripts(doc).flatMap((b) => b.nodes);
        const org = nodes.find(
          (n) => nodeHasType(n, "Organization") || nodeHasType(n, "OnlineStore")
        );
        const logoUrl = typeof org?.logo === "string" ? org.logo : org?.logo?.url || "";
        const logoW = org?.logo?.width;
        const logoH = org?.logo?.height;
        if (logoUrl) {
          const imgRes = await fetchWithTimeout(resolveLocalUrl(logoUrl, baseUrl));
          const buf = Buffer.from(await imgRes.arrayBuffer());
          const dims = parseImageDimensions(buf);
          const logoOk =
            imgRes.status === 200 &&
            !dims.error &&
            dims.width === 306 &&
            dims.height === 174 &&
            logoW === 306 &&
            logoH === 174;
          collector.assert(
            "T2.IMAGE.ORG_LOGO_LIVE",
            tier,
            "Organization.logo URL resolves 200 with 306x174 binary & JSON-LD parity",
            logoOk,
            `${logoUrl} -> ${dims.width}x${dims.height}, JSON-LD=${logoW}x${logoH}`,
            `logo=${logoUrl}, HTTP ${imgRes.status}, binary=${dims.width}x${dims.height}, JSON-LD=${logoW}x${logoH}`
          );
        }
      }
    }
  } catch (err) {
    collector.fail("T2.IMAGE.LIVE_CHECK", tier, "Live OG/Twitter/Logo image binary verification", err.message);
  }
}
