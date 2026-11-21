/**
 * Deterministic self-tests for all parsers and Tier 1-3 rule validators
 * using synthetic PASS and FAIL fixtures. Always exits 0 iff all assertions succeed.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { TestCollector, matchTextResilient } from "./lib/assertions.mjs";
import {
  decodeHtmlEntities,
  isRobotsPathAllowed,
  parseHtml,
  parseImageDimensions,
  parseJsonLdScripts,
  parseRobotsTxt,
  parseSitemapXml,
} from "./lib/parsers.mjs";
import {
  validatePublicRouteHtml,
  validateRobotsTxtContent,
  validateSitemapXmlContent,
} from "./tier1-technical.mjs";
import {
  validateImageBufferDimensions,
  validatePdpSsrVisibility,
  validateSsrFaqVisibility,
} from "./tier2-ssr-assets.mjs";
import { validateFoundersNote, validateSeoDocs } from "./tier3-scope-docs.mjs";

function makePngBuffer(width, height) {
  const buf = Buffer.alloc(24);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buf, 0);
  buf.writeUInt32BE(13, 8);
  buf.write("IHDR", 12, "ascii");
  buf.writeUInt32BE(width, 16);
  buf.writeUInt32BE(height, 20);
  return buf;
}

function makeJpegBuffer(width, height, marker = 0xc0) {
  // SOI + APP0 (len 4) + SOF (len 11) + EOI
  const buf = Buffer.alloc(2 + 2 + 4 + 2 + 11 + 2);
  buf[0] = 0xff;
  buf[1] = 0xd8;
  buf[2] = 0xff;
  buf[3] = 0xe0;
  buf.writeUInt16BE(4, 4);
  buf[8] = 0xff;
  buf[9] = marker;
  buf.writeUInt16BE(11, 10);
  buf[12] = 8; // precision
  buf.writeUInt16BE(height, 13);
  buf.writeUInt16BE(width, 15);
  buf[17] = 3; // components
  buf[21] = 0xff;
  buf[22] = 0xd9;
  return buf;
}

function makeWebpVp8xBuffer(width, height) {
  const buf = Buffer.alloc(30);
  buf.write("RIFF", 0, "ascii");
  buf.writeUInt32LE(22, 4);
  buf.write("WEBP", 8, "ascii");
  buf.write("VP8X", 12, "ascii");
  buf.writeUInt32LE(10, 16);
  const wMinus1 = width - 1;
  const hMinus1 = height - 1;
  buf[24] = wMinus1 & 0xff;
  buf[25] = (wMinus1 >> 8) & 0xff;
  buf[26] = (wMinus1 >> 16) & 0xff;
  buf[27] = hMinus1 & 0xff;
  buf[28] = (hMinus1 >> 8) & 0xff;
  buf[29] = (hMinus1 >> 16) & 0xff;
  return buf;
}

function makeValidPdpHtml({
  title = "Marula & Baobab Body Lotion (400ml) | Divinity Cosmetics",
  description = "Facial-grade 400ml Marula and Baobab body lotion crafted in South Africa for 24-hour barrier hydration, crepey skin smoothing, and dry winter care.",
  canonical = "https://shopdivinitycosmetics.co.za/products/marula-baobab-body-lotion",
  hreflang = "https://shopdivinitycosmetics.co.za/products/marula-baobab-body-lotion",
  ogImage = "https://shopdivinitycosmetics.co.za/opengraph-image",
  headingsHtml = "<h1>Marula &amp; Baobab Body Lotion (400ml)</h1><h2>Key Botanicals &amp; Ingredients</h2><h3>90-Day Barrier Ritual</h3><h3>Shipping &amp; Checkout</h3>",
  extraBody = "",
  jsonLdRaw = null,
} = {}) {
  const defaultProductDesc =
    "A facial-grade 400ml botanical body lotion formulated with cold-pressed South African Marula and Baobab seed oils for 24-hour hydration and 90-day barrier repair.";
  const faqItems = [
    {
      q: "Why does Divinity take 2 minutes to absorb?",
      a: "Unrefined botanical lipids require three full minutes to penetrate deeply without volatile silicone carriers.",
    },
    { q: "Is this lotion safe for mature skin?", a: "Yes, it avoids synthetic fragrance and mineral oils." },
    { q: "How much is courier shipping in South Africa?", a: "R100 flat rate or free shipping on orders over R500." },
  ];
  const ldPayload =
    jsonLdRaw ??
    JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": ["Organization", "OnlineStore"],
        name: "Divinity Cosmetics",
        url: "https://shopdivinitycosmetics.co.za",
        logo: { "@type": "ImageObject", url: "https://shopdivinitycosmetics.co.za/images/divinity-logo.png", width: 306, height: 174 },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: "https://shopdivinitycosmetics.co.za",
        name: "Divinity Cosmetics",
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: "https://shopdivinitycosmetics.co.za/shop?q={search_term_string}" },
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Marula & Baobab Body Lotion (400ml)",
        sku: "DIV-MBL-400",
        description: defaultProductDesc,
        image: ["https://shopdivinitycosmetics.co.za/images/marula-baobab-body-lotion.jpg"],
        offers: { "@type": "Offer", price: "400.00", priceCurrency: "ZAR", availability: "https://schema.org/InStock" },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ]).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="en-ZA">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="en-ZA" href="${hreflang}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="Divinity Cosmetics" />
  <meta property="og:locale" content="en_ZA" />
  <meta property="og:type" content="website" />
  ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ""}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage || "https://shopdivinitycosmetics.co.za/twitter-image"}" />
  <script type="application/ld+json">${ldPayload}</script>
</head>
<body>
  <main>
    ${headingsHtml}
    <p>${defaultProductDesc}</p>
    <img src="/images/marula-baobab-body-lotion.jpg" alt="Divinity Cosmetics Marula and Baobab Body Lotion 400ml bottle" />
    <span aria-hidden="true"><img src="/images/bento-story-lotion.jpg" alt="" /></span>
    <button type="button" role="tab" aria-label="View image 1"><img src="/images/thumb.jpg" alt="" /></button>
    <div data-pdp-accordion>
      <button aria-controls="panel-ingredients">Key Botanicals &amp; Ingredients</button>
      <div id="panel-ingredients">10% Cold-Pressed Marula and 10% Wild-Harvested Baobab in a 400ml bottle.</div>
      <button aria-controls="panel-ritual">The 90-Day Barrier Ritual</button>
      <div id="panel-ritual">Apply daily over 90 days.</div>
      <button aria-controls="panel-delivery">Shipping &amp; Checkout</button>
      <div id="panel-delivery">R100 flat courier or free over R500.</div>
    </div>
    <section>
      ${faqItems.map((f) => `<p>${f.q} ${f.a}</p>`).join("\n")}
    </section>
    ${extraBody}
  </main>
</body>
</html>`;
}

export async function runSelfTests(repoRoot) {
  const results = [];
  function test(name, fn) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err) {
      results.push({ name, passed: false, error: err.message });
    }
  }

  // 1. Entity decoding & HTML parser tests
  test("parsers: decodeHtmlEntities named, decimal, hex", () => {
    assert.equal(decodeHtmlEntities("A &amp; B &ldquo;test&rdquo; &#39;ok&#x27;"), 'A & B “test” \'ok\'');
  });

  test("parsers: parseHtml handles quoted '>' in attrs, aria-hidden, role=tab, script exclusion", () => {
    const doc = parseHtml(`
      <html><head><title>Test &amp; Demo</title></head>
      <body>
        <div title="a > b"><h1>Main Heading</h1></div>
        <img src="/a.jpg" alt="Descriptive content alt" />
        <span aria-hidden="true"><img src="/dec.jpg" alt="" /></span>
        <button role="tab" aria-label="Thumb 1"><img src="/tab.jpg" alt="" /></button>
        <script>const hiddenVar = "NOT_VISIBLE_TEXT";</script>
      </body></html>
    `);
    assert.equal(doc.title, "Test & Demo");
    assert.equal(doc.headings.length, 1);
    assert.equal(doc.headings[0].text, "Main Heading");
    assert.equal(doc.images.length, 3);
    assert.equal(doc.images[0].insideAriaHidden, false);
    assert.equal(doc.images[1].insideAriaHidden, true);
    assert.equal(doc.images[2].insideTabWithAriaLabel, true);
    assert.ok(!doc.visibleText.includes("NOT_VISIBLE_TEXT"));
  });

  test("parsers: parseJsonLdScripts detects invalid JSON and raw unescaped '<'", () => {
    const bad = parseJsonLdScripts(`
      <script type="application/ld+json">{"name":"<script>alert(1)</script>"}</script>
      <script type="application/ld+json">{invalid</script>
      <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite"}</script>
    `);
    assert.equal(bad.length, 3);
    assert.equal(bad[0].valid, false);
    assert.equal(bad[0].hasRawUnescapedLt, true);
    assert.equal(bad[1].valid, false);
    assert.equal(bad[2].valid, true);
  });

  test("parsers: parseImageDimensions PNG, JPEG SOF0/SOF2, WEBP VP8X", () => {
    const png = parseImageDimensions(makePngBuffer(1200, 630));
    assert.deepEqual({ format: png.format, width: png.width, height: png.height }, { format: "png", width: 1200, height: 630 });
    const jpg = parseImageDimensions(makeJpegBuffer(764, 1024, 0xc2));
    assert.deepEqual({ format: jpg.format, width: jpg.width, height: jpg.height }, { format: "jpeg", width: 764, height: 1024 });
    const webp = parseImageDimensions(makeWebpVp8xBuffer(1200, 630));
    assert.deepEqual({ format: webp.format, width: webp.width, height: webp.height }, { format: "webp", width: 1200, height: 630 });
  });

  test("parsers: parseSitemapXml valid vs malformed XML", () => {
    const good = parseSitemapXml(`<?xml version="1.0"?><urlset><url><loc>https://shopdivinitycosmetics.co.za/</loc></url></urlset>`);
    assert.equal(good.valid, true);
    assert.equal(good.urls.length, 1);
    const bad = parseSitemapXml(`<urlset><url><loc>https://shopdivinitycosmetics.co.za/</url></urlset>`);
    assert.equal(bad.valid, false);
  });

  test("parsers: parseRobotsTxt & isRobotsPathAllowed catches trailing-slash omission", () => {
    const trailingOnly = parseRobotsTxt("User-agent: *\nAllow: /\nDisallow: /account/\n");
    assert.equal(isRobotsPathAllowed(trailingOnly, "*", "/account"), true); // bug caught!
    assert.equal(isRobotsPathAllowed(trailingOnly, "*", "/account/"), false);
    const fixed = parseRobotsTxt("User-agent: *\nAllow: /\nDisallow: /account\n");
    assert.equal(isRobotsPathAllowed(fixed, "*", "/account"), false);
    assert.equal(isRobotsPathAllowed(fixed, "*", "/account/"), false);
  });

  test("assertions: matchTextResilient handles >=85% token overlap & minor punctuation diffs", () => {
    const m = matchTextResilient(
      "Cold-pressed South African Marula & Baobab oils protect your skin barrier for 24 hours.",
      "Our cold pressed South African Marula and Baobab oils protect your skin barrier for 24 hours daily.",
      0.85
    );
    assert.equal(m.matched, true);
  });

  // 2. Tier 1 validator PASS & FAIL fixture tests
  test("tier1: valid public PDP fixture passes all Tier 1 checks", () => {
    const c = new TestCollector();
    validatePublicRouteHtml("/products/marula-baobab-body-lotion", makeValidPdpHtml(), c);
    const { counts } = c.getSummary();
    assert.equal(counts.failed, 0, c.formatReport());
  });

  test("tier1: detects localhost:3000 leak, double brand title, missing og:image, h2->h4 skip, img in h1, bad alt, unescaped <, aggregateRating", () => {
    const c = new TestCollector();
    const badLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Test <bad>",
      sku: "DIV-MBL-400",
      description: "desc",
      image: "https://shopdivinitycosmetics.co.za/x.jpg",
      offers: { "@type": "Offer", price: "400", priceCurrency: "ZAR", availability: "https://schema.org/InStock" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: 4.9, reviewCount: 50 },
    }); // raw '<' intentionally unescaped!
    const badHtml = makeValidPdpHtml({
      title: "Body Lotion | Divinity Cosmetics | Divinity Cosmetics",
      description: "Too short",
      ogImage: "",
      headingsHtml: '<h1><img src="/a.jpg" alt="hero.jpg" />Bad Heading</h1><h2>Sec</h2><h4>Skipped</h4>',
      extraBody: '<a href="http://localhost:3000/shop">leak</a><img src="/b.jpg" alt="" />',
      jsonLdRaw: badLd,
    });
    validatePublicRouteHtml("/products/marula-baobab-body-lotion", badHtml, c);
    const failedIds = new Set(c.results.filter((r) => r.status === "FAIL").map((r) => r.id));
    for (const suffix of [
      "NO_LOCALHOST",
      "TITLE",
      "DESCRIPTION",
      "OG",
      "H1",
      "HEADING_HIERARCHY",
      "IMG_ALT",
      "JSONLD_SYNTAX",
      "JSONLD_SCHEMA",
    ]) {
      assert.ok(
        failedIds.has(`T1.PUB[/products/marula-baobab-body-lotion].${suffix}`),
        `Expected failure for ${suffix}, got [${[...failedIds].join(", ")}]`
      );
    }
  });

  test("tier1: validateRobotsTxtContent & validateSitemapXmlContent catch missing paths & leaked private routes", () => {
    const c = new TestCollector();
    validateRobotsTxtContent(
      "User-agent: *\nAllow: /\nDisallow: /account/\nSitemap: https://shopdivinitycosmetics.co.za/sitemap.xml\n",
      c
    );
    assert.ok(c.results.some((r) => r.id === "T1.ROBOTS.DISALLOWS" && r.status === "FAIL"));

    const c2 = new TestCollector();
    validateSitemapXmlContent(
      `<urlset><url><loc>https://shopdivinitycosmetics.co.za/</loc></url><url><loc>https://shopdivinitycosmetics.co.za/checkout</loc></url></urlset>`,
      c2
    );
    assert.ok(c2.results.some((r) => r.id === "T1.SITEMAP.PUBLIC_ROUTES" && r.status === "FAIL"));
    assert.ok(c2.results.some((r) => r.id === "T1.SITEMAP.NO_PRIVATE" && r.status === "FAIL"));
  });

  // 3. Tier 2 validator PASS & FAIL tests
  test("tier2: validateSsrFaqVisibility & validatePdpSsrVisibility pass on visible SSR and fail on hidden FAQ", () => {
    const cPass = new TestCollector();
    validateSsrFaqVisibility("/products/marula-baobab-body-lotion", makeValidPdpHtml(), cPass, 3);
    validatePdpSsrVisibility(makeValidPdpHtml(), cPass);
    assert.equal(cPass.getSummary().counts.failed, 0);

    const hiddenHtml = makeValidPdpHtml().replace(
      "Unrefined botanical lipids require three full minutes to penetrate deeply without volatile silicone carriers.</p>",
      "</p>"
    );
    const cFail = new TestCollector();
    validateSsrFaqVisibility("/products/marula-baobab-body-lotion", hiddenHtml, cFail, 3);
    assert.ok(cFail.results.some((r) => r.id.endsWith(".ANSWERS_VISIBLE") && r.status === "FAIL"));
  });

  test("tier2: validateImageBufferDimensions catches wrong OG image size", () => {
    const cPass = new TestCollector();
    validateImageBufferDimensions("og", makePngBuffer(1200, 630), 1200, 630, cPass, "OG_PASS");
    assert.equal(cPass.getSummary().counts.failed, 0);

    const cFail = new TestCollector();
    validateImageBufferDimensions("og", makeJpegBuffer(764, 1024), 1200, 630, cFail, "OG_FAIL");
    assert.equal(cFail.getSummary().counts.failed, 1);
  });

  // 4. Tier 3 Founder's Note & docs/seo/ PASS/FAIL tests
  test("tier3: validateFoundersNote passes on real repo files and catches single-word tampering", () => {
    const about = fs.readFileSync(path.join(repoRoot, "src/app/(storefront)/about/page.tsx"), "utf8");
    const llms = fs.readFileSync(path.join(repoRoot, "public/llms-full.txt"), "utf8");
    const site = fs.readFileSync(path.join(repoRoot, "src/lib/config/site.ts"), "utf8");

    const cPass = new TestCollector();
    validateFoundersNote(about, llms, site, cPass);
    assert.equal(cPass.getSummary().counts.failed, 0, cPass.formatReport());

    const cFail = new TestCollector();
    validateFoundersNote(
      about.replace("vanishes in five seconds", "vanishes in six seconds"),
      llms.replace("almost every woman", "nearly every woman"),
      site,
      cFail
    );
    const failedIds = new Set(cFail.results.filter((r) => r.status === "FAIL").map((r) => r.id));
    assert.ok(failedIds.has("T3.FOUNDER.PULL_QUOTE"));
    assert.ok(failedIds.has("T3.FOUNDER.LLMS_FULL"));
  });

  test("tier3: validateSeoDocs passes clean qualitative docs and catches fabricated metrics", () => {
    const filler = "\n" + "Detailed qualitative South African skincare SEO analysis. ".repeat(12);
    const cleanDocs = {
      "docs/seo/01-site-wide-audit-and-plan.md":
        "Routes: `/`, `/shop`, `/products/marula-baobab-body-lotion`, `/about`, `/rituals`, `/faq`, `/reseller`, `/shipping`, `/contact`, `/privacy`.\n" +
        "Files: `src/app/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/lib/config/site.ts`, `src/lib/seo/schema.ts`, `src/app/(storefront)/page.tsx`, `src/app/(storefront)/about/page.tsx`, `src/app/(storefront)/faq/page.tsx`, `src/app/(storefront)/reseller/page.tsx`, `next.config.ts`, `prisma/seed.ts`." +
        filler,
      "docs/seo/02-keyword-strategy.md":
        "Methodology Note: Live search volume, CPC, and Google Search Console (GSC) metrics are unavailable because no live keyword API is connected; priority tiers below are qualitative.\n\n| Keyword | Search Volume | KD | Priority |\n|---|---|---|---|\n| marula body lotion south africa | Unavailable (Qualitative) | High competition | P1 |\n" +
        filler,
      "docs/seo/03-content-cluster-and-internal-linking.md":
        "Pillar `/products/marula-baobab-body-lotion` links to `/rituals` and `/faq`. Verified 400ml, R400, 10% Marula, 70–78% oleic acid." +
        filler,
      "docs/seo/04-organic-growth-roadmap.md":
        "South African stockists earn 30%–45% margins with 12-unit MOQ and 90-day barrier repair education." +
        filler,
    };
    const cPass = new TestCollector();
    validateSeoDocs(cleanDocs, repoRoot, cPass);
    assert.equal(cPass.getSummary().counts.failed, 0, cPass.formatReport());

    const badDocs = {
      ...cleanDocs,
      "docs/seo/02-keyword-strategy.md":
        "| Keyword | Search Volume | CPC |\n|---|---|---|\n| body lotion sa | 2,400 | R12.50 |\n" +
        "Over 78% of resellers reorder within 14 days.\n" +
        filler,
    };
    const cFail = new TestCollector();
    validateSeoDocs(badDocs, repoRoot, cFail);
    const failedIds = new Set(cFail.results.filter((r) => r.status === "FAIL").map((r) => r.id));
    assert.ok(failedIds.has("T3.DOCS.NO_FABRICATION"));
    assert.ok(failedIds.has("T3.DOCS.METHODOLOGY_DISCLAIMER"));
  });

  console.log("=== SEO E2E Self-Test Results ===");
  let failed = 0;
  for (const r of results) {
    if (r.passed) {
      console.log(`[PASS] ${r.name}`);
    } else {
      failed++;
      console.log(`[FAIL] ${r.name} — ${r.error}`);
    }
  }
  console.log(`\nSelf-tests: ${results.length - failed} passed, ${failed} failed (total ${results.length})`);
  return failed === 0 ? 0 : 1;
}
