# Organic growth roadmap and measurement instrumentation plan

**Site:** Divinity Cosmetics (`https://shopdivinitycosmetics.co.za`)  
**Framework:** `seo-plan` 4-phase structure adapted for South African e-commerce and B2B wholesale growth  
**Integrity standard:** Verified codebase capabilities and gaps are strictly separated from qualitative recommendations. Because no search console or analytics tools are currently installed, no baseline traffic numbers, CTR benchmarks, or revenue forecasts are fabricated.

---

## 1. Verified codebase baseline vs. qualitative recommendations

### 1.1 Verified codebase baseline (observed in repository)
- **Active catalogue (`prisma/seed.ts:10–43`):** One seeded active SKU (`Marula & Baobab Body Lotion`, `DIV-MBL-400`, 400ml, R400.00 ZAR incl. VAT, 25 initial stock). Upcoming oils, barrier serums, and refill bundles exist only as roadmap text (`public/pricing.md:19–22`, `src/app/(storefront)/rituals/page.tsx:229`, `public/llms.txt:28`).
- **Commerce & fulfilment rails (`src/lib/domain/`):** Paystack checkout (Visa, Mastercard, Capitec Pay, Ozow Instant EFT, Apple Pay), Shiplogic / The Courier Guy `/v3/rates` and `/v3/shipments` dispatching from Wright Crossing Shopping Centre, Springs, Gauteng (`1559`, `courierguy.ts:53–62`), Zoho Books/Inventory sync, and Clerk authentication.
- **B2B referral attribution (`src/lib/domain/orders/service.ts:109–120`):** Order creation validates an optional `referralCode` against approved `prisma.resellerProfile` records, providing built-in infrastructure for stockist-to-consumer attribution.
- **AI discovery surface (`src/app/robots.ts`, `public/`):** `robots.ts` explicitly welcomes AI crawlers to `/`, `/llms.txt`, `/llms-full.txt`, and `/pricing.md`.
- **Verified baseline gaps:**
  1. **Zero telemetry (`src/`, `package.json`, `layout.tsx`):** No Google Search Console verification tag, GA4/Plausible script, or conversion tracking exists.
  2. **Transactional email stub (`src/lib/domain/shipping/notifications.ts:41–44`):** Branded order-confirmation and post-purchase email delivery is a `console.log` stub (only live Shiplogic SMS/email notifications run when enabled).
  3. **Newsletter capture no-op (`src/components/layout/Footer.tsx:49–63`):** The newsletter form calls `onSubmit={(e) => e.preventDefault()}` with no API endpoint or database/ESP storage.
  4. **Zero verified reviews (`src/lib/seo/schema.ts`):** No product review model or verified customer reviews exist in Prisma; `schema.ts` rightly omits `aggregateRating`.
  5. **Policy and copy mismatches:** Shipping copy (`R100` flat, free `>= R500`) conflicts with checkout (`R142` ECO fallback, no `>= R500` waiver); `pricing.md` lists the wrong SKU (`DIV-MB-BL-400`) and 2 tiers instead of 3; `ResellerClient.tsx` includes unverified `"14 days"` and `"78%"` claims alongside `"Cape Provenance"` and `"Johannesburg"` hub errors; and `Footer.tsx:146` / `checkout/success/page.tsx:621` misdirect WhatsApp links.

### 1.2 Qualitative strategic recommendations (non-numeric)
All phase actions below use operational completion gates (shipped fixes, indexed routes, active instrumentation, and verified content launches) rather than invented impression, click, or revenue numbers. Once GSC and GA4 collect 30 days of live data, replace `"Baseline: Unmeasured (pre-instrumentation)"` with recorded figures.

---

## 2. Four-phase organic growth roadmap

### Phase 1: Technical foundation, fact reconciliation, and instrumentation (Weeks 1–4)
**Goal:** Eliminate indexation blockers, align every product/shipping/hub claim across code and AI files, and establish baseline search and conversion telemetry before scaling content.

- **Codebase SEO, SSR, and schema deployment (mapped to M1, M3, M4, M5):**
  - Deploy `buildPageMetadata()` (`src/lib/seo/metadata.ts`), remove leaking `alternates` from `layout.tsx`, shorten `title.template`, and publish true `1200x630` Open Graph/Twitter cards.
  - Fix `robots.ts` (exact private prefixes + `/order-status`), decouple Zoho `cache: "no-store"` from `sitemap.ts` via `getSitemapProducts()`, add `React.cache()` and `generateStaticParams()` to `/products/[slug]`, and add `headers()` (`X-Robots-Tag` on private/API routes, `images.formats`) in `next.config.ts`.
  - Add `serializeJsonLd()` XSS escaping and missing page schemas (`CollectionPage`/`ItemList`, `AboutPage`, `Article.image`, `OfferShippingDetails`/`MerchantReturnPolicy`, wholesale `Service`/`Offer`).
  - Fix single mobile/desktop `<h1>` (`Hero.tsx`), heading order (`Header`, `Footer`, `ShopClient`, `ResellerForm`, `checkout/verify`), SSR DOM visibility (`FAQAccordion`, `AddToCart`, PDP `PRODUCT_FAQS` and `product.description`), `?q=` `SearchAction` wiring, `alt` attributes, `Footer.tsx` WhatsApp link, `checkout/success` phone number, and `/privacy` outbound links.
