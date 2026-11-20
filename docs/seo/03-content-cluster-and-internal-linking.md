# Topical content cluster plan and internal linking architecture

**Site:** Divinity Cosmetics (`https://shopdivinitycosmetics.co.za`)  
**Frameworks applied:** `seo-aeo-content-cluster` and `seo-aeo-internal-linking`  
**Alignment:** All URL slugs, primary keywords, secondary keywords, and AEO answer targets match `docs/seo/02-keyword-strategy.md`.

---

## 1. Hub-and-spoke architecture overview

Divinity Cosmetics currently indexes 10 public routes: `/` (brand overview), `/shop` (catalog), `/products/marula-baobab-body-lotion` (primary transactional PDP), `/rituals` (90-day application protocol), `/about` (The Vanity Divide and Founder's Note), `/faq` (Q&A support), `/reseller` (B2B wholesale), `/shipping`, `/contact`, and `/privacy`. No `/guides/` editorial hub exists in `src/app/` today.

Targeting problem-aware and climate-specific queries directly on the single product page or `/shop` would dilute transactional focus and trigger keyword cannibalization. Creating a dedicated `/guides/` editorial authority hub isolates informational education while routing qualified internal link equity (`Contextual Boost`) into `/products/marula-baobab-body-lotion`, `/rituals`, `/about`, and `/reseller`.

---

## 2. Pillar page specification

- **Proposed URL:** `/guides/skin-barrier-repair-body-care-south-africa`
- **Title:** *The Complete South African Guide to Body Skin Barrier Repair & Facial-Grade Botanical Care*
- **Target length:** 3,000–3,800 words
- **Primary keyword:** `skin barrier repair body care South Africa`
- **Secondary keywords:** `closing the vanity divide skincare`, `body lotion for mature skin 40 to 60 South Africa`, `facial-grade body lotion guide`
- **Target audience:** South African women aged 30–70 (core 40–60) experiencing thinning body skin, midday ashiness, crepey texture, Highveld winter dryness, UV stress, and hard municipal water irritation.
- **AEO 40–60 word direct-answer lead:**
  > Body skin barrier repair restores the lipid matrix of the stratum corneum over a 90-day epidermal turnover cycle. Unlike commercial lotions made of 80–85% water that evaporate within seconds, facial-grade emulsions rich in cold-pressed Marula oleic acid and Baobab Omegas 3, 6, and 9 seal trans-epidermal water loss for 24 hours against South Africa's dry winters and hard water.
- **Required comparison table:** *Water-Based Supermarket Pump Lotions (R80–R150) vs. Imported Luxury Body Creams (R1,200–R1,500+) vs. Concentrated African Botanical Emulsions (400ml @ R400)*.
- **Outline (`H2` / `H3`):**
  - `H2`: What is the body skin barrier and why does it thin after age 35?
  - `H2`: Closing the Vanity Divide between R1,000 facial serums and body care
  - `H2`: South African climate stressors (Highveld winter, UV, hard water, coastal shifts)
  - `H2`: Cold-pressed lipid science: 10% Limpopo Marula vs. 10% Mpumalanga Baobab
  - `H2`: The 90-day barrier repair timeline (Days 1–14, 15–45, 46–90)
  - `H2`: Comparison table and daily post-shower protocol
- **Differentiation from existing routes:** Unlike `/` (brand summary), `/about` (protected Founder's Note), `/rituals` (product step-by-step usage), and `/products/marula-baobab-body-lotion` (SKU purchase page), the Pillar covers stratum corneum biology, regional climate mechanics, and multi-stage barrier restoration in reference depth.

---

## 3. Prioritized cluster articles (12 articles across P1, P2, P3)

Articles flagged **★ AEO** are top extraction targets for AI Overviews, ChatGPT Search, Perplexity, and Claude due to question framing, 40–60 word definitions, and structured comparison tables.

### 3.1 Priority 1 cluster articles (publish first)

#### Article 1 — ★ AEO Priority
- **URL:** `/guides/why-body-lotion-evaporates-5-second-myth`
- **Title:** *Why Does Fast-Absorbing Body Lotion Leave Skin Dry? The 5-Second Myth Explained*
- **Content type:** Explainer
- **Primary keyword:** `why does body lotion leave skin dry`
- **Secondary keywords:** `why body lotion disappears in 5 seconds`, `water based vs oil based body lotion`
- **AEO question target & 40–60w lead:** *"Why does body lotion disappear in 5 seconds and leave skin ashy by midday?"* Explain how 80–85% water, denatured alcohol, and volatile silicones flash off the surface in seconds, whereas dense cold-pressed seed oils take 2–3 minutes to integrate and hold moisture for 24 hours.
- **Required table:** *Volatile Carriers & Fillers vs. Cold-Pressed Botanical Lipid Emulsions* (water percentage, absorption time, 1 PM skin state, barrier seal).
- **Outline:** `H2` Why instant-dry lotions feel light then fail by 1 PM -> `H2` Reading the first five ingredients on a supermarket pump -> `H2` Volatile vs. lipid-rich emulsion comparison -> `H2` How to test absorption density at home.
- **Differentiation:** Focuses on cosmetic chemistry and evaporation kinetics; `/rituals` covers Divinity's morning and evening shower routine.

#### Article 2 — ★ AEO Priority
- **URL:** `/guides/marula-vs-baobab-oil-body-care-comparison`
- **Title:** *Cold-Pressed Marula vs. Wild-Harvested Baobab Oil: Which Does Mature Body Skin Need?*
- **Content type:** Ingredient Comparison
- **Primary keyword:** `marula oil vs baobab oil for skin`
- **Secondary keywords:** `cold pressed marula oil benefits body`, `baobab oil omega fatty acids skin`
- **AEO question target & 40–60w lead:** *"What is the difference between Marula oil and Baobab oil for dry body skin?"* Contrast cold-pressed Limpopo Marula (`Sclerocarya birrea`, 70–78% oleic acid, Vitamins C and E, catechins) for deep lipid replenishment with wild-harvested Mpumalanga Baobab (`Adansonia digitata`, Omegas 3, 6, and 9, phytosterols) for surface elasticity and moisture locking.
- **Required table:** *Marula Seed Oil vs. Baobab Seed Oil* (botanical name, SA harvest region, fatty-acid profile, primary barrier role, why 10% + 10% pairing works).
- **Outline:** `H2` Marula vs. Baobab side-by-side table -> `H2` Why oleic acid penetrates thinning skin -> `H2` How Baobab phytosterols reinforce the outer seal -> `H2` Why cold-pressed extraction matters over heat refining.
- **Differentiation:** Comparative lipid biochemistry; `/products/marula-baobab-body-lotion` sells the finished 400ml formulation.

#### Article 3
- **URL:** `/guides/how-to-treat-crepey-skin-arms-legs-naturally`
- **Title:** *How to Improve Crepey Skin on Arms, Legs & Décolletage Over 90 Days*
- **Content type:** How-To Guide
- **Primary keyword:** `body lotion for crepey skin on arms and legs South Africa`
- **Secondary keywords:** `how to improve crepey skin naturally`, `thinning mature skin barrier repair`
- **AEO question target & 40–60w lead:** *"Can body lotion improve crepey skin on arms and legs?"* State realistically that while topical lotion cannot replace surgical procedures, consistent daily lipid replenishment over a 90-day epidermal turnover cycle softens dehydration lines and improves surface smoothness on thinning arms, legs, knees, and décolletage.
- **Required format:** Numbered 3-phase checklist (Days 1–14, 15–45, 46–90) + anatomical zone table (forearms, knees/elbows, shins, décolletage).
- **Outline:** `H2` What causes crepey texture in mature South African skin -> `H2` Why overnight claims fail -> `H2` Zone-by-zone lipid application guide -> `H2` Realistic milestones across 90 days.
- **Differentiation:** Anatomical zone care and dermatological expectations; `/faq` provides only a brief 3-sentence answer.

#### Article 4
- **URL:** `/guides/highveld-winter-dry-skin-body-care-routine`
- **Title:** *Highveld Winter Dry Skin: Protecting Your Body Against Low Humidity & Hard Water*
- **Content type:** How-To Guide (Regional Climate)
- **Primary keyword:** `best body lotion for dry Highveld winter skin`
- **Secondary keywords:** `stop ashy skin in Johannesburg winter`, `dry winter body care routine South Africa`
- **AEO question target & 40–60w lead:** *"How do you stop ashy, itchy skin during South African Highveld winters?"* Detail the 3-step routine: lukewarm showering to limit sebum stripping, applying concentrated cold-pressed lipid lotion within 3 minutes onto damp skin, and allowing 2–3 minutes for sealing before dressing.
- **Required format:** Numbered 4-step winter routine + summer vs. Highveld winter hydration comparison table.
- **Outline:** `H2` Why Gauteng and Free State winters strip body moisture faster -> `H2` The midday ashiness cycle on elbows and shins -> `H2` Step-by-step Highveld winter barrier routine -> `H2` Adjusting quantity across dry cold snaps.
- **Differentiation:** Climate-specific routine for inland provinces; `/shipping` covers courier logistics.

### 3.2 Priority 2 cluster articles (publish second)

#### Article 5
- **URL:** `/guides/what-is-transepidermal-water-loss-tewl-body`
- **Title:** *What Is Trans-Epidermal Water Loss (TEWL) and Why Body Skin Needs Lipid Seals*
- **Content type:** Science Explainer
- **Primary keyword:** `trans-epidermal water loss body skin`
- **Secondary keywords:** `how to seal moisture barrier on body`, `occlusive vs humectant body lotion`
- **AEO question target & 40–60w lead:** *"What is trans-epidermal water loss (TEWL) and how do cold-pressed oils stop it?"* Define TEWL as passive water evaporation through a weakened stratum corneum, showing why humectants alone pull moisture out in dry air unless paired with breathable botanical occlusives and emollients.
- **Required table:** *Humectants vs. Emollients vs. Botanical Lipid Seals* (mechanism, behavior in low-humidity air, key examples).
- **Outline:** `H2` Trans-epidermal water loss defined in plain language -> `H2` Why humectant-only lotions backfire in dry climates -> `H2` Emollients vs. occlusives comparison -> `H2` Building a 24-hour breathable seal.
- **Differentiation:** Pure skin-barrier physiology explainer not covered in depth anywhere on the storefront.

#### Article 6
- **URL:** `/guides/facial-grade-body-care-closing-vanity-divide`
- **Title:** *Facial-Grade Body Care: Why Your Body Deserves the Same Standard as Your Face*
- **Content type:** Opinion / Ingredient Audit Explainer
- **Primary keyword:** `closing the vanity divide body skincare`
- **Secondary keywords:** `facial grade body care meaning`, `clean body lotion without synthetic fragrance`
- **AEO question target & 40–60w lead:** *"What does facial-grade body care mean?"* Explain that facial-grade body care applies facial-serum formulation standards, high active botanical percentages (`10%` Marula, `10%` Baobab), and exclusion of parabens, mineral oil, and harsh synthetic perfume to the remaining 90% of the skin.
- **Required table:** *Facial Serum Standard vs. Supermarket Body Lotion vs. Facial-Grade Body Emulsion*.
- **Outline:** `H2` Auditing the two halves of a typical bathroom shelf -> `H2` Why facial skin is only 10% of the surface exposed to UV and air -> `H2` Ingredient standards that define facial-grade body care -> `H2` Moving from wardrobe anxiety to daily comfort.
- **Differentiation:** Analytical ingredient-audit perspective; `/about` preserves the Founder's personal story.

#### Article 7
- **URL:** `/guides/cost-per-ml-body-lotion-value-comparison-sa`
- **Title:** *Supermarket Pump Lotions vs. Concentrated Botanical Emulsions: A South African Value Audit*
- **Content type:** Commercial Comparison
- **Primary keyword:** `supermarket body lotion vs cold-pressed Marula oil lotion`
- **Secondary keywords:** `cost per ml body lotion comparison South Africa`, `R400 vs R100 body lotion value`
- **AEO question target & 40–60w lead:** *"Is a R400 botanical body lotion better value than a R100 supermarket pump?"* Show the ZAR math: at `R1.00/ml` (`R400` for `400ml`), a concentrated lipid emulsion applied once daily for 24-hour hydration replaces multiple reapplications of 80%-water lotions and undercuts R1,200–R1,500+ imported department-store creams.
- **Required table:** *ZAR Price-Per-ml & Reapplication Comparison* (R100 Supermarket 400ml vs. R400 Divinity `DIV-MBL-400` vs. R1,200+ Imported Luxury Cream).
- **Outline:** `H2` The hidden cost of reapplying watery lotions twice a day -> `H2` Price-per-ml comparison in South African Rand -> `H2` Comparing against R1,200+ imported creams -> `H2` How two 400ml bottles map to a 90-day cycle.
- **Differentiation:** Pure ZAR cost-and-value comparison routing high-intent buyers to `/products/marula-baobab-body-lotion`.

#### Article 8
- **URL:** `/guides/ingredients-to-avoid-in-mature-body-lotion`
- **Title:** *5 Fillers in Commercial Body Lotions That Irritate Thinning Mature Skin*
- **Content type:** Explainer / Label Checklist
- **Primary keyword:** `ingredients to avoid in body lotion mature skin`
- **Secondary keywords:** `paraben free mineral oil free body lotion South Africa`, `synthetic fragrance dry skin irritation`
- **AEO question target & 40–60w lead:** *"Which body lotion ingredients worsen dryness on mature skin?"* List five common commercial fillers: high-water dilution (80–85%), drying alcohols, mineral oil/petrolatum surface film without lipid nutrition, harsh sulfates, and heavy artificial fragrance allergens.
- **Required table:** *5 Common Lotion Fillers vs. Clean Botanical Alternatives*.
- **Outline:** `H2` Why mature skin reacts differently to cheap fillers -> `H2` The 5-ingredient label checklist -> `H2` Mineral oil slip vs. bio-available plant fatty acids -> `H2` What a clean INCI list looks like.
- **Differentiation:** Practical INCI label-reading checklist supporting `/faq` clean formulation standards.

### 3.3 Priority 3 cluster articles (publish third)

#### Article 9
- **URL:** `/guides/coastal-humidity-vs-inland-dryness-body-care`
- **Title:** *From Cape Town Coastal Winds to Gauteng Winters: Adapting Body Hydration Across SA*
- **Content type:** Regional Climate Guide
- **Primary keyword:** `body lotion for South African climate`
- **Secondary keywords:** `Cape Town vs Johannesburg skin dryness`, `UV damage body skin barrier`
- **AEO question target & 40–60w lead:** *"How does South Africa's climate affect body skin hydration across provinces?"* Compare dry high-altitude Highveld winters, gusty Western Cape coastal winds, and humid KwaZulu-Natal transitions, explaining why a breathable 24-hour lipid emulsion adapts across all 9 provinces without feeling suffocating.
- **Required table:** *South African Regional Climate Hydration Matrix* (Highveld inland, Western Cape coast, Subtropical coast, Karoo/arid interior).
- **Outline:** `H2` Why one routine fails across different SA provinces -> `H2` Regional climate matrix -> `H2` UV exposure on arms and décolletage year-round -> `H2` Adjusting application volume by season.
- **Differentiation:** Provincial skin-climate adaptation without duplicating `/shipping` courier zone timelines.

#### Article 10
- **URL:** `/guides/shower-temperature-hard-water-skin-barrier`
- **Title:** *Why Hot Showers & Hard Municipal Water Strip Your Skin Barrier (And the 3-Minute Fix)*
- **Content type:** How-To Guide
- **Primary keyword:** `hard municipal water dry skin body care South Africa`
- **Secondary keywords:** `how to stop midday ashiness on elbows knees and legs`, `apply body lotion on damp skin after shower`
- **AEO question target & 40–60w lead:** *"Should you apply body lotion on damp skin after a shower?"* Confirm yes: applying concentrated Marula and Baobab lotion within 3 minutes of patting dry traps residual surface hydration inside the lipid seal and offsets sebum stripping caused by hot water and dissolved municipal minerals.
- **Required format:** Numbered 3-minute post-shower checklist.
- **Outline:** `H2` What hard municipal water leaves behind on skin -> `H2` Why scalding winter showers trigger midday ashiness -> `H2` The 3-minute damp-skin sealing window -> `H2` Towel-patting vs. rubbing dry.
- **Differentiation:** Focuses on bathroom water chemistry and habit timing to support `/rituals`.

#### Article 11
- **URL:** `/guides/salon-retail-margins-botanical-body-care-sa`
- **Title:** *How South African Salons & Aesthetic Clinics Build Recurring Retail Revenue Without Chair Hours*
- **Content type:** B2B Guide
- **Primary keyword:** `salon retail skincare margins South Africa`
- **Secondary keywords:** `post peel body barrier aftercare clinic`, `botanical body lotion stockist South Africa`
- **AEO question target & 40–60w lead:** *"What retail margin should South African salons target on take-home body care?"* Outline benchmark boutique skincare retail margins of 30% to 45% across low-MOQ starter cartons (12 units at R280/unit) up to premier tiers (48+ units at R220/unit against a fixed R400 RRP), supported by territory protection.
- **Required table:** *Divinity B2B Wholesale Tier Economics* (Starter Carton 30% / 12–23 units, Studio Partner 38% / 24–47 units / 3km radius, Premier Stockist 45% / 48+ units / 5km radius). *(Note: Do not cite unverified sell-through or repurchase claims such as "14 days" or "78%".)*
- **Outline:** `H2` Why treatment-room revenue caps clinic growth -> `H2` Post-peel and wrap aftercare demand -> `H2` Comparing 30%, 38%, and 45% South African stockist tiers -> `H2` Territory protection and fixed R400 RRP integrity.
- **Differentiation:** B2B margin strategy feeding `/reseller` and `/reseller/apply` without competing with the commercial application page.

#### Article 12 — ★ AEO Priority
- **URL:** `/guides/marula-baobab-body-lotion-buyers-faq`
- **Title:** *Marula & Baobab Body Care Buyer's Guide: Texture, Absorption, 90-Day Yield & Gifting*
- **Content type:** Buyer's FAQ & Yield Guide
- **Primary keyword:** `how long does 400ml body lotion last`
- **Secondary keywords:** `Marula and Baobab body lotion usage guide`, `body care routine for women 40 to 70`
- **AEO question target & 40–60w lead:** *"How long does a 400ml bottle of concentrated Marula & Baobab lotion last?"* State directly that with daily full-body application, one 400ml bottle (`DIV-MBL-400`, R400) typically lasts 30 to 45 days (or 60–90 days depending on application surface area), making two bottles (R800) ideal for a complete 90-day barrier cycle.
- **Required table:** *Daily Usage Yield & Replenishment Guide* (target zones, single-bottle yield, 90-day 2-bottle plan, delivery options).
- **Outline:** `H2` Bottle yield and dosage by skin dryness -> `H2` Why the 2–3 minute sink-in texture differs from water pumps -> `H2` Paystack, Capitec Pay, Ozow, and WhatsApp Concierge ordering -> `H2` Return policy and transit protection.
- **Differentiation:** Pre-purchase usage math and texture expectations distinct from storewide support `/faq`.

---

## 4. Complete internal linking audit and map

### 4.1 Verified baseline link audit (existing codebase)

Every public page is reachable via `Header.tsx` and `Footer.tsx`, **but body-level internal linking is heavily siloed and contains verified bugs**:

1. **Dead-end page:** `src/app/(storefront)/privacy/page.tsx:1–91` contains **zero `<Link>` or `<a>` elements** in the page body.
2. **Broken / misrouted links:**
   - `src/components/layout/Footer.tsx:145–152`: WhatsApp Concierge icon links to `href="/checkout"` instead of `https://wa.me/27664859011`.
   - `src/app/(storefront)/checkout/success/page.tsx:621`: Hardcodes dummy `https://wa.me/27821234567` instead of `siteConfig.whatsappNumber`.
   - `src/components/layout/Header.tsx:441, 450, 459`: All three "Curated by Need" links (`Barrier Repair & Dryness`, `Highveld Winter Hydration`, `Cold-Pressed Seed Oils`) point to bare `/shop` with no filter query parameters (`ShopClient.tsx:24` does not read URL params).
   - `src/components/layout/Header.tsx:308–312`: Desktop search `<input>` has no submission or navigation handler to `/shop?q=...`.
   - `src/components/layout/Hero.tsx:380, 558`: Secondary CTA `"Our Rituals"` jumps to `#story` instead of linking to `/rituals`.
3. **One-way body silos:**
   - `products/[slug]/page.tsx:149` links only to `/shop` (`"Back to Shop"`), with zero contextual body links to `/rituals`, `/about#founders-note`, `/faq`, `/shipping`, or `/reseller`.
   - `about/page.tsx:170, 243` links only to `/products/marula-baobab-body-lotion` (0 links to `/rituals`, `/faq`, `/shipping`, `/reseller`).
   - `rituals/page.tsx:243, 249` links only to PDP and `/about#founders-note` (0 links to `/faq`, `/shipping`, `/shop`, `/reseller`).
   - `faq/FAQClient.tsx:105, 111` links only to PDP and WhatsApp (answers mentioning shipping and resellers at `faq/page.tsx:87, 101` lack `<Link>` tags).
   - `shipping/page.tsx:149` links only to PDP (0 links to `/order-status`, `/faq`, `/contact`, `/shop`).
   - `contact/page.tsx:101, 140, 159` links only to WhatsApp, `mailto:`, and PDP (0 links to `/faq`, `/shipping`, `/order-status`, `/reseller`).
   - `reseller/ResellerClient.tsx` links only to `/reseller/apply`, `#tiers`, and WhatsApp (0 links to PDP or `/rituals` for therapist product inspection).
   - `Story.tsx:50` links only to `/about` (0 links to `/rituals` despite its "5-Second Myth" card).

### 4.2 Immediate cross-linking fixes across existing routes (M3 / M4)

| Source Route / Component | Immediate Target Links to Add / Fix | Purpose |
|---|---|---|
| `Footer.tsx:145–152` | Replace `/checkout` with `https://wa.me/27664859011?...` | Fix broken WhatsApp concierge link (**M3**) |
| `Header.tsx:308–312, 441–459` | Wire search input to `/shop?q=...` and point Curated links to `/shop?q=...` or `/rituals` / PDP | Activate `SearchAction` and deep links (**M3**) |
| `Hero.tsx` & `Story.tsx` | Link Story's 5-Second Myth card to `/rituals`; keep `/about` link | Connect homepage narrative to protocol hub (**M3**) |
| `/products/[slug]` (`page.tsx` & `AddToCart.tsx`) | Link to `/rituals`, `/about#founders-note`, `/shipping`, `/faq`, and `/reseller` | Eliminate PDP isolation and pass authority (**M3**) |
| `/shop` (`ShopClient.tsx`) | Add contextual links to `/rituals`, `/shipping`, and `/faq` | Support catalog shoppers before checkout (**M3**) |
| `/about` | Add links outside Founder's Note (in S.T.O.R.Y. / Beliefs sections) to `/rituals`, `/faq`, `/shipping`, `/reseller` | Distribute brand-story equity without altering Founder's Note (**M4**) |
| `/rituals` | Add links to `/faq`, `/shipping`, `/shop`, `/reseller` | Connect 90-day protocol to buyer logistics (**M4**) |
| `/faq` | Add links to `/rituals`, `/shipping`, `/reseller`, `/order-status` | Turn plain-text policy mentions into crawlable paths (**M4**) |
| `/shipping` | Add links to `/order-status`, `/faq`, `/contact`, `/shop` | Complete post-purchase & pre-purchase support loop (**M4**) |
| `/contact` | Add links to `/shipping`, `/order-status`, `/faq`, `/reseller` | Reduce support friction (**M4**) |
| `/privacy` | Add outbound links to `/shipping`, `/contact`, `/faq`, `/shop` | Fix confirmed 0-outbound-link dead end (**M4**) |
| `/reseller` | Add links to `/products/marula-baobab-body-lotion`, `/rituals`, `/shipping` | Let clinic buyers inspect retail formula and courier logistics (**M4**) |

### 4.3 Planned Cluster ↔ Pillar ↔ Commercial link matrix (Phase 2+)

Following `seo-aeo-internal-linking/SKILL.md`, every link is assigned one of four relationship types:
1. **`Cluster -> Pillar` (Upward consolidation):** All 12 `/guides/*` articles link to `/guides/skin-barrier-repair-body-care-south-africa` in their opening context or summary block.
2. **`Pillar -> Cluster` (Downward distribution):** The Pillar page links down to all 12 articles across themed sections (Evaporation & Lipids, SA Climate & Hard Water, Clean Value Audits, B2B & Usage).
3. **`Cluster -> Cluster` (Horizontal semantic depth):**
   - Article 1 (`5-second-myth`) ↔ Article 2 (`marula-vs-baobab`) ↔ Article 5 (`tewl`)
   - Article 3 (`crepey-skin`) ↔ Article 4 (`highveld-winter`) ↔ Article 10 (`hard-water`)
   - Article 6 (`facial-grade`) ↔ Article 7 (`cost-per-ml`) ↔ Article 8 (`ingredients-to-avoid`)
   - Article 9 (`coastal-vs-inland`) ↔ Article 4 (`highveld-winter`)
   - Article 11 (`salon-margins`) ↔ `/reseller` and `/reseller/apply`
   - Article 12 (`buyers-faq`) ↔ Article 7 (`cost-per-ml`), `/faq`, and `/products/marula-baobab-body-lotion`
4. **`Contextual Boost` (Commercial equity transfer):**
   - Articles 1–10 and 12 each place 1 contextual link to `/products/marula-baobab-body-lotion` and 1 contextual link to `/rituals`.
   - Article 11 places contextual links to `/reseller` and `/reseller/apply`.
   - Existing `/rituals`, `/faq`, and `/about` (outside the locked Founder's Note) add contextual links into the Pillar and top P1 guides once `/guides/` ships.

### 4.4 Anchor-text rules, sample placements, and orphan/cannibalization checks

- **Anchor-text constraints:**
  - Never use generic anchors (`"click here"`, `"read more"`, `"learn more"`, or raw URLs).
  - Use each exact-match keyword anchor **at most once** per target URL across the site; vary subsequent links with descriptive partial-match and branded anchors.
  - Keep total outgoing internal links per page well under 100 (current storefront sits around 15–25 including `Header.tsx` and `Footer.tsx`; planned guides will sit around 20–30).
- **Sample contextual placements (ready for implementation):**
  - *Existing PDP -> `/rituals`:* `Follow the daily [90-day skin barrier repair ritual](/rituals) to apply cold-pressed Marula and Baobab lipids within three minutes of showering.`
  - *Existing `/privacy` -> `/shipping` & `/contact`:* `For parcel handling and return windows, review our [South African courier and 14-day return policy](/shipping), or reach our Information Officer through the [Divinity Cosmetics contact page](/contact).`
  - *Cluster Article 1 -> Pillar (`Cluster -> Pillar`):* `To see how lipid replenishment fits into a full seasonal routine, read our [South African guide to body skin barrier repair](/guides/skin-barrier-repair-body-care-south-africa).`
  - *Cluster Article 4 -> PDP (`Contextual Boost`):* `Pair lukewarm showers with a dense lipid emulsion such as [Divinity Marula & Baobab Body Lotion (400ml)](/products/marula-baobab-body-lotion) to seal moisture for 24 hours.`
  - *Cluster Article 11 -> B2B (`/reseller`):* `Clinics and salons looking for 30% to 45% retail margins can review wholesale tiers on the [South African skincare stockist program](/reseller) page.`
- **Orphan prevention & cannibalization verification:**
  - Every existing public route receives inbound links from `Header.tsx`/`Footer.tsx` plus contextual body links after M3/M4.
  - Every future `/guides/*` URL receives at least 3 inbound links (from `/guides` index, from the Pillar page, and from 1–2 sibling cluster articles) and appears in `src/app/sitemap.ts` and `public/llms.txt` at launch.
  - Primary keyword assignments in Section 3 match `docs/seo/02-keyword-strategy.md` one-to-one with zero duplicate primary targets across existing or planned routes.
