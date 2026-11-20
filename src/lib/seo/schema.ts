import { siteConfig } from "@/lib/config/site";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface FAQSchemaItem {
  question: string;
  answer: string;
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
      url: `${siteConfig.url}/images/divinity-logo.png`,
      width: 300,
      height: 170,
    },
    image: `${siteConfig.url}/images/marula-baobab-body-lotion.jpg`,
    description: siteConfig.description,
    slogan: "Close the Vanity Divide: Facial-Grade Botanical Body Care for South Africa.",
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
    priceRange: "R400 - R1,200",
    currenciesAccepted: "ZAR",
    paymentAccepted: "Credit Card, Debit Card, Instant EFT, Ozow, Capitec Pay, Apple Pay, Paystack, WhatsApp Concierge EFT",
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
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.facebook,
      siteConfig.social.tiktok,
    ],
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
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function buildFlagshipProductSchema(overrides?: {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  inStock?: boolean;
  images?: string[];
}) {
  const name = overrides?.name || siteConfig.flagshipProduct.name;
  const slug = overrides?.slug || siteConfig.flagshipProduct.slug;
  const price = overrides?.price ?? siteConfig.flagshipProduct.priceZar;
  const inStock = overrides?.inStock ?? true;
  const images = (
    overrides?.images && overrides.images.length > 0
      ? overrides.images
      : [
          siteConfig.flagshipProduct.image,
          siteConfig.flagshipProduct.heroModelImage,
          siteConfig.flagshipProduct.detailImage,
        ]
  ).map((img) => (img.startsWith("http") ? img : `${siteConfig.url}${img}`));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${siteConfig.url}/products/${slug}#product`,
    name: `${name} (400ml)`,
    sku: siteConfig.flagshipProduct.sku,
    mpn: siteConfig.flagshipProduct.sku,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    manufacturer: {
      "@id": `${siteConfig.url}/#organization`,
    },
    category: "Health & Beauty > Personal Care > Cosmetics > Skin Care > Lotion & Moisturizer",
    description:
      overrides?.description ||
      "A facial-grade 400ml botanical body lotion formulated with high concentrations of cold-pressed South African Marula and wild-harvested Baobab seed oils. Designed for South African women aged 30–70 to seal the skin barrier for 24 hours against Highveld winters, harsh UV, and hard municipal water, softening crepey texture over a 90-day barrier repair cycle.",
    image: images,
    size: "400 ml / 13.5 fl oz",
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
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Key Active Botanicals",
        value: "Cold-Pressed Marula Seed Oil (Sclerocarya birrea) & Wild-Harvested Baobab Seed Oil (Adansonia digitata)",
      },
      {
        "@type": "PropertyValue",
        name: "Absorption Profile",
        value: "Dense, nutrient-rich emulsion that absorbs in 2–3 minutes to form a physical 24-hour climate seal without evaporating",
      },
      {
        "@type": "PropertyValue",
        name: "Treatment Cycle",
        value: "90-Day Skin Barrier Restoration Cycle",
      },
      {
        "@type": "PropertyValue",
        name: "Formulation Standard",
        value: "Facial-Grade, Cruelty-Free, Paraben-Free, Sulfate-Free, No Synthetic Perfume Fillers",
      },
    ],
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${slug}`,
      priceCurrency: "ZAR",
      price: price.toFixed(2),
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
            value: "100.00",
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
    mainEntityOfPage: `${siteConfig.url}/about`,
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

export function buildHeroImageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${siteConfig.url}/#hero-model-showcase`,
    contentUrl: `${siteConfig.url}/images/divinity-hero-model-showcase.jpg`,
    url: `${siteConfig.url}/images/divinity-hero-model-showcase.jpg`,
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
    acquireLicensePage: `${siteConfig.url}/about`,
  };
}
