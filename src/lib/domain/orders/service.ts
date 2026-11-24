import { prisma } from "@/lib/prisma";
import { Prisma, OrderStatus } from "@prisma/client";
import { syncPaidOrderToZoho } from "@/lib/domain/zoho/service";
import { siteConfig } from "@/lib/config/site";
import { resolveServiceLevelCode } from "@/lib/domain/shipping/courierguy";
import { fetchShiplogicRates } from "@/lib/domain/shipping/rates";
import {
  computeParcelWeightKg,
  normalizeDestinationParams,
  parseOrderShippingAddress,
  verifyShippingQuoteToken,
} from "@/lib/domain/shipping/quote";

export const STANDARD_SHIPPING_COST = siteConfig.standardShippingCost;

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
  shippingServiceCode?: string;
  shippingQuoteToken?: string;
  referralCode?: string | null;
  customerNotes?: string | null;
  currency?: string;
  items: CreateOrderItemInput[];
  // Optional client fields (ignored by server in favor of server calculation)
  /** @deprecated Ignored by server — shipping is strictly verified/recalculated server-side. */
  shippingCost?: number;
  subtotal?: number;
  discountAmount?: number;
  total?: number;
}

export async function resolveAuthoritativeShipping(params: {
  shippingAddress: ReturnType<typeof parseOrderShippingAddress>;
  shippingMethod?: string;
  shippingServiceCode?: string;
  shippingQuoteToken?: string;
  totalItemCount: number;
}): Promise<{
  shippingCost: number;
  shippingMethod: string;
  serviceLevelCode: string;
  source: "signed_quote" | "server_recalculated";
}> {
  const weightInKg = computeParcelWeightKg(params.totalItemCount);
  const destination = normalizeDestinationParams(params.shippingAddress);
  const requestedCode = (
    params.shippingServiceCode?.trim() ||
    resolveServiceLevelCode(params.shippingMethod, "ECO")
  ).toUpperCase();

  // 1. Fast path: verify stateless HMAC-signed quote token matching destination, weight, and service code
  if (params.shippingQuoteToken) {
    const verifiedQuote = verifyShippingQuoteToken(params.shippingQuoteToken, {
      serviceLevelCode: requestedCode,
      destination,
      weightInKg,
    });

    if (verifiedQuote) {
      return {
        shippingCost: verifiedQuote.rate,
        shippingMethod: `${verifiedQuote.name} (${verifiedQuote.code})`,
        serviceLevelCode: verifiedQuote.code,
        source: "signed_quote",
      };
    }
  }

  // 2. Authoritative fallback: recalculate live/regional rates strictly on the server
  const serverRates = await fetchShiplogicRates({
    suburb: destination.suburb,
    city: destination.city,
    province: destination.province,
    postalCode: destination.postalCode,
    weightInKg,
  });

  const matchedOption = serverRates.find(
    (opt) => opt.code.toUpperCase() === requestedCode
  );

  if (!matchedOption) {
    throw new Error(
      `The selected shipping option (${requestedCode}) is not available for ${destination.province} (${destination.postalCode}). Please select an available delivery option.`
    );
  }

  if (!Number.isFinite(matchedOption.rate) || matchedOption.rate <= 0) {
    throw new Error(
      `Unable to verify a valid shipping rate for ${requestedCode}. Please try again.`
    );
  }

  return {
    shippingCost: Math.round(matchedOption.rate * 100) / 100,
    shippingMethod: `${matchedOption.name} (${matchedOption.code})`,
    serviceLevelCode: matchedOption.code.toUpperCase(),
    source: "server_recalculated",
  };
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

  // Validate delivery address early before touching DB/payment
  const parsedShippingAddress = parseOrderShippingAddress(data.shippingAddress);

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
      const displayName = item.name ? `"${item.name}"` : `Product with ID '${item.productId}'`;
      throw new Error(
        `${displayName} is no longer available in the store catalog. Please remove it from your cart to continue.`
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

  // 4. Server-authoritative shipping cost & service level verification
  // Client-supplied shippingCost is always ignored.
  const totalItemCount = verifiedOrderItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const authoritativeShipping = await resolveAuthoritativeShipping({
    shippingAddress: parsedShippingAddress,
    shippingMethod: data.shippingMethod,
    shippingServiceCode: data.shippingServiceCode,
    shippingQuoteToken: data.shippingQuoteToken,
    totalItemCount,
  });
  const serverShippingCost = authoritativeShipping.shippingCost;
  const serverShippingMethod = authoritativeShipping.shippingMethod;

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

  console.log(`[💾 DATABASE] Initializing new order: ${orderNumber}`);
  console.log(`   ├─ Customer: ${data.firstName} ${data.lastName} (${data.email})`);
  console.log(`   ├─ Items (${verifiedOrderItems.length}): ${verifiedOrderItems.map((i) => `${i.quantity}x ${i.name}`).join(", ")}`);
  console.log(`   ├─ Subtotal: R${serverSubtotal.toFixed(2)}`);
  console.log(
    `   ├─ Shipping: R${serverShippingCost.toFixed(2)} [${serverShippingMethod}] (${authoritativeShipping.source})`
  );
  console.log(`   └─ Authoritative Total: R${serverTotal.toFixed(2)}`);

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
      shippingAddress: parsedShippingAddress,
      shippingMethod: serverShippingMethod,
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
    include: {
      items: {
        include: {
          product: {
            select: {
              images: true,
              slug: true,
              category: true,
            },
          },
        },
      },
    },
  });
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
  let wasAlreadyPaid = false;
  console.log(`[💳 PAYMENT VERIFIED] Processing paid order: ${orderNumber} (Ref: ${paymentDetails.paymentId})`);

  const paidOrder = await prisma.$transaction(async (tx) => {
    // Atomic conditional claim prevents double stock deduction / double Zoho sync
    // if webhook and /checkout/verify execute concurrently under READ COMMITTED.
    const claim = await tx.order.updateMany({
      where: {
        orderNumber,
        paymentStatus: { not: "PAID" },
      },
      data: {
        paymentStatus: "PAID",
        status: "PROCESSING",
        paymentId: paymentDetails.paymentId,
        paymentMethod: paymentDetails.paymentMethod || "Paystack",
      },
    });

    const order = await tx.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) {
      throw new Error(`Order with number ${orderNumber} not found.`);
    }

    if (claim.count === 0) {
      console.log(`[💳 PAYMENT IDEMPOTENCY] Order ${orderNumber} is already PAID. Skipping duplicate processing.`);
      wasAlreadyPaid = true;
      return order;
    }

    // Safely decrement inventory stock for tracked products (executed exactly once)
    console.log(`[💾 DATABASE] Deducting inventory stock for ${order.items.length} items...`);
    for (const item of order.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        select: { id: true, name: true, trackInventory: true, stock: true },
      });

      if (product && product.trackInventory) {
        const newStock = product.stock - item.quantity;
        console.log(`   └─ ${product.name}: stock ${product.stock} -> ${newStock} (-${item.quantity})`);
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

    console.log(`[💾 DATABASE] Order ${orderNumber} transitioned to PAID / PROCESSING.`);
    return order;
  });

  // Phase 1 Automation: Push verified paid order to Zoho Books & Zoho Inventory
  if (!wasAlreadyPaid) {
    console.log(`[💼 ZOHO PIPELINE] Triggering Phase 1: Pushing ${orderNumber} to Zoho Books & Inventory...`);
    try {
      const syncResult = await syncPaidOrderToZoho(orderNumber);
      if (syncResult.success) {
        console.log(`[💼 ZOHO PIPELINE] Success: ${orderNumber} synced. Sales Order: ${syncResult.salesOrderId}, Invoice: ${syncResult.invoiceId}`);
      } else if (syncResult.skipped) {
        console.log(`[💼 ZOHO PIPELINE] Skipped for ${orderNumber} (${syncResult.reason || "already synced or unconfigured"}).`);
      }
    } catch (zohoErr) {
      console.error(`[💼 ZOHO PIPELINE ERROR] Non-blocking sync error for order ${orderNumber}:`, zohoErr);
    }
  }

  return paidOrder;
}

