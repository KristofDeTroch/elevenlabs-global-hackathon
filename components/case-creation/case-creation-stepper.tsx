'use client'

import { useState } from 'react'
import { DebtorChoiceStep } from './debtor-choice-step'
import { DebtorCreationStep } from './debtor-creation-step'
import { DebtorSelectionStep } from './debtor-selection-step'
import { CaseCreationStep } from './case-creation-step'
import { Card, CardContent } from '@/components/ui/card'
import { Users, CheckCircle2, FileText } from 'lucide-react'
import type { DebtorFormData } from '@/lib/validations/debtor-schema'
import type { CaseFormData } from '@/lib/validations/case-schema'

interface Debtor {
  id: string;
  type: string;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  email: string | null;
  phone: string | null;
}

interface CaseCreationStepperProps {
  organizationId: string;
  debtors: Debtor[];
  onCreateDebtor: (
    data: DebtorFormData & { organizationId: string }
  ) => Promise<{ id: string }>;
  onCreateCase: (
    data: CaseFormData & { debtorId: string; organizationId: string }
  ) => Promise<void>;
}

type Step = "choice" | "debtor-create" | "debtor-select" | "case-create";

function getDebtorName(debtor: Debtor) {
  if (debtor.type === "COMPANY") {
    return debtor.companyName || "Unknown Company";
  }
  return (
    `${debtor.firstName || ""} ${debtor.lastName || ""}`.trim() || "Unknown"
  );
}

export function CaseCreationStepper({
  organizationId,
  debtors,
  onCreateDebtor,
  onCreateCase,
}: CaseCreationStepperProps) {
  const [currentStep, setCurrentStep] = useState<Step>("choice");
  const [selectedChoice, setSelectedChoice] = useState<
    "new" | "existing" | null
  >(null);
  const [selectedDebtorId, setSelectedDebtorId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDebtorChoice = (choice: "new" | "existing") => {
    setSelectedChoice(choice);
    if (choice === "new") {
      setCurrentStep("debtor-create");
    } else {
      setCurrentStep("debtor-select");
    }
  };

  const handleDebtorCreate = async (data: DebtorFormData) => {
    setIsSubmitting(true);
    try {
      const result = await onCreateDebtor({
        ...data,
        organizationId,
      });
      setSelectedDebtorId(result.id);
      setCurrentStep("case-create");
    } catch (error) {
      console.error("Error creating debtor:", error);
      // Error will be handled by the form component
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDebtorSelect = (debtorId: string) => {
    setSelectedDebtorId(debtorId);
    setCurrentStep("case-create");
  };

  const handleCaseCreate = async (
    data: CaseFormData & { debtorId: string }
  ) => {
    setIsSubmitting(true);
    try {
      await onCreateCase({
        ...data,
        organizationId,
      });
    } catch (error) {
      console.error("Error creating case:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === "debtor-create" || currentStep === "debtor-select") {
      setCurrentStep("choice");
      setSelectedChoice(null);
      setSelectedDebtorId(null);
    } else if (currentStep === "case-create") {
      if (selectedChoice === "new") {
        setCurrentStep("debtor-create");
      } else {
        setCurrentStep("debtor-select");
      }
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case "choice":
        return 1;
      case "debtor-create":
      case "debtor-select":
        return 2;
      case "case-create":
        return 3;
      default:
        return 1;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "choice":
        return "Choose Debtor";
      case "debtor-create":
        return "Create Debtor";
      case "debtor-select":
        return "Select Debtor";
      case "case-create":
        return "Create Case";
      default:
        return "";
    }
  };

  const selectedDebtor = selectedDebtorId
    ? debtors.find((d) => d.id === selectedDebtorId)
    : null;

	return (
		<div className="flex flex-col gap-6">
			{/* Progress Indicator */}
			<Card className="border-2 shadow-lg bg-gradient-to-r from-white to-blue-50 dark:from-slate-900 dark:to-slate-800">
				<CardContent className="pt-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div
								className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
									getStepNumber() >= 1
										? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110'
										: 'bg-slate-200 dark:bg-slate-700 text-slate-500'
								}`}
							>
								{getStepNumber() > 1 ? (
									<CheckCircle2 className="h-5 w-5" />
								) : (
									<Users className="h-5 w-5" />
								)}
							</div>
							<span
								className={`font-medium transition-all ${
									getStepNumber() >= 1
										? 'text-slate-900 dark:text-white'
										: 'text-slate-500'
								}`}
							>
								Choose Debtor
							</span>
						</div>
						<div className="h-0.5 flex-1 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800 mx-4" />
						<div className="flex items-center gap-3">
							<div
								className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
									getStepNumber() >= 2
										? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110'
										: 'bg-slate-200 dark:bg-slate-700 text-slate-500'
								}`}
							>
								{getStepNumber() > 2 ? (
									<CheckCircle2 className="h-5 w-5" />
								) : (
									<span className="text-sm font-bold">2</span>
								)}
							</div>
							<span
								className={`font-medium transition-all ${
									getStepNumber() >= 2
										? 'text-slate-900 dark:text-white'
										: 'text-slate-500'
								}`}
							>
								{selectedChoice === 'new' ? 'Create Debtor' : 'Select Debtor'}
							</span>
						</div>
						<div className="h-0.5 flex-1 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800 mx-4" />
						<div className="flex items-center gap-3">
							<div
								className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
									getStepNumber() >= 3
										? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110'
										: 'bg-slate-200 dark:bg-slate-700 text-slate-500'
								}`}
							>
								<FileText className="h-5 w-5" />
							</div>
							<span
								className={`font-medium transition-all ${
									getStepNumber() >= 3
										? 'text-slate-900 dark:text-white'
										: 'text-slate-500'
								}`}
							>
								Create Case
							</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Step Content */}
			<Card className="border-2 shadow-lg">
				<CardContent className="pt-6">
					{currentStep === 'choice' && (
						<DebtorChoiceStep
							onSelect={handleDebtorChoice}
							selectedChoice={selectedChoice}
						/>
					)}

					{currentStep === 'debtor-create' && (
						<DebtorCreationStep
							onSubmit={handleDebtorCreate}
							onBack={handleBack}
							isSubmitting={isSubmitting}
						/>
					)}

					{currentStep === 'debtor-select' && (
						<DebtorSelectionStep
							debtors={debtors}
							onSelect={handleDebtorSelect}
							onBack={handleBack}
							selectedDebtorId={selectedDebtorId}
						/>
					)}

					{currentStep === 'case-create' && selectedDebtor && (
						<CaseCreationStep
							debtorId={selectedDebtor.id}
							debtorName={getDebtorName(selectedDebtor)}
							onSubmit={handleCaseCreate}
							onBack={handleBack}
							isSubmitting={isSubmitting}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
