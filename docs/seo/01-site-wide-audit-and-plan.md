# Site-wide SEO, AEO/GEO, technical & copy audit and implementation plan

**Site:** Divinity Cosmetics (`https://shopdivinitycosmetics.co.za`)  
**Repository:** `c:\Users\launc\Documents\divinity-cosmetics`  
**Stack:** Next.js `16.3.5` (App Router, Turbopack), React `19.2.8`, TypeScript, Tailwind CSS v4, Prisma `^6.0.0`, Clerk `^7.9.2`, Paystack, Shiplogic / The Courier Guy, Zoho Inventory  
**Audit methodology:** Direct static inspection of source code, App Router routes, JSON-LD generators, configuration files, `.env*` settings, `public/` AI/knowledge files, and image dimensions on disk.  
**Data limitation:** No Google Search Console (GSC), Google Analytics 4 (GA4), Chrome User Experience Report (CrUX), or live keyword/SERP API is connected in this environment. Priority ratings (`Critical`, `High`, `Medium`, `Low`, `Info`) reflect technical and structural impact inferred from the codebase rather than measured traffic.

---

## 1. Executive summary and inferred business profile

Divinity Cosmetics operates as a single-SKU, direct-to-consumer (B2C) and wholesale stockist (B2B) South African skincare storefront (`en-ZA`, ZAR `R`).

- **Inferred B2C audience:** South African women aged 30–70 (core 40–60) who already spend R300–R1,000 on facial serums while buying R80–R150 supermarket body lotions ("The Vanity Divide"). Key skin and climate drivers cited in the codebase include Highveld winters, strong UV exposure, hard municipal water, coastal humidity shifts, midday ashiness, crepey texture on arms, legs, knees, elbows, and décolletage, and wardrobe anxiety (`src/lib/config/site.ts:10`, `prisma/seed.ts:17, 28–31`, `src/app/(storefront)/about/page.tsx:190–214`, `public/llms.txt:7–24`).
- **Inferred B2B audience:** South African aesthetic and dermal clinics, day spas, boutique salons, somatologists, and safari lodges/luxury boutiques (`src/app/(storefront)/reseller/ResellerClient.tsx:277–340`).
- **Active seeded catalogue:** One active product in `prisma/seed.ts:10–43`: `Marula & Baobab Body Lotion` (`DIV-MBL-400`, 400ml, R400.00 ZAR incl. VAT), formulated with 10% cold-pressed Limpopo Marula oil (`Sclerocarya birrea`) and 10% wild-harvested Mpumalanga Baobab oil (`Adansonia digitata`).
- **Core structural findings:**
  1. **Critical metadata leaks and build URL risk:** `src/app/layout.tsx:37–42` sets `alternates: { canonical: "/", languages: { "en-ZA": "/" } }`, causing private `noindex` routes to inherit a `/` canonical and public subpages to lose `hreflang="en-ZA"` on override. Meanwhile, `.env:63` and `.env.local:40` set `NEXT_PUBLIC_APP_URL=http://localhost:3000`.
  2. **Broken ISR and duplicate PDP queries:** `src/lib/domain/zoho/client.ts:70, 120` sets `cache: "no-store"` on Zoho stock fetches invoked by `src/lib/domain/products/service.ts:41–111`, forcing dynamic rendering on `/`, `/shop`, and `/sitemap.xml`.
  3. **SSR DOM and mobile-first heading gaps:** `src/components/ui/FAQAccordion.tsx:60–61` and `src/app/(storefront)/products/[slug]/AddToCart.tsx:233` omit collapsed accordion answers from initial SSR HTML, `/products/[slug]` hides `PRODUCT_FAQS` and full `product.description` from visible DOM, and `src/components/layout/Hero.tsx:198–277, 396` hides `<h1>` on mobile viewports (`< 1024px`).
  4. **Factual drift across code, checkout, and AI files:** Shipping copy advertises R100 flat / free over R500 while checkout defaults to R142 ECO with no `>= R500` waiver; `public/pricing.md` lists the wrong SKU (`DIV-MB-BL-400`) and 2 wholesale tiers instead of 3; `ResellerClient.tsx` cites unverified `"14 days"` and `"78%"` figures alongside `"Cape Provenance"` and `"Johannesburg fulfillment center"` vs the configured Springs, Gauteng dispatch hub (`1559`); and `checkout/success/page.tsx:621` hardcodes `27821234567` while `Footer.tsx:145–146` routes the WhatsApp icon to `/checkout`.
  5. **Zero analytics or search verification:** No GSC tag, GA4 script, or analytics package exists anywhere in `src/` or `package.json`.

**Milestone alignment:** All planned fixes in this document map cleanly to the project implementation sequence: **M1** (Core metadata helper, `robots.ts`, `sitemap.ts`, Zoho/ISR decoupling, `schema.ts`, OG assets, `next.config.ts`, private route metadata), **M3** (Core storefront, `/shop` `?q=` wiring, PDP SSR/copy, `Header`, `Footer`, `Hero`, `ProductCard`, `FAQAccordion`, `prisma/seed.ts`), **M4** (Editorial, B2B, support pages, fact sync, `llms*.txt`, `pricing.md`), and **M5** (E2E verification suite and copy quality audit).

---

## 2. Protected verbatim text lock (R3)

Before any copy or template changes execute in M3 or M4, the following sections are strictly read-only and must remain byte-for-byte intact:

