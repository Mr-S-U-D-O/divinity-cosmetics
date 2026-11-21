import { siteConfig } from "@/lib/config/site";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface FAQSchemaItem {
  question: string;
  answer: string;
}

export interface ProductSchemaInput {
  name?: string;
  slug?: string;
  sku?: string | null;
  description?: string;
  price?: number;
  compareAtPrice?: number | null;
  ingredients?: string[];
  concerns?: string[];
  inStock?: boolean;
  images?: string[];
  url?: string;
}

export interface ProductListItemInput {
  name: string;
  slug: string;
  sku?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  basePrice: number;
  compareAtPrice?: number | null;
  ingredients?: string[];
  concerns?: string[];
  inStock?: boolean;
  images?: string[];
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function toAbsoluteUrl(pathOrUrl: string): string {
  const trimmed = pathOrUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${siteConfig.url}${normalizedPath}`;
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "OnlineStore"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: toAbsoluteUrl("/images/divinity-logo.png"),
      width: 306,
      height: 174,
    },
    image: toAbsoluteUrl("/images/marula-baobab-body-lotion.jpg"),
    description: siteConfig.description,
    slogan:
      "Close the Vanity Divide: Facial-Grade Botanical Body Care for South Africa.",
    email: siteConfig.supportEmail,
    telephone: siteConfig.whatsappNumber,
    foundingLocation: {
      "@type": "Place",
      name: "South Africa",
    },
    areaServed: {
      "@type": "Country",
      name: "South Africa",
      identifier: "ZA",
    },
    priceRange: "R400 - R800",
    currenciesAccepted: "ZAR",
    paymentAccepted:
      "Credit Card, Debit Card, Instant EFT, Ozow, Capitec Pay, Apple Pay, Paystack, WhatsApp Concierge EFT",
    founder: {
      "@type": "Person",
      name: siteConfig.founderSignOff,
      jobTitle: "Founder & Formulator",
      worksFor: {
        "@id": `${siteConfig.url}/#organization`,
      },
    },
    knowsAbout: [
      "Cold-Pressed Marula Seed Oil (Sclerocarya birrea)",
      "Wild-Harvested Baobab Seed Oil (Adansonia digitata)",
      "Facial-Grade Botanical Body Care",
      "90-Day Skin Barrier Repair",
      "Crepey & Mature Skin Hydration",
      "South African Highveld Winter Skin Protection",
      "Trans-Epidermal Water Loss (TEWL) Prevention",
    ],
    sameAs: [siteConfig.social.facebook],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.whatsappNumber,
        email: siteConfig.supportEmail,
        contactType: "customer service",
        areaServed: "ZA",
        availableLanguage: ["English"],
      },
    ],
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en-ZA",
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