- **Factual & business-logic reconciliation:**
  - Fix `pricing.md` SKU (`DIV-MBL-400`) and 3 wholesale tiers (30%/38%/45%); sync `10%` Marula and `10%` Baobab concentrations across `llms*.txt` and `pricing.md`; standardise Limpopo Marula / Mpumalanga Baobab and Wright Crossing Springs hub (`1559`); remove unverified `"14 days"` and `"78%"` reseller stats; keep Founder's Note (`about/page.tsx:155–157, 181–237`; `llms-full.txt:26–56`) verbatim.
  - Reconcile checkout shipping logic (`freeShippingThreshold = 500` / `R100` vs live Shiplogic `R142+` rates) so checkout totals match advertised store policy and schema.
- **Newsletter & telemetry activation:**
  - Connect `Footer.tsx` email signup to a real API route / Zoho Campaign or ESP list to capture non-ready organic visitors for a 90-day barrier-education welcome sequence.
  - Install Google Search Console verification, Bing Webmaster Tools verification, and consent-aware GA4 event tracking (detailed in Section 3).
- **Phase 1 completion gate:** Production build passes with `NEXT_PUBLIC_APP_URL=https://shopdivinitycosmetics.co.za`; all 10 public routes pass metadata/schema/heading/SSR checks; GSC and GA4 record live events.

### Phase 2: Topical content cluster and AEO/GEO authority (Months 2–4)
**Goal:** Capture non-branded South African problem-aware search demand and AI answer-engine citations without cannibalizing the flagship PDP or `/shop`.

- **Build `/guides` Next.js App Router section:**
  - Create `/guides` index and `/guides/[slug]` SSG routes with `Article`, `BreadcrumbList`, and targeted schema, wired into `src/app/sitemap.ts` and `public/llms.txt`.
- **Publish Wave 1 (Pillar + Priority 1 articles per Doc 03):**
  - Pillar: `/guides/skin-barrier-repair-body-care-south-africa`
  - P1 ★ AEO: `/guides/why-body-lotion-evaporates-5-second-myth`
  - P1 ★ AEO: `/guides/marula-vs-baobab-oil-body-care-comparison`
  - P1: `/guides/how-to-treat-crepey-skin-arms-legs-naturally`
  - P1: `/guides/highveld-winter-dry-skin-body-care-routine`
- **Publish Wave 2 (Priority 2 articles per Doc 03):**
  - TEWL explainer, Vanity Divide editorial audit, R400 vs R100 cost-per-ml comparison, and 5 commercial fillers to avoid.
- **AEO formatting discipline:** Every guide opens with a 40–60 word direct-answer definition, uses question-phrased H2/H3 headings, embeds comparison tables, links upward to the Pillar and across to `/products/marula-baobab-body-lotion` and `/rituals`, and follows `avoid-ai-writing` standards.
- **Phase 2 completion gate:** Pillar + 8 cluster articles live in `/sitemap.xml`, linked bidirectionally, listed in `llms.txt` / `llms-full.txt`, and verified indexed in GSC.

### Phase 3: B2B stockist acquisition, local directory, and review flywheel (Months 4–6)
**Goal:** Expand B2B wholesale applications (`/reseller/apply`) and build authentic user-generated social proof that supports organic conversion.

- **Publish Wave 3 (Priority 3 articles):**
  - SA regional climate guide, shower temperature & hard municipal water guide, B2B salon retail margin guide (`/guides/salon-retail-margins-botanical-body-care-sa`), and 400ml buyer's yield FAQ (`/guides/marula-baobab-body-lotion-buyers-faq`).
- **B2B stockist directory & referral loop:**
  - Once real South African clinics, salons, spas, and lodges onboard, publish an approved Stockist Directory on `/reseller` (matching the Premier Stockist map feature referenced in `ResellerClient.tsx:650`) with structured location listings.
  - Use the existing `resellerProfile.referralCode` validation (`orders/service.ts:109–120`) to power QR codes on counter tester cards so salon clients can reorder online while crediting their local stockist.
- **Verified review flywheel (enabling legitimate `AggregateRating`):**
  - Replace the `src/lib/domain/shipping/notifications.ts:41–44` email stub with transactional email delivery (Resend, Postmark, or Zoho Mail) and send automated 30-day and 90-day barrier-cycle check-ins asking buyers for verified reviews.
  - Store verified reviews in Prisma linked to paid orders; only after authentic reviews exist in the database, emit `Review` and `AggregateRating` inside `buildFlagshipProductSchema()`.
- **Phase 3 completion gate:** Active B2B guide funneling `/reseller/apply` submissions; transactional email live; first cohort of verified customer reviews stored before enabling review schema.

### Phase 4: Product line expansion and compounding organic scale (Months 6–12)
**Goal:** Scale organic catalogue depth and repeat-order retention as roadmap formulations launch.

