/**
 * Tier 3 — Founder's Note Verbatim Lock, CSS/Layout Diff Guard,
 * and docs/seo/ Citation & Non-Fabrication Lint.
 */

import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { decodeHtmlEntities } from "./lib/parsers.mjs";

export const PINNED_HASHES = {
  // Trim of line 156: &ldquo;A lotion that vanishes in five seconds isn&apos;t fast-absorbing—it is simply evaporating into thin air.&rdquo;
  PULL_QUOTE_LINE: "0014831f55db028c03421285ecf5e6b48fbaf628f26931626a79dc97a86962d9",
  // Lines 181-186 (<h2 id="founders-note-heading" ...>A Personal Note from the Founder</h2>)
  HEADING_BLOCK_EXACT: "c77b9ad61aec727260119a5814a2ac01b7886cd114e7374250a17b5d1438a4a4",
  HEADING_BLOCK_TRIMMED: "e97f2e01afcbbb65362e983607c52c00b7699cadb5ef989470c5095f9e80947e",
  // 14 paragraphs raw JSX inner text (whitespace-collapsed, \n-joined)
  PARAS_RAW_JSX: "442cd796016ffd531c38bcc564c543120239b34b370f9c7273c9180df678fdc4",
  // 14 paragraphs entity-decoded text (matches llms-full.txt lines 28-54)
  PARAS_DECODED: "1d65fd50540e69429ab489ce2ee9ba99b5347aced7a8c30559e92e1676975afa",
  // Sign-off block lines 235-237
  SIGNOFF_BLOCK: "e126b8b2683c980ef30e353697af48302999858e5e00a4c99c6aefab67b658df",
  // public/llms-full.txt lines 26-56
  LLMS_FULL_BLOCK: "e2dee89e9eb0f30683f460cb531c9d35bb5035eca5ebaf1c00b2cbf7dbdeeda4",
};

export const REQUIRED_SEO_DOCS = [
  "docs/seo/01-site-wide-audit-and-plan.md",
  "docs/seo/02-keyword-strategy.md",
  "docs/seo/03-content-cluster-and-internal-linking.md",
  "docs/seo/04-organic-growth-roadmap.md",
];

function sha256(str) {
  return crypto.createHash("sha256").update(str, "utf8").digest("hex");
}

function collapseWs(str) {
  return String(str || "").replace(/\s+/g, " ").trim();
}

/**
 * Pure validator: Founder's Note verbatim lock across about/page.tsx, llms-full.txt, and site.ts.
 */
