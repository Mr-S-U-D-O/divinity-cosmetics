# Keyword strategy and AEO query map (South Africa)

**Site:** Divinity Cosmetics (`https://shopdivinitycosmetics.co.za`)  
**Locale:** `en-ZA` (South Africa, ZAR `R`)  
**Methodology:** `seo-aeo-keyword-research` framework adapted for codebase-inferred market research without live keyword API telemetry.

---

## 1. Methodology and metric limitations

### Zero-fabrication policy
No live search-volume, keyword-difficulty, cost-per-click, or Search Console API (such as Google Ads Keyword Planner, Ahrefs, SEMrush, or DataForSEO) is connected in this workspace. Monthly search volumes, CPC estimates, and numeric keyword difficulty (0–100) scores are intentionally omitted rather than invented.

### Verified codebase facts vs. qualitative estimates
Every persona attribute, price point, ingredient percentage, climate stressor, and payment or courier rail in Section 2 is verified directly from source files in `src/`, `prisma/`, and `public/`. Priority and difficulty tiers in Sections 3 and 4 are qualitative strategic estimates based on South African SERP competition dynamics, where national multi-brand retailers (Clicks, Dis-Chem, Takealot, Superbalist) dominate broad head terms but leave specialized South African barrier-repair, botanical lipid, and B2B stockist queries underserved.

### Qualitative tier definitions
- **Tier 1 (Target first, low-to-moderate competition):** Branded queries, South African climate and hard-water long-tails, ZAR/400ml commercial product queries, ingredient comparison questions, and South African clinic/salon wholesale stockist terms.
- **Tier 2 (Build authority second, medium competition):** Solution-aware body barrier repair, crepey mature skin queries, cold-pressed Marula and Baobab benefit terms, and value comparisons against imported luxury creams.
- **Tier 3 (Long-term equity goal, high competition):** Broad national category head terms (`body lotion South Africa`, `dry skin moisturiser South Africa`) held by large retail marketplaces and mass-market FMCG brands.

---

## 2. Inferred South African target market and audience signals

### 2.1 Primary B2C persona (South African women aged 30–70, core 40–60)
- **The Vanity Divide (`about/page.tsx:193–214`, `llms.txt:8`):** Customers who spend R300 to R1,000 on facial serums and moisturisers (10% of their skin) while buying R80 to R150 water-based supermarket pump lotions for the remaining 90% of their body, and who avoid R1,200 to R1,500+ imported luxury body creams.
- **Formulation and absorption gap ("5-Second Myth" and "90-Day Cycle"):** Commercial lotions are 80–85% water, alcohol, mineral oil/petrolatum, and heavy synthetic fragrance that evaporate in 5 seconds (`Story.tsx:72–75`, `faq/page.tsx:39–53`). Divinity's emulsion (`DIV-MBL-400`, 400ml, R400.00 ZAR incl. VAT, R1.00/ml) combines 10% cold-pressed Limpopo Marula seed oil (`Sclerocarya birrea`, 70–78% oleic acid, antioxidants, Vitamins C and E) and 10% wild-harvested Mpumalanga Baobab seed oil (`Adansonia digitata`, Omegas 3, 6, 9 and phytosterols). It takes 2 to 3 minutes to sink in, forming a 24-hour physical lipid seal across a 90-day cellular renewal cycle (`Hero.tsx:299–329`, `AddToCart.tsx:97`, `rituals/page.tsx:106–213`).
- **South African environmental stressors:** Biting dry Highveld winters (Johannesburg, Pretoria), strong UV radiation, hard municipal water that strips natural sebum during warm showers, and coastal humidity shifts across all 9 provinces (`site.ts:10`, `about/page.tsx:199`, `rituals/page.tsx:125, 157`).
- **Physical pain points and wardrobe anxiety:** Thinning moisture barrier, midday (1 PM) ashiness on elbows, knees, and legs, tight or itchy skin after showering, crepey skin texture on arms, legs, and décolletage, and choosing clothing to hide dry limbs (`seed.ts:28–31`, `about/page.tsx:208`).
- **South African checkout and fulfillment rails:** Paystack PCI-DSS Level 1 checkout supporting Visa, Mastercard, Capitec Pay, Ozow Instant EFT, and Apple Pay with zero surcharge; direct WhatsApp Concierge (`+27 66 485 9011`); and nationwide courier delivery via The Courier Guy / Shiplogic dispatched from Springs, Gauteng (`1559`) in 2–4 business days (metro) and 3–5 business days (regional) (`checkout/page.tsx:683–868`, `courierguy.ts:57–62`, `shipping/page.tsx:100–140`).