| File | Exact Lines | Protected Content |
|---|---|---|
| `src/app/(storefront)/about/page.tsx` | `155–157` | Pull-quote: `"A lotion that vanishes in five seconds isn't fast-absorbing—it is simply evaporating into thin air."` |
| `src/app/(storefront)/about/page.tsx` | `181–237` | Heading `"A Personal Note from the Founder"`, all 14 body `<p>` paragraphs, and sign-off `— {siteConfig.founderSignOff}` |
| `public/llms-full.txt` | `26–56` | Mirrored `## 3. A Personal Note from the Founder` through `— *The Founder, Divinity Cosmetics*` |

---

## 3. Complete App Router route and AI asset inventory (26 routes + 3 `public/` files)

### 3.1 Public indexable storefront routes (10 routes)

| # | Route | Source File & Lines | Baseline Observation (Pre-Optimisation) | Planned Fix & Milestone |
|---|---|---|---|---|
| 1 | `/` | `src/app/(storefront)/page.tsx:14–49` | Uses `title.absolute` (94 chars). Overrides `alternates.canonical: "/"` (`:24`) and drops `en-ZA` via shallow merge. Inherits root `openGraph` (`1200x900` on `764x1024` JPG). `revalidate = 60` (`:14`) broken by Zoho `no-store`. | Replace with `buildPageMetadata()` (title <=60 chars, 1200x630 OG, `en-ZA` preserved); isolate Zoho from `Collection.tsx` / ISR (**M1, M3**). |
| 2 | `/shop` | `src/app/(storefront)/shop/page.tsx:11–65`, `ShopClient.tsx` | Raw `title` 73 chars (107 chars rendered with 34-char template). Drops `en-ZA` and `twitter` card (inherits `/` Twitter). Emits static `buildFlagshipProductSchema()` instead of `CollectionPage` + `ItemList`. `ShopClient.tsx:24` ignores `?q=`. | Use `buildPageMetadata()`, emit `CollectionPage` + `ItemList` JSON-LD, wire `useSearchParams()` inside `<Suspense>` for `?q=` (`SearchAction`), fix `ShopClient` headings (**M1, M3**). |
| 3 | `/products/[slug]` | `src/app/(storefront)/products/[slug]/page.tsx:42–219` | Seeded `metaTitle` 86 chars (120 rendered); fallback 77 chars (111 rendered). Drops `en-ZA`. Missing `generateStaticParams()`, `revalidate`, and `React.cache()`. `PRODUCT_FAQS` (`:21–40`) in JSON-LD but missing from visible DOM; `product.description` hidden when `shortDescription` exists (`:207`). | Add `generateStaticParams()`, `revalidate`, `React.cache()` on `getProductBySlug`, `buildPageMetadata()`, visible `PRODUCT_FAQS`, visible full description, and keep `AddToCart.tsx` accordions in SSR DOM (**M1, M3**). |
| 4 | `/about` | `src/app/(storefront)/about/page.tsx:16–367` | Raw `title` 72 chars (106 rendered). `openGraph.type: "article"` declares `1200x900` on `/images/divinity-our-story.jpg` (`768x1376`). Drops `en-ZA`, `siteName`, `locale`, `twitter`. `buildFounderNoteArticleSchema()` omits `image`. | Apply `buildPageMetadata({ ogType: "article" })`, add `Article.image` and `AboutPage` schema, add cross-links while keeping lines `155–157` & `181–237` verbatim (**M1, M4**). |
| 5 | `/rituals` | `src/app/(storefront)/rituals/page.tsx:11–259` | Raw `title` 77 chars (111 rendered). `openGraph` (`:27–34`) omits `images`, `siteName`, `locale`, wiping `og:image` via shallow merge. Drops `en-ZA`. Only links to PDP and `/about#founders-note`. | Apply `buildPageMetadata()`, shorten title/description, add AEO 40–60w definitions, add cross-links to `/faq`, `/shipping`, `/shop`, `/reseller` (**M1, M4**). |
| 6 | `/faq` | `src/app/(storefront)/faq/page.tsx:7–129`, `FAQClient.tsx` | Raw `title` 90 chars (124 rendered). `openGraph` (`:23–30`) omits `images`, wiping `og:image`. Drops `en-ZA`. `FAQAccordion.tsx:61` hides 9 of 10 answers from SSR HTML. Plain-text mentions of shipping and resellers lack `<Link>`. | Apply `buildPageMetadata()`, render all FAQ panels in SSR DOM, add contextual links to `/rituals`, `/shipping`, `/reseller`, `/order-status`, align shipping copy (**M1, M3, M4**). |
| 7 | `/reseller` | `src/app/(storefront)/reseller/page.tsx:7–95`, `ResellerClient.tsx` | Raw `title` 86 chars (120 rendered). Declares `1200x900` on `764x1024` JPG; omits `siteName`, `locale`, `twitter`. Emits two separate `<script>` tags (`:84–91`), lacks `WebPage`/`Service`/`Offer`. Contains unverified `"14 days"` / `"78%"` claims and `"Cape Provenance"` / `"Johannesburg"` hub errors. | Apply `buildPageMetadata()`, add wholesale `Service`/`Offer` JSON-LD, remove unverified stats, fix Springs Gauteng hub & origin, add links to PDP and `/rituals` (**M1, M4**). |
| 8 | `/shipping` | `src/app/(storefront)/shipping/page.tsx:12–158` | Raw `title` 69 chars (103 rendered). `openGraph` (`:20–27`) omits `images`, wiping `og:image`. Drops `en-ZA`. Only `BreadcrumbList` JSON-LD. Claims R100 flat / free over R500 vs R142 checkout fallback. | Apply `buildPageMetadata()`, add `WebPage` + `OfferShippingDetails` + `MerchantReturnPolicy` JSON-LD, reconcile shipping policy, add links to `/order-status`, `/faq`, `/contact` (**M1, M4**). |
| 9 | `/contact` | `src/app/(storefront)/contact/page.tsx:14–169` | Raw `title` 77 chars (111 rendered). `openGraph` (`:22–28`) omits `images`, wiping `og:image`. Drops `en-ZA`. Missing links to `/faq`, `/shipping`, `/order-status`, `/reseller`. | Apply `buildPageMetadata()`, tighten copy, add contextual support navigation links (**M1, M4**). |
| 10 | `/privacy` | `src/app/(storefront)/privacy/page.tsx:6–91` | Title `"Privacy Policy & POPIA Compliance"` (33 chars raw) renders 67 chars. Omits `openGraph` and `twitter` (inherits `/` OG). Drops `en-ZA`. Only `BreadcrumbList` JSON-LD. **Zero outbound body `<Link>` or `<a>` tags** (dead-end page). | Apply `buildPageMetadata()`, add `WebPage` schema, add outbound links to `/shipping`, `/contact`, `/faq`, `/shop`, and document future analytics/cookie notice (**M1, M4**). |

