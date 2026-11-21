export const siteConfig = {
  name: "Divinity Cosmetics",
  legalName: "Divinity Cosmetics (Pty) Ltd",
  domain: "shopdivinitycosmetics.co.za",
  url: (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "https://shopdivinitycosmetics.co.za"
  ).replace(/\/+$/, ""),
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@shopdivinitycosmetics.co.za",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+27 66 485 9011",
  tagline: "Facial-Grade Botanical Body Care for South African Skin",
  description:
    "Divinity Cosmetics crafts facial-grade body treatments in South Africa using cold-pressed Marula and wild-harvested Baobab seed oils for 24-hour skin barrier hydration.",
  founderSignOff: "The Founder, Divinity Cosmetics",
  flagshipProduct: {
    name: "Marula & Baobab Body Lotion",
    slug: "marula-baobab-body-lotion",
    volume: "400ml",
    volumeImperial: "13.5 fl oz",
    priceZar: 400.0,
    sku: "DIV-MBL-400",
    category: "Body Care",
    image: "/images/marula-baobab-body-lotion.jpg",
    heroModelImage: "/images/divinity-hero-model-showcase.jpg",
    detailImage: "/images/marula-baobab-body-lotion.jpg",
  },
  standardShippingCost: 142.0,
  location: "South Africa",
  social: {
    instagram: "https://instagram.com/divinitycosmetics",
    facebook: "https://facebook.com/divinitycosmetics",
    tiktok: "https://tiktok.com/@divinitycosmetics",
  },
};
