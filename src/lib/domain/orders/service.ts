import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function createOrder(data: {
  userId?: string | null
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  shippingAddress: any
  shippingMethod?: string
  shippingCost: number
  subtotal: number
  discountAmount?: number
  total: number
  currency?: string
  referralCode?: string | null
  customerNotes?: string | null
  items: {
    productId: string
    name: string
    price: number
    quantity: number
  }[]
}) {
  // Generate a unique order number: DIV-YYYYMMDD-XXXX
  const date = new Date()
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "")
  const randomPart = Math.floor(1000 + Math.random() * 9000)
  const orderNumber = `DIV-${datePart}-${randomPart}`

  // Ensure user exists in DB if userId is provided
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
        },
      })
    } catch (e) {
      console.error("Failed to upsert user for order", e)
      // If we fail to create the user (e.g. email conflict with guest), 
      // fallback to creating a guest order (no userId)
      data.userId = null;
    }
  }

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
      shippingCost: new Prisma.Decimal(data.shippingCost),
      subtotal: new Prisma.Decimal(data.subtotal),
      discountAmount: new Prisma.Decimal(data.discountAmount || 0),
      total: new Prisma.Decimal(data.total),
      currency: data.currency || "ZAR",
      referralCode: data.referralCode || null,
      customerNotes: data.customerNotes || null,
      status: "PENDING",
      paymentStatus: "PENDING",
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: new Prisma.Decimal(item.price),
          quantity: item.quantity,
          total: new Prisma.Decimal(item.price * item.quantity),
        })),
      },
    },
    include: {
      items: true,
    },
  })

  return order
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

export async function updateOrderStatus(id: string, status: string) {
  return prisma.order.update({
    where: { id },
    data: { status },
  })
}
