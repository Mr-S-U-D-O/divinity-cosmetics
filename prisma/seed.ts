import { PrismaClient, ProductStatus } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    name: "Body Lotion A",
    slug: "body-lotion-a",
    description: "Infused with African botanicals and cold-pressed marula oil. Deeply replenishes moisture barriers while soothing sensitive skin. Fast-absorbing, velvet finish.",
    shortDescription: "Deep hydration with cold-pressed marula oil",
    basePrice: 200.00,
    compareAtPrice: 250.00,
    images: ["/images/body-lotion-a.jpg"],
    category: "Body Care",
    status: ProductStatus.ACTIVE,
    badge: "BEST SELLER",
    concerns: ["Deep Hydration", "Soothing & Sensitive"],
    ingredients: ["Cold-Pressed Marula"],
    stock: 100,
    trackInventory: true,
    sortOrder: 1,
    metaTitle: "Body Lotion A | Divinity Cosmetics",
    metaDescription: "Premium African botanical body lotion with cold-pressed marula oil."
  },
  {
    name: "Body Lotion B",
    slug: "body-lotion-b",
    description: "Formulated with nourishing neroli, frankincense, and calming chamomile extract. Restores elasticity and revitalizes natural tone throughout the day. Ultra-hydrating and gentle.",
    shortDescription: "Calming elasticity with neroli & frankincense",
    basePrice: 45.00,
    compareAtPrice: 60.00,
    images: ["/images/body-lotion-b.jpg"],
    category: "Body Care",
    status: ProductStatus.ACTIVE,
    badge: "AWARD WINNER",
    concerns: ["Barrier Repair", "Soothing & Sensitive"],
    ingredients: ["Neroli & Frankincense", "Cape Chamomile"],
    stock: 100,
    trackInventory: true,
    sortOrder: 2,
    metaTitle: "Body Lotion B | Divinity Cosmetics",
    metaDescription: "Gentle restoring botanical body lotion with chamomile and neroli."
  },
  {
    name: "Radiance Face Oil",
    slug: "radiance-face-oil",
    description: "A potent blend of rosehip, squalane, and cold-pressed marula. Delivers an instant luminous glow while locking in deep moisture. Lightweight and non-comedogenic.",
    shortDescription: "Illuminating daily face oil with rosehip & marula",
    basePrice: 320.00,
    compareAtPrice: 380.00,
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800"],
    category: "Face Care",
    status: ProductStatus.ACTIVE,
    badge: "NEW HARVEST",
    concerns: ["Glow & Radiance", "Deep Hydration"],
    ingredients: ["Cold-Pressed Marula"],
    stock: 100,
    trackInventory: true,
    sortOrder: 3,
    metaTitle: "Radiance Face Oil | Divinity Cosmetics",
    metaDescription: "Cold-pressed Marula and rosehip botanical radiance face oil."
  },
  {
    name: "Clarifying Cleanser",
    slug: "clarifying-cleanser",
    description: "Gentle daily gel cleanser infused with salicylic acid and aloe vera. Sweeps away impurities without stripping the skin's natural barrier.",
    shortDescription: "Balancing gel wash with aloe & baobab",
    basePrice: 180.00,
    compareAtPrice: 220.00,
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800"],
    category: "Face Care",
    status: ProductStatus.ACTIVE,
    badge: "GENTLE CARE",
    concerns: ["Barrier Repair", "Soothing & Sensitive"],
    ingredients: ["Wild Baobab Oil"],
    stock: 100,
    trackInventory: true,
    sortOrder: 4,
    metaTitle: "Clarifying Cleanser | Divinity Cosmetics",
    metaDescription: "Non-stripping botanical daily facial cleanser."
  },
  {
    name: "Night Repair Serum",
    slug: "night-repair-serum",
    description: "Overnight recovery treatment featuring bakuchiol, Cape Chamomile, and peptides. Accelerates cellular renewal for visibly firmer, smoother skin by morning.",
    shortDescription: "Overnight restorative treatment with Cape Chamomile",
    basePrice: 450.00,
    compareAtPrice: 520.00,
    images: ["https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=800"],
    category: "Oils & Serums",
    status: ProductStatus.ACTIVE,
    badge: "FOUNDER'S CHOICE",
    concerns: ["Deep Hydration", "Barrier Repair"],
    ingredients: ["Cape Chamomile"],
    stock: 100,
    trackInventory: true,
    sortOrder: 5,
    metaTitle: "Night Repair Serum | Divinity Cosmetics",
    metaDescription: "Overnight botanical cellular repair serum."
  },
  {
    name: "The Botanical Routine",
    slug: "botanical-bundle",
    description: "Our signature three-step system: Clarifying Cleanser, Radiance Face Oil, and Night Repair Serum. The ultimate gift of glowing skin.",
    shortDescription: "Complete 3-step botanical skincare ritual",
    basePrice: 850.00,
    compareAtPrice: 950.00,
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800"],
    category: "Bundles",
    status: ProductStatus.ACTIVE,
    badge: "SPECIAL BUNDLE",
    concerns: ["Glow & Radiance", "Barrier Repair"],
    ingredients: ["Cold-Pressed Marula", "Wild Baobab Oil", "Neroli & Frankincense"],
    stock: 50,
    trackInventory: true,
    sortOrder: 6,
    metaTitle: "The Botanical Routine Bundle | Divinity Cosmetics",
    metaDescription: "Complete African botanical 3-piece skincare set."
  }
]

async function main() {
  console.log('Start seeding all products...')

  for (const item of products) {
    const existing = await prisma.product.findUnique({
      where: { slug: item.slug }
    })

    if (existing) {
      await prisma.product.update({
        where: { slug: item.slug },
        data: item
      })
      console.log(`Updated product: ${item.name}`)
    } else {
      await prisma.product.create({
        data: item
      })
      console.log(`Created product: ${item.name}`)
    }
  }

  console.log('Seeding finished successfully.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
