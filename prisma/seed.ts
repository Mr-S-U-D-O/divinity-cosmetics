import { PrismaClient, ProductStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clear existing products (safe for early development)
  await prisma.orderItem.deleteMany()
  await prisma.product.deleteMany()

  const lotion = await prisma.product.create({
    data: {
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
    }
  })

  console.log('Created product:', lotion.name)
  console.log('Seeding finished.')
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