### 3.2 Private and utility routes (8 routes, all must remain `noindex`)

| # | Route | Source File & Lines | Baseline Observation (Pre-Optimisation) | Planned Fix & Milestone |
|---|---|---|---|---|
| 11 | `/account` | `src/app/(storefront)/account/page.tsx:9–12` | `robots: { index: false, follow: false }`, but omits `alternates` so it inherits `canonical: "/"` and `en-ZA: "/"` from `layout.tsx:37–42`. Title already includes the `"Divinity Cosmetics"` brand suffix, creating a double brand suffix via the root template. | Use `buildPageMetadata({ noIndex: true })` (omits `alternates.canonical`, clean title), add `X-Robots-Tag: noindex, nofollow` header (**M1**). |
| 12 | `/checkout` | `src/app/(storefront)/checkout/layout.tsx:4–6`, `page.tsx` | `layout.tsx` sets `noindex, nofollow` without `title` or `alternates`, inheriting homepage title, OG, and `canonical: "/"`. Default rate `ECO = 142.0` (`:54`) with no `>= R500` free-shipping logic (`:88–89`). | Add `buildPageMetadata({ noIndex: true })` in `checkout/layout.tsx` + `X-Robots-Tag` header (**M1**); resolve R100/free>R500 vs R142 shipping logic (**M4 / Business Logic**). |
| 13 | `/checkout/success` | `src/app/(storefront)/checkout/success/page.tsx` | Inherits `checkout/layout.tsx` (`noindex, nofollow`) and homepage title/`canonical: "/"`. Line `621` hardcodes wrong WhatsApp `https://wa.me/27821234567`. | Inherits `checkout/layout.tsx` metadata fix (**M1**); replace `27821234567` with `siteConfig.whatsappNumber` (**M4**). |
| 14 | `/checkout/verify` | `src/app/(storefront)/checkout/verify/page.tsx` | Inherits `checkout/layout.tsx`. Uses `<h2>` at `:96, :110` with **no `<h1>`** on the route. | Inherits `checkout/layout.tsx` metadata fix (**M1**); add semantic `<h1>` (**M4**). |
| 15 | `/order-status` | `src/app/(storefront)/order-status/page.tsx:5–10` | `robots: { index: false, follow: true }`. Inherits `canonical: "/"` from `layout.tsx`. Double brand suffix in `<title>`. Omitted from `robots.ts`. | Use `buildPageMetadata({ noIndex: true, follow: true })`, add `/order-status` to `robots.ts` and `X-Robots-Tag` (**M1**). |
| 16 | `/reseller/apply` | `src/app/(storefront)/reseller/apply/layout.tsx:4–6`, `page.tsx`, `ResellerForm.tsx` | `layout.tsx` sets `noindex, nofollow` without `title` or `alternates`, inheriting homepage title and `canonical: "/"`. `ResellerForm.tsx:147, 184` uses `<h3>` directly under `<h1>`, and `:196` uses US placeholder `+1 (555) 000-0000`. | Set `buildPageMetadata({ noIndex: true })` in `reseller/apply/layout.tsx` (**M1**); fix `<h3>`→`<h2>` and `+27` phone placeholder (**M4**). |
| 17 | `/sign-in/[[...sign-in]]` | `src/app/(storefront)/sign-in/[[...sign-in]]/page.tsx:4–6` | `robots: { index: false, follow: false }` without `title` or `alternates` (inherits `/` canonical & homepage title). | Use `buildPageMetadata({ noIndex: true })` (**M1**). |
| 18 | `/sign-up/[[...sign-up]]` | `src/app/(storefront)/sign-up/[[...sign-up]]/page.tsx:4–6` | `robots: { index: false, follow: false }` without `title` or `alternates` (inherits `/` canonical & homepage title). | Use `buildPageMetadata({ noIndex: true })` (**M1**). |

### 3.3 Special metadata and API routes (8 routes) + static AI files (`public/`)