export interface SettlementAmountCheckInput {
  orderTotal: number | Prisma.Decimal;
  orderCurrency?: string | null;
  paidAmountInCents: number;
  paidCurrency?: string | null;
}

export type SettlementAmountCheckResult =
  | { valid: true; expectedCents: number; expectedCurrency: string }
  | {
      valid: false;
      code: "CURRENCY_MISMATCH" | "AMOUNT_MISMATCH";
      reason: string;
    };

/**
 * Pure validator enforcing exact integer-cent equality (orderTotal * 100 === paidAmountInCents)
 * and explicit currency equality with zero fallback defaults on the gateway payload.
 */
export function validateOrderSettlementAmount(
  input: SettlementAmountCheckInput
): SettlementAmountCheckResult {
  const expectedCurrency = (input.orderCurrency || "ZAR").trim().toUpperCase();
  const paidCurrency =
    typeof input.paidCurrency === "string"
      ? input.paidCurrency.trim().toUpperCase()
      : "";

  if (!paidCurrency || paidCurrency !== expectedCurrency) {
    return {
      valid: false,
      code: "CURRENCY_MISMATCH",
      reason: `Currency mismatch: expected ${expectedCurrency}, received ${paidCurrency || "MISSING"}.`,
    };
  }

  const expectedCents = Math.round(Number(input.orderTotal) * 100);
  const paidCents = Number(input.paidAmountInCents);

  if (
    !Number.isInteger(expectedCents) ||
    expectedCents <= 0 ||
    !Number.isInteger(paidCents) ||
    paidCents !== expectedCents
  ) {
    return {
      valid: false,
      code: "AMOUNT_MISMATCH",
      reason: `Amount mismatch: expected exactly ${expectedCents} cents (${expectedCurrency}), received ${paidCents} cents (${paidCurrency}).`,
    };
  }

  return { valid: true, expectedCents, expectedCurrency };
}

