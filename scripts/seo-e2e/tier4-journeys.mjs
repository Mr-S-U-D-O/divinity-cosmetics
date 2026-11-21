/**
 * Tier 4 — Real-World Bot & Customer Workload Journeys:
 *   J1: Googlebot Full Discovery & Indexing Crawl
 *   J2: Social Media Card Unfurler (WhatsApp / LinkedIn / X)
 *   J3: AI Answer Engine Crawler (GPTBot / PerplexityBot)
 *   J4: Transactional & Auth Route Isolation
 *   J5: Storefront Search & Product Discovery Funnel
 */

import {
  PRODUCTION_ORIGIN,
  fetchWithTimeout,
  matchTextResilient,
  normalizeCanonicalUrl,
  resolveLocalUrl,
} from "./lib/assertions.mjs";
import {
  isRobotsPathAllowed,
  nodeHasType,
  parseHtml,
  parseImageDimensions,
  parseJsonLdScripts,
  parseRobotsTxt,
  parseSitemapXml,
} from "./lib/parsers.mjs";
import { API_PROBES, PRIVATE_ROUTES, PUBLIC_ROUTES } from "./tier1-technical.mjs";

export async function runTier4Live(baseUrl, collector) {
  const tier = "Tier 4";

  // =========================================================================
  // Journey 1: Googlebot Full Discovery & Indexing Crawl
  // =========================================================================
  let parsedRobots = null;
  let parsedSitemap = null;
  try {
    const robotsRes = await fetchWithTimeout(`${baseUrl}/robots.txt`);
    const robotsTxt = await robotsRes.text();
    parsedRobots = parseRobotsTxt(robotsTxt);

    const sitemapHref =
      parsedRobots.sitemaps[0] || `${PRODUCTION_ORIGIN}/sitemap.xml`;
    const smRes = await fetchWithTimeout(resolveLocalUrl(sitemapHref, baseUrl));
    const smXml = await smRes.text();
    parsedSitemap = parseSitemapXml(smXml);

    const crawlFailures = [];
    let pdpVerified = false;
    for (const entry of parsedSitemap.urls) {
      let pathname = "/";
      try {
        pathname = new URL(entry.loc).pathname;
      } catch {
        crawlFailures.push(`invalid sitemap URL: ${entry.loc}`);
        continue;
      }

      if (!isRobotsPathAllowed(parsedRobots, "Googlebot", pathname)) {
        crawlFailures.push(`Googlebot blocked on sitemap URL ${pathname}`);
      }

      const pageRes = await fetchWithTimeout(resolveLocalUrl(entry.loc, baseUrl), {
        redirect: "manual",
      });
      if (pageRes.status !== 200) {
        crawlFailures.push(`${pathname} returned HTTP ${pageRes.status}`);
        continue;
      }
      const html = await pageRes.text();
      const doc = parseHtml(html);
      const canon = normalizeCanonicalUrl(doc.canonicalLinks[0]?.href || "");
      const expected = normalizeCanonicalUrl(entry.loc);
      if (canon !== expected) {
        crawlFailures.push(`${pathname} canonical "${canon}" != "${expected}"`);
      }

      const ldBlocks = parseJsonLdScripts(doc);
      if (ldBlocks.length === 0 || ldBlocks.some((b) => !b.valid)) {
        crawlFailures.push(`${pathname} invalid or missing JSON-LD`);
      }

      if (pathname === "/products/marula-baobab-body-lotion") {
        const nodes = ldBlocks.flatMap((b) => b.nodes);
        const prod = nodes.find((n) => nodeHasType(n, "Product"));
        const offer = Array.isArray(prod?.offers) ? prod.offers[0] : prod?.offers;
        pdpVerified =
          Boolean(prod?.sku === "DIV-MBL-400") &&
          offer?.priceCurrency === "ZAR" &&
          Number(offer?.price) === 400;
      }
    }

    collector.assert(
      "T4.J1.GOOGLEBOT_DISCOVERY",
      tier,
      "Journey 1 (Googlebot): robots.txt -> sitemap.xml -> all URLs 200, self-canonical, valid JSON-LD -> PDP",
      robotsRes.status === 200 &&
        smRes.status === 200 &&
        parsedSitemap.valid &&
        crawlFailures.length === 0 &&
        pdpVerified,
      `Crawled ${parsedSitemap.urls.length} URLs cleanly + PDP DIV-MBL-400 verified`,
      `failures=[${crawlFailures.slice(0, 5).join("; ")}], pdpVerified=${pdpVerified}`
    );
  } catch (err) {
    collector.fail("T4.J1.GOOGLEBOT_DISCOVERY", tier, "Journey 1 (Googlebot Discovery)", err.message);
  }

  // =========================================================================
  // Journey 2: Social Media Card Unfurler (WhatsApp / LinkedIn / X)
  // =========================================================================
  try {
    const socialFailures = [];
    const fetchedImages = new Map();

    for (const route of PUBLIC_ROUTES) {
      const res = await fetchWithTimeout(`${baseUrl}${route}`);
      if (res.status !== 200) {
        socialFailures.push(`${route} HTTP ${res.status}`);
        continue;
      }
      const doc = parseHtml(await res.text());
      const ogImg = (doc.metaByProperty["og:image"] || "").trim();
      const twImg = (doc.metaByName["twitter:image"] || "").trim();
      const twCard = (doc.metaByName["twitter:card"] || "").trim();

      if (!ogImg.startsWith("https://") || !twImg.startsWith("https://") || twCard !== "summary_large_image") {
        socialFailures.push(`${route} incomplete OG/Twitter card`);
        continue;
      }

      for (const imgUrl of new Set([ogImg, twImg])) {
        if (!fetchedImages.has(imgUrl)) {
          const imgRes = await fetchWithTimeout(resolveLocalUrl(imgUrl, baseUrl));
          const buf = Buffer.from(await imgRes.arrayBuffer());
          fetchedImages.set(imgUrl, { status: imgRes.status, dims: parseImageDimensions(buf) });
        }
        const info = fetchedImages.get(imgUrl);
        if (info.status !== 200 || info.dims.width !== 1200 || info.dims.height !== 630) {
          socialFailures.push(
            `${route} image ${imgUrl} -> HTTP ${info.status} (${info.dims.width}x${info.dims.height})`
          );
        }
      }
    }

    collector.assert(
      "T4.J2.SOCIAL_UNFURLER",
      tier,
      "Journey 2 (Social Unfurler): All 10 public routes have valid OG/Twitter cards & HTTP 200 1200x630 images",
      socialFailures.length === 0,
      `Verified 10 routes & ${fetchedImages.size} unique 1200x630 social card asset(s)`,
      socialFailures.slice(0, 5).join("; ")
    );
  } catch (err) {
    collector.fail("T4.J2.SOCIAL_UNFURLER", tier, "Journey 2 (Social Unfurler)", err.message);
  }

  // =========================================================================
  // Journey 3: AI Answer Engine Crawler (GPTBot / PerplexityBot)
  // =========================================================================
  try {
    const aiFailures = [];
    const aiAssets = ["/llms.txt", "/llms-full.txt", "/pricing.md"];

    if (!parsedRobots) {
      const rRes = await fetchWithTimeout(`${baseUrl}/robots.txt`);
      parsedRobots = parseRobotsTxt(await rRes.text());
    }

    for (const bot of ["GPTBot", "PerplexityBot"]) {
      for (const p of ["/", ...aiAssets]) {
        if (!isRobotsPathAllowed(parsedRobots, bot, p)) {
          aiFailures.push(`${bot} disallowed on ${p}`);
        }
      }
    }

    const assetTexts = {};
    for (const assetPath of aiAssets) {
      const res = await fetchWithTimeout(`${baseUrl}${assetPath}`);
      const txt = await res.text();
      assetTexts[assetPath] = txt;
      if (res.status !== 200 || txt.trim().length < 200) {
        aiFailures.push(`${assetPath} HTTP ${res.status} (len=${txt.trim().length})`);
      }
    }

    const combinedAiCorpus = Object.values(assetTexts).join("\n");
    for (const token of ["DIV-MBL-400", "R400", "400ml", "/shipping", "/contact", "/privacy"]) {
      if (!combinedAiCorpus.includes(token)) {
        aiFailures.push(`AI markdown assets missing "${token}"`);
      }
    }
    if (!(assetTexts["/pricing.md"] || "").includes("DIV-MBL-400")) {
      aiFailures.push("/pricing.md missing SKU DIV-MBL-400");
    }

    // Extract raw SSR answers from /faq, /rituals, /products/marula-baobab-body-lotion
    for (const ssrRoute of ["/faq", "/rituals", "/products/marula-baobab-body-lotion"]) {
      const res = await fetchWithTimeout(`${baseUrl}${ssrRoute}`);
      if (res.status !== 200) {
        aiFailures.push(`${ssrRoute} HTTP ${res.status}`);
        continue;
      }
      const html = await res.text();
      const doc = parseHtml(html);
      const nodes = parseJsonLdScripts(doc).flatMap((b) => b.nodes);
      const faq = nodes.find((n) => nodeHasType(n, "FAQPage"));
      if (faq && Array.isArray(faq.mainEntity)) {
        const hiddenCount = faq.mainEntity.filter(
          (q) => !matchTextResilient(q?.acceptedAnswer?.text || "", doc.visibleText, 0.85).matched
        ).length;
        if (hiddenCount > 0) {
          aiFailures.push(`${ssrRoute} has ${hiddenCount} FAQ answers absent from raw SSR HTML`);
        }
      }
      if (ssrRoute === "/rituals") {
        if (!/marula/i.test(doc.visibleText) || !/baobab/i.test(doc.visibleText) || !/90-day/i.test(doc.visibleText)) {
          aiFailures.push("/rituals missing Marula/Baobab/90-day SSR content");
        }
      }
    }

    collector.assert(
      "T4.J3.AI_ANSWER_ENGINE",
      tier,
      "Journey 3 (AI Answer Engine): GPTBot/PerplexityBot -> llms*.txt & pricing.md + raw SSR FAQ/ritual/PDP answers",
      aiFailures.length === 0,
      "AI crawlers permitted, markdown assets accurate, SSR answers extractable without JS",
      aiFailures.slice(0, 6).join("; ")
    );
  } catch (err) {
    collector.fail("T4.J3.AI_ANSWER_ENGINE", tier, "Journey 3 (AI Answer Engine)", err.message);
  }

  // =========================================================================
  // Journey 4: Transactional & Auth Route Isolation
  // =========================================================================
  try {
    const isolationFailures = [];
    const sitemapLocs = new Set((parsedSitemap?.urls || []).map((u) => u.loc));

    for (const route of PRIVATE_ROUTES) {
      if (
        [...sitemapLocs].some((loc) => {
          try {
            const p = new URL(loc).pathname;
            return p === route || p.startsWith(`${route}/`);
          } catch {
            return false;
          }
        })
      ) {
        isolationFailures.push(`${route} leaked into sitemap.xml`);
      }

      const res = await fetchWithTimeout(`${baseUrl}${route}`, { redirect: "manual" });
      const xRobots = (res.headers.get("x-robots-tag") || "").toLowerCase();
      if (!xRobots.includes("noindex")) {
        isolationFailures.push(`${route} missing X-Robots-Tag: noindex (HTTP ${res.status})`);
      }

      if (res.status === 200) {
        const doc = parseHtml(await res.text());
        const metaRobots = (doc.metaByName.robots || "").toLowerCase();
        if (!metaRobots.includes("noindex")) {
          isolationFailures.push(`${route} missing <meta name="robots" content="...noindex...">`);
        }
        const canon = normalizeCanonicalUrl(doc.canonicalLinks[0]?.href || "");
        if (
          canon === normalizeCanonicalUrl(PRODUCTION_ORIGIN) ||
          canon === normalizeCanonicalUrl(`${PRODUCTION_ORIGIN}/`)
        ) {
          isolationFailures.push(`${route} leaks homepage canonical`);
        }
      }
    }

    for (const apiRoute of API_PROBES) {
      const res = await fetchWithTimeout(`${baseUrl}${apiRoute}`, { redirect: "manual" });
      const xRobots = (res.headers.get("x-robots-tag") || "").toLowerCase();
      if (!xRobots.includes("noindex")) {
        isolationFailures.push(`${apiRoute} missing X-Robots-Tag: noindex (HTTP ${res.status})`);
      }
    }

    collector.assert(
      "T4.J4.TRANSACTIONAL_ISOLATION",
      tier,
      "Journey 4 (Transactional Isolation): All 8 private routes + API endpoints emit noindex & are excluded from sitemap",
      isolationFailures.length === 0,
      `Verified ${PRIVATE_ROUTES.length} private routes + ${API_PROBES.length} API endpoints`,
      isolationFailures.slice(0, 6).join("; ")
    );
  } catch (err) {
    collector.fail("T4.J4.TRANSACTIONAL_ISOLATION", tier, "Journey 4 (Transactional Isolation)", err.message);
  }

  // =========================================================================
  // Journey 5: Storefront Search & Product Discovery Funnel
  // =========================================================================
  try {
    const funnelFailures = [];

    const homeRes = await fetchWithTimeout(`${baseUrl}/`);
    const homeDoc = parseHtml(await homeRes.text());
    const webSite = parseJsonLdScripts(homeDoc)
      .flatMap((b) => b.nodes)
      .find((n) => nodeHasType(n, "WebSite"));

    const template = webSite?.potentialAction?.target?.urlTemplate || "";
    if (!template.includes("/shop?q={search_term_string}")) {
      funnelFailures.push(`Invalid SearchAction template "${template}"`);
    }

    const searchPath = template
      ? resolveLocalUrl(template.replace("{search_term_string}", "marula"), baseUrl)
      : `${baseUrl}/shop?q=marula`;

    const shopRes = await fetchWithTimeout(searchPath);
    const shopHtml = await shopRes.text();
    const shopDoc = parseHtml(shopHtml);
    const pdpAnchor = shopDoc.anchors.find((a) =>
      a.href.includes("/products/marula-baobab-body-lotion")
    );
    if (shopRes.status !== 200 || !pdpAnchor) {
      funnelFailures.push(
        `/shop?q=marula did not return 200 with /products/marula-baobab-body-lotion link`
      );
    }

    const pdpRes = await fetchWithTimeout(`${baseUrl}/products/marula-baobab-body-lotion`);
    const pdpDoc = parseHtml(await pdpRes.text());
    if (pdpRes.status !== 200) {
      funnelFailures.push(`PDP HTTP ${pdpRes.status}`);
    } else {
      const hasShippingLink = pdpDoc.anchors.some((a) => a.href.includes("/shipping"));
      if (!hasShippingLink) {
        funnelFailures.push("PDP missing internal link to /shipping");
      }
    }

    const shippingRes = await fetchWithTimeout(`${baseUrl}/shipping`);
    const shippingDoc = parseHtml(await shippingRes.text());
    if (
      shippingRes.status !== 200 ||
      !/R100/.test(shippingDoc.visibleText) ||
      !/R500/.test(shippingDoc.visibleText)
    ) {
      funnelFailures.push("/shipping missing R100/R500 delivery clarity");
    }

    const orderStatusRes = await fetchWithTimeout(`${baseUrl}/order-status`);
    if (orderStatusRes.status !== 200) {
      funnelFailures.push(`/order-status returned HTTP ${orderStatusRes.status}`);
    }

    collector.assert(
      "T4.J5.DISCOVERY_FUNNEL",
      tier,
      "Journey 5 (Discovery Funnel): WebSite SearchAction -> /shop?q=marula -> PDP -> /shipping & /order-status",
      funnelFailures.length === 0,
      "Full search-to-PDP-to-shipping/tracking funnel verified",
      funnelFailures.join("; ")
    );
  } catch (err) {
    collector.fail("T4.J5.DISCOVERY_FUNNEL", tier, "Journey 5 (Discovery Funnel)", err.message);
  }
}