function buildProductEntity(overrides?: ProductSchemaInput) {
  const rawName = overrides?.name || siteConfig.flagshipProduct.name;
  const slug = overrides?.slug?.trim() || siteConfig.flagshipProduct.slug;
  const isFlagship = slug === siteConfig.flagshipProduct.slug;
  const formattedName =
    isFlagship && !rawName.toLowerCase().includes("400ml")
      ? `${rawName} (400ml)`
      : rawName;
  const sku = overrides?.sku?.trim() || siteConfig.flagshipProduct.sku;
  const price = overrides?.price ?? siteConfig.flagshipProduct.priceZar;
  const inStock = overrides?.inStock ?? true;
  const productUrl = overrides?.url
    ? toAbsoluteUrl(overrides.url)
    : toAbsoluteUrl(`/products/${slug}`);
  const shippingRate =
    price >= siteConfig.freeShippingThreshold
      ? "0.00"
      : siteConfig.standardShippingCost.toFixed(2);

  const images = (
    overrides?.images && overrides.images.length > 0
      ? overrides.images
      : [
          siteConfig.flagshipProduct.image,
          siteConfig.flagshipProduct.heroModelImage,
          siteConfig.flagshipProduct.detailImage,
        ]
  ).map((img) => toAbsoluteUrl(img));

  const additionalProperty = [
    {
      "@type": "PropertyValue",
      name: "Key Active Botanicals",
      value:
        "Cold-Pressed Marula Seed Oil (Sclerocarya birrea) & Wild-Harvested Baobab Seed Oil (Adansonia digitata)",
    },
    {
      "@type": "PropertyValue",
      name: "Absorption Profile",
      value:
        "Dense, nutrient-rich emulsion that absorbs in 2–3 minutes to form a physical 24-hour climate seal without evaporating",
    },
    {
      "@type": "PropertyValue",
      name: "Treatment Cycle",
      value: "90-Day Skin Barrier Restoration Cycle",
    },
    {
      "@type": "PropertyValue",
      name: "Formulation Standard",
      value:
        "Facial-Grade, Cruelty-Free, Paraben-Free, Sulfate-Free, No Synthetic Perfume Fillers",
    },
  ];

  if (overrides?.ingredients && overrides.ingredients.length > 0) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Key Ingredients",
      value: overrides.ingredients.join(", "),
    });
  }

  if (overrides?.concerns && overrides.concerns.length > 0) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "Skin Concerns Addressed",
      value: overrides.concerns.join(", "),
    });
  }

  const priceSpecification =
    overrides?.compareAtPrice && overrides.compareAtPrice > price
      ? {
          "@type": "UnitPriceSpecification",
          priceType: "https://schema.org/ListPrice",
          price: overrides.compareAtPrice.toFixed(2),
          priceCurrency: "ZAR",
        }
      : undefined;

  return {
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: formattedName,
    sku,
    mpn: sku,
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    manufacturer: {
      "@id": `${siteConfig.url}/#organization`,
    },
    category:
      "Health & Beauty > Personal Care > Cosmetics > Skin Care > Lotion & Moisturizer",
    description:
      overrides?.description ||
      "A facial-grade 400ml botanical body lotion formulated with high concentrations of cold-pressed South African Marula and wild-harvested Baobab seed oils. Designed for South African women aged 30–70 to seal the skin barrier for 24 hours against Highveld winters, harsh UV, and hard municipal water, softening crepey texture over a 90-day barrier repair cycle.",
    image: images,
    ...(isFlagship ? { size: "400 ml / 13.5 fl oz" } : {}),
    countryOfOrigin: {
      "@type": "Country",
      name: "South Africa",
    },
    audience: {
      "@type": "PeopleAudience",
      suggestedGender: "female",
      suggestedMinAge: 30,
      suggestedMaxAge: 70,
      geographicArea: {
        "@type": "Country",
        name: "South Africa",
      },
    },
    additionalProperty,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "ZAR",
      price: price.toFixed(2),
      ...(priceSpecification ? { priceSpecification } : {}),
      priceValidUntil: "2027-12-31",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@id": `${siteConfig.url}/#organization`,
      },
      shippingDetails: [
        {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: shippingRate,
            currency: "ZAR",
          },
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "ZA",
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 1,
              maxValue: 2,
              unitCode: "DAY",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 2,
              maxValue: 5,
              unitCode: "DAY",
            },
          },
        },
      ],
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "ZA",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };
}

export function buildFlagshipProductSchema(overrides?: ProductSchemaInput) {
  return {
    "@context": "https://schema.org",
    ...buildProductEntity(overrides),
  };
}