### 2.2 Secondary B2B persona (South African clinics, spas, salons, lodges)
- **Target verticals (`ResellerClient.tsx:277–340`, `reseller/page.tsx:70`):** Aesthetic and dermal clinics (post-chemical peel and laser aftercare), day spas and wellness sanctuaries, boutique salons and studios, qualified somatologists and mobile dermal practitioners, and safari lodges and luxury boutiques.
- **Wholesale structure (`ResellerClient.tsx:475–668`):** 12-unit minimum order quantity (Starter Carton: 12–23 units, 30% margin, R280/unit; Studio Partner: 24–47 units, 38% margin, R248/unit, 3km territory protection; Premier Stockist: 48+ units, 45% margin, R220/unit, 5km exclusive territory protection), strict R400.00 incl. VAT RRP enforcement, 24-hour dispatch, and 2–4 day delivery.

---

## 3. Traditional search keyword universe (zero cannibalization)

Every target URL below maps to either an existing storefront route or a planned `/guides/` URL defined identically in `docs/seo/03-content-cluster-and-internal-linking.md`.

### 3.1 Existing storefront route keywords

| ID | Primary & Close Variant Keywords | Search Intent | Segment | Qualitative Tier | Assigned Target URL |
|---|---|---|---|---|---|
| **K1** | `Divinity Cosmetics South Africa` / `facial-grade botanical body care South Africa` | Branded / Category | B2C | Tier 1 | `/` |
| **K2** | `shop botanical body lotion South Africa` / `cold-pressed African botanical body care` | Transactional / Catalog | B2C | Tier 2 | `/shop` |
| **K3** | `Marula and Baobab body lotion 400ml` / `buy Marula body lotion South Africa R400` | Transactional / SKU | B2C | Tier 1 | `/products/marula-baobab-body-lotion` |
| **K4** | `24 hour hydration body lotion South Africa` / `DIV-MBL-400 body lotion` | Commercial / SKU | B2C | Tier 2 | `/products/marula-baobab-body-lotion` |
| **K5** | `90 day skin barrier repair body ritual` / `how to apply Marula and Baobab body lotion` | Informational / Protocol | B2C | Tier 1 | `/rituals` |
| **K6** | `cold-pressed Marula and Baobab oil skin benefits` | Informational / Ingredient | B2C | Tier 2 | `/rituals` |
| **K7** | `The Vanity Divide skincare South Africa` / `Divinity Cosmetics founder story` | Branded / Editorial | B2C | Tier 1 | `/about` |
| **K8** | `Divinity Cosmetics FAQ ingredients delivery` | Navigational / Support | B2C | Tier 1 | `/faq` |
| **K9** | `skincare stockist program South Africa` / `wholesale body lotion for salons and spas South Africa` | B2B Commercial / Transactional | B2B | Tier 1 | `/reseller` |
| **K10** | `Divinity Cosmetics shipping returns The Courier Guy` | Navigational / Support | B2C | Tier 1 | `/shipping` |
| **K11** | `Divinity Cosmetics WhatsApp concierge contact` | Navigational / Support | B2C/B2B | Tier 1 | `/contact` |
| **K12** | `Divinity Cosmetics POPIA privacy policy` | Navigational / Trust | B2C | Tier 1 | `/privacy` |

### 3.2 Planned editorial authority hub keywords (`/guides/`)