| # | Route / File | Source Path & Lines | Baseline Observation | Planned Fix & Milestone |
|---|---|---|---|---|
| 19 | `/robots.txt` | `src/app/robots.ts:1–42` | Explicitly welcomes `*` and 11 bots (`GPTBot`, `ChatGPT-User`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `Claude-Web`, `anthropic-ai`, `Google-Extended`, `Googlebot`, `Bingbot`, `Applebot-Extended`) to `/`, `/llms.txt`, `/llms-full.txt`, `/pricing.md`. However, `disallowedPrivatePaths` (`:4–11`) uses trailing slashes (`"/account/"`, `"/checkout/"`, etc.), failing to block exact non-slash routes (`/checkout`, `/account`) and omitting `/order-status`. Emits non-standard `host` directive (`:39`). | Remove trailing slashes on private prefixes, add `/order-status`, remove non-standard `host` if not required (**M1**). |
| 20 | `/sitemap.xml` | `src/app/sitemap.ts:1–86` | Lists 9 static paths + active DB products (`getAllProducts` at `:65`). Sets `lastModified: new Date()` (`:66, 71`) on every request (noisy crawl signal), invokes Zoho `no-store`, and has no DB-unreachable fallback. | Add `getSitemapProducts()` (DB-only, no Zoho `no-store`, fallback to `siteConfig.flagshipProduct`), use stable `lastModified` dates (**M1**). |
| 21 | `/api/paystack/initialize` | `src/app/api/paystack/initialize/route.ts:4` | `POST` handler; lacks `X-Robots-Tag: noindex, nofollow`. | Add `X-Robots-Tag: noindex, nofollow` for `/api/:path*` in `next.config.ts` (**M1**). |
| 22 | `/api/paystack-webhook` | `src/app/api/paystack-webhook/route.ts:5` | `POST` handler; covered by `/api/` disallow rule. | Covered by `/api/:path*` `X-Robots-Tag` (**M1**). |
| 23 | `/api/shipping/label/[orderNumber]` | `src/app/api/shipping/label/[orderNumber]/route.ts:22` | `GET` handler returning shipping label; lacks `X-Robots-Tag`. | Covered by `/api/:path*` `X-Robots-Tag: noindex, nofollow` (**M1**). |
| 24 | `/api/webhooks/paystack` | `src/app/api/webhooks/paystack/route.ts:1` | Re-exports `POST` from `/api/paystack-webhook`. | Covered by `/api/:path*` `X-Robots-Tag` (**M1**). |
| 25 | `/api/webhooks/shiplogic` | `src/app/api/webhooks/shiplogic/route.ts:124, 252` | `POST` and `GET` handlers; `GET` needs `X-Robots-Tag`. | Covered by `/api/:path*` `X-Robots-Tag` (**M1**). |
| 26 | `/api/webhooks/zoho/dispatch` | `src/app/api/webhooks/zoho/dispatch/route.ts:25, 298` | `POST` and `GET` handlers; `GET` needs `X-Robots-Tag`. | Covered by `/api/:path*` `X-Robots-Tag` (**M1**). |
| A1 | `/llms.txt` | `public/llms.txt:1–44` | Clean brand/product index for LLMs, but omits SKU `DIV-MBL-400`, omits `10%` Marula / `10%` Baobab concentrations, and repeats unaligned R100 / free `>R500` shipping claim. | Add `DIV-MBL-400`, `10%` concentrations, and sync shipping policy (**M4**). |
| A2 | `/llms-full.txt` | `public/llms-full.txt:1–88` | Contains Executive Summary, comparison table, 5 Q&As, and **verbatim Founder's Note (`:26–56`)**. Omits `DIV-MBL-400` and `10%` active percentages; repeats R100 shipping claim. | Sync SKU, `10%` percentages, and shipping facts outside lines `26–56`; **keep lines `26–56` verbatim** (**M4**). |
| A3 | `/pricing.md` | `public/pricing.md:1–38` | Lists wrong SKU (`DIV-MB-BL-400` at `:11`), omits Tier 2 Studio Partner (`38%`) by listing only 2 tiers (`:35–37`), and repeats R100 / free `>R500` shipping claim (`:25–26`). | Fix SKU to `DIV-MBL-400`, add all 3 wholesale tiers (30%/38%/45%), and sync shipping policy (**M4**). |

---

## 4. Category-by-category audit findings and implementation plan

### 4.1 Technical SEO, indexing, headers, and environment (`Critical` / `High`)

- **Canonical & `hreflang` shallow-merge leak (`Critical`, M1):** `src/app/layout.tsx:37–42` defines `alternates: { canonical: "/", languages: { "en-ZA": "/" } }`. In Next.js App Router, overriding `alternates.canonical` on any public subpage replaces the `alternates` object and strips `languages["en-ZA"]`. Conversely, any private route omitting `alternates` (`/account`, `/checkout`, `/checkout/success`, `/checkout/verify`, `/order-status`, `/reseller/apply`, `/sign-in`, `/sign-up`) inherits `canonical: "/"` alongside `noindex`.
  - *Plan:* Remove `alternates` from `layout.tsx` and introduce `buildPageMetadata()` in `src/lib/seo/metadata.ts`. For indexable pages, emit `alternates: { canonical: path, languages: { "en-ZA": path } }`; for `noIndex` pages, omit `alternates` completely.
- **Build URL contamination (`Critical`, M1 / Ops):** `src/lib/config/site.ts:5` resolves `url` from `process.env.NEXT_PUBLIC_APP_URL`. While `.env.example:14` specifies `https://shopdivinitycosmetics.co.za`, `.env:63` and `.env.local:40` set `NEXT_PUBLIC_APP_URL=http://localhost:3000`. Any production build using local `.env` files emits `http://localhost:3000` in canonicals, `og:url`, `robots.txt`, `sitemap.xml`, and JSON-LD `@id` properties.
  - *Plan:* Ensure production builds and E2E verification runs set `NEXT_PUBLIC_APP_URL=https://shopdivinitycosmetics.co.za` explicitly.