export function buildProductListSchema(products: ProductListItemInput[]) {
  const items =
    products.length > 0
      ? products
      : [
          {
            name: siteConfig.flagshipProduct.name,
            slug: siteConfig.flagshipProduct.slug,
            sku: siteConfig.flagshipProduct.sku,
            description: siteConfig.description,
            basePrice: siteConfig.flagshipProduct.priceZar,
            inStock: true,
            images: [siteConfig.flagshipProduct.image],
          },
        ];

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteConfig.url}/shop#webpage`,
    url: toAbsoluteUrl("/shop"),
    name: "Shop Facial-Grade Botanical Body Care | Divinity Cosmetics",
    description:
      "Shop Divinity Cosmetics facial-grade Marula & Baobab body care formulated in South Africa for 24-hour skin barrier hydration.",
    inLanguage: "en-ZA",
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    about: {
      "@id": `${siteConfig.url}/#organization`,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((product, index) => {
        const productUrl = toAbsoluteUrl(`/products/${product.slug}`);
        return {
          "@type": "ListItem",
          position: index + 1,
          url: productUrl,
          item: buildProductEntity({
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            description:
              product.description || product.shortDescription || undefined,
            price: product.basePrice,
            compareAtPrice: product.compareAtPrice,
            ingredients: product.ingredients,
            concerns: product.concerns,
            inStock: product.inStock ?? true,
            images: product.images,
            url: productUrl,
          }),
        };
      }),
    },
  };
}

export function buildFAQPageSchema(faqs: FAQSchemaItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildFounderNoteArticleSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteConfig.url}/about#founders-note`,
    headline:
      "A Personal Note from the Founder: Closing the Vanity Divide in South African Skincare",
    description:
      "Why women who invest R1,000 in facial serums should stop settling for watery R100 supermarket body lotions—and how cold-pressed Marula and Baobab oils rebuild a thinning moisture barrier over 90 days.",
    image: {
      "@type": "ImageObject",
      url: toAbsoluteUrl("/images/divinity-our-story.jpg"),
      width: 768,
      height: 1376,
    },
    author: {
      "@type": "Person",
      name: siteConfig.founderSignOff,
      jobTitle: "Founder",
      worksFor: {
        "@id": `${siteConfig.url}/#organization`,
      },
    },
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    mainEntityOfPage: toAbsoluteUrl("/about"),
    datePublished: "2026-10-01",
    dateModified: "2026-11-09",
    inLanguage: "en-ZA",
    about: [
      "The Vanity Divide in Skincare",
      "The 5-Second Lotion Evaporation Myth",
      "90-Day Skin Barrier Repair",
      "Marula and Baobab Body Lotion",
    ],
  };
}

export function buildAboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteConfig.url}/about#webpage`,
    url: toAbsoluteUrl("/about"),
    name: "Our Story & A Personal Note from the Founder | Divinity Cosmetics",
    description:
      "Learn how Divinity Cosmetics was founded in South Africa to close the Vanity Divide with cold-pressed Marula and Baobab botanical body care.",
    inLanguage: "en-ZA",
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    about: {
      "@id": `${siteConfig.url}/#organization`,
    },
    mainEntity: {
      "@id": `${siteConfig.url}/about#founders-note`,
    },
  };
}

export function buildRitualItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteConfig.url}/rituals#protocol`,
    name: "The Divinity Cosmetics 90-Day Barrier Repair Protocol",
    description:
      "A three-phase daily body care protocol using cold-pressed South African Marula and Baobab seed oils to restore a thinning skin barrier over 90 days.",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Days 1–14: The 24-Hour Physical Climate Seal",
        description:
          "Apply Divinity Marula & Baobab Body Lotion (400ml) within 3 minutes of stepping out of a warm shower. Allow 2–3 minutes for the dense oils to absorb and halt midday ashiness.",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Days 15–45: Deep Epidermal Lipid Replenishment",
        description:
          "Consistent daily application of oleic acid (Marula) and Omegas 3, 6, and 9 (Baobab) replenishes intercellular lipids stripped by hard municipal water and Highveld dry air.",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Days 46–90: Structural Barrier Renewal & Softened Crepey Texture",
        description:
          "Across a full 90-day epidermal turnover cycle, the moisture barrier rebuilds its natural thickness and bounce, softening crepey skin on arms, knees, elbows, and décolletage.",
      },
    ],
  };
}

