import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CaseCreationStepper } from "@/components/case-creation/case-creation-stepper";
import { getOrganizationByUserId } from "@/lib/server/organizations-service";
import {
  getDebtorsByOrganization,
  createDebtor,
} from "@/lib/server/debtors-service";
import { createCase } from "@/lib/server/cases-service";
import { revalidatePath } from "next/cache";
import type { DebtorFormData } from "@/lib/validations/debtor-schema";
import type { CaseFormData } from "@/lib/validations/case-schema";

async function handleCreateDebtor(
  data: DebtorFormData & { organizationId: string }
) {
  "use server";

  try {
    const debtor = await createDebtor(data);
    return { id: debtor.id };
  } catch (error) {
    console.error("Error in handleCreateDebtor:", error);
    throw error;
  }
}

async function handleCreateCase(
  data: CaseFormData & { debtorId: string; organizationId: string }
) {
  "use server";

  try {
    await createCase(data);
    revalidatePath("/cases");
    redirect("/cases");
  } catch (error) {
    console.error("Error in handleCreateCase:", error);
    throw error;
  }
}

export default async function NewCasePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Get user info from Clerk for fallback organization creation
  const user = await currentUser();
  const userEmail = user?.emailAddresses?.[0]?.emailAddress;
  const userName =
    user?.firstName || user?.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : null;

  let organization;
  try {
    organization = await getOrganizationByUserId(userId, userEmail, userName);
  } catch (error) {
    console.error("Error fetching organization:", error);
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="text-center text-destructive">
          <h1 className="text-2xl font-semibold mb-2">Error</h1>
          <p>
            Unable to find or create your organization. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  const debtors = await getDebtorsByOrganization(organization.id);

	return (
		<div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900 min-h-screen">
			<div>
				<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
					Create New Case
				</h1>
				<p className="text-slate-600 dark:text-slate-400 mt-1">
					Follow the steps below to create a new debt collection case
				</p>
			</div>

			<CaseCreationStepper
				organizationId={organization.id}
				debtors={debtors}
				onCreateDebtor={handleCreateDebtor}
				onCreateCase={handleCreateCase}
			/>
		</div>
	)
}
