export const siteConfig = {
  name: "Divinity Cosmetics",
  domain: "shopdivinitycosmetics.co.za",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://shopdivinitycosmetics.co.za",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@shopdivinitycosmetics.co.za",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+27 66 485 9011",
  description: "Handcrafted South African botanicals for everyday rituals. Ethically sourced Marula, Baobab, and indigenous extracts.",
  freeShippingThreshold: 500.0,
  standardShippingCost: 100.0,
  location: "South Africa",
  social: {
    instagram: "https://instagram.com/divinitycosmetics",
    facebook: "https://facebook.com/divinitycosmetics",
    tiktok: "https://tiktok.com/@divinitycosmetics",
  },
};
