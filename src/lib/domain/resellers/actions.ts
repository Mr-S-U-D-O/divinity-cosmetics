"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/security/rate-limit";

// ============================================================================
// NOTE [ZOHO ONE SUITE INTEGRATION]:
// Reseller partner applications and review pipelines will connect to Zoho CRM / Zoho Desk.
// Storefront submissions persist to database and forward as partner leads into Zoho One.
// ============================================================================

const ALLOWED_CHANNELS = [
  "Retail Store",
  "Salon/Spa",
  "Online/Social Media",
  "Direct to Network",
] as const;

const resellerApplicationSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(7, "Please enter a valid contact phone number.")
    .max(25, "Phone number must be 25 characters or fewer.")
    .regex(/^[+\d\s()-]{7,25}$/, "Please enter a valid phone number."),
  businessName: z
    .string()
    .trim()
    .min(2, "Please enter your business name or handle.")
    .max(120, "Business name must be 120 characters or fewer."),
  primaryChannel: z.enum(ALLOWED_CHANNELS, {
    message: "Please select a valid primary sales channel.",
  }),
  reason: z
    .string()
    .trim()
    .min(10, "Please share at least 10 characters about your retail channel.")
    .max(1500, "Application notes must be 1,500 characters or fewer."),
  website: z.string().max(200).optional(), // Hidden honeypot trap
});

export interface ResellerApplicationInput {
  phoneNumber: string;
  businessName: string;
  primaryChannel: string;
  reason: string;
  website?: string;
}

export async function submitResellerApplicationAction(data: ResellerApplicationInput) {
  const { userId } = await auth();
  const clerkUser = await currentUser();
  if (!userId || !clerkUser) {
    return { success: false, error: "Please sign in to apply." };
  }

  const parsed = resellerApplicationSchema.safeParse(data);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message;
    return {
      success: false,
      error: firstIssue || "Please complete all application fields validly.",
    };
  }

  // Honeypot trap: bots filling hidden fields are silently rejected
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return {
      success: false,
      error: "We could not submit your application. Please try again.",
    };
  }

  const rateLimit = await checkRateLimit(`rl:reseller:${userId}`, {
    limit: 3,
    windowMs: 60 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Too many application attempts. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`,
    };
  }

  try {
    const existing = await prisma.resellerApplication.findFirst({
      where: {
        userId,
        status: { in: ["pending", "approved"] },
      },
      select: { id: true, status: true },
    });

    if (existing) {
      return {
        success: false,
        error:
          existing.status === "approved"
            ? "Your account is already an approved Divinity Cosmetics reseller."
            : "You already have a reseller application under review.",
      };
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: { phone: parsed.data.phoneNumber },
      create: {
        id: userId,
        email:
          clerkUser.primaryEmailAddress?.emailAddress ??
          `${userId}@placeholder.invalid`,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        phone: parsed.data.phoneNumber,
      },
    });

    const application = await prisma.resellerApplication.create({
      data: {
        userId,
        phoneNumber: parsed.data.phoneNumber,
        businessName: parsed.data.businessName,
        primaryChannel: parsed.data.primaryChannel,
        reason: parsed.data.reason,
      },
    });

    // TODO [ZOHO INTEGRATION - Zoho CRM / Zoho Desk]:
    // Create new Lead or Partner Application Ticket in Zoho CRM / Zoho Desk with applicant details.

    return { success: true, applicationId: application.id };
  } catch (error) {
    console.error("Failed to submit reseller application:", error);
    return {
      success: false,
      error: "We could not submit your application. Please try again.",
    };
  }
}
