"use server"

import { revalidatePath } from "next/cache";
import { createOrder, updateOrderStatus } from "./service";
import { OrderStatus } from "@prisma/client";

export async function placeOrderAction(data: Parameters<typeof createOrder>[0]) {
  try {
    const order = await createOrder(data);
    return { success: true, orderNumber: order.orderNumber };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to place order. Please try again." };
  }
}

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  try {
    await updateOrderStatus(id, status);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update status." };
  }
}