export function validateFoundersNote(aboutText, llmsFullText, siteTsText, collector) {
  const tier = "Tier 3";
  const aboutLines = String(aboutText || "").split(/\r?\n/);

  // 1. Pull quote
  const pqIdx = aboutLines.findIndex((l) => l.includes("vanishes in five seconds isn"));
  const pqHash = pqIdx >= 0 ? sha256(aboutLines[pqIdx].trim()) : "";
  collector?.assert(
    "T3.FOUNDER.PULL_QUOTE",
    tier,
    "about/page.tsx: Pull-quote matches pinned SHA-256 verbatim",
    pqHash === PINNED_HASHES.PULL_QUOTE_LINE,
    `line ${pqIdx + 1} SHA-256=${pqHash.slice(0, 16)}...`,
    pqIdx < 0
      ? "Pull-quote anchor not found in about/page.tsx"
      : `Pull-quote modified (line ${pqIdx + 1}, got ${pqHash})`
  );

  // 2. Founder's Note heading
  const headingStart = aboutLines.findIndex((l) => l.includes('id="founders-note-heading"'));
  let headingBlock = "";
  let headingEnd = -1;
  if (headingStart >= 0) {
    // Include preceding <h2 line if id= is on the next line
    const h2Start =
      aboutLines[headingStart].includes("<h2")
        ? headingStart
        : Math.max(0, headingStart - 1);
    headingEnd = aboutLines.findIndex((l, i) => i >= headingStart && l.includes("</h2>"));
    if (headingEnd >= h2Start) {
      headingBlock = aboutLines.slice(h2Start, headingEnd + 1).join("\n");
    }
  }
  const headingHashExact = headingBlock ? sha256(headingBlock) : "";
  const headingHashTrimmed = headingBlock ? sha256(headingBlock.trim()) : "";
  const headingOk =
    headingHashExact === PINNED_HASHES.HEADING_BLOCK_EXACT ||
    headingHashTrimmed === PINNED_HASHES.HEADING_BLOCK_TRIMMED;
  collector?.assert(
    "T3.FOUNDER.HEADING",
    tier,
    "about/page.tsx: Founder's Note heading matches pinned SHA-256 verbatim",
    headingOk,
    `SHA-256=${headingHashExact.slice(0, 16)}...`,
    `Heading anchor missing or modified (got ${headingHashExact || "none"})`
  );

  // 3. 14 body paragraphs
  const signOffLineIdx = aboutLines.findIndex((l) => l.includes("siteConfig.founderSignOff"));
  let rawParas = [];
  let decodedParas = [];
  if (headingEnd >= 0 && signOffLineIdx > headingEnd) {
    const bodyRegion = aboutLines.slice(headingEnd + 1, signOffLineIdx).join("\n");
    const pMatches = bodyRegion.match(/<p[^>]*>[\s\S]*?<\/p>/g) || [];
    rawParas = pMatches.map((p) => collapseWs(p.replace(/<[^>]+>/g, "")));
    decodedParas = rawParas.map((p) => collapseWs(decodeHtmlEntities(p)));
  }
  const rawParasHash = rawParas.length ? sha256(rawParas.join("\n")) : "";
  const decodedParasHash = decodedParas.length ? sha256(decodedParas.join("\n")) : "";
  collector?.assert(
    "T3.FOUNDER.PARAGRAPHS",
    tier,
    "about/page.tsx: Founder's Note 14 paragraphs match pinned SHA-256 verbatim",
    rawParas.length === 14 &&
      rawParasHash === PINNED_HASHES.PARAS_RAW_JSX &&
      decodedParasHash === PINNED_HASHES.PARAS_DECODED,
    `14/14 paragraphs matched (${decodedParasHash.slice(0, 16)}...)`,
    `Founder's Note body altered (count=${rawParas.length}, raw=${rawParasHash.slice(0, 16)}, decoded=${decodedParasHash.slice(0, 16)})`
  );

  // 4. Sign-off & siteConfig.founderSignOff
  let signOffBlock = "";
  if (signOffLineIdx > 0) {
    const pStart = Math.max(0, signOffLineIdx - 1);
    const pEnd = aboutLines.findIndex((l, i) => i >= signOffLineIdx && l.includes("</p>"));
    if (pEnd >= pStart) {
      signOffBlock = aboutLines.slice(pStart, pEnd + 1).join("\n");
    }
  }
  const signOffHash = signOffBlock ? sha256(signOffBlock) : "";
  const siteSignOffOk = /founderSignOff:\s*["']The Founder, Divinity Cosmetics["']/.test(
    String(siteTsText || "")
  );
  collector?.assert(
    "T3.FOUNDER.SIGNOFF",
    tier,
    "about/page.tsx & site.ts: Founder sign-off verbatim",
    signOffHash === PINNED_HASHES.SIGNOFF_BLOCK && siteSignOffOk,
    `signOff SHA-256=${signOffHash.slice(0, 16)}..., siteConfig verified`,
    `Sign-off modified (hash=${signOffHash || "none"}, siteConfigOk=${siteSignOffOk})`
  );

  // 5. public/llms-full.txt Founder's Note block + cross-parity
  const llmsLines = String(llmsFullText || "").split(/\r?\n/);
  const llmsStart = llmsLines.findIndex((l) =>
    l.trim() === "## 3. A Personal Note from the Founder"
  );
  const llmsEnd = llmsLines.findIndex(
    (l, i) => i > llmsStart && l.trim() === "— *The Founder, Divinity Cosmetics*"
  );
  let llmsBlock = "";
  let llmsParasHash = "";
  if (llmsStart >= 0 && llmsEnd > llmsStart) {
    llmsBlock = llmsLines.slice(llmsStart, llmsEnd + 1).join("\n");
    const llmsBodyParas = llmsLines
      .slice(llmsStart + 1, llmsEnd)
      .map((l) => l.trim())
      .filter(Boolean);
    llmsParasHash = sha256(llmsBodyParas.join("\n"));
  }
  const llmsBlockHash = llmsBlock ? sha256(llmsBlock) : "";
  collector?.assert(
    "T3.FOUNDER.LLMS_FULL",
    tier,
    "public/llms-full.txt: Mirrored Founder's Note matches pinned SHA-256 & about/page.tsx parity",
    llmsBlockHash === PINNED_HASHES.LLMS_FULL_BLOCK &&
      llmsParasHash === PINNED_HASHES.PARAS_DECODED &&
      llmsParasHash === decodedParasHash,
    `block=${llmsBlockHash.slice(0, 16)}..., parity=exact`,
    `llms-full.txt Founder's Note missing or modified (block=${llmsBlockHash || "none"}, paras=${llmsParasHash || "none"})`
  );
}

