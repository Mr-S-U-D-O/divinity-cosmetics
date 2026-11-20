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
      description:
        "A facial-grade botanical body treatment formulated with high concentrations of cold-pressed South African Marula and wild-harvested Baobab seed oils. Unlike watery supermarket pump lotions that evaporate in five seconds, this nutrient-dense emulsion takes a few minutes to sink in—forming a physical 24-hour seal against Highveld winters, harsh UV, hard municipal water, and coastal humidity shifts. Applied consistently over a 90-day cycle, it rebuilds a thinning moisture barrier, eliminates midday ashiness, and softens crepey texture on arms, legs, and décolletage.",
      shortDescription:
        "Facial-grade 400ml body lotion with cold-pressed Marula & Baobab oils for 24-hour hydration and 90-day barrier repair.",
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
      metaTitle:
        "Marula & Baobab Body Lotion (400ml) | Facial-Grade Barrier Repair | Divinity Cosmetics",
      metaDescription:
        "Replace watery supermarket lotions with Divinity Cosmetics Marula & Baobab Body Lotion (400ml, R400). Cold-pressed African botanical oils for 24-hour hydration and 90-day barrier repair.",
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