| ID | Primary Keyword | Secondary / Semantic Keywords | Search Intent | Segment | Qualitative Tier | Assigned Target URL |
|---|---|---|---|---|---|---|
| **K13** | `skin barrier repair body care South Africa` | `closing the vanity divide skincare`, `body lotion for mature skin 40 to 60 South Africa`, `facial-grade body lotion guide` | Pillar / Informational + Commercial | B2C | Tier 2 | `/guides/skin-barrier-repair-body-care-south-africa` (Pillar) |
| **K14** | `why does body lotion leave skin dry` | `why body lotion disappears in 5 seconds`, `water based vs oil based body lotion` | Informational / Problem | B2C | Tier 1 | `/guides/why-body-lotion-evaporates-5-second-myth` |
| **K15** | `marula oil vs baobab oil for skin` | `cold pressed marula oil benefits body`, `baobab oil omega fatty acids skin` | Informational / Comparison | B2C | Tier 2 | `/guides/marula-vs-baobab-oil-body-care-comparison` |
| **K16** | `body lotion for crepey skin on arms and legs South Africa` | `how to improve crepey skin naturally`, `thinning mature skin barrier repair` | Commercial / Problem | B2C | Tier 1 | `/guides/how-to-treat-crepey-skin-arms-legs-naturally` |
| **K17** | `best body lotion for dry Highveld winter skin` | `stop ashy skin in Johannesburg winter`, `dry winter body care routine South Africa` | Commercial / Geo-Climate | B2C | Tier 1 | `/guides/highveld-winter-dry-skin-body-care-routine` |
| **K18** | `trans-epidermal water loss body skin` | `how to seal moisture barrier on body`, `occlusive vs humectant body lotion` | Informational / Science | B2C | Tier 2 | `/guides/what-is-transepidermal-water-loss-tewl-body` |
| **K19** | `closing the vanity divide body skincare` | `facial grade body care meaning`, `clean body lotion without synthetic fragrance` | Informational / Editorial | B2C | Tier 1 | `/guides/facial-grade-body-care-closing-vanity-divide` |
| **K20** | `supermarket body lotion vs cold-pressed Marula oil lotion` | `cost per ml body lotion comparison South Africa`, `R400 vs R100 body lotion value` | Commercial / Comparison | B2C | Tier 1 | `/guides/cost-per-ml-body-lotion-value-comparison-sa` |
| **K21** | `ingredients to avoid in body lotion mature skin` | `paraben free mineral oil free body lotion South Africa`, `synthetic fragrance dry skin irritation` | Informational / Checklist | B2C | Tier 2 | `/guides/ingredients-to-avoid-in-mature-body-lotion` |
| **K22** | `body lotion for South African climate` | `Cape Town vs Johannesburg skin dryness`, `UV damage body skin barrier` | Informational / Geo | B2C | Tier 2 | `/guides/coastal-humidity-vs-inland-dryness-body-care` |
| **K23** | `hard municipal water dry skin body care South Africa` | `how to stop midday ashiness on elbows knees and legs`, `apply body lotion on damp skin after shower` | Informational / Habit | B2C | Tier 1 | `/guides/shower-temperature-hard-water-skin-barrier` |
| **K24** | `salon retail skincare margins South Africa` | `post peel body barrier aftercare clinic`, `botanical body lotion stockist South Africa` | B2B Informational | B2B | Tier 1 | `/guides/salon-retail-margins-botanical-body-care-sa` |
| **K25** | `how long does 400ml body lotion last` | `Marula and Baobab body lotion usage guide`, `body care routine for women 40 to 70` | Commercial / Buyer FAQ | B2C | Tier 1 | `/guides/marula-baobab-body-lotion-buyers-faq` |
| **K26** | `body lotion South Africa` / `dry skin moisturiser South Africa` | `natural body lotion South Africa` | Broad Head Term | B2C | Tier 3 | Long-term `/shop` + Pillar equity consolidation |

---

## 4. AEO question queries and prescribed answer formats

These 12 high-intent conversational queries target AI Overviews, ChatGPT Search, Perplexity, Claude, and Google People Also Ask boxes. Each entry prescribes the exact structural format required for citation extraction.

