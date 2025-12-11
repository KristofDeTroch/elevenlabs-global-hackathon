import { prisma } from "@/lib/prisma";

export interface CreateDebtorData {
  organizationId: string;
  type: "INDIVIDUAL" | "COMPANY";
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  taxId?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
}

/**
 * Fetch all debtors with related organization data and case count.
 */
export async function getDebtors() {
  try {
    const debtors = await prisma.debtor.findMany({
      include: {
        organization: true,
        _count: {
          select: {
            cases: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return debtors;
  } catch (error) {
    console.error("Error fetching debtors:", error);
    throw error;
  }
}

/**
 * Fetch debtors for a specific organization.
 */
export async function getDebtorsByOrganization(organizationId: string) {
  try {
    const debtors = await prisma.debtor.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return debtors;
  } catch (error) {
    console.error("Error fetching debtors by organization:", error);
    throw error;
  }
}

/**
 * Fetch a single debtor by ID with related data.
 */
export async function getDebtorById(id: string) {
  try {
    const debtor = await prisma.debtor.findUnique({
      where: { id },
      include: {
        organization: true,
        cases: {
          include: {
            payments: true,
            events: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return debtor;
  } catch (error) {
    console.error("Error fetching debtor:", error);
    throw error;
  }
}

/**
 * Create a new debtor.
 */
export async function createDebtor(data: CreateDebtorData) {
  try {
    // Validate required fields based on type
    if (data.type === "INDIVIDUAL") {
      if (!data.firstName && !data.lastName) {
        throw new Error(
          "First name or last name is required for individual debtors"
        );
      }
    } else if (data.type === "COMPANY") {
      if (!data.companyName) {
        throw new Error("Company name is required for company debtors");
      }
    }

    const debtor = await prisma.debtor.create({
      data: {
        organizationId: data.organizationId,
        type: data.type,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        companyName: data.companyName || null,
        email: data.email || null,
        phone: data.phone || null,
        taxId: data.taxId || null,
        address: data.address || null,
        city: data.city || null,
        postalCode: data.postalCode || null,
      },
    });

    return debtor;
  } catch (error) {
    console.error("Error creating debtor:", error);
    throw error;
  }
}