export interface VerifyAndSettlePaymentInput {
  orderNumber: string;
  paymentReference: string;
  status: string;
  amountInCents: number;
  currency?: string | null;
  channel?: string | null;
  gatewayResponse?: string | null;
}

export type VerifyAndSettlePaymentResult =
  | {
      settled: true;
      alreadyPaid: boolean;
      orderNumber: string;
      orderId: string;
    }
  | {
      settled: false;
      code:
        | "INVALID_INPUT"
        | "ORDER_NOT_FOUND"
        | "REFERENCE_MISMATCH"
        | "PAYMENT_FAILED"
        | "CURRENCY_MISMATCH"
        | "AMOUNT_MISMATCH";
      reason: string;
    };

/**
 * Canonical payment settlement gate shared by both the Paystack webhook and
 * verifyPaymentAction. Guarantees exact integer-cent and ZAR currency matching.
 */
export async function verifyAndSettleOrderPayment(
  input: VerifyAndSettlePaymentInput
): Promise<VerifyAndSettlePaymentResult> {
  const cleanOrderNumber =
    typeof input.orderNumber === "string" ? input.orderNumber.trim() : "";
  const cleanReference =
    typeof input.paymentReference === "string"
      ? input.paymentReference.trim()
      : "";

  if (!cleanOrderNumber || !cleanReference) {
    return {
      settled: false,
      code: "INVALID_INPUT",
      reason: "Missing order number or Paystack payment reference.",
    };
  }

  const existingOrder = await prisma.order.findUnique({
    where: { orderNumber: cleanOrderNumber },
  });

  if (!existingOrder) {
    return {
      settled: false,
      code: "ORDER_NOT_FOUND",
      reason: `No order found for orderNumber=${cleanOrderNumber}.`,
    };
  }

  if (cleanReference !== existingOrder.orderNumber) {
    const reason = `Payment reference mismatch: expected ${existingOrder.orderNumber}, received ${cleanReference}.`;
    await markOrderPaymentFailed(existingOrder.orderNumber, reason);
    return {
      settled: false,
      code: "REFERENCE_MISMATCH",
      reason,
    };
  }

  if (input.status !== "success") {
    const reason = input.gatewayResponse || `Paystack status was "${input.status}".`;
    await markOrderPaymentFailed(existingOrder.orderNumber, reason);
    return {
      settled: false,
      code: "PAYMENT_FAILED",
      reason,
    };
  }

  const amountCheck = validateOrderSettlementAmount({
    orderTotal: existingOrder.total,
    orderCurrency: existingOrder.currency,
    paidAmountInCents: input.amountInCents,
    paidCurrency: input.currency,
  });

  if (!amountCheck.valid) {
    console.error(
      `[💳 PAYSTACK SETTLEMENT SECURITY] ${amountCheck.reason} (Order ${existingOrder.orderNumber}, Ref ${cleanReference})`
    );
    await markOrderPaymentFailed(existingOrder.orderNumber, amountCheck.reason);
    return {
      settled: false,
      code: amountCheck.code,
      reason: amountCheck.reason,
    };
  }

  if (existingOrder.paymentStatus === "PAID") {
    return {
      settled: true,
      alreadyPaid: true,
      orderNumber: existingOrder.orderNumber,
      orderId: existingOrder.id,
    };
  }

  const paidOrder = await markOrderAsPaid(existingOrder.orderNumber, {
    paymentId: cleanReference,
    paymentMethod: input.channel
      ? `Paystack (${input.channel.toUpperCase()})`
      : "Paystack",
  });

  return {
    settled: true,
    alreadyPaid: false,
    orderNumber: paidOrder.orderNumber,
    orderId: paidOrder.id,
  };
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
