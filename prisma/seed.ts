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
        "A rich, comforting body lotion made with Marula and Baobab botanicals to leave skin feeling soft, replenished, and beautifully cared for. The nourishing texture absorbs into the skin without leaving a heavy finish, making it an easy everyday ritual for every skin type.",
      shortDescription:
        "Nourishing Marula and Baobab body lotion for soft, hydrated skin.",
      basePrice: 300,
      images: [
        "/images/body-lotion-marula-baobab-hero.jpg",
        "/images/body-lotion-marula-baobab-detail.jpg",
      ],
      category: "Body Care",
      status: ProductStatus.ACTIVE,
      badge: "SIGNATURE FORMULATION",
      concerns: ["Deep Hydration", "Soothing & Sensitive"],
      ingredients: ["Marula", "Baobab"],
      stock: 0,
      trackInventory: true,
      sortOrder: 1,
      metaTitle: "Marula & Baobab Body Lotion | Divinity Cosmetics",
      metaDescription:
        "Shop Divinity Cosmetics Marula & Baobab Body Lotion, a nourishing South African botanical moisturiser for soft, hydrated skin.",
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