/**
 * Pure validator: checks docs/seo/ 4 deliverables for existence, substance,
 * real codebase citations, methodology disclaimer, and zero fabricated metrics.
 */
export function validateSeoDocs(docsMap, repoRoot, collector, existingRoutesSet = null) {
  const tier = "Tier 3";
  const knownRoutes =
    existingRoutesSet ||
    new Set([
      "/",
      "/shop",
      "/products/marula-baobab-body-lotion",
      "/products/[slug]",
      "/about",
      "/rituals",
      "/faq",
      "/reseller",
      "/shipping",
      "/contact",
      "/privacy",
      "/checkout",
      "/checkout/success",
      "/checkout/verify",
      "/order-status",
      "/account",
      "/reseller/apply",
      "/sign-in",
      "/sign-up",
    ]);

  // 1. Existence, length >= 500 chars, no TODO/TBD/FIXME
  for (const relPath of REQUIRED_SEO_DOCS) {
    const content = docsMap[relPath];
    const exists = typeof content === "string" && content.trim().length >= 500;
    const placeholders = exists ? content.match(/\b(TODO|TBD|FIXME)\b/g) || [] : [];
    collector?.assert(
      `T3.DOCS.EXISTS[${path.basename(relPath)}]`,
      tier,
      `${relPath}: Exists, substantive (>=500 chars), zero TODO/TBD/FIXME`,
      exists && placeholders.length === 0,
      `chars=${content ? content.length : 0}`,
      !content
        ? "File missing"
        : `chars=${content.length}, placeholders=[${placeholders.join(", ")}]`
    );
  }

  // 2. Audit doc real file & route citations
  const auditDoc = docsMap["docs/seo/01-site-wide-audit-and-plan.md"] || "";
  const backtickPaths = [
    ...new Set(
      (auditDoc.match(/`((?:src|prisma|public)\/[^`\s]+|next\.config\.ts)`/g) || []).map((m) =>
        m.slice(1, -1)
      )
    ),
  ];
  const existingCitedFiles = backtickPaths.filter((p) => {
    const clean = p.replace(/:.*$/, "").replace(/#.*$/, "");
    return fs.existsSync(path.join(repoRoot, clean));
  });

  const routeMatches = new Set(
    (auditDoc.match(/`(\/(?:[a-z0-9-[\]/]+)?)`/g) || [])
      .map((m) => m.slice(1, -1))
      .filter((r) => knownRoutes.has(r) || r.startsWith("/products/"))
  );

  collector?.assert(
    "T3.DOCS.AUDIT_CITATIONS",
    tier,
    "01-site-wide-audit-and-plan.md cites >= 10 real repo files and >= 8 real routes",
    existingCitedFiles.length >= 10 && routeMatches.size >= 8,
    `realFiles=${existingCitedFiles.length}, realRoutes=${routeMatches.size}`,
    `Insufficient real citations: realFiles=${existingCitedFiles.length} (need >=10), realRoutes=${routeMatches.size} (need >=8)`
  );

  // 3. Backticked repo file path resolution across all 4 docs
  const missingCitedPaths = [];
  for (const relPath of REQUIRED_SEO_DOCS) {
    const content = docsMap[relPath] || "";
    const lines = content.split(/\r?\n/);
    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      if (/\[?(?:proposed|new|planned|future|to create|create)\]?/i.test(line)) {
        continue;
      }
      const matches = line.match(/`((?:src|prisma|public)\/[^`\s)]+|next\.config\.ts)`/g) || [];
      for (const m of matches) {
        const raw = m.slice(1, -1).replace(/:.*$/, "").replace(/#.*$/, "");
        if (raw.includes("*") || raw.includes("{") || raw.includes("<")) continue;
        // Skip explicitly proposed artifacts if line mentions creating them
        if (/opengraph-image|twitter-image|blog\//i.test(raw) && /add|create|recommend|missing/i.test(line)) {
          continue;
        }
        const full = path.join(repoRoot, raw);
        if (!fs.existsSync(full)) {
          missingCitedPaths.push(`${path.basename(relPath)}:${idx + 1} -> ${raw}`);
        }
      }
    }
  }
  collector?.assert(
    "T3.DOCS.PATH_RESOLUTION",
    tier,
    "docs/seo/: Backticked repo file paths resolve on disk (unless marked proposed/new)",
    missingCitedPaths.length === 0,
    "All cited repo file paths exist on disk",
    `Unresolved cited paths: ${missingCitedPaths.slice(0, 6).join("; ")}`
  );

  // 4. Non-fabrication lint across all 4 docs
  const fabricationHits = [];
  const metricColRe =
    /\b(search volume|monthly volume|msv|cpc|kd|keyword difficulty|est\.?\s*traffic|monthly traffic|impressions|clicks|ctr|domain authority|domain rating|\bda\b|\bdr\b|monthly searches)\b/i;

  for (const relPath of REQUIRED_SEO_DOCS) {
    const content = docsMap[relPath] || "";
    if (!content) continue;
    const docName = path.basename(relPath);
    const lines = content.split(/\r?\n/);

    // Table column check (proper header -> separator -> data rows state machine)
    let inTable = false;
    let sawSeparator = false;
    let activeMetricCols = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line.startsWith("|")) {
        inTable = false;
        sawSeparator = false;
        activeMetricCols = [];
        continue;
      }
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      if (cells.length === 0) continue;

      if (!inTable) {
        inTable = true;
        sawSeparator = false;
        activeMetricCols = cells
          .map((c, idx) => (metricColRe.test(c) ? idx : -1))
          .filter((idx) => idx >= 0);
        continue;
      }
      if (!sawSeparator && cells.every((c) => /^:?-{2,}:?$/.test(c))) {
        sawSeparator = true;
        continue;
      }
      for (const colIdx of activeMetricCols) {
        const cell = cells[colIdx] || "";
        // Flag numeric values in SEO metric columns (allowing qualitative labels / N/A / Unavailable)
        if (/\d/.test(cell) && !/\b(?:n\/a|unavailable|none|0\s*fabricated)\b/i.test(cell)) {
          fabricationHits.push(`${docName}:${i + 1} table numeric metric "${cell}"`);
        }
      }
    }

    // Inline fabricated metrics check
    const inlineMetricPatterns = [
      {
        label: "inline search volume",
        re: /\b\d[\d,]*\s*(?:\+)?\s*(?:monthly\s+)?searches(?:\/mo(?:nth)?|\s+per\s+month)?\b/gi,
      },
      {
        label: "inline KD/CPC/DR/DA score",
        re: /\b(?:KD|CPC|DR|DA|Domain Rating|Domain Authority)\s*[:=]?\s*(?:R|\$)?\d+(?:\.\d+)?\b/gi,
      },
      {
        label: "fabricated traffic/impression projection",
        re: /\b\d[\d,]*\s*(?:monthly\s+)?(?:organic\s+)?(?:visitors|sessions|clicks|impressions)\s*(?:\/mo|per month)?\b/gi,
      },
      {
        label: "fabricated Lighthouse/Ahrefs/Semrush score",
        re: /\b(?:Lighthouse|PageSpeed|Ahrefs|Semrush)\s+(?:score|rating)\s*(?:of|:)?\s*\d{2,3}\b/gi,
      },
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip explicit disclaimers saying live data is unavailable or zero fabricated numbers
      if (/\b(unavailable|not connected|not available|no live|without fabricating|do not fabricate|never fabricate|placeholder)\b/i.test(line)) {
        continue;
      }
      for (const { label, re } of inlineMetricPatterns) {
        re.lastIndex = 0;
        const m = re.exec(line);
        if (m) {
          fabricationHits.push(`${docName}:${i + 1} ${label} "${m[0]}"`);
        }
      }

      // Banned legacy unverified stats (allowing 70-78% Marula oleic acid, 14-day return policy,
      // and audit-register lines explicitly flagging them for removal)
      const isAuditRemovalContext =
        /\b(remove|unverified|discrepancy|no supporting study|conflicts with|eliminat|flag)\b/i.test(
          line
        );
      if (!isAuditRemovalContext) {
        if (/\b78%\b/.test(line) && !/70[–-]78%|oleic/i.test(line)) {
          fabricationHits.push(`${docName}:${i + 1} banned unverified "78%" stat`);
        }
        if (
          /\b(?:within 14 days|under 14 days|14-day sell-through)\b/i.test(line) &&
          !/return|refund|MerchantReturn/i.test(line)
        ) {
          fabricationHits.push(`${docName}:${i + 1} banned unverified "14 days" sell-through stat`);
        }
      }
    }
  }

  collector?.assert(
    "T3.DOCS.NO_FABRICATION",
    tier,
    "docs/seo/: Zero fabricated numeric SEO metrics or unverified legacy stats",
    fabricationHits.length === 0,
    "Zero fabricated SEO metrics detected",
    `Potential metric fabrication (${fabricationHits.length}): ${fabricationHits.slice(0, 6).join("; ")}`
  );

  // 5. Methodology disclaimer check
  const kwDoc = docsMap["docs/seo/02-keyword-strategy.md"] || "";
  const hasDisclaimer =
    /(unavailable|not connected|no live)/i.test(kwDoc) &&
    /(search volume|keyword volume|gsc|google search console|cpc|ahrefs|semrush|qualitative)/i.test(kwDoc);
  collector?.assert(
    "T3.DOCS.METHODOLOGY_DISCLAIMER",
    tier,
    "02-keyword-strategy.md explicitly discloses live keyword/GSC metric unavailability",
    hasDisclaimer,
    "Methodology disclaimer present",
    "Missing explicit disclaimer noting live keyword volume / GSC data is unavailable"
  );
}

