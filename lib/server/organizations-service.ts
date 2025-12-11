import { prisma } from "@/lib/prisma";

/**
 * Get organization ID for a given user ID.
 * Fetches the user's organization via the Role table.
 */
export async function getOrganizationByUserId(userId: string) {
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
      throw new Error("Organization not found for user");
    }

    return role.organization;
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
}