- **Catalogue expansion in Prisma (`prisma/schema.prisma`):**
  - Promote the roadmap items (`Botanical Body Oils`, `Facial-Grade Barrier Serums`, and `90-Day Ritual Refill Bundles` in `pricing.md:19–22`) from static text to active `Product` rows so `sitemap.ts`, `ShopClient.tsx`, and `CollectionPage` JSON-LD expand automatically.
  - Create dedicated product-pair bundles (such as a 2-bottle 90-Day Barrier Cycle set aligned with the free-shipping threshold) and link them from relevant `/guides/` comparisons.
- **Content refresh & cannibalization pruning:**
  - Review GSC query reports quarterly: identify pages sharing impressions for the same query, sharpen H1/meta differentiation, refresh seasonal Highveld winter (May–August) and high-UV summer guidance, and retire or merge underperforming overlap.
- **Phase 4 completion gate:** Multi-SKU indexable catalogue live in `sitemap.xml` and `pricing.md`; quarterly GSC audit workflow established.

---

## 3. Concrete measurement and instrumentation plan

### 3.1 Implementation checklist

| Channel | Codebase / Operations Setup | Notes & Compliance |
|---|---|---|
| **Google Search Console (GSC) & Bing Webmaster** | Add `verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }` to `src/app/layout.tsx` metadata (or DNS TXT record on `shopdivinitycosmetics.co.za`); submit `https://shopdivinitycosmetics.co.za/sitemap.xml`. | Inspect all 10 public routes via URL Inspection and Rich Results Test; confirm private routes (`/checkout`, `/account`, `/order-status`, `/reseller/apply`) stay excluded. |
| **GA4 E-Commerce & Lead Events** | Install `@next/third-parties/google` (`GoogleAnalytics`) or `gtag.js` in `layout.tsx`, gated behind POPIA cookie consent and documented in `src/app/(storefront)/privacy/page.tsx`. | Emit typed events: `view_item` (PDP load), `add_to_cart` (`AddToCart.tsx`), `begin_checkout` (`checkout/page.tsx`), `purchase` (`checkout/success/page.tsx` with ZAR value and bottle quantity), `generate_lead` (`ResellerForm.tsx`), `whatsapp_concierge_click` (`wa.me` links), `newsletter_signup` (`Footer.tsx`), and `search` (`/shop?q=`). |
| **Core Web Vitals (CWV)** | Monitor CrUX / PageSpeed Insights field data and run Lighthouse CI against `/`, `/shop`, and `/products/marula-baobab-body-lotion`. | Track current Google CWV thresholds: **LCP <= 2.5s**, **INP <= 200ms**, **CLS <= 0.1** (never use deprecated FID). |
| **AI Search & GEO Tracking** | Inspect hosting/CDN access logs for `OAI-SearchBot`, `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended` requests; segment AI referrals (`chatgpt.com`, `perplexity.ai`, `claude.ai`) in GA4. | Run monthly standardised prompt audits (e.g., *"best body lotion for crepey skin South Africa"*, *"why does body lotion evaporate in 5 seconds"*, *"Divinity Cosmetics wholesale stockist South Africa"*) to verify factual citation accuracy. |

### 3.2 KPI tracking framework (pre-instrumentation baseline)

| Metric Category | Metric Definition | Data Source | Baseline | Review Cadence |
|---|---|---|---|---|
| **Indexation Coverage** | Valid indexed public URLs vs. submitted URLs in `/sitemap.xml`; zero accidental indexing of `/checkout`, `/account`, `/order-status` | Google Search Console | `Unmeasured (pre-instrumentation)` | Weekly (Phase 1), then monthly |
| **Organic Search Visibility** | Non-branded vs. branded organic impressions, clicks, average position, and SERP CTR by route (`/`, `/products/*`, `/rituals`, `/guides/*`, `/reseller`) | Google Search Console | `Unmeasured (pre-instrumentation)` | Monthly (30 / 60 / 90 / 180 days) |
| **Core Web Vitals (Mobile & Desktop)** | Field and lab `LCP` (target <= 2.5s), `INP` (target <= 200ms), `CLS` (target <= 0.1) on `/`, `/shop`, and PDP | CrUX / PageSpeed Insights | `Unmeasured (pre-instrumentation)` | Per release + monthly |
| **B2C Conversion Funnel** | Organic sessions triggering `view_item` -> `add_to_cart` -> `begin_checkout` -> `purchase` (tracking 1-bottle vs. 2-bottle 90-day cycle split) plus `whatsapp_concierge_click` | GA4 + Paystack/Prisma orders | `Unmeasured (pre-instrumentation)` | Monthly |
| **B2B Stockist Pipeline** | Qualified organic visits to `/reseller` converting to `generate_lead` on `/reseller/apply` and approved `resellerProfile` accounts | GA4 + Prisma `ResellerProfile` | `Unmeasured (pre-instrumentation)` | Monthly |
| **AI / GEO Citation Presence** | HTTP 200 crawl rate on `/llms.txt`, `/llms-full.txt`, `/pricing.md`, and `/guides/*`; AI-referred sessions in GA4; prompt audit accuracy | Server logs + GA4 + Prompt audit | `Unmeasured (pre-instrumentation)` | Monthly |
