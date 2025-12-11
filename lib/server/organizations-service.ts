import { prisma } from "@/lib/prisma";
import { RoleType } from "@prisma/client";

/**
 * Get organization ID for a given user ID.
 * Fetches the user's organization via the Role table.
 * If organization doesn't exist, creates one automatically (fallback).
 */
export async function getOrganizationByUserId(
  userId: string,
  userEmail?: string,
  userName?: string | null
) {
  try {
    const role = await prisma.role.findFirst({
      where: {
        user: { id: userId },
      },
      include: {
        organization: true,
      },
    });

    if (!role || !role.organization) {
      // Fallback: create organization if it doesn't exist
      if (userEmail) {
        console.log(
          `Organization not found for user ${userId}, creating one...`
        );
        return await ensureOrganizationForUser(userId, userEmail, userName);
      }
      throw new Error("Organization not found for user");
    }

    return role.organization;
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
}

/**
 * Create or get organization for a user.
 * If organization doesn't exist, creates a new one with the user as ADMIN.
 */
export async function ensureOrganizationForUser(
  userId: string,
  userEmail: string,
  userName?: string | null
) {
  try {
    // Check if user already has an organization
    const existingRole = await prisma.role.findFirst({
      where: {
        user: { id: userId },
      },
      include: {
        organization: true,
      },
    });

    if (existingRole?.organization) {
      return existingRole.organization;
    }

    // Create user if doesn't exist
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: userEmail,
        name: userName || null,
      },
      create: {
        id: userId,
        email: userEmail,
        name: userName || null,
      },
    });

    // Create organization with user's name or email as default name
    const organizationName =
      userName || `${userEmail.split("@")[0]}'s Organization`;

    const organization = await prisma.organization.create({
      data: {
        name: organizationName,
        roles: {
          create: {
            userId: user.id,
            type: RoleType.ADMIN,
          },
        },
      },
    });

    return organization;
  } catch (error) {
    console.error("Error ensuring organization for user:", error);
    throw error;
  }
}