export function buildContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteConfig.url}/contact#webpage`,
    name: "Contact Divinity Cosmetics South Africa",
    url: toAbsoluteUrl("/contact"),
    inLanguage: "en-ZA",
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    mainEntity: {
      "@id": `${siteConfig.url}/#organization`,
    },
  };
}

export function buildShippingWebPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/shipping#webpage`,
    url: toAbsoluteUrl("/shipping"),
    name: "Shipping & Returns Policy | Divinity Cosmetics",
    description:
      "Nationwide South African courier delivery across all 9 provinces: flat R100 shipping under R500, free delivery over R500, and a 14-day purity guarantee.",
    inLanguage: "en-ZA",
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    about: {
      "@id": `${siteConfig.url}/#organization`,
    },
    mainEntity: [
      {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "ShippingRateSettings",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: siteConfig.standardShippingCost.toFixed(2),
            currency: "ZAR",
          },
          freeShippingThreshold: {
            "@type": "MonetaryAmount",
            value: siteConfig.freeShippingThreshold.toFixed(2),
            currency: "ZAR",
          },
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "ZA",
          },
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "ZA",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
      {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "ZA",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    ],
  };
}

export function buildPrivacyWebPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/privacy#webpage`,
    url: toAbsoluteUrl("/privacy"),
    name: "Privacy Policy & POPIA Compliance | Divinity Cosmetics",
    description:
      "POPIA privacy notice, data protection practices, and Paystack payment security for Divinity Cosmetics (shopdivinitycosmetics.co.za).",
    inLanguage: "en-ZA",
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    about: {
      "@id": `${siteConfig.url}/#organization`,
    },
  };
}

export function buildResellerPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/reseller#webpage`,
    url: toAbsoluteUrl("/reseller"),
    name: "Authorized Stockist & Wholesale Program | Divinity Cosmetics",
    description:
      "South African wholesale stockist program for salons, aesthetic clinics, spas, and boutiques offering 30%–45% margins and protected local territories.",
    inLanguage: "en-ZA",
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    about: {
      "@id": `${siteConfig.url}/#organization`,
    },
    mainEntity: {
      "@type": "Service",
      name: "Divinity Cosmetics Authorized Stockist & Wholesale Program",
      serviceType: "Wholesale Botanical Skincare Supply",
      provider: {
        "@id": `${siteConfig.url}/#organization`,
      },
      areaServed: {
        "@type": "Country",
        name: "South Africa",
      },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "ZAR",
        lowPrice: "220.00",
        highPrice: "280.00",
        offerCount: 3,
        eligibleQuantity: {
          "@type": "QuantitativeValue",
          minValue: 12,
          unitCode: "EA",
        },
        url: toAbsoluteUrl("/reseller/apply"),
      },
    },
  };
}

export function buildHeroImageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${siteConfig.url}/#hero-model-showcase`,
    contentUrl: toAbsoluteUrl("/images/divinity-hero-model-showcase.jpg"),
    url: toAbsoluteUrl("/images/divinity-hero-model-showcase.jpg"),
    name: "Divinity Cosmetics Marula & Baobab Body Lotion (400ml) Model Showcase",
    caption:
      "Model with radiant, deeply hydrated skin holding Divinity Cosmetics Marula & Baobab Body Lotion (400ml), formulated with cold-pressed South African botanicals for 24-hour facial-grade barrier repair",
    description:
      "Editorial showcase of Divinity Cosmetics 400ml Marula & Baobab Body Lotion for South African skin barrier restoration, featuring model with glowing melanated skin against botanical backdrop.",
    representativeOfPage: true,
    creditText: "Divinity Cosmetics",
    copyrightHolder: {
      "@id": `${siteConfig.url}/#organization`,
    },
    license: siteConfig.url,
    acquireLicensePage: toAbsoluteUrl("/about"),
  };
}
