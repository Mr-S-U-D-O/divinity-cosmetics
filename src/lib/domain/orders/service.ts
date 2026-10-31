import { prisma } from "@/lib/prisma"
import { Prisma, OrderStatus } from "@prisma/client"

export const STANDARD_SHIPPING_COST = 100.0;

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
  // Optional client fields (ignored by server in favor of DB truth)
  name?: string;
  price?: number;
}

export interface CreateOrderInput {
  userId?: string | null;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  shippingAddress: any;
  shippingMethod?: string;
  referralCode?: string | null;
  customerNotes?: string | null;
  currency?: string;
  items: CreateOrderItemInput[];
  // Optional client fields (ignored by server in favor of server calculation)
  shippingCost?: number;
  subtotal?: number;
  discountAmount?: number;
  total?: number;
}

export async function createOrder(data: CreateOrderInput) {
  // 1. Validate items
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("Order must contain at least one item.");
  }

  // Validate quantities
  for (const item of data.items) {
    if (!item.productId || typeof item.productId !== "string") {
      throw new Error("Invalid product item in order.");
    }
    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      throw new Error(`Invalid quantity (${item.quantity}) for product.`);
    }
  }

  // 2. Fetch authoritative products directly from the database
  const productIds = Array.from(new Set(data.items.map((i) => i.productId)));
  const dbProducts = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      status: "ACTIVE",
    },
  });

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  let serverSubtotal = 0;
  const verifiedOrderItems: {
    productId: string;
    name: string;
    price: Prisma.Decimal;
    quantity: number;
    total: Prisma.Decimal;
  }[] = [];

  // 3. Recalculate line items using database prices
  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error(
        `Product with ID '${item.productId}' is not available or does not exist.`
      );
    }

    const qty = Math.floor(Number(item.quantity));
    if (product.trackInventory && product.stock < qty) {
      throw new Error(
        `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${qty}.`
      );
    }

    const unitPrice = Number(product.basePrice);
    const lineTotal = unitPrice * qty;
    serverSubtotal += lineTotal;

    verifiedOrderItems.push({
      productId: product.id,
      name: product.name, // Server-authoritative name
      price: product.basePrice, // Server-authoritative price from DB
      quantity: qty,
      total: new Prisma.Decimal(lineTotal),
    });
  }

  // 4. Server-authoritative shipping cost
  const serverShippingCost = STANDARD_SHIPPING_COST;

  // 5. Server-authoritative referral verification
  let serverDiscountAmount = 0;
  let verifiedReferralCode: string | null = null;

  if (data.referralCode && typeof data.referralCode === "string") {
    const trimmedCode = data.referralCode.trim();
    if (trimmedCode) {
      const reseller = await prisma.resellerProfile.findUnique({
        where: { referralCode: trimmedCode },
      });
      if (reseller && reseller.status === "approved") {
        verifiedReferralCode = reseller.referralCode;
      }
    }
  }

  // 6. Final server-calculated total
  const serverTotal = Math.max(
    0,
    serverSubtotal + serverShippingCost - serverDiscountAmount
  );

  // 7. Generate a unique order number: DIV-YYYYMMDD-XXXX
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `DIV-${datePart}-${randomPart}`;

  // 8. Ensure user exists in DB if userId is provided
  if (data.userId) {
    try {
      await prisma.user.upsert({
        where: { id: data.userId },
        update: {},
        create: {
          id: data.userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || null,
        },
      });
    } catch (e) {
      console.error("Failed to upsert user for order", e);
      data.userId = null;
    }
  }

  // 9. Persist order with strictly server-verified values
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: data.userId || null,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      shippingAddress: data.shippingAddress,
      shippingMethod: data.shippingMethod || "Standard",
      shippingCost: new Prisma.Decimal(serverShippingCost),
      subtotal: new Prisma.Decimal(serverSubtotal),
      discountAmount: new Prisma.Decimal(serverDiscountAmount),
      total: new Prisma.Decimal(serverTotal),
      currency: "ZAR",
      referralCode: verifiedReferralCode,
      customerNotes: data.customerNotes || null,
      status: "PENDING",
      paymentStatus: "PENDING",
      items: {
        create: verifiedOrderItems,
      },
    },
    include: {
      items: true,
    },
  });

  return order;
}


export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  })
}

export async function getAllOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: true,
    },
  })
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.order.update({
    where: { id },
    data: { status },
  })
}

export async function markOrderAsPaid(
  orderNumber: string,
  paymentDetails: {
    paymentId: string;
    paymentMethod?: string;
  }
) {
  return prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!existingOrder) {
      throw new Error(`Order with number ${orderNumber} not found.`);
    }

    // Idempotency: if already paid, return early
    if (existingOrder.paymentStatus === "PAID") {
      return existingOrder;
    }

    // Safely decrement inventory stock for tracked products
    for (const item of existingOrder.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        select: { id: true, trackInventory: true, stock: true },
      });

      if (product && product.trackInventory) {
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    return tx.order.update({
      where: { orderNumber },
      data: {
        paymentStatus: "PAID",
        status: "PROCESSING",
        paymentId: paymentDetails.paymentId,
        paymentMethod: paymentDetails.paymentMethod || "Paystack",
      },
      include: {
        items: true,
      },
    });
  });
}


export async function markOrderPaymentFailed(
  orderNumber: string,
  reason?: string
) {
  const existingOrder = await prisma.order.findUnique({
    where: { orderNumber },
  });

  if (!existingOrder) return null;

  if (existingOrder.paymentStatus === "PAID") {
    return existingOrder;
  }

  return prisma.order.update({
    where: { orderNumber },
    data: {
      paymentStatus: "FAILED",
      internalNotes: reason
        ? `Payment attempt failed: ${reason}`
        : existingOrder.internalNotes,
    },
  });
}
