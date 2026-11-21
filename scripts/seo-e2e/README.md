# Divinity Cosmetics SEO & AEO E2E Verification Suite

Zero-external-dependency automated verification suite built for Node.js `v24.20.0` (pure ESM `.mjs`, stdlib only).

## Files

- `run-all.mjs` — CLI entrypoint, production build (`NEXT_PUBLIC_APP_URL=https://shopdivinitycosmetics.co.za`), ephemeral `next start` lifecycle & Windows process tree cleanup.
- `lib/parsers.mjs` — HTML DOM tokenizer, JSON-LD script extractor (`<` XSS check + `JSON.parse`), PNG/JPEG/WEBP binary image header parser, XML sitemap parser, RFC 9309 `robots.txt` parser.
- `lib/assertions.mjs` — Structured `TestCollector` and R3-resilient normalized/token-overlap text matching helpers.
- `tier1-technical.mjs` — Tier 1: `tsc --noEmit`, `next build`, `localhost:3000` leak check, 10 public routes metadata/OG/Twitter/canonical/`hreflang`/headings/image-`alt`/JSON-LD checks, `/robots.txt`, `/sitemap.xml`, 8 private routes + API `noindex` & `X-Robots-Tag` checks.
- `tier2-ssr-assets.mjs` — Tier 2: Raw SSR FAQ & PDP visibility checks (no JS), `/shop?q=` `SearchAction` & 404 handling, `1200x630` OG/Twitter & `306x174` logo binary dimensions, cross-file SKU/formulation/shipping/WhatsApp consistency.
- `tier3-scope-docs.mjs` — Tier 3: Pinned SHA-256 Founder's Note verbatim lock (`about/page.tsx` & `public/llms-full.txt`), CSS/layout preservation `git diff` guard, `docs/seo/` citation & non-fabrication lint.
- `tier4-journeys.mjs` — Tier 4: Real-world Googlebot discovery, Social unfurler, AI Answer Engine (`GPTBot`/`PerplexityBot`), Transactional isolation, and Storefront search-to-PDP funnel journeys.
- `self-test.mjs` — Deterministic unit tests on synthetic PASS and FAIL fixtures.

## Usage

```powershell
# Run deterministic parser & validator unit self-tests (always exits 0 when suite is healthy)
node scripts/seo-e2e/run-all.mjs --self-test

# Run repo-level static checks (Tiers 1, 2, 3) without starting Next.js
node scripts/seo-e2e/run-all.mjs --static

# Run live HTTP checks against an existing .next/ build on an ephemeral port
node scripts/seo-e2e/run-all.mjs --live --skip-build --tier=1,2,4

# Run full production build + static + live Tiers 1-4 verification
node scripts/seo-e2e/run-all.mjs --all --json-out=seo-e2e-report.json
```