| # | AEO Question Query | Prescribed Answer Format | Key Facts to Include | Target URL |
|---|---|---|---|---|
| **A1** | *Why does my body lotion disappear in 5 seconds and leave my skin ashy by midday?* | **Definition block (40–60 words)** + **Comparison table** | 80–85% water, denatured alcohol, and volatile fillers flash off quickly, leaving the stratum corneum unsealed; cold-pressed lipid emulsions take 2–3 minutes to seal TEWL for 24 hours. | `/faq` (summary) + `/guides/why-body-lotion-evaporates-5-second-myth` (full) |
| **A2** | *Why does Divinity Marula & Baobab Body Lotion take 2 to 3 minutes to sink in?* | **Definition sentence** + **Direct number** | `2–3 minutes` absorption window reflects dense `10%` cold-pressed Marula and `10%` wild-harvested Baobab seed oils forming a breathable 24-hour barrier seal rather than evaporating. | `/products/marula-baobab-body-lotion` & `/faq` |
| **A3** | *What is the best body lotion for crepey skin on arms and legs in South Africa?* | **Comparison table** + **Definition sentence** | Compare water-based supermarket pumps vs imported creams vs concentrated `DIV-MBL-400` (`400ml, R400`); note realistic 90-day epidermal turnover cycle rather than overnight claims. | `/guides/how-to-treat-crepey-skin-arms-legs-naturally` & `/products/marula-baobab-body-lotion` |
| **A4** | *How long does skin barrier repair take for mature, dry body skin?* | **Direct number** + **Numbered steps** | `90-day` cellular turnover cycle segmented into Phase 1 (Days 1–14 hydration comfort), Phase 2 (Days 15–45 midday ashiness reduction), Phase 3 (Days 46–90 smoother texture). | `/rituals` |
| **A5** | *How do you apply Marula and Baobab body lotion for 24-hour hydration in Highveld winters?* | **Numbered steps** | 1. Shower in warm (not scalding) water. 2. Pat lightly and apply within `3 minutes` on damp skin. 3. Massage for `2–3 minutes` until sealed before dressing. | `/rituals` & `/guides/highveld-winter-dry-skin-body-care-routine` |
| **A6** | *What is the difference between Marula oil and Baobab oil for body skincare?* | **Comparison table** + **Definition sentence** | Marula (`Sclerocarya birrea`, 70–78% oleic acid, Vitamins C and E, catechins) penetrates deeply; Baobab (`Adansonia digitata`, Omegas 3, 6, 9, phytosterols) reinforces surface elasticity and moisture retention. | `/guides/marula-vs-baobab-oil-body-care-comparison` |
| **A7** | *How much does Divinity Cosmetics Marula & Baobab Body Lotion cost in South Africa?* | **Direct number** | `R400.00 ZAR` incl. VAT for `400ml` (`R1.00/ml`, SKU `DIV-MBL-400`); two bottles (`800ml`) cost `R800.00 ZAR` for a full 90-day barrier cycle. | `/products/marula-baobab-body-lotion` & `/guides/marula-baobab-body-lotion-buyers-faq` |
| **A8** | *How long does delivery take across South Africa and what payment methods are accepted?* | **Direct list** + **Direct number** | `2–4 business days` (Johannesburg, Pretoria, Cape Town, Durban) and `3–5 business days` (regional) via The Courier Guy from Springs, Gauteng; Paystack (Visa, Mastercard, Capitec Pay, Ozow Instant EFT, Apple Pay) and WhatsApp Concierge (`+27 66 485 9011`). *(Shipping rate copy to match reconciled checkout policy.)* | `/shipping` & `/faq` |
| **A9** | *What is the Vanity Divide in skincare?* | **Definition block (40–60 words)** | The gap between spending R300–R1,000 on clean facial serums (10% of skin) while using R80–R150 water-heavy supermarket lotions on the remaining 90% of the body. | `/about` & `/guides/facial-grade-body-care-closing-vanity-divide` |
| **A10** | *Does hard municipal water cause dry, flaky skin on legs and arms?* | **Definition sentence** + **Numbered steps** | Mineral ions and hot water strip protective surface sebum; sealing damp skin within `3 minutes` of drying restores the lipid barrier. | `/guides/shower-temperature-hard-water-skin-barrier` |
| **A11** | *What are the minimum order quantity and retail margins to stock Divinity Cosmetics in a South African salon?* | **Comparison table** | `12-unit MOQ`; Starter Carton (`12–23 units`, `30%` margin, `R280/unit`), Studio Partner (`24–47 units`, `38%` margin, `R248/unit`, `3km` territory), Premier Stockist (`48+ units`, `45%` margin, `R220/unit`, `5km` territory); fixed `R400` RRP. | `/reseller` & `/guides/salon-retail-margins-botanical-body-care-sa` |
| **A12** | *What botanical skincare products is Divinity Cosmetics launching next?* | **Direct list** | Botanical Body Oils, Facial-Grade Barrier Serums, and 90-Day Ritual Refill Bundles (all currently marked Coming Soon in `pricing.md:19–22`). | `/shop` & `/rituals` |

