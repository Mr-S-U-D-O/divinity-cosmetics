"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// ============================================================================
// NOTE [ZOHO ONE SUITE INTEGRATION]:
// Reseller partner applications and review pipelines will connect to Zoho CRM / Zoho Desk.
// Storefront submissions persist to database and forward as partner leads into Zoho One.
// ============================================================================

export interface ResellerApplicationInput {
  phoneNumber: string;
  businessName: string;
  primaryChannel: string;
  reason: string;
}

export async function submitResellerApplicationAction(data: ResellerApplicationInput) {
  const { userId } = await auth();
  const clerkUser = await currentUser();
  if (!userId || !clerkUser) return { success: false, error: "Please sign in to apply." };

  const values = Object.values(data);
  if (values.some((value) => !value.trim())) {
    return { success: false, error: "Please complete all application fields." };
  }

  try {
    await prisma.user.upsert({
      where: { id: userId },
      update: { phone: data.phoneNumber },
      create: {
        id: userId,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? `${userId}@placeholder.invalid`,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        phone: data.phoneNumber,
      },
    });

    const application = await prisma.resellerApplication.create({
      data: { userId, ...data },
    });

    // TODO [ZOHO INTEGRATION - Zoho CRM / Zoho Desk]:
    // Create new Lead or Partner Application Ticket in Zoho CRM / Zoho Desk with applicant details.

    return { success: true, applicationId: application.id };
  } catch (error) {
    console.error("Failed to submit reseller application:", error);
    return { success: false, error: "We could not submit your application. Please try again." };
  }
}

export async function updateResellerApplicationStatusAction(
  id: string,
  status: "approved" | "rejected" | "pending",
  formData: FormData,
) {
  // TODO [ZOHO INTEGRATION - Zoho CRM]:
  // Reseller approval/rejection workflows will be handled in Zoho CRM.
  const reviewNotes = formData.get("reviewNotes");
  const notes = typeof reviewNotes === "string" ? reviewNotes : undefined;

  try {
    const application = await prisma.resellerApplication.update({
      where: { id },
      data: { status, reviewNotes: notes?.trim() || null },
    });

    if (status === "approved") {
      await prisma.resellerProfile.upsert({
        where: { userId: application.userId },
        update: { status: "approved" },
        create: {
          userId: application.userId,
          status: "approved",
          referralCode: `DIV-${application.userId.slice(-8).toUpperCase()}`,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to update reseller application:", error);
    throw new Error("Could not update this application.");
  }
}