const ALLOWED_INLINE_STYLE_PROPS = new Set([
  "height",
  "maxHeight",
  "opacity",
  "display",
  "gridTemplateRows",
  "visibility",
  "overflow",
  "transition",
  "transform",
]);

function runGit(repoRoot, args) {
  const res = spawnSync("git", args, { cwd: repoRoot, encoding: "utf8" });
  return { ok: res.status === 0, stdout: res.stdout || "", stderr: res.stderr || "" };
}

export async function runTier3Static(repoRoot, collector, options = {}) {
  const tier = "Tier 3";
  const baseRef = options.baseRef || "HEAD";

  // 1. Founder's Note verbatim guard
  const aboutPath = path.join(repoRoot, "src", "app", "(storefront)", "about", "page.tsx");
  const llmsFullPath = path.join(repoRoot, "public", "llms-full.txt");
  const siteTsPath = path.join(repoRoot, "src", "lib", "config", "site.ts");
  if (fs.existsSync(aboutPath) && fs.existsSync(llmsFullPath) && fs.existsSync(siteTsPath)) {
    validateFoundersNote(
      fs.readFileSync(aboutPath, "utf8"),
      fs.readFileSync(llmsFullPath, "utf8"),
      fs.readFileSync(siteTsPath, "utf8"),
      collector
    );
  } else {
    collector.fail(
      "T3.FOUNDER.FILES_EXIST",
      tier,
      "Founder's Note source files exist",
      "Missing about/page.tsx, llms-full.txt, or site.ts"
    );
  }

  // 2. CSS / Theme immutability
  const immutableCssFiles = [
    "src/app/globals.css",
    "src/app/tailwind.css",
    "src/app/fonts.ts",
    "postcss.config.mjs",
  ];
  const cssDiff = runGit(repoRoot, ["diff", baseRef, "--", ...immutableCssFiles]);
  const rootEntries = fs.readdirSync(repoRoot);
  const tailwindConfigs = rootEntries.filter((f) => /^tailwind\.config\./i.test(f));
  collector.assert(
    "T3.DIFF.IMMUTABLE_CSS",
    tier,
    `Zero diff vs ${baseRef} on globals.css, tailwind.css, fonts.ts, postcss.config.mjs & no tailwind.config.*`,
    cssDiff.ok && cssDiff.stdout.trim() === "" && tailwindConfigs.length === 0,
    "Theme/CSS files untouched",
    `CSS diff or tailwind.config present: ${tailwindConfigs.join(", ")} ${cssDiff.stdout.slice(0, 200)}`
  );

  // 3. Root layout shell preservation
  const layoutPath = path.join(repoRoot, "src", "app", "layout.tsx");
  const layoutSrc = fs.existsSync(layoutPath) ? fs.readFileSync(layoutPath, "utf8") : "";
  const requiredLayoutTokens = [
    "<ClerkProvider>",
    "<CartProvider>",
    'lang="en-ZA"',
    "chloe.variable",
    "codeNext.variable",
    "antialiased font-sans",
    "./tailwind.css",
    "./globals.css",
  ];
  const missingLayout = requiredLayoutTokens.filter((t) => !layoutSrc.includes(t));
  collector.assert(
    "T3.LAYOUT.SHELL_PRESERVED",
    tier,
    "src/app/layout.tsx preserves ClerkProvider, CartProvider, en-ZA, fonts & CSS imports",
    missingLayout.length === 0,
    "All root layout shell tokens preserved",
    `Missing layout tokens: ${missingLayout.join(", ")}`
  );

  // 4. Prohibited <style / styled-jsx / non-accordion inline style={{...}} additions in git diff
  const srcDiff = runGit(repoRoot, ["diff", "-U0", baseRef, "--", "src/"]);
  const styleViolations = [];
  if (srcDiff.ok) {
    let curFile = "";
    for (const line of srcDiff.stdout.split(/\r?\n/)) {
      if (line.startsWith("+++ b/")) {
        curFile = line.slice(6);
        continue;
      }
      if (!line.startsWith("+") || line.startsWith("+++")) continue;
      const added = line.slice(1);
      if (/<style\b|styled-jsx/i.test(added)) {
        styleViolations.push(`${curFile}: added <style>/styled-jsx`);
      }
      const inlineMatch = /style=\{\{([^}]*)\}\}/.exec(added);
      if (inlineMatch) {
        const keys = [...inlineMatch[1].matchAll(/([a-zA-Z0-9_]+)\s*:/g)].map((m) => m[1]);
        const disallowed = keys.filter((k) => !ALLOWED_INLINE_STYLE_PROPS.has(k));
        if (disallowed.length > 0) {
          styleViolations.push(`${curFile}: inline style={{${disallowed.join(",")}}}`);
        }
      }
    }
  }
  collector.assert(
    "T3.DIFF.NO_STYLE_OVERRIDE",
    tier,
    "Zero <style>, styled-jsx, or non-accordion inline style={{...}} additions in src/",
    styleViolations.length === 0,
    "No prohibited inline style or <style> additions",
    styleViolations.slice(0, 6).join("; ")
  );

  // 5. Structural layout anchor classes intact
  const anchorChecks = [
    ["src/components/layout/Header.tsx", ["header-wrapper", "nav-bar", "nav-links"]],
    ["src/components/layout/Footer.tsx", ["footer-container", "footer-main-grid", "footer-nav-grid", "footer-massive-text"]],
    ["src/components/sections/Collection.tsx", ["collection-section"]],
    ["src/components/sections/Story.tsx", ["md:grid-cols-", "md:row-start-"]],
    ["src/components/sections/ResellerNetwork.tsx", ["lg:grid-cols-12"]],
    ["src/app/(storefront)/about/page.tsx", ["lg:grid-cols-[0.88fr_1.12fr]", "md:grid-cols-2", "md:grid-cols-3"]],
    ["src/app/(storefront)/shop/ShopClient.tsx", ["grid-cols-1"]],
  ];
  const missingAnchors = [];
  for (const [rel, tokens] of anchorChecks) {
    const abs = path.join(repoRoot, rel);
    const content = fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : "";
    for (const tok of tokens) {
      if (!content.includes(tok)) {
        missingAnchors.push(`${rel} missing "${tok}"`);
      }
    }
  }
  collector.assert(
    "T3.LAYOUT.STRUCTURAL_ANCHORS",
    tier,
    "Core visual layout & grid class anchors intact across storefront components",
    missingAnchors.length === 0,
    "All 7 structural component anchor sets preserved",
    `Missing layout anchors: ${missingAnchors.join("; ")}`
  );

  // 6. Existing public/images/*.jpg preserved (no deletions/modifications)
  const imgDiff = runGit(repoRoot, ["diff", "--name-status", baseRef, "--", "public/images/"]);
  const alteredExistingJpgs = imgDiff.stdout
    .split(/\r?\n/)
    .filter((l) => /^[DM]\s+public\/images\/.*\.jpg$/i.test(l.trim()));
  collector.assert(
    "T3.DIFF.EXISTING_IMAGES_INTACT",
    tier,
    "Zero deleted or modified existing public/images/*.jpg assets",
    alteredExistingJpgs.length === 0,
    "All existing JPG product/brand photos untouched",
    `Altered existing JPGs: ${alteredExistingJpgs.join("; ")}`
  );

  // 7. Backend/payment/order domain scope guard
  const sensitiveDiff = runGit(repoRoot, [
    "diff",
    "--name-only",
    baseRef,
    "--",
    "src/app/api/",
    "src/lib/domain/payments/",
    "src/lib/domain/orders/",
  ]);
  const touchedSensitive = sensitiveDiff.stdout
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  collector.assert(
    "T3.DIFF.NO_BACKEND_SCOPE_CREEP",
    tier,
    "Zero unintended edits to src/app/api/*, payments/, or orders/ domain logic",
    touchedSensitive.length === 0,
    "API/payments/orders untouched",
    `Unexpectedly modified backend files: ${touchedSensitive.join(", ")}`
  );

  // 8. docs/seo/ existence, citation & non-fabrication lint
  const docsMap = {};
  for (const rel of REQUIRED_SEO_DOCS) {
    const full = path.join(repoRoot, rel);
    if (fs.existsSync(full)) {
      docsMap[rel] = fs.readFileSync(full, "utf8");
    }
  }
  validateSeoDocs(docsMap, repoRoot, collector);
}