---

## 5. Cannibalization audit and resolution rules

1. **Homepage `/` vs. `/shop` vs. `/products/marula-baobab-body-lotion`:** Currently, `(storefront)/page.tsx:19`, `shop/page.tsx:15`, `products/[slug]/page.tsx:55`, and `prisma/seed.ts:39` all target `"Marula & Baobab Body Lotion (400ml)"` in `<title>` and meta descriptions.
   - *Rule:* `/` targets brand identity and category positioning (`Facial-Grade Botanical Body Care South Africa`). `/shop` targets catalog browsing (`Shop Botanical Formulations`). `/products/marula-baobab-body-lotion` owns the SKU-level transactional intent (`Marula & Baobab Body Lotion 400ml — R400`).
2. **`/about` vs. `/rituals` vs. `/faq`:** Boilerplate phrases (`"watery supermarket lotions"`, `"evaporate in 5 seconds"`, `"Highveld winters"`) repeat verbatim across all three routes.
   - *Rule:* `/about` owns the **Vanity Divide** thesis and protected **Founder's Note**; `/rituals` owns the **3-phase 90-day application protocol** and **10% Marula / 10% Baobab lipid science**; `/faq` owns **buyer, texture, and delivery objections**.
3. **`/guides/*` vs. commercial storefront pages:** Problem-aware queries (`crepey skin`, `Highveld winter dryness`, `hard water`, `5-second myth`, `TEWL`, `salon retail margins`) live exclusively under `/guides/*` and pass internal link equity upward to `/products/marula-baobab-body-lotion`, `/rituals`, `/about`, and `/reseller` without bidding on SKU transactional terms.

---

## 6. Content production order summary

1. **Immediate (M1/M3/M4):** Optimize metadata, headings, SSR FAQ/PDP visibility, and non-cannibalizing copy on all 10 existing public routes (`/`, `/shop`, `/products/marula-baobab-body-lotion`, `/rituals`, `/about`, `/faq`, `/reseller`, `/shipping`, `/contact`, `/privacy`).
2. **Wave 1 Editorial (Phase 2, Months 2–3):** Publish Pillar (`/guides/skin-barrier-repair-body-care-south-africa`) and Priority 1 cluster guides (`K14` 5-Second Myth, `K15` Marula vs Baobab, `K16` Crepey Skin, `K17` Highveld Winter).
3. **Wave 2 Editorial (Phase 2, Month 4):** Publish Priority 2 cluster guides (`K18` TEWL, `K19` Vanity Divide, `K20` Cost-per-ml Value Audit, `K21` Ingredients to Avoid).
4. **Wave 3 Editorial & B2B (Phase 3, Months 4–6):** Publish Priority 3 cluster guides (`K22` SA Regional Climates, `K23` Hard Water & Showers, `K24` Salon Retail Margins, `K25` 400ml Buyer's FAQ).
