"use server"

import { createOrder } from "./service"

export async function placeOrderAction(data: Parameters<typeof createOrder>[0]) {
  try {
    const order = await createOrder(data);
    return { success: true, orderNumber: order.orderNumber };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to place order. Please try again." };
  }
}
