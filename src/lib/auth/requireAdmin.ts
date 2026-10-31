import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const isBootstrapAdmin = process.env.ADMIN_CLERK_USER_ID === userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!isBootstrapAdmin && user?.role !== "ADMIN") {
    redirect("/");
  }

  return userId;
}
