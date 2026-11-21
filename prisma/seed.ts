import { PrismaClient, ProductStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  const product = await prisma.product.create({
    data: {
      name: "Marula & Baobab Body Lotion",
      slug: "marula-baobab-body-lotion",
      sku: "DIV-MBL-400",
      zohoItemId: "1612725000000147076",
      description:
        "A facial-grade 400ml botanical body lotion crafted in South Africa with 10% cold-pressed Limpopo Marula oil and 10% wild-harvested Mpumalanga Baobab seed oil. Designed to sink in over 2 to 3 minutes, it forms a physical 24-hour moisture seal against Highveld winters, harsh UV, and hard municipal water across a 90-day skin barrier renewal cycle.",
      shortDescription:
        "Facial-grade 400ml body lotion with 10% cold-pressed Marula & 10% Baobab oils for 24-hour hydration and 90-day barrier repair.",
      basePrice: 400,
      images: [
        "/images/marula-baobab-body-lotion.jpg",
      ],
      category: "Body Care",
      status: ProductStatus.ACTIVE,
      badge: "FLAGSHIP 400ML FORMULATION",
      concerns: [
        "24-Hour Barrier Repair",
        "Crepey & Mature Skin",
        "Highveld & Climate Protection",
        "Eliminates Midday Ashiness",
      ],
      ingredients: ["Cold-Pressed Marula Oil", "Wild-Harvested Baobab Oil"],
      stock: 25,
      trackInventory: true,
      isFeatured: true,
      sortOrder: 1,
      metaTitle: "Marula & Baobab Body Lotion (400ml)",
      metaDescription:
        "Shop Marula & Baobab Body Lotion (400ml, R400) by Divinity Cosmetics. Cold-pressed Marula & Baobab oils for 24-hour hydration and 90-day barrier repair.",
    },
  });

  console.log(`Created product: ${product.name} at R${product.basePrice}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
