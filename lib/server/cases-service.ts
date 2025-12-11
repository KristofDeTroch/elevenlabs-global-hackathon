import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";

export interface CreateCaseData {
  organizationId: string;
  debtorId: string;
  originalAmount: number | string;
  currentBalance: number | string;
  interestRate?: number | string | null;
  externalReference?: string | null;
  dueDate?: Date | string | null;
  lastContactDate?: Date | string | null;
  nextActionDate?: Date | string | null;
  details?: Record<string, unknown> | null;
}

/**
 * Fetch all cases with related debtor and organization data.
 */
export async function getCases() {
  try {
    const cases = await prisma.case.findMany({
      include: {
        debtor: true,
        organization: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return cases;
  } catch (error) {
    console.error("Error fetching cases:", error);
    throw error;
  }
}

/**
 * Fetch a single case by ID with related data.
 */
export async function getCaseById(id: string) {
  try {
    const caseData = await prisma.case.findUnique({
      where: { id },
      include: {
        debtor: true,
        organization: true,
        payments: true,
        events: {
          include: {
            role: {
              include: {
                user: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return caseData;
  } catch (error) {
    console.error("Error fetching case:", error);
    throw error;
  }
}

/**
 * Create a new case.
 */
export async function createCase(data: CreateCaseData) {
  try {
    // Validate debtor exists and belongs to organization
    const debtor = await prisma.debtor.findUnique({
      where: { id: data.debtorId },
    });

    if (!debtor) {
      throw new Error("Debtor not found");
    }

    if (debtor.organizationId !== data.organizationId) {
      throw new Error("Debtor does not belong to the specified organization");
    }

    // Convert amounts to Decimal
    const originalAmount = new Decimal(data.originalAmount);
    const currentBalance = new Decimal(data.currentBalance);
    const interestRate = data.interestRate
      ? new Decimal(data.interestRate)
      : new Decimal(0);

    // Ensure currentBalance equals originalAmount initially
    if (!currentBalance.equals(originalAmount)) {
      throw new Error(
        "Current balance must equal original amount for new cases"
      );
    }

    // Parse dates
    const dueDate = data.dueDate ? new Date(data.dueDate) : null;
    const lastContactDate = data.lastContactDate
      ? new Date(data.lastContactDate)
      : null;
    const nextActionDate = data.nextActionDate
      ? new Date(data.nextActionDate)
      : null;

    const caseData = await prisma.case.create({
      data: {
        organizationId: data.organizationId,
        debtorId: data.debtorId,
        status: "NEW",
        originalAmount,
        currentBalance,
        interestRate,
        externalReference: data.externalReference || null,
        dueDate,
        lastContactDate,
        nextActionDate,
        details: data.details ? JSON.stringify(data.details) : Prisma.JsonNull,
      },
    });

    return caseData;
  } catch (error) {
    console.error("Error creating case:", error);
    throw error;
  }
}