- **`robots.ts` and `X-Robots-Tag` gaps (`High`, M1):** Trailing slashes in `disallowedPrivatePaths` (`src/app/robots.ts:4–11`) leave `/checkout`, `/account`, `/sign-in`, `/sign-up`, and `/reseller/apply` uncaught without trailing slashes, and `/order-status` is absent. Meanwhile, `next.config.ts:1–15` configures no `headers()`.
  - *Plan:* Strip trailing slashes from `disallowedPrivatePaths`, add `/order-status`, and configure `headers()` in `next.config.ts` with `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy`, and `X-Robots-Tag: noindex, nofollow` on `/account/:path*`, `/checkout/:path*`, `/order-status/:path*`, `/reseller/apply/:path*`, `/sign-in/:path*`, `/sign-up/:path*`, and `/api/:path*`.
- **Planned helper (`src/lib/seo/metadata.ts`):** `buildPageMetadata()` is introduced in **M1** to replace raw root `alternates` leaking from `layout.tsx`.
- **Middleware / Next.js 16 convention check (`Medium`, M1):** Pre-M1 `HEAD` (`src/middleware.ts:1–12`) uses `clerkMiddleware()` on Next.js `16.3.5` (prior to M1's `src/proxy.ts` migration check). Next.js 16 introduced `proxy.ts`; verify `@clerk/nextjs@^7.9.2` compatibility before migrating, and do not rename `middleware.ts` if Clerk's build-time detection requires it.

### 4.2 Caching, ISR, performance, and `SearchAction` (`High`)

- **Zoho `cache: "no-store"` invalidating ISR (`High`, M1):** `src/lib/domain/products/service.ts:41–111` calls `hydrateWithZohoStock` on every catalogue read (`getAllProducts`, `getProductBySlug`, `getProductById`, `getFeaturedProducts`). That triggers `syncProductsStockFromZoho` (`src/lib/domain/zoho/service.ts:105`) and `zohoFetch` / `getZohoAccessToken` (`src/lib/domain/zoho/client.ts:70, 120`), both passing `cache: "no-store"`. This disables ISR (`revalidate = 60`) on `/` (`src/app/(storefront)/page.tsx:14`) and `/shop` (`src/app/(storefront)/shop/page.tsx:11`) whenever Zoho credentials exist.
  - *Plan:* Add `getSitemapProducts()` (DB-only with `siteConfig.flagshipProduct` fallback when DB is unreachable), wrap `getProductBySlug` in `React.cache()` to prevent double queries between `generateMetadata` and `ProductPage`, add `generateStaticParams()` + `revalidate = 60` on `/products/[slug]`, and isolate live Zoho stock refreshes from blocking static/ISR HTML.
- **Below-fold LCP competition & unused `next.config.ts` image formats (`Medium`, M1, M3):** `src/components/sections/Story.tsx:28, 44` passes `priority` to two below-fold images, competing with `Hero.tsx` LCP images. `next.config.ts:5–12` leaves `images.formats` unset (missing `["image/avif", "image/webp"]`) and lists an unused `images.remotePatterns` entry (`images.unsplash.com`).
  - *Plan:* Remove `priority` from `Story.tsx:28, 44` (**M3**) and enable `formats: ["image/avif", "image/webp"]` in `next.config.ts` (**M1**).
- **`SearchAction` `?q=` disconnect (`Medium`, M3):** `src/lib/seo/schema.ts:91–98` advertises `${siteConfig.url}/shop?q={search_term_string}`, but `src/app/(storefront)/shop/ShopClient.tsx:24` initializes `searchQuery` to `""` without reading URL params, and `src/components/layout/Header.tsx:303–312` provides a search `<input>` with no route submission.
  - *Plan:* Wire `ShopClient.tsx` to read `?q=` via `useSearchParams()` inside `<Suspense>` and connect `Header.tsx` search submission to `/shop?q=...`.
- **Webfont commercial licensing (`Low` / Operational):** `src/app/fonts.ts:6, 18` documents that `Chloe-Regular.otf` and `CodeNext-Hairline.otf` are personal-use trial fonts. Secure commercial webfont licenses prior to public marketing push.

### 4.3 On-page SEO, heading hierarchy, and SSR crawlability (`High`)

- **Title template overflow (`High`, M1, M3, M4):** `src/app/layout.tsx:15` applies `template: "%s | Divinity Cosmetics South Africa"` (a 34-character suffix). Combined with 69–90 character raw page titles across most public subpages (plus 33 characters on `/privacy`), rendered `<title>` tags reach 103–124 characters across those subpages (67 characters on `/privacy`, and 94 characters on `/`), far past the ~60-character SERP display limit.
  - *Plan:* Shorten `title.template` in `layout.tsx` to `"%s | Divinity Cosmetics"` (21 chars) and rewrite page titles so full rendered titles stay <=60 characters where practical without keyword stuffing.
- **Single visible `<h1>` and sequential headings (`High`, M3, M4):**
  - `src/components/layout/Hero.tsx:198–277` renders `<h1>` inside `hidden lg:grid`, wrapping 5 avatar `<Image>` tags (`:216–233`), the `"Recommended by 88+ women"` badge (`:237–247`), and the cream-swirl image (`:256–264`). On viewports `< 1024px` (mobile-first indexing), `<h1>` is hidden (`display: none`) and line `396` renders `<h2>` instead.
  - `src/components/layout/Footer.tsx:69, 76` uses `<h4>` under `<h2>` (`:43`).
  - `src/components/layout/Header.tsx:484, 498, 512, 551` emits `<h4>` tags in the mega-menu on every page before `<h1>`.
  - `src/app/(storefront)/shop/ShopClient.tsx:668, 701` uses `<h4>` in the mobile drawer without a parent `<h3>`, and line `897` renders `ProductCard` (`<h3>` at `ProductCard.tsx:100`) without a preceding `<h2>` over the product grid (line `954` empty state also uses `<h3>`).
  - `src/components/reseller/ResellerForm.tsx:147, 184` uses `<h3>` under `<h1>` (`reseller/apply/page.tsx:21`).
  - `src/app/(storefront)/checkout/verify/page.tsx:96, 110` starts at `<h2>` with no `<h1>`.
  - *Plan:* Keep CSS classes unchanged while making one clean visible `<h1>` on both mobile and desktop in `Hero.tsx` (moving avatars/swirl outside `<h1>`), changing `Footer.tsx` `<h4>` to `<h3>`, changing `Header.tsx` mega-menu `<h4>` to `<p>`/`<span>`, fixing `ShopClient.tsx` mobile drawer `<h4>`→`<h3>` and adding a visually integrated `<h2>` above the product grid, changing `ResellerForm.tsx` `<h3>`→`<h2>`, and adding an `<h1>` to `checkout/verify/page.tsx`.
- **Accordion SSR DOM omission & PDP hidden content (`High`, M3):**
  - `src/components/ui/FAQAccordion.tsx:60–61` uses `{isOpen && (<motion.div>...)}`, omitting 3 of 4 homepage FAQ answers, 9 of 10 `/faq` answers, and 5 of 6 `/reseller` answers from SSR HTML.
  - `src/app/(storefront)/products/[slug]/AddToCart.tsx:233` uses `{isOpen && (...)}`, omitting ingredients, 90-day ritual, and shipping panel copy from PDP SSR HTML. In addition, lines `94–97` collapse the detailed `10%` Marula/Baobab breakdown whenever `product.ingredients` is non-empty (`prisma/seed.ts:33`).
  - `src/app/(storefront)/products/[slug]/page.tsx:21–40, 124, 206–210` emits `PRODUCT_FAQS` in `FAQPage` JSON-LD but does not render `PRODUCT_FAQS` visibly on the page, and omits `product.description` (`prisma/seed.ts:16–17`) whenever `shortDescription` is present.
  - *Plan:* Render collapsed accordion panels inside SSR HTML (keeping visual collapse via CSS/height/aria-hidden without unmounting), render `PRODUCT_FAQS` and full `product.description` visibly on the PDP, and preserve the `10%` active ingredient detail.

### 4.4 Structured data / JSON-LD (`High`)

Across 11 files, 12 `<script type="application/ld+json">` tags are injected (`layout.tsx`, `(storefront)/page.tsx`, `shop/page.tsx`, `products/[slug]/page.tsx`, `about/page.tsx`, `rituals/page.tsx`, `faq/page.tsx`, `reseller/page.tsx` [2 scripts], `shipping/page.tsx`, `contact/page.tsx`, `privacy/page.tsx`).

- **Pre-optimisation defects (`src/lib/seo/schema.ts` & pages):**
  - Zero XSS escaping: all 12 scripts pass raw `JSON.stringify(...)` without `.replace(/</g, "\\u003c")`.
  - `Organization.logo` (`schema.ts:24–25`) declares `300x170` instead of actual `306x174`.
  - `Organization.sameAs` (`schema.ts:61–65`) lists Instagram, Facebook, and TikTok even though `Footer.tsx:14–22` only exposes Facebook (verify active profiles before retaining all three).
  - `buildFlagshipProductSchema` (`schema.ts:115–246`) hardcodes `sku: siteConfig.flagshipProduct.sku` (`:142`), `size: "400 ml / 13.5 fl oz"` (`:156`), `priceValidUntil: "2027-12-31"` (`:198`), and `shippingRate.value: "100.00"` (`:211`) regardless of product price or threshold. Correctly omits `aggregateRating`/`review` because no real reviews exist in the DB.
  - `buildFounderNoteArticleSchema` (`schema.ts:263–294`) omits `image`, which is recommended for `Article` eligibility.
  - Missing page-type schemas: `/shop` lacks `CollectionPage` + `ItemList`; `/about` lacks `AboutPage`; `/shipping` lacks `WebPage` + `OfferShippingDetails` / `MerchantReturnPolicy`; `/privacy` lacks `WebPage`; `/reseller` lacks wholesale `Service` / `Offer`.
- **Policy note on `FAQPage` (`Info` priority):** Per Google's August 2023 update, `FAQPage` rich results are restricted to authoritative government and health sites. Keep existing `FAQPage` JSON-LD on `/`, `/faq`, `/products/[slug]`, and `/reseller` for AI/LLM answer-engine extraction, without expecting Google SERP FAQ dropdowns. Never add `HowTo` schema (deprecated September 2023).

### 4.5 Image SEO and social cards (`High`)

- **Declared vs actual pixel dimensions (`High`, M1):**

| Asset | Actual Dimensions | Misdeclared Dimensions & Files |
|---|---|---|
| `public/images/marula-baobab-body-lotion.jpg` | `764 x 1024` (portrait) | Declared `1200x900` in `layout.tsx:66–67`, `shop/page.tsx:38–39`, `products/[slug]/page.tsx:86–87`, `reseller/page.tsx:33–34` |
| `public/images/divinity-our-story.jpg` | `768 x 1376` (portrait) | Declared `1200x900` in `about/page.tsx:42–43` |
| `public/images/divinity-logo.png` | `306 x 174` | Declared `300x170` in `schema.ts:24–25` |
| `public/favicon.png` & `src/app/icon.png` (plus `src/app/apple-icon.png`) | `512 x 512` in `e288139`/disk (resized from `564 x 442` in pre-`e288139` `HEAD~1`); `apple-icon.png` is `180 x 180` | `layout.tsx:74–78` still misdeclares `192x192` and `180x180` on `/favicon.png`, duplicating the file-based `src/app/icon.png` and `src/app/apple-icon.png` conventions |

- **Missing `1200x630` social card & generic `alt` strings (`High`, M1, M3):** No `1200x630` horizontal Open Graph/Twitter asset exists today. `ProductCard.tsx:77` (`alt={product.name}`), `ProductGallery.tsx:32` (`alt={`${productName} — Botanical Skincare`}`), and `Hero.tsx:259, 452` (`alt="Divinity restorative cream formula"`) also omit volume, brand, and botanical context.
  - *Plan:* Generate a true `1200x630` OG/Twitter asset (or `opengraph-image.tsx` / `twitter-image.tsx`), fix `schema.ts` logo dimensions to `306x174`, deduplicate `icon.png` / `apple-icon.png` vs `layout.tsx` `icons` declarations, and write descriptive `alt` text on `ProductCard`, `ProductGallery`, and `Hero` (**M1, M3**).

### 4.6 AI search readiness / GEO and copy quality (`High`)

- **Strong baseline allowlist:** `src/app/robots.ts:21–37` explicitly permits `OAI-SearchBot`, `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Claude-Web`, `anthropic-ai`, `Google-Extended`, `Googlebot`, `Bingbot`, and `Applebot-Extended` to crawl `/`, `/llms.txt`, `/llms-full.txt`, and `/pricing.md`.
- **Gaps to fix (M3, M4):**
  1. Add 40–60 word direct-answer definition blocks and the *Divinity 400ml vs Standard Commercial Lotion* comparison table visibly in HTML on `/` or `/products/[slug]` and `/rituals`.
  2. Eliminate boilerplate repetition across `site.ts`, `seed.ts`, `Collection.tsx`, `Story.tsx`, `FAQSection.tsx`, `about`, `rituals`, `faq`, and `ShopClient.tsx` so each route targets its own non-competing search intent (Section 3.4 of Doc 02).
  3. Synchronise `llms.txt`, `llms-full.txt`, and `pricing.md` with exact code truth while keeping the Founder's Note untouched.

---

## 5. Verified discrepancy and compliance register

Every inconsistency below was verified directly in the repository and must be reconciled during M1, M3, and M4:

| # | Discrepancy | Claimed / Copy / AI Files | Codebase Truth / Conflicting File | Resolution Milestone |
|---|---|---|---|---|
| 1 | **Shipping rate & free-shipping waiver** | `site.ts:24–25` (`freeShippingThreshold: 500`, `standardShippingCost: 100`), `schema.ts:211` (`"100.00"`), `shipping/page.tsx:16, 63–66`, `faq/page.tsx:87`, `FAQSection.tsx:25`, `AddToCart.tsx:115, 208–210`, `Header.tsx:579`, `llms.txt:32`, `pricing.md:25–26` all state **R100 flat shipping and FREE over R500**. | `src/lib/domain/shipping/rates.ts:30–59` defaults to **R142 (`ECO`)**, **R210/R245 (`ONX`)**, **R295 (`SDX`)**; `checkout/page.tsx:49–89` uses `ECO` at **R142.00** and computes `finalTotal = cartTotal + shippingCost` with **no `>= R500` waiver**; `orders/service.ts:5, 103–106` only falls back to `100.0` if `shippingCost` is absent. | **M1** (`schema.ts` dynamic shippingRate) + **M4 / Business Logic** (align checkout waiver/rate or update all shipping copy & `llms*.txt` / `pricing.md`) |
| 2 | **Product SKU mismatch** | `public/pricing.md:11`: `DIV-MB-BL-400` | `site.ts:18`, `prisma/seed.ts:14`, `schema.ts:142`: **`DIV-MBL-400`** | **M4** (update `pricing.md:11` to `DIV-MBL-400`) |
| 3 | **Wholesale tier count** | `public/pricing.md:35–38`: Lists **2 tiers** (30%, 45%) | `reseller/ResellerClient.tsx:476–668`: Defines **3 tiers** (Starter Carton 30% / R280, **Studio Partner 38% / R248**, Premier Stockist 45% / R220) | **M4** (add Studio Partner 38% tier to `pricing.md`) |
| 4 | **Production URL in local env** | `.env.example:14`: `https://shopdivinitycosmetics.co.za` | `.env:63` & `.env.local:40`: `http://localhost:3000` | **M1 / M5** (build with production URL env) |
| 5 | **Wrong WhatsApp number & broken link** | `site.ts:7`: `+27 66 485 9011` (`27664859011`) | `checkout/success/page.tsx:621`: hardcodes `https://wa.me/27821234567`; `Footer.tsx:145–146`: links WhatsApp icon to `/checkout` | **M3** (`Footer.tsx`) + **M4** (`checkout/success/page.tsx`) |
| 6 | **US phone placeholder** | `en-ZA` South African B2B portal | `src/components/reseller/ResellerForm.tsx:196`: `placeholder="+1 (555) 000-0000"` | **M4** (change to SA format e.g. `+27 82 000 0000`) |
| 7 | **Provenance, dispatch hub & harvest swap** | `ResellerClient.tsx:338`: `"Authentic Cape Provenance"`; `:399`: `"Johannesburg fulfillment center"`; `Header.tsx:503`: `"Wild-harvested Limpopo Marula and cold-pressed Mpumalanga Baobab"` | `courierguy.ts:53–62`: hub is **Wright Crossing Shopping Centre, 70 Ermelo Rd, Strubenvale, Springs, Gauteng (`1559`)**; `site.ts:10`, `seed.ts:17`, `rituals/page.tsx:106–125`: **Cold-pressed** Limpopo Marula & **Wild-harvested** Mpumalanga Baobab (`10%` each per `Hero.tsx:299–329` & `AddToCart.tsx:97`, omitted in `seed.ts`/`llms*.txt`/`pricing.md`) | **M3** (`Header.tsx`, `seed.ts`) + **M4** (`ResellerClient.tsx`, `llms*.txt`, `pricing.md`) |
| 8 | **Unverified empirical & social-proof claims** | `ResellerClient.tsx:237, 352`: `"under 14 days"` / `"within 14 days"`; `:259`: `"Over 78% of clients repurchase within 90 days"`; `Hero.tsx:242, 434`: `"Recommended by 88+ women"` | No supporting study or verified DB order-cohort metrics exist in the codebase. Treat `"88+ women"` strictly as existing brand UI social proof without extrapolating clinical claims; remove `"14 days"` sell-through and `"78%"` repurchase assertions. | **M4** (`ResellerClient.tsx`) |
| 9 | **Asset dimensions & `sameAs` consistency** | `1200x900` declared on `764x1024` & `768x1376` JPGs; logo `300x170` vs `306x174`; `public/favicon.png` & `src/app/icon.png` are `512x512` in `e288139`/disk (resized from `564x442` in `HEAD~1`) and `src/app/apple-icon.png` is `180x180`, while `layout.tsx:74–78` misdeclares `192x192` / `180x180` on `/favicon.png` and duplicates `icon.png`/`apple-icon.png`; `schema.ts` `sameAs` lists IG/FB/TikTok while `Footer.tsx` renders FB only | Actual measured pixel sizes on disk and component links | **M1** (`metadata.ts`, OG `1200x630`, `schema.ts`, `icon.png`, `apple-icon.png`) + **M3** (`Footer.tsx`) |

---

## 6. Milestone implementation sequence

| Milestone | Scope Summary | Verification Gate |
|---|---|---|
| **M1** | Create `src/lib/seo/metadata.ts` (`buildPageMetadata`); strip leaking `alternates` from `layout.tsx`; fix `title.template`; add `1200x630` OG/Twitter assets; fix `robots.ts` & `sitemap.ts` (`getSitemapProducts()`, stable dates); isolate Zoho `no-store`; wrap `getProductBySlug` in `React.cache()`; add `headers()` & `images.formats` in `next.config.ts`; add `serializeJsonLd()` XSS escaping & schema fixes; lock `noIndex` metadata on all 8 private routes. | `next build` passes; `robots.txt`, `sitemap.xml`, and private route `noindex` headers validated. |
| **M3** | Fix `Hero.tsx` single mobile/desktop `<h1>`, `Header.tsx` mega-menu `<h4>` & search submit, `Footer.tsx` `<h4>`→`<h3>` & WhatsApp `/checkout` bug, `ShopClient.tsx` `?q=` `useSearchParams()` & headings, `Story.tsx` `priority` removal, `ProductCard.tsx` / `ProductGallery.tsx` / `Hero.tsx` `alt` text, `FAQAccordion.tsx` & `AddToCart.tsx` SSR DOM visibility, PDP visible `PRODUCT_FAQS` & `description`, and `prisma/seed.ts` copy/meta lengths. | Rendered HTML inspection confirms single `<h1>`, full SSR FAQ/PDP text, functional `/shop?q=`, and zero layout changes. |
| **M4** | Rewrite non-protected copy on `/about`, `/rituals`, `/faq`, `/reseller`, `/shipping`, `/contact`, `/privacy` using `avoid-ai-writing` rules; add bidirectional internal links (fixing `/privacy` 0-link dead end); add `<h1>` to `checkout/verify`; fix `checkout/success` `27821234567`, `ResellerForm` `+1 (555)`, Springs Gauteng hub, unverified `"14 days"` / `"78%"` claims, and sync `llms.txt`, `llms-full.txt`, `pricing.md` while keeping Founder's Note verbatim. | `git diff` confirms Founder's Note (`about/page.tsx:155–157, 181–237`; `llms-full.txt:26–56`) has zero byte changes; all discrepancies reconciled. |
| **M5** | Execute E2E verification suite (`scripts/seo-e2e/`) with `NEXT_PUBLIC_APP_URL=https://shopdivinitycosmetics.co.za`, validate all JSON-LD blocks, verify copy rubric via independent review, and complete Tier 5 hardening. | 100% pass across Technical SEO, Schema, Integrity, Copy Quality, and Layout Preservation Acceptance Criteria. |
